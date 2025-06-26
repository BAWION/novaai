import { Router } from "express";
import { storage } from "../storage";
import { SkillGapsData, SkillMapData, SkillWithInfo } from "@shared/schema";

const router = Router();

/**
 * GET /api/skills/map
 * Получение карты навыков пользователя с группировкой по категориям
 */
router.get("/map", async (req, res) => {
  try {
    // Проверка авторизации
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    const userId = req.user.id;
    
    // Получение всех навыков
    const allSkills = await storage.getAllSkills();
    
    // Получение навыков пользователя
    const userSkills = await storage.getUserSkills(userId);
    
    // Получение пробелов пользователя
    const userGaps = await storage.getUserSkillGaps(userId);
    
    // Группировка навыков по категориям
    const categoriesMap = new Map<string, {
      id: string;
      name: string;
      skills: SkillWithInfo[];
      overallProgress: number;
    }>();
    
    // Категории для навыков
    const categoryLabels: Record<string, string> = {
      "ml-basics": "Основы ML",
      "deep-learning": "Глубокое обучение",
      "data-science": "Data Science",
      "computer-vision": "Компьютерное зрение",
      "nlp": "Обработка языка",
      "reinforcement-learning": "Обучение с подкреплением",
      "math": "Математика",
      "programming": "Программирование",
      "deployment": "Развертывание",
    };
    
    // Обогащение данных о навыках информацией о прогрессе пользователя
    const enhancedSkills: SkillWithInfo[] = allSkills.map(skill => {
      // Поиск навыка пользователя
      const userSkill = userSkills.find(us => us.skillId === skill.id);
      
      // Поиск пробела в навыке
      const userGap = userGaps.find(gap => gap.skillId === skill.id);
      
      // Создание обогащенного объекта навыка
      const enhancedSkill: SkillWithInfo = {
        ...skill,
        userLevel: userSkill?.level || 0,
        targetLevel: userSkill?.targetLevel || 0,
        gapSize: userGap?.gapSize || 0,
        isLearning: userSkill ? userSkill.level > 0 && userSkill.level < 80 : false,
        lastPracticed: userSkill?.lastPracticed ? new Date(userSkill.lastPracticed) : undefined,
        categoryName: categoryLabels[skill.category] || skill.category,
      };
      
      // Группировка по категориям
      if (!categoriesMap.has(skill.category)) {
        categoriesMap.set(skill.category, {
          id: skill.category,
          name: categoryLabels[skill.category] || skill.category,
          skills: [],
          overallProgress: 0
        });
      }
      
      categoriesMap.get(skill.category)!.skills.push(enhancedSkill);
      
      return enhancedSkill;
    });
    
    // Вычисление общего прогресса по категориям
    for (const category of categoriesMap.values()) {
      const totalSkills = category.skills.length;
      const totalProgress = category.skills.reduce((sum, skill) => sum + (skill.userLevel || 0), 0);
      category.overallProgress = Math.round(totalProgress / (totalSkills * 100) * 100) || 0;
    }
    
    // Подсчет общей статистики
    const learningSkills = enhancedSkills.filter(skill => skill.isLearning).length;
    const masteredSkills = enhancedSkills.filter(skill => (skill.userLevel || 0) >= 80).length;
    const gapCount = userGaps.length;
    
    // Вычисление общего прогресса
    const totalSkills = enhancedSkills.length;
    const totalProgress = enhancedSkills.reduce((sum, skill) => sum + (skill.userLevel || 0), 0);
    const overallProgress = Math.round(totalProgress / (totalSkills * 100) * 100) || 0;
    
    // Формирование итогового ответа
    const response: SkillMapData = {
      categories: Array.from(categoriesMap.values()),
      overallProgress,
      learningSkills,
      masteredSkills,
      gapCount
    };
    
    res.json(response);
  } catch (error) {
    console.error("Error fetching skill map:", error);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET /api/skills/gaps
 * Получение пробелов в навыках пользователя
 */
router.get("/gaps", async (req, res) => {
  try {
    // Проверка авторизации
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    const userId = req.user.id;
    
    // Получение пробелов пользователя
    const userGaps = await storage.getUserSkillGaps(userId);
    
    // Если пробелов нет
    if (!userGaps || userGaps.length === 0) {
      return res.json({
        gaps: [],
        priorityHigh: 0,
        priorityMedium: 0,
        priorityLow: 0,
        totalGaps: 0
      });
    }
    
    // Получение информации о навыках
    const gapsWithSkills = await Promise.all(
      userGaps.map(async (gap) => {
        const skill = await storage.getSkill(gap.skillId);
        
        // Получаем дополнительную информацию о навыке
        const userSkill = await storage.getUserSkillByName(userId, skill?.name || "");
        
        // Категории для навыков
        const categoryLabels: Record<string, string> = {
          "ml-basics": "Основы ML",
          "deep-learning": "Глубокое обучение",
          "data-science": "Data Science",
          "computer-vision": "Компьютерное зрение",
          "nlp": "Обработка языка",
          "reinforcement-learning": "Обучение с подкреплением",
          "math": "Математика",
          "programming": "Программирование",
          "deployment": "Развертывание",
        };
        
        // Обогащаем объект навыка
        const enhancedSkill: SkillWithInfo = {
          ...skill!,
          userLevel: userSkill?.level || 0,
          targetLevel: userSkill?.targetLevel || 0,
          lastPracticed: userSkill?.lastPracticed ? new Date(userSkill.lastPracticed) : undefined,
          categoryName: skill ? (categoryLabels[skill.category] || skill.category) : "",
        };
        
        return {
          ...gap,
          skill: enhancedSkill
        };
      })
    );
    
    // Статистика по приоритетам
    const priorityHigh = gapsWithSkills.filter(gap => gap.priority === 5 || gap.priority === 4).length;
    const priorityMedium = gapsWithSkills.filter(gap => gap.priority === 3).length;
    const priorityLow = gapsWithSkills.filter(gap => gap.priority === 2 || gap.priority === 1).length;
    
    // Формирование итогового ответа
    const response: SkillGapsData = {
      gaps: gapsWithSkills,
      priorityHigh,
      priorityMedium,
      priorityLow,
      totalGaps: gapsWithSkills.length
    };
    
    res.json(response);
  } catch (error) {
    console.error("Error fetching skill gaps:", error);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET /api/skills/:id
 * Получение подробной информации о конкретном навыке с учетом прогресса пользователя
 */
router.get("/:id", async (req, res) => {
  try {
    const skillId = parseInt(req.params.id);
    
    if (isNaN(skillId)) {
      return res.status(400).json({ error: "Invalid skill ID" });
    }
    
    // Получение навыка
    const skill = await storage.getSkill(skillId);
    
    if (!skill) {
      return res.status(404).json({ error: "Skill not found" });
    }
    
    // Если пользователь авторизован, добавляем информацию о его прогрессе
    let userSkill = null;
    let userGap = null;
    
    if (req.isAuthenticated()) {
      const userId = req.user.id;
      userSkill = await storage.getUserSkillByName(userId, skill.name);
      
      // Получение пробела в навыке, если есть
      const gaps = await storage.getUserSkillGaps(userId);
      userGap = gaps.find(gap => gap.skillId === skillId);
    }
    
    // Получение уроков, связанных с этим навыком
    const lessons = await storage.getLessonsBySkill(skillId);
    
    // Формирование обогащенного объекта навыка
    const enhancedSkill: SkillWithInfo & {
      userSkill?: any;
      gap?: any;
      lessons?: any[];
      prerequisites?: SkillWithInfo[];
    } = {
      ...skill,
      userLevel: userSkill?.level || 0,
      targetLevel: userSkill?.targetLevel || 0,
      gapSize: userGap?.gapSize || 0,
      isLearning: userSkill ? userSkill.level > 0 && userSkill.level < 80 : false,
      lastPracticed: userSkill?.lastPracticed ? new Date(userSkill.lastPracticed) : undefined,
      userSkill: userSkill || null,
      gap: userGap || null,
      lessons: lessons || [],
    };
    
    // Если у навыка есть предварительные требования, получаем их
    if (skill.prerequisites) {
      try {
        const prerequisites = JSON.parse(skill.prerequisites as unknown as string);
        
        if (Array.isArray(prerequisites) && prerequisites.length > 0) {
          enhancedSkill.prerequisites = await Promise.all(
            prerequisites.map(async (preId: number) => {
              const preSkill = await storage.getSkill(preId);
              return preSkill as SkillWithInfo;
            })
          );
        }
      } catch (e) {
        console.error("Error parsing prerequisites:", e);
      }
    }
    
    res.json(enhancedSkill);
  } catch (error) {
    console.error("Error fetching skill details:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
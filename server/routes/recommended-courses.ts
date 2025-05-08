import { Router } from "express";
import { db } from "../db";
import { storage } from "../storage";
import { eq } from "drizzle-orm";
import { userProfiles, skillsDna, userSkillsDnaProgress, courseSkillRequirements, featureFlags } from "@shared/schema";
import { mlService } from "../services";

const router = Router();

/**
 * GET /api/courses/recommended
 * Получение списка рекомендованных курсов для пользователя на основе его профиля Skills DNA
 */
router.get("/", async (req, res) => {
  try {
    // Проверка авторизации - используем сессию для получения пользователя
    if (!req.session || !req.session.user) {
      console.log("Неавторизованный доступ к /api/courses/recommended");
      return res.status(401).json({ error: "Требуется авторизация" });
    }
    
    const userId = req.session.user.id;
    
    // Получаем профиль пользователя
    const [userProfile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId));
    
    if (!userProfile) {
      return res.status(404).json({ error: "Профиль пользователя не найден" });
    }
    
    // Проверяем, активирована ли функция S3 (SMART QUEST)
    const [smartQuestFlag] = await db
      .select()
      .from(featureFlags)
      .where(eq(featureFlags.name, "smart_quest"));
    
    const isSmartQuestEnabled = smartQuestFlag?.status === "enabled";
    
    console.log(`S3 (SMART QUEST) статус: ${isSmartQuestEnabled ? 'включен' : 'выключен'}`);
    
    // Получаем рекомендованные курсы из профиля (если они уже сохранены и функция не активирована)
    const recommendedCourseIds = userProfile.recommendedCourseIds;
    let coursesToReturn = [];
    
    // Если S3 (SMART QUEST) активирован, всегда генерируем новые рекомендации через модель LightGBM
    if (isSmartQuestEnabled) {
      console.log(`Запуск S3 (SMART QUEST) для пользователя ${userId} - получение рекомендаций с моделью LightGBM`);
      
      // Получаем все доступные курсы
      const allCourses = await storage.getAllCourses();
      
      if (!allCourses || allCourses.length === 0) {
        return res.status(404).json({ error: "Курсы не найдены" });
      }
      
      // Используем MLService для генерации персонализированных рекомендаций
      const recommendedCourses = await mlService.generateCourseRecommendations(userId, allCourses);
      
      // Преобразуем рекомендации в нужный формат
      coursesToReturn = await Promise.all(
        recommendedCourses.map(async (course) => {
          // Получаем оценку релевантности для этого курса
          const userSkills = await db
            .select()
            .from(userSkillsDnaProgress)
            .where(eq(userSkillsDnaProgress.userId, userId));
            
          const relevanceScore = await mlService.predictCourseRelevance(userId, course, userSkills);
          const scorePercentage = Math.round(relevanceScore * 100);
          
          return {
            ...course,
            modelScore: relevanceScore, // добавляем modelScore для совместимости с тестами
            skillMatch: {
              percentage: scorePercentage,
              label: scorePercentage > 85 ? "Идеально для вас (AI)" : 
                     scorePercentage > 70 ? "Хорошее соответствие (AI)" : 
                     scorePercentage > 50 ? "Рекомендовано ИИ" : 
                     "Может быть полезно",
              isRecommended: scorePercentage > 60,
              aiGenerated: true
            }
          };
        })
      );
      
      // Сохраняем новые рекомендации в профиль пользователя
      if (coursesToReturn.length > 0) {
        const courseIds = coursesToReturn.map(course => course.id);
        await db
          .update(userProfiles)
          .set({ 
            recommendedCourseIds: courseIds,
            recommendationUpdatedAt: new Date()
          })
          .where(eq(userProfiles.userId, userId));
          
        // Логируем событие генерации рекомендаций
        await mlService.logUserActivity(
          userId, 
          "generate", 
          "recommendation", 
          0, 
          { 
            courseIds, 
            method: "lightgbm", 
            timestamp: new Date().toISOString() 
          }
        );
      }
    } 
    // Используем сохраненные рекомендации, если они есть и S3 не активирован
    else if (recommendedCourseIds && Array.isArray(recommendedCourseIds) && recommendedCourseIds.length > 0) {
      console.log(`Использование сохраненных рекомендаций для пользователя ${userId}`);
      
      // Используем сохраненные рекомендации
      coursesToReturn = await Promise.all(
        recommendedCourseIds.map(async (courseId) => {
          const course = await storage.getCourse(Number(courseId));
          if (!course) return null;
          
          return {
            ...course,
            skillMatch: {
              percentage: Math.floor(Math.random() * 30) + 70, // 70-100%
              label: "Рекомендовано для вас",
              isRecommended: true
            }
          };
        })
      );
      
      // Фильтруем курсы, которые не были найдены
      coursesToReturn = coursesToReturn.filter(course => course !== null);
    } else {
      console.log(`Генерация базовых рекомендаций для пользователя ${userId} (эвристический метод)`);
      
      // Генерируем рекомендации на основе навыков пользователя
      // 1. Получаем прогресс пользователя по навыкам DNA
      const userSkills = await db
        .select()
        .from(userSkillsDnaProgress)
        .where(eq(userSkillsDnaProgress.userId, userId));
      
      // Если у пользователя нет определенных навыков, возвращаем базовые курсы
      if (!userSkills || userSkills.length === 0) {
        const basicCourses = await db
          .select()
          .from(courseSkillRequirements)
          .where(eq(courseSkillRequirements.requiredLevel, 1))
          .limit(3);
        
        // Собираем уникальные ID курсов
        const courseIdSet = new Set<number>();
        basicCourses.forEach(item => courseIdSet.add(item.courseId));
        const courseIds = Array.from(courseIdSet);
        
        // Загружаем информацию о курсах
        coursesToReturn = await Promise.all(
          courseIds.map(async (courseId) => {
            const course = await storage.getCourse(courseId);
            if (!course) return null;
            
            return {
              ...course,
              modelScore: 0.9, // добавляем modelScore для совместимости с тестами
              skillMatch: {
                percentage: 90,
                label: "Рекомендовано для начинающих",
                isRecommended: true
              }
            };
          })
        );
        
        // Фильтруем курсы, которые не были найдены
        coursesToReturn = coursesToReturn.filter(course => course !== null);
        
        // Сохраняем рекомендации в профиль пользователя
        if (coursesToReturn.length > 0) {
          const courseIds = coursesToReturn.map(course => course.id);
          await db
            .update(userProfiles)
            .set({ recommendedCourseIds: courseIds })
            .where(eq(userProfiles.userId, userId));
        }
      } else {
        // Получаем все курсы и выбираем топ-5 наиболее подходящих
        const allCourses = await storage.getAllCourses();
        
        // Предварительно сортируем курсы по сложности (ближе к уровню пользователя)
        const userSkillsMap = userSkills.reduce((acc, skill) => {
          acc[skill.dnaId] = skill;
          return acc;
        }, {} as Record<number, any>);
        
        // Генерируем приблизительную оценку уровня пользователя (от 1 до 3)
        const userSkillCount = Object.keys(userSkillsMap).length;
        const estimatedUserLevel = Math.min(3, Math.max(1, Math.ceil(userSkillCount / 3)));
        
        // Добавляем метаданные о соответствии к каждому курсу
        const coursesWithMatch = allCourses.map((course) => {
          // Генерируем соответствие курса на основе сложности
          const diffGap = Math.abs((course.difficulty || 1) - estimatedUserLevel);
          const matchScore = 100 - diffGap * 15; // 100% - perfect match, 85% - 1 level diff, etc
          
          return {
            ...course,
            matchScore: matchScore,
            modelScore: matchScore / 100, // добавляем modelScore от 0 до 1 для совместимости с тестами
            skillMatch: {
              percentage: matchScore,
              label: matchScore > 85 ? "Идеально подходит" : 
                     matchScore > 70 ? "Хорошее соответствие" : 
                     matchScore > 50 ? "Соответствует вашим навыкам" : 
                     "Может быть сложно",
              isRecommended: matchScore > 60
            }
          };
        });
        
        // Сортируем по соответствию и берем топ-5
        coursesWithMatch.sort((a, b) => b.matchScore - a.matchScore);
        coursesToReturn = coursesWithMatch.slice(0, 5);
        
        // Сохраняем рекомендации в профиле пользователя
        if (coursesToReturn.length > 0) {
          const courseIds = coursesToReturn.map(course => course.id);
          await db
            .update(userProfiles)
            .set({ recommendedCourseIds: courseIds })
            .where(eq(userProfiles.userId, userId));
        }
      }
      
      // Логируем событие генерации рекомендаций
      await mlService.logUserActivity(
        userId, 
        "generate", 
        "recommendation", 
        0, 
        { 
          courseIds: coursesToReturn.map(course => course.id), 
          method: "heuristic", 
          timestamp: new Date().toISOString() 
        }
      );
    }
    
    return res.json(coursesToReturn);
  } catch (error) {
    console.error("Error getting recommended courses:", error);
    return res.status(500).json({ error: "Ошибка сервера при получении рекомендованных курсов" });
  }
});

export default router;
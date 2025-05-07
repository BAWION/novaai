import { Router } from "express";
import { db } from "../db";
import { storage } from "../storage";
import { eq } from "drizzle-orm";
import { userProfiles, skillsDna, userSkillsDnaProgress, courseSkillRequirements } from "@shared/schema";
import { diagnosisService } from "../services/diagnosis-service";

const router = Router();

/**
 * GET /api/courses/recommended
 * Получение списка рекомендованных курсов для пользователя на основе его профиля Skills DNA
 */
router.get("/", async (req, res) => {
  try {
    // Проверка авторизации
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: "Требуется авторизация" });
    }
    
    const userId = req.user.id;
    
    // Получаем профиль пользователя
    const [userProfile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId));
    
    if (!userProfile) {
      return res.status(404).json({ error: "Профиль пользователя не найден" });
    }
    
    // Получаем рекомендованные курсы из профиля (если они уже сохранены)
    const recommendedCourseIds = userProfile.recommendedCourseIds;
    let coursesToReturn = [];
    
    if (recommendedCourseIds && Array.isArray(recommendedCourseIds) && recommendedCourseIds.length > 0) {
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
        
        const courseIds = [...new Set(basicCourses.map(item => item.courseId))];
        
        // Загружаем информацию о курсах
        coursesToReturn = await Promise.all(
          courseIds.map(async (courseId) => {
            const course = await storage.getCourse(courseId);
            if (!course) return null;
            
            return {
              ...course,
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
        // Получаем сводку по компетенциям пользователя
        const skillsSummary = await diagnosisService.getUserCategorySummary(userId);
        
        // Получаем курсы, соответствующие уровню навыков пользователя
        const allCourses = await storage.getAllCourses();
        const coursesWithMatch = await Promise.all(
          allCourses.map(async (course) => {
            // Получаем требуемые навыки для курса
            const requirements = await db
              .select()
              .from(courseSkillRequirements)
              .where(eq(courseSkillRequirements.courseId, course.id));
            
            if (!requirements || requirements.length === 0) {
              return { ...course, matchScore: 50 }; // Нет требований - средний приоритет
            }
            
            // Рассчитываем соответствие курса навыкам пользователя
            let totalMatchScore = 0;
            let maxPossibleScore = 0;
            
            for (const req of requirements) {
              const userSkill = userSkills.find(s => s.skillId === req.skillId);
              const skillImportance = req.importance || 1;
              
              maxPossibleScore += 100 * skillImportance;
              
              if (userSkill) {
                const userLevel = userSkill.currentLevel === 'beginner' ? 1 : 
                                  userSkill.currentLevel === 'intermediate' ? 2 : 
                                  userSkill.currentLevel === 'advanced' ? 3 : 
                                  userSkill.currentLevel === 'expert' ? 4 : 0;
                
                // Если уровень пользователя соответствует или выше требуемого
                if (userLevel >= req.requiredLevel) {
                  totalMatchScore += 100 * skillImportance; // Полное соответствие
                } else {
                  // Частичное соответствие
                  totalMatchScore += (userLevel / req.requiredLevel) * 100 * skillImportance;
                }
              }
            }
            
            const matchPercentage = maxPossibleScore > 0 
              ? Math.round((totalMatchScore / maxPossibleScore) * 100) 
              : 50;
            
            return { 
              ...course, 
              matchScore: matchPercentage,
              skillMatch: {
                percentage: matchPercentage,
                label: matchPercentage > 85 ? "Идеально подходит" : 
                       matchPercentage > 70 ? "Хорошее соответствие" : 
                       matchPercentage > 50 ? "Соответствует вашим навыкам" : 
                       "Может быть сложно",
                isRecommended: matchPercentage > 60
              }
            };
          })
        );
        
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
    }
    
    return res.json(coursesToReturn);
  } catch (error) {
    console.error("Error getting recommended courses:", error);
    return res.status(500).json({ error: "Ошибка сервера при получении рекомендованных курсов" });
  }
});

export default router;
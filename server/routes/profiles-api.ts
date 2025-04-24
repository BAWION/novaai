/**
 * profiles-api.ts
 * API для работы с профилями пользователей и онбординга
 */

import { Router, Request, Response } from "express";
import { integratedStorage } from "../storage-integration";
import { z } from "zod";
import { authMiddleware } from "../middleware/auth-middleware";
import { experienceEnum, interestEnum, goalEnum, learningStyleEnum, difficultyEnum } from "@shared/schema";

const router = Router();

// Схема валидации данных онбординга
const onboardingSchema = z.object({
  userId: z.number().int().positive(),
  role: z.string(),
  pythonLevel: z.number().int().min(0).max(5),
  experience: z.string(),
  interest: z.string(),
  goal: z.string(),
  industry: z.string().optional(),
  jobTitle: z.string().optional(),
  specificGoals: z.array(z.string()).optional(),
  preferredLearningStyle: z.string().optional(),
  availableTimePerWeek: z.number().int().min(1).max(20).optional(),
  preferredDifficulty: z.string().optional(),
});

/**
 * POST /api/profiles/onboarding
 * Обработка данных онбординга и создание/обновление профиля пользователя
 */
router.post("/onboarding", authMiddleware, async (req: Request, res: Response) => {
  try {
    // Проверяем валидность данных
    const validationResult = onboardingSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Некорректные данные",
        errors: validationResult.error.errors,
      });
    }

    const onboardingData = validationResult.data;
    
    // Проверяем, что пользователь обновляет свой профиль
    if (req.user && req.user.id !== onboardingData.userId && req.user.id !== 999) {
      return res.status(403).json({
        success: false,
        message: "У вас нет прав для изменения профиля другого пользователя",
      });
    }

    // Проверяем существует ли профиль пользователя
    const existingProfile = await integratedStorage.getUserProfile(onboardingData.userId);

    let userProfile;
    if (existingProfile) {
      // Обновляем существующий профиль
      userProfile = await integratedStorage.updateUserProfile(onboardingData.userId, {
        ...onboardingData,
        completedOnboarding: true,
        onboardingCompletedAt: new Date(),
      });
    } else {
      // Создаем новый профиль
      userProfile = await integratedStorage.createUserProfile({
        ...onboardingData,
        userId: onboardingData.userId,
        completedOnboarding: true,
      });
    }

    // Генерируем рекомендации курсов на основе профиля
    const recommendedCourseIds = await generateRecommendations(userProfile);

    // Сохраняем рекомендованные курсы в профиле
    await integratedStorage.updateUserProfile(onboardingData.userId, {
      recommendedCourseIds: recommendedCourseIds,
    });

    return res.status(200).json({
      success: true,
      message: "Профиль успешно обновлен",
      recommendedCourseIds: recommendedCourseIds,
    });
  } catch (error) {
    console.error("Ошибка при обработке данных онбординга:", error);
    return res.status(500).json({
      success: false,
      message: "Внутренняя ошибка сервера при обработке данных",
    });
  }
});

/**
 * Функция генерации рекомендаций курсов на основе профиля пользователя
 * @param userProfile Профиль пользователя
 * @returns Массив ID рекомендованных курсов
 */
async function generateRecommendations(userProfile: any): Promise<number[]> {
  try {
    // Получаем все курсы для выбора рекомендаций
    const allCourses = await integratedStorage.getAllCourses();
    
    // Логика подбора курсов на основе профиля пользователя
    const recommendedCourses = allCourses.filter(course => {
      // Базовый фильтр по уровню сложности
      if (userProfile.experience === 'beginner' && course.difficulty > 2) {
        return false;
      }
      if (userProfile.experience === 'learning-basics' && course.difficulty > 3) {
        return false;
      }
      
      // Учитываем интересы пользователя
      // Для примера, простая логика сопоставления тегов курса с интересами пользователя
      const courseTags = Array.isArray(course.tags) ? course.tags : [];
      if (userProfile.interest && courseTags.includes(userProfile.interest)) {
        return true;
      }
      
      // Если у курса нет тегов, но его категория похожа на интерес пользователя
      if (userProfile.interest && course.category?.includes(userProfile.interest.split('-')[0])) {
        return true;
      }
      
      // Учитываем цель обучения
      if (userProfile.goal === 'learn-basics' && course.level === 'basic') {
        return true;
      }
      
      if (userProfile.goal === 'broaden-knowledge' && 
          (course.level === 'intermediate' || course.level === 'advanced')) {
        return true;
      }
      
      // Другие условия подбора курсов...
      
      return false;
    });
    
    // Сортируем курсы по релевантности (в данном случае просто по сложности)
    recommendedCourses.sort((a, b) => {
      if (userProfile.experience === 'beginner') {
        return a.difficulty - b.difficulty;
      } else {
        return b.difficulty - a.difficulty;
      }
    });
    
    // Возвращаем ID рекомендованных курсов (не более 5)
    return recommendedCourses.slice(0, 5).map(course => course.id);
  } catch (error) {
    console.error("Ошибка при генерации рекомендаций:", error);
    // В случае ошибки возвращаем пустой массив
    return [];
  }
}

/**
 * GET /api/profiles/:userId
 * Получение профиля пользователя
 */
router.get("/:userId", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    
    // Проверяем, что пользователь запрашивает свой профиль или имеет права администратора
    if (req.user && req.user.id !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "У вас нет прав для доступа к профилю другого пользователя",
      });
    }

    const userProfile = await integratedStorage.getUserProfile(userId);
    
    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: "Профиль пользователя не найден",
      });
    }

    return res.status(200).json({
      success: true,
      profile: userProfile,
    });
  } catch (error) {
    console.error("Ошибка при получении профиля пользователя:", error);
    return res.status(500).json({
      success: false,
      message: "Внутренняя ошибка сервера при получении профиля",
    });
  }
});

export default router;
import { Router } from "express";
import { storage } from "../storage";
import { insertUserProfileSchema } from "@shared/schema";
import { z } from "zod";
import OpenAI from "openai";

const router = Router();

// Подключение к OpenAI API для генерации рекомендаций
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Схема для дополнительных полей онбординга
const onboardingSchema = insertUserProfileSchema.extend({
  // Расширение для дополнительных полей
  industry: z.string().optional(),
  jobTitle: z.string().optional(),
  specificGoals: z.array(z.string()).optional(),
  preferredLearningStyle: z.string().optional(),
  availableTimePerWeek: z.number().optional(),
  preferredDifficulty: z.string().optional(),
});

/**
 * POST /api/profiles/onboarding
 * Обработка данных расширенного онбординга и генерация рекомендаций
 */
router.post("/onboarding", async (req, res) => {
  try {
    // Валидация данных формы
    const result = onboardingSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({ 
        error: "Validation failed", 
        details: result.error.format() 
      });
    }
    
    const userData = result.data;
    
    // Получаем текущий профиль пользователя, если существует
    let userProfile = await storage.getUserProfile(userData.userId);
    
    // Настраиваем данные для обновления или создания
    const profileData = {
      userId: userData.userId,
      role: userData.role,
      pythonLevel: userData.pythonLevel,
      experience: userData.experience,
      interest: userData.interest,
      goal: userData.goal,
      recommendedTrack: determineRecommendedTrack(userData),
      industry: userData.industry,
      jobTitle: userData.jobTitle,
      specificGoals: userData.specificGoals,
      preferredLearningStyle: userData.preferredLearningStyle,
      availableTimePerWeek: userData.availableTimePerWeek,
      preferredDifficulty: userData.preferredDifficulty,
      completedOnboarding: 1, // Отмечаем, что онбординг пройден
      onboardingCompletedAt: new Date(),
    };
    
    // Получаем все доступные курсы
    const allCourses = await storage.getAllCourses();
    
    // Получаем рекомендации курсов с использованием AI
    const recommendedCourseIds = await generateCourseRecommendations(
      profileData,
      allCourses
    );
    
    // Обновляем профиль с рекомендованными курсами
    profileData.recommendedCourseIds = recommendedCourseIds;
    
    // Обновление или создание профиля
    if (userProfile) {
      userProfile = await storage.updateUserProfile(userData.userId, profileData);
    } else {
      userProfile = await storage.createUserProfile(profileData);
    }
    
    // Записываем событие завершения онбординга
    await recordOnboardingCompletionEvent(userData.userId);
    
    // Возвращаем обновленный профиль и рекомендованные курсы
    return res.status(200).json({
      userProfile,
      recommendedCourseIds,
    });
  } catch (error) {
    console.error("Error in onboarding:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * Функция для определения рекомендуемого трека обучения
 * на основе данных пользователя
 */
function determineRecommendedTrack(userData: any): string {
  // Примеры треков: zero-to-hero, applied-ds, research-ai, nlp-expert
  
  // Простой алгоритм для определения рекомендуемого трека
  const { pythonLevel, experience, interest, goal } = userData;
  
  // Варианты треков:
  // 1. zero-to-hero: для начинающих (pythonLevel <= 2, experience = beginner)
  // 2. applied-ds: для тех, кто хочет применять DS на практике
  // 3. research-ai: для исследовательских целей
  // 4. nlp-expert: углубленный трек по NLP
  
  if (pythonLevel <= 2 && (experience === "beginner" || experience === "learning-basics")) {
    return "zero-to-hero";
  }
  
  if (interest === "data-science" || goal === "practice-skills" || goal === "create-project") {
    return "applied-ds";
  }
  
  if (interest === "nlp") {
    return "nlp-expert";
  }
  
  if (goal === "career-change" || goal === "find-internship") {
    return "applied-ds";
  }
  
  if (experience === "expert" || interest === "neural-networks") {
    return "research-ai";
  }
  
  // По умолчанию
  return "applied-ds";
}

/**
 * Функция для генерации рекомендаций курсов с использованием OpenAI
 */
async function generateCourseRecommendations(
  profileData: any,
  allCourses: any[]
): Promise<number[]> {
  try {
    // Если OpenAI API недоступен, используем простую логику рекомендаций
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OpenAI API key not provided, using simple recommendations");
      return generateSimpleRecommendations(profileData, allCourses);
    }
    
    // Подготовка данных для запроса к OpenAI
    const userProfile = {
      role: profileData.role,
      pythonLevel: profileData.pythonLevel,
      experience: profileData.experience,
      interest: profileData.interest,
      goal: profileData.goal,
      industry: profileData.industry,
      specificGoals: profileData.specificGoals,
      preferredLearningStyle: profileData.preferredLearningStyle,
      availableTimePerWeek: profileData.availableTimePerWeek,
      preferredDifficulty: profileData.preferredDifficulty,
    };
    
    // Упрощенные данные о курсах
    const simplifiedCourses = allCourses.map(course => ({
      id: course.id,
      title: course.title,
      level: course.level,
      difficulty: course.difficulty,
      modules: course.modules,
      tags: course.tags,
      access: course.access,
    }));
    
    // Формирование запроса к OpenAI
    const prompt = `
    Как эксперт по образовательным рекомендациям, подбери 3-5 наиболее подходящих курсов для пользователя с профилем:
    
    ${JSON.stringify(userProfile, null, 2)}
    
    Доступные курсы:
    ${JSON.stringify(simplifiedCourses, null, 2)}
    
    Верни ТОЛЬКО массив ID курсов в формате JSON без дополнительных комментариев. 
    Например: {"recommendedCourseIds": [1, 5, 7]}
    
    Курсы должны быть отсортированы от наиболее до наименее подходящих. Учитывай уровень сложности, интересы и цели пользователя.
    `;
    
    // Запрос к OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: "Ты - образовательный AI-ассистент, который подбирает наиболее подходящие курсы для пользователей на основе их профиля и целей. Возвращай только JSON-массив ID рекомендованных курсов." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });
    
    // Парсинг ответа
    const jsonResponse = JSON.parse(completion.choices[0].message.content);
    const recommendedIds = jsonResponse.recommendedCourseIds || [];
    
    // Проверка валидности ID курсов
    const validCourseIds = recommendedIds.filter(id => 
      allCourses.some(course => course.id === id)
    );
    
    if (validCourseIds.length === 0) {
      // Если не получили валидные ID, используем запасной вариант
      return generateSimpleRecommendations(profileData, allCourses);
    }
    
    return validCourseIds;
  } catch (error) {
    console.error("Error generating AI recommendations:", error);
    // В случае ошибки используем простые рекомендации
    return generateSimpleRecommendations(profileData, allCourses);
  }
}

/**
 * Запасной генератор рекомендаций на основе простых правил
 * Используется при отсутствии API ключа или ошибке API
 */
function generateSimpleRecommendations(
  profileData: any,
  allCourses: any[]
): number[] {
  // Сортируем курсы по соответствию профилю пользователя
  const scoredCourses = allCourses.map(course => {
    let score = 0;
    
    // Уровень сложности
    const levelMap = { "basic": 1, "intermediate": 2, "advanced": 3, "expert": 4 };
    const userDifficultyMap = { "easy": 1, "moderate": 2, "challenging": 3 };
    
    const courseDifficulty = levelMap[course.level] || 2;
    const userPreferredDifficulty = userDifficultyMap[profileData.preferredDifficulty] || 2;
    
    // Бонус за соответствие предпочтительному уровню сложности
    if (courseDifficulty === userPreferredDifficulty) {
      score += 5;
    } else if (Math.abs(courseDifficulty - userPreferredDifficulty) === 1) {
      score += 3;
    }
    
    // Учитываем уровень Python
    if (profileData.pythonLevel <= 2 && course.level === "basic") {
      score += 5;
    } else if (profileData.pythonLevel >= 4 && (course.level === "advanced" || course.level === "expert")) {
      score += 5;
    } else if (profileData.pythonLevel === 3 && course.level === "intermediate") {
      score += 5;
    }
    
    // Учитываем интересы через теги
    if (course.tags && Array.isArray(course.tags)) {
      if (course.tags.includes(profileData.interest)) {
        score += 5;
      }
      
      // Проверяем специфические цели
      if (profileData.specificGoals && Array.isArray(profileData.specificGoals)) {
        profileData.specificGoals.forEach((goal: string) => {
          const goalKeyword = goal.split("_").pop(); // Берем последнее слово из ключа цели
          if (goalKeyword && course.tags.some((tag: string) => tag.includes(goalKeyword))) {
            score += 3;
          }
        });
      }
    }
    
    // Учитываем доступное время (короткие курсы для занятых людей)
    if (profileData.availableTimePerWeek && profileData.availableTimePerWeek < 5) {
      if (course.modules <= 3) {
        score += 3;
      }
    } else if (profileData.availableTimePerWeek && profileData.availableTimePerWeek > 10) {
      if (course.modules >= 5) {
        score += 3;
      }
    }
    
    return {
      id: course.id,
      score
    };
  });
  
  // Сортируем по убыванию оценки и берем до 5 лучших курсов
  const sortedRecommendations = scoredCourses
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(item => item.id);
  
  return sortedRecommendations;
}

/**
 * Функция для записи события завершения онбординга
 */
async function recordOnboardingCompletionEvent(userId: number): Promise<void> {
  try {
    // Если метод доступен, записываем событие
    if (typeof storage.saveLearningEvent === 'function') {
      await storage.saveLearningEvent({
        userId,
        eventType: "onboarding.complete",
        entityType: "profile",
        entityId: userId,
        data: { timestamp: new Date().toISOString() },
      });
    }
  } catch (error) {
    console.error("Error recording onboarding event:", error);
    // Игнорируем ошибки при записи события
  }
}

export default router;
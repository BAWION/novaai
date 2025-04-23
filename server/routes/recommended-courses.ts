import { Router } from "express";
import { storage } from "../storage";

const router = Router();

/**
 * GET /api/courses/recommended
 * Получение списка рекомендованных курсов для текущего пользователя
 */
router.get("/", async (req, res) => {
  try {
    // Проверка авторизации
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    const userId = req.user.id;
    
    // Получаем профиль пользователя
    const userProfile = await storage.getUserProfile(userId);
    
    if (!userProfile) {
      return res.status(404).json({ error: "User profile not found" });
    }
    
    // Получаем ID рекомендованных курсов из профиля
    const recommendedCourseIds = userProfile.recommendedCourseIds || [];
    
    if (!Array.isArray(recommendedCourseIds) || recommendedCourseIds.length === 0) {
      return res.json([]);
    }
    
    // Загружаем полную информацию о курсах
    const recommendedCourses = await Promise.all(
      recommendedCourseIds.map(async (courseId) => {
        const course = await storage.getCourse(courseId);
        if (!course) return null;
        
        // Вычисляем соответствие навыкам пользователя (заглушка)
        const skillMatch = Math.floor(Math.random() * 30) + 70; // 70-100%
        
        // Формируем причину рекомендации на основе профиля
        const recommendationReason = generateRecommendationReason(
          userProfile,
          course
        );
        
        return {
          ...course,
          skillMatch,
          recommendationReason,
        };
      })
    );
    
    // Отфильтровываем null-значения (курсы, которые не были найдены)
    const validCourses = recommendedCourses.filter(course => course !== null);
    
    return res.json(validCourses);
  } catch (error) {
    console.error("Error fetching recommended courses:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET /api/courses/recommended/:ids
 * Получение информации о конкретных рекомендованных курсах по их ID
 */
router.get("/:ids", async (req, res) => {
  try {
    const courseIds = req.params.ids.split(",").map(id => parseInt(id, 10));
    
    if (!Array.isArray(courseIds) || courseIds.length === 0 || courseIds.some(isNaN)) {
      return res.status(400).json({ error: "Invalid course IDs" });
    }
    
    // Проверка авторизации (опционально для публичных курсов)
    const userId = req.isAuthenticated() ? req.user.id : null;
    
    // Получаем профиль пользователя, если авторизован
    let userProfile = null;
    if (userId) {
      userProfile = await storage.getUserProfile(userId);
    }
    
    // Загружаем информацию о курсах
    const courses = await Promise.all(
      courseIds.map(async (courseId) => {
        const course = await storage.getCourse(courseId);
        if (!course) return null;
        
        // Если пользователь авторизован, добавляем персонализированные данные
        if (userProfile) {
          // Вычисляем соответствие навыкам (заглушка)
          const skillMatch = Math.floor(Math.random() * 30) + 70; // 70-100%
          
          // Формируем причину рекомендации
          const recommendationReason = generateRecommendationReason(
            userProfile,
            course
          );
          
          return {
            ...course,
            skillMatch,
            recommendationReason,
          };
        }
        
        return course;
      })
    );
    
    // Отфильтровываем null-значения (курсы, которые не были найдены)
    const validCourses = courses.filter(course => course !== null);
    
    return res.json(validCourses);
  } catch (error) {
    console.error("Error fetching course details:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

/**
 * Функция для генерации причины рекомендации курса
 * на основе данных профиля пользователя
 */
function generateRecommendationReason(userProfile: any, course: any): string {
  // Простые шаблоны для генерации причин
  const reasonTemplates = [
    // Для начинающих
    {
      condition: () => userProfile.experience === "beginner" && course.level === "basic",
      reason: "Идеально подходит для начала вашего пути в AI. Курс разработан специально для новичков и закладывает важный фундамент."
    },
    // Для профессионалов
    {
      condition: () => userProfile.experience === "expert" && 
                    (course.level === "advanced" || course.level === "expert"),
      reason: "Соответствует вашему высокому уровню экспертизы и предлагает продвинутый материал для углубления знаний."
    },
    // Для тех, кто изучает основы
    {
      condition: () => userProfile.experience === "learning-basics" && 
                    (course.level === "basic" || course.level === "intermediate"),
      reason: "Поможет укрепить ваши базовые знания и плавно перейти к более сложным концепциям."
    },
    // По интересам
    {
      condition: () => course.tags && 
                    Array.isArray(course.tags) && 
                    course.tags.includes(userProfile.interest),
      reason: `Соответствует вашему интересу к ${getInterestLabel(userProfile.interest)} и предлагает практические знания в этой области.`
    },
    // По целям
    {
      condition: () => userProfile.goal === "find-internship" || userProfile.goal === "career-change",
      reason: "Включает практические проекты, которые можно добавить в портфолио для поиска работы или стажировки."
    },
    {
      condition: () => userProfile.goal === "practice-skills",
      reason: "Содержит множество практических заданий для развития ваших навыков и применения теории на практике."
    },
    // По времени
    {
      condition: () => userProfile.availableTimePerWeek && 
                    userProfile.availableTimePerWeek < 5 && 
                    course.modules <= 3,
      reason: "Компактный курс, который хорошо подходит для вашего ограниченного времени на обучение."
    },
    // По стилю обучения
    {
      condition: () => userProfile.preferredLearningStyle === "visual" && 
                    course.tags && 
                    Array.isArray(course.tags) && 
                    course.tags.includes("visual"),
      reason: "Богат визуальными материалами, что соответствует вашему предпочтительному стилю обучения."
    },
    {
      condition: () => userProfile.preferredLearningStyle === "practical" && 
                    course.tags && 
                    Array.isArray(course.tags) && 
                    course.tags.some(tag => ["projects", "hands-on", "practical"].includes(tag)),
      reason: "Ориентирован на практическое применение знаний, что соответствует вашему предпочтению учиться через практику."
    },
  ];
  
  // Находим подходящий шаблон
  const matchedTemplate = reasonTemplates.find(template => template.condition());
  
  // Если есть подходящий шаблон, возвращаем его, иначе возвращаем общий текст
  return matchedTemplate 
    ? matchedTemplate.reason 
    : "Этот курс хорошо соответствует вашему профилю и интересам.";
}

/**
 * Вспомогательная функция для получения русскоязычной метки интереса
 */
function getInterestLabel(interest: string): string {
  const interestLabels: Record<string, string> = {
    "machine-learning": "машинному обучению",
    "neural-networks": "нейронным сетям",
    "data-science": "науке о данных",
    "computer-vision": "компьютерному зрению",
    "nlp": "обработке естественного языка",
    "robotics": "робототехнике",
    "ai-for-business": "применению ИИ в бизнесе",
    "generative-ai": "генеративному ИИ",
  };
  
  return interestLabels[interest] || interest;
}

export default router;
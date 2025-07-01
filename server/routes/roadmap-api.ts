import { Router } from "express";
import { db } from "../db";
import { storage } from "../storage";
import { eq } from "drizzle-orm";
import { userProfiles, skillsDna, userSkillsDnaProgress } from "@shared/schema";

const router = Router();

/**
 * GET /api/roadmap/personal
 * Генерирует персональную космическую дорожную карту на основе Skills DNA диагностики
 */
router.get("/personal", async (req, res) => {
  try {
    const userId = req.session?.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: "Пользователь не авторизован" });
    }

    // Получаем детальные данные Skills DNA пользователя
    const userSkills = await db
      .select({
        id: userSkillsDnaProgress.id,
        userId: userSkillsDnaProgress.userId,
        dnaId: userSkillsDnaProgress.dnaId,
        currentLevel: userSkillsDnaProgress.currentLevel,
        progress: userSkillsDnaProgress.progress,
        name: skillsDna.name,
        description: skillsDna.description,
        category: skillsDna.category
      })
      .from(userSkillsDnaProgress)
      .leftJoin(skillsDna, eq(userSkillsDnaProgress.dnaId, skillsDna.id))
      .where(eq(userSkillsDnaProgress.userId, userId));

    if (!userSkills || userSkills.length === 0) {
      return res.status(404).json({ 
        error: "Skills DNA диагностика не пройдена",
        message: "Пройдите диагностику Skills DNA для создания персональной дорожной карты"
      });
    }

    // Получаем рекомендованные курсы
    const recommendedResponse = await fetch(`${req.protocol}://${req.get('host')}/api/courses/recommended`, {
      headers: {
        'Cookie': req.headers.cookie || ''
      }
    });
    
    let recommendedCourses = [];
    if (recommendedResponse.ok) {
      recommendedCourses = await recommendedResponse.json();
    }

    // Анализируем Skills DNA для создания маршрута
    const roadmapData = generateCosmicRoadmap(userSkills, recommendedCourses);

    console.log(`[RoadmapAPI] Создана персональная дорожная карта для пользователя ${userId}:`, {
      totalSkills: userSkills.length,
      recommendedCourses: recommendedCourses.length,
      roadmapSteps: roadmapData.steps.length
    });

    return res.json(roadmapData);

  } catch (error) {
    console.error("Error generating personal roadmap:", error);
    return res.status(500).json({ error: "Ошибка при создании дорожной карты" });
  }
});

/**
 * Функция для генерации космической дорожной карты на основе Skills DNA
 */
function generateCosmicRoadmap(userSkills: any[], recommendedCourses: any[]) {
  // Анализируем навыки пользователя
  const strongSkills = userSkills.filter(skill => skill.progress >= 70);
  const mediumSkills = userSkills.filter(skill => skill.progress >= 40 && skill.progress < 70);
  const weakSkills = userSkills.filter(skill => skill.progress < 40);

  // Определяем стартовые точки (сильные навыки)
  const startingPoints = strongSkills.map(skill => ({
    id: `skill-${skill.dnaId}`,
    title: skill.name,
    type: 'starting_skill',
    progress: skill.progress,
    description: `Ваша сильная сторона: ${skill.description}`,
    status: 'mastered',
    priority: 1
  }));

  // Группируем рекомендованные курсы по приоритету
  const prioritizedCourses = recommendedCourses
    .sort((a, b) => (b.skillMatch?.percentage || 0) - (a.skillMatch?.percentage || 0))
    .slice(0, 8) // Максимум 8 курсов для карты
    .map((course, index) => ({
      id: `course-${course.id}`,
      title: course.title,
      type: 'course',
      courseId: course.id,
      progress: 0, // Курс еще не начат
      description: course.description,
      status: index === 0 ? 'available' : 'locked',
      priority: index + 2, // Стартовые навыки имеют приоритет 1
      skillMatch: course.skillMatch,
      estimatedTime: course.estimatedTime || '4-6 часов',
      targetSkills: course.skillRequirements || []
    }));

  // Создаем последовательность шагов
  const roadmapSteps = [
    ...startingPoints,
    ...prioritizedCourses
  ];

  // Определяем связи между шагами (какие курсы следуют за какими навыками)
  const connections = generateStepConnections(roadmapSteps, weakSkills);

  return {
    userId: userSkills[0]?.userId,
    totalSteps: roadmapSteps.length,
    completedSteps: startingPoints.length,
    estimatedTime: calculateTotalTime(prioritizedCourses),
    currentLevel: determineCurrentLevel(userSkills),
    targetLevel: "expert",
    steps: roadmapSteps,
    connections: connections,
    analytics: {
      strongSkills: strongSkills.length,
      mediumSkills: mediumSkills.length,
      weakSkills: weakSkills.length,
      recommendedCoursesCount: recommendedCourses.length
    }
  };
}

/**
 * Генерирует связи между шагами дорожной карты
 */
function generateStepConnections(steps: any[], weakSkills: any[]) {
  const connections = [];
  
  // Связываем стартовые навыки с первыми курсами
  const startingSkills = steps.filter(step => step.type === 'starting_skill');
  const courses = steps.filter(step => step.type === 'course');
  
  startingSkills.forEach(skill => {
    // Каждый сильный навык связываем с 1-2 курсами
    const relatedCourses = courses.slice(0, 2);
    relatedCourses.forEach(course => {
      connections.push({
        from: skill.id,
        to: course.id,
        type: 'prerequisite',
        description: `${skill.title} → ${course.title}`
      });
    });
  });

  // Создаем последовательность между курсами
  for (let i = 0; i < courses.length - 1; i++) {
    connections.push({
      from: courses[i].id,
      to: courses[i + 1].id,
      type: 'sequence',
      description: `Следующий шаг после ${courses[i].title}`
    });
  }

  return connections;
}

/**
 * Рассчитывает общее время прохождения маршрута
 */
function calculateTotalTime(courses: any[]) {
  const totalHours = courses.reduce((sum, course) => {
    const timeMatch = course.estimatedTime?.match(/(\d+)/);
    return sum + (timeMatch ? parseInt(timeMatch[1]) : 4);
  }, 0);
  
  return `${totalHours}-${totalHours + Math.ceil(totalHours * 0.5)} часов`;
}

/**
 * Определяет текущий уровень пользователя
 */
function determineCurrentLevel(userSkills: any[]) {
  const avgProgress = userSkills.reduce((sum, skill) => sum + skill.progress, 0) / userSkills.length;
  
  if (avgProgress >= 80) return "expert";
  if (avgProgress >= 60) return "advanced";
  if (avgProgress >= 40) return "intermediate";
  return "beginner";
}

export default router;
/**
 * API маршруты для универсальной системы управления курсами
 */

import express, { Request, Response } from "express";
import { courseManagementService, CourseTemplate } from "../services/course-management-service";
import { courseSkillsIntegration } from "../services/course-skills-integration";
import { enhancedAuthMiddleware } from "../auth-middleware";

const router = express.Router();

/**
 * Создает курс из шаблона
 * POST /api/course-management/create
 */
router.post('/create', enhancedAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const template: CourseTemplate = req.body;
    const authorId = req.session.user?.id || 1; // Fallback to admin

    const courseId = await courseManagementService.createCourseFromTemplate(template, authorId);
    
    res.status(201).json({
      success: true,
      courseId,
      message: 'Курс успешно создан'
    });
  } catch (error) {
    console.error('Ошибка при создании курса:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при создании курса'
    });
  }
});

/**
 * Получает полную информацию о курсе с контентом
 * GET /api/course-management/course/:courseId
 */
router.get('/course/:courseId', async (req: Request, res: Response) => {
  try {
    const courseId = parseInt(req.params.courseId);
    
    if (isNaN(courseId)) {
      return res.status(400).json({
        success: false,
        message: 'Некорректный ID курса'
      });
    }

    const course = await courseManagementService.getCourseWithContent(courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Курс не найден'
      });
    }

    res.json({
      success: true,
      course
    });
  } catch (error) {
    console.error('Ошибка при получении курса:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении курса'
    });
  }
});

/**
 * Начинает прохождение курса
 * POST /api/course-management/start/:courseId
 */
router.post('/start/:courseId', enhancedAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const courseId = parseInt(req.params.courseId);
    const userId = req.session.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Требуется авторизация'
      });
    }

    if (isNaN(courseId)) {
      return res.status(400).json({
        success: false,
        message: 'Некорректный ID курса'
      });
    }

    await courseManagementService.startCourse(userId, courseId);
    
    res.json({
      success: true,
      message: 'Курс начат'
    });
  } catch (error) {
    console.error('Ошибка при начале курса:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при начале курса'
    });
  }
});

/**
 * Получает прогресс пользователя по курсу
 * GET /api/course-management/progress/:courseId
 */
router.get('/progress/:courseId', enhancedAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const courseId = parseInt(req.params.courseId);
    const userId = req.session.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Требуется авторизация'
      });
    }

    if (isNaN(courseId)) {
      return res.status(400).json({
        success: false,
        message: 'Некорректный ID курса'
      });
    }

    const progress = await courseManagementService.getUserCourseProgress(userId, courseId);
    const lessonProgress = await courseManagementService.getUserLessonProgress(userId, courseId);
    
    res.json({
      success: true,
      progress,
      lessonProgress
    });
  } catch (error) {
    console.error('Ошибка при получении прогресса:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении прогресса'
    });
  }
});

/**
 * Настройка навыков для курса
 * POST /api/course-management/configure-skills/:courseId
 */
router.post('/configure-skills/:courseId', enhancedAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const courseId = parseInt(req.params.courseId);
    const { skills } = req.body;

    if (isNaN(courseId)) {
      return res.status(400).json({
        success: false,
        message: 'Некорректный ID курса'
      });
    }

    courseSkillsIntegration.configureCourseSkills(courseId, skills);
    
    res.json({
      success: true,
      message: 'Навыки курса настроены'
    });
  } catch (error) {
    console.error('Ошибка настройки навыков:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка настройки навыков'
    });
  }
});

/**
 * Настройка навыков для урока
 * POST /api/course-management/configure-lesson-skills/:lessonId
 */
router.post('/configure-lesson-skills/:lessonId', enhancedAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const lessonId = parseInt(req.params.lessonId);
    const { skills } = req.body;

    if (isNaN(lessonId)) {
      return res.status(400).json({
        success: false,
        message: 'Некорректный ID урока'
      });
    }

    courseSkillsIntegration.configureLessonSkills(lessonId, skills);
    
    res.json({
      success: true,
      message: 'Навыки урока настроены'
    });
  } catch (error) {
    console.error('Ошибка настройки навыков урока:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка настройки навыков урока'
    });
  }
});

/**
 * Получение сводки навыков пользователя
 * GET /api/course-management/skills-summary
 */
router.get('/skills-summary', enhancedAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.session.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Требуется авторизация'
      });
    }

    const summary = await courseSkillsIntegration.getSkillsProgressSummary(userId);
    
    res.json({
      success: true,
      summary
    });
  } catch (error) {
    console.error('Ошибка получения сводки навыков:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка получения сводки навыков'
    });
  }
});

/**
 * Отмечает урок как завершенный
 * POST /api/course-management/complete-lesson/:lessonId
 */
router.post('/complete-lesson/:lessonId', enhancedAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const lessonId = parseInt(req.params.lessonId);
    const userId = req.session.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Требуется авторизация'
      });
    }

    if (isNaN(lessonId)) {
      return res.status(400).json({
        success: false,
        message: 'Некорректный ID урока'
      });
    }

    await courseManagementService.completeLesson(userId, lessonId);
    
    // Обновляем Skills DNA после завершения урока
    const skillsUpdated = await courseSkillsIntegration.updateSkillsAfterLesson(userId, lessonId);
    
    // Получаем обновленную сводку навыков для отображения изменений
    const skillsSummary = skillsUpdated ? await courseSkillsIntegration.getSkillsProgressSummary(userId) : null;
    
    res.json({
      success: true,
      message: skillsUpdated ? 'Урок завершен. Skills DNA обновлен!' : 'Урок завершен',
      skillsUpdated,
      skillsSummary
    });
  } catch (error) {
    console.error('Ошибка при завершении урока:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при завершении урока'
    });
  }
});

/**
 * Завершает курс с бонусным обновлением Skills DNA
 * POST /api/course-management/complete-course/:courseId
 */
router.post('/complete-course/:courseId', enhancedAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const courseId = parseInt(req.params.courseId);
    const userId = req.session.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Требуется авторизация'
      });
    }

    if (isNaN(courseId)) {
      return res.status(400).json({
        success: false,
        message: 'Некорректный ID курса'
      });
    }

    // Отмечаем курс как завершенный
    await courseManagementService.startCourse(userId, courseId); // Убеждаемся, что прогресс существует
    
    // Применяем бонусные навыки за завершение курса
    const skillsUpdated = await courseSkillsIntegration.updateSkillsAfterCourse(userId, courseId);
    
    // Получаем обновленную сводку навыков
    const skillsSummary = skillsUpdated ? await courseSkillsIntegration.getSkillsProgressSummary(userId) : null;
    
    res.json({
      success: true,
      message: skillsUpdated ? 'Курс завершен! Получен бонус к Skills DNA!' : 'Курс завершен!',
      skillsUpdated,
      skillsSummary
    });
  } catch (error) {
    console.error('Ошибка при завершении курса:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при завершении курса'
    });
  }
});

/**
 * Обновляет позицию в уроке
 * POST /api/course-management/update-position/:lessonId
 */
router.post('/update-position/:lessonId', enhancedAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const lessonId = parseInt(req.params.lessonId);
    const userId = req.session.user?.id;
    const { position } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Требуется авторизация'
      });
    }

    if (isNaN(lessonId) || typeof position !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Некорректные параметры'
      });
    }

    await courseManagementService.updateLessonPosition(userId, lessonId, position);
    
    res.json({
      success: true,
      message: 'Позиция обновлена'
    });
  } catch (error) {
    console.error('Ошибка при обновлении позиции:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при обновлении позиции'
    });
  }
});

/**
 * Сохраняет результат выполнения задания
 * POST /api/course-management/assignment-result/:assignmentId
 */
router.post('/assignment-result/:assignmentId', enhancedAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const assignmentId = parseInt(req.params.assignmentId);
    const userId = req.session.user?.id;
    const { answers, score } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Требуется авторизация'
      });
    }

    if (isNaN(assignmentId) || typeof score !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Некорректные параметры'
      });
    }

    await courseManagementService.saveAssignmentResult(userId, assignmentId, answers, score);
    
    res.json({
      success: true,
      message: 'Результат сохранен'
    });
  } catch (error) {
    console.error('Ошибка при сохранении результата:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при сохранении результата'
    });
  }
});

/**
 * Получает прогресс пользователя по курсу
 * GET /api/course-management/user-progress/:courseId
 */
router.get('/user-progress/:courseId', enhancedAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const courseId = parseInt(req.params.courseId);
    const userId = req.session.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Требуется авторизация'
      });
    }

    if (isNaN(courseId)) {
      return res.status(400).json({
        success: false,
        message: 'Некорректный ID курса'
      });
    }

    const progress = await courseManagementService.getUserCourseProgress(userId, courseId);
    
    res.json({
      success: true,
      progress
    });
  } catch (error) {
    console.error('Ошибка при получении прогресса пользователя:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении прогресса пользователя'
    });
  }
});

export default router;
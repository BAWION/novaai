import { Request, Response, Router } from "express";
import { z } from "zod";
import { insertUserLessonProgressSchema } from "@shared/schema";
import { storage } from "../storage";

// Схема валидации для обновления прогресса урока
const updateLessonProgressSchema = z.object({
  progress: z.number().optional(),
  completed: z.number().optional(),
  timeSpent: z.number().optional(),
  lastPosition: z.string().optional(),
  notes: z.string().optional(),
});

// Схема валидации для добавления заметки к уроку
const addLessonNoteSchema = z.object({
  notes: z.string(),
});

export const lessonProgressRouter = Router();

// Получение прогресса пользователя по уроку
lessonProgressRouter.get("/:lessonId", async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Не авторизован" });
    }
    
    const userId = req.user.id;
    const lessonId = Number(req.params.lessonId);
    
    if (isNaN(lessonId)) {
      return res.status(400).json({ message: "Неверный ID урока" });
    }
    
    const progress = await storage.getUserLessonProgress(userId, lessonId);
    
    if (!progress) {
      return res.status(404).json({ message: "Прогресс не найден" });
    }
    
    return res.status(200).json(progress);
  } catch (error) {
    console.error("Error getting lesson progress:", error);
    return res.status(400).json({
      message: "Ошибка при получении прогресса урока",
      error: error.message,
    });
  }
});

// Обновление прогресса урока
lessonProgressRouter.put("/:lessonId", async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Не авторизован" });
    }
    
    const userId = req.user.id;
    const lessonId = Number(req.params.lessonId);
    
    if (isNaN(lessonId)) {
      return res.status(400).json({ message: "Неверный ID урока" });
    }
    
    const progressData = updateLessonProgressSchema.parse(req.body);
    
    const updatedProgress = await storage.updateUserLessonProgress(
      userId,
      lessonId,
      progressData
    );
    
    // Если урок отмечен как завершенный, создаем событие
    if (progressData.completed === 1) {
      await storage.saveLearningEvent({
        userId,
        eventType: "lesson.complete",
        entityType: "lesson",
        entityId: lessonId,
        data: { progress: progressData.progress || 100 },
        duration: null,
        sessionId: req.session.learningSessionId || null,
      });
    }
    
    // Обновляем общий прогресс курса, если это необходимо
    if (updatedProgress.progress === 100 || progressData.completed === 1) {
      const lesson = await storage.getLesson(lessonId);
      if (lesson && lesson.moduleId) {
        // Получаем все уроки модуля
        const moduleId = lesson.moduleId;
        const moduleProgress = await storage.getUserLessonsProgress(userId, moduleId);
        
        // Получаем общее количество уроков в модуле
        const moduleAllLessons = await storage.getLessonsByModule(moduleId);
        
        if (moduleAllLessons.length > 0) {
          // Вычисляем прогресс модуля
          const completedLessons = moduleProgress.filter(
            (lessonProgress) => lessonProgress.completed === 1
          ).length;
          
          const moduleCompletionPercentage = Math.floor(
            (completedLessons / moduleAllLessons.length) * 100
          );
          
          // Находим курс, к которому принадлежит модуль
          const module = await storage.getModule(moduleId);
          if (module && module.courseId) {
            // Обновляем прогресс курса
            await storage.updateUserCourseProgress(userId, module.courseId, {
              progress: moduleCompletionPercentage,
              currentModuleId: moduleId,
              currentLessonId: lessonId,
            });
          }
        }
      }
    }
    
    return res.status(200).json(updatedProgress);
  } catch (error) {
    console.error("Error updating lesson progress:", error);
    return res.status(400).json({
      message: "Ошибка при обновлении прогресса урока",
      error: error.message,
    });
  }
});

// Запись времени, проведенного на уроке
lessonProgressRouter.post("/:lessonId/time", async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Не авторизован" });
    }
    
    const userId = req.user.id;
    const lessonId = Number(req.params.lessonId);
    
    if (isNaN(lessonId)) {
      return res.status(400).json({ message: "Неверный ID урока" });
    }
    
    const { duration } = req.body;
    
    if (!duration || typeof duration !== "number" || duration <= 0) {
      return res.status(400).json({ message: "Требуется указать положительную длительность" });
    }
    
    const progress = await storage.getUserLessonProgress(userId, lessonId);
    
    let updatedProgress;
    
    if (progress) {
      // Обновляем существующий прогресс
      updatedProgress = await storage.updateUserLessonProgress(userId, lessonId, {
        timeSpent: progress.timeSpent + duration,
        lastAccessedAt: new Date(),
      });
    } else {
      // Создаем новый прогресс
      updatedProgress = await storage.updateUserLessonProgress(userId, lessonId, {
        timeSpent: duration,
        progress: 0,
        completed: 0,
      });
    }
    
    // Записываем событие
    await storage.saveLearningEvent({
      userId,
      eventType: "lesson.view",
      entityType: "lesson",
      entityId: lessonId,
      data: null,
      duration,
      sessionId: req.session.learningSessionId || null,
    });
    
    return res.status(200).json({
      totalTimeSpent: updatedProgress.timeSpent,
      lastAccessedAt: updatedProgress.lastAccessedAt,
    });
  } catch (error) {
    console.error("Error recording lesson time:", error);
    return res.status(400).json({
      message: "Ошибка при записи времени урока",
      error: error.message,
    });
  }
});

// Добавление заметки к уроку
lessonProgressRouter.post("/:lessonId/notes", async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Не авторизован" });
    }
    
    const userId = req.user.id;
    const lessonId = Number(req.params.lessonId);
    
    if (isNaN(lessonId)) {
      return res.status(400).json({ message: "Неверный ID урока" });
    }
    
    const { notes } = addLessonNoteSchema.parse(req.body);
    
    const updatedProgress = await storage.updateUserLessonProgress(userId, lessonId, {
      notes,
    });
    
    return res.status(200).json({
      notes: updatedProgress.notes,
    });
  } catch (error) {
    console.error("Error adding lesson notes:", error);
    return res.status(400).json({
      message: "Ошибка при добавлении заметок к уроку",
      error: error.message,
    });
  }
});
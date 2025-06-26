import { Request, Response, Router } from "express";
import { z } from "zod";
import { storage } from "../storage";
import { IStorage } from "../storage";

// Расширяем типы Express для поддержки аутентификации пользователя
declare global {
  namespace Express {
    interface Request {
      isAuthenticated(): boolean;
      user?: any;
    }
  }
}

export const courseProgressRouter = Router();

/**
 * Получение прогресса пользователя по конкретному курсу
 * GET /api/courses/:courseId/progress
 */
courseProgressRouter.get("/:courseId/progress", async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Вы не авторизованы" });
    }
    
    const userId = req.user.id;
    const courseId = Number(req.params.courseId);
    
    if (isNaN(courseId)) {
      return res.status(400).json({ message: "Неверный ID курса" });
    }
    
    const progress = await storage.getCourseProgress(userId, courseId);
    
    if (!progress) {
      // Если прогресс ещё не найден, возвращаем нулевой прогресс
      return res.status(200).json({
        userId,
        courseId,
        progress: 0,
        completedModules: 0,
        startedAt: new Date(),
        lastAccessedAt: new Date(),
        completedAt: null
      });
    }
    
    return res.status(200).json(progress);
  } catch (error) {
    console.error("Ошибка при получении прогресса курса:", error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

/**
 * Обновление прогресса пользователя по курсу
 * POST /api/courses/:courseId/progress
 */
courseProgressRouter.post("/:courseId/progress", async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Вы не авторизованы" });
    }
    
    const userId = req.user.id;
    const courseId = Number(req.params.courseId);
    
    if (isNaN(courseId)) {
      return res.status(400).json({ message: "Неверный ID курса" });
    }
    
    const updateSchema = z.object({
      progress: z.number().min(0).max(100).optional(),
      completedModules: z.number().min(0).optional(),
      completedAt: z.date().optional().nullable(),
    });
    
    const validationResult = updateSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        message: "Ошибка валидации", 
        errors: validationResult.error.format() 
      });
    }
    
    const updateData = validationResult.data;
    
    // Добавляем текущую дату к последнему доступу
    const dataToUpdate = {
      ...updateData,
      lastAccessedAt: new Date()
    };
    
    const updatedProgress = await storage.updateUserCourseProgress(
      userId,
      courseId,
      dataToUpdate
    );
    
    return res.status(200).json(updatedProgress);
  } catch (error) {
    console.error("Ошибка при обновлении прогресса курса:", error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

/**
 * Получение прогресса всех пользователей для определенного курса (для администраторов)
 * GET /api/courses/:courseId/all-progress
 */
courseProgressRouter.get("/:courseId/all-progress", async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Вы не авторизованы" });
    }
    
    // Здесь можно добавить проверку на роль администратора
    // if (req.user.role !== 'admin') {
    //   return res.status(403).json({ message: "Нет доступа" });
    // }
    
    const courseId = Number(req.params.courseId);
    
    if (isNaN(courseId)) {
      return res.status(400).json({ message: "Неверный ID курса" });
    }
    
    const allProgress = await storage.getAllUserProgressForCourse(courseId);
    return res.status(200).json(allProgress);
  } catch (error) {
    console.error("Ошибка при получении прогресса всех пользователей:", error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

/**
 * Получение общего прогресса пользователя по всем курсам
 * GET /api/courses/progress/user
 */
courseProgressRouter.get("/progress/user", async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Вы не авторизованы" });
    }
    
    const userId = req.user.id;
    const userProgress = await storage.getUserCourseProgress(userId);
    
    return res.status(200).json(userProgress);
  } catch (error) {
    console.error("Ошибка при получении прогресса пользователя по всем курсам:", error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});

/**
 * Сброс прогресса пользователя по курсу
 * DELETE /api/courses/:courseId/progress
 */
courseProgressRouter.delete("/:courseId/progress", async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Вы не авторизованы" });
    }
    
    const userId = req.user.id;
    const courseId = Number(req.params.courseId);
    
    if (isNaN(courseId)) {
      return res.status(400).json({ message: "Неверный ID курса" });
    }
    
    // Сбрасываем прогресс, устанавливая его в 0
    const resetData = {
      progress: 0,
      completedModules: 0,
      startedAt: new Date(),
      lastAccessedAt: new Date(),
      completedAt: null
    };
    
    const updatedProgress = await storage.updateUserCourseProgress(
      userId,
      courseId,
      resetData
    );
    
    return res.status(200).json(updatedProgress);
  } catch (error) {
    console.error("Ошибка при сбросе прогресса курса:", error);
    return res.status(500).json({ message: "Ошибка сервера" });
  }
});
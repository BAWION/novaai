import { Router } from "express";
import { db } from "../db";
import { storage } from "../storage";
import { eq, and } from "drizzle-orm";
import { userCourseProgress, courses } from "@shared/schema";

const router = Router();

/**
 * GET /api/courses/user
 * Получение списка курсов пользователя (начатых или завершенных)
 */
router.get("/", async (req, res) => {
  try {
    // Проверка авторизации
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: "Требуется авторизация" });
    }
    
    const userId = req.user.id;
    
    // Получаем все курсы пользователя с прогрессом
    const userCourses = await db
      .select({
        courseId: userCourseProgress.courseId,
        progress: userCourseProgress.progress,
        completedModules: userCourseProgress.completedModules,
        startedAt: userCourseProgress.startedAt,
        lastAccessedAt: userCourseProgress.lastAccessedAt,
        completedAt: userCourseProgress.completedAt
      })
      .from(userCourseProgress)
      .where(eq(userCourseProgress.userId, userId));
    
    // Если у пользователя нет курсов, возвращаем пустой массив
    if (!userCourses || userCourses.length === 0) {
      return res.json([]);
    }
    
    // Получаем полную информацию о каждом курсе
    const courseData = await Promise.all(
      userCourses.map(async (progress) => {
        const course = await storage.getCourse(progress.courseId);
        
        if (!course) return null;
        
        // Объединяем информацию о курсе с прогрессом пользователя
        return {
          ...course,
          progress: progress.progress,
          completedModules: progress.completedModules,
          startedAt: progress.startedAt,
          lastAccessedAt: progress.lastAccessedAt,
          completedAt: progress.completedAt,
          // Добавляем статус курса
          status: progress.completedAt ? 'completed' : 'in-progress'
        };
      })
    );
    
    // Фильтруем null значения (курсы, которых больше нет)
    const validCourses = courseData.filter(course => course !== null);
    
    return res.json(validCourses);
  } catch (error) {
    console.error("Error fetching user courses:", error);
    return res.status(500).json({ error: "Ошибка сервера при получении курсов пользователя" });
  }
});

export default router;
import { Router } from "express";
import { db } from "../db";
import { storage } from "../storage";
import { eq } from "drizzle-orm";
import { userCourseProgress } from "@shared/schema";

const router = Router();

/**
 * GET /api/courses/user
 * Получение списка курсов, начатых или завершенных пользователем
 */
router.get("/", async (req, res) => {
  try {
    // Проверка аутентификации - это очень важно!
    if (!req.session || !req.session.user) {
      console.log("Неавторизованный доступ к /api/courses/user");
      return res.status(401).json({ error: "Требуется авторизация" });
    }
    
    const userId = req.session.user.id;
    
    // Получаем прогресс пользователя по курсам
    const userProgress = await db
      .select()
      .from(userCourseProgress)
      .where(eq(userCourseProgress.userId, userId));
    
    if (!userProgress || userProgress.length === 0) {
      // Пользователь еще не начал ни одного курса
      return res.json([]);
    }
    
    // Загружаем полную информацию о курсах
    const coursesWithProgress = await Promise.all(
      userProgress.map(async (progress) => {
        const course = await storage.getCourse(progress.courseId);
        if (!course) return null;
        
        // Формируем прогресс на основе имеющихся полей
        return {
          ...course,
          progress: {
            percentComplete: progress.progress || 0,
            completedModules: progress.completedModules || 0,
            startedAt: progress.startedAt || null,
            lastAccessed: progress.lastAccessedAt || null,
            completedAt: progress.completedAt || null,
            status: progress.completedAt ? "completed" : 
                   progress.progress > 0 ? "in_progress" : "not_started"
          }
        };
      })
    );
    
    // Фильтруем курсы, которые не были найдены
    const filteredCourses = coursesWithProgress.filter(course => course !== null);
    
    // Сортируем по последнему открытию (сначала недавние)
    filteredCourses.sort((a, b) => {
      const dateA = a.progress.lastAccessed ? new Date(a.progress.lastAccessed).getTime() : 0;
      const dateB = b.progress.lastAccessed ? new Date(b.progress.lastAccessed).getTime() : 0;
      return dateB - dateA;
    });
    
    return res.json(filteredCourses);
  } catch (error) {
    console.error("Error getting user courses:", error);
    return res.status(500).json({ error: "Ошибка сервера при получении курсов пользователя" });
  }
});

export default router;
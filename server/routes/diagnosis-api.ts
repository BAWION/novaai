/**
 * diagnosis-api.ts
 * API маршруты для работы с диагностикой и результатами Skills DNA
 */

import express, { Request, Response } from "express";
import { z } from "zod";
import { diagnosisService } from "../services/diagnosis-service";

const router = express.Router();

// Middleware для проверки аутентификации
const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const user = req.session.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

// Схема валидации для результатов диагностики
const diagnosisResultSchema = z.object({
  userId: z.number(),
  skills: z.record(z.string(), z.number().min(0).max(100)),
  diagnosticType: z.enum(["quick", "deep"]),
  metadata: z.any().optional()
});

/**
 * POST /api/diagnosis/results
 * Сохранение результатов диагностики в системе Skills DNA
 */
router.post("/results", async (req: Request, res: Response) => {
  try {
    console.log("[API] POST /api/diagnosis/results - Начало обработки запроса");
    
    // Проверка аутентификации с исчерпывающим выводом информации
    const user = req.session.user;
    if (!user) {
      console.error("[API] POST /api/diagnosis/results - Отказ: пользователь не авторизован", {
        sessionId: req.session.id,
        hasSession: !!req.session,
        sessionKeys: req.session ? Object.keys(req.session) : [],
      });
      
      return res.status(401).json({ 
        message: "Необходима авторизация для сохранения результатов диагностики",
        details: "Пожалуйста, войдите в систему и повторите попытку."
      });
    }
    
    console.log("[API] POST /api/diagnosis/results - Пользователь авторизован:", {
      userId: user.id,
      username: user.username
    });
    
    // Валидация данных запроса
    const validationResult = diagnosisResultSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      console.error("[API] POST /api/diagnosis/results - Некорректные данные диагностики:", {
        errors: validationResult.error.errors,
        receivedData: JSON.stringify(req.body).substring(0, 200) + "..."
      });
      
      return res.status(400).json({ 
        message: "Некорректные данные диагностики", 
        errors: validationResult.error.errors 
      });
    }
    
    const diagnosisResult = validationResult.data;
    console.log("[API] POST /api/diagnosis/results - Данные успешно прошли валидацию");
    
    // Если userId не передан, используем ID текущего пользователя
    if (!diagnosisResult.userId && req.session.user) {
      diagnosisResult.userId = req.session.user.id;
      console.log(`[API] POST /api/diagnosis/results - Использован ID пользователя из сессии: ${diagnosisResult.userId}`);
    }
    
    // Проверяем, что у нас есть ID пользователя
    if (!diagnosisResult.userId) {
      console.error("[API] POST /api/diagnosis/results - Отсутствует ID пользователя");
      return res.status(400).json({ message: "Отсутствует ID пользователя" });
    }
    
    // Проверяем доступ: пользователь может сохранять только свои данные
    if (user.id !== diagnosisResult.userId) {
      console.error("[API] POST /api/diagnosis/results - Попытка сохранить данные другого пользователя", {
        sessionUserId: user.id,
        requestedUserId: diagnosisResult.userId
      });
      
      return res.status(403).json({ 
        message: "Нет доступа для сохранения данных другого пользователя" 
      });
    }
    
    // Сохраняем результаты
    console.log("[API] POST /api/diagnosis/results - Передача данных в сервис диагностики");
    const result = await diagnosisService.saveResults(diagnosisResult);
    
    console.log("[API] POST /api/diagnosis/results - Результаты успешно сохранены");
    res.status(201).json({
      message: "Результаты диагностики успешно сохранены",
      data: result
    });
  } catch (error) {
    console.error("[API] POST /api/diagnosis/results - Ошибка при обработке:", error);
    res.status(500).json({ 
      message: "Ошибка сервера при обработке результатов диагностики",
      error: error instanceof Error ? error.message : "Неизвестная ошибка"
    });
  }
});

/**
 * GET /api/diagnosis/progress/:userId
 * Получение прогресса пользователя по компетенциям
 */
router.get("/progress/:userId", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Некорректный ID пользователя" });
    }
    
    // Проверяем доступ - пользователь может видеть только свой прогресс
    if (req.session.user && req.session.user.id !== userId) {
      return res.status(403).json({ message: "Недостаточно прав для просмотра прогресса другого пользователя" });
    }
    
    const progress = await diagnosisService.getUserDnaProgress(userId);
    
    res.json({
      data: progress
    });
  } catch (error) {
    console.error("Ошибка при получении прогресса пользователя:", error);
    res.status(500).json({ message: "Ошибка сервера при получении прогресса пользователя" });
  }
});

/**
 * GET /api/diagnosis/summary/:userId
 * Получение сводной информации о прогрессе пользователя
 */
router.get("/summary/:userId", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Некорректный ID пользователя" });
    }
    
    // Проверяем доступ - пользователь может видеть только свою сводку
    if (req.session.user && req.session.user.id !== userId) {
      return res.status(403).json({ message: "Недостаточно прав для просмотра сводки другого пользователя" });
    }
    
    const summary = await diagnosisService.getUserDnaSummary(userId);
    
    res.json({
      data: summary
    });
  } catch (error) {
    console.error("Ошибка при получении сводки прогресса пользователя:", error);
    res.status(500).json({ message: "Ошибка сервера при получении сводки прогресса пользователя" });
  }
});

export default router;
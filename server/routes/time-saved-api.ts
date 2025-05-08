/**
 * time-saved-api.ts
 * 
 * API маршруты для функциональности S4 (INSIGHT "Time-Saved")
 */

import { Router } from "express";
import { timeSavedService } from "../services/time-saved-service";
import { z } from "zod";

export const timeSavedRouter = Router();

// Схема для создания цели
const createGoalSchema = z.object({
  targetMinutesMonthly: z.number().positive("Целевое время должно быть положительным числом"),
  targetDate: z.string().refine((date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime()) && parsedDate > new Date();
  }, "Целевая дата должна быть корректным значением в будущем")
});

/**
 * Получение сводки по экономии времени пользователя
 * GET /api/time-saved/summary/:userId
 */
timeSavedRouter.get("/summary/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    // Проверка авторизации
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        message: "Не авторизован",
        details: "Для получения данных об экономии времени необходимо авторизоваться"
      });
    }
    
    // Если пользователь пытается получить данные другого пользователя
    if (req.user.id !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        message: "Доступ запрещен",
        details: "Вы можете просматривать только свои данные об экономии времени"
      });
    }
    
    const summary = await timeSavedService.getTimeSavedSummary(userId);
    res.status(200).json(summary);
  } catch (error) {
    console.error("Ошибка при получении сводки экономии времени:", error);
    res.status(500).json({
      message: "Ошибка сервера",
      details: "Не удалось получить данные об экономии времени"
    });
  }
});

/**
 * Принудительный пересчет экономии времени
 * POST /api/time-saved/recalculate/:userId
 */
timeSavedRouter.post("/recalculate/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    // Проверка авторизации
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        message: "Не авторизован",
        details: "Для пересчета экономии времени необходимо авторизоваться"
      });
    }
    
    // Если пользователь пытается пересчитать данные другого пользователя
    if (req.user.id !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        message: "Доступ запрещен",
        details: "Вы можете пересчитывать только свои данные об экономии времени"
      });
    }
    
    const summary = await timeSavedService.calculateTimeSaved(userId);
    res.status(200).json(summary);
  } catch (error) {
    console.error("Ошибка при пересчете экономии времени:", error);
    res.status(500).json({
      message: "Ошибка сервера",
      details: "Не удалось пересчитать данные об экономии времени"
    });
  }
});

/**
 * Получение истории экономии времени
 * GET /api/time-saved/history/:userId
 */
timeSavedRouter.get("/history/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 12;
    
    // Проверка авторизации
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        message: "Не авторизован",
        details: "Для получения истории экономии времени необходимо авторизоваться"
      });
    }
    
    // Если пользователь пытается получить данные другого пользователя
    if (req.user.id !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        message: "Доступ запрещен",
        details: "Вы можете просматривать только свою историю экономии времени"
      });
    }
    
    const history = await timeSavedService.getTimeSavedHistory(userId, limit);
    res.status(200).json(history);
  } catch (error) {
    console.error("Ошибка при получении истории экономии времени:", error);
    res.status(500).json({
      message: "Ошибка сервера",
      details: "Не удалось получить историю экономии времени"
    });
  }
});

/**
 * Создание новой цели по экономии времени
 * POST /api/time-saved/goals
 */
timeSavedRouter.post("/goals", async (req, res) => {
  try {
    // Проверка авторизации
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        message: "Не авторизован",
        details: "Для создания цели экономии времени необходимо авторизоваться"
      });
    }
    
    const userId = req.user.id;
    
    // Валидация входных данных
    const validationResult = createGoalSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        message: "Некорректные данные",
        details: validationResult.error.errors
      });
    }
    
    const { targetMinutesMonthly, targetDate } = validationResult.data;
    
    const newGoal = await timeSavedService.createTimeSavedGoal(
      userId,
      targetMinutesMonthly,
      targetDate
    );
    
    res.status(201).json(newGoal);
  } catch (error) {
    console.error("Ошибка при создании цели экономии времени:", error);
    res.status(500).json({
      message: "Ошибка сервера",
      details: "Не удалось создать цель экономии времени"
    });
  }
});

/**
 * Получение списка целей пользователя по экономии времени
 * GET /api/time-saved/goals/:userId
 */
timeSavedRouter.get("/goals/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    
    // Проверка авторизации
    if (!req.isAuthenticated()) {
      return res.status(401).json({
        message: "Не авторизован",
        details: "Для получения целей экономии времени необходимо авторизоваться"
      });
    }
    
    // Если пользователь пытается получить данные другого пользователя
    if (req.user.id !== userId && req.user.role !== "admin") {
      return res.status(403).json({
        message: "Доступ запрещен",
        details: "Вы можете просматривать только свои цели экономии времени"
      });
    }
    
    // Обновляем статус целей перед отправкой
    await timeSavedService.updateGoalsStatus(userId);
    
    const goals = await timeSavedService.getUserTimeSavedGoals(userId);
    res.status(200).json(goals);
  } catch (error) {
    console.error("Ошибка при получении целей экономии времени:", error);
    res.status(500).json({
      message: "Ошибка сервера",
      details: "Не удалось получить цели экономии времени"
    });
  }
});
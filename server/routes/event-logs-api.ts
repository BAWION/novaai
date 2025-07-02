/**
 * Event Logs API
 * API для записи и получения событий для аналитики и метрик
 */

import express from "express";
import { z } from "zod";

const router = express.Router();

// Схема для валидации событий
const eventSchema = z.object({
  eventType: z.string(),
  data: z.record(z.any()).optional(),
  userId: z.number().optional()
});

/**
 * Записать событие
 * POST /api/events
 */
router.post("/", async (req, res) => {
  try {
    // Защита от некорректного JSON
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (jsonError) {
        console.error("JSON parsing error in events:", jsonError, "Body:", body);
        return res.status(400).json({ 
          message: "Некорректный JSON в запросе" 
        });
      }
    }
    
    // Валидация данных
    const validatedData = eventSchema.parse(body);
    
    // Логируем событие в консоль для отладки
    console.log("📊 Event logged:", {
      type: validatedData.eventType,
      data: validatedData.data,
      timestamp: new Date().toISOString()
    });
    
    // Возвращаем успешный ответ
    res.status(201).json({ 
      message: "Event logged successfully",
      id: Date.now(),
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Некорректные данные события", 
        errors: error.errors 
      });
    }
    
    console.error("Ошибка при записи события:", error);
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
});

/**
 * Получить список событий
 * GET /api/events
 */
router.get("/", async (req, res) => {
  try {
    // Простая заглушка для получения событий
    // В будущем здесь может быть подключение к базе данных
    res.json([]);
  } catch (error) {
    console.error("Ошибка при получении событий:", error);
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
});

/**
 * Получить статистику по событиям
 * GET /api/events/stats
 */
router.get("/stats", async (req, res) => {
  try {
    // Базовая статистика
    res.json({ 
      message: "Event stats",
      totalEvents: 0,
      recentEvents: 0,
      topEventTypes: []
    });
  } catch (error) {
    console.error("Ошибка при получении статистики событий:", error);
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
});

export default router;
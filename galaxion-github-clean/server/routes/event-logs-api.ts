/**
 * Event Logs API
 * API для записи и получения событий для аналитики и метрик
 */

import express from "express";
import { integratedStorage } from "../storage-integration";
import { z } from "zod";
import { insertEventLogSchema } from "@shared/schema";

const router = express.Router();

/**
 * Записать событие
 * POST /api/events
 */
router.post("/", async (req, res) => {
  try {
    const eventData = insertEventLogSchema.parse(req.body);
    
    // Используем userId из сессии, если он не указан
    if (!eventData.userId && req.user) {
      eventData.userId = req.user.id;
    }
    
    const event = await integratedStorage.logEvent(eventData);
    res.status(201).json(event);
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
 * Получить список событий (с фильтрацией)
 * GET /api/events
 */
router.get("/", async (req, res) => {
  try {
    // Проверка авторизации - только авторизованные пользователи могут получать события
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Не авторизован" });
    }
    
    // Параметры запроса
    const params: {
      userId?: number;
      eventType?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
    } = {};
    
    // Конвертируем параметры запроса
    if (req.query.userId) {
      params.userId = parseInt(req.query.userId as string);
    }
    
    if (req.query.eventType) {
      params.eventType = req.query.eventType as string;
    }
    
    if (req.query.startDate) {
      params.startDate = new Date(req.query.startDate as string);
    }
    
    if (req.query.endDate) {
      params.endDate = new Date(req.query.endDate as string);
    }
    
    if (req.query.limit) {
      params.limit = parseInt(req.query.limit as string);
    }
    
    if (req.query.offset) {
      params.offset = parseInt(req.query.offset as string);
    }
    
    // Для обычных пользователей ограничиваем видимость только их собственными данными,
    // для администраторов разрешаем просмотр всех данных
    if (req.user.role !== 'admin' && params.userId !== req.user.id) {
      params.userId = req.user.id;
    }
    
    const events = await integratedStorage.getEvents(params);
    res.json(events);
  } catch (error) {
    console.error("Ошибка при получении списка событий:", error);
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
});

/**
 * Получить статистику по событиям
 * GET /api/events/stats
 */
router.get("/stats", async (req, res) => {
  try {
    // Проверка авторизации - только администраторы могут получать статистику
    if (!req.isAuthenticated() || req.user.role !== 'admin') {
      return res.status(403).json({ message: "Недостаточно прав" });
    }
    
    const eventType = req.query.eventType as string;
    if (!eventType) {
      return res.status(400).json({ message: "Параметр eventType обязателен" });
    }
    
    const timeframe = (req.query.timeframe as string) || 'day';
    if (!['day', 'week', 'month'].includes(timeframe)) {
      return res.status(400).json({ message: "Параметр timeframe должен быть одним из: day, week, month" });
    }
    
    let startDate: Date | undefined;
    let endDate: Date | undefined;
    
    if (req.query.startDate) {
      startDate = new Date(req.query.startDate as string);
    }
    
    if (req.query.endDate) {
      endDate = new Date(req.query.endDate as string);
    }
    
    const stats = await integratedStorage.getEventStats(
      eventType,
      timeframe as 'day' | 'week' | 'month',
      startDate,
      endDate
    );
    
    res.json(stats);
  } catch (error) {
    console.error("Ошибка при получении статистики событий:", error);
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
});

export default router;
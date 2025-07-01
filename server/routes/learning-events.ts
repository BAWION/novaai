import { Request, Response, Router } from "express";
import { z } from "zod";
import { insertLearningEventSchema, insertLearningSessionSchema } from "@shared/schema";
import { storage } from "../storage";
import { v4 as uuidv4 } from "uuid";

// Схема валидации для события обучения
const learningEventSchema = insertLearningEventSchema
  .extend({
    sessionId: z.string().optional()
  });

// Схема валидации для запроса на создание сессии
const createSessionSchema = z.object({
  device: z.string().optional(),
  platform: z.string().optional(),
  userAgent: z.string().optional(),
  ipAddress: z.string().optional()
});

export const learningEventsRouter = Router();

// Создание новой сессии обучения
learningEventsRouter.post("/session/start", async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Не авторизован" });
    }
    
    const sessionData = createSessionSchema.parse(req.body);
    const userId = req.user.id;
    const sessionId = uuidv4();
    
    const session = await storage.createLearningSession({
      userId,
      sessionId,
      device: sessionData.device || null,
      platform: sessionData.platform || null, 
      userAgent: sessionData.userAgent || req.headers["user-agent"] || null,
      ipAddress: sessionData.ipAddress || req.ip || null,
    });
    
    // Сохраняем sessionId в сессии для переиспользования
    req.session.learningSessionId = sessionId;
    
    return res.status(201).json({
      sessionId: session.sessionId,
      startedAt: session.startedAt
    });
  } catch (error) {
    console.error("Error creating learning session:", error);
    return res.status(400).json({ 
      message: "Ошибка при создании сессии", 
      error: error.message 
    });
  }
});

// Завершение сессии обучения
learningEventsRouter.post("/session/end", async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Не авторизован" });
    }
    
    const sessionId = req.session.learningSessionId || req.body.sessionId;
    
    if (!sessionId) {
      return res.status(400).json({ message: "ID сессии не указан" });
    }
    
    const session = await storage.getLearningSession(sessionId);
    
    if (!session) {
      return res.status(404).json({ message: "Сессия не найдена" });
    }
    
    if (session.userId !== req.user.id) {
      return res.status(403).json({ message: "Доступ запрещен" });
    }
    
    const endedAt = new Date();
    const startedAt = session.startedAt;
    const totalDuration = Math.floor((endedAt.getTime() - startedAt.getTime()) / 1000);
    
    const updatedSession = await storage.updateLearningSession(sessionId, {
      endedAt,
      totalDuration
    });
    
    // Удаляем sessionId из сессии
    delete req.session.learningSessionId;
    
    return res.status(200).json({
      sessionId: updatedSession.sessionId,
      totalDuration: updatedSession.totalDuration,
      endedAt: updatedSession.endedAt
    });
  } catch (error) {
    console.error("Error ending learning session:", error);
    return res.status(400).json({ 
      message: "Ошибка при завершении сессии", 
      error: error.message 
    });
  }
});

// Запись события обучения
learningEventsRouter.post("/record", async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Не авторизован" });
    }
    
    const eventData = learningEventSchema.parse(req.body);
    const userId = req.user.id;
    
    // Используем текущую сессию или создаем временный ID
    const sessionId = req.session.learningSessionId || eventData.sessionId || `temp-${uuidv4()}`;
    
    const event = await storage.saveLearningEvent({
      userId,
      eventType: eventData.eventType,
      entityType: eventData.entityType,
      entityId: eventData.entityId,
      data: eventData.data || null,
      duration: eventData.duration || null,
      sessionId
    });
    
    return res.status(201).json(event);
  } catch (error) {
    console.error("Error recording learning event:", error);
    return res.status(400).json({ 
      message: "Ошибка при записи события", 
      error: error.message 
    });
  }
});

// Получение событий обучения пользователя
learningEventsRouter.get("/", async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Не авторизован" });
    }
    
    const userId = req.user.id;
    const { 
      eventType, 
      entityType, 
      entityId, 
      startDate, 
      endDate, 
      limit 
    } = req.query;
    
    const params: any = {};
    
    if (eventType) params.eventType = String(eventType);
    if (entityType) params.entityType = String(entityType);
    if (entityId) params.entityId = Number(entityId);
    if (startDate) params.startDate = new Date(String(startDate));
    if (endDate) params.endDate = new Date(String(endDate));
    if (limit) params.limit = Number(limit);
    
    const events = await storage.getLearningEvents(userId, params);
    
    return res.status(200).json(events);
  } catch (error) {
    console.error("Error getting learning events:", error);
    return res.status(400).json({ 
      message: "Ошибка при получении событий", 
      error: error.message 
    });
  }
});

// Получение временной шкалы обучения пользователя
learningEventsRouter.get("/timeline", async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Не авторизован" });
    }
    
    const userId = req.user.id;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    
    const timeline = await storage.getUserLearningTimeline(userId, limit);
    
    return res.status(200).json(timeline);
  } catch (error) {
    console.error("Error getting learning timeline:", error);
    return res.status(400).json({ 
      message: "Ошибка при получении временной шкалы", 
      error: error.message 
    });
  }
});
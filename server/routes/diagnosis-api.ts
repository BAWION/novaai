/**
 * diagnosis-api.ts
 * API маршруты для работы с диагностикой и результатами Skills DNA
 */

import express, { Request, Response } from "express";
import { z } from "zod";
import { diagnosisService } from "../services/diagnosis-service";
import { authMiddleware, optionalAuthMiddleware } from "../auth-middleware";
import { storage } from "../storage";

const router = express.Router();

// Специализированное middleware для проверки аутентификации с поддержкой демо-режима (ID 999)
const demoAuthMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Для API диагностики проверяем специальный случай - демо-пользователь с ID 999
  const isDemo = req.body?.userId === 999 || req.params?.userId === '999';

  if (isDemo) {
    console.log(`[DiagnosisAPI] Пропускаем проверку аутентификации для демо-режима (ID 999)`);
    return next();
  }
  
  // Проверяем конфликты идентификации
  const requestUserId = req.body?.userId || (req.params?.userId ? parseInt(req.params.userId) : null);
  const sessionId = req.sessionID ? req.sessionID.substring(0, 8) + '...' : 'none';
  
  // Обычная проверка аутентификации с расширенной обработкой сессии
  let user = req.session?.user;
  let authenticated = req.session?.authenticated;
  
  console.log(`[DiagnosisAPI] Проверка аутентификации для сессии ${sessionId}:`, {
    hasSession: !!req.session,
    sessionId: req.sessionID,
    hasUser: !!user,
    authenticated,
    requestUserId,
    sessionUserId: user?.id,
    path: req.path,
    method: req.method
  });

  // Попытка восстановления сессии если есть userId но нет данных пользователя
  if ((!user || !authenticated) && requestUserId && req.session) {
    try {
      const userData = await storage.getUser(requestUserId);
      
      if (userData) {
        console.log(`[DiagnosisAPI] Восстанавливаем сессию для пользователя ${requestUserId}`);
        
        req.session.user = userData;
        req.session.authenticated = true;
        req.session.lastActivity = new Date().toISOString();
        
        console.log(`[DiagnosisAPI] Сессия успешно восстановлена`);
        
        // Обновляем локальные переменные после восстановления
        user = userData;
        authenticated = true;
      }
    } catch (recoveryError) {
      console.warn(`[DiagnosisAPI] Ошибка восстановления сессии:`, recoveryError);
    }
  }

  // Если в запросе указан userId и он не совпадает с ID пользователя в сессии
  if (requestUserId && user && user.id !== requestUserId) {
    console.log(`[DiagnosisAPI] Конфликт идентификации пользователя: ${user.id} (сессия) vs ${requestUserId} (запрос)`);
    
    // Предлагаем перейти в демо-режим
    return res.status(403).json({
      message: "Конфликт идентификации пользователя",
      code: "ID_CONFLICT",
      details: "ID пользователя в запросе не совпадает с ID пользователя в сессии",
      suggestion: "Используйте userId=999 для работы в демо-режиме без авторизации"
    });
  }

  if (!user || !authenticated) {
    console.log(`[DiagnosisAPI] Отказ в доступе: пользователь не авторизован (сессия ${sessionId})`);
    
    // Сохраняем информацию об ошибке в сессию для клиента
    if (req.session) {
      req.session.authError = "diagnosis_api_auth_required";
      req.session.save();
    }
    
    return res.status(401).json({
      message: "Необходима авторизация",
      code: "AUTH_REQUIRED",
      details: "Для доступа к API диагностики требуется авторизация",
      suggestion: "Используйте userId=999 для работы в демо-режиме без авторизации",
      cachedData: true // Указываем что данные нужно кэшировать
    });
  }

  // Пользователь аутентифицирован - обновляем информацию о времени последней активности
  req.session.lastActivity = new Date().toISOString();
  req.session.save();

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
 * Для пользователя с ID 999 (админ/демо) авторизация не требуется
 */
router.post("/results", demoAuthMiddleware, async (req: Request, res: Response) => {
  try {
    console.log("[API] POST /api/diagnosis/results - Начало обработки запроса");
    
    // Проверка является ли запрос для специального пользователя с ID 999 (админ/демо)
    const isDemo = req.body.userId === 999;
    
    // Улучшенная проверка аутентификации с исчерпывающим выводом информации
    const user = req.session?.user;
    
    // Расширенное логирование всей сессии для отладки
    console.log("[API] POST /api/diagnosis/results - Детали сессии:", {
      hasSession: !!req.session,
      sessionId: req.session?.id,
      authenticated: req.session?.authenticated,
      sessionKeys: req.session ? Object.keys(req.session) : [],
      cookiePresent: !!req.headers.cookie,
      cookieHeader: req.headers.cookie?.substring(0, 50) + '...',
      isDemo
    });
    
    if (!user && !isDemo) {
      console.error("[API] POST /api/diagnosis/results - Отказ: пользователь не авторизован");
      
      return res.status(401).json({ 
        message: "Необходима авторизация для сохранения результатов диагностики",
        details: "Пожалуйста, войдите в систему и повторите попытку."
      });
    }
    
    // Для демо-режима (userId: 999) добавляем виртуального пользователя в контекст
    if (isDemo && !user) {
      console.log("[API] POST /api/diagnosis/results - Используется демо-режим для пользователя 999");
    }
    
    if (user) {
      console.log("[API] POST /api/diagnosis/results - Пользователь авторизован:", {
        userId: user.id,
        username: user.username
      });
    }
    
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
    // Для демо-пользователя (ID 999) проверка пропускается
    if (user && user.id !== diagnosisResult.userId && diagnosisResult.userId !== 999) {
      console.error("[API] POST /api/diagnosis/results - Попытка сохранить данные другого пользователя", {
        sessionUserId: user.id,
        requestedUserId: diagnosisResult.userId
      });
      
      return res.status(403).json({ 
        message: "Нет доступа для сохранения данных другого пользователя",
        code: "ID_CONFLICT" 
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
 * Для пользователя с ID 999 (админ/демо) авторизация не требуется
 */
router.get("/progress/:userId", demoAuthMiddleware, async (req: Request, res: Response) => {
  try {
    console.log(`[API] GET /api/diagnosis/progress/:userId - Начало обработки запроса`);
    
    // Преобразуем параметр в число
    const userId = parseInt(req.params.userId);
    
    // Проверка является ли запрос для специального пользователя с ID 999 (админ/демо)
    const isDemo = userId === 999;
    
    // Проверка аутентификации
    const user = req.session.user;
    if (!user && !isDemo) {
      console.error("[API] GET /api/diagnosis/progress/:userId - Отказ: пользователь не авторизован", {
        sessionId: req.session.id,
        hasSession: !!req.session,
        isDemo
      });
      
      return res.status(401).json({ 
        message: "Необходима авторизация для просмотра прогресса",
        details: "Пожалуйста, войдите в систему и повторите попытку."
      });
    }
    
    // Для демо-режима (userId: 999) добавляем логирование
    if (isDemo && !user) {
      console.log(`[API] GET /api/diagnosis/progress/:userId - Используется демо-режим для пользователя 999`);
    }
    
    console.log(`[API] GET /api/diagnosis/progress/:userId - Запрошен прогресс для пользователя ${userId}`, {
      requestingUser: user?.id || 'demo',
    });
    
    if (isNaN(userId)) {
      console.error(`[API] GET /api/diagnosis/progress/:userId - Некорректный ID пользователя: ${req.params.userId}`);
      return res.status(400).json({ message: "Некорректный ID пользователя" });
    }
    
    // Проверяем доступ - пользователь может видеть только свой прогресс
    // Для демо-пользователя (ID 999) проверка пропускается
    if (user && user.id !== userId && userId !== 999) {
      console.error(`[API] GET /api/diagnosis/progress/:userId - Отказ в доступе: попытка просмотра чужого прогресса`, {
        requestingUser: user.id,
        requestedUserId: userId
      });
      
      return res.status(403).json({ 
        message: "Недостаточно прав для просмотра прогресса другого пользователя",
        code: "ID_CONFLICT"
      });
    }
    
    console.log(`[API] GET /api/diagnosis/progress/:userId - Передача запроса в сервис`);
    const progress = await diagnosisService.getUserDnaProgress(userId);
    
    console.log(`[API] GET /api/diagnosis/progress/:userId - Получены данные прогресса, найдено ${progress.length} записей`);
    res.json({
      data: progress
    });
  } catch (error) {
    console.error(`[API] GET /api/diagnosis/progress/:userId - Ошибка при обработке:`, error);
    res.status(500).json({ 
      message: "Ошибка сервера при получении прогресса пользователя",
      error: error instanceof Error ? error.message : "Неизвестная ошибка"
    });
  }
});

/**
 * GET /api/diagnosis/summary/:userId
 * Получение сводной информации о прогрессе пользователя
 * Для пользователя с ID 999 (админ/демо) авторизация не требуется
 */
router.get("/summary/:userId", demoAuthMiddleware, async (req: Request, res: Response) => {
  try {
    console.log(`[API] GET /api/diagnosis/summary/:userId - Начало обработки запроса`);
    
    // Преобразуем параметр в число
    const userId = parseInt(req.params.userId);
    
    // Проверка является ли запрос для специального пользователя с ID 999 (админ/демо)
    const isDemo = userId === 999;
    
    // Проверка аутентификации
    const user = req.session.user;
    if (!user && !isDemo) {
      console.error("[API] GET /api/diagnosis/summary/:userId - Отказ: пользователь не авторизован", {
        sessionId: req.session.id,
        hasSession: !!req.session,
        isDemo
      });
      
      return res.status(401).json({ 
        message: "Необходима авторизация для просмотра сводки",
        details: "Пожалуйста, войдите в систему и повторите попытку."
      });
    }
    
    // Для демо-режима (userId: 999) добавляем логирование
    if (isDemo && !user) {
      console.log(`[API] GET /api/diagnosis/summary/:userId - Используется демо-режим для пользователя 999`);
    }
    
    console.log(`[API] GET /api/diagnosis/summary/:userId - Запрошена сводка для пользователя ${userId}`, {
      requestingUser: user?.id || 'demo',
    });
    
    if (isNaN(userId)) {
      console.error(`[API] GET /api/diagnosis/summary/:userId - Некорректный ID пользователя: ${req.params.userId}`);
      return res.status(400).json({ message: "Некорректный ID пользователя" });
    }
    
    // Проверяем доступ - пользователь может видеть только свою сводку
    // Для демо-пользователя (ID 999) проверка пропускается
    if (user && user.id !== userId && userId !== 999) {
      console.error(`[API] GET /api/diagnosis/summary/:userId - Отказ в доступе: попытка просмотра чужой сводки`, {
        requestingUser: user.id,
        requestedUserId: userId
      });
      
      return res.status(403).json({ 
        message: "Недостаточно прав для просмотра сводки другого пользователя",
        code: "ID_CONFLICT"
      });
    }
    
    console.log(`[API] GET /api/diagnosis/summary/:userId - Передача запроса в сервис`);
    const summary = await diagnosisService.getUserDnaSummary(userId);
    
    console.log(`[API] GET /api/diagnosis/summary/:userId - Получены данные сводки:`, {
      categoryCount: Object.keys(summary).length,
      categories: Object.keys(summary).join(', ')
    });
    
    res.json({
      data: summary
    });
  } catch (error) {
    console.error(`[API] GET /api/diagnosis/summary/:userId - Ошибка при обработке:`, error);
    res.status(500).json({ 
      message: "Ошибка сервера при получении сводки прогресса пользователя",
      error: error instanceof Error ? error.message : "Неизвестная ошибка"
    });
  }
});

/**
 * POST /api/diagnosis/initialize-demo
 * Инициализирует демо-данные для пользователя с ID 999
 * Этот эндпоинт открыт без авторизации для демонстрационных целей
 */
router.post("/initialize-demo", optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    console.log(`[API] POST /api/diagnosis/initialize-demo - Начало обработки запроса`);
    
    // Инициализируем демо-данные
    const result = await diagnosisService.initializeDemoData();
    
    console.log(`[API] POST /api/diagnosis/initialize-demo - Демо-данные успешно инициализированы`);
    res.status(200).json({
      message: "Демо-данные успешно инициализированы",
      data: result
    });
  } catch (error) {
    console.error(`[API] POST /api/diagnosis/initialize-demo - Ошибка при обработке:`, error);
    res.status(500).json({ 
      message: "Ошибка сервера при инициализации демо-данных",
      error: error instanceof Error ? error.message : "Неизвестная ошибка"
    });
  }
});

export default router;
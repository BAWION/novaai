/**
 * diagnosis-api.ts
 * API маршруты для работы с диагностикой и результатами Skills DNA
 */

import { Router, Request, Response } from "express";
import { diagnosisService } from "../services/diagnosis-service";
import { authMiddleware } from "../middleware/auth-middleware";
import { z } from "zod";

const router = Router();

// Схема для валидации запроса сохранения результатов диагностики
const saveResultsSchema = z.object({
  userId: z.number().int().positive(),
  skills: z.record(z.string(), z.number().min(0).max(100)),
  diagnosticType: z.enum(['quick', 'deep']),
  metadata: z.any().optional(),
});

/**
 * POST /api/diagnosis/results
 * Сохранение результатов диагностики в системе Skills DNA
 */
router.post("/results", authMiddleware, async (req: Request, res: Response) => {
  try {
    // Проверяем валидность данных
    const validationResult = saveResultsSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Некорректные данные",
        errors: validationResult.error.errors,
      });
    }

    // Проверяем, что пользователь сохраняет свои данные или является администратором
    const userId = validationResult.data.userId;
    if (req.user && req.user.id !== userId && req.user.id !== 999) {
      return res.status(403).json({
        success: false,
        message: "У вас нет прав для изменения данных другого пользователя",
      });
    }

    // Сохраняем результаты диагностики
    const result = await diagnosisService.saveResults(validationResult.data);

    return res.status(200).json({
      success: true,
      message: "Результаты диагностики успешно сохранены",
      data: result,
    });
  } catch (error) {
    console.error("Ошибка при сохранении результатов диагностики:", error);
    return res.status(500).json({
      success: false,
      message: "Внутренняя ошибка сервера при сохранении результатов диагностики",
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
      return res.status(400).json({
        success: false,
        message: "Некорректный ID пользователя",
      });
    }

    // Проверяем, что пользователь запрашивает свои данные или является администратором
    if (req.user && req.user.id !== userId && req.user.id !== 999) {
      return res.status(403).json({
        success: false,
        message: "У вас нет прав для просмотра данных другого пользователя",
      });
    }

    // Получаем прогресс пользователя
    const progressData = await diagnosisService.getUserDnaProgress(userId);

    return res.status(200).json({
      success: true,
      data: progressData,
    });
  } catch (error) {
    console.error("Ошибка при получении прогресса пользователя:", error);
    return res.status(500).json({
      success: false,
      message: "Внутренняя ошибка сервера при получении прогресса пользователя",
    });
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
      return res.status(400).json({
        success: false,
        message: "Некорректный ID пользователя",
      });
    }

    // Проверяем, что пользователь запрашивает свои данные или является администратором
    if (req.user && req.user.id !== userId && req.user.id !== 999) {
      return res.status(403).json({
        success: false,
        message: "У вас нет прав для просмотра данных другого пользователя",
      });
    }

    // Получаем сводную информацию
    const summaryData = await diagnosisService.getUserDnaSummary(userId);

    return res.status(200).json({
      success: true,
      data: summaryData,
    });
  } catch (error) {
    console.error("Ошибка при получении сводки прогресса пользователя:", error);
    return res.status(500).json({
      success: false,
      message: "Внутренняя ошибка сервера при получении сводки прогресса пользователя",
    });
  }
});

export default router;
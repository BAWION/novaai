/**
 * gap-analysis-api.ts
 * API для анализа пробелов в знаниях пользователя
 */

import express, { Request, Response } from "express";
import { gapAnalysisService } from "../services/gap-analysis-service";

// Создаем роутер для API анализа пробелов
const router = express.Router();

/**
 * Получить все пробелы в знаниях пользователя
 * GET /api/gap-analysis/gaps/:userId
 */
router.get("/gaps/:userId", async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Некорректный ID пользователя" });
    }
    
    const gaps = await gapAnalysisService.getUserSkillGaps(userId);
    return res.status(200).json(gaps);
  } catch (error) {
    console.error("Ошибка при получении пробелов в знаниях:", error);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

/**
 * Запустить анализ пробелов для пользователя
 * POST /api/gap-analysis/analyze/:userId
 */
router.post("/analyze/:userId", async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Некорректный ID пользователя" });
    }
    
    const gaps = await gapAnalysisService.performGapAnalysis(userId);
    return res.status(200).json(gaps);
  } catch (error) {
    console.error("Ошибка при выполнении анализа пробелов:", error);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

/**
 * Получить рекомендации курсов на основе пробелов в знаниях
 * GET /api/gap-analysis/recommendations/:userId
 */
router.get("/recommendations/:userId", async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Некорректный ID пользователя" });
    }
    
    const recommendedCourseIds = await gapAnalysisService.recommendCoursesByGaps(userId);
    return res.status(200).json({ recommendedCourseIds });
  } catch (error) {
    console.error("Ошибка при получении рекомендаций курсов:", error);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

/**
 * Добавить тестовые данные для разработки (временный эндпоинт)
 * POST /api/gap-analysis/seed-test-data
 */
router.post("/seed-test-data", async (req: Request, res: Response) => {
  try {
    await gapAnalysisService.seedTestSkillData();
    return res.status(200).json({ message: "Тестовые данные успешно созданы" });
  } catch (error) {
    console.error("Ошибка при создании тестовых данных:", error);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

export default router;
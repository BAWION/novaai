/**
 * ab-test.ts
 * API маршруты для работы с AB-тестированием
 */

import { Router } from "express";
import { Request, Response } from "express";
import { mlService } from "../services/ml-service-provider";

export const abTestRouter = Router();

/**
 * Проверка, находится ли пользователь в экспериментальной группе
 * GET /api/ab-test/:experimentName
 */
abTestRouter.get("/:experimentName", async (req: Request, res: Response) => {
  try {
    // Получаем ID пользователя из сессии
    const userId = req.session?.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const experimentName = req.params.experimentName;
    
    // Проверяем, находится ли пользователь в экспериментальной группе
    const isInExperiment = await mlService.storage.isUserInABTestGroup(
      userId,
      experimentName
    );
    
    res.json({ 
      experimentName, 
      isInExperimentGroup: isInExperiment 
    });
  } catch (error) {
    console.error("Error checking AB test status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * Регистрация события взаимодействия пользователя с экспериментальным элементом
 * POST /api/ab-test/:experimentName/event
 */
abTestRouter.post("/:experimentName/event", async (req: Request, res: Response) => {
  try {
    // Получаем ID пользователя из сессии
    const userId = req.session?.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const experimentName = req.params.experimentName;
    const { eventType, metadata } = req.body;
    
    // Записываем событие взаимодействия
    await mlService.storage.logABTestEvent(
      userId,
      experimentName,
      eventType,
      metadata
    );
    
    res.status(201).json({ success: true });
  } catch (error) {
    console.error("Error logging AB test event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * Получение информации о всех активных экспериментах для пользователя
 * GET /api/ab-test
 */
abTestRouter.get("/", async (req: Request, res: Response) => {
  try {
    // Получаем ID пользователя из сессии
    const userId = req.session?.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Получаем список всех активных экспериментов
    const experiments = await mlService.storage.getActiveABTests();
    
    // Проверяем, в какие группы входит пользователь
    const userExperiments = await Promise.all(
      experiments.map(async (experiment) => {
        const isInExperiment = await mlService.storage.isUserInABTestGroup(
          userId,
          experiment.name
        );
        
        return {
          name: experiment.name,
          description: experiment.description,
          isEnabled: experiment.isEnabled,
          isInExperimentGroup: isInExperiment
        };
      })
    );
    
    res.json({ experiments: userExperiments });
  } catch (error) {
    console.error("Error getting user's AB tests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Ручная установка флага для тестирования
abTestRouter.post("/set-flag", async (req: Request, res: Response) => {
  try {
    const { experimentName, userId, value } = req.body;
    
    // Проверяем входные данные
    if (!experimentName || !userId) {
      return res.status(400).json({ message: "Missing required parameters" });
    }
    
    // Устанавливаем значение флага
    await mlService.storage.setABTestFlag(userId, experimentName, value === true);
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error setting AB test flag:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Создание нового эксперимента
abTestRouter.post("/create", async (req: Request, res: Response) => {
  try {
    const { name, description, isEnabled } = req.body;
    
    // Проверяем входные данные
    if (!name) {
      return res.status(400).json({ message: "Missing experiment name" });
    }
    
    // Создаем новый эксперимент
    await mlService.storage.createABTest(name, description, isEnabled !== false);
    
    res.status(201).json({ success: true });
  } catch (error) {
    console.error("Error creating AB test:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Получение статистики по эксперименту
abTestRouter.get("/:experimentName/stats", async (req: Request, res: Response) => {
  try {
    const experimentName = req.params.experimentName;
    
    // Получаем статистику по эксперименту
    const stats = await mlService.storage.getABTestStats(experimentName);
    
    res.json(stats);
  } catch (error) {
    console.error("Error getting AB test stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Обновление конфигурации эксперимента
abTestRouter.patch("/:experimentName/config", async (req: Request, res: Response) => {
  try {
    const experimentName = req.params.experimentName;
    const { isEnabled, description, config } = req.body;
    
    // Получаем текущую конфигурацию
    const currentConfig = await mlService.storage.getABTestConfig(experimentName);
    
    if (!currentConfig) {
      return res.status(404).json({ message: "Experiment not found" });
    }
    
    // Обновляем конфигурацию
    const updatedConfig = {
      ...currentConfig,
      isEnabled: isEnabled !== undefined ? isEnabled : currentConfig.isEnabled,
      description: description || currentConfig.description,
      config: config || currentConfig.config
    };
    
    await mlService.storage.updateABTest(
      experimentName, 
      updatedConfig.description, 
      updatedConfig.isEnabled,
      updatedConfig.config
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error updating AB test config:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Экспорт маршрутизатора
export default abTestRouter;
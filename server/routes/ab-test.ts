/**
 * ab-test.ts
 * API маршруты для работы с AB-тестированием
 */

import { Router } from "express";
import { storage } from "../storage";
import { mlService } from "../services/ml-service-provider";

export const abTestRouter = Router();

/**
 * Проверка, находится ли пользователь в экспериментальной группе
 * GET /api/ab-test/:experimentName
 */
abTestRouter.get("/:experimentName", async (req, res) => {
  try {
    // Проверяем аутентификацию
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { experimentName } = req.params;
    const userId = req.user!.id;

    // Проверка, включено ли AB-тестирование
    const isABTestingEnabled = await mlService.isFeatureEnabled("ab_testing", userId);
    if (!isABTestingEnabled) {
      return res.json({
        experimentName,
        inExperimentGroup: false,
        isActive: false,
        reason: "ab_testing disabled"
      });
    }

    // Получаем конфигурацию эксперимента
    const experimentConfig = await mlService.getABTestConfig(experimentName);
    if (!experimentConfig || !experimentConfig.isActive) {
      return res.json({
        experimentName,
        inExperimentGroup: false,
        isActive: false,
        reason: "experiment not found or inactive"
      });
    }

    // Проверяем, находится ли пользователь в экспериментальной группе
    const inExperimentGroup = await mlService.isUserInABTestGroup(userId, experimentName);

    // Логируем информацию о проверке AB-теста
    await mlService.logUserActivity(
      userId,
      "ab_test_check",
      "experiment",
      0,
      {
        experimentName,
        inExperimentGroup,
        timestamp: new Date().toISOString()
      }
    );

    return res.json({
      experimentName,
      inExperimentGroup,
      isActive: true,
      groupPercentage: experimentConfig.experimentGroupPercentage
    });
  } catch (error) {
    console.error("Error checking AB test:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Регистрация события взаимодействия пользователя с экспериментальным элементом
 * POST /api/ab-test/:experimentName/event
 */
abTestRouter.post("/:experimentName/event", async (req, res) => {
  try {
    // Проверяем аутентификацию
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { experimentName } = req.params;
    const { eventType, elementId, metadata } = req.body;
    const userId = req.user!.id;

    // Проверяем обязательные поля
    if (!eventType) {
      return res.status(400).json({ error: "eventType is required" });
    }

    // Проверка, находится ли пользователь в эксперименте
    const inExperimentGroup = await mlService.isUserInABTestGroup(userId, experimentName);

    // Логируем событие взаимодействия
    await mlService.logUserActivity(
      userId,
      eventType,
      "experiment",
      elementId || 0,
      {
        experimentName,
        inExperimentGroup,
        timestamp: new Date().toISOString(),
        ...metadata
      }
    );

    // Также записываем событие обучения для анализа
    await mlService.recordLearningEvent(
      userId,
      "ab_test_interaction",
      "experiment",
      0,
      {
        experimentName,
        eventType,
        elementId,
        inExperimentGroup,
        timestamp: new Date().toISOString(),
        ...metadata
      }
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error recording AB test event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Получение информации о всех активных экспериментах для пользователя
 * GET /api/ab-test
 */
abTestRouter.get("/", async (req, res) => {
  try {
    // Проверяем аутентификацию
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user!.id;

    // Проверка, включено ли AB-тестирование
    const isABTestingEnabled = await mlService.isFeatureEnabled("ab_testing", userId);
    if (!isABTestingEnabled) {
      return res.json({
        experiments: [],
        inAnyExperiment: false
      });
    }

    // Получаем все feature flags, начинающиеся с ab_test_
    const allFlags = await mlService.getAllFeatureFlags();
    const abTestFlags = allFlags.filter(flag => 
      flag.name.startsWith('ab_test_') && 
      (flag.status === 'enabled' || flag.status === 'beta')
    );

    // Проверяем для каждого эксперимента, находится ли пользователь в группе
    const experiments = [];
    let inAnyExperiment = false;

    for (const flag of abTestFlags) {
      const experimentName = flag.name.replace('ab_test_', '');
      const inExperimentGroup = await mlService.isUserInABTestGroup(userId, experimentName);
      
      if (inExperimentGroup) {
        inAnyExperiment = true;
      }
      
      experiments.push({
        experimentName,
        inExperimentGroup,
        description: flag.description,
        groupPercentage: flag.rolloutPercentage
      });
    }

    return res.json({
      experiments,
      inAnyExperiment
    });
  } catch (error) {
    console.error("Error getting AB test info:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
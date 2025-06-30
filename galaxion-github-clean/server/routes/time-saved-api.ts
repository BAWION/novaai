import express from 'express';
import { TimeSavedService } from '../services/time-saved-service';
import { z } from 'zod';

export const timeSavedRouter = express.Router();
const timeSavedService = new TimeSavedService();

// Схема для валидации целей экономии времени
const createGoalSchema = z.object({
  targetMinutesMonthly: z.number().positive(),
  targetDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Некорректный формат даты',
  }),
});

/**
 * Получение сводной информации об экономии времени
 */
timeSavedRouter.get('/summary/:userId?', async (req, res) => {
  try {
    // Получаем ID пользователя из параметров или из текущей сессии
    let userId = parseInt(req.params.userId || '0');
    if (!userId && req.user) {
      userId = req.user.id;
    }

    // Проверяем права доступа
    if (!userId) {
      return res.status(400).json({ message: 'ID пользователя не указан' });
    }

    // Проверяем, имеет ли текущий пользователь права на доступ к данным
    // Администраторы могут просматривать данные любого пользователя
    if (req.user && req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

    // Получаем сводную информацию
    const summary = await timeSavedService.getTimeSavedSummary(userId);
    res.json(summary);
  } catch (error) {
    console.error('Ошибка при получении сводки экономии времени:', error);
    res.status(500).json({ message: 'Ошибка при получении сводки экономии времени' });
  }
});

/**
 * Получение истории экономии времени
 */
timeSavedRouter.get('/history/:userId?', async (req, res) => {
  try {
    let userId = parseInt(req.params.userId || '0');
    if (!userId && req.user) {
      userId = req.user.id;
    }

    if (!userId) {
      return res.status(400).json({ message: 'ID пользователя не указан' });
    }

    if (req.user && req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

    const limit = parseInt(req.query.limit as string || '30');
    const history = await timeSavedService.getTimeSavedHistory(userId, limit);
    res.json(history);
  } catch (error) {
    console.error('Ошибка при получении истории экономии времени:', error);
    res.status(500).json({ message: 'Ошибка при получении истории экономии времени' });
  }
});

/**
 * Принудительный пересчет экономии времени
 */
timeSavedRouter.post('/recalculate/:userId?', async (req, res) => {
  try {
    let userId = parseInt(req.params.userId || '0');
    if (!userId && req.user) {
      userId = req.user.id;
    }

    if (!userId) {
      return res.status(400).json({ message: 'ID пользователя не указан' });
    }

    if (req.user && req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

    // Запускаем пересчет
    const result = await timeSavedService.calculateTimeSaved(userId);
    res.json({
      message: 'Расчет экономии времени успешно выполнен',
      totalMinutesSaved: result.totalMinutesSaved,
    });
  } catch (error) {
    console.error('Ошибка при пересчете экономии времени:', error);
    res.status(500).json({ message: 'Ошибка при пересчете экономии времени' });
  }
});

/**
 * Получение целей по экономии времени
 */
timeSavedRouter.get('/goals/:userId?', async (req, res) => {
  try {
    let userId = parseInt(req.params.userId || '0');
    if (!userId && req.user) {
      userId = req.user.id;
    }

    if (!userId) {
      return res.status(400).json({ message: 'ID пользователя не указан' });
    }

    const goals = await timeSavedService.getTimeSavedGoals(userId);
    res.json(goals);
  } catch (error) {
    console.error('Ошибка при получении целей экономии времени:', error);
    res.status(500).json({ message: 'Ошибка при получении целей экономии времени' });
  }
});

/**
 * Создание новой цели по экономии времени
 */
timeSavedRouter.post('/goals', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Требуется авторизация' });
    }

    // Валидация входных данных
    const validationResult = createGoalSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        message: 'Некорректные данные',
        errors: validationResult.error.errors,
      });
    }

    const { targetMinutesMonthly, targetDate } = validationResult.data;
    
    // Создаем новую цель
    const goal = await timeSavedService.createTimeSavedGoal(
      req.user.id,
      targetMinutesMonthly,
      new Date(targetDate)
    );

    res.status(201).json(goal);
  } catch (error) {
    console.error('Ошибка при создании цели экономии времени:', error);
    res.status(500).json({ message: 'Ошибка при создании цели экономии времени' });
  }
});

// No need for default export since we're using named export above
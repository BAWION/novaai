/**
 * skill-probe-api.ts
 * API эндпоинты для работы с 5-минутными тестами навыков (SKILL-PROBE).
 */

import express, { Request, Response } from 'express';
import { skillProbeService } from '../services/skill-probe-service';
import { z } from 'zod';

const router = express.Router();

// Схема для валидации создания теста
const createProbeSchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().optional(),
  skillId: z.number().optional(),
  dnaId: z.number().optional(),
  probeType: z.enum(['multiple_choice', 'coding', 'fill_blanks', 'matching', 'practical']),
  difficulty: z.enum(['basic', 'intermediate', 'advanced', 'expert']).default('intermediate'),
  estimatedTimeMinutes: z.number().default(5),
  passingScore: z.number().default(70),
  questions: z.array(z.any()).min(1),
});

// Схема для валидации отправки ответов
const submitAnswersSchema = z.object({
  probeId: z.number(),
  answers: z.array(z.any()),
  startedAt: z.string(),
  completedAt: z.string(),
  timeSpentSeconds: z.number().optional(),
});

/**
 * GET /api/skill-probes
 * Получение списка тестов
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { skillId, dnaId, difficulty, limit, offset } = req.query;
    
    const probes = await skillProbeService.getProbes({
      skillId: skillId ? parseInt(skillId as string) : undefined,
      dnaId: dnaId ? parseInt(dnaId as string) : undefined,
      difficulty: difficulty as string,
      limit: limit ? parseInt(limit as string) : 10,
      offset: offset ? parseInt(offset as string) : 0,
    });
    
    return res.json(probes);
  } catch (error) {
    console.error('Error getting skill probes:', error);
    return res.status(500).json({ 
      message: 'Ошибка при получении списка тестов',
      details: error.message
    });
  }
});

/**
 * GET /api/skill-probes/:id
 * Получение данных конкретного теста
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const probeId = parseInt(req.params.id);
    
    if (isNaN(probeId)) {
      return res.status(400).json({ message: 'Некорректный ID теста' });
    }
    
    const probe = await skillProbeService.getProbeById(probeId);
    
    return res.json(probe);
  } catch (error) {
    console.error(`Error getting skill probe ${req.params.id}:`, error);
    
    if (error.message.includes('не найден')) {
      return res.status(404).json({ message: error.message });
    }
    
    return res.status(500).json({ 
      message: 'Ошибка при получении данных теста',
      details: error.message
    });
  }
});

/**
 * POST /api/skill-probes
 * Создание нового теста (требуется авторизация с ролью admin или teacher)
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    // Проверка авторизации
    if (!req.session || !req.session.user) {
      return res.status(401).json({ 
        message: 'Необходима авторизация для создания тестов',
        details: 'Пожалуйста, войдите в систему и повторите попытку.'
      });
    }
    
    // Проверка роли пользователя (только admin или teacher могут создавать тесты)
    const userRole = req.session.user.role;
    if (userRole !== 'admin' && userRole !== 'teacher') {
      return res.status(403).json({ 
        message: 'Недостаточно прав для создания тестов',
        details: 'Требуется роль администратора или преподавателя.'
      });
    }
    
    // Валидация данных
    const validationResult = createProbeSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        message: 'Неверные данные для создания теста',
        errors: validationResult.error.errors
      });
    }
    
    // Создание теста
    const probe = await skillProbeService.createProbe(validationResult.data);
    
    return res.status(201).json(probe);
  } catch (error) {
    console.error('Error creating skill probe:', error);
    return res.status(500).json({ 
      message: 'Ошибка при создании теста',
      details: error.message
    });
  }
});

/**
 * POST /api/skill-probes/:id/submit
 * Отправка ответов на тест
 */
router.post('/:id/submit', async (req: Request, res: Response) => {
  try {
    // Проверка авторизации
    if (!req.session || !req.session.user) {
      return res.status(401).json({ 
        message: 'Необходима авторизация для прохождения тестов',
        details: 'Пожалуйста, войдите в систему и повторите попытку.'
      });
    }
    
    const probeId = parseInt(req.params.id);
    const userId = req.session.user.id;
    
    if (isNaN(probeId)) {
      return res.status(400).json({ message: 'Некорректный ID теста' });
    }
    
    // Валидация данных
    const validationResult = submitAnswersSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        message: 'Неверные данные ответов',
        errors: validationResult.error.errors
      });
    }
    
    // Проверяем, что probeId в параметрах и в теле запроса совпадают
    if (probeId !== validationResult.data.probeId) {
      return res.status(400).json({ 
        message: 'ID теста в URL и в теле запроса не совпадают'
      });
    }
    
    // Отправка ответов и получение результата
    const result = await skillProbeService.submitProbeAnswers({
      userId,
      probeId,
      answers: validationResult.data.answers,
      startedAt: new Date(validationResult.data.startedAt),
      completedAt: new Date(validationResult.data.completedAt),
      timeSpentSeconds: validationResult.data.timeSpentSeconds
    });
    
    return res.status(200).json(result);
  } catch (error) {
    console.error(`Error submitting answers for probe ${req.params.id}:`, error);
    return res.status(500).json({ 
      message: 'Ошибка при обработке ответов',
      details: error.message
    });
  }
});

/**
 * GET /api/skill-probes/user/history
 * Получение истории прохождения тестов пользователем
 */
router.get('/user/history', async (req: Request, res: Response) => {
  try {
    // Проверка авторизации
    if (!req.session || !req.session.user) {
      return res.status(401).json({ 
        message: 'Необходима авторизация для просмотра истории тестов',
        details: 'Пожалуйста, войдите в систему и повторите попытку.'
      });
    }
    
    const userId = req.session.user.id;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
    
    const history = await skillProbeService.getUserProbeHistory(userId, limit, offset);
    
    return res.json(history);
  } catch (error) {
    console.error('Error getting user probe history:', error);
    return res.status(500).json({ 
      message: 'Ошибка при получении истории тестов',
      details: error.message
    });
  }
});

/**
 * GET /api/skill-probes/user/recommendations
 * Получение рекомендаций на основе результатов тестов
 */
router.get('/user/recommendations', async (req: Request, res: Response) => {
  try {
    // Проверка авторизации
    if (!req.session || !req.session.user) {
      return res.status(401).json({ 
        message: 'Необходима авторизация для просмотра рекомендаций',
        details: 'Пожалуйста, войдите в систему и повторите попытку.'
      });
    }
    
    const userId = req.session.user.id;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
    
    const recommendations = await skillProbeService.getUserRecommendations(userId, limit);
    
    return res.json(recommendations);
  } catch (error) {
    console.error('Error getting user recommendations:', error);
    return res.status(500).json({ 
      message: 'Ошибка при получении рекомендаций',
      details: error.message
    });
  }
});

/**
 * PUT /api/skill-probes/recommendations/:id/follow
 * Отметить рекомендацию как выполненную
 */
router.put('/recommendations/:id/follow', async (req: Request, res: Response) => {
  try {
    // Проверка авторизации
    if (!req.session || !req.session.user) {
      return res.status(401).json({ 
        message: 'Необходима авторизация для отметки рекомендаций',
        details: 'Пожалуйста, войдите в систему и повторите попытку.'
      });
    }
    
    const recommendationId = parseInt(req.params.id);
    const userId = req.session.user.id;
    
    if (isNaN(recommendationId)) {
      return res.status(400).json({ message: 'Некорректный ID рекомендации' });
    }
    
    const updatedRecommendation = await skillProbeService.markRecommendationAsFollowed(recommendationId, userId);
    
    return res.json(updatedRecommendation);
  } catch (error) {
    console.error(`Error marking recommendation ${req.params.id} as followed:`, error);
    
    if (error.message.includes('не найдена')) {
      return res.status(404).json({ message: error.message });
    }
    
    return res.status(500).json({ 
      message: 'Ошибка при отметке рекомендации',
      details: error.message
    });
  }
});

export default router;
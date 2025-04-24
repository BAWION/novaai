/**
 * API для взаимодействия с AI-ассистентом
 */
import { Router, Request, Response } from 'express';
import { aiAssistantService } from '../services/ai-assistant-service';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth-middleware';

const router = Router();

// Схема для валидации запроса вопроса
const questionSchema = z.object({
  question: z.string().min(1).max(1000),
});

// Схема для валидации запроса персонализированного объяснения
const explanationSchema = z.object({
  topicId: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
});

/**
 * Получить ответ от AI-ассистента
 * POST /api/ai-assistant/ask
 */
router.post('/ask', authMiddleware, async (req: Request, res: Response) => {
  try {
    // Валидируем запрос
    const validationResult = questionSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Неверный формат запроса',
        details: validationResult.error.errors 
      });
    }
    
    const { question } = validationResult.data;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Пользователь не авторизован' });
    }
    
    // Получаем ответ от ассистента
    const response = await aiAssistantService.getAssistantResponse(userId, question);
    
    // Возвращаем ответ
    return res.json({ response });
  } catch (error) {
    console.error('Error in /api/ai-assistant/ask:', error);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

/**
 * Получить проактивную подсказку
 * GET /api/ai-assistant/hint
 */
router.get('/hint', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Пользователь не авторизован' });
    }
    
    // Получаем подсказку
    const hint = await aiAssistantService.getProactiveHint(userId);
    
    // Возвращаем ответ
    return res.json({ hint });
  } catch (error) {
    console.error('Error in /api/ai-assistant/hint:', error);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

/**
 * Получить персонализированное объяснение темы
 * POST /api/ai-assistant/explain
 */
router.post('/explain', authMiddleware, async (req: Request, res: Response) => {
  try {
    // Валидируем запрос
    const validationResult = explanationSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Неверный формат запроса',
        details: validationResult.error.errors 
      });
    }
    
    const { topicId, difficulty = 'medium' } = validationResult.data;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ error: 'Пользователь не авторизован' });
    }
    
    // Получаем объяснение
    const explanation = await aiAssistantService.getPersonalizedExplanation(
      userId,
      topicId,
      difficulty
    );
    
    // Возвращаем ответ
    return res.json({ explanation });
  } catch (error) {
    console.error('Error in /api/ai-assistant/explain:', error);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

export default router;
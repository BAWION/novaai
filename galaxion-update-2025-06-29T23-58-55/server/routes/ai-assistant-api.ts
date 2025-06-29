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

// Схема для валидации запроса контекстуального ассистента урока
const lessonContextSchema = z.object({
  lessonId: z.number(),
  lessonTitle: z.string(),
  lessonContent: z.string(),
  currentSection: z.string().optional(),
  userMessage: z.string().min(1).max(1000),
  userSkillsLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  conversationHistory: z.array(z.object({
    id: z.string(),
    type: z.enum(['user', 'assistant']),
    content: z.string(),
    timestamp: z.string(),
    context: z.string().optional()
  })).optional()
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
    // Пользователь уже проверен в authMiddleware, поэтому здесь req.user гарантированно существует
    const userId = req.user!.id;
    
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
    // Пользователь уже проверен в authMiddleware, поэтому здесь req.user гарантированно существует
    const userId = req.user!.id;
    
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
    // Пользователь уже проверен в authMiddleware, поэтому здесь req.user гарантированно существует
    const userId = req.user!.id;
    
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

/**
 * Контекстуальный AI-ассистент для урока
 * POST /api/ai-assistant/lesson-context
 */
router.post('/lesson-context', async (req: Request, res: Response) => {
  try {
    // Валидируем запрос
    const validationResult = lessonContextSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Неверный формат запроса',
        details: validationResult.error.errors 
      });
    }
    
    const { 
      lessonId, 
      lessonTitle, 
      lessonContent, 
      currentSection, 
      userMessage, 
      userSkillsLevel,
      conversationHistory = []
    } = validationResult.data;
    
    // Получаем ответ от контекстуального ассистента
    const response = await aiAssistantService.getLessonContextualResponse({
      lessonId,
      lessonTitle,
      lessonContent,
      currentSection,
      userMessage,
      userSkillsLevel,
      conversationHistory
    });
    
    // Возвращаем ответ
    return res.json({ 
      response: response.message,
      context: response.context,
      suggestedQuestions: response.suggestedQuestions || []
    });
  } catch (error) {
    console.error('Error in /api/ai-assistant/lesson-context:', error);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

export default router;
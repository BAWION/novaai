import { Router } from 'express';
import { OfflineAITutor } from '../../create-simple-ai-tutor.js';

const router = Router();
const aiTutor = new OfflineAITutor();

// AI Tutor chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, context } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    // Get response from AI tutor
    const response = await aiTutor.chat(message);
    
    // Log interaction for analytics
    console.log('AI Tutor interaction:', {
      userId: req.user?.id || 'anonymous',
      message: message.substring(0, 100),
      timestamp: new Date().toISOString()
    });

    res.json(response);
  } catch (error) {
    console.error('AI Tutor error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Извините, произошла ошибка. Попробуйте позже.'
    });
  }
});

// Get suggested questions
router.get('/suggestions', async (req, res) => {
  try {
    const suggestions = [
      "Что такое машинное обучение?",
      "Как работают нейронные сети?",
      "В чем разница между ИИ и ML?",
      "Какие есть типы алгоритмов обучения?",
      "Как выбрать алгоритм для задачи?",
      "Что такое переобучение?",
      "Как оценить качество модели?",
      "Какие данные нужны для обучения?"
    ];

    res.json({
      success: true,
      suggestions: suggestions.slice(0, 4) // Return 4 random suggestions
    });
  } catch (error) {
    console.error('Error getting suggestions:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get help for specific topic
router.post('/help', async (req, res) => {
  try {
    const { topic, level = 'beginner' } = req.body;
    
    if (!topic) {
      return res.status(400).json({
        success: false,
        error: 'Topic is required'
      });
    }

    const helpPrompt = `Помогите разобраться с темой: ${topic}. Уровень: ${level}`;
    const response = await aiTutor.chat(helpPrompt);
    
    res.json(response);
  } catch (error) {
    console.error('AI Tutor help error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Explain concept
router.post('/explain', async (req, res) => {
  try {
    const { concept, context: userContext } = req.body;
    
    if (!concept) {
      return res.status(400).json({
        success: false,
        error: 'Concept is required'
      });
    }

    const explanation = await aiTutor.chat(`Объясните концепцию: ${concept}`);
    
    res.json(explanation);
  } catch (error) {
    console.error('AI Tutor explain error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;
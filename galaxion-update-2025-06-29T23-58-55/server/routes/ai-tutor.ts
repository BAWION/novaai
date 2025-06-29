import { Router } from 'express';
import { AiTutorService } from '../services/ai-tutor-service.js';

const router = Router();
let aiTutor: AiTutorService;

// Initialize AI Tutor service
try {
  aiTutor = new AiTutorService();
  console.log('AI Tutor Service initialized with OpenAI');
} catch (error) {
  console.error('Failed to initialize AI Tutor Service:', error);
}

// AI Tutor chat endpoint
router.post('/chat', async (req, res) => {
  try {
    if (!aiTutor) {
      return res.status(500).json({
        success: false,
        error: 'AI Tutor service not available',
        message: 'AI-тьютор временно недоступен. Попробуйте позже.'
      });
    }

    const { message, context } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    // Get user ID for conversation history
    const userId = req.user?.id?.toString() || req.sessionID || 'anonymous';

    // Get response from AI tutor
    const response = await aiTutor.chat(message, userId);
    
    // Log interaction for analytics
    console.log('AI Tutor interaction:', {
      userId: userId,
      message: message.substring(0, 100),
      success: response.success,
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
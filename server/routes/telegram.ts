import { Router } from 'express';

const router = Router();

// Прокси для получения постов из Telegram канала
// В продакшене здесь может быть интеграция с Telegram Bot API
// или RSS фидом канала

interface TelegramPost {
  id: string;
  text: string;
  date: string;
  views?: number;
  link: string;
  media?: {
    type: 'photo' | 'video';
    url: string;
  };
}

// GET /api/telegram/channel/:channelName/posts
router.get('/channel/:channelName/posts', async (req, res) => {
  try {
    const { channelName } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;

    // Для демонстрации возвращаем моковые данные
    // В продакшене здесь будет реальный API запрос
    if (channelName === 'humanreadytech') {
      const mockPosts: TelegramPost[] = [
        {
          id: "1",
          text: "🚀 Новый прорыв в области ИИ: OpenAI представила GPT-5 с революционными возможностями мультимодального понимания. Модель теперь может анализировать видео в реальном времени и генерировать код для робототехники.\n\n#ИИ #OpenAI #GPT5 #Технологии",
          date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 часа назад
          views: 1250,
          link: "https://t.me/humanreadytech/1"
        },
        {
          id: "2", 
          text: "📊 Исследование показало, что 78% компаний планируют увеличить инвестиции в ИИ в 2025 году. Основные направления:\n\n• Автоматизация бизнес-процессов (45%)\n• Персонализация клиентского опыта (32%)\n• Предиктивная аналитика (28%)\n• Кибербезопасность (25%)\n\n#БизнесИИ #Инвестиции #Автоматизация",
          date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 часов назад
          views: 890,
          link: "https://t.me/humanreadytech/2"
        },
        {
          id: "3",
          text: "🎯 Практический совет дня: При обучении нейронных сетей не забывайте про data augmentation! Это может увеличить точность модели на 15-20% без дополнительных данных.\n\nОсобенно эффективно для:\n✅ Компьютерного зрения\n✅ Обработки естественного языка\n✅ Аудио анализа\n\n#МашинноеОбучение #DataScience #НейронныеСети",
          date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 часов назад
          views: 634,
          link: "https://t.me/humanreadytech/3"
        },
        {
          id: "4",
          text: "🤖 Anthropic выпустила Claude 3.5 Sonnet с улучшенными возможностями программирования. Новая модель может:\n\n• Анализировать большие кодовые базы\n• Предлагать архитектурные решения\n• Автоматически исправлять баги\n• Генерировать тесты\n\nУже протестировали? Делитесь впечатлениями! 👇\n\n#Claude #Anthropic #ИИПрограммирование",
          date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 часов назад
          views: 1456,
          link: "https://t.me/humanreadytech/4"
        },
        {
          id: "5",
          text: "📈 Интересная статистика: рынок ИИ-образования вырос на 240% за последний год. Люди активно изучают:\n\n1. Prompt Engineering (35%)\n2. Machine Learning основы (28%)\n3. Computer Vision (18%)\n4. NLP (12%)\n5. Этика ИИ (7%)\n\nА что изучаете вы? 🎓\n\n#ОбразованиеИИ #Обучение #CareerInAI",
          date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 день назад
          views: 723,
          link: "https://t.me/humanreadytech/5"
        }
      ];

      // Ограничиваем количество постов
      const limitedPosts = mockPosts.slice(0, limit);
      
      res.json({
        success: true,
        channel: channelName,
        posts: limitedPosts,
        total: mockPosts.length
      });
    } else {
      res.status(404).json({
        success: false,
        message: `Channel @${channelName} not found or not configured`
      });
    }
  } catch (error) {
    console.error('Error fetching Telegram posts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Telegram posts'
    });
  }
});

// GET /api/telegram/channel/:channelName/info
router.get('/channel/:channelName/info', async (req, res) => {
  try {
    const { channelName } = req.params;

    if (channelName === 'humanreadytech') {
      res.json({
        success: true,
        channel: {
          name: 'humanreadytech',
          title: 'Human Ready Tech',
          description: 'Канал об искусственном интеллекте, технологиях и их влиянии на будущее человечества',
          subscribers: '2.1k',
          link: 'https://t.me/humanreadytech',
          verified: false,
          avatar: null
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: `Channel @${channelName} not found`
      });
    }
  } catch (error) {
    console.error('Error fetching channel info:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch channel info'
    });
  }
});

export default router;
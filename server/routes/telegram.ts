import { Router } from 'express';
import fetch from 'node-fetch';

const router = Router();

// Реальная интеграция с Telegram Bot API для получения постов из канала
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_USERNAME = 'humanreadytech';

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

// Функция для получения реальных постов из Telegram канала
async function fetchTelegramChannelPosts(channelName: string, limit: number = 10): Promise<TelegramPost[]> {
  if (!TELEGRAM_BOT_TOKEN) {
    throw new Error('TELEGRAM_BOT_TOKEN not configured');
  }

  try {
    // Получаем информацию о канале
    const channelResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getChat?chat_id=@${channelName}`
    );
    
    if (!channelResponse.ok) {
      throw new Error(`Failed to get channel info: ${channelResponse.statusText}`);
    }

    // Получаем последние сообщения из канала (через getUpdates с channel_post)
    // Альтернативно можно использовать getChatHistory, но это требует дополнительных разрешений
    const updatesResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?allowed_updates=["channel_post"]&limit=${limit}`
    );
    
    if (!updatesResponse.ok) {
      throw new Error(`Failed to get updates: ${updatesResponse.statusText}`);
    }

    const updatesData = await updatesResponse.json() as any;
    
    if (!updatesData.ok) {
      throw new Error(`Telegram API error: ${updatesData.description}`);
    }

    // Фильтруем и преобразуем сообщения в формат TelegramPost
    const posts: TelegramPost[] = updatesData.result
      .filter((update: any) => 
        update.channel_post && 
        update.channel_post.chat.username === channelName &&
        update.channel_post.text
      )
      .map((update: any) => {
        const post = update.channel_post;
        return {
          id: post.message_id.toString(),
          text: post.text,
          date: new Date(post.date * 1000).toISOString(),
          views: post.views || undefined,
          link: `https://t.me/${channelName}/${post.message_id}`,
          media: post.photo || post.video ? {
            type: post.photo ? 'photo' : 'video',
            url: post.photo ? `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${post.photo[0].file_path}` : ''
          } : undefined
        };
      })
      .slice(0, limit);

    return posts;

  } catch (error) {
    console.error('Error fetching Telegram posts:', error);
    throw error;
  }
}

// GET /api/telegram/channel/:channelName/posts
router.get('/channel/:channelName/posts', async (req, res) => {
  try {
    const { channelName } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;

    // Пытаемся получить реальные данные из Telegram
    if (channelName === 'humanreadytech' && TELEGRAM_BOT_TOKEN) {
      try {
        const posts = await fetchTelegramChannelPosts(channelName, limit);
        
        res.json({
          success: true,
          channel: channelName,
          posts: posts,
          total: posts.length,
          source: 'telegram-api'
        });
        return;
      } catch (telegramError) {
        console.error('Telegram API error, falling back to mock data:', telegramError);
        // Продолжаем с демонстрационными данными в случае ошибки API
      }
    }

    // Fallback к демонстрационным данным
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
        total: mockPosts.length,
        source: 'mock-data'
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
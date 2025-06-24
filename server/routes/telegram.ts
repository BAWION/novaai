import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

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

// Новый улучшенный алгоритм парсинга для получения реальных постов
async function scrapeTelegramChannel(channelName: string, limit: number = 10): Promise<TelegramPost[]> {
  try {
    console.log(`[Telegram Scraping] Загружаем страницу канала: https://t.me/s/${channelName}`);
    
    const response = await fetch(`https://t.me/s/${channelName}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,ru;q=0.8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Referer': 'https://t.me/',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-origin'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    console.log(`[Telegram Scraping] Получен HTML размером: ${html.length} символов`);
    
    // Проверяем наличие свежих постов (сегодняшняя дата)
    const todayPattern = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const yesterdayPattern = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const hasTodayPosts = html.includes(todayPattern) || html.includes('10:16') || html.includes('14:26');
    console.log(`[Telegram Scraping] Ищем посты от ${todayPattern} или ${yesterdayPattern}, найдены: ${hasTodayPosts}`);
    
    // Ищем JSON данные в скрипте страницы
    const scriptMatch = html.match(/<script[^>]*>window\.__INITIAL_STATE__\s*=\s*({.*?});?<\/script>/s);
    if (scriptMatch) {
      try {
        const initialState = JSON.parse(scriptMatch[1]);
        console.log('[Telegram Scraping] Найдены JSON данные страницы');
      } catch (e) {
        console.log('[Telegram Scraping] Ошибка парсинга JSON данных');
      }
    }
    
    const posts: TelegramPost[] = [];
    
    // Метод 1: Парсинг через разделение на блоки сообщений
    const messageBlocks = html.split('class="tgme_widget_message ').slice(1);
    console.log(`[Telegram Scraping] Найдено блоков сообщений: ${messageBlocks.length}`);
    
    // Проверяем, есть ли в HTML искомый пост о дизайн-системе
    const hasDesignPost = html.includes('кросс-платформенную дизайн-систему');
    const hasTimePattern = html.includes('10:16') || html.includes('14:26');
    console.log(`[Telegram Scraping] Найден пост о дизайн-системе: ${hasDesignPost}, найдены паттерны времени: ${hasTimePattern}`);
    
    for (let i = 0; i < messageBlocks.length && posts.length < limit; i++) {
      const block = 'class="tgme_widget_message ' + messageBlocks[i];
      
      // Извлекаем ID поста из data-post
      const postIdMatch = block.match(/data-post="[^"]*\/(\d+)"/);
      if (!postIdMatch) continue;
      
      const postId = postIdMatch[1];
      
      // Извлекаем текст сообщения
      const textMatch = block.match(/<div[^>]*class="[^"]*js-message_text[^"]*"[^>]*>(.*?)<\/div>/s);
      if (!textMatch) continue;
      
      let text = textMatch[1]
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<a[^>]*href="[^"]*"[^>]*>/gi, '')
        .replace(/<\/a>/gi, '')
        .replace(/<[^>]*>/g, '')
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&nbsp;/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      
      if (text.length < 20) continue;
      
      // Извлекаем дату из datetime атрибута
      const dateMatch = block.match(/<time[^>]*datetime="([^"]*)"[^>]*>/);
      let postDate = new Date();
      if (dateMatch) {
        try {
          postDate = new Date(dateMatch[1]);
          if (isNaN(postDate.getTime())) {
            console.log(`[Telegram Scraping] Некорректная дата: ${dateMatch[1]}`);
            postDate = new Date();
          }
        } catch (e) {
          console.log(`[Telegram Scraping] Ошибка парсинга даты: ${dateMatch[1]}`);
          postDate = new Date();
        }
      }
      
      // Извлекаем количество просмотров
      const viewsMatch = block.match(/<span[^>]*class="[^"]*tgme_widget_message_views[^"]*"[^>]*>([^<]+)<\/span>/);
      let views = undefined;
      if (viewsMatch) {
        const viewsStr = viewsMatch[1].replace(/[,\s]/g, '').toLowerCase();
        if (viewsStr.includes('k') || viewsStr.includes('к')) {
          views = Math.floor(parseFloat(viewsStr) * 1000);
        } else if (viewsStr.includes('m') || viewsStr.includes('м')) {
          views = Math.floor(parseFloat(viewsStr) * 1000000);
        } else {
          const numViews = parseInt(viewsStr);
          if (!isNaN(numViews)) views = numViews;
        }
      }
      
      posts.push({
        id: `post_${postId}`,
        text: text,
        date: postDate.toISOString(),
        views: views,
        link: `https://t.me/${channelName}/${postId}`
      });
      
      console.log(`[Telegram Scraping] Пост ${posts.length}: ${postDate.toISOString()} - ${text.substring(0, 80)}...`);
    }
    
    console.log(`[Telegram Scraping] Основной метод нашел: ${posts.length} постов`);
    
    // Сортируем по дате публикации (новые сначала)
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Логируем финальный порядок постов
    console.log('[Telegram Scraping] Финальный порядок постов:');
    posts.forEach((post, index) => {
      const date = new Date(post.date);
      console.log(`${index + 1}. ${date.toLocaleString('ru-RU')} - ${post.text.substring(0, 60)}...`);
    });
    
    return posts;
    
  } catch (error) {
    console.error('Error scraping channel posts:', error);
    throw error;
  }
}

// Функция для получения реальных постов из Telegram канала через Bot API
async function fetchTelegramChannelPosts(channelName: string, limit: number = 10): Promise<TelegramPost[]> {
  if (!TELEGRAM_BOT_TOKEN) {
    throw new Error('TELEGRAM_BOT_TOKEN not configured');
  }

  try {
    // Новый подход: получаем больше истории через getChat и getChatHistory
    const chatResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getChat?chat_id=@${channelName}`
    );

    if (!chatResponse.ok) {
      throw new Error(`Failed to get chat info: ${chatResponse.status}`);
    }

    const chatData = await chatResponse.json();
    if (!chatData.ok) {
      throw new Error('Failed to get chat data');
    }

    // Получаем все обновления без offset ограничений 
    const updatesResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?allowed_updates=["channel_post"]&limit=100`
    );
    
    if (!updatesResponse.ok) {
      // Если не получилось через getUpdates, пробуем использовать web scraping как fallback
      throw new Error(`Updates request failed: ${updatesResponse.status}`);
    }

    const data = await updatesResponse.json();
    
    if (!data.ok || !data.result) {
      throw new Error('No posts found via Telegram API');
    }

    // Фильтруем все посты из целевого канала (включая старые)
    const channelId = chatData.result.id;
    const allUpdates = data.result.filter((update: any) => {
      if (!update.channel_post || !update.channel_post.chat) return false;
      
      const chat = update.channel_post.chat;
      return chat.id === channelId || 
             chat.username === channelName || 
             chat.username === 'HumanReadyTech';
    });

    console.log(`[Telegram API] Всего обновлений: ${data.result.length}, из канала ${channelName}: ${allUpdates.length}`);

    if (allUpdates.length === 0) {
      throw new Error('No channel posts found in updates');
    }

    const allPosts = allUpdates
      .map((update: any) => ({
        id: `tg_${update.channel_post.message_id}`,
        text: update.channel_post.text || update.channel_post.caption || '',
        date: new Date(update.channel_post.date * 1000).toISOString(),
        link: `https://t.me/${channelName}/${update.channel_post.message_id}`,
        views: update.channel_post.views || undefined,
        timestamp: update.channel_post.date
      }))
      .filter((post: any) => post.text.length > 10);

    // Сортируем по timestamp (новые сначала) и берем нужное количество
    allPosts.sort((a, b) => b.timestamp - a.timestamp);
    const posts = allPosts.slice(0, limit).map(({ timestamp, ...post }) => post);
    
    console.log(`[Telegram API] Найдено ${allPosts.length} постов канала, отобрано ${posts.length}`);
    console.log('[Telegram API] Порядок постов после сортировки:');
    posts.slice(0, 3).forEach((post, index) => {
      const date = new Date(post.date);
      console.log(`${index + 1}. ${date.toLocaleString('ru-RU')} - ${post.text.substring(0, 60)}...`);
    });
    
    return posts;

  } catch (error) {
    console.error('Error fetching Telegram channel posts:', error);
    throw error;
  }
}

// Эндпоинт для получения постов канала
router.get('/channel/:channelName/posts', async (req, res) => {
  try {
    const { channelName } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;
    const maxLimit = Math.min(limit, 50); // Ограничиваем максимум 50 постами
    
    console.log(`[Telegram API] Запрос постов канала ${channelName}, лимит: ${maxLimit}`);
    
    let posts: TelegramPost[] = [];
    
    // Сначала пробуем Bot API
    try {
      posts = await fetchTelegramChannelPosts(channelName, maxLimit);
      console.log(`[Telegram API] Получено ${posts.length} постов через Bot API`);
      
      if (posts.length >= 3) { // Минимум 3 поста для нормальной прокрутки
        return res.json({
          success: true,
          posts: posts.slice(0, maxLimit),
          source: 'telegram-api',
          timestamp: new Date().toISOString(),
          total: posts.length
        });
      } else if (posts.length > 0) {
        console.log(`[Telegram API] Получено только ${posts.length} постов, пробуем web scraping для дополнения...`);
      }
    } catch (apiError) {
      console.log('No posts from Telegram API, trying web scraping...');
    }
    
    // Если Bot API не работает, используем web scraping
    try {
      posts = await scrapeTelegramChannel(channelName, maxLimit);
      console.log(`[Telegram Scraping] Получено ${posts.length} постов через web scraping`);
      
      return res.json({
        success: true,
        posts: posts.slice(0, maxLimit), // Обрезаем до нужного лимита
        source: 'web-scraping',
        timestamp: new Date().toISOString(),
        total: posts.length
      });
    } catch (scrapingError) {
      console.error('Web scraping failed:', scrapingError);
      throw scrapingError;
    }
    
  } catch (error) {
    console.error('Error in telegram posts endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch Telegram posts',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
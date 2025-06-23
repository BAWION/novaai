import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink, MessageCircle, Clock, Eye, AlertTriangle } from "lucide-react";

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

interface MockTelegramPost {
  id: string;
  text: string;
  date: string;
  views: number;
  link: string;
}

export default function TelegramFeed() {
  const [posts, setPosts] = useState<TelegramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTelegramPosts = async () => {
    try {
      const response = await fetch('/api/telegram/channel/humanreadytech/posts?limit=10');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.posts && data.posts.length > 0) {
        setPosts(data.posts);
        setError(null); // Убираем уведомление при успешной загрузке
        setLoading(false);
        return true; // Успешно получили данные
      } else {
        console.warn('Нет данных от API, используем fallback');
        return false;
      }
    } catch (err) {
      console.error('Ошибка получения данных Telegram:', err);
      return false;
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      const success = await fetchTelegramPosts();
      
      if (!success) {
        // Fallback к демонстрационным данным только при ошибке
        const mockPosts: MockTelegramPost[] = [
          {
            id: "1",
            text: "🚀 Новый прорыв в области ИИ: OpenAI представила GPT-5 с революционными возможностями мультимодального понимания. Модель теперь может анализировать видео в реальном времени и генерировать код для робототехники.\n\n#ИИ #OpenAI #GPT5 #Технологии",
            date: "2025-06-23T20:30:00Z",
            views: 1250,
            link: "https://t.me/humanreadytech/1"
          },
          {
            id: "2", 
            text: "📊 Исследование показало, что 78% компаний планируют увеличить инвестиции в ИИ в 2025 году. Основные направления:\n\n• Автоматизация бизнес-процессов (45%)\n• Персонализация клиентского опыта (32%)\n• Предиктивная аналитика (28%)\n• Кибербезопасность (25%)\n\n#БизнесИИ #Инвестиции #Автоматизация",
            date: "2025-06-23T18:15:00Z",
            views: 890,
            link: "https://t.me/humanreadytech/2"
          },
          {
            id: "3",
            text: "🎯 Практический совет дня: При обучении нейронных сетей не забывайте про data augmentation! Это может увеличить точность модели на 15-20% без дополнительных данных.\n\nОсобенно эффективно для:\n✅ Компьютерного зрения\n✅ Обработки естественного языка\n✅ Аудио анализа\n\n#МашинноеОбучение #DataScience #НейронныеСети",
            date: "2025-06-23T16:45:00Z", 
            views: 634,
            link: "https://t.me/humanreadytech/3"
          },
          {
            id: "4",
            text: "🤖 Anthropic выпустила Claude 3.5 Sonnet с улучшенными возможностями программирования. Новая модель может:\n\n• Анализировать большие кодовые базы\n• Предлагать архитектурные решения\n• Автоматически исправлять баги\n• Генерировать тесты\n\nУже протестировали? Делитесь впечатлениями! 👇\n\n#Claude #Anthropic #ИИПрограммирование",
            date: "2025-06-23T14:20:00Z",
            views: 1456,
            link: "https://t.me/humanreadytech/4"
          },
          {
            id: "5",
            text: "📈 Интересная статистика: рынок ИИ-образования вырос на 240% за последний год. Люди активно изучают:\n\n1. Prompt Engineering (35%)\n2. Machine Learning основы (28%)\n3. Computer Vision (18%)\n4. NLP (12%)\n5. Этика ИИ (7%)\n\nА что изучаете вы? 🎓\n\n#ОбразованиеИИ #Обучение #CareerInAI",
            date: "2025-06-23T12:00:00Z",
            views: 723,
            link: "https://t.me/humanreadytech/5"
          }
        ];
        
        setPosts(mockPosts);
        setError("Не удалось загрузить данные из Telegram. Используются демонстрационные данные.");
      }
      
      setLoading(false);
    };

    loadInitialData();

    // Автоматическое обновление каждые 5 минут
    const interval = setInterval(async () => {
      await fetchTelegramPosts();
    }, 5 * 60 * 1000); // 5 минут

    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes} мин назад`;
    } else if (diffHours < 24) {
      return `${diffHours} ч назад`;
    } else if (diffDays < 7) {
      return `${diffDays} дн назад`;
    } else {
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short'
      });
    }
  };

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  const extractHashtags = (text: string) => {
    const hashtags = text.match(/#[\wА-Яа-яё]+/g) || [];
    return hashtags.slice(0, 3); // Показываем только первые 3 хештега
  };

  const getCleanText = (text: string) => {
    // Убираем хештеги из конца текста для более чистого отображения
    return text.replace(/#[\wА-Яа-яё]+/g, '').trim();
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-blue-500" />
            Лента новостей @humanreadytech
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-blue-500" />
          Лента новостей @humanreadytech
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && error.includes("демонстрационные данные") && (
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {posts && posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {formatDate(post.date)}
                    </div>
                    {post.views && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        {formatViews(post.views)}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm leading-relaxed mb-3">
                    {getCleanText(post.text)}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {extractHashtags(post.text).map((hashtag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {hashtag}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(post.link, '_blank')}
                    className="text-xs"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Читать далее
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Пока нет постов для отображения</p>
            <Button 
              variant="outline" 
              onClick={() => window.open('https://t.me/humanreadytech', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Открыть канал в Telegram
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
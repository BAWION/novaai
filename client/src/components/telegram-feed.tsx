import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink, MessageCircle, Users, Clock } from "lucide-react";

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

export default function TelegramFeed() {
  const [posts, setPosts] = useState<TelegramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Типы для демонстрационных данных
  interface MockTelegramPost {
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

  useEffect(() => {
    const fetchTelegramPosts = async () => {
      try {
        const response = await fetch('/api/telegram/channel/humanreadytech/posts?limit=10');
        const data = await response.json();
        
        if (data.success) {
          setPosts(data.posts);
        } else {
          throw new Error(data.message);
        }
      } catch (err) {
        // Fallback к демонстрационным данным в случае ошибки
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
        setError("Используются демонстрационные данные");
      }
    } catch (err) {
      setError("Не удалось загрузить новости из Telegram канала");
    } finally {
      setLoading(false);
    }
  };

    fetchTelegramPosts();
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

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-red-500" />
            Лента новостей @humanreadytech
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">{error}</p>
            <Button 
              variant="outline" 
              onClick={() => window.open('https://t.me/humanreadytech', '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Открыть канал в Telegram
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-blue-500" />
            Лента новостей @humanreadytech
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open('https://t.me/humanreadytech', '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Подписаться
          </Button>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>Канал об ИИ и технологиях</span>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-6">
            {posts.map((post, index) => (
              <div key={post.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                <div className="space-y-3">
                  {/* Основной текст поста */}
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {getCleanText(post.text)}
                  </p>
                  
                  {/* Хештеги */}
                  {extractHashtags(post.text).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {extractHashtags(post.text).map((hashtag, i) => (
                        <Badge 
                          key={i} 
                          variant="secondary" 
                          className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100"
                        >
                          {hashtag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {/* Метаинформация и действия */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(post.date)}
                      </div>
                      {post.views && (
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {formatViews(post.views)} просмотров
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => window.open(post.link, '_blank')}
                      className="text-xs h-auto p-2"
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Открыть
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        {/* Подвал с информацией о канале */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Свежие новости об ИИ и технологиях</span>
            <Button 
              variant="link" 
              size="sm" 
              className="h-auto p-0 text-xs"
              onClick={() => window.open('https://t.me/humanreadytech', '_blank')}
            >
              @humanreadytech
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
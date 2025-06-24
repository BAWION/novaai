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
        // Создаем демонстрационные посты с реалистичными датами
        const now = new Date();
        const mockPosts: MockTelegramPost[] = [
          {
            id: "demo_1",
            text: "🚀 В астрономии готовится настоящая революция! Учёные анонсировали запуск гигантского телескопа, который способен будет «видеть» одновременно в 10 раз больше небесных объектов, чем существующие телескопы. Это откроет новые горизонты для изучения космоса и поможет ответить на многие загадки о Вселенной.",
            date: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 часа назад
            views: 1250,
            link: "https://t.me/humanreadytech/demo1"
          },
          {
            id: "demo_2", 
            text: "К 2025 году навык составлять грамотные промпты станет необходимым даже тем, кто далёк от технологий. Умение корректно задавать вопросы искусственному интеллекту превращается в такую же базовую компетенцию, как английский или навыки работы за ПК.",
            date: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(), // 6 часов назад
            views: 890,
            link: "https://t.me/humanreadytech/demo2"
          },
          {
            id: "demo_3",
            text: "Теперь создать сайт на Next.js можно за один вечер вообще без программирования, просто формулируя текстовые инструкции для ИИ. Искусственный интеллект сам создаст страницы и настроит роутинг.",
            date: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(), // 12 часов назад
            views: 634,
            link: "https://t.me/humanreadytech/demo3"
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
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    // Если дата некорректная или в будущем, показываем просто дату
    if (isNaN(date.getTime()) || diffMs < 0) {
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    if (diffMinutes < 5) {
      return 'только что';
    } else if (diffMinutes < 60) {
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
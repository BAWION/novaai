import { useState, useEffect } from 'react';
import { MessageSquare, Eye, ExternalLink } from 'lucide-react';

interface TelegramPost {
  id: string;
  text: string;
  date: string;
  views?: number;
  link: string;
}

export default function TelegramFeed() {
  const [posts, setPosts] = useState<TelegramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [allPosts, setAllPosts] = useState<Set<string>>(new Set()); // Для отслеживания уникальных постов

  const fetchTelegramPosts = async () => {
    try {
      const response = await fetch('/api/telegram/channel/humanreadytech/posts?limit=10');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.posts) {
        // Объединяем новые посты с существующими, избегая дубликатов
        setPosts(currentPosts => {
          const existingIds = new Set(currentPosts.map(post => post.id));
          const newPosts = data.posts.filter((post: any) => !existingIds.has(post.id));
          
          // Объединяем и сортируем по дате (новые сначала)
          const combinedPosts = [...newPosts, ...currentPosts]
            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 10); // Ограничиваем 10 постами
          
          console.log(`[TelegramFeed] Обновлено постов: ${combinedPosts.length} (добавлено: ${newPosts.length})`);
          return combinedPosts;
        });
        
        setLoading(false);
        return true;
      } else {
        console.error('[TelegramFeed] Некорректный ответ API:', data);
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('[TelegramFeed] Ошибка загрузки постов:', error);
      setLoading(false);
      return false;
    }
  };

  useEffect(() => {
    fetchTelegramPosts();
    
    const interval = setInterval(async () => {
      console.log('[TelegramFeed] Автоматическое обновление ленты...');
      await fetchTelegramPosts();
    }, 1 * 60 * 1000); // 1 минута для быстрой синхронизации новых постов

    return () => clearInterval(interval);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Заголовок */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Лента новостей @humanreadytech
          </h3>
        </div>
      </div>
      
      {/* Контент с прокруткой */}
      <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        <div className="p-6">
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
                  <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post, index) => (
                <div key={post.id} className={`pb-4 ${index < posts.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}>
                  <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed mb-2">
                    {post.text}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{formatDate(post.date)}</span>
                    <div className="flex items-center gap-3">
                      {post.views && (
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{post.views}</span>
                        </div>
                      )}
                      <a 
                        href={post.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">
                Нет доступных новостей
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Кнопка "Все новости" */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
        <a
          href="https://t.me/humanreadytech"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <span>Все новости</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
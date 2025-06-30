import { useState, useEffect } from 'react';
import { useOfflineStatus, usePWADisplayMode } from '@/hooks/use-pwa';
import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff } from 'lucide-react';

/**
 * Индикатор статуса подключения для мобильной версии
 */
export function ConnectionStatus() {
  const { isOnline } = useOfflineStatus();
  const [showStatus, setShowStatus] = useState(false);
  
  // Показываем уведомление при изменении статуса соединения на 3 секунды
  useEffect(() => {
    setShowStatus(true);
    const timer = setTimeout(() => setShowStatus(false), 3000);
    
    return () => clearTimeout(timer);
  }, [isOnline]);
  
  return (
    <AnimatePresence>
      {showStatus && (
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50 flex justify-center"
        >
          <div 
            className={`px-4 py-2 rounded-b-lg flex items-center gap-2 shadow-lg ${
              isOnline 
                ? 'bg-green-600/90 text-white' 
                : 'bg-red-500/90 text-white'
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4" />
                <span className="text-sm font-medium">Соединение восстановлено</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4" />
                <span className="text-sm font-medium">Нет соединения</span>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Индикатор режима PWA для установленного приложения
 */
export function PWAModeBadge() {
  const { isStandalone } = usePWADisplayMode();
  
  if (!isStandalone) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 z-40 bg-space-800/80 backdrop-blur-sm border border-[#6E3AFF]/30 rounded-lg px-2 py-1 text-xs text-white/70 shadow-lg">
      Приложение
    </div>
  );
}

/**
 * Компонент кнопки кэширования урока для офлайн-просмотра
 */
export function CacheLessonButton({ 
  lessonId, 
  resources 
}: { 
  lessonId: number; 
  resources: string[] 
}) {
  const {
    status,
    cacheLesson,
    isCaching,
    isCached,
    hasError,
    error
  } = useLessonCaching(lessonId);
  
  const handleCaching = async () => {
    await cacheLesson(resources);
  };
  
  return (
    <button
      onClick={handleCaching}
      disabled={isCaching || isCached}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium ${
        isCached
          ? 'bg-green-600/15 text-green-400 border border-green-500/40'
          : isCaching
            ? 'bg-space-800/50 text-white/50 border border-white/10'
            : hasError
              ? 'bg-red-600/15 text-red-400 border border-red-500/40 hover:bg-red-600/25'
              : 'bg-space-800/50 text-white/80 border border-white/20 hover:bg-space-800/70'
      }`}
    >
      {isCached ? (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Сохранено для офлайн</span>
        </>
      ) : isCaching ? (
        <>
          <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Сохранение...</span>
        </>
      ) : hasError ? (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Ошибка: {error}</span>
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          <span>Сохранить для офлайн</span>
        </>
      )}
    </button>
  );
}

// Импортируем хук динамически, чтобы избежать ошибок TypeScript
function useLessonCaching(lessonId: number) {
  const [state, setState] = useState({
    status: 'not-cached' as 'not-cached' | 'caching' | 'cached' | 'error',
    error: null as string | null,
    isCaching: false,
    isCached: false,
    hasError: false
  });
  
  const { canUseOffline } = useOfflineStatus();
  
  const cacheLesson = async (resources: string[]) => {
    if (!canUseOffline) {
      setState(prev => ({ 
        ...prev, 
        error: 'Офлайн-режим не поддерживается',
        status: 'error',
        hasError: true
      }));
      return false;
    }
    
    try {
      setState(prev => ({ 
        ...prev, 
        status: 'caching',
        isCaching: true,
        hasError: false,
        error: null
      }));
      
      const { cacheLessonForOffline } = await import('@/lib/pwa-utils');
      const result = await cacheLessonForOffline(lessonId, resources);
      
      if (result.success) {
        setState(prev => ({ 
          ...prev, 
          status: 'cached',
          isCaching: false,
          isCached: true,
          hasError: false
        }));
        return true;
      } else {
        setState(prev => ({ 
          ...prev, 
          error: result.error || 'Ошибка кэширования',
          status: 'error',
          isCaching: false,
          hasError: true
        }));
        return false;
      }
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        error: (err as Error).message,
        status: 'error',
        isCaching: false,
        hasError: true
      }));
      return false;
    }
  };
  
  return {
    ...state,
    canUseOffline,
    cacheLesson
  };
}
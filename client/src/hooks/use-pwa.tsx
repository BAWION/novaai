import { useState, useEffect } from 'react';
import { checkOfflineAvailability, getPWADisplayMode } from '@/lib/pwa-utils';

/**
 * Хук для получения информации о режиме установки PWA
 */
export function usePWADisplayMode() {
  const [displayMode, setDisplayMode] = useState<string>('browser');
  
  useEffect(() => {
    // Определяем текущий режим отображения
    setDisplayMode(getPWADisplayMode());
    
    // Слушаем изменения режима отображения
    const handleDisplayModeChange = () => {
      setDisplayMode(getPWADisplayMode());
    };
    
    window.matchMedia('(display-mode: standalone)').addEventListener('change', handleDisplayModeChange);
    
    return () => {
      window.matchMedia('(display-mode: standalone)').removeEventListener('change', handleDisplayModeChange);
    };
  }, []);
  
  return {
    isStandalone: displayMode !== 'browser',
    displayMode
  };
}

/**
 * Хук для управления офлайн-режимом
 */
export function useOfflineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [canUseOffline, setCanUseOffline] = useState<boolean>(false);
  
  useEffect(() => {
    // Проверяем поддержку офлайн-режима
    const checkOfflineSupport = async () => {
      const supported = await checkOfflineAvailability();
      setCanUseOffline(supported);
    };
    
    checkOfflineSupport();
    
    // Отслеживаем статус соединения
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return {
    isOnline,
    canUseOffline
  };
}

type CacheStatus = 'not-cached' | 'caching' | 'cached' | 'error';

/**
 * Хук для управления кэшированием контента уроков
 * @param lessonId ID урока
 */
export function useLessonCaching(lessonId: number) {
  const [status, setStatus] = useState<CacheStatus>('not-cached');
  const [error, setError] = useState<string | null>(null);
  
  // Проверяем возможность кэширования
  const { canUseOffline } = useOfflineStatus();
  
  const cacheLesson = async (resources: string[]) => {
    if (!canUseOffline) {
      setError('Офлайн-режим не поддерживается');
      return false;
    }
    
    try {
      setStatus('caching');
      const { cacheLessonForOffline } = await import('@/lib/pwa-utils');
      const result = await cacheLessonForOffline(lessonId, resources);
      
      if (result.success) {
        setStatus('cached');
        return true;
      } else {
        setError(result.error || 'Ошибка кэширования');
        setStatus('error');
        return false;
      }
    } catch (err) {
      setError((err as Error).message);
      setStatus('error');
      return false;
    }
  };
  
  const clearCache = async () => {
    // Для реализации в будущем
  };
  
  return {
    status,
    error,
    canUseOffline,
    cacheLesson,
    clearCache,
    isCaching: status === 'caching',
    isCached: status === 'cached',
    hasError: status === 'error'
  };
}
/**
 * Утилиты для умного управления кэшированием API
 */
import type { Response } from "express";

export interface CacheOptions {
  maxAge?: number; // Время кэширования в секундах
  forceRefresh?: boolean; // Принудительное отключение кэша
  etag?: string; // Кастомный ETag
}

/**
 * Устанавливает заголовки кэширования для ответа API
 */
export function setCacheHeaders(res: Response, options: CacheOptions = {}) {
  const { maxAge = 300, forceRefresh = false, etag } = options;
  
  if (forceRefresh) {
    // Полное отключение кэша
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
  } else {
    // Умное кэширование
    res.set({
      'Cache-Control': `public, max-age=${maxAge}`,
      'Last-Modified': new Date().toUTCString()
    });
    
    if (etag) {
      res.set('ETag', etag);
    }
  }
}

/**
 * Определяет нужно ли принудительное обновление кэша
 */
export function shouldForceRefresh(query: any): boolean {
  return query.refresh === 'true' || query.nocache === 'true';
}

/**
 * Генерирует ETag на основе данных
 */
export function generateETag(data: any): string {
  const hash = require('crypto')
    .createHash('md5')
    .update(JSON.stringify(data))
    .digest('hex');
  return `"${hash}"`;
}

/**
 * Настройки кэширования для разных типов контента
 */
export const CACHE_SETTINGS = {
  // Список курсов - часто запрашивается, редко меняется
  COURSES: { maxAge: 300 }, // 5 минут
  
  // Модули курса - стабильный контент
  MODULES: { maxAge: 600 }, // 10 минут
  
  // Уроки - самый стабильный контент
  LESSONS: { maxAge: 900 }, // 15 минут
  
  // Пользовательские данные - не кэшируем
  USER_PROGRESS: { maxAge: 0, forceRefresh: true },
  
  // Статический контент - долгое кэширование
  STATIC: { maxAge: 3600 }, // 1 час
} as const;
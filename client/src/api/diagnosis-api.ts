/**
 * diagnosis-api.ts
 * API-клиент для работы с диагностикой и Skills DNA
 */

import { apiRequest } from "@/lib/queryClient";

/**
 * Тип диагностики: быстрая или глубокая
 */
export type DiagnosticType = 'quick' | 'deep';

/**
 * Интерфейс для отправки результатов диагностики
 */
export interface DiagnosisResult {
  userId: number;
  skills: Record<string, number>; // Название навыка: значение от 0 до 100
  diagnosticType: DiagnosticType;
  metadata?: any;
}

/**
 * API-клиент для работы с диагностикой
 */
export const diagnosisApi = {
  /**
   * Сохраняет результаты диагностики в системе Skills DNA
   * @param results Результаты диагностики
   * @returns Результат операции
   */
  async saveResults(results: DiagnosisResult): Promise<any> {
    try {
      console.log('[API] Отправка запроса на сохранение результатов диагностики:', {
        endpoint: '/api/diagnosis/results',
        userId: results.userId,
        skillsCount: Object.keys(results.skills).length,
        diagnosticType: results.diagnosticType
      });
      
      const response = await apiRequest('POST', '/api/diagnosis/results', results);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[API] Ошибка при сохранении диагностики: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Ошибка сервера: ${response.status} ${response.statusText}. ${errorText}`);
      }
      
      const data = await response.json();
      console.log('[API] Успешный ответ от сервера:', data);
      return data;
    } catch (error) {
      console.error('[API] Исключение при сохранении результатов диагностики:', error);
      throw error;
    }
  },

  /**
   * Получает прогресс пользователя по компетенциям Skills DNA
   * @param userId ID пользователя
   * @returns Массив записей прогресса с детальной информацией
   */
  async getUserProgress(userId: number): Promise<any[]> {
    try {
      console.log(`[API] Запрос прогресса пользователя Skills DNA, userId: ${userId}`);
      
      if (!userId || isNaN(userId)) {
        console.error('[API] Невозможно получить прогресс: некорректный ID пользователя', userId);
        return [];
      }
      
      const response = await apiRequest('GET', `/api/diagnosis/progress/${userId}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[API] Ошибка при получении прогресса: ${response.status}`, errorText);
        return [];
      }
      
      const result = await response.json();
      console.log(`[API] Получен прогресс пользователя: ${result.data ? result.data.length : 0} записей`);
      return result.data || [];
    } catch (error) {
      console.error('[API] Исключение при получении прогресса пользователя:', error);
      return [];
    }
  },

  /**
   * Получает сводную информацию о прогрессе пользователя
   * @param userId ID пользователя
   * @returns Сводная информация о прогрессе по категориям
   */
  async getUserSummary(userId: number): Promise<any> {
    try {
      console.log(`[API] Запрос сводки Skills DNA, userId: ${userId}`);
      
      if (!userId || isNaN(userId)) {
        console.error('[API] Невозможно получить сводку: некорректный ID пользователя', userId);
        return {};
      }
      
      const response = await apiRequest('GET', `/api/diagnosis/summary/${userId}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[API] Ошибка при получении сводки: ${response.status}`, errorText);
        return {};
      }
      
      const result = await response.json();
      console.log('[API] Получена сводка прогресса пользователя:', 
        Object.keys(result.data || {}).length, 'категорий');
      return result.data || {};
    } catch (error) {
      console.error('[API] Исключение при получении сводки пользователя:', error);
      return {};
    }
  }
};
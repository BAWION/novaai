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
      const response = await apiRequest('POST', '/api/diagnosis/results', results);
      return await response.json();
    } catch (error) {
      console.error('Ошибка при сохранении результатов диагностики:', error);
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
      const response = await apiRequest('GET', `/api/diagnosis/progress/${userId}`);
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Ошибка при получении прогресса пользователя:', error);
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
      const response = await apiRequest('GET', `/api/diagnosis/summary/${userId}`);
      const result = await response.json();
      return result.data || {};
    } catch (error) {
      console.error('Ошибка при получении сводки прогресса пользователя:', error);
      return {};
    }
  }
};
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
   * Инициализирует демо-данные для пользователя с ID 999
   * @returns Результат инициализации
   */
  async initializeDemoData(): Promise<any> {
    try {
      console.log('[API] Отправка запроса на инициализацию демо-данных');
      
      const response = await apiRequest('POST', '/api/diagnosis/initialize-demo');
      
      if (!response.ok) {
        let errorMessage = "Ошибка при инициализации демо-данных";
        
        try {
          const errorResponse = await response.json();
          errorMessage = errorResponse.message || errorMessage;
          
          console.error(`[API] Ошибка при инициализации демо-данных:`, {
            status: response.status,
            message: errorMessage
          });
        } catch (parseError) {
          console.error(`[API] Не удалось разобрать JSON в ответе об ошибке:`, {
            status: response.status
          });
        }
        
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      console.log('[API] Демо-данные успешно инициализированы:', result);
      return result;
    } catch (error) {
      console.error('[API] Исключение при инициализации демо-данных:', error);
      throw error;
    }
  },
  
  /**
   * Сохраняет результаты диагностики в системе Skills DNA
   * @param results Результаты диагностики
   * @returns Результат операции
   */
  async saveResults(results: DiagnosisResult): Promise<any> {
    try {
      // Проверяем, что у нас есть ID пользователя
      if (!results.userId) {
        const error = new Error("ID пользователя отсутствует. Необходима авторизация для сохранения результатов.");
        console.error('[API] Ошибка валидации запроса: отсутствует ID пользователя');
        throw error;
      }
      
      // Проверяем, что у нас есть навыки для сохранения
      if (!results.skills || Object.keys(results.skills).length === 0) {
        const error = new Error("Отсутствуют данные о навыках для сохранения.");
        console.error('[API] Ошибка валидации запроса: отсутствуют данные о навыках');
        throw error;
      }
      
      console.log('[API] Отправка запроса на сохранение результатов диагностики:', {
        endpoint: '/api/diagnosis/results',
        userId: results.userId,
        skillsCount: Object.keys(results.skills).length,
        skills: Object.keys(results.skills).join(', '),
        diagnosticType: results.diagnosticType
      });
      
      const response = await apiRequest('POST', '/api/diagnosis/results', results);
      
      // Обрабатываем ошибки HTTP
      if (!response.ok) {
        let errorMessage = "Ошибка сервера";
        let errorDetails = "";
        
        try {
          // Пытаемся получить подробности ошибки из JSON-ответа
          const errorResponse = await response.json();
          errorMessage = errorResponse.message || errorMessage;
          errorDetails = errorResponse.details || "";
          
          console.error(`[API] Ошибка сервера при сохранении диагностики:`, {
            status: response.status,
            message: errorMessage,
            details: errorDetails
          });
        } catch (parseError) {
          // Если не можем прочитать JSON, используем текст ответа
          try {
            errorDetails = await response.text();
          } catch (textError) {
            errorDetails = "Не удалось получить детали ошибки";
          }
          
          console.error(`[API] Не удалось разобрать JSON в ответе об ошибке:`, {
            status: response.status,
            text: errorDetails
          });
        }
        
        // Особая обработка для разных статусов ошибок
        if (response.status === 401) {
          errorMessage = "Необходима авторизация для сохранения результатов диагностики";
        } else if (response.status === 403) {
          errorMessage = "Нет доступа для сохранения результатов диагностики";
        } else if (response.status === 400) {
          errorMessage = "Некорректные данные диагностики";
        }
        
        throw new Error(`${errorMessage}. ${errorDetails}`);
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
      
      // Проверяем валидность ID пользователя
      if (!userId || isNaN(userId)) {
        console.error('[API] Невозможно получить прогресс: некорректный ID пользователя', userId);
        return [];
      }
      
      const response = await apiRequest('GET', `/api/diagnosis/progress/${userId}`);
      
      // Обрабатываем ошибки HTTP более детально
      if (!response.ok) {
        let errorMessage = "Ошибка при получении прогресса";
        let errorData = null;
        
        try {
          // Пытаемся получить подробности ошибки из JSON-ответа
          const errorResponse = await response.json();
          errorMessage = errorResponse.message || errorMessage;
          errorData = errorResponse;
          
          console.error(`[API] Ошибка при получении прогресса:`, {
            status: response.status,
            message: errorMessage,
            userId
          });
        } catch (parseError) {
          // Если не можем прочитать JSON, используем текст ответа
          try {
            const errorText = await response.text();
            console.error(`[API] Ошибка при получении прогресса: ${response.status}`, errorText);
          } catch (textError) {
            console.error(`[API] Ошибка при получении прогресса: ${response.status}`);
          }
        }
        
        // Создаем соответствующую ошибку с деталями о статусе HTTP
        const error = new Error(`Ошибка API: ${errorMessage}`);
        (error as any).status = response.status;
        (error as any).data = errorData;
        
        // Для любого статуса ошибки просто пробрасываем её дальше
        throw error;
      }
      
      const result = await response.json();
      console.log(`[API] Получен прогресс пользователя: ${result.data ? result.data.length : 0} записей`);
      
      // Более детальное логирование при успешном получении данных
      if (result.data && result.data.length > 0) {
        // Создаем объект для подсчета уникальных категорий
        const categories: Record<string, boolean> = {};
        result.data.forEach((item: any) => {
          if (item.category) {
            categories[item.category] = true;
          }
        });
        
        console.log('[API] Категории навыков в профиле:', Object.keys(categories).join(', '));
        
        // Логируем несколько навыков с наивысшим прогрессом
        const topSkills = result.data
          .sort((a: any, b: any) => b.progress - a.progress)
          .slice(0, 3)
          .map((item: any) => `${item.name}: ${item.progress}%`);
        
        console.log('[API] Топ навыки с наивысшим прогрессом:', topSkills.join(', '));
      } else {
        console.log('[API] Данные о прогрессе отсутствуют для пользователя', userId);
      }
      
      return result.data || [];
    } catch (error) {
      console.error('[API] Исключение при получении прогресса пользователя:', error);
      throw error; // Пробрасываем ошибку дальше для её правильной обработки
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
      
      // Проверяем валидность ID пользователя
      if (!userId || isNaN(userId)) {
        console.error('[API] Невозможно получить сводку: некорректный ID пользователя', userId);
        return {};
      }
      
      const response = await apiRequest('GET', `/api/diagnosis/summary/${userId}`);
      
      // Обрабатываем ошибки HTTP более детально
      if (!response.ok) {
        let errorMessage = "Ошибка при получении сводки";
        let errorData = null;
        
        try {
          // Пытаемся получить подробности ошибки из JSON-ответа
          const errorResponse = await response.json();
          errorMessage = errorResponse.message || errorMessage;
          errorData = errorResponse;
          
          console.error(`[API] Ошибка при получении сводки:`, {
            status: response.status,
            message: errorMessage,
            userId
          });
        } catch (parseError) {
          // Если не можем прочитать JSON, используем текст ответа
          try {
            const errorText = await response.text();
            console.error(`[API] Ошибка при получении сводки: ${response.status}`, errorText);
          } catch (textError) {
            console.error(`[API] Ошибка при получении сводки: ${response.status}`);
          }
        }
        
        // Создаем соответствующую ошибку с деталями о статусе HTTP
        const error = new Error(`Ошибка API: ${errorMessage}`);
        (error as any).status = response.status;
        (error as any).data = errorData;
        
        // Логируем дополнительную информацию для определенных типов ошибок
        if (response.status === 401) {
          console.warn('[API] Пользователь не авторизован для получения сводки');
        } else if (response.status === 403) {
          console.warn('[API] Нет доступа для просмотра сводки запрошенного пользователя');
        }
        
        // Для любого статуса ошибки просто пробрасываем её дальше
        throw error;
      }
      
      const result = await response.json();
      
      // Более детальное логирование при успешном получении данных
      if (result.data && Object.keys(result.data).length > 0) {
        console.log('[API] Получена сводка прогресса пользователя:', 
          Object.keys(result.data).length, 'категорий');
        
        // Логируем категории и средние значения
        const categories = Object.keys(result.data).map(category => {
          const data = result.data[category];
          return `${category}: ${data.avgProgress}% (${data.count} навыков)`;
        });
        
        console.log('[API] Категории и средний прогресс:', categories.join('; '));
        
        // Логируем максимальный уровень по категориям
        const maxLevels = Object.entries(result.data)
          .map(([category, data]: [string, any]) => `${category}: ${data.maxLevel}`)
          .join('; ');
        
        console.log('[API] Максимальные уровни по категориям:', maxLevels);
      } else {
        console.log('[API] Данные о сводке отсутствуют для пользователя', userId);
      }
      
      return result.data || {};
    } catch (error) {
      console.error('[API] Исключение при получении сводки пользователя:', error);
      throw error; // Пробрасываем ошибку дальше для её правильной обработки
    }
  }
};
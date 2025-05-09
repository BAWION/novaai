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
   * Логирует событие диагностики для мониторинга
   * @param eventType Тип события ('diagnosis_started', 'diagnosis_cached', etc.)
   * @param data Дополнительные данные
   */
  async logDiagnosticEvent(eventType: string, data: Record<string, any> = {}): Promise<void> {
    try {
      const eventData = {
        eventType,
        data: {
          ...data,
          timestamp: new Date().toISOString()
        }
      };
      
      await apiRequest('POST', '/api/events', eventData)
        .catch(error => {
          console.warn('[API] Не удалось отправить событие диагностики:', error);
        });
    } catch (error) {
      console.error('[API] Ошибка при логировании события диагностики:', error);
    }
  },
  /**
   * Кэширует диагностические данные в localStorage для последующего воспроизведения
   * @param results Результаты диагностики 
   */
  cacheDiagnosticResults(results: DiagnosisResult): void {
    try {
      // Сохраняем полную копию результатов диагностики в localStorage
      const cacheData = {
        timestamp: new Date().toISOString(),
        results: { ...results },
        cachingReason: "pending_auth",
        cached: true
      };
      
      // Используем специальный ключ, который будет проверяться после успешной авторизации
      localStorage.setItem('skillsDnaCachedResults', JSON.stringify(cacheData));
      console.log('[API] Результаты диагностики кэшированы в localStorage для будущего воспроизведения');
    } catch (error) {
      console.error('[API] Ошибка при кэшировании результатов диагностики:', error);
    }
  },

  /**
   * Проверяет наличие кэшированных результатов диагностики
   * @returns Наличие кэшированных результатов
   */
  hasCachedDiagnosticResults(): boolean {
    try {
      const cachedData = localStorage.getItem('skillsDnaCachedResults');
      return !!cachedData;
    } catch (error) {
      console.error('[API] Ошибка при проверке кэшированных результатов диагностики:', error);
      return false;
    }
  },

  /**
   * Получает кэшированные результаты диагностики
   * @returns Кэшированные результаты или null
   */
  getCachedDiagnosticResults(): { results: DiagnosisResult, timestamp: string } | null {
    try {
      const cachedDataString = localStorage.getItem('skillsDnaCachedResults');
      if (!cachedDataString) return null;
      
      const cachedData = JSON.parse(cachedDataString);
      return {
        results: cachedData.results,
        timestamp: cachedData.timestamp
      };
    } catch (error) {
      console.error('[API] Ошибка при получении кэшированных результатов диагностики:', error);
      return null;
    }
  },
  
  /**
   * Восстанавливает результаты диагностики из кэша и отправляет на сервер
   * @param userId ID пользователя для добавления к результатам
   * @returns Результат операции восстановления
   */
  async recoverCachedResults(userId: number): Promise<any> {
    try {
      // Проверяем наличие кэшированных результатов
      const cachedData = this.getCachedDiagnosticResults();
      if (!cachedData) {
        console.log('[API] Кэшированные результаты диагностики не найдены');
        return null;
      }
      
      const startTime = Date.now();
      
      // Добавляем ID пользователя к результатам
      const results = {
        ...cachedData.results,
        userId
      };
      
      console.log('[API] Восстановление кэшированных результатов диагностики:', {
        userId,
        skillsCount: Object.keys(results.skills).length,
        cacheAge: new Date().getTime() - new Date(cachedData.timestamp).getTime()
      });
      
      // Отправляем результаты на сервер
      try {
        const savedResults = await this.saveResults(results);
        
        // Вычисляем время восстановления
        const recoveryTimeMs = Date.now() - startTime;
        
        // Логируем успешное восстановление
        this.logDiagnosticEvent('diagnosis_recovered', {
          diagnosticType: results.diagnosticType,
          skillCount: Object.keys(results.skills).length,
          userId,
          cacheAge: new Date().getTime() - new Date(cachedData.timestamp).getTime(),
          recoveryTimeMs,
          success: true,
          timestamp: new Date().toISOString()
        });
        
        return savedResults;
      } catch (err) {
        // Преобразуем ошибку в понятный формат
        const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
        
        // Логируем неудачное восстановление
        this.logDiagnosticEvent('diagnosis_recovered', {
          diagnosticType: results.diagnosticType,
          skillCount: Object.keys(results.skills).length,
          userId,
          cacheAge: new Date().getTime() - new Date(cachedData.timestamp).getTime(),
          recoveryTimeMs: Date.now() - startTime,
          success: false,
          error: errorMessage,
          timestamp: new Date().toISOString()
        });
        
        throw err;
      }
    } catch (error) {
      console.error('[API] Ошибка восстановления кэшированных результатов диагностики:', error);
      throw error;
    }
  },

  /**
   * Очищает кэшированные результаты диагностики
   */
  clearCachedDiagnosticResults(): void {
    try {
      localStorage.removeItem('skillsDnaCachedResults');
      console.log('[API] Кэшированные результаты диагностики очищены');
    } catch (error) {
      console.error('[API] Ошибка при очистке кэшированных результатов диагностики:', error);
    }
  },
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
        // Кэшируем результаты при отсутствии userId для будущего воспроизведения после авторизации
        this.cacheDiagnosticResults(results);
        
        // Логируем событие кэширования диагностики для мониторинга
        this.logDiagnosticEvent('diagnosis_cached', {
          diagnosticType: results.diagnosticType,
          skillCount: Object.keys(results.skills).length,
          reason: 'no_user_id',
          timestamp: new Date().toISOString()
        });
        
        const error = new Error("ID пользователя отсутствует. Необходима авторизация для сохранения результатов.");
        console.error('[API] Ошибка валидации запроса: отсутствует ID пользователя, результаты кэшированы');
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
          // Кэшируем при 401, чтобы восстановить после авторизации
          this.cacheDiagnosticResults(results);
          
          // Логируем событие потери сессии в API диагностики
          this.logDiagnosticEvent('diagnosis_lost_session', {
            diagnosticType: results.diagnosticType,
            skillCount: Object.keys(results.skills).length,
            status: response.status,
            error: 'unauthorized',
            timestamp: new Date().toISOString()
          });
          
          console.log('[API] Статус 401, результаты диагностики кэшированы для последующего воспроизведения');
          errorMessage = "Необходима авторизация для сохранения результатов диагностики";
        } else if (response.status === 403) {
          errorMessage = "Нет доступа для сохранения результатов диагностики";
          
          // Логируем событие отказа в доступе
          this.logDiagnosticEvent('diagnosis_lost_session', {
            diagnosticType: results.diagnosticType,
            skillCount: Object.keys(results.skills).length,
            status: response.status,
            error: 'forbidden',
            timestamp: new Date().toISOString()
          });
        } else if (response.status === 400) {
          errorMessage = "Некорректные данные диагностики";
        }
        
        throw new Error(`${errorMessage}. ${errorDetails}`);
      }
      
      // При успешном сохранении очищаем кэш
      this.clearCachedDiagnosticResults();
      
      const data = await response.json();
      console.log('[API] Успешный ответ от сервера:', data);
      
      // Логируем успешное завершение диагностики
      this.logDiagnosticEvent('diagnosis_completed', {
        diagnosticType: results.diagnosticType,
        skillCount: Object.keys(results.skills).length,
        primarySkills: Object.entries(results.skills)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([name]) => name),
        userId: results.userId,
        timestamp: new Date().toISOString()
      });
      
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
        
        try {
          // Пытаемся получить подробности ошибки из JSON-ответа
          const errorResponse = await response.json();
          errorMessage = errorResponse.message || errorMessage;
          
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
        
        // Особая обработка для разных статусов ошибок
        if (response.status === 401) {
          console.warn('[API] Пользователь не авторизован для получения данных прогресса');
        } else if (response.status === 403) {
          console.warn('[API] Нет доступа для просмотра прогресса запрошенного пользователя');
        } 
        
        return [];
      }
      
      const result = await response.json();
      console.log(`[API] Получен прогресс пользователя: ${result.data ? result.data.length : 0} записей`);
      
      // Более детальное логирование при успешном получении данных
      if (result.data && result.data.length > 0) {
        // Получаем уникальные категории с помощью объекта для избежания проблем с Set
        const uniqueCategories: {[key: string]: boolean} = {};
        result.data.forEach((item: any) => {
          if (item && item.category) {
            uniqueCategories[item.category] = true;
          }
        });
        
        console.log('[API] Категории навыков в профиле:', 
          Object.keys(uniqueCategories).join(', '));
        
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
      
      // Проверяем валидность ID пользователя
      if (!userId || isNaN(userId)) {
        console.error('[API] Невозможно получить сводку: некорректный ID пользователя', userId);
        return {};
      }
      
      const response = await apiRequest('GET', `/api/diagnosis/summary/${userId}`);
      
      // Обрабатываем ошибки HTTP более детально
      if (!response.ok) {
        let errorMessage = "Ошибка при получении сводки";
        
        try {
          // Пытаемся получить подробности ошибки из JSON-ответа
          const errorResponse = await response.json();
          errorMessage = errorResponse.message || errorMessage;
          
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
        
        // Особая обработка для разных статусов ошибок
        if (response.status === 401) {
          console.warn('[API] Пользователь не авторизован для получения сводки');
        } else if (response.status === 403) {
          console.warn('[API] Нет доступа для просмотра сводки запрошенного пользователя');
        } 
        
        return {};
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
      return {};
    }
  }
};
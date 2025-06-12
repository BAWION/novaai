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
 * Пытается восстановить данные из резервных копий
 */
function tryRecoverFromBackup(): { results: DiagnosisResult, timestamp: string, from?: string } | null {
  try {
    // Сначала проверяем резервную копию
    const backupDataString = localStorage.getItem('skillsDnaCachedResults_backup');
    if (backupDataString) {
      try {
        const backupData = JSON.parse(backupDataString);
        return {
          results: backupData.results,
          timestamp: backupData.timestamp,
          from: 'backup_recovery'
        };
      } catch (parseError) {
        console.error('[API] Ошибка при разборе резервной копии:', parseError);
      }
    }
    
    // Затем проверяем упрощенную копию
    const simpleDataString = localStorage.getItem('skillsDnaCachedResults_simple');
    if (simpleDataString) {
      try {
        const simpleData = JSON.parse(simpleDataString);
        return {
          results: simpleData.results,
          timestamp: simpleData.timestamp,
          from: 'simple_backup_recovery'
        };
      } catch (parseError) {
        console.error('[API] Ошибка при разборе упрощенной копии:', parseError);
      }
    }
    
    return null;
  } catch (error) {
    console.error('[API] Ошибка при восстановлении из резервных копий:', error);
    return null;
  }
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
      // Детальное логирование для отладки
      console.log('[API] Начинаем кэширование результатов диагностики:', {
        hasResults: !!results,
        skillsCount: results.skills ? Object.keys(results.skills).length : 0,
        type: results.diagnosticType,
        browser: navigator.userAgent
      });
      
      // Сохраняем полную копию результатов диагностики в localStorage
      const cacheData = {
        timestamp: new Date().toISOString(),
        results: { ...results },
        cachingReason: "pending_auth",
        cached: true,
        from: window.location.pathname // Добавляем информацию о странице, с которой кэшировались данные
      };
      
      // Используем специальный ключ, который будет проверяться после успешной авторизации
      localStorage.setItem('skillsDnaCachedResults', JSON.stringify(cacheData));
      
      // Добавляем дополнительную надежность с дублирующим ключом
      try {
        localStorage.setItem('skillsDnaCachedResults_backup', JSON.stringify(cacheData));
      } catch (backupError) {
        console.warn('[API] Не удалось создать резервную копию кэшированных результатов:', backupError);
      }
      
      // Логируем событие кэширования для аналитики
      this.logDiagnosticEvent('diagnosis_cached', {
        diagnosticType: results.diagnosticType,
        skillCount: Object.keys(results.skills).length,
        page: window.location.pathname,
        timestamp: new Date().toISOString()
      });
      
      console.log('[API] Результаты диагностики успешно кэшированы в localStorage для будущего воспроизведения');
    } catch (error) {
      console.error('[API] Ошибка при кэшировании результатов диагностики:', error);
      
      // Пытаемся использовать упрощенный вариант в случае ошибки
      try {
        const simplifiedData = {
          timestamp: new Date().toISOString(),
          results: {
            userId: results.userId,
            skills: { ...results.skills },
            diagnosticType: results.diagnosticType
          }
        };
        localStorage.setItem('skillsDnaCachedResults_simple', JSON.stringify(simplifiedData));
        console.log('[API] Создана упрощенная резервная копия результатов диагностики');
      } catch (fallbackError) {
        console.error('[API] Не удалось создать даже упрощенную копию:', fallbackError);
      }
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
  getCachedDiagnosticResults(): { results: DiagnosisResult, timestamp: string, from?: string } | null {
    try {
      // Попытка получить данные из основного хранилища
      const cachedDataString = localStorage.getItem('skillsDnaCachedResults');
      
      // Если основное хранилище не содержит данных, проверяем резервную копию
      if (!cachedDataString) {
        console.log('[API] Основное хранилище не содержит кэшированных результатов, проверяем резервное...');
        
        // Проверяем резервную копию
        const backupDataString = localStorage.getItem('skillsDnaCachedResults_backup');
        if (backupDataString) {
          console.log('[API] Найдена резервная копия кэшированных результатов');
          
          try {
            const backupData = JSON.parse(backupDataString);
            
            // Восстанавливаем основную копию из резервной
            localStorage.setItem('skillsDnaCachedResults', backupDataString);
            console.log('[API] Основное хранилище восстановлено из резервной копии');
            
            return {
              results: backupData.results,
              timestamp: backupData.timestamp,
              from: backupData.from
            };
          } catch (parseError) {
            console.error('[API] Ошибка при разборе резервной копии:', parseError);
          }
        }
        
        // Если резервная копия не помогла, проверяем упрощенную копию
        const simpleDataString = localStorage.getItem('skillsDnaCachedResults_simple');
        if (simpleDataString) {
          console.log('[API] Найдена упрощенная копия кэшированных результатов');
          
          try {
            const simpleData = JSON.parse(simpleDataString);
            return {
              results: simpleData.results,
              timestamp: simpleData.timestamp,
              from: 'simplified_backup'
            };
          } catch (parseError) {
            console.error('[API] Ошибка при разборе упрощенной копии:', parseError);
          }
        }
        
        return null;
      }
      
      // Основное хранилище содержит данные
      try {
        const cachedData = JSON.parse(cachedDataString);
        console.log('[API] Успешно получены кэшированные результаты диагностики');
        
        return {
          results: cachedData.results,
          timestamp: cachedData.timestamp,
          from: cachedData.from
        };
      } catch (parseError) {
        console.error('[API] Ошибка при разборе данных из основного хранилища:', parseError);
        
        // Пробуем восстановить из резервной копии
        return tryRecoverFromBackup();
      }
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
      console.log('[API] Попытка восстановления кэшированных результатов диагностики для пользователя:', userId);
      
      // Проверяем наличие кэшированных результатов с расширенным логированием
      const cachedData = this.getCachedDiagnosticResults();
      if (!cachedData) {
        console.log('[API] Кэшированные результаты диагностики не найдены в localStorage');
        
        // Проверяем локальное хранилище напрямую для дополнительной диагностики
        try {
          const keys = Object.keys(localStorage);
          console.log('[API] Содержимое localStorage:', keys);
          
          // Пытаемся найти любые ключи связанные с диагностикой
          const diagnosisKeys = keys.filter(key => key.includes('skills') || key.includes('diagnosis'));
          if (diagnosisKeys.length > 0) {
            console.log('[API] Найдены потенциальные ключи для восстановления:', diagnosisKeys);
          }
        } catch (storageErr) {
          console.warn('[API] Не удалось проверить содержимое localStorage:', storageErr);
        }
        
        return null;
      }
      
      const startTime = Date.now();
      const cacheSource = cachedData.from || 'primary_storage';
      
      // Добавляем ID пользователя к результатам
      const results = {
        ...cachedData.results,
        userId
      };
      
      // Рассчитываем возраст кэша
      const cacheAgeMs = new Date().getTime() - new Date(cachedData.timestamp).getTime();
      const cacheAgeMinutes = Math.round(cacheAgeMs / (1000 * 60));
      
      console.log('[API] Восстановление кэшированных результатов диагностики:', {
        userId,
        skillsCount: Object.keys(results.skills).length,
        cacheAgeMinutes,
        cacheSource,
        diagnosticType: results.diagnosticType
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
          cacheAgeMinutes,
          cacheSource,
          recoveryTimeMs,
          success: true,
          timestamp: new Date().toISOString()
        });
        
        // При успешном восстановлении очищаем кэш
        this.clearCachedDiagnosticResults();
        console.log('[API] Кэш очищен после успешного восстановления');
        
        return savedResults;
      } catch (err) {
        // Преобразуем ошибку в понятный формат
        const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
        const errorType = err instanceof Error ? err.constructor.name : 'Unknown';
        
        console.error('[API] Ошибка при восстановлении результатов из кэша:', {
          errorType,
          message: errorMessage
        });
        
        // Логируем неудачное восстановление
        this.logDiagnosticEvent('diagnosis_recovery_failed', {
          diagnosticType: results.diagnosticType,
          skillCount: Object.keys(results.skills).length,
          userId,
          cacheAgeMinutes,
          cacheSource,
          recoveryTimeMs: Date.now() - startTime,
          error: errorMessage,
          errorType,
          timestamp: new Date().toISOString()
        });
        
        // При ошибке авторизации сохраняем кэш для следующей попытки
        if (errorMessage.includes('авторизация') || errorMessage.includes('unauthorized')) {
          console.log('[API] Кэш сохранен для последующих попыток восстановления после авторизации');
        } else {
          // При других ошибках кэш лучше очистить, чтобы избежать повторений неудачных запросов
          this.clearCachedDiagnosticResults();
          console.log('[API] Кэш очищен из-за неустранимой ошибки восстановления');
        }
        
        throw err;
      }
    } catch (error) {
      console.error('[API] Исключение при восстановлении кэшированных результатов диагностики:', error);
      throw error;
    }
  },

  /**
   * Очищает кэшированные результаты диагностики
   */
  clearCachedDiagnosticResults(): void {
    try {
      console.log('[API] Начинаем очистку всех кэшированных результатов диагностики');
      
      // Очищаем основное хранилище
      localStorage.removeItem('skillsDnaCachedResults');
      
      // Очищаем резервную копию
      localStorage.removeItem('skillsDnaCachedResults_backup');
      
      // Очищаем упрощенную копию
      localStorage.removeItem('skillsDnaCachedResults_simple');
      
      // Логируем событие очистки для аналитики
      this.logDiagnosticEvent('diagnosis_cache_cleared', {
        timestamp: new Date().toISOString()
      });
      
      console.log('[API] Все копии кэшированных результатов диагностики успешно очищены');
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
      console.log('[API-DEBUG] Вызов saveResults с данными:', {
        hasUserId: !!results.userId,
        userId: results.userId,
        skillsCount: results.skills ? Object.keys(results.skills).length : 0,
        diagnosticType: results.diagnosticType,
        timestamp: new Date().toISOString()
      });
    
      // Проверяем, что у нас есть ID пользователя
      if (!results.userId) {
        console.warn('[API-DEBUG] ID пользователя отсутствует при сохранении результатов, кэширование...');
        
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
      
      console.log('[API-DEBUG] ID пользователя присутствует:', results.userId);
      
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
          console.log('[API] Получена ошибка 401, начинаем процедуру кэширования результатов диагностики');
          
          // Кэшируем при 401, чтобы восстановить после авторизации
          this.cacheDiagnosticResults(results);
          
          // Получаем информацию о сессии из куки для лучшей отладки
          let cookieInfo = 'no_cookies';
          try {
            cookieInfo = document.cookie ? 'cookies_present' : 'empty_cookies';
          } catch (cookieErr) {
            console.warn('[API] Ошибка при проверке cookies:', cookieErr);
          }
          
          // Сохраняем расширенную информацию об ошибке для последующего восстановления
          try {
            const errorInfo = {
              code: 'AUTH_REQUIRED',
              timestamp: new Date().toISOString(),
              userId: results.userId,
              url: window.location.href,
              cookieInfo
            };
            localStorage.setItem('skillsDnaLastError', JSON.stringify(errorInfo));
          } catch (storageErr) {
            console.warn('[API] Ошибка при сохранении информации об ошибке в localStorage:', storageErr);
          }
          
          // Логируем детальное событие потери сессии в API диагностики
          this.logDiagnosticEvent('diagnosis_session_lost_cached', {
            diagnosticType: results.diagnosticType,
            skillCount: Object.keys(results.skills).length,
            userId: results.userId,
            status: response.status,
            error: 'session_lost_but_cached',
            cookieInfo,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            referrer: document.referrer || 'no_referrer',
            hasUserId: !!results.userId
          });
          
          console.log('[API] Результаты диагностики кэшированы для восстановления после повторной авторизации. Детали:', {
            userId: results.userId,
            skillsCount: Object.keys(results.skills).length,
            cookieInfo,
            url: window.location.href
          });
          
          errorMessage = "Сессия потеряна. Результаты диагностики сохранены для восстановления после авторизации";
        } else if (response.status === 403) {
          errorMessage = "Нет доступа для сохранения результатов диагностики";
          
          // Получаем детали ошибки, чтобы понять, является ли это конфликтом ID
          let isIdConflict = false;
          try {
            const errorDetails = await response.json();
            if (errorDetails.code === 'ID_CONFLICT') {
              isIdConflict = true;
              // Сохраняем код ошибки в localStorage для обработки в хуке useSkillsDna
              localStorage.setItem('skillsDnaLastError', 'ID_CONFLICT');
              console.log('[API] Обнаружен конфликт идентификации пользователя, переключаемся в демо-режим');
            }
          } catch (parseError) {
            console.warn('[API] Ошибка при разборе ответа 403:', parseError);
          }
          
          // Логируем событие отказа в доступе
          this.logDiagnosticEvent('diagnosis_access_denied', {
            diagnosticType: results.diagnosticType,
            skillCount: Object.keys(results.skills).length,
            status: response.status,
            error: isIdConflict ? 'id_conflict' : 'forbidden',
            timestamp: new Date().toISOString(),
            userId: results.userId
          });
        } else if (response.status === 400) {
          errorMessage = "Некорректные данные диагностики";
          
          // Для 400 ошибок логируем больше деталей, чтобы найти причину некорректных данных
          this.logDiagnosticEvent('diagnosis_invalid_data', {
            diagnosticType: results.diagnosticType,
            skillCount: Object.keys(results.skills).length,
            status: response.status,
            error: 'bad_request',
            timestamp: new Date().toISOString(),
            hasUserId: !!results.userId,
            hasSkills: !!results.skills
          });
        } else {
          // Для других ошибок (500, 503 и т.д.) тоже кэшируем данные
          this.cacheDiagnosticResults(results);
          
          this.logDiagnosticEvent('diagnosis_server_error', {
            diagnosticType: results.diagnosticType,
            skillCount: Object.keys(results.skills).length,
            status: response.status,
            error: 'server_error',
            timestamp: new Date().toISOString()
          });
          
          console.log(`[API] Статус ${response.status}, результаты диагностики кэшированы для последующего воспроизведения`);
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
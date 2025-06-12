import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";
import express from "express";

/**
 * Создает и настраивает хранилище сессий в PostgreSQL
 * Обеспечивает сохранность сессий между перезагрузками сервера
 * 
 * Включает проверку соединения и повторные попытки при ошибках
 */
export async function createSessionStore() {
  const PostgreSqlStore = connectPgSimple(session);
  
  // Функция для проверки соединения с базой данных
  async function checkDatabaseConnection() {
    let retries = 5;
    let connected = false;
    
    while (retries > 0 && !connected) {
      try {
        // Проверяем подключение к PostgreSQL
        const result = await pool.query('SELECT 1');
        if (result && result.rows && result.rows.length > 0) {
          connected = true;
          console.log("[Session] Успешное подключение к PostgreSQL");
          return true;
        }
      } catch (error) {
        retries--;
        console.error(`[Session] Ошибка подключения к PostgreSQL, осталось попыток: ${retries}`);
        
        if (retries > 0) {
          console.log("[Session] Повторная попытка подключения через 2 секунды...");
          await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
          console.error("[Session] Не удалось подключиться к PostgreSQL после нескольких попыток");
          throw new Error("Failed to connect to PostgreSQL after multiple attempts");
        }
      }
    }
    
    return connected;
  }
  
  // Проверяем соединение перед созданием хранилища
  await checkDatabaseConnection();
  
  // Создаем таблицу session в базе данных PostgreSQL, если она не существует
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" varchar NOT NULL COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL,
        CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
      )
    `);
    console.log("[Session] Таблица сессий в PostgreSQL проверена/создана");
  } catch (error) {
    console.error("[Session] Ошибка при инициализации таблицы сессий:", error);
    throw new Error("Failed to initialize session table in PostgreSQL");
  }
  
  // Проверяем работоспособность таблицы сессий
  try {
    // Пробуем выполнить запрос к таблице сессий
    await pool.query('SELECT COUNT(*) FROM "session"');
    console.log("[Session] Таблица сессий доступна и работает корректно");
  } catch (error) {
    console.error("[Session] Ошибка при проверке таблицы сессий:", error);
    throw new Error("Session table is not accessible");
  }
  
  // Возвращаем настроенное хранилище сессий с улучшенными параметрами
  return new PostgreSqlStore({
    pool: pool,                  // Используем существующий пул соединений
    tableName: 'session',        // Имя таблицы для хранения сессий
    createTableIfMissing: true,
    pruneSessionInterval: 60 * 15, // Очистка устаревших сессий каждые 15 минут
    errorLog: (err) => console.error('[Session Store Error]', err),
    disableTouch: false        // Разрешаем обновление времени жизни сессий
  });
}

/**
 * Создает настройки сессии для Express с улучшенной стабильностью
 * @param sessionStore Хранилище сессий
 */
export function createSessionOptions(sessionStore: session.Store) {
  // Функция для определения домена cookie в зависимости от окружения
  const getCookieDomain = () => {
    // Всегда возвращаем undefined для упрощения настроек в Replit
    return undefined; // Позволяем браузеру автоматически определить домен
  };

  // Генерируем сложный секретный ключ, если не задан в переменных окружения
  const generateStrongSecret = () => {
    const defaultSecret = "nova-ai-university-secret-v3";
    const envSecret = process.env.SESSION_SECRET;
    
    if (envSecret) {
      return envSecret;
    }
    
    // Логируем предупреждение при использовании дефолтного ключа
    console.warn("[Session] ВНИМАНИЕ: Используется дефолтный секретный ключ сессии. "+
                "Для продакшена рекомендуется установить переменную окружения SESSION_SECRET");
    
    return defaultSecret;
  };

  return {
    name: "connect.sid", // Стандартное имя cookie для совместимости
    secret: generateStrongSecret(),
    resave: false, // Не сохраняем сессию, если она не была изменена
    saveUninitialized: false, // Не создаем сессию до авторизации
    store: sessionStore,
    rolling: true, // Обновляет cookie при каждом запросе
    cookie: {
      httpOnly: true, // Безопасность: cookie недоступен через JavaScript
      secure: true, // true для HTTPS на Replit (trust proxy обеспечивает корректность)
      sameSite: 'none' as const, // none для cross-origin в Replit среде
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
      path: '/'
      // domain НЕ устанавливаем для монолита на одном домене
    }
  };
}

/**
 * Создает middleware для отладки сессий с расширенной информацией
 */
export function createSessionDebugMiddleware() {
  let counter = 0;
  
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    counter++;
    const requestId = counter;
    const sessionID = req.sessionID || 'none';
    const hasUser = !!req.session?.user;
    const userId = req.session?.user?.id;
    const username = req.session?.user?.username || 'anonymous';
    
    // Логируем основную информацию о запросе
    console.log(`[Session Debug #${requestId}] ${req.method} ${req.path} | Session: ${sessionID.substring(0, 8)}... | User: ${hasUser ? username : 'none'} (${userId || 'n/a'})`);
    
    // Сохраняем время начала запроса
    const startTime = Date.now();
    
    // Логируем состояние сессии для важных маршрутов
    const isAuthRoute = req.path.startsWith('/api/auth');
    const isProfileRoute = req.path.startsWith('/api/profile');
    const isDiagnosisRoute = req.path.startsWith('/api/diagnosis');
    
    if (isAuthRoute || isProfileRoute || isDiagnosisRoute) {
      console.log(`[Session Detail #${requestId}] Cookies:`, req.headers.cookie);
      
      // Для маршрутов аутентификации проверяем состав сессии
      if (isAuthRoute) {
        if (req.session) {
          console.log(`[Session Auth #${requestId}] Session exists:`, {
            id: req.sessionID,
            cookie: {
              originalMaxAge: req.session.cookie.originalMaxAge,
              expires: req.session.cookie.expires,
              secure: req.session.cookie.secure,
              httpOnly: req.session.cookie.httpOnly,
            },
            hasUser: !!req.session.user,
            userInfo: req.session.user ? {
              id: req.session.user.id,
              username: req.session.user.username,
              displayName: req.session.user.displayName,
            } : 'no user data'
          });
        } else {
          console.log(`[Session Auth #${requestId}] No session object available`);
        }
      }
    }
    
    // После завершения запроса логируем статус и время выполнения
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const statusClass = Math.floor(res.statusCode / 100);
      
      // Разный уровень логирования в зависимости от статуса
      if (statusClass === 2) {
        console.log(`[Session Debug #${requestId}] ${req.method} ${req.path} | Status: ${res.statusCode} | Duration: ${duration}ms`);
      } else if (statusClass === 4 || statusClass === 5) {
        console.warn(`[Session Error #${requestId}] ${req.method} ${req.path} | Status: ${res.statusCode} | Duration: ${duration}ms`);
      }
      
      // Для диагностики ошибок сессии
      if (res.statusCode === 401 && req.session) {
        console.warn(`[Session Auth #${requestId}] 401 Unauthorized with session ID: ${req.sessionID}`);
      }
    });
    
    next();
  };
}
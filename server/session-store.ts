import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";
import express from "express";

/**
 * Создает и настраивает хранилище сессий в PostgreSQL
 * Обеспечивает сохранность сессий между перезагрузками сервера
 */
export async function createSessionStore() {
  const PostgreSqlStore = connectPgSimple(session);
  
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
  
  // Возвращаем настроенное хранилище сессий
  return new PostgreSqlStore({
    pool: pool,               // Используем существующий пул соединений
    tableName: 'session',     // Имя таблицы для хранения сессий
    createTableIfMissing: true,
    pruneSessionInterval: 60 * 60 // Очистка устаревших сессий каждый час (в секундах)
  });
}

/**
 * Создает настройки сессии для Express
 * @param sessionStore Хранилище сессий
 */
export function createSessionOptions(sessionStore: session.Store) {
  // Функция для определения домена cookie в зависимости от окружения
  const getCookieDomain = () => {
    if (process.env.NODE_ENV === 'production') {
      return '.replit.app'; // Общий домен для всех replit приложений
    }
    return undefined; // В development режиме домен не задаем
  };

  return {
    name: "nova_session_v2", // Изменено имя cookie, чтобы избежать конфликтов со старыми сессиями
    secret: process.env.SESSION_SECRET || "nova-ai-university-secret-v2",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    rolling: true, // Обновляет cookie при каждом запросе
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' as const : 'lax' as const,
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 дней
      path: '/',
      domain: getCookieDomain() 
    }
  };
}

/**
 * Создает middleware для отладки сессий
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
    
    console.log(`[Session Debug #${requestId}] ${req.method} ${req.path} | Session: ${sessionID.substring(0, 8)}... | User: ${hasUser ? username : 'none'} (${userId || 'n/a'})`);
    
    // Сохраняем время начала запроса
    const startTime = Date.now();
    
    // После завершения запроса логируем статус и время выполнения
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      console.log(`[Session Debug #${requestId}] ${req.method} ${req.path} | Status: ${res.statusCode} | Duration: ${duration}ms`);
    });
    
    next();
  };
}
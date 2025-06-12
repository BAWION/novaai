import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';
import { Session } from 'express-session';

/**
 * Расширяем типы сессии для наших дополнительных полей
 */
declare module 'express-session' {
  interface Session {
    user?: {
      id: number;
      username: string;
      email?: string;
      role?: string;
    };
    authenticated?: boolean;
    authError?: string;
    lastActivity?: string;
    createdAt?: string;
    userAgent?: string;
    passport?: {
      user: number;
    };
  }
}

/**
 * Унифицированный middleware с автоматическим восстановлением сессий
 */
export const enhancedAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestPath = `${req.method} ${req.originalUrl || req.path}`;
    
    // Проверяем наличие сессии
    if (!req.session) {
      return res.status(401).json({ message: "Unauthorized - No session" });
    }

    let authenticated = !!req.session.authenticated;
    let user = req.session.user;

    // Автоматическое восстановление сессии если есть userId
    if ((!user || !authenticated) && req.session.user?.id) {
      try {
        const userData = await storage.getUser(req.session.user.id);
        
        if (userData) {
          req.session.user = {
            id: userData.id,
            username: userData.username,
            email: userData.email || undefined,
            role: userData.role || undefined
          };
          req.session.authenticated = true;
          req.session.lastActivity = new Date().toISOString();
          authenticated = true;
          user = req.session.user;
        }
      } catch (error) {
        console.error(`[EnhancedAuth] Ошибка восстановления сессии:`, error);
      }
    }

    if (!authenticated || !user || !user.id) {
      return res.status(401).json({ message: "Unauthorized - Not authenticated" });
    }

    next();
  } catch (error) {
    console.error(`[EnhancedAuth] Middleware error:`, error);
    return res.status(500).json({ message: "Authentication error" });
  }
};

/**
 * Middleware для аутентификации пользователей
 * Проверяет наличие сессии и пользовательских данных
 * Включает расширенную диагностику и улучшенную обработку ошибок
 */
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // Выводим информацию о запросе
  const requestPath = `${req.method} ${req.originalUrl || req.path}`;
  const sessionId = req.sessionID ? req.sessionID : 'none';
  
  // Подробное логирование запроса для диагностики с улучшенной информацией о куках
  console.log(`[Auth Debug] Request: ${requestPath}`);
  
  // Проверяем наличие кук в запросе
  const hasCookies = !!req.headers.cookie;
  const cookieInfo = hasCookies && req.headers.cookie 
    ? req.headers.cookie.substring(0, 80) + '...' 
    : 'куки отсутствуют';
  console.log(`[Auth Debug] Cookies Present: ${hasCookies}, Value: ${cookieInfo}`);
  
  // Проверяем детали сессии
  console.log(`[Auth Debug] Session ID: ${sessionId}`);
  console.log(`[Auth Debug] Session Keys:`, req.session ? Object.keys(req.session) : 'null');
  
  // Добавляем информацию о заголовках запроса для диагностики проблем с куками
  console.log(`[Auth Debug] Headers: ${JSON.stringify({
    origin: req.headers.origin || 'none',
    referer: req.headers.referer || 'none',
    userAgent: req.headers['user-agent'] || 'none'
  })}`);
  
  // Проверка на наличие данных Passport (может быть в разных местах)
  if (req.session) {
    // Проверка passport данных
    const hasPassport = !!req.session.passport;
    if (hasPassport) {
      console.log(`[Auth Debug] Passport Data:`, req.session.passport);
    } else {
      console.log(`[Auth Debug] Passport Data: отсутствует`);
    }
    
    // Дополнительные проверки данных сессии
    console.log(`[Auth Debug] Session User:`, req.session.user ? `ID: ${req.session.user.id}` : 'отсутствует');
    console.log(`[Auth Debug] Session Auth:`, req.session.authenticated ? 'true' : 'false или отсутствует');
    console.log(`[Auth Debug] Session Last Activity:`, req.session.lastActivity || 'отсутствует');
    console.log(`[Auth Debug] Session Created:`, req.session.createdAt || 'отсутствует');
  }
  
  // Проверяем наличие сессии
  if (!req.session) {
    console.error(`[Auth] Сессия отсутствует для запроса ${requestPath}`);
    return res.status(401).json({ message: "Unauthorized - No session" });
  }
  
  // Проверяем статус аутентификации
  let authenticated = !!req.session.authenticated;
  
  // Проверяем наличие пользователя в сессии
  const user = req.session.user;
  
  // Автоматическое восстановление сессии: если есть user но нет authenticated флага
  if (!authenticated && user && user.id && user.username) {
    console.log(`[Auth] Обнаружена сессия с пользователем но без флага аутентификации. Восстанавливаем...`);
    
    try {
      // Проверяем существование пользователя в базе данных
      const userData = await storage.getUser(user.id);
      
      if (userData) {
        console.log(`[Auth] Пользователь ${user.id} найден в базе данных. Восстанавливаем сессию...`);
        
        // Обновляем данные сессии с актуальными данными из БД
        req.session.user = {
          id: userData.id,
          username: userData.username,
          email: userData.email || undefined,
          displayName: userData.displayName || undefined,
          role: userData.role || undefined
        };
        req.session.authenticated = true;
        req.session.lastActivity = new Date().toISOString();
        authenticated = true;
        
        // Сохраняем сессию асинхронно
        req.session.save((err) => {
          if (err) console.error("[Auth] Ошибка при восстановлении сессии:", err);
          else console.log(`[Auth] Сессия успешно восстановлена для пользователя ${userData.username}`);
        });
      } else {
        console.log(`[Auth] Пользователь ${user.id} не найден в базе данных. Очищаем сессию...`);
        req.session.user = undefined;
        req.session.authenticated = false;
      }
    } catch (error) {
      console.error("[Auth] Ошибка при проверке пользователя в базе данных:", error);
    }
  }
  
  // Расширенное логирование для отладки
  console.log(`[Auth] Сессия ${sessionId} для запроса ${requestPath} | Аутентифицирован: ${authenticated}`);
  
  if (!authenticated || !user) {
    console.log(`[Auth] Пользователь не аутентифицирован в сессии для запроса ${requestPath}`);
    console.log(`[Auth] Детали сессии:`, {
      id: req.sessionID,
      authenticated: authenticated,
      hasUser: !!user,
      hasCookies: !!req.headers.cookie,
      cookies: req.headers.cookie ? req.headers.cookie.substring(0, 50) + '...' : 'отсутствуют'
    });
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  // Проверяем полноту пользовательских данных
  if (!user.id || !user.username) {
    console.error(`[Auth] Некорректные данные пользователя в сессии:`, JSON.stringify(user));
    
    // Отмечаем сессию как неаутентифицированную
    req.session.authenticated = false;
    req.session.authError = "Invalid user data";
    
    req.session.save((err) => {
      if (err) console.error("[Auth] Ошибка при сохранении флага неаутентифицированной сессии:", err);
    });
    
    return res.status(401).json({ message: "Unauthorized - Invalid user data" });
  }
  
  // При каждом запросе обновляем сессию для продления срока действия
  req.session.touch();
  
  // Дополняем данные сессии временем последнего использования и другой полезной информацией
  const now = new Date();
  req.session.lastActivity = now.toISOString();
  
  // Добавляем дополнительные данные при первом обращении
  if (!req.session.createdAt) {
    req.session.createdAt = now.toISOString();
    req.session.userAgent = req.headers['user-agent'] || 'unknown';
    console.log(`[Auth] Создана новая запись в сессии для пользователя ${user.username}`);
  }
  
  // Обеспечиваем наличие флага аутентификации
  req.session.authenticated = true;
  
  // Сохраняем сессию асинхронно, не блокируя основной поток, с повторными попытками
  const saveSession = (attempt = 1) => {
    req.session.save((err) => {
      if (err) {
        console.error(`[Auth] Ошибка при обновлении сессии для ${user.username} (попытка ${attempt}):`, err);
        
        // Повторяем попытку максимум 3 раза
        if (attempt < 3) {
          console.log(`[Auth] Повторная попытка сохранения сессии ${attempt+1}/3...`);
          setTimeout(() => saveSession(attempt + 1), 100 * attempt);
        } else {
          console.error(`[Auth] Не удалось сохранить сессию после 3 попыток`);
        }
      } else {
        console.log(`[Auth] Сессия успешно обновлена для ${user.username} (ID: ${user.id})`);
      }
    });
  };
  
  saveSession();
  
  // Логируем успешную аутентификацию
  console.log(`[Auth] Пользователь ${user.username} (ID: ${user.id}) успешно аутентифицирован для ${requestPath}`);
  
  // Все проверки пройдены, продолжаем
  next();
};

/**
 * Middleware для опционального доступа
 * Проверяет пользователя, но не блокирует доступ если пользователь не аутентифицирован
 * Совместим с улучшенной системой сессий
 */
export const optionalAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Получаем идентификатор сессии для логирования
  const sessionId = req.sessionID ? req.sessionID.substring(0, 8) + '...' : 'none';
  
  // Проверка наличия сессии и пользователя, но без блокировки доступа
  if (req.session) {
    const authenticated = req.session.authenticated;
    const hasUser = !!req.session.user;
    
    // Обновляем сессию для продления срока действия только если аутентифицирован
    if (authenticated && hasUser) {
      req.session.touch();
      
      // Обновляем временные метки и важную информацию для диагностики
      const now = new Date();
      req.session.lastActivity = now.toISOString();
      
      // Добавляем дополнительные данные при первом обращении
      if (!req.session.createdAt) {
        req.session.createdAt = now.toISOString();
        req.session.userAgent = req.headers['user-agent'] || 'unknown';
        console.log(`[OptionalAuth] Создана новая запись в сессии для пользователя ${req.session.user?.username}`);
      }
      
      // Используем тот же механизм повторных попыток как в основном middleware
      const saveSession = (attempt = 1) => {
        req.session.save((err) => {
          if (err) {
            console.error(`[OptionalAuth] Ошибка при обновлении сессии (попытка ${attempt}):`, err);
            
            // Повторяем попытку максимум 3 раза
            if (attempt < 3) {
              console.log(`[OptionalAuth] Повторная попытка сохранения сессии ${attempt+1}/3...`);
              setTimeout(() => saveSession(attempt + 1), 100 * attempt);
            } else {
              console.error(`[OptionalAuth] Не удалось сохранить сессию после 3 попыток`);
            }
          } else {
            console.log(`[OptionalAuth] Сессия ${sessionId} обновлена успешно для пользователя ${req.session.user?.username}`);
          }
        });
      };
      
      saveSession();
    } else {
      console.log(`[OptionalAuth] Сессия ${sessionId} существует, но пользователь не аутентифицирован (auth: ${authenticated}, user: ${hasUser})`);
      
      // Логируем детали неаутентифицированной сессии
      console.log(`[OptionalAuth] Детали неаутентифицированной сессии:`, {
        sessionId,
        keys: Object.keys(req.session),
        authenticated,
        hasUser,
        hasCookies: !!req.headers.cookie
      });
    }
  } else {
    console.log(`[OptionalAuth] Сессия отсутствует для запроса ${req.method} ${req.path}`);
  }
  
  // Всегда продолжаем выполнение, независимо от статуса аутентификации
  next();
};
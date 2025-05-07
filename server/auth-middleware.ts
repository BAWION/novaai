import { Request, Response, NextFunction } from 'express';

/**
 * Middleware для аутентификации пользователей
 * Проверяет наличие сессии и пользовательских данных
 * Включает расширенную диагностику и улучшенную обработку ошибок
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Выводим информацию о запросе
  const requestPath = `${req.method} ${req.path}`;
  const sessionId = req.sessionID ? req.sessionID.substring(0, 8) + '...' : 'none';
  
  // Проверяем наличие сессии
  if (!req.session) {
    console.error(`[Auth] Сессия отсутствует для запроса ${requestPath}`);
    return res.status(401).json({ message: "Unauthorized - No session" });
  }
  
  // Проверяем статус аутентификации
  const authenticated = !!req.session.authenticated;
  
  // Проверяем наличие пользователя в сессии
  const user = req.session.user;
  
  // Расширенное логирование для отладки
  console.log(`[Auth] Сессия ${sessionId} для запроса ${requestPath} | Аутентифицирован: ${authenticated}`);
  
  if (!authenticated || !user) {
    console.log(`[Auth] Пользователь не аутентифицирован в сессии для запроса ${requestPath}`);
    console.log(`[Auth] Детали сессии:`, {
      id: req.sessionID,
      authenticated: authenticated,
      hasUser: !!user,
      cookies: req.headers.cookie?.substring(0, 50) + '...'
    });
    return res.status(401).json({ message: "Unauthorized - Not authenticated" });
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
  
  // Дополняем данные сессии временем последнего использования
  req.session.lastActivity = new Date().toISOString();
  
  // Сохраняем сессию асинхронно, не блокируя основной поток
  req.session.save((err) => {
    if (err) {
      console.error(`[Auth] Ошибка при обновлении сессии для ${user.username}:`, err);
    }
  });
  
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
      req.session.lastActivity = new Date().toISOString();
      
      req.session.save((err) => {
        if (err) {
          console.error(`[OptionalAuth] Ошибка при обновлении сессии:`, err);
        } else {
          console.log(`[OptionalAuth] Сессия ${sessionId} обновлена успешно для пользователя ${req.session.user?.username}`);
        }
      });
    } else {
      console.log(`[OptionalAuth] Сессия ${sessionId} существует, но пользователь не аутентифицирован (auth: ${authenticated}, user: ${hasUser})`);
    }
  } else {
    console.log(`[OptionalAuth] Сессия отсутствует для запроса ${req.method} ${req.path}`);
  }
  
  // Всегда продолжаем выполнение, независимо от статуса аутентификации
  next();
};
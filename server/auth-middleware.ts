import { Request, Response, NextFunction } from 'express';

/**
 * Middleware для аутентификации пользователей
 * Проверяет наличие сессии и пользовательских данных
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Проверяем наличие сессии
  if (!req.session) {
    console.error(`[Auth] Сессия отсутствует для запроса ${req.method} ${req.path}`);
    return res.status(401).json({ message: "Unauthorized - No session" });
  }
  
  // Проверяем наличие пользователя в сессии
  const user = req.session.user;
  const sessionId = req.sessionID ? req.sessionID.substring(0, 8) + '...' : 'unknown';
  
  // Логирование для отладки
  console.log(`[Auth] Сессия ${sessionId} для запроса ${req.method} ${req.path}`);
  console.log(`[Auth] Пользователь в сессии: ${user ? user.username : 'undefined'}`);
  
  if (!user) {
    console.log(`[Auth] Пользователь не найден в сессии для запроса ${req.method} ${req.path}`);
    return res.status(401).json({ message: "Unauthorized - Not authenticated" });
  }
  
  // Проверяем полноту пользовательских данных
  if (!user.id || !user.username) {
    console.error(`[Auth] Некорректные данные пользователя в сессии:`, JSON.stringify(user));
    return res.status(401).json({ message: "Unauthorized - Invalid user data" });
  }
  
  // При каждом запросе обновляем сессию для продления срока действия
  req.session.touch();
  
  // Сохраняем сессию асинхронно, не блокируя основной поток
  req.session.save((err) => {
    if (err) {
      console.error(`[Auth] Ошибка при обновлении сессии для ${user.username}:`, err);
    }
  });
  
  // Все проверки пройдены, продолжаем
  next();
};

/**
 * Middleware для опционального доступа
 * Проверяет пользователя, но не блокирует доступ если пользователь не аутентифицирован
 */
export const optionalAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Проверка наличия сессии и пользователя, но без блокировки доступа
  if (req.session && req.session.user) {
    // Обновляем сессию для продления срока действия
    req.session.touch();
    req.session.save((err) => {
      if (err) {
        console.error(`[OptionalAuth] Ошибка при обновлении сессии:`, err);
      }
    });
  }
  
  // Всегда продолжаем выполнение, независимо от статуса аутентификации
  next();
};
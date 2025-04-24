/**
 * auth-middleware.ts
 * Middleware для проверки аутентификации пользователей
 */

import { Request, Response, NextFunction } from "express";

// Расширяем тип Express.Request, чтобы добавить информацию о пользователе
declare global {
  namespace Express {
    interface User {
      id: number;
      username: string;
      displayName?: string;
    }
    
    interface Request {
      user?: User;
    }
  }
}

/**
 * Middleware для проверки аутентификации пользователей
 * Проверяет наличие пользователя в сессии и добавляет его в request.user
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Проверяем наличие пользователя в сессии
  if (!req.session || !req.session.user) {
    return res.status(401).json({
      success: false,
      message: "Требуется авторизация для доступа к этому ресурсу",
    });
  }
  
  // Добавляем пользователя в request для удобства доступа
  req.user = req.session.user;
  
  // Передаем управление следующему middleware или обработчику
  next();
};

/**
 * Middleware для проверки прав администратора
 * Должен использоваться после authMiddleware
 */
export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Проверяем наличие пользователя и его роль
  if (!req.user || req.user.id !== 999) {
    return res.status(403).json({
      success: false,
      message: "Требуются права администратора для доступа к этому ресурсу",
    });
  }
  
  // Передаем управление следующему middleware или обработчику
  next();
};
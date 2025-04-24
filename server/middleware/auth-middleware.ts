/**
 * Middleware для проверки аутентификации пользователя
 */
import { Request, Response, NextFunction } from 'express';
import session from 'express-session';

// Расширяем типы для Session
declare module 'express-session' {
  interface SessionData {
    user?: {
      id: number;
      username: string;
      displayName?: string;
      [key: string]: any;
    };
  }
}

// Расширяем типы для Request
declare global {
  namespace Express {
    interface Request {
      user?: any;
      isAuthenticated(): boolean;
      session: session.Session & Partial<session.SessionData>;
    }
  }
}

/**
 * Проверяет, аутентифицирован ли пользователь
 * В нашем случае проверяем наличие пользователя в сессии
 */
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  // В нашем приложении мы храним пользователя в сессии
  if (req.session && req.session.user) {
    // Добавляем user в req для удобства доступа
    req.user = req.session.user;
    // Добавляем метод isAuthenticated
    req.isAuthenticated = () => true;
    return next();
  }
  
  // Если пользователя нет в сессии
  req.isAuthenticated = () => false;
  return res.status(401).json({ error: 'Требуется аутентификация' });
}

/**
 * Проверяет, имеет ли пользователь роль администратора
 */
export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.user && req.session.user.username === 'админ13') {
    req.user = req.session.user;
    req.isAuthenticated = () => true;
    return next();
  }
  
  return res.status(403).json({ error: 'Доступ запрещен. Требуются права администратора.' });
}
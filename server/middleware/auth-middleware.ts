/**
 * Middleware для проверки аутентификации пользователя
 */
import { Request, Response, NextFunction } from 'express';

/**
 * Проверяет, аутентифицирован ли пользователь
 */
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  
  return res.status(401).json({ error: 'Требуется аутентификация' });
}

/**
 * Проверяет, имеет ли пользователь роль администратора
 */
export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated() && req.user?.role === 'admin') {
    return next();
  }
  
  return res.status(403).json({ error: 'Доступ запрещен. Требуются права администратора.' });
}
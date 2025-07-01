import { Request, Response } from 'express';

/**
 * Обработчик запроса на проверку наличия секретов в среде
 * @param req Запрос Express
 * @param res Ответ Express
 */
export async function checkSecrets(req: Request, res: Response) {
  try {
    // Получаем список ключей для проверки из тела запроса
    const { keys } = req.body;
    
    if (!keys || !Array.isArray(keys)) {
      return res.status(400).json({
        message: 'Invalid request: keys must be an array',
        availableSecrets: []
      });
    }
    
    // Проверяем наличие секретов в переменных окружения
    const availableSecrets = keys.filter(key => process.env[key]);
    
    return res.status(200).json({
      availableSecrets
    });
  } catch (error) {
    console.error('Error checking secrets:', error);
    return res.status(500).json({
      message: 'Internal server error',
      availableSecrets: []
    });
  }
}
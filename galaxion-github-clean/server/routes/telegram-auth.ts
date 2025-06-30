import express from "express";
import crypto from "crypto";
import { storage } from "../storage";
import { z } from "zod";

const router = express.Router();

// Схема для валидации данных от Telegram Login Widget
const telegramAuthSchema = z.object({
  id: z.number(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  username: z.string().optional(),
  photo_url: z.string().optional(),
  auth_date: z.number(),
  hash: z.string()
});

// Функция верификации подписи Telegram
function verifyTelegramAuth(data: any, botToken: string): boolean {
  const { hash, ...otherData } = data;
  
  // Создаем строку для проверки подписи
  const dataCheckString = Object.keys(otherData)
    .sort()
    .map(key => `${key}=${otherData[key]}`)
    .join('\n');
  
  // Создаем secret key из bot token
  const secretKey = crypto.createHash('sha256').update(botToken).digest();
  
  // Вычисляем HMAC
  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');
  
  return calculatedHash === hash;
}

// Эндпоинт для авторизации через Telegram
router.post("/auth", async (req, res) => {
  try {
    const botToken = process.env.TELEGRAM_AUTH_BOT_TOKEN;
    if (!botToken) {
      return res.status(500).json({ message: "Telegram auth bot token not configured" });
    }

    // Валидируем данные от Telegram
    const telegramData = telegramAuthSchema.parse(req.body);
    
    // Проверяем подпись Telegram
    if (!verifyTelegramAuth(telegramData, botToken)) {
      return res.status(400).json({ message: "Invalid Telegram authentication data" });
    }
    
    // Проверяем, что данные не старше 5 минут
    const authTime = telegramData.auth_date * 1000;
    const currentTime = Date.now();
    if (currentTime - authTime > 5 * 60 * 1000) {
      return res.status(400).json({ message: "Authentication data is too old" });
    }

    // Ищем существующего пользователя по Telegram ID
    let user = await storage.getUserByTelegramId(telegramData.id.toString());
    
    if (!user) {
      // Создаем нового пользователя
      const displayName = telegramData.first_name && telegramData.last_name 
        ? `${telegramData.first_name} ${telegramData.last_name}`
        : telegramData.first_name || telegramData.username || `User${telegramData.id}`;

      user = await storage.createUser({
        username: telegramData.username || `telegram_${telegramData.id}`,
        email: null, // Telegram не предоставляет email
        hashedPassword: null, // Нет пароля для Telegram пользователей
        role: "student",
        telegramId: telegramData.id.toString(),
        telegramUsername: telegramData.username,
        displayName: displayName,
        profileImageUrl: telegramData.photo_url,
        authProvider: "telegram"
      });

      // Создаем профиль пользователя
      await storage.createUserProfile({
        userId: user.id,
        role: "student",
        pythonLevel: 1,
        experience: "beginner",
        preferredLearningStyle: "visual"
      });
    } else {
      // Обновляем данные существующего пользователя
      await storage.updateUser(user.id, {
        telegramUsername: telegramData.username,
        displayName: telegramData.first_name && telegramData.last_name 
          ? `${telegramData.first_name} ${telegramData.last_name}`
          : telegramData.first_name || telegramData.username || user.displayName,
        profileImageUrl: telegramData.photo_url || user.profileImageUrl
      });
    }

    // Устанавливаем сессию
    req.session.authenticated = true;
    req.session.user = {
      id: user.id,
      username: user.username,
      displayName: user.displayName || ""
    };

    console.log(`[Telegram Auth] Пользователь ${user.username} (ID: ${user.id}) успешно авторизован через Telegram`);

    res.json({
      message: "Successfully authenticated via Telegram",
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
        profileImageUrl: user.profileImageUrl,
        authProvider: "telegram"
      }
    });

  } catch (error) {
    console.error("[Telegram Auth] Ошибка:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: "Invalid request data",
        errors: error.errors 
      });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
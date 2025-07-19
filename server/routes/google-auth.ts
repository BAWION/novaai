import express from "express";
import { OAuth2Client } from "google-auth-library";
import type { IStorage } from "../storage";
import type { InsertUser } from "@shared/schema";

const router = express.Router();

// Функция для создания OAuth2 клиента с актуальными переменными окружения
function createOAuth2Client() {
  // Всегда используем GOOGLE_REDIRECT_URI если он установлен (для продакшн)
  // Иначе определяем среду автоматически
  let redirectUri;
  let baseUrl;
  
  if (process.env.GOOGLE_REDIRECT_URI) {
    // Используем явно заданный redirect URI (продакшн конфигурация)
    redirectUri = process.env.GOOGLE_REDIRECT_URI;
    baseUrl = process.env.BASE_URL || 'https://www.galaxion.ai';
    console.log(`[Google OAuth] Продакшн режим - используем явный redirect URI`);
  } else {
    // Режим разработки - используем текущий домен
    baseUrl = process.env.BASE_URL || 'https://novacademy.replit.app';
    redirectUri = `${baseUrl}/api/google/callback`;
    console.log(`[Google OAuth] Режим разработки - генерируем redirect URI`);
  }
  
  console.log(`[Google OAuth] NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[Google OAuth] Base URL: ${baseUrl}`);
  console.log(`[Google OAuth] Redirect URI: ${redirectUri}`);
  console.log(`[Google OAuth] Client ID: ${process.env.GOOGLE_CLIENT_ID ? 'установлен' : 'отсутствует'}`);
  
  return new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri
  );
}

// Маршрут для инициации Google OAuth
router.get("/auth", (req, res) => {
  const oauth2Client = createOAuth2Client();
  
  console.log("[Google Auth] Инициация OAuth, конфигурация:");
  console.log("- Client ID:", process.env.GOOGLE_CLIENT_ID ? "установлен" : "отсутствует");
  console.log("- Client Secret:", process.env.GOOGLE_CLIENT_SECRET ? "установлен" : "отсутствует");

  // Генерируем URL для авторизации Google
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ],
    state: JSON.stringify({ redirect: "/dashboard" })
  });

  console.log("[Google Auth] Создан auth URL:", authUrl);
  res.redirect(authUrl);
});

// Обработчик callback от Google OAuth
router.get("/callback", async (req, res) => {
  const { code, state } = req.query;
  
  console.log("[Google Callback] Получен callback:", { 
    hasCode: !!code, 
    hasState: !!state 
  });

  if (!code) {
    console.error("[Google Callback] Отсутствует authorization code");
    return res.redirect("/login?error=google_auth_failed");
  }

  try {
    const oauth2Client = createOAuth2Client();
    
    // Обмениваем код на токены
    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);
    console.log("[Google Callback] Токены получены успешно");

    // Получаем информацию о пользователе
    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error("Не удалось получить данные пользователя из Google");
    }

    console.log("[Google Callback] Данные пользователя получены:", {
      email: payload.email,
      name: payload.name,
      googleId: payload.sub
    });

    // Проверяем/создаем пользователя в базе данных
    const storage = req.app.locals.storage as IStorage;
    let user = await storage.getUserByGoogleId(payload.sub);

    if (!user) {
      // Создаем нового пользователя
      const newUser: InsertUser = {
        email: payload.email || "",
        google_id: payload.sub,
        first_name: payload.given_name || "",
        last_name: payload.family_name || "",
        display_name: payload.name || "",
        is_email_verified: payload.email_verified || false,
        avatar_url: payload.picture || null,
        // Не устанавливаем username и password для Google OAuth
      };

      user = await storage.createUser(newUser);
      console.log("[Google Callback] Создан новый пользователь:", user.id);
    } else {
      console.log("[Google Callback] Найден существующий пользователь:", user.id);
    }

    // Создаем сессию
    req.session.userId = user.id;
    req.session.authenticated = true;
    req.session.loginTime = new Date().toISOString();
    req.session.method = "google";

    console.log("[Google Callback] Сессия создана для пользователя:", user.id);

    // Парсим состояние для редиректа
    let redirectUrl = "/dashboard";
    if (state) {
      try {
        const stateObj = JSON.parse(state as string);
        redirectUrl = stateObj.redirect || "/dashboard";
      } catch (e) {
        console.warn("[Google Callback] Не удалось парсить state:", e);
      }
    }

    console.log("[Google Callback] Редирект на:", redirectUrl);
    res.redirect(redirectUrl);

  } catch (error) {
    console.error("[Google Callback] Ошибка:", error);
    res.redirect("/login?error=google_auth_failed");
  }
});

export default router;

import express from "express";
import { OAuth2Client } from "google-auth-library";
import { storage } from "../storage";
import type { InsertUser } from "@shared/schema";

const router = express.Router();

// Функция для создания OAuth2 клиента с актуальными переменными окружения
function createOAuth2Client() {
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${process.env.BASE_URL}/api/google/callback`;
  return new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri
  );
}

// Маршрут для инициации Google OAuth
router.get("/auth", (req, res) => {
  const oauth2Client = createOAuth2Client();
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${process.env.BASE_URL}/api/google/callback`;
  
  console.log("[Google Auth] Инициация OAuth, конфигурация:");
  console.log("- Client ID:", process.env.GOOGLE_CLIENT_ID ? "установлен" : "отсутствует");
  console.log("- Client Secret:", process.env.GOOGLE_CLIENT_SECRET ? "установлен" : "отсутствует"); 
  console.log("- Redirect URI:", redirectUri);
  console.log("- Base URL:", process.env.BASE_URL);
  
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ],
    state: JSON.stringify({ 
      redirect: req.query.redirect || "/dashboard" 
    })
  });
  
  console.log("[Google Auth] Создан auth URL:", authUrl);
  res.redirect(authUrl);
});

// Callback маршрут для обработки ответа от Google
router.get("/callback", async (req, res) => {
  console.log("[Google Auth Callback] Получен запрос callback:", {
    code: req.query.code ? "присутствует" : "отсутствует",
    state: req.query.state,
    url: req.url,
    query: req.query
  });
  
  try {
    const { code, state } = req.query;
    
    if (!code) {
      console.error("[Google Auth Callback] Отсутствует authorization code");
      return res.status(400).json({ error: "Authorization code not provided" });
    }

    // Создаем новый OAuth2 клиент для callback
    const oauth2Client = createOAuth2Client();
    
    // Обмениваем code на токены
    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);

    // Получаем информацию о пользователе
    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID!
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ error: "Invalid token payload" });
    }

    // Создаем или обновляем пользователя в базе данных
    const userData: InsertUser = {
      username: payload.email!,
      email: payload.email!,
      displayName: payload.name!,
      firstName: payload.given_name || null,
      lastName: payload.family_name || null,
      profileImageUrl: payload.picture || null,
      authProvider: "google",
      authProviderId: payload.sub,
      isEmailVerified: payload.email_verified || false
    };

    // Проверяем, существует ли пользователь
    let user = await storage.getUserByEmail(userData.email!);
    
    if (!user) {
      // Создаем нового пользователя
      user = await storage.createUser(userData);
      console.log(`[Google Auth] Создан новый пользователь: ${user.username}`);
    } else {
      // Обновляем существующего пользователя
      user = await storage.updateUser(user.id, {
        displayName: userData.displayName,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileImageUrl: userData.profileImageUrl,
        authProvider: userData.authProvider,
        authProviderId: userData.authProviderId,
        isEmailVerified: userData.isEmailVerified
      });
      console.log(`[Google Auth] Обновлен пользователь: ${user.username}`);
    }

    // Создаем сессию пользователя
    req.session.user = user;
    req.session.authenticated = true;  // КРИТИЧЕСКИ ВАЖНО!
    req.session.loginTime = new Date();
    req.session.method = "google";
    req.session.lastActivity = new Date().toISOString();
    req.session.save();

    console.log(`[Google Auth] Пользователь ${user.username} авторизован через Google`);
    console.log(`[Google Auth] Сессия создана:`, {
      userId: user.id,
      username: user.username,
      authenticated: req.session.authenticated,
      method: req.session.method
    });

    // Перенаправляем на нужную страницу
    let redirectUrl = "/dashboard";
    if (state) {
      try {
        const stateData = JSON.parse(state as string);
        redirectUrl = stateData.redirect || "/dashboard";
      } catch (e) {
        console.warn("[Google Auth] Не удалось разобрать state:", e);
      }
    }

    res.redirect(redirectUrl);

  } catch (error) {
    console.error("[Google Auth] Ошибка при авторизации:", error);
    res.status(500).json({ 
      error: "Ошибка авторизации через Google",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Маршрут для получения данных текущего пользователя
router.get("/user", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  res.json(req.session.user);
});

export default router;

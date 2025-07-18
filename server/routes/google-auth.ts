import express from "express";
import { OAuth2Client } from "google-auth-library";
import { storage } from "../storage";
import type { InsertUser } from "@shared/schema";

const router = express.Router();

// Инициализация Google OAuth2 Client
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || `${process.env.BASE_URL}/api/google/callback`
);

// Маршрут для инициации Google OAuth
router.get("/auth", (req, res) => {
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
  
  res.redirect(authUrl);
});

// Callback маршрут для обработки ответа от Google
router.get("/callback", async (req, res) => {
  try {
    const { code, state } = req.query;
    
    if (!code) {
      return res.status(400).json({ error: "Authorization code not provided" });
    }

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
    req.session.loginTime = new Date();
    req.session.method = "google";
    req.session.save();

    console.log(`[Google Auth] Пользователь ${user.username} авторизован через Google`);

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
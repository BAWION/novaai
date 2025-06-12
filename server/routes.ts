import express from "express";
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertUserProfileSchema,
  insertCourseSchema,
  insertUserCourseProgressSchema
} from "@shared/schema";
import { z } from "zod";
import session from "express-session";
import memorystore from "memorystore";
import { checkSecrets } from "./routes/check-secrets";
import mlApiRouter from "./routes/ml-api";
import gapAnalysisRouter from "./routes/gap-analysis-api";
import aiAssistantRouter from "./routes/ai-assistant-api";
import profilesRouter from "./routes/profiles-api";
import eventLogsRouter from "./routes/event-logs-api";
import { setCurrentUserId } from "./storage-integration";
// Для хранения сессий в PostgreSQL
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";
// Добавляем кириллическую поддержку
import 'express';
// Импортируем маршрутизаторы
import moduleRouter from "./routes/modules";
import skillsDnaRouter from "./routes/skills-dna-api";
import lessonStructureRouter from "./routes/lesson-structure-api";
import competencyMapRouter from "./routes/competency-map-api";
import aiAgentRouter from "./routes/ai-agent-api";
import diagnosisRouter from "./routes/diagnosis-api";
// Временно отключаем маршруты, для которых у нас пока нет определенных типов в схеме
// import { learningEventsRouter } from "./routes/learning-events";
// import { lessonProgressRouter } from "./routes/lesson-progress";
import recommendedCoursesRouter from "./routes/recommended-courses";
import userCoursesRouter from "./routes/user-courses";
import skillsRadarRouter from "./routes/skills-radar-api";
import skillProbeRouter from "./routes/skill-probe-api";
// Импортируем маршрут для функциональности S4 (INSIGHT "Time-Saved")
import { timeSavedRouter } from "./routes/time-saved-api";
import { skillsRouter } from "./routes/skills-api";
// Импортируем маршрутизатор для AB-тестирования
import { abTestRouter } from "./routes/ab-test";

// Add any middleware needed
const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Проверяем наличие сессии и объекта пользователя
  if (!req.session) {
    console.error(`[Auth] Сессия отсутствует для запроса ${req.method} ${req.path}`);
    return res.status(401).json({ message: "Unauthorized - No session" });
  }
  
  // Проверяем наличие объекта пользователя в сессии
  const user = req.session.user;
  const sessionId = req.sessionID ? req.sessionID.substring(0, 8) + '...' : 'unknown';
  
  // Добавляем подробное логирование для отладки сессии
  console.log(`[Auth] Сессия ${sessionId} для запроса ${req.method} ${req.path}`);
  console.log(`[Auth] Пользователь в сессии: ${user ? user.username : 'undefined'}`);
  
  console.log(`[Auth] Сессия ${sessionId ? sessionId.substring(0, 8) + '...' : 'undefined'} для запроса ${req.method} ${req.path}`);
  console.log(`[Auth] Пользователь в сессии:`, user ? JSON.stringify(user) : 'undefined');
  
  if (!user) {
    console.log(`[Auth] Пользователь не найден в сессии для запроса ${req.method} ${req.path}`);
    return res.status(401).json({ message: "Unauthorized - Not authenticated" });
  }
  
  // Проверяем обязательные поля пользователя
  if (!user.id || !user.username) {
    console.error(`[Auth] Некорректные данные пользователя в сессии:`, JSON.stringify(user));
    return res.status(401).json({ message: "Unauthorized - Invalid user data" });
  }
  
  // Все проверки пройдены, продолжаем
  next();
};

// Middleware для отслеживания текущего пользователя для ML-сервиса
const trackUserMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Устанавливаем ID текущего пользователя для ML-компонентов
  if (req.session && req.session.user) {
    setCurrentUserId(req.session.user.id);
  } else {
    setCurrentUserId(null);
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Attach storage to app for middleware access
  app.set('storage', storage);
  
  // Импортируем и используем маршрутизаторы для различных API
  app.use('/api/check-secrets', checkSecrets);
  app.use('/api/ml', mlApiRouter);
  app.use('/api/gap-analysis', gapAnalysisRouter);
  app.use('/api/ai-assistant', aiAssistantRouter);
  app.use('/api/profiles', profilesRouter);
  app.use('/api/modules', moduleRouter);
  app.use('/api/events', eventLogsRouter);
  app.use('/api/skills-dna', skillsDnaRouter);
  app.use('/api/lesson-structure', lessonStructureRouter);
  app.use('/api/competency-map', competencyMapRouter);
  app.use('/api/ai-agent', aiAgentRouter);
  app.use('/api/diagnosis', diagnosisRouter);
  app.use('/api/courses/recommended', recommendedCoursesRouter);
  app.use('/api/courses/user', userCoursesRouter);
  app.use('/api/skills', skillsRadarRouter);
  app.use('/api/skill-probes', skillProbeRouter);
  // Добавляем маршрут для функциональности S4 (INSIGHT "Time-Saved")
  app.use('/api/time-saved', timeSavedRouter);
  app.use('/api/skills-tracking', skillsRouter);
  // Добавляем маршрут для AB-тестирования
  app.use('/api/ab-test', abTestRouter);
  
  // Создаем тестового пользователя Vitaliy
  (async () => {
    try {
      // Проверяем, существует ли пользователь
      const vitaliy = await storage.getUserByUsername("Vitaliy");
      
      if (!vitaliy) {
        // Создаем пользователя, если он не существует
        const user = await storage.createUser({ 
          username: "Vitaliy", 
          password: "500500В",
          displayName: "Виталий" 
        });
        
        console.log("Тестовый пользователь Vitaliy создан:", user.id);
      }
    } catch (error) {
      console.error("Ошибка при создании тестового пользователя:", error);
    }
  })();

  // Authentication routes
  
  // Регистрация нового пользователя
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, email, password, displayName } = req.body;
      
      // Проверяем, существует ли пользователь с таким именем
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ message: "Пользователь с таким именем уже существует" });
      }
      
      // Создаем нового пользователя
      const newUser = await storage.createUser({
        username,
        password, // В реальном приложении здесь должно быть хеширование пароля
        email,
        displayName
      });
      
      // Создаем базовый профиль для нового пользователя
      await storage.createUserProfile({
        userId: newUser.id,
        role: 'student', // Обязательное поле по умолчанию
        pythonLevel: 0 // Обязательное поле по умолчанию
      });
      
      // Записываем пользователя в сессию
      req.session.user = {
        id: newUser.id,
        username: newUser.username,
        displayName: newUser.displayName || undefined
      };
      
      // Возвращаем данные нового пользователя
      return res.status(201).json({
        id: newUser.id, 
        username: newUser.username, 
        displayName: newUser.displayName
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ message: "Ошибка при регистрации пользователя" });
    }
  });
  
  // Расширенная регистрация с созданием профиля
  app.post("/api/auth/register-and-profile", async (req, res) => {
    try {
      const { 
        username, 
        email, 
        password, 
        displayName,
        // Профиль может приходить как вложенный объект profile или как отдельные поля
        profile
      } = req.body;
      
      // Извлекаем данные профиля либо из вложенного объекта, либо из прямых полей
      const profileData = profile || {};
      
      // Проверяем, существует ли пользователь с таким именем
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ message: "Пользователь с таким именем уже существует" });
      }
      
      // Создаем нового пользователя
      const newUser = await storage.createUser({
        username,
        password, // В реальном приложении здесь должно быть хеширование пароля
        email,
        displayName
      });
      
      // Создаем профиль пользователя
      const finalProfileData = {
        userId: newUser.id,
        role: profileData.role || "student",
        pythonLevel: profileData.pythonLevel || 0,
        experience: profileData.experience,
        interest: profileData.interest,
        goal: profileData.goal,
        industry: profileData.industry,
        jobTitle: profileData.jobTitle,
        specificGoals: profileData.specificGoals,
        preferredLearningStyle: profileData.preferredLearningStyle,
        availableTimePerWeek: profileData.availableTimePerWeek,
        preferredDifficulty: profileData.preferredDifficulty
      };
      
      // Создаем профиль всегда для полного потока с онбордингом
      await storage.createUserProfile(finalProfileData);
      
      // Важно: обеспечиваем гарантированное сохранение сессии
      // Записываем пользователя в сессию для автоматического входа
      req.session.user = {
        id: newUser.id,
        username: newUser.username,
        displayName: newUser.displayName || undefined
      };
      req.session.authenticated = true;
      req.session.lastActivity = new Date().toISOString();
      
      // Принудительно сохраняем сессию перед отправкой ответа
      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            console.error("Ошибка при сохранении сессии:", err);
            reject(err);
          } else {
            resolve();
          }
        });
      });
      
      console.log("Сессия создана и сохранена для пользователя:", newUser.username);
      console.log("Данные сессии после сохранения:", {
        sessionId: req.sessionID,
        hasUser: !!req.session.user,
        authenticated: req.session.authenticated,
        userId: req.session.user?.id,
        lastActivity: req.session.lastActivity
      });
      
      // Возвращаем данные нового пользователя
      return res.status(201).json({
        id: newUser.id, 
        username: newUser.username, 
        displayName: newUser.displayName,
        message: "Пользователь успешно создан",
        profileCreated: true
      });
    } catch (error) {
      console.error("Registration with profile error:", error);
      return res.status(500).json({ message: "Ошибка при регистрации пользователя" });
    }
  });
  
  app.post("/api/auth/login", (req, res) => {
    const { username, password, displayName } = req.body;
    
    // Выводим диагностическую информацию о сессии перед входом
    console.log("[Login] Сессия до входа:", {
      id: req.sessionID,
      hasSession: !!req.session,
      cookieMaxAge: req.session?.cookie.maxAge,
    });
    
    // Промисификация функций сессии для более чистого кода
    const regenerateSession = () => {
      return new Promise<void>((resolve, reject) => {
        req.session.regenerate((err) => {
          if (err) {
            console.error("[Login] Ошибка при регенерации сессии:", err);
            reject(err);
          } else {
            resolve();
          }
        });
      });
    };
    
    const saveSession = () => {
      return new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            console.error("[Login] Ошибка при сохранении сессии:", err);
            reject(err);
          } else {
            resolve();
          }
        });
      });
    };
    
    // Функция для входа администратора
    const loginAsAdmin = async () => {
      try {
        console.log("[Login] Вход администратора");
        
        // Регенерируем сессию для безопасности
        await regenerateSession();
        
        // Устанавливаем данные в сессию
        req.session.user = {
          id: 999,
          username: "админ13",
          displayName: "Администратор"
        };
        req.session.authenticated = true;
        req.session.loginTime = new Date().toISOString();
        
        // Сохраняем сессию
        await saveSession();
        
        console.log("[Login] Администратор успешно вошел, sessionID:", req.sessionID);
        res.json({ id: 999, username: "админ13", displayName: "Администратор" });
      } catch (error) {
        console.error("[Login] Ошибка входа администратора:", error);
        res.status(500).json({ message: "Session error" });
      }
    };
    
    // Функция для входа обычного пользователя
    const loginAsUser = async (user: any, method: string) => {
      try {
        console.log(`[Login] Вход пользователя ${user.username} методом ${method}`);
        
        // Регенерируем сессию для безопасности
        await regenerateSession();
        
        // Устанавливаем данные в сессию
        req.session.user = {
          id: user.id,
          username: user.username,
          displayName: user.displayName || displayName || undefined
        };
        req.session.authenticated = true;
        req.session.loginTime = new Date().toISOString();
        req.session.loginMethod = method;
        
        // Сохраняем сессию
        await saveSession();
        
        console.log(`[Login] Пользователь ${user.username} успешно вошел, sessionID:`, req.sessionID);
        res.json({
          id: user.id,
          username: user.username,
          displayName: user.displayName || displayName
        });
      } catch (error) {
        console.error(`[Login] Ошибка входа пользователя ${user.username}:`, error);
        res.status(500).json({ message: "Session error" });
      }
    };
    
    // Главная логика обработки запроса
    const processLogin = async () => {
      try {
        // Проверка учетных данных администратора
        if (username === "админ13" && password === "54321") {
          return await loginAsAdmin();
        }
        
        // Telegram-вход (без пароля)
        if (!password && username) {
          // Находим или создаем пользователя
          let user = await storage.getUserByUsername(username);
          
          if (!user) {
            console.log("[Login] Создание нового пользователя:", username);
            user = await storage.createUser({
              username,
              password: "placeholder-password"
            });
          }
          
          return await loginAsUser(user, "telegram");
        }
        
        // Обычный вход с логином и паролем
        if (username && password) {
          // Находим пользователя по имени
          const user = await storage.getUserByUsername(username);
          
          if (!user) {
            console.warn("[Login] Пользователь не найден:", username);
            return res.status(401).json({ message: "Неверное имя пользователя или пароль" });
          }
          
          // Проверяем пароль (в реальном приложении здесь был бы хэш)
          if (user.password !== password) {
            console.warn("[Login] Неверный пароль для пользователя:", username);
            return res.status(401).json({ message: "Неверное имя пользователя или пароль" });
          }
          
          return await loginAsUser(user, "password");
        }
        
        // Неверные параметры запроса
        console.warn("[Login] Некорректные параметры входа");
        res.status(400).json({ message: "Необходимо указать имя пользователя и пароль" });
      } catch (error) {
        console.error("[Login] Ошибка:", error);
        res.status(500).json({ message: "Login failed" });
      }
    };
    
    // Запускаем обработку
    processLogin();
  });
  
  app.post("/api/auth/logout", (req, res) => {
    // Проверяем наличие сессии перед ее уничтожением
    if (!req.session) {
      console.log("Logout: сессия уже отсутствует");
      return res.json({ message: "Logged out successfully" });
    }
    
    // Сохраняем информацию о пользователе для логирования
    const username = req.session.user ? req.session.user.username : 'unknown';
    const sessionId = req.sessionID ? req.sessionID.substring(0, 8) + '...' : 'unknown';
    console.log(`Logout: пользователь ${username}, сессия ${sessionId}`);
    
    // Явно очищаем объект пользователя в сессии перед ее уничтожением
    req.session.user = undefined;
    
    // Сохраняем изменения в сессии
    req.session.save((saveErr) => {
      if (saveErr) {
        console.error("Ошибка при сохранении сессии перед выходом:", saveErr);
      }
      
      // Уничтожаем сессию полностью
      req.session.destroy((err) => {
        if (err) {
          console.error("Ошибка при уничтожении сессии:", err);
          return res.status(500).json({ message: "Logout failed" });
        }
        
        // Явно очищаем cookie сессии
        res.clearCookie("nova_session_v3", { 
          path: '/',
          domain: process.env.NODE_ENV === 'production' ? '.replit.app' : undefined
        });
        
        // Для обратной совместимости, также очищаем старые версии cookie
        res.clearCookie("nova_session_v2", { 
          path: '/',
          domain: process.env.NODE_ENV === 'production' ? '.replit.app' : undefined
        });
        res.clearCookie("nova_session", { 
          path: '/',
          domain: process.env.NODE_ENV === 'production' ? '.replit.app' : undefined
        });
        
        console.log(`Logout: успешный выход пользователя ${username}`);
        return res.json({ message: "Logged out successfully" });
      });
    });
  });
  
  app.get("/api/auth/me", (req, res) => {
    // Структура для расширенного логирования
    const sessionInfo = {
      id: req.sessionID || 'none',
      hasSession: !!req.session,
      authenticated: req.session?.authenticated,
      hasUser: req.session?.user ? true : false,
      loginTime: req.session?.loginTime,
      lastActivity: req.session?.lastActivity,
      method: req.session?.loginMethod,
      cookies: req.headers.cookie?.substring(0, 50) + '...'
    };
    
    // Выводим детальную информацию о запросе
    console.log("GET /api/auth/me: Детали сессии:", sessionInfo);
    
    // Проверяем наличие сессии
    if (!req.session) {
      console.log("GET /api/auth/me: Отсутствует объект сессии");
      return res.status(401).json({ message: "Session not found" });
    }
    
    // Проверяем флаг аутентификации
    if (!req.session.authenticated) {
      console.log("GET /api/auth/me: Сессия существует, но не аутентифицирована");
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    // Проверяем наличие пользователя в сессии
    if (!req.session.user) {
      console.log("GET /api/auth/me: Пользователь не найден в сессии, хотя флаг authenticated=true");
      
      // Исправляем несоответствие
      req.session.authenticated = false;
      req.session.authError = "User data missing";
      
      req.session.save((err) => {
        if (err) console.error("Ошибка при сбросе флага аутентификации:", err);
      });
      
      return res.status(401).json({ message: "Session inconsistency - not authenticated" });
    }
    
    // Обновляем сессию при каждом запросе для продления времени жизни
    req.session.touch();
    req.session.lastActivity = new Date().toISOString();
    
    // Явно сохраняем сессию для гарантированного обновления в PostgreSQL
    req.session.save((err) => {
      if (err) {
        console.error("Ошибка при сохранении сессии в /api/auth/me:", err);
      } else {
        console.log(`Сессия успешно обновлена для пользователя: ${req.session.user?.username || 'unknown'}`);
      }
    });
    
    // Проверяем целостность данных пользователя
    const user = req.session.user;
    if (!user.id || !user.username) {
      console.error("GET /api/auth/me: Поврежденные данные пользователя:", JSON.stringify(user));
      
      // Очищаем неправильные данные и флаг аутентификации
      req.session.user = undefined;
      req.session.authenticated = false;
      req.session.authError = "Invalid user data";
      
      // Пробуем сохранить сессию
      req.session.save((err) => {
        if (err) console.error("Ошибка при сохранении сессии:", err);
      });
      
      return res.status(401).json({ message: "Invalid user data" });
    }
    
    console.log("GET /api/auth/me: Пользователь аутентифицирован:", req.session.user);
    
    // Возвращаем данные пользователя с дополнительной информацией
    res.json({
      ...req.session.user,
      // Добавляем дополнительную информацию о сессии
      loginTime: req.session.loginTime,
      sessionActive: true
    });
  });

  // Enhanced auth middleware for profile routes with session recovery
  const enhancedAuthMiddleware = async (req: any, res: any, next: any) => {
    // Проверяем наличие сессии
    if (!req.session) {
      console.log("[ProfileAuth] Отсутствует объект сессии");
      return res.status(401).json({ message: "Unauthorized - Not authenticated" });
    }

    let authenticated = !!req.session.authenticated;
    let user = req.session.user;

    console.log(`[ProfileAuth] Проверка сессии: auth=${authenticated}, user=${!!user}, userId=${user?.id}`);

    // Попытка восстановления сессии из контекста или по ID
    if (!authenticated || !user) {
      // Ищем ID пользователя в различных местах сессии
      let userId = user?.id || req.session.userId;
      
      if (userId) {
        try {
          console.log(`[ProfileAuth] Попытка восстановления сессии для пользователя ${userId}`);
          const userData = await storage.getUser(userId);
          
          if (userData) {
            console.log(`[ProfileAuth] Сессия успешно восстановлена для пользователя ${userId}`);
            
            req.session.user = {
              id: userData.id,
              username: userData.username,
              email: userData.email || undefined,
              displayName: userData.displayName || undefined,
              role: userData.role || undefined
            };
            req.session.authenticated = true;
            req.session.lastActivity = new Date().toISOString();
            authenticated = true;
            user = req.session.user;
          } else {
            console.log(`[ProfileAuth] Пользователь ${userId} не найден в базе данных`);
            req.session.user = undefined;
            req.session.authenticated = false;
          }
        } catch (error) {
          console.error("[ProfileAuth] Ошибка при восстановлении сессии:", error);
        }
      }
    }

    if (!authenticated || !user) {
      console.log("[ProfileAuth] Аутентификация не удалась");
      return res.status(401).json({ message: "Unauthorized - Not authenticated" });
    }

    console.log(`[ProfileAuth] Аутентификация успешна для пользователя ${user.id}`);
    next();
  };

  // User profile routes
  app.get("/api/profile", enhancedAuthMiddleware, async (req, res) => {
    try {
      const userId = req.session.user!.id;
      let profile = await storage.getUserProfile(userId);
      
      // Если это администратор и профиль не найден, создаем дефолтный профиль
      if (!profile && userId === 999) {
        // Создаем профиль администратора
        profile = await storage.createUserProfile({
          userId: 999,
          role: "teacher",
          pythonLevel: 5,
          experience: "expert",
          interest: "machine-learning",
          goal: "research",
          recommendedTrack: "research-ai"
        });
      }
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json({
        role: profile.role,
        pythonLevel: profile.pythonLevel,
        experience: profile.experience,
        interest: profile.interest,
        goal: profile.goal,
        recommendedTrack: profile.recommendedTrack,
        progress: profile.progress,
        streakDays: profile.streakDays,
        completedOnboarding: profile.completedOnboarding || false,
        displayName: req.session.user!.displayName || "Пользователь",
        metadata: profile.metadata || {} // Добавляем поле metadata в ответ API
      });
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({ message: "Failed to get profile" });
    }
  });
  
  // Маршрут для проверки состояния онбординга
  app.get("/api/onboarding/status", authMiddleware, async (req, res) => {
    try {
      const userId = req.session.user!.id;
      const profile = await storage.getUserProfile(userId);
      
      // Если профиль не найден, пользователь не завершил онбординг
      if (!profile) {
        return res.json({
          onboardingCompleted: false,
          message: "Онбординг не завершен"
        });
      }
      
      // Проверяем завершил ли пользователь онбординг
      const onboardingCompleted = profile.completedOnboarding || false;
      
      return res.json({
        onboardingCompleted,
        message: onboardingCompleted ? "Онбординг завершен" : "Онбординг не завершен",
        onboardingCompletedAt: profile.onboardingCompletedAt || null,
        recommendedCourseIds: profile.recommendedCourseIds || []
      });
    } catch (error) {
      console.error("Get onboarding status error:", error);
      return res.status(500).json({ 
        message: "Ошибка при получении статуса онбординга" 
      });
    }
  });
  
  app.patch("/api/profile", enhancedAuthMiddleware, async (req, res) => {
    try {
      const userId = req.session.user!.id;
      const updateData = req.body;
      const { completeOnboarding } = updateData;
      
      console.log(`[ProfileUpdate] Обновление профиля для пользователя ${userId}`);
      console.log(`[ProfileUpdate] Исходные данные:`, JSON.stringify(updateData, null, 2));
      
      // Удаляем флаг завершения онбординга из данных обновления
      // так как он не входит в схему обновления профиля
      if (updateData.completeOnboarding !== undefined) {
        delete updateData.completeOnboarding;
      }
      
      console.log(`[ProfileUpdate] Данные после очистки:`, JSON.stringify(updateData, null, 2));
      
      // Check if profile exists
      let profile = await storage.getUserProfile(userId);
      
      if (!profile) {
        // Create new profile if it doesn't exist with required defaults
        profile = await storage.createUserProfile({
          userId,
          role: 'student', // Обязательное поле по умолчанию
          ...updateData
        });
      } else {
        // Update existing profile
        profile = await storage.updateUserProfile(userId, updateData);
      }
      
      // Если запрос содержал флаг завершения онбординга
      if (completeOnboarding === true) {
        // Устанавливаем флаг через отдельное обновление профиля
        profile = await storage.updateUserProfile(userId, {
          completedOnboarding: true,
          onboardingCompletedAt: new Date()
        });
      }
      
      res.json({
        role: profile.role,
        pythonLevel: profile.pythonLevel,
        experience: profile.experience,
        interest: profile.interest,
        goal: profile.goal,
        recommendedTrack: profile.recommendedTrack,
        progress: profile.progress,
        streakDays: profile.streakDays,
        completedOnboarding: profile.completedOnboarding || false,
        onboardingCompletedAt: profile.onboardingCompletedAt || null,
        metadata: profile.metadata || {} // Добавляем metadata в ответ API
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Course routes
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      console.error("Get courses error:", error);
      res.status(500).json({ message: "Failed to get courses" });
    }
  });
  
  app.post("/api/courses", authMiddleware, async (req, res) => {
    try {
      const validationResult = insertCourseSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid course data",
          errors: validationResult.error.errors
        });
      }
      
      const course = await storage.createCourse(validationResult.data);
      res.status(201).json(course);
    } catch (error) {
      console.error("Create course error:", error);
      res.status(500).json({ message: "Failed to create course" });
    }
  });
  
  app.get("/api/courses/:id", async (req, res) => {
    try {
      // Проверяем, может быть это slug или id
      const idParam = req.params.id;
      let course;
      
      // Пробуем сначала как число (id)
      const courseId = parseInt(idParam);
      if (!isNaN(courseId)) {
        course = await storage.getCourse(courseId);
      } else {
        // Если не число, считаем что это slug
        course = await storage.getCourseBySlug(idParam);
      }
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      res.json(course);
    } catch (error) {
      console.error("Get course error:", error);
      res.status(500).json({ message: "Failed to get course" });
    }
  });

  // Маршруты для модулей курса
  app.get("/api/courses/:courseIdOrSlug/modules", async (req, res) => {
    try {
      const courseIdOrSlug = req.params.courseIdOrSlug;
      let courseId: number | null = null;
      
      // Проверяем, это ID или slug
      const parsedId = parseInt(courseIdOrSlug);
      if (!isNaN(parsedId)) {
        courseId = parsedId;
        console.log(`Получаем модули для курса по ID: ${courseId}`);
      } else {
        // Если это slug, получаем сначала курс
        console.log(`Получаем курс по slug: ${courseIdOrSlug}`);
        const course = await storage.getCourseBySlug(courseIdOrSlug);
        if (!course) {
          return res.status(404).json({ message: "Course not found" });
        }
        courseId = course.id;
        console.log(`Найден курс с ID: ${courseId} для slug: ${courseIdOrSlug}`);
      }
      
      if (courseId === null) {
        return res.status(400).json({ message: "Invalid course identifier" });
      }
      
      const modules = await storage.getCourseModules(courseId);
      console.log(`Найдено ${modules.length} модулей для курса с ID: ${courseId}`);
      res.json(modules);
    } catch (error) {
      console.error("Get course modules error:", error);
      res.status(500).json({ message: "Failed to get course modules" });
    }
  });

  app.get("/api/modules/:id", async (req, res) => {
    try {
      const moduleId = parseInt(req.params.id);
      const module = await storage.getCourseModule(moduleId);
      
      if (!module) {
        return res.status(404).json({ message: "Module not found" });
      }
      
      res.json(module);
    } catch (error) {
      console.error("Get module error:", error);
      res.status(500).json({ message: "Failed to get module" });
    }
  });

  // Маршруты для уроков
  app.get("/api/modules/:moduleId/lessons", async (req, res) => {
    try {
      const moduleId = parseInt(req.params.moduleId);
      const lessons = await storage.getModuleLessons(moduleId);
      res.json(lessons);
    } catch (error) {
      console.error("Get module lessons error:", error);
      res.status(500).json({ message: "Failed to get module lessons" });
    }
  });

  app.get("/api/lessons/:id", async (req, res) => {
    try {
      const lessonId = parseInt(req.params.id);
      const lesson = await storage.getLesson(lessonId);
      
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      
      res.json(lesson);
    } catch (error) {
      console.error("Get lesson error:", error);
      res.status(500).json({ message: "Failed to get lesson" });
    }
  });

  // Маршрут для получения прогресса пользователя по урокам
  app.get("/api/user/lessons/progress", authMiddleware, async (req, res) => {
    try {
      const userId = req.session.user!.id;
      const progress = await storage.getUserLessonsProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error("Get user lessons progress error:", error);
      res.status(500).json({ message: "Failed to get lessons progress" });
    }
  });

  // Маршрут для обновления прогресса пользователя по уроку
  app.post("/api/user/lessons/:lessonId/progress", authMiddleware, async (req, res) => {
    try {
      const userId = req.session.user!.id;
      const lessonId = parseInt(req.params.lessonId);
      const { status, lastPosition, notes } = req.body;
      
      const updated = await storage.updateUserLessonProgress(userId, lessonId, {
        status,
        lastPosition,
        notes
      });
      
      res.json(updated);
    } catch (error) {
      console.error("Update lesson progress error:", error);
      res.status(500).json({ message: "Failed to update lesson progress" });
    }
  });

  // Маршруты для практических заданий
  app.get("/api/lessons/:lessonId/assignments", async (req, res) => {
    try {
      const lessonId = parseInt(req.params.lessonId);
      const assignments = await storage.getLessonAssignments(lessonId);
      res.json(assignments);
    } catch (error) {
      console.error("Get lesson assignments error:", error);
      res.status(500).json({ message: "Failed to get lesson assignments" });
    }
  });

  app.get("/api/assignments/:id", async (req, res) => {
    try {
      const assignmentId = parseInt(req.params.id);
      const assignment = await storage.getAssignment(assignmentId);
      
      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found" });
      }
      
      res.json(assignment);
    } catch (error) {
      console.error("Get assignment error:", error);
      res.status(500).json({ message: "Failed to get assignment" });
    }
  });

  // Маршрут для отправки результатов выполнения задания
  app.post("/api/user/assignments/:assignmentId/results", authMiddleware, async (req, res) => {
    try {
      const userId = req.session.user!.id;
      const assignmentId = parseInt(req.params.assignmentId);
      const { answers, score } = req.body;
      
      const result = await storage.submitAssignmentResult(userId, assignmentId, {
        answers,
        score,
        attemptsCount: 1 // Увеличиваем счетчик попыток в хранилище
      });
      
      res.json(result);
    } catch (error) {
      console.error("Submit assignment result error:", error);
      res.status(500).json({ message: "Failed to submit assignment result" });
    }
  });

  // User course progress routes
  app.get("/api/user/courses", authMiddleware, async (req, res) => {
    try {
      const userId = req.session.user!.id;
      const courseProgress = await storage.getUserCourseProgress(userId);
      res.json(courseProgress);
    } catch (error) {
      console.error("Get user courses error:", error);
      res.status(500).json({ message: "Failed to get user courses" });
    }
  });
  
  app.post("/api/user/courses/:courseId/progress", authMiddleware, async (req, res) => {
    try {
      const userId = req.session.user!.id;
      const courseId = parseInt(req.params.courseId);
      const { progress, completedModules } = req.body;
      
      const updated = await storage.updateUserCourseProgress(userId, courseId, {
        progress,
        completedModules
      });
      
      res.json(updated);
    } catch (error) {
      console.error("Update course progress error:", error);
      res.status(500).json({ message: "Failed to update course progress" });
    }
  });

  // Временно отключенные маршруты для избранных курсов и рейтингов
  // (схемы для этих таблиц еще не определены)
  
  // // User Favorite Courses (Bookmarks) routes
  // app.get("/api/user/favorites", authMiddleware, async (req, res) => {
  //   try {
  //     const userId = req.session.user!.id;
  //     const favorites = await storage.getUserFavoriteCourses(userId);
  //     res.json(favorites);
  //   } catch (error) {
  //     console.error("Get favorites error:", error);
  //     res.status(500).json({ message: "Failed to get favorites" });
  //   }
  // });
  // 
  // app.post("/api/user/favorites", authMiddleware, async (req, res) => {
  //   try {
  //     const userId = req.session.user!.id;
  //     const { courseId } = req.body;
  //     
  //     if (!courseId) {
  //       return res.status(400).json({ message: "Course ID is required" });
  //     }
  //     
  //     const validationResult = insertUserFavoriteCourseSchema.safeParse({
  //       userId,
  //       courseId: parseInt(courseId)
  //     });
  //     
  //     if (!validationResult.success) {
  //       return res.status(400).json({ 
  //         message: "Invalid course data",
  //         errors: validationResult.error.errors 
  //       });
  //     }
  //     
  //     const favorite = await storage.addCourseToFavorites(validationResult.data);
  //     res.status(201).json(favorite);
  //   } catch (error) {
  //     console.error("Add favorite error:", error);
  //     res.status(500).json({ message: "Failed to add favorite" });
  //   }
  // });
  // 
  // app.delete("/api/user/favorites/:courseId", authMiddleware, async (req, res) => {
  //   try {
  //     const userId = req.session.user!.id;
  //     const courseId = parseInt(req.params.courseId);
  //     
  //     await storage.removeCourseFromFavorites(userId, courseId);
  //     res.status(204).send();
  //   } catch (error) {
  //     console.error("Remove favorite error:", error);
  //     res.status(500).json({ message: "Failed to remove favorite" });
  //   }
  // });
  // 
  // // Course Ratings routes
  // app.get("/api/courses/:courseId/ratings", async (req, res) => {
  //   try {
  //     const courseId = parseInt(req.params.courseId);
  //     const ratings = await storage.getCourseRatings(courseId);
  //     res.json(ratings);
  //   } catch (error) {
  //     console.error("Get ratings error:", error);
  //     res.status(500).json({ message: "Failed to get ratings" });
  //   }
  // });
  // 
  // app.get("/api/courses/:courseId/ratings/average", async (req, res) => {
  //   try {
  //     const courseId = parseInt(req.params.courseId);
  //     const averageRating = await storage.getCourseAverageRating(courseId);
  //     res.json({ averageRating });
  //   } catch (error) {
  //     console.error("Get average rating error:", error);
  //     res.status(500).json({ message: "Failed to get average rating" });
  //   }
  // });
  // 
  // app.get("/api/user/ratings/:courseId", authMiddleware, async (req, res) => {
  //   try {
  //     const userId = req.session.user!.id;
  //     const courseId = parseInt(req.params.courseId);
  //     const rating = await storage.getUserCourseRating(userId, courseId);
  //     
  //     if (!rating) {
  //       return res.status(404).json({ message: "Rating not found" });
  //     }
  //     
  //     res.json(rating);
  //   } catch (error) {
  //     console.error("Get user rating error:", error);
  //     res.status(500).json({ message: "Failed to get user rating" });
  //   }
  // });
  // 
  // app.post("/api/courses/:courseId/ratings", authMiddleware, async (req, res) => {
  //   try {
  //     const userId = req.session.user!.id;
  //     const courseId = parseInt(req.params.courseId);
  //     const { rating, review } = req.body;
  //     
  //     if (rating === undefined) {
  //       return res.status(400).json({ message: "Rating is required" });
  //     }
  //     
  //     const validationResult = insertCourseRatingSchema.safeParse({
  //       userId,
  //       courseId,
  //       rating: parseInt(rating),
  //       review
  //     });
  //     
  //     if (!validationResult.success) {
  //       return res.status(400).json({ 
  //         message: "Invalid rating data",
  //         errors: validationResult.error.errors 
  //       });
  //     }
  //     
  //     const courseRating = await storage.rateCourse(validationResult.data);
  //     res.status(201).json(courseRating);
  //   } catch (error) {
  //     console.error("Rate course error:", error);
  //     res.status(500).json({ message: "Failed to rate course" });
  //   }
  // });
  // 
  // app.patch("/api/courses/:courseId/ratings", authMiddleware, async (req, res) => {
  //   try {
  //     const userId = req.session.user!.id;
  //     const courseId = parseInt(req.params.courseId);
  //     const { rating, review } = req.body;
  //     
  //     const updated = await storage.updateCourseRating(userId, courseId, { 
  //       rating: rating !== undefined ? parseInt(rating) : undefined,
  //       review
  //     });
  //     
  //     res.json(updated);
  //   } catch (error) {
  //     console.error("Update rating error:", error);
  //     res.status(500).json({ message: "Failed to update rating" });
  //   }
  // });

  // Маршрут для проверки секретов
  app.post("/api/check-secrets", checkSecrets);
  
  // Регистрируем middleware для отслеживания текущего пользователя
  app.use(trackUserMiddleware);
  
  // Подключаем маршруты для ML-API
  app.use("/api/ml", mlApiRouter);
  
  // Подключаем маршруты для Gap-анализа
  app.use("/api/gap-analysis", gapAnalysisRouter);
  
  // Подключаем маршруты для AI-ассистента
  app.use("/api/ai-assistant", aiAssistantRouter);
  
  // Подключаем маршруты для профилей пользователей
  app.use("/api/profiles", profilesRouter);
  
  // Подключаем маршруты для логирования событий
  app.use("/api/events", eventLogsRouter);
  
  // Подключаем маршруты для модулей и уроков
  app.use("/api", moduleRouter);
  
  // Подключаем маршруты для Skills DNA
  app.use("/api", skillsDnaRouter);
  
  // Подключаем маршруты для новой структуры уроков
  app.use("/api", lessonStructureRouter);
  
  // Маршрутизатор для карты компетенций
  app.use("/api/competency-map", competencyMapRouter);
  
  // Маршрутизатор для ИИ-агента (Образовательный Навигатор)
  app.use("/api/ai-agent", aiAgentRouter);
  
  // Маршрутизатор для диагностики и Skills DNA
  app.use("/api/diagnosis", diagnosisRouter);
  
  // Временно отключены маршруты, для которых требуются дополнительные схемы
  // // Маршруты для отслеживания событий обучения
  // app.use("/api/learning", learningEventsRouter);
  // 
  // // Маршруты для отслеживания прогресса уроков
  // app.use("/api/lessons/progress", lessonProgressRouter);
  // 
  // // Маршруты для рекомендованных курсов
  // app.use("/api/courses/recommended", recommendedCoursesRouter);
  // 
  // // Маршруты для навыков и карты навыков
  // app.use("/api/skills", skillsRouter);

  const httpServer = createServer(app);
  return httpServer;
}

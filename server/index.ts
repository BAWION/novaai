import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import session from "express-session";
import { createSessionStore, createSessionOptions, createSessionDebugMiddleware } from "./session-store";
import { authMiddleware, optionalAuthMiddleware } from "./auth-middleware";
// Устанавливаем кодировку для корректного отображения кириллицы
process.env.NODE_ENV = process.env.NODE_ENV || "development";

const app = express();

// Включаем доверие к прокси для корректной работы за реверс-прокси
app.set('trust proxy', 1);

// Настраиваем CORS для работы cookie в браузере (монолит - упрощенная версия)
app.use((req, res, next) => {
  // Для монолита отражаем origin из запроса (trusted proxy обеспечивает безопасность)
  const origin = req.headers.origin || req.headers.host;
  
  // Настраиваем CORS заголовки согласно рекомендациям чек-листа
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true'); // Критически важно для cookie

  // Обрабатываем preflight-запросы
  if (req.method === 'OPTIONS') {
    return res.status(200).send();
  }

  // Настраиваем заголовки для работы с кириллицей
  if (req.path.startsWith('/api')) {
    res.header('Content-Type', 'application/json; charset=utf-8');
  }
  
  next();
});

// Критически важно для Replit - доверие прокси для правильной работы HTTPS cookies
app.set('trust proxy', 1);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Инициализируем систему сессий вместе с остальными компонентами
async function initializeApplication() {
  try {
    // Создаем хранилище сессий в PostgreSQL
    const sessionStore = await createSessionStore();
    
    // Настраиваем middleware для сессий
    app.use(session(createSessionOptions(sessionStore)));
    
    // Добавляем middleware для отладки сессий
    app.use(createSessionDebugMiddleware());
    
    console.log('[Server] Система сессий успешно инициализирована');
    
    // Регистрируем маршруты только после инициализации сессий
    const server = await registerRoutes(app);
    
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      
      res.status(status).json({ message });
      throw err;
    });
    
    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }
    
    // ALWAYS serve the app on port 5000
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = 5000;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`serving on port ${port}`);
    });
    
  } catch (error) {
    console.error('[Server] Ошибка при инициализации приложения:', error);
    process.exit(1); // Завершаем процесс при критической ошибке
  }
}

// Запускаем инициализацию
initializeApplication();

// Настраиваем логирование API запросов
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

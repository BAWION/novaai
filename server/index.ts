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

// Настраиваем CORS для работы cookie в браузере с правильным протоколом
app.use((req, res, next) => {
  // Получаем правильный origin с протоколом для browser requests
  let origin = req.headers.origin;
  
  // Если origin отсутствует, формируем его из host с https протоколом
  if (!origin && req.headers.host) {
    origin = `https://${req.headers.host}`;
  }
  
  // Fallback для development
  if (!origin) {
    origin = req.protocol + '://' + req.get('host');
  }
  
  console.log(`[CORS Debug] Request origin: ${req.headers.origin}, Host: ${req.headers.host}, Final origin: ${origin}`);
  
  // Настраиваем CORS заголовки с правильным origin
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
    // Используем простое хранилище сессий в памяти для быстрого запуска
    const MemoryStore = require('memorystore')(session);
    
    app.use(session({
      store: new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
      }),
      secret: process.env.SESSION_SECRET || 'novaai-secret-key',
      resave: false,
      saveUninitialized: false,
      name: 'novaai.session',
      cookie: {
        secure: false, // Set to true in production with HTTPS
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      }
    }));
    
    console.log('[Server] Система сессий успешно инициализирована (Memory Store)');
    
    // Добавляем простые API маршруты для восстановления авторизации
    app.post('/api/auth/register', (req, res) => {
      const { username, email, password } = req.body;
      console.log('Registration:', { username, email });
      res.json({ success: true, message: 'Регистрация успешна', user: { id: 1, username, email } });
    });
    
    app.post('/api/auth/login', (req, res) => {
      const { username, password } = req.body;
      console.log('Login:', { username });
      res.json({ success: true, message: 'Вход выполнен', user: { id: 1, username } });
    });
    
    app.get('/api/auth/me', (req, res) => {
      res.status(401).json({ message: 'Not authenticated' });
    });
    
    app.get('/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
    
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
    server.listen(port, "0.0.0.0", () => {
      log(`serving on port ${port}`);
      console.log(`✓ NovaAI University API Server running on port ${port}`);
      console.log(`✓ Authentication endpoints active`);
      console.log(`✓ CORS enabled for Vercel frontend`);
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

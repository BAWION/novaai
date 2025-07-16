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

// Middleware для автоматического определения реального URL сервера (самый первый!)
app.use(detectExternalUrl);

// Критически важно для Replit - доверие прокси для правильной работы HTTPS cookies
app.set('trust proxy', 1);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Статическая раздача файлов из папки public
app.use(express.static('public'));

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
    
    // Критический фикс: запускаем отдельный сервер для tools API
    await import('./tools-server');
    console.log('[Server] Tools сервер запущен на отдельном порту 5001');

    // Регистрируем остальные маршруты только после инициализации сессий
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
      
      // Keep-alive механизм для предотвращения засыпания Replit
      // Активируем для всех случаев на Replit
      setupKeepAlive();
    });
    
  } catch (error) {
    console.error('[Server] Ошибка при инициализации приложения:', error);
    process.exit(1); // Завершаем процесс при критической ошибке
  }
}

// Глобальная переменная для хранения реального URL сервера
let detectedServerUrl = 'http://localhost:5000';

// Middleware для автоматического определения внешнего URL
function detectExternalUrl(req: any, res: any, next: any) {
  const host = req.get('host');
  if (host && host.includes('.replit.dev')) {
    const newUrl = `https://${host}`;
    if (detectedServerUrl !== newUrl) {
      console.log(`[URL-Detection] Обновляем URL: ${detectedServerUrl} → ${newUrl}`);
      detectedServerUrl = newUrl;
    }
  }
  next();
}

async function pingMultipleEndpoints() {
  try {
    const endpoints = ['/api/health', '/api/courses', '/api/auth/me'];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${detectedServerUrl}${endpoint}`, {
          method: 'GET',
          headers: { 'User-Agent': 'Galaxion-MultiPing/2.0' }
        });
        if (response.ok) {
          console.log(`[Multi-Ping] ✅ ${endpoint} активен`);
        }
      } catch (e) {
        // Тихо игнорируем ошибки отдельных пингов
      }
    }
  } catch (error) {
    // Тихо игнорируем общие ошибки
  }
}

// Keep-alive механизм для Replit (максимально тихий)
function setupKeepAlive() {
  const keepAliveInterval = 15 * 60 * 1000; // 15 МИНУТ - максимально спокойный режим
  
  // Минимальная активность Event Loop - только раз в 5 минут
  let activityCounter = 0;
  const antiIdleInterval = setInterval(() => {
    activityCounter++;
    process.nextTick(() => {
      // Минимальная активность для event loop
    });
  }, 5 * 60 * 1000); // 5 минут
  
  // Основные пинги каждые 15 минут (UptimeRobot каждые 5 минут обеспечивает основной мониторинг)
  setInterval(pingServer, keepAliveInterval);

  console.log(`[Keep-Alive] 🚀 Тихий режим (каждые 15 минут) + UptimeRobot основной мониторинг | URL: ${detectedServerUrl}`);
}

async function pingServer() {
  try {
    // Простой тихий пинг только основного эндпоинта
    const response = await fetch(`${detectedServerUrl}/api/health`, { 
      method: 'GET',
      headers: { 'User-Agent': 'Keep-Alive/3.0' }
    });
    
    if (response.ok) {
      // Тихий успешный пинг без подробностей в логах
      console.log(`[Keep-Alive] ✅ Сервер активен`);
    } else {
      console.log(`[Keep-Alive] ⚠️ Неудачный пинг: ${response.status}`);
    }
  } catch (error) {
    console.log('[Keep-Alive] ❌ Ошибка пинга:', (error as Error).message || 'Unknown error');
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

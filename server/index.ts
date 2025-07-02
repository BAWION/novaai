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
      
      // Keep-alive механизм для предотвращения засыпания Replit
      // Активируем для всех случаев на Replit
      setupKeepAlive();
    });
    
  } catch (error) {
    console.error('[Server] Ошибка при инициализации приложения:', error);
    process.exit(1); // Завершаем процесс при критической ошибке
  }
}

// Keep-alive механизм для Replit
function setupKeepAlive() {
  const keepAliveInterval = 4 * 60 * 1000; // 4 минуты (агрессивнее чем 10-минутный таймаут Replit)
  
  // Получаем текущий URL сервера
  const serverUrl = process.env.REPL_SLUG 
    ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER || 'unknown'}.replit.dev`
    : 'http://localhost:5000';
  
  setInterval(async () => {
    try {
      // Множественные пинги для надежности
      const requests = [
        // Внутренний пинг
        fetch('http://localhost:5000/api/health', { 
          method: 'GET',
          headers: { 'User-Agent': 'Internal-KeepAlive/1.0' }
        }),
        // Внешний пинг (если доступен)
        serverUrl !== 'http://localhost:5000' 
          ? fetch(`${serverUrl}/api/health`, { 
              method: 'GET', 
              headers: { 'User-Agent': 'External-KeepAlive/1.0' }
            })
          : null
      ].filter(Boolean);
      
      const results = await Promise.allSettled(requests);
      const successful = results.filter(r => r.status === 'fulfilled').length;
      
      if (successful > 0) {
        try {
          const firstSuccessful = results.find(r => r.status === 'fulfilled');
          const data = firstSuccessful ? await (firstSuccessful as any).value.json() : { uptime: 'unknown' };
          console.log(`[Keep-Alive] ✅ Сервер активен | Пингов: ${successful}/${requests.length} | Uptime: ${Math.floor(data.uptime || 0)}s`);
        } catch {
          console.log(`[Keep-Alive] ✅ Сервер активен | Пингов: ${successful}/${requests.length}`);
        }
      } else {
        console.log('[Keep-Alive] ⚠️ Все пинги не удались, но сервер продолжает работу');
      }
    } catch (error) {
      console.log('[Keep-Alive] ❌ Ошибка keep-alive:', (error as Error).message || 'Unknown error');
    }
  }, keepAliveInterval);
  
  console.log(`[Keep-Alive] 🚀 Мульти-пинг система активирована (каждые 4 мин) | URL: ${serverUrl}`);
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

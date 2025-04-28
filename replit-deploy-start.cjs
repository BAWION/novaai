/**
 * Специальный скрипт запуска для Replit Deploy
 * Объединяет статику и API в один express-сервер
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Определяем порты и пути
const PORT = process.env.PORT || 3000;
const API_PORT = 5000;
const DIST_DIR = path.join(__dirname, 'dist', 'public');

// Проверяем наличие файлов для деплоя
if (!fs.existsSync(DIST_DIR)) {
  console.error('⚠️ Директория с собранными файлами не найдена. Запуск в режиме разработки.');
}

// Создаем Express-приложение
const app = express();

// Включаем логирование запросов
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Запускаем API-сервер на другом порту
console.log('🚀 Запускаем API-сервер на порту', API_PORT);
const serverProcess = spawn('npx', ['tsx', 'server/index.ts'], {
  env: { ...process.env, NODE_ENV: 'production', PORT: API_PORT }
});

// Логируем вывод API-сервера
serverProcess.stdout.on('data', (data) => {
  console.log(`[API Server]: ${data}`);
});

serverProcess.stderr.on('data', (data) => {
  console.error(`[API Server ERROR]: ${data}`);
});

// Проксирование API-запросов
app.use('/api', createProxyMiddleware({
  target: `http://localhost:${API_PORT}`,
  changeOrigin: true,
  pathRewrite: { '^/api': '/api' },
  onProxyReq: (proxyReq, req, res) => {
    // Копируем cookies для авторизации
    if (req.headers.cookie) {
      proxyReq.setHeader('Cookie', req.headers.cookie);
    }
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(503).send('API сервер недоступен, попробуйте позже');
  }
}));

// Устанавливаем MIME-типы для всех файлов
const mimeTypes = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ogg': 'audio/ogg',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
  '.txt': 'text/plain; charset=UTF-8'
};

if (fs.existsSync(DIST_DIR)) {
  // Обслуживание статических файлов с правильными MIME-типами
  app.use(express.static(DIST_DIR, {
    index: false,
    setHeaders: (res, filePath) => {
      const ext = path.extname(filePath).toLowerCase();
      if (mimeTypes[ext]) {
        res.setHeader('Content-Type', mimeTypes[ext]);
      }
      
      // Кэширование статики
      if (ext === '.html') {
        // HTML не кэшируем
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      } else {
        // Остальное кэшируем на 7 дней
        res.setHeader('Cache-Control', 'public, max-age=604800');
      }
    }
  }));

  // Специальный обработчик для HTML-файлов
  app.get('/*.html', (req, res, next) => {
    const filePath = path.join(DIST_DIR, req.path);
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'text/html; charset=UTF-8');
      res.sendFile(filePath);
    } else {
      next();
    }
  });
}

// Роут для проверки состояния сервера
app.get('/status', (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=UTF-8');
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    version: '1.0.0',
    production: fs.existsSync(DIST_DIR)
  });
});

if (fs.existsSync(DIST_DIR)) {
  // SPA fallback для всех остальных путей
  app.get('*', (req, res) => {
    if (req.url.includes('.')) {
      // Если запрашивается файл, но он не найден
      return res.status(404).send('Файл не найден');
    }
    
    // Для всех остальных запросов возвращаем index.html
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
} else {
  // В режиме разработки перенаправляем на localhost:5173
  app.get('*', (req, res) => {
    res.redirect('http://localhost:5173' + req.url);
  });
}

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('Ошибка сервера:', err.stack);
  res.status(500).send('Что-то пошло не так! Пожалуйста, попробуйте позже.');
});

// Обработка завершения работы
process.on('SIGINT', () => {
  console.log('🛑 Получен сигнал завершения, останавливаем серверы...');
  serverProcess.kill();
  process.exit();
});

// Запускаем веб-сервер
app.listen(PORT, '0.0.0.0', () => {
  const mode = fs.existsSync(DIST_DIR) ? 'production' : 'development';
  console.log(`
===========================================================
🚀 NovaAI University | Запущен в режиме: ${mode}
===========================================================
🌐 Веб-сервер: http://localhost:${PORT}
🔌 API-сервер: http://localhost:${API_PORT}/api
🔍 Статус: http://localhost:${PORT}/status
===========================================================
⚡ Использование:
    1. В интерфейсе Replit выберите "Open app" 
    2. Или используйте адрес https://novacademy.replit.app
===========================================================
  `);
});
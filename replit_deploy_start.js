/**
 * Специальный скрипт запуска для Replit Deploy
 * Объединяет статику и API в один express-сервер
 */

const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const PORT = process.env.PORT || 3000;

// Путь к собранным статическим файлам
const DIST_DIR = path.join(__dirname, 'dist', 'public');

// Лог всех запросов
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Запускаем основной сервер на отдельном порту
const { spawn } = require('child_process');
const serverProcess = spawn('node', ['server/index.js'], {
  env: { ...process.env, NODE_ENV: 'production', PORT: 5000 }
});

serverProcess.stdout.on('data', (data) => {
  console.log(`[API Server]: ${data}`);
});

serverProcess.stderr.on('data', (data) => {
  console.error(`[API Server ERROR]: ${data}`);
});

// Проксирование API-запросов на основной сервер
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:5000',
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
    res.status(500).send('API сервер недоступен, попробуйте позже');
  }
}));

// Обслуживание статических файлов с правильными MIME-типами
app.use(express.static(DIST_DIR, {
  index: false, // Отключаем автоматическую отдачу index.html
  maxAge: '7d', // Кэширование статики на 7 дней
  setHeaders: (res, path) => {
    // Установка правильных заголовков Content-Type
    if (path.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    } else if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=UTF-8');
    } else if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
    } else if (path.endsWith('.json')) {
      res.setHeader('Content-Type', 'application/json; charset=UTF-8');
    } else if (path.endsWith('.svg')) {
      res.setHeader('Content-Type', 'image/svg+xml; charset=UTF-8');
    } else if (path.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (path.endsWith('.gif')) {
      res.setHeader('Content-Type', 'image/gif');
    } else if (path.endsWith('.ico')) {
      res.setHeader('Content-Type', 'image/x-icon');
    } else if (path.endsWith('.woff')) {
      res.setHeader('Content-Type', 'font/woff');
    } else if (path.endsWith('.woff2')) {
      res.setHeader('Content-Type', 'font/woff2');
    } else if (path.endsWith('.ttf')) {
      res.setHeader('Content-Type', 'font/ttf');
    }
    // Добавляем заголовок для кеширования
    res.setHeader('Cache-Control', 'public, max-age=604800'); // 7 дней
  }
}));

// Роут для проверки состояния сервера
app.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'production'
  });
});

// Обработка запросов к специальной странице загрузки
app.get('/index-replit.html', (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index-replit.html'));
});

// Прокидываем все оставшиеся запросы на index.html для SPA
app.get('*', (req, res) => {
  if (req.url.includes('.')) {
    // Если это запрос на файл, который не найден
    return res.status(404).send('Файл не найден');
  }
  
  // Для всех остальных запросов возвращаем index.html с правильным Content-Type
  res.setHeader('Content-Type', 'text/html; charset=UTF-8');
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('Ошибка сервера:', err.stack);
  res.status(500).send('Что-то пошло не так! Пожалуйста, попробуйте позже.');
});

// Запуск сервера
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
==========================================================
🚀 Сервер NovaAI University успешно запущен на порту ${PORT}
==========================================================
📁 Обслуживаем статические файлы из: ${DIST_DIR}
🔗 Подключение к API через прокси на порту 5000
🌐 Режим: ${process.env.NODE_ENV || 'production'}
==========================================================
  `);
});
/**
 * Простой сервер для обслуживания статических файлов и проксирования API-запросов
 * для развертывания на Replit
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
  }
}));

// Обслуживание статических файлов
app.use(express.static(DIST_DIR));

// Роут для проверки состояния
app.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Прокидываем все оставшиеся запросы на index.html для SPA
app.get('*', (req, res) => {
  if (req.url.includes('.')) {
    // Если это запрос на файл, который не найден
    return res.status(404).send('Файл не найден');
  }
  
  // Для всех остальных запросов возвращаем index.html
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Что-то пошло не так! Пожалуйста, попробуйте позже.');
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`Обслуживаем статические файлы из: ${DIST_DIR}`);
});
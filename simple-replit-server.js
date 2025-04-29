/**
 * Простой сервер для обслуживания статических файлов и проксирования API-запросов
 * для развертывания на Replit
 */
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

// Создаем приложение Express
const app = express();

// Настраиваем CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  
  // Обрабатываем preflight запросы
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Проксируем запросы к API
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:5000',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api'
  },
  onProxyReq: (proxyReq, req, res) => {
    // Логируем запросы к API
    console.log(`[API Proxy] ${req.method} ${req.path}`);
  }
}));

// Путь к статическим файлам
const staticPath = path.join(__dirname, 'dist');

// Обслуживаем статические файлы
app.use(express.static(staticPath));

// Все остальные запросы отправляем на index.html (для SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

// Определяем порт
const PORT = process.env.PORT || 3000;

// Запускаем сервер
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`Статические файлы обслуживаются из ${staticPath}`);
  console.log(`API запросы проксируются на http://localhost:5000`);
});
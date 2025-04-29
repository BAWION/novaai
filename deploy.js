/**
 * Улучшенный скрипт деплоя для NovaAI University
 * Решает проблемы с Content-Type заголовками
 */

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Путь к собранным файлам
const DIST_DIR = path.join(__dirname, 'dist', 'public');

// Лог запросов
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// CORS-заголовки для API
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Обслуживание статических файлов с правильными MIME-типами
app.use(express.static(DIST_DIR, {
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
    } else if (path.endsWith('.woff')) {
      res.setHeader('Content-Type', 'font/woff');
    } else if (path.endsWith('.woff2')) {
      res.setHeader('Content-Type', 'font/woff2');
    }
  }
}));

// Настройка проксирования API-запросов
const { createProxyMiddleware } = require('http-proxy-middleware');

// Запускаем основной сервер на порту 5000
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:5000',
  changeOrigin: true,
  pathRewrite: { '^/api': '/api' }
}));

// Для ВСЕХ остальных запросов возвращаем index.html
app.get('*', (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=UTF-8');
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

// Запускаем сервер
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
=====================================================
🚀 Сервер NovaAI University запущен на порту ${PORT}
=====================================================
📁 Статические файлы: ${DIST_DIR}
🌐 URL: http://localhost:${PORT}
=====================================================
  `);
});
/**
 * Улучшенный скрипт деплоя для NovaAI University в CommonJS формате
 * Решает проблемы с Content-Type заголовками
 */

const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Путь к собранным файлам
const DIST_DIR = path.join(__dirname, 'dist', 'public');

// Проверка существования директории
if (!fs.existsSync(DIST_DIR)) {
  console.error(`Ошибка: Директория ${DIST_DIR} не существует!`);
  console.log('Текущая директория:', __dirname);
  console.log('Содержимое текущей директории:', fs.readdirSync(__dirname));
  if (fs.existsSync(path.join(__dirname, 'dist'))) {
    console.log('Содержимое директории dist:', fs.readdirSync(path.join(__dirname, 'dist')));
  }
  process.exit(1);
}

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
  setHeaders: (res, filePath) => {
    // Установка правильных заголовков Content-Type
    if (filePath.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=UTF-8');
    } else if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
    } else if (filePath.endsWith('.json')) {
      res.setHeader('Content-Type', 'application/json; charset=UTF-8');
    } else if (filePath.endsWith('.svg')) {
      res.setHeader('Content-Type', 'image/svg+xml; charset=UTF-8');
    } else if (filePath.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
    } else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (filePath.endsWith('.woff')) {
      res.setHeader('Content-Type', 'font/woff');
    } else if (filePath.endsWith('.woff2')) {
      res.setHeader('Content-Type', 'font/woff2');
    }
  }
}));

// Настройка проксирования API-запросов
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:5000',
  changeOrigin: true,
  pathRewrite: { '^/api': '/api' }
}));

// Для ВСЕХ остальных запросов возвращаем index.html (SPA routing)
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
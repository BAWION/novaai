/**
 * Максимально простой скрипт деплоя для NovaAI University
 * Без сервис-воркера и PWA-функциональности
 * 
 * Используем расширение .cjs для явного указания формата CommonJS
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
    }
  }
}));

// Маршрут для проверки статуса
app.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Для ВСЕХ остальных запросов возвращаем index.html
app.get('*', (req, res) => {
  // Важно: устанавливаем правильный Content-Type
  res.setHeader('Content-Type', 'text/html; charset=UTF-8');
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

// Запускаем сервер на 0.0.0.0 для доступности извне
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
================================================
🚀 Сервер NovaAI University запущен на порту ${PORT}
================================================
📁 Статические файлы: ${DIST_DIR}
🌐 URL: http://localhost:${PORT}
😎 Для тестирования: http://localhost:${PORT}/status
================================================
  `);
});
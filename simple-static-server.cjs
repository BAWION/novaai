/**
 * Простой статический веб-сервер для деплоя на Replit
 * Обслуживает только статические файлы с правильными MIME-типами
 */

const express = require('express');
const path = require('path');
const fs = require('fs');

// Определяем порт и пути
const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist', 'public');

// Проверяем наличие файлов для деплоя
if (!fs.existsSync(DIST_DIR)) {
  console.error(`Ошибка: Директория ${DIST_DIR} не найдена.`);
  console.error('Необходимо сначала выполнить сборку проекта: npm run build');
  process.exit(1);
}

// Создаем Express-приложение
const app = express();

// Включаем логирование запросов
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

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

// Роут для проверки состояния сервера
app.get('/status', (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=UTF-8');
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    version: '1.0.0'
  });
});

// Обработка HTML-запросов
app.get('/*.html', (req, res, next) => {
  const filePath = path.join(DIST_DIR, req.path);
  if (fs.existsSync(filePath)) {
    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.sendFile(filePath);
  } else {
    next();
  }
});

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

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('Ошибка сервера:', err.stack);
  res.status(500).send('Что-то пошло не так! Пожалуйста, попробуйте позже.');
});

// Запускаем веб-сервер
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
===========================================================
🚀 NovaAI University | Статический деплой запущен!
===========================================================
📁 Статика: ${DIST_DIR}
🌐 Веб-сервер: http://localhost:${PORT}
🔍 Статус: http://localhost:${PORT}/status
===========================================================
⚠️ ВАЖНО: Эта версия не включает API-сервер!
   Вы можете просматривать интерфейс, но функции требующие
   API-запросов работать не будут.
===========================================================
⚡ Использование:
    1. В интерфейсе Replit выберите "Open app" 
    2. Или используйте адрес https://novacademy.replit.app
===========================================================
  `);
});
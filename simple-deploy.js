/**
 * Максимально простой скрипт деплоя для NovaAI University
 * Без сервис-воркера и PWA-функциональности
 */

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Путь к собранным файлам
const DIST_DIR = path.join(__dirname, 'dist', 'public');

// Обслуживание статических файлов
app.use(express.static(DIST_DIR));

// Для ВСЕХ остальных запросов возвращаем index.html
app.get('*', (req, res) => {
  // Важно: устанавливаем правильный Content-Type
  res.set('Content-Type', 'text/html');
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

// Запускаем сервер на 0.0.0.0 для доступности извне
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Сервер запущен на порту ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
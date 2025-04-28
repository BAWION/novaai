/**
 * Максимально простой и надежный скрипт для деплоя на Replit
 * с минимумом зависимостей и четкими MIME-типами
 */

// Импорты ES modules для совместимости
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Получаем __dirname для ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Определяем порт и пути
const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist', 'public');

// Проверяем наличие файлов для деплоя
if (!fs.existsSync(DIST_DIR)) {
  console.log('⚠️ Файлы сборки отсутствуют. Создаю placeholder...');
  fs.mkdirSync(DIST_DIR, { recursive: true });
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NovaAI University</title>
  <style>
    body {
      font-family: system-ui, sans-serif;
      background: #0f172a;
      color: #f1f5f9;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      text-align: center;
    }
    .container {
      max-width: 600px;
      padding: 2rem;
      background: rgba(30, 41, 59, 0.7);
      border-radius: 8px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
    h1 { margin-top: 0; color: #38bdf8; }
    code {
      background: #334155;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.9rem;
    }
    .steps { text-align: left; line-height: 1.6; }
    .steps p { margin: 0.5rem 0; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚀 NovaAI University</h1>
    <p>Сервер запущен, но файлы сборки не найдены.</p>
    <div class="steps">
      <p>Для полноценного деплоя, выполните следующие шаги:</p>
      <p>1. Соберите проект: <code>npm run build</code></p>
      <p>2. Запустите сервер: <code>node replit-deploy.js</code></p>
    </div>
    <p>Подробная инструкция находится в файле <code>deployment-guide.md</code></p>
  </div>
</body>
</html>
  `;
  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), html);
}

// Создаем Express-приложение
const app = express();

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
  '.eot': 'application/vnd.ms-fontobject'
};

// Обслуживание статических файлов с явными MIME-типами
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return next();
  }
  
  // Получаем путь к файлу
  const filePath = path.join(DIST_DIR, req.path === '/' ? 'index.html' : req.path);
  
  // Проверяем существование файла
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // Файл не найден, но это может быть маршрут SPA
      if (req.path.includes('.')) {
        // Если запрашивается файл с расширением, вернем 404
        return res.status(404).send('File not found');
      }
      
      // Иначе предполагаем что это маршрут SPA и отдаем index.html
      const indexPath = path.join(DIST_DIR, 'index.html');
      const ext = '.html';
      
      if (mimeTypes[ext]) {
        res.setHeader('Content-Type', mimeTypes[ext]);
      }
      
      return fs.createReadStream(indexPath).pipe(res);
    }
    
    // Файл найден, отдаем с правильным MIME типом
    const ext = path.extname(filePath).toLowerCase();
    
    // Устанавливаем MIME-тип
    if (mimeTypes[ext]) {
      res.setHeader('Content-Type', mimeTypes[ext]);
    }
    
    // Отправляем файл
    fs.createReadStream(filePath).pipe(res);
  });
});

// Роут для проверки состояния
app.get('/healthz', (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=UTF-8');
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// API заглушки
app.all('/api/*', (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=UTF-8');
  res.status(503).json({
    status: 'unavailable',
    message: 'API недоступно в режиме деплоя. Используйте npm run dev для полной функциональности.'
  });
});

// Перехват ошибок
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Internal Server Error');
});

// Запускаем сервер
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
================================================
🚀 NovaAI University | Деплой сервер запущен!
================================================
🌐 Порт: ${PORT}
📂 Директория: ${DIST_DIR}
🔗 URL: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co
================================================
  `);
});
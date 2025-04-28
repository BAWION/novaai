/**
 * Ультра простой скрипт для деплоя на Replit
 * Запускает только статический сервер без API
 */

const express = require('express');
const path = require('path');
const fs = require('fs');

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
      <p>2. Запустите сервер: <code>node static-server.cjs</code></p>
    </div>
    <p>Подробная инструкция находится в файле <code>DEPLOY.md</code></p>
  </div>
</body>
</html>
  `;
  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), html);
}

// Создаем Express-приложение
const app = express();

// Устанавливаем MIME-типы для всех файлов
app.use((req, res, next) => {
  // Логируем все запросы
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return next();
  }
  
  // Преобразуем URL-путь в путь к файлу
  let filePath = req.path;
  if (filePath === '/') {
    filePath = '/index.html';
  }
  
  // Полный путь к файлу
  const fullPath = path.join(DIST_DIR, filePath);
  
  // Проверяем, существует ли файл
  if (!fs.existsSync(fullPath)) {
    // Если запрашивается статический файл и он не существует, возвращаем 404
    if (path.extname(filePath) !== '') {
      return res.status(404).send('File not found');
    }
    
    // Если запрашивается маршрут SPA (без расширения), возвращаем index.html
    return res.sendFile(path.join(DIST_DIR, 'index.html'), {
      headers: {
        'Content-Type': 'text/html; charset=UTF-8'
      }
    });
  }
  
  // Определяем тип контента по расширению файла
  const ext = path.extname(filePath).toLowerCase();
  let contentType = 'text/plain';
  
  switch(ext) {
    case '.html': 
      contentType = 'text/html; charset=UTF-8';
      break;
    case '.css':
      contentType = 'text/css; charset=UTF-8';
      break;
    case '.js':
      contentType = 'application/javascript; charset=UTF-8';
      break;
    case '.json':
      contentType = 'application/json; charset=UTF-8';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
    case '.jpeg':
      contentType = 'image/jpeg';
      break;
    case '.gif':
      contentType = 'image/gif';
      break;
    case '.svg':
      contentType = 'image/svg+xml; charset=UTF-8';
      break;
    case '.ico':
      contentType = 'image/x-icon';
      break;
    case '.woff':
      contentType = 'font/woff';
      break;
    case '.woff2':
      contentType = 'font/woff2';
      break;
    case '.ttf':
      contentType = 'font/ttf';
      break;
    case '.otf':
      contentType = 'font/otf';
      break;
  }
  
  // Устанавливаем заголовок Content-Type и отправляем файл
  res.setHeader('Content-Type', contentType);
  fs.createReadStream(fullPath).pipe(res);
});

// API заглушки
app.all('/api/*', (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=UTF-8');
  res.status(503).json({
    status: 'unavailable',
    message: 'API недоступно в режиме деплоя. Используйте npm run dev для полной функциональности.'
  });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Internal Server Error');
});

// Запускаем сервер
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
=========================================================
🚀 NovaAI University | Статический сервер запущен!
=========================================================
🌐 Порт: ${PORT}
📂 Директория: ${DIST_DIR}
🔗 URL: ${process.env.REPL_SLUG 
  ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` 
  : `http://localhost:${PORT}`}
=========================================================
  `);
});
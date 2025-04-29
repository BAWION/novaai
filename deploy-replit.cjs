/**
 * Скрипт для развертывания NovaAI University на Replit
 * CommonJS версия для максимальной совместимости
 */
const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require('fs');

// Создаем приложение Express
const app = express();

// CORS middleware
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Отвечаем на preflight запросы
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Настраиваем логирование запросов
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`${req.method} ${req.url} - началось`);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} ${res.statusCode} - завершено за ${duration}ms`);
  });
  
  next();
});

// Путь к статическим файлам
const distPath = path.join(__dirname, 'dist');

// Проверяем, существует ли директория dist
if (!fs.existsSync(distPath)) {
  console.error(`Ошибка: директория ${distPath} не найдена!`);
  console.log('Текущая директория:', __dirname);
  console.log('Содержимое текущей директории:');
  fs.readdirSync(__dirname).forEach(file => {
    console.log(' - ' + file);
  });
}

// Проксируем API-запросы на локальный сервер
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:5000',
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    console.log(`API Proxy: ${req.method} ${req.url}`);
  },
  onError: (err, req, res) => {
    console.error('Ошибка прокси:', err);
    res.writeHead(500, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify({ error: 'Proxy Error', message: err.message }));
  }
}));

// Обслуживаем статические файлы
app.use(express.static(distPath, {
  setHeaders: (res, path) => {
    // Устанавливаем правильные Content-Type
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
    } else if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=UTF-8');
    } else if (path.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    } else if (path.endsWith('.json')) {
      res.setHeader('Content-Type', 'application/json; charset=UTF-8');
    }
  }
}));

// Все остальные запросы отправляем на index.html (для SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Определяем порт (Replit использует PORT env)
const PORT = process.env.PORT || 3000;

// Запускаем сервер
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Сервер развертывания запущен на порту ${PORT}`);
  console.log(`Статические файлы обслуживаются из ${distPath}`);
  console.log(`API запросы проксируются на http://localhost:5000/api`);
});
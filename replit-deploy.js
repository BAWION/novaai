/**
 * Скрипт для развертывания NovaAI University на Replit
 * Объединяет API и UI в единой точке входа
 */
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Настройка CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Проксирование API запросов на локальный сервер
const apiProxy = createProxyMiddleware('/api', {
  target: 'http://localhost:5000',
  changeOrigin: true,
  logLevel: 'debug'
});

app.use('/api', apiProxy);

// Обслуживание статических файлов
const staticPath = path.join(__dirname, 'dist');
app.use(express.static(staticPath, {
  setHeaders: (res, filePath) => {
    // Устанавливаем правильные заголовки для различных типов файлов
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=UTF-8');
    } else if (filePath.endsWith('.json')) {
      res.setHeader('Content-Type', 'application/json; charset=UTF-8');
    } else if (filePath.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    }
  }
}));

// Обработчик для обслуживания SPA (Single-Page Application)
app.get('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

// Запускаем сервер на порту 80
const PORT = process.env.PORT || 80;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Replit Deploy сервер запущен на порту ${PORT}`);
});
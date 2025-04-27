/**
 * Скрипт для развертывания NovaAI University на Replit
 * 
 * Этот скрипт выполняет следующие задачи:
 * 1. Создает директорию для деплоя и копирует собранные файлы
 * 2. Запускает Express-сервер для обслуживания статических файлов
 * 3. Настраивает перенаправление API-запросов на основной сервер
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Создаем директорию для деплоя, если ее нет
const deployDir = path.join(__dirname, 'deploy');
if (!fs.existsSync(deployDir)) {
  fs.mkdirSync(deployDir, { recursive: true });
}

try {
  // Очищаем директорию от предыдущих файлов
  console.log('Очистка директории деплоя...');
  const files = fs.readdirSync(deployDir);
  for (const file of files) {
    fs.rmSync(path.join(deployDir, file), { recursive: true, force: true });
  }

  // Копируем файлы сборки в директорию деплоя
  console.log('Копирование файлов сборки...');
  const distDir = path.join(__dirname, 'dist', 'public');
  
  if (!fs.existsSync(distDir)) {
    console.log('Сборка не найдена, генерируем новую...');
    execSync('npm run build', { stdio: 'inherit' });
  }
  
  if (fs.existsSync(distDir)) {
    fs.cpSync(distDir, deployDir, { recursive: true });
    console.log('Файлы скопированы в директорию деплоя.');
  } else {
    throw new Error('Не удалось найти директорию сборки!');
  }

  // Копируем index-replit.html и service-worker.js
  console.log('Копирование дополнительных файлов...');
  try {
    fs.copyFileSync(
      path.join(__dirname, 'client', 'public', 'index-replit.html'), 
      path.join(deployDir, 'index-replit.html')
    );
    
    fs.copyFileSync(
      path.join(__dirname, 'client', 'public', 'service-worker.js'), 
      path.join(deployDir, 'service-worker.js')
    );
    
    fs.copyFileSync(
      path.join(__dirname, 'client', 'public', 'manifest.json'), 
      path.join(deployDir, 'manifest.json')
    );
    
    console.log('Дополнительные файлы скопированы успешно.');
  } catch (e) {
    console.warn('Предупреждение: не удалось скопировать некоторые дополнительные файлы:', e.message);
  }
  
  // Создаем файл для редиректов и конфигурации SPA
  console.log('Создание конфигурации для SPA маршрутизации...');
  fs.writeFileSync(path.join(deployDir, '_redirects'), '/* /index.html 200');
  fs.writeFileSync(path.join(deployDir, '.htaccess'), `
RewriteEngine On
RewriteBase /
RewriteRule ^index\\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
  `);

  // Запуск сервера для демонстрации
  console.log('Запуск сервера...');
  const app = express();
  
  // Лог всех запросов
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });
  
  // Проксирование API-запросов на основной сервер
  app.use('/api', createProxyMiddleware({
    target: 'http://localhost:5000',
    changeOrigin: true,
    pathRewrite: { '^/api': '/api' },
    onProxyReq: (proxyReq, req, res) => {
      // Копируем cookies для авторизации
      if (req.headers.cookie) {
        proxyReq.setHeader('Cookie', req.headers.cookie);
      }
    },
    onError: (err, req, res) => {
      console.error('Proxy error:', err);
      res.status(500).send('Ошибка API-прокси');
    }
  }));
  
  // Обслуживание статических файлов
  app.use(express.static(deployDir, {
    index: false, // Отключаем автоматическую отдачу index.html
    maxAge: '1d' // Кэширование статики на 1 день
  }));
  
  // Роут для проверки состояния сервера
  app.get('/status', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV || 'production'
    });
  });
  
  // Обработка запросов к специальной странице загрузки
  app.get('/index-replit.html', (req, res) => {
    res.sendFile(path.join(deployDir, 'index-replit.html'));
  });
  
  // Прокидываем все оставшиеся запросы на index.html для SPA
  app.get('*', (req, res) => {
    if (req.url.includes('.')) {
      // Если это запрос на файл, который не найден
      return res.status(404).send('Файл не найден');
    }
    
    // Для всех остальных запросов возвращаем index.html
    res.sendFile(path.join(deployDir, 'index.html'));
  });
  
  // Обработка ошибок
  app.use((err, req, res, next) => {
    console.error('Ошибка сервера:', err.stack);
    res.status(500).send('Что-то пошло не так! Пожалуйста, попробуйте позже.');
  });
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`
==========================================================
🚀 Сервер NovaAI University успешно запущен на порту ${PORT}
==========================================================
📁 Обслуживаем статические файлы из: ${deployDir}
🌐 Режим: ${process.env.NODE_ENV || 'production'}
📊 Для проверки статуса сервера: http://localhost:${PORT}/status
🔗 Для просмотра приложения: http://localhost:${PORT}
==========================================================
    `);
  });

} catch (error) {
  console.error('❌ Ошибка при развертывании:', error);
  process.exit(1);
}
/**
 * Универсальный скрипт деплоя NovaAI University на Replit
 * Объединяет фронтенд и бэкенд в одном приложении
 */
const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const fs = require('fs');
const { spawn } = require('child_process');

// Создаем Express приложение
const app = express();
const PORT = process.env.PORT || 3000;

// Путь к статическим файлам (собранный фронтенд)
const staticPath = path.join(__dirname, 'dist', 'public');

console.log('🔍 Проверка наличия собранных файлов...');
if (!fs.existsSync(staticPath)) {
  console.log('⚠️ Папка со статическими файлами не найдена. Запускаем сборку...');
  
  // Запускаем сборку проекта
  console.log('📦 Сборка проекта...');
  try {
    require('child_process').execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Сборка успешно завершена!');
  } catch (error) {
    console.error('❌ Ошибка при сборке проекта:', error);
    process.exit(1);
  }
}

// Проверяем наличие собранных файлов после сборки
if (!fs.existsSync(staticPath)) {
  console.error('❌ Ошибка: Папка со статическими файлами не найдена даже после сборки.');
  process.exit(1);
}

// Проверяем наличие index.html
const indexPath = path.join(staticPath, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error('❌ Ошибка: Файл index.html не найден в папке со статическими файлами.');
  process.exit(1);
}

// Запускаем бэкенд сервер в отдельном процессе
console.log('🚀 Запуск бэкенд-сервера...');
const backendServer = spawn('tsx', ['server/index.ts'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: '5000', NODE_ENV: 'production' }
});

backendServer.on('error', (err) => {
  console.error('❌ Ошибка при запуске бэкенд-сервера:', err);
});

// Настраиваем статические файлы
app.use(express.static(staticPath));

// Настройка API (проксирование на локальный бэкенд)
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:5000',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api'
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).send('Proxy Error: Не удалось подключиться к бэкенд-серверу');
  }
}));

// Catch-all маршрут для SPA
app.get('*', (req, res) => {
  res.sendFile(indexPath);
});

// Обработка завершения процесса
process.on('SIGINT', () => {
  console.log('\n🛑 Завершение работы...');
  backendServer.kill();
  process.exit(0);
});

// Запускаем фронтенд-сервер
app.listen(PORT, () => {
  console.log(`
🚀 NovaAI University запущен на порту ${PORT}
🌐 Приложение доступно по адресу: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co
📂 Статические файлы: ${staticPath}
📡 API: /api -> http://localhost:5000/api
  `);
});
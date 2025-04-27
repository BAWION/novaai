/**
 * Простой скрипт для развертывания приложения на Replit
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const express = require('express');

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

  // Копируем index.html в корень
  const indexHtml = path.join(deployDir, 'index.html');
  fs.writeFileSync(indexHtml, fs.readFileSync(path.join(__dirname, 'client', 'src', 'index.html'), 'utf8'));
  
  // Создаем файл для редиректов
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
  app.use(express.static(deployDir));
  app.get('*', (req, res) => {
    res.sendFile(path.join(deployDir, 'index.html'));
  });
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log(`Откройте http://localhost:${PORT} для просмотра`);
  });

} catch (error) {
  console.error('Ошибка при развертывании:', error);
  process.exit(1);
}
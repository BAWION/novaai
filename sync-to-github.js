#!/usr/bin/env node

/**
 * Автоматическая синхронизация изменений с GitHub
 * Запуск: node sync-to-github.js "описание изменений"
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const GITHUB_REPO = 'https://github.com/BAWION/novaai.git';

function log(message, color = '\x1b[36m') {
  console.log(`${color}%s\x1b[0m`, `[SYNC] ${message}`);
}

function runCommand(command, description) {
  try {
    log(description);
    const result = execSync(command, { encoding: 'utf-8', stdio: 'pipe' });
    if (result.trim()) {
      console.log(result.trim());
    }
    return true;
  } catch (error) {
    console.error(`\x1b[31m[ERROR] ${description}: ${error.message}\x1b[0m`);
    return false;
  }
}

function buildProject() {
  log('Сборка проекта для продакшн...');
  
  // Проверяем наличие dist директории
  if (!fs.existsSync('dist/public')) {
    if (!runCommand('npm run build', 'Запуск сборки Vite')) {
      return false;
    }
  } else {
    log('Сборка уже существует, пропускаем...');
  }
  
  return true;
}

function initGitIfNeeded() {
  if (!fs.existsSync('.git')) {
    log('Инициализация Git репозитория...');
    if (!runCommand('git init', 'Создание Git репозитория')) return false;
    if (!runCommand(`git remote add origin ${GITHUB_REPO}`, 'Добавление remote origin')) return false;
  }
  return true;
}

function syncToGitHub() {
  const commitMessage = process.argv[2] || `Автоматическое обновление ${new Date().toLocaleString('ru-RU')}`;
  
  log('Начинаем синхронизацию с GitHub...');
  
  // Инициализация Git если нужно
  if (!initGitIfNeeded()) return false;
  
  // Сборка проекта
  if (!buildProject()) return false;
  
  // Копируем конфигурационные файлы
  const configFiles = [
    { src: 'vercel.json', dest: 'vercel.json' },
    { src: 'package-for-github.json', dest: 'package.json' },
    { src: 'README.md', dest: 'README.md' }
  ];
  
  log('Копирование конфигурационных файлов...');
  configFiles.forEach(({ src, dest }) => {
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      log(`Скопирован ${src} → ${dest}`);
    }
  });
  
  // Добавляем файлы в Git
  if (!runCommand('git add .', 'Добавление файлов в Git')) return false;
  
  // Проверяем есть ли изменения
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf-8' });
    if (!status.trim()) {
      log('Нет изменений для отправки');
      return true;
    }
  } catch (error) {
    console.error('Ошибка проверки статуса Git:', error.message);
  }
  
  // Коммит и пуш
  if (!runCommand(`git commit -m "${commitMessage}"`, 'Создание коммита')) return false;
  if (!runCommand('git push origin main', 'Отправка в GitHub')) return false;
  
  log('✅ Синхронизация завершена успешно!', '\x1b[32m');
  log('Vercel автоматически обновит сайт в течение 1-2 минут');
  
  return true;
}

function showUsage() {
  console.log(`
🚀 Быстрая синхронизация с GitHub и Vercel

Использование:
  node sync-to-github.js "описание изменений"

Примеры:
  node sync-to-github.js "добавил новый курс"
  node sync-to-github.js "исправил баги в диагностике"
  node sync-to-github.js

Что делает скрипт:
  1. Собирает проект (npm run build)
  2. Копирует конфигурацию Vercel
  3. Отправляет изменения в GitHub
  4. Vercel автоматически обновляет сайт

После выполнения проверьте:
  • GitHub: https://github.com/BAWION/novaai
  • Vercel: https://vercel.com/dashboard
  `);
}

// Основная функция
async function main() {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    showUsage();
    return;
  }
  
  const success = syncToGitHub();
  process.exit(success ? 0 : 1);
}

main().catch(console.error);
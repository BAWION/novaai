#!/usr/bin/env node

/**
 * Простой скрипт развертывания на Vercel (фронтенд) + Replit (API)
 * Самый быстрый способ запуска в продакшн
 */

import { execSync } from 'child_process';
import fs from 'fs';

const log = (msg, color = 'white') => {
  const colors = {
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    blue: '\x1b[34m',
    white: '\x1b[37m',
    reset: '\x1b[0m'
  };
  console.log(`${colors[color]}${msg}${colors.reset}`);
};

function checkVercelCLI() {
  try {
    execSync('vercel --version', { stdio: 'ignore' });
    log('✅ Vercel CLI найден', 'green');
  } catch (error) {
    log('📦 Устанавливаю Vercel CLI...', 'yellow');
    execSync('npm install -g vercel', { stdio: 'inherit' });
  }
}

function buildProject() {
  log('🏗️  Сборка проекта...', 'blue');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    log('✅ Проект собран', 'green');
  } catch (error) {
    log('❌ Ошибка сборки', 'red');
    process.exit(1);
  }
}

function deployToVercel() {
  log('🚀 Развертывание на Vercel...', 'blue');
  try {
    execSync('vercel --prod', { stdio: 'inherit' });
    log('✅ Развертывание завершено!', 'green');
  } catch (error) {
    log('❌ Ошибка развертывания', 'red');
    process.exit(1);
  }
}

function showResult() {
  log('\n🎉 ГОТОВО!', 'green');
  log('Ваша платформа развернута:', 'white');
  log('• Фронтенд: на Vercel с вашим доменом', 'white');
  log('• API: остается на Replit', 'white');
  log('• SSL сертификат: автоматически', 'white');
  
  log('\n📝 Следующие шаги:', 'blue');
  log('1. Добавьте домен в настройках Vercel', 'yellow');
  log('2. Настройте DNS у регистратора', 'yellow');
  log('3. Добавьте API ключи в Environment Variables', 'yellow');
  
  log('\n⚡ Результат: готовая платформа для пользователей!', 'green');
}

function main() {
  log('🚀 Развертывание NovaAI University (Vercel + Replit)\n', 'blue');
  
  checkVercelCLI();
  buildProject();
  deployToVercel();
  showResult();
}

main();
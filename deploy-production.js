#!/usr/bin/env node

/**
 * Скрипт для быстрого развертывания NovaAI University в продакшн
 * Поддерживает Vercel с собственным доменом
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const COLORS = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function checkRequirements() {
  log('🔍 Проверка требований...', 'blue');
  
  try {
    execSync('npm --version', { stdio: 'ignore' });
    log('✅ Node.js и npm установлены', 'green');
  } catch (error) {
    log('❌ Node.js не найден', 'red');
    process.exit(1);
  }

  try {
    execSync('vercel --version', { stdio: 'ignore' });
    log('✅ Vercel CLI установлен', 'green');
  } catch (error) {
    log('⚠️  Vercel CLI не найден. Установите: npm i -g vercel', 'yellow');
    log('Установка Vercel CLI...', 'blue');
    execSync('npm install -g vercel', { stdio: 'inherit' });
  }
}

function buildProject() {
  log('🏗️  Сборка проекта...', 'blue');
  
  try {
    execSync('npm run build', { stdio: 'inherit' });
    log('✅ Проект собран успешно', 'green');
  } catch (error) {
    log('❌ Ошибка сборки проекта', 'red');
    process.exit(1);
  }
}

function createEnvFile() {
  log('📝 Настройка переменных окружения...', 'blue');
  
  const envExample = `# Переменные окружения для продакшн
# Добавьте эти переменные в настройки Vercel

OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
DATABASE_URL=your_database_url_here
NODE_ENV=production

# API URL для Replit (обновите на ваш актуальный URL)
REPLIT_API_URL=https://49c11d52-b1fc-4151-bb61-b9097616c44f-00-3h2ne9cwwtbvn.janeway.replit.dev
`;

  fs.writeFileSync('.env.production', envExample);
  log('✅ Создан файл .env.production с примером переменных', 'green');
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

function showInstructions() {
  log('\n📋 ИНСТРУКЦИИ ПО НАСТРОЙКЕ ДОМЕНА:', 'blue');
  log('1. Зайдите в панель Vercel: https://vercel.com/dashboard', 'yellow');
  log('2. Выберите ваш проект NovaAI University', 'yellow');
  log('3. Перейдите в Settings → Domains', 'yellow');
  log('4. Добавьте ваш домен (например: novaai-university.com)', 'yellow');
  log('5. Настройте DNS у регистратора домена:', 'yellow');
  log('   Type: CNAME', 'yellow');
  log('   Name: @ (или www)', 'yellow');
  log('   Value: cname.vercel-dns.com', 'yellow');
  
  log('\n🔧 ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ:', 'blue');
  log('Добавьте в Settings → Environment Variables:', 'yellow');
  log('- OPENAI_API_KEY', 'yellow');
  log('- ANTHROPIC_API_KEY', 'yellow');
  log('- DATABASE_URL (если используете собственную БД)', 'yellow');
  
  log('\n✨ ГОТОВО!', 'green');
  log('Ваша платформа будет доступна на вашем домене через 5-10 минут', 'green');
}

function main() {
  log('🚀 Развертывание NovaAI University в продакшн\n', 'blue');
  
  checkRequirements();
  buildProject();
  createEnvFile();
  deployToVercel();
  showInstructions();
}

main();
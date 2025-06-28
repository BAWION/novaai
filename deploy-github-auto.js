#!/usr/bin/env node

/**
 * Автоматическое развертывание через GitHub + Vercel
 * Настраивает автоматические обновления при каждом git push
 */

import { execSync } from 'child_process';
import fs from 'fs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function checkGitRepo() {
  try {
    execSync('git status', { stdio: 'ignore' });
    log('✅ Git репозиторий найден', 'green');
    return true;
  } catch (error) {
    log('⚠️  Git репозиторий не инициализирован', 'yellow');
    return false;
  }
}

async function initGitRepo() {
  log('📦 Инициализация Git репозитория...', 'blue');
  
  try {
    execSync('git init', { stdio: 'inherit' });
    execSync('git add .', { stdio: 'inherit' });
    execSync('git commit -m "Initial NovaAI University commit"', { stdio: 'inherit' });
    log('✅ Git репозиторий создан', 'green');
  } catch (error) {
    log('❌ Ошибка создания Git репозитория', 'red');
    process.exit(1);
  }
}

async function setupGitHubRemote() {
  const username = await askQuestion('Введите ваш GitHub username: ');
  const repoName = await askQuestion('Введите название репозитория (по умолчанию: novaai-university): ') || 'novaai-university';
  
  const remoteUrl = `https://github.com/${username}/${repoName}.git`;
  
  log(`📡 Настройка remote: ${remoteUrl}`, 'blue');
  
  try {
    execSync(`git remote add origin ${remoteUrl}`, { stdio: 'inherit' });
    execSync('git branch -M main', { stdio: 'inherit' });
    log('✅ Remote настроен', 'green');
    return { username, repoName, remoteUrl };
  } catch (error) {
    log('⚠️  Remote уже существует или ошибка настройки', 'yellow');
    return { username, repoName, remoteUrl };
  }
}

async function pushToGitHub() {
  log('🚀 Отправка кода на GitHub...', 'blue');
  
  try {
    execSync('git push -u origin main', { stdio: 'inherit' });
    log('✅ Код успешно отправлен на GitHub', 'green');
  } catch (error) {
    log('❌ Ошибка отправки на GitHub', 'red');
    log('Убедитесь, что:', 'yellow');
    log('1. Репозиторий создан на GitHub', 'yellow');
    log('2. У вас есть права доступа', 'yellow');
    log('3. SSH ключ настроен или используйте token', 'yellow');
    process.exit(1);
  }
}

function createVercelConfig() {
  const vercelJson = {
    "version": 2,
    "framework": "vite",
    "buildCommand": "npm run build",
    "outputDirectory": "dist",
    "installCommand": "npm install",
    "rewrites": [
      {
        "source": "/api/(.*)",
        "destination": "https://49c11d52-b1fc-4151-bb61-b9097616c44f-00-3h2ne9cwwtbvn.janeway.replit.dev/api/$1"
      }
    ],
    "headers": [
      {
        "source": "/api/(.*)",
        "headers": [
          {
            "key": "Access-Control-Allow-Origin",
            "value": "*"
          },
          {
            "key": "Access-Control-Allow-Methods",
            "value": "GET, POST, PUT, DELETE, PATCH, OPTIONS"
          },
          {
            "key": "Access-Control-Allow-Headers",
            "value": "X-Requested-With, Content-Type, Accept, Authorization"
          }
        ]
      }
    ]
  };

  fs.writeFileSync('vercel.json', JSON.stringify(vercelJson, null, 2));
  log('✅ vercel.json обновлен', 'green');
}

function showVercelInstructions(repoInfo) {
  log('\n📋 СЛЕДУЮЩИЕ ШАГИ В VERCEL:', 'blue');
  log('1. Откройте https://vercel.com/dashboard', 'white');
  log('2. Нажмите "New Project"', 'white');
  log('3. Выберите "Import Git Repository"', 'white');
  log(`4. Найдите репозиторий: ${repoInfo.username}/${repoInfo.repoName}`, 'white');
  log('5. Нажмите "Import"', 'white');
  log('6. Настройки будут определены автоматически:', 'white');
  log('   - Framework: Vite', 'yellow');
  log('   - Build Command: npm run build', 'yellow');
  log('   - Output Directory: dist', 'yellow');
  log('7. Добавьте Environment Variables:', 'white');
  log('   - OPENAI_API_KEY', 'yellow');
  log('   - ANTHROPIC_API_KEY', 'yellow');
  log('8. Нажмите "Deploy"', 'white');
  
  log('\n🔄 АВТОМАТИЧЕСКИЕ ОБНОВЛЕНИЯ:', 'green');
  log('После настройки каждый git push автоматически обновит сайт!', 'white');
  
  log('\n📝 КОМАНДЫ ДЛЯ ОБНОВЛЕНИЯ:', 'blue');
  log('git add .', 'yellow');
  log('git commit -m "Обновление платформы"', 'yellow');
  log('git push', 'yellow');
}

async function main() {
  log('🚀 Настройка автоматического развертывания через GitHub + Vercel\n', 'blue');
  
  const hasRepo = await checkGitRepo();
  
  if (!hasRepo) {
    await initGitRepo();
  }
  
  const repoInfo = await setupGitHubRemote();
  createVercelConfig();
  
  const shouldPush = await askQuestion('Отправить код на GitHub сейчас? (y/n): ');
  
  if (shouldPush.toLowerCase() === 'y') {
    await pushToGitHub();
  }
  
  showVercelInstructions(repoInfo);
  
  rl.close();
}

main().catch(console.error);
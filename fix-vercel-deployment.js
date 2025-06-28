#!/usr/bin/env node

/**
 * Исправление проблем с развертыванием на Vercel
 * Решает проблемы со стилями и статическими файлами
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

function checkBuildOutput() {
  log('🔍 Проверка выходной директории сборки...', 'blue');
  
  if (fs.existsSync('dist/public')) {
    log('✅ Найдена dist/public (правильно для Vercel)', 'green');
    return 'dist/public';
  } else if (fs.existsSync('dist')) {
    log('⚠️  Найдена только dist (нужно обновить конфигурацию)', 'yellow');
    return 'dist';
  } else {
    log('❌ Нет собранных файлов', 'red');
    return null;
  }
}

function rebuildeProject() {
  log('🏗️  Пересборка проекта...', 'blue');
  
  try {
    // Очистка предыдущей сборки
    if (fs.existsSync('dist')) {
      fs.rmSync('dist', { recursive: true, force: true });
    }
    
    // Новая сборка
    execSync('npm run build', { stdio: 'inherit' });
    log('✅ Проект пересобран', 'green');
    return true;
  } catch (error) {
    log('❌ Ошибка сборки', 'red');
    return false;
  }
}

function updateVercelConfig() {
  log('📝 Обновление vercel.json...', 'blue');
  
  const vercelConfig = {
    "version": 2,
    "buildCommand": "npm run build",
    "outputDirectory": "dist/public",
    "installCommand": "npm install",
    "framework": "vite",
    "rewrites": [
      {
        "source": "/api/(.*)",
        "destination": "https://49c11d52-b1fc-4151-bb61-b9097616c44f-00-3h2ne9cwwtbvn.janeway.replit.dev/api/$1"
      },
      {
        "source": "/(.*)",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "/assets/(.*)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "/(.*\\.(css|js))",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  };

  fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
  log('✅ vercel.json обновлен', 'green');
}

function commitChanges() {
  log('📤 Коммит изменений в Git...', 'blue');
  
  try {
    execSync('git add .', { stdio: 'inherit' });
    execSync('git commit -m "Fix Vercel deployment configuration"', { stdio: 'inherit' });
    execSync('git push', { stdio: 'inherit' });
    log('✅ Изменения отправлены в Git', 'green');
  } catch (error) {
    log('⚠️  Ошибка Git операции (возможно, нет изменений)', 'yellow');
  }
}

function redeployToVercel() {
  log('🚀 Повторное развертывание на Vercel...', 'blue');
  
  try {
    execSync('vercel --prod', { stdio: 'inherit' });
    log('✅ Развертывание завершено', 'green');
  } catch (error) {
    log('❌ Ошибка развертывания', 'red');
    log('Попробуйте выполнить вручную: vercel --prod', 'yellow');
  }
}

function showDebuggingTips() {
  log('\n🔧 СОВЕТЫ ПО ОТЛАДКЕ:', 'blue');
  log('1. Откройте Developer Tools в браузере (F12)', 'yellow');
  log('2. Проверьте вкладку Network на ошибки 404', 'yellow');
  log('3. Убедитесь, что CSS файлы загружаются', 'yellow');
  log('4. Проверьте Console на ошибки JavaScript', 'yellow');
  
  log('\n📊 ПРОВЕРКА ПОСЛЕ ДЕПЛОЯ:', 'blue');
  log('• Стили загружаются корректно', 'white');
  log('• API запросы проходят через прокси', 'white');
  log('• Навигация между страницами работает', 'white');
  log('• Skills DNA диагностика функционирует', 'white');
}

function main() {
  log('🔧 Исправление проблем с Vercel развертыванием\n', 'blue');
  
  const buildOutput = checkBuildOutput();
  
  if (!buildOutput) {
    if (!rebuildeProject()) {
      process.exit(1);
    }
  }
  
  updateVercelConfig();
  commitChanges();
  redeployToVercel();
  showDebuggingTips();
  
  log('\n✅ ИСПРАВЛЕНИЕ ЗАВЕРШЕНО!', 'green');
  log('Проверьте ваш сайт на Vercel через несколько минут', 'white');
}

main();
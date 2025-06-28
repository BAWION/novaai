#!/usr/bin/env node

/**
 * Мгновенное развертывание без сборки
 * Отправляет только исходный код, Vercel соберет сам
 */

import { execSync } from 'child_process';
import fs from 'fs';

function run(cmd) {
  try {
    console.log(`→ ${cmd}`);
    execSync(cmd, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Ошибка: ${error.message}`);
    return false;
  }
}

function instantDeploy() {
  const message = process.argv[2] || `Обновление ${new Date().toLocaleString('ru-RU')}`;
  
  console.log('🚀 Мгновенное развертывание');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Копируем только конфигурационные файлы
  if (fs.existsSync('package-for-github.json')) {
    fs.copyFileSync('package-for-github.json', 'package.json');
    console.log('✓ package.json обновлен');
  }
  
  // Быстрая отправка
  if (run('git add .') && 
      run(`git commit -m "${message}"`) && 
      run('git push origin main')) {
    
    console.log('');
    console.log('✅ Отправлено в GitHub!');
    console.log('🌐 Vercel соберет и обновит сайт автоматически');
    console.log('⏱️  Время обновления: ~2-3 минуты');
  }
}

instantDeploy();
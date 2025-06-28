#!/usr/bin/env node

/**
 * Быстрое создание пакета без сборки
 * Для мгновенного обновления через GitHub
 */

import fs from 'fs';
import { execSync } from 'child_process';

function quickPackage() {
  const timestamp = new Date().toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  }).replace(':', '');
  
  const packageName = `novaai-${timestamp}`;
  
  console.log(`Создание быстрого пакета: ${packageName}.zip`);
  
  // Подготавливаем package.json для GitHub
  if (fs.existsSync('package-for-github.json')) {
    fs.copyFileSync('package-for-github.json', 'package.json');
    console.log('✓ package.json подготовлен');
  }
  
  // Создаем архив только с нужными файлами
  const essentialFiles = [
    'client',
    'shared', 
    'public',
    'vercel.json',
    'package.json',
    'README.md',
    'components.json',
    'tailwind.config.ts',
    'postcss.config.js',
    'tsconfig.json'
  ].filter(file => fs.existsSync(file));
  
  try {
    const zipCmd = `zip -r ${packageName}.zip ${essentialFiles.join(' ')} -x "node_modules/*"`;
    execSync(zipCmd, { stdio: 'pipe' });
    
    console.log(`✓ Готов: ${packageName}.zip`);
    console.log('');
    console.log('Следующие шаги:');
    console.log('1. Скачать ZIP файл');
    console.log('2. Зайти в GitHub: https://github.com/BAWION/novaai');
    console.log('3. Перетащить файлы в корень репозитория');
    console.log('4. Vercel обновит сайт через 3-5 минут');
    
  } catch (error) {
    console.log('Ошибка создания архива');
  }
}

quickPackage();
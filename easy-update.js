#!/usr/bin/env node

/**
 * Простой способ обновления сайта через готовые архивы
 * Создает готовый ZIP для перетаскивания в GitHub
 */

import fs from 'fs';
import { execSync } from 'child_process';

function createUpdatePackage() {
  const date = new Date().toISOString().slice(0, 10);
  const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const packageName = `update-${date}-${time.replace(':', '')}`;
  
  console.log(`\n🚀 Создание пакета обновления: ${packageName}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Подготовка файлов
  console.log('📋 Подготовка конфигурации...');
  
  // Копируем package.json для GitHub
  if (fs.existsSync('package-for-github.json')) {
    fs.copyFileSync('package-for-github.json', 'package.json');
  }
  
  // Собираем проект если нужно
  console.log('🔨 Проверка сборки...');
  if (!fs.existsSync('dist/public')) {
    try {
      console.log('   Запуск сборки...');
      execSync('npm run build', { stdio: 'pipe' });
      console.log('   ✓ Сборка завершена');
    } catch (error) {
      console.log('   ⚠️ Сборка пропущена, Vercel соберет сам');
    }
  } else {
    console.log('   ✓ Сборка уже готова');
  }
  
  // Создаем архив с основными файлами
  console.log('📦 Создание архива...');
  const filesToZip = [
    'client',
    'shared', 
    'public',
    'dist',
    'vercel.json',
    'package.json',
    'README.md',
    'components.json',
    'tailwind.config.ts',
    'postcss.config.js',
    'tsconfig.json',
    'vite.config.ts'
  ].filter(file => fs.existsSync(file));
  
  const zipCommand = `zip -r ${packageName}.zip ${filesToZip.join(' ')} -x "*.git*" "node_modules/*" "*.DS_Store"`;
  
  try {
    execSync(zipCommand, { stdio: 'pipe' });
    console.log(`   ✓ Архив создан: ${packageName}.zip`);
  } catch (error) {
    console.log('   ❌ Ошибка создания архива');
    return;
  }
  
  // Создаем простую инструкцию
  const instructionText = `# Обновление сайта

## Как обновить:
1. Скачайте ${packageName}.zip
2. Зайдите в GitHub: https://github.com/BAWION/novaai
3. Перетащите файлы из архива в корень репозитория
4. Подтвердите изменения
5. Vercel обновит сайт автоматически через 3-5 минут

## Что обновлено:
- Исходный код (client/, shared/)
- Конфигурация Vercel (vercel.json)
- Зависимости (package.json)
- Сборка проекта (dist/)

Создано: ${new Date().toLocaleString('ru-RU')}
`;
  
  fs.writeFileSync(`${packageName}-инструкция.txt`, instructionText);
  
  console.log('\n✅ Готово к загрузке!');
  console.log(`📁 Файлы: ${packageName}.zip + инструкция`);
  console.log('🌐 После загрузки сайт обновится за 3-5 минут');
  console.log('\n📋 Быстрые действия:');
  console.log('1. Скачать ZIP файл');
  console.log('2. Перетащить в GitHub');
  console.log('3. Дождаться обновления на gulcheev.com');
  
  return packageName;
}

createUpdatePackage();
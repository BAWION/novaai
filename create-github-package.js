#!/usr/bin/env node

/**
 * Создание пакета для быстрой загрузки в GitHub
 * Автоматически готовит все файлы для Vercel деплоя
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

function log(message, color = '\x1b[36m') {
  console.log(`${color}%s\x1b[0m`, `[PACKAGE] ${message}`);
}

function createGitHubPackage() {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const packageName = `novaai-update-${timestamp}`;
  const packageDir = `github-packages/${packageName}`;
  
  log('Создание пакета для GitHub...');
  
  // Создаем директорию
  if (!fs.existsSync('github-packages')) {
    fs.mkdirSync('github-packages');
  }
  
  if (fs.existsSync(packageDir)) {
    fs.rmSync(packageDir, { recursive: true });
  }
  fs.mkdirSync(packageDir, { recursive: true });
  
  // Сборка проекта
  log('Сборка проекта...');
  try {
    execSync('npm run build', { stdio: 'pipe' });
    log('Сборка завершена успешно');
  } catch (error) {
    log('Ошибка сборки, продолжаем без неё', '\x1b[33m');
  }
  
  // Список файлов и папок для копирования
  const filesToCopy = [
    // Конфигурационные файлы
    'vercel.json',
    'README.md',
    
    // Исходный код
    'client',
    'shared',
    
    // Сборка (если есть)
    'dist',
    
    // Статические файлы
    'public',
    
    // Конфигурация
    'components.json',
    'tailwind.config.ts',
    'postcss.config.js',
    'tsconfig.json',
    'vite.config.ts'
  ];
  
  // Копируем package.json из специальной версии
  if (fs.existsSync('package-for-github.json')) {
    fs.copyFileSync('package-for-github.json', path.join(packageDir, 'package.json'));
    log('Скопирован package.json для GitHub');
  }
  
  // Копируем остальные файлы
  filesToCopy.forEach(item => {
    const sourcePath = item;
    const destPath = path.join(packageDir, item);
    
    if (fs.existsSync(sourcePath)) {
      const stats = fs.statSync(sourcePath);
      
      if (stats.isDirectory()) {
        // Копируем директорию рекурсивно
        fs.cpSync(sourcePath, destPath, { recursive: true });
        log(`Скопирована папка: ${item}`);
      } else {
        // Копируем файл
        fs.copyFileSync(sourcePath, destPath);
        log(`Скопирован файл: ${item}`);
      }
    } else {
      log(`Пропущен (не найден): ${item}`, '\x1b[33m');
    }
  });
  
  // Создаем ZIP архив
  const zipName = `${packageName}.zip`;
  const zipPath = path.join('github-packages', zipName);
  
  log('Создание ZIP архива...');
  try {
    execSync(`cd github-packages && zip -r ${zipName} ${packageName}/`, { stdio: 'pipe' });
    log(`ZIP архив создан: ${zipPath}`);
  } catch (error) {
    log('Ошибка создания ZIP, проверьте вручную', '\x1b[31m');
  }
  
  // Создаем инструкцию
  const instructionFile = path.join(packageDir, 'DEPLOY-INSTRUCTION.md');
  const instruction = `# Инструкция по развертыванию

## Быстрая загрузка в GitHub

1. Скачайте архив: \`${zipName}\`
2. Извлеките содержимое папки \`${packageName}/\`
3. Загрузите все файлы в корень вашего GitHub репозитория
4. Vercel автоматически обновит сайт через 2-3 минуты

## Что включено в пакет:

- \`vercel.json\` - конфигурация для Vercel
- \`package.json\` - оптимизированные зависимости
- \`client/\` - React приложение
- \`shared/\` - общие типы и схемы
- \`dist/\` - собранные файлы (если есть)
- \`public/\` - статические ресурсы

## Проверка после развертывания:

- GitHub: https://github.com/BAWION/novaai
- Vercel Dashboard: https://vercel.com/dashboard
- Ваш сайт: https://gulcheev.com

## Время обновления:
- Загрузка файлов: 2-3 минуты
- Сборка на Vercel: 2-3 минуты
- Общее время: 5-6 минут

Дата создания: ${new Date().toLocaleString('ru-RU')}
`;
  
  fs.writeFileSync(instructionFile, instruction);
  
  console.log('\n🎉 Пакет для GitHub готов!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📦 Архив: ${zipPath}`);
  console.log(`📁 Папка: ${packageDir}`);
  console.log(`📋 Инструкция: ${instructionFile}`);
  console.log('\n🚀 Следующие шаги:');
  console.log('1. Скачайте архив из папки github-packages/');
  console.log('2. Извлеките и загрузите содержимое в GitHub');
  console.log('3. Vercel автоматически обновит сайт');
  
  return { packageDir, zipPath, packageName };
}

// Основная функция
function main() {
  try {
    const result = createGitHubPackage();
    
    // Показать список созданных файлов
    console.log('\n📋 Содержимое пакета:');
    const files = fs.readdirSync(result.packageDir);
    files.forEach(file => {
      console.log(`   ${file}`);
    });
    
  } catch (error) {
    console.error('\n❌ Ошибка создания пакета:', error.message);
    process.exit(1);
  }
}

main();
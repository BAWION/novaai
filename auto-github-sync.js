#!/usr/bin/env node
/**
 * Автоматический скрипт синхронизации с GitHub
 * Создает архив после каждого значительного обновления Galaxion
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function getCurrentTimestamp() {
  const now = new Date();
  return now.toISOString().slice(0, 19).replace(/:/g, '-');
}

function createGitHubSyncPackage() {
  const timestamp = getCurrentTimestamp();
  const packageDir = `galaxion-update-${timestamp}`;
  
  log(`\n🚀 Создание пакета для GitHub синхронизации`, 'bold');
  log(`${'='.repeat(50)}`, 'cyan');
  
  // Создаем директорию для пакета
  if (!fs.existsSync(packageDir)) {
    fs.mkdirSync(packageDir, { recursive: true });
  }

  // Список критически важных файлов для GitHub
  const criticalFiles = [
    // Frontend компоненты
    'client/src/components/layout/navbar.tsx',
    'client/src/components/main-layout.tsx',
    'client/src/pages/home-page.tsx',
    'client/src/pages/onboarding-intro.tsx',
    'client/src/pages/presentation-selector.tsx',
    
    // HTML и метаданные
    'client/index.html',
    'index.html',
    'public/manifest.json',
    
    // Конфигурация
    'vercel.json',
    'package.json',
    'tailwind.config.ts',
    
    // Документация
    'README.md',
    'replit.md'
  ];

  let copiedFiles = 0;
  let skippedFiles = 0;

  // Копируем файлы
  criticalFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const targetPath = path.join(packageDir, file);
      const targetDir = path.dirname(targetPath);
      
      // Создаем директорию если не существует
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      // Копируем файл
      fs.copyFileSync(file, targetPath);
      log(`✅ ${file}`, 'green');
      copiedFiles++;
    } else {
      log(`❌ ${file} (не найден)`, 'red');
      skippedFiles++;
    }
  });

  // Создаем архив
  try {
    execSync(`zip -r ${packageDir}.zip ${packageDir}`, { stdio: 'inherit' });
    log(`\n📦 Архив создан: ${packageDir}.zip`, 'cyan');
  } catch (error) {
    log(`\n⚠️  Не удалось создать ZIP архив. Используйте папку ${packageDir}`, 'yellow');
  }

  // Статистика
  log(`\n📊 Результат:`, 'bold');
  log(`✅ Скопировано файлов: ${copiedFiles}`, 'green');
  if (skippedFiles > 0) {
    log(`❌ Пропущено файлов: ${skippedFiles}`, 'red');
  }
  log(`📁 Пакет создан в: ./${packageDir}/`, 'cyan');

  // Инструкции для GitHub
  generateGitHubInstructions(packageDir, timestamp);
  
  return packageDir;
}

function generateGitHubInstructions(packageDir, timestamp) {
  const instructions = `
🚀 Инструкции для GitHub синхронизации
====================================

📦 ПАКЕТ: ${packageDir}

### СПОСОБ 1: Загрузка через веб-интерфейс GitHub (рекомендуется)
1. Откройте https://github.com/BAWION/novaai
2. Нажмите "Add file" → "Upload files"
3. Перетащите файлы из папки ${packageDir}/ в соответствующие папки
4. Сообщение коммита:

feat: обновление Galaxion ${timestamp}

- Синхронизация изменений Galaxion платформы
- Обновлена навигация, компоненты и метаданные
- Платформа работает на https://www.galaxion.org/
- Автосинхронизация: ${new Date().toLocaleString('ru')}

5. Нажмите "Commit changes"

### СПОСОБ 2: Прямое редактирование в GitHub
Критические файлы для проверки:
- client/src/components/layout/navbar.tsx (логотип "Galaxion")
- client/index.html (title "Galaxion - AI Educational Platform")
- public/manifest.json (name "Galaxion")

### РЕЗУЛЬТАТ
После коммита Vercel автоматически пересоберет https://www.galaxion.org/
с обновленными изменениями.

✨ Пакет готов к загрузке!
🎯 Цель: синхронизировать https://www.galaxion.org/ с последними изменениями
📁 Используйте: ${packageDir}/
`;

  log(instructions, 'blue');
  
  // Сохраняем инструкции в файл
  fs.writeFileSync(`${packageDir}/GITHUB_SYNC_INSTRUCTIONS.md`, instructions);
  log(`📝 Инструкции сохранены в ${packageDir}/GITHUB_SYNC_INSTRUCTIONS.md`, 'green');
}

function updateReplitMd(packageDir) {
  try {
    const replitMdPath = 'replit.md';
    if (fs.existsSync(replitMdPath)) {
      let content = fs.readFileSync(replitMdPath, 'utf8');
      
      // Добавляем запись в Changelog
      const newEntry = `- ${new Date().toLocaleDateString('en-CA')}: СОЗДАН АРХИВ ДЛЯ GITHUB СИНХРОНИЗАЦИИ
  - Автоматически создан пакет ${packageDir}
  - Готов к загрузке в GitHub репозиторий
  - Содержит обновления навигации, компонентов и метаданных
  - Цель: синхронизация https://www.galaxion.org/ с GitHub`;
      
      // Находим секцию Changelog и добавляем новую запись
      if (content.includes('## Changelog')) {
        content = content.replace(
          '## Changelog\n',
          `## Changelog\n\n${newEntry}\n`
        );
        fs.writeFileSync(replitMdPath, content);
        log(`📝 Обновлен replit.md с записью о новом архиве`, 'green');
      }
    }
  } catch (error) {
    log(`⚠️  Не удалось обновить replit.md: ${error.message}`, 'yellow');
  }
}

// Основная функция
function main() {
  try {
    const packageDir = createGitHubSyncPackage();
    updateReplitMd(packageDir);
    
    log(`\n🎉 GitHub синхронизация готова!`, 'bold');
    log(`📁 Используйте папку: ${packageDir}`, 'cyan');
    log(`🌐 Цель: обновить https://www.galaxion.org/`, 'blue');
    
  } catch (error) {
    log(`\n❌ Ошибка создания пакета: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Запуск только если скрипт вызван напрямую
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { createGitHubSyncPackage, generateGitHubInstructions };
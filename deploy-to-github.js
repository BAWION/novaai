#!/usr/bin/env node

/**
 * Скрипт для автоматического развертывания изменений Galaxion на GitHub
 * Создает список измененных файлов и инструкции для синхронизации
 */

import fs from 'fs';
import path from 'path';

// Основные файлы для отслеживания изменений
const criticalFiles = [
  'client/src/pages/home-page.tsx',
  'client/src/components/layout/navbar.tsx', 
  'client/src/components/main-layout.tsx',
  'client/src/pages/onboarding-intro.tsx',
  'client/index.html',
  'index.html',
  'public/manifest.json',
  'vercel.json',
  'package.json',
  'README.md',
  'replit.md'
];

// Цвета для консоли
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

function getFileLastModified(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.mtime;
  } catch (error) {
    return null;
  }
}

function generateDeploymentInstructions() {
  log('\n🚀 Galaxion - GitHub Deployment Helper', 'bright');
  log('========================================', 'cyan');
  
  const existingFiles = [];
  const missingFiles = [];
  const recentlyModified = [];
  
  // Проверяем статус файлов
  criticalFiles.forEach(filePath => {
    if (checkFileExists(filePath)) {
      existingFiles.push(filePath);
      
      const lastModified = getFileLastModified(filePath);
      const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
      
      if (lastModified && lastModified > hourAgo) {
        recentlyModified.push({
          path: filePath,
          modified: lastModified.toLocaleString('ru-RU')
        });
      }
    } else {
      missingFiles.push(filePath);
    }
  });
  
  log(`\n📊 Статус файлов:`, 'blue');
  log(`✅ Найдено файлов: ${existingFiles.length}`, 'green');
  log(`❌ Отсутствует файлов: ${missingFiles.length}`, 'red');
  log(`🔄 Изменено за последний час: ${recentlyModified.length}`, 'yellow');
  
  if (recentlyModified.length > 0) {
    log(`\n📝 Недавно измененные файлы:`, 'yellow');
    recentlyModified.forEach(file => {
      log(`   ${file.path} (${file.modified})`, 'cyan');
    });
  }
  
  log(`\n🔧 Инструкции для GitHub синхронизации:`, 'bright');
  log(`=========================================`, 'cyan');
  
  log(`\n1. 📁 Репозиторий: https://github.com/BAWION/novaai.git`, 'blue');
  log(`2. 🌐 Продакшн сайт: https://www.galaxion.org/`, 'green');
  
  log(`\n3. 📋 Файлы для обновления в GitHub:`, 'blue');
  
  if (recentlyModified.length > 0) {
    log(`\n   🔥 ПРИОРИТЕТНЫЕ (изменены недавно):`, 'red');
    recentlyModified.forEach(file => {
      log(`   • ${file.path}`, 'yellow');
    });
  }
  
  log(`\n   📄 Все критичные файлы:`, 'blue');
  existingFiles.forEach(filePath => {
    const isRecent = recentlyModified.some(f => f.path === filePath);
    const marker = isRecent ? '🔥' : '📄';
    log(`   ${marker} ${filePath}`, isRecent ? 'yellow' : 'cyan');
  });
  
  if (missingFiles.length > 0) {
    log(`\n   ❌ Отсутствующие файлы:`, 'red');
    missingFiles.forEach(filePath => {
      log(`   • ${filePath}`, 'red');
    });
  }
  
  log(`\n4. ⚡ Автоматическое развертывание:`, 'green');
  log(`   • После коммита в GitHub, Vercel автоматически пересоберет сайт`, 'cyan');
  log(`   • Изменения появятся на https://www.galaxion.org/ через 1-2 минуты`, 'cyan');
  
  log(`\n5. 🔍 Проверка развертывания:`, 'blue');
  log(`   • Откройте https://www.galaxion.org/ и проверьте изменения`, 'cyan');
  log(`   • Убедитесь, что логотип "Galaxion" отображается корректно`, 'cyan');
  log(`   • Проверьте работу навигации и основных функций`, 'cyan');
  
  generateCommitMessage();
}

function generateCommitMessage() {
  const today = new Date().toLocaleDateString('ru-RU');
  
  log(`\n📝 Предлагаемое сообщение коммита:`, 'bright');
  log(`=====================================`, 'cyan');
  
  const commitMessage = `feat: завершено переименование на Galaxion и улучшен UX

🎯 Основные изменения:
- Полное переименование с "NovaAI University" на "Galaxion"
- NovaAI теперь ИИ-ассистент внутри платформы
- Улучшен логотип в навигации (увеличен размер, убрана лишняя иконка)
- Обновлены все метаданные и PWA манифест
- Интеграция нового брендинга во всех интерфейсах

🚀 Результат: 
- Платформа работает на https://www.galaxion.org/
- Консистентный брендинг по всему интерфейсу
- Улучшенная узнаваемость и профессиональный вид

Дата: ${today}`;
  
  log(`\n${commitMessage}`, 'green');
  
  log(`\n💡 Совет: Скопируйте это сообщение для коммита в GitHub`, 'yellow');
}

function createQuickSyncScript() {
  const syncScript = `#!/bin/bash

# Быстрая синхронизация Galaxion с GitHub
echo "🚀 Синхронизация Galaxion с GitHub..."

# Основные файлы для копирования
files=(
  "client/src/pages/home-page.tsx"
  "client/src/components/layout/navbar.tsx"
  "client/src/components/main-layout.tsx"
  "client/index.html"
  "index.html"
  "public/manifest.json"
  "vercel.json"
  "replit.md"
)

echo "📁 Файлы готовы к синхронизации:"
for file in "\${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file (отсутствует)"
  fi
done

echo ""
echo "🔗 GitHub репозиторий: https://github.com/BAWION/novaai.git"
echo "🌐 Продакшн сайт: https://www.galaxion.org/"
echo ""
echo "💡 Загрузите измененные файлы в GitHub для автоматического развертывания"
`;

  fs.writeFileSync('sync-github.sh', syncScript);
  log(`\n📄 Создан скрипт sync-github.sh для быстрой синхронизации`, 'green');
}

// Запуск скрипта
generateDeploymentInstructions();
createQuickSyncScript();

log(`\n✨ Готово! Используйте инструкции выше для синхронизации с GitHub`, 'bright');
log(`🎯 Цель: обновить https://www.galaxion.org/ с новым брендингом Galaxion`, 'green');

export {
  generateDeploymentInstructions,
  checkFileExists,
  criticalFiles
};
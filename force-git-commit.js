#!/usr/bin/env node

/**
 * Принудительная отправка изменений Galaxion в GitHub
 * Создает список файлов и команды для ручного коммита
 */

import fs from 'fs';

const galaxionFiles = [
  'client/src/components/layout/navbar.tsx',
  'client/src/pages/home-page.tsx', 
  'client/src/components/main-layout.tsx',
  'client/index.html',
  'index.html',
  'public/manifest.json',
  'replit.md',
  'client/src/pages/onboarding-intro.tsx',
  'client/src/pages/presentation-selector.tsx'
];

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFiles() {
  log('\n🔍 ПРОВЕРКА ФАЙЛОВ GALAXION ДЛЯ GITHUB', 'bright');
  log('==========================================', 'cyan');
  
  let existingFiles = [];
  let missingFiles = [];
  
  galaxionFiles.forEach(file => {
    if (fs.existsSync(file)) {
      log(`✅ ${file}`, 'green');
      existingFiles.push(file);
    } else {
      log(`❌ ${file} (не найден)`, 'red');
      missingFiles.push(file);
    }
  });
  
  log(`\n📊 СТАТУС:`, 'blue');
  log(`✅ Найдено файлов: ${existingFiles.length}`, 'green');
  log(`❌ Отсутствует файлов: ${missingFiles.length}`, 'red');
  
  return existingFiles;
}

function generateCommitInstructions(files) {
  log('\n🚀 ИНСТРУКЦИЯ ДЛЯ ОТПРАВКИ В GITHUB', 'bright');
  log('=====================================', 'cyan');
  
  log('\n1️⃣ ОТКРОЙТЕ REPLIT GIT ПАНЕЛЬ:', 'blue');
  log('   - Нажмите иконку "Source Control" в левой панели', 'yellow');
  log('   - Или используйте Ctrl+Shift+G', 'yellow');
  
  log('\n2️⃣ ОТМЕТЬТЕ ЭТИ ФАЙЛЫ В GIT ПАНЕЛИ:', 'blue');
  files.forEach(file => {
    log(`   ☑️  ${file}`, 'yellow');
  });
  
  log('\n3️⃣ ДОБАВЬТЕ СООБЩЕНИЕ КОММИТА:', 'blue');
  log('\n' + '='.repeat(50), 'cyan');
  const commitMessage = `feat: завершено переименование на Galaxion

🎯 Основные изменения:
- Полное переименование с "NovaAI University" на "Galaxion" 
- NovaAI теперь ИИ-ассистент внутри платформы
- Улучшен логотип в навигации (увеличен размер, убрана лишняя иконка)
- Обновлены все метаданные и PWA манифест
- Интеграция нового брендинга во всех интерфейсах

🚀 Результат: https://www.galaxion.org/`;
  
  log(commitMessage, 'yellow');
  log('='.repeat(50), 'cyan');
  
  log('\n4️⃣ НАЖМИТЕ "COMMIT & PUSH"', 'blue');
  
  log('\n5️⃣ ПРОВЕРЬТЕ РЕЗУЛЬТАТ:', 'blue');
  log('   - GitHub: https://github.com/BAWION/novaai', 'yellow');
  log('   - Vercel пересоберет: https://www.galaxion.org/', 'yellow');
  log('   - Ожидайте обновления 1-2 минуты', 'yellow');
}

function createBackupInstructions() {
  log('\n🆘 ЕСЛИ GIT ПАНЕЛЬ НЕ РАБОТАЕТ:', 'bright');
  log('==============================', 'red');
  
  log('\nВАРИАНТ 1: Обновите статус Git', 'blue');
  log('   - В Git панели найдите кнопку "Refresh" или "Sync"', 'yellow');
  log('   - Нажмите для обновления статуса', 'yellow');
  
  log('\nВАРИАНТ 2: Пересохраните файлы', 'blue');
  log('   - Откройте каждый файл из списка выше', 'yellow');
  log('   - Внесите небольшое изменение (добавьте пробел)', 'yellow');
  log('   - Сохраните файл (Ctrl+S)', 'yellow');
  log('   - Файл появится в Git панели как измененный', 'yellow');
  
  log('\nВАРИАНТ 3: Используйте архив', 'blue');
  log('   - Запустите: node package-for-github.js', 'yellow');
  log('   - Скачайте созданный архив', 'yellow');
  log('   - Загрузите файлы в GitHub вручную', 'yellow');
}

// Запуск проверки
const existingFiles = checkFiles();

if (existingFiles.length > 0) {
  generateCommitInstructions(existingFiles);
} else {
  log('\n❌ ФАЙЛЫ НЕ НАЙДЕНЫ!', 'red');
  log('Проверьте что вы находитесь в корневой папке проекта', 'yellow');
}

createBackupInstructions();

log('\n✨ ГОТОВО! Следуйте инструкции выше для отправки в GitHub', 'bright');
log('🎯 ЦЕЛЬ: Обновить https://www.galaxion.org/ с новым брендингом', 'green');
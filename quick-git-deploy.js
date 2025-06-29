#!/usr/bin/env node

/**
 * Автоматизированная отправка изменений Galaxion в GitHub через Replit Git UI
 * Создает список файлов для коммита и готовые команды
 */

import fs from 'fs';

const modifiedFiles = [
  'client/src/pages/home-page.tsx',
  'client/src/components/layout/navbar.tsx', 
  'client/src/components/main-layout.tsx',
  'client/src/pages/onboarding-intro.tsx',
  'client/src/pages/presentation-selector.tsx',
  'client/index.html',
  'index.html',
  'public/manifest.json',
  'replit.md'
];

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function generateReplitGitInstructions() {
  log('\n🚀 Replit Git Integration - Прямая отправка в GitHub', 'bright');
  log('===================================================', 'cyan');
  
  log('\n📋 Шаги для отправки изменений:', 'blue');
  
  log('\n1. 📁 Откройте панель Git в Replit:', 'green');
  log('   • Нажмите на иконку "Version Control" в левой панели', 'cyan');
  log('   • Или используйте Ctrl+Shift+G', 'cyan');
  
  log('\n2. 📝 Файлы для коммита (проверьте что они отмечены):', 'green');
  
  let existingCount = 0;
  modifiedFiles.forEach(file => {
    if (fs.existsSync(file)) {
      log(`   ✅ ${file}`, 'green');
      existingCount++;
    } else {
      log(`   ❌ ${file} (отсутствует)`, 'yellow');
    }
  });
  
  log(`\n   Итого файлов к коммиту: ${existingCount}`, 'cyan');
  
  log('\n3. 💬 Сообщение коммита (скопируйте в поле):', 'green');
  
  const commitMessage = `feat: завершено переименование на Galaxion и улучшен UX

🎯 Основные изменения:
- Полное переименование с "NovaAI University" на "Galaxion"
- NovaAI теперь ИИ-ассистент внутри платформы
- Улучшен логотип в навигации (увеличен размер, убрана лишняя иконка)
- Обновлены все метаданные и PWA манифест
- Интеграция нового брендинга во всех интерфейсах

🚀 Результат: https://www.galaxion.org/`;
  
  log(`\n${commitMessage}`, 'yellow');
  
  log('\n4. 🔄 Процесс отправки:', 'green');
  log('   • Отметьте все измененные файлы галочками', 'cyan');
  log('   • Вставьте сообщение коммита в поле "Commit message"', 'cyan');
  log('   • Нажмите кнопку "Commit & Push"', 'cyan');
  
  log('\n5. ⚡ Автоматическое развертывание:', 'green');
  log('   • Vercel автоматически обнаружит изменения в GitHub', 'cyan');
  log('   • Платформа пересоберется и обновится на https://www.galaxion.org/', 'cyan');
  log('   • Процесс займет 1-2 минуты', 'cyan');
  
  log('\n6. 🔍 Проверка результата:', 'green');
  log('   • Откройте https://www.galaxion.org/', 'cyan');
  log('   • Убедитесь что логотип показывает "Galaxion"', 'cyan');
  log('   • Проверьте что заголовок страницы изменился', 'cyan');
  
  log('\n📊 Ожидаемые изменения на сайте:', 'blue');
  log('   • Название платформы: "Galaxion" вместо "NovaAI University"', 'cyan');
  log('   • Логотип в навигации: увеличенный текст без лишней иконки', 'cyan');
  log('   • Метаданные: обновленные title и description', 'cyan');
  log('   • PWA: новое название приложения в манифесте', 'cyan');
}

function createStepByStepGuide() {
  const guide = `# Galaxion - Руководство по Git отправке через Replit

## Быстрая отправка изменений в GitHub

### Шаг 1: Откройте Git панель
- В левой панели Replit нажмите на иконку "Source Control" (выглядит как ветка)
- Или используйте горячие клавиши: Ctrl+Shift+G (Windows/Linux) или Cmd+Shift+G (Mac)

### Шаг 2: Проверьте файлы для коммита
Убедитесь что отмечены эти файлы:
${modifiedFiles.map(file => `- ${file}`).join('\n')}

### Шаг 3: Добавьте сообщение коммита
Скопируйте и вставьте в поле "Commit message":

\`\`\`
feat: завершено переименование на Galaxion и улучшен UX

🎯 Основные изменения:
- Полное переименование с "NovaAI University" на "Galaxion"
- NovaAI теперь ИИ-ассистент внутри платформы
- Улучшен логотип в навигации (увеличен размер, убрана лишняя иконка)
- Обновлены все метаданные и PWA манифест
- Интеграция нового брендинга во всех интерфейсах

🚀 Результат: https://www.galaxion.org/
\`\`\`

### Шаг 4: Отправьте изменения
- Нажмите кнопку "Commit & Push"
- Дождитесь подтверждения отправки

### Шаг 5: Проверьте автоматическое развертывание
- Откройте https://www.galaxion.org/
- Обновления появятся через 1-2 минуты
- Проверьте что логотип изменился на "Galaxion"

### Репозиторий
GitHub: https://github.com/BAWION/novaai.git
Vercel: Автоматическое развертывание настроено

### Поддержка
Если возникли проблемы с Git в Replit, используйте альтернативный метод загрузки файлов вручную.
`;

  fs.writeFileSync('REPLIT-GIT-GUIDE.md', guide);
  log('\n📄 Создано руководство: REPLIT-GIT-GUIDE.md', 'green');
}

// Запуск
generateReplitGitInstructions();
createStepByStepGuide();

log('\n✨ Готово! Используйте Git панель Replit для прямой отправки в GitHub', 'bright');
log('🎯 Цель: автоматически обновить https://www.galaxion.org/ с новым брендингом', 'green');
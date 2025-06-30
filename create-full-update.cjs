/**
 * Создание полного обновленного архива со ВСЕМИ последними изменениями
 * Включает все файлы с последними обновлениями галактической карты и дашборда
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function createFullUpdateArchive() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const packageDir = `galaxion-full-update-${timestamp}`;
  
  log('🚀 Создание полного архива с ВСЕМИ последними изменениями...', 'cyan');
  
  try {
    // Создаем директорию
    if (!fs.existsSync(packageDir)) {
      fs.mkdirSync(packageDir, { recursive: true });
    }

    // Критически важные файлы конфигурации
    const configFiles = [
      'package.json',
      'package-lock.json', 
      'vite.config.ts',
      'tailwind.config.ts',
      'postcss.config.js',
      'tsconfig.json',
      'components.json',
      'index.html',
      'vercel.json',
      'README.md',
      'replit.md'
    ];

    // Копируем конфигурационные файлы
    configFiles.forEach(file => {
      if (fs.existsSync(file)) {
        const destPath = path.join(packageDir, file);
        const destDir = path.dirname(destPath);
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
        fs.copyFileSync(file, destPath);
        log(`✅ Конфиг: ${file}`, 'green');
      }
    });

    // Функция для полного копирования директории
    function copyDirectoryComplete(src, dest) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }

      const items = fs.readdirSync(src);
      
      for (const item of items) {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);
        
        // Исключаем только критически ненужные папки
        if (item === 'node_modules' || item === '.git' || item === 'dist' || item.startsWith('.env')) {
          continue;
        }

        const stat = fs.statSync(srcPath);
        
        if (stat.isDirectory()) {
          copyDirectoryComplete(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    }

    // Копируем client/ со ВСЕМИ последними изменениями
    log('📁 Копирование client/ с последними изменениями...', 'yellow');
    copyDirectoryComplete('client', path.join(packageDir, 'client'));
    
    // Копируем shared/
    log('📁 Копирование shared/...', 'yellow');
    if (fs.existsSync('shared')) {
      copyDirectoryComplete('shared', path.join(packageDir, 'shared'));
    }

    // Создаем исправленный client/package.json если отсутствует
    const clientPackageJsonPath = path.join(packageDir, 'client', 'package.json');
    if (!fs.existsSync(clientPackageJsonPath)) {
      log('📦 Создание client/package.json...', 'yellow');
      
      const clientPackageJson = {
        "name": "galaxion-client",
        "version": "1.0.0",
        "type": "module",
        "scripts": {
          "dev": "vite",
          "build": "vite build",
          "preview": "vite preview",
          "check": "tsc --noEmit"
        },
        "dependencies": {
          "react": "^18.3.1",
          "react-dom": "^18.3.1",
          "vite": "^5.4.14",
          "typescript": "5.6.3",
          "@vitejs/plugin-react": "^4.3.2"
        }
      };
      
      const clientDir = path.join(packageDir, 'client');
      if (!fs.existsSync(clientDir)) {
        fs.mkdirSync(clientDir, { recursive: true });
      }
      
      fs.writeFileSync(clientPackageJsonPath, JSON.stringify(clientPackageJson, null, 2));
      log('✅ client/package.json создан', 'green');
    }

    // Проверяем, что ключевые файлы с изменениями включены
    const keyUpdatedFiles = [
      'client/src/components/galaxy-map/galaxy-universe-new.tsx',
      'client/src/pages/dashboard.tsx',
      'client/src/components/skills-dna/results-widget.tsx'
    ];

    keyUpdatedFiles.forEach(file => {
      const fullPath = path.join(packageDir, file);
      if (fs.existsSync(fullPath)) {
        log(`✅ Ключевое обновление: ${file}`, 'green');
      } else {
        log(`⚠️ Отсутствует: ${file}`, 'yellow');
      }
    });

    // Создаем архив
    log('🗜️ Создание архива...', 'yellow');
    execSync(`zip -r ${packageDir}.zip ${packageDir}/ -x "*.git*" "node_modules/*"`, { stdio: 'inherit' });
    
    const stats = fs.statSync(`${packageDir}.zip`);
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(1);
    
    log('✅ Полный архив создан!', 'green');
    log(`📦 Архив: ${packageDir}.zip (${fileSizeInMB} МБ)`, 'cyan');
    
    return { packageDir, archiveName: `${packageDir}.zip` };
    
  } catch (error) {
    log(`❌ Ошибка: ${error.message}`, 'red');
    throw error;
  }
}

function generateFullUpdateInstructions(packageName) {
  const instructions = `# ПОЛНОЕ ОБНОВЛЕНИЕ GITHUB С ПОСЛЕДНИМИ ИЗМЕНЕНИЯМИ

## 🎯 ВАЖНО: Сайт показывает старую версию!

Текущая проблема: в GitHub загружена устаревшая версия без последних обновлений:
- ❌ Старый дизайн галактической карты
- ❌ Старое расположение виджетов на дашборде  
- ❌ Не исправлен полноэкранный режим

## 📦 Новый архив содержит ВСЕ последние изменения:
- ✅ Исправленный полноэкранный режим галактической карты
- ✅ Правильное расположение виджетов (Skills DNA слева, курсы справа)
- ✅ Удаленная кнопка "Подробный анализ Skills DNA"
- ✅ Мобильная оптимизация
- ✅ Все анимации и эффекты галактической карты

## 🚀 ИНСТРУКЦИИ ПО ПОЛНОМУ ОБНОВЛЕНИЮ:

### Шаг 1: Полная очистка GitHub
1. Откройте https://github.com/BAWION/novaai.git
2. Удалите ВСЕ файлы (кроме .gitignore если нужен)
3. Либо через веб-интерфейс, либо:
\`\`\`bash
git rm -rf .
git commit -m "Clear for full update"
git push origin main
\`\`\`

### Шаг 2: Загрузка полного обновления
1. Распакуйте архив ${packageName}
2. Загрузите ВСЕ файлы из папки на GitHub
3. Commit message: "Full update: Galaxy map improvements + dashboard optimization"

### Шаг 3: Проверка обновления
1. Дождитесь автодеплоя Vercel (2-3 минуты)
2. Откройте https://www.galaxion.org/
3. Проверьте:
   - ✅ Кнопка "Развернуть" в разделе "Вселенная ИИ" работает
   - ✅ Виджеты расположены правильно на дашборде
   - ✅ Галактическая карта с полными анимациями
   - ✅ Мобильная версия оптимизирована

## 🔧 Содержимое архива:
- **client/** - ВСЯ клиентская часть с последними изменениями
- **shared/** - Общие схемы и типы
- **vercel.json** - Рабочая конфигурация деплоя
- **package.json** - Зависимости проекта
- **client/package.json** - Конфигурация сборки клиента

## ⚠️ ВАЖНО:
Этот архив содержит ПОЛНУЮ актуальную версию. 
Предыдущие архивы устарели и не содержат всех изменений.

После загрузки сайт будет показывать последнюю версию со всеми исправлениями.`;

  fs.writeFileSync('FULL_UPDATE_INSTRUCTIONS.md', instructions);
  log('📝 Инструкции сохранены в FULL_UPDATE_INSTRUCTIONS.md', 'green');
}

function main() {
  log('🚀 Создание полного архива с последними изменениями...', 'bright');
  
  try {
    const result = createFullUpdateArchive();
    generateFullUpdateInstructions(result.archiveName);
    
    log('\n📋 ИТОГИ:', 'bright');
    log(`✅ Создан полный архив: ${result.archiveName}`, 'green');
    log('📝 Инструкции: FULL_UPDATE_INSTRUCTIONS.md', 'green');
    log('\n🎯 КРИТИЧНО - СЛЕДУЮЩИЕ ШАГИ:', 'bright');
    log('1. ПОЛНОСТЬЮ очистите GitHub репозиторий', 'cyan');
    log('2. Загрузите ВСЕ файлы из нового архива', 'cyan');
    log('3. Проверьте актуальную версию на https://www.galaxion.org/', 'cyan');
    
  } catch (error) {
    log(`❌ Ошибка: ${error.message}`, 'red');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { createFullUpdateArchive };
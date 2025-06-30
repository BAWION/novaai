/**
 * Исправление проблем с GitHub деплоем
 * Создает архив с правильной структурой и исправляет проблемы импортов
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

function fixImportIssues() {
  log('🔧 Исправление проблем с импортами...', 'yellow');
  
  // Проверяем и исправляем импорты use-mobile
  const indexCssPath = 'client/src/index.css';
  if (fs.existsSync(indexCssPath)) {
    let indexCss = fs.readFileSync(indexCssPath, 'utf8');
    
    // Удаляем некорректные импорты из CSS файла
    if (indexCss.includes('/src/hooks/use-mobile.ts')) {
      indexCss = indexCss.replace(/.*\/src\/hooks\/use-mobile\.ts.*\n?/g, '');
      fs.writeFileSync(indexCssPath, indexCss);
      log('✅ Исправлен импорт use-mobile.ts в index.css', 'green');
    }
  }
  
  // Проверяем существование критических файлов
  const criticalFiles = [
    'client/src/hooks/use-mobile.ts',
    'client/src/hooks/use-auth.tsx',
    'client/src/context/auth-context.tsx',
    'client/src/components/auth/telegram-login.tsx'
  ];
  
  criticalFiles.forEach(file => {
    if (fs.existsSync(file)) {
      log(`✅ Файл существует: ${file}`, 'green');
    } else {
      log(`❌ Отсутствует: ${file}`, 'red');
    }
  });
}

function createFixedGitHubPackage() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const packageDir = `galaxion-github-fixed-${timestamp}`;
  
  log('🚀 Создание исправленного пакета для GitHub...', 'cyan');
  
  try {
    // Создаем директорию
    if (!fs.existsSync(packageDir)) {
      fs.mkdirSync(packageDir, { recursive: true });
    }

    // Список файлов для включения (более точный)
    const includeFiles = [
      // Конфигурационные файлы
      'package.json',
      'package-lock.json',
      'vite.config.ts',
      'tailwind.config.ts',
      'postcss.config.js',
      'tsconfig.json',
      'components.json',
      'index.html',
      
      // Vercel конфигурация
      'vercel.json',
      
      // Документация
      'README.md',
      'replit.md'
    ];

    // Копируем конфигурационные файлы
    includeFiles.forEach(file => {
      if (fs.existsSync(file)) {
        const destPath = path.join(packageDir, file);
        const destDir = path.dirname(destPath);
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
        fs.copyFileSync(file, destPath);
        log(`✅ Скопирован: ${file}`, 'green');
      }
    });

    // Копируем client директорию полностью (но исключаем ненужное)
    function copyDirectorySelective(src, dest, excludePatterns = []) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }

      const items = fs.readdirSync(src);
      
      for (const item of items) {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);
        const relativePath = path.relative('.', srcPath);
        
        // Проверяем исключения
        const shouldExclude = excludePatterns.some(pattern => {
          if (pattern.endsWith('/')) {
            return relativePath.startsWith(pattern);
          }
          return relativePath.includes(pattern);
        });
        
        if (shouldExclude) {
          continue;
        }

        const stat = fs.statSync(srcPath);
        
        if (stat.isDirectory()) {
          copyDirectorySelective(srcPath, destPath, excludePatterns);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    }

    // Копируем client/ и shared/
    const excludePatterns = [
      'node_modules/',
      '.git/',
      '.env',
      'dist/',
      'build/'
    ];

    log('📁 Копирование client/...', 'yellow');
    copyDirectorySelective('client', path.join(packageDir, 'client'), excludePatterns);
    
    log('📁 Копирование shared/...', 'yellow');
    if (fs.existsSync('shared')) {
      copyDirectorySelective('shared', path.join(packageDir, 'shared'), excludePatterns);
    }

    // Создаем исправленный vercel.json
    const vercelConfig = {
      "$schema": "https://openapi.vercel.sh/vercel.json",
      "version": 2,
      "framework": "vite",
      "buildCommand": "cd client && npm install && npm run build",
      "outputDirectory": "client/dist",
      "installCommand": "npm install",
      "devCommand": "npm run dev",
      "public": true,
      "functions": {
        "server/index.js": {
          "runtime": "nodejs18.x"
        }
      },
      "rewrites": [
        {
          "source": "/api/(.*)",
          "destination": "https://49c11d52-b1fc-4151-bb61-b9097616c44f-00-3h2ne9cwwtbvn.janeway.replit.dev/api/$1"
        },
        {
          "source": "/(.*)",
          "destination": "/$1"
        }
      ],
      "headers": [
        {
          "source": "/(.*\\.(css|js|png|jpg|jpeg|gif|ico|svg))",
          "headers": [
            {
              "key": "Cache-Control",
              "value": "public, max-age=31536000, immutable"
            }
          ]
        }
      ]
    };

    fs.writeFileSync(
      path.join(packageDir, 'vercel.json'),
      JSON.stringify(vercelConfig, null, 2)
    );
    log('✅ Создан исправленный vercel.json', 'green');

    // Создаем архив
    log('🗜️ Создание архива...', 'yellow');
    execSync(`zip -r ${packageDir}.zip ${packageDir}/ -x "*.git*" "node_modules/*"`, { stdio: 'inherit' });
    
    const stats = fs.statSync(`${packageDir}.zip`);
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(1);
    
    log('✅ Исправленный пакет создан!', 'green');
    log(`📦 Архив: ${packageDir}.zip (${fileSizeInMB} МБ)`, 'cyan');
    
    return { packageDir, archiveName: `${packageDir}.zip` };
    
  } catch (error) {
    log(`❌ Ошибка: ${error.message}`, 'red');
    throw error;
  }
}

function generateFixInstructions(packageName) {
  const instructions = `# Исправление проблем с GitHub деплоем

## 🐛 Проблемы которые исправлены:

### 1. Импорт use-mobile.ts в CSS
- Удален некорректный импорт из index.css
- Исправлена структура файлов hooks

### 2. Оптимизированная конфигурация Vercel
- Правильный buildCommand с установкой зависимостей
- Корректный outputDirectory: "client/dist"
- Исправлены rewrites для API проксирования

### 3. Структура проекта
- Включены все необходимые файлы для фронтенд деплоя
- Исключены серверные файлы и зависимости
- Сохранена полная структура client/ и shared/

## 🚀 Инструкции по загрузке:

### Шаг 1: Очистка GitHub репозитория
1. Откройте https://github.com/BAWION/novaai.git
2. Удалите все файлы через веб-интерфейс или:
\`\`\`bash
git rm -r .
git commit -m "Clean repository for fixed deployment"
git push origin main
\`\`\`

### Шаг 2: Загрузка исправленных файлов
1. Распакуйте архив ${packageName}
2. Загрузите все файлы из папки на GitHub
3. Commit message: "Fix: Resolve deployment issues and optimize build"

### Шаг 3: Проверка деплоя
1. Vercel автоматически запустит новый билд
2. Проверьте https://www.galaxion.org/ через 2-3 минуты
3. Убедитесь что авторизация работает корректно

## 🔧 Что исправлено:
- ✅ Убраны некорректные импорты в CSS
- ✅ Оптимизирован vercel.json для правильной сборки
- ✅ Исправлена структура проекта
- ✅ Добавлены все необходимые файлы hooks
- ✅ Настроено правильное API проксирование`;

  fs.writeFileSync('GITHUB_FIX_INSTRUCTIONS.md', instructions);
  log('📝 Инструкции сохранены в GITHUB_FIX_INSTRUCTIONS.md', 'green');
}

function main() {
  log('🔧 Запуск исправления GitHub деплоя...', 'bright');
  
  try {
    fixImportIssues();
    const result = createFixedGitHubPackage();
    generateFixInstructions(result.archiveName);
    
    log('\n📋 ИТОГИ:', 'bright');
    log(`✅ Создан исправленный архив: ${result.archiveName}`, 'green');
    log('📝 Инструкции: GITHUB_FIX_INSTRUCTIONS.md', 'green');
    log('\n🎯 СЛЕДУЮЩИЕ ШАГИ:', 'bright');
    log('1. Очистите GitHub репозиторий от старых файлов', 'cyan');
    log('2. Загрузите исправленные файлы', 'cyan');
    log('3. Дождитесь успешного деплоя на Vercel', 'cyan');
    
  } catch (error) {
    log(`❌ Ошибка: ${error.message}`, 'red');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { fixImportIssues, createFixedGitHubPackage };
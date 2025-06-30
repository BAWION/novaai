/**
 * Автоматическое обновление GitHub репозитория с последними изменениями
 * Создает архив и инструкции для синхронизации с Vercel деплоем
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
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function getCurrentTimestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
}

function createGitHubUpdatePackage() {
  const timestamp = getCurrentTimestamp();
  const packageDir = `galaxion-github-update-${timestamp}`;
  
  log('🚀 Создание пакета обновлений для GitHub...', 'cyan');
  
  try {
    // Создаем директорию для пакета
    if (!fs.existsSync(packageDir)) {
      fs.mkdirSync(packageDir, { recursive: true });
    }

    // Список критически важных файлов для фронтенд деплоя
    const importantFiles = [
      // Основные конфигурационные файлы
      'package.json',
      'package-lock.json',
      'vite.config.ts',
      'tailwind.config.ts',
      'postcss.config.js',
      'tsconfig.json',
      'vercel.json',
      'index.html',
      
      // Весь клиентский код
      'client/',
      
      // Общие типы и схемы
      'shared/',
      
      // Документация
      'README.md',
      'replit.md',
      
      // Конфигурации компонентов
      'components.json'
    ];

    // Исключаемые файлы и папки
    const excludePatterns = [
      'node_modules/',
      '.env',
      '.env.*',
      'migrations/',
      'server/',
      '*.zip',
      '*.log',
      '.git/',
      'attached_assets/',
      'cypress/',
      'screenshots/',
      '*-update-*/',
      'galaxion-*/',
      'github-upload/',
      'vercel-deploy/',
      '*.md',
      '!README.md',
      '!replit.md'
    ];

    log('📁 Копирование важных файлов...', 'yellow');
    
    // Функция для проверки, нужно ли исключить файл
    function shouldExclude(filePath) {
      return excludePatterns.some(pattern => {
        if (pattern.startsWith('!')) {
          return false; // Исключения из исключений
        }
        if (pattern.endsWith('/')) {
          return filePath.startsWith(pattern);
        }
        return filePath.includes(pattern);
      });
    }

    // Копируем файлы
    function copyDirectory(src, dest) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }

      const items = fs.readdirSync(src);
      
      for (const item of items) {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);
        const relativePath = path.relative('.', srcPath);
        
        if (shouldExclude(relativePath)) {
          continue;
        }

        const stat = fs.statSync(srcPath);
        
        if (stat.isDirectory()) {
          copyDirectory(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      }
    }

    // Копируем важные файлы
    for (const file of importantFiles) {
      if (fs.existsSync(file)) {
        const stat = fs.statSync(file);
        const destPath = path.join(packageDir, file);
        
        if (stat.isDirectory()) {
          copyDirectory(file, destPath);
        } else {
          // Создаем директорию если нужно
          const destDir = path.dirname(destPath);
          if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
          }
          fs.copyFileSync(file, destPath);
        }
        log(`✅ Скопировано: ${file}`, 'green');
      }
    }

    log('📋 Создание инструкций для GitHub...', 'yellow');
    generateGitHubInstructions(packageDir, timestamp);
    
    log('🗜️ Создание архива...', 'yellow');
    execSync(`zip -r ${packageDir}.zip ${packageDir}/ -x "*.git*" "node_modules/*"`, { stdio: 'inherit' });
    
    // Получаем размер архива
    const stats = fs.statSync(`${packageDir}.zip`);
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(1);
    
    log('✅ Пакет обновлений создан успешно!', 'green');
    log(`📦 Архив: ${packageDir}.zip (${fileSizeInMB} МБ)`, 'cyan');
    log(`📁 Директория: ${packageDir}/`, 'cyan');
    
    return { packageDir, archiveName: `${packageDir}.zip` };
    
  } catch (error) {
    log(`❌ Ошибка при создании пакета: ${error.message}`, 'red');
    throw error;
  }
}

function generateGitHubInstructions(packageDir, timestamp) {
  const instructions = `# Инструкции по обновлению GitHub репозитория
## Дата создания: ${new Date().toLocaleString('ru-RU')}

### 🎯 Цель
Обновить GitHub репозиторий https://github.com/BAWION/novaai.git с последними изменениями для автоматического деплоя на Vercel.

### 📋 Последние изменения включают:
- ✅ Исправлен полноэкранный режим галактической карты
- ✅ Изменено расположение виджетов на дашборде (Skills DNA слева, курсы справа)  
- ✅ Удалена кнопка "Подробный анализ Skills DNA"
- ✅ Улучшена мобильная адаптивность

### 🚀 Инструкции по загрузке:

#### Вариант 1: Через GitHub Web Interface
1. Перейдите на https://github.com/BAWION/novaai.git
2. Нажмите "Add file" → "Upload files"
3. Загрузите все файлы из папки \`${packageDir}/\`
4. В поле commit message введите: "Update: Fix galaxy map fullscreen + dashboard layout improvements"
5. Нажмите "Commit changes"

#### Вариант 2: Через Git командную строку
\`\`\`bash
# Клонируйте репозиторий (если еще не клонирован)
git clone https://github.com/BAWION/novaai.git
cd novaai

# Скопируйте файлы из ${packageDir}/ в корень репозитория
# Затем выполните:
git add .
git commit -m "Update: Fix galaxy map fullscreen + dashboard layout improvements"
git push origin main
\`\`\`

### 🔄 Vercel автоматически обновится
После push в GitHub, Vercel автоматически:
1. Обнаружит изменения
2. Запустит новый билд
3. Задеплоит обновления на https://www.galaxion.org/

### 📁 Содержимое пакета:
- client/ - Весь клиентский код с исправлениями
- shared/ - Общие типы и схемы  
- package.json - Зависимости проекта
- vite.config.ts - Конфигурация сборки
- vercel.json - Настройки деплоя Vercel
- И другие конфигурационные файлы

### ⏰ Время деплоя
Обычно занимает 2-3 минуты после push в GitHub.

### 🔍 Проверка результата
1. Откройте https://www.galaxion.org/
2. Проверьте работу кнопки "Развернуть" в разделе "Вселенная ИИ"
3. Убедитесь, что виджеты расположены корректно на дашборде
4. Проверьте отсутствие кнопки "Подробный анализ Skills DNA"
`;

  fs.writeFileSync(path.join(packageDir, 'GITHUB_UPDATE_INSTRUCTIONS.md'), instructions);
  log('📝 Инструкции сохранены в GITHUB_UPDATE_INSTRUCTIONS.md', 'green');
}

function updateReplitMd() {
  const newEntry = `- 2025-06-30: ПОДГОТОВЛЕН ПАКЕТ ОБНОВЛЕНИЙ ДЛЯ GITHUB
  - ✅ Исправлен полноэкранный режим галактической карты с кнопкой закрытия
  - ✅ Изменено расположение виджетов: Skills DNA слева, рекомендуемые курсы справа (desktop)
  - ✅ Удалена кнопка "Подробный анализ Skills DNA" для более компактного интерфейса
  - ✅ Создан архив с инструкциями для синхронизации с https://github.com/BAWION/novaai.git
  - ЦЕЛЬ: автоматический деплой обновлений на Vercel https://www.galaxion.org/`;

  try {
    let replitMd = fs.readFileSync('replit.md', 'utf8');
    
    // Добавляем новую запись в начало секции Changelog
    const changelogMatch = replitMd.match(/## Changelog\s*\n/);
    if (changelogMatch) {
      const insertIndex = changelogMatch.index + changelogMatch[0].length;
      replitMd = replitMd.slice(0, insertIndex) + '\n' + newEntry + '\n' + replitMd.slice(insertIndex);
    } else {
      replitMd += '\n\n## Changelog\n\n' + newEntry + '\n';
    }
    
    fs.writeFileSync('replit.md', replitMd);
    log('📝 replit.md обновлен с записью о GitHub синхронизации', 'green');
  } catch (error) {
    log(`⚠️ Не удалось обновить replit.md: ${error.message}`, 'yellow');
  }
}

function main() {
  log('🚀 Запуск создания пакета обновлений для GitHub...', 'bright');
  
  try {
    const result = createGitHubUpdatePackage();
    updateReplitMd();
    
    log('\n📋 ИТОГИ:', 'bright');
    log(`✅ Создан архив: ${result.archiveName}`, 'green');
    log(`📁 Директория: ${result.packageDir}/`, 'green');
    log('📝 Инструкции: GITHUB_UPDATE_INSTRUCTIONS.md', 'green');
    log('\n🎯 СЛЕДУЮЩИЕ ШАГИ:', 'bright');
    log('1. Загрузите файлы на https://github.com/BAWION/novaai.git', 'cyan');
    log('2. Vercel автоматически обновит https://www.galaxion.org/', 'cyan');
    log('3. Проверьте работу обновлений через 2-3 минуты', 'cyan');
    
  } catch (error) {
    log(`❌ Ошибка: ${error.message}`, 'red');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { createGitHubUpdatePackage, updateReplitMd };
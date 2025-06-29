#!/usr/bin/env node

/**
 * Скрипт для создания архива с измененными файлами Galaxion
 * Упрощает процесс загрузки обновлений в GitHub
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const criticalFiles = [
  'client/src/pages/home-page.tsx',
  'client/src/components/layout/navbar.tsx', 
  'client/src/components/main-layout.tsx',
  'client/src/pages/onboarding-intro.tsx',
  'client/src/pages/presentation-selector.tsx',
  'client/index.html',
  'index.html',
  'public/manifest.json',
  'vercel.json',
  'package.json',
  'README.md',
  'replit.md'
];

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

function createDeploymentPackage() {
  log('\n📦 Создание пакета для GitHub развертывания', 'bright');
  log('==========================================', 'cyan');
  
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
  const packageDir = `galaxion-update-${timestamp}`;
  
  // Создаем директорию для пакета
  if (!fs.existsSync(packageDir)) {
    fs.mkdirSync(packageDir, { recursive: true });
  }
  
  const copiedFiles = [];
  const skippedFiles = [];
  
  criticalFiles.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      const targetPath = path.join(packageDir, filePath);
      const targetDir = path.dirname(targetPath);
      
      // Создаем директорию если не существует
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      // Копируем файл
      fs.copyFileSync(filePath, targetPath);
      copiedFiles.push(filePath);
      log(`✅ ${filePath}`, 'green');
    } else {
      skippedFiles.push(filePath);
      log(`❌ ${filePath} (не найден)`, 'red');
    }
  });
  
  // Создаем README для пакета
  const readmeContent = `# Galaxion Update Package

Дата создания: ${new Date().toLocaleString('ru-RU')}
Репозиторий: https://github.com/BAWION/novaai.git
Продакшн сайт: https://www.galaxion.org/

## Обновленные файлы (${copiedFiles.length}):

${copiedFiles.map(file => `- ${file}`).join('\n')}

${skippedFiles.length > 0 ? `## Пропущенные файлы (${skippedFiles.length}):\n\n${skippedFiles.map(file => `- ${file}`).join('\n')}` : ''}

## Инструкция по развертыванию:

1. Загрузите эти файлы в GitHub репозиторий https://github.com/BAWION/novaai.git
2. Сохраните структуру папок при загрузке
3. Создайте коммит с сообщением:

\`\`\`
feat: завершено переименование на Galaxion и улучшен UX

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
\`\`\`

4. После коммита Vercel автоматически пересоберет сайт
5. Проверьте изменения на https://www.galaxion.org/ через 1-2 минуты

## Ключевые изменения:

- **Брендинг**: Полная замена "NovaAI University" на "Galaxion"
- **Логотип**: Улучшенный дизайн в навигационной панели
- **Метаданные**: Обновленные title, description, PWA манифест
- **Интерфейс**: Консистентное использование нового названия
`;

  fs.writeFileSync(path.join(packageDir, 'README.md'), readmeContent);
  
  log(`\n📊 Результат:`, 'blue');
  log(`✅ Скопировано файлов: ${copiedFiles.length}`, 'green');
  log(`❌ Пропущено файлов: ${skippedFiles.length}`, 'red');
  log(`📁 Пакет создан в: ./${packageDir}/`, 'cyan');
  
  // Создаем простой архив если доступен zip
  try {
    execSync(`zip -r ${packageDir}.zip ${packageDir}`, { stdio: 'pipe' });
    log(`📦 Архив создан: ${packageDir}.zip`, 'yellow');
  } catch (error) {
    log(`💡 Совет: Создайте zip-архив папки ${packageDir} вручную`, 'yellow');
  }
  
  return packageDir;
}

function generateGitInstructions(packageDir) {
  log(`\n🚀 Git команды для развертывания:`, 'bright');
  log(`================================`, 'cyan');
  
  const commands = `
# 1. Клонируйте репозиторий (если еще не клонировали)
git clone https://github.com/BAWION/novaai.git
cd novaai

# 2. Скопируйте файлы из пакета ${packageDir} в репозиторий

# 3. Добавьте изменения
git add .

# 4. Создайте коммит
git commit -m "feat: завершено переименование на Galaxion и улучшен UX

🎯 Основные изменения:
- Полное переименование с 'NovaAI University' на 'Galaxion'
- NovaAI теперь ИИ-ассистент внутри платформы
- Улучшен логотип в навигации (увеличен размер, убрана лишняя иконка)
- Обновлены все метаданные и PWA манифест
- Интеграция нового брендинга во всех интерфейсах

🚀 Результат: 
- Платформа работает на https://www.galaxion.org/
- Консистентный брендинг по всему интерфейсу
- Улучшенная узнаваемость и профессиональный вид"

# 5. Отправьте изменения
git push origin main

# 6. Проверьте автоматическое развертывание на https://www.galaxion.org/
`;

  log(commands, 'green');
}

// Запуск скрипта
const packageDir = createDeploymentPackage();
generateGitInstructions(packageDir);

log(`\n✨ Пакет готов к загрузке в GitHub!`, 'bright');
log(`🎯 Цель: обновить https://www.galaxion.org/ с брендингом Galaxion`, 'green');
log(`📁 Используйте папку: ${packageDir}`, 'cyan');
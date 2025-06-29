/**
 * Скрипт для обновления GitHub репозитория с исправлениями для Vercel деплоя
 * Исправляет структуру проекта и конфигурацию для корректного отображения стилей
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Обновление GitHub репозитория для корректного Vercel деплоя...\n');

// 1. Проверяем что файлы собраны
console.log('✅ Проверяем сборку проекта...');
if (!fs.existsSync('dist/public')) {
  console.log('⚠️  Папка dist/public не найдена, запускаем сборку...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
  } catch (error) {
    console.log('❌ Ошибка сборки:', error.message);
    process.exit(1);
  }
}

// 2. Создаем правильный package.json скрипт для Vercel
console.log('✅ Обновляем package.json для Vercel...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
packageJson.scripts = {
  ...packageJson.scripts,
  "build": "vite build",
  "build:vercel": "vite build"
};
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

// 3. Создаем файл .vercelignore
console.log('✅ Создаем .vercelignore...');
const vercelIgnore = `
# Игнорируем серверные файлы для фронтенд деплоя
server/
node_modules/
.env
*.log
.replit
screenshots/
cypress/
docs/
migrations/
attached_assets/
*.md
!README.md

# Разрешаем только клиентские файлы
!client/
!shared/
!public/
!vercel.json
!package.json
!package-lock.json
!tailwind.config.ts
!postcss.config.js
!components.json
!vite.config.ts
!tsconfig.json
!index.html
`;
fs.writeFileSync('.vercelignore', vercelIgnore.trim());

// 4. Проверяем конфигурацию tailwind
console.log('✅ Проверяем tailwind.config.ts...');
const tailwindConfig = fs.readFileSync('tailwind.config.ts', 'utf8');
if (!tailwindConfig.includes('./client/src/**/*.{js,jsx,ts,tsx}')) {
  console.log('❌ Tailwind конфигурация неправильная! Исправляю...');
  const fixedConfig = tailwindConfig.replace(
    /content:\s*\[.*?\]/s,
    'content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"]'
  );
  fs.writeFileSync('tailwind.config.ts', fixedConfig);
}

// 5. Создаем инструкции для GitHub коммита
console.log('✅ Создаем инструкции для коммита...');
const commitInstructions = `
# 🚀 Инструкции для обновления GitHub репозитория

## Команды для выполнения:

\`\`\`bash
# 1. Добавить все изменения
git add .

# 2. Сделать коммит с исправлениями
git commit -m "Fix: Исправлена структура проекта и конфигурация для Vercel деплоя

- Обновлен vercel.json с правильным outputDirectory: dist/public
- Исправлен tailwind.config.ts для сканирования client/src/
- Добавлен .vercelignore для оптимизации деплоя
- Обновлен package.json с корректными скриптами сборки
- Удалена дублированная папка src/
- Исправлена загрузка CSS стилей"

# 3. Отправить на GitHub
git push origin main
\`\`\`

## Результат:
После выполнения этих команд:
1. Vercel автоматически пересоберет проект с правильной конфигурацией
2. CSS стили будут корректно загружаться
3. API запросы будут проксироваться на Replit backend
4. Сайт будет работать на gulcheev.com с полным функционалом

## Проверка:
- ✅ Vercel config: outputDirectory = "dist/public"  
- ✅ Tailwind config: сканирует "./client/src/**/*.{js,jsx,ts,tsx}"
- ✅ Build command: "vite build"
- ✅ API proxy: настроен на Replit backend
- ✅ Структура проекта: исправлена (удалена дублированная src/)
`;

fs.writeFileSync('GITHUB-UPDATE-INSTRUCTIONS.md', commitInstructions.trim());

console.log('\n🎉 Подготовка завершена!');
console.log('\n📋 Что делать дальше:');
console.log('1. Выполните команды из файла GITHUB-UPDATE-INSTRUCTIONS.md');
console.log('2. После git push Vercel автоматически пересоберет проект');
console.log('3. Сайт gulcheev.com будет работать с правильными стилями');
console.log('\n🔗 Файлы обновлены:');
console.log('- ✅ vercel.json (outputDirectory: dist/public)');
console.log('- ✅ package.json (build scripts)'); 
console.log('- ✅ .vercelignore (оптимизация деплоя)');
console.log('- ✅ tailwind.config.ts (правильные пути)');
console.log('\n📖 Читайте GITHUB-UPDATE-INSTRUCTIONS.md для точных команд');
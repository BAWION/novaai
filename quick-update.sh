#!/bin/bash

# Быстрое обновление сайта на Vercel через GitHub
# Использование: ./quick-update.sh "описание изменений"

set -e

COMMIT_MSG="${1:-Автоматическое обновление $(date '+%d.%m.%Y %H:%M')}"

echo "🚀 Быстрое обновление NovaAI University"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Проверка наличия изменений
if git diff --quiet && git diff --staged --quiet; then
    echo "📝 Нет изменений для отправки"
    exit 0
fi

# Сборка проекта
echo "🔨 Сборка проекта..."
npm run build

# Копирование конфигурации
echo "📋 Подготовка конфигурации..."
cp vercel.json ./vercel.json 2>/dev/null || echo "vercel.json уже на месте"
cp package-for-github.json ./package.json 2>/dev/null || echo "package.json уже на месте"

# Git операции
echo "📤 Отправка в GitHub..."
git add .
git commit -m "$COMMIT_MSG"
git push origin main

echo "✅ Обновление завершено!"
echo "🌐 Vercel обновит сайт автоматически в течение 1-2 минут"
echo "🔗 Проверить: https://github.com/BAWION/novaai"
#!/bin/bash

echo "🔄 Синхронизация изменений Galaxion с GitHub"
echo "============================================="

# Проверяем статус Git
echo "📊 Проверка статуса изменений..."
git status --porcelain

echo ""
echo "📁 Основные файлы для проверки:"
files=(
    "client/src/pages/home-page.tsx"
    "client/src/components/layout/navbar.tsx"
    "client/src/components/main-layout.tsx"
    "client/index.html"
    "index.html"
    "public/manifest.json"
    "replit.md"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (отсутствует)"
    fi
done

echo ""
echo "🚀 Для синхронизации через Replit Git UI:"
echo "1. Откройте панель Version Control (Ctrl+Shift+G)"
echo "2. Отметьте измененные файлы"
echo "3. Добавьте сообщение коммита:"
echo ""
echo "feat: завершено переименование на Galaxion и улучшен UX"
echo ""
echo "🎯 Основные изменения:"
echo "- Полное переименование с 'NovaAI University' на 'Galaxion'"
echo "- NovaAI теперь ИИ-ассистент внутри платформы"
echo "- Улучшен логотип в навигации (увеличен размер, убрана лишняя иконка)"
echo "- Обновлены все метаданные и PWA манифест"
echo "- Интеграция нового брендинга во всех интерфейсах"
echo ""
echo "🚀 Результат: https://www.galaxion.org/"
echo ""
echo "4. Нажмите 'Commit & Push'"
echo ""
echo "⚡ Vercel автоматически обновит https://www.galaxion.org/ через 1-2 минуты"
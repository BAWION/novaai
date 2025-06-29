#!/bin/bash

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
for file in "${files[@]}"; do
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

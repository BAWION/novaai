# NovaAI University - Frontend

Фронтенд образовательной платформы NovaAI University для развертывания на Vercel.

## Архитектура

- **Фронтенд**: Статические файлы на Vercel (глобальная CDN)
- **Бэкенд**: API и база данных на Replit
- **Интеграция**: API запросы проксируются через vercel.json

## Развертывание на Vercel

1. Подключите этот GitHub репозиторий к Vercel
2. Настройки проекта:
   - Framework: **Other**
   - Root Directory: `.`
   - Build Command: оставить пустым
   - Output Directory: оставить пустым
   - Install Command: оставить пустым

3. Vercel автоматически использует конфигурацию из `vercel.json`

## Структура файлов

```
├── index.html          # Главная страница
├── assets/            # JS и CSS файлы
├── icons/             # PWA иконки
├── manifest.json      # PWA манифест
├── service-worker.js  # Service Worker
├── vercel.json        # Конфигурация Vercel
└── _redirects         # Fallback маршрутизация
```

## Функциональность

- ✅ Skills DNA диагностика персональных навыков ИИ
- ✅ Библиотека из 9+ образовательных курсов
- ✅ ИИ-тьютор с интеграцией OpenAI/Anthropic
- ✅ Система прогресса и достижений
- ✅ Сообщество через Telegram канал
- ✅ LabHub для практики ML/Data Science

## Технологии

- React 18 + TypeScript
- Tailwind CSS + shadcn/ui
- TanStack React Query
- Radix UI компоненты
- PWA поддержка
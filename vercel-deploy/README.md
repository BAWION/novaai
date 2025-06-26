# NovaAI University - Vercel Deployment

Полная версия образовательной платформы NovaAI University с системой Skills DNA.

## Быстрый деплой на Vercel

1. **Загрузите все файлы** из этого архива в новый GitHub репозиторий
2. **Подключите репозиторий к Vercel** через vercel.com
3. **Добавьте переменные окружения** в настройках Vercel:
   - `DATABASE_URL` - строка подключения к PostgreSQL
   - `OPENAI_API_KEY` - ключ OpenAI API
   - `ANTHROPIC_API_KEY` - ключ Anthropic Claude API

## Структура проекта

```
├── client/          # React frontend с TypeScript
├── server/          # Express.js backend API
├── shared/          # Общие типы и схемы Drizzle
├── public/          # Статические файлы
├── vercel.json      # Конфигурация Vercel
└── package.json     # Зависимости проекта
```

## Ключевые функции

- **Skills DNA диагностика**: многоуровневая оценка навыков
- **Умный подбор курсов**: ИИ рекомендации
- **Адаптивный прогресс**: обновление навыков после уроков
- **ИИ-тьютор**: персональный помощник
- **LabHub**: интерактивная лаборатория
- **Сообщество**: интеграция с Telegram

## База данных

Проект использует PostgreSQL с Drizzle ORM. Убедитесь, что переменная `DATABASE_URL` указывает на рабочую базу данных PostgreSQL.

## Поддержка

Рабочая версия доступна по адресу:
https://49c11d52-b1fc-4151-bb61-b9097616c44f-00-3h2ne9cwwtbvn.janeway.replit.dev/
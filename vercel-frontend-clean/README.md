# NovaAI University - Frontend (Vercel Deploy)

Фронтенд образовательной платформы NovaAI University для деплоя на Vercel с проксированием API на Replit.

## Быстрый деплой

1. **Загрузите все файлы** из этой папки в GitHub репозиторий
2. **Подключите к Vercel** через vercel.com
3. **Выберите Framework**: Vite
4. **Оставьте настройки по умолчанию** - они правильные

## Настройки Vercel

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Root Directory**: (оставить пустым)

## Автоматическое проксирование API

Все `/api/*` запросы автоматически перенаправляются на Replit:
`https://49c11d52-b1fc-4151-bb61-b9097616c44f-00-3h2ne9cwwtbvn.janeway.replit.dev/`

Переменные окружения НЕ НУЖНЫ.
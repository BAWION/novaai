# NovaAI University - Frontend для Vercel

Фронтенд образовательной платформы NovaAI University с автоматическим проксированием API на Replit.

## Настройки для Vercel

- **Framework Preset**: Vite
- **Root Directory**: (оставить пустым)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Автоматическое API проксирование

Все `/api/*` запросы автоматически перенаправляются на рабочий Replit:
`https://49c11d52-b1fc-4151-bb61-b9097616c44f-00-3h2ne9cwwtbvn.janeway.replit.dev/`

Переменные окружения НЕ НУЖНЫ - всё настроено через vercel.json

## Структура

- `src/` - исходный код React компонентов
- `public/` - статические файлы
- `package.json` - зависимости (в корне!)
- `vercel.json` - конфигурация проксирования
- `vite.config.ts` - настройки сборки
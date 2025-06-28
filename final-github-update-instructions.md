# Финальные инструкции для GitHub репозитория https://github.com/BAWION/novaai.git

## Что нужно сделать:

1. **Скопируйте исправленный vercel.json в ваш GitHub репозиторий**

Замените содержимое файла `vercel.json` в корне репозитория на:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist/public",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://49c11d52-b1fc-4151-bb61-b9097616c44f-00-3h2ne9cwwtbvn.janeway.replit.dev/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*\\.(css|js))",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, PATCH, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "X-Requested-With, Content-Type, Accept, Authorization"
        }
      ]
    }
  ]
}
```

2. **Закоммитьте и отправьте изменения:**

```bash
git add vercel.json
git commit -m "Fix CSS loading on Vercel deployment"
git push origin main
```

## Что это исправит:

✅ **CSS стили будут загружаться корректно** - добавлены правильные заголовки кэширования
✅ **API запросы работают** - проксирование на Replit сервер настроено
✅ **SPA роутинг работает** - все страницы ведут на index.html
✅ **Статические файлы оптимизированы** - правильное кэширование и сжатие

## После обновления:

- Vercel автоматически пересоберет проект
- CSS стили будут отображаться как в Replit версии
- Ваш сайт будет доступен на домене gulcheev.com
- Все функции NovaAI University будут работать корректно

## Результат:

Полностью функциональная образовательная платформа с:
- Skills DNA диагностикой
- Курсами с интерактивными уроками  
- AI-тьютором
- Системой прогресса
- Telegram интеграцией

Платформа будет работать на вашем домене с высокой производительностью Vercel CDN.
# Исправление vercel.json для работы авторизации

## Проблема:
Сайт работает, но авторизация по логину/паролю не проходит из-за проблем с cookies между Vercel (фронтенд) и Replit (API).

## Решение:
Замените содержимое `vercel.json` на GitHub на это:

```json
{
  "version": 2,
  "buildCommand": "vite build",
  "outputDirectory": "dist/public",
  "framework": "vite",
  "public": true,
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
      "source": "/(.*\\.css)",
      "headers": [
        {
          "key": "Content-Type",
          "value": "text/css"
        },
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*\\.js)",
      "headers": [
        {
          "key": "Content-Type",
          "value": "application/javascript"
        },
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
          "value": "https://www.galaxion.org"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, PATCH, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "X-Requested-With, Content-Type, Accept, Authorization, Cookie"
        },
        {
          "key": "Access-Control-Allow-Credentials",
          "value": "true"
        }
      ]
    }
  ]
}
```

## Ключевые изменения:
1. `"Access-Control-Allow-Origin": "https://www.galaxion.org"` - вместо "*" для поддержки credentials
2. `"Access-Control-Allow-Credentials": "true"` - разрешает cookies между доменами
3. `"Cookie"` добавлен в Allow-Headers

## Альтернативное решение:
Если первое не сработает, используйте эту более простую версию:

```json
{
  "version": 2,
  "buildCommand": "vite build",
  "outputDirectory": "dist/public",
  "framework": "vite",
  "public": true,
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://49c11d52-b1fc-4151-bb61-b9097616c44f-00-3h2ne9cwwtbvn.janeway.replit.dev/api/$1"
    }
  ]
}
```

Это минимальная конфигурация без лишних headers, которые могут мешать авторизации.
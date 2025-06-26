# Исправление ошибок развертывания NovaAI University на Vercel

## Диагностированные проблемы

1. **Неправильный Content-Type для manifest.json**
   - Vercel обслуживает файл с неверным MIME-типом
   - Должен быть: `application/manifest+json`

2. **Конфликт CORS заголовков**
   - HTML использует crossorigin атрибуты
   - Vercel не настроен для PWA манифестов

3. **Неоптимальная структура маршрутов**
   - Статические ресурсы могут конфликтовать с API

## Немедленные исправления

### Шаг 1: Обновите vercel.json
Замените содержимое файла `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/public/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "^/manifest\\.json$",
      "headers": {
        "content-type": "application/manifest+json",
        "cache-control": "public, max-age=3600"
      },
      "dest": "/manifest.json"
    },
    {
      "src": "^/icons/(.*\\.png)$",
      "headers": {
        "content-type": "image/png",
        "cache-control": "public, max-age=31536000, immutable"
      },
      "dest": "/icons/$1"
    },
    {
      "src": "^/service-worker\\.js$",
      "headers": {
        "content-type": "application/javascript",
        "cache-control": "no-cache"
      },
      "dest": "/service-worker.js"
    },
    {
      "src": "^/assets/(.*)",
      "headers": {
        "cache-control": "public, max-age=31536000, immutable"
      },
      "dest": "/assets/$1"
    },
    {
      "src": "/api/(.*)",
      "dest": "https://49c11d52-b1fc-4151-bb61-b9097616c44f-00-3h2ne9cwwtbvn.janeway.replit.dev/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Шаг 2: Обновите структуру проекта
Добавьте файл `vercel.json` в корень проекта и убедитесь что:
- `dist/public/manifest.json` существует
- `dist/public/icons/` содержит все иконки
- `dist/public/service-worker.js` создан

### Шаг 3: Проверьте файлы манифеста

#### manifest.json должен содержать:
```json
{
  "name": "NovaAI University",
  "short_name": "NovaAI",
  "description": "AI-powered educational platform with adaptive learning",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#0A0E17",
  "theme_color": "#6E3AFF",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### Шаг 4: Пересоберите проект
```bash
npm run build
```

### Шаг 5: Повторно разверните на Vercel
```bash
vercel --prod
```

## Проверка после исправления

### 1. Проверьте manifest.json в браузере:
- Откройте: `https://ваш-домен.vercel.app/manifest.json`
- Content-Type должен быть: `application/manifest+json`
- Файл должен загружаться без ошибок CORS

### 2. Проверьте PWA в DevTools:
- F12 → Application → Manifest
- Должен отображаться без ошибок
- Иконки должны загружаться корректно

### 3. Проверьте консоль браузера:
- Не должно быть ошибок синтаксиса JSON
- Не должно быть ошибок CORS для manifest.json

## Альтернативное решение

Если проблемы продолжаются, используйте упрощенную конфигурацию:

### Создайте `public/_headers`:
```
/manifest.json
  Content-Type: application/manifest+json
  Cache-Control: public, max-age=3600

/icons/*
  Cache-Control: public, max-age=31536000, immutable

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

### Обновите vercel.json до минимальной версии:
```json
{
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://49c11d52-b1fc-4151-bb61-b9097616c44f-00-3h2ne9cwwtbvn.janeway.replit.dev/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

## Ожидаемый результат

После применения исправлений:
- ✅ manifest.json загружается без ошибок
- ✅ PWA манифест корректно обрабатывается браузером
- ✅ Иконки приложения отображаются правильно
- ✅ API запросы успешно проксируются на Replit
- ✅ Консоль браузера чистая от ошибок конфигурации

## Команды для быстрого развертывания

```bash
# 1. Сборка с исправлениями
npm run build

# 2. Развертывание
vercel --prod

# 3. Проверка
curl -I https://ваш-домен.vercel.app/manifest.json
```

Content-Type в ответе должен быть: `application/manifest+json`
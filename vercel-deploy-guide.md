# Инструкция по настройке деплоя на Vercel с подключением к API на Replit

## 1. Обновленная конфигурация Vercel

В файле `vercel.json` используем основной домен Replit для API запросов:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://nova-alpha-seven.replit.app/api/:path*"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Credentials", "value": "true" },
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,POST,PUT,DELETE,OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "X-Requested-With, Content-Type, Accept, Authorization" }
      ]
    }
  ]
}
```

## 2. Настройка Replit для публичного API

В проекте на Replit добавляем файл `simple-replit-server.js` и изменяем настройки деплоя:

1. Перейдите в настройки деплоя на Replit (вкладка Deployment)
2. В разделе Run Command введите: `node simple-replit-server.js`
3. Нажмите "Save changes" и выполните новый деплой

## 3. Проверка работоспособности

После деплоя проверьте API запросы. Следующий запрос должен вернуть 401, что будет означать, что API доступен:

```
curl -I https://nova-alpha-seven.replit.app/api/auth/me
```

## 4. Решение проблем

Если API запросы по-прежнему не работают, проверьте:

1. **Логи Replit** - убедитесь, что сервер запускается без ошибок
2. **Настройки CORS** - проверьте заголовки ответа на наличие CORS заголовков
3. **Брандмауэр** - убедитесь, что порты не блокируются

## 5. Альтернативный подход

В качестве альтернативы вы можете создать независимый API сервер на отдельном проекте Replit, который будет обрабатывать только API запросы, без фронтенда. Это может быть более надежным вариантом, если вам не удается решить проблему с текущей конфигурацией.
# Инструкции по развертыванию NovaAI University

## Проблема с API на Replit и решение

Мы обнаружили, что API запросы к Replit из Vercel не работают корректно. Ошибка "Not Found" возникает при обращении к `https://nova-alpha-seven.replit.app/api/`. Это связано с особенностями настройки Replit.

## Решение #1: Сервер API в Replit

1. Создан CommonJS скрипт `deploy-replit.cjs` для обработки запросов в Replit
2. Этот скрипт:
   - Проксирует API запросы на локальный сервер Node.js
   - Обслуживает статические файлы
   - Обрабатывает CORS заголовки
   - Детально логирует ошибки

### Настройка в Replit:

1. В вашем проекте на Replit перейдите в раздел "Deployment"
2. Нажмите на кнопку "Settings"
3. Измените команду запуска (Run Command) на:
   ```
   node deploy-replit.cjs
   ```
4. Сохраните изменения и выполните новый деплой

## Решение #2: Упрощенная конфигурация Vercel

1. Используйте обновленную конфигурацию `vercel.json`:

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

2. Данная конфигурация заменяет сложные правила маршрутизации на простые запросы к API

## Решение #3: Полностью независимое развертывание

Если предыдущие решения не работают, можно создать полностью независимое развертывание:

1. Создать отдельный проект Replit только для API (без фронтенда)
2. Установить порт 80 для API сервера
3. Настроить Vercel на работу с этим отдельным API сервером

## Проверка развертывания

После настройки деплоя выполните проверку:

```
curl -I https://nova-alpha-seven.replit.app/api/auth/me
```

Должен вернуться код 401 Unauthorized (это означает, что API доступен и работает, но требует аутентификации).

Если возвращается 404 Not Found, значит API сервер по-прежнему неправильно настроен.

## Дополнительные ресурсы

Созданы дополнительные файлы для решения проблемы:
- `deploy-replit.cjs` - CommonJS скрипт для прямого запуска в Replit
- `simple-replit-server.js` - упрощенная версия скрипта
- `vercel-deploy-guide.md` - дополнительные инструкции по настройке Vercel
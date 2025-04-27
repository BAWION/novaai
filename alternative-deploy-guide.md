# Руководство по альтернативному деплою NovaAI University

## Проблемы с деплоем на Replit

При попытке развернуть NovaAI University на Replit, мы столкнулись с проблемой: сайт отображает HTML-код вместо рендеринга страницы. Это происходит из-за конфликтов в настройке Content-Type заголовков и конфигурации SPA-приложения.

## Решение: гибридный деплой

Оптимальным решением будет **гибридный деплой**:
1. API на Replit
2. Фронтенд на Vercel/Netlify

### Преимущества данного подхода:

- Vercel и Netlify специализируются на деплое статических SPA-приложений
- Конфигурация routing для SPA (React/Vue/Angular) настроена "из коробки"
- Автоматическая поддержка HTTPS и CDN для быстрой загрузки
- Настройка API-прокси без сложных конфигураций

## Пошаговая инструкция по деплою:

### Шаг 1: Деплой фронтенда на Vercel

1. Зарегистрируйтесь на [Vercel](https://vercel.com)
2. Создайте новый проект через интерфейс Vercel
3. Загрузите содержимое папки `dist/vercel-deploy` через "drag and drop"

Или через CLI:
```bash
cd dist/vercel-deploy
npx vercel
```

### Шаг 2: Настройка API на Replit

1. Убедитесь, что API-сервер на Replit работает и доступен по https://novacademy.replit.app/api
2. Проверьте работоспособность API с помощью curl:
```bash
curl https://novacademy.replit.app/api/status
```

### Шаг 3: Проверка работы приложения

1. Откройте ваш новый домен, предоставленный Vercel (например, novaaiuniversity.vercel.app)
2. Убедитесь, что интерфейс работает корректно
3. Проверьте, что API-запросы успешно выполняются

## Настройка собственного домена

После успешного деплоя вы можете настроить собственный домен (например, novaaiuniversity.ru) через интерфейс Vercel.

## Обновление приложения

Для обновления приложения:
1. Соберите новую версию: `npm run build`
2. Скопируйте файлы в папку vercel-deploy
3. Загрузите папку снова или используйте Vercel Git integration для автоматического деплоя

## Дополнительные ресурсы

- [Документация Vercel](https://vercel.com/docs)
- [Настройка API routes на Vercel](https://vercel.com/docs/concepts/functions/serverless-functions)
- [Настройка редиректов на Netlify](https://docs.netlify.com/routing/redirects/)

## Проблемы, требующие внимания

Если API-запросы не проходят из-за CORS, добавьте в свой API на Replit следующие заголовки:

```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Или укажите конкретный домен
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});
```
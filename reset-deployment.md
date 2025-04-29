# Сброс деплоя на Vercel

Теперь мы понимаем полную картину проблемы:

1. Vercel ожидает определенную структуру сборки, которая не совпадает с тем, что мы предоставляем
2. При попытке загрузить модули через прямые пути, сервер отдает HTML вместо JavaScript
3. Каждая новая попытка исправления увеличивает сложность ситуации

## Полный сброс деплоя

Наиболее надежное решение на данном этапе - **полный сброс деплоя**:

1. **Удалите текущий проект из Vercel**:
   - Зайдите в Dashboard Vercel
   - Найдите проект nova-alpha-seven
   - Зайдите в Settings → Advanced → Delete

2. **Пересоздайте проект**:
   - На Vercel нажмите "Add New..." → "Project"
   - Подключите заново GitHub репозиторий
   - Важно: в настройках деплоя выберите фреймворк "Vite"
   - Укажите директорию "client" как корневую
   - В переменных окружения укажите API_URL, указывающий на ваш Replit

3. **Примените минимальную конфигурацию**:
   - Создайте в директории `client` файл `vercel.json`:
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

Такой подход позволит Vercel правильно собрать приложение с нуля, используя стандартные процессы сборки Vite, что должно решить проблемы с путями к файлам и модулям.
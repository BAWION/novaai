# Ручное развертывание NovaAI University на Vercel

## Проблема
Vercel CLI в Replit требует авторизации, которая не сохраняется между сессиями.

## Решение: Развертывание через веб-интерфейс Vercel

### Шаг 1: Подготовка файлов
Убедитесь что собранные файлы готовы в `dist/public`:
```
dist/public/
├── index.html
├── assets/
│   ├── index-ChRyQbe6.js
│   └── index-CjBIAhSX.css
├── manifest.json
├── icons/
└── service-worker.js
```

### Шаг 2: Подключение через GitHub (рекомендуется)

1. **Создайте GitHub репозиторий** для проекта
2. **Загрузите файлы** из `dist/public` в репозиторий
3. **Добавьте vercel.json** в корень репозитория

### Шаг 3: Настройка в веб-панели Vercel

1. Откройте https://vercel.com/dashboard
2. Нажмите **"New Project"**
3. Подключите GitHub репозиторий
4. В настройках проекта:
   - **Framework Preset**: Other
   - **Root Directory**: `.` (если файлы в корне) или путь к папке
   - **Output Directory**: оставить пустым (Vercel найдет index.html)
   - **Install Command**: `npm install` (если есть package.json)
   - **Build Command**: оставить пустым (файлы уже собраны)

### Шаг 4: Переменные окружения
В Settings → Environment Variables добавьте:
```
NODE_ENV = production
```

### Шаг 5: Проверка vercel.json
Убедитесь что файл содержит минимальную конфигурацию:
```json
{
  "version": 2,
  "outputDirectory": "dist/public",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://49c11d52-b1fc-4151-bb61-b9097616c44f-00-3h2ne9cwwtbvn.janeway.replit.dev/api/$1"
    }
  ]
}
```

## Альтернатива: Перетаскивание файлов

### Если GitHub недоступен:
1. Создайте ZIP архив папки `dist/public`
2. Откройте https://vercel.com/new
3. Выберите **"Deploy with drag & drop"**
4. Перетащите ZIP файл в область загрузки
5. Vercel автоматически развернет статические файлы

## Проверка после развертывания

### 1. Проверьте JavaScript файлы:
```
curl -I https://ваш-проект.vercel.app/assets/index-ChRyQbe6.js
```
Content-Type должен быть: `application/javascript`

### 2. Проверьте manifest.json:
```
curl -I https://ваш-проект.vercel.app/manifest.json
```
Content-Type должен быть: `application/json` или `application/manifest+json`

### 3. Проверьте API проксирование:
```
curl https://ваш-проект.vercel.app/api/courses
```
Должен вернуть данные с Replit сервера

## Настройка собственного домена

1. В панели Vercel: Settings → Domains
2. Добавьте ваш домен
3. Настройте DNS записи у регистратора:
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```

## Ожидаемый результат

После правильного развертывания:
- ✅ Исчезнут ошибки `Unexpected token '<'`
- ✅ Manifest.json будет работать без ошибок
- ✅ Приложение полностью функционально
- ✅ API запросы проксируются на Replit

Этот подход обходит проблемы с Vercel CLI и обеспечивает надежное развертывание через веб-интерфейс.
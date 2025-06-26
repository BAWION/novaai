# Пошаговые инструкции развертывания NovaAI University

## Шаг 1: Загрузка файлов в GitHub

У вас есть репозиторий: **https://github.com/BAWION/novacademy**

### Вариант 1: Через веб-интерфейс GitHub
1. Откройте ваш репозиторий на GitHub
2. Скачайте файл `github-upload.zip` из этого проекта
3. Распакуйте архив на компьютере
4. На GitHub нажмите **"uploading an existing file"**
5. Перетащите все файлы из распакованной папки
6. Напишите сообщение коммита: "Deploy NovaAI University frontend"
7. Нажмите **"Commit changes"**

### Вариант 2: Через Git команды
```bash
# Клонируйте репозиторий
git clone https://github.com/BAWION/novacademy.git
cd novacademy

# Скопируйте файлы (содержимое github-deploy папки)
# Затем:
git add .
git commit -m "Deploy NovaAI University frontend"
git push origin main
```

## Шаг 2: Подключение к Vercel

1. Откройте **https://vercel.com/dashboard**
2. Нажмите **"New Project"**
3. Найдите репозиторий **BAWION/novacademy**
4. Нажмите **"Import"**

## Шаг 3: Настройка проекта в Vercel

В настройках развертывания:
- **Framework Preset**: Other
- **Root Directory**: `.` (точка)
- **Build Command**: оставить пустым
- **Output Directory**: оставить пустым  
- **Install Command**: оставить пустым

Нажмите **"Deploy"**

## Шаг 4: Проверка развертывания

После развертывания:
1. Откройте URL от Vercel (например: `https://novacademy.vercel.app`)
2. Проверьте что страница загружается
3. Откройте консоль браузера (F12) - не должно быть ошибок
4. Протестируйте переход в раздел "Курсы"

## Шаг 5: Настройка домена (опционально)

1. В Vercel: **Settings** → **Domains**
2. **Add Domain** → введите ваш домен
3. В настройках DNS у регистратора:
   ```
   Type: CNAME
   Name: @ (или www)
   Value: cname.vercel-dns.com
   ```

## Важные файлы в репозитории

- `index.html` - главная страница
- `vercel.json` - конфигурация с API проксированием на Replit
- `assets/` - JavaScript и CSS файлы
- `manifest.json` - PWA конфигурация
- `_redirects` - fallback маршрутизация

## Архитектура

- **Фронтенд**: Статические файлы на Vercel (глобальная CDN)
- **API**: Работает на Replit через проксирование
- **База данных**: PostgreSQL на Replit

Все API запросы автоматически перенаправляются с Vercel на Replit сервер.

## Что делать, если что-то не работает

1. Проверьте что все файлы загружены в GitHub
2. Убедитесь что `vercel.json` присутствует в корне
3. В консоли браузера не должно быть ошибок типа "Unexpected token '<'"
4. API запросы должны успешно проходить на бэкенд Replit
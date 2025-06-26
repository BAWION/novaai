# Быстрая загрузка в GitHub

## Шаг 1: Скачайте архив
Скачайте файл `github-upload.zip` из этого проекта

## Шаг 2: Откройте ваш репозиторий
Перейдите на: https://github.com/BAWION/novacademy

## Шаг 3: Загрузите файлы
1. Нажмите **"uploading an existing file"** (если репозиторий пустой)
   ИЛИ
   Нажмите **"Add file"** → **"Upload files"** (если есть файлы)

2. Распакуйте `github-upload.zip` на компьютере

3. Перетащите ВСЕ файлы из распакованной папки в окно GitHub:
   ```
   ✓ index.html
   ✓ vercel.json  
   ✓ manifest.json
   ✓ service-worker.js
   ✓ README.md
   ✓ _redirects
   ✓ папка assets/ (с JS и CSS)
   ✓ папка icons/ (с иконками)
   ```

4. Напишите сообщение: "Deploy NovaAI University"

5. Нажмите **"Commit changes"**

## Шаг 4: Подключите к Vercel
1. Откройте https://vercel.com/dashboard
2. **New Project** → Import Git Repository
3. Найдите **BAWION/novacademy** → **Import**
4. Настройки:
   - Framework: **Other**
   - Остальные поля: пустые
5. **Deploy**

## Результат
Получите рабочий URL вида: `https://novacademy.vercel.app`

Все API запросы автоматически проксируются на Replit сервер через `vercel.json`.
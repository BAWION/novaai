# Принудительное обновление Vercel до коммита 0f99fbe

## Проблема
Vercel использует устаревший коммит 26d1b5a вместо актуального 0f99fbe с исправленным сервис-воркером.

## Решение 1: Через Vercel Dashboard
1. Зайдите в vercel.com → novaai-academy
2. Settings → Functions → Clear Build Cache → Clear
3. Deployments → последний деплой → "..." → Redeploy
4. ОБЯЗАТЕЛЬНО снимите галочку "Use existing Build Cache"
5. Нажмите Redeploy

## Решение 2: Пустой коммит GitHub
Создайте новый коммит для принудительного обновления:

```bash
git commit --allow-empty -m "Force Vercel rebuild to latest commit 0f99fbe"
git push origin main
```

## Решение 3: Обновление файла
Измените любой файл (например, добавьте комментарий в README.md) и сделайте коммит.

## Ожидаемый результат
После любого из решений Vercel подтянет коммит 0f99fbe с исправленным service-worker-simple.js и устранит ошибки chrome-extension в консоли.

## Проверка
После деплоя откройте https://novaai-academy.vercel.app и проверьте консоль браузера - ошибки сервис-воркера должны исчезнуть.
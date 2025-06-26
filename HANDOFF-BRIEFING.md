# Техническая передача: NovaAI University Production Deploy

## КРИТИЧЕСКАЯ ИНФОРМАЦИЯ
**Статус**: Платформа полностью готова к продакшн развертыванию
**Блокер**: Требуется ручная загрузка файлов в GitHub (Git ограничен в Replit)
**Цель**: Развернуть на собственном домене через Vercel

## АРХИТЕКТУРА РЕШЕНИЯ
```
[Пользователь] → [Vercel CDN] → [Static Files]
                      ↓
               [API Proxy] → [Replit Server] → [PostgreSQL]
```

**Обоснование гибридной модели**:
- Vercel Serverless: 10 сек лимит vs ИИ API: 30+ сек
- Нужна глобальная CDN для скорости загрузки
- PostgreSQL требует постоянного подключения

## ГОТОВЫЕ КОМПОНЕНТЫ

### 1. Рабочая платформа
- URL: https://49c11d52-b1fc-4151-bb61-b9097616c44f-00-3h2ne9cwwtbvn.janeway.replit.dev
- Функции: Skills DNA, 9 курсов, ИИ-тьютор, прогресс
- База: PostgreSQL с полными данными

### 2. Собранные файлы
- `github-upload.zip` (870KB) - готов к загрузке
- `vercel.json` - API проксирование настроено
- `dist/public/` - оптимизированная статика

### 3. Конфигурация
```json
// vercel.json - ключевой файл
{
  "version": 2,
  "rewrites": [{
    "source": "/api/(.*)",
    "destination": "https://49c11d52-b1fc-4151-bb61-b9097616c44f-00-3h2ne9cwwtbvn.janeway.replit.dev/api/$1"
  }]
}
```

## РЕШЕННЫЕ ПРОБЛЕМЫ
✅ JavaScript загрузка (было: HTML вместо JS)
✅ CORS настройка для кросс-доменных запросов  
✅ PWA манифест синтаксис
✅ Маршрутизация конфликты
✅ API проксирование конфигурация

## НЕМЕДЛЕННЫЕ ДЕЙСТВИЯ

### Шаг 1: GitHub Upload
```bash
# Целевой репозиторий
https://github.com/BAWION/novacademy

# Файлы для загрузки (из github-upload.zip):
- index.html
- vercel.json (КРИТИЧЕСКИ ВАЖЕН)
- assets/ (JS/CSS)
- manifest.json
- service-worker.js
- _redirects
- README.md
```

### Шаг 2: Vercel Deploy
```bash
# Настройки проекта:
Framework: Other
Build Command: (пустое)
Output Directory: (пустое)
Install Command: (пустое)
```

### Шаг 3: Validation
- Проверить отсутствие ошибки "Unexpected token '<'"
- Тестировать /api/courses (должен вернуть JSON)
- Проверить Skills DNA диагностику

## ФАЙЛОВАЯ СТРУКТУРА
```
novacademy/
├── index.html          # Entry point
├── vercel.json         # API proxy config
├── manifest.json       # PWA config
├── service-worker.js   # PWA worker
├── _redirects          # Fallback routing
├── assets/
│   ├── index-ChRyQbe6.js   # Main bundle
│   └── index-CjBIAhSX.css  # Styles
└── icons/
    ├── icon-192x192.png
    └── icon-512x512.png
```

## ОЖИДАЕМЫЙ URL
После развертывания: `https://novacademy.vercel.app`

## FALLBACK ПЛАН
Если Vercel не работает: готов Replit Deploy в `replit-deploy.js`

## КОНТАКТЫ
- Репозиторий: BAWION/novacademy
- Replit Server: работает и стабилен
- Документация: DEPLOY-NOW.md, AI-AGENT-CONTEXT.md

**Статус готовности: 100% - требуется только выполнение**
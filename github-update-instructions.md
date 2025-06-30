=== ИНСТРУКЦИИ ДЛЯ ОБНОВЛЕНИЯ GitHub РЕПОЗИТОРИЯ git@github.com:BAWION/novaai.git ===

## 📁 СТРУКТУРА ОБНОВЛЕНИЯ:

### 🔄 ЗАМЕНИТЬ существующие файлы:

**Конфигурационные файлы (корень репозитория):**
- package.json
- package-lock.json
- tailwind.config.ts
- vite.config.ts
- vercel.json
- index.html
- replit.md
- README.md

**Основные компоненты Galaxy Map (ГЛАВНЫЕ ИЗМЕНЕНИЯ):**
- client/src/components/galaxy-map/galaxy-universe-new.tsx (индивидуальные углы рамок)
- client/src/components/galaxy-map/galaxy-universe.tsx
- client/src/components/galaxy-map/enhanced-galaxy-universe.tsx

**Telegram авторизация:**
- client/src/components/auth/telegram-login.tsx
- server/routes/telegram-auth.ts

**Навигация и лейаут:**
- client/src/components/layout/navbar.tsx (логотип Galaxion)
- client/src/components/layout/dashboard-layout.tsx
- client/src/pages/dashboard.tsx (интеграция Galaxy Map)

### ➕ ДОБАВИТЬ новые файлы/папки:

**Если отсутствуют полностью:**
- server/ (вся папка с бэкенд логикой)
- shared/ (общие типы и схемы)
- client/assets/ (изображения)

## 🎯 КОНКРЕТНЫЕ ФАЙЛЫ ДЛЯ ОБНОВЛЕНИЯ РЕПОЗИТОРИЯ git@github.com:BAWION/novaai.git

### 🔴 КРИТИЧЕСКИ ВАЖНЫЕ файлы (обязательно заменить):

1. **client/src/components/galaxy-map/galaxy-universe-new.tsx**
   - Содержит индивидуальные углы рамок галактик (последнее обновление)
   - Робототехника: 180°, ИИ Этика: 180°, Computer Vision: 190°

2. **client/src/pages/dashboard.tsx**
   - Интеграция Galaxy Map в дашборд

3. **client/src/components/layout/navbar.tsx**
   - Обновленный логотип Galaxion (увеличен до 2xl)

4. **client/src/components/auth/telegram-login.tsx**
   - Telegram авторизация @Galaxion_Auth_bot

5. **vercel.json**
   - Настройки деплоя с проксированием на Replit API

6. **tailwind.config.ts**
   - Исправленные пути сканирования для стилей

7. **replit.md**
   - Обновленная документация с changelog

### 🟡 ВАЖНЫЕ файлы (рекомендуется заменить):

- client/src/components/galaxy-map/galaxy-universe.tsx
- client/src/components/galaxy-map/enhanced-galaxy-universe.tsx
- server/routes/telegram-auth.ts
- package.json (зависимости)
- index.html (мета-теги)

### 🟢 ДОПОЛНИТЕЛЬНЫЕ файлы (при необходимости):

- Все остальные файлы из архива для полной синхронизации
- client/assets/ (изображения)
- server/ и shared/ (если отсутствуют)

### 📋 COMMIT MESSAGE:
```
feat: Galaxion platform - индивидуальные рамки галактик и финальные обновления

🌌 Galaxy Map обновления:
- Индивидуальные углы рамок галактик (180°, 190°, -2°, +1°)
- Оптимизированная навигация и зум-контроль
- Живые вращающиеся галактики с фиксированными надписями

🔧 Технические улучшения:
- Telegram авторизация @Galaxion_Auth_bot
- Исправлены стили Tailwind и конфигурация Vercel
- Обновлен брендинг NovaAI → Galaxion

✅ Готово к продакшн деплою на https://www.galaxion.org/
```

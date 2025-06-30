# GitHub Upload Package - Galaxion Platform

## Что НЕ включено (и правильно):
- ❌ migrations/ - SQL миграции базы данных (не нужны для фронтенд деплоя)
- ❌ .env - секретные ключи
- ❌ node_modules/ - зависимости устанавливаются автоматически
- ❌ dist/ - собирается автоматически при деплое

## Включено (необходимое для GitHub):
✅ client/ - React фронтенд с компонентами
✅ server/ - Node.js бэкенд (для типов и схем)
✅ shared/ - общие типы и схемы
✅ public/ - статические файлы
✅ конфигурационные файлы (.json, .ts)

## Commit message:
```
feat: Galaxion platform - полная миграция с индивидуальными рамками галактик

- NovaAI University → Galaxion переименование
- Telegram авторизация @Galaxion_Auth_bot
- Galaxy Map с immersive опытом
- Индивидуальные углы рамок галактик
- Продакшн деплой настройки
```

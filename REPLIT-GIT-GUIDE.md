# Galaxion - Руководство по Git отправке через Replit

## Быстрая отправка изменений в GitHub

### Шаг 1: Откройте Git панель
- В левой панели Replit нажмите на иконку "Source Control" (выглядит как ветка)
- Или используйте горячие клавиши: Ctrl+Shift+G (Windows/Linux) или Cmd+Shift+G (Mac)

### Шаг 2: Проверьте файлы для коммита
Убедитесь что отмечены эти файлы:
- client/src/pages/home-page.tsx
- client/src/components/layout/navbar.tsx
- client/src/components/main-layout.tsx
- client/src/pages/onboarding-intro.tsx
- client/src/pages/presentation-selector.tsx
- client/index.html
- index.html
- public/manifest.json
- replit.md

### Шаг 3: Добавьте сообщение коммита
Скопируйте и вставьте в поле "Commit message":

```
feat: завершено переименование на Galaxion и улучшен UX

🎯 Основные изменения:
- Полное переименование с "NovaAI University" на "Galaxion"
- NovaAI теперь ИИ-ассистент внутри платформы
- Улучшен логотип в навигации (увеличен размер, убрана лишняя иконка)
- Обновлены все метаданные и PWA манифест
- Интеграция нового брендинга во всех интерфейсах

🚀 Результат: https://www.galaxion.org/
```

### Шаг 4: Отправьте изменения
- Нажмите кнопку "Commit & Push"
- Дождитесь подтверждения отправки

### Шаг 5: Проверьте автоматическое развертывание
- Откройте https://www.galaxion.org/
- Обновления появятся через 1-2 минуты
- Проверьте что логотип изменился на "Galaxion"

### Репозиторий
GitHub: https://github.com/BAWION/novaai.git
Vercel: Автоматическое развертывание настроено

### Поддержка
Если возникли проблемы с Git в Replit, используйте альтернативный метод загрузки файлов вручную.

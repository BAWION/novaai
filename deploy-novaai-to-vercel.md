# Развертывание NovaAI University на Vercel - Конкретная инструкция

## Предварительные требования

У вас уже есть:
- ✅ Работающий проект на Replit
- ✅ Настроенный `vercel.json` с проксированием API
- ✅ База данных PostgreSQL
- ✅ API ключи OpenAI и Anthropic

## Шаг 1: Подготовка проекта (2 минуты)

### Соберите фронтенд
```bash
npm run build
```

Должна появиться папка `dist` с файлами:
- `index.html`
- `assets/` (CSS, JS файлы)
- `manifest.json`
- `icons/`

## Шаг 2: Установка Vercel CLI (1 минута)

```bash
npm install -g vercel
```

Проверьте установку:
```bash
vercel --version
```

## Шаг 3: Авторизация в Vercel (1 минута)

```bash
vercel login
```

Выберите способ входа (рекомендую GitHub).

## Шаг 4: Первое развертывание (3 минуты)

```bash
vercel
```

Ответьте на вопросы:
- **"Set up and deploy?"** → `Y`
- **"Which scope?"** → Выберите ваш аккаунт
- **"Link to existing project?"** → `N`
- **"What's your project's name?"** → `novaai-university`
- **"In which directory is your code located?"** → `.`

Vercel автоматически:
- Обнаружит тип проекта (Static Site)
- Использует настройки из `vercel.json`
- Создаст тестовый URL

## Шаг 5: Настройка переменных окружения (5 минут)

### В веб-панели Vercel:
1. Откройте https://vercel.com/dashboard
2. Найдите проект `novaai-university`
3. Перейдите в **Settings** → **Environment Variables**

### Добавьте переменные:
```
NODE_ENV = production
OPENAI_API_KEY = [ваш ключ OpenAI]
ANTHROPIC_API_KEY = [ваш ключ Anthropic]
DATABASE_URL = [URL вашей PostgreSQL базы на Replit]
```

### Для Development, Preview и Production:
Отметьте все три среды для каждой переменной.

## Шаг 6: Проверка настроек API (важно!)

### Убедитесь что в `vercel.json` правильный URL Replit:
Файл должен содержать:
```json
{
  "src": "/api/(.*)",
  "dest": "https://49c11d52-b1fc-4151-bb61-b9097616c44f-00-3h2ne9cwwtbvn.janeway.replit.dev/api/$1"
}
```

### Проверьте что Replit сервер запущен:
```bash
curl https://49c11d52-b1fc-4151-bb61-b9097616c44f-00-3h2ne9cwwtbvn.janeway.replit.dev/api/courses
```

## Шаг 7: Продакшн развертывание (2 минуты)

```bash
vercel --prod
```

Получите URL вида: `https://novaai-university.vercel.app`

## Шаг 8: Тестирование базовых функций (5 минут)

### Проверьте основные страницы:
- `ваш-домен.vercel.app` - главная страница
- `ваш-домен.vercel.app/courses` - каталог курсов
- `ваш-домен.vercel.app/onboarding-intro` - начало Skills DNA

### Проверьте API эндпоинты:
- `ваш-домен.vercel.app/api/courses` - список курсов
- `ваш-домен.vercel.app/api/auth/me` - статус аутентификации

## Шаг 9: Настройка собственного домена (10 минут)

### В панели Vercel:
1. **Settings** → **Domains**
2. Нажмите **Add Domain**
3. Введите ваш домен: `novaai-university.com`

### У вашего регистратора домена:
Добавьте DNS записи:

**Вариант A (рекомендуется):**
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Вариант B (если CNAME для @ не поддерживается):**
```
Type: A
Name: @
Value: 76.76.19.61

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## Шаг 10: Настройка CORS для продакшн домена (важно!)

### Обновите настройки CORS на Replit сервере:
В файле `server/index.ts` должны быть настроены разрешенные домены:

```javascript
const allowedOrigins = [
  'https://novaai-university.vercel.app',
  'https://your-domain.com',
  'https://www.your-domain.com'
];
```

## Шаг 11: Финальная проверка (10 минут)

### Тестируйте критические функции:
1. **Главная страница** - загружается, показывает 6 ключевых функций
2. **Регистрация** - создание нового аккаунта
3. **Skills DNA диагностика** - прохождение тестирования
4. **Каталог курсов** - просмотр библиотеки курсов
5. **Авторизация** - вход в систему

### Проверьте в браузере (F12):
- Нет ошибок в Console
- API запросы успешно проходят (Network tab)
- Данные загружаются корректно

## Автоматизация обновлений

### Подключите GitHub для auto-deploy:
1. В настройках Vercel: **Git** → **Connect Git Repository**
2. Выберите ваш GitHub репозиторий
3. Каждый push в main ветку будет автоматически деплоить изменения

## Мониторинг и управление

### Полезные команды:
```bash
# Список развертываний
vercel ls

# Логи последнего развертывания
vercel logs

# Информация о проекте
vercel inspect

# Удаление старых развертываний
vercel rm deployment-url
```

### В панели Vercel доступно:
- Analytics - статистика посещений
- Functions - логи серверных функций
- Speed Insights - метрики производительности

## Возможные проблемы и решения

### API не работает:
- Проверьте что Replit сервер запущен
- Убедитесь что URL в `vercel.json` актуальный
- Проверьте переменные окружения

### Домен не активируется:
- DNS изменения могут занять до 48 часов
- Попробуйте команду: `nslookup your-domain.com`

### SSL не работает:
- Подождите 15-30 минут после настройки DNS
- В настройках домена нажмите "Refresh"

## Результат

После завершения у вас будет:
- ✅ Фронтенд на Vercel с вашим доменом
- ✅ API на Replit (стабильно работает)
- ✅ Автоматический SSL сертификат
- ✅ CDN по всему миру
- ✅ Готовность к приему трафика

**Общее время:** 25-35 минут
**Стоимость:** Бесплатно (план Hobby Vercel)
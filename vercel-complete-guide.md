# Полное руководство: Vercel + Replit развертывание

## Что происходит при этом варианте:

### Архитектура:
- **Vercel**: Хостит только фронтенд (React приложение)
- **Replit**: API сервер остается здесь
- **Связь**: Все API запросы проксируются с Vercel на Replit

### Преимущества:
- Быстрый глобальный CDN для фронтенда
- Автоматический SSL сертификат
- Собственный домен
- Простая настройка
- Высокая производительность

---

## СПОСОБ 1: Через GitHub (АВТОМАТИЧЕСКИЙ) ⭐ РЕКОМЕНДУЕМЫЙ

### Подготовка GitHub репозитория:

#### Шаг 1: Создайте репозиторий на GitHub
```bash
# Инициализируйте Git (если еще не сделали)
git init
git add .
git commit -m "Initial NovaAI University commit"

# Создайте репозиторий на github.com и подключите
git remote add origin https://github.com/ваш-username/novaai-university.git
git branch -M main
git push -u origin main
```

#### Шаг 2: Подключите GitHub к Vercel
1. Откройте https://vercel.com/dashboard
2. Нажмите **New Project**
3. Выберите **Import Git Repository**
4. Найдите ваш репозиторий `novaai-university`
5. Нажмите **Import**

#### Шаг 3: Настройте Build Settings
Vercel автоматически определит настройки, но проверьте:
```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

#### Шаг 4: Добавьте Environment Variables
В настройках проекта → Environment Variables:
```
OPENAI_API_KEY = ваш_ключ
ANTHROPIC_API_KEY = ваш_ключ
NODE_ENV = production
```

#### Шаг 5: Deploy
Нажмите **Deploy** - Vercel автоматически соберет и развернет проект.

### Автоматические обновления:
- Каждый `git push` в main ветку = автоматический деплой
- Превью версии для каждого PR
- Rollback одним кликом

---

## СПОСОБ 2: Напрямую через Vercel CLI (БЫСТРЫЙ)

### Установка и настройка:

#### Шаг 1: Установите Vercel CLI
```bash
npm install -g vercel
```

#### Шаг 2: Авторизация
```bash
vercel login
```

#### Шаг 3: Соберите проект
```bash
npm run build
```

#### Шаг 4: Инициализация проекта
```bash
vercel
```

Vercel спросит:
- **"Set up and deploy?"** → `Y`
- **"Which scope?"** → Выберите свой аккаунт
- **"Link to existing project?"** → `N`
- **"What's your project's name?"** → `novaai-university`
- **"In which directory is your code located?"** → `.`

#### Шаг 5: Продакшн деплой
```bash
vercel --prod
```

### Быстрые команды для обновлений:
```bash
# Обновить продакшн
npm run build && vercel --prod

# Посмотреть все развертывания
vercel ls

# Откатиться к предыдущей версии
vercel rollback
```

---

## СПОСОБ 3: Drag & Drop через Web Interface

#### Шаг 1: Соберите проект локально
```bash
npm run build
```

#### Шаг 2: Создайте архив
Заархивируйте папку `dist` в `novaai-university.zip`

#### Шаг 3: Загрузите на Vercel
1. Откройте https://vercel.com/new
2. Перетащите архив в область загрузки
3. Дождитесь развертывания

---

## Настройка собственного домена

### После любого способа развертывания:

#### Шаг 1: В панели Vercel
1. Проект → Settings → Domains
2. Add Domain → введите `gulcheev.com`
3. Add Domain → введите `www.gulcheev.com`

#### Шаг 2: DNS настройки
У регистратора домена:
```
Type: A
Name: @
Value: 76.76.19.61

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### Шаг 3: Дождитесь активации SSL
Vercel автоматически создаст сертификат (5-30 минут).

---

## Проверка работы API проксирования

### Текущая настройка в vercel.json:
```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://49c11d52-b1fc-4151-bb61-b9097616c44f-00-3h2ne9cwwtbvn.janeway.replit.dev/api/$1"
    }
  ]
}
```

### Тестирование:
```bash
# После развертывания проверьте:
curl https://ваш-домен.com/api/courses
curl https://ваш-домен.com/api/auth/me
```

---

## Сравнение способов:

### GitHub (Автоматический):
**Плюсы:**
- Автоматические обновления при git push
- История изменений
- Превью версии для PR
- Rollback функция
- Командная работа

**Минусы:**
- Требует настройки GitHub
- Чуть дольше первоначальная настройка

### Vercel CLI (Прямой):
**Плюсы:**
- Быстрое развертывание
- Полный контроль
- Не требует GitHub

**Минусы:**
- Ручные обновления
- Нет автоматизации

### Drag & Drop:
**Плюсы:**
- Самый простой для начинающих
- Не требует CLI

**Минусы:**
- Только для разовых развертываний
- Нет автоматизации

---

## Рекомендуемый workflow:

### Для продакшн проекта:
1. **GitHub способ** - для автоматизации
2. Настройка домена gulcheev.com
3. Мониторинг через Vercel Analytics

### Для быстрого тестирования:
1. **CLI способ** - быстро и просто
2. Использование vercel URL

---

## Мониторинг и управление:

### В панели Vercel доступно:
- Логи развертывания
- Метрики производительности
- Analytics посетителей
- Настройки домена
- Environment Variables
- Функции Edge и Serverless

### Команды для управления:
```bash
# Логи последнего развертывания
vercel logs

# Список всех развертываний
vercel ls

# Информация о проекте
vercel inspect

# Удаление развертывания
vercel rm [deployment-url]
```

---

## Стоимость:

### Vercel Free Plan включает:
- 100GB трафика/месяц
- Неограниченные развертывания
- Автоматический SSL
- Глобальный CDN
- Custom домены

### Этого достаточно для:
- До 10,000 посетителей/месяц
- Стартапов и малого бизнеса
- Тестирования и прототипов

---

## Итоковый результат:

После развертывания у вас будет:
- ✅ Профессиональный сайт на gulcheev.com
- ✅ Автоматический SSL сертификат
- ✅ Глобальный CDN для быстрой загрузки
- ✅ API работает через проксирование на Replit
- ✅ Все функции NovaAI University доступны
- ✅ Поддержка до 500 одновременных пользователей
-- Создание курса "Telegram-боты на Replit без кода"
INSERT INTO courses (
  id, title, slug, description, difficulty, level, modules, estimated_duration, 
  tags, access, objectives, prerequisites, skills_gained, created_at, updated_at
)
VALUES (
  10,
  'Создание Telegram-ботов на Replit без кода',
  'telegram-bots-replit',
  'Простое введение в создание ботов с помощью шаблонов, визуальных инструментов и Replit. Телеграм-платформа популярна в СНГ, а боты — мощный инструмент без необходимости в коде.',
  1,
  'basic',
  5,
  180,
  '["telegram", "боты", "replit", "no-code", "автоматизация"]',
  'free',
  '["Создать своего первого Telegram-бота без программирования", "Настроить автоматические ответы и команды", "Интегрировать бота с внешними сервисами", "Развернуть бота на Replit с постоянной работой", "Монетизировать бота для бизнеса"]',
  '["Базовые навыки работы с компьютером", "Аккаунт в Telegram"]',
  '["Создание ботов", "Replit", "No-code разработка", "API интеграции", "Монетизация"]',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Модуль 1: Основы Telegram-ботов
INSERT INTO course_modules (id, course_id, title, description, order_index, created_at, updated_at)
VALUES (
  44,
  10,
  'Основы Telegram-ботов',
  'Что такое боты, зачем они нужны и как работают',
  1,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Урок 1.1: Введение в мир Telegram-ботов
INSERT INTO lessons (id, module_id, title, type, content, order_index, estimated_duration, created_at, updated_at)
VALUES (
  82,
  44,
  'Введение в мир Telegram-ботов',
  'theory',
  '# Введение в мир Telegram-ботов

## Что такое Telegram-бот?

Telegram-бот — это специальная программа, которая автоматически отвечает на сообщения пользователей в Telegram. Боты могут:

- **Отвечать на вопросы** — как умный помощник
- **Принимать заказы** — для интернет-магазинов
- **Отправлять уведомления** — о новостях, погоде, курсах валют
- **Развлекать** — игры, викторины, мемы
- **Автоматизировать бизнес** — запись на услуги, обратная связь

## Примеры успешных ботов

### Бизнес-боты
- **@DominosRobot** — заказ пиццы
- **@AlfaBankBot** — банковские услуги
- **@LabBot** — запись к врачу

### Развлекательные боты
- **@GameBot** — игры
- **@PollBot** — опросы и голосования

## Почему боты популярны в СНГ?

1. **Telegram очень популярен** — более 50% населения использует мессенджер
2. **Простота использования** — не нужно скачивать отдельные приложения
3. **Доверие пользователей** — люди привыкли общаться в мессенджерах
4. **Быстрота** — мгновенные ответы и уведомления

## Что мы создадим в курсе?

К концу курса у вас будет:
- ✅ Работающий бот с меню и командами
- ✅ Интеграция с внешними сервисами
- ✅ Автоматические рассылки
- ✅ Система приема платежей (опционально)
- ✅ Аналитика и статистика

## Инструменты без программирования

Мы будем использовать:
- **BotFather** — создание бота в Telegram
- **Replit** — хостинг и запуск
- **Готовые шаблоны** — основа для бота
- **Визуальные конструкторы** — настройка логики

Начнем создавать вашего первого бота!',
  1,
  20,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  updated_at = NOW();

-- Урок 1.2: Регистрация бота через BotFather
INSERT INTO lessons (id, module_id, title, type, content, order_index, estimated_duration, created_at, updated_at)
VALUES (
  83,
  44,
  'Регистрация бота через BotFather',
  'practice',
  '# Регистрация бота через BotFather

## Знакомство с BotFather

BotFather — это официальный бот Telegram для создания других ботов. Это ваш главный инструмент для управления ботами.

## Пошаговая регистрация

### Шаг 1: Найдите BotFather
1. Откройте Telegram
2. В поиске введите **@BotFather**
3. Нажмите на официального бота (с галочкой)
4. Нажмите **START**

### Шаг 2: Создайте нового бота
Отправьте команду:
```
/newbot
```

BotFather спросит:
1. **Имя бота** — как будет называться ваш бот (например: "Мой Первый Бот")
2. **Username** — уникальное имя для поиска (должно заканчиваться на "bot")

### Шаг 3: Получите токен
После создания BotFather даст вам **токен** — это секретный ключ для управления ботом.

**Важно!** 
- Токен выглядит так: `1234567890:AAE_example_token_here`
- **НЕ ПОКАЗЫВАЙТЕ токен другим** — это пароль от вашего бота
- Сохраните токен в надежном месте

## Базовые команды BotFather

### Управление ботом:
- `/mybots` — список ваших ботов
- `/deletebot` — удалить бота
- `/token` — получить токен

### Настройка бота:
- `/setdescription` — описание бота
- `/setabouttext` — информация "О боте"
- `/setuserpic` — аватар бота
- `/setcommands` — список команд в меню

## Практическое задание

**Создайте своего первого бота:**

1. Напишите @BotFather команду `/newbot`
2. Придумайте имя: например "Мой Учебный Бот"
3. Создайте username: например "my_study_bot"
4. Сохраните полученный токен
5. Найдите своего бота в поиске Telegram

**Результат:** У вас есть зарегистрированный бот с токеном!

## Что дальше?

В следующем уроке мы подключим бота к Replit и научим его отвечать на сообщения. Ваш токен понадобится для настройки!

**Совет:** Попробуйте написать своему боту — пока он не отвечает, но скоро это изменится! 🤖',
  2,
  15,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  updated_at = NOW();

-- Модуль 2: Настройка на Replit
INSERT INTO course_modules (id, course_id, title, description, order_index, created_at, updated_at)
VALUES (
  45,
  10,
  'Настройка на Replit',
  'Подключение бота к Replit и первый запуск',
  2,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Урок 2.1: Знакомство с Replit
INSERT INTO lessons (id, module_id, title, type, content, order_index, estimated_duration, created_at, updated_at)
VALUES (
  84,
  45,
  'Знакомство с Replit',
  'theory',
  '# Знакомство с Replit

## Что такое Replit?

Replit — это облачная платформа для разработки, где можно создавать и запускать программы прямо в браузере. Для ботов это идеально, потому что:

- ✅ **Работает 24/7** — бот не выключается
- ✅ **Не нужно устанавливать программы** — все в браузере
- ✅ **Бесплатный тариф** — достаточно для учебных проектов
- ✅ **Готовые шаблоны** — можно не писать код с нуля

## Регистрация в Replit

### Шаг 1: Создание аккаунта
1. Перейдите на **replit.com**
2. Нажмите **Sign up**
3. Зарегистрируйтесь через:
   - Email
   - Google аккаунт
   - GitHub (если есть)

### Шаг 2: Подтверждение
1. Подтвердите email, если регистрировались через почту
2. Выберите план **Starter** (бесплатный)

## Интерфейс Replit

### Основные разделы:
- **Create** — создание новых проектов
- **My Repls** — ваши проекты
- **Explore** — готовые шаблоны от сообщества
- **Learn** — обучающие материалы

### Рабочая область:
- **Файлы** (слева) — структура проекта
- **Редактор** (центр) — код программы
- **Консоль** (справа) — вывод программы
- **Run** (зеленая кнопка) — запуск программы

## Поиск шаблона для Telegram-бота

### Вариант 1: Готовый шаблон
1. Нажмите **Create**
2. Выберите **Templates**
3. В поиске введите "telegram bot"
4. Выберите шаблон на **Python** или **Node.js**

### Вариант 2: Импорт из GitHub
1. Нажмите **Create**
2. Выберите **Import from GitHub**
3. Вставьте ссылку на готовый проект

## Популярные шаблоны ботов

### Простые стартеры:
- **python-telegram-bot** — базовый бот на Python
- **node-telegram-bot** — бот на JavaScript
- **telegram-echo-bot** — бот-эхо для начинающих

### С дополнительными функциями:
- **telegram-shop-bot** — бот-магазин
- **telegram-quiz-bot** — бот-викторина
- **telegram-weather-bot** — погодный бот

## Структура проекта бота

Типичный проект содержит:
```
telegram-bot/
├── main.py (или index.js)     # Основной файл
├── requirements.txt (или package.json) # Зависимости
├── .env                       # Секретные данные
├── config.py                  # Настройки
└── handlers/                  # Обработчики команд
    ├── start.py
    ├── help.py
    └── commands.py
```

## Практическое задание

**Настройте рабочее пространство:**

1. Зарегистрируйтесь на replit.com
2. Создайте новый проект из шаблона "telegram bot"
3. Изучите файловую структуру
4. Найдите файл с настройками (обычно `.env` или `config.py`)

**Результат:** У вас есть готовое рабочее пространство для бота!

## Что дальше?

В следующем уроке мы подключим токен вашего бота и запустим его впервые. Приготовьте токен, который получили от BotFather!',
  1,
  25,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  updated_at = NOW();

-- Урок 2.2: Подключение токена и первый запуск
INSERT INTO lessons (id, module_id, title, type, content, order_index, estimated_duration, created_at, updated_at)
VALUES (
  85,
  45,
  'Подключение токена и первый запуск',
  'practice',
  '# Подключение токена и первый запуск

## Настройка токена в Replit

### Безопасное хранение токена
В Replit есть специальное место для секретных данных — **Secrets**. Это безопаснее, чем писать токен прямо в коде.

### Шаг 1: Добавление Secret
1. В вашем проекте найдите панель **Secrets** (иконка замка)
2. Нажмите **+ New Secret**
3. **Key:** введите `BOT_TOKEN`
4. **Value:** вставьте токен от BotFather
5. Нажмите **Add Secret**

### Шаг 2: Использование токена в коде
В файле с ботом (обычно `main.py` или `index.js`) найдите строку с токеном и замените на:

**Для Python:**
```python
import os
TOKEN = os.getenv(''BOT_TOKEN'')
```

**Для JavaScript:**
```javascript
const TOKEN = process.env.BOT_TOKEN;
```

## Первый запуск бота

### Установка зависимостей
1. Нажмите **Run** — Replit автоматически установит нужные библиотеки
2. Если возникают ошибки, проверьте файл `requirements.txt` или `package.json`

### Проверка соединения
В консоли должно появиться сообщение:
```
Bot started successfully!
Listening for messages...
```

### Тестирование бота
1. Найдите своего бота в Telegram
2. Отправьте команду `/start`
3. Бот должен ответить приветственным сообщением

## Базовая структура бота

### Минимальный код бота (Python):
```python
import os
from telegram import Update
from telegram.ext import Application, CommandHandler

TOKEN = os.getenv(''BOT_TOKEN'')

async def start(update: Update, context):
    await update.message.reply_text(''Привет! Я ваш первый бот!'')

def main():
    app = Application.builder().token(TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.run_polling()

if __name__ == ''__main__'':
    main()
```

### Минимальный код бота (JavaScript):
```javascript
const { Telegraf } = require(''telegraf'');
const TOKEN = process.env.BOT_TOKEN;

const bot = new Telegraf(TOKEN);

bot.start((ctx) => {
    ctx.reply(''Привет! Я ваш первый бот!'');
});

bot.launch();
console.log(''Бот запущен!'');
```

## Отладка частых проблем

### Проблема: "Invalid token"
**Решение:**
- Проверьте правильность токена
- Убедитесь, что токен добавлен в Secrets
- Перезапустите проект

### Проблема: "Module not found"
**Решение:**
- Проверьте `requirements.txt` или `package.json`
- Перезапустите проект для переустановки зависимостей

### Проблема: Бот не отвечает
**Решение:**
- Проверьте логи в консоли
- Убедитесь, что бот запущен
- Попробуйте команду `/start`

## Поддержание работы 24/7

### Always On в Replit
1. Откройте проект
2. Перейдите в настройки
3. Включите **Always On** (в платном тарифе)

### Альтернативы для бесплатного тарифа:
- **UptimeRobot** — внешний сервис для "пинга"
- **Cron Jobs** — периодический запуск
- **Webhook** вместо polling

## Практическое задание

**Запустите своего первого бота:**

1. Добавьте токен в Secrets
2. Проверьте код бота
3. Запустите проект
4. Протестируйте команду `/start`
5. Убедитесь, что бот отвечает

**Результат:** Работающий бот, который отвечает на команды!

## Что дальше?

В следующем модуле мы научим бота понимать больше команд, создадим меню и добавим интерактивные кнопки. Ваш бот станет намного умнее!',
  2,
  30,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  updated_at = NOW();

SELECT 'Курс "Создание Telegram-ботов на Replit без кода" успешно создан!' as result;
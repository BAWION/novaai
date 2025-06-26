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

-- Модуль 3: Создание команд и меню
INSERT INTO course_modules (id, course_id, title, description, order_index, created_at, updated_at)
VALUES (
  46,
  10,
  'Создание команд и меню',
  'Добавление команд, кнопок и интерактивного меню',
  3,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Урок 3.1: Основные команды бота
INSERT INTO lessons (id, module_id, title, type, content, order_index, estimated_duration, created_at, updated_at)
VALUES (
  86,
  46,
  'Основные команды бота',
  '# Основные команды бота

## Система команд в Telegram

Команды — это специальные сообщения, которые начинаются с символа `/`. Они позволяют пользователям быстро получить нужную информацию или выполнить действие.

### Стандартные команды:
- `/start` — запуск бота (обязательная)
- `/help` — справка по командам
- `/about` — информация о боте
- `/settings` — настройки

### Пользовательские команды:
- `/weather` — погода
- `/news` — новости
- `/order` — сделать заказ
- `/contact` — контакты

## Создание команды /help

### Код для Python:
```python
async def help_command(update: Update, context):
    help_text = """
🤖 Доступные команды:

/start - Запуск бота
/help - Справка по командам
/about - О боте
/contact - Наши контакты
/weather - Текущая погода

❓ Нужна помощь? Напишите нам!
    """
    await update.message.reply_text(help_text)

# Добавление обработчика
app.add_handler(CommandHandler("help", help_command))
```

### Код для JavaScript:
```javascript
bot.help((ctx) => {
    const helpText = `
🤖 Доступные команды:

/start - Запуск бота
/help - Справка по командам
/about - О боте
/contact - Наши контакты
/weather - Текущая погода

❓ Нужна помощь? Напишите нам!
    `;
    ctx.reply(helpText);
});
```

## Команда /about

```python
async def about_command(update: Update, context):
    about_text = """
ℹ️ О боте:

Я умный помощник, созданный для упрощения вашей жизни!

📅 Версия: 1.0
👨‍💻 Разработчик: Ваше имя
🚀 Создан на курсе NovaAI University

Мои возможности:
✅ Отвечаю на вопросы
✅ Помогаю с заказами
✅ Отправляю уведомления
✅ Развлекаю и информирую
    """
    await update.message.reply_text(about_text)

app.add_handler(CommandHandler("about", about_command))
```

## Команда с параметрами

### Погодная команда:
```python
async def weather_command(update: Update, context):
    # Получаем город из параметров команды
    if context.args:
        city = '' ''.join(context.args)
        weather_text = f"🌤 Погода в {city}:\\n\\n🌡 Температура: +22°C\\n💨 Ветер: 5 м/с\\n☁️ Облачно"
    else:
        weather_text = "📍 Укажите город: /weather Москва"
    
    await update.message.reply_text(weather_text)

app.add_handler(CommandHandler("weather", weather_command))
```

## Команда с вложениями

### Отправка картинки:
```python
async def logo_command(update: Update, context):
    # Отправляем картинку с подписью
    photo_url = "https://example.com/logo.png"
    caption = "📸 Логотип нашей компании"
    
    await update.message.reply_photo(
        photo=photo_url,
        caption=caption
    )

app.add_handler(CommandHandler("logo", logo_command))
```

## Обработка неизвестных команд

```python
async def unknown_command(update: Update, context):
    await update.message.reply_text(
        "❓ Неизвестная команда!\\n\\n"
        "Используйте /help для списка доступных команд."
    )

# Должен быть последним обработчиком
app.add_handler(MessageHandler(filters.COMMAND, unknown_command))
```

## Настройка меню команд в BotFather

### Шаг 1: Откройте BotFather
1. Найдите @BotFather в Telegram
2. Отправьте команду `/setcommands`
3. Выберите своего бота

### Шаг 2: Установите команды
Отправьте список команд в формате:
```
start - Запуск бота
help - Справка по командам
about - О боте
weather - Погода
contact - Контакты
```

### Результат:
У пользователей появится удобное меню с командами рядом с полем ввода!

## Практические советы

### Хорошие практики:
- ✅ Используйте эмодзи для красоты
- ✅ Делайте короткие, понятные описания
- ✅ Добавляйте подсказки в ответах
- ✅ Обрабатывайте ошибки пользователей

### Чего избегать:
- ❌ Слишком длинных сообщений
- ❌ Сложных команд без объяснений
- ❌ Команд без обработчиков

## Практическое задание

**Добавьте команды в своего бота:**

1. Создайте команду `/help` со списком возможностей
2. Добавьте команду `/about` с информацией о боте
3. Сделайте команду `/contact` с вашими контактами
4. Настройте меню команд через BotFather
5. Протестируйте все команды

**Результат:** Бот с полноценным набором команд и меню!

## Что дальше?

В следующем уроке мы добавим интерактивные кнопки, которые сделают общение с ботом еще удобнее. Пользователи смогут просто нажимать кнопки вместо ввода команд!',
  1,
  35,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  updated_at = NOW();

-- Урок 3.2: Интерактивные кнопки и клавиатуры
INSERT INTO lessons (id, module_id, title, type, content, order_index, estimated_duration, created_at, updated_at)
VALUES (
  87,
  46,
  'Интерактивные кнопки и клавиатуры',
  '# Интерактивные кнопки и клавиатуры

## Типы клавиатур в Telegram

### 1. Reply Keyboard (обычная клавиатура)
Кнопки появляются вместо стандартной клавиатуры пользователя. При нажатии отправляют текст.

### 2. Inline Keyboard (встроенная клавиатура)
Кнопки прикрепляются к конкретному сообщению. Могут выполнять действия без отправки сообщений.

## Создание обычной клавиатуры

### Python код:
```python
from telegram import ReplyKeyboardMarkup, KeyboardButton

async def start_with_keyboard(update: Update, context):
    # Создаем кнопки
    keyboard = [
        [KeyboardButton("📋 Меню"), KeyboardButton("ℹ️ О нас")],
        [KeyboardButton("📞 Контакты"), KeyboardButton("❓ Помощь")],
        [KeyboardButton("🌤 Погода")]
    ]
    
    # Создаем клавиатуру
    reply_markup = ReplyKeyboardMarkup(
        keyboard, 
        resize_keyboard=True,  # Подгоняет размер
        one_time_keyboard=False  # Не скрывать после нажатия
    )
    
    await update.message.reply_text(
        "Добро пожаловать! Выберите действие:",
        reply_markup=reply_markup
    )

app.add_handler(CommandHandler("start", start_with_keyboard))
```

### JavaScript код:
```javascript
const { Markup } = require(''telegraf'');

bot.start((ctx) => {
    const keyboard = Markup.keyboard([
        [''📋 Меню'', ''ℹ️ О нас''],
        [''📞 Контакты'', ''❓ Помощь''],
        [''🌤 Погода'']
    ]).resize();
    
    ctx.reply(''Добро пожаловать! Выберите действие:'', keyboard);
});
```

## Обработка нажатий кнопок

### Python код:
```python
from telegram import Update
from telegram.ext import MessageHandler, filters

async def handle_buttons(update: Update, context):
    text = update.message.text
    
    if text == "📋 Меню":
        await update.message.reply_text("🍽 Наше меню:\\n\\n🍕 Пицца - 500₽\\n🍔 Бургер - 300₽\\n🥗 Салат - 250₽")
    
    elif text == "ℹ️ О нас":
        await update.message.reply_text("🏢 Мы лучший ресторан в городе!\\n⭐ Работаем с 2020 года")
    
    elif text == "📞 Контакты":
        await update.message.reply_text("📱 Телефон: +7 (999) 123-45-67\\n📧 Email: info@restaurant.ru")
    
    elif text == "❓ Помощь":
        await update.message.reply_text("❓ Как я могу помочь?\\n\\n• Посмотреть меню\\n• Сделать заказ\\n• Узнать контакты")
    
    elif text == "🌤 Погода":
        await update.message.reply_text("🌤 Сегодня: +22°C, солнечно\\n☁️ Завтра: +18°C, облачно")

# Обработчик текстовых сообщений
app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_buttons))
```

## Встроенные кнопки (Inline)

### Создание inline кнопок:
```python
from telegram import InlineKeyboardButton, InlineKeyboardMarkup

async def show_inline_menu(update: Update, context):
    keyboard = [
        [InlineKeyboardButton("🛒 Заказать", callback_data=''order'')],
        [InlineKeyboardButton("📋 Каталог", callback_data=''catalog''),
         InlineKeyboardButton("💳 Оплата", callback_data=''payment'')],
        [InlineKeyboardButton("🔗 Наш сайт", url=''https://restaurant.ru'')]
    ]
    
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        "🏪 Добро пожаловать в наш магазин!",
        reply_markup=reply_markup
    )

app.add_handler(CommandHandler("shop", show_inline_menu))
```

### Обработка inline кнопок:
```python
from telegram.ext import CallbackQueryHandler

async def handle_inline_buttons(update: Update, context):
    query = update.callback_query
    await query.answer()  # Убирает "загрузку" на кнопке
    
    if query.data == ''order'':
        await query.edit_message_text(
            "🛒 Оформление заказа:\\n\\n1. Выберите товар\\n2. Укажите количество\\n3. Оплатите"
        )
    
    elif query.data == ''catalog'':
        keyboard = [
            [InlineKeyboardButton("🍕 Пицца", callback_data=''pizza'')],
            [InlineKeyboardButton("🍔 Бургеры", callback_data=''burgers'')],
            [InlineKeyboardButton("🥗 Салаты", callback_data=''salads'')],
            [InlineKeyboardButton("← Назад", callback_data=''back'')]
        ]
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await query.edit_message_text(
            "📋 Выберите категорию:",
            reply_markup=reply_markup
        )
    
    elif query.data == ''payment'':
        await query.edit_message_text(
            "💳 Способы оплаты:\\n\\n💰 Наличные\\n💳 Карта\\n📱 СБП\\n💼 Криптовалюта"
        )

app.add_handler(CallbackQueryHandler(handle_inline_buttons))
```

## Динамические клавиатуры

### Клавиатура на основе данных:
```python
# Список товаров
products = [
    {"name": "🍕 Маргарита", "price": 450},
    {"name": "🍕 Пепперони", "price": 520},
    {"name": "🍕 4 сыра", "price": 580}
]

async def show_products(update: Update, context):
    keyboard = []
    
    # Создаем кнопку для каждого товара
    for i, product in enumerate(products):
        button_text = f"{product[''name'']} - {product[''price'']}₽"
        keyboard.append([InlineKeyboardButton(button_text, callback_data=f''product_{i}'')])
    
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        "🛒 Выберите пиццу:",
        reply_markup=reply_markup
    )
```

## Полезные функции клавиатур

### Удаление клавиатуры:
```python
from telegram import ReplyKeyboardRemove

await update.message.reply_text(
    "Клавиатура удалена!",
    reply_markup=ReplyKeyboardRemove()
)
```

### Кнопка "Поделиться контактом":
```python
keyboard = [
    [KeyboardButton("📱 Поделиться номером", request_contact=True)],
    [KeyboardButton("📍 Поделиться локацией", request_location=True)]
]
```

### Кнопка с веб-приложением:
```python
from telegram import WebAppInfo

keyboard = [
    [InlineKeyboardButton("🌐 Открыть магазин", web_app=WebAppInfo("https://shop.ru"))]
]
```

## Практическое задание

**Создайте интерактивного бота:**

1. Добавьте стартовую клавиатуру с основными разделами
2. Создайте меню с inline кнопками
3. Добавьте обработку всех кнопок
4. Сделайте кнопку "Назад" для навигации
5. Протестируйте удобство использования

**Дополнительно:**
- Добавьте кнопку с внешней ссылкой
- Создайте кнопку для получения контакта
- Сделайте динамическое меню

**Результат:** Удобный бот с интерактивными кнопками!

## Что дальше?

В следующем модуле мы научимся подключать внешние сервисы и API к нашему боту. Он сможет получать реальные данные о погоде, новостях, курсах валют и многом другом!',
  2,
  40,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  updated_at = NOW();

-- Модуль 4: Интеграции и автоматизация
INSERT INTO course_modules (id, course_id, title, description, order_index, created_at, updated_at)
VALUES (
  47,
  10,
  'Интеграции и автоматизация',
  'Подключение внешних сервисов и API',
  4,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Урок 4.1: Подключение погодного API
INSERT INTO lessons (id, module_id, title, type, content, order_index, estimated_duration, created_at, updated_at)
VALUES (
  88,
  47,
  'Подключение погодного API',
  '# Подключение погодного API

## Выбор погодного сервиса

Для получения данных о погоде мы будем использовать бесплатные API. Рассмотрим лучшие варианты:

### 1. OpenWeatherMap
- ✅ Бесплатный тариф: 1000 запросов/день
- ✅ Простой API
- ✅ Поддержка русского языка
- 🌐 openweathermap.org

### 2. WeatherAPI
- ✅ Бесплатный тариф: 1000 запросов/день
- ✅ Подробные данные
- 🌐 weatherapi.com

## Регистрация в OpenWeatherMap

### Шаг 1: Создание аккаунта
1. Перейдите на openweathermap.org
2. Нажмите **Sign Up**
3. Заполните форму регистрации
4. Подтвердите email

### Шаг 2: Получение API ключа
1. Войдите в аккаунт
2. Перейдите в **API keys**
3. Скопируйте ключ (начинается с букв и цифр)
4. Сохраните в Replit Secrets как `WEATHER_API_KEY`

## Тестирование API

### Проверка работы API:
Откройте в браузере:
```
https://api.openweathermap.org/data/2.5/weather?q=Moscow&appid=YOUR_API_KEY&units=metric&lang=ru
```

Ответ должен содержать данные о погоде в JSON формате.

## Создание погодной функции

### Python код:
```python
import os
import requests
import json

WEATHER_API_KEY = os.getenv(''WEATHER_API_KEY'')

async def get_weather(city):
    """Получает данные о погоде для указанного города"""
    try:
        # URL для запроса
        url = f"https://api.openweathermap.org/data/2.5/weather"
        params = {
            ''q'': city,
            ''appid'': WEATHER_API_KEY,
            ''units'': ''metric'',  # Цельсий
            ''lang'': ''ru''        # Русский язык
        }
        
        # Делаем запрос
        response = requests.get(url, params=params)
        
        if response.status_code == 200:
            data = response.json()
            
            # Извлекаем нужные данные
            temp = data[''main''][''temp'']
            feels_like = data[''main''][''feels_like'']
            description = data[''weather''][0][''description'']
            humidity = data[''main''][''humidity'']
            wind_speed = data[''wind''][''speed'']
            
            # Форматируем ответ
            weather_text = f"""
🌤 Погода в {city}:

🌡 Температура: {temp}°C (ощущается как {feels_like}°C)
☁️ {description.title()}
💧 Влажность: {humidity}%
💨 Ветер: {wind_speed} м/с
            """
            
            return weather_text.strip()
            
        elif response.status_code == 404:
            return f"❌ Город ''{city}'' не найден. Проверьте название."
        else:
            return "❌ Ошибка получения данных о погоде."
            
    except Exception as e:
        return f"❌ Произошла ошибка: {str(e)}"

# Команда для получения погоды
async def weather_command(update: Update, context):
    if context.args:
        city = '' ''.join(context.args)
        weather_info = await get_weather(city)
        await update.message.reply_text(weather_info)
    else:
        await update.message.reply_text(
            "📍 Укажите город для получения погоды:\\n"
            "Пример: /weather Москва"
        )

app.add_handler(CommandHandler("weather", weather_command))
```

### JavaScript код:
```javascript
const axios = require(''axios'');

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

async function getWeather(city) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather`;
        const params = {
            q: city,
            appid: WEATHER_API_KEY,
            units: ''metric'',
            lang: ''ru''
        };
        
        const response = await axios.get(url, { params });
        const data = response.data;
        
        const temp = data.main.temp;
        const feelsLike = data.main.feels_like;
        const description = data.weather[0].description;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        
        return `🌤 Погода в ${city}:

🌡 Температура: ${temp}°C (ощущается как ${feelsLike}°C)
☁️ ${description}
💧 Влажность: ${humidity}%
💨 Ветер: ${windSpeed} м/с`;
        
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return `❌ Город ''${city}'' не найден. Проверьте название.`;
        }
        return `❌ Ошибка получения данных о погоде.`;
    }
}

bot.command(''weather'', async (ctx) => {
    const args = ctx.message.text.split('' '').slice(1);
    
    if (args.length > 0) {
        const city = args.join('' '');
        const weatherInfo = await getWeather(city);
        ctx.reply(weatherInfo);
    } else {
        ctx.reply(''📍 Укажите город для получения погоды:\\nПример: /weather Москва'');
    }
});
```

## Добавление кнопки погоды

### Интеграция в клавиатуру:
```python
# Обработка кнопки "🌤 Погода"
async def handle_weather_button(update: Update, context):
    # Создаем клавиатуру с популярными городами
    keyboard = [
        [KeyboardButton("🏙 Москва"), KeyboardButton("🏛 Санкт-Петербург")],
        [KeyboardButton("🌊 Сочи"), KeyboardButton("🏔 Екатеринбург")],
        [KeyboardButton("✍️ Ввести город"), KeyboardButton("← Назад")]
    ]
    
    reply_markup = ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
    
    await update.message.reply_text(
        "🌤 Выберите город или введите свой:",
        reply_markup=reply_markup
    )

# Обработка выбора города
async def handle_city_selection(update: Update, context):
    text = update.message.text
    
    if text in ["🏙 Москва", "🏛 Санкт-Петербург", "🌊 Сочи", "🏔 Екатеринбург"]:
        # Убираем эмодзи и получаем название города
        city = text.split('' '', 1)[1]
        weather_info = await get_weather(city)
        await update.message.reply_text(weather_info)
    
    elif text == "✍️ Ввести город":
        await update.message.reply_text(
            "✍️ Введите название города:"
        )
        # Устанавливаем состояние ожидания ввода города
        context.user_data[''waiting_for_city''] = True
```

## Прогноз на несколько дней

### Функция получения прогноза:
```python
async def get_forecast(city, days=3):
    """Получает прогноз погоды на несколько дней"""
    try:
        url = f"https://api.openweathermap.org/data/2.5/forecast"
        params = {
            ''q'': city,
            ''appid'': WEATHER_API_KEY,
            ''units'': ''metric'',
            ''lang'': ''ru''
        }
        
        response = requests.get(url, params=params)
        
        if response.status_code == 200:
            data = response.json()
            
            forecast_text = f"📅 Прогноз погоды в {city}:\\n\\n"
            
            # Берем прогноз через каждые 24 часа (8 интервалов по 3 часа)
            for i in range(0, min(days * 8, len(data[''list''])), 8):
                item = data[''list''][i]
                
                # Дата
                date = item[''dt_txt''].split('' '')[0]
                temp = item[''main''][''temp'']
                description = item[''weather''][0][''description'']
                
                forecast_text += f"📅 {date}: {temp}°C, {description}\\n"
            
            return forecast_text
            
    except Exception as e:
        return f"❌ Ошибка получения прогноза: {str(e)}"

# Команда прогноза
async def forecast_command(update: Update, context):
    if context.args:
        city = '' ''.join(context.args)
        forecast_info = await get_forecast(city)
        await update.message.reply_text(forecast_info)
    else:
        await update.message.reply_text(
            "📅 Укажите город для прогноза:\\n"
            "Пример: /forecast Москва"
        )

app.add_handler(CommandHandler("forecast", forecast_command))
```

## Практическое задание

**Добавьте погодного бота:**

1. Зарегистрируйтесь в OpenWeatherMap
2. Получите API ключ и добавьте в Secrets
3. Создайте функцию получения погоды
4. Добавьте команду `/weather`
5. Протестируйте с разными городами
6. Добавьте обработку ошибок

**Дополнительно:**
- Создайте команду прогноза `/forecast`
- Добавьте кнопки с популярными городами
- Реализуйте сохранение любимого города пользователя

**Результат:** Бот с реальными данными о погоде!

## Что дальше?

В следующем уроке мы добавим еще больше интеграций: новости, курсы валют, переводчик и другие полезные сервисы. Ваш бот станет настоящим универсальным помощником!',
  1,
  45,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  updated_at = NOW();

-- Урок 4.2: Интеграция с новостными API и другими сервисами
INSERT INTO lessons (id, module_id, title, type, content, order_index, estimated_duration, created_at, updated_at)
VALUES (
  89,
  47,
  'Интеграция с новостными API и другими сервисами',
  '# Интеграция с новостными API и другими сервисами

## Популярные бесплатные API

### Новости:
- **NewsAPI** — новости со всего мира
- **News.ru API** — российские новости
- **РБК API** — экономические новости

### Курсы валют:
- **ExchangeRate-API** — курсы валют
- **Fixer.io** — валютные курсы
- **ЦБ РФ API** — официальные курсы

### Переводчик:
- **Google Translate API** — машинный перевод
- **MyMemory** — бесплатный переводчик
- **Яндекс.Переводчик** — API Яндекса

## Настройка новостного API

### Регистрация в NewsAPI:
1. Перейдите на newsapi.org
2. Нажмите **Get API Key**
3. Зарегистрируйтесь бесплатно
4. Получите ключ и сохраните в Secrets как `NEWS_API_KEY`

### Функция получения новостей:
```python
import requests
import os

NEWS_API_KEY = os.getenv(''NEWS_API_KEY'')

async def get_news(country=''ru'', category=''general'', count=5):
    """Получает последние новости"""
    try:
        url = "https://newsapi.org/v2/top-headlines"
        params = {
            ''country'': country,
            ''category'': category,
            ''pageSize'': count,
            ''apiKey'': NEWS_API_KEY
        }
        
        response = requests.get(url, params=params)
        
        if response.status_code == 200:
            data = response.json()
            articles = data[''articles'']
            
            if not articles:
                return "📰 Новостей пока нет."
            
            news_text = f"📰 Последние новости ({category}):\\n\\n"
            
            for i, article in enumerate(articles[:count], 1):
                title = article[''title'']
                description = article[''description''] or ''Описание недоступно''
                url = article[''url'']
                
                # Ограничиваем длину описания
                if len(description) > 100:
                    description = description[:100] + "..."
                
                news_text += f"{i}. **{title}**\\n"
                news_text += f"   {description}\\n"
                news_text += f"   🔗 [Читать полностью]({url})\\n\\n"
            
            return news_text
            
        else:
            return "❌ Ошибка получения новостей."
            
    except Exception as e:
        return f"❌ Произошла ошибка: {str(e)}"

# Команда новостей
async def news_command(update: Update, context):
    # Получаем категорию из аргументов
    category = ''general''
    if context.args:
        category = context.args[0].lower()
    
    news_info = await get_news(category=category)
    
    await update.message.reply_text(
        news_info,
        parse_mode=''Markdown'',
        disable_web_page_preview=True
    )

app.add_handler(CommandHandler("news", news_command))
```

## Интерактивное меню новостей

### Создание категорий новостей:
```python
async def news_menu(update: Update, context):
    keyboard = [
        [InlineKeyboardButton("📰 Общие", callback_data=''news_general''),
         InlineKeyboardButton("💼 Бизнес", callback_data=''news_business'')],
        [InlineKeyboardButton("⚽ Спорт", callback_data=''news_sports''),
         InlineKeyboardButton("🔬 Наука", callback_data=''news_science'')],
        [InlineKeyboardButton("💻 Технологии", callback_data=''news_technology''),
         InlineKeyboardButton("🎬 Развлечения", callback_data=''news_entertainment'')]
    ]
    
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        "📰 Выберите категорию новостей:",
        reply_markup=reply_markup
    )

# Обработка выбора категории
async def handle_news_category(update: Update, context):
    query = update.callback_query
    await query.answer()
    
    # Извлекаем категорию из callback_data
    category = query.data.replace(''news_'', '''')
    
    # Получаем новости выбранной категории
    news_info = await get_news(category=category)
    
    await query.edit_message_text(
        news_info,
        parse_mode=''Markdown''
    )

app.add_handler(CommandHandler("newsmenu", news_menu))
app.add_handler(CallbackQueryHandler(handle_news_category, pattern=''^news_''))
```

## Курсы валют

### Бесплатный API курсов валют:
```python
async def get_exchange_rates():
    """Получает актуальные курсы валют"""
    try:
        # Используем бесплатный API без ключа
        url = "https://api.exchangerate-api.com/v4/latest/RUB"
        
        response = requests.get(url)
        
        if response.status_code == 200:
            data = response.json()
            rates = data[''rates'']
            
            # Обратные курсы (сколько рублей за 1 единицу валюты)
            usd_rate = 1 / rates[''USD'']
            eur_rate = 1 / rates[''EUR'']
            cny_rate = 1 / rates[''CNY'']
            
            rates_text = f"""
💱 Курсы валют (ЦБ РФ):

💵 USD: {usd_rate:.2f} ₽
💶 EUR: {eur_rate:.2f} ₽
🇨🇳 CNY: {cny_rate:.2f} ₽

📅 Обновлено: {data[''date'']}
            """
            
            return rates_text.strip()
            
        else:
            return "❌ Ошибка получения курсов валют."
            
    except Exception as e:
        return f"❌ Произошла ошибка: {str(e)}"

async def rates_command(update: Update, context):
    rates_info = await get_exchange_rates()
    await update.message.reply_text(rates_info)

app.add_handler(CommandHandler("rates", rates_command))
```

## Простой переводчик

### Переводчик через MyMemory API:
```python
async def translate_text(text, from_lang=''auto'', to_lang=''ru''):
    """Переводит текст с одного языка на другой"""
    try:
        url = "https://api.mymemory.translated.net/get"
        params = {
            ''q'': text,
            ''langpair'': f"{from_lang}|{to_lang}"
        }
        
        response = requests.get(url, params=params)
        
        if response.status_code == 200:
            data = response.json()
            translated = data[''responseData''][''translatedText'']
            
            return f"🔤 Перевод:\\n\\n📝 Исходный текст: {text}\\n✅ Перевод: {translated}"
            
        else:
            return "❌ Ошибка перевода."
            
    except Exception as e:
        return f"❌ Произошла ошибка: {str(e)}"

async def translate_command(update: Update, context):
    if context.args:
        text_to_translate = '' ''.join(context.args)
        translation = await translate_text(text_to_translate)
        await update.message.reply_text(translation)
    else:
        await update.message.reply_text(
            "🔤 Введите текст для перевода:\\n"
            "Пример: /translate Hello world"
        )

app.add_handler(CommandHandler("translate", translate_command))
```

## Генератор QR-кодов

### QR-код через API:
```python
async def generate_qr_command(update: Update, context):
    if context.args:
        text = '' ''.join(context.args)
        
        # Создаем QR-код через API
        qr_url = f"https://api.qrserver.com/v1/create-qr-code/?size=300x300&data={text}"
        
        await update.message.reply_photo(
            photo=qr_url,
            caption=f"📱 QR-код для: {text}"
        )
    else:
        await update.message.reply_text(
            "📱 Введите текст для QR-кода:\\n"
            "Пример: /qr https://google.com"
        )

app.add_handler(CommandHandler("qr", generate_qr_command))
```

## Случайные факты

### API случайных фактов:
```python
async def random_fact_command(update: Update, context):
    try:
        # Используем API случайных фактов
        url = "https://uselessfacts.jsph.pl/random.json?language=en"
        
        response = requests.get(url)
        
        if response.status_code == 200:
            data = response.json()
            fact = data[''text'']
            
            # Переводим факт на русский
            translated_fact = await translate_text(fact, ''en'', ''ru'')
            
            await update.message.reply_text(f"🧠 Случайный факт:\\n\\n{translated_fact}")
        else:
            await update.message.reply_text("❌ Не удалось получить факт.")
            
    except Exception as e:
        await update.message.reply_text(f"❌ Ошибка: {str(e)}")

app.add_handler(CommandHandler("fact", random_fact_command))
```

## Универсальное меню сервисов

### Создание главного меню:
```python
async def services_menu(update: Update, context):
    keyboard = [
        [InlineKeyboardButton("📰 Новости", callback_data=''service_news''),
         InlineKeyboardButton("🌤 Погода", callback_data=''service_weather'')],
        [InlineKeyboardButton("💱 Курсы валют", callback_data=''service_rates''),
         InlineKeyboardButton("🔤 Переводчик", callback_data=''service_translate'')],
        [InlineKeyboardButton("📱 QR-код", callback_data=''service_qr''),
         InlineKeyboardButton("🧠 Факт", callback_data=''service_fact'')]
    ]
    
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        "🛠 Выберите сервис:",
        reply_markup=reply_markup
    )

async def handle_service_selection(update: Update, context):
    query = update.callback_query
    await query.answer()
    
    service = query.data.replace(''service_'', '''')
    
    if service == ''news'':
        await news_menu(query, context)
    elif service == ''weather'':
        await query.edit_message_text("🌤 Введите город: /weather Москва")
    elif service == ''rates'':
        rates_info = await get_exchange_rates()
        await query.edit_message_text(rates_info)
    elif service == ''translate'':
        await query.edit_message_text("🔤 Введите текст: /translate Hello")
    elif service == ''qr'':
        await query.edit_message_text("📱 Введите текст: /qr https://google.com")
    elif service == ''fact'':
        await random_fact_command(query, context)

app.add_handler(CommandHandler("services", services_menu))
app.add_handler(CallbackQueryHandler(handle_service_selection, pattern=''^service_''))
```

## Практическое задание

**Создайте универсального бота-помощника:**

1. Добавьте новостной сервис с категориями
2. Интегрируйте курсы валют
3. Создайте простой переводчик
4. Добавьте генератор QR-кодов
5. Реализуйте меню всех сервисов
6. Протестируйте все функции

**Дополнительно:**
- Добавьте генератор анекдотов
- Создайте конвертер единиц измерения
- Интегрируйте API гороскопов
- Добавьте поиск по Wikipedia

**Результат:** Многофункциональный бот с множеством полезных сервисов!

## Что дальше?

В следующем модуле мы изучим монетизацию бота: прием платежей, подписки, рекламу и другие способы заработка на вашем боте. Превратим хобби в бизнес!',
  2,
  50,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  updated_at = NOW();

-- Модуль 5: Монетизация и развертывание
INSERT INTO course_modules (id, course_id, title, description, order_index, created_at, updated_at)
VALUES (
  48,
  10,
  'Монетизация и развертывание',
  'Заработок на боте и профессиональное развертывание',
  5,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  updated_at = NOW();

-- Урок 5.1: Прием платежей через бота
INSERT INTO lessons (id, module_id, title, type, content, order_index, estimated_duration, created_at, updated_at)
VALUES (
  90,
  48,
  'Прием платежей через бота',
  '# Прием платежей через бота

## Способы монетизации ботов

### 1. Прямые платежи
- **Telegram Payments** — встроенная система оплаты
- **ЮMoney (Яндекс.Деньги)** — российский платежный сервис  
- **QIWI** — электронные кошельки
- **Сбербанк API** — банковские платежи

### 2. Подписочная модель
- Месячные/годовые подписки
- Премиум функции
- Ограничения для бесплатных пользователей

### 3. Партнерские программы
- Реферальные ссылки
- Комиссии с продаж
- Реклама других сервисов

## Настройка Telegram Payments

### Шаг 1: Подключение провайдера
1. Откройте @BotFather
2. Выберите своего бота
3. Нажмите **Payments**
4. Выберите провайдера (например, ЮMoney)
5. Получите токен провайдера

### Шаг 2: Добавление токена в проект
Сохраните токен в Replit Secrets как `PAYMENT_TOKEN`

## Создание магазина в боте

### Структура товаров:
```python
# Каталог товаров
PRODUCTS = {
    ''premium_month'': {
        ''title'': ''🔥 Премиум на месяц'',
        ''description'': ''Доступ ко всем функциям бота на 30 дней'',
        ''price'': 199,  # в рублях
        ''currency'': ''RUB''
    },
    ''premium_year'': {
        ''title'': ''💎 Премиум на год'',
        ''description'': ''Доступ ко всем функциям на 12 месяцев + скидка 40%'',
        ''price'': 1199,
        ''currency'': ''RUB''
    },
    ''consultation'': {
        ''title'': ''👨‍💼 Консультация эксперта'',
        ''description'': ''Персональная консультация 60 минут'',
        ''price'': 2500,
        ''currency'': ''RUB''
    }
}
```

### Каталог товаров с кнопками:
```python
from telegram import InlineKeyboardButton, InlineKeyboardMarkup

async def shop_command(update: Update, context):
    keyboard = []
    
    for product_id, product in PRODUCTS.items():
        button_text = f"{product[''title'']} - {product[''price'']} ₽"
        keyboard.append([
            InlineKeyboardButton(button_text, callback_data=f''buy_{product_id}'')
        ])
    
    keyboard.append([InlineKeyboardButton("ℹ️ О подписке", callback_data=''subscription_info'')])
    
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        "🛒 **Наш магазин:**\\n\\n"
        "Выберите товар для покупки:",
        reply_markup=reply_markup,
        parse_mode=''Markdown''
    )

app.add_handler(CommandHandler("shop", shop_command))
```

## Обработка покупки

### Создание инвойса:
```python
from telegram import LabeledPrice, InlineKeyboardButton, InlineKeyboardMarkup
import os

PAYMENT_TOKEN = os.getenv(''PAYMENT_TOKEN'')

async def handle_purchase(update: Update, context):
    query = update.callback_query
    await query.answer()
    
    product_id = query.data.replace(''buy_'', '''')
    
    if product_id in PRODUCTS:
        product = PRODUCTS[product_id]
        
        # Создаем прайс (цена в копейках)
        prices = [LabeledPrice(product[''title''], product[''price''] * 100)]
        
        # Отправляем инвойс
        await context.bot.send_invoice(
            chat_id=query.from_user.id,
            title=product[''title''],
            description=product[''description''],
            payload=f"product_{product_id}_{query.from_user.id}",
            provider_token=PAYMENT_TOKEN,
            currency=product[''currency''],
            prices=prices,
            start_parameter=''shop''
        )
    else:
        await query.edit_message_text("❌ Товар не найден")

app.add_handler(CallbackQueryHandler(handle_purchase, pattern=''^buy_''))
```

### Обработка предварительной проверки:
```python
from telegram.ext import PreCheckoutQueryHandler

async def precheckout_callback(update: Update, context):
    """Обрабатывает предварительную проверку платежа"""
    query = update.pre_checkout_query
    
    # Всегда отвечаем OK для простых товаров
    await query.answer(ok=True)

app.add_handler(PreCheckoutQueryHandler(precheckout_callback))
```

### Обработка успешного платежа:
```python
from telegram.ext import MessageHandler, filters
from datetime import datetime, timedelta

# База данных подписок (в реальном проекте используйте базу данных)
USER_SUBSCRIPTIONS = {}

async def successful_payment_callback(update: Update, context):
    """Обрабатывает успешный платеж"""
    payment = update.message.successful_payment
    user_id = update.effective_user.id
    
    # Извлекаем информацию о товаре из payload
    payload_parts = payment.invoice_payload.split(''_'')
    product_id = payload_parts[1]
    
    # Обрабатываем подписку
    if product_id in [''premium_month'', ''premium_year'']:
        days = 30 if product_id == ''premium_month'' else 365
        expiry_date = datetime.now() + timedelta(days=days)
        
        USER_SUBSCRIPTIONS[user_id] = {
            ''type'': ''premium'',
            ''expires'': expiry_date,
            ''purchased'': datetime.now()
        }
        
        await update.message.reply_text(
            f"✅ **Платеж успешно получен!**\\n\\n"
            f"💰 Сумма: {payment.total_amount // 100} {payment.currency}\\n"
            f"🔥 Премиум подписка активирована до {expiry_date.strftime(''%d.%m.%Y'')}\\n\\n"
            f"Теперь вам доступны все функции бота!",
            parse_mode=''Markdown''
        )
    
    # Логируем продажу
    print(f"Продажа: {product_id} пользователю {user_id} на сумму {payment.total_amount // 100} {payment.currency}")

app.add_handler(MessageHandler(filters.SUCCESSFUL_PAYMENT, successful_payment_callback))
```

## Проверка подписки

### Функция проверки премиума:
```python
def has_premium_subscription(user_id):
    """Проверяет, есть ли у пользователя активная подписка"""
    if user_id not in USER_SUBSCRIPTIONS:
        return False
    
    subscription = USER_SUBSCRIPTIONS[user_id]
    return datetime.now() < subscription[''expires'']

# Декоратор для премиум функций
def premium_required(func):
    async def wrapper(update: Update, context):
        user_id = update.effective_user.id
        
        if has_premium_subscription(user_id):
            return await func(update, context)
        else:
            keyboard = [[InlineKeyboardButton("💎 Купить премиум", callback_data=''buy_premium_month'')]]
            reply_markup = InlineKeyboardMarkup(keyboard)
            
            await update.message.reply_text(
                "🔒 **Эта функция доступна только премиум пользователям!**\\n\\n"
                "💎 Преимущества премиума:\\n"
                "• Безлимитные запросы\\n"
                "• Приоритетная поддержка\\n"
                "• Эксклюзивные функции\\n"
                "• Нет рекламы",
                reply_markup=reply_markup,
                parse_mode=''Markdown''
            )
    
    return wrapper

# Пример премиум функции
@premium_required
async def premium_feature(update: Update, context):
    await update.message.reply_text(
        "✨ **Премиум функция активирована!**\\n\\n"
        "Эта функция доступна только подписчикам.",
        parse_mode=''Markdown''
    )

app.add_handler(CommandHandler("premium_feature", premium_feature))
```

## Альтернативные способы оплаты

### ЮMoney (прямые переводы):
```python
async def yoomoney_payment(update: Update, context):
    user_id = update.effective_user.id
    amount = 199  # Цена в рублях
    
    # Генерируем уникальный идентификатор платежа
    payment_id = f"payment_{user_id}_{int(datetime.now().timestamp())}"
    
    payment_text = f"""
💳 **Оплата через ЮMoney:**

💰 Сумма: {amount} ₽
📧 Получатель: 4100116123456789
📝 Комментарий: {payment_id}

⚠️ **Важно:** Обязательно укажите комментарий для автоматического зачисления!

После оплаты нажмите "Проверить платеж"
    """
    
    keyboard = [
        [InlineKeyboardButton("💳 Перейти к оплате", url="https://yoomoney.ru/transfer")],
        [InlineKeyboardButton("✅ Проверить платеж", callback_data=f''check_payment_{payment_id}'')]
    ]
    
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        payment_text,
        reply_markup=reply_markup,
        parse_mode=''Markdown''
    )
```

### QIWI платежи:
```python
import qrcode
from io import BytesIO

async def qiwi_payment(update: Update, context):
    user_id = update.effective_user.id
    amount = 199
    
    # QR-код для оплаты QIWI
    qr_text = f"https://qiwi.com/payment/form/99?extra%5B''account''%5D=79991234567&amountInteger={amount}&amountFraction=0&currency=643&comment=payment_{user_id}"
    
    # Генерируем QR-код
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(qr_text)
    qr.make(fit=True)
    
    qr_image = qr.make_image(fill_color="black", back_color="white")
    
    # Сохраняем в BytesIO
    bio = BytesIO()
    qr_image.save(bio, format=''PNG'')
    bio.seek(0)
    
    await update.message.reply_photo(
        photo=bio,
        caption=f"📱 **Оплата через QIWI:**\\n\\n💰 Сумма: {amount} ₽\\n\\nОтсканируйте QR-код или перейдите по ссылке",
        parse_mode=''Markdown''
    )
```

## Аналитика продаж

### Статистика для админа:
```python
# Хранение статистики продаж
SALES_STATS = {
    ''total_sales'': 0,
    ''total_revenue'': 0,
    ''products_sold'': {},
    ''daily_sales'': {}
}

async def sales_stats(update: Update, context):
    # Проверяем, что это админ
    admin_ids = [123456789]  # ID администраторов
    
    if update.effective_user.id not in admin_ids:
        await update.message.reply_text("❌ Доступ запрещен")
        return
    
    stats_text = f"""
📊 **Статистика продаж:**

💰 Общая выручка: {SALES_STATS[''total_revenue'']} ₽
🛒 Всего продаж: {SALES_STATS[''total_sales'']}

📦 **Популярные товары:**
    """
    
    for product, count in SALES_STATS[''products_sold''].items():
        stats_text += f"• {product}: {count} шт.\\n"
    
    await update.message.reply_text(stats_text, parse_mode=''Markdown'')

app.add_handler(CommandHandler("stats", sales_stats))
```

## Практическое задание

**Создайте систему платежей в боте:**

1. Настройте Telegram Payments с провайдером
2. Создайте каталог товаров/подписок
3. Реализуйте обработку платежей
4. Добавьте проверку премиум статуса
5. Создайте премиум функции
6. Протестируйте покупку (используйте тестовые карты)

**Дополнительно:**
- Добавьте альтернативные способы оплаты
- Создайте реферальную программу
- Реализуйте статистику продаж
- Добавьте уведомления об истечении подписки

**Результат:** Монетизированный бот с системой подписок!

## Что дальше?

В следующем уроке мы изучим профессиональное развертывание бота: постоянный хостинг, мониторинг, резервное копирование и масштабирование для тысяч пользователей!',
  1,
  55,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  updated_at = NOW();

-- Урок 5.2: Профессиональное развертывание и масштабирование
INSERT INTO lessons (id, module_id, title, type, content, order_index, estimated_duration, created_at, updated_at)
VALUES (
  91,
  48,
  'Профессиональное развертывание и масштабирование',
  '# Профессиональное развертывание и масштабирование

## Переход от разработки к продакшену

### Различия между разработкой и продакшеном:
- **Разработка** — тестирование на небольшой аудитории
- **Продакшен** — стабильная работа для тысяч пользователей
- **Staging** — промежуточная среда для тестирования

### Требования к продакшену:
- ✅ **Надежность** — 99.9% uptime
- ✅ **Масштабируемость** — поддержка роста аудитории  
- ✅ **Безопасность** — защита данных пользователей
- ✅ **Мониторинг** — отслеживание работы бота
- ✅ **Резервное копирование** — защита от потери данных

## Варианты хостинга для ботов

### 1. Облачные платформы
**Replit (Always On):**
- ✅ Простота настройки
- ✅ Автоматическое масштабирование
- ❌ Ограничения бесплатного тарифа
- 💰 $5-20/месяц

**Heroku:**
- ✅ Git-деплой
- ✅ Множество add-ons
- ❌ Дорогой при росте
- 💰 $7-25/месяц

**Railway:**
- ✅ Современный интерфейс
- ✅ Автоматический деплой
- 💰 $5-15/месяц

### 2. VPS серверы
**DigitalOcean Droplets:**
- ✅ Полный контроль
- ✅ Хорошая цена
- ❌ Требует администрирования
- 💰 $4-10/месяц

**Яндекс.Облако:**
- ✅ Российская юрисдикция
- ✅ Интеграция с Яндекс сервисами
- 💰 от 400₽/месяц

### 3. Kubernetes
**Для больших проектов:**
- ✅ Автоматическое масштабирование
- ✅ Высокая надежность
- ❌ Сложность настройки

## Настройка продакшен окружения

### Структура проекта:
```
telegram-bot-production/
├── src/
│   ├── bot/
│   │   ├── handlers/
│   │   ├── middleware/
│   │   └── utils/
│   ├── database/
│   │   ├── models/
│   │   └── migrations/
│   └── services/
├── config/
│   ├── production.env
│   ├── staging.env
│   └── development.env
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
├── scripts/
│   ├── deploy.sh
│   └── backup.sh
├── tests/
└── monitoring/
```

### Переменные окружения:
```env
# config/production.env
NODE_ENV=production
BOT_TOKEN=your_production_bot_token
DATABASE_URL=postgresql://user:pass@host:5432/botdb
REDIS_URL=redis://redis:6379
LOG_LEVEL=info
WEBHOOK_URL=https://yourdomain.com/webhook
ADMIN_IDS=123456789,987654321
SENTRY_DSN=https://your-sentry-dsn
```

## Docker контейнеризация

### Dockerfile:
```dockerfile
FROM node:18-alpine

# Создаем рабочую директорию
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm ci --only=production

# Копируем исходный код
COPY src/ ./src/
COPY config/ ./config/

# Создаем пользователя для безопасности
RUN addgroup -g 1001 -S nodejs
RUN adduser -S bot -u 1001
USER bot

# Открываем порт
EXPOSE 3000

# Команда запуска
CMD ["node", "src/index.js"]
```

### docker-compose.yml:
```yaml
version: ''3.8''

services:
  bot:
    build: .
    environment:
      - NODE_ENV=production
    env_file:
      - config/production.env
    depends_on:
      - database
      - redis
    restart: unless-stopped
    
  database:
    image: postgres:15
    environment:
      POSTGRES_DB: botdb
      POSTGRES_USER: botuser
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped
    
  redis:
    image: redis:alpine
    restart: unless-stopped
    
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl
    depends_on:
      - bot
    restart: unless-stopped

volumes:
  postgres_data:
```

## Настройка базы данных

### PostgreSQL для продакшена:
```javascript
// database/connection.js
const { Pool } = require(''pg'');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,                    // Максимум соединений
  idleTimeoutMillis: 30000,   // Таймаут простоя
  connectionTimeoutMillis: 2000,
  ssl: process.env.NODE_ENV === ''production'' ? { rejectUnauthorized: false } : false
});

// Миграции
async function runMigrations() {
  const client = await pool.connect();
  
  try {
    // Создаем таблицы пользователей
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT PRIMARY KEY,
        username VARCHAR(255),
        first_name VARCHAR(255),
        language_code VARCHAR(10),
        is_premium BOOLEAN DEFAULT FALSE,
        premium_expires TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Создаем таблицу сообщений
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        user_id BIGINT REFERENCES users(id),
        message_text TEXT,
        message_type VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Создаем индексы для производительности
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_premium_expires 
      ON users(premium_expires) WHERE is_premium = TRUE
    `);
    
    console.log(''✅ Миграции выполнены успешно'');
    
  } catch (error) {
    console.error(''❌ Ошибка миграций:'', error);
  } finally {
    client.release();
  }
}

module.exports = { pool, runMigrations };
```

## Мониторинг и логирование

### Winston для логирования:
```javascript
// utils/logger.js
const winston = require(''winston'');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || ''info'',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // Файловые логи
    new winston.transports.File({ 
      filename: ''logs/error.log'', 
      level: ''error'' 
    }),
    new winston.transports.File({ 
      filename: ''logs/combined.log'' 
    }),
    
    // Консольные логи для разработки
    ...(process.env.NODE_ENV !== ''production'' ? [
      new winston.transports.Console({
        format: winston.format.simple()
      })
    ] : [])
  ]
});

// Sentry для отслеживания ошибок в продакшене
if (process.env.NODE_ENV === ''production'' && process.env.SENTRY_DSN) {
  const Sentry = require(''@sentry/node'');
  
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV
  });
  
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

### Метрики и аналитика:
```javascript
// utils/metrics.js
const redis = require(''redis'');
const client = redis.createClient(process.env.REDIS_URL);

class MetricsCollector {
  // Счетчик сообщений
  static async incrementMessageCount(userId) {
    const today = new Date().toISOString().split(''T'')[0];
    await client.hincrby(`messages:${today}`, userId, 1);
    await client.incr(''total_messages'');
  }
  
  // Активные пользователи
  static async trackActiveUser(userId) {
    const today = new Date().toISOString().split(''T'')[0];
    await client.sadd(`active_users:${today}`, userId);
  }
  
  // Статистика команд
  static async trackCommand(command) {
    await client.hincrby(''command_stats'', command, 1);
  }
  
  // Получение статистики
  static async getDailyStats() {
    const today = new Date().toISOString().split(''T'')[0];
    
    const [
      activeUsers,
      messageCount,
      commandStats
    ] = await Promise.all([
      client.scard(`active_users:${today}`),
      client.hgetall(`messages:${today}`),
      client.hgetall(''command_stats'')
    ]);
    
    return {
      activeUsers,
      messageCount: Object.values(messageCount).reduce((sum, count) => sum + parseInt(count), 0),
      commandStats
    };
  }
}

module.exports = MetricsCollector;
```

## CI/CD пайплайн

### GitHub Actions для автодеплоя:
```yaml
# .github/workflows/deploy.yml
name: Deploy Bot

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: ''18''
      - run: npm ci
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to production
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /app/telegram-bot
            git pull origin main
            docker-compose down
            docker-compose up -d --build
            
      - name: Health check
        run: |
          sleep 30
          curl -f https://yourdomain.com/health || exit 1
```

## Масштабирование под нагрузкой

### Горизонтальное масштабирование:
```javascript
// cluster.js - запуск нескольких процессов
const cluster = require(''cluster'');
const numCPUs = require(''os'').cpus().length;

if (cluster.isMaster) {
  console.log(`Запуск ${numCPUs} воркеров...`);
  
  // Запускаем воркеры
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  
  cluster.on(''exit'', (worker, code, signal) => {
    console.log(`Воркер ${worker.process.pid} завершился`);
    cluster.fork(); // Перезапускаем упавший воркер
  });
  
} else {
  // Запускаем бота в воркере
  require(''./src/bot'');
  console.log(`Воркер ${process.pid} запущен`);
}
```

### Load Balancer с Nginx:
```nginx
# nginx.conf
upstream bot_backend {
    server bot1:3000;
    server bot2:3000;
    server bot3:3000;
}

server {
    listen 80;
    server_name yourdomain.com;
    
    location /webhook {
        proxy_pass http://bot_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /health {
        proxy_pass http://bot_backend;
    }
}
```

## Резервное копирование

### Автоматические бэкапы:
```bash
#!/bin/bash
# scripts/backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

# Бэкап базы данных
pg_dump $DATABASE_URL > "$BACKUP_DIR/database_$DATE.sql"

# Бэкап файлов
tar -czf "$BACKUP_DIR/files_$DATE.tar.gz" /app/data/

# Загрузка в облако (AWS S3)
aws s3 cp "$BACKUP_DIR/database_$DATE.sql" s3://your-backup-bucket/
aws s3 cp "$BACKUP_DIR/files_$DATE.tar.gz" s3://your-backup-bucket/

# Удаление старых бэкапов (старше 30 дней)
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Бэкап завершен: $DATE"
```

### Cron для регулярных бэкапов:
```bash
# Добавить в crontab
0 2 * * * /app/scripts/backup.sh >> /var/log/backup.log 2>&1
```

## Практическое задание

**Подготовьте бота к продакшену:**

1. Создайте Docker контейнер для бота
2. Настройте PostgreSQL базу данных
3. Добавьте систему логирования
4. Реализуйте метрики и мониторинг
5. Настройте автоматические бэкапы
6. Создайте CI/CD пайплайн

**Дополнительно:**
- Настройте SSL сертификаты
- Добавьте rate limiting
- Реализуйте graceful shutdown
- Создайте систему алертов

**Результат:** Профессионально развернутый бот, готовый к тысячам пользователей!

## Поздравляем с завершением курса! 🎉

Вы прошли путь от создания простого бота до профессионального продукта. Теперь у вас есть все знания для создания успешных Telegram-ботов без программирования!

### Что вы изучили:
- ✅ Регистрацию и настройку ботов
- ✅ Создание команд и интерактивных меню
- ✅ Интеграцию с внешними API
- ✅ Монетизацию через платежи
- ✅ Профессиональное развертывание

### Следующие шаги:
1. **Создайте своего первого коммерческого бота**
2. **Изучите продвинутые техники программирования**
3. **Развивайте бизнес на основе ботов**
4. **Присоединяйтесь к сообществу разработчиков**

**Удачи в создании потрясающих ботов! 🚀**',
  2,
  60,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  updated_at = NOW();

-- Добавляем теги курса
INSERT INTO course_tags (course_id, tag)
VALUES 
  (10, 'telegram'),
  (10, 'боты'),
  (10, 'replit'),
  (10, 'no-code'),
  (10, 'автоматизация'),
  (10, 'монетизация')
ON CONFLICT (course_id, tag) DO NOTHING;

SELECT 'Курс "Создание Telegram-ботов на Replit без кода" успешно создан!' as result;
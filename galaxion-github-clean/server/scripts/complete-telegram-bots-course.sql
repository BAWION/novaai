-- Завершение создания курса "Telegram-боты на Replit без кода"

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
  'practice',
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

## Практическое задание

**Добавьте команды в своего бота:**

1. Создайте команду `/help` со списком возможностей
2. Добавьте команду `/about` с информацией о боте
3. Сделайте команду `/contact` с вашими контактами
4. Настройте меню команд через BotFather
5. Протестируйте все команды

**Результат:** Бот с полноценным набором команд и меню!',
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
  'practice',
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
        resize_keyboard=True,
        one_time_keyboard=False
    )
    
    await update.message.reply_text(
        "Добро пожаловать! Выберите действие:",
        reply_markup=reply_markup
    )

app.add_handler(CommandHandler("start", start_with_keyboard))
```

## Практическое задание

**Создайте интерактивного бота:**

1. Добавьте стартовую клавиатуру с основными разделами
2. Создайте меню с inline кнопками
3. Добавьте обработку всех кнопок
4. Сделайте кнопку "Назад" для навигации
5. Протестируйте удобство использования

**Результат:** Удобный бот с интерактивными кнопками!',
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
  'practice',
  '# Подключение погодного API

## Выбор погодного сервиса

Для получения данных о погоде мы будем использовать бесплатные API:

### OpenWeatherMap
- ✅ Бесплатный тариф: 1000 запросов/день
- ✅ Простой API
- ✅ Поддержка русского языка
- 🌐 openweathermap.org

## Регистрация в OpenWeatherMap

### Шаг 1: Создание аккаунта
1. Перейдите на openweathermap.org
2. Нажмите **Sign Up**
3. Заполните форму регистрации
4. Подтвердите email

### Шаг 2: Получение API ключа
1. Войдите в аккаунт
2. Перейдите в **API keys**
3. Скопируйте ключ
4. Сохраните в Replit Secrets как `WEATHER_API_KEY`

## Создание погодной функции

### Python код:
```python
import os
import requests

WEATHER_API_KEY = os.getenv(''WEATHER_API_KEY'')

async def get_weather(city):
    try:
        url = f"https://api.openweathermap.org/data/2.5/weather"
        params = {
            ''q'': city,
            ''appid'': WEATHER_API_KEY,
            ''units'': ''metric'',
            ''lang'': ''ru''
        }
        
        response = requests.get(url, params=params)
        
        if response.status_code == 200:
            data = response.json()
            
            temp = data[''main''][''temp'']
            description = data[''weather''][0][''description'']
            
            weather_text = f"""
🌤 Погода в {city}:

🌡 Температура: {temp}°C
☁️ {description.title()}
            """
            
            return weather_text.strip()
            
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
            "📍 Укажите город: /weather Москва"
        )

app.add_handler(CommandHandler("weather", weather_command))
```

## Практическое задание

**Добавьте погодного бота:**

1. Зарегистрируйтесь в OpenWeatherMap
2. Получите API ключ и добавьте в Secrets
3. Создайте функцию получения погоды
4. Добавьте команду `/weather`
5. Протестируйте с разными городами

**Результат:** Бот с реальными данными о погоде!',
  1,
  45,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  updated_at = NOW();

-- Урок 4.2: Другие полезные API
INSERT INTO lessons (id, module_id, title, type, content, order_index, estimated_duration, created_at, updated_at)
VALUES (
  89,
  47,
  'Другие полезные API',
  'practice',
  '# Другие полезные API

## Курсы валют

### Бесплатный API курсов валют:
```python
async def get_exchange_rates():
    try:
        url = "https://api.exchangerate-api.com/v4/latest/RUB"
        response = requests.get(url)
        
        if response.status_code == 200:
            data = response.json()
            rates = data[''rates'']
            
            usd_rate = 1 / rates[''USD'']
            eur_rate = 1 / rates[''EUR'']
            
            rates_text = f"""
💱 Курсы валют:

💵 USD: {usd_rate:.2f} ₽
💶 EUR: {eur_rate:.2f} ₽

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

## Генератор QR-кодов

### QR-код через API:
```python
async def generate_qr_command(update: Update, context):
    if context.args:
        text = '' ''.join(context.args)
        
        qr_url = f"https://api.qrserver.com/v1/create-qr-code/?size=300x300&data={text}"
        
        await update.message.reply_photo(
            photo=qr_url,
            caption=f"📱 QR-код для: {text}"
        )
    else:
        await update.message.reply_text(
            "📱 Введите текст для QR-кода: /qr https://google.com"
        )

app.add_handler(CommandHandler("qr", generate_qr_command))
```

## Практическое задание

**Создайте универсального бота-помощника:**

1. Добавьте курсы валют
2. Создайте генератор QR-кодов
3. Реализуйте меню всех сервисов
4. Протестируйте все функции

**Результат:** Многофункциональный бот с множеством полезных сервисов!',
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
  'practice',
  '# Прием платежей через бота

## Способы монетизации ботов

### 1. Прямые платежи
- **Telegram Payments** — встроенная система оплаты
- **ЮMoney** — российский платежный сервис
- **QIWI** — электронные кошельки

### 2. Подписочная модель
- Месячные/годовые подписки
- Премиум функции
- Ограничения для бесплатных пользователей

## Настройка Telegram Payments

### Шаг 1: Подключение провайдера
1. Откройте @BotFather
2. Выберите своего бота
3. Нажмите **Payments**
4. Выберите провайдера
5. Получите токен провайдера

### Шаг 2: Добавление токена
Сохраните токен в Replit Secrets как `PAYMENT_TOKEN`

## Создание магазина в боте

### Структура товаров:
```python
PRODUCTS = {
    ''premium_month'': {
        ''title'': ''🔥 Премиум на месяц'',
        ''description'': ''Доступ ко всем функциям бота на 30 дней'',
        ''price'': 199,
        ''currency'': ''RUB''
    },
    ''premium_year'': {
        ''title'': ''💎 Премиум на год'',
        ''description'': ''Доступ ко всем функциям на 12 месяцев + скидка 40%'',
        ''price'': 1199,
        ''currency'': ''RUB''
    }
}
```

### Каталог товаров:
```python
async def shop_command(update: Update, context):
    keyboard = []
    
    for product_id, product in PRODUCTS.items():
        button_text = f"{product[''title'']} - {product[''price'']} ₽"
        keyboard.append([
            InlineKeyboardButton(button_text, callback_data=f''buy_{product_id}'')
        ])
    
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        "🛒 **Наш магазин:**\\n\\nВыберите товар для покупки:",
        reply_markup=reply_markup,
        parse_mode=''Markdown''
    )

app.add_handler(CommandHandler("shop", shop_command))
```

## Практическое задание

**Создайте систему платежей в боте:**

1. Настройте Telegram Payments с провайдером
2. Создайте каталог товаров/подписок
3. Реализуйте обработку платежей
4. Добавьте проверку премиум статуса
5. Протестируйте покупку

**Результат:** Монетизированный бот с системой подписок!',
  1,
  55,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  updated_at = NOW();

-- Урок 5.2: Профессиональное развертывание
INSERT INTO lessons (id, module_id, title, type, content, order_index, estimated_duration, created_at, updated_at)
VALUES (
  91,
  48,
  'Профессиональное развертывание',
  'theory',
  '# Профессиональное развертывание

## Переход от разработки к продакшену

### Требования к продакшену:
- ✅ **Надежность** — 99.9% uptime
- ✅ **Масштабируемость** — поддержка роста аудитории
- ✅ **Безопасность** — защита данных пользователей
- ✅ **Мониторинг** — отслеживание работы бота

## Варианты хостинга для ботов

### 1. Облачные платформы
**Replit (Always On):**
- ✅ Простота настройки
- ✅ Автоматическое масштабирование
- 💰 $5-20/месяц

**Heroku:**
- ✅ Git-деплой
- ✅ Множество add-ons
- 💰 $7-25/месяц

### 2. VPS серверы
**DigitalOcean:**
- ✅ Полный контроль
- ✅ Хорошая цена
- 💰 $4-10/месяц

## Настройка продакшен окружения

### Переменные окружения:
```env
NODE_ENV=production
BOT_TOKEN=your_production_bot_token
DATABASE_URL=postgresql://user:pass@host:5432/botdb
LOG_LEVEL=info
WEBHOOK_URL=https://yourdomain.com/webhook
ADMIN_IDS=123456789,987654321
```

## Мониторинг и логирование

### Базовое логирование:
```python
import logging

logging.basicConfig(
    format=''%(asctime)s - %(name)s - %(levelname)s - %(message)s'',
    level=logging.INFO
)

logger = logging.getLogger(__name__)

async def start(update: Update, context):
    logger.info(f"User {update.effective_user.id} started the bot")
    await update.message.reply_text(''Привет!'')
```

## Резервное копирование

### Автоматические бэкапы:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"

# Бэкап базы данных
pg_dump $DATABASE_URL > "$BACKUP_DIR/database_$DATE.sql"

# Удаление старых бэкапов (старше 30 дней)
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete

echo "Бэкап завершен: $DATE"
```

## Практическое задание

**Подготовьте бота к продакшену:**

1. Настройте переменные окружения
2. Добавьте систему логирования
3. Реализуйте мониторинг
4. Настройте автоматические бэкапы
5. Протестируйте стабильность

**Результат:** Профессионально развернутый бот!

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
2. **Изучите продвинутые техники**
3. **Развивайте бизнес на основе ботов**
4. **Присоединяйтесь к сообществу разработчиков**

**Удачи в создании потрясающих ботов!**',
  2,
  60,
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  updated_at = NOW();

SELECT 'Курс "Создание Telegram-ботов на Replit без кода" полностью готов!' as result;
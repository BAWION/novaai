# Настройка Telegram бота для авторизации

## Проблема "Bot domain invalid"

Ошибка возникает потому, что для Telegram Login Widget нужно настроить разрешенные домены в настройках бота.

## Шаги для настройки:

### 1. Найдите вашего бота в Telegram
- Откройте Telegram и найдите @BotFather
- Отправьте команду `/mybots`
- Выберите бота "Galaxion Auth Bot" (@Galaxion_Auth_bot)

### 2. Настройте домен
- Выберите "Bot Settings" → "Domain"
- Добавьте следующие домены:
  ```
  galaxion.org
  www.galaxion.org
  49c11d52-b1fc-4151-bb61-b9097616c44f-00-3h2ne9cwwtbvn.janeway.replit.dev
  ```

### 3. Username бота подтвержден
- ✅ Username: Galaxion_Auth_bot
- ✅ Код обновлен с правильным username
- Осталось только настроить домены в пункте 2

### 4. Проверьте токен
- Убедитесь, что TELEGRAM_AUTH_BOT_TOKEN корректно добавлен в секреты
- Токен должен быть от бота авторизации, а не от бота публикации новостей

## После настройки
Telegram Login Widget автоматически появится на странице входа и будет работать корректно.
/**
 * Скрипт для тестирования различных username Telegram бота
 * Помогает найти правильный username для Telegram Login Widget
 */

const possibleUsernames = [
  'galaxion_auth_bot',
  'GalaxionAuthBot', 
  'galaxion_bot',
  'GalaxionBot',
  'galaxionauth_bot',
  'GalaxionAuth_Bot'
];

async function testTelegramBotToken() {
  const token = process.env.TELEGRAM_AUTH_BOT_TOKEN;
  
  if (!token) {
    console.log('❌ TELEGRAM_AUTH_BOT_TOKEN не найден в environment');
    return;
  }
  
  try {
    // Получаем информацию о боте через API
    const response = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const data = await response.json();
    
    if (data.ok) {
      console.log('✅ Бот найден!');
      console.log(`📝 Username: @${data.result.username}`);
      console.log(`👤 Имя: ${data.result.first_name}`);
      console.log(`🆔 ID: ${data.result.id}`);
      
      // Обновляем код с правильным username
      updateLoginPageWithCorrectUsername(data.result.username);
    } else {
      console.log('❌ Ошибка API:', data.description);
    }
  } catch (error) {
    console.log('❌ Ошибка сети:', error.message);
  }
}

function updateLoginPageWithCorrectUsername(username) {
  console.log(`\n🔧 Для обновления страницы входа используйте username: ${username}`);
  console.log(`\nДобавьте в код:\nscript.setAttribute('data-telegram-login', '${username}');`);
}

// Запускаем тест
testTelegramBotToken();
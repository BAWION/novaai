// Скрипт для тестирования API AI-ассистента
import https from 'https';

// Базовый URL приложения
const baseUrl = 'https://49c11d52-b1fc-4151-bb61-b9097616c44f-00-3h2ne9cwwtbvn.janeway.replit.dev';

// Функция для отправки HTTP-запросов
function makeRequest(method, path, data, cookies = '') {
  return new Promise((resolve, reject) => {
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies
      }
    };
    
    const url = `${baseUrl}${path}`;
    console.log(`Отправка ${method} запроса на ${url}`);
    
    const req = https.request(url, options, (res) => {
      let responseData = '';
      
      // Получение Set-Cookie заголовка
      const setCookieHeader = res.headers['set-cookie'];
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = responseData ? JSON.parse(responseData) : {};
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            cookies: setCookieHeader,
            data: parsedData
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            cookies: setCookieHeader,
            rawData: responseData,
            error: e.message
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Основная функция для тестирования
async function testAiAssistant() {
  try {
    // 1. Логин через Telegram (используется вход без пароля)
    console.log('1. Логин пользователя через Telegram...');
    const loginResponse = await makeRequest('POST', '/api/auth/login', {
      username: 'telegram_user',
      displayName: 'Пользователь Telegram'
    });
    
    console.log(`Статус: ${loginResponse.statusCode}`);
    
    if (loginResponse.statusCode !== 200) {
      console.error('Ошибка при логине:', loginResponse.data);
      return;
    }
    
    // Сохраняем куки из ответа
    const cookies = loginResponse.cookies?.join('; ') || '';
    console.log('Куки получены:', cookies ? 'Да' : 'Нет');
    
    // 2. Тест /api/ai-assistant/ask
    console.log('\n2. Тестирование API /api/ai-assistant/ask...');
    const askResponse = await makeRequest('POST', '/api/ai-assistant/ask', {
      question: 'Что такое машинное обучение?'
    }, cookies);
    
    console.log(`Статус: ${askResponse.statusCode}`);
    if (askResponse.statusCode === 200) {
      console.log('Ответ:', askResponse.data?.response?.substring(0, 100) + '...');
    } else {
      console.error('Ошибка при запросе к AI ассистенту:', askResponse.data);
    }
    
    // 3. Тест /api/ai-assistant/hint
    console.log('\n3. Тестирование API /api/ai-assistant/hint...');
    const hintResponse = await makeRequest('GET', '/api/ai-assistant/hint', null, cookies);
    
    console.log(`Статус: ${hintResponse.statusCode}`);
    if (hintResponse.statusCode === 200) {
      console.log('Подсказка:', hintResponse.data?.hint?.substring(0, 100) + '...');
    } else {
      console.error('Ошибка при запросе подсказки:', hintResponse.data);
    }
    
    // 4. Тест /api/ai-assistant/explain (с меньшей сложностью запроса)
    console.log('\n4. Тестирование API /api/ai-assistant/explain...');
    const explainResponse = await makeRequest('POST', '/api/ai-assistant/explain', {
      topicId: 'python-basics', // базовая тема для быстрого ответа
      difficulty: 'easy'    // простое объяснение для быстроты
    }, cookies);
    
    console.log(`Статус: ${explainResponse.statusCode}`);
    if (explainResponse.statusCode === 200) {
      // Полное отображение ответа для анализа сокращенного промпта
      console.log('Объяснение:', explainResponse.data?.explanation);
    } else {
      console.error('Ошибка при запросе объяснения:', explainResponse.data);
    }
    
    console.log('\nТестирование завершено!');
  } catch (error) {
    console.error('Произошла ошибка при выполнении тестов:', error);
  }
}

// Запускаем тестирование
testAiAssistant();
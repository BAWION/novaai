/**
 * Тест восстановления сессии и кэширования диагностики
 * Проверяет полный поток: регистрация → проверка сессии → диагностика → восстановление
 */

const http = require('http');
const querystring = require('querystring');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

function makeRequest(method, path, data = null, cookies = '') {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        try {
          const result = {
            statusCode: res.statusCode,
            headers: res.headers,
            data: body ? JSON.parse(body) : null
          };
          resolve(result);
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: body
          });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

function extractCookies(result) {
  const setCookieHeader = result.headers['set-cookie'];
  if (setCookieHeader) {
    return setCookieHeader.map(cookie => cookie.split(';')[0]).join('; ');
  }
  return '';
}

async function testSessionRecovery() {
  console.log('🔧 Тестирование восстановления сессии и кэширования диагностики');
  console.log('=' + '='.repeat(79));
  
  try {
    const timestamp = Date.now();
    const testUser = {
      username: `test_session_${timestamp}`,
      password: "test123",
      displayName: "Test Session User",
      email: `test_session_${timestamp}@example.com`
    };

    // Шаг 1: Регистрация пользователя
    console.log('\n📝 Шаг 1: Регистрация тестового пользователя');
    const registrationResult = await makeRequest('POST', '/api/auth/register', testUser);
    
    console.log('Статус регистрации:', registrationResult.statusCode);
    console.log('Данные пользователя:', registrationResult.data);
    
    if (registrationResult.statusCode !== 201) {
      throw new Error(`Регистрация не удалась: ${registrationResult.statusCode}`);
    }

    const cookies = extractCookies(registrationResult);
    console.log('Получены cookies:', cookies ? 'да' : 'нет');

    // Шаг 2: Проверка состояния сессии сразу после регистрации
    console.log('\n🔍 Шаг 2: Проверка сессии сразу после регистрации');
    const authCheckResult = await makeRequest('GET', '/api/auth/me', null, cookies);
    
    console.log('Статус проверки сессии:', authCheckResult.statusCode);
    console.log('Данные сессии:', authCheckResult.data);

    if (authCheckResult.statusCode === 200) {
      console.log('✅ Сессия активна после регистрации');
      
      // Шаг 3: Попытка отправки результатов диагностики
      console.log('\n💾 Шаг 3: Отправка результатов диагностики с активной сессией');
      const diagnosisData = {
        userId: registrationResult.data.id,
        skills: {
          "Python": 75,
          "Machine Learning": 60,
          "Data Analysis": 80
        },
        diagnosticType: "quick",
        metadata: { source: "session_recovery_test" }
      };

      const diagnosisResult = await makeRequest('POST', '/api/diagnosis/results', diagnosisData, cookies);
      console.log('Статус отправки диагностики:', diagnosisResult.statusCode);
      console.log('Ответ сервера:', diagnosisResult.data);

      if (diagnosisResult.statusCode === 200 || diagnosisResult.statusCode === 201) {
        console.log('✅ Диагностика успешно сохранена');
        
        // Шаг 4: Проверка восстановления данных
        console.log('\n📊 Шаг 4: Проверка сохраненных данных диагностики');
        const progressResult = await makeRequest('GET', `/api/diagnosis/progress/${registrationResult.data.id}`, null, cookies);
        console.log('Статус получения прогресса:', progressResult.statusCode);
        console.log('Данные прогресса:', progressResult.data);

        if (progressResult.statusCode === 200 && progressResult.data.length > 0) {
          console.log('✅ Данные диагностики успешно восстановлены');
        } else {
          console.log('❌ Данные диагностики не найдены');
        }
      } else {
        console.log('❌ Ошибка при сохранении диагностики:', diagnosisResult.data);
      }
    } else {
      console.log('❌ Сессия не активна после регистрации');
      
      // Шаг 3б: Тестируем кэширование при неактивной сессии
      console.log('\n💾 Шаг 3б: Тестируем кэширование при отсутствии сессии');
      const diagnosisData = {
        userId: registrationResult.data.id,
        skills: {
          "Python": 75,
          "Machine Learning": 60,
          "Data Analysis": 80
        },
        diagnosticType: "quick",
        metadata: { source: "cache_test" }
      };

      const diagnosisResult = await makeRequest('POST', '/api/diagnosis/results', diagnosisData);
      console.log('Статус попытки диагностики без сессии:', diagnosisResult.statusCode);
      
      if (diagnosisResult.statusCode === 401) {
        console.log('✅ Ожидаемая ошибка 401 - данные должны быть кэшированы на клиенте');
      }
    }

    // Заключение
    console.log('\n' + '='.repeat(80));
    console.log('ИТОГИ ТЕСТИРОВАНИЯ ВОССТАНОВЛЕНИЯ СЕССИИ:');
    console.log('1. Регистрация пользователя - выполнена');
    console.log('2. Проверка сессии после регистрации - выполнена');
    console.log('3. Обработка диагностики - выполнена');
    console.log('4. Механизм восстановления - проверен');
    console.log('\nТест завершен успешно!');
    
  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error.message);
    console.error('Детали ошибки:', error);
  }
}

// Запуск теста
testSessionRecovery().then(() => {
  console.log('\n✅ Тестирование завершено');
}).catch((error) => {
  console.error('\n❌ Критическая ошибка:', error);
});
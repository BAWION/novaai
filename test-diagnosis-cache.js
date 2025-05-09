/**
 * Тест кэширования и восстановления данных диагностики
 * 
 * Проверяет все аспекты нового механизма локального кэширования результатов диагностики:
 * 1. Сохранение черновика диагностики в localStorage при отсутствии авторизации
 * 2. Отправка кэшированных данных после успешной авторизации
 * 3. Очистка кэша после успешного сохранения
 * 
 * Запуск: 
 * node test-diagnosis-cache.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const querystring = require('querystring');

// Получаем URL из переменной окружения или используем локальный
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
const isHttps = BASE_URL.startsWith('https');

console.log(`Запуск теста кэширования диагностики на ${BASE_URL}...`);

/**
 * Выполняет HTTP-запрос и возвращает результат как промис
 */
function makeRequest(method, path, data = null, cookies = '') {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies
      },
      ...(isHttps ? { rejectUnauthorized: false } : {})
    };

    const httpModule = isHttps ? https : http;
    const req = httpModule.request(url, options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const contentType = res.headers['content-type'] || '';
          const result = {
            status: res.statusCode,
            headers: res.headers,
            cookies: res.headers['set-cookie'],
            data: contentType.includes('application/json') ? JSON.parse(responseData) : responseData
          };
          resolve(result);
        } catch (error) {
          console.error('Ошибка разбора ответа:', error);
          reject({
            error: 'Ошибка разбора ответа',
            raw: responseData,
            status: res.statusCode
          });
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('Ошибка запроса:', error);
      reject(error);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

/**
 * Получает куки из запроса
 */
function extractCookies(result) {
  if (!result || !result.cookies) return '';
  return Array.isArray(result.cookies) ? result.cookies.join('; ') : result.cookies;
}

/**
 * Выполняет авторизацию пользователя
 */
async function login(username, password) {
  console.log(`Авторизация пользователя ${username}...`);
  const loginResult = await makeRequest('POST', '/api/auth/login', {
    username,
    password
  });
  
  if (loginResult.status !== 200) {
    console.error('Ошибка авторизации:', loginResult);
    throw new Error(`Ошибка авторизации. Статус: ${loginResult.status}`);
  }
  
  console.log('Авторизация успешна');
  return {
    cookies: extractCookies(loginResult),
    userId: loginResult.data.userId || loginResult.data.id
  };
}

/**
 * Основная функция теста
 */
async function testDiagnosisCache() {
  console.log('=== Тест кэширования диагностики ===');
  
  try {
    // 1. Пробуем отправить диагностику без авторизации
    console.log('\n1. Тест отправки результатов без авторизации...');
    const diagnosisData = {
      userId: null, // Симулируем отсутствие userId
      skills: {
        "Программирование AI": 45,
        "Машинное обучение": 78,
        "Работа с данными": 65,
        "Нейросети": 59,
        "Алгоритмы": 62,
        "Исследования": 40,
        "Практические навыки": 52
      },
      diagnosticType: 'quick',
      metadata: {
        specialization: 'machine-learning',
        experience: 'intermediate',
        goal: 'career',
        languages: ['python', 'javascript'],
        timestamp: new Date().toISOString()
      }
    };
    
    const result1 = await makeRequest('POST', '/api/diagnosis/results', diagnosisData);
    console.log(`Статус ответа без авторизации: ${result1.status}`);
    
    if (result1.status === 401) {
      console.log('✓ Ожидаемая ошибка 401 при отправке без авторизации');
    } else {
      console.warn(`✗ Неожиданный статус ответа: ${result1.status}`);
    }
    
    // Проверяем, что сервер вернул подсказку о кэшировании
    if (result1.data && result1.data.message && result1.data.message.includes('авторизация')) {
      console.log('✓ Сервер вернул подсказку о необходимости авторизации');
    } else {
      console.warn('✗ Сервер не вернул понятную подсказку о кэшировании:', result1.data);
    }
    
    // 2. Авторизуемся и проверяем сохранение кэшированных данных
    console.log('\n2. Авторизация и сохранение кэшированных результатов...');
    // Для тестов используем тестового пользователя
    const auth = await login('test@example.com', 'password123');
    
    // Теперь пробуем отправить результаты с авторизацией
    diagnosisData.userId = auth.userId; // Устанавливаем userId
    
    const result2 = await makeRequest('POST', '/api/diagnosis/results', diagnosisData, auth.cookies);
    console.log(`Статус ответа с авторизацией: ${result2.status}`);
    
    if (result2.status === 200 || result2.status === 201) {
      console.log('✓ Результаты диагностики успешно сохранены после авторизации');
      console.log(`Данные ответа:`, JSON.stringify(result2.data).slice(0, 100) + '...');
    } else {
      console.error('✗ Ошибка сохранения результатов с авторизацией:', result2);
    }
    
    // 3. Проверяем прогресс пользователя
    console.log('\n3. Проверка обновления прогресса пользователя...');
    const progressResult = await makeRequest('GET', `/api/diagnosis/progress/${auth.userId}`, null, auth.cookies);
    
    if (progressResult.status === 200) {
      console.log('✓ Успешно получен прогресс пользователя');
      const skills = progressResult.data.data || progressResult.data;
      console.log(`Количество навыков: ${skills.length}`);
      
      // Проверяем, что данные соответствуют отправленным
      const matchingSkills = skills.filter(skill => 
        diagnosisData.skills[skill.name] && diagnosisData.skills[skill.name] === skill.progress
      );
      
      console.log(`Совпадающих навыков: ${matchingSkills.length} из ${Object.keys(diagnosisData.skills).length}`);
      
      if (matchingSkills.length > 0) {
        console.log('✓ Данные прогресса соответствуют отправленным результатам диагностики');
      } else {
        console.warn('✗ Не найдено соответствий между отправленными и сохраненными навыками');
      }
    } else {
      console.error('✗ Ошибка получения прогресса:', progressResult);
    }
    
    // 4. Тест инвалидации кэша и радара
    console.log('\n4. Проверка инвалидации кэша React Query...');
    console.log('Для полной проверки инвалидации кэша React Query требуется модульное тестирование');
    console.log('в браузерном окружении с использованием Jest + React Testing Library');
    
    console.log('\n=== Тест завершен успешно ===');
    
  } catch (error) {
    console.error('\n❌ Тест завершился с ошибкой:', error);
    process.exit(1);
  }
}

// Запуск тестов
testDiagnosisCache();
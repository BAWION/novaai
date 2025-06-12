/**
 * Скрипт для создания тестового пользователя
 * Позволяет быстро протестировать функциональность диагностики
 */

import http from 'http';

const BASE_URL = 'http://localhost:3000';

// Утилита для HTTP запросов
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null;
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (postData) {
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (postData) {
      req.write(postData);
    }
    
    req.end();
  });
}

async function createTestUser() {
  console.log('🚀 Создание тестового пользователя для демонстрации диагностики\n');
  
  try {
    // Данные тестового пользователя
    const testUserData = {
      username: "testuser",
      password: "password123",
      email: "test@novaai.ru",
      displayName: "Тестовый пользователь",
      profileData: {
        role: "student",
        pythonLevel: 2,
        experience: "beginner",
        interest: "machine-learning",
        goal: "career-change",
        industry: "technology",
        jobTitle: "Студент",
        specificGoals: ["Изучить основы машинного обучения", "Получить навыки программирования"],
        preferredLearningStyle: "interactive",
        availableTimePerWeek: 10,
        preferredDifficulty: "beginner"
      }
    };

    console.log('📝 Регистрируем тестового пользователя...');
    
    const registerResponse = await makeRequest('POST', '/api/auth/register-with-profile', testUserData);
    
    if (registerResponse.statusCode === 201) {
      console.log('✅ Тестовый пользователь успешно создан!');
      const userData = JSON.parse(registerResponse.body);
      console.log(`   ID: ${userData.id}`);
      console.log(`   Имя: ${userData.displayName}`);
      console.log(`   Username: ${userData.username}`);
      
      console.log('\n📋 Инструкции для тестирования:');
      console.log('1. Откройте страницу входа: http://localhost:3000/login');
      console.log('2. Введите данные:');
      console.log(`   Логин: ${testUserData.username}`);
      console.log(`   Пароль: ${testUserData.password}`);
      console.log('3. После входа перейдите к диагностике Skills DNA');
      console.log('4. Все персонализированные данные будут отображаться корректно');
      
    } else {
      console.log('❌ Ошибка при создании пользователя:', registerResponse.statusCode);
      
      if (registerResponse.statusCode === 400) {
        const errorData = JSON.parse(registerResponse.body);
        if (errorData.message && errorData.message.includes('already exists')) {
          console.log('✅ Пользователь уже существует, можно использовать для тестирования');
          console.log('\n📋 Данные для входа:');
          console.log(`   Логин: ${testUserData.username}`);
          console.log(`   Пароль: ${testUserData.password}`);
          console.log('   URL: http://localhost:3000/login');
        } else {
          console.log('Детали ошибки:', errorData);
        }
      } else {
        console.log('Ответ сервера:', registerResponse.body);
      }
    }
    
  } catch (error) {
    console.error('Ошибка при создании тестового пользователя:', error.message);
  }
}

// Запуск создания тестового пользователя
createTestUser().catch(console.error);
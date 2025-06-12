/**
 * Специальный тест для диагностики ошибки обновления профиля
 */

const http = require('http');

function makeRequest(method, path, data = null, cookies = '') {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': cookies
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const data = responseData ? JSON.parse(responseData) : {};
          resolve({
            status: res.statusCode,
            data,
            headers: res.headers,
            cookies: res.headers['set-cookie'] || []
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data: responseData,
            headers: res.headers,
            cookies: res.headers['set-cookie'] || []
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

function extractCookies(response) {
  const cookies = response.cookies;
  if (cookies && cookies.length > 0) {
    return cookies.map(cookie => cookie.split(';')[0]).join('; ');
  }
  return '';
}

async function testProfileUpdate() {
  try {
    console.log("=== Тест обновления профиля ===");
    
    // Создаем тестового пользователя
    const username = `test_profile_${Date.now()}`;
    const registrationData = {
      user: {
        username,
        password: 'testpass123',
        email: `${username}@test.com`,
        displayName: 'Profile Test User'
      },
      profile: {
        role: 'student',
        pythonLevel: 2,
        experience: 'beginner',
        interest: 'web-development',
        goal: 'career-change',
        industry: 'technology',
        jobTitle: 'Developer',
        specificGoals: ['learn_python'],
        preferredLearningStyle: 'visual',
        availableTimePerWeek: 5,
        preferredDifficulty: 'easy'
      }
    };
    
    console.log("1. Регистрация пользователя...");
    const regResponse = await makeRequest('POST', '/api/auth/register-and-profile', registrationData);
    console.log(`Статус регистрации: ${regResponse.status}`);
    
    if (regResponse.status !== 201) {
      console.error("Ошибка регистрации:", regResponse.data);
      return;
    }
    
    const cookies = extractCookies(regResponse);
    console.log("✓ Пользователь зарегистрирован");
    
    // Получаем текущий профиль
    console.log("\n2. Получение текущего профиля...");
    const profileResponse = await makeRequest('GET', '/api/profile', null, cookies);
    console.log(`Статус получения профиля: ${profileResponse.status}`);
    
    if (profileResponse.status !== 200) {
      console.error("Ошибка получения профиля:", profileResponse.data);
      return;
    }
    
    console.log("Текущий профиль:", JSON.stringify(profileResponse.data, null, 2));
    
    // Обновляем профиль
    console.log("\n3. Обновление профиля...");
    const updateData = {
      pythonLevel: 3,
      experience: 'intermediate',
      goal: 'skill-upgrade'
    };
    
    const updateResponse = await makeRequest('PATCH', '/api/profile', updateData, cookies);
    console.log(`Статус обновления профиля: ${updateResponse.status}`);
    
    if (updateResponse.status !== 200) {
      console.error("Ошибка обновления профиля:", updateResponse.data);
      console.error("Данные для обновления:", JSON.stringify(updateData, null, 2));
    } else {
      console.log("✓ Профиль успешно обновлен");
      console.log("Обновленный профиль:", JSON.stringify(updateResponse.data, null, 2));
    }
    
  } catch (error) {
    console.error("Ошибка выполнения теста:", error);
  }
}

testProfileUpdate();
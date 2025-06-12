/**
 * Комплексное тестирование основных образовательных функций NovaAI University
 * Проверяет все ключевые API эндпоинты и функции для учащихся
 */

import http from 'http';
import querystring from 'querystring';

const BASE_URL = 'http://localhost:3000';

// Утилита для HTTP запросов
function makeRequest(method, path, data = null, cookies = '') {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : null;
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies
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

// Функция извлечения cookies
function extractCookies(response) {
  const setCookie = response.headers['set-cookie'];
  if (!setCookie) return '';
  
  return setCookie.map(cookie => cookie.split(';')[0]).join('; ');
}

// Тестирование функций платформы
async function testPlatformFunctions() {
  console.log('🚀 Начинаю комплексное тестирование платформы NovaAI University\n');
  
  const results = {
    authentication: { status: 'unknown', details: [] },
    courses: { status: 'unknown', details: [] },
    skillsDNA: { status: 'unknown', details: [] },
    diagnosis: { status: 'unknown', details: [] },
    labHub: { status: 'unknown', details: [] },
    aiAssistant: { status: 'unknown', details: [] },
    progress: { status: 'unknown', details: [] }
  };

  try {
    // 1. ТЕСТИРОВАНИЕ СИСТЕМЫ АУТЕНТИФИКАЦИИ
    console.log('📝 1. Тестирование системы аутентификации');
    
    // Проверка статуса пользователя
    const authStatus = await makeRequest('GET', '/api/auth/me');
    console.log(`   Статус аутентификации: ${authStatus.statusCode}`);
    results.authentication.details.push(`Проверка статуса: ${authStatus.statusCode}`);
    
    if (authStatus.statusCode === 401) {
      results.authentication.status = 'working';
      results.authentication.details.push('Система корректно требует аутентификацию');
    }

    // 2. ТЕСТИРОВАНИЕ КАТАЛОГА КУРСОВ
    console.log('\n📚 2. Тестирование каталога курсов');
    
    const coursesResponse = await makeRequest('GET', '/api/courses');
    console.log(`   Загрузка курсов: ${coursesResponse.statusCode}`);
    results.courses.details.push(`Загрузка каталога: ${coursesResponse.statusCode}`);
    
    if (coursesResponse.statusCode === 200) {
      try {
        const courses = JSON.parse(coursesResponse.body);
        console.log(`   Найдено курсов: ${courses.length}`);
        results.courses.details.push(`Доступно курсов: ${courses.length}`);
        
        if (courses.length > 0) {
          const sampleCourse = courses[0];
          console.log(`   Пример курса: "${sampleCourse.title}"`);
          results.courses.details.push(`Пример: "${sampleCourse.title}"`);
          results.courses.status = 'working';
        } else {
          results.courses.status = 'empty';
        }
      } catch (e) {
        results.courses.status = 'error';
        results.courses.details.push('Ошибка парсинга JSON');
      }
    } else {
      results.courses.status = 'error';
    }

    // 3. ТЕСТИРОВАНИЕ SKILLS DNA
    console.log('\n🧬 3. Тестирование Skills DNA');
    
    const skillsMapResponse = await makeRequest('GET', '/api/skills/map');
    console.log(`   Карта навыков: ${skillsMapResponse.statusCode}`);
    results.skillsDNA.details.push(`Карта навыков: ${skillsMapResponse.statusCode}`);
    
    const userSkillsResponse = await makeRequest('GET', '/api/skills/user');
    console.log(`   Навыки пользователя: ${userSkillsResponse.statusCode}`);
    results.skillsDNA.details.push(`Навыки пользователя: ${userSkillsResponse.statusCode}`);
    
    if (userSkillsResponse.statusCode === 200) {
      results.skillsDNA.status = 'working';
    } else {
      results.skillsDNA.status = 'error';
    }

    // 4. ТЕСТИРОВАНИЕ ДИАГНОСТИКИ
    console.log('\n🔍 4. Тестирование системы диагностики');
    
    // Тестируем демо-режим диагностики
    const diagnosisDemo = await makeRequest('GET', '/api/diagnosis/progress/999');
    console.log(`   Диагностика (демо): ${diagnosisDemo.statusCode}`);
    results.diagnosis.details.push(`Демо-режим: ${diagnosisDemo.statusCode}`);
    
    const diagnosisSummary = await makeRequest('GET', '/api/diagnosis/summary/999');
    console.log(`   Сводка диагностики: ${diagnosisSummary.statusCode}`);
    results.diagnosis.details.push(`Сводка: ${diagnosisSummary.statusCode}`);
    
    if (diagnosisDemo.statusCode === 200 || diagnosisSummary.statusCode === 200) {
      results.diagnosis.status = 'working';
    } else {
      results.diagnosis.status = 'error';
    }

    // 5. ТЕСТИРОВАНИЕ LAB HUB
    console.log('\n🧪 5. Тестирование Lab Hub');
    
    // Lab Hub обычно статичный контент
    results.labHub.status = 'static';
    results.labHub.details.push('Статический контент, требует проверки UI');

    // 6. ТЕСТИРОВАНИЕ AI АССИСТЕНТА
    console.log('\n🤖 6. Тестирование AI ассистента');
    
    const aiChatResponse = await makeRequest('GET', '/api/ai-assistant/conversations');
    console.log(`   История чата: ${aiChatResponse.statusCode}`);
    results.aiAssistant.details.push(`История: ${aiChatResponse.statusCode}`);
    
    if (aiChatResponse.statusCode === 200 || aiChatResponse.statusCode === 401) {
      results.aiAssistant.status = 'working';
    } else {
      results.aiAssistant.status = 'error';
    }

    // 7. ТЕСТИРОВАНИЕ ПРОГРЕССА ОБУЧЕНИЯ
    console.log('\n📊 7. Тестирование системы прогресса');
    
    const userProgressResponse = await makeRequest('GET', '/api/courses/user');
    console.log(`   Прогресс пользователя: ${userProgressResponse.statusCode}`);
    results.progress.details.push(`Прогресс курсов: ${userProgressResponse.statusCode}`);
    
    const timelineResponse = await makeRequest('GET', '/api/learning-events/timeline');
    console.log(`   Временная линия: ${timelineResponse.statusCode}`);
    results.progress.details.push(`Временная линия: ${timelineResponse.statusCode}`);
    
    if (timelineResponse.statusCode === 200) {
      results.progress.status = 'working';
    } else if (userProgressResponse.statusCode === 401) {
      results.progress.status = 'requires_auth';
    } else {
      results.progress.status = 'error';
    }

  } catch (error) {
    console.error('Ошибка при тестировании:', error.message);
  }

  // ОТЧЕТ О РЕЗУЛЬТАТАХ
  console.log('\n' + '='.repeat(60));
  console.log('📋 ИТОГОВЫЙ ОТЧЕТ ПО ФУНКЦИОНАЛЬНОСТИ ПЛАТФОРМЫ');
  console.log('='.repeat(60));
  
  Object.entries(results).forEach(([component, result]) => {
    const statusEmoji = {
      'working': '✅',
      'requires_auth': '🔐',
      'static': '📄',
      'empty': '⚠️',
      'error': '❌',
      'unknown': '❓'
    };
    
    console.log(`\n${statusEmoji[result.status]} ${component.toUpperCase()}: ${result.status}`);
    result.details.forEach(detail => {
      console.log(`   ${detail}`);
    });
  });

  console.log('\n' + '='.repeat(60));
  console.log('📌 РЕЗЮМЕ:');
  
  const workingComponents = Object.values(results).filter(r => r.status === 'working').length;
  const totalComponents = Object.keys(results).length;
  
  console.log(`Работающих компонентов: ${workingComponents}/${totalComponents}`);
  
  // Рекомендации
  console.log('\n🔧 РЕКОМЕНДАЦИИ ПО УЛУЧШЕНИЮ:');
  
  if (results.courses.status === 'empty') {
    console.log('• Добавить курсы в базу данных');
  }
  
  if (results.diagnosis.status === 'error') {
    console.log('• Проверить API диагностики и базу данных');
  }
  
  if (results.aiAssistant.status === 'error') {
    console.log('• Настроить OpenAI API ключ для AI ассистента');
  }
  
  console.log('\n✨ Тестирование завершено!');
}

// Запуск тестирования
testPlatformFunctions().catch(console.error);
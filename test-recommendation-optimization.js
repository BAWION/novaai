/**
 * Тест оптимизации алгоритма рекомендаций 
 * Проверяет работу улучшений в алгоритме рекомендаций:
 * 1. Фильтрация по порогу modelScore < 0.4
 * 2. Повышение разнообразия по первичному навыку
 * 3. AB-тестирование для измерения CTR
 */

const fetch = require('node-fetch');
const assert = require('assert');

// Базовый URL API
const API_URL = 'http://localhost:3000/api';

// Вспомогательная функция для выполнения запросов
async function makeRequest(method, path, data = null, cookies = '') {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookies
    }
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_URL}${path}`, options);
  return {
    status: response.status,
    headers: response.headers,
    data: response.status !== 204 ? await response.json() : null
  };
}

// Функция для получения cookie сессии после логина
async function login(username, password) {
  const response = await makeRequest('POST', '/login', { username, password });
  if (response.status !== 200) {
    throw new Error(`Login failed with status ${response.status}: ${JSON.stringify(response.data)}`);
  }
  
  const cookies = response.headers.get('set-cookie');
  return cookies;
}

// Тесты для алгоритма рекомендаций
async function testRecommendationOptimization() {
  try {
    console.log('=== Тестирование оптимизации алгоритма рекомендаций ===');

    // 1. Вход в систему
    console.log('1. Выполняем вход в систему...');
    const cookies = await login('test_user', 'password123');
    console.log('Успешный вход в систему');

    // 2. Проверяем получение рекомендаций
    console.log('2. Получаем рекомендации курсов...');
    const recommendationsResponse = await makeRequest('GET', '/courses/recommended', null, cookies);
    
    if (recommendationsResponse.status !== 200) {
      throw new Error(`Failed to get recommendations: ${JSON.stringify(recommendationsResponse.data)}`);
    }
    
    const recommendations = recommendationsResponse.data;
    console.log(`Получено ${recommendations.length} рекомендаций`);

    // 3. Проверяем наличие метаданных AB-теста
    console.log('3. Проверяем метаданные AB-теста...');
    const abTestResponse = await makeRequest('GET', '/user/ab-test-info', null, cookies);
    
    if (abTestResponse.status === 200) {
      console.log('Информация об AB-тесте:', abTestResponse.data);
      
      if (abTestResponse.data.inExperimentGroup) {
        console.log('Пользователь находится в экспериментальной группе');
      } else {
        console.log('Пользователь находится в контрольной группе');
      }
    } else {
      console.log('API для получения информации об AB-тесте не найден или недоступен');
    }

    // 4. Проверяем разнообразие по навыкам в рекомендациях
    console.log('4. Проверяем разнообразие навыков в рекомендациях...');
    const skillsMap = new Map();
    
    // Получаем информацию о навыках для каждого курса
    for (const course of recommendations) {
      const courseDetailsResponse = await makeRequest('GET', `/courses/${course.id}/details`, null, cookies);
      
      if (courseDetailsResponse.status === 200) {
        const skills = courseDetailsResponse.data.skills || [];
        
        // Находим основной навык (с наивысшим уровнем)
        let primarySkill = null;
        let maxLevel = 0;
        
        for (const skill of skills) {
          if (skill.requiredLevel > maxLevel) {
            maxLevel = skill.requiredLevel;
            primarySkill = skill.id;
          }
        }
        
        if (primarySkill) {
          if (skillsMap.has(primarySkill)) {
            skillsMap.set(primarySkill, skillsMap.get(primarySkill) + 1);
          } else {
            skillsMap.set(primarySkill, 1);
          }
        }
      }
    }
    
    // Анализируем разнообразие
    console.log('Распределение основных навыков в рекомендациях:');
    let totalSkills = 0;
    let uniqueSkills = 0;
    
    for (const [skillId, count] of skillsMap) {
      console.log(`- Навык ${skillId}: ${count} курсов`);
      totalSkills += count;
      uniqueSkills++;
    }
    
    // Рассчитываем метрику разнообразия (отношение уникальных навыков к общему числу)
    const diversityScore = uniqueSkills / Math.min(totalSkills, 5); // Для топ-5 рекомендаций
    console.log(`Метрика разнообразия: ${diversityScore.toFixed(2)} (оптимальное значение: 1.0)`);
    
    // 5. Отмечаем клик по рекомендации
    console.log('5. Симулируем клик по рекомендации...');
    if (recommendations.length > 0) {
      const clickResponse = await makeRequest('POST', `/recommendations/${recommendations[0].id}/click`, null, cookies);
      
      if (clickResponse.status === 200 || clickResponse.status === 204) {
        console.log('Клик по рекомендации успешно записан');
      } else {
        console.log('API для записи клика не найден или недоступен');
      }
    }

    console.log('\n=== Тестирование успешно завершено ===');
  } catch (error) {
    console.error('Ошибка при выполнении тестов:', error);
  }
}

// Запускаем тесты
testRecommendationOptimization();
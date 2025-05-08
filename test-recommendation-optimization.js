/**
 * Тест оптимизации алгоритма рекомендаций 
 * Проверяет работу улучшений в алгоритме рекомендаций:
 * 1. Фильтрация по порогу modelScore < 0.4
 * 2. Повышение разнообразия по первичному навыку
 * 3. AB-тестирование для измерения CTR
 */

import fetch from 'node-fetch';

async function makeRequest(method, path, data = null, cookies = '') {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookies
    },
    body: data ? JSON.stringify(data) : undefined
  };

  // Determine the base URL based on environment
  let baseUrl;
  if (process.env.REPLIT_DEPLOYMENT) {
    // Use Replit deployment URL
    baseUrl = `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`;
  } else if (process.env.REPL_SLUG && process.env.REPL_ID) {
    // Use Replit dev URL
    baseUrl = `https://${process.env.REPL_ID}-00-${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`;
  } else {
    // Default to localhost for local development
    baseUrl = 'https://' + process.env.REPLIT_URL || 'http://localhost:3000';
  }
  const response = await fetch(`${baseUrl}${path}`, options);
  
  if (response.status >= 400) {
    const errorText = await response.text();
    console.error(`[${method} ${path}] Ошибка ${response.status}: ${errorText}`);
    throw new Error(`Request failed with status ${response.status}: ${errorText}`);
  }
  
  const setCookieHeader = response.headers.get('set-cookie');
  
  // Обрабатываем только JSON-ответы
  try {
    const data = await response.json();
    return { data, cookies: setCookieHeader };
  } catch (e) {
    // Если ответ не содержит JSON
    const text = await response.text();
    return { data: { text }, cookies: setCookieHeader };
  }
}

async function login(username, password) {
  const { data, cookies } = await makeRequest('POST', '/api/auth/login', {
    username,
    password
  });
  
  console.log(`Вход выполнен для пользователя: ${username}`);
  return { user: data, cookies };
}

async function testRecommendationOptimization() {
  try {
    console.log("=== Начало теста оптимизации рекомендаций ===");
    
    // Шаг 1: Вход в систему
    console.log("\n1. Вход в систему");
    const { user, cookies } = await login("Vitaliy", "500500В");
    console.log(`Успешный вход: ID ${user.id}, ${user.username}`);
    
    // Шаг 2: Получение рекомендаций без оптимизации (для сравнения)
    console.log("\n2. Получение базовых рекомендаций (без оптимизации)");
    try {
      const { data: baseRecommendations } = await makeRequest(
        'GET', 
        '/api/courses/recommended?optimized=false', 
        null, 
        cookies
      );
      
      console.log(`Получено ${baseRecommendations.length} базовых рекомендаций`);
      console.log("Примеры базовых рекомендаций:");
      baseRecommendations.slice(0, 3).forEach(rec => {
        console.log(`- ${rec.title} (modelScore: ${rec.modelScore?.toFixed(2) || 'N/A'}, primarySkill: ${rec.primarySkill || 'N/A'})`);
      });
      
      // Собираем статистику по базовым рекомендациям
      const baseStats = analyzeRecommendations(baseRecommendations);
      console.log("\nСтатистика базовых рекомендаций:");
      console.log(`- Средний modelScore: ${baseStats.avgModelScore.toFixed(2)}`);
      console.log(`- Мин. modelScore: ${baseStats.minModelScore.toFixed(2)}`);
      console.log(`- Кол-во рекомендаций с modelScore < 0.4: ${baseStats.belowThresholdCount}`);
      console.log(`- Разнообразие primarySkill: ${baseStats.uniquePrimarySkills.size} уникальных навыков`);
      console.log(`- Топ навыков: ${Array.from(baseStats.skillFrequency.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([skill, count]) => `${skill} (${count})`)
        .join(', ')}`);
      
      // Шаг 3: Получение оптимизированных рекомендаций
      console.log("\n3. Получение оптимизированных рекомендаций");
      const { data: optimizedRecommendations } = await makeRequest(
        'GET', 
        '/api/courses/recommended?optimized=true', 
        null, 
        cookies
      );
      
      console.log(`Получено ${optimizedRecommendations.length} оптимизированных рекомендаций`);
      console.log("Примеры оптимизированных рекомендаций:");
      optimizedRecommendations.slice(0, 3).forEach(rec => {
        console.log(`- ${rec.title} (modelScore: ${rec.modelScore?.toFixed(2) || 'N/A'}, primarySkill: ${rec.primarySkill || 'N/A'})`);
      });
      
      // Собираем статистику по оптимизированным рекомендациям
      const optimizedStats = analyzeRecommendations(optimizedRecommendations);
      console.log("\nСтатистика оптимизированных рекомендаций:");
      console.log(`- Средний modelScore: ${optimizedStats.avgModelScore.toFixed(2)}`);
      console.log(`- Мин. modelScore: ${optimizedStats.minModelScore.toFixed(2)}`);
      console.log(`- Кол-во рекомендаций с modelScore < 0.4: ${optimizedStats.belowThresholdCount}`);
      console.log(`- Разнообразие primarySkill: ${optimizedStats.uniquePrimarySkills.size} уникальных навыков`);
      console.log(`- Топ навыков: ${Array.from(optimizedStats.skillFrequency.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([skill, count]) => `${skill} (${count})`)
        .join(', ')}`);
      
      // Шаг 4: Проверка статуса AB-теста для пользователя
      console.log("\n4. Проверка статуса AB-теста");
      const { data: abTestStatus } = await makeRequest(
        'GET', 
        '/api/ab-test/recommendation_diversity', 
        null, 
        cookies
      );
      
      console.log(`Пользователь ${abTestStatus.isInExperimentGroup ? 'включен' : 'не включен'} в эксперимент "${abTestStatus.experimentName}"`);
      
      // Шаг 5: Логирование события взаимодействия с рекомендацией
      console.log("\n5. Логирование события взаимодействия (клик на рекомендацию)");
      
      if (optimizedRecommendations.length > 0) {
        const recommendation = optimizedRecommendations[0];
        await makeRequest(
          'POST',
          `/api/ab-test/recommendation_diversity/event`,
          {
            eventType: "click",
            metadata: {
              recommendationId: recommendation.id,
              modelScore: recommendation.modelScore,
              primarySkill: recommendation.primarySkill
            }
          },
          cookies
        );
        
        console.log(`Событие "click" зарегистрировано для рекомендации "${recommendation.title}"`);
      }
      
      // Шаг 6: Получение общей статистики для эксперимента
      console.log("\n6. Получение статистики по эксперименту");
      const { data: experimentStats } = await makeRequest(
        'GET',
        `/api/ab-test/recommendation_diversity/stats`,
        null,
        cookies
      );
      
      console.log("Статистика эксперимента:");
      console.log(`- Всего пользователей в эксперименте: ${experimentStats.totalUsersInExperiment || 0}`);
      console.log(`- Всего пользователей в контрольной группе: ${experimentStats.totalUsersInControl || 0}`);
      console.log(`- Метрика CTR в экспериментальной группе: ${experimentStats.experimentClickThroughRate?.toFixed(4) || 'N/A'}`);
      console.log(`- Метрика CTR в контрольной группе: ${experimentStats.controlClickThroughRate?.toFixed(4) || 'N/A'}`);
      
      console.log("\n=== Тест оптимизации рекомендаций завершен успешно ===");
      
      // Возвращаем полный результат для дальнейшего анализа
      return {
        baseRecommendations,
        baseStats,
        optimizedRecommendations,
        optimizedStats,
        abTestStatus,
        experimentStats
      };
      
    } catch (error) {
      console.error("\nОшибка при получении рекомендаций:", error.message);
    }
    
  } catch (error) {
    console.error("Критическая ошибка в тесте:", error);
  }
}

// Функция для анализа рекомендаций и расчета статистики
function analyzeRecommendations(recommendations) {
  // Фильтруем рекомендации, у которых есть modelScore
  const recsWithScore = recommendations.filter(rec => rec.modelScore !== undefined && rec.modelScore !== null);
  
  if (recsWithScore.length === 0) {
    return {
      avgModelScore: 0,
      minModelScore: 0,
      belowThresholdCount: 0,
      uniquePrimarySkills: new Set(),
      skillFrequency: new Map()
    };
  }
  
  // Рассчитываем средний modelScore
  const totalScore = recsWithScore.reduce((sum, rec) => sum + rec.modelScore, 0);
  const avgModelScore = totalScore / recsWithScore.length;
  
  // Находим минимальный modelScore
  const minModelScore = Math.min(...recsWithScore.map(rec => rec.modelScore));
  
  // Считаем количество рекомендаций ниже порога 0.4
  const belowThresholdCount = recsWithScore.filter(rec => rec.modelScore < 0.4).length;
  
  // Анализируем разнообразие по primarySkill
  const uniquePrimarySkills = new Set();
  const skillFrequency = new Map();
  
  recommendations.forEach(rec => {
    if (rec.primarySkill) {
      uniquePrimarySkills.add(rec.primarySkill);
      
      const count = skillFrequency.get(rec.primarySkill) || 0;
      skillFrequency.set(rec.primarySkill, count + 1);
    }
  });
  
  return {
    avgModelScore,
    minModelScore,
    belowThresholdCount,
    uniquePrimarySkills,
    skillFrequency
  };
}

// Запуск теста
testRecommendationOptimization()
  .then(results => {
    if (results) {
      // Можно добавить дополнительный анализ результатов
      
      // Вычисление улучшения по разнообразию навыков
      const diversityImprovement = results.optimizedStats.uniquePrimarySkills.size - 
                                  results.baseStats.uniquePrimarySkills.size;
      
      console.log("\nИтоговый анализ оптимизации:");
      console.log(`- Улучшение разнообразия навыков: ${diversityImprovement > 0 ? '+' : ''}${diversityImprovement} уникальных навыков`);
      
      // Вычисление повышения среднего качества рекомендаций
      const qualityImprovement = results.optimizedStats.avgModelScore - results.baseStats.avgModelScore;
      console.log(`- Изменение среднего качества рекомендаций: ${qualityImprovement > 0 ? '+' : ''}${qualityImprovement.toFixed(2)}`);
      
      // Процент отфильтрованных низкокачественных рекомендаций
      const filteredPercentage = results.baseStats.belowThresholdCount > 0 
        ? ((results.baseStats.belowThresholdCount - results.optimizedStats.belowThresholdCount) / results.baseStats.belowThresholdCount * 100)
        : 0;
      
      console.log(`- Отфильтровано низкокачественных рекомендаций: ${filteredPercentage.toFixed(1)}%`);
    }
  })
  .catch(error => {
    console.error("Ошибка при выполнении теста:", error);
  });
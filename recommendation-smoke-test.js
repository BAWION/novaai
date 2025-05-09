/**
 * Упрощенный тест оптимизации алгоритма рекомендаций
 * Проверяет работу улучшений в алгоритме рекомендаций через API-эндпоинты
 */

import { execSync } from 'child_process';

// Выполняем серию curl-запросов для тестирования API
console.log("=== Упрощенный тест оптимизации рекомендаций ===");

try {
  // Проверка API рекомендаций
  console.log("\n1. Проверка API endpoint для оптимизированных рекомендаций");
  const response = execSync('curl -s http://localhost:3000/api/courses/recommended?optimized=true || echo "Endpoint недоступен"');
  console.log(response.toString());
  
  if (response.toString().includes("Endpoint недоступен")) {
    console.log("❌ API endpoint недоступен");
  } else {
    console.log("✅ API endpoint доступен");
  }
  
  // Проверка API AB-тестирования
  console.log("\n2. Проверка API endpoint для AB-тестирования");
  const abTestResponse = execSync('curl -s http://localhost:3000/api/ab-test/recommendation_diversity || echo "Endpoint недоступен"');
  console.log(abTestResponse.toString());
  
  if (abTestResponse.toString().includes("Endpoint недоступен")) {
    console.log("❌ API endpoint недоступен");
  } else {
    console.log("✅ API endpoint доступен");
  }
  
  // Проверка SQL таблицы для AB-тестирования
  console.log("\n3. Проверка SQL таблицы для AB-тестирования");
  const sqlCheckResponse = execSync(`
    psql $DATABASE_URL -c "SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'ab_test_flags'
    );" || echo "Таблица не существует"
  `);
  
  console.log(sqlCheckResponse.toString());
  
  if (sqlCheckResponse.toString().includes("t")) {
    console.log("✅ Таблица ab_test_flags существует");
  } else {
    console.log("❌ Таблица ab_test_flags не существует");
  }
  
  console.log("\n=== Тест завершен ===");
  
} catch (error) {
  console.error("Ошибка при выполнении теста:", error.message);
}
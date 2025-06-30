/**
 * test-smart-quest.ts
 * 
 * Скрипт для тестирования функциональности S3 (SMART QUEST)
 * Этот скрипт позволяет проверить работу модели рекомендаций LightGBM
 * и включить функциональность S3 для тестирования
 */

import { db } from "../db";
import { mlService } from "../services";
import { lightgbmBridge } from "../services/lightgbm-bridge";
import { featureFlags, users, userProfiles } from "@shared/schema";
import { eq } from "drizzle-orm";
import { storage } from "../storage";
import { MLStorage } from "../storage-ml";

/**
 * Функция для включения или отключения функциональности S3 (SMART QUEST)
 */
async function toggleSmartQuest(enable: boolean) {
  try {
    // Проверяем, существует ли флаг
    const [smartQuestFlag] = await db
      .select()
      .from(featureFlags)
      .where(eq(featureFlags.name, "smart_quest"));
    
    const status = enable ? "enabled" : "disabled";
    
    if (smartQuestFlag) {
      // Обновляем существующий флаг
      await db
        .update(featureFlags)
        .set({ 
          status,
          updatedAt: new Date()
        })
        .where(eq(featureFlags.id, smartQuestFlag.id));
        
      console.log(`S3 (SMART QUEST) теперь ${enable ? 'включен' : 'отключен'}`);
    } else {
      // Создаем новый флаг
      await db
        .insert(featureFlags)
        .values({
          name: "smart_quest",
          description: "Функциональность S3 (SMART QUEST) для рекомендаций с LightGBM",
          status,
          rolloutPercentage: enable ? 100 : 0,
          targetAudience: JSON.stringify({ allUsers: true }),
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
      console.log(`S3 (SMART QUEST) создан и ${enable ? 'включен' : 'отключен'}`);
    }
    
    // Проверяем, существует ли флаг course_recommendations
    const [courseRecsFlag] = await db
      .select()
      .from(featureFlags)
      .where(eq(featureFlags.name, "course_recommendations"));
    
    if (courseRecsFlag) {
      // Обновляем существующий флаг
      await db
        .update(featureFlags)
        .set({ 
          status: "enabled", // Всегда включаем, так как это базовая функциональность
          updatedAt: new Date()
        })
        .where(eq(featureFlags.id, courseRecsFlag.id));
    } else {
      // Создаем новый флаг
      await db
        .insert(featureFlags)
        .values({
          name: "course_recommendations",
          description: "Рекомендации курсов для пользователей",
          status: "enabled",
          rolloutPercentage: 100,
          targetAudience: JSON.stringify({ allUsers: true }),
          createdAt: new Date(),
          updatedAt: new Date()
        });
    }
    
    return true;
  } catch (error) {
    console.error("Ошибка при изменении статуса S3 (SMART QUEST):", error);
    return false;
  }
}

/**
 * Тестирование базовой модели рекомендаций
 */
async function testBasicModel() {
  try {
    console.log("Создание и тестирование базовой модели рекомендаций...");
    
    // Инициализация MLStorage
    const mlStorage = new MLStorage();
    
    // Проверяем, существует ли уже активная модель рекомендаций
    const activeModel = await mlStorage.getActiveMlModelByType("recommendation");
    
    if (activeModel) {
      console.log(`Найдена активная модель: ${activeModel.name} (v${activeModel.version})`);
      
      // Загружаем модель из конфигурации
      const model = lightgbmBridge.deserializeModel(
        typeof activeModel.configuration === 'string' 
          ? activeModel.configuration 
          : JSON.stringify(activeModel.configuration)
      );
      
      console.log("Модель успешно загружена из БД.");
      console.log("Характеристики модели:");
      console.log("- Признаки:", model.features);
      console.log("- Метрики:", model.metrics);
      
      return model;
    } else {
      console.log("Активная модель не найдена. Создаем базовую модель...");
      
      // Создаем базовую модель с предопределенными весами
      const modelConfig = {
        id: 1,
        name: "initial_course_recommendation_model",
        version: "1.0.0",
        features: [
          "userLevel",
          "hasCompletedDiagnostics",
          "skillCount",
          "averageSkillLevel",
          "maxSkillLevel",
          "preferredDifficulty",
          "courseDifficulty",
          "avgRequiredSkillLevel",
          "coursePopularity"
        ],
        weights: {
          "hasCompletedDiagnostics": 0.8,
          "skillCount": 0.3,
          "averageSkillLevel": 0.4,
          "maxSkillLevel": 0.5,
          "coursePopularity": 0.7,
          "userLevel": 0.1,
          "preferredDifficulty": 0.6,
          "courseDifficulty": 0.2,
          "avgRequiredSkillLevel": 0.4
        },
        bias: 0.1,
        thresholds: {
          "userLevel": 2,
          "skillCount": 5,
          "averageSkillLevel": 1.5,
          "preferredDifficulty": 2,
          "courseDifficulty": 2,
          "coursePopularity": 50
        }
      };
      
      // Загружаем модель в LightGBM Bridge
      const model = await lightgbmBridge.loadModel(modelConfig);
      
      // Сохраняем модель в БД
      const serializedModel = lightgbmBridge.serializeModel(model);
      
      // Создаем запись модели в базе данных
      const mlModel = await mlStorage.createMlModel({
        name: model.name,
        description: "Тестовая модель рекомендаций курсов",
        type: "recommendation",
        version: model.version,
        active: true,
        configuration: serializedModel,
        metrics: model.metrics
      });
      
      // Активируем модель
      await mlStorage.setMlModelActive(mlModel.id);
      
      console.log("Базовая модель успешно создана и активирована:", mlModel.name);
      return model;
    }
  } catch (error) {
    console.error("Ошибка при тестировании базовой модели:", error);
    return null;
  }
}

/**
 * Тестирование рекомендаций для пользователя
 */
async function testUserRecommendations(userId: number) {
  try {
    // Проверяем существование пользователя
    const user = await storage.getUser(userId);
    if (!user) {
      console.error(`Пользователь с ID ${userId} не найден`);
      return;
    }
    
    console.log(`Тестирование рекомендаций для пользователя ${user.username} (ID: ${userId})...`);
    
    // Получаем все курсы
    const allCourses = await storage.getAllCourses();
    
    if (!allCourses || allCourses.length === 0) {
      console.error("Нет доступных курсов для рекомендаций");
      return;
    }
    
    // Получаем рекомендации через MLService
    console.log("Генерация рекомендаций с помощью S3 (SMART QUEST)...");
    
    const recommendations = await mlService.generateCourseRecommendations(userId, allCourses);
    
    console.log(`Сгенерировано ${recommendations.length} рекомендаций:`);
    
    for (let i = 0; i < recommendations.length; i++) {
      const course = recommendations[i];
      
      // Получаем оценку релевантности для этого курса
      const userSkills = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));
        
      const relevanceScore = await mlService.predictCourseRelevance(userId, course, userSkills);
      
      console.log(`${i+1}. ${course.title} (ID: ${course.id}) - Релевантность: ${relevanceScore.toFixed(2)}`);
    }
    
    // Сохраняем рекомендации в профиль пользователя
    if (recommendations.length > 0) {
      const courseIds = recommendations.map(course => course.id);
      await db
        .update(userProfiles)
        .set({ 
          recommendedCourseIds: courseIds,
          recommendationUpdatedAt: new Date()
        })
        .where(eq(userProfiles.userId, userId));
        
      console.log(`Рекомендации сохранены в профиле пользователя ${userId}`);
    }
    
  } catch (error) {
    console.error(`Ошибка при тестировании рекомендаций для пользователя ${userId}:`, error);
  }
}

/**
 * Основная функция тестирования S3 (SMART QUEST)
 */
async function testSmartQuest(options: {
  enable?: boolean;
  userId?: number;
} = {}) {
  console.log("===== Тестирование S3 (SMART QUEST) =====");
  
  // Включаем функциональность, если указано
  if (options.enable !== undefined) {
    await toggleSmartQuest(options.enable);
  }
  
  // Тестируем базовую модель
  const model = await testBasicModel();
  
  if (!model) {
    console.error("Не удалось создать или загрузить модель. Тестирование прервано.");
    return;
  }
  
  // Тестируем рекомендации для указанного пользователя, если задан userId
  if (options.userId) {
    await testUserRecommendations(options.userId);
  }
  
  console.log("===== Тестирование S3 (SMART QUEST) завершено =====");
}

// Запуск тестирования, если скрипт запущен напрямую
if (require.main === module) {
  (async () => {
    try {
      // Аргументы из командной строки
      const args = process.argv.slice(2);
      const options: any = {};
      
      // Парсинг аргументов
      for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        
        if (arg === '--enable') {
          options.enable = true;
        } else if (arg === '--disable') {
          options.enable = false;
        } else if (arg === '--user') {
          const userId = parseInt(args[i+1]);
          if (!isNaN(userId)) {
            options.userId = userId;
            i++; // Пропускаем следующий аргумент, так как это значение
          }
        }
      }
      
      await testSmartQuest(options);
      process.exit(0);
    } catch (error) {
      console.error("Ошибка при выполнении скрипта:", error);
      process.exit(1);
    }
  })();
}

export { testSmartQuest, toggleSmartQuest };
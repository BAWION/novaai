/**
 * train-recommendation-model.ts
 * 
 * Скрипт для обучения модели рекомендаций курсов с использованием LightGBM
 * Может запускаться через cron или другой планировщик задач
 * 
 * Этот скрипт анализирует данные пользователей, активность и рекомендации
 * и обучает новую модель LightGBM для улучшения качества рекомендаций
 */

import { db } from "../db";
import { mlService } from "../services";
import { lightgbmBridge } from "../services/lightgbm-bridge";
import { 
  users, 
  userProfiles, 
  userSkillsDnaProgress, 
  courseSkillRequirements,
  courses,
  courseEnrollments, 
  courseRatings,
  userActivityLogs,
  userRecommendations,
  featureFlags
} from "@shared/schema";
import { eq, and, sql, gte } from "drizzle-orm";
import { MLStorage } from "../storage-ml";

/**
 * Основная функция обучения модели
 */
async function trainRecommendationModel() {
  console.log("Запуск обучения модели рекомендаций курсов (S3 SMART QUEST)");
  
  try {
    // Проверяем, включена ли функция S3 (SMART QUEST)
    const [smartQuestFlag] = await db
      .select()
      .from(featureFlags)
      .where(eq(featureFlags.name, "smart_quest"));
    
    const isSmartQuestEnabled = smartQuestFlag?.status === "enabled";
    
    if (!isSmartQuestEnabled) {
      console.log("S3 (SMART QUEST) отключен. Прерываем обучение модели.");
      return;
    }
    
    // Сбор данных для обучения
    console.log("Сбор данных для обучения модели...");
    
    // 1. Получаем список всех пользователей с профилями
    const usersWithProfiles = await db
      .select({
        user: users,
        profile: userProfiles
      })
      .from(users)
      .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
      .where(sql`${userProfiles.id} IS NOT NULL`);
    
    console.log(`Найдено ${usersWithProfiles.length} пользователей с профилями`);
    
    // 2. Получаем все курсы
    const allCourses = await db.select().from(courses);
    console.log(`Найдено ${allCourses.length} курсов`);
    
    // 3. Собираем обучающие данные
    const trainingData = [];
    const targetColumn = "relevanceScore";
    
    for (const { user, profile } of usersWithProfiles) {
      // Получаем навыки пользователя
      const userSkills = await db
        .select()
        .from(userSkillsDnaProgress)
        .where(eq(userSkillsDnaProgress.userId, user.id));
      
      // Для каждого курса собираем метрики
      for (const course of allCourses) {
        // Получаем оценку релевантности (если пользователь взаимодействовал с курсом)
        const [enrollment] = await db
          .select()
          .from(courseEnrollments)
          .where(and(
            eq(courseEnrollments.userId, user.id),
            eq(courseEnrollments.courseId, course.id)
          ));
        
        const [rating] = await db
          .select()
          .from(courseRatings)
          .where(and(
            eq(courseRatings.userId, user.id),
            eq(courseRatings.courseId, course.id)
          ));
        
        // Вычисляем оценку релевантности на основе имеющихся данных
        let relevanceScore = 0.5; // Нейтральная оценка по умолчанию
        
        if (enrollment) {
          // Если пользователь записался на курс, это положительный сигнал
          relevanceScore = 0.7;
          
          // Если ещё и завершил курс, это очень сильный сигнал
          if (enrollment.status === 'completed') {
            relevanceScore = 0.9;
          }
        }
        
        // Если есть оценка курса, учитываем её
        if (rating) {
          // Пересчитываем оценку с учетом рейтинга (от 1 до 5)
          relevanceScore = (relevanceScore + rating.rating / 5) / 2;
        }
        
        // Получаем количество активностей с этим курсом
        const [activityCount] = await db
          .select({ count: sql<number>`count(*)` })
          .from(userActivityLogs)
          .where(and(
            eq(userActivityLogs.userId, user.id),
            eq(userActivityLogs.entityType, "course"),
            eq(userActivityLogs.entityId, course.id)
          ));
        
        if (activityCount && activityCount.count > 0) {
          // Если есть активность, это положительный сигнал
          relevanceScore = Math.min(1.0, relevanceScore + 0.1 * Math.min(10, activityCount.count) / 10);
        }
        
        // Создаем запись для обучения
        const skillCount = userSkills.length;
        const skillLevels = userSkills.map(s => s.currentLevel || 0);
        const averageSkillLevel = skillLevels.length > 0 
          ? skillLevels.reduce((sum, level) => sum + level, 0) / skillLevels.length 
          : 0;
        const maxSkillLevel = skillLevels.length > 0 
          ? Math.max(...skillLevels.map(level => Number(level) || 0)) 
          : 0;
        
        // Получаем требуемые навыки для курса
        const courseRequirements = await db
          .select()
          .from(courseSkillRequirements)
          .where(eq(courseSkillRequirements.courseId, course.id));
        
        const courseRequiredSkills = courseRequirements.map(r => r.skillId);
        
        // Средний уровень требуемых навыков
        const avgRequiredSkillLevel = courseRequirements.length > 0
          ? courseRequirements.reduce((sum, req) => sum + (req.requiredLevel || 1), 0) / courseRequirements.length
          : 1;
        
        // Преобразование строковых значений сложности в числовые
        const difficultyMap: Record<string, number> = {
          'basic': 1,
          'easy': 1,
          'beginner': 1,
          'intermediate': 2,
          'medium': 2,
          'advanced': 3,
          'expert': 3,
          'hard': 3
        };
        
        // Получаем количество записанных на курс студентов
        const [enrollmentCount] = await db
          .select({ count: sql<number>`count(*)` })
          .from(courseEnrollments)
          .where(eq(courseEnrollments.courseId, course.id));
        
        // Получаем среднюю оценку курса
        const [avgRating] = await db
          .select({ avg: sql<number>`avg(rating)` })
          .from(courseRatings)
          .where(eq(courseRatings.courseId, course.id));
        
        // Получаем количество завершивших курс
        const [completionCount] = await db
          .select({ count: sql<number>`count(*)` })
          .from(courseEnrollments)
          .where(and(
            eq(courseEnrollments.courseId, course.id),
            eq(courseEnrollments.status, 'completed')
          ));
        
        // Приблизительная оценка уровня пользователя на основе его навыков
        const userLevel = Math.min(3, Math.max(1, Math.ceil(averageSkillLevel)));
        
        // Предпочитаемая сложность из профиля пользователя
        const userPreferredDifficulty = difficultyMap[profile.preferredDifficulty || 'intermediate'] || 2;
        
        // Сложность курса
        const courseDifficulty = difficultyMap[course.difficulty || 'intermediate'] || 2;
        
        // Добавляем запись в обучающие данные
        trainingData.push({
          // Целевая переменная (то, что будем предсказывать)
          [targetColumn]: relevanceScore,
          
          // Признаки для модели
          features: {
            userId: user.id,
            userLevel,
            hasCompletedDiagnostics: !!profile.diagnosisCompletedAt,
            skillCount,
            averageSkillLevel,
            maxSkillLevel,
            categoryInterest: profile.interest || '',
            topSkillId: userSkills.length > 0 ? userSkills[0].dnaId : 0,
            preferredDifficulty: userPreferredDifficulty,
            courseId: course.id,
            courseDifficulty,
            courseCategory: course.category || 'general',
            courseRequiredSkills,
            avgRequiredSkillLevel,
            coursePopularity: enrollmentCount?.count || 0,
            avgCourseRating: avgRating?.avg || 0,
            completionRate: enrollmentCount?.count > 0 
              ? (completionCount?.count || 0) / enrollmentCount.count 
              : 0
          }
        });
      }
    }
    
    console.log(`Подготовлено ${trainingData.length} записей для обучения`);
    
    if (trainingData.length < 10) {
      console.log("Недостаточно данных для обучения модели. Минимум 10 записей.");
      return;
    }
    
    // 4. Обучаем модель
    console.log("Запуск обучения модели LightGBM...");
    
    // Определяем признаки для модели
    const features = [
      "userLevel",
      "hasCompletedDiagnostics",
      "skillCount",
      "averageSkillLevel",
      "maxSkillLevel",
      "preferredDifficulty",
      "courseDifficulty",
      "avgRequiredSkillLevel",
      "coursePopularity",
      "avgCourseRating",
      "completionRate"
    ];
    
    // Параметры обучения
    const options = {
      learningRate: 0.1,
      numIterations: 100,
      maxDepth: 6,
      featureSelection: features,
      categorical: ["hasCompletedDiagnostics"]
    };
    
    // Запускаем обучение
    const model = await lightgbmBridge.trainModel(
      trainingData,
      targetColumn,
      features,
      options
    );
    
    console.log(`Модель успешно обучена. ID: ${model.id}, версия: ${model.version}`);
    
    // 5. Сохраняем модель в базе данных
    const mlStorage = new MLStorage();
    const serializedModel = lightgbmBridge.serializeModel(model);
    
    // Создаем запись модели в БД
    const mlModel = await mlStorage.createMlModel({
      name: `lightgbm_recommendation_model_v${model.version}`,
      description: "Модель рекомендаций курсов, обученная на данных пользователей",
      type: "recommendation",
      version: model.version,
      active: true,
      configuration: serializedModel,
      metrics: model.metrics
    });
    
    // Активируем модель
    await mlStorage.setMlModelActive(mlModel.id);
    
    console.log(`Модель сохранена в базе данных. ID: ${mlModel.id}`);
    
    // 6. Обновляем рекомендации для всех пользователей
    console.log("Обновление рекомендаций для пользователей...");
    
    // В реальном случае, здесь бы запускалась задача по обновлению рекомендаций
    // для всех пользователей, но для простоты мы просто выводим сообщение
    console.log("Для обновления рекомендаций всех пользователей, запустите отдельный скрипт.");
    
    console.log("Обучение модели успешно завершено!");
  } catch (error) {
    console.error("Ошибка при обучении модели:", error);
  }
}

// Запуск обучения модели, если скрипт запущен напрямую
if (require.main === module) {
  (async () => {
    try {
      await trainRecommendationModel();
      process.exit(0);
    } catch (error) {
      console.error("Ошибка при выполнении скрипта:", error);
      process.exit(1);
    }
  })();
}

export { trainRecommendationModel };
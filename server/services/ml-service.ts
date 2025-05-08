/**
 * ml-service.ts
 * Сервис для работы с ML-моделями и рекомендациями
 */

import { Course, User, UserProfile, UserSkillsDnaProgress } from "@shared/schema";
import { MLStorage } from "../storage-ml";
import OpenAI from "openai";
import { lightgbmBridge, LightGBMModel } from "./lightgbm-bridge";

// S3 (SMART QUEST) - Типы для работы с LightGBM-моделью рекомендаций
export interface CourseRecommendationModelInput {
  features: {
    userId: number;
    userLevel: number;
    hasCompletedDiagnostics: boolean;
    skillCount: number;
    averageSkillLevel: number;
    maxSkillLevel: number;
    categoryInterest: string; // Категория интереса пользователя
    topSkillId: number; // ID навыка с максимальным уровнем
    preferredDifficulty: number; // Предпочитаемая сложность (1-3)
    courseId: number; // ID курса для которого делаем предсказание
    courseDifficulty: number; // Сложность курса (1-3)
    courseCategory: string; // Категория курса
    courseRequiredSkills: number[]; // ID навыков, требуемых для курса
    avgRequiredSkillLevel: number; // Средний уровень требуемых навыков
    coursePopularity: number; // Популярность курса (на основе количества учеников)
  }
}

export class MLService {
  private mlStorage: MLStorage;
  private openai: OpenAI | null = null;
  private featureFlags: Record<string, boolean> = {};
  private recommendationModel: LightGBMModel | null = null;

  constructor(mlStorage: MLStorage) {
    this.mlStorage = mlStorage;
    
    // Инициализация OpenAI, если доступен ключ API
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
      console.log("OpenAI API client initialized successfully");
    } else {
      console.warn("OpenAI API key not found, embeddings generation will not work");
    }
    
    // Предзагрузка feature flags
    this.loadFeatureFlags();
    
    // S3 (SMART QUEST) - Инициализация модели рекомендаций
    this.initRecommendationModel();
  }
  
  /**
   * S3 (SMART QUEST) - Инициализация модели рекомендаций
   * Загружает активную модель рекомендаций или создает новую
   */
  private async initRecommendationModel() {
    try {
      // Проверяем наличие активной модели типа "recommendation"
      const activeModel = await this.mlStorage.getActiveMlModelByType("recommendation");
      
      if (activeModel && activeModel.configuration) {
        // Десериализуем модель из конфигурации
        this.recommendationModel = lightgbmBridge.deserializeModel(
          typeof activeModel.configuration === 'string' 
            ? activeModel.configuration 
            : JSON.stringify(activeModel.configuration)
        );
        
        console.log(`Loaded active recommendation model: ${activeModel.name} (v${activeModel.version})`);
      } else {
        // Создаем базовую модель рекомендаций
        await this.createInitialRecommendationModel();
      }
    } catch (error) {
      console.error("Error initializing recommendation model:", error);
    }
  }

  /**
   * Загрузка всех feature flags в память для быстрого доступа
   */
  private async loadFeatureFlags() {
    try {
      const flags = await this.mlStorage.getAllFeatureFlags();
      this.featureFlags = {};
      
      for (const flag of flags) {
        this.featureFlags[flag.name] = flag.status === "enabled";
      }
      
      console.log("Feature flags loaded:", Object.keys(this.featureFlags).length);
    } catch (error) {
      console.error("Error loading feature flags:", error);
    }
  }

  /**
   * Проверка доступности ML-функций по feature flags
   */
  async isFeatureEnabled(featureName: string, userId?: number): Promise<boolean> {
    // Всегда запрашиваем актуальное состояние из базы данных, чтобы избежать проблем с кешированием
    try {
      console.log(`Checking feature flag ${featureName} for user ${userId || 'anonymous'}`);
      const isEnabled = await this.mlStorage.isFeatureEnabled(featureName, userId);
      // Обновляем кеш
      this.featureFlags[featureName] = isEnabled;
      console.log(`Feature flag ${featureName} is ${isEnabled ? 'enabled' : 'disabled'}`);
      return isEnabled;
    } catch (error) {
      console.error(`Error checking feature flag ${featureName}:`, error);
      // Если произошла ошибка, используем кешированное значение (если оно есть)
      if (this.featureFlags[featureName] !== undefined) {
        console.log(`Using cached value for feature flag ${featureName}: ${this.featureFlags[featureName]}`);
        return this.featureFlags[featureName];
      }
      console.log(`No cached value found for feature flag ${featureName}, returning false`);
      return false;
    }
  }
  
  /**
   * Принудительно обновляет информацию о всех feature flags
   */
  async refreshFeatureFlags(): Promise<void> {
    try {
      await this.loadFeatureFlags();
      console.log("Feature flags refreshed:", Object.keys(this.featureFlags).length);
    } catch (error) {
      console.error("Error refreshing feature flags:", error);
    }
  }

  /**
   * Генерация эмбеддингов с использованием OpenAI
   */
  async generateEmbedding(text: string, userId?: number): Promise<number[] | null> {
    // Проверяем, включена ли функция генерации эмбеддингов
    const isEnabled = await this.isFeatureEnabled("embeddings_generation", userId);
    
    if (!isEnabled) {
      console.log(`Embeddings generation is disabled for user ${userId || 'anonymous'}`);
      return null;
    }
    
    console.log(`Embeddings generation is enabled for user ${userId || 'anonymous'}`);
    
    if (!this.openai) {
      console.error("OpenAI API is not initialized");
      return null;
    }
    
    try {
      console.log("Calling OpenAI API to generate embedding...");
      const response = await this.openai.embeddings.create({
        model: "text-embedding-ada-002", // используем актуальную модель для эмбеддингов
        input: text,
      });
      
      console.log("Successfully generated embedding with OpenAI");
      return response.data[0].embedding;
    } catch (error) {
      console.error("Error generating embedding:", error);
      return null;
    }
  }

  /**
   * Генерация эмбеддинга для курса на основе его метаданных
   */
  async generateCourseEmbedding(course: Course): Promise<number[] | null> {
    // Создаем текстовое представление курса для эмбеддинга
    const courseText = `
      Название: ${course.title}
      Описание: ${course.description || ""}
      Уровень сложности: ${course.difficulty || ""}
      Ключевые навыки: ${course.skills?.join(", ") || ""}
      Продолжительность: ${course.duration || ""}
    `;
    
    // Для курсов используем ID админа (фиксированное значение 0) для проверки feature flag
    const adminId = 0;
    const embedding = await this.generateEmbedding(courseText, adminId);
    
    if (embedding) {
      try {
        // Сохраняем эмбеддинг в базе данных
        await this.mlStorage.saveContentEmbedding({
          entityType: "course",
          entityId: course.id,
          embedding
        });
      } catch (error) {
        console.error("Error saving course embedding:", error);
      }
    }
    
    return embedding;
  }

  /**
   * Генерация эмбеддинга для пользователя на основе его профиля
   */
  async generateUserEmbedding(user: User, profile: UserProfile): Promise<number[] | null> {
    // Создаем текстовое представление профиля пользователя для эмбеддинга
    const profileText = `
      Пользователь: ${user.displayName || user.username}
      Роль: ${profile.role || ""}
      Уровень Python: ${profile.pythonLevel || 0}
      Опыт: ${profile.experience || ""}
      Интересы: ${profile.interest || ""}
      Цель: ${profile.goal || ""}
      Рекомендуемый трек: ${profile.recommendedTrack || ""}
    `;
    
    // Передаем userId в метод generateEmbedding для проверки feature flag
    const embedding = await this.generateEmbedding(profileText, user.id);
    
    if (embedding) {
      try {
        // Сохраняем эмбеддинг пользователя в базе данных
        await this.mlStorage.saveUserEmbedding(user.id, embedding);
      } catch (error) {
        console.error("Error saving user embedding:", error);
      }
    }
    
    return embedding;
  }

  /**
   * Расчет косинусного сходства между двумя векторами
   */
  cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) {
      throw new Error("Vectors must have the same length");
    }
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * S3 (SMART QUEST) - Создание начальной модели рекомендаций
   * В реальном приложении, модель бы обучалась на данных пользователей
   */
  private async createInitialRecommendationModel(): Promise<void> {
    try {
      // Создаем базовую модель с предопределенными весами
      // В реальном сценарии эти веса были бы получены в процессе обучения
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
          // Положительные веса для характеристик, которые должны увеличивать вероятность рекомендации
          "hasCompletedDiagnostics": 0.8,
          "skillCount": 0.3,
          "averageSkillLevel": 0.4,
          "maxSkillLevel": 0.5,
          "coursePopularity": 0.7,
          
          // Специальные веса для соответствия уровней пользователя и курса
          "userLevel": 0.1,         // Менее важен сам по себе
          "preferredDifficulty": 0.6, // Предпочтения пользователя важны
          "courseDifficulty": 0.2,   // Сложность курса менее важна сама по себе
          "avgRequiredSkillLevel": 0.4 // Средний уровень требуемых навыков имеет средний вес
        },
        bias: 0.1, // Небольшое смещение для настройки общего уровня рекомендаций
        thresholds: {
          "userLevel": 2,            // Порог для уровня пользователя
          "skillCount": 5,           // Минимальное количество навыков
          "averageSkillLevel": 1.5,  // Средний уровень навыков
          "preferredDifficulty": 2,  // Средняя сложность
          "courseDifficulty": 2,     // Средняя сложность курса
          "coursePopularity": 50     // Порог популярности
        }
      };
      
      // Загружаем модель в LightGBM Bridge
      this.recommendationModel = await lightgbmBridge.loadModel(modelConfig);
      
      // Сохраняем модель в БД для дальнейшего использования
      const serializedModel = lightgbmBridge.serializeModel(this.recommendationModel);
      
      // Создаем запись модели в базе данных
      const mlModel = await this.mlStorage.createMlModel({
        name: this.recommendationModel.name,
        description: "Начальная модель рекомендаций курсов на основе LightGBM",
        type: "recommendation",
        version: this.recommendationModel.version,
        active: true,
        configuration: serializedModel,
        metrics: this.recommendationModel.metrics
      });
      
      // Активируем модель
      await this.mlStorage.setMlModelActive(mlModel.id);
      
      console.log("Initial recommendation model created successfully:", mlModel.name);
    } catch (error) {
      console.error("Error creating initial recommendation model:", error);
    }
  }
  
  /**
   * S3 (SMART QUEST) - Подготовка данных для модели LightGBM
   */
  private async prepareModelInputData(
    userId: number, 
    course: Course, 
    userSkills: UserSkillsDnaProgress[]
  ): Promise<CourseRecommendationModelInput> {
    try {
      // Получаем профиль пользователя
      const user = await this.mlStorage.getUser(userId);
      const profile = await this.mlStorage.getUserProfile(userId);
      
      if (!user || !profile) {
        throw new Error("User or profile not found");
      }
      
      // Расчет метрик пользователя на основе его навыков
      const skillCount = userSkills.length;
      const skillLevels = userSkills.map(s => s.currentLevel || 0);
      const averageSkillLevel = skillLevels.length > 0 
        ? skillLevels.reduce((sum, level) => sum + level, 0) / skillLevels.length 
        : 0;
      const maxSkillLevel = skillLevels.length > 0 
        ? Math.max(...skillLevels) 
        : 0;
      
      // Определяем топовый навык пользователя
      let topSkillId = 0;
      let maxLevel = 0;
      
      for (const skill of userSkills) {
        if ((skill.currentLevel || 0) > maxLevel) {
          maxLevel = skill.currentLevel || 0;
          topSkillId = skill.dnaId;
        }
      }
      
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
      
      // Получение требуемых навыков для курса
      const courseRequirements = await this.mlStorage.getCourseSkillRequirements(course.id);
      const courseRequiredSkills = courseRequirements.map(r => r.skillId);
      
      // Средний уровень требуемых навыков
      const avgRequiredSkillLevel = courseRequirements.length > 0
        ? courseRequirements.reduce((sum, req) => sum + (req.requiredLevel || 1), 0) / courseRequirements.length
        : 1;
      
      // Определение категории курса
      const courseCategory = course.category || 'general';
      
      // Получение статистики по курсу
      const courseStats = await this.mlStorage.getCourseStatistics(course.id);
      const coursePopularity = courseStats?.enrollmentCount || 0;
      
      // Предпочитаемая сложность из профиля пользователя
      const userPreferredDifficulty = difficultyMap[profile.preferredDifficulty || 'intermediate'] || 2;
      
      // Сложность курса
      const courseDifficulty = difficultyMap[course.difficulty || 'intermediate'] || 2;
      
      // Приблизительная оценка уровня пользователя на основе его навыков
      const userLevel = Math.min(3, Math.max(1, Math.ceil(averageSkillLevel)));
      
      // Формируем объект входных данных для модели
      return {
        features: {
          userId,
          userLevel,
          hasCompletedDiagnostics: !!profile.diagnosisCompletedAt,
          skillCount,
          averageSkillLevel,
          maxSkillLevel,
          categoryInterest: profile.interest || '',
          topSkillId,
          preferredDifficulty: userPreferredDifficulty,
          courseId: course.id,
          courseDifficulty,
          courseCategory,
          courseRequiredSkills,
          avgRequiredSkillLevel,
          coursePopularity
        }
      };
    } catch (error) {
      console.error("Error preparing model input data:", error);
      
      // Возвращаем дефолтные значения в случае ошибки
      return {
        features: {
          userId,
          userLevel: 1,
          hasCompletedDiagnostics: false,
          skillCount: 0,
          averageSkillLevel: 0,
          maxSkillLevel: 0,
          categoryInterest: '',
          topSkillId: 0,
          preferredDifficulty: 2,
          courseId: course.id,
          courseDifficulty: 2,
          courseCategory: 'general',
          courseRequiredSkills: [],
          avgRequiredSkillLevel: 1,
          coursePopularity: 0
        }
      };
    }
  }
  
  /**
   * S3 (SMART QUEST) - Генерация предсказания с помощью модели LightGBM
   */
  async predictCourseRelevance(
    userId: number, 
    course: Course, 
    userSkills: UserSkillsDnaProgress[]
  ): Promise<number> {
    try {
      // Проверяем наличие модели
      if (!this.recommendationModel) {
        console.warn("Recommendation model not initialized, trying to load it");
        await this.initRecommendationModel();
        
        if (!this.recommendationModel) {
          console.error("Failed to initialize recommendation model");
          return 0.5; // Нейтральная оценка по умолчанию
        }
      }
      
      // Готовим входные данные для модели
      const inputData = await this.prepareModelInputData(userId, course, userSkills);
      
      // Запрашиваем предсказание у модели
      const relevanceScore = await lightgbmBridge.predict(this.recommendationModel, inputData);
      
      console.log(`Predicted relevance for user ${userId} and course ${course.id}: ${relevanceScore}`);
      
      return relevanceScore;
    } catch (error) {
      console.error(`Error predicting course relevance for user ${userId} and course ${course.id}:`, error);
      return 0.5; // Нейтральная оценка по умолчанию
    }
  }
  
  /**
   * Генерация персонализированных рекомендаций курсов для пользователя
   * S3 (SMART QUEST) - Улучшенная версия с использованием LightGBM
   */
  async generateCourseRecommendations(userId: number, courses: Course[]): Promise<Course[]> {
    // Проверяем, включена ли функция рекомендаций
    const isEnabled = await this.isFeatureEnabled("course_recommendations", userId);
    
    if (!isEnabled) {
      console.log("Course recommendations are disabled");
      return courses;
    }
    
    try {
      // Проверяем, включена ли функция S3 (SMART QUEST) с LightGBM
      const isSmartQuestEnabled = await this.isFeatureEnabled("smart_quest", userId);
      
      // 3. Проверка AB-тестирования для измерения CTR
      // Если пользователь попадает в экспериментальную группу, используем улучшенный алгоритм
      const isInExperimentGroup = await this.isUserInABTestGroup(userId, "enhanced_recommendations");
      const shouldUseEnhancedAlgorithm = isInExperimentGroup || await this.isFeatureEnabled("enhanced_recommendations", userId);
      
      if (isSmartQuestEnabled && this.recommendationModel) {
        console.log("S3 (SMART QUEST) is enabled, using LightGBM model for recommendations");
        
        // Получаем навыки пользователя
        const userSkills = await this.mlStorage.getUserSkills(userId);
        
        // Массив для оценок курсов
        const courseScores: { course: Course; score: number; primarySkill?: number }[] = [];
        
        // Определение основного навыка пользователя (с наивысшим уровнем)
        let topSkillId = 0;
        let maxLevel = 0;
        
        for (const skill of userSkills) {
          if ((skill.currentLevel || 0) > maxLevel) {
            maxLevel = skill.currentLevel || 0;
            topSkillId = skill.dnaId;
          }
        }
        
        // Генерируем оценки для каждого курса с помощью модели LightGBM
        for (const course of courses) {
          const relevanceScore = await this.predictCourseRelevance(userId, course, userSkills);
          
          // Определение основного навыка для курса
          const courseRequirements = await this.mlStorage.getCourseSkillRequirements(course.id);
          let primarySkill = 0;
          let highestRequirement = 0;
          
          for (const req of courseRequirements) {
            if ((req.requiredLevel || 1) > highestRequirement) {
              highestRequirement = req.requiredLevel || 1;
              primarySkill = req.skillId;
            }
          }
          
          courseScores.push({ 
            course, 
            score: relevanceScore,
            primarySkill 
          });
        }
        
        // 1. Фильтрация по порогу modelScore < 0.4
        // Если включен улучшенный алгоритм, отфильтровываем курсы с низкой релевантностью
        let filteredScores = courseScores;
        if (shouldUseEnhancedAlgorithm) {
          console.log("Using enhanced algorithm with score threshold < 0.4");
          filteredScores = courseScores.filter(item => item.score >= 0.4);
          
          // Если после фильтрации не осталось курсов, возвращаем исходный список
          if (filteredScores.length === 0) {
            console.log("No courses passed the threshold filter, using original list");
            filteredScores = courseScores;
          }
        }
        
        // 2. Добавление разнообразия по первичному навыку
        // Группируем курсы по основному навыку и обеспечиваем разнообразие в топ-рекомендациях
        if (shouldUseEnhancedAlgorithm) {
          console.log("Applying diversity by primary skill");
          
          // Сначала сортируем по релевантности
          filteredScores.sort((a, b) => b.score - a.score);
          
          // Теперь применяем алгоритм разнообразия для топ-5 рекомендаций
          const diversifiedTop = [];
          const seenSkills = new Set<number>();
          const remainingScores = [...filteredScores];
          
          // Выбираем топ-5 с разнообразием по навыкам
          while (diversifiedTop.length < 5 && remainingScores.length > 0) {
            // Находим следующий курс с наивысшим скором, чей основной навык еще не представлен
            let bestIndex = -1;
            
            // Сначала ищем непредставленные навыки
            for (let i = 0; i < remainingScores.length; i++) {
              const skill = remainingScores[i].primarySkill || 0;
              if (!seenSkills.has(skill) || skill === 0) {
                bestIndex = i;
                break;
              }
            }
            
            // Если все навыки уже представлены, берем курс с наивысшим скором
            if (bestIndex === -1 && remainingScores.length > 0) {
              bestIndex = 0;
            }
            
            if (bestIndex >= 0) {
              const selected = remainingScores.splice(bestIndex, 1)[0];
              diversifiedTop.push(selected);
              if (selected.primarySkill && selected.primarySkill > 0) {
                seenSkills.add(selected.primarySkill);
              }
            }
          }
          
          // Объединяем диверсифицированный топ с остальными рекомендациями
          filteredScores = [...diversifiedTop, ...remainingScores];
        } else {
          // Обычная сортировка по релевантности, если не используется улучшенный алгоритм
          filteredScores.sort((a, b) => b.score - a.score);
        }
        
        // Сохраняем рекомендации в базе данных
        await this.saveCourseRecommendations(userId, filteredScores, isInExperimentGroup);
        
        // Возвращаем отсортированные курсы
        return filteredScores.map(item => item.course);
      } else {
        console.log("Using embeddings-based recommendations (S3 not enabled)");
        
        // Получаем эмбеддинг пользователя
        const userEmbedding = await this.mlStorage.getUserEmbedding(userId);
        
        if (!userEmbedding) {
          // Если эмбеддинг не найден, получаем информацию о пользователе и профиле
          // и генерируем новый эмбеддинг
          console.log("User embedding not found, generating new one");
          const user = await this.mlStorage.getUser(userId);
          const profile = await this.mlStorage.getUserProfile(userId);
          
          if (!user || !profile) {
            console.log("User or profile not found, returning original courses");
            return courses;
          }
          
          // Генерируем новый эмбеддинг
          await this.generateUserEmbedding(user, profile);
          // Повторная попытка получить созданный эмбеддинг
          const newUserEmbedding = await this.mlStorage.getUserEmbedding(userId);
          
          if (!newUserEmbedding) {
            console.log("Failed to generate user embedding, returning original courses");
            return courses;
          }
        }
        
        // Расчет рекомендаций на основе эмбеддингов
        const userEmb = userEmbedding!.embedding;
        const courseScores: { course: Course; score: number }[] = [];
        
        for (const course of courses) {
          // Получаем эмбеддинг курса
          let courseEmbedding = await this.mlStorage.getContentEmbedding("course", course.id);
          
          if (!courseEmbedding) {
            // Если эмбеддинг не найден, генерируем новый
            await this.generateCourseEmbedding(course);
            courseEmbedding = await this.mlStorage.getContentEmbedding("course", course.id);
          }
          
          if (courseEmbedding) {
            // Расчет сходства между пользователем и курсом
            const similarity = this.cosineSimilarity(userEmb, courseEmbedding.embedding);
            courseScores.push({ course, score: similarity });
          } else {
            // Если эмбеддинг для курса не удалось получить,
            // добавляем курс с нейтральным скором
            courseScores.push({ course, score: 0.5 });
          }
        }
        
        // Сортировка курсов по релевантности
        courseScores.sort((a, b) => b.score - a.score);
        
        // Сохраняем рекомендации в базе данных
        await this.saveCourseRecommendations(userId, courseScores, isInExperimentGroup);
        
        // Возвращаем отсортированные курсы
        return courseScores.map(item => item.course);
      }
    } catch (error) {
      console.error("Error generating course recommendations:", error);
      return courses;
    }
  }
  
  /**
   * Проверяет, входит ли пользователь в экспериментальную группу для тестирования 
   * AB-тестирования новых функций
   * 
   * @param userId ID пользователя
   * @param experimentName Название эксперимента
   * @returns true, если пользователь в экспериментальной группе, иначе false
   */
  async isUserInABTestGroup(userId: number, experimentName: string): Promise<boolean> {
    try {
      // Проверяем, включен ли вообще AB-тест
      const isABTestingEnabled = await this.isFeatureEnabled("ab_testing", userId);
      
      if (!isABTestingEnabled) {
        return false;
      }
      
      // Получаем информацию об AB-эксперименте
      const experimentInfo = await this.mlStorage.getABTestConfig(experimentName);
      
      if (!experimentInfo || !experimentInfo.isActive) {
        return false;
      }
      
      // Распределение пользователей по группам на основе хеша их userID
      // Это обеспечивает стабильное распределение - один и тот же пользователь
      // всегда попадает в одну и ту же группу
      const hashSum = userId % 100; // Значение от 0 до 99
      
      // По умолчанию 50% пользователей в контрольной группе, 50% в экспериментальной
      // но можно настроить через конфигурацию эксперимента
      const experimentPercentage = experimentInfo.experimentGroupPercentage || 50;
      
      // Если хеш меньше процента для экспериментальной группы, пользователь в ней
      return hashSum < experimentPercentage;
    } catch (error) {
      console.error(`Error checking AB test group for user ${userId}:`, error);
      return false;
    }
  }

  /**
   * Сохранение рекомендаций курсов в базе данных
   */
  private async saveCourseRecommendations(
    userId: number, 
    courseScores: { course: Course; score: number; primarySkill?: number }[],
    isInExperimentGroup: boolean = false
  ): Promise<void> {
    for (let i = 0; i < courseScores.length; i++) {
      const score = courseScores[i].score;
      const courseId = courseScores[i].course.id;
      
      const recommendation: {
        userId: number;
        entityType: "course";
        entityId: number;
        score: number;
        rankPosition: number;
        modelId?: number;
        metaData?: any;
      } = {
        userId,
        entityType: "course",
        entityId: courseId,
        score,
        rankPosition: i + 1
      };
      
      // Если используется LightGBM модель, добавляем её ID
      if (this.recommendationModel) {
        recommendation.modelId = this.recommendationModel.id;
      }
      
      // Добавляем метаданные для AB-тестирования
      if (isInExperimentGroup) {
        recommendation.metaData = {
          isExperimentGroup: true,
          experimentName: "enhanced_recommendations",
          primarySkill: courseScores[i].primarySkill
        };
      }
      
      // Сохраняем рекомендацию в базе данных
      try {
        await this.mlStorage.createUserRecommendation(recommendation);
      } catch (error) {
        console.error("Error saving recommendation:", error);
      }
    }
  }

  /**
   * Логирование действий пользователя для сбора данных для ML
   */
  async logUserActivity(userId: number, actionType: string, entityType: string, entityId: number, metadata?: any) {
    try {
      await this.mlStorage.logUserActivity({
        userId,
        actionType,
        entityType,
        entityId,
        metadata: metadata ? JSON.stringify(metadata) : null
      });
    } catch (error) {
      console.error("Error logging user activity:", error);
    }
  }

  /**
   * Запись события обучения для аналитики
   */
  async recordLearningEvent(userId: number, eventType: string, entityType?: string, entityId?: number, data?: any) {
    try {
      await this.mlStorage.createLearningEvent({
        userId,
        eventType,
        entityType: entityType || null,
        entityId: entityId || null,
        data: data ? JSON.stringify(data) : null
      });
    } catch (error) {
      console.error("Error recording learning event:", error);
    }
  }
}
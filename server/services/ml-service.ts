/**
 * ml-service.ts
 * Сервис для работы с ML-моделями и рекомендациями
 */
import { MLStorage } from "../storage-ml";
import { 
  type Course, 
  type User, 
  type UserProfile,
  type InsertUserRecommendation 
} from "@shared/schema";

// Интеграция с OpenAI для генерации embeddings
import OpenAI from "openai";

// Определяем класс сервиса
export class MLService {
  private mlStorage: MLStorage;
  private openai: OpenAI | null = null;
  private featureFlags: Record<string, boolean> = {};
  
  constructor(mlStorage: MLStorage) {
    this.mlStorage = mlStorage;
    
    // Инициализация OpenAI если есть ключ API
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
  }
  
  /**
   * Проверка доступности ML-функций по feature flags
   */
  async isFeatureEnabled(featureName: string, userId?: number): Promise<boolean> {
    // Кэшируем результаты проверок для быстрого доступа
    const cacheKey = `${featureName}:${userId || 'anon'}`;
    
    if (this.featureFlags[cacheKey] !== undefined) {
      return this.featureFlags[cacheKey];
    }
    
    const isEnabled = await this.mlStorage.isFeatureEnabled(featureName, userId);
    this.featureFlags[cacheKey] = isEnabled;
    
    return isEnabled;
  }
  
  /**
   * Генерация эмбеддингов с использованием OpenAI
   */
  async generateEmbedding(text: string): Promise<number[] | null> {
    if (!this.openai) {
      console.error("OpenAI API key is not configured");
      return null;
    }
    
    try {
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await this.openai.embeddings.create({
        model: "text-embedding-3-small",
        input: text,
        encoding_format: "float",
      });
      
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
    // Создаем текстовое представление курса для embedding
    const courseText = `
      Название: ${course.title}
      Описание: ${course.description || ''}
      Уровень: ${course.level}
      Сложность: ${course.difficulty}
      Теги: ${Array.isArray(course.tags) ? course.tags.join(', ') : ''}
    `;
    
    const embedding = await this.generateEmbedding(courseText);
    
    if (embedding) {
      // Сохраняем embedding в БД
      await this.mlStorage.saveContentEmbedding({
        entityType: 'course',
        entityId: course.id,
        embedding,
      });
    }
    
    return embedding;
  }
  
  /**
   * Генерация эмбеддинга для пользователя на основе его профиля
   */
  async generateUserEmbedding(user: User, profile: UserProfile): Promise<number[] | null> {
    // Создаем текстовое представление пользователя для embedding
    const userText = `
      Роль: ${profile.role || ''}
      Опыт работы: ${profile.experience || ''}
      Интересы: ${profile.interest || ''}
      Цели обучения: ${profile.goal || ''}
      Уровень Python: ${profile.pythonLevel || 0}
      Предпочитаемый стиль обучения: ${profile.preferredLearningStyle || ''}
      Предпочтительная сложность: ${profile.preferredDifficulty || ''}
      Индустрия: ${profile.industry || ''}
      Должность: ${profile.jobTitle || ''}
    `;
    
    const embedding = await this.generateEmbedding(userText);
    
    if (embedding) {
      // Сохраняем embedding в БД
      await this.mlStorage.saveUserEmbedding(user.id, embedding);
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
    
    if (normA === 0 || normB === 0) {
      return 0;
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
  
  /**
   * Генерация персонализированных рекомендаций курсов для пользователя
   */
  async generateCourseRecommendations(userId: number, courses: Course[]): Promise<Course[]> {
    // Проверяем, включена ли функция рекомендаций
    const isEnabled = await this.isFeatureEnabled('course_recommendations', userId);
    if (!isEnabled) {
      // Если функция отключена, возвращаем курсы без персонализации
      return courses;
    }
    
    // Получаем эмбеддинг пользователя
    const userEmbedding = await this.mlStorage.getUserEmbedding(userId);
    
    if (!userEmbedding) {
      // Если нет эмбеддинга пользователя, возвращаем курсы без персонализации
      return courses;
    }
    
    // Получаем активную модель рекомендаций
    const recommendationModel = await this.mlStorage.getActiveMlModelByType('recommendation');
    
    // Рассчитываем сходство для каждого курса
    const coursesWithScores = await Promise.all(courses.map(async (course) => {
      // Получаем эмбеддинг курса
      const courseEmbedding = await this.mlStorage.getContentEmbedding('course', course.id);
      
      let similarity = 0;
      
      if (courseEmbedding) {
        // Рассчитываем косинусное сходство между пользователем и курсом
        similarity = this.cosineSimilarity(
          userEmbedding.embedding as number[], 
          courseEmbedding.embedding as number[]
        );
      }
      
      // Сохраняем рекомендацию в БД
      if (recommendationModel && similarity > 0.5) {
        const recommendation: InsertUserRecommendation = {
          userId,
          modelId: recommendationModel.id,
          entityType: 'course',
          entityId: course.id,
          score: similarity,
          reason: "Соответствует вашему профилю и интересам"
        };
        
        await this.mlStorage.createUserRecommendation(recommendation);
      }
      
      return {
        course,
        score: similarity,
      };
    }));
    
    // Сортируем курсы по релевантности
    coursesWithScores.sort((a, b) => b.score - a.score);
    
    // Возвращаем отсортированные курсы
    return coursesWithScores.map(item => item.course);
  }
  
  /**
   * Логирование действий пользователя для сбора данных для ML
   */
  async logUserActivity(userId: number, actionType: string, entityType: string, entityId: number, metadata?: any) {
    await this.mlStorage.logUserActivity({
      userId,
      actionType: actionType as any,
      entityType: entityType as any,
      entityId,
      metadata,
    });
  }
  
  /**
   * Запись события обучения для аналитики
   */
  async recordLearningEvent(userId: number, eventType: string, entityType?: string, entityId?: number, data?: any) {
    await this.mlStorage.createLearningEvent({
      userId,
      eventType,
      entityType: entityType as any,
      entityId,
      data,
    });
  }
}
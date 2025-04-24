/**
 * ml-service.ts
 * Сервис для работы с ML-моделями и рекомендациями
 */

import { Course, User, UserProfile } from "@shared/schema";
import { MLStorage } from "../storage-ml";
import OpenAI from "openai";

export class MLService {
  private mlStorage: MLStorage;
  private openai: OpenAI | null = null;
  private featureFlags: Record<string, boolean> = {};

  constructor(mlStorage: MLStorage) {
    this.mlStorage = mlStorage;
    
    // Инициализация OpenAI, если доступен ключ API
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    }
    
    // Предзагрузка feature flags
    this.loadFeatureFlags();
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
      const isEnabled = await this.mlStorage.isFeatureEnabled(featureName, userId);
      // Обновляем кеш
      this.featureFlags[featureName] = isEnabled;
      return isEnabled;
    } catch (error) {
      console.error(`Error checking feature flag ${featureName}:`, error);
      // Если произошла ошибка, используем кешированное значение (если оно есть)
      if (this.featureFlags[featureName] !== undefined) {
        return this.featureFlags[featureName];
      }
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
  async generateEmbedding(text: string): Promise<number[] | null> {
    // Проверяем, включена ли функция генерации эмбеддингов
    const isEnabled = await this.isFeatureEnabled("embeddings_generation");
    
    if (!isEnabled) {
      console.log("Embeddings generation is disabled");
      return null;
    }
    
    if (!this.openai) {
      console.error("OpenAI API is not initialized");
      return null;
    }
    
    try {
      const response = await this.openai.embeddings.create({
        model: "text-embedding-ada-002", // используем актуальную модель для эмбеддингов
        input: text,
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
    // Создаем текстовое представление курса для эмбеддинга
    const courseText = `
      Название: ${course.title}
      Описание: ${course.description || ""}
      Категория: ${course.category || ""}
      Уровень сложности: ${course.difficulty || ""}
      Технологии: ${course.technologies?.join(", ") || ""}
      Теги: ${course.tags?.join(", ") || ""}
    `;
    
    const embedding = await this.generateEmbedding(courseText);
    
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
    
    const embedding = await this.generateEmbedding(profileText);
    
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
   * Генерация персонализированных рекомендаций курсов для пользователя
   */
  async generateCourseRecommendations(userId: number, courses: Course[]): Promise<Course[]> {
    // Проверяем, включена ли функция рекомендаций
    const isEnabled = await this.isFeatureEnabled("course_recommendations", userId);
    
    if (!isEnabled) {
      console.log("Course recommendations are disabled");
      return courses;
    }
    
    try {
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
      for (let i = 0; i < courseScores.length; i++) {
        const score = courseScores[i].score;
        const courseId = courseScores[i].course.id;
        
        const recommendation: {
          userId: number;
          entityType: "course";
          entityId: number;
          score: number;
          rankPosition: number;
        } = {
          userId,
          entityType: "course",
          entityId: courseId,
          score,
          rankPosition: i + 1
        };
        
        // Сохраняем рекомендацию в базе данных
        try {
          await this.mlStorage.createUserRecommendation(recommendation);
        } catch (error) {
          console.error("Error saving recommendation:", error);
        }
      }
      
      // Возвращаем отсортированные курсы
      return courseScores.map(item => item.course);
    } catch (error) {
      console.error("Error generating course recommendations:", error);
      return courses;
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
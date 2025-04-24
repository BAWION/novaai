/**
 * storage-ml.ts
 * Расширение для DatabaseStorage с методами для ML-компонентов
 */

import {
  featureFlags,
  userActivityLogs,
  mlModels,
  userRecommendations,
  mlDataSnapshots,
  learningEvents,
  contentEmbeddings,
  userEmbeddings,
  type InsertFeatureFlag,
  type InsertUserActivityLog,
  type InsertMlModel,
  type InsertUserRecommendation,
  type InsertLearningEvent,
  type FeatureFlag,
  type UserActivityLog,
  type MlModel,
  type UserRecommendation,
  type MlDataSnapshot,
  type LearningEvent,
  type ContentEmbedding,
  type UserEmbedding,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, sql, desc, getTableColumns, inArray } from "drizzle-orm";

/**
 * Методы для работы с ML-компонентами
 * Эти методы будут интегрированы в DatabaseStorage
 */
export class MLStorage {
  /**
   * Feature Flags - работа с флагами функций
   */
  async getFeatureFlag(name: string): Promise<FeatureFlag | undefined> {
    const [flag] = await db.select().from(featureFlags).where(eq(featureFlags.name, name));
    return flag;
  }

  async getAllFeatureFlags(): Promise<FeatureFlag[]> {
    return await db.select().from(featureFlags);
  }

  async createFeatureFlag(flag: InsertFeatureFlag): Promise<FeatureFlag> {
    const [newFlag] = await db.insert(featureFlags).values(flag).returning();
    return newFlag;
  }

  async updateFeatureFlag(id: number, data: Partial<FeatureFlag>): Promise<FeatureFlag> {
    const [updatedFlag] = await db
      .update(featureFlags)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(featureFlags.id, id))
      .returning();
    return updatedFlag;
  }

  async isFeatureEnabled(name: string, userId?: number): Promise<boolean> {
    const flag = await this.getFeatureFlag(name);
    if (!flag) return false;
    
    // Проверяем общий статус
    if (flag.status === 'disabled') return false;
    if (flag.status === 'enabled') return true;
    
    // Для beta статуса проверяем правила
    
    // 1. Проверка на процент пользователей
    if (flag.rolloutPercentage) {
      if (!userId) return false;
      
      // Используем детерминистическую функцию на основе userId и имени фичи
      // для равномерного распределения по пользователям
      const hash = this.simpleHash(`${userId}-${name}`);
      const percentage = hash % 100;
      
      if (percentage >= flag.rolloutPercentage) return false;
    }
    
    // 2. Проверка на целевую аудиторию
    if (flag.targetAudience && userId) {
      // Здесь в полной реализации мы проверяем соответствие пользователя
      // правилам сегментации из targetAudience JSON
      // Упрощенно: считаем, что если есть targetAudience и userId в списке, то позволяем
      const targetUsers = flag.targetAudience['userIds'] as number[] || [];
      if (targetUsers.length > 0 && !targetUsers.includes(userId)) {
        return false;
      }
    }
    
    return true;
  }
  
  // Простая хеш-функция для детерминистической генерации чисел для процентов
  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  /**
   * ML Models - работа с моделями машинного обучения
   */
  async getMlModel(id: number): Promise<MlModel | undefined> {
    const [model] = await db.select().from(mlModels).where(eq(mlModels.id, id));
    return model;
  }

  async getMlModelByNameAndVersion(name: string, version: string): Promise<MlModel | undefined> {
    const [model] = await db
      .select()
      .from(mlModels)
      .where(and(
        eq(mlModels.name, name),
        eq(mlModels.version, version)
      ));
    return model;
  }

  async getActiveMlModelByType(type: string): Promise<MlModel | undefined> {
    const [model] = await db
      .select()
      .from(mlModels)
      .where(and(
        eq(mlModels.type, type as any),
        eq(mlModels.active, true)
      ));
    return model;
  }

  async getAllMlModels(): Promise<MlModel[]> {
    return await db.select().from(mlModels);
  }

  async createMlModel(model: InsertMlModel): Promise<MlModel> {
    const [newModel] = await db.insert(mlModels).values(model).returning();
    return newModel;
  }

  async updateMlModel(id: number, data: Partial<MlModel>): Promise<MlModel> {
    const [updatedModel] = await db
      .update(mlModels)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(mlModels.id, id))
      .returning();
    return updatedModel;
  }

  async setMlModelActive(id: number): Promise<MlModel> {
    // Получаем текущую модель
    const model = await this.getMlModel(id);
    if (!model) {
      throw new Error(`Model with id ${id} not found`);
    }
    
    // Сначала деактивируем все модели того же типа
    await db
      .update(mlModels)
      .set({ active: false })
      .where(eq(mlModels.type, model.type));
    
    // Затем активируем нужную модель
    const [updatedModel] = await db
      .update(mlModels)
      .set({ 
        active: true,
        updatedAt: new Date()
      })
      .where(eq(mlModels.id, id))
      .returning();
    
    return updatedModel;
  }

  /**
   * User Recommendations - работа с рекомендациями для пользователей
   */
  async getUserRecommendations(userId: number, entityType?: string): Promise<UserRecommendation[]> {
    let query = db.select().from(userRecommendations)
      .where(eq(userRecommendations.userId, userId));
    
    if (entityType) {
      query = query.where(eq(userRecommendations.entityType, entityType as any));
    }
    
    return await query
      .orderBy(desc(userRecommendations.score))
      .limit(20);
  }

  async createUserRecommendation(recommendation: InsertUserRecommendation): Promise<UserRecommendation> {
    const [newRecommendation] = await db
      .insert(userRecommendations)
      .values(recommendation)
      .returning();
    return newRecommendation;
  }

  async markRecommendationAsShown(id: number): Promise<UserRecommendation> {
    const [updatedRecommendation] = await db
      .update(userRecommendations)
      .set({ shown: true })
      .where(eq(userRecommendations.id, id))
      .returning();
    return updatedRecommendation;
  }

  async markRecommendationAsClicked(id: number): Promise<UserRecommendation> {
    const [updatedRecommendation] = await db
      .update(userRecommendations)
      .set({ clicked: true })
      .where(eq(userRecommendations.id, id))
      .returning();
    return updatedRecommendation;
  }

  /**
   * User Activity Logs - логирование активности пользователей для ML
   */
  async logUserActivity(activityLog: InsertUserActivityLog): Promise<UserActivityLog> {
    const [newActivityLog] = await db
      .insert(userActivityLogs)
      .values(activityLog)
      .returning();
    return newActivityLog;
  }

  async getUserActivities(
    userId: number,
    params?: {
      actionType?: string;
      entityType?: string;
      entityId?: number;
      limit?: number;
      offset?: number;
    }
  ): Promise<UserActivityLog[]> {
    let query = db.select().from(userActivityLogs)
      .where(eq(userActivityLogs.userId, userId));
    
    if (params?.actionType) {
      query = query.where(eq(userActivityLogs.actionType, params.actionType as any));
    }
    
    if (params?.entityType) {
      query = query.where(eq(userActivityLogs.entityType, params.entityType as any));
    }
    
    if (params?.entityId) {
      query = query.where(eq(userActivityLogs.entityId, params.entityId));
    }
    
    query = query.orderBy(desc(userActivityLogs.timestamp));
    
    if (params?.limit) {
      query = query.limit(params.limit);
    }
    
    if (params?.offset) {
      query = query.offset(params.offset);
    }
    
    return await query;
  }

  /**
   * Learning Events - трекинг событий обучения для аналитики и ML
   */
  async createLearningEvent(event: InsertLearningEvent): Promise<LearningEvent> {
    const [newEvent] = await db
      .insert(learningEvents)
      .values(event)
      .returning();
    return newEvent;
  }

  async getLearningEvents(
    userId: number,
    params?: {
      eventType?: string;
      entityType?: string;
      entityId?: number;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
    }
  ): Promise<LearningEvent[]> {
    let query = db.select().from(learningEvents)
      .where(eq(learningEvents.userId, userId));
    
    if (params?.eventType) {
      query = query.where(eq(learningEvents.eventType, params.eventType));
    }
    
    if (params?.entityType) {
      query = query.where(eq(learningEvents.entityType, params.entityType as any));
    }
    
    if (params?.entityId) {
      query = query.where(eq(learningEvents.entityId, params.entityId));
    }
    
    if (params?.startDate) {
      query = query.where(sql`${learningEvents.timestamp} >= ${params.startDate}`);
    }
    
    if (params?.endDate) {
      query = query.where(sql`${learningEvents.timestamp} <= ${params.endDate}`);
    }
    
    query = query.orderBy(desc(learningEvents.timestamp));
    
    if (params?.limit) {
      query = query.limit(params.limit);
    }
    
    return await query;
  }

  /**
   * ML Data Snapshots - управление снимками данных для обучения ML
   */
  async createMlDataSnapshot(snapshot: {
    modelId?: number;
    name: string;
    description?: string;
    dataPath: string;
    metrics?: any;
  }): Promise<MlDataSnapshot> {
    const [newSnapshot] = await db
      .insert(mlDataSnapshots)
      .values(snapshot)
      .returning();
    return newSnapshot;
  }

  async getMlDataSnapshots(modelId?: number): Promise<MlDataSnapshot[]> {
    let query = db.select().from(mlDataSnapshots);
    
    if (modelId) {
      query = query.where(eq(mlDataSnapshots.modelId, modelId));
    }
    
    return await query.orderBy(desc(mlDataSnapshots.createdAt));
  }

  async updateMlDataSnapshotTrainingStatus(
    id: number,
    trainingComplete: boolean,
    trainingMetrics?: any
  ): Promise<MlDataSnapshot> {
    const [updatedSnapshot] = await db
      .update(mlDataSnapshots)
      .set({
        trainingComplete,
        trainingMetrics,
      })
      .where(eq(mlDataSnapshots.id, id))
      .returning();
    return updatedSnapshot;
  }

  /**
   * Content & User Embeddings - векторные представления для рекомендаций
   */
  async saveContentEmbedding(data: {
    entityType: string;
    entityId: number;
    embedding: number[];
  }): Promise<ContentEmbedding> {
    // Проверяем, существует ли уже такой embedding
    const [existing] = await db.select()
      .from(contentEmbeddings)
      .where(and(
        eq(contentEmbeddings.entityType, data.entityType as any),
        eq(contentEmbeddings.entityId, data.entityId)
      ));
    
    if (existing) {
      // Обновляем существующий
      const [updated] = await db.update(contentEmbeddings)
        .set({
          embedding: data.embedding,
          updatedAt: new Date()
        })
        .where(eq(contentEmbeddings.id, existing.id))
        .returning();
      return updated;
    } else {
      // Создаем новый
      const [newEmbedding] = await db.insert(contentEmbeddings)
        .values(data)
        .returning();
      return newEmbedding;
    }
  }

  async getContentEmbedding(entityType: string, entityId: number): Promise<ContentEmbedding | undefined> {
    const [embedding] = await db.select()
      .from(contentEmbeddings)
      .where(and(
        eq(contentEmbeddings.entityType, entityType as any),
        eq(contentEmbeddings.entityId, entityId)
      ));
    return embedding;
  }

  async saveUserEmbedding(userId: number, embedding: number[]): Promise<UserEmbedding> {
    // Проверяем, существует ли уже embedding для пользователя
    const [existing] = await db.select()
      .from(userEmbeddings)
      .where(eq(userEmbeddings.userId, userId));
    
    if (existing) {
      // Обновляем существующий
      const [updated] = await db.update(userEmbeddings)
        .set({
          embedding,
          updatedAt: new Date()
        })
        .where(eq(userEmbeddings.id, existing.id))
        .returning();
      return updated;
    } else {
      // Создаем новый
      const [newEmbedding] = await db.insert(userEmbeddings)
        .values({ userId, embedding })
        .returning();
      return newEmbedding;
    }
  }

  async getUserEmbedding(userId: number): Promise<UserEmbedding | undefined> {
    const [embedding] = await db.select()
      .from(userEmbeddings)
      .where(eq(userEmbeddings.userId, userId));
    return embedding;
  }
}
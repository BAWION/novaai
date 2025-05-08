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
  eventLogs,
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
  type EventLog,
  type InsertEventLog,
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
    if (!flag) {
      console.log(`Feature flag ${name} not found`);
      return false;
    }
    
    console.log(`Feature flag ${name} found:`, {
      status: flag.status,
      rolloutPercentage: flag.rolloutPercentage,
      targetAudience: flag.targetAudience
    });
    
    // Проверяем общий статус
    if (flag.status === 'disabled') {
      console.log(`Feature flag ${name} disabled by status`);
      return false;
    }
    
    if (flag.status === 'enabled') {
      console.log(`Feature flag ${name} enabled by status`);
      return true;
    }
    
    // Для beta статуса проверяем правила
    console.log(`Feature flag ${name} in beta status, checking rules...`);
    
    // 1. Проверка на процент пользователей
    if (flag.rolloutPercentage !== null && flag.rolloutPercentage !== undefined) {
      if (!userId) {
        console.log(`Feature flag ${name} disabled, no userId provided for rollout check`);
        return false;
      }
      
      // Используем детерминистическую функцию на основе userId и имени фичи
      // для равномерного распределения по пользователям
      const hash = this.simpleHash(`${userId}-${name}`);
      const percentage = hash % 100;
      
      console.log(`User ${userId} hash percentage for ${name}: ${percentage}, rollout: ${flag.rolloutPercentage}`);
      
      if (percentage >= flag.rolloutPercentage) {
        console.log(`Feature flag ${name} disabled for user ${userId}, outside rollout percentage`);
        return false;
      }
      
      console.log(`Feature flag ${name} enabled for user ${userId} by rollout percentage`);
    }
    
    // 2. Проверка на целевую аудиторию
    if (flag.targetAudience && userId) {
      console.log(`Checking target audience for ${name}:`, flag.targetAudience);
      
      // Здесь в полной реализации мы проверяем соответствие пользователя
      // правилам сегментации из targetAudience JSON
      // Упрощенно: считаем, что если есть targetAudience и userId в списке, то позволяем
      const targetUsers = flag.targetAudience['userIds'] as number[] || [];
      
      if (targetUsers.length > 0 && !targetUsers.includes(userId)) {
        console.log(`Feature flag ${name} disabled for user ${userId}, not in target audience`);
        return false;
      }
      
      console.log(`Feature flag ${name} enabled for user ${userId} by target audience`);
    }
    
    console.log(`Feature flag ${name} enabled, passed all checks`);
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

  /**
   * Event Logs - универсальное логирование событий для метрик и аналитики
   */
  async logEvent(eventData: InsertEventLog): Promise<EventLog> {
    const [event] = await db
      .insert(eventLogs)
      .values(eventData)
      .returning();
    return event;
  }

  async getEvents(
    params?: {
      userId?: number;
      eventType?: string;
      startDate?: Date;
      endDate?: Date;
      limit?: number;
      offset?: number;
    }
  ): Promise<EventLog[]> {
    let query = db.select().from(eventLogs);
    
    if (params?.userId) {
      query = query.where(eq(eventLogs.userId, params.userId));
    }
    
    if (params?.eventType) {
      query = query.where(eq(eventLogs.eventType, params.eventType));
    }
    
    if (params?.startDate) {
      query = query.where(sql`${eventLogs.timestamp} >= ${params.startDate}`);
    }
    
    if (params?.endDate) {
      query = query.where(sql`${eventLogs.timestamp} <= ${params.endDate}`);
    }
    
    query = query.orderBy(desc(eventLogs.timestamp));
    
    if (params?.limit) {
      query = query.limit(params.limit);
    }
    
    if (params?.offset) {
      query = query.offset(params.offset);
    }
    
    return await query;
  }

  /**
   * S3 (SMART QUEST) - Получение информации о пользователе
   */
  async getUser(userId: number) {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      return user;
    } catch (error) {
      console.error(`Error getting user ${userId}:`, error);
      return null;
    }
  }
  
  /**
   * S3 (SMART QUEST) - Получение профиля пользователя
   */
  async getUserProfile(userId: number) {
    try {
      const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
      return profile;
    } catch (error) {
      console.error(`Error getting profile for user ${userId}:`, error);
      return null;
    }
  }
  
  /**
   * S3 (SMART QUEST) - Получение навыков пользователя
   */
  async getUserSkills(userId: number) {
    try {
      return await db.select().from(userSkillsDnaProgress).where(eq(userSkillsDnaProgress.userId, userId));
    } catch (error) {
      console.error(`Error getting skills for user ${userId}:`, error);
      return [];
    }
  }
  
  /**
   * S3 (SMART QUEST) - Получение требуемых навыков для курса
   */
  async getCourseSkillRequirements(courseId: number) {
    try {
      return await db.select().from(courseSkillRequirements).where(eq(courseSkillRequirements.courseId, courseId));
    } catch (error) {
      console.error(`Error getting skill requirements for course ${courseId}:`, error);
      return [];
    }
  }
  
  /**
   * S3 (SMART QUEST) - Получение статистики курса
   */
  async getCourseStatistics(courseId: number) {
    try {
      // Получаем количество записанных на курс студентов
      const [enrollmentCount] = await db
        .select({ count: sql<number>`count(*)` })
        .from(courseEnrollments)
        .where(eq(courseEnrollments.courseId, courseId));
      
      // Получаем среднюю оценку курса
      const [avgRating] = await db
        .select({ avg: sql<number>`avg(rating)` })
        .from(courseRatings)
        .where(eq(courseRatings.courseId, courseId));
      
      // Получаем количество завершивших курс
      const [completionCount] = await db
        .select({ count: sql<number>`count(*)` })
        .from(courseEnrollments)
        .where(
          and(
            eq(courseEnrollments.courseId, courseId),
            eq(courseEnrollments.status, 'completed')
          )
        );
      
      return {
        enrollmentCount: enrollmentCount?.count || 0,
        avgRating: avgRating?.avg || 0,
        completionCount: completionCount?.count || 0
      };
    } catch (error) {
      console.error(`Error getting statistics for course ${courseId}:`, error);
      return {
        enrollmentCount: 0,
        avgRating: 0,
        completionCount: 0
      };
    }
  }
  
  async getEventStats(
    eventType: string,
    timeframe: 'day' | 'week' | 'month',
    startDate?: Date,
    endDate?: Date
  ): Promise<{ date: string; count: number }[]> {
    // Определяем SQL-выражение для группировки по дате в зависимости от timeframe
    let dateGroupSql;
    switch (timeframe) {
      case 'day':
        dateGroupSql = sql`DATE_TRUNC('day', ${eventLogs.timestamp})`;
        break;
      case 'week':
        dateGroupSql = sql`DATE_TRUNC('week', ${eventLogs.timestamp})`;
        break;
      case 'month':
        dateGroupSql = sql`DATE_TRUNC('month', ${eventLogs.timestamp})`;
        break;
    }

    let query = db
      .select({
        date: dateGroupSql,
        count: sql`COUNT(*)`
      })
      .from(eventLogs)
      .where(eq(eventLogs.eventType, eventType));

    if (startDate) {
      query = query.where(sql`${eventLogs.timestamp} >= ${startDate}`);
    }

    if (endDate) {
      query = query.where(sql`${eventLogs.timestamp} <= ${endDate}`);
    }

    query = query.groupBy(dateGroupSql).orderBy(dateGroupSql);

    const result = await query;
    
    return result.map(row => ({
      date: row.date.toISOString().split('T')[0],
      count: Number(row.count)
    }));
  }
}
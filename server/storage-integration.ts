/**
 * storage-integration.ts
 * Интеграция DatabaseStorage с MLStorage
 */

import { DatabaseStorage } from "./database-storage";
import { MLStorage } from "./storage-ml";
import { MLService } from "./services/ml-service";

/**
 * Создает расширенное хранилище, которое объединяет основное хранилище с ML-функциями
 */
export function createIntegratedStorage(): DatabaseStorage {
  // Создаем экземпляр MLStorage
  const mlStorage = new MLStorage();
  
  // Создаем экземпляр MLService
  const mlService = new MLService(mlStorage);
  
  // Создаем основное хранилище
  const dbStorage = new DatabaseStorage();
  
  // Расширяем методы хранилища для интеграции с ML-функциями
  
  // Переопределяем метод получения всех курсов для персонализации
  const originalGetAllCourses = dbStorage.getAllCourses.bind(dbStorage);
  dbStorage.getAllCourses = async function() {
    const courses = await originalGetAllCourses();
    
    // Если есть авторизованный пользователь в текущем контексте
    // выполняем персонализацию курсов
    const userId = getCurrentUserId();
    if (userId) {
      try {
        return await mlService.generateCourseRecommendations(userId, courses);
      } catch (error) {
        console.error("Error generating course recommendations:", error);
        return courses;
      }
    }
    
    return courses;
  };
  
  // Переопределяем метод getFilteredCourses для персонализации
  const originalGetFilteredCourses = dbStorage.getFilteredCourses.bind(dbStorage);
  dbStorage.getFilteredCourses = async function(filters) {
    const courses = await originalGetFilteredCourses(filters);
    
    // Если есть авторизованный пользователь в текущем контексте
    // выполняем персонализацию курсов
    const userId = getCurrentUserId();
    if (userId) {
      try {
        return await mlService.generateCourseRecommendations(userId, courses);
      } catch (error) {
        console.error("Error generating course recommendations:", error);
        return courses;
      }
    }
    
    return courses;
  };
  
  // Логируем действия пользователя при взаимодействии с курсами
  const originalUpdateUserCourseProgress = dbStorage.updateUserCourseProgress.bind(dbStorage);
  dbStorage.updateUserCourseProgress = async function(userId, courseId, data) {
    const result = await originalUpdateUserCourseProgress(userId, courseId, data);
    
    // Логируем событие прогресса для ML
    try {
      await mlService.logUserActivity(
        userId,
        "complete",
        "course",
        courseId,
        { progress: data.progress }
      );
      
      // Если курс завершен, добавляем специальное событие
      if (data.completedAt || data.progress >= 100) {
        await mlService.recordLearningEvent(
          userId,
          "course_completed",
          "course",
          courseId,
          { completedAt: data.completedAt || new Date() }
        );
      }
    } catch (error) {
      console.error("Error logging course progress:", error);
    }
    
    return result;
  };
  
  // Расширяем метод обновления профиля для генерации embeddings
  const originalUpdateUserProfile = dbStorage.updateUserProfile.bind(dbStorage);
  dbStorage.updateUserProfile = async function(userId, data) {
    const result = await originalUpdateUserProfile(userId, data);
    
    // Генерируем новый embedding при обновлении профиля
    try {
      const user = await dbStorage.getUser(userId);
      const profile = await dbStorage.getUserProfile(userId);
      
      if (user && profile) {
        await mlService.generateUserEmbedding(user, profile);
      }
    } catch (error) {
      console.error("Error generating user embedding:", error);
    }
    
    return result;
  };
  
  // Добавляем новые методы для работы с ML-функциями
  
  // Feature flags
  (dbStorage as any).isFeatureEnabled = async function(featureName: string, userId?: number) {
    return await mlService.isFeatureEnabled(featureName, userId);
  };
  
  // Логирование событий
  (dbStorage as any).logUserActivity = async function(userId: number, actionType: string, entityType: string, entityId: number, metadata?: any) {
    return await mlService.logUserActivity(userId, actionType, entityType, entityId, metadata);
  };
  
  (dbStorage as any).recordLearningEvent = async function(userId: number, eventType: string, entityType?: string, entityId?: number, data?: any) {
    return await mlService.recordLearningEvent(userId, eventType, entityType, entityId, data);
  };
  
  return dbStorage;
}

// Вспомогательная функция для получения текущего пользователя из контекста запроса
// В реальной реализации это будет связано с middleware для хранения текущего пользователя
let currentUserId: number | null = null;

export function setCurrentUserId(userId: number | null) {
  currentUserId = userId;
}

export function getCurrentUserId(): number | null {
  return currentUserId;
}

// Инициализируем интегрированное хранилище
export const integratedStorage = createIntegratedStorage();
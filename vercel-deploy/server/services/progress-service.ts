/**
 * progress-service.ts
 * Сервис для отслеживания прогресса пользователя в прохождении уроков
 * и автоматического обновления связанных навыков.
 */

import { db } from '../db';
import { 
  userLessonProgress,
  lessons,
  courseModules,
  userCourseProgress,
  lessonSkillsDna
} from '@shared/schema';
import { eq, and, sql } from 'drizzle-orm';
import { skillGraphService, skillEventBus } from './skill-graph-service';

interface LessonCompletionResult {
  lessonId: number;
  userId: number;
  status: 'completed' | 'in_progress' | 'not_started';
  completedAt?: Date;
  updatedSkills?: any[];
}

class ProgressService {
  /**
   * Отмечает урок как завершенный и обновляет соответствующие навыки
   * @param userId ID пользователя
   * @param lessonId ID урока
   * @param position Позиция в уроке (если урок не завершен)
   * @returns Результат операции
   */
  async markLessonProgress(
    userId: number,
    lessonId: number,
    status: 'completed' | 'in_progress' | 'not_started' = 'in_progress',
    position: number = 0
  ): Promise<LessonCompletionResult> {
    console.log(`[ProgressService] Обновление прогресса по уроку ${lessonId} для пользователя ${userId}: статус=${status}, позиция=${position}`);
    
    // Проверяем, существует ли запись о прогрессе
    const [existingProgress] = await db
      .select()
      .from(userLessonProgress)
      .where(
        and(
          eq(userLessonProgress.userId, userId),
          eq(userLessonProgress.lessonId, lessonId)
        )
      );
    
    // Подготавливаем данные для обновления или создания
    const now = new Date();
    const isCompleted = status === 'completed';
    const updateData = {
      status,
      lastPosition: position,
      updatedAt: now,
      completedAt: isCompleted ? now : existingProgress?.completedAt
    };
    
    // Обновляем или создаем запись о прогрессе
    if (existingProgress) {
      // Проверяем, не помечен ли урок уже как завершенный
      if (existingProgress.status === 'completed' && status === 'completed') {
        // Урок уже был завершен, возвращаем текущее состояние
        return {
          lessonId,
          userId,
          status: 'completed',
          completedAt: existingProgress.completedAt || undefined
        };
      }
      
      // Обновляем существующую запись
      await db
        .update(userLessonProgress)
        .set(updateData)
        .where(
          and(
            eq(userLessonProgress.userId, userId),
            eq(userLessonProgress.lessonId, lessonId)
          )
        );
    } else {
      // Создаем новую запись
      await db
        .insert(userLessonProgress)
        .values({
          userId,
          lessonId,
          status,
          lastPosition: position,
          completedAt: isCompleted ? now : null
        });
    }
    
    // Если урок помечен как завершенный, обновляем навыки
    const updatedSkills = [];
    if (isCompleted) {
      // Получаем информацию об уроке
      const [lesson] = await db
        .select()
        .from(lessons)
        .where(eq(lessons.id, lessonId));
      
      if (lesson) {
        // Получаем связанные с уроком компетенции
        const lessonSkills = await db
          .select()
          .from(lessonSkillsDna)
          .where(eq(lessonSkillsDna.lessonId, lessonId));
        
        // Получаем модуль урока для дополнительного контекста
        const [module] = await db
          .select()
          .from(courseModules)
          .where(eq(courseModules.id, lesson.moduleId));
        
        // Рассчитываем earned XP на основе сложности урока и типа контента
        const baseXp = 10; // Базовый опыт за урок
        const durationMultiplier = lesson.estimatedDuration ? Math.min(3, lesson.estimatedDuration / 10) : 1;
        const earnedXp = Math.round(baseXp * durationMultiplier);
        
        console.log(`[ProgressService] Начисление опыта за урок ${lessonId}: ${earnedXp} XP`);
        
        // Обновляем прогресс по модулю и курсу
        if (module) {
          await this.updateModuleProgress(userId, module.id);
          await this.updateCourseProgress(userId, module.courseId);
        }
        
        // Обновляем навыки на основе связанных компетенций
        for (const skillDna of lessonSkills) {
          // Увеличиваем уровень соответствующих навыков
          const contributionLevel = skillDna.contributionLevel || 1.0;
          const skillXp = Math.round(earnedXp * contributionLevel);
          const deltaLevel = Math.round(contributionLevel * 2); // Примерное изменение уровня
          
          // Обновляем уровень в Skills DNA напрямую
          const result = await skillGraphService.updateSkill(
            userId,
            skillDna.dnaId,
            deltaLevel,
            skillXp
          );
          
          updatedSkills.push({
            skillId: skillDna.dnaId,
            deltaLevel,
            newLevel: result.newLevel,
            xpGained: skillXp
          });
        }
      }
    }
    
    // Отправляем событие об изменении навыков для обновления Bridge
    if (updatedSkills.length > 0) {
      skillEventBus.emit('skills_changed', userId);
      console.log(`[ProgressService] Отправлено событие skills_changed для пользователя ${userId}`);
    }
    
    return {
      lessonId,
      userId,
      status,
      completedAt: isCompleted ? now : undefined,
      updatedSkills: updatedSkills.length > 0 ? updatedSkills : undefined
    };
  }
  
  /**
   * Обновляет процент выполнения модуля
   * @param userId ID пользователя
   * @param moduleId ID модуля
   */
  private async updateModuleProgress(userId: number, moduleId: number): Promise<void> {
    // Получаем список всех уроков в модуле
    const moduleLessons = await db
      .select()
      .from(lessons)
      .where(eq(lessons.moduleId, moduleId));
      
    if (moduleLessons.length === 0) {
      return;
    }
    
    // Получаем список завершенных уроков
    const completedLessons = await db
      .select()
      .from(userLessonProgress)
      .where(
        and(
          eq(userLessonProgress.userId, userId),
          eq(userLessonProgress.status, 'completed')
        )
      );
      
    // Подсчитываем количество завершенных уроков в модуле
    const completedLessonIds = completedLessons.map(lesson => lesson.lessonId);
    let completedInModule = 0;
    
    for (const lesson of moduleLessons) {
      if (completedLessonIds.includes(lesson.id)) {
        completedInModule++;
      }
    }
    
    // Рассчитываем процент выполнения
    const moduleProgress = Math.round((completedInModule / moduleLessons.length) * 100);
    
    console.log(`[ProgressService] Прогресс по модулю ${moduleId}: ${completedInModule}/${moduleLessons.length} уроков (${moduleProgress}%)`);
    
    // Обновляем запись о прогрессе модуля
    // Примечание: в текущей схеме БД нет отдельной таблицы для прогресса модулей,
    // но можно было бы добавить для более детального отслеживания
  }
  
  /**
   * Обновляет процент выполнения курса
   * @param userId ID пользователя
   * @param courseId ID курса
   */
  private async updateCourseProgress(userId: number, courseId: number): Promise<void> {
    // Получаем все модули курса
    const courseModulesList = await db
      .select()
      .from(courseModules)
      .where(eq(courseModules.courseId, courseId));
      
    if (courseModulesList.length === 0) {
      return;
    }
    
    // Получаем все уроки для модулей этого курса
    const moduleIds = courseModulesList.map(module => module.id);
    const courseLessons = await db
      .select()
      .from(lessons)
      .where(sql`lessons.module_id IN (${moduleIds.join(',')})`);
      
    // Получаем список завершенных уроков
    const completedLessons = await db
      .select()
      .from(userLessonProgress)
      .where(
        and(
          eq(userLessonProgress.userId, userId),
          eq(userLessonProgress.status, 'completed')
        )
      );
      
    // Подсчитываем количество завершенных уроков в курсе
    const completedLessonIds = completedLessons.map(lesson => lesson.lessonId);
    let completedInCourse = 0;
    
    for (const lesson of courseLessons) {
      if (completedLessonIds.includes(lesson.id)) {
        completedInCourse++;
      }
    }
    
    // Рассчитываем процент выполнения
    const courseProgress = Math.round((completedInCourse / courseLessons.length) * 100);
    const completedModules = this.calculateCompletedModules(courseModulesList, courseLessons, completedLessonIds);
    
    console.log(`[ProgressService] Прогресс по курсу ${courseId}: ${completedInCourse}/${courseLessons.length} уроков (${courseProgress}%), завершено модулей: ${completedModules}`);
    
    // Проверяем, существует ли запись о прогрессе курса
    const [existingProgress] = await db
      .select()
      .from(userCourseProgress)
      .where(
        and(
          eq(userCourseProgress.userId, userId),
          eq(userCourseProgress.courseId, courseId)
        )
      );
      
    const now = new Date();
    
    if (existingProgress) {
      // Обновляем существующую запись
      await db
        .update(userCourseProgress)
        .set({ 
          progress: courseProgress,
          completedModules,
          lastAccessedAt: now,
          completedAt: courseProgress === 100 ? now : null
        })
        .where(
          and(
            eq(userCourseProgress.userId, userId),
            eq(userCourseProgress.courseId, courseId)
          )
        );
    } else {
      // Создаем новую запись
      await db
        .insert(userCourseProgress)
        .values({
          userId,
          courseId,
          progress: courseProgress,
          completedModules,
          startedAt: now,
          lastAccessedAt: now,
          completedAt: courseProgress === 100 ? now : null
        });
    }
  }
  
  /**
   * Подсчитывает количество завершенных модулей
   * @param modules Список модулей
   * @param lessons Список уроков
   * @param completedLessonIds ID завершенных уроков
   * @returns Количество завершенных модулей
   */
  private calculateCompletedModules(modules: any[], lessons: any[], completedLessonIds: number[]): number {
    let completedModules = 0;
    
    for (const module of modules) {
      const moduleLessons = lessons.filter(lesson => lesson.moduleId === module.id);
      if (moduleLessons.length === 0) continue;
      
      let allCompleted = true;
      for (const lesson of moduleLessons) {
        if (!completedLessonIds.includes(lesson.id)) {
          allCompleted = false;
          break;
        }
      }
      
      if (allCompleted) {
        completedModules++;
      }
    }
    
    return completedModules;
  }
}

// Экспортируем экземпляр сервиса
export const progressService = new ProgressService();
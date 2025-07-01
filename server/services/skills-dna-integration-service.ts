/**
 * Сервис для интеграции курсов с Skills DNA
 * Обеспечивает динамическое обновление навыков при прохождении обучения
 */

import { eq, and, desc, sql } from "drizzle-orm";
import { db } from "../db";
import { 
  userSkillsDnaProgress, 
  skillsDna,
  users,
  lessons,
  assignments,
  courseModules,
  courses
} from "../../shared/schema";
import {
  courseSkillsDnaMapping,
  moduleSkillsDnaMapping,
  lessonSkillsDnaImpact,
  assignmentSkillsDnaImpact,
  skillsDnaProgressHistory,
  type SkillProgressUpdate,
  type LessonWithSkillsImpact,
  type CourseWithSkillsMapping
} from "../../shared/skills-dna-integration-schema";

export class SkillsDnaIntegrationService {
  
  /**
   * Обновляет Skills DNA прогресс после завершения урока
   */
  async updateSkillsAfterLessonCompletion(userId: number, lessonId: number): Promise<void> {
    console.log(`[SkillsDnaIntegration] Обновление навыков для пользователя ${userId} после урока ${lessonId}`);
    
    try {
      // Получаем влияние урока на навыки
      const lessonImpacts = await db
        .select({
          dnaId: lessonSkillsDnaImpact.dnaId,
          impactWeight: lessonSkillsDnaImpact.impactWeight,
          progressPoints: lessonSkillsDnaImpact.progressPoints,
          bloomLevel: lessonSkillsDnaImpact.bloomLevel,
          learningOutcome: lessonSkillsDnaImpact.learningOutcome,
          skillName: skillsDna.name,
          skillCategory: skillsDna.category
        })
        .from(lessonSkillsDnaImpact)
        .innerJoin(skillsDna, eq(lessonSkillsDnaImpact.dnaId, skillsDna.id))
        .where(eq(lessonSkillsDnaImpact.lessonId, lessonId));

      if (lessonImpacts.length === 0) {
        console.log(`[SkillsDnaIntegration] Урок ${lessonId} не связан с навыками Skills DNA`);
        return;
      }

      // Обновляем каждый затронутый навык
      for (const impact of lessonImpacts) {
        await this.updateUserSkillProgress(
          userId,
          impact.dnaId,
          impact.progressPoints,
          'lesson_completion',
          lessonId,
          `Завершен урок "${impact.learningOutcome || 'урок'}". Развитие навыка: ${impact.skillName}`
        );
      }

      console.log(`[SkillsDnaIntegration] Обновлено ${lessonImpacts.length} навыков для пользователя ${userId}`);
    } catch (error) {
      console.error(`[SkillsDnaIntegration] Ошибка обновления навыков:`, error);
      throw error;
    }
  }

  /**
   * Обновляет Skills DNA прогресс после выполнения задания
   */
  async updateSkillsAfterAssignmentCompletion(
    userId: number, 
    assignmentId: number, 
    userScore: number
  ): Promise<void> {
    console.log(`[SkillsDnaIntegration] Обновление навыков после задания ${assignmentId}, балл: ${userScore}`);
    
    try {
      // Получаем влияние задания на навыки
      const assignmentImpacts = await db
        .select({
          dnaId: assignmentSkillsDnaImpact.dnaId,
          maxProgressPoints: assignmentSkillsDnaImpact.maxProgressPoints,
          minRequiredScore: assignmentSkillsDnaImpact.minRequiredScore,
          bloomLevel: assignmentSkillsDnaImpact.bloomLevel,
          skillApplication: assignmentSkillsDnaImpact.skillApplication,
          skillName: skillsDna.name
        })
        .from(assignmentSkillsDnaImpact)
        .innerJoin(skillsDna, eq(assignmentSkillsDnaImpact.dnaId, skillsDna.id))
        .where(eq(assignmentSkillsDnaImpact.assignmentId, assignmentId));

      for (const impact of assignmentImpacts) {
        // Рассчитываем прогресс на основе полученного балла
        const progressPoints = this.calculateProgressFromScore(
          userScore,
          impact.maxProgressPoints,
          impact.minRequiredScore
        );

        if (progressPoints > 0) {
          await this.updateUserSkillProgress(
            userId,
            impact.dnaId,
            progressPoints,
            'assignment_completion',
            assignmentId,
            `Выполнено задание (${userScore}%). Применение навыка: ${impact.skillApplication || impact.skillName}`
          );
        }
      }
    } catch (error) {
      console.error(`[SkillsDnaIntegration] Ошибка обновления навыков после задания:`, error);
      throw error;
    }
  }

  /**
   * Обновляет Skills DNA прогресс после завершения курса
   */
  async updateSkillsAfterCourseCompletion(userId: number, courseId: number): Promise<void> {
    console.log(`[SkillsDnaIntegration] Обновление навыков после завершения курса ${courseId}`);
    
    try {
      // Получаем целевые приросты навыков от курса
      const courseMappings = await db
        .select({
          dnaId: courseSkillsDnaMapping.dnaId,
          targetProgressGain: courseSkillsDnaMapping.targetProgressGain,
          importance: courseSkillsDnaMapping.importance,
          skillName: skillsDna.name,
          courseTitle: courses.title
        })
        .from(courseSkillsDnaMapping)
        .innerJoin(skillsDna, eq(courseSkillsDnaMapping.dnaId, skillsDna.id))
        .innerJoin(courses, eq(courseSkillsDnaMapping.courseId, courses.id))
        .where(eq(courseSkillsDnaMapping.courseId, courseId));

      for (const mapping of courseMappings) {
        // Бонусные баллы за завершение всего курса
        const bonusPoints = Math.floor(mapping.targetProgressGain * 0.2); // 20% бонус за полное завершение
        
        await this.updateUserSkillProgress(
          userId,
          mapping.dnaId,
          bonusPoints,
          'course_completion',
          courseId,
          `Завершен курс "${mapping.courseTitle}". Бонус за полное освоение навыка: ${mapping.skillName}`
        );
      }
    } catch (error) {
      console.error(`[SkillsDnaIntegration] Ошибка обновления навыков после курса:`, error);
      throw error;
    }
  }

  /**
   * Создает связи между курсом и навыками Skills DNA
   */
  async createCourseSkillsMappings(courseId: number, skillsMappings: CourseWithSkillsMapping['skillsMappings']): Promise<void> {
    console.log(`[SkillsDnaIntegration] Создание связей курса ${courseId} с ${skillsMappings.length} навыками`);
    
    try {
      // Удаляем существующие связи
      await db.delete(courseSkillsDnaMapping).where(eq(courseSkillsDnaMapping.courseId, courseId));
      
      // Создаем новые связи
      if (skillsMappings.length > 0) {
        await db.insert(courseSkillsDnaMapping).values(
          skillsMappings.map(mapping => ({
            courseId,
            dnaId: mapping.dnaId,
            targetProgressGain: mapping.targetProgressGain,
            importance: mapping.importance
          }))
        );
      }
      
      console.log(`[SkillsDnaIntegration] Создано ${skillsMappings.length} связей для курса ${courseId}`);
    } catch (error) {
      console.error(`[SkillsDnaIntegration] Ошибка создания связей курса:`, error);
      throw error;
    }
  }

  /**
   * Создает связи между уроком и навыками Skills DNA
   */
  async createLessonSkillsImpacts(lessonId: number, skillsImpacts: LessonWithSkillsImpact['skillsImpacts']): Promise<void> {
    console.log(`[SkillsDnaIntegration] Создание влияний урока ${lessonId} на ${skillsImpacts.length} навыков`);
    
    try {
      // Удаляем существующие влияния
      await db.delete(lessonSkillsDnaImpact).where(eq(lessonSkillsDnaImpact.lessonId, lessonId));
      
      // Создаем новые влияния
      if (skillsImpacts.length > 0) {
        await db.insert(lessonSkillsDnaImpact).values(
          skillsImpacts.map(impact => ({
            lessonId,
            dnaId: impact.dnaId,
            impactWeight: impact.impactWeight,
            progressPoints: impact.progressPoints,
            bloomLevel: impact.bloomLevel,
            learningOutcome: impact.learningOutcome
          }))
        );
      }
      
      console.log(`[SkillsDnaIntegration] Создано ${skillsImpacts.length} влияний для урока ${lessonId}`);
    } catch (error) {
      console.error(`[SkillsDnaIntegration] Ошибка создания влияний урока:`, error);
      throw error;
    }
  }

  /**
   * Получает прогресс навыков пользователя с историей изменений
   */
  async getUserSkillsProgressWithHistory(userId: number): Promise<any[]> {
    try {
      const skillsWithHistory = await db
        .select({
          dnaId: userSkillsDnaProgress.dnaId,
          skillName: skillsDna.name,
          skillCategory: skillsDna.category,
          currentLevel: userSkillsDnaProgress.currentLevel,
          progress: userSkillsDnaProgress.progress,
          lastAssessmentDate: userSkillsDnaProgress.lastAssessmentDate,
          recentChanges: sql<any>`
            COALESCE(
              (SELECT json_agg(
                json_build_object(
                  'date', created_at,
                  'change', progress_change,
                  'source', source,
                  'description', description
                ) ORDER BY created_at DESC
              )
              FROM ${skillsDnaProgressHistory} 
              WHERE user_id = ${userId} 
                AND dna_id = ${userSkillsDnaProgress.dnaId}
                AND created_at >= NOW() - INTERVAL '30 days'
              LIMIT 10), 
              '[]'::json
            )
          `
        })
        .from(userSkillsDnaProgress)
        .innerJoin(skillsDna, eq(userSkillsDnaProgress.dnaId, skillsDna.id))
        .where(eq(userSkillsDnaProgress.userId, userId));

      return skillsWithHistory;
    } catch (error) {
      console.error(`[SkillsDnaIntegration] Ошибка получения истории навыков:`, error);
      throw error;
    }
  }

  /**
   * Внутренний метод для обновления прогресса навыка
   */
  private async updateUserSkillProgress(
    userId: number,
    dnaId: number,
    progressPoints: number,
    source: 'lesson_completion' | 'assignment_completion' | 'course_completion',
    sourceId: number,
    description: string
  ): Promise<void> {
    try {
      // Получаем текущий прогресс
      const currentProgress = await db
        .select()
        .from(userSkillsDnaProgress)
        .where(and(
          eq(userSkillsDnaProgress.userId, userId),
          eq(userSkillsDnaProgress.dnaId, dnaId)
        ))
        .limit(1);

      const current = currentProgress[0];
      if (!current) {
        console.log(`[SkillsDnaIntegration] Навык ${dnaId} не найден для пользователя ${userId}, пропускаем`);
        return;
      }

      // Рассчитываем новый прогресс с учетом текущего уровня
      const adjustedProgressGain = this.calculateAdjustedProgressGain(
        progressPoints,
        current.progress,
        current.currentLevel
      );

      const newProgress = Math.min(100, current.progress + adjustedProgressGain);
      const newLevel = this.calculateSkillLevel(newProgress);

      // Обновляем прогресс
      await db
        .update(userSkillsDnaProgress)
        .set({
          progress: newProgress,
          currentLevel: newLevel,
          lastAssessmentDate: new Date(),
          updatedAt: new Date()
        })
        .where(and(
          eq(userSkillsDnaProgress.userId, userId),
          eq(userSkillsDnaProgress.dnaId, dnaId)
        ));

      // Записываем историю изменений
      await db.insert(skillsDnaProgressHistory).values({
        userId,
        dnaId,
        progressChange: adjustedProgressGain,
        previousProgress: current.progress,
        newProgress,
        source,
        sourceId,
        description
      });

      console.log(`[SkillsDnaIntegration] Навык ${dnaId}: ${current.progress}% → ${newProgress}% (+${adjustedProgressGain}%)`);
    } catch (error) {
      console.error(`[SkillsDnaIntegration] Ошибка обновления прогресса навыка:`, error);
      throw error;
    }
  }

  /**
   * Рассчитывает прогресс на основе балла за задание
   */
  private calculateProgressFromScore(
    userScore: number,
    maxProgressPoints: number,
    minRequiredScore: number
  ): number {
    if (userScore < minRequiredScore) {
      return 0; // Не засчитываем прогресс при низком балле
    }

    // Линейная шкала от минимального до максимального балла
    const scoreRatio = (userScore - minRequiredScore) / (100 - minRequiredScore);
    return Math.floor(maxProgressPoints * scoreRatio);
  }

  /**
   * Корректирует прирост прогресса в зависимости от текущего уровня
   */
  private calculateAdjustedProgressGain(
    baseProgressPoints: number,
    currentProgress: number,
    currentLevel: string
  ): number {
    // Чем выше уровень, тем сложнее прогрессировать
    const levelMultipliers = {
      'awareness': 1.0,   // Легко прогрессировать на начальном уровне
      'knowledge': 0.8,   // Немного сложнее
      'application': 0.6, // Средняя сложность
      'mastery': 0.4,     // Сложно прогрессировать
      'expertise': 0.2    // Очень сложно достичь экспертизы
    };

    const multiplier = levelMultipliers[currentLevel as keyof typeof levelMultipliers] || 1.0;
    
    // Дополнительное замедление при высоком прогрессе
    const progressMultiplier = currentProgress > 80 ? 0.5 : 1.0;
    
    return Math.ceil(baseProgressPoints * multiplier * progressMultiplier);
  }

  /**
   * Определяет уровень навыка на основе прогресса
   */
  private calculateSkillLevel(progress: number): 'awareness' | 'knowledge' | 'application' | 'mastery' | 'expertise' {
    if (progress >= 90) return 'expertise';
    if (progress >= 70) return 'mastery';
    if (progress >= 40) return 'application';
    if (progress >= 20) return 'knowledge';
    return 'awareness';
  }
}

export const skillsDnaIntegrationService = new SkillsDnaIntegrationService();
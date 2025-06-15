/**
 * Упрощенный сервис интеграции курсов с Skills DNA
 * Работает с существующей схемой базы данных
 */

import { eq, and } from "drizzle-orm";
import { db } from "../db";
import { 
  userSkillsDnaProgress, 
  skillsDna,
  courses,
  lessons,
  assignments
} from "../../shared/schema";

interface SkillMapping {
  dnaId: number;
  progressGain: number;
  bloomLevel: 'awareness' | 'knowledge' | 'application' | 'mastery' | 'expertise';
}

interface LessonSkillsConfig {
  lessonId: number;
  skills: SkillMapping[];
}

interface CourseSkillsConfig {
  courseId: number;
  skills: SkillMapping[];
}

export class CourseSkillsIntegrationService {
  
  // Конфигурация навыков для курсов (временно в коде, позже в БД)
  private courseSkillsMapping = new Map<number, SkillMapping[]>();
  private lessonSkillsMapping = new Map<number, SkillMapping[]>();

  /**
   * Настройка навыков для курса
   */
  configureCourseSkills(courseId: number, skills: SkillMapping[]): void {
    this.courseSkillsMapping.set(courseId, skills);
    console.log(`[CourseSkillsIntegration] Настроены навыки для курса ${courseId}: ${skills.length} навыков`);
  }

  /**
   * Настройка навыков для урока
   */
  configureLessonSkills(lessonId: number, skills: SkillMapping[]): void {
    this.lessonSkillsMapping.set(lessonId, skills);
    console.log(`[CourseSkillsIntegration] Настроены навыки для урока ${lessonId}: ${skills.length} навыков`);
  }

  /**
   * Обновление навыков после завершения урока
   */
  async updateSkillsAfterLesson(userId: number, lessonId: number): Promise<boolean> {
    const skillsConfig = this.lessonSkillsMapping.get(lessonId);
    if (!skillsConfig || skillsConfig.length === 0) {
      console.log(`[CourseSkillsIntegration] Урок ${lessonId} не имеет настроенных навыков`);
      return false;
    }

    try {
      let updatedCount = 0;
      
      for (const skill of skillsConfig) {
        const updated = await this.updateUserSkill(userId, skill.dnaId, skill.progressGain);
        if (updated) updatedCount++;
      }

      console.log(`[CourseSkillsIntegration] Обновлено ${updatedCount} навыков для пользователя ${userId} после урока ${lessonId}`);
      return updatedCount > 0;
    } catch (error) {
      console.error(`[CourseSkillsIntegration] Ошибка обновления навыков:`, error);
      return false;
    }
  }

  /**
   * Обновление навыков после выполнения задания
   */
  async updateSkillsAfterAssignment(userId: number, assignmentId: number, score: number): Promise<boolean> {
    try {
      // Получаем урок по заданию
      const assignment = await db
        .select({ lessonId: assignments.lessonId })
        .from(assignments)
        .where(eq(assignments.id, assignmentId))
        .limit(1);

      if (!assignment[0]) {
        console.log(`[CourseSkillsIntegration] Задание ${assignmentId} не найдено`);
        return false;
      }

      const skillsConfig = this.lessonSkillsMapping.get(assignment[0].lessonId);
      if (!skillsConfig) {
        return false;
      }

      // Рассчитываем прогресс на основе балла
      const scoreMultiplier = score >= 80 ? 1.0 : score >= 60 ? 0.7 : 0.4;
      let updatedCount = 0;

      for (const skill of skillsConfig) {
        const adjustedGain = Math.floor(skill.progressGain * scoreMultiplier);
        if (adjustedGain > 0) {
          const updated = await this.updateUserSkill(userId, skill.dnaId, adjustedGain);
          if (updated) updatedCount++;
        }
      }

      console.log(`[CourseSkillsIntegration] Обновлено ${updatedCount} навыков после задания (балл: ${score}%)`);
      return updatedCount > 0;
    } catch (error) {
      console.error(`[CourseSkillsIntegration] Ошибка обновления навыков после задания:`, error);
      return false;
    }
  }

  /**
   * Обновление навыков после завершения курса
   */
  async updateSkillsAfterCourse(userId: number, courseId: number): Promise<boolean> {
    const skillsConfig = this.courseSkillsMapping.get(courseId);
    if (!skillsConfig || skillsConfig.length === 0) {
      console.log(`[CourseSkillsIntegration] Курс ${courseId} не имеет настроенных навыков`);
      return false;
    }

    try {
      let updatedCount = 0;
      
      // Бонусные баллы за завершение курса (20% от базового прироста)
      for (const skill of skillsConfig) {
        const bonusGain = Math.floor(skill.progressGain * 0.2);
        const updated = await this.updateUserSkill(userId, skill.dnaId, bonusGain);
        if (updated) updatedCount++;
      }

      console.log(`[CourseSkillsIntegration] Обновлено ${updatedCount} навыков после завершения курса ${courseId}`);
      return updatedCount > 0;
    } catch (error) {
      console.error(`[CourseSkillsIntegration] Ошибка обновления навыков после курса:`, error);
      return false;
    }
  }

  /**
   * Получение прогресса навыков с недавними изменениями
   */
  async getSkillsProgressSummary(userId: number): Promise<any> {
    try {
      const skillsProgress = await db
        .select({
          id: userSkillsDnaProgress.id,
          dnaId: userSkillsDnaProgress.dnaId,
          skillName: skillsDna.name,
          skillCategory: skillsDna.category,
          currentLevel: userSkillsDnaProgress.currentLevel,
          progress: userSkillsDnaProgress.progress,
          lastAssessmentDate: userSkillsDnaProgress.lastAssessmentDate,
          updatedAt: userSkillsDnaProgress.updatedAt
        })
        .from(userSkillsDnaProgress)
        .innerJoin(skillsDna, eq(userSkillsDnaProgress.dnaId, skillsDna.id))
        .where(eq(userSkillsDnaProgress.userId, userId));

      return {
        skills: skillsProgress,
        totalSkills: skillsProgress.length,
        averageProgress: skillsProgress.length > 0 
          ? Math.round(skillsProgress.reduce((sum, skill) => sum + (skill.progress || 0), 0) / skillsProgress.length)
          : 0
      };
    } catch (error) {
      console.error(`[CourseSkillsIntegration] Ошибка получения сводки навыков:`, error);
      return { skills: [], totalSkills: 0, averageProgress: 0 };
    }
  }

  /**
   * Внутренний метод обновления навыка пользователя
   */
  private async updateUserSkill(userId: number, dnaId: number, progressGain: number): Promise<boolean> {
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

      if (!currentProgress[0]) {
        // Создаем новую запись прогресса для пользователя
        console.log(`[CourseSkillsIntegration] Создание нового прогресса навыка ${dnaId} для пользователя ${userId}`);
        
        await db.insert(userSkillsDnaProgress).values({
          userId: userId,
          dnaId: dnaId,
          currentLevel: 'awareness',
          targetLevel: 'application',
          progress: 0,
          lastAssessmentDate: new Date(),
          nextAssessmentDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // через 30 дней
          assessmentHistory: JSON.stringify([]),
          updatedAt: new Date()
        });

        // Получаем только что созданную запись
        const newProgress = await db
          .select()
          .from(userSkillsDnaProgress)
          .where(and(
            eq(userSkillsDnaProgress.userId, userId),
            eq(userSkillsDnaProgress.dnaId, dnaId)
          ))
          .limit(1);

        if (!newProgress[0]) {
          console.log(`[CourseSkillsIntegration] Ошибка создания записи навыка ${dnaId} для пользователя ${userId}`);
          return false;
        }
      }

      // Получаем актуальную запись (существующую или только что созданную)
      const actualProgress = currentProgress[0] || await db
        .select()
        .from(userSkillsDnaProgress)
        .where(and(
          eq(userSkillsDnaProgress.userId, userId),
          eq(userSkillsDnaProgress.dnaId, dnaId)
        ))
        .limit(1);

      const current = actualProgress[0] || actualProgress;
      const currentProgressValue = current.progress || 0;
      
      // Корректируем прирост в зависимости от текущего уровня
      const adjustedGain = this.calculateAdjustedGain(progressGain, currentProgressValue, current.currentLevel);
      const newProgress = Math.min(100, currentProgressValue + adjustedGain);
      const newLevel = this.calculateLevel(newProgress);

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

      console.log(`[CourseSkillsIntegration] Навык ${dnaId}: ${currentProgressValue}% → ${newProgress}% (+${adjustedGain}%)`);
      return true;
    } catch (error) {
      console.error(`[CourseSkillsIntegration] Ошибка обновления навыка ${dnaId}:`, error);
      return false;
    }
  }

  /**
   * Корректировка прироста прогресса
   */
  private calculateAdjustedGain(baseGain: number, currentProgress: number, currentLevel: string): number {
    // Чем выше уровень, тем медленнее рост
    const levelMultipliers = {
      'awareness': 1.0,
      'knowledge': 0.8,
      'application': 0.6,
      'mastery': 0.4,
      'expertise': 0.2
    };

    const multiplier = levelMultipliers[currentLevel as keyof typeof levelMultipliers] || 1.0;
    
    // Дополнительное замедление при высоком прогрессе
    const progressPenalty = currentProgress > 80 ? 0.5 : currentProgress > 60 ? 0.7 : 1.0;
    
    return Math.max(1, Math.floor(baseGain * multiplier * progressPenalty));
  }

  /**
   * Определение уровня на основе прогресса
   */
  private calculateLevel(progress: number): 'awareness' | 'knowledge' | 'application' | 'mastery' | 'expertise' {
    if (progress >= 90) return 'expertise';
    if (progress >= 70) return 'mastery';
    if (progress >= 40) return 'application';
    if (progress >= 20) return 'knowledge';
    return 'awareness';
  }
}

export const courseSkillsIntegration = new CourseSkillsIntegrationService();
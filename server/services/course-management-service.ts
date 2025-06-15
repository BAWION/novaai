/**
 * Универсальная система управления курсами
 * Поддерживает создание, редактирование и управление курсами с реальным прогрессом
 */

import { db } from "../db";
import { courses, courseModules, lessons, assignments, userCourseProgress, userLessonProgress, userAssignmentResults } from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";

export interface CourseTemplate {
  title: string;
  slug: string;
  description: string;
  difficulty: number;
  level: 'basic' | 'intermediate' | 'advanced' | 'expert';
  estimatedDuration: number;
  category: 'tech' | 'ethics' | 'law' | 'business' | 'ml' | 'other';
  objectives: string[];
  prerequisites: string[];
  skillsGained: string[];
  modules: ModuleTemplate[];
}

export interface ModuleTemplate {
  title: string;
  description: string;
  orderIndex: number;
  estimatedDuration: number;
  lessons: LessonTemplate[];
}

export interface LessonTemplate {
  title: string;
  description: string;
  content: string;
  type: 'video' | 'text' | 'interactive' | 'quiz' | 'practice';
  orderIndex: number;
  estimatedDuration: number;
  mediaUrls?: string[];
  assignments?: AssignmentTemplate[];
}

export interface AssignmentTemplate {
  title: string;
  description: string;
  type: 'quiz' | 'coding' | 'project';
  content: any;
  points: number;
}

export interface CourseProgress {
  courseId: number;
  userId: number;
  overallProgress: number;
  completedModules: number;
  totalModules: number;
  completedLessons: number;
  totalLessons: number;
  startedAt: Date;
  lastAccessedAt: Date;
  estimatedTimeRemaining: number;
}

export interface LessonProgress {
  lessonId: number;
  userId: number;
  status: 'not_started' | 'in_progress' | 'completed';
  lastPosition: number;
  completedAt?: Date;
  notes?: string;
}

export class CourseManagementService {
  
  /**
   * Создает курс из шаблона
   */
  async createCourseFromTemplate(template: CourseTemplate, authorId: number): Promise<number> {
    
    // Создаем курс
    const [course] = await db.insert(courses).values({
      title: template.title,
      slug: template.slug,
      description: template.description,
      difficulty: template.difficulty,
      level: template.level,
      modules: template.modules.length,
      estimatedDuration: template.estimatedDuration,
      category: template.category,
      access: 'free',
      authorId,
      objectives: template.objectives,
      prerequisites: template.prerequisites,
      skillsGained: template.skillsGained,
    }).returning({ id: courses.id });

    const courseId = course.id;

    // Создаем модули
    for (const moduleTemplate of template.modules) {
      const [module] = await db.insert(courseModules).values({
        courseId,
        title: moduleTemplate.title,
        description: moduleTemplate.description,
        orderIndex: moduleTemplate.orderIndex,
        estimatedDuration: moduleTemplate.estimatedDuration,
      }).returning({ id: courseModules.id });

      const moduleId = module.id;

      // Создаем уроки
      for (const lessonTemplate of moduleTemplate.lessons) {
        const [lesson] = await db.insert(lessons).values({
          moduleId,
          title: lessonTemplate.title,
          description: lessonTemplate.description,
          content: lessonTemplate.content,
          type: lessonTemplate.type,
          orderIndex: lessonTemplate.orderIndex,
          estimatedDuration: lessonTemplate.estimatedDuration,
          mediaUrls: lessonTemplate.mediaUrls || [],
        }).returning({ id: lessons.id });

        const lessonId = lesson.id;

        // Создаем задания для урока
        if (lessonTemplate.assignments) {
          for (const assignmentTemplate of lessonTemplate.assignments) {
            await db.insert(assignments).values({
              lessonId,
              title: assignmentTemplate.title,
              description: assignmentTemplate.description,
              type: assignmentTemplate.type,
              content: assignmentTemplate.content,
              points: assignmentTemplate.points,
            });
          }
        }
      }
    }

    return courseId;
  }

  /**
   * Получает полную информацию о курсе с модулями и уроками
   */
  async getCourseWithContent(courseId: number): Promise<any> {

    // Получаем основную информацию о курсе
    const [course] = await db.select().from(courses).where(eq(courses.id, courseId));
    if (!course) return null;

    // Получаем модули курса
    const courseModulesList = await db
      .select()
      .from(courseModules)
      .where(eq(courseModules.courseId, courseId))
      .orderBy(courseModules.orderIndex);

    // Для каждого модуля получаем уроки
    const modulesWithLessons = await Promise.all(
      courseModulesList.map(async (module) => {
        const lessonsList = await db
          .select()
          .from(lessons)
          .where(eq(lessons.moduleId, module.id))
          .orderBy(lessons.orderIndex);

        // Для каждого урока получаем задания
        const lessonsWithAssignments = await Promise.all(
          lessonsList.map(async (lesson) => {
            const assignmentsList = await db
              .select()
              .from(assignments)
              .where(eq(assignments.lessonId, lesson.id));

            return {
              ...lesson,
              assignments: assignmentsList,
            };
          })
        );

        return {
          ...module,
          lessons: lessonsWithAssignments,
        };
      })
    );

    return {
      ...course,
      modules: modulesWithLessons,
    };
  }

  /**
   * Получает прогресс пользователя по курсу
   */
  async getUserCourseProgress(userId: number, courseId: number): Promise<CourseProgress | null> {

    // Получаем общий прогресс по курсу
    const [courseProgress] = await db
      .select()
      .from(userCourseProgress)
      .where(and(
        eq(userCourseProgress.userId, userId),
        eq(userCourseProgress.courseId, courseId)
      ));

    if (!courseProgress) return null;

    // Подсчитываем детальную статистику
    const totalModulesQuery = await db
      .select({ count: sql<number>`count(*)` })
      .from(courseModules)
      .where(eq(courseModules.courseId, courseId));

    const totalLessonsQuery = await db
      .select({ count: sql<number>`count(*)` })
      .from(lessons)
      .innerJoin(courseModules, eq(lessons.moduleId, courseModules.id))
      .where(eq(courseModules.courseId, courseId));

    const completedLessonsQuery = await db
      .select({ count: sql<number>`count(*)` })
      .from(userLessonProgress)
      .innerJoin(lessons, eq(userLessonProgress.lessonId, lessons.id))
      .innerJoin(courseModules, eq(lessons.moduleId, courseModules.id))
      .where(and(
        eq(courseModules.courseId, courseId),
        eq(userLessonProgress.userId, userId),
        eq(userLessonProgress.status, 'completed')
      ));

    const totalModules = totalModulesQuery[0].count;
    const totalLessons = totalLessonsQuery[0].count;
    const completedLessons = completedLessonsQuery[0].count;

    const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    // Получаем общую длительность курса
    const [courseDuration] = await db
      .select()
      .from(courses)
      .where(eq(courses.id, courseId));

    const estimatedTimeRemaining = courseDuration && courseDuration.estimatedDuration
      ? Math.round(courseDuration.estimatedDuration * (1 - overallProgress / 100))
      : 0;

    return {
      courseId,
      userId,
      overallProgress,
      completedModules: courseProgress.completedModules || 0,
      totalModules,
      completedLessons,
      totalLessons,
      startedAt: courseProgress.startedAt || new Date(),
      lastAccessedAt: courseProgress.lastAccessedAt || new Date(),
      estimatedTimeRemaining,
    };
  }

  /**
   * Начинает прохождение курса пользователем
   */
  async startCourse(userId: number, courseId: number): Promise<void> {
    // Проверяем, не начат ли уже курс
    const existingProgress = await db
      .select()
      .from(userCourseProgress)
      .where(and(
        eq(userCourseProgress.userId, userId),
        eq(userCourseProgress.courseId, courseId)
      ));

    if (existingProgress.length === 0) {
      await db.insert(userCourseProgress).values({
        userId,
        courseId,
        progress: 0,
        completedModules: 0,
      });
    }
  }

  /**
   * Отмечает урок как завершенный
   */
  async completeLesson(userId: number, lessonId: number): Promise<void> {

    // Обновляем прогресс урока
    await db
      .insert(userLessonProgress)
      .values({
        userId,
        lessonId,
        status: 'completed',
        completedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [userLessonProgress.userId, userLessonProgress.lessonId],
        set: {
          status: 'completed',
          completedAt: new Date(),
          updatedAt: new Date(),
        },
      });

    // Обновляем общий прогресс по курсу
    await this.updateCourseProgress(userId, lessonId);
  }

  /**
   * Обновляет позицию в уроке
   */
  async updateLessonPosition(userId: number, lessonId: number, position: number): Promise<void> {

    await db
      .insert(userLessonProgress)
      .values({
        userId,
        lessonId,
        status: 'in_progress',
        lastPosition: position,
      })
      .onConflictDoUpdate({
        target: [userLessonProgress.userId, userLessonProgress.lessonId],
        set: {
          status: 'in_progress',
          lastPosition: position,
          updatedAt: new Date(),
        },
      });
  }

  /**
   * Получает прогресс пользователя по урокам
   */
  async getUserLessonProgress(userId: number, courseId: number): Promise<LessonProgress[]> {

    const progress = await db
      .select({
        lessonId: userLessonProgress.lessonId,
        userId: userLessonProgress.userId,
        status: userLessonProgress.status,
        lastPosition: userLessonProgress.lastPosition,
        completedAt: userLessonProgress.completedAt,
        notes: userLessonProgress.notes,
      })
      .from(userLessonProgress)
      .innerJoin(lessons, eq(userLessonProgress.lessonId, lessons.id))
      .innerJoin(courseModules, eq(lessons.moduleId, courseModules.id))
      .where(and(
        eq(courseModules.courseId, courseId),
        eq(userLessonProgress.userId, userId)
      ));

    return progress;
  }

  /**
   * Обновляет общий прогресс по курсу
   */
  private async updateCourseProgress(userId: number, lessonId: number): Promise<void> {

    // Получаем courseId из lessonId
    const [lessonInfo] = await db
      .select({ courseId: courseModules.courseId })
      .from(lessons)
      .innerJoin(courseModules, eq(lessons.moduleId, courseModules.id))
      .where(eq(lessons.id, lessonId));

    if (!lessonInfo) return;

    const courseId = lessonInfo.courseId;

    // Подсчитываем завершенные уроки
    const completedLessonsQuery = await db
      .select({ count: sql<number>`count(*)` })
      .from(userLessonProgress)
      .innerJoin(lessons, eq(userLessonProgress.lessonId, lessons.id))
      .innerJoin(courseModules, eq(lessons.moduleId, courseModules.id))
      .where(and(
        eq(courseModules.courseId, courseId),
        eq(userLessonProgress.userId, userId),
        eq(userLessonProgress.status, 'completed')
      ));

    const totalLessonsQuery = await db
      .select({ count: sql<number>`count(*)` })
      .from(lessons)
      .innerJoin(courseModules, eq(lessons.moduleId, courseModules.id))
      .where(eq(courseModules.courseId, courseId));

    const completedLessons = completedLessonsQuery[0].count;
    const totalLessons = totalLessonsQuery[0].count;
    const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    // Обновляем прогресс курса
    await db
      .update(userCourseProgress)
      .set({
        progress,
        lastAccessedAt: new Date(),
        completedAt: progress === 100 ? new Date() : null,
      })
      .where(and(
        eq(userCourseProgress.userId, userId),
        eq(userCourseProgress.courseId, courseId)
      ));
  }

  /**
   * Сохраняет результат выполнения задания
   */
  async saveAssignmentResult(
    userId: number,
    assignmentId: number,
    answers: any,
    score: number
  ): Promise<void> {

    await db
      .insert(userAssignmentResults)
      .values({
        userId,
        assignmentId,
        answers,
        score,
        completedAt: new Date(),
        attemptsCount: 1,
      })
      .onConflictDoUpdate({
        target: [userAssignmentResults.userId, userAssignmentResults.assignmentId],
        set: {
          answers,
          score,
          completedAt: new Date(),
          attemptsCount: sql`${userAssignmentResults.attemptsCount} + 1`,
          updatedAt: new Date(),
        },
      });
  }
}

export const courseManagementService = new CourseManagementService();
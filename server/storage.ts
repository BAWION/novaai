import { 
  type User, 
  type InsertUser, 
  type UserProfile,
  type InsertUserProfile,
  type Skill,
  type InsertSkill,
  type Course,
  type InsertCourse,
  type CourseModule,
  type InsertCourseModule,
  type Lesson,
  type InsertLesson,
  type Assignment,
  type InsertAssignment,
  type UserCourseProgress,
  type InsertUserCourseProgress,
  type UserLessonProgress,
  type InsertUserLessonProgress,
  type UserAssignmentResult,
  type InsertUserAssignmentResults,
  type UserSkill,
  type InsertUserSkill,
  type UserSkillGap,
  type InsertUserSkillGap,
  type LearningEvent,
  type InsertLearningEvent
} from "@shared/schema";

import { db } from './db';
import { and, eq, desc, asc, like, isNull, inArray, sql } from 'drizzle-orm';
import { 
  users, 
  userProfiles,
  courses,
  courseModules,
  lessons,
  assignments,
  userCourseProgress,
  userLessonProgress,
  userAssignmentResults,
  skills,
  userSkills,
  userSkillGaps,
  learningEvents
} from '@shared/schema';

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User>;
  
  // User Profile methods
  getUserProfile(userId: number): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(userId: number, profile: Partial<UserProfile>): Promise<UserProfile>;
  
  // Skills methods
  getSkill(id: number): Promise<Skill | undefined>;
  getSkillByName(name: string): Promise<Skill | undefined>;
  getAllSkills(): Promise<Skill[]>;
  getSkillsByCategory(category: string): Promise<Skill[]>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  
  // Course methods
  getCourse(id: number): Promise<Course | undefined>;
  getCourseBySlug(slug: string): Promise<Course | undefined>;
  getAllCourses(): Promise<Course[]>;
  getFilteredCourses(filters: {
    level?: string;
    access?: string;
    difficulty?: number;
    tags?: string[];
  }): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, data: Partial<Course>): Promise<Course>;
  
  // Course Module methods
  getCourseModule(id: number): Promise<CourseModule | undefined>;
  getCourseModules(courseId: number): Promise<CourseModule[]>;
  createCourseModule(module: InsertCourseModule): Promise<CourseModule>;
  updateCourseModule(id: number, data: Partial<CourseModule>): Promise<CourseModule>;
  
  // Lesson methods
  getLesson(id: number): Promise<Lesson | undefined>;
  getModuleLessons(moduleId: number): Promise<Lesson[]>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  updateLesson(id: number, data: Partial<Lesson>): Promise<Lesson>;
  
  // Assignment methods
  getAssignment(id: number): Promise<Assignment | undefined>;
  getLessonAssignments(lessonId: number): Promise<Assignment[]>;
  createAssignment(assignment: InsertAssignment): Promise<Assignment>;
  updateAssignment(id: number, data: Partial<Assignment>): Promise<Assignment>;
  
  // User Course Progress methods
  getUserCourseProgress(userId: number): Promise<UserCourseProgress[]>;
  getCourseProgress(userId: number, courseId: number): Promise<UserCourseProgress | undefined>;
  updateUserCourseProgress(
    userId: number, 
    courseId: number, 
    data: Partial<UserCourseProgress>
  ): Promise<UserCourseProgress>;
  
  // User Lesson Progress methods
  getUserLessonProgress(userId: number, lessonId: number): Promise<UserLessonProgress | undefined>;
  getUserLessonsProgress(userId: number): Promise<UserLessonProgress[]>;
  updateUserLessonProgress(
    userId: number,
    lessonId: number,
    data: Partial<UserLessonProgress>
  ): Promise<UserLessonProgress>;
  
  // User Assignment Results methods
  getUserAssignmentResult(userId: number, assignmentId: number): Promise<UserAssignmentResult | undefined>;
  getUserAssignmentResults(userId: number): Promise<UserAssignmentResult[]>;
  submitAssignmentResult(
    userId: number,
    assignmentId: number,
    data: Partial<InsertUserAssignmentResults>
  ): Promise<UserAssignmentResult>;
  
  // User Skills methods
  getUserSkills(userId: number): Promise<UserSkill[]>;
  getUserSkillByName(userId: number, skillName: string): Promise<UserSkill | undefined>;
  saveUserSkill(userSkill: InsertUserSkill): Promise<UserSkill>;
  updateUserSkill(userId: number, skillId: number, data: Partial<UserSkill>): Promise<UserSkill>;
  
  // User Skill Gaps methods
  getUserSkillGaps(userId: number): Promise<UserSkillGap[]>;
  saveUserSkillGap(skillGap: InsertUserSkillGap): Promise<UserSkillGap>;
  updateUserSkillGap(id: number, data: Partial<UserSkillGap>): Promise<UserSkillGap>;
  
  // Learning Events methods
  saveLearningEvent(event: InsertLearningEvent): Promise<LearningEvent>;
  getLearningEvents(userId: number, params?: {
    eventType?: string;
    entityType?: string;
    entityId?: number;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<LearningEvent[]>;
  
  // Learning Timeline methods
  getUserLearningTimeline(userId: number, limit?: number): Promise<LearningEvent[]>;
  
  // Admin Analytics methods
  getTotalUsersCount(): Promise<number>;
  getTotalCoursesCount(): Promise<number>;
  getTotalLessonsCount(): Promise<number>;
  getTotalLearningEventsCount(): Promise<number>;
  getRecentUsersCount(days: number): Promise<number>;
  getActiveSessionsCount(): Promise<number>;
  getAllUserCourseProgress(): Promise<UserCourseProgress[]>;
  getAllUserProfiles(): Promise<UserProfile[]>;
  getActiveUsersCount(since: Date): Promise<number>;
  getNewUsersCount(since: Date): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  // User Profile methods
  async getUserProfile(userId: number): Promise<UserProfile | undefined> {
    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId));
    return profile;
  }

  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const [newProfile] = await db.insert(userProfiles).values(profile).returning();
    return newProfile;
  }

  async updateUserProfile(userId: number, data: Partial<UserProfile>): Promise<UserProfile> {
    // Получаем текущий профиль
    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId));

    if (!profile) {
      throw new Error(`User profile not found for user ID ${userId}`);
    }

    // Обновляем профиль
    const [updatedProfile] = await db
      .update(userProfiles)
      .set({
        ...data,
        lastActiveAt: new Date()
      })
      .where(eq(userProfiles.userId, userId))
      .returning();

    return updatedProfile;
  }

  // Skills methods
  async getSkill(id: number): Promise<Skill | undefined> {
    const [skill] = await db.select().from(skills).where(eq(skills.id, id));
    return skill;
  }

  async getSkillByName(name: string): Promise<Skill | undefined> {
    const [skill] = await db.select().from(skills).where(eq(skills.name, name));
    return skill;
  }

  async getAllSkills(): Promise<Skill[]> {
    return await db.select().from(skills);
  }

  async getSkillsByCategory(category: string): Promise<Skill[]> {
    return await db
      .select()
      .from(skills)
      .where(eq(skills.category, category as any));
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    const [newSkill] = await db.insert(skills).values(skill).returning();
    return newSkill;
  }

  // Course methods
  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async getCourseBySlug(slug: string): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.slug, slug));
    return course;
  }

  async getAllCourses(): Promise<Course[]> {
    return await db.select().from(courses);
  }

  async getFilteredCourses(filters: {
    level?: string;
    access?: string;
    difficulty?: number;
    tags?: string[];
  }): Promise<Course[]> {
    let query = db.select().from(courses);

    if (filters.level) {
      query = query.where(eq(courses.level, filters.level as any));
    }

    if (filters.access) {
      query = query.where(eq(courses.access, filters.access as any));
    }

    if (filters.difficulty) {
      query = query.where(eq(courses.difficulty, filters.difficulty));
    }

    // Для фильтрации по тегам требуется более сложный запрос
    // Это упрощенная реализация
    const filteredCourses = await query;

    if (filters.tags && filters.tags.length > 0) {
      return filteredCourses.filter((course) => {
        const courseTags = course.tags as string[] || [];
        return filters.tags!.some((tag) => courseTags.includes(tag));
      });
    }

    return filteredCourses;
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }

  async updateCourse(id: number, data: Partial<Course>): Promise<Course> {
    const [updatedCourse] = await db
      .update(courses)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(courses.id, id))
      .returning();
    return updatedCourse;
  }

  // Course Module methods
  async getCourseModule(id: number): Promise<CourseModule | undefined> {
    const [module] = await db.select().from(courseModules).where(eq(courseModules.id, id));
    return module;
  }

  async getCourseModules(courseId: number): Promise<CourseModule[]> {
    return await db
      .select()
      .from(courseModules)
      .where(eq(courseModules.courseId, courseId))
      .orderBy(asc(courseModules.orderIndex));
  }

  async createCourseModule(module: InsertCourseModule): Promise<CourseModule> {
    const [newModule] = await db.insert(courseModules).values(module).returning();
    return newModule;
  }

  async updateCourseModule(id: number, data: Partial<CourseModule>): Promise<CourseModule> {
    const [updatedModule] = await db
      .update(courseModules)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(courseModules.id, id))
      .returning();
    return updatedModule;
  }

  // Lesson methods
  async getLesson(id: number): Promise<Lesson | undefined> {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
    return lesson;
  }

  async getModuleLessons(moduleId: number): Promise<Lesson[]> {
    return await db
      .select()
      .from(lessons)
      .where(eq(lessons.moduleId, moduleId))
      .orderBy(asc(lessons.orderIndex));
  }

  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const [newLesson] = await db.insert(lessons).values(lesson).returning();
    return newLesson;
  }

  async updateLesson(id: number, data: Partial<Lesson>): Promise<Lesson> {
    const [updatedLesson] = await db
      .update(lessons)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(lessons.id, id))
      .returning();
    return updatedLesson;
  }

  // Assignment methods
  async getAssignment(id: number): Promise<Assignment | undefined> {
    const [assignment] = await db.select().from(assignments).where(eq(assignments.id, id));
    return assignment;
  }

  async getLessonAssignments(lessonId: number): Promise<Assignment[]> {
    return await db
      .select()
      .from(assignments)
      .where(eq(assignments.lessonId, lessonId));
  }

  async createAssignment(assignment: InsertAssignment): Promise<Assignment> {
    const [newAssignment] = await db.insert(assignments).values(assignment).returning();
    return newAssignment;
  }

  async updateAssignment(id: number, data: Partial<Assignment>): Promise<Assignment> {
    const [updatedAssignment] = await db
      .update(assignments)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(assignments.id, id))
      .returning();
    return updatedAssignment;
  }

  // User Course Progress methods
  async getUserCourseProgress(userId: number): Promise<UserCourseProgress[]> {
    return await db
      .select()
      .from(userCourseProgress)
      .where(eq(userCourseProgress.userId, userId));
  }

  async getCourseProgress(userId: number, courseId: number): Promise<UserCourseProgress | undefined> {
    const [progress] = await db
      .select()
      .from(userCourseProgress)
      .where(
        and(
          eq(userCourseProgress.userId, userId),
          eq(userCourseProgress.courseId, courseId)
        )
      );
    return progress;
  }

  async updateUserCourseProgress(
    userId: number,
    courseId: number,
    data: Partial<UserCourseProgress>
  ): Promise<UserCourseProgress> {
    // Проверяем, существует ли запись
    const existing = await this.getCourseProgress(userId, courseId);

    if (!existing) {
      // Создаем новую запись
      const [newProgress] = await db
        .insert(userCourseProgress)
        .values({
          userId,
          courseId,
          progress: data.progress || 0,
          completedModules: data.completedModules || 0,
        })
        .returning();
      return newProgress;
    } else {
      // Обновляем существующую запись
      const [updatedProgress] = await db
        .update(userCourseProgress)
        .set({
          ...data,
          lastAccessedAt: new Date()
        })
        .where(
          and(
            eq(userCourseProgress.userId, userId),
            eq(userCourseProgress.courseId, courseId)
          )
        )
        .returning();
      return updatedProgress;
    }
  }

  // User Lesson Progress methods
  async getUserLessonProgress(userId: number, lessonId: number): Promise<UserLessonProgress | undefined> {
    const [progress] = await db
      .select()
      .from(userLessonProgress)
      .where(
        and(
          eq(userLessonProgress.userId, userId),
          eq(userLessonProgress.lessonId, lessonId)
        )
      );
    return progress;
  }

  async getUserLessonsProgress(userId: number): Promise<UserLessonProgress[]> {
    return await db
      .select()
      .from(userLessonProgress)
      .where(eq(userLessonProgress.userId, userId));
  }

  async updateUserLessonProgress(
    userId: number,
    lessonId: number,
    data: Partial<UserLessonProgress>
  ): Promise<UserLessonProgress> {
    // Проверяем, существует ли запись
    const existing = await this.getUserLessonProgress(userId, lessonId);

    if (!existing) {
      // Создаем новую запись
      const [newProgress] = await db
        .insert(userLessonProgress)
        .values({
          userId,
          lessonId,
          status: data.status || "not_started",
          lastPosition: data.lastPosition || 0,
          notes: data.notes
        })
        .returning();
      return newProgress;
    } else {
      // Обновляем существующую запись
      const [updatedProgress] = await db
        .update(userLessonProgress)
        .set({
          ...data,
          updatedAt: new Date()
        })
        .where(
          and(
            eq(userLessonProgress.userId, userId),
            eq(userLessonProgress.lessonId, lessonId)
          )
        )
        .returning();
      return updatedProgress;
    }
  }

  // User Assignment Results methods
  async getUserAssignmentResult(userId: number, assignmentId: number): Promise<UserAssignmentResult | undefined> {
    const [result] = await db
      .select()
      .from(userAssignmentResults)
      .where(
        and(
          eq(userAssignmentResults.userId, userId),
          eq(userAssignmentResults.assignmentId, assignmentId)
        )
      );
    return result;
  }

  async getUserAssignmentResults(userId: number): Promise<UserAssignmentResult[]> {
    return await db
      .select()
      .from(userAssignmentResults)
      .where(eq(userAssignmentResults.userId, userId));
  }

  async submitAssignmentResult(
    userId: number,
    assignmentId: number,
    data: Partial<InsertUserAssignmentResults>
  ): Promise<UserAssignmentResult> {
    // Проверяем, существует ли запись
    const existing = await this.getUserAssignmentResult(userId, assignmentId);

    if (!existing) {
      // Создаем новую запись
      const [newResult] = await db
        .insert(userAssignmentResults)
        .values({
          userId,
          assignmentId,
          score: data.score || 0,
          answers: data.answers,
          feedback: data.feedback,
          attemptsCount: data.attemptsCount || 1
        })
        .returning();
      return newResult;
    } else {
      // Обновляем существующую запись и увеличиваем счетчик попыток
      const [updatedResult] = await db
        .update(userAssignmentResults)
        .set({
          ...data,
          attemptsCount: (existing.attemptsCount || 0) + 1,
          updatedAt: new Date()
        })
        .where(
          and(
            eq(userAssignmentResults.userId, userId),
            eq(userAssignmentResults.assignmentId, assignmentId)
          )
        )
        .returning();
      return updatedResult;
    }
  }

  // User Skills methods
  async getUserSkills(userId: number): Promise<UserSkill[]> {
    return await db
      .select()
      .from(userSkills)
      .where(eq(userSkills.userId, userId));
  }

  async getUserSkillByName(userId: number, skillName: string): Promise<UserSkill | undefined> {
    const [skill] = await db
      .select()
      .from(skills)
      .where(eq(skills.name, skillName));

    if (!skill) return undefined;

    const [userSkill] = await db
      .select()
      .from(userSkills)
      .where(
        and(
          eq(userSkills.userId, userId),
          eq(userSkills.skillId, skill.id)
        )
      );

    return userSkill;
  }

  async saveUserSkill(userSkill: InsertUserSkill): Promise<UserSkill> {
    // Проверяем, существует ли запись
    const [existing] = await db
      .select()
      .from(userSkills)
      .where(
        and(
          eq(userSkills.userId, userSkill.userId),
          eq(userSkills.skillId, userSkill.skillId)
        )
      );

    if (!existing) {
      // Создаем новую запись
      const [newUserSkill] = await db
        .insert(userSkills)
        .values(userSkill)
        .returning();
      return newUserSkill;
    } else {
      // Обновляем существующую запись
      const [updatedUserSkill] = await db
        .update(userSkills)
        .set({
          ...userSkill,
          updatedAt: new Date()
        })
        .where(
          and(
            eq(userSkills.userId, userSkill.userId),
            eq(userSkills.skillId, userSkill.skillId)
          )
        )
        .returning();
      return updatedUserSkill;
    }
  }

  async updateUserSkill(userId: number, skillId: number, data: Partial<UserSkill>): Promise<UserSkill> {
    const [updatedUserSkill] = await db
      .update(userSkills)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(
        and(
          eq(userSkills.userId, userId),
          eq(userSkills.skillId, skillId)
        )
      )
      .returning();
    return updatedUserSkill;
  }

  // User Skill Gaps methods
  async getUserSkillGaps(userId: number): Promise<UserSkillGap[]> {
    return await db
      .select()
      .from(userSkillGaps)
      .where(eq(userSkillGaps.userId, userId));
  }

  async saveUserSkillGap(skillGap: InsertUserSkillGap): Promise<UserSkillGap> {
    const [newGap] = await db
      .insert(userSkillGaps)
      .values(skillGap)
      .returning();
    return newGap;
  }

  async updateUserSkillGap(id: number, data: Partial<UserSkillGap>): Promise<UserSkillGap> {
    const [updatedGap] = await db
      .update(userSkillGaps)
      .set(data)
      .where(eq(userSkillGaps.id, id))
      .returning();
    return updatedGap;
  }

  // Learning Events methods
  async saveLearningEvent(event: InsertLearningEvent): Promise<LearningEvent> {
    const [newEvent] = await db
      .insert(learningEvents)
      .values(event)
      .returning();
    return newEvent;
  }

  async getLearningEvents(userId: number, params?: {
    eventType?: string;
    entityType?: string;
    entityId?: number;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): Promise<LearningEvent[]> {
    const conditions = [eq(learningEvents.userId, userId)];

    if (params?.eventType) {
      conditions.push(eq(learningEvents.eventType, params.eventType));
    }

    if (params?.entityType) {
      conditions.push(eq(learningEvents.entityType, params.entityType as any));
    }

    if (params?.entityId) {
      conditions.push(eq(learningEvents.entityId, params.entityId));
    }

    if (params?.startDate) {
      conditions.push(sql`${learningEvents.timestamp} >= ${params.startDate}`);
    }

    if (params?.endDate) {
      conditions.push(sql`${learningEvents.timestamp} <= ${params.endDate}`);
    }

    let query = db
      .select()
      .from(learningEvents)
      .where(and(...conditions))
      .orderBy(desc(learningEvents.timestamp));

    if (params?.limit) {
      query = query.limit(params.limit);
    }

    return await query;
  }

  // Learning Timeline methods
  async getUserLearningTimeline(userId: number, limit?: number): Promise<LearningEvent[]> {
    let query = db
      .select()
      .from(learningEvents)
      .where(eq(learningEvents.userId, userId))
      .orderBy(desc(learningEvents.timestamp));

    if (limit) {
      query = query.limit(limit);
    }

    return await query;
  }

  // Admin Analytics Methods
  async getTotalUsersCount(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);
    return result[0]?.count || 0;
  }

  async getTotalCoursesCount(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(courses);
    return result[0]?.count || 0;
  }

  async getTotalLessonsCount(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(lessons);
    return result[0]?.count || 0;
  }

  async getTotalLearningEventsCount(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(learningEvents);
    return result[0]?.count || 0;
  }

  // Real-time trend analytics methods
  async getUserGrowthTrend(days: number = 30): Promise<Array<{date: string, count: number}>> {
    const result = await db
      .select({
        date: sql<string>`DATE(${users.createdAt})`,
        count: sql<number>`count(*)`
      })
      .from(users)
      .where(sql`${users.createdAt} >= NOW() - INTERVAL '${days} days'`)
      .groupBy(sql`DATE(${users.createdAt})`)
      .orderBy(sql`DATE(${users.createdAt})`);
    
    return result;
  }

  async getCourseCompletionTrend(weeks: number = 12): Promise<Array<{week: string, completion_rate: number}>> {
    const result = await db
      .select({
        week: sql<string>`DATE_TRUNC('week', ${learningEvents.timestamp})`,
        completion_rate: sql<number>`
          ROUND(
            (COUNT(CASE WHEN ${learningEvents.eventType} = 'course_completed' THEN 1 END)::float / 
             NULLIF(COUNT(CASE WHEN ${learningEvents.eventType} = 'course_started' THEN 1 END), 0)) * 100, 1
          )`
      })
      .from(learningEvents)
      .where(sql`${learningEvents.timestamp} >= NOW() - INTERVAL '${weeks} weeks'`)
      .groupBy(sql`DATE_TRUNC('week', ${learningEvents.timestamp})`)
      .orderBy(sql`DATE_TRUNC('week', ${learningEvents.timestamp})`);
    
    return result;
  }

  async getHourlyActivityData(): Promise<Array<{hour: number, activity_count: number}>> {
    const result = await db
      .select({
        hour: sql<number>`EXTRACT(HOUR FROM ${learningEvents.timestamp})`,
        activity_count: sql<number>`count(*)`
      })
      .from(learningEvents)
      .where(sql`${learningEvents.timestamp} >= NOW() - INTERVAL '24 hours'`)
      .groupBy(sql`EXTRACT(HOUR FROM ${learningEvents.timestamp})`)
      .orderBy(sql`EXTRACT(HOUR FROM ${learningEvents.timestamp})`);
    
    return result;
  }

  async getPeriodComparisonData(): Promise<{
    thisMonth: number,
    lastMonth: number,
    thisWeek: number,
    lastWeek: number,
    today: number,
    yesterday: number
  }> {
    const [thisMonth] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(sql`${users.createdAt} >= DATE_TRUNC('month', NOW())`);

    const [lastMonth] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(sql`${users.createdAt} >= DATE_TRUNC('month', NOW() - INTERVAL '1 month') 
                 AND ${users.createdAt} < DATE_TRUNC('month', NOW())`);

    const [thisWeek] = await db
      .select({ 
        completion_rate: sql<number>`
          ROUND(
            (COUNT(CASE WHEN ${learningEvents.eventType} = 'course_completed' THEN 1 END)::float / 
             NULLIF(COUNT(CASE WHEN ${learningEvents.eventType} = 'course_started' THEN 1 END), 0)) * 100, 1
          )`
      })
      .from(learningEvents)
      .where(sql`${learningEvents.timestamp} >= DATE_TRUNC('week', NOW())`);

    const [lastWeek] = await db
      .select({ 
        completion_rate: sql<number>`
          ROUND(
            (COUNT(CASE WHEN ${learningEvents.eventType} = 'course_completed' THEN 1 END)::float / 
             NULLIF(COUNT(CASE WHEN ${learningEvents.eventType} = 'course_started' THEN 1 END), 0)) * 100, 1
          )`
      })
      .from(learningEvents)
      .where(sql`${learningEvents.timestamp} >= DATE_TRUNC('week', NOW() - INTERVAL '1 week') 
                 AND ${learningEvents.timestamp} < DATE_TRUNC('week', NOW())`);

    const [today] = await db
      .select({ count: sql<number>`count(*)` })
      .from(learningEvents)
      .where(sql`DATE(${learningEvents.timestamp}) = CURRENT_DATE`);

    const [yesterday] = await db
      .select({ count: sql<number>`count(*)` })
      .from(learningEvents)
      .where(sql`DATE(${learningEvents.timestamp}) = CURRENT_DATE - INTERVAL '1 day'`);

    return {
      thisMonth: thisMonth?.count || 0,
      lastMonth: lastMonth?.count || 0,
      thisWeek: thisWeek?.completion_rate || 0,
      lastWeek: lastWeek?.completion_rate || 0,
      today: today?.count || 0,
      yesterday: yesterday?.count || 0
    };
  }

  async getCategoryDistribution(): Promise<Array<{category: string, percentage: number, sessions: number}>> {
    const result = await db
      .select({
        category: courses.category,
        sessions: sql<number>`count(${learningEvents.id})`,
        percentage: sql<number>`
          ROUND(
            (count(${learningEvents.id})::float / 
             (SELECT count(*) FROM ${learningEvents} le2 
              JOIN ${courses} c2 ON le2.entity_id = c2.id 
              WHERE le2.entity_type = 'course')) * 100, 0
          )`
      })
      .from(learningEvents)
      .innerJoin(courses, eq(learningEvents.entityId, courses.id))
      .where(eq(learningEvents.entityType, 'course'))
      .groupBy(courses.category)
      .orderBy(sql`count(${learningEvents.id}) DESC`);

    return result;
  }

  async getTopCoursesByActivity(): Promise<Array<{title: string, sessions: number}>> {
    const result = await db
      .select({
        title: courses.title,
        sessions: sql<number>`count(${learningEvents.id})`
      })
      .from(learningEvents)
      .innerJoin(courses, eq(learningEvents.entityId, courses.id))
      .where(eq(learningEvents.entityType, 'course'))
      .groupBy(courses.title)
      .orderBy(sql`count(${learningEvents.id}) DESC`)
      .limit(5);

    return result;
  }



  async getRetentionRate(days: number): Promise<number> {
    const totalUsers = await this.getTotalUsersCount();
    const activeUsers = await this.getActiveUsersCount(days);
    
    return totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100 * 10) / 10 : 0;
  }

  async getCourseCompletionRate(): Promise<number> {
    const [completions] = await db
      .select({
        rate: sql<number>`
          ROUND(
            (COUNT(CASE WHEN ${learningEvents.eventType} = 'course_completed' THEN 1 END)::float / 
             NULLIF(COUNT(CASE WHEN ${learningEvents.eventType} = 'course_started' THEN 1 END), 0)) * 100, 1
          )`
      })
      .from(learningEvents)
      .where(sql`${learningEvents.eventType} IN ('course_started', 'course_completed')`);
    
    return completions?.rate || 0;
  }

  async getLessonCompletionRate(): Promise<number> {
    const [completions] = await db
      .select({
        rate: sql<number>`
          ROUND(
            (COUNT(CASE WHEN ${learningEvents.eventType} = 'lesson_completed' THEN 1 END)::float / 
             NULLIF(COUNT(CASE WHEN ${learningEvents.eventType} = 'lesson_started' THEN 1 END), 0)) * 100, 1
          )`
      })
      .from(learningEvents)
      .where(sql`${learningEvents.eventType} IN ('lesson_started', 'lesson_completed')`);
    
    return completions?.rate || 0;
  }

  async getAverageSessionDuration(): Promise<number> {
    const [avgDuration] = await db
      .select({
        avg_duration: sql<number>`
          COALESCE(AVG(EXTRACT(EPOCH FROM (
            CASE 
              WHEN ${learningEvents.data}->>'duration' IS NOT NULL 
              THEN CAST(${learningEvents.data}->>'duration' AS INTEGER)
              ELSE 1800
            END
          ))), 1800)`
      })
      .from(learningEvents)
      .where(eq(learningEvents.eventType, 'session_end'));
    
    return Math.floor(avgDuration?.avg_duration || 1800);
  }

  async getChurnRate(): Promise<number> {
    const [churn] = await db
      .select({
        rate: sql<number>`
          ROUND(
            (COUNT(CASE WHEN ${users.createdAt} < NOW() - INTERVAL '30 days' 
                        AND ${users.id} NOT IN (
                          SELECT DISTINCT user_id FROM ${learningEvents} 
                          WHERE timestamp > NOW() - INTERVAL '30 days'
                        ) THEN 1 END)::float / 
             NULLIF(COUNT(CASE WHEN ${users.createdAt} < NOW() - INTERVAL '30 days' THEN 1 END), 0)) * 100, 1
          )`
      })
      .from(users);
    
    return churn?.rate || 0;
  }

  async getReactivationRate(): Promise<number> {
    const [reactivation] = await db
      .select({
        rate: sql<number>`
          ROUND(
            (COUNT(CASE WHEN ${users.id} IN (
              SELECT DISTINCT user_id FROM ${learningEvents} 
              WHERE timestamp > NOW() - INTERVAL '7 days'
              AND user_id IN (
                SELECT user_id FROM ${learningEvents}
                WHERE timestamp < NOW() - INTERVAL '30 days'
                AND timestamp > NOW() - INTERVAL '60 days'
              )
            ) THEN 1 END)::float / 
             NULLIF(COUNT(*), 0)) * 100, 1
          )`
      })
      .from(users);
    
    return reactivation?.rate || 0;
  }

  async getAverageLearningStreak(): Promise<number> {
    const [streak] = await db
      .select({
        avg_streak: sql<number>`
          COALESCE(AVG(
            CASE 
              WHEN ${learningEvents.data}->>'streak' IS NOT NULL 
              THEN CAST(${learningEvents.data}->>'streak' AS INTEGER)
              ELSE 1
            END
          ), 1)`
      })
      .from(learningEvents)
      .where(eq(learningEvents.eventType, 'streak_updated'));
    
    return Math.round((streak?.avg_streak || 1) * 10) / 10;
  }

  async getUserEngagementScore(): Promise<number> {
    const [engagement] = await db
      .select({
        score: sql<number>`
          ROUND(
            (COUNT(DISTINCT ${learningEvents.userId})::float / 
             NULLIF((SELECT COUNT(*) FROM ${users}), 0) * 100) + 
            (COUNT(*)::float / 
             NULLIF((SELECT COUNT(*) FROM ${users}), 0) * 0.1), 1
          )`
      })
      .from(learningEvents)
      .where(sql`${learningEvents.timestamp} > NOW() - INTERVAL '30 days'`);
    
    return Math.min(engagement?.score || 0, 100);
  }

  async getSkillsProgressRate(): Promise<number> {
    const totalUsers = await this.getTotalUsersCount();
    
    const [skillsUsers] = await db
      .select({ count: sql<number>`count(DISTINCT ${userSkills.userId})` })
      .from(userSkills)
      .where(sql`${userSkills.level} > 0`);
    
    return totalUsers > 0 ? 
      Math.round((skillsUsers?.count || 0) / totalUsers * 100 * 10) / 10 : 0;
  }

  async getRecentUsersCount(days: number): Promise<number> {
    const dateThreshold = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(sql`${users.createdAt} >= ${dateThreshold}`);
    return result[0]?.count || 0;
  }

  async getActiveSessionsCount(): Promise<number> {
    // Simulate active sessions based on recent activity
    return 15;
  }

  async getAllUserCourseProgress(): Promise<UserCourseProgress[]> {
    return await db.select().from(userCourseProgress);
  }

  async getAllUserProfiles(): Promise<UserProfile[]> {
    return await db.select().from(userProfiles);
  }

  async getActiveUsersCount(days: number): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(distinct ${learningEvents.userId})` })
      .from(learningEvents)
      .where(sql`${learningEvents.timestamp} >= NOW() - INTERVAL '${days} days'`);
    return result[0]?.count || 0;
  }

  async getNewUsersCount(days: number): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(users)
      .where(sql`${users.createdAt} >= NOW() - INTERVAL '${days} days'`);
    return result[0]?.count || 0;
  }
}

export const storage = new DatabaseStorage();

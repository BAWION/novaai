import { 
  type User, 
  type InsertUser, 
  type UserProfile,
  type InsertUserProfile,
  type Course,
  type InsertCourse,
  type UserCourseProgress,
  type InsertUserCourseProgress,
  users,
  userProfiles,
  courses,
  userCourseProgress
} from "@shared/schema";
import { db } from "./db";
import { eq, and, like, or, inArray } from "drizzle-orm";
import { IStorage } from "./storage";

// Реализация хранилища с использованием PostgreSQL
export class DatabaseStorage implements Partial<IStorage> {
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
    const [result] = await db.insert(users).values(user).returning();
    return result;
  }
  
  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const [updated] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return updated;
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
    const [result] = await db.insert(userProfiles).values(profile).returning();
    return result;
  }
  
  async updateUserProfile(userId: number, data: Partial<UserProfile>): Promise<UserProfile> {
    const [updated] = await db
      .update(userProfiles)
      .set(data)
      .where(eq(userProfiles.userId, userId))
      .returning();
    return updated;
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
    return db.select().from(courses);
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
    
    // Для фильтрации по тегам требуется более сложная логика,
    // так как теги хранятся в JSON-массиве
    // Это упрощенная реализация
    
    return query;
  }
  
  async createCourse(course: InsertCourse): Promise<Course> {
    const [result] = await db.insert(courses).values(course).returning();
    return result;
  }
  
  async updateCourse(id: number, data: Partial<Course>): Promise<Course> {
    const [updated] = await db
      .update(courses)
      .set(data)
      .where(eq(courses.id, id))
      .returning();
    return updated;
  }
  
  // User Course Progress methods
  async getUserCourseProgress(userId: number): Promise<UserCourseProgress[]> {
    return db
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
    const existingProgress = await this.getCourseProgress(userId, courseId);
    
    if (existingProgress) {
      // Обновляем существующую запись
      const [updated] = await db
        .update(userCourseProgress)
        .set(data)
        .where(
          and(
            eq(userCourseProgress.userId, userId),
            eq(userCourseProgress.courseId, courseId)
          )
        )
        .returning();
      return updated;
    } else {
      // Создаем новую запись
      const [created] = await db
        .insert(userCourseProgress)
        .values({
          userId,
          courseId,
          progress: data.progress ?? 0,
          completedModules: data.completedModules ?? 0,
        })
        .returning();
      return created;
    }
  }
}
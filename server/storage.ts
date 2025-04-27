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
  
  // Module methods
  getModule(id: number): Promise<Module | undefined>;
  getModulesByCourse(courseId: number): Promise<Module[]>;
  createModule(module: InsertModule): Promise<Module>;
  updateModule(id: number, data: Partial<Module>): Promise<Module>;
  
  // Section methods
  getSection(id: number): Promise<Section | undefined>;
  getSectionsByModule(moduleId: number): Promise<Section[]>;
  createSection(section: InsertSection): Promise<Section>;
  updateSection(id: number, data: Partial<Section>): Promise<Section>;
  
  // Lesson methods
  getLesson(id: number): Promise<Lesson | undefined>;
  getLessonsByModule(moduleId: number): Promise<Lesson[]>;
  getLessonsBySection(sectionId: number): Promise<Lesson[]>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  updateLesson(id: number, data: Partial<Lesson>): Promise<Lesson>;
  
  // LessonSkill methods
  getLessonSkills(lessonId: number): Promise<LessonSkill[]>;
  addSkillToLesson(lessonSkill: InsertLessonSkill): Promise<LessonSkill>;
  
  // Quiz methods
  getQuiz(id: number): Promise<Quiz | undefined>;
  getQuizByLesson(lessonId: number): Promise<Quiz | undefined>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  getQuizQuestions(quizId: number): Promise<QuizQuestion[]>;
  getQuizAnswers(questionId: number): Promise<QuizAnswer[]>;
  
  // Lesson Variants methods
  getLessonVariants(lessonId: number): Promise<LessonVariant[]>;
  getDefaultLessonVariant(lessonId: number): Promise<LessonVariant | undefined>;
  
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
  getUserLessonsProgress(userId: number, moduleId: number): Promise<UserLessonProgress[]>;
  updateUserLessonProgress(
    userId: number,
    lessonId: number,
    data: Partial<UserLessonProgress>
  ): Promise<UserLessonProgress>;
  
  // User Quiz methods
  getUserQuizAttempts(userId: number, quizId: number): Promise<UserQuizAttempt[]>;
  createQuizAttempt(attempt: InsertUserQuizAttempt): Promise<UserQuizAttempt>;
  updateQuizAttempt(id: number, data: Partial<UserQuizAttempt>): Promise<UserQuizAttempt>;
  saveUserQuizAnswer(answer: InsertUserQuizAnswer): Promise<UserQuizAnswer>;
  
  // User Favorite Courses (Bookmarks) methods
  getUserFavoriteCourses(userId: number): Promise<UserFavoriteCourse[]>;
  getFavoriteCourse(userId: number, courseId: number): Promise<UserFavoriteCourse | undefined>;
  addCourseToFavorites(data: InsertUserFavoriteCourse): Promise<UserFavoriteCourse>;
  removeCourseFromFavorites(userId: number, courseId: number): Promise<void>;
  
  // Course Ratings methods
  getCourseRatings(courseId: number): Promise<CourseRating[]>;
  getUserCourseRating(userId: number, courseId: number): Promise<CourseRating | undefined>;
  getCourseAverageRating(courseId: number): Promise<number>;
  rateCourse(data: InsertCourseRating): Promise<CourseRating>;
  updateCourseRating(userId: number, courseId: number, data: Partial<CourseRating>): Promise<CourseRating>;
  
  // AI Chat History methods
  saveAIChatInteraction(interaction: InsertAIChatHistory): Promise<AIChatHistory>;
  getUserAIChatHistory(userId: number, params?: {
    lessonId?: number;
    courseId?: number;
    assistantType?: string;
    limit?: number;
  }): Promise<AIChatHistory[]>;
  
  // Analytics methods
  getUserCourseStatistics(userId: number): Promise<{
    totalCoursesStarted: number;
    totalCoursesCompleted: number;
    averageProgress: number;
    totalTimeSpent: number; // in minutes
    activeDays: number;
    streakDays: number;
  }>;
  
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
  
  // Learning Sessions methods
  createLearningSession(session: InsertLearningSession): Promise<LearningSession>;
  getLearningSession(sessionId: string): Promise<LearningSession | undefined>;
  updateLearningSession(sessionId: string, data: Partial<LearningSession>): Promise<LearningSession>;
  
  // Learning Timeline methods
  getUserLearningTimeline(userId: number, limit?: number): Promise<LearningEvent[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private userProfiles: Map<number, UserProfile>;
  private courses: Map<number, Course>;
  private userCourseProgress: Map<string, UserCourseProgress>;
  private userFavoriteCourses: Map<string, UserFavoriteCourse>;
  private courseRatings: Map<string, CourseRating>;
  
  private userIdCounter: number;
  private profileIdCounter: number;
  private courseIdCounter: number;
  private progressIdCounter: number;
  private favoriteIdCounter: number;
  private ratingIdCounter: number;

  constructor() {
    this.users = new Map();
    this.userProfiles = new Map();
    this.courses = new Map();
    this.userCourseProgress = new Map();
    this.userFavoriteCourses = new Map();
    this.courseRatings = new Map();
    
    this.userIdCounter = 1;
    this.profileIdCounter = 1;
    this.courseIdCounter = 1;
    this.progressIdCounter = 1;
    this.favoriteIdCounter = 1;
    this.ratingIdCounter = 1;
    
    // Initialize with some sample courses
    this.initSampleData();
  }

  // Initialize sample data
  private initSampleData() {
    // Add sample courses
    const sampleCourses: InsertCourse[] = [
      {
        title: "Python Basics",
        description: "Основы программирования на Python",
        slug: "python-basics",
        icon: "code",
        modules: 8,
        level: "basic",
        color: "secondary",
        difficulty: 1,
        access: "free",
        version: "1.0",
        estimatedDuration: 900,
        tags: ["python", "programming", "beginner"]
      },
      {
        title: "Math Lite",
        description: "Математика для машинного обучения",
        slug: "math-lite",
        icon: "calculator",
        modules: 5,
        level: "basic",
        color: "primary",
        difficulty: 2,
        access: "free",
        version: "1.0",
        estimatedDuration: 720,
        tags: ["math", "linear-algebra", "statistics"]
      },
      {
        title: "Data Analysis",
        description: "Анализ и визуализация данных",
        slug: "data-analysis",
        icon: "database",
        modules: 6,
        level: "practice",
        color: "secondary",
        difficulty: 3,
        access: "pro",
        version: "1.0",
        estimatedDuration: 840,
        tags: ["data-science", "pandas", "visualization"]
      },
      {
        title: "ML Foundations",
        description: "Основы машинного обучения",
        slug: "ml-foundations",
        icon: "brain",
        modules: 7,
        level: "in-progress",
        color: "primary",
        difficulty: 4,
        access: "pro",
        version: "1.0",
        estimatedDuration: 1200,
        tags: ["machine-learning", "sklearn", "models"]
      },
      {
        title: "Capstone Project",
        description: "Выпускной проект",
        slug: "capstone-project",
        icon: "project-diagram",
        modules: 3,
        level: "upcoming",
        color: "accent",
        difficulty: 5,
        access: "expert",
        version: "1.0",
        estimatedDuration: 1800,
        tags: ["project", "advanced", "team-work"]
      }
    ];
    
    sampleCourses.forEach(course => this.createCourse(course));
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      displayName: insertUser.displayName || null,
      avatarUrl: insertUser.avatarUrl || null,
      telegramId: insertUser.telegramId || null,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }
  
  // User Profile methods
  async getUserProfile(userId: number): Promise<UserProfile | undefined> {
    return Array.from(this.userProfiles.values()).find(
      profile => profile.userId === userId
    );
  }
  
  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const id = this.profileIdCounter++;
    const now = new Date();
    
    const userProfile: UserProfile = {
      ...profile,
      id,
      progress: 0,
      streakDays: 0,
      lastActiveAt: now
    };
    
    this.userProfiles.set(id, userProfile);
    return userProfile;
  }
  
  async updateUserProfile(userId: number, data: Partial<UserProfile>): Promise<UserProfile> {
    const profile = await this.getUserProfile(userId);
    
    if (!profile) {
      throw new Error(`User profile not found for user ID ${userId}`);
    }
    
    const updatedProfile: UserProfile = {
      ...profile,
      ...data,
      lastActiveAt: new Date()
    };
    
    this.userProfiles.set(profile.id, updatedProfile);
    return updatedProfile;
  }
  
  // Course methods
  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }
  
  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }
  
  async createCourse(course: InsertCourse): Promise<Course> {
    const id = this.courseIdCounter++;
    const now = new Date();
    
    // Ensuring all required fields have proper values
    const newCourse: Course = { 
      ...course, 
      id,
      createdAt: now,
      updatedAt: now,
      difficulty: course.difficulty || 1,
      access: course.access || "free",
      version: course.version || "1.0",
      estimatedDuration: course.estimatedDuration || null,
      tags: course.tags || null,
      authorId: null
    };
    
    this.courses.set(id, newCourse);
    return newCourse;
  }
  
  // Course Progress methods
  async getUserCourseProgress(userId: number): Promise<UserCourseProgress[]> {
    return Array.from(this.userCourseProgress.values()).filter(
      progress => progress.userId === userId
    );
  }
  
  async getCourseProgress(userId: number, courseId: number): Promise<UserCourseProgress | undefined> {
    const key = `${userId}-${courseId}`;
    return this.userCourseProgress.get(key);
  }
  
  async updateUserCourseProgress(
    userId: number,
    courseId: number,
    data: Partial<UserCourseProgress>
  ): Promise<UserCourseProgress> {
    const key = `${userId}-${courseId}`;
    let progress = this.userCourseProgress.get(key);
    const now = new Date();
    
    if (!progress) {
      // Create new progress entry if it doesn't exist
      const id = this.progressIdCounter++;
      const course = await this.getCourse(courseId);
      
      progress = {
        id,
        userId,
        courseId,
        progress: data.progress || 0,
        completedModules: data.completedModules || null,
        currentModuleId: data.currentModuleId || null,
        currentLessonId: data.currentLessonId || null,
        lastContentVersion: course?.version || null,
        startedAt: now,
        lastAccessedAt: now
      };
    } else {
      // Update existing progress
      progress = {
        ...progress,
        ...data,
        lastAccessedAt: now
      };
    }
    
    this.userCourseProgress.set(key, progress);
    
    // Also update user profile progress if needed
    this.updateUserOverallProgress(userId);
    
    return progress;
  }
  
  // Helper method to update user's overall progress
  private async updateUserOverallProgress(userId: number) {
    const profile = await this.getUserProfile(userId);
    const courseProgress = await this.getUserCourseProgress(userId);
    
    if (profile && courseProgress.length > 0) {
      // Calculate average progress across all courses
      const totalProgress = courseProgress.reduce((sum, cp) => sum + cp.progress, 0);
      const averageProgress = Math.floor(totalProgress / courseProgress.length);
      
      // Determine streak days (this would be more complex in a real app)
      const now = new Date();
      const lastActive = profile.lastActiveAt;
      
      if (lastActive) {
        const oneDayMs = 24 * 60 * 60 * 1000;
        let streakDays = profile.streakDays || 0;
        
        // If last active was yesterday, increment streak
        if ((now.getTime() - lastActive.getTime()) <= oneDayMs) {
          streakDays += 1;
        } else if ((now.getTime() - lastActive.getTime()) > (2 * oneDayMs)) {
          // If more than 2 days since last active, reset streak
          streakDays = 1;
        }
        
        // Update profile
        this.updateUserProfile(userId, {
          progress: averageProgress,
          streakDays
        });
      } else {
        // No last active date, just update progress
        this.updateUserProfile(userId, {
          progress: averageProgress,
          streakDays: 1
        });
      }
    }
  }
  
  // User Favorite Courses (Bookmarks) methods
  async getUserFavoriteCourses(userId: number): Promise<UserFavoriteCourse[]> {
    return Array.from(this.userFavoriteCourses.values()).filter(
      favorite => favorite.userId === userId
    );
  }
  
  async getFavoriteCourse(userId: number, courseId: number): Promise<UserFavoriteCourse | undefined> {
    const key = `${userId}-${courseId}`;
    return this.userFavoriteCourses.get(key);
  }
  
  async addCourseToFavorites(data: InsertUserFavoriteCourse): Promise<UserFavoriteCourse> {
    const { userId, courseId } = data;
    const key = `${userId}-${courseId}`;
    
    // Check if already in favorites
    const existing = await this.getFavoriteCourse(userId, courseId);
    if (existing) {
      return existing;
    }
    
    const id = this.favoriteIdCounter++;
    const now = new Date();
    
    const favorite: UserFavoriteCourse = {
      id,
      userId,
      courseId,
      addedAt: now
    };
    
    this.userFavoriteCourses.set(key, favorite);
    return favorite;
  }
  
  async removeCourseFromFavorites(userId: number, courseId: number): Promise<void> {
    const key = `${userId}-${courseId}`;
    this.userFavoriteCourses.delete(key);
  }
  
  // Course Ratings methods
  async getCourseRatings(courseId: number): Promise<CourseRating[]> {
    return Array.from(this.courseRatings.values()).filter(
      rating => rating.courseId === courseId
    );
  }
  
  async getUserCourseRating(userId: number, courseId: number): Promise<CourseRating | undefined> {
    const key = `${userId}-${courseId}`;
    return this.courseRatings.get(key);
  }
  
  async getCourseAverageRating(courseId: number): Promise<number> {
    const ratings = await this.getCourseRatings(courseId);
    
    if (ratings.length === 0) {
      return 0;
    }
    
    const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return parseFloat((sum / ratings.length).toFixed(1));
  }
  
  async rateCourse(data: InsertCourseRating): Promise<CourseRating> {
    const { userId, courseId, rating, review } = data;
    const key = `${userId}-${courseId}`;
    
    // Check if user already rated this course
    const existing = await this.getUserCourseRating(userId, courseId);
    if (existing) {
      return this.updateCourseRating(userId, courseId, { rating, review });
    }
    
    const id = this.ratingIdCounter++;
    const now = new Date();
    
    const courseRating: CourseRating = {
      id,
      userId,
      courseId,
      rating,
      review: review || null,
      createdAt: now,
      updatedAt: now
    };
    
    this.courseRatings.set(key, courseRating);
    return courseRating;
  }
  
  async updateCourseRating(userId: number, courseId: number, data: Partial<CourseRating>): Promise<CourseRating> {
    const key = `${userId}-${courseId}`;
    const existing = this.courseRatings.get(key);
    
    if (!existing) {
      throw new Error(`Rating not found for user ${userId} and course ${courseId}`);
    }
    
    const updated: CourseRating = {
      ...existing,
      ...data,
      updatedAt: new Date()
    };
    
    this.courseRatings.set(key, updated);
    return updated;
  }
}

// Импортируем класс DatabaseStorage
import { DatabaseStorage } from "./database-storage";

// Используем DatabaseStorage вместо MemStorage
export const storage = new DatabaseStorage();

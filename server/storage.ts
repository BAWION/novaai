import { 
  type User, 
  type InsertUser, 
  type UserProfile,
  type InsertUserProfile,
  type Skill,
  type InsertSkill,
  type Course,
  type InsertCourse,
  type Module,
  type InsertModule,
  type Section,
  type InsertSection,
  type Lesson,
  type InsertLesson,
  type LessonSkill,
  type InsertLessonSkill,
  type Quiz,
  type InsertQuiz,
  type QuizQuestion,
  type InsertQuizQuestion,
  type QuizAnswer,
  type InsertQuizAnswer,
  type LessonVariant,
  type InsertLessonVariant,
  type UserCourseProgress,
  type InsertUserCourseProgress,
  type UserLessonProgress,
  type InsertUserLessonProgress,
  type UserQuizAttempt,
  type InsertUserQuizAttempt,
  type UserQuizAnswer,
  type InsertUserQuizAnswer,
  type AIChatHistory,
  type InsertAIChatHistory
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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private userProfiles: Map<number, UserProfile>;
  private courses: Map<number, Course>;
  private userCourseProgress: Map<string, UserCourseProgress>;
  
  private userIdCounter: number;
  private profileIdCounter: number;
  private courseIdCounter: number;
  private progressIdCounter: number;

  constructor() {
    this.users = new Map();
    this.userProfiles = new Map();
    this.courses = new Map();
    this.userCourseProgress = new Map();
    
    this.userIdCounter = 1;
    this.profileIdCounter = 1;
    this.courseIdCounter = 1;
    this.progressIdCounter = 1;
    
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
        icon: "code",
        modules: 8,
        level: "basic",
        color: "secondary"
      },
      {
        title: "Math Lite",
        description: "Математика для машинного обучения",
        icon: "calculator",
        modules: 5,
        level: "basic",
        color: "primary"
      },
      {
        title: "Data Analysis",
        description: "Анализ и визуализация данных",
        icon: "database",
        modules: 6,
        level: "practice",
        color: "secondary"
      },
      {
        title: "ML Foundations",
        description: "Основы машинного обучения",
        icon: "brain",
        modules: 7,
        level: "in-progress",
        color: "primary"
      },
      {
        title: "Capstone Project",
        description: "Выпускной проект",
        icon: "project-diagram",
        modules: 3,
        level: "upcoming",
        color: "accent"
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
    const newCourse: Course = { ...course, id };
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
      progress = {
        id,
        userId,
        courseId,
        progress: data.progress || 0,
        completedModules: data.completedModules || [],
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
      const oneDayMs = 24 * 60 * 60 * 1000;
      
      let streakDays = profile.streakDays;
      
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
    }
  }
}

export const storage = new MemStorage();

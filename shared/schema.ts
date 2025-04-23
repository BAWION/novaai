import { pgTable, text, serial, integer, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  telegramId: text("telegram_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  avatarUrl: true,
  telegramId: true,
});

// User profile model
export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  role: text("role").notNull(), // student, professional, teacher, researcher
  pythonLevel: integer("python_level").notNull(), // 1-5
  experience: text("experience").notNull(), // beginner, learning-basics, experienced, expert
  interest: text("interest").notNull(), // machine-learning, neural-networks, data-science, computer-vision
  goal: text("goal").notNull(), // find-internship, practice-skills, career-change, create-project
  recommendedTrack: text("recommended_track").notNull(), // zero-to-hero, applied-ds, research-ai, nlp-expert
  progress: integer("progress").default(0), // 0-100
  streakDays: integer("streak_days").default(0),
  lastActiveAt: timestamp("last_active_at").defaultNow(),
  // Расширенные поля профиля для онбординга
  industry: text("industry"), // it, finance, healthcare, education, manufacturing, etc.
  jobTitle: text("job_title"), // Текущая позиция пользователя
  specificGoals: text("specific_goals").array(), // Конкретные цели, например ["изучить_машинное_обучение", "построить_портфолио"]
  preferredLearningStyle: text("preferred_learning_style"), // visual, practical, theoretical, mixed
  availableTimePerWeek: integer("available_time_per_week"), // Доступное время в часах
  preferredDifficulty: text("preferred_difficulty"), // easy, moderate, challenging
  completedOnboarding: integer("completed_onboarding").default(0), // 0 - не пройден онбординг, 1 - пройден
  recommendedCourseIds: json("recommended_course_ids").$type<number[]>(), // ID рекомендованных курсов
  onboardingCompletedAt: timestamp("onboarding_completed_at"), // Когда был завершен онбординг
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  progress: true,
  streakDays: true,
  lastActiveAt: true,
  onboardingCompletedAt: true,
});

// Skills model
export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  category: text("category").notNull(), // programming, ml, data-science, etc.
  level: integer("level").default(1).notNull(), // от 1 (начальный) до 5 (экспертный)
  taxonomy: text("taxonomy"), // иерархия, например "programming.python.data-structures"
  prerequisites: text("prerequisites").array(), // массив имен навыков-пререквизитов
  weight: integer("weight").default(1).notNull(), // вес навыка в общей оценке прогресса (1-10)
  isCore: integer("is_core").default(0).notNull() // 0 - нет, 1 - да
});

export const insertSkillSchema = createInsertSchema(skills).pick({
  name: true,
  description: true,
  category: true,
  level: true,
  taxonomy: true,
  prerequisites: true,
  weight: true,
  isCore: true,
});

// Courses model
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  slug: text("slug").notNull().unique(), // Для SEO-friendly URL
  icon: text("icon").notNull(),
  modules: integer("modules").notNull(),
  level: text("level").notNull(), // basic, intermediate, advanced, expert
  difficulty: integer("difficulty").notNull().default(1), // 1-5 scale
  color: text("color").notNull(), // primary, secondary, accent
  access: text("access").notNull().default("free"), // free, pro, premium
  version: text("version").notNull().default("1.0.0"), // Семантическое версионирование
  estimatedDuration: integer("estimated_duration"), // В минутах
  tags: json("tags").$type<string[]>(),
  authorId: integer("author_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCourseSchema = createInsertSchema(courses).pick({
  title: true,
  description: true,
  slug: true,
  icon: true,
  modules: true,
  level: true,
  difficulty: true,
  color: true,
  access: true,
  version: true,
  estimatedDuration: true,
  tags: true,
  authorId: true,
});

// Modules model
export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id),
  title: text("title").notNull(),
  description: text("description"),
  orderIndex: integer("order_index").notNull(), // Порядок модулей в курсе
  estimatedDuration: integer("estimated_duration"), // В минутах
  version: text("version").notNull().default("1.0.0"), // Семантическое версионирование
});

export const insertModuleSchema = createInsertSchema(modules).pick({
  courseId: true,
  title: true,
  description: true,
  orderIndex: true,
  estimatedDuration: true,
  version: true,
});

// Sections model (подразделы в модулях)
export const sections = pgTable("sections", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").notNull().references(() => modules.id),
  title: text("title").notNull(),
  description: text("description"),
  orderIndex: integer("order_index").notNull(), // Порядок секций в модуле
});

export const insertSectionSchema = createInsertSchema(sections).pick({
  moduleId: true,
  title: true,
  description: true,
  orderIndex: true,
});

// Lessons model
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  sectionId: integer("section_id").references(() => sections.id),
  moduleId: integer("module_id").notNull().references(() => modules.id),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // video, text, quiz, interactive, practice
  content: text("content"), // HTML/Markdown content или URL для видео
  orderIndex: integer("order_index").notNull(),
  duration: integer("duration"), // В минутах
  difficulty: integer("difficulty").default(1), // 1-3
  version: text("version").notNull().default("1.0.0"),
});

export const insertLessonSchema = createInsertSchema(lessons).pick({
  sectionId: true,
  moduleId: true,
  title: true,
  description: true,
  type: true,
  content: true,
  orderIndex: true,
  duration: true,
  difficulty: true,
  version: true,
});

// Lesson-Skill relationship (many-to-many)
export const lessonSkills = pgTable("lesson_skills", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull().references(() => lessons.id),
  skillId: integer("skill_id").notNull().references(() => skills.id),
  level: integer("level").default(1), // 1-5: насколько урок развивает навык
});

export const insertLessonSkillSchema = createInsertSchema(lessonSkills).pick({
  lessonId: true,
  skillId: true,
  level: true,
});

// Quiz model
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull().references(() => lessons.id),
  title: text("title").notNull(),
  description: text("description"),
  passingScore: integer("passing_score").default(70), // в процентах
});

export const insertQuizSchema = createInsertSchema(quizzes).pick({
  lessonId: true,
  title: true,
  description: true,
  passingScore: true,
});

// Quiz questions
export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").notNull().references(() => quizzes.id),
  prompt: text("prompt").notNull(),
  type: text("type").notNull(), // multiple-choice, single-choice, text, code
  orderIndex: integer("order_index").notNull(),
  points: integer("points").default(1),
});

export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).pick({
  quizId: true,
  prompt: true,
  type: true,
  orderIndex: true,
  points: true,
});

// Quiz answers
export const quizAnswers = pgTable("quiz_answers", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id").notNull().references(() => quizQuestions.id),
  text: text("text").notNull(),
  isCorrect: integer("is_correct").default(0), // 0 - неверный, 1 - верный
  orderIndex: integer("order_index").notNull(),
  explanation: text("explanation"), // Объяснение почему ответ верный/неверный
});

export const insertQuizAnswerSchema = createInsertSchema(quizAnswers).pick({
  questionId: true,
  text: true,
  isCorrect: true,
  orderIndex: true,
  explanation: true,
});

// Lesson Variants for A/B testing
export const lessonVariants = pgTable("lesson_variants", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull().references(() => lessons.id),
  variant: text("variant").notNull(), // a, b, c, etc.
  content: text("content").notNull(),
  isDefault: integer("is_default").default(0), // 0 - no, 1 - yes
});

export const insertLessonVariantSchema = createInsertSchema(lessonVariants).pick({
  lessonId: true,
  variant: true,
  content: true,
  isDefault: true,
});

// User course progress
export const userCourseProgress = pgTable("user_course_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  courseId: integer("course_id").notNull().references(() => courses.id),
  progress: integer("progress").notNull().default(0), // 0-100
  completedModules: json("completed_modules").$type<number[]>(),
  currentModuleId: integer("current_module_id").references(() => modules.id),
  currentLessonId: integer("current_lesson_id").references(() => lessons.id),
  lastContentVersion: text("last_content_version"), // Отслеживание версии контента
  startedAt: timestamp("started_at").defaultNow(),
  lastAccessedAt: timestamp("last_accessed_at").defaultNow(),
});

export const insertUserCourseProgressSchema = createInsertSchema(userCourseProgress).pick({
  userId: true,
  courseId: true,
  progress: true,
  completedModules: true,
  currentModuleId: true,
  currentLessonId: true,
  lastContentVersion: true,
});

// User lesson progress
export const userLessonProgress = pgTable("user_lesson_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  lessonId: integer("lesson_id").notNull().references(() => lessons.id),
  progress: integer("progress").notNull().default(0), // 0-100
  completed: integer("completed").default(0), // 0 - не завершен, 1 - завершен
  timeSpent: integer("time_spent").default(0), // Время в секундах, потраченное на урок
  lastPosition: text("last_position"), // JSON с позицией в видео или прокруткой страницы
  lastAccessedAt: timestamp("last_accessed_at").defaultNow(),
  completedAt: timestamp("completed_at"), // Когда был завершен урок
  notes: text("notes"), // Заметки пользователя к уроку
});

export const insertUserLessonProgressSchema = createInsertSchema(userLessonProgress).pick({
  userId: true,
  lessonId: true,
  progress: true,
  completed: true,
  timeSpent: true,
  lastPosition: true,
  notes: true,
});

// User quiz attempts
export const userQuizAttempts = pgTable("user_quiz_attempts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  quizId: integer("quiz_id").notNull().references(() => quizzes.id),
  score: integer("score").notNull().default(0), // Набранные баллы
  maxScore: integer("max_score").notNull(), // Максимально возможные баллы
  passed: integer("passed").default(0), // 0 - не пройден, 1 - пройден
  attemptNumber: integer("attempt_number").notNull().default(1), // Номер попытки
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertUserQuizAttemptSchema = createInsertSchema(userQuizAttempts).pick({
  userId: true,
  quizId: true,
  score: true,
  maxScore: true,
  passed: true,
  attemptNumber: true,
});

// User quiz answers
export const userQuizAnswers = pgTable("user_quiz_answers", {
  id: serial("id").primaryKey(),
  attemptId: integer("attempt_id").notNull().references(() => userQuizAttempts.id),
  questionId: integer("question_id").notNull().references(() => quizQuestions.id),
  answerData: text("answer_data").notNull(), // JSON с ответом пользователя
  isCorrect: integer("is_correct").default(0), // 0 - неверно, 1 - верно
  pointsEarned: integer("points_earned").default(0),
});

export const insertUserQuizAnswerSchema = createInsertSchema(userQuizAnswers).pick({
  attemptId: true,
  questionId: true,
  answerData: true,
  isCorrect: true,
  pointsEarned: true,
});

// AI Assistant Chat History
export const aiChatHistory = pgTable("ai_chat_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  lessonId: integer("lesson_id").references(() => lessons.id),
  courseId: integer("course_id").references(() => courses.id),
  assistantType: text("assistant_type").notNull(), // nova, coding-mentor, concept-tutor
  userMessage: text("user_message").notNull(),
  aiResponse: text("ai_response").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  context: text("context"), // Дополнительный контекст сообщения (JSON)
  helpful: integer("helpful"), // Оценка пользователя: 1 - помогло, 0 - не помогло
});

export const insertAiChatHistorySchema = createInsertSchema(aiChatHistory).pick({
  userId: true,
  lessonId: true,
  courseId: true,
  assistantType: true,
  userMessage: true,
  aiResponse: true,
  context: true,
});

// User Skills (для отслеживания уровня навыков пользователя)
export const userSkills = pgTable("user_skills", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  skillId: integer("skill_id").notNull().references(() => skills.id),
  level: integer("level").notNull().default(0), // 0-100, процент владения навыком
  lastAssessedAt: timestamp("last_assessed_at").defaultNow(),
  source: text("source").notNull().default("system"), // откуда получена оценка: system, quiz, self-assessment
  history: json("history").$type<{date: string, level: number}[]>(), // история изменения уровня
});

export const insertUserSkillSchema = createInsertSchema(userSkills).pick({
  userId: true,
  skillId: true,
  level: true,
  source: true,
  history: true,
});

// User Skill Gap (для отслеживания пробелов в навыках)
export const userSkillGaps = pgTable("user_skill_gaps", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  skillId: integer("skill_id").notNull().references(() => skills.id),
  targetLevel: integer("target_level").notNull(), // целевой уровень для достижения
  currentLevel: integer("current_level").notNull().default(0), // текущий уровень
  priority: integer("priority").notNull().default(1), // приоритет (1-5)
  status: text("status").notNull().default("identified"), // identified, in_progress, addressed
  recommendedModules: json("recommended_modules").$type<number[]>(), // ID рекомендуемых модулей
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSkillGapSchema = createInsertSchema(userSkillGaps).pick({
  userId: true,
  skillId: true,
  targetLevel: true,
  currentLevel: true,
  priority: true,
  status: true,
  recommendedModules: true,
});

// Learning Events (для отслеживания событий обучения)
export const learningEvents = pgTable("learning_events", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  eventType: text("event_type").notNull(), // lesson.view, lesson.complete, quiz.start, quiz.submit, etc.
  entityType: text("entity_type").notNull(), // lesson, quiz, module, course
  entityId: integer("entity_id").notNull(), // ID связанной сущности
  data: json("data"), // Дополнительные данные о событии в формате JSON
  duration: integer("duration"), // Длительность события в секундах (для времени просмотра/чтения)
  createdAt: timestamp("created_at").defaultNow(),
  sessionId: text("session_id"), // ID сессии пользователя для группировки событий
});

export const insertLearningEventSchema = createInsertSchema(learningEvents).pick({
  userId: true,
  eventType: true,
  entityType: true,
  entityId: true,
  data: true,
  duration: true,
  sessionId: true,
});

// User Learning Sessions (для отслеживания сессий обучения)
export const learningSessions = pgTable("learning_sessions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  userId: integer("user_id").notNull().references(() => users.id),
  startedAt: timestamp("started_at").defaultNow(),
  endedAt: timestamp("ended_at"),
  totalDuration: integer("total_duration"), // Общая длительность сессии в секундах
  device: text("device"), // Информация об устройстве
  platform: text("platform"), // web, mobile, tablet
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
});

export const insertLearningSessionSchema = createInsertSchema(learningSessions).pick({
  sessionId: true,
  userId: true,
  endedAt: true,
  totalDuration: true,
  device: true,
  platform: true,
  ipAddress: true,
  userAgent: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;

export type Skill = typeof skills.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type Module = typeof modules.$inferSelect;
export type InsertModule = z.infer<typeof insertModuleSchema>;

export type Section = typeof sections.$inferSelect;
export type InsertSection = z.infer<typeof insertSectionSchema>;

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;

export type LessonSkill = typeof lessonSkills.$inferSelect;
export type InsertLessonSkill = z.infer<typeof insertLessonSkillSchema>;

export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;

export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;

export type QuizAnswer = typeof quizAnswers.$inferSelect;
export type InsertQuizAnswer = z.infer<typeof insertQuizAnswerSchema>;

export type LessonVariant = typeof lessonVariants.$inferSelect;
export type InsertLessonVariant = z.infer<typeof insertLessonVariantSchema>;

export type UserCourseProgress = typeof userCourseProgress.$inferSelect;
export type InsertUserCourseProgress = z.infer<typeof insertUserCourseProgressSchema>;

export type UserLessonProgress = typeof userLessonProgress.$inferSelect;
export type InsertUserLessonProgress = z.infer<typeof insertUserLessonProgressSchema>;

export type UserQuizAttempt = typeof userQuizAttempts.$inferSelect;
export type InsertUserQuizAttempt = z.infer<typeof insertUserQuizAttemptSchema>;

export type UserQuizAnswer = typeof userQuizAnswers.$inferSelect;
export type InsertUserQuizAnswer = z.infer<typeof insertUserQuizAnswerSchema>;

export type AIChatHistory = typeof aiChatHistory.$inferSelect;
export type InsertAIChatHistory = z.infer<typeof insertAiChatHistorySchema>;

// User Favorite Courses (Bookmarks)
export const userFavoriteCourses = pgTable("user_favorite_courses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  courseId: integer("course_id").notNull().references(() => courses.id),
  addedAt: timestamp("added_at").defaultNow(),
});

export const insertUserFavoriteCourseSchema = createInsertSchema(userFavoriteCourses).pick({
  userId: true,
  courseId: true,
});

export type UserFavoriteCourse = typeof userFavoriteCourses.$inferSelect;
export type InsertUserFavoriteCourse = z.infer<typeof insertUserFavoriteCourseSchema>;

// Course Ratings
export const courseRatings = pgTable("course_ratings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  courseId: integer("course_id").notNull().references(() => courses.id),
  rating: integer("rating").notNull(), // 1-5 stars
  review: text("review"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCourseRatingSchema = createInsertSchema(courseRatings).pick({
  userId: true,
  courseId: true,
  rating: true,
  review: true,
});

export type CourseRating = typeof courseRatings.$inferSelect;
export type InsertCourseRating = z.infer<typeof insertCourseRatingSchema>;

export type UserSkill = typeof userSkills.$inferSelect;
export type InsertUserSkill = z.infer<typeof insertUserSkillSchema>;

export type UserSkillGap = typeof userSkillGaps.$inferSelect;
export type InsertUserSkillGap = z.infer<typeof insertUserSkillGapSchema>;

export type LearningEvent = typeof learningEvents.$inferSelect;
export type InsertLearningEvent = z.infer<typeof insertLearningEventSchema>;

export type LearningSession = typeof learningSessions.$inferSelect;
export type InsertLearningSession = z.infer<typeof insertLearningSessionSchema>;

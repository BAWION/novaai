import { sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  real,
  primaryKey,
  index,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Определение таблицы пользователей
export const users = sqliteTable(
  "users",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    username: text("username").notNull(),
    password: text("password").notNull(), // В реальном приложении хранить зашифрованный пароль
    displayName: text("display_name"),
    email: text("email"),
    avatarUrl: text("avatar_url"),
    role: text("role", { enum: ["student", "teacher", "admin"] }),
    createdAt: integer("created_at", { mode: "timestamp" }).default(
      sql`(strftime('%s', 'now'))`
    ),
    updatedAt: integer("updated_at", { mode: "timestamp" }).default(
      sql`(strftime('%s', 'now'))`
    ),
  },
  (users) => ({
    usernameIdx: index("username_idx").on(users.username),
  })
);

// Определение таблицы профилей пользователей
export const userProfiles = sqliteTable(
  "user_profiles",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    role: text("role").notNull(), // student, teacher, employee, researcher, other
    pythonLevel: integer("python_level").notNull(), // 0-5
    experience: text("experience").notNull(), // beginner, learning-basics, practical-experience, professional, expert
    interest: text("interest").notNull(), // machine-learning, neural-networks, data-science, etc.
    goal: text("goal").notNull(), // learn-basics, broaden-knowledge, practice-skills, etc.
    recommendedTrack: text("recommended_track"), // zero-to-hero, applied-ds, research-ai, nlp-expert
    progress: integer("progress"), // общий прогресс в процентах
    streakDays: integer("streak_days"), // дни непрерывного обучения
    lastActiveAt: integer("last_active_at", { mode: "timestamp" }),
    // Расширенные поля профиля
    industry: text("industry"), // отрасль (для сотрудников компаний, исследователей)
    jobTitle: text("job_title"), // должность
    specificGoals: text("specific_goals", { mode: "json" }), // конкретные цели обучения
    preferredLearningStyle: text("preferred_learning_style"), // visual, auditory, reading, practical
    availableTimePerWeek: integer("available_time_per_week"), // доступное время для обучения в часах
    preferredDifficulty: text("preferred_difficulty"), // easy, moderate, challenging
    completedOnboarding: integer("completed_onboarding", { mode: "boolean" }),
    onboardingCompletedAt: integer("onboarding_completed_at", { mode: "timestamp" }),
    recommendedCourseIds: text("recommended_course_ids", { mode: "json" }), // JSON массив ID рекомендованных курсов
  },
  (userProfiles) => ({
    userIdIdx: index("user_id_idx").on(userProfiles.userId),
  })
);

// Определение таблицы навыков
export const skills = sqliteTable(
  "skills",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    displayName: text("display_name").notNull(),
    description: text("description"),
    category: text("category").notNull(), // ml-basics, deep-learning, data-science, etc.
    level: integer("level"), // уровень сложности (1-5)
    parentSkillId: integer("parent_skill_id").references(() => skills.id),
    prerequisites: text("prerequisites", { mode: "json" }), // JSON массив ID предварительных навыков
    icon: text("icon"),
    color: text("color"),
  },
  (skills) => ({
    nameIdx: index("name_idx").on(skills.name),
    categoryIdx: index("category_idx").on(skills.category),
  })
);

// Определение таблицы навыков пользователя
export const userSkills = sqliteTable(
  "user_skills",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    skillId: integer("skill_id")
      .notNull()
      .references(() => skills.id),
    level: integer("level").notNull(), // текущий уровень владения (0-100)
    targetLevel: integer("target_level"), // целевой уровень
    lastPracticed: integer("last_practiced", { mode: "timestamp" }),
    timesReviewed: integer("times_reviewed").default(0),
  },
  (userSkills) => ({
    userSkillIdx: index("user_skill_idx").on(userSkills.userId, userSkills.skillId),
  })
);

// Определение таблицы пробелов в навыках пользователя
export const userSkillGaps = sqliteTable(
  "user_skill_gaps",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    skillId: integer("skill_id")
      .notNull()
      .references(() => skills.id),
    gapSize: integer("gap_size").notNull(), // размер пробела (0-100)
    priority: integer("priority"), // приоритет для изучения (1-5)
    recommendedResources: text("recommended_resources", { mode: "json" }), // рекомендуемые ресурсы для устранения пробела
    detectedAt: integer("detected_at", { mode: "timestamp" }).default(
      sql`(strftime('%s', 'now'))`
    ),
  },
  (userSkillGaps) => ({
    userSkillGapIdx: index("user_skill_gap_idx").on(userSkillGaps.userId, userSkillGaps.skillId),
  })
);

// Определение таблицы курсов
export const courses = sqliteTable(
  "courses",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    icon: text("icon"),
    difficulty: integer("difficulty").notNull(), // 1-5
    level: text("level").notNull(), // basic, intermediate, advanced, expert
    modules: integer("modules").notNull(), // количество модулей
    estimatedDuration: integer("estimated_duration"), // в минутах
    tags: text("tags", { mode: "json" }), // JSON массив тегов
    color: text("color"), // цвет для интерфейса
    access: text("access").notNull(), // free, premium, enterprise
    authorId: integer("author_id").references(() => users.id),
    createdAt: integer("created_at", { mode: "timestamp" }).default(
      sql`(strftime('%s', 'now'))`
    ),
    updatedAt: integer("updated_at", { mode: "timestamp" }).default(
      sql`(strftime('%s', 'now'))`
    ),
  },
  (courses) => ({
    slugIdx: index("slug_idx").on(courses.slug),
    levelIdx: index("level_idx").on(courses.level),
  })
);

// Определение таблицы модулей курса
export const modules = sqliteTable(
  "modules",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    courseId: integer("course_id")
      .notNull()
      .references(() => courses.id),
    title: text("title").notNull(),
    description: text("description"),
    order: integer("order").notNull(),
    estimatedDuration: integer("estimated_duration"), // в минутах
  },
  (modules) => ({
    courseIdIdx: index("module_course_id_idx").on(modules.courseId),
  })
);

// Определение таблицы разделов модуля
export const sections = sqliteTable(
  "sections",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    moduleId: integer("module_id")
      .notNull()
      .references(() => modules.id),
    title: text("title").notNull(),
    description: text("description"),
    order: integer("order").notNull(),
  },
  (sections) => ({
    moduleIdIdx: index("section_module_id_idx").on(sections.moduleId),
  })
);

// Определение таблицы уроков
export const lessons = sqliteTable(
  "lessons",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    moduleId: integer("module_id")
      .notNull()
      .references(() => modules.id),
    sectionId: integer("section_id").references(() => sections.id),
    title: text("title").notNull(),
    description: text("description"),
    content: text("content"),
    contentType: text("content_type").notNull(), // text, video, interactive, quiz
    estimatedDuration: integer("estimated_duration"), // в минутах
    order: integer("order").notNull(),
    status: text("status").default("draft"), // draft, published, archived
  },
  (lessons) => ({
    moduleIdIdx: index("lesson_module_id_idx").on(lessons.moduleId),
    sectionIdIdx: index("lesson_section_id_idx").on(lessons.sectionId),
  })
);

// Связь уроков с навыками
export const lessonSkills = sqliteTable(
  "lesson_skills",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    lessonId: integer("lesson_id")
      .notNull()
      .references(() => lessons.id),
    skillId: integer("skill_id")
      .notNull()
      .references(() => skills.id),
    weight: integer("weight").default(1), // вес навыка в этом уроке (1-5)
  },
  (lessonSkills) => ({
    lessonSkillIdx: index("lesson_skill_idx").on(lessonSkills.lessonId, lessonSkills.skillId),
  })
);

// Варианты уроков для персонализации
export const lessonVariants = sqliteTable(
  "lesson_variants",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    lessonId: integer("lesson_id")
      .notNull()
      .references(() => lessons.id),
    title: text("title").notNull(),
    content: text("content").notNull(),
    contentType: text("content_type").notNull(),
    learningStyle: text("learning_style"), // visual, auditory, reading, practical
    difficultyLevel: text("difficulty_level"), // easy, moderate, challenging
    isDefault: integer("is_default", { mode: "boolean" }).default(0),
  },
  (lessonVariants) => ({
    lessonIdIdx: index("variant_lesson_id_idx").on(lessonVariants.lessonId),
  })
);

// Прогресс пользователя по курсам
export const userCourseProgress = sqliteTable(
  "user_course_progress",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    courseId: integer("course_id")
      .notNull()
      .references(() => courses.id),
    progress: integer("progress").default(0), // процент выполнения
    completedModules: integer("completed_modules").default(0),
    startedAt: integer("started_at", { mode: "timestamp" }).default(
      sql`(strftime('%s', 'now'))`
    ),
    lastAccessedAt: integer("last_accessed_at", { mode: "timestamp" }).default(
      sql`(strftime('%s', 'now'))`
    ),
    completedAt: integer("completed_at", { mode: "timestamp" }),
  },
  (userCourseProgress) => ({
    userCourseIdx: index("user_course_idx").on(userCourseProgress.userId, userCourseProgress.courseId),
  })
);

// Прогресс пользователя по урокам
export const userLessonProgress = sqliteTable(
  "user_lesson_progress",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    lessonId: integer("lesson_id")
      .notNull()
      .references(() => lessons.id),
    status: text("status").default("not_started"), // not_started, in_progress, completed
    progress: integer("progress").default(0),
    timeSpent: integer("time_spent").default(0), // в секундах
    completedAt: integer("completed_at", { mode: "timestamp" }),
    lastAccessedAt: integer("last_accessed_at", { mode: "timestamp" }),
    selectedVariantId: integer("selected_variant_id").references(() => lessonVariants.id),
  },
  (userLessonProgress) => ({
    userLessonIdx: index("user_lesson_idx").on(userLessonProgress.userId, userLessonProgress.lessonId),
  })
);

// Избранные курсы пользователя
export const userFavoriteCourses = sqliteTable(
  "user_favorite_courses",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    courseId: integer("course_id")
      .notNull()
      .references(() => courses.id),
    createdAt: integer("created_at", { mode: "timestamp" }).default(
      sql`(strftime('%s', 'now'))`
    ),
  },
  (userFavoriteCourses) => ({
    userCourseIdx: index("user_favorite_course_idx").on(userFavoriteCourses.userId, userFavoriteCourses.courseId),
  })
);

// Оценки курсов пользователями
export const courseRatings = sqliteTable(
  "course_ratings",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    courseId: integer("course_id")
      .notNull()
      .references(() => courses.id),
    rating: integer("rating").notNull(), // 1-5
    review: text("review"),
    createdAt: integer("created_at", { mode: "timestamp" }).default(
      sql`(strftime('%s', 'now'))`
    ),
    updatedAt: integer("updated_at", { mode: "timestamp" }).default(
      sql`(strftime('%s', 'now'))`
    ),
  },
  (courseRatings) => ({
    userCourseIdx: index("user_course_rating_idx").on(courseRatings.userId, courseRatings.courseId),
  })
);

// Тесты/Квизы
export const quizzes = sqliteTable(
  "quizzes",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    lessonId: integer("lesson_id")
      .notNull()
      .references(() => lessons.id),
    title: text("title").notNull(),
    description: text("description"),
    passingScore: integer("passing_score").default(70), // процент для прохождения
    timeLimit: integer("time_limit"), // время в минутах (если ограничено)
    allowRetake: integer("allow_retake", { mode: "boolean" }).default(1),
    createdAt: integer("created_at", { mode: "timestamp" }).default(
      sql`(strftime('%s', 'now'))`
    ),
  },
  (quizzes) => ({
    lessonIdIdx: index("quiz_lesson_id_idx").on(quizzes.lessonId),
  })
);

// Вопросы квиза
export const quizQuestions = sqliteTable(
  "quiz_questions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    quizId: integer("quiz_id")
      .notNull()
      .references(() => quizzes.id),
    text: text("text").notNull(),
    type: text("type").notNull(), // multiple_choice, single_choice, true_false, fill_blank, matching
    points: integer("points").default(1),
    order: integer("order").notNull(),
    explanation: text("explanation"),
  },
  (quizQuestions) => ({
    quizIdIdx: index("question_quiz_id_idx").on(quizQuestions.quizId),
  })
);

// Варианты ответов на вопросы
export const quizAnswers = sqliteTable(
  "quiz_answers",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    questionId: integer("question_id")
      .notNull()
      .references(() => quizQuestions.id),
    text: text("text").notNull(),
    isCorrect: integer("is_correct", { mode: "boolean" }).notNull(),
    explanation: text("explanation"),
    order: integer("order").notNull(),
  },
  (quizAnswers) => ({
    questionIdIdx: index("answer_question_id_idx").on(quizAnswers.questionId),
  })
);

// Попытки прохождения квизов пользователями
export const userQuizAttempts = sqliteTable(
  "user_quiz_attempts",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    quizId: integer("quiz_id")
      .notNull()
      .references(() => quizzes.id),
    startedAt: integer("started_at", { mode: "timestamp" }).default(
      sql`(strftime('%s', 'now'))`
    ),
    completedAt: integer("completed_at", { mode: "timestamp" }),
    score: integer("score"),
    timeSpent: integer("time_spent"), // в секундах
    passed: integer("passed", { mode: "boolean" }),
    attemptNumber: integer("attempt_number").default(1),
  },
  (userQuizAttempts) => ({
    userQuizIdx: index("user_quiz_attempt_idx").on(userQuizAttempts.userId, userQuizAttempts.quizId),
  })
);

// Ответы пользователей на вопросы квиза
export const userQuizAnswers = sqliteTable(
  "user_quiz_answers",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    attemptId: integer("attempt_id")
      .notNull()
      .references(() => userQuizAttempts.id),
    questionId: integer("question_id")
      .notNull()
      .references(() => quizQuestions.id),
    answerId: integer("answer_id").references(() => quizAnswers.id),
    textAnswer: text("text_answer"), // для вопросов типа fill_blank
    isCorrect: integer("is_correct", { mode: "boolean" }),
    points: integer("points").default(0),
  },
  (userQuizAnswers) => ({
    attemptQuestionIdx: index("attempt_question_idx").on(userQuizAnswers.attemptId, userQuizAnswers.questionId),
  })
);

// История чатов с AI-ассистентом
export const aiChatHistory = sqliteTable(
  "ai_chat_history",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    lessonId: integer("lesson_id").references(() => lessons.id),
    courseId: integer("course_id").references(() => courses.id),
    assistantType: text("assistant_type").notNull(), // tutor, mentor, companion, etc.
    message: text("message").notNull(),
    isUserMessage: integer("is_user_message", { mode: "boolean" }).notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).default(
      sql`(strftime('%s', 'now'))`
    ),
    context: text("context", { mode: "json" }), // контекст сообщения (JSON)
  },
  (aiChatHistory) => ({
    userIdIdx: index("chat_user_id_idx").on(aiChatHistory.userId),
    lessonIdIdx: index("chat_lesson_id_idx").on(aiChatHistory.lessonId),
  })
);

// События обучения (для аналитики)
export const learningEvents = sqliteTable(
  "learning_events",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    eventType: text("event_type").notNull(), // lesson.started, lesson.completed, quiz.started, etc.
    entityType: text("entity_type").notNull(), // lesson, quiz, course, etc.
    entityId: integer("entity_id").notNull(),
    timestamp: integer("timestamp", { mode: "timestamp" }).default(
      sql`(strftime('%s', 'now'))`
    ),
    data: text("data", { mode: "json" }), // дополнительные данные события (JSON)
  },
  (learningEvents) => ({
    userIdIdx: index("event_user_id_idx").on(learningEvents.userId),
    entityIdx: index("event_entity_idx").on(learningEvents.entityType, learningEvents.entityId),
    timestampIdx: index("event_timestamp_idx").on(learningEvents.timestamp),
  })
);

// Сессии обучения
export const learningSessions = sqliteTable(
  "learning_sessions",
  {
    id: text("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    startedAt: integer("started_at", { mode: "timestamp" }).default(
      sql`(strftime('%s', 'now'))`
    ),
    endedAt: integer("ended_at", { mode: "timestamp" }),
    duration: integer("duration"), // в секундах
    activitySummary: text("activity_summary", { mode: "json" }),
  },
  (learningSessions) => ({
    userIdIdx: index("session_user_id_idx").on(learningSessions.userId),
    startedAtIdx: index("session_started_at_idx").on(learningSessions.startedAt),
  })
);

// Создание схем для вставки данных
export const insertUserSchema = createInsertSchema(users);
export const insertUserProfileSchema = createInsertSchema(userProfiles, {
  progress: z.number().nullable().optional(),
  streakDays: z.number().nullable().optional(),
  lastActiveAt: z.date().optional(),
  recommendedTrack: z.string().optional(),
  industry: z.string().optional(),
  jobTitle: z.string().optional(),
  specificGoals: z.array(z.string()).optional(),
  preferredLearningStyle: z.string().optional(),
  availableTimePerWeek: z.number().optional(),
  preferredDifficulty: z.string().optional(),
  completedOnboarding: z.boolean().optional(),
  onboardingCompletedAt: z.date().nullable().optional(),
  recommendedCourseIds: z.array(z.number()).optional(),
});
export const insertSkillSchema = createInsertSchema(skills, {
  description: z.string().optional(),
  level: z.number().optional(),
  parentSkillId: z.number().optional(),
  prerequisites: z.array(z.number()).optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
});
export const insertUserSkillSchema = createInsertSchema(userSkills, {
  targetLevel: z.number().optional(),
  lastPracticed: z.date().optional(),
  timesReviewed: z.number().optional(),
});
export const insertUserSkillGapSchema = createInsertSchema(userSkillGaps, {
  priority: z.number().optional(),
  recommendedResources: z.array(z.string()).optional(),
  detectedAt: z.date().optional(),
});
export const insertCourseSchema = createInsertSchema(courses, {
  description: z.string().optional(),
  icon: z.string().optional(),
  estimatedDuration: z.number().optional(),
  tags: z.array(z.string()).optional(),
  color: z.string().optional(),
  authorId: z.number().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export const insertUserCourseProgressSchema = createInsertSchema(userCourseProgress, {
  progress: z.number().optional(),
  completedModules: z.number().optional(),
  startedAt: z.date().optional(),
  lastAccessedAt: z.date().optional(),
  completedAt: z.date().nullable().optional(),
});
export const insertUserFavoriteCourseSchema = createInsertSchema(userFavoriteCourses, {
  createdAt: z.date().optional(),
});
export const insertCourseRatingSchema = createInsertSchema(courseRatings, {
  review: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export const insertLearningEventSchema = createInsertSchema(learningEvents, {
  timestamp: z.date().optional(),
  data: z.record(z.any()).optional(),
});
export const insertUserLessonProgressSchema = createInsertSchema(userLessonProgress, {
  status: z.string().optional(),
  progress: z.number().optional(),
  timeSpent: z.number().optional(),
  completedAt: z.date().nullable().optional(),
  lastAccessedAt: z.date().nullable().optional(),
  selectedVariantId: z.number().nullable().optional(),
});
export const insertUserQuizAttemptSchema = createInsertSchema(userQuizAttempts, {
  startedAt: z.date().optional(),
  completedAt: z.date().nullable().optional(),
  score: z.number().nullable().optional(),
  timeSpent: z.number().nullable().optional(),
  passed: z.boolean().nullable().optional(),
  attemptNumber: z.number().optional(),
});
export const insertLessonSkillSchema = createInsertSchema(lessonSkills, {
  weight: z.number().optional(),
});
export const insertAIChatHistorySchema = createInsertSchema(aiChatHistory, {
  createdAt: z.date().optional(),
  context: z.record(z.any()).optional(),
});
export const insertLearningSessionSchema = createInsertSchema(learningSessions, {
  startedAt: z.date().optional(),
  endedAt: z.date().nullable().optional(),
  duration: z.number().nullable().optional(),
  activitySummary: z.record(z.any()).nullable().optional(),
});
export const insertUserQuizAnswerSchema = createInsertSchema(userQuizAnswers, {
  answerId: z.number().nullable().optional(),
  textAnswer: z.string().optional(),
  isCorrect: z.boolean().nullable().optional(),
  points: z.number().optional(),
});

// Типы для вставки данных
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type InsertUserSkill = z.infer<typeof insertUserSkillSchema>;
export type InsertUserSkillGap = z.infer<typeof insertUserSkillGapSchema>;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type InsertUserCourseProgress = z.infer<typeof insertUserCourseProgressSchema>;
export type InsertUserFavoriteCourse = z.infer<typeof insertUserFavoriteCourseSchema>;
export type InsertCourseRating = z.infer<typeof insertCourseRatingSchema>;
export type InsertLearningEvent = z.infer<typeof insertLearningEventSchema>;
export type InsertUserLessonProgress = z.infer<typeof insertUserLessonProgressSchema>;
export type InsertUserQuizAttempt = z.infer<typeof insertUserQuizAttemptSchema>;
export type InsertUserQuizAnswer = z.infer<typeof insertUserQuizAnswerSchema>;
export type InsertLessonSkill = z.infer<typeof insertLessonSkillSchema>;
export type InsertAIChatHistory = z.infer<typeof insertAIChatHistorySchema>;
export type InsertLearningSession = z.infer<typeof insertLearningSessionSchema>;

// Типы данных из таблиц
export type User = typeof users.$inferSelect;
export type UserProfile = typeof userProfiles.$inferSelect;
export type Skill = typeof skills.$inferSelect;
export type UserSkill = typeof userSkills.$inferSelect;
export type UserSkillGap = typeof userSkillGaps.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type Module = typeof modules.$inferSelect;
export type Section = typeof sections.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type LessonSkill = typeof lessonSkills.$inferSelect;
export type LessonVariant = typeof lessonVariants.$inferSelect;
export type UserCourseProgress = typeof userCourseProgress.$inferSelect;
export type UserLessonProgress = typeof userLessonProgress.$inferSelect;
export type UserFavoriteCourse = typeof userFavoriteCourses.$inferSelect;
export type CourseRating = typeof courseRatings.$inferSelect;
export type Quiz = typeof quizzes.$inferSelect;
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type QuizAnswer = typeof quizAnswers.$inferSelect;
export type UserQuizAttempt = typeof userQuizAttempts.$inferSelect;
export type UserQuizAnswer = typeof userQuizAnswers.$inferSelect;
export type AIChatHistory = typeof aiChatHistory.$inferSelect;
export type LearningEvent = typeof learningEvents.$inferSelect;
export type LearningSession = typeof learningSessions.$inferSelect;

// Тип данных профиля пользователя для передачи на клиент
export interface UserProfileData {
  role: string;
  pythonLevel: number;
  experience: string;
  interest: string;
  goal: string;
  recommendedTrack: string | null;
  progress: number | null;
  streakDays: number | null;
  displayName: string;
  userId?: number;
  completedOnboarding?: boolean;
  recommendedCourseIds?: number[];
}

// Тип для структуры навыка с дополнительной информацией
export interface SkillWithInfo extends Skill {
  userLevel?: number;
  targetLevel?: number;
  gapSize?: number;
  isLearning?: boolean;
  lastPracticed?: Date;
  categoryName?: string;
  lessonCount?: number;
  relatedCourses?: { id: number; title: string }[];
}

// Тип для структуры карты навыков
export interface SkillMapData {
  categories: {
    id: string;
    name: string;
    skills: SkillWithInfo[];
    overallProgress: number;
  }[];
  overallProgress: number;
  learningSkills: number;
  masteredSkills: number;
  gapCount: number;
}

// Тип для структуры пробелов в навыках
export interface SkillGapsData {
  gaps: (UserSkillGap & {
    skill: SkillWithInfo;
  })[];
  priorityHigh: number;
  priorityMedium: number;
  priorityLow: number;
  totalGaps: number;
}
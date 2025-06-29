import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  integer,
  serial,
  boolean,
  timestamp,
  index,
  varchar,
  json,
  pgEnum,
  primaryKey,
  uuid,
  real,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Определение перечислений
export const userRoleEnum = pgEnum('user_role', ['student', 'teacher', 'admin']);
export const experienceEnum = pgEnum('experience_level', ['beginner', 'learning-basics', 'practical-experience', 'professional', 'expert']);
export const interestEnum = pgEnum('interest_area', ['machine-learning', 'neural-networks', 'data-science', 'computer-vision', 'nlp', 'robotics', 'ethics', 'law', 'other']);
export const goalEnum = pgEnum('learning_goal', ['learn-basics', 'broaden-knowledge', 'practice-skills', 'certification', 'career-change', 'research']);
export const learningStyleEnum = pgEnum('learning_style', ['visual', 'auditory', 'reading', 'practical']);
export const difficultyEnum = pgEnum('difficulty', ['easy', 'moderate', 'challenging']);
export const accessEnum = pgEnum('access_level', ['free', 'premium', 'enterprise']);
export const courseLevelEnum = pgEnum('course_level', ['basic', 'intermediate', 'advanced', 'expert']);
export const progressStatusEnum = pgEnum('progress_status', ['not_started', 'in_progress', 'completed']);
export const featureFlagStatusEnum = pgEnum('feature_flag_status', ['enabled', 'disabled', 'beta']);
export const mlModelTypeEnum = pgEnum('ml_model_type', ['recommendation', 'personalization', 'content-generation', 'skill-assessment', 'feedback-analysis']);
export const actionTypeEnum = pgEnum('action_type', ['view', 'complete', 'bookmark', 'rate', 'attempt', 'search', 'click', 'time-spent']);
export const entityTypeEnum = pgEnum('entity_type', ['course', 'module', 'lesson', 'quiz', 'skill', 'recommendation']);

// Определение таблицы пользователей
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: text("password"), // Теперь nullable для Telegram пользователей
  displayName: varchar("display_name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  avatarUrl: text("avatar_url"),
  profileImageUrl: text("profile_image_url"), // Для Telegram аватарок
  role: userRoleEnum("role"),
  // Telegram поля
  telegramId: varchar("telegram_id", { length: 50 }).unique(),
  telegramUsername: varchar("telegram_username", { length: 255 }),
  authProvider: varchar("auth_provider", { length: 50 }).default("email"), // "email", "telegram", "google", etc.
  // Дополнительные поля
  hashedPassword: text("hashed_password"), // Новое имя для password
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Определение таблицы профилей пользователей
export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  role: varchar("role", { length: 50 }).notNull(),
  pythonLevel: integer("python_level").notNull(),
  experience: experienceEnum("experience"),
  interest: interestEnum("interest"),
  goal: goalEnum("goal"),
  recommendedTrack: varchar("recommended_track", { length: 50 }),
  progress: integer("progress"),
  streakDays: integer("streak_days"),
  lastActiveAt: timestamp("last_active_at"),
  industry: varchar("industry", { length: 100 }),
  jobTitle: varchar("job_title", { length: 100 }),
  specificGoals: json("specific_goals"),
  preferredLearningStyle: learningStyleEnum("preferred_learning_style"),
  availableTimePerWeek: integer("available_time_per_week"),
  preferredDifficulty: difficultyEnum("preferred_difficulty"),
  completedOnboarding: boolean("completed_onboarding").default(false),
  onboardingCompletedAt: timestamp("onboarding_completed_at"),
  recommendedCourseIds: json("recommended_course_ids"),
  metadata: json("metadata"),  // Добавлено поле metadata для хранения расширенных данных диагностики
});

// Определение категории курса
export const categoryEnum = pgEnum('course_category', ['tech', 'ethics', 'law', 'business', 'ml', 'other']);

// Определение таблицы курсов
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  icon: text("icon"),
  difficulty: integer("difficulty").notNull(),
  level: courseLevelEnum("level").notNull(),
  modules: integer("modules").notNull(),
  estimatedDuration: integer("estimated_duration"),
  tags: json("tags"),
  color: varchar("color", { length: 50 }),
  access: accessEnum("access").notNull(),
  category: categoryEnum("category").default('tech'),
  authorId: integer("author_id").references(() => users.id),
  objectives: json("objectives"), // Цели обучения
  prerequisites: json("prerequisites"), // Предварительные требования 
  skillsGained: json("skills_gained"), // Навыки, полученные после прохождения
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Модули курса
export const courseModules = pgTable("course_modules", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  orderIndex: integer("order_index").notNull(), // Порядок модуля в курсе
  estimatedDuration: integer("estimated_duration"), // В минутах
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Уроки в модулях
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").notNull().references(() => courseModules.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  content: text("content").notNull(), // Контент урока в формате Markdown или HTML
  orderIndex: integer("order_index").notNull(), // Порядок урока в модуле
  type: varchar("type", { length: 50 }).notNull(), // Тип урока: видео, текст, практика и т.д.
  estimatedDuration: integer("estimated_duration"), // В минутах
  mediaUrls: json("media_urls"), // Ссылки на медиафайлы
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Практические задания
export const assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull().references(() => lessons.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 50 }).notNull(), // quiz, coding, project
  content: json("content").notNull(), // Содержимое задания (вопросы, ответы, примеры кода)
  points: integer("points").default(10), // Количество баллов за выполнение
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Прогресс пользователя по курсам
export const userCourseProgress = pgTable("user_course_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  courseId: integer("course_id").notNull().references(() => courses.id),
  progress: integer("progress").default(0),
  completedModules: integer("completed_modules").default(0),
  startedAt: timestamp("started_at").defaultNow(),
  lastAccessedAt: timestamp("last_accessed_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Схемы для вставки данных
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  completedOnboarding: true,
  onboardingCompletedAt: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserCourseProgressSchema = createInsertSchema(userCourseProgress).omit({
  id: true,
  startedAt: true,
  lastAccessedAt: true,
  completedAt: true,
});

// Схемы для новых таблиц курсов
export const insertCourseModuleSchema = createInsertSchema(courseModules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAssignmentSchema = createInsertSchema(assignments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});



// Схема для отслеживания прогресса по урокам
export const userLessonProgress = pgTable("user_lesson_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  lessonId: integer("lesson_id").notNull().references(() => lessons.id),
  status: progressStatusEnum("status").default("not_started"),
  completedAt: timestamp("completed_at"),
  notes: text("notes"),
  lastPosition: integer("last_position").default(0), // Последняя позиция просмотра/чтения
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    userLessonIdx: uniqueIndex("user_lesson_idx").on(table.userId, table.lessonId),
  };
});

// Схема для отслеживания выполнения заданий
export const userAssignmentResults = pgTable("user_assignment_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  assignmentId: integer("assignment_id").notNull().references(() => assignments.id),
  score: integer("score").default(0),
  answers: json("answers"), // Ответы пользователя
  feedback: text("feedback"), // Обратная связь от системы или преподавателя
  completedAt: timestamp("completed_at"),
  attemptsCount: integer("attempts_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    userAssignmentIdx: uniqueIndex("user_assignment_idx").on(table.userId, table.assignmentId),
  };
});

export const insertUserLessonProgressSchema = createInsertSchema(userLessonProgress).omit({
  id: true,
  completedAt: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserAssignmentResultsSchema = createInsertSchema(userAssignmentResults).omit({
  id: true,
  completedAt: true,
  createdAt: true,
  updatedAt: true,
});

// Типы для вставки данных
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type InsertUserCourseProgress = z.infer<typeof insertUserCourseProgressSchema>;
export type InsertCourseModule = z.infer<typeof insertCourseModuleSchema>;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;
export type InsertUserLessonProgress = z.infer<typeof insertUserLessonProgressSchema>;
export type InsertUserAssignmentResults = z.infer<typeof insertUserAssignmentResultsSchema>;

// Определение таблицы функциональных флагов для ML-функций
export const featureFlags = pgTable("feature_flags", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: text("description"),
  status: featureFlagStatusEnum("status").notNull().default("disabled"),
  targetAudience: json("target_audience"), // JSON с правилами для сегментации пользователей
  rolloutPercentage: integer("rollout_percentage").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// S4 (INSIGHT "Time-Saved") - Таблица сопоставления навыков и экономии времени
export const skillTimeEfficiency = pgTable("skill_time_efficiency", {
  id: serial("id").primaryKey(),
  dnaId: integer("dna_id").notNull().references(() => skillsDna.id, { onDelete: "cascade" }),
  level: integer("level").notNull(),
  minutesSavedPerTask: integer("minutes_saved_per_task").notNull(),
  typicalTasksPerMonth: integer("typical_tasks_per_month").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => {
  return {
    dnaLevelUnique: uniqueIndex("skill_time_efficiency_dna_level_unique").on(table.dnaId, table.level)
  };
});

// S4 (INSIGHT "Time-Saved") - Основная таблица экономии времени
export const timeSaved = pgTable("time_saved", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  minutesPerDay: integer("minutes_per_day").notNull().default(0),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull()
}, (table) => {
  return {
    userIdIdx: uniqueIndex("time_saved_user_id_idx").on(table.userId)
  };
});

// S4 (INSIGHT "Time-Saved") - Таблица истории экономии времени
export const timeSavedHistory = pgTable("time_saved_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  minutesSaved: integer("minutes_saved").notNull()
}, (table) => {
  return {
    userDateIdx: index("time_saved_history_user_date_idx").on(table.userId, table.date)
  };
});

// S4 (INSIGHT "Time-Saved") - Таблица целей по экономии времени
export const timeSavedGoals = pgTable("time_saved_goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  targetMinutesMonthly: integer("target_minutes_monthly").notNull(),
  targetDate: timestamp("target_date").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  createdAt: timestamp("created_at").notNull()
}, (table) => {
  return {
    userIdIdx: index("time_saved_goals_user_id_idx").on(table.userId)
  };
});

// S4 (INSIGHT "Time-Saved") - Таблица истории экономии времени пользователя
export const userTimeSavedHistory = pgTable("user_time_saved_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  totalMinutesSaved: integer("total_minutes_saved").notNull().default(0),
  calculationDate: timestamp("calculation_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// S4 (INSIGHT "Time-Saved") - Таблица детализации экономии времени по навыкам
export const userSkillTimeSaved = pgTable("user_skill_time_saved", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  dnaId: integer("dna_id").notNull().references(() => skillsDna.id, { onDelete: "cascade" }),
  currentLevel: integer("current_level").notNull(),
  minutesSavedMonthly: integer("minutes_saved_monthly").notNull().default(0),
  lastCalculatedAt: timestamp("last_calculated_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}, (table) => {
  return {
    userDnaUnique: uniqueIndex("user_skill_time_saved_user_dna_unique").on(table.userId, table.dnaId)
  };
});

// Таблица метрик и данных для ML-моделей
export const userActivityLogs = pgTable("user_activity_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  actionType: actionTypeEnum("action_type").notNull(),
  entityType: entityTypeEnum("entity_type").notNull(),
  entityId: integer("entity_id").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  metadata: json("metadata"), // Дополнительные данные о действии
}, (table) => {
  return {
    userActionIdx: index("user_action_idx").on(table.userId, table.actionType),
    entityIdx: index("entity_idx").on(table.entityType, table.entityId),
  };
});

// ML модели
export const mlModels = pgTable("ml_models", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  type: mlModelTypeEnum("type").notNull(),
  version: varchar("version", { length: 50 }).notNull(),
  active: boolean("active").default(false),
  configuration: json("configuration"),
  metrics: json("metrics"), // Метрики производительности модели
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    nameVersionIdx: uniqueIndex("name_version_idx").on(table.name, table.version),
  };
});

// Персонализированные рекомендации
export const userRecommendations = pgTable("user_recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  modelId: integer("model_id").references(() => mlModels.id),
  entityType: entityTypeEnum("entity_type").notNull(),
  entityId: integer("entity_id").notNull(),
  score: real("score").notNull(), // Уверенность модели в рекомендации (0-1)
  reason: text("reason"), // Объяснение рекомендации
  shown: boolean("shown").default(false),
  clicked: boolean("clicked").default(false),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    userEntityIdx: uniqueIndex("user_entity_idx").on(table.userId, table.entityType, table.entityId),
  };
});

// Таблица для бэкапов и снапшотов данных модели
export const mlDataSnapshots = pgTable("ml_data_snapshots", {
  id: serial("id").primaryKey(),
  modelId: integer("model_id").references(() => mlModels.id),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  dataPath: text("data_path").notNull(), // Путь к снэпшоту данных
  metrics: json("metrics"), // Метрики качества данных
  createdAt: timestamp("created_at").defaultNow(),
  trainingComplete: boolean("training_complete").default(false),
  trainingMetrics: json("training_metrics"), // Результаты обучения на этих данных
});

// Типы категорий навыков
export const skillCategoryEnum = pgEnum('skill_category', ['programming', 'data', 'ml', 'soft-skills', 'domain-knowledge']);

// Уровни Skills DNA (таксономия Блума 2.0)
export const skillsDnaLevelEnum = pgEnum('skills_dna_level', ['awareness', 'knowledge', 'application', 'mastery', 'expertise']);

// Навыки и требования для курсов
export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: text("description"),
  category: skillCategoryEnum("category"), // Категория навыка
  parentSkillId: integer("parent_skill_id"), // Для иерархии навыков
  createdAt: timestamp("created_at").defaultNow(),
});

// В этой версии Drizzle мы не будем использовать relations API
// Вместо этого создадим простые ссылки между таблицами

// Типы для навыков будут определены ниже

// Уровни владения навыками пользователя
export const userSkills = pgTable("user_skills", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  skillId: integer("skill_id").notNull().references(() => skills.id),
  level: integer("level").default(0), // От 0 до 100 или другая шкала
  xp: integer("xp").default(0), // Опыт, накопленный в навыке
  lastAssessedAt: timestamp("last_assessed_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    userSkillIdx: uniqueIndex("user_skill_idx").on(table.userId, table.skillId),
  };
});

// Требования навыков для курсов
export const courseSkillRequirements = pgTable("course_skill_requirements", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id),
  skillId: integer("skill_id").notNull().references(() => skills.id),
  requiredLevel: integer("required_level").notNull(), // Минимальный уровень для курса
  importance: integer("importance").default(1), // Насколько важен навык: 1 - nice to have, 3 - critical
}, (table) => {
  return {
    courseSkillIdx: uniqueIndex("course_skill_idx").on(table.courseId, table.skillId),
  };
});

// Навыки, которые развиваются в ходе курса
export const courseSkillOutcomes = pgTable("course_skill_outcomes", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id),
  skillId: integer("skill_id").notNull().references(() => skills.id),
  levelGain: integer("level_gain").notNull(), // Сколько уровней даёт курс
}, (table) => {
  return {
    courseOutcomeIdx: uniqueIndex("course_outcome_idx").on(table.courseId, table.skillId),
  };
});

// Пробелы в знаниях пользователя (результаты Gap-анализа)
export const userSkillGaps = pgTable("user_skill_gaps", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  skillId: integer("skill_id").notNull().references(() => skills.id),
  currentLevel: integer("current_level").notNull(),
  desiredLevel: integer("desired_level").notNull(),
  gapSize: integer("gap_size").notNull(), // Разница между текущим и желаемым уровнем
  priority: integer("priority").default(1), // Приоритет для заполнения пробела (1-10)
  analysisDate: timestamp("analysis_date").defaultNow(),
}, (table) => {
  return {
    userGapIdx: uniqueIndex("user_gap_idx").on(table.userId, table.skillId),
  };
});

// ========== НОВЫЕ ТАБЛИЦЫ ДЛЯ SKILLS DNA И МИКРОУРОКОВ ==========

// Предварительное объявление таблицы для самоссылки
export const skillsDnaTable = pgTable("skills_dna", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: text("description"),
  category: skillCategoryEnum("category").notNull(), // Переиспользуем существующее перечисление категорий
  level: skillsDnaLevelEnum("level").notNull(), // Уровень по таксономии Блума 2.0
  parentId: integer("parent_id"), // Временно не указываем ссылку, добавим ее после
  behavioralIndicators: json("behavioral_indicators"), // Массив поведенческих индикаторов
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Определяем таблицу компетенций
export const skillsDna = skillsDnaTable;

// Примечание: Отношения будут реализованы через код вместо отношений Drizzle ORM
// Самоссылка (parent->child) обрабатывается через поле parentId

// Связь между существующими навыками и новыми компетенциями
export const skillToDnaMapping = pgTable("skill_to_dna_mapping", {
  id: serial("id").primaryKey(),
  skillId: integer("skill_id").notNull().references(() => skills.id),
  dnaId: integer("dna_id").notNull().references(() => skillsDna.id),
  weight: real("weight").default(1.0), // Сила связи между навыком и компетенцией (0-1)
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    skillDnaIdx: uniqueIndex("skill_dna_idx").on(table.skillId, table.dnaId),
  };
});

// Связь между уроками и компетенциями
export const lessonSkillsDna = pgTable("lesson_skills_dna", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull().references(() => lessons.id),
  dnaId: integer("dna_id").notNull().references(() => skillsDna.id),
  contributionLevel: real("contribution_level").default(1.0), // Насколько урок развивает эту компетенцию (0-1)
  learningOutcome: text("learning_outcome"), // Четкий результат обучения в формате SMART
  bloomLevel: skillsDnaLevelEnum("bloom_level").notNull(), // Уровень по таксономии Блума для этого результата
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    lessonDnaIdx: uniqueIndex("lesson_dna_idx").on(table.lessonId, table.dnaId),
  };
});

// Связь между модулями и компетенциями
export const moduleSkillsDna = pgTable("module_skills_dna", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").notNull().references(() => courseModules.id),
  dnaId: integer("dna_id").notNull().references(() => skillsDna.id),
  importance: integer("importance").default(1), // Важность компетенции для модуля: 1 - низкая, 3 - высокая
  bloomLevel: skillsDnaLevelEnum("bloom_level").notNull(), // Ожидаемый уровень освоения по таксономии Блума
  description: text("description"), // Описание как этот модуль развивает данную компетенцию
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    moduleDnaIdx: uniqueIndex("module_dna_idx").on(table.moduleId, table.dnaId),
  };
});

// Прогресс пользователя по компетенциям
export const userSkillsDnaProgress = pgTable("user_skills_dna_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  dnaId: integer("dna_id").notNull().references(() => skillsDna.id),
  currentLevel: skillsDnaLevelEnum("current_level").notNull(), // Текущий уровень освоения 
  targetLevel: skillsDnaLevelEnum("target_level"), // Целевой уровень освоения
  progress: integer("progress").default(0), // Прогресс в процентах (0-100)
  lastAssessmentDate: timestamp("last_assessment_date"), // Дата последней оценки
  nextAssessmentDate: timestamp("next_assessment_date"), // Дата следующей рекомендуемой оценки 
  assessmentHistory: json("assessment_history"), // История оценок
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    userDnaIdx: uniqueIndex("user_dna_idx").on(table.userId, table.dnaId),
  };
});

// Микро-структура урока
export const lessonStructure = pgTable("lesson_structure", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull().references(() => lessons.id).unique(),
  hook: text("hook"), // Вступительный элемент для привлечения внимания
  explanation: text("explanation"), // Основной обучающий контент
  demo: text("demo"), // Демонстрация применения знаний
  practice: json("practice"), // Интерактивные упражнения для закрепления
  reflection: json("reflection"), // Вопросы для самопроверки и закрепления
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Прогресс пользователя по структурным элементам урока
export const userLessonStructureProgress = pgTable("user_lesson_structure_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  lessonId: integer("lesson_id").notNull().references(() => lessons.id),
  hookCompleted: boolean("hook_completed").default(false),
  explanationCompleted: boolean("explanation_completed").default(false),
  demoCompleted: boolean("demo_completed").default(false),
  practiceCompleted: boolean("practice_completed").default(false),
  reflectionCompleted: boolean("reflection_completed").default(false),
  practiceScore: integer("practice_score").default(0), // Результат выполнения практического задания
  timeSpentSeconds: integer("time_spent_seconds").default(0), // Общее время, проведенное на уроке
  lastUpdatedAt: timestamp("last_updated_at").defaultNow(),
}, (table) => {
  return {
    userLessonStructureIdx: uniqueIndex("user_lesson_structure_idx").on(table.userId, table.lessonId),
  };
});

// Таблица событий пользователя для обучения
export const learningEvents = pgTable("learning_events", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  eventType: varchar("event_type", { length: 100 }).notNull(),
  entityType: entityTypeEnum("entity_type"),
  entityId: integer("entity_id"),
  timestamp: timestamp("timestamp").defaultNow(),
  data: json("data"), // Данные о событии
}, (table) => {
  return {
    userEventIdx: index("user_event_idx").on(table.userId, table.eventType),
    timestampIdx: index("timestamp_idx").on(table.timestamp),
  };
});

// Векторные эмбеддинги для содержимого и пользователей
export const contentEmbeddings = pgTable("content_embeddings", {
  id: serial("id").primaryKey(),
  entityType: entityTypeEnum("entity_type").notNull(),
  entityId: integer("entity_id").notNull(),
  embedding: json("embedding").notNull(), // Векторное представление контента
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    entityIdx: uniqueIndex("entity_embedding_idx").on(table.entityType, table.entityId),
  };
});

export const userEmbeddings = pgTable("user_embeddings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id).unique(),
  embedding: json("embedding").notNull(), // Векторное представление предпочтений пользователя
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Таблица для универсального логирования событий (event log с JSONB)
export const eventLogs = pgTable("event_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  eventType: varchar("event_type", { length: 100 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  data: json("data").notNull(), // JSONB данные о событии, максимально гибкая структура
}, (table) => {
  return {
    userEventTypeIdx: index("user_event_type_idx").on(table.userId, table.eventType),
    timestampIdx: index("event_timestamp_idx").on(table.timestamp),
  };
});

// Схемы для вставки данных для ML-компонентов
export const insertEventLogSchema = createInsertSchema(eventLogs).omit({
  id: true,
  timestamp: true,
});

export const insertFeatureFlagSchema = createInsertSchema(featureFlags).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserActivityLogSchema = createInsertSchema(userActivityLogs).omit({
  id: true,
  timestamp: true,
});

export const insertMlModelSchema = createInsertSchema(mlModels).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserRecommendationSchema = createInsertSchema(userRecommendations).omit({
  id: true,
  shown: true,
  clicked: true,
  createdAt: true,
});

export const insertLearningEventSchema = createInsertSchema(learningEvents).omit({
  id: true,
  timestamp: true,
});

// Типы для вставки данных для ML-компонентов
export type InsertFeatureFlag = z.infer<typeof insertFeatureFlagSchema>;
export type InsertUserActivityLog = z.infer<typeof insertUserActivityLogSchema>;
export type InsertMlModel = z.infer<typeof insertMlModelSchema>;
export type InsertUserRecommendation = z.infer<typeof insertUserRecommendationSchema>;
export type InsertLearningEvent = z.infer<typeof insertLearningEventSchema>;

// Схемы для вставки данных для Gap-анализа и навыков
export const insertSkillSchema = createInsertSchema(skills).omit({
  id: true,
  createdAt: true,
});

export const insertUserSkillSchema = createInsertSchema(userSkills).omit({
  id: true,
  lastAssessedAt: true,
  updatedAt: true,
});

export const insertCourseSkillRequirementSchema = createInsertSchema(courseSkillRequirements).omit({
  id: true,
});

export const insertCourseSkillOutcomeSchema = createInsertSchema(courseSkillOutcomes).omit({
  id: true,
});

export const insertUserSkillGapSchema = createInsertSchema(userSkillGaps).omit({
  id: true,
  analysisDate: true,
});

// Типы для вставки данных для Gap-анализа и навыков
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type InsertUserSkill = z.infer<typeof insertUserSkillSchema>;
export type InsertCourseSkillRequirement = z.infer<typeof insertCourseSkillRequirementSchema>;
export type InsertCourseSkillOutcome = z.infer<typeof insertCourseSkillOutcomeSchema>;
export type InsertUserSkillGap = z.infer<typeof insertUserSkillGapSchema>;

// Определение таблиц для S2 SKILL-PROBE (5-мин тесты)
export const skillProbeEnum = pgEnum('skill_probe_type', ['multiple_choice', 'coding', 'fill_blanks', 'matching', 'practical']);
export const skillProbeDifficultyEnum = pgEnum('skill_probe_difficulty', ['basic', 'intermediate', 'advanced', 'expert']);

// Таблица тестов Skill Probe
export const skillProbes = pgTable("skill_probes", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  skillId: integer("skill_id").references(() => skills.id), // Связь с таблицей навыков
  dnaId: integer("dna_id").references(() => skillsDna.id), // Связь с таблицей SkillsDNA
  probeType: skillProbeEnum("probe_type").notNull(),
  difficulty: skillProbeDifficultyEnum("difficulty").default("intermediate"),
  estimatedTimeMinutes: integer("estimated_time_minutes").default(5),
  passingScore: integer("passing_score").default(70), // Проходной балл (в процентах)
  questions: json("questions").notNull(), // JSON-массив с вопросами и ответами
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => {
  return {
    skillIdx: index("skill_probe_skill_idx").on(table.skillId),
    dnaIdx: index("skill_probe_dna_idx").on(table.dnaId),
  };
});

// Таблица результатов прохождения Skill Probe тестов
export const skillProbeResults = pgTable("skill_probe_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  probeId: integer("probe_id").notNull().references(() => skillProbes.id),
  score: integer("score").notNull(), // Процент правильных ответов
  passStatus: boolean("pass_status").notNull(), // Пройден или не пройден
  answers: json("answers"), // JSON с ответами пользователя
  startedAt: timestamp("started_at").notNull(),
  completedAt: timestamp("completed_at").notNull(),
  timeSpentSeconds: integer("time_spent_seconds"),
  skillLevelBefore: integer("skill_level_before"), // Уровень навыка до прохождения
  skillLevelAfter: integer("skill_level_after"), // Уровень навыка после прохождения
  feedback: text("feedback"), // Обратная связь от системы
}, (table) => {
  return {
    userProbeIdx: index("user_probe_idx").on(table.userId, table.probeId),
    completedAtIdx: index("probe_completed_at_idx").on(table.completedAt),
  };
});

// Таблица рекомендаций тестов по результатам
export const skillProbeRecommendations = pgTable("skill_probe_recommendations", {
  id: serial("id").primaryKey(),
  resultId: integer("result_id").notNull().references(() => skillProbeResults.id),
  userId: integer("user_id").notNull().references(() => users.id),
  recommendationType: varchar("recommendation_type", { length: 100 }).notNull(), // Тип рекомендации (курс, модуль, урок)
  entityId: integer("entity_id").notNull(), // ID рекомендуемой сущности
  reason: text("reason"), // Причина рекомендации
  priority: integer("priority").default(1), // Приоритет рекомендации
  createdAt: timestamp("created_at").defaultNow(),
  followed: boolean("followed").default(false), // Последовал ли пользователь рекомендации
});

// Схемы для вставки данных для Skill Probe
export const insertSkillProbeSchema = createInsertSchema(skillProbes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSkillProbeResultSchema = createInsertSchema(skillProbeResults).omit({
  id: true,
});

export const insertSkillProbeRecommendationSchema = createInsertSchema(skillProbeRecommendations).omit({
  id: true,
  createdAt: true,
});

// Типы для вставки данных Skill Probe
export type InsertSkillProbe = z.infer<typeof insertSkillProbeSchema>;
export type InsertSkillProbeResult = z.infer<typeof insertSkillProbeResultSchema>;
export type InsertSkillProbeRecommendation = z.infer<typeof insertSkillProbeRecommendationSchema>;

// Типы для выборки данных
export type User = typeof users.$inferSelect;
export type UserProfile = typeof userProfiles.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type CourseModule = typeof courseModules.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type LessonNote = typeof lessonNotes.$inferSelect;
export type Assignment = typeof assignments.$inferSelect;

export type InsertLessonNote = typeof lessonNotes.$inferInsert;
export type UserCourseProgress = typeof userCourseProgress.$inferSelect;
export type UserLessonProgress = typeof userLessonProgress.$inferSelect;
export type UserAssignmentResult = typeof userAssignmentResults.$inferSelect;
export type FeatureFlag = typeof featureFlags.$inferSelect;
export type UserActivityLog = typeof userActivityLogs.$inferSelect;
export type MlModel = typeof mlModels.$inferSelect;
export type UserRecommendation = typeof userRecommendations.$inferSelect;
export type MlDataSnapshot = typeof mlDataSnapshots.$inferSelect;
export type LearningEvent = typeof learningEvents.$inferSelect;
export type ContentEmbedding = typeof contentEmbeddings.$inferSelect;
export type UserEmbedding = typeof userEmbeddings.$inferSelect;
export type Skill = typeof skills.$inferSelect;
export type UserSkill = typeof userSkills.$inferSelect;
export type CourseSkillRequirement = typeof courseSkillRequirements.$inferSelect;
export type CourseSkillOutcome = typeof courseSkillOutcomes.$inferSelect;
export type UserSkillGap = typeof userSkillGaps.$inferSelect;
export type EventLog = typeof eventLogs.$inferSelect;
export type InsertEventLog = z.infer<typeof insertEventLogSchema>;
export type SkillProbe = typeof skillProbes.$inferSelect;
export type SkillProbeResult = typeof skillProbeResults.$inferSelect;
export type SkillProbeRecommendation = typeof skillProbeRecommendations.$inferSelect;

// ========== СХЕМЫ И ТИПЫ ДЛЯ SKILLS DNA И МИКРОУРОКОВ ==========

// Схемы для вставки данных Skills DNA
export const insertSkillsDnaSchema = createInsertSchema(skillsDna).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSkillToDnaMappingSchema = createInsertSchema(skillToDnaMapping).omit({
  id: true,
  createdAt: true,
});

export const insertLessonSkillsDnaSchema = createInsertSchema(lessonSkillsDna).omit({
  id: true,
  createdAt: true,
});

export const insertModuleSkillsDnaSchema = createInsertSchema(moduleSkillsDna).omit({
  id: true,
  createdAt: true,
});

export const insertUserSkillsDnaProgressSchema = createInsertSchema(userSkillsDnaProgress).omit({
  id: true,
  lastAssessmentDate: true,
  nextAssessmentDate: true,
  updatedAt: true,
});

export const insertLessonStructureSchema = createInsertSchema(lessonStructure).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserLessonStructureProgressSchema = createInsertSchema(userLessonStructureProgress).omit({
  id: true,
  lastUpdatedAt: true,
});

// Типы для вставки данных Skills DNA
export type InsertSkillsDna = z.infer<typeof insertSkillsDnaSchema>;
export type InsertSkillToDnaMapping = z.infer<typeof insertSkillToDnaMappingSchema>;
export type InsertLessonSkillsDna = z.infer<typeof insertLessonSkillsDnaSchema>;
export type InsertLessonStructure = z.infer<typeof insertLessonStructureSchema>;
export type InsertUserLessonStructureProgress = z.infer<typeof insertUserLessonStructureProgressSchema>;

// Типы для выборки данных Skills DNA
export type SkillsDna = typeof skillsDna.$inferSelect;
export type SkillToDnaMapping = typeof skillToDnaMapping.$inferSelect;
export type LessonSkillsDna = typeof lessonSkillsDna.$inferSelect;
export type ModuleSkillsDna = typeof moduleSkillsDna.$inferSelect;
export type UserSkillsDnaProgress = typeof userSkillsDnaProgress.$inferSelect;
export type LessonStructure = typeof lessonStructure.$inferSelect;
export type UserLessonStructureProgress = typeof userLessonStructureProgress.$inferSelect;

// Типы для вставки новых компонентов карты компетенций
export type InsertModuleSkillsDna = z.infer<typeof insertModuleSkillsDnaSchema>;
export type InsertUserSkillsDnaProgress = z.infer<typeof insertUserSkillsDnaProgressSchema>;
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
export const interestEnum = pgEnum('interest_area', ['machine-learning', 'neural-networks', 'data-science', 'computer-vision', 'nlp', 'robotics', 'other']);
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
  password: text("password").notNull(),
  displayName: varchar("display_name", { length: 255 }),
  email: varchar("email", { length: 255 }),
  avatarUrl: text("avatar_url"),
  role: userRoleEnum("role"),
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
});

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
  authorId: integer("author_id").references(() => users.id),
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

// Типы для вставки данных
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type InsertUserCourseProgress = z.infer<typeof insertUserCourseProgressSchema>;

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

// Схемы для вставки данных для ML-компонентов
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

// Типы для выборки данных
export type User = typeof users.$inferSelect;
export type UserProfile = typeof userProfiles.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type UserCourseProgress = typeof userCourseProgress.$inferSelect;
export type FeatureFlag = typeof featureFlags.$inferSelect;
export type UserActivityLog = typeof userActivityLogs.$inferSelect;
export type MlModel = typeof mlModels.$inferSelect;
export type UserRecommendation = typeof userRecommendations.$inferSelect;
export type MlDataSnapshot = typeof mlDataSnapshots.$inferSelect;
export type LearningEvent = typeof learningEvents.$inferSelect;
export type ContentEmbedding = typeof contentEmbeddings.$inferSelect;
export type UserEmbedding = typeof userEmbeddings.$inferSelect;
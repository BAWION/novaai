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

// Типы для выборки данных
export type User = typeof users.$inferSelect;
export type UserProfile = typeof userProfiles.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type UserCourseProgress = typeof userCourseProgress.$inferSelect;
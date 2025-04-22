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
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).pick({
  userId: true,
  role: true,
  pythonLevel: true,
  experience: true,
  interest: true,
  goal: true,
  recommendedTrack: true,
});

// Courses model
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  modules: integer("modules").notNull(),
  level: text("level").notNull(), // basic, practice, in-progress, upcoming
  color: text("color").notNull(), // primary, secondary, accent
});

export const insertCourseSchema = createInsertSchema(courses).pick({
  title: true,
  description: true,
  icon: true,
  modules: true,
  level: true,
  color: true,
});

// User course progress
export const userCourseProgress = pgTable("user_course_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  courseId: integer("course_id").notNull().references(() => courses.id),
  progress: integer("progress").notNull().default(0), // 0-100
  completedModules: json("completed_modules").$type<number[]>(),
  startedAt: timestamp("started_at").defaultNow(),
  lastAccessedAt: timestamp("last_accessed_at").defaultNow(),
});

export const insertUserCourseProgressSchema = createInsertSchema(userCourseProgress).pick({
  userId: true,
  courseId: true,
  progress: true,
  completedModules: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type UserCourseProgress = typeof userCourseProgress.$inferSelect;
export type InsertUserCourseProgress = z.infer<typeof insertUserCourseProgressSchema>;

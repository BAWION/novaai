import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  integer,
  serial,
  timestamp,
  index,
  varchar,
  real,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { 
  courses, 
  courseModules, 
  lessons, 
  assignments, 
  users,
  skillsDna,
  skillsDnaLevelEnum
} from "./schema";

// ========== ТАБЛИЦЫ ДЛЯ ИНТЕГРАЦИИ КУРСОВ И SKILLS DNA ==========

// Связь курсов с навыками Skills DNA
export const courseSkillsDnaMapping = pgTable("course_skills_dna_mapping", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id, { onDelete: "cascade" }),
  dnaId: integer("dna_id").notNull().references(() => skillsDna.id, { onDelete: "cascade" }),
  targetProgressGain: integer("target_progress_gain").notNull(), // Ожидаемый прирост навыка при завершении курса (0-100)
  importance: integer("importance").notNull().default(1), // Важность навыка для курса (1-5)
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    courseDnaIdx: uniqueIndex("course_dna_mapping_idx").on(table.courseId, table.dnaId),
  };
});

// Связь модулей с навыками Skills DNA
export const moduleSkillsDnaMapping = pgTable("module_skills_dna_mapping", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").notNull().references(() => courseModules.id, { onDelete: "cascade" }),
  dnaId: integer("dna_id").notNull().references(() => skillsDna.id, { onDelete: "cascade" }),
  progressContribution: integer("progress_contribution").notNull(), // Вклад модуля в общий прогресс навыка (0-100)
  bloomLevel: skillsDnaLevelEnum("bloom_level").notNull(), // Уровень по таксономии Блума для модуля
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    moduleDnaIdx: uniqueIndex("module_dna_mapping_idx").on(table.moduleId, table.dnaId),
  };
});

// Связь уроков с навыками Skills DNA (детальное влияние)
export const lessonSkillsDnaImpact = pgTable("lesson_skills_dna_impact", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull().references(() => lessons.id, { onDelete: "cascade" }),
  dnaId: integer("dna_id").notNull().references(() => skillsDna.id, { onDelete: "cascade" }),
  impactWeight: real("impact_weight").notNull().default(1.0), // Вес влияния урока на навык (0.1-2.0)
  progressPoints: integer("progress_points").notNull(), // Баллы прогресса за завершение урока
  bloomLevel: skillsDnaLevelEnum("bloom_level").notNull(), // Уровень освоения для данного урока
  learningOutcome: text("learning_outcome"), // Конкретный результат обучения
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    lessonDnaIdx: uniqueIndex("lesson_dna_impact_idx").on(table.lessonId, table.dnaId),
  };
});

// Связь заданий с навыками Skills DNA
export const assignmentSkillsDnaImpact = pgTable("assignment_skills_dna_impact", {
  id: serial("id").primaryKey(),
  assignmentId: integer("assignment_id").notNull().references(() => assignments.id, { onDelete: "cascade" }),
  dnaId: integer("dna_id").notNull().references(() => skillsDna.id, { onDelete: "cascade" }),
  maxProgressPoints: integer("max_progress_points").notNull(), // Максимальные баллы прогресса за идеальное выполнение
  minRequiredScore: integer("min_required_score").notNull().default(60), // Минимальный процент для засчитывания прогресса
  bloomLevel: skillsDnaLevelEnum("bloom_level").notNull(), // Уровень таксономии Блума для задания
  skillApplication: text("skill_application"), // Описание применения навыка в задании
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    assignmentDnaIdx: uniqueIndex("assignment_dna_impact_idx").on(table.assignmentId, table.dnaId),
  };
});

// История обновлений Skills DNA от курсов
export const skillsDnaProgressHistory = pgTable("skills_dna_progress_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  dnaId: integer("dna_id").notNull().references(() => skillsDna.id, { onDelete: "cascade" }),
  progressChange: integer("progress_change").notNull(), // Изменение прогресса (+/-)
  previousProgress: integer("previous_progress").notNull(),
  newProgress: integer("new_progress").notNull(),
  source: varchar("source", { length: 50 }).notNull(), // lesson_completion, assignment_completion, course_completion
  sourceId: integer("source_id"), // ID урока, задания или курса
  description: text("description"), // Описание изменения
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => {
  return {
    userDnaHistoryIdx: index("user_dna_history_idx").on(table.userId, table.dnaId, table.createdAt),
  };
});

// ========== СХЕМЫ ДЛЯ ВСТАВКИ ДАННЫХ ==========

export const insertCourseSkillsDnaMappingSchema = createInsertSchema(courseSkillsDnaMapping).omit({
  id: true,
  createdAt: true,
});

export const insertModuleSkillsDnaMappingSchema = createInsertSchema(moduleSkillsDnaMapping).omit({
  id: true,
  createdAt: true,
});

export const insertLessonSkillsDnaImpactSchema = createInsertSchema(lessonSkillsDnaImpact).omit({
  id: true,
  createdAt: true,
});

export const insertAssignmentSkillsDnaImpactSchema = createInsertSchema(assignmentSkillsDnaImpact).omit({
  id: true,
  createdAt: true,
});

export const insertSkillsDnaProgressHistorySchema = createInsertSchema(skillsDnaProgressHistory).omit({
  id: true,
  createdAt: true,
});

// ========== ТИПЫ ДЛЯ TYPESCRIPT ==========

export type InsertCourseSkillsDnaMapping = z.infer<typeof insertCourseSkillsDnaMappingSchema>;
export type InsertModuleSkillsDnaMapping = z.infer<typeof insertModuleSkillsDnaMappingSchema>;
export type InsertLessonSkillsDnaImpact = z.infer<typeof insertLessonSkillsDnaImpactSchema>;
export type InsertAssignmentSkillsDnaImpact = z.infer<typeof insertAssignmentSkillsDnaImpactSchema>;
export type InsertSkillsDnaProgressHistory = z.infer<typeof insertSkillsDnaProgressHistorySchema>;

export type CourseSkillsDnaMapping = typeof courseSkillsDnaMapping.$inferSelect;
export type ModuleSkillsDnaMapping = typeof moduleSkillsDnaMapping.$inferSelect;
export type LessonSkillsDnaImpact = typeof lessonSkillsDnaImpact.$inferSelect;
export type AssignmentSkillsDnaImpact = typeof assignmentSkillsDnaImpact.$inferSelect;
export type SkillsDnaProgressHistory = typeof skillsDnaProgressHistory.$inferSelect;

// ========== ИНТЕРФЕЙСЫ ДЛЯ API ==========

export interface CourseWithSkillsMapping {
  courseId: number;
  skillsMappings: {
    dnaId: number;
    targetProgressGain: number;
    importance: number;
  }[];
}

export interface LessonWithSkillsImpact {
  lessonId: number;
  skillsImpacts: {
    dnaId: number;
    impactWeight: number;
    progressPoints: number;
    bloomLevel: 'awareness' | 'knowledge' | 'application' | 'mastery' | 'expertise';
    learningOutcome?: string;
  }[];
}

export interface SkillProgressUpdate {
  userId: number;
  dnaId: number;
  progressChange: number;
  source: 'lesson_completion' | 'assignment_completion' | 'course_completion';
  sourceId: number;
  description?: string;
}
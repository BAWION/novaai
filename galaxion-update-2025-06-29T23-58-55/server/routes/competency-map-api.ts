import { NextFunction, Request, Response, Router } from "express";
import { db } from "../db";
import {
  skillsDna,
  moduleSkillsDna,
  userSkillsDnaProgress,
  lessonSkillsDna,
  InsertSkillsDna,
  InsertModuleSkillsDna,
  InsertUserSkillsDnaProgress,
  courses,
  courseModules,
  lessons,
  users
} from "@shared/schema";
import { and, eq, isNull, or } from "drizzle-orm";
import { z } from "zod";

const competencyMapRouter = Router();

// Получить все компетенции (skills_dna)
competencyMapRouter.get("/", async (req: Request, res: Response) => {
  try {
    const allCompetencies = await db
      .select()
      .from(skillsDna)
      .orderBy(skillsDna.id);
    
    res.json(allCompetencies);
  } catch (error) {
    console.error("Error getting competencies:", error);
    res.status(500).json({ 
      message: "Ошибка при получении списка компетенций"
    });
  }
});

// Получить компетенцию по ID
competencyMapRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Некорректный ID компетенции" });
    }
    
    const [competency] = await db
      .select()
      .from(skillsDna)
      .where(eq(skillsDna.id, id));
    
    if (!competency) {
      return res.status(404).json({ message: "Компетенция не найдена" });
    }
    
    // Получаем связанные дочерние компетенции (если есть)
    const childCompetencies = await db
      .select()
      .from(skillsDna)
      .where(eq(skillsDna.parentId, id));
    
    // Формируем полный результат с дочерними компетенциями
    const result = {
      ...competency,
      childCompetencies: childCompetencies.length > 0 ? childCompetencies : []
    };
    
    res.json(result);
  } catch (error) {
    console.error("Error getting competency:", error);
    res.status(500).json({ 
      message: "Ошибка при получении информации о компетенции"
    });
  }
});

// Создать новую компетенцию
competencyMapRouter.post("/", async (req: Request, res: Response) => {
  try {
    const competencyData: InsertSkillsDna = req.body;
    
    const [createdCompetency] = await db
      .insert(skillsDna)
      .values(competencyData)
      .returning();
    
    res.status(201).json(createdCompetency);
  } catch (error) {
    console.error("Error creating competency:", error);
    res.status(500).json({ 
      message: "Ошибка при создании компетенции" 
    });
  }
});

// Обновить компетенцию
competencyMapRouter.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Некорректный ID компетенции" });
    }
    
    const competencyData = req.body;
    
    // Проверяем существование компетенции
    const [existingCompetency] = await db
      .select()
      .from(skillsDna)
      .where(eq(skillsDna.id, id));
    
    if (!existingCompetency) {
      return res.status(404).json({ message: "Компетенция не найдена" });
    }
    
    // Обновляем компетенцию
    const [updatedCompetency] = await db
      .update(skillsDna)
      .set({
        ...competencyData,
        updatedAt: new Date()
      })
      .where(eq(skillsDna.id, id))
      .returning();
    
    res.json(updatedCompetency);
  } catch (error) {
    console.error("Error updating competency:", error);
    res.status(500).json({ 
      message: "Ошибка при обновлении компетенции" 
    });
  }
});

// Получить компетенции для курса
competencyMapRouter.get("/course/:courseId", async (req: Request, res: Response) => {
  try {
    const courseId = parseInt(req.params.courseId);
    if (isNaN(courseId)) {
      return res.status(400).json({ message: "Некорректный ID курса" });
    }
    
    // Проверяем существование курса
    const [course] = await db
      .select()
      .from(courses)
      .where(eq(courses.id, courseId));
    
    if (!course) {
      return res.status(404).json({ message: "Курс не найден" });
    }
    
    // Получаем все модули курса
    const modules = await db
      .select()
      .from(courseModules)
      .where(eq(courseModules.courseId, courseId))
      .orderBy(courseModules.orderIndex);
    
    const moduleIds = modules.map(module => module.id);
    
    // Получаем компетенции для модулей курса
    const moduleCompetencies = await db
      .select({
        moduleId: moduleSkillsDna.moduleId,
        competencyId: moduleSkillsDna.dnaId,
        importance: moduleSkillsDna.importance,
        bloomLevel: moduleSkillsDna.bloomLevel,
        description: moduleSkillsDna.description,
        competencyName: skillsDna.name,
        competencyDescription: skillsDna.description,
        competencyCategory: skillsDna.category,
        competencyLevel: skillsDna.level,
        behavioralIndicators: skillsDna.behavioralIndicators
      })
      .from(moduleSkillsDna)
      .innerJoin(skillsDna, eq(moduleSkillsDna.dnaId, skillsDna.id))
      .where(
        // Если moduleIds пустой (нет модулей), выборка будет пустой
        moduleIds.length > 0 
          ? or(...moduleIds.map(id => eq(moduleSkillsDna.moduleId, id)))
          : eq(moduleSkillsDna.id, -1) // Заведомо ложное условие
      );
    
    // Группируем компетенции по модулям
    const result = modules.map(module => {
      const moduleWithCompetencies = {
        ...module,
        competencies: moduleCompetencies
          .filter(mc => mc.moduleId === module.id)
          .map(mc => ({
            id: mc.competencyId,
            name: mc.competencyName,
            description: mc.competencyDescription,
            category: mc.competencyCategory,
            level: mc.competencyLevel,
            importance: mc.importance,
            bloomLevel: mc.bloomLevel,
            moduleDescription: mc.description,
            behavioralIndicators: mc.behavioralIndicators
          }))
      };
      return moduleWithCompetencies;
    });
    
    res.json(result);
  } catch (error) {
    console.error("Error getting course competencies:", error);
    res.status(500).json({ 
      message: "Ошибка при получении компетенций курса" 
    });
  }
});

// Получить компетенции для модуля
competencyMapRouter.get("/module/:moduleId", async (req: Request, res: Response) => {
  try {
    const moduleId = parseInt(req.params.moduleId);
    if (isNaN(moduleId)) {
      return res.status(400).json({ message: "Некорректный ID модуля" });
    }
    
    // Проверяем существование модуля
    const [module] = await db
      .select()
      .from(courseModules)
      .where(eq(courseModules.id, moduleId));
    
    if (!module) {
      return res.status(404).json({ message: "Модуль не найден" });
    }
    
    // Получаем компетенции для модуля
    const moduleCompetencies = await db
      .select({
        id: skillsDna.id,
        name: skillsDna.name,
        description: skillsDna.description,
        category: skillsDna.category,
        level: skillsDna.level,
        parentId: skillsDna.parentId,
        importance: moduleSkillsDna.importance,
        bloomLevel: moduleSkillsDna.bloomLevel,
        moduleDescription: moduleSkillsDna.description,
        behavioralIndicators: skillsDna.behavioralIndicators
      })
      .from(moduleSkillsDna)
      .innerJoin(skillsDna, eq(moduleSkillsDna.dnaId, skillsDna.id))
      .where(eq(moduleSkillsDna.moduleId, moduleId));
    
    res.json(moduleCompetencies);
  } catch (error) {
    console.error("Error getting module competencies:", error);
    res.status(500).json({ 
      message: "Ошибка при получении компетенций модуля" 
    });
  }
});

// Добавить компетенцию к модулю
competencyMapRouter.post("/module/:moduleId/competency", async (req: Request, res: Response) => {
  try {
    const moduleId = parseInt(req.params.moduleId);
    if (isNaN(moduleId)) {
      return res.status(400).json({ message: "Некорректный ID модуля" });
    }
    
    const { dnaId, importance, bloomLevel, description } = req.body;
    
    // Валидация входных данных
    if (!dnaId || isNaN(parseInt(dnaId))) {
      return res.status(400).json({ message: "Некорректный ID компетенции" });
    }
    
    // Проверяем существование модуля и компетенции
    const [module] = await db
      .select()
      .from(courseModules)
      .where(eq(courseModules.id, moduleId));
    
    if (!module) {
      return res.status(404).json({ message: "Модуль не найден" });
    }
    
    const [competency] = await db
      .select()
      .from(skillsDna)
      .where(eq(skillsDna.id, parseInt(dnaId)));
    
    if (!competency) {
      return res.status(404).json({ message: "Компетенция не найдена" });
    }
    
    // Проверяем, не добавлена ли уже эта компетенция к модулю
    const [existingMapping] = await db
      .select()
      .from(moduleSkillsDna)
      .where(
        and(
          eq(moduleSkillsDna.moduleId, moduleId),
          eq(moduleSkillsDna.dnaId, parseInt(dnaId))
        )
      );
    
    if (existingMapping) {
      return res.status(409).json({ 
        message: "Эта компетенция уже добавлена к модулю" 
      });
    }
    
    // Добавляем компетенцию к модулю
    const [created] = await db
      .insert(moduleSkillsDna)
      .values({
        moduleId,
        dnaId: parseInt(dnaId),
        importance: importance || 1,
        bloomLevel: bloomLevel || "knowledge",
        description
      })
      .returning();
    
    res.status(201).json(created);
  } catch (error) {
    console.error("Error adding competency to module:", error);
    res.status(500).json({ 
      message: "Ошибка при добавлении компетенции к модулю" 
    });
  }
});

// Получить прогресс пользователя по компетенциям
competencyMapRouter.get("/user/:userId/progress", async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Некорректный ID пользователя" });
    }
    
    // Проверяем существование пользователя
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));
    
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    
    // Получаем прогресс пользователя по компетенциям
    const userProgress = await db
      .select({
        id: userSkillsDnaProgress.id,
        userId: userSkillsDnaProgress.userId,
        dnaId: userSkillsDnaProgress.dnaId,
        currentLevel: userSkillsDnaProgress.currentLevel,
        targetLevel: userSkillsDnaProgress.targetLevel,
        progress: userSkillsDnaProgress.progress,
        lastAssessmentDate: userSkillsDnaProgress.lastAssessmentDate,
        competencyName: skillsDna.name,
        competencyDescription: skillsDna.description,
        competencyCategory: skillsDna.category,
        competencyLevel: skillsDna.level,
        behavioralIndicators: skillsDna.behavioralIndicators
      })
      .from(userSkillsDnaProgress)
      .innerJoin(skillsDna, eq(userSkillsDnaProgress.dnaId, skillsDna.id))
      .where(eq(userSkillsDnaProgress.userId, userId));
    
    res.json(userProgress);
  } catch (error) {
    console.error("Error getting user competency progress:", error);
    res.status(500).json({ 
      message: "Ошибка при получении прогресса пользователя по компетенциям" 
    });
  }
});

// Обновить прогресс пользователя по компетенции
competencyMapRouter.post("/user/:userId/progress", async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Некорректный ID пользователя" });
    }
    
    const { dnaId, currentLevel, targetLevel, progress } = req.body;
    
    // Валидация входных данных
    if (!dnaId || isNaN(parseInt(dnaId))) {
      return res.status(400).json({ message: "Некорректный ID компетенции" });
    }
    
    // Проверяем существование пользователя и компетенции
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));
    
    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }
    
    const [competency] = await db
      .select()
      .from(skillsDna)
      .where(eq(skillsDna.id, parseInt(dnaId)));
    
    if (!competency) {
      return res.status(404).json({ message: "Компетенция не найдена" });
    }
    
    // Проверяем, существует ли уже запись о прогрессе
    const [existingProgress] = await db
      .select()
      .from(userSkillsDnaProgress)
      .where(
        and(
          eq(userSkillsDnaProgress.userId, userId),
          eq(userSkillsDnaProgress.dnaId, parseInt(dnaId))
        )
      );
    
    if (existingProgress) {
      // Обновляем существующий прогресс
      const [updated] = await db
        .update(userSkillsDnaProgress)
        .set({
          currentLevel: currentLevel || existingProgress.currentLevel,
          targetLevel: targetLevel || existingProgress.targetLevel,
          progress: progress || existingProgress.progress,
          updatedAt: new Date()
        })
        .where(eq(userSkillsDnaProgress.id, existingProgress.id))
        .returning();
      
      res.json(updated);
    } else {
      // Создаем новую запись о прогрессе
      const [created] = await db
        .insert(userSkillsDnaProgress)
        .values({
          userId,
          dnaId: parseInt(dnaId),
          currentLevel: currentLevel || "awareness", // По умолчанию начальный уровень
          targetLevel: targetLevel,
          progress: progress || 0
        })
        .returning();
      
      res.status(201).json(created);
    }
  } catch (error) {
    console.error("Error updating user competency progress:", error);
    res.status(500).json({ 
      message: "Ошибка при обновлении прогресса пользователя по компетенции" 
    });
  }
});

// Получить карту компетенций всего курса (со связями между компетенциями)
competencyMapRouter.get("/course/:courseId/map", async (req: Request, res: Response) => {
  try {
    const courseId = parseInt(req.params.courseId);
    if (isNaN(courseId)) {
      return res.status(400).json({ message: "Некорректный ID курса" });
    }
    
    // Проверяем существование курса
    const [course] = await db
      .select()
      .from(courses)
      .where(eq(courses.id, courseId));
    
    if (!course) {
      return res.status(404).json({ message: "Курс не найден" });
    }
    
    // Получаем все модули курса
    const modules = await db
      .select()
      .from(courseModules)
      .where(eq(courseModules.courseId, courseId))
      .orderBy(courseModules.orderIndex);
    
    const moduleIds = modules.map(module => module.id);
    
    // Получаем все компетенции модулей курса
    const moduleCompetencies = await db
      .select({
        moduleId: moduleSkillsDna.moduleId,
        dnaId: moduleSkillsDna.dnaId
      })
      .from(moduleSkillsDna)
      .where(
        moduleIds.length > 0 
          ? or(...moduleIds.map(id => eq(moduleSkillsDna.moduleId, id)))
          : eq(moduleSkillsDna.id, -1)
      );
    
    // Получаем уникальные ID компетенций для курса
    const competencyIds = Array.from(new Set(moduleCompetencies.map(mc => mc.dnaId)));
    
    // Получаем все компетенции курса с информацией о родительских компетенциях
    const competencies = await db
      .select()
      .from(skillsDna)
      .where(
        competencyIds.length > 0 
          ? or(...competencyIds.map(id => eq(skillsDna.id, id)))
          : eq(skillsDna.id, -1)
      );
    
    // Создаем карту компетенций с иерархией
    const competencyMap = {
      course: {
        id: course.id,
        title: course.title,
        description: course.description
      },
      modules: modules.map(module => ({
        id: module.id,
        title: module.title,
        description: module.description,
        orderIndex: module.orderIndex,
        competencyIds: moduleCompetencies
          .filter(mc => mc.moduleId === module.id)
          .map(mc => mc.dnaId)
      })),
      competencies: competencies.map(comp => ({
        id: comp.id,
        name: comp.name,
        description: comp.description,
        category: comp.category,
        level: comp.level,
        parentId: comp.parentId,
        behavioralIndicators: comp.behavioralIndicators,
        children: competencies
          .filter(child => child.parentId === comp.id)
          .map(child => child.id)
      }))
    };
    
    res.json(competencyMap);
  } catch (error) {
    console.error("Error getting course competency map:", error);
    res.status(500).json({ 
      message: "Ошибка при получении карты компетенций курса" 
    });
  }
});

export default competencyMapRouter;

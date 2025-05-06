import { Router } from "express";
import { db } from "../db";
import { storage } from "../storage";
import { 
  skillsDna, 
  skillToDnaMapping, 
  lessonSkillsDna,
  insertSkillsDnaSchema, 
  insertSkillToDnaMappingSchema, 
  insertLessonSkillsDnaSchema 
} from "@shared/schema";
import { z } from "zod";
import { eq, and } from "drizzle-orm";

// Middleware для авторизации
const authMiddleware = (req: any, res: any, next: any) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

// Middleware для проверки роли администратора/учителя
const teacherAuthMiddleware = (req: any, res: any, next: any) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  // Проверить, что пользователь имеет роль учителя или администратора
  // В реальном приложении здесь должна быть более сложная проверка ролей
  // Но для прототипа используем простую проверку
  if (req.session.user.id === 999) {
    return next();
  }
  
  // Получаем профиль пользователя и проверяем его роль
  storage.getUserProfile(req.session.user.id)
    .then(profile => {
      if (profile && (profile.role === "teacher" || profile.role === "admin")) {
        next();
      } else {
        res.status(403).json({ message: "У вас нет прав для выполнения этой операции" });
      }
    })
    .catch(error => {
      console.error("Error checking user role:", error);
      res.status(500).json({ message: "Ошибка при проверке прав доступа" });
    });
};

// Создаем маршрутизатор
const skillsDnaRouter = Router();

// ENDPOINTS FOR SKILLS DNA

// Получить все компетенции (Skills DNA)
skillsDnaRouter.get("/skills-dna", async (req, res) => {
  try {
    const allSkillsDna = await db.select().from(skillsDna).orderBy(skillsDna.level, skillsDna.name);
    res.json(allSkillsDna);
  } catch (error) {
    console.error("Error getting skills DNA:", error);
    res.status(500).json({ message: "Failed to get skills DNA" });
  }
});

// Получить компетенцию по ID
skillsDnaRouter.get("/skills-dna/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid skill DNA ID" });
    }
    
    const skills = await db.select().from(skillsDna).where(eq(skillsDna.id, id));
    const skill = skills[0];
    
    if (!skill) {
      return res.status(404).json({ message: "Skill DNA not found" });
    }
    
    res.json(skill);
  } catch (error) {
    console.error("Error getting skill DNA:", error);
    res.status(500).json({ message: "Failed to get skill DNA" });
  }
});

// Создать новую компетенцию (Skills DNA)
skillsDnaRouter.post("/skills-dna", teacherAuthMiddleware, async (req, res) => {
  try {
    const validationResult = insertSkillsDnaSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        message: "Invalid skill DNA data",
        errors: validationResult.error.errors
      });
    }
    
    const [newSkillDna] = await db.insert(skillsDna).values(validationResult.data).returning();
    res.status(201).json(newSkillDna);
  } catch (error) {
    console.error("Error creating skill DNA:", error);
    res.status(500).json({ message: "Failed to create skill DNA" });
  }
});

// Обновить компетенцию по ID
skillsDnaRouter.put("/skills-dna/:id", teacherAuthMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid skill DNA ID" });
    }
    
    const validationResult = insertSkillsDnaSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        message: "Invalid skill DNA data",
        errors: validationResult.error.errors
      });
    }
    
    const [updatedSkill] = await db
      .update(skillsDna)
      .set(validationResult.data)
      .where(eq(skillsDna.id, id))
      .returning();
    
    if (!updatedSkill) {
      return res.status(404).json({ message: "Skill DNA not found" });
    }
    
    res.json(updatedSkill);
  } catch (error) {
    console.error("Error updating skill DNA:", error);
    res.status(500).json({ message: "Failed to update skill DNA" });
  }
});

// Удалить компетенцию по ID
skillsDnaRouter.delete("/skills-dna/:id", teacherAuthMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid skill DNA ID" });
    }
    
    // Проверяем, есть ли связанные записи
    const mappings = await db.select().from(skillToDnaMapping).where(eq(skillToDnaMapping.dnaId, id));
    const lessons = await db.select().from(lessonSkillsDna).where(eq(lessonSkillsDna.dnaId, id));
    
    if (mappings.length > 0 || lessons.length > 0) {
      return res.status(400).json({ 
        message: "Cannot delete skill DNA with existing mappings. Remove all relationships first.",
        mappingsCount: mappings.length,
        lessonsCount: lessons.length
      });
    }
    
    // Удаляем компетенцию
    const [deletedSkill] = await db
      .delete(skillsDna)
      .where(eq(skillsDna.id, id))
      .returning();
    
    if (!deletedSkill) {
      return res.status(404).json({ message: "Skill DNA not found" });
    }
    
    res.json({ message: "Skill DNA deleted successfully", id });
  } catch (error) {
    console.error("Error deleting skill DNA:", error);
    res.status(500).json({ message: "Failed to delete skill DNA" });
  }
});

// ENDPOINTS FOR SKILL TO DNA MAPPINGS

// Получить все связи между навыками и компетенциями
skillsDnaRouter.get("/skill-dna-mappings", async (req, res) => {
  try {
    const mappings = await db.select().from(skillToDnaMapping);
    res.json(mappings);
  } catch (error) {
    console.error("Error getting skill to DNA mappings:", error);
    res.status(500).json({ message: "Failed to get skill to DNA mappings" });
  }
});

// Получить связи для конкретного навыка
skillsDnaRouter.get("/skills/:skillId/dna-mappings", async (req, res) => {
  try {
    const skillId = parseInt(req.params.skillId);
    if (isNaN(skillId)) {
      return res.status(400).json({ message: "Invalid skill ID" });
    }
    
    const mappings = await db
      .select()
      .from(skillToDnaMapping)
      .where(eq(skillToDnaMapping.skillId, skillId));
    
    res.json(mappings);
  } catch (error) {
    console.error("Error getting skill to DNA mappings:", error);
    res.status(500).json({ message: "Failed to get skill to DNA mappings" });
  }
});

// Создать связь между навыком и компетенцией
skillsDnaRouter.post("/skill-dna-mappings", teacherAuthMiddleware, async (req, res) => {
  try {
    const validationResult = insertSkillToDnaMappingSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        message: "Invalid skill to DNA mapping data",
        errors: validationResult.error.errors
      });
    }
    
    // Проверяем, существует ли уже такая связь
    const { skillId, dnaId } = validationResult.data;
    const existing = await db
      .select()
      .from(skillToDnaMapping)
      .where(and(
        eq(skillToDnaMapping.skillId, skillId),
        eq(skillToDnaMapping.dnaId, dnaId)
      ));
    
    if (existing.length > 0) {
      return res.status(409).json({ message: "This mapping already exists" });
    }
    
    const [newMapping] = await db.insert(skillToDnaMapping).values(validationResult.data).returning();
    res.status(201).json(newMapping);
  } catch (error) {
    console.error("Error creating skill to DNA mapping:", error);
    res.status(500).json({ message: "Failed to create skill to DNA mapping" });
  }
});

// Удалить связь между навыком и компетенцией
skillsDnaRouter.delete("/skill-dna-mappings/:id", teacherAuthMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid mapping ID" });
    }
    
    const [deletedMapping] = await db
      .delete(skillToDnaMapping)
      .where(eq(skillToDnaMapping.id, id))
      .returning();
    
    if (!deletedMapping) {
      return res.status(404).json({ message: "Mapping not found" });
    }
    
    res.json({ message: "Mapping deleted successfully", id });
  } catch (error) {
    console.error("Error deleting skill to DNA mapping:", error);
    res.status(500).json({ message: "Failed to delete skill to DNA mapping" });
  }
});

// ENDPOINTS FOR LESSON SKILLS DNA

// Получить все связи между уроками и компетенциями
skillsDnaRouter.get("/lesson-skills-dna", async (req, res) => {
  try {
    const lessonSkills = await db.select().from(lessonSkillsDna);
    res.json(lessonSkills);
  } catch (error) {
    console.error("Error getting lesson skills DNA:", error);
    res.status(500).json({ message: "Failed to get lesson skills DNA" });
  }
});

// Получить компетенции для конкретного урока
skillsDnaRouter.get("/lessons/:lessonId/skills-dna", async (req, res) => {
  try {
    const lessonId = parseInt(req.params.lessonId);
    if (isNaN(lessonId)) {
      return res.status(400).json({ message: "Invalid lesson ID" });
    }
    
    const lessonSkills = await db
      .select()
      .from(lessonSkillsDna)
      .where(eq(lessonSkillsDna.lessonId, lessonId));
    
    res.json(lessonSkills);
  } catch (error) {
    console.error("Error getting lesson skills DNA:", error);
    res.status(500).json({ message: "Failed to get lesson skills DNA" });
  }
});

// Создать связь между уроком и компетенцией
skillsDnaRouter.post("/lesson-skills-dna", teacherAuthMiddleware, async (req, res) => {
  try {
    const validationResult = insertLessonSkillsDnaSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        message: "Invalid lesson skills DNA data",
        errors: validationResult.error.errors
      });
    }
    
    // Проверяем, существует ли уже такая связь
    const { lessonId, dnaId } = validationResult.data;
    const existing = await db
      .select()
      .from(lessonSkillsDna)
      .where(and(
        eq(lessonSkillsDna.lessonId, lessonId),
        eq(lessonSkillsDna.dnaId, dnaId)
      ));
    
    if (existing.length > 0) {
      return res.status(409).json({ message: "This lesson-skill DNA mapping already exists" });
    }
    
    const [newLessonSkill] = await db.insert(lessonSkillsDna).values(validationResult.data).returning();
    res.status(201).json(newLessonSkill);
  } catch (error) {
    console.error("Error creating lesson skills DNA:", error);
    res.status(500).json({ message: "Failed to create lesson skills DNA" });
  }
});

// Обновить связь между уроком и компетенцией
skillsDnaRouter.put("/lesson-skills-dna/:id", teacherAuthMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid lesson skills DNA ID" });
    }
    
    const validationResult = insertLessonSkillsDnaSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        message: "Invalid lesson skills DNA data",
        errors: validationResult.error.errors
      });
    }
    
    const [updatedLessonSkill] = await db
      .update(lessonSkillsDna)
      .set(validationResult.data)
      .where(eq(lessonSkillsDna.id, id))
      .returning();
    
    if (!updatedLessonSkill) {
      return res.status(404).json({ message: "Lesson skills DNA not found" });
    }
    
    res.json(updatedLessonSkill);
  } catch (error) {
    console.error("Error updating lesson skills DNA:", error);
    res.status(500).json({ message: "Failed to update lesson skills DNA" });
  }
});

// Удалить связь между уроком и компетенцией
skillsDnaRouter.delete("/lesson-skills-dna/:id", teacherAuthMiddleware, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid lesson skills DNA ID" });
    }
    
    const [deletedLessonSkill] = await db
      .delete(lessonSkillsDna)
      .where(eq(lessonSkillsDna.id, id))
      .returning();
    
    if (!deletedLessonSkill) {
      return res.status(404).json({ message: "Lesson skills DNA not found" });
    }
    
    res.json({ message: "Lesson skills DNA deleted successfully", id });
  } catch (error) {
    console.error("Error deleting lesson skills DNA:", error);
    res.status(500).json({ message: "Failed to delete lesson skills DNA" });
  }
});

export default skillsDnaRouter;
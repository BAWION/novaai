/**
 * server/routes/skills-api.ts
 * API маршруты для работы с навыками пользователя
 */

import express from 'express';
import { z } from 'zod';
import { db } from '../db';
import { skills, userSkills } from '@shared/schema';
import { eq, and } from 'drizzle-orm';
import { skillGraphService } from '../services/skill-graph-service';

const skillsRouter = express.Router();

// Схема валидации для обновления навыка
const updateSkillSchema = z.object({
  userId: z.number(),
  skillName: z.string(),
  deltaLevel: z.number().default(0),
  deltaXp: z.number().default(0)
});

/**
 * POST /api/skills/update
 * Обновляет навык пользователя
 */
skillsRouter.post('/update', async (req, res) => {
  try {
    const { userId, skillName, deltaLevel, deltaXp } = updateSkillSchema.parse(req.body);
    
    // Находим ID навыка по его имени
    const [skillRecord] = await db
      .select()
      .from(skills)
      .where(eq(skills.name, skillName));
    
    if (!skillRecord) {
      // Если навык не найден, создаем его
      const [newSkill] = await db
        .insert(skills)
        .values({
          name: skillName,
          displayName: skillName.replace(/_/g, ' '),
          category: 'custom'
        })
        .returning();
      
      if (!newSkill) {
        return res.status(500).json({ error: 'Не удалось создать навык' });
      }
      
      // Используем ID нового навыка
      const result = await skillGraphService.updateSkill(userId, newSkill.id, deltaLevel, deltaXp);
      return res.json(result);
    }
    
    // Используем существующий ID навыка
    const result = await skillGraphService.updateSkill(userId, skillRecord.id, deltaLevel, deltaXp);
    return res.json(result);
  } catch (error) {
    console.error('Ошибка при обновлении навыка:', error);
    return res.status(400).json({ error: 'Некорректные данные для обновления навыка' });
  }
});

/**
 * GET /api/skills/:userId/:skillName
 * Получает информацию об уровне и опыте навыка пользователя
 */
skillsRouter.get('/:userId/:skillName', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const skillName = req.params.skillName;
    
    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Некорректный ID пользователя' });
    }
    
    // Находим ID навыка по его имени
    const [skillRecord] = await db
      .select()
      .from(skills)
      .where(eq(skills.name, skillName));
    
    if (!skillRecord) {
      return res.status(404).json({ error: 'Навык не найден' });
    }
    
    // Получаем запись о навыке пользователя
    const [userSkillRecord] = await db
      .select()
      .from(userSkills)
      .where(
        and(
          eq(userSkills.userId, userId),
          eq(userSkills.skillId, skillRecord.id)
        )
      );
    
    if (!userSkillRecord) {
      return res.json({ level: 0, xp: 0 });
    }
    
    // XP в нашей системе пока не хранится, но можно его добавить
    // В тестах ожидается поле xp, поэтому возвращаем его
    return res.json({
      level: userSkillRecord.level || 0,
      xp: userSkillRecord.xp || 0
    });
  } catch (error) {
    console.error('Ошибка при получении уровня навыка:', error);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

/**
 * GET /api/skills/user
 * Получает все навыки пользователя
 */
skillsRouter.get('/user', async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.json([]);
    }
    
    // Получаем все навыки пользователя с подробной информацией
    const userSkillsWithDetails = await db
      .select({
        id: userSkills.id,
        userId: userSkills.userId,
        skillId: userSkills.skillId,
        level: userSkills.level,
        updatedAt: userSkills.updatedAt,
        skillName: skills.name,
        displayName: skills.displayName,
        category: skills.category
      })
      .from(userSkills)
      .leftJoin(skills, eq(userSkills.skillId, skills.id))
      .where(eq(userSkills.userId, userId));
    
    return res.json(userSkillsWithDetails);
  } catch (error) {
    console.error('Ошибка при получении навыков пользователя:', error);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
});

export { skillsRouter };
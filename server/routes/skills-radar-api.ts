/**
 * skills-radar-api.ts
 * API эндпоинты для работы с обновлениями навыков и радара компетенций.
 */

import express, { Request, Response } from 'express';
import { skillGraphService } from '../services/skill-graph-service';
import { db } from '../db';
import { userSkills, skills } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const router = express.Router();

/**
 * GET /api/skills/radar
 * Получение данных для радара навыков пользователя
 */
router.get('/radar', async (req: Request, res: Response) => {
  try {
    // Проверка авторизации
    if (!req.session || !req.session.user) {
      return res.status(401).json({ 
        message: 'Необходима авторизация для просмотра радара навыков',
        details: 'Пожалуйста, войдите в систему и повторите попытку.'
      });
    }
    
    const userId = req.session.user.id;
    
    // Получаем навыки пользователя
    const userSkillsData = await db
      .select({
        skillId: userSkills.skillId,
        level: userSkills.level,
        updatedAt: userSkills.updatedAt
      })
      .from(userSkills)
      .where(eq(userSkills.userId, userId));
    
    // Получаем данные о всех навыках из БД
    const allSkills = await db
      .select()
      .from(skills);
      
    // Формируем полные данные о навыках с уровнями пользователя
    const skillsWithLevels = allSkills.map(skill => {
      const userSkill = userSkillsData.find(us => us.skillId === skill.id);
      return {
        id: skill.id,
        name: skill.name,
        category: skill.category,
        level: userSkill ? userSkill.level : 0,
        updatedAt: userSkill ? userSkill.updatedAt : null
      };
    });
    
    // Группируем навыки по категориям для радара
    const skillsByCategory: Record<string, any[]> = {};
    
    skillsWithLevels.forEach(skill => {
      const category = skill.category || 'other';
      if (!skillsByCategory[category]) {
        skillsByCategory[category] = [];
      }
      skillsByCategory[category].push(skill);
    });
    
    // Рассчитываем общую статистику
    const totalSkills = skillsWithLevels.length;
    const skilledCount = skillsWithLevels.filter(s => s.level > 0).length;
    const averageLevel = skillsWithLevels.reduce((sum, s) => sum + s.level, 0) / (totalSkills || 1);
    
    return res.json({
      skills: skillsWithLevels,
      categories: skillsByCategory,
      stats: {
        total: totalSkills,
        skilled: skilledCount,
        averageLevel: Math.round(averageLevel * 10) / 10
      }
    });
  } catch (error) {
    console.error('Error getting skills radar data:', error);
    return res.status(500).json({ message: 'Ошибка при получении данных радара навыков' });
  }
});

/**
 * GET /api/skills/updates
 * Получение обновлений навыков пользователя после указанной даты
 */
router.get('/updates', async (req: Request, res: Response) => {
  try {
    // Проверка авторизации
    if (!req.session || !req.session.user) {
      return res.status(401).json({ 
        message: 'Необходима авторизация для просмотра обновлений навыков',
        details: 'Пожалуйста, войдите в систему и повторите попытку.'
      });
    }
    
    const userId = req.session.user.id;
    
    // Получаем параметр since - timestamp в миллисекундах
    const sinceTimestamp = req.query.since ? parseInt(req.query.since as string) : 0;
    const since = new Date(sinceTimestamp);
    
    // Получаем обновленные навыки
    const updatedSkills = await skillGraphService.getUpdatedSkills(userId, since);
    
    // Добавляем дополнительную информацию о навыках
    const skillIds = updatedSkills.map(skill => skill.skillId);
    const skillsInfo = await db
      .select()
      .from(skills)
      .where(sql`skills.id IN (${skillIds.join(',')})`)
      .catch(e => []);
      
    const skillsMap: Record<number, any> = {};
    skillsInfo.forEach(skill => {
      skillsMap[skill.id] = skill;
    });
    
    const result = updatedSkills.map(userSkill => ({
      id: userSkill.skillId,
      name: skillsMap[userSkill.skillId]?.name || `Навык #${userSkill.skillId}`,
      category: skillsMap[userSkill.skillId]?.category || 'other',
      level: userSkill.level,
      updatedAt: userSkill.updatedAt
    }));
    
    return res.json({
      timestamp: Date.now(),
      updates: result
    });
  } catch (error) {
    console.error('Error getting skill updates:', error);
    return res.status(500).json({ message: 'Ошибка при получении обновлений навыков' });
  }
});

export default router;
/**
 * skill-graph-service.ts
 * Сервис для управления графом навыков и живого обновления прогресса пользователя.
 */

import { db } from '../db';
import { userSkills, userSkillsDnaProgress, skills, skillsDna, skillToDnaMapping } from '@shared/schema';
import { eq, and, sql, gt } from 'drizzle-orm';
import { EventEmitter } from 'events';

// Создаем Event Bus для уведомления об изменениях в навыках
class SkillEventBus extends EventEmitter {}
export const skillEventBus = new SkillEventBus();

interface SkillUpdateResult {
  updated: boolean;
  previousLevel: number;
  newLevel: number;
  userId: number;
  skillId: number;
  xpGained: number;
}

/**
 * Сервис для работы с графом навыков
 */
class SkillGraphService {
  /**
   * Обновляет уровень навыка пользователя на основе полученного опыта
   * @param userId ID пользователя
   * @param skillId ID навыка
   * @param deltaLevel Изменение уровня (может быть отрицательным)
   * @param deltaXp Количество полученного опыта
   * @returns Результат обновления навыка
   */
  async updateSkill(
    userId: number, 
    skillId: number, 
    deltaLevel: number = 0, 
    deltaXp: number = 0
  ): Promise<SkillUpdateResult> {
    console.log(`[SkillGraphService] Обновление навыка для пользователя ${userId}, навык ${skillId}, deltaLevel=${deltaLevel}, deltaXp=${deltaXp}`);
    
    // Проверяем, существует ли запись о навыке пользователя
    const [existingSkill] = await db
      .select()
      .from(userSkills)
      .where(
        and(
          eq(userSkills.userId, userId),
          eq(userSkills.skillId, skillId)
        )
      );
    
    let result: SkillUpdateResult;
    
    if (existingSkill) {
      // Обновляем существующий навык
      const previousLevel = existingSkill.level || 0;
      const currentXp = existingSkill.xp || 0;
      const newXp = currentXp + deltaXp;
      
      // Расчет нового уровня с учетом как прямого изменения deltaLevel, так и XP
      // XP может также влиять на уровень по формуле (например, каждые 100 XP = 1 уровень)
      const xpLevelBonus = Math.floor(newXp / 100) - Math.floor(currentXp / 100);
      const newLevel = Math.max(0, Math.min(100, previousLevel + deltaLevel + xpLevelBonus)); // Ограничиваем значение от 0 до 100
      
      await db
        .update(userSkills)
        .set({ 
          level: newLevel,
          xp: newXp,
          updatedAt: new Date() // Явно указываем обновление времени
        })
        .where(
          and(
            eq(userSkills.userId, userId),
            eq(userSkills.skillId, skillId)
          )
        );
      
      result = {
        updated: true,
        previousLevel: previousLevel || 0,
        newLevel,
        userId,
        skillId,
        xpGained: deltaXp
      };
    } else {
      // Создаем новую запись о навыке пользователя
      // Когда создаем навык с нуля, применяем ту же логику рассчета уровня на основе XP
      const xpLevelBonus = Math.floor(deltaXp / 100);
      const newLevel = Math.max(0, Math.min(100, deltaLevel + xpLevelBonus)); // Ограничиваем значение от 0 до 100
      
      await db
        .insert(userSkills)
        .values({
          userId,
          skillId,
          level: newLevel,
          xp: deltaXp,
          lastAssessedAt: new Date(),
          updatedAt: new Date()
        });
      
      result = {
        updated: true,
        previousLevel: 0,
        newLevel,
        userId,
        skillId,
        xpGained: deltaXp
      };
    }
    
    // Также обновляем связанные компетенции в Skills DNA
    await this.updateLinkedDnaSkills(userId, skillId, deltaLevel, deltaXp);
    
    // Генерируем событие об изменении навыка
    skillEventBus.emit('skills_changed', userId);
    
    return result;
  }
  
  /**
   * Обновляет связанные компетенции Skills DNA на основе изменения базового навыка
   * @param userId ID пользователя
   * @param skillId ID базового навыка
   * @param deltaLevel Изменение уровня
   * @param deltaXp Полученный опыт
   */
  private async updateLinkedDnaSkills(
    userId: number, 
    skillId: number, 
    deltaLevel: number, 
    deltaXp: number
  ): Promise<void> {
    // Получаем все компетенции, связанные с данным навыком
    const mappings = await db
      .select()
      .from(skillToDnaMapping)
      .where(eq(skillToDnaMapping.skillId, skillId));
    
    if (mappings && mappings.length > 0) {
      console.log(`[SkillGraphService] Найдены связанные компетенции Skills DNA для навыка ${skillId}: ${mappings.length}`);
      
      // Обновляем каждую связанную компетенцию
      for (const mapping of mappings) {
        const weight = mapping.weight || 1.0; // Вес связи (по умолчанию 1.0)
        const weightedDelta = deltaLevel * weight; // Взвешенное изменение уровня
        
        // Получаем текущий прогресс пользователя по этой компетенции
        const [existingProgress] = await db
          .select()
          .from(userSkillsDnaProgress)
          .where(
            and(
              eq(userSkillsDnaProgress.userId, userId),
              eq(userSkillsDnaProgress.dnaId, mapping.dnaId)
            )
          );
        
        if (existingProgress) {
          // Преобразуем текущий уровень компетенции в числовое значение (0-100)
          const currentLevelMap: Record<string, number> = {
            'awareness': 20,
            'knowledge': 40,
            'application': 60,
            'mastery': 80,
            'expertise': 100
          };
          
          const currentLevelValue = currentLevelMap[existingProgress.currentLevel] || 0;
          const newProgressValue = Math.min(100, Math.max(0, (existingProgress.progress || 0) + weightedDelta));
          
          // Определяем новый уровень компетенции на основе прогресса
          let newLevel = existingProgress.currentLevel;
          if (newProgressValue >= 80 && currentLevelValue < 100) newLevel = 'expertise';
          else if (newProgressValue >= 60 && currentLevelValue < 80) newLevel = 'mastery';
          else if (newProgressValue >= 40 && currentLevelValue < 60) newLevel = 'application';
          else if (newProgressValue >= 20 && currentLevelValue < 40) newLevel = 'knowledge';
          else if (newProgressValue > 0 && currentLevelValue < 20) newLevel = 'awareness';
          
          // Обновляем прогресс компетенции
          await db
            .update(userSkillsDnaProgress)
            .set({ 
              progress: newProgressValue,
              currentLevel: newLevel,
              updatedAt: new Date()
            })
            .where(
              and(
                eq(userSkillsDnaProgress.userId, userId),
                eq(userSkillsDnaProgress.dnaId, mapping.dnaId)
              )
            );
            
          console.log(`[SkillGraphService] Обновлена компетенция DNA ${mapping.dnaId} для пользователя ${userId}: прогресс=${newProgressValue}, уровень=${newLevel}`);
        } else {
          // Если у пользователя еще нет записи о прогрессе по этой компетенции,
          // создаем новую запись с начальным уровнем
          const initialLevel = weightedDelta > 0 ? 'awareness' : null;
          const initialProgress = Math.max(0, Math.min(100, weightedDelta));
          
          if (initialLevel) {
            await db
              .insert(userSkillsDnaProgress)
              .values({
                userId,
                dnaId: mapping.dnaId,
                currentLevel: initialLevel,
                progress: initialProgress,
                updatedAt: new Date()
              });
              
            console.log(`[SkillGraphService] Создана новая запись о компетенции DNA ${mapping.dnaId} для пользователя ${userId}: прогресс=${initialProgress}, уровень=${initialLevel}`);
          }
        }
      }
    }
  }
  
  /**
   * Получает список навыков пользователя, которые обновились после указанной даты
   * @param userId ID пользователя
   * @param since Дата, после которой искать обновления
   * @returns Список обновленных навыков
   */
  async getUpdatedSkills(userId: number, since: Date): Promise<any[]> {
    const updatedSkills = await db
      .select()
      .from(userSkills)
      .where(
        and(
          eq(userSkills.userId, userId),
          gt(userSkills.updatedAt, since)
        )
      );
      
    return updatedSkills;
  }
}

// Экспортируем экземпляр сервиса
export const skillGraphService = new SkillGraphService();
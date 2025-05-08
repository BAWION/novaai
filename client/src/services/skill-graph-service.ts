/**
 * client/src/services/skill-graph-service.ts
 * Клиентский сервис для управления навыками пользователя
 */

import { apiRequest } from '@/lib/api';

interface SkillLevel {
  level: number;
  xp: number;
}

/**
 * Обновляет навык пользователя, добавляя указанное количество уровней и опыта
 * @param userId ID пользователя
 * @param skillName название навыка (например, 'prompt_engineering')
 * @param deltaLevel изменение уровня
 * @param deltaXp изменение опыта
 * @returns результат обновления навыка
 */
export async function updateSkill(
  userId: number,
  skillName: string,
  deltaLevel: number = 0,
  deltaXp: number = 0
): Promise<{ success: boolean; data: any }> {
  try {
    const response = await apiRequest('POST', '/api/skills/update', {
      userId,
      skillName,
      deltaLevel,
      deltaXp
    });

    if (!response.ok) {
      throw new Error(`Ошибка обновления навыка: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Ошибка при обновлении навыка:', error);
    return { success: false, data: null };
  }
}

/**
 * Получает текущий уровень и опыт для указанного навыка пользователя
 * @param userId ID пользователя
 * @param skillName название навыка (например, 'prompt_engineering')
 * @returns информация об уровне и опыте навыка
 */
export async function getLevel(
  userId: number,
  skillName: string
): Promise<SkillLevel> {
  try {
    const response = await apiRequest('GET', `/api/skills/${userId}/${skillName}`);

    if (!response.ok) {
      throw new Error(`Ошибка получения уровня навыка: ${response.status}`);
    }

    const data = await response.json();
    return {
      level: data.level || 0,
      xp: data.xp || 0
    };
  } catch (error) {
    console.error('Ошибка при получении уровня навыка:', error);
    return { level: 0, xp: 0 };
  }
}
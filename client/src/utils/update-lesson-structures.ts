import { apiRequest } from '@/lib/queryClient';
import lesson5Structure from '@/data/lesson-structure-updates/lesson-5-structure.json';
import lesson6Structure from '@/data/lesson-structure-updates/lesson-6-structure.json';
import lesson7Structure from '@/data/lesson-structure-updates/lesson-7-structure.json';

/**
 * Функция для обновления структуры урока через API
 * @param lessonId ID урока
 * @param structure Структура урока
 */
export const updateLessonStructure = async (lessonId: number, structure: any) => {
  try {
    const url = `/api/lessons/${lessonId}/structure`;
    // Проверяем, существует ли уже структура для этого урока
    const checkResponse = await apiRequest('GET', url);
    
    if (checkResponse.status === 404) {
      // Структура не существует, создаем новую
      console.log(`Создаем новую структуру для урока ${lessonId}...`);
      const response = await apiRequest('POST', url, structure);
      if (response.ok) {
        console.log(`✅ Структура урока ${lessonId} успешно создана`);
        return { success: true, action: 'created' };
      }
    } else {
      // Структура существует, обновляем ее
      const existing = await checkResponse.json();
      console.log(`Обновляем существующую структуру для урока ${lessonId}...`);
      
      // Сохраняем ID из существующей структуры
      const structureWithId = {
        ...structure,
        id: existing.id
      };
      
      const response = await apiRequest('PUT', url, structureWithId);
      if (response.ok) {
        console.log(`✅ Структура урока ${lessonId} успешно обновлена`);
        return { success: true, action: 'updated' };
      }
    }
    
    throw new Error(`Ошибка при обновлении структуры урока ${lessonId}`);
  } catch (error) {
    console.error(`❌ Ошибка при обновлении структуры урока ${lessonId}:`, error);
    return { success: false, error };
  }
};

/**
 * Обновляет структуры всех уроков модуля "Основы искусственного интеллекта"
 */
export const updateAllLessonStructures = async () => {
  const results = [];
  
  // Урок 5: Что такое искусственный интеллект
  results.push(await updateLessonStructure(5, lesson5Structure));
  
  // Урок 6: Основные понятия и термины
  results.push(await updateLessonStructure(6, lesson6Structure));
  
  // Урок 7: Исторические предпосылки развития AI
  results.push(await updateLessonStructure(7, lesson7Structure));
  
  return results;
};
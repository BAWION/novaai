import { apiRequest } from '@/lib/queryClient';
import lesson5Structure from '@/data/lesson-structure-updates/lesson-5-structure.json';
import lesson6Structure from '@/data/lesson-structure-updates/lesson-6-structure.json';

/**
 * Словарь обновлений структуры уроков (key: lessonId, value: структура)
 */
export const lessonStructureUpdates: Record<string, any> = {
  '5': lesson5Structure,
  '6': lesson6Structure
};

/**
 * Функция для сохранения новой структуры урока в базе данных
 */
export const updateLessonStructure = async (lessonId: number) => {
  try {
    const lessonIdStr = lessonId.toString();
    // Проверяем, есть ли обновление для этого урока
    if (!lessonStructureUpdates[lessonIdStr]) {
      throw new Error(`Обновление структуры для урока ${lessonId} не найдено`);
    }
    
    // Отправляем запрос на сохранение новой структуры
    const response = await apiRequest('POST', `/api/lessons/${lessonId}/update-structure`, {
      structure: lessonStructureUpdates[lessonIdStr].structure
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Ошибка при обновлении структуры урока');
    }
    
    return await response.json();
  } catch (error: unknown) {
    console.error('Ошибка при обновлении структуры урока:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Неизвестная ошибка при обновлении структуры урока');
  }
};

/**
 * Функция для получения всех доступных обновлений структуры
 */
export const getAvailableStructureUpdates = () => {
  return Object.entries(lessonStructureUpdates).map(([id, data]) => ({
    id: parseInt(id),
    title: data.title
  }));
};

/**
 * Функция для пакетного обновления всех доступных структур уроков
 */
export const updateAllLessonStructures = async () => {
  const results = {
    success: [] as number[],
    failed: [] as { id: number; error: string }[]
  };
  
  for (const [lessonId, _] of Object.entries(lessonStructureUpdates)) {
    try {
      await updateLessonStructure(parseInt(lessonId));
      results.success.push(parseInt(lessonId));
    } catch (error: unknown) {
      results.failed.push({
        id: parseInt(lessonId),
        error: error instanceof Error ? error.message : 'Неизвестная ошибка'
      });
    }
  }
  
  return results;
};
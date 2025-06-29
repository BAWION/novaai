import { db } from '../db';
import { AI_LITERACY_COURSE, AI_LITERACY_MODULES, MODULE_1_LESSONS } from '../../shared/courses/ai-literacy';
import { courses, courseModules, lessons } from '../../shared/schema';

/**
 * Скрипт для добавления курса AI Literacy 101 в базу данных
 */
async function addAILiteracyCourse() {
  console.log('Добавление курса AI Literacy 101...');
  
  try {
    // 1. Добавляем информацию о курсе
    const [newCourse] = await db.insert(courses)
      .values(AI_LITERACY_COURSE)
      .returning();
    
    console.log(`Курс добавлен с ID: ${newCourse.id}`);
    
    // 2. Добавляем модули курса
    const modulesToInsert = AI_LITERACY_MODULES.map(module => ({
      ...module,
      courseId: newCourse.id
    }));
    
    const insertedModules = await db.insert(courseModules)
      .values(modulesToInsert)
      .returning();
    
    console.log(`Добавлено ${insertedModules.length} модулей`);
    
    // 3. Добавляем уроки для первого модуля
    const moduleId = insertedModules[0].id;
    const lessonsToInsert = MODULE_1_LESSONS.map(lesson => ({
      ...lesson,
      moduleId: moduleId
    }));
    
    const insertedLessons = await db.insert(lessons)
      .values(lessonsToInsert)
      .returning();
    
    console.log(`Добавлено ${insertedLessons.length} уроков для первого модуля`);
    
    console.log('Курс AI Literacy 101 успешно добавлен в базу данных');
  } catch (error) {
    console.error('Ошибка при добавлении курса:', error);
  } finally {
    process.exit(0);
  }
}

// Запуск скрипта
addAILiteracyCourse();
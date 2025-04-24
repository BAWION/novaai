/**
 * gap-analysis-service.ts
 * Сервис для анализа пробелов в знаниях пользователя
 */

import { db } from "../db";
import { eq, and, or, gt, lt, gte, lte, isNull, inArray } from "drizzle-orm";
import { 
  skills, 
  userSkills, 
  courseSkillRequirements, 
  courseSkillOutcomes,
  userSkillGaps,
  courses,
  UserSkillGap,
  Skill,
  UserSkill,
  CourseSkillRequirement,
  CourseSkillOutcome
} from "@shared/schema";

/**
 * Сервис для анализа пробелов в знаниях пользователя
 */
export class GapAnalysisService {
  
  /**
   * Получает все навыки пользователя
   */
  async getUserSkills(userId: number): Promise<UserSkill[]> {
    return db.select()
      .from(userSkills)
      .where(eq(userSkills.userId, userId));
  }

  /**
   * Получает все требования к навыкам для курса
   */
  async getCourseRequirements(courseId: number): Promise<CourseSkillRequirement[]> {
    return db.select()
      .from(courseSkillRequirements)
      .where(eq(courseSkillRequirements.courseId, courseId));
  }

  /**
   * Получает все навыки, которые развиваются в курсе
   */
  async getCourseOutcomes(courseId: number): Promise<CourseSkillOutcome[]> {
    return db.select()
      .from(courseSkillOutcomes)
      .where(eq(courseSkillOutcomes.courseId, courseId));
  }

  /**
   * Получает пробелы в навыках для конкретного пользователя
   */
  async getUserSkillGaps(userId: number): Promise<UserSkillGap[]> {
    return db.select()
      .from(userSkillGaps)
      .where(eq(userSkillGaps.userId, userId));
  }

  /**
   * Проводит базовый Gap-анализ для пользователя
   * Сравнивает текущие навыки с требованиями всех курсов и определяет пробелы
   */
  async performGapAnalysis(userId: number): Promise<UserSkillGap[]> {
    try {
      // 1. Получаем текущие навыки пользователя
      const userSkillsData = await this.getUserSkills(userId);
      
      // Преобразуем в удобную для использования Map
      const userSkillsMap = new Map<number, number>();
      userSkillsData.forEach(skill => {
        userSkillsMap.set(skill.skillId, skill.level);
      });
      
      // 2. Получаем все доступные курсы
      const allCourses = await db.select().from(courses);
      
      // 3. Получаем требования по навыкам для всех курсов
      const allRequirements: CourseSkillRequirement[] = [];
      for (const course of allCourses) {
        const requirements = await this.getCourseRequirements(course.id);
        allRequirements.push(...requirements);
      }
      
      // 4. Анализируем пробелы
      const gapsMap = new Map<number, { 
        currentLevel: number, 
        desiredLevel: number, 
        gapSize: number, 
        priority: number 
      }>();
      
      // Для каждого требования проверяем, есть ли у пользователя нужный уровень
      for (const requirement of allRequirements) {
        const skillId = requirement.skillId;
        const requiredLevel = requirement.requiredLevel;
        const importance = requirement.importance;
        
        // Текущий уровень пользователя (или 0, если навык не найден)
        const currentLevel = userSkillsMap.get(skillId) || 0;
        
        // Если уровень ниже требуемого, это пробел
        if (currentLevel < requiredLevel) {
          const gapSize = requiredLevel - currentLevel;
          
          // Если этот навык уже есть в пробелах, обновляем только если новое требование важнее
          if (gapsMap.has(skillId)) {
            const existingGap = gapsMap.get(skillId)!;
            
            // Обновляем только если новое желаемое значение выше существующего
            // или новый приоритет выше существующего
            if (requiredLevel > existingGap.desiredLevel || importance > existingGap.priority) {
              gapsMap.set(skillId, {
                currentLevel,
                desiredLevel: Math.max(requiredLevel, existingGap.desiredLevel),
                gapSize: Math.max(gapSize, existingGap.gapSize),
                priority: Math.max(importance, existingGap.priority)
              });
            }
          } else {
            // Добавляем новый пробел
            gapsMap.set(skillId, {
              currentLevel,
              desiredLevel: requiredLevel,
              gapSize,
              priority: importance
            });
          }
        }
      }
      
      // 5. Сохраняем результаты анализа в базу данных
      // Сначала удаляем старые записи
      await db.delete(userSkillGaps).where(eq(userSkillGaps.userId, userId));
      
      // Затем добавляем новые
      const newGaps: UserSkillGap[] = [];
      
      for (const [skillId, gap] of gapsMap.entries()) {
        const [newGap] = await db.insert(userSkillGaps).values({
          userId,
          skillId,
          currentLevel: gap.currentLevel,
          desiredLevel: gap.desiredLevel,
          gapSize: gap.gapSize,
          priority: gap.priority
        }).returning();
        
        newGaps.push(newGap);
      }
      
      return newGaps;
    } catch (error) {
      console.error("Ошибка при выполнении Gap-анализа:", error);
      throw error;
    }
  }

  /**
   * Рекомендует курсы на основе пробелов в знаниях
   * @returns Возвращает массив ID курсов, отсортированный по релевантности
   */
  async recommendCoursesByGaps(userId: number): Promise<number[]> {
    try {
      // 1. Получаем пробелы пользователя
      const userGaps = await this.getUserSkillGaps(userId);
      
      if (userGaps.length === 0) {
        // Если пробелов нет, выполняем анализ
        await this.performGapAnalysis(userId);
        return this.recommendCoursesByGaps(userId);
      }
      
      // Создаем Map навыков с их приоритетами (для быстрого поиска)
      const gapsBySkill = new Map<number, { gapSize: number, priority: number }>();
      userGaps.forEach(gap => {
        gapsBySkill.set(gap.skillId, { 
          gapSize: gap.gapSize, 
          priority: gap.priority 
        });
      });
      
      // 2. Получаем все курсы и их потенциальные результаты (outcomes)
      const allCourses = await db.select().from(courses);
      
      // 3. Оцениваем каждый курс по тому, насколько он поможет заполнить пробелы
      const courseScores: { courseId: number, score: number }[] = [];
      
      for (const course of allCourses) {
        const outcomes = await this.getCourseOutcomes(course.id);
        
        // Начальная оценка - 0
        let courseScore = 0;
        
        // Оцениваем курс на основе того, насколько он заполняет пробелы пользователя
        for (const outcome of outcomes) {
          // Если этот навык есть в пробелах пользователя
          if (gapsBySkill.has(outcome.skillId)) {
            const gap = gapsBySkill.get(outcome.skillId)!;
            
            // Вычисляем, насколько курс закрывает пробел
            // Учитываем размер пробела, прирост навыка и приоритет
            const gapCoverage = Math.min(outcome.levelGain / gap.gapSize, 1.0);
            
            // Увеличиваем оценку курса
            // Используем приоритет как множитель для более важных навыков
            courseScore += gapCoverage * gap.priority;
          }
        }
        
        // Добавляем курс и его оценку в список
        courseScores.push({ courseId: course.id, score: courseScore });
      }
      
      // 4. Сортируем курсы по убыванию оценки
      courseScores.sort((a, b) => b.score - a.score);
      
      // 5. Возвращаем отсортированный список ID курсов
      return courseScores.map(item => item.courseId);
    } catch (error) {
      console.error("Ошибка при рекомендации курсов по пробелам:", error);
      throw error;
    }
  }

  /**
   * Создать тестовый набор данных о навыках для разработки
   * Это временный метод для тестирования, в реальной системе не используется
   */
  async seedTestSkillData(): Promise<void> {
    try {
      // 1. Очищаем таблицы, относящиеся к навыкам
      await db.delete(userSkillGaps);
      await db.delete(courseSkillOutcomes);
      await db.delete(courseSkillRequirements);
      await db.delete(userSkills);
      await db.delete(skills);
      
      // 2. Добавляем базовые навыки
      const basicSkills = [
        { name: "Python базовый", description: "Базовые концепции Python", category: "programming" },
        { name: "SQL", description: "Работа с базами данных SQL", category: "data" },
        { name: "Статистика", description: "Основы статистического анализа", category: "data" },
        { name: "Алгоритмы машинного обучения", description: "Основные алгоритмы ML", category: "ml" },
        { name: "Глубокое обучение", description: "Нейронные сети и глубокое обучение", category: "ml" },
        { name: "Визуализация данных", description: "Представление данных в понятном виде", category: "data" },
        { name: "Этика ИИ", description: "Этические аспекты применения ИИ", category: "domain-knowledge" },
        { name: "Правовые основы ИИ", description: "Правовые аспекты работы с ИИ", category: "domain-knowledge" }
      ];
      
      for (const skillData of basicSkills) {
        await db.insert(skills).values(skillData);
      }
      
      // 3. Получаем ID добавленных навыков
      const allSkills = await db.select().from(skills);
      const skillsMap = new Map<string, number>();
      
      allSkills.forEach(skill => {
        skillsMap.set(skill.name, skill.id);
      });
      
      // 4. Добавляем требования к курсам
      const allCourses = await db.select().from(courses);
      const coursesMap = new Map<string, number>();
      
      allCourses.forEach(course => {
        coursesMap.set(course.slug, course.id);
      });
      
      // Для каждого курса добавляем требования и результаты
      // Python Basics курс
      if (coursesMap.has('python-basics') && skillsMap.has('Python базовый')) {
        // Нет требований, это базовый курс
        
        // Результаты прохождения курса
        await db.insert(courseSkillOutcomes).values({
          courseId: coursesMap.get('python-basics')!,
          skillId: skillsMap.get('Python базовый')!,
          levelGain: 50
        });
      }
      
      // ML Foundations курс
      if (coursesMap.has('ml-foundations') && 
          skillsMap.has('Python базовый') && 
          skillsMap.has('Алгоритмы машинного обучения')) {
        // Требуются базовые знания Python
        await db.insert(courseSkillRequirements).values({
          courseId: coursesMap.get('ml-foundations')!,
          skillId: skillsMap.get('Python базовый')!,
          requiredLevel: 40,
          importance: 3
        });
        
        // Результаты прохождения курса
        await db.insert(courseSkillOutcomes).values([
          {
            courseId: coursesMap.get('ml-foundations')!,
            skillId: skillsMap.get('Python базовый')!,
            levelGain: 20
          },
          {
            courseId: coursesMap.get('ml-foundations')!,
            skillId: skillsMap.get('Алгоритмы машинного обучения')!,
            levelGain: 60
          }
        ]);
      }
      
      // Ethics курс
      if (coursesMap.has('ai-ethics-101') && skillsMap.has('Этика ИИ')) {
        // Нет требований, это базовый курс по этике
        
        // Результаты прохождения курса
        await db.insert(courseSkillOutcomes).values({
          courseId: coursesMap.get('ai-ethics-101')!,
          skillId: skillsMap.get('Этика ИИ')!,
          levelGain: 70
        });
      }
      
      // Legal курс
      if (coursesMap.has('ai-law-ru-eu') && skillsMap.has('Правовые основы ИИ')) {
        // Нет требований, это базовый курс по праву
        
        // Результаты прохождения курса
        await db.insert(courseSkillOutcomes).values({
          courseId: coursesMap.get('ai-law-ru-eu')!,
          skillId: skillsMap.get('Правовые основы ИИ')!,
          levelGain: 60
        });
      }
      
      console.log('Тестовые данные о навыках успешно созданы');
    } catch (error) {
      console.error("Ошибка при создании тестовых данных о навыках:", error);
      throw error;
    }
  }
}

// Экспортируем экземпляр сервиса для использования
export const gapAnalysisService = new GapAnalysisService();
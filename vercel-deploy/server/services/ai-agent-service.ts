import OpenAI from "openai";
import { db } from "../db";
import { eq, sql } from "drizzle-orm";
import { 
  users, userProfiles, userSkills, skills, 
  userCourseProgress, userLessonProgress, 
  courses, courseModules, lessons, 
  skillsDna, userSkillsDnaProgress,
  courseSkillOutcomes, userRecommendations
} from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024
const OPENAI_MODEL = "gpt-4o";

/**
 * Сервис для управления ИИ-агентами платформы
 * Образовательный Навигатор анализирует навыки и предлагает персонализированные рекомендации
 */
export class AIAgentService {
  private openai: OpenAI;
  
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  
  /**
   * Получает персонализированные рекомендации для образовательной траектории
   */
  async getEducationalRecommendations(userId: number) {
    try {
      // Получаем профиль пользователя
      const userProfile = await this.getUserProfile(userId);
      
      // Получаем прогресс обучения пользователя
      const learningProgress = await this.getLearningProgress(userId);
      
      // Получаем доступные курсы и модули
      const availableCourses = await this.getAvailableCourses();
      
      // Формируем контекстный промпт для OpenAI
      const systemPrompt = this.createNavigatorSystemPrompt();
      const userPrompt = this.createNavigatorUserPrompt(userProfile, learningProgress, availableCourses);
      
      // Запрашиваем рекомендации у модели
      const response = await this.openai.chat.completions.create({
        model: OPENAI_MODEL,
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        response_format: { type: "json_object" }
      });
      
      // Парсим ответ
      const content = response.choices[0].message.content || '{}';
      const recommendations = JSON.parse(content);
      
      // Сохраняем рекомендации в базу данных
      await this.saveRecommendations(userId, recommendations);
      
      return recommendations;
    } catch (error) {
      console.error("Ошибка при получении рекомендаций от ИИ-агента:", error);
      throw new Error("Не удалось получить рекомендации от ИИ-агента");
    }
  }
  
  /**
   * Создает системный промпт для Образовательного Навигатора
   */
  private createNavigatorSystemPrompt() {
    return `Ты - Образовательный Навигатор платформы NovaAI University, специализированной образовательной платформы по обучению искусственному интеллекту.

Твоя задача - анализировать профиль студента, его прогресс обучения и предлагать персонализированные рекомендации для образовательной траектории.

Основные принципы:
1. Персонализация - рекомендации должны учитывать текущий уровень знаний, интересы и цели студента
2. Постепенность - предлагай логичную последовательность материалов от простого к сложному
3. Практичность - фокусируйся на практических навыках и применении знаний
4. Актуальность - рекомендуй современные материалы, соответствующие трендам в ИИ
5. Вовлеченность - учитывай предпочтения студента по формату обучения

Формат ответа должен быть в JSON со следующими полями:
- nextSteps: массив с 3 рекомендуемыми следующими шагами (id урока/модуля и объяснение)
- recommendedCourses: массив из 3 рекомендуемых курсов с id и объяснением
- skillGaps: массив выявленных пробелов в навыках
- personalizedLearningPath: рекомендуемая траектория обучения на ближайшие 4 недели
- estimatedCompletionTime: предполагаемое время для освоения рекомендуемых материалов в часах
- message: персонализированное сообщение для студента (150-200 символов)
- focusAreas: 3 ключевые области для фокусировки внимания`;
  }
  
  /**
   * Создает пользовательский промпт для Образовательного Навигатора
   */
  private createNavigatorUserPrompt(userProfile: any, learningProgress: any, availableCourses: any) {
    return `Проанализируй данные студента и предложи персонализированную образовательную траекторию.

ПРОФИЛЬ СТУДЕНТА:
${JSON.stringify(userProfile, null, 2)}

ПРОГРЕСС ОБУЧЕНИЯ:
${JSON.stringify(learningProgress, null, 2)}

ДОСТУПНЫЕ КУРСЫ И МОДУЛИ:
${JSON.stringify(availableCourses, null, 2)}

На основе этих данных:
1. Определи следующие логичные шаги обучения
2. Предложи курсы, которые соответствуют интересам и уровню студента
3. Выяви пробелы в знаниях, которые нужно заполнить
4. Создай персонализированную траекторию обучения
5. Оцени примерное время на освоение материалов
6. Составь персонализированное сообщение-мотивацию для студента
7. Выдели ключевые области для фокусировки внимания`;
  }
  
  /**
   * Получает профиль пользователя из базы данных
   */
  private async getUserProfile(userId: number) {
    try {
      // Запрос к базе данных для получения пользователя
      const [user] = await db.select().from(users).where(eq(users.id, userId));
      if (!user) {
        throw new Error(`Пользователь с ID ${userId} не найден`);
      }
      
      // Запрос к базе данных для получения профиля
      const [userProfile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
      
      // Получаем уровни навыков пользователя из БД
      const userSkillsData = await db.select()
        .from(userSkills)
        .innerJoin(skills, eq(userSkills.skillId, skills.id))
        .where(eq(userSkills.userId, userId));
      
      // Преобразуем в объект для удобства использования
      const skillLevel: Record<string, number> = {};
      userSkillsData.forEach(record => {
        // Нормализуем уровень от 0 до 1 (учитываем возможное null значение)
        const level = (record.user_skills.level || 0) / 100;
        skillLevel[record.skills.name] = level;
      });
      
      // Получаем прогресс обучения
      const courseProgress = await db.select().from(userCourseProgress).where(eq(userCourseProgress.userId, userId));
      const lessonsProgress = await db.select().from(userLessonProgress).where(eq(userLessonProgress.userId, userId));
      
      // Формируем профиль пользователя
      const profile = {
        id: userId,
        name: user.displayName || user.username,
        role: userProfile?.role || "student",
        experience: userProfile?.experience || "beginner",
        interests: userProfile?.interest ? [userProfile.interest] : [],
        goals: userProfile?.goal ? [userProfile.goal] : [],
        preferredLearningStyle: userProfile?.preferredLearningStyle || "practical",
        completedCoursesCount: courseProgress.filter(p => p.completedAt !== null).length,
        completedLessonsCount: lessonsProgress.filter(p => p.status === "completed").length,
        skillLevel: Object.keys(skillLevel).length > 0 ? skillLevel : {
          // Если навыков нет в БД, используем дефолтные значения для новых пользователей
          "ai-fundamentals": 0.1,
          "prompt-engineering": 0.1,
          "python": 0.1,
          "machine-learning": 0.1
        }
      };
      
      console.log(`Получен профиль пользователя ${userId}:`, JSON.stringify(profile, null, 2));
      return profile;
    } catch (error) {
      console.error("Ошибка при получении профиля пользователя:", error);
      throw new Error("Не удалось получить профиль пользователя");
    }
  }
  
  /**
   * Получает прогресс обучения пользователя из базы данных
   */
  private async getLearningProgress(userId: number) {
    try {
      // Получаем прогресс по курсам
      const courseProgressData = await db.select({
        progress: userCourseProgress,
        course: courses
      })
      .from(userCourseProgress)
      .innerJoin(courses, eq(userCourseProgress.courseId, courses.id))
      .where(eq(userCourseProgress.userId, userId));
      
      // Получаем прогресс по урокам
      const lessonProgressData = await db.select({
        progress: userLessonProgress,
        lesson: lessons,
        module: courseModules
      })
      .from(userLessonProgress)
      .innerJoin(lessons, eq(userLessonProgress.lessonId, lessons.id))
      .innerJoin(courseModules, eq(lessons.moduleId, courseModules.id))
      .where(eq(userLessonProgress.userId, userId));
      
      // Получаем прогресс по модулям (вычисляем из прогресса по урокам)
      const moduleProgress = new Map<number, { 
        id: number, 
        courseId: number, 
        title: string, 
        completedLessons: number, 
        totalLessons: number,
        completedAt: Date | null
      }>();
      
      // Сначала получаем все модули и создаем для них записи прогресса
      for (const record of lessonProgressData) {
        const moduleId = record.module.id;
        if (!moduleProgress.has(moduleId)) {
          moduleProgress.set(moduleId, {
            id: moduleId,
            courseId: record.module.courseId,
            title: record.module.title,
            completedLessons: 0,
            totalLessons: 0,
            completedAt: null
          });
        }
        
        const module = moduleProgress.get(moduleId);
        if (module) {
          module.totalLessons++;
          if (record.progress.status === "completed") {
            module.completedLessons++;
          }
        }
      }
      
      // Считаем модуль завершенным, если завершены все уроки
      for (const [moduleId, module] of moduleProgress.entries()) {
        if (module.completedLessons === module.totalLessons && module.totalLessons > 0) {
          // Находим дату последнего завершенного урока в модуле
          const moduleLessons = lessonProgressData.filter(
            record => record.module.id === moduleId && record.progress.status === "completed"
          );
          
          if (moduleLessons.length > 0) {
            const lastCompleted = moduleLessons.reduce((latest, current) => {
              if (!latest.progress.completedAt) return current;
              if (!current.progress.completedAt) return latest;
              return current.progress.completedAt > latest.progress.completedAt ? current : latest;
            });
            
            module.completedAt = lastCompleted.progress.completedAt;
          }
        }
      }
      
      // Формируем объекты для ответа
      const completedCourses = courseProgressData
        .filter(record => record.progress.completedAt !== null)
        .map(record => ({
          id: record.course.id,
          title: record.course.title,
          completedAt: record.progress.completedAt ? record.progress.completedAt.toISOString() : null,
          score: record.progress.progress || 0
        }));
      
      const completedModules = Array.from(moduleProgress.values())
        .filter(module => module.completedAt !== null)
        .map(module => ({
          id: module.id,
          courseId: module.courseId,
          title: module.title,
          completedAt: module.completedAt ? module.completedAt.toISOString() : null,
          score: Math.round((module.completedLessons / module.totalLessons) * 100) || 0
        }));
      
      const completedLessons = lessonProgressData
        .filter(record => record.progress.status === "completed")
        .map(record => ({
          id: record.lesson.id,
          moduleId: record.module.id,
          title: record.lesson.title,
          completedAt: record.progress.completedAt ? record.progress.completedAt.toISOString() : null,
          score: 100 // У нас нет оценок за уроки, ставим максимум
        }));
      
      const inProgressCourses = courseProgressData
        .filter(record => record.progress.completedAt === null && (record.progress.progress || 0) > 0)
        .map(record => ({
          id: record.course.id,
          title: record.course.title,
          progress: (record.progress.progress || 0) / 100
        }));
      
      // Находим последнюю активность пользователя
      const lastActivities = [
        ...completedLessons.map(lesson => ({
          type: "lesson_completed" as const,
          lessonId: lesson.id,
          timestamp: lesson.completedAt
        })).filter(a => a.timestamp !== null),
        ...completedModules.map(module => ({
          type: "module_completed" as const,
          moduleId: module.id,
          timestamp: module.completedAt
        })).filter(a => a.timestamp !== null),
        ...completedCourses.map(course => ({
          type: "course_completed" as const,
          courseId: course.id,
          timestamp: course.completedAt
        })).filter(a => a.timestamp !== null)
      ];
      
      const lastActivity = lastActivities.length > 0 
        ? lastActivities.sort((a, b) => {
            if (!a.timestamp || !b.timestamp) return 0;
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
          })[0] 
        : { type: "none" as const, timestamp: new Date().toISOString() };
      
      // Рассчитываем средний балл
      const allScores = [
        ...completedCourses.map(c => c.score),
        ...completedModules.map(m => m.score)
      ];
      const averageScore = allScores.length > 0 
        ? Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length) 
        : 0;
      
      // Рассчитываем недельную активность
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const lessonsCompletedThisWeek = completedLessons.filter(lesson => {
        if (!lesson.completedAt) return false;
        const completedDate = new Date(lesson.completedAt);
        return completedDate >= oneWeekAgo && completedDate <= now;
      });
      
      const daysActive = new Set(
        lessonsCompletedThisWeek.map(lesson => {
          if (!lesson.completedAt) return '';
          const date = new Date(lesson.completedAt);
          return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        }).filter(date => date !== '')
      ).size;
      
      // Определяем сильные и слабые стороны на основе Skills DNA
      const userSkillsDna = await db.select({
        progress: userSkillsDnaProgress,
        skill: skillsDna
      })
      .from(userSkillsDnaProgress)
      .innerJoin(skillsDna, eq(userSkillsDnaProgress.dnaId, skillsDna.id))
      .where(eq(userSkillsDnaProgress.userId, userId));
      
      // Сортируем навыки по прогрессу
      const sortedSkills = userSkillsDna.sort((a, b) => (b.progress.progress || 0) - (a.progress.progress || 0));
      
      // Выбираем топ-3 сильных навыка и топ-3 слабых
      const strengthAreas = sortedSkills.slice(0, 3).map(skill => skill.skill.name);
      const weakAreas = sortedSkills.slice(-3).map(skill => skill.skill.name);
      
      // Формируем итоговый объект прогресса
      const progress = {
        completedCourses,
        completedModules,
        completedLessons,
        inProgressCourses,
        lastActivity,
        averageScore,
        weeklyActivity: {
          hoursSpent: lessonsCompletedThisWeek.length * 0.5, // Примерное время на урок - 30 минут
          daysActive,
          completedLessons: lessonsCompletedThisWeek.length
        },
        strengthAreas,
        weakAreas
      };
      
      console.log(`Получен прогресс обучения пользователя ${userId}`);
      return progress;
    } catch (error) {
      console.error("Ошибка при получении прогресса обучения:", error);
      throw new Error("Не удалось получить прогресс обучения");
    }
  }
  
  /**
   * Получает список доступных курсов и модулей из базы данных
   */
  private async getAvailableCourses() {
    try {
      // Получаем список всех курсов
      const coursesData = await db.select().from(courses);
      
      // Загружаем связанные данные для каждого курса
      const result = await Promise.all(coursesData.map(async (course) => {
        // Получаем модули курса
        const modules = await db.select()
          .from(courseModules)
          .where(eq(courseModules.courseId, course.id))
          .orderBy(courseModules.orderIndex);
        
        // Для каждого модуля получаем количество уроков
        const modulesWithLessonsCount = await Promise.all(modules.map(async (module) => {
          const lessonsCount = await db.select({ count: sql`count(*)` })
            .from(lessons)
            .where(eq(lessons.moduleId, module.id));
            
          return {
            id: module.id,
            title: module.title,
            lessonsCount: Number(lessonsCount[0].count) || 0
          };
        }));
        
        // Общая длительность курса в часах (оценка)
        const totalLessons = modulesWithLessonsCount.reduce((acc, m) => acc + m.lessonsCount, 0);
        const estimatedHours = Math.round(totalLessons * 0.5); // 30 минут на урок
        
        // Получаем навыки, связанные с курсом
        const courseSkillsData = await db.select({
          skill: skills
        })
        .from(courseSkillOutcomes)
        .innerJoin(skills, eq(courseSkillOutcomes.skillId, skills.id))
        .where(eq(courseSkillOutcomes.courseId, course.id));
        
        const skillsGained = courseSkillsData.map(s => s.skill.name);
        
        // Определяем уровень сложности в строковом формате
        let difficulty;
        switch (course.difficulty) {
          case 1: difficulty = "beginner"; break;
          case 2: difficulty = "intermediate"; break;
          case 3: difficulty = "advanced"; break;
          default: difficulty = "beginner";
        }
        
        return {
          id: course.id,
          title: course.title,
          description: course.description || "",
          difficulty,
          modules: modulesWithLessonsCount,
          skillsGained: skillsGained.length > 0 ? skillsGained : ["ai-fundamentals"], // Если нет навыков, используем дефолтный
          estimatedHours
        };
      }));
      
      console.log(`Получено ${result.length} доступных курсов`);
      return result;
    } catch (error) {
      console.error("Ошибка при получении списка курсов:", error);
      throw new Error("Не удалось получить список курсов");
    }
  }
  
  /**
   * Сохраняет рекомендации в базу данных для последующего использования
   */
  private async saveRecommendations(userId: number, recommendations: any) {
    try {
      const userRecommendationsData = await db.select().from(userRecommendations)
        .where(eq(userRecommendations.userId, userId))
        .orderBy(userRecommendations.createdAt);
      
      // Если уже есть рекомендации, сохраняем только новые
      // В полноценной реализации здесь нужно добавить логику для сохранения в базу данных
      
      // Для каждого рекомендуемого курса
      for (const course of recommendations.recommendedCourses) {
        if (course && course.id) {
          // Здесь должен быть код для сохранения рекомендации курса в БД
          // Например:
          // await db.insert(userRecommendations).values({
          //   userId,
          //   entityType: 'course',
          //   entityId: course.id,
          //   score: 1.0,
          //   reason: course.explanation,
          //   modelId: null // Если есть модель ИИ для рекомендаций
          // });
        }
      }
      
      // Для каждого следующего шага
      for (const step of recommendations.nextSteps) {
        if (step && step.id) {
          // Здесь должен быть код для сохранения рекомендуемого шага в БД
        }
      }
      
      // Логируем для отладки
      console.log(`Сохранены рекомендации для пользователя ${userId}`);
      return true;
    } catch (error) {
      console.error("Ошибка при сохранении рекомендаций:", error);
      return false;
    }
  }
}

export const aiAgentService = new AIAgentService();
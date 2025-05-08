/**
 * skill-probe-service.ts
 * Сервис для работы с 5-минутными тестами для проверки навыков (SKILL-PROBE)
 */

import { db } from '../db';
import { 
  skillProbes, 
  skillProbeResults, 
  skillProbeRecommendations,
  skills,
  userSkills,
  skillsDna,
  courses,
  courseModules,
  lessons,
  users
} from '@shared/schema';
import { eq, and, desc, gt, lt, between, or, inArray } from 'drizzle-orm';
import { skillGraphService } from './skill-graph-service';

/**
 * Интерфейс для создания SkillProbe теста
 */
interface CreateSkillProbeOptions {
  title: string;
  description: string;
  skillId?: number;
  dnaId?: number;
  probeType: 'multiple_choice' | 'coding' | 'fill_blanks' | 'matching' | 'practical';
  difficulty: 'basic' | 'intermediate' | 'advanced' | 'expert';
  estimatedTimeMinutes?: number;
  passingScore?: number;
  questions: any[]; // Массив вопросов и ответов в JSON формате
}

/**
 * Интерфейс для ответа пользователя на SkillProbe тест
 */
interface SubmitProbeAnswersOptions {
  userId: number;
  probeId: number;
  answers: any[]; // Массив ответов пользователя в JSON формате
  startedAt: Date;
  completedAt: Date;
  timeSpentSeconds?: number;
}

/**
 * Результат оценивания ответов на SkillProbe тест
 */
interface ProbeEvaluationResult {
  score: number; // Процент правильных ответов (0-100)
  passStatus: boolean; // Пройден или не пройден
  feedback: string; // Обратная связь
  updatedSkill?: {
    skillId: number;
    previousLevel: number;
    newLevel: number;
    xpGained: number;
  };
  recommendations?: {
    type: string;
    entityId: number;
    title: string;
    reason: string;
    priority: number;
  }[];
}

/**
 * Сервис для работы с функциональностью SkillProbe (5-минутные тесты навыков)
 */
class SkillProbeService {
  /**
   * Создает новый SkillProbe тест
   * @param options Параметры для создания теста
   * @returns Созданный тест
   */
  async createProbe(options: CreateSkillProbeOptions) {
    try {
      // Проверяем, что указан хотя бы один из ID: skillId или dnaId
      if (!options.skillId && !options.dnaId) {
        throw new Error('Необходимо указать хотя бы один из параметров: skillId или dnaId');
      }

      // Проверяем, что массив вопросов не пустой
      if (!options.questions || options.questions.length === 0) {
        throw new Error('Массив вопросов не может быть пустым');
      }

      // Создаем новый тест
      const [probe] = await db
        .insert(skillProbes)
        .values({
          title: options.title,
          description: options.description,
          skillId: options.skillId,
          dnaId: options.dnaId,
          probeType: options.probeType,
          difficulty: options.difficulty,
          estimatedTimeMinutes: options.estimatedTimeMinutes || 5,
          passingScore: options.passingScore || 70,
          questions: options.questions,
        })
        .returning();

      console.log(`[SkillProbeService] Создан новый тест: ${probe.id} - ${probe.title}`);
      return probe;
    } catch (error) {
      console.error('[SkillProbeService] Ошибка при создании теста:', error);
      throw error;
    }
  }

  /**
   * Получает список доступных тестов для конкретного навыка или компетенции
   * @param options Параметры фильтрации
   * @returns Список тестов
   */
  async getProbes({ 
    skillId, 
    dnaId, 
    difficulty, 
    limit = 10, 
    offset = 0 
  }: { 
    skillId?: number; 
    dnaId?: number; 
    difficulty?: string; 
    limit?: number; 
    offset?: number 
  }) {
    try {
      let query = db.select().from(skillProbes);

      // Применяем фильтры
      if (skillId) {
        query = query.where(eq(skillProbes.skillId, skillId));
      }

      if (dnaId) {
        query = query.where(eq(skillProbes.dnaId, dnaId));
      }

      if (difficulty) {
        query = query.where(eq(skillProbes.difficulty, difficulty as any));
      }

      // Применяем пагинацию
      const probes = await query.limit(limit).offset(offset);

      return probes;
    } catch (error) {
      console.error('[SkillProbeService] Ошибка при получении списка тестов:', error);
      throw error;
    }
  }

  /**
   * Получает информацию о конкретном тесте
   * @param probeId ID теста
   * @returns Данные теста
   */
  async getProbeById(probeId: number) {
    try {
      const [probe] = await db
        .select()
        .from(skillProbes)
        .where(eq(skillProbes.id, probeId));

      if (!probe) {
        throw new Error(`Тест с ID ${probeId} не найден`);
      }

      // Получаем дополнительную информацию о связанном навыке и компетенции
      let skillInfo = null;
      let dnaInfo = null;

      if (probe.skillId) {
        const [skill] = await db
          .select()
          .from(skills)
          .where(eq(skills.id, probe.skillId));
        
        skillInfo = skill;
      }

      if (probe.dnaId) {
        const [dna] = await db
          .select()
          .from(skillsDna)
          .where(eq(skillsDna.id, probe.dnaId));
        
        dnaInfo = dna;
      }

      return {
        ...probe,
        skillInfo,
        dnaInfo
      };
    } catch (error) {
      console.error(`[SkillProbeService] Ошибка при получении теста ${probeId}:`, error);
      throw error;
    }
  }

  /**
   * Обрабатывает ответы пользователя на тест и вычисляет результат
   * @param options Параметры с ответами пользователя
   * @returns Результат оценивания ответов
   */
  async submitProbeAnswers(options: SubmitProbeAnswersOptions): Promise<ProbeEvaluationResult> {
    try {
      const { userId, probeId, answers, startedAt, completedAt, timeSpentSeconds } = options;
      
      // 1. Получаем данные о тесте
      const probe = await this.getProbeById(probeId);
      
      if (!probe) {
        throw new Error(`Тест с ID ${probeId} не найден`);
      }
      
      // 2. Оцениваем ответы пользователя
      const evaluationResult = this.evaluateAnswers(probe.questions, answers);
      
      // 3. Определяем, пройден ли тест
      const passingScore = probe.passingScore || 70;
      const passStatus = evaluationResult.score >= passingScore;
      
      // 4. Получаем текущий уровень навыка пользователя (если тест связан с навыком)
      let skillLevelBefore = 0;
      let skillLevelAfter = 0;
      let skillUpdateResult = null;
      
      if (probe.skillId) {
        const [userSkill] = await db
          .select()
          .from(userSkills)
          .where(
            and(
              eq(userSkills.userId, userId),
              eq(userSkills.skillId, probe.skillId)
            )
          );
          
        skillLevelBefore = userSkill?.level || 0;
        
        // 5. Обновляем уровень навыка пользователя, если тест пройден
        if (passStatus) {
          // Рассчитываем прирост уровня навыка в зависимости от сложности и результата
          const difficultyMultiplier = {
            'basic': 1,
            'intermediate': 1.5,
            'advanced': 2,
            'expert': 3
          }[probe.difficulty] || 1;
          
          // Прирост уровня: от 1 до 5 единиц в зависимости от сложности и результата
          const levelIncrease = Math.ceil((evaluationResult.score / 100) * difficultyMultiplier * 5);
          // Опыт: от 10 до 50 XP в зависимости от сложности и результата
          const xpGained = Math.ceil((evaluationResult.score / 100) * difficultyMultiplier * 50);
          
          // Обновляем навык через сервис графа навыков
          skillUpdateResult = await skillGraphService.updateSkill(
            userId,
            probe.skillId,
            levelIncrease,
            xpGained
          );
          
          skillLevelAfter = skillUpdateResult.newLevel;
        } else {
          skillLevelAfter = skillLevelBefore;
        }
      }
      
      // 6. Сохраняем результат в базу данных
      const [result] = await db
        .insert(skillProbeResults)
        .values({
          userId,
          probeId,
          score: evaluationResult.score,
          passStatus,
          answers: options.answers,
          startedAt,
          completedAt,
          timeSpentSeconds: timeSpentSeconds || Math.floor((completedAt.getTime() - startedAt.getTime()) / 1000),
          skillLevelBefore,
          skillLevelAfter,
          feedback: evaluationResult.feedback
        })
        .returning();
        
      // 7. Генерируем рекомендации на основе результатов
      const recommendations = await this.generateRecommendations({
        userId,
        probeId,
        resultId: result.id,
        score: evaluationResult.score,
        passStatus,
        skillId: probe.skillId,
        dnaId: probe.dnaId
      });
      
      // 8. Формируем итоговый результат
      const finalResult: ProbeEvaluationResult = {
        score: evaluationResult.score,
        passStatus,
        feedback: evaluationResult.feedback,
        recommendations
      };
      
      // Добавляем информацию об обновлении навыка, если она есть
      if (skillUpdateResult) {
        finalResult.updatedSkill = {
          skillId: probe.skillId!,
          previousLevel: skillUpdateResult.previousLevel,
          newLevel: skillUpdateResult.newLevel,
          xpGained: skillUpdateResult.xpGained
        };
      }
      
      return finalResult;
    } catch (error) {
      console.error('[SkillProbeService] Ошибка при обработке ответов на тест:', error);
      throw error;
    }
  }

  /**
   * Оценивает ответы пользователя на вопросы теста
   * @param questions Вопросы теста с правильными ответами
   * @param userAnswers Ответы пользователя
   * @returns Результат оценивания
   */
  private evaluateAnswers(questions: any[], userAnswers: any[]): { score: number; feedback: string } {
    // Создаем карту ответов пользователя для быстрого доступа
    const userAnswersMap = new Map();
    userAnswers.forEach(answer => {
      userAnswersMap.set(answer.questionId, answer);
    });
    
    let correctCount = 0;
    let totalQuestions = questions.length;
    let detailedFeedback = [];
    
    // Проверяем каждый вопрос
    for (const question of questions) {
      const userAnswer = userAnswersMap.get(question.id);
      
      // Если пользователь не ответил на вопрос
      if (!userAnswer) {
        detailedFeedback.push(`Вопрос ${question.id}: Нет ответа`);
        continue;
      }
      
      let isCorrect = false;
      
      // Проверяем правильность ответа в зависимости от типа вопроса
      switch (question.type) {
        case 'multiple_choice':
          // Для вопросов с множественным выбором
          if (Array.isArray(userAnswer.answer) && Array.isArray(question.correctAnswer)) {
            // Проверяем, все ли правильные ответы выбраны и нет ли лишних
            const correctAnswerSet = new Set(question.correctAnswer);
            const userAnswerSet = new Set(userAnswer.answer);
            
            isCorrect = 
              // Все правильные ответы выбраны
              question.correctAnswer.every(answer => userAnswerSet.has(answer)) &&
              // Нет лишних ответов
              userAnswer.answer.every(answer => correctAnswerSet.has(answer));
          } else {
            // Для одиночного выбора
            isCorrect = userAnswer.answer === question.correctAnswer;
          }
          break;
          
        case 'fill_blanks':
          // Для заполнения пропусков - ответ должен совпадать точно
          isCorrect = userAnswer.answer === question.correctAnswer;
          break;
          
        case 'matching':
          // Для сопоставления - проверяем все пары
          if (typeof userAnswer.answer === 'object' && typeof question.correctAnswer === 'object') {
            const userMatches = userAnswer.answer;
            const correctMatches = question.correctAnswer;
            
            isCorrect = Object.keys(correctMatches).every(key => 
              userMatches[key] === correctMatches[key]
            );
          }
          break;
          
        case 'coding':
        case 'practical':
          // Для кодовых заданий может потребоваться более сложная логика или API
          // Здесь используем простое сравнение, но в реальной системе нужна проверка выполнения
          isCorrect = userAnswer.answer === question.correctAnswer;
          break;
          
        default:
          isCorrect = false;
      }
      
      if (isCorrect) {
        correctCount++;
        detailedFeedback.push(`Вопрос ${question.id}: Верно`);
      } else {
        detailedFeedback.push(`Вопрос ${question.id}: Неверно. Правильный ответ: ${JSON.stringify(question.correctAnswer)}`);
      }
    }
    
    // Вычисляем итоговый процент
    const score = Math.round((correctCount / totalQuestions) * 100);
    
    // Формируем обратную связь
    let generalFeedback = '';
    
    if (score >= 90) {
      generalFeedback = 'Отличный результат! Вы демонстрируете глубокое понимание темы.';
    } else if (score >= 70) {
      generalFeedback = 'Хороший результат! Вы достаточно хорошо разбираетесь в теме, но есть возможности для улучшения.';
    } else if (score >= 50) {
      generalFeedback = 'Удовлетворительный результат. Рекомендуем повторить материал по темам с неправильными ответами.';
    } else {
      generalFeedback = 'Результат ниже ожидаемого. Рекомендуем пройти обучающие материалы для улучшения понимания темы.';
    }
    
    const feedback = `${generalFeedback}\n\nДетальный анализ:\n${detailedFeedback.join('\n')}`;
    
    return { score, feedback };
  }

  /**
   * Генерирует рекомендации на основе результатов теста
   */
  private async generateRecommendations({ 
    userId, 
    probeId, 
    resultId, 
    score, 
    passStatus, 
    skillId, 
    dnaId 
  }: { 
    userId: number; 
    probeId: number; 
    resultId: number; 
    score: number; 
    passStatus: boolean; 
    skillId?: number; 
    dnaId?: number 
  }) {
    const recommendations: any[] = [];
    
    try {
      // Если тест не пройден, рекомендуем курсы и уроки по теме
      if (!passStatus) {
        // Поиск курсов и уроков, связанных с навыком или компетенцией
        let relevantCourses = [];
        let relevantLessons = [];
        
        if (skillId) {
          // Находим курсы, которые развивают данный навык
          const coursesWithSkill = await db
            .select({
              courseId: courses.id,
              courseTitle: courses.title,
              courseLevel: courses.level
            })
            .from(courses)
            .innerJoin(courseSkillOutcomes, eq(courseSkillOutcomes.courseId, courses.id))
            .where(eq(courseSkillOutcomes.skillId, skillId))
            .limit(3);
            
          relevantCourses = coursesWithSkill;
        }
        
        if (dnaId) {
          // Находим уроки, связанные с данной компетенцией
          const lessonsWithDna = await db
            .select({
              lessonId: lessons.id,
              lessonTitle: lessons.title,
              moduleId: lessons.moduleId
            })
            .from(lessons)
            .innerJoin(lessonSkillsDna, eq(lessonSkillsDna.lessonId, lessons.id))
            .where(eq(lessonSkillsDna.dnaId, dnaId))
            .limit(5);
            
          relevantLessons = lessonsWithDna;
        }
        
        // Сохраняем рекомендации в базу данных и формируем ответ
        for (const course of relevantCourses) {
          const [recommendation] = await db
            .insert(skillProbeRecommendations)
            .values({
              resultId,
              userId,
              recommendationType: 'course',
              entityId: course.courseId,
              reason: `Этот курс поможет улучшить навыки, которые вы проверяли в тесте.`,
              priority: 1,
            })
            .returning();
            
          recommendations.push({
            id: recommendation.id,
            type: 'course',
            entityId: course.courseId,
            title: course.courseTitle,
            reason: `Этот курс поможет улучшить навыки, которые вы проверяли в тесте.`,
            priority: 1
          });
        }
        
        for (const lesson of relevantLessons) {
          const [recommendation] = await db
            .insert(skillProbeRecommendations)
            .values({
              resultId,
              userId,
              recommendationType: 'lesson',
              entityId: lesson.lessonId,
              reason: `Этот урок охватывает компетенции, которые требуют улучшения.`,
              priority: 2,
            })
            .returning();
            
          recommendations.push({
            id: recommendation.id,
            type: 'lesson',
            entityId: lesson.lessonId,
            title: lesson.lessonTitle,
            reason: `Этот урок охватывает компетенции, которые требуют улучшения.`,
            priority: 2
          });
        }
      }
      
      // Если тест пройден успешно, рекомендуем более сложные тесты или курсы
      else if (score > 85) {
        // Находим тесты повышенной сложности по той же теме
        const advancedProbes = await db
          .select()
          .from(skillProbes)
          .where(
            and(
              or(
                skillId ? eq(skillProbes.skillId, skillId) : undefined,
                dnaId ? eq(skillProbes.dnaId, dnaId) : undefined
              ),
              or(
                eq(skillProbes.difficulty, 'advanced'),
                eq(skillProbes.difficulty, 'expert')
              ),
              // Исключаем текущий тест
              skillProbes.id !== probeId
            )
          )
          .limit(2);
          
        for (const probe of advancedProbes) {
          const [recommendation] = await db
            .insert(skillProbeRecommendations)
            .values({
              resultId,
              userId,
              recommendationType: 'skill_probe',
              entityId: probe.id,
              reason: `Вы отлично справились! Попробуйте более сложный тест для проверки своих навыков.`,
              priority: 1,
            })
            .returning();
            
          recommendations.push({
            id: recommendation.id,
            type: 'skill_probe',
            entityId: probe.id,
            title: probe.title,
            reason: `Вы отлично справились! Попробуйте более сложный тест для проверки своих навыков.`,
            priority: 1
          });
        }
      }
    } catch (error) {
      console.error('[SkillProbeService] Ошибка при генерации рекомендаций:', error);
    }
    
    return recommendations;
  }

  /**
   * Получает историю прохождения тестов пользователем
   * @param userId ID пользователя
   * @param limit Лимит записей
   * @param offset Смещение для пагинации
   * @returns История прохождения тестов
   */
  async getUserProbeHistory(userId: number, limit = 10, offset = 0) {
    try {
      const results = await db
        .select({
          id: skillProbeResults.id,
          probeId: skillProbeResults.probeId,
          score: skillProbeResults.score,
          passStatus: skillProbeResults.passStatus,
          completedAt: skillProbeResults.completedAt,
          timeSpentSeconds: skillProbeResults.timeSpentSeconds,
          skillLevelBefore: skillProbeResults.skillLevelBefore,
          skillLevelAfter: skillProbeResults.skillLevelAfter,
          probeTitle: skillProbes.title,
          probeType: skillProbes.probeType,
          probeDifficulty: skillProbes.difficulty,
        })
        .from(skillProbeResults)
        .innerJoin(skillProbes, eq(skillProbeResults.probeId, skillProbes.id))
        .where(eq(skillProbeResults.userId, userId))
        .orderBy(desc(skillProbeResults.completedAt))
        .limit(limit)
        .offset(offset);
        
      return results;
    } catch (error) {
      console.error(`[SkillProbeService] Ошибка при получении истории тестов для пользователя ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Получает рекомендации для пользователя на основе результатов тестов
   * @param userId ID пользователя
   * @param limit Лимит записей
   * @returns Список рекомендаций
   */
  async getUserRecommendations(userId: number, limit = 5) {
    try {
      const recommendations = await db
        .select()
        .from(skillProbeRecommendations)
        .where(
          and(
            eq(skillProbeRecommendations.userId, userId),
            eq(skillProbeRecommendations.followed, false)
          )
        )
        .orderBy(desc(skillProbeRecommendations.createdAt))
        .limit(limit);
        
      // Обогащаем рекомендации дополнительной информацией
      const enrichedRecommendations = await Promise.all(
        recommendations.map(async (rec) => {
          let entityDetails = null;
          
          switch (rec.recommendationType) {
            case 'course':
              const [course] = await db
                .select()
                .from(courses)
                .where(eq(courses.id, rec.entityId));
              entityDetails = course;
              break;
              
            case 'lesson':
              const [lesson] = await db
                .select({
                  ...lessons,
                  moduleName: courseModules.title,
                  courseId: courseModules.courseId,
                  courseName: courses.title,
                })
                .from(lessons)
                .innerJoin(courseModules, eq(lessons.moduleId, courseModules.id))
                .innerJoin(courses, eq(courseModules.courseId, courses.id))
                .where(eq(lessons.id, rec.entityId));
              entityDetails = lesson;
              break;
              
            case 'skill_probe':
              const [probe] = await db
                .select()
                .from(skillProbes)
                .where(eq(skillProbes.id, rec.entityId));
              entityDetails = probe;
              break;
          }
          
          return {
            ...rec,
            entityDetails
          };
        })
      );
      
      return enrichedRecommendations;
    } catch (error) {
      console.error(`[SkillProbeService] Ошибка при получении рекомендаций для пользователя ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Отмечает рекомендацию как выполненную
   * @param recommendationId ID рекомендации
   * @param userId ID пользователя (для проверки прав)
   * @returns Обновленная рекомендация
   */
  async markRecommendationAsFollowed(recommendationId: number, userId: number) {
    try {
      const [recommendation] = await db
        .select()
        .from(skillProbeRecommendations)
        .where(
          and(
            eq(skillProbeRecommendations.id, recommendationId),
            eq(skillProbeRecommendations.userId, userId)
          )
        );
        
      if (!recommendation) {
        throw new Error(`Рекомендация с ID ${recommendationId} не найдена для пользователя ${userId}`);
      }
      
      const [updatedRecommendation] = await db
        .update(skillProbeRecommendations)
        .set({ followed: true })
        .where(eq(skillProbeRecommendations.id, recommendationId))
        .returning();
        
      return updatedRecommendation;
    } catch (error) {
      console.error(`[SkillProbeService] Ошибка при отметке рекомендации ${recommendationId} как выполненной:`, error);
      throw error;
    }
  }
}

// Экспортируем экземпляр сервиса
export const skillProbeService = new SkillProbeService();
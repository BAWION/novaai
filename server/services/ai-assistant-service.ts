/**
 * Сервис AI-ассистента для персонализированной помощи пользователям
 * Использует OpenAI API для генерации ответов на основе данных пользователя
 */

import OpenAI from "openai";
import { db } from "../db";
import { eq, desc, and } from "drizzle-orm";
import {
  users,
  userProfiles,
  userSkills,
  skills,
  userCourseProgress,
  courses,
  userSkillGaps,
  learningEvents
} from "@shared/schema";

class AIAssistantService {
  private openai: OpenAI;
  
  constructor() {
    // Инициализируем клиент OpenAI API
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY not found in environment variables");
    }

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    console.log("OpenAI API client initialized successfully");
  }

  /**
   * Получить ответ от AI-ассистента на основе вопроса пользователя
   * и его данных
   */
  async getAssistantResponse(userId: number, question: string): Promise<string> {
    try {
      // Собираем контекст о пользователе
      const context = await this.buildUserContext(userId);
      
      // Формируем запрос к OpenAI
      const prompt = this.buildPrompt(question, context);
      
      // Отправляем запрос к модели gpt-4o
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // используем самую новую модель gpt-4o
        messages: [
          { 
            role: "system", 
            content: `Ты AI-ассистент образовательной платформы NovaAI University. Помогай в обучении, объясняй темы. Будь кратким, дружелюбным и точным. Отвечай на русском. Контекст пользователя: ${prompt.systemContext}`
          },
          { role: "user", content: prompt.userMessage }
        ],
        temperature: 0.7,
        max_tokens: 800,
      });
      
      // Возвращаем ответ от модели
      return response.choices[0].message.content || "Извините, не удалось получить ответ.";
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      return "Произошла ошибка при получении ответа от ассистента. Пожалуйста, попробуйте позже.";
    }
  }
  
  /**
   * Получить проактивную подсказку на основе пробелов в знаниях пользователя
   */
  async getProactiveHint(userId: number): Promise<string> {
    try {
      // Собираем контекст о пользователе, фокусируясь на пробелах в знаниях
      const context = await this.buildUserContext(userId);
      
      // Если у пользователя нет пробелов, возвращаем общую подсказку
      if (!context.skillGaps || context.skillGaps.length === 0) {
        return await this.getGeneralHint(userId);
      }
      
      // Формируем запрос к OpenAI для проактивной подсказки
      const prompt = `Пробелы в навыках: ${JSON.stringify(context.skillGaps)}
      Текущие курсы: ${JSON.stringify(context.currentCourses)}
      
      Дай короткую мотивирующую подсказку для заполнения самого приоритетного пробела.
      Начни с "Я заметил, что...". Без ID и технических деталей.`;
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // используем самую новую модель gpt-4o
        messages: [
          { 
            role: "system", 
            content: `Ты AI-ассистент NovaAI University. Давай короткие, мотивирующие подсказки на русском языке.`
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 250,
      });
      
      return response.choices[0].message.content || "Я заметил, что вы сделали большой прогресс в обучении. Продолжайте в том же духе!";
    } catch (error) {
      console.error("Error generating proactive hint:", error);
      return "Я заметил, что регулярная практика помогает быстрее осваивать новые навыки. Рекомендую ежедневно уделять хотя бы 30 минут обучению.";
    }
  }
  
  /**
   * Получить персонализированное объяснение сложной темы
   */
  async getPersonalizedExplanation(userId: number, topicId: string, difficulty: string = "medium"): Promise<string> {
    try {
      // Собираем контекст о пользователе
      const context = await this.buildUserContext(userId);
      
      // Получаем информацию о теме
      const topic = await this.getTopicInfo(topicId);
      
      // Формируем запрос к OpenAI
      const prompt = `Объясни тему "${topic.title}". 
      Тема: ${JSON.stringify(topic)}
      
      Уровень: ${context.profile?.pythonLevel || "начинающий"}
      Опыт: ${context.profile?.experience || "learning-basics"}
      Стиль: ${context.profile?.preferredLearningStyle || "visual"}
      Сложность: ${difficulty}
      
      Используй примеры и аналогии.`;
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // используем самую новую модель gpt-4o
        messages: [
          { 
            role: "system", 
            content: `Ты AI-ассистент NovaAI University. Объясняй сложные темы, учитывая уровень пользователя. Используй примеры и аналогии. Отвечай на русском языке.`
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1200,
      });
      
      return response.choices[0].message.content || "Извините, не удалось получить объяснение. Пожалуйста, попробуйте позже.";
    } catch (error) {
      console.error("Error generating personalized explanation:", error);
      return "Произошла ошибка при получении объяснения. Пожалуйста, попробуйте позже.";
    }
  }
  
  /**
   * Получить общую подсказку для пользователя
   */
  private async getGeneralHint(userId: number): Promise<string> {
    try {
      // Собираем базовый контекст о пользователе
      const context = await this.buildUserContext(userId);
      
      // Формируем запрос к OpenAI для общей подсказки
      const prompt = `Профиль: ${JSON.stringify(context.profile)}
      Дай мотивирующий совет по обучению, начни с "Я заметил, что..."`;
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // используем самую новую модель gpt-4o
        messages: [
          { 
            role: "system", 
            content: `Ты AI-ассистент NovaAI University. Давай краткие, мотивирующие советы по обучению на русском языке.`
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 150,
      });
      
      return response.choices[0].message.content || "Я заметил, что регулярная практика помогает быстрее осваивать новые навыки. Рекомендую ежедневно уделять хотя бы 30 минут обучению.";
    } catch (error) {
      console.error("Error generating general hint:", error);
      return "Я заметил, что регулярная практика помогает быстрее осваивать новые навыки. Рекомендую ежедневно уделять хотя бы 30 минут обучению.";
    }
  }
  
  /**
   * Собрать контекст о пользователе для персонализации ответов
   */
  private async buildUserContext(userId: number) {
    try {
      // Получаем информацию о пользователе
      const user = await db.query.users.findFirst({
        where: eq(users.id, userId)
      });
      
      // Получаем профиль пользователя
      const profile = await db.query.userProfiles.findFirst({
        where: eq(userProfiles.userId, userId)
      });
      
      // Получаем текущие навыки пользователя
      const userSkillsData = await db
        .select()
        .from(userSkills)
        .where(eq(userSkills.userId, userId));
      
      // Получаем информацию о навыках
      const skillsData = userSkillsData.length > 0
        ? await db
            .select()
            .from(skills)
            .where(
              eq(skills.id, userSkillsData[0].skillId)
            )
        : [];
      
      // Создаем карту навыков
      const skillsMap = new Map();
      for (const skill of skillsData) {
        skillsMap.set(skill.id, skill);
      }
      
      // Форматируем навыки пользователя с добавлением имен
      const formattedUserSkills = userSkillsData.map(userSkill => ({
        ...userSkill,
        skillName: skillsMap.get(userSkill.skillId)?.name || `Навык #${userSkill.skillId}`
      }));
      
      // Получаем пробелы в знаниях пользователя
      const skillGaps = await db
        .select()
        .from(userSkillGaps)
        .where(eq(userSkillGaps.userId, userId))
        .orderBy(desc(userSkillGaps.priority));
      
      // Форматируем пробелы с добавлением имен навыков
      const formattedSkillGaps = skillGaps.map(gap => ({
        ...gap,
        skillName: skillsMap.get(gap.skillId)?.name || `Навык #${gap.skillId}`
      }));
      
      // Получаем прогресс пользователя по курсам
      const courseProgress = await db
        .select()
        .from(userCourseProgress)
        .where(eq(userCourseProgress.userId, userId));
      
      // Получаем курсы, которые проходит пользователь
      const userCourses = courseProgress.length > 0
        ? await db
            .select()
            .from(courses)
            .where(
              eq(courses.id, courseProgress[0].courseId)
            )
        : [];
      
      // Форматируем курсы с добавлением прогресса
      const formattedCourses = userCourses.map(course => {
        const progress = courseProgress.find(p => p.courseId === course.id);
        return {
          ...course,
          progress: progress?.progress || 0,
          completedModules: progress?.completedModules || 0
        };
      });
      
      // Получаем последние события обучения
      const recentEvents = await db
        .select()
        .from(learningEvents)
        .where(eq(learningEvents.userId, userId))
        .orderBy(desc(learningEvents.timestamp))
        .limit(10);
      
      // Разделяем курсы на текущие и завершенные
      const currentCourses = formattedCourses.filter(c => c.progress < 100);
      const completedCourses = formattedCourses.filter(c => c.progress === 100);
      
      // Возвращаем собранный контекст
      return {
        user,
        profile,
        userSkills: formattedUserSkills,
        skillGaps: formattedSkillGaps,
        currentCourses,
        completedCourses,
        recentEvents
      };
    } catch (error) {
      console.error("Error building user context:", error);
      return {
        user: null,
        profile: null,
        userSkills: [],
        skillGaps: [],
        currentCourses: [],
        completedCourses: [],
        recentEvents: []
      };
    }
  }
  
  /**
   * Строит промпт для OpenAI на основе вопроса пользователя и его контекста
   */
  private buildPrompt(question: string, context: any) {
    // Собираем сокращенный контекст для системного сообщения
    let systemContext = "";
    
    if (context.user) {
      systemContext += `Пользователь: ${context.user.displayName || context.user.username}\n`;
    }
    
    if (context.profile) {
      systemContext += `Профиль: Python=${context.profile.pythonLevel}, опыт=${context.profile.experience}, стиль=${context.profile.preferredLearningStyle}\n`;
    }
    
    if (context.userSkills && context.userSkills.length > 0) {
      const topSkills = context.userSkills
        .sort((a: any, b: any) => b.level - a.level)
        .slice(0, 3);
      
      systemContext += `Топ-навыки: ${topSkills.map((s: any) => `${s.skillName}=${s.level}`).join(', ')}\n`;
    }
    
    if (context.skillGaps && context.skillGaps.length > 0) {
      const topGaps = context.skillGaps
        .sort((a: any, b: any) => b.priority - a.priority)
        .slice(0, 2);
      
      systemContext += `Пробелы: ${topGaps.map((g: any) => g.skillName).join(', ')}\n`;
    }
    
    if (context.currentCourses && context.currentCourses.length > 0) {
      systemContext += `Текущие курсы: ${context.currentCourses.map((c: any) => c.title).join(', ')}\n`;
    }
    
    // Строим пользовательское сообщение
    const userMessage = `${question}`;
    
    return {
      systemContext,
      userMessage
    };
  }
  
  /**
   * Получает информацию о теме из базы данных
   * Временная реализация - в реальном приложении нужно будет добавить 
   * таблицу для тем и получать данные из нее
   */
  private async getTopicInfo(topicId: string): Promise<any> {
    // Временная реализация - возвращаем заглушки в зависимости от topicId
    const topics: Record<string, any> = {
      "python-basics": {
        title: "Основы Python",
        description: "Вводный курс по языку программирования Python",
        keywords: ["переменные", "типы данных", "условия", "циклы", "функции"],
        difficulty: "beginner"
      },
      "ml-algorithms": {
        title: "Алгоритмы машинного обучения",
        description: "Обзор основных алгоритмов машинного обучения",
        keywords: ["классификация", "регрессия", "кластеризация", "деревья решений", "SVM"],
        difficulty: "intermediate"
      },
      "deep-learning": {
        title: "Глубокое обучение",
        description: "Введение в нейронные сети и глубокое обучение",
        keywords: ["нейронные сети", "обратное распространение", "CNN", "RNN", "трансформеры"],
        difficulty: "advanced"
      },
      "ai-ethics": {
        title: "Этика ИИ",
        description: "Этические вопросы в разработке и применении искусственного интеллекта",
        keywords: ["предвзятость", "прозрачность", "объяснимость", "ответственность", "конфиденциальность"],
        difficulty: "intermediate"
      },
      "ai-law": {
        title: "Правовые основы ИИ",
        description: "Правовые аспекты использования технологий искусственного интеллекта",
        keywords: ["регулирование", "ответственность", "авторское право", "персональные данные", "GDPR"],
        difficulty: "intermediate"
      }
    };
    
    return topics[topicId] || {
      title: `Тема ${topicId}`,
      description: "Описание недоступно",
      keywords: [],
      difficulty: "beginner"
    };
  }

  /**
   * Контекстуальный ответ AI-ассистента на основе содержания урока
   */
  async getLessonContextualResponse(params: {
    lessonId: number;
    lessonTitle: string;
    lessonContent: string;
    currentSection?: string;
    userMessage: string;
    userSkillsLevel: 'beginner' | 'intermediate' | 'advanced';
    conversationHistory: Array<{
      type: 'user' | 'assistant';
      content: string;
      timestamp: string;
    }>;
  }): Promise<{
    message: string;
    context: string;
    suggestedQuestions?: string[];
  }> {
    try {
      const {
        lessonId,
        lessonTitle,
        lessonContent,
        currentSection,
        userMessage,
        userSkillsLevel,
        conversationHistory
      } = params;

      // Строим контекст для AI на основе урока
      const lessonContext = this.buildLessonContext(
        lessonTitle,
        lessonContent,
        currentSection,
        userSkillsLevel
      );

      // Формируем историю разговора
      const conversationContext = conversationHistory
        .slice(-5) // Берем последние 5 сообщений
        .map(msg => `${msg.type === 'user' ? 'Студент' : 'Ассистент'}: ${msg.content}`)
        .join('\n');

      // Создаем промпт для контекстуального ассистента
      const prompt = `Ты - персональный AI-ассистент для онлайн-обучения, специализирующийся на уроке "${lessonTitle}".

КОНТЕКСТ УРОКА:
${lessonContext}

${currentSection ? `ТЕКУЩИЙ РАЗДЕЛ: ${currentSection}` : ''}

УРОВЕНЬ СТУДЕНТА: ${userSkillsLevel === 'beginner' ? 'Новичок' : userSkillsLevel === 'intermediate' ? 'Средний уровень' : 'Продвинутый'}

${conversationContext ? `ИСТОРИЯ РАЗГОВОРА:\n${conversationContext}` : ''}

ВОПРОС СТУДЕНТА: ${userMessage}

ИНСТРУКЦИИ:
1. Отвечай на основе содержания урока
2. Адаптируй сложность объяснения под уровень студента
3. Используй примеры из урока или создавай аналогичные
4. Если вопрос выходит за рамки урока, мягко направь студента к материалу урока
5. Будь дружелюбным и поддерживающим
6. Если нужно, предложи дополнительные вопросы для понимания

Ответ должен быть на русском языке, конкретным и полезным.`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Ты - опытный преподаватель и AI-ассистент для онлайн-образования. Твоя задача - помочь студенту понять материал урока через персональные объяснения и ответы на вопросы."
          },
          {
            role: "user", 
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.7
      });

      const assistantMessage = response.choices[0]?.message?.content || 
        "Извините, не удалось сгенерировать ответ. Попробуйте переформулировать вопрос.";

      // Генерируем предложенные вопросы
      const suggestedQuestions = await this.generateSuggestedQuestions(
        lessonTitle,
        lessonContent,
        userSkillsLevel
      );

      return {
        message: assistantMessage,
        context: 'lesson_contextual',
        suggestedQuestions
      };

    } catch (error) {
      console.error('Error in getLessonContextualResponse:', error);
      throw new Error('Не удалось получить ответ от AI-ассистента');
    }
  }

  /**
   * Строит контекст урока для AI-ассистента
   */
  private buildLessonContext(
    lessonTitle: string, 
    lessonContent: string, 
    currentSection?: string,
    userLevel?: string
  ): string {
    // Извлекаем ключевые части содержания урока
    const contentSummary = lessonContent.length > 2000 
      ? lessonContent.substring(0, 2000) + "..." 
      : lessonContent;

    return `Урок: ${lessonTitle}
${currentSection ? `Текущий раздел: ${currentSection}` : ''}

Основное содержание урока:
${contentSummary}

Уровень сложности для студента: ${userLevel || 'не указан'}`;
  }

  /**
   * Генерирует предложенные вопросы на основе содержания урока
   */
  private async generateSuggestedQuestions(
    lessonTitle: string,
    lessonContent: string, 
    userLevel: string
  ): Promise<string[]> {
    try {
      const prompt = `На основе урока "${lessonTitle}" сгенерируй 3 полезных вопроса для студента уровня "${userLevel}".

Содержание урока (первые 1000 символов):
${lessonContent.substring(0, 1000)}

Вопросы должны быть:
- Релевантными к содержанию урока
- Подходящими для уровня студента
- Помогающими углубить понимание

Верни только список вопросов, по одному на строку, без номеров.`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        temperature: 0.6
      });

      const questions = response.choices[0]?.message?.content
        ?.split('\n')
        .filter(q => q.trim().length > 0)
        .slice(0, 3) || [];

      return questions;
    } catch (error) {
      console.error('Error generating suggested questions:', error);
      return [
        "Можете объяснить это подробнее?",
        "Как это применяется на практике?", 
        "Что самое важное в этой теме?"
      ];
    }
  }
}

// Создаем и экспортируем экземпляр сервиса
export const aiAssistantService = new AIAssistantService();
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
            content: `Ты AI-ассистент образовательной платформы NovaAI University. 
            Твоя задача - помогать пользователям в обучении, давать подсказки и объяснять сложные темы.
            Ты должен быть дружелюбным, полезным и давать точные ответы.
            Всегда отвечай на русском языке.
            
            Вот контекст о пользователе, который тебе нужно учитывать:
            ${prompt.systemContext}`
          },
          { role: "user", content: prompt.userMessage }
        ],
        temperature: 0.7,
        max_tokens: 1000,
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
      const prompt = `На основе анализа навыков пользователя были выявлены следующие пробелы:
      ${JSON.stringify(context.skillGaps)}
      
      А также пользователь изучает следующие курсы:
      ${JSON.stringify(context.currentCourses)}
      
      Сформулируй проактивную подсказку, которая поможет пользователю заполнить самый приоритетный пробел в знаниях.
      Подсказка должна быть конкретной, мотивирующей и содержать практический совет. 
      Начни с фразы "Я заметил, что...". Не упоминай технические детали и ID навыков.`;
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // используем самую новую модель gpt-4o
        messages: [
          { 
            role: "system", 
            content: `Ты AI-ассистент образовательной платформы NovaAI University.
            Твоя задача - предоставлять проактивные подсказки пользователям на основе анализа их навыков.
            Будь дружелюбным, мотивирующим и давай практические советы.
            Всегда отвечай на русском языке, кратко и по делу.`
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 300,
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
      const prompt = `Объясни тему "${topic.title}" с учетом уровня пользователя.
      
      Информация о теме:
      ${JSON.stringify(topic)}
      
      Информация о пользователе:
      - Уровень пользователя: ${context.profile?.pythonLevel || "начинающий"}
      - Опыт: ${context.profile?.experience || "learning-basics"}
      - Предпочитаемый стиль обучения: ${context.profile?.preferredLearningStyle || "visual"}
      
      Объяснение должно быть на уровне сложности: ${difficulty} (easy, medium, hard).
      Используй примеры и аналогии, которые будут понятны пользователю с его опытом.
      Если пользователь предпочитает визуальное обучение, используй больше метафор и описаний визуализаций.`;
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // используем самую новую модель gpt-4o
        messages: [
          { 
            role: "system", 
            content: `Ты AI-ассистент образовательной платформы NovaAI University.
            Твоя задача - объяснять сложные темы пользователям с учетом их уровня, опыта и предпочтений.
            Будь понятным, приводи примеры и используй аналогии.
            Всегда отвечай на русском языке.`
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
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
      const prompt = `Сформулируй полезную подсказку для пользователя, учитывая его профиль:
      ${JSON.stringify(context.profile)}
      
      Подсказка должна быть мотивирующей и содержать общий совет по обучению.
      Начни с фразы "Я заметил, что...".`;
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // используем самую новую модель gpt-4o
        messages: [
          { 
            role: "system", 
            content: `Ты AI-ассистент образовательной платформы NovaAI University.
            Твоя задача - предоставлять полезные подсказки пользователям.
            Будь дружелюбным, мотивирующим и давай практические советы.
            Всегда отвечай на русском языке, кратко и по делу.`
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 200,
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
    // Собираем контекст для системного сообщения
    let systemContext = "";
    
    if (context.user) {
      systemContext += `Имя пользователя: ${context.user.displayName || context.user.username}\n`;
    }
    
    if (context.profile) {
      systemContext += `Профиль пользователя:
      - Роль: ${context.profile.role}
      - Уровень Python: ${context.profile.pythonLevel}
      - Опыт: ${context.profile.experience}
      - Интересы: ${context.profile.interest}
      - Цель обучения: ${context.profile.goal}
      - Рекомендуемый трек: ${context.profile.recommendedTrack}
      - Предпочитаемый стиль обучения: ${context.profile.preferredLearningStyle}\n`;
    }
    
    if (context.userSkills && context.userSkills.length > 0) {
      systemContext += `Текущие навыки пользователя:\n`;
      context.userSkills.forEach((skill: any) => {
        systemContext += `- ${skill.skillName}: уровень ${skill.level}/100\n`;
      });
    }
    
    if (context.skillGaps && context.skillGaps.length > 0) {
      systemContext += `Пробелы в знаниях:\n`;
      context.skillGaps.forEach((gap: any) => {
        systemContext += `- ${gap.skillName}: текущий уровень ${gap.currentLevel}, желаемый уровень ${gap.desiredLevel}, приоритет ${gap.priority}/10\n`;
      });
    }
    
    if (context.currentCourses && context.currentCourses.length > 0) {
      systemContext += `Текущие курсы:\n`;
      context.currentCourses.forEach((course: any) => {
        systemContext += `- ${course.title}: прогресс ${course.progress}%, завершено модулей ${course.completedModules}\n`;
      });
    }
    
    if (context.completedCourses && context.completedCourses.length > 0) {
      systemContext += `Завершенные курсы:\n`;
      context.completedCourses.forEach((course: any) => {
        systemContext += `- ${course.title}\n`;
      });
    }
    
    // Строим пользовательское сообщение
    const userMessage = `${question}
    
    Дай мне подробный и персонализированный ответ, учитывая мои навыки, пробелы в знаниях и прогресс по курсам.`;
    
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
}

// Создаем и экспортируем экземпляр сервиса
export const aiAssistantService = new AIAssistantService();
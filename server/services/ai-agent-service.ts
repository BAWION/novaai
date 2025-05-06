import OpenAI from "openai";
import { db } from "../db";

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
      // Здесь должен быть запрос к базе данных для получения профиля
      // Упрощенная версия для демонстрации
      const profile = {
        id: userId,
        name: "Студент",
        role: "student",
        experience: "intermediate",
        interests: ["prompt-engineering", "generative-ai", "no-code-ai"],
        goals: ["create-ai-apps", "improve-skills"],
        preferredLearningStyle: "practical",
        completedCoursesCount: 2,
        completedLessonsCount: 15,
        skillLevel: {
          "ai-fundamentals": 0.7,
          "prompt-engineering": 0.4,
          "python": 0.6,
          "machine-learning": 0.3,
          "no-code-tools": 0.2
        }
      };
      
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
      // Здесь должен быть запрос к базе данных для получения прогресса
      // Упрощенная версия для демонстрации
      const progress = {
        completedCourses: [
          { id: 1, title: "AI Literacy 101", completedAt: "2025-04-15", score: 85 }
        ],
        completedModules: [
          { id: 1, courseId: 1, title: "Введение в ИИ", completedAt: "2025-04-10", score: 90 },
          { id: 2, courseId: 1, title: "Машинное обучение", completedAt: "2025-04-12", score: 82 },
          { id: 3, courseId: 1, title: "Нейронные сети", completedAt: "2025-04-15", score: 78 }
        ],
        completedLessons: [
          { id: 1, moduleId: 1, title: "Что такое ИИ", completedAt: "2025-04-08", score: 95 },
          { id: 2, moduleId: 1, title: "История развития ИИ", completedAt: "2025-04-09", score: 88 },
          { id: 3, moduleId: 1, title: "Типы ИИ систем", completedAt: "2025-04-10", score: 92 },
          { id: 4, moduleId: 2, title: "Основы машинного обучения", completedAt: "2025-04-11", score: 85 },
          // ... остальные уроки
        ],
        inProgressCourses: [
          { id: 2, title: "Prompt Engineering Masterclass", progress: 0.3 }
        ],
        lastActivity: {
          type: "lesson_completed",
          lessonId: 12,
          timestamp: "2025-05-01T14:30:00Z"
        },
        averageScore: 86,
        weeklyActivity: {
          hoursSpent: 7.5,
          daysActive: 4,
          completedLessons: 3
        },
        strengthAreas: ["ai-concepts", "prompt-basics"],
        weakAreas: ["advanced-prompting", "no-code-tools"]
      };
      
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
      // Здесь должен быть запрос к базе данных для получения курсов
      // Упрощенная версия для демонстрации
      const courses = [
        {
          id: 1,
          title: "AI Literacy 101",
          description: "Основы искусственного интеллекта для начинающих",
          difficulty: "beginner",
          modules: [
            { id: 1, title: "Введение в ИИ", lessonsCount: 3 },
            { id: 2, title: "Машинное обучение", lessonsCount: 3 },
            { id: 3, title: "Нейронные сети", lessonsCount: 3 },
            { id: 4, title: "Глубокое обучение", lessonsCount: 3 },
            { id: 5, title: "Генеративные модели", lessonsCount: 3 },
            { id: 6, title: "Этика ИИ", lessonsCount: 3 }
          ],
          skillsGained: ["ai-fundamentals", "machine-learning-basics", "neural-networks-intro"],
          estimatedHours: 20
        },
        {
          id: 2,
          title: "Prompt Engineering Masterclass",
          description: "Продвинутые техники создания промптов для генеративных моделей",
          difficulty: "intermediate",
          modules: [
            { id: 7, title: "Основы промпт инжиниринга", lessonsCount: 4 },
            { id: 8, title: "Продвинутые техники", lessonsCount: 5 },
            { id: 9, title: "Оптимизация промптов", lessonsCount: 3 },
            { id: 10, title: "Создание приложений", lessonsCount: 4 }
          ],
          skillsGained: ["prompt-engineering", "prompt-optimization", "ai-app-design"],
          estimatedHours: 15
        },
        {
          id: 3,
          title: "No-Code AI Development",
          description: "Создание ИИ-приложений без программирования",
          difficulty: "beginner",
          modules: [
            { id: 11, title: "Введение в No-Code ИИ", lessonsCount: 3 },
            { id: 12, title: "Инструменты No-Code", lessonsCount: 4 },
            { id: 13, title: "Создание чат-бота", lessonsCount: 5 },
            { id: 14, title: "Интеграция с API", lessonsCount: 4 }
          ],
          skillsGained: ["no-code-tools", "ai-integration", "chatbot-design"],
          estimatedHours: 12
        },
        {
          id: 4,
          title: "Python для работы с ИИ",
          description: "Основы Python для разработки ИИ-приложений",
          difficulty: "intermediate",
          modules: [
            { id: 15, title: "Основы Python", lessonsCount: 5 },
            { id: 16, title: "Работа с данными", lessonsCount: 4 },
            { id: 17, title: "Библиотеки для ИИ", lessonsCount: 5 },
            { id: 18, title: "Создание простых моделей", lessonsCount: 4 }
          ],
          skillsGained: ["python", "data-manipulation", "ai-libraries"],
          estimatedHours: 18
        }
      ];
      
      return courses;
    } catch (error) {
      console.error("Ошибка при получении списка курсов:", error);
      throw new Error("Не удалось получить список курсов");
    }
  }
  
  /**
   * Сохраняет рекомендации в базу данных
   */
  private async saveRecommendations(userId: number, recommendations: any) {
    try {
      // Здесь должен быть запрос к базе данных для сохранения рекомендаций
      // Для демонстрации просто логируем
      console.log(`Сохранены рекомендации для пользователя ${userId}:`, recommendations);
      return true;
    } catch (error) {
      console.error("Ошибка при сохранении рекомендаций:", error);
      return false;
    }
  }
}

export const aiAgentService = new AIAgentService();
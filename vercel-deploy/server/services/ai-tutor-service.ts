import OpenAI from "openai";

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface TutorResponse {
  success: boolean;
  message: string;
  suggestions?: string[];
  relatedTopics?: string[];
  error?: string;
}

export class AiTutorService {
  private openai: OpenAI;
  private conversationHistory: Map<string, ChatMessage[]> = new Map();

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is required for AI Tutor service');
    }
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  private getSystemPrompt(): string {
    return `Ты - опытный преподаватель и ментор по искусственному интеллекту и машинному обучению. Твоя задача - помогать студентам изучать ИИ, объясняя сложные концепции простым и понятным языком.

Принципы твоей работы:
1. Всегда отвечай на русском языке
2. Используй простые примеры из реальной жизни
3. Структурируй ответы логично - от простого к сложному
4. Предлагай практические упражнения когда это уместно
5. Поощряй любопытство и дополнительные вопросы
6. Если вопрос слишком сложный, разбивай его на части

Области твоей экспертизы:
- Машинное обучение (алгоритмы, методы)
- Нейронные сети и глубокое обучение
- Computer Vision и обработка изображений
- NLP и работа с текстом
- Python для Data Science и ML
- Этика ИИ и ответственное использование
- Практическое применение ИИ в различных сферах

Стиль общения: дружелюбный, терпеливый, мотивирующий. Помни, что студенты могут быть на разных уровнях подготовки.`;
  }

  async chat(message: string, userId?: string): Promise<TutorResponse> {
    try {
      const sessionId = userId || 'anonymous';
      
      // Get or initialize conversation history
      let history = this.conversationHistory.get(sessionId) || [
        { role: 'system', content: this.getSystemPrompt() }
      ];

      // Add user message
      history.push({ role: 'user', content: message });

      // Keep only last 10 messages to manage token limits
      if (history.length > 11) { // 1 system + 10 conversation messages
        history = [history[0], ...history.slice(-10)];
      }

      // Call OpenAI API
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o', // newest OpenAI model is "gpt-4o" which was released May 13, 2024
        messages: history,
        max_tokens: 1000,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      });

      const aiMessage = response.choices[0]?.message?.content;
      
      if (!aiMessage) {
        throw new Error('Empty response from OpenAI');
      }

      // Add AI response to history
      history.push({ role: 'assistant', content: aiMessage });
      this.conversationHistory.set(sessionId, history);

      // Generate follow-up suggestions
      const suggestions = this.generateSuggestions(message, aiMessage);
      const relatedTopics = this.extractRelatedTopics(message);

      return {
        success: true,
        message: aiMessage,
        suggestions,
        relatedTopics
      };

    } catch (error) {
      console.error('AI Tutor Service Error:', error);
      
      return {
        success: false,
        message: 'Извините, произошла ошибка при обработке вашего запроса. Попробуйте переформулировать вопрос или попробуйте позже.',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private generateSuggestions(userMessage: string, aiResponse: string): string[] {
    const suggestions: string[] = [];
    const lowerMessage = userMessage.toLowerCase();
    const lowerResponse = aiResponse.toLowerCase();

    // Context-aware suggestions based on user's question
    if (lowerMessage.includes('нейронн') || lowerMessage.includes('neural')) {
      suggestions.push("Как обучаются нейронные сети?");
      suggestions.push("Какие есть типы нейронных сетей?");
      suggestions.push("Что такое backpropagation?");
    } else if (lowerMessage.includes('машинн') || lowerMessage.includes('ml')) {
      suggestions.push("В чем разница между обучением с учителем и без?");
      suggestions.push("Как выбрать алгоритм для задачи?");
      suggestions.push("Что такое переобучение?");
    } else if (lowerMessage.includes('python') || lowerMessage.includes('код')) {
      suggestions.push("Покажи пример кода на Python");
      suggestions.push("Какие библиотеки лучше использовать?");
      suggestions.push("Как начать практиковаться?");
    } else if (lowerMessage.includes('данн') || lowerMessage.includes('data')) {
      suggestions.push("Как подготовить данные для обучения?");
      suggestions.push("Сколько данных нужно для модели?");
      suggestions.push("Как оценить качество данных?");
    } else {
      // Default suggestions
      suggestions.push("Можешь привести практический пример?");
      suggestions.push("Где это применяется в реальной жизни?");
      suggestions.push("Как мне начать изучать эту тему?");
    }

    return suggestions.slice(0, 3);
  }

  private extractRelatedTopics(message: string): string[] {
    const topics: string[] = [];
    const lowerMessage = message.toLowerCase();

    const topicMap: { [key: string]: string[] } = {
      'нейрон': ['Глубокое обучение', 'Backpropagation', 'Архитектуры сетей'],
      'машин': ['Алгоритмы ML', 'Оценка моделей', 'Feature Engineering'],
      'python': ['Pandas', 'Scikit-learn', 'TensorFlow', 'PyTorch'],
      'данн': ['Препроцессинг', 'Визуализация', 'Статистика'],
      'алгоритм': ['Классификация', 'Регрессия', 'Кластеризация'],
      'модел': ['Валидация', 'Гиперпараметры', 'Метрики качества']
    };

    for (const [keyword, relatedTopics] of Object.entries(topicMap)) {
      if (lowerMessage.includes(keyword)) {
        topics.push(...relatedTopics);
      }
    }

    return [...new Set(topics)].slice(0, 4);
  }

  clearHistory(userId?: string): void {
    const sessionId = userId || 'anonymous';
    this.conversationHistory.delete(sessionId);
  }

  async getTopicExplanation(topic: string, level: 'beginner' | 'intermediate' | 'advanced' = 'beginner'): Promise<TutorResponse> {
    const levelDescriptions = {
      beginner: 'для новичков, простыми словами с примерами из жизни',
      intermediate: 'для тех, кто уже знаком с основами, с техническими деталями',
      advanced: 'для экспертов, с глубоким анализом и математическими формулировками'
    };

    const prompt = `Объясни тему "${topic}" ${levelDescriptions[level]}. Структурируй ответ логично и добавь практические советы.`;
    
    return this.chat(prompt);
  }
}
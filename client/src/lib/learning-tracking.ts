import { apiRequest } from "@/lib/queryClient";

// Типы данных
interface RecordViewParams {
  lessonId: number;
  duration: number;
}

interface UpdateProgressParams {
  lessonId: number;
  progress: number;
  completed?: boolean;
  position?: string;
}

interface AddNoteParams {
  lessonId: number;
  notes: string;
}

interface StartSessionParams {
  device?: string;
  platform?: string;
}

/**
 * Сервис для отслеживания процесса обучения
 */
export const LearningTrackingService = {
  /**
   * Записывает просмотр урока
   */
  async recordLessonView({ lessonId, duration }: RecordViewParams): Promise<any> {
    try {
      const response = await apiRequest(
        "POST",
        `/api/lessons/progress/${lessonId}/time`,
        { duration }
      );
      return await response.json();
    } catch (error) {
      console.error("Error recording lesson view:", error);
      throw error;
    }
  },
  
  /**
   * Обновляет прогресс урока
   */
  async updateLessonProgress({
    lessonId,
    progress,
    completed = false,
    position
  }: UpdateProgressParams): Promise<any> {
    try {
      const data: any = { progress };
      
      if (completed !== undefined) {
        data.completed = completed ? 1 : 0;
      }
      
      if (position) {
        data.lastPosition = position;
      }
      
      const response = await apiRequest(
        "PUT",
        `/api/lessons/progress/${lessonId}`,
        data
      );
      return await response.json();
    } catch (error) {
      console.error("Error updating lesson progress:", error);
      throw error;
    }
  },
  
  /**
   * Добавляет заметку к уроку
   */
  async addLessonNote({ lessonId, notes }: AddNoteParams): Promise<any> {
    try {
      const response = await apiRequest(
        "POST",
        `/api/lessons/progress/${lessonId}/notes`,
        { notes }
      );
      return await response.json();
    } catch (error) {
      console.error("Error adding lesson note:", error);
      throw error;
    }
  },
  
  /**
   * Записывает событие обучения
   */
  async recordLearningEvent(event: {
    eventType: string;
    entityType: string;
    entityId: number;
    data?: any;
    duration?: number;
  }): Promise<any> {
    try {
      const response = await apiRequest(
        "POST",
        "/api/learning/record",
        event
      );
      return await response.json();
    } catch (error) {
      console.error("Error recording learning event:", error);
      throw error;
    }
  },
  
  /**
   * Начинает новую сессию обучения
   */
  async startLearningSession(params?: StartSessionParams): Promise<any> {
    try {
      const response = await apiRequest(
        "POST",
        "/api/learning/session/start",
        params || {}
      );
      return await response.json();
    } catch (error) {
      console.error("Error starting learning session:", error);
      throw error;
    }
  },
  
  /**
   * Завершает текущую сессию обучения
   */
  async endLearningSession(sessionId?: string): Promise<any> {
    try {
      const response = await apiRequest(
        "POST",
        "/api/learning/session/end",
        sessionId ? { sessionId } : {}
      );
      return await response.json();
    } catch (error) {
      console.error("Error ending learning session:", error);
      throw error;
    }
  }
};
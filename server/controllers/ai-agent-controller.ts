import { Request, Response } from "express";
import { aiAgentService } from "../services/ai-agent-service";

/**
 * Контроллер для управления запросами к ИИ-агентам
 */
export class AIAgentController {
  /**
   * Получает персонализированные рекомендации для образовательной траектории
   */
  async getEducationalRecommendations(req: Request, res: Response) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Не аутентифицирован" });
      }
      
      const userId = req.user.id;
      const recommendations = await aiAgentService.getEducationalRecommendations(userId);
      
      return res.status(200).json(recommendations);
    } catch (error: any) {
      console.error("Ошибка при получении рекомендаций:", error);
      return res.status(500).json({ 
        error: "Не удалось получить рекомендации от ИИ-агента",
        details: error.message || "Неизвестная ошибка"
      });
    }
  }
}

export const aiAgentController = new AIAgentController();
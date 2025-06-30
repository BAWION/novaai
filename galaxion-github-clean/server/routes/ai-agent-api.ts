import express from "express";
import { aiAgentController } from "../controllers/ai-agent-controller";

const aiAgentRouter = express.Router();

// Маршрут для получения персонализированных рекомендаций от Образовательного Навигатора
aiAgentRouter.get("/recommendations", aiAgentController.getEducationalRecommendations);

// Тестовый маршрут для отладки ИИ-агента (только для разработки)
aiAgentRouter.get("/test-recommendations/:userId", aiAgentController.testRecommendationsForUser);

export default aiAgentRouter;
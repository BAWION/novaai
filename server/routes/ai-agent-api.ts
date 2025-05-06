import express from "express";
import { aiAgentController } from "../controllers/ai-agent-controller";

const aiAgentRouter = express.Router();

// Маршрут для получения персонализированных рекомендаций от Образовательного Навигатора
aiAgentRouter.get("/recommendations", aiAgentController.getEducationalRecommendations);

export default aiAgentRouter;
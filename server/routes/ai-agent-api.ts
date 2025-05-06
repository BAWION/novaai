import express from "express";
import { aiAgentController } from "../controllers/ai-agent-controller";

// Middleware для проверки авторизации
const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const user = req.session.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

const router = express.Router();

// Получение персонализированных рекомендаций от Образовательного Навигатора
router.get("/recommendations", authMiddleware, aiAgentController.getEducationalRecommendations.bind(aiAgentController));

export default router;
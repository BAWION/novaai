/**
 * ml-api.ts
 * API маршруты для ML-сервиса
 */
import { Request, Response, Router } from "express";
import { MLStorage } from "../storage-ml";
import { MLService } from "../services/ml-service";
import { z } from "zod";
import { storage } from "../storage";

// Создаем экземпляр MLStorage
const mlStorage = new MLStorage();

// Создаем экземпляр MLService
const mlService = new MLService(mlStorage);

// Схемы валидации запросов
const featureFlagSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["enabled", "disabled", "beta"]),
  targetAudience: z.any().optional(),
  rolloutPercentage: z.number().min(0).max(100).optional(),
});

const userActivitySchema = z.object({
  actionType: z.enum(["view", "complete", "bookmark", "rate", "attempt", "search", "click", "time-spent"]),
  entityType: z.enum(["course", "module", "lesson", "quiz", "skill", "recommendation"]),
  entityId: z.number().int().positive(),
  metadata: z.any().optional(),
});

const learningEventSchema = z.object({
  eventType: z.string().min(1),
  entityType: z.enum(["course", "module", "lesson", "quiz", "skill", "recommendation"]).optional(),
  entityId: z.number().int().positive().optional(),
  data: z.any().optional(),
});

// Расширение Express Request для доступа к сессии
declare global {
  namespace Express {
    interface Request {
      session: any;
    }
  }
}

// Константа для API ключа ML-сервиса
const ML_API_KEY = "ml-admin-secret-key-123";

// Middleware для проверки аутентификации и прав администратора
function requireAdmin(req: Request, res: Response, next: Function) {
  const apiKey = req.header("x-ml-api-key");
  
  // Проверяем API ключ
  if (apiKey === ML_API_KEY) {
    return next();
  }
  
  // Если API ключа нет, проверяем сессию
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  // Проверяем на админский аккаунт (id=999)
  if (req.session.user.id !== 999) {
    return res.status(403).json({ message: "Access denied" });
  }
  
  next();
}

// Создаем Router
const router = Router();

/**
 * Маршруты для Feature Flags
 */
// Получение всех feature flags (только для админов)
router.get("/feature-flags", requireAdmin, async (req: Request, res: Response) => {
  try {
    const flags = await mlStorage.getAllFeatureFlags();
    res.json(flags);
  } catch (error) {
    console.error("Error fetching feature flags:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Создание нового feature flag (только для админов)
router.post("/feature-flags", requireAdmin, async (req: Request, res: Response) => {
  try {
    const validatedData = featureFlagSchema.parse(req.body);
    const flag = await mlStorage.createFeatureFlag(validatedData);
    res.status(201).json(flag);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Invalid data", errors: error.errors });
    } else {
      console.error("Error creating feature flag:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

// Обновление существующего feature flag (только для админов)
router.patch("/feature-flags/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const validatedData = featureFlagSchema.partial().parse(req.body);
    const flag = await mlStorage.updateFeatureFlag(id, validatedData);
    res.json(flag);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Invalid data", errors: error.errors });
    } else {
      console.error("Error updating feature flag:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

// Проверка статуса feature flag для текущего пользователя
router.get("/feature-flags/:name/status", async (req: Request, res: Response) => {
  try {
    const name = req.params.name;
    const userId = req.session.user?.id;
    
    const isEnabled = await mlService.isFeatureEnabled(name, userId);
    res.json({ name, enabled: isEnabled });
  } catch (error) {
    console.error("Error checking feature flag status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * Маршруты для ML-моделей (только для админов)
 */
// Получение всех ML-моделей
router.get("/models", requireAdmin, async (req: Request, res: Response) => {
  try {
    const models = await mlStorage.getAllMlModels();
    res.json(models);
  } catch (error) {
    console.error("Error fetching ML models:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Активация модели
router.post("/models/:id/activate", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const activatedModel = await mlStorage.setMlModelActive(id);
    res.json(activatedModel);
  } catch (error) {
    console.error("Error activating ML model:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

/**
 * Маршруты для пользовательской активности и событий
 */
// Логирование активности пользователя
router.post("/activity", async (req: Request, res: Response) => {
  // Проверяем наличие сессии и пользователя
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  try {
    const userId = req.session.user.id;
    const validatedData = userActivitySchema.parse(req.body);
    
    await mlService.logUserActivity(
      userId,
      validatedData.actionType,
      validatedData.entityType,
      validatedData.entityId,
      validatedData.metadata
    );
    
    res.status(201).json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Invalid data", errors: error.errors });
    } else {
      console.error("Error logging user activity:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

// Запись события обучения
router.post("/learning-events", async (req: Request, res: Response) => {
  // Проверяем наличие сессии и пользователя
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  try {
    const userId = req.session.user.id;
    const validatedData = learningEventSchema.parse(req.body);
    
    await mlService.recordLearningEvent(
      userId,
      validatedData.eventType,
      validatedData.entityType,
      validatedData.entityId,
      validatedData.data
    );
    
    res.status(201).json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Invalid data", errors: error.errors });
    } else {
      console.error("Error recording learning event:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
});

/**
 * Маршруты для рекомендаций
 */
// Получение персонализированных рекомендаций курсов
router.get("/recommendations/courses", async (req: Request, res: Response) => {
  // Проверяем наличие сессии и пользователя
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  try {
    const userId = req.session.user.id;
    
    // Получаем все курсы
    const courses = await storage.getAllCourses();
    
    // Генерируем персонализированные рекомендации
    const recommendedCourses = await mlService.generateCourseRecommendations(userId, courses);
    
    res.json(recommendedCourses);
  } catch (error) {
    console.error("Error generating course recommendations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Маршрут обновления эмбеддингов пользователя
router.post("/embeddings/user", async (req: Request, res: Response) => {
  // Проверяем наличие сессии и пользователя
  if (!req.session || !req.session.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  try {
    const userId = req.session.user.id;
    const user = await storage.getUser(userId);
    const profile = await storage.getUserProfile(userId);
    
    if (!user || !profile) {
      return res.status(404).json({ message: "User or profile not found" });
    }
    
    const embedding = await mlService.generateUserEmbedding(user, profile);
    
    if (!embedding) {
      return res.status(500).json({ message: "Failed to generate embedding" });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error updating user embedding:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Маршрут обновления эмбеддингов курса (только для админов)
router.post("/embeddings/course/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const courseId = parseInt(req.params.id);
    const course = await storage.getCourse(courseId);
    
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    
    const embedding = await mlService.generateCourseEmbedding(course);
    
    if (!embedding) {
      return res.status(500).json({ message: "Failed to generate embedding" });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error updating course embedding:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Экспортируем маршруты
export default router;
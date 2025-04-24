import express from "express";
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertUserProfileSchema,
  insertCourseSchema,
  insertUserCourseProgressSchema
} from "@shared/schema";
import { z } from "zod";
import session from "express-session";
import memorystore from "memorystore";
import { checkSecrets } from "./routes/check-secrets";
// Временно отключаем маршруты, для которых у нас пока нет определенных типов в схеме
// import { learningEventsRouter } from "./routes/learning-events";
// import { lessonProgressRouter } from "./routes/lesson-progress";
// import onboardingRouter from "./routes/onboarding";
// import recommendedCoursesRouter from "./routes/recommended-courses";
// import skillsRouter from "./routes/skills";

// Add any middleware needed
const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Simple auth check - in a real app, this would verify JWT tokens or session cookies
  const user = req.session.user;
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session middleware
  const MemoryStore = memorystore(session);

  app.use(
    session({
      cookie: { maxAge: 86400000 }, // 24 hours
      store: new MemoryStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET || "nova-ai-university-secret",
    })
  );
  
  // Создаем тестового пользователя Vitaliy
  (async () => {
    try {
      // Проверяем, существует ли пользователь
      const vitaliy = await storage.getUserByUsername("Vitaliy");
      
      if (!vitaliy) {
        // Создаем пользователя, если он не существует
        const user = await storage.createUser({ 
          username: "Vitaliy", 
          password: "500500В",
          displayName: "Виталий" 
        });
        
        console.log("Тестовый пользователь Vitaliy создан:", user.id);
      }
    } catch (error) {
      console.error("Ошибка при создании тестового пользователя:", error);
    }
  })();

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password, displayName } = req.body;
      
      // Check for admin credentials
      if (username === "админ13" && password === "54321") {
        // Create admin session
        req.session.user = {
          id: 999,
          username: "админ13",
          displayName: "Администратор"
        };
        return res.json({ id: 999, username: "админ13", displayName: "Администратор" });
      }
      
      // For telegram login (which doesn't use password)
      if (!password && username) {
        // Find or create user
        let user = await storage.getUserByUsername(username);
        
        if (!user) {
          // For demo purposes, create a new user if not found
          user = await storage.createUser({ 
            username, 
            password: "placeholder-password" // In a real app, we'd use proper password hashing
          });
        }
        
        // Store user in session
        req.session.user = {
          id: user.id,
          username: user.username,
          displayName: displayName || user.displayName
        };
        
        return res.json({ id: user.id, username: user.username, displayName: displayName || user.displayName });
      }
      
      // Regular username/password login
      if (username && password) {
        let user = await storage.getUserByUsername(username);
        
        if (!user) {
          return res.status(401).json({ message: "Неверное имя пользователя или пароль" });
        }
        
        // In a real app, we would compare hashed passwords
        // For demo, we'll just check if the password matches
        if (user.password !== password) {
          return res.status(401).json({ message: "Неверное имя пользователя или пароль" });
        }
        
        // Store user in session
        req.session.user = {
          id: user.id,
          username: user.username,
          displayName: user.displayName || undefined
        };
        
        return res.json({ id: user.id, username: user.username, displayName: user.displayName });
      }
      
      res.status(400).json({ message: "Необходимо указать имя пользователя и пароль" });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });
  
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });
  
  app.get("/api/auth/me", (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json(req.session.user);
  });

  // User profile routes
  app.get("/api/profile", authMiddleware, async (req, res) => {
    try {
      const userId = req.session.user!.id;
      let profile = await storage.getUserProfile(userId);
      
      // Если это администратор и профиль не найден, создаем дефолтный профиль
      if (!profile && userId === 999) {
        // Создаем профиль администратора
        profile = await storage.createUserProfile({
          userId: 999,
          role: "teacher",
          pythonLevel: 5,
          experience: "expert",
          interest: "machine-learning",
          goal: "find-internship",
          recommendedTrack: "research-ai"
        });
      }
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json({
        role: profile.role,
        pythonLevel: profile.pythonLevel,
        experience: profile.experience,
        interest: profile.interest,
        goal: profile.goal,
        recommendedTrack: profile.recommendedTrack,
        progress: profile.progress,
        streakDays: profile.streakDays,
        displayName: req.session.user!.displayName || "Пользователь"
      });
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({ message: "Failed to get profile" });
    }
  });
  
  app.patch("/api/profile", authMiddleware, async (req, res) => {
    try {
      const userId = req.session.user!.id;
      const updateData = req.body;
      
      // Check if profile exists
      let profile = await storage.getUserProfile(userId);
      
      if (!profile) {
        // Create new profile if it doesn't exist
        profile = await storage.createUserProfile({
          userId,
          ...updateData
        });
      } else {
        // Update existing profile
        profile = await storage.updateUserProfile(userId, updateData);
      }
      
      res.json({
        role: profile.role,
        pythonLevel: profile.pythonLevel,
        experience: profile.experience,
        interest: profile.interest,
        goal: profile.goal,
        recommendedTrack: profile.recommendedTrack,
        progress: profile.progress,
        streakDays: profile.streakDays
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Course routes
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      console.error("Get courses error:", error);
      res.status(500).json({ message: "Failed to get courses" });
    }
  });
  
  app.post("/api/courses", authMiddleware, async (req, res) => {
    try {
      const validationResult = insertCourseSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid course data",
          errors: validationResult.error.errors
        });
      }
      
      const course = await storage.createCourse(validationResult.data);
      res.status(201).json(course);
    } catch (error) {
      console.error("Create course error:", error);
      res.status(500).json({ message: "Failed to create course" });
    }
  });
  
  app.get("/api/courses/:id", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourse(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      res.json(course);
    } catch (error) {
      console.error("Get course error:", error);
      res.status(500).json({ message: "Failed to get course" });
    }
  });

  // User course progress routes
  app.get("/api/user/courses", authMiddleware, async (req, res) => {
    try {
      const userId = req.session.user!.id;
      const courseProgress = await storage.getUserCourseProgress(userId);
      res.json(courseProgress);
    } catch (error) {
      console.error("Get user courses error:", error);
      res.status(500).json({ message: "Failed to get user courses" });
    }
  });
  
  app.post("/api/user/courses/:courseId/progress", authMiddleware, async (req, res) => {
    try {
      const userId = req.session.user!.id;
      const courseId = parseInt(req.params.courseId);
      const { progress, completedModules } = req.body;
      
      const updated = await storage.updateUserCourseProgress(userId, courseId, {
        progress,
        completedModules
      });
      
      res.json(updated);
    } catch (error) {
      console.error("Update course progress error:", error);
      res.status(500).json({ message: "Failed to update course progress" });
    }
  });

  // Временно отключенные маршруты для избранных курсов и рейтингов
  // (схемы для этих таблиц еще не определены)
  
  // // User Favorite Courses (Bookmarks) routes
  // app.get("/api/user/favorites", authMiddleware, async (req, res) => {
  //   try {
  //     const userId = req.session.user!.id;
  //     const favorites = await storage.getUserFavoriteCourses(userId);
  //     res.json(favorites);
  //   } catch (error) {
  //     console.error("Get favorites error:", error);
  //     res.status(500).json({ message: "Failed to get favorites" });
  //   }
  // });
  // 
  // app.post("/api/user/favorites", authMiddleware, async (req, res) => {
  //   try {
  //     const userId = req.session.user!.id;
  //     const { courseId } = req.body;
  //     
  //     if (!courseId) {
  //       return res.status(400).json({ message: "Course ID is required" });
  //     }
  //     
  //     const validationResult = insertUserFavoriteCourseSchema.safeParse({
  //       userId,
  //       courseId: parseInt(courseId)
  //     });
  //     
  //     if (!validationResult.success) {
  //       return res.status(400).json({ 
  //         message: "Invalid course data",
  //         errors: validationResult.error.errors 
  //       });
  //     }
  //     
  //     const favorite = await storage.addCourseToFavorites(validationResult.data);
  //     res.status(201).json(favorite);
  //   } catch (error) {
  //     console.error("Add favorite error:", error);
  //     res.status(500).json({ message: "Failed to add favorite" });
  //   }
  // });
  // 
  // app.delete("/api/user/favorites/:courseId", authMiddleware, async (req, res) => {
  //   try {
  //     const userId = req.session.user!.id;
  //     const courseId = parseInt(req.params.courseId);
  //     
  //     await storage.removeCourseFromFavorites(userId, courseId);
  //     res.status(204).send();
  //   } catch (error) {
  //     console.error("Remove favorite error:", error);
  //     res.status(500).json({ message: "Failed to remove favorite" });
  //   }
  // });
  // 
  // // Course Ratings routes
  // app.get("/api/courses/:courseId/ratings", async (req, res) => {
  //   try {
  //     const courseId = parseInt(req.params.courseId);
  //     const ratings = await storage.getCourseRatings(courseId);
  //     res.json(ratings);
  //   } catch (error) {
  //     console.error("Get ratings error:", error);
  //     res.status(500).json({ message: "Failed to get ratings" });
  //   }
  // });
  // 
  // app.get("/api/courses/:courseId/ratings/average", async (req, res) => {
  //   try {
  //     const courseId = parseInt(req.params.courseId);
  //     const averageRating = await storage.getCourseAverageRating(courseId);
  //     res.json({ averageRating });
  //   } catch (error) {
  //     console.error("Get average rating error:", error);
  //     res.status(500).json({ message: "Failed to get average rating" });
  //   }
  // });
  // 
  // app.get("/api/user/ratings/:courseId", authMiddleware, async (req, res) => {
  //   try {
  //     const userId = req.session.user!.id;
  //     const courseId = parseInt(req.params.courseId);
  //     const rating = await storage.getUserCourseRating(userId, courseId);
  //     
  //     if (!rating) {
  //       return res.status(404).json({ message: "Rating not found" });
  //     }
  //     
  //     res.json(rating);
  //   } catch (error) {
  //     console.error("Get user rating error:", error);
  //     res.status(500).json({ message: "Failed to get user rating" });
  //   }
  // });
  // 
  // app.post("/api/courses/:courseId/ratings", authMiddleware, async (req, res) => {
  //   try {
  //     const userId = req.session.user!.id;
  //     const courseId = parseInt(req.params.courseId);
  //     const { rating, review } = req.body;
  //     
  //     if (rating === undefined) {
  //       return res.status(400).json({ message: "Rating is required" });
  //     }
  //     
  //     const validationResult = insertCourseRatingSchema.safeParse({
  //       userId,
  //       courseId,
  //       rating: parseInt(rating),
  //       review
  //     });
  //     
  //     if (!validationResult.success) {
  //       return res.status(400).json({ 
  //         message: "Invalid rating data",
  //         errors: validationResult.error.errors 
  //       });
  //     }
  //     
  //     const courseRating = await storage.rateCourse(validationResult.data);
  //     res.status(201).json(courseRating);
  //   } catch (error) {
  //     console.error("Rate course error:", error);
  //     res.status(500).json({ message: "Failed to rate course" });
  //   }
  // });
  // 
  // app.patch("/api/courses/:courseId/ratings", authMiddleware, async (req, res) => {
  //   try {
  //     const userId = req.session.user!.id;
  //     const courseId = parseInt(req.params.courseId);
  //     const { rating, review } = req.body;
  //     
  //     const updated = await storage.updateCourseRating(userId, courseId, { 
  //       rating: rating !== undefined ? parseInt(rating) : undefined,
  //       review
  //     });
  //     
  //     res.json(updated);
  //   } catch (error) {
  //     console.error("Update rating error:", error);
  //     res.status(500).json({ message: "Failed to update rating" });
  //   }
  // });

  // Маршрут для проверки секретов
  app.post("/api/check-secrets", checkSecrets);
  
  // Временно отключены маршруты, для которых требуются дополнительные схемы
  // // Маршруты для отслеживания событий обучения
  // app.use("/api/learning", learningEventsRouter);
  // 
  // // Маршруты для отслеживания прогресса уроков
  // app.use("/api/lessons/progress", lessonProgressRouter);
  // 
  // // Маршруты для расширенного онбординга
  // app.use("/api/profiles", onboardingRouter);
  // 
  // // Маршруты для рекомендованных курсов
  // app.use("/api/courses/recommended", recommendedCoursesRouter);
  // 
  // // Маршруты для навыков и карты навыков
  // app.use("/api/skills", skillsRouter);

  const httpServer = createServer(app);
  return httpServer;
}

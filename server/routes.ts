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

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, displayName } = req.body;
      
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
      
      res.json({ id: user.id, username: user.username, displayName: displayName || user.displayName });
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
      const userId = req.session.user.id;
      const profile = await storage.getUserProfile(userId);
      
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
        displayName: req.session.user.displayName
      });
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({ message: "Failed to get profile" });
    }
  });
  
  app.patch("/api/profile", authMiddleware, async (req, res) => {
    try {
      const userId = req.session.user.id;
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
      const userId = req.session.user.id;
      const courseProgress = await storage.getUserCourseProgress(userId);
      res.json(courseProgress);
    } catch (error) {
      console.error("Get user courses error:", error);
      res.status(500).json({ message: "Failed to get user courses" });
    }
  });
  
  app.post("/api/user/courses/:courseId/progress", authMiddleware, async (req, res) => {
    try {
      const userId = req.session.user.id;
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

  const httpServer = createServer(app);
  return httpServer;
}

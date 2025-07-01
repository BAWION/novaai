import type { Express } from "express";
import { storage } from "../database-storage";
import { requireAuth } from "../auth-middleware";

export function registerLessonNotesRoutes(app: Express) {
  // Get lesson note
  app.get("/api/lessons/:lessonId/notes", requireAuth, async (req: any, res) => {
    try {
      const lessonId = parseInt(req.params.lessonId);
      const userId = req.user.id;

      if (isNaN(lessonId)) {
        return res.status(400).json({ message: "Invalid lesson ID" });
      }

      const note = await storage.getLessonNote(userId, lessonId);
      res.json(note || { content: "" });
    } catch (error) {
      console.error("Error fetching lesson note:", error);
      res.status(500).json({ message: "Failed to fetch lesson note" });
    }
  });

  // Save lesson note
  app.post("/api/lessons/:lessonId/notes", requireAuth, async (req: any, res) => {
    try {
      const lessonId = parseInt(req.params.lessonId);
      const userId = req.user.id;
      const { content } = req.body;

      if (isNaN(lessonId)) {
        return res.status(400).json({ message: "Invalid lesson ID" });
      }

      if (typeof content !== "string") {
        return res.status(400).json({ message: "Content must be a string" });
      }

      if (content.trim() === "") {
        // Delete note if content is empty
        await storage.deleteLessonNote(userId, lessonId);
        res.json({ message: "Note deleted" });
      } else {
        // Save or update note
        const note = await storage.saveLessonNote(userId, lessonId, content.trim());
        res.json(note);
      }
    } catch (error) {
      console.error("Error saving lesson note:", error);
      res.status(500).json({ message: "Failed to save lesson note" });
    }
  });

  // Delete lesson note
  app.delete("/api/lessons/:lessonId/notes", requireAuth, async (req: any, res) => {
    try {
      const lessonId = parseInt(req.params.lessonId);
      const userId = req.user.id;

      if (isNaN(lessonId)) {
        return res.status(400).json({ message: "Invalid lesson ID" });
      }

      const deleted = await storage.deleteLessonNote(userId, lessonId);
      if (deleted) {
        res.json({ message: "Note deleted successfully" });
      } else {
        res.status(404).json({ message: "Note not found" });
      }
    } catch (error) {
      console.error("Error deleting lesson note:", error);
      res.status(500).json({ message: "Failed to delete lesson note" });
    }
  });

  // Get all user notes
  app.get("/api/user/notes", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const notes = await storage.getUserLessonNotes(userId);
      res.json(notes);
    } catch (error) {
      console.error("Error fetching user notes:", error);
      res.status(500).json({ message: "Failed to fetch user notes" });
    }
  });
}
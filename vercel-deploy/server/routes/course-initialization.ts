/**
 * API endpoint for initializing courses from templates
 */

import express, { Request, Response } from "express";
import { courseManagementService } from "../services/course-management-service";
import pythonBasicsTemplate from "../course-templates/python-basics-template";
import { enhancedAuthMiddleware } from "../auth-middleware";

const router = express.Router();

/**
 * Initialize Python Basics course
 * POST /api/course-init/python-basics
 */
router.post('/python-basics', enhancedAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const authorId = req.session.user?.id || 1; // Fallback to admin
    
    // Check if course already exists
    const existingCourse = await courseManagementService.getCourseBySlug('python-basics');
    if (existingCourse) {
      return res.json({
        success: true,
        courseId: existingCourse.id,
        message: 'Курс Python Basics уже существует'
      });
    }

    const courseId = await courseManagementService.createCourseFromTemplate(pythonBasicsTemplate, authorId);
    
    res.status(201).json({
      success: true,
      courseId,
      message: 'Курс Python Basics успешно создан'
    });
  } catch (error) {
    console.error('Ошибка при создании курса Python Basics:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при создании курса'
    });
  }
});

/**
 * Get all available course templates
 * GET /api/course-init/templates
 */
router.get('/templates', async (req: Request, res: Response) => {
  try {
    const templates = [
      {
        id: 'python-basics',
        title: 'Python для начинающих',
        description: 'Полный курс программирования на Python с нуля',
        difficulty: 3,
        level: 'basic',
        estimatedDuration: 2400,
        category: 'tech'
      }
    ];
    
    res.json({
      success: true,
      templates
    });
  } catch (error) {
    console.error('Ошибка при получении шаблонов:', error);
    res.status(500).json({
      success: false,
      message: 'Ошибка при получении шаблонов'
    });
  }
});

export default router;
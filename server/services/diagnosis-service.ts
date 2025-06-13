/**
 * diagnosis-service.ts
 * Сервис для обработки результатов диагностики и сохранения их в систему Skills DNA
 */

import { db } from "../db";
import { sql } from "drizzle-orm";
import { 
  skillsDna, 
  userSkillsDnaProgress, 
  skillToDnaMapping,
  userProfiles,
  users,
  InsertUserSkillsDnaProgress,
  skillsDnaLevelEnum
} from "@shared/schema";
import { eq, and, inArray } from "drizzle-orm";

interface DiagnosisResult {
  userId: number;
  skills: Record<string, number>; // Название навыка: значение от 0 до 100
  diagnosticType: 'quick' | 'deep';
  metadata?: any;
}

/**
 * Сервис для работы с результатами диагностики
 */
class DiagnosisService {
  /**
   * Сохраняет результаты диагностики в систему Skills DNA
   * @param diagnosisResult Результаты диагностики
   * @returns Сохраненные записи прогресса пользователя
   */
  async saveResults(diagnosisResult: DiagnosisResult): Promise<{ success: boolean; savedProgress: any[] }> {
    try {
      const { userId, skills, diagnosticType } = diagnosisResult;
      
      console.log(`[DiagnosisService] Начинаем сохранение результатов диагностики для пользователя ${userId}:`, {
        skillsCount: Object.keys(skills).length,
        diagnosticType
      });
      
      // 1. Проверяем, существует ли пользователь
      const userExists = await this.userExists(userId);
      if (!userExists) {
        console.error(`[DiagnosisService] Пользователь с ID ${userId} не найден в базе данных`);
        throw new Error(`Пользователь с ID ${userId} не найден`);
      }
      
      console.log(`[DiagnosisService] Пользователь ${userId} найден в базе данных`);
      

      // 2. Получаем все компетенции (Skills DNA)
      const allSkillsDna = await db.select().from(skillsDna);
      if (!allSkillsDna.length) {
        throw new Error("Не найдены компетенции Skills DNA в системе");
      }

      // 3. Получаем мэппинг навыков на компетенции по именам (простой подход)
      const skillNameMappings: Array<{skill_name: string, dna_id: number, weight: number}> = [
        // Быстрая диагностика
        {skill_name: 'Программирование AI', dna_id: 5, weight: 1.0},
        {skill_name: 'Машинное обучение', dna_id: 4, weight: 1.0},
        {skill_name: 'Работа с данными', dna_id: 7, weight: 1.0},
        {skill_name: 'Нейросети', dna_id: 9, weight: 1.0},
        {skill_name: 'Алгоритмы', dna_id: 6, weight: 1.0},
        {skill_name: 'Исследования', dna_id: 15, weight: 1.0},
        {skill_name: 'Практические навыки', dna_id: 10, weight: 1.0},
        // Глубокая диагностика
        {skill_name: 'Аналитическое мышление', dna_id: 6, weight: 1.0},
        {skill_name: 'Решение проблем', dna_id: 10, weight: 1.0},
        {skill_name: 'Внимание к деталям', dna_id: 11, weight: 1.0},
        {skill_name: 'Применение в бизнесе', dna_id: 14, weight: 1.0},
        {skill_name: 'Исследовательские навыки', dna_id: 15, weight: 1.0},
        {skill_name: 'Этика и право в ИИ', dna_id: 16, weight: 1.0}
      ];

      console.log(`[DiagnosisService] Загружены ${skillNameMappings.length} мэппингов навыков`);

      // 4. Вычисляем прогресс для каждой компетенции DNA на основе диагностики
      const competencyProgress: Record<number, { 
        level: string, 
        progress: number, 
        source: string 
      }> = {};

      // Сначала рассчитываем прямые соответствия из диагностики
      for (const skillName in skills) {
        const skillValue = skills[skillName];
        
        // Находим подходящие компетенции для навыка через мэппинги
        const directMappings = skillNameMappings.filter(mapping => 
          mapping.skill_name === skillName
        );

        // Если нашли прямые мэппинги, рассчитываем прогресс для соответствующих компетенций
        if (directMappings.length > 0) {
          for (const mapping of directMappings) {
            const dnaId = mapping.dna_id;
            const weight = mapping.weight || 1.0;
            const adjustedValue = Math.min(100, skillValue * weight); // Ограничиваем максимум 100
            
            if (!competencyProgress[dnaId]) {
              // Определяем уровень на основе значения навыка
              const level = this.calculateSkillLevel(adjustedValue);
              competencyProgress[dnaId] = {
                level,
                progress: adjustedValue,
                source: `diagnostic-${diagnosticType}`
              };
            } else {
              // Если компетенция уже есть в результатах, берем максимальное значение
              const currentProgress = competencyProgress[dnaId].progress;
              if (adjustedValue > currentProgress) {
                competencyProgress[dnaId] = {
                  level: this.calculateSkillLevel(adjustedValue),
                  progress: adjustedValue,
                  source: `diagnostic-${diagnosticType}`
                };
              }
            }
          }
        } else {
          // Если не нашли точного мэппинга, пытаемся найти компетенции по имени
          const matchingDna = allSkillsDna.filter(dna => 
            dna.name.toLowerCase().includes(skillName.toLowerCase()) ||
            skillName.toLowerCase().includes(dna.name.toLowerCase())
          );

          if (matchingDna.length > 0) {
            for (const dna of matchingDna) {
              if (!competencyProgress[dna.id]) {
                competencyProgress[dna.id] = {
                  level: this.calculateSkillLevel(skillValue),
                  progress: skillValue,
                  source: `diagnostic-${diagnosticType}-matched`
                };
              } else if (skillValue > competencyProgress[dna.id].progress) {
                competencyProgress[dna.id] = {
                  level: this.calculateSkillLevel(skillValue),
                  progress: skillValue,
                  source: `diagnostic-${diagnosticType}-matched`
                };
              }
            }
          }
        }
      }

      // 5. Сохраняем рассчитанный прогресс в таблицу user_skills_dna_progress
      const savedProgress = [];
      
      // Получаем текущие значения прогресса пользователя
      const existingProgressEntries = await db.select()
        .from(userSkillsDnaProgress)
        .where(eq(userSkillsDnaProgress.userId, userId));
      
      // Карта существующих записей по dnaId для быстрого поиска
      const existingProgressMap = new Map(
        existingProgressEntries.map(entry => [entry.dnaId, entry])
      );

      // Обрабатываем каждую компетенцию
      for (const dnaId in competencyProgress) {
        const { level, progress } = competencyProgress[dnaId];
        const existingEntry = existingProgressMap.get(Number(dnaId));

        // Преобразуем строковый уровень в enum
        const skillLevel = level as typeof skillsDnaLevelEnum.enumValues[number];

        if (existingEntry) {
          // Обновляем существующую запись, если новый прогресс выше
          if (progress > (existingEntry.progress || 0)) {
            const [updatedEntry] = await db.update(userSkillsDnaProgress)
              .set({
                currentLevel: skillLevel,
                progress: progress,
                lastAssessmentDate: new Date(),
                updatedAt: new Date()
              })
              .where(eq(userSkillsDnaProgress.id, existingEntry.id))
              .returning();
            
            savedProgress.push(updatedEntry);
          }
        } else {
          // Создаем новую запись прогресса
          const newProgress: InsertUserSkillsDnaProgress = {
            userId,
            dnaId: Number(dnaId),
            currentLevel: skillLevel,
            progress,
            assessmentHistory: [{
              date: new Date().toISOString(),
              level: skillLevel,
              progress,
              source: `diagnostic-${diagnosticType}`
            }]
          };

          const [insertedEntry] = await db.insert(userSkillsDnaProgress)
            .values(newProgress)
            .returning();
          
          savedProgress.push(insertedEntry);
        }
      }

      // 6. Обновляем профиль пользователя, отмечая прохождение диагностики
      await db.update(userProfiles)
        .set({
          completedOnboarding: true,
          onboardingCompletedAt: new Date(),
          metadata: {
            ...diagnosisResult.metadata,
            lastDiagnostic: {
              type: diagnosticType,
              completedAt: new Date().toISOString()
            }
          }
        })
        .where(eq(userProfiles.userId, userId));

      return { 
        success: true, 
        savedProgress 
      };
    } catch (error) {
      console.error("Ошибка при сохранении результатов диагностики:", error);
      throw error;
    }
  }

  /**
   * Проверяет существование пользователя в системе
   * @param userId ID пользователя
   * @returns true если пользователь существует, иначе false
   */
  private async userExists(userId: number): Promise<boolean> {
    const userResults = await db.select().from(users).where(eq(users.id, userId));
    return userResults.length > 0;
  }

  /**
   * Вычисляет уровень навыка на основе процентного значения
   * @param value Числовое значение навыка (0-100)
   * @returns Уровень по таксономии Блума
   */
  private calculateSkillLevel(value: number): string {
    if (value <= 20) return "awareness";
    if (value <= 40) return "knowledge";
    if (value <= 60) return "application";
    if (value <= 80) return "mastery";
    return "expertise";
  }

  /**
   * Получает текущий прогресс пользователя по компетенциям
   * @param userId ID пользователя
   * @returns Массив записей прогресса с детальной информацией о компетенциях
   */
  async getUserDnaProgress(userId: number): Promise<any[]> {
    try {
      console.log(`[DiagnosisService] Запрос прогресса Skills DNA для пользователя ${userId}`);
      
      // Получаем все записи прогресса пользователя
      const progressEntries = await db.select()
        .from(userSkillsDnaProgress)
        .where(eq(userSkillsDnaProgress.userId, userId));
      
      console.log(`[DiagnosisService] Получены записи прогресса:`, {
        userId,
        entriesCount: progressEntries.length,
      });
      
      if (!progressEntries.length) {
        console.log(`[DiagnosisService] Для пользователя ${userId} не найдены записи прогресса Skills DNA`);
        return [];
      }

      // Получаем полную информацию о компетенциях
      const dnaIds = progressEntries.map(entry => entry.dnaId);
      const dnaEntries = await db.select()
        .from(skillsDna)
        .where(inArray(skillsDna.id, dnaIds));
      
      // Объединяем информацию о прогрессе с информацией о компетенциях
      return progressEntries.map(progress => {
        const dna = dnaEntries.find(dna => dna.id === progress.dnaId);
        return {
          ...progress,
          name: dna?.name || 'Неизвестная компетенция',
          description: dna?.description || '',
          category: dna?.category || 'other'
        };
      });
    } catch (error) {
      console.error("Ошибка при получении прогресса пользователя:", error);
      throw error;
    }
  }

  /**
   * Получает сводную информацию о прогрессе пользователя по категориям компетенций
   * @param userId ID пользователя
   * @returns Сводная информация о прогрессе по категориям
   */
  async getUserDnaSummary(userId: number): Promise<Record<string, { 
    avgProgress: number; 
    count: number;
    maxLevel: string;
  }>> {
    try {
      console.log(`[DiagnosisService] Запрос сводки Skills DNA для пользователя ${userId}`);
      
      const progressWithDetails = await this.getUserDnaProgress(userId);
      
      console.log(`[DiagnosisService] Получены детали прогресса для сводки:`, {
        userId,
        entriesCount: progressWithDetails.length,
        items: progressWithDetails.map(p => `${p.name}: ${p.progress}%`).join(', ')
      });
      
      // Группировка по категориям
      const categorySummary: Record<string, { 
        totalProgress: number;
        count: number;
        maxLevel: string;
      }> = {};

      for (const progress of progressWithDetails) {
        const category = progress.category || 'other';
        
        if (!categorySummary[category]) {
          categorySummary[category] = {
            totalProgress: 0,
            count: 0,
            maxLevel: 'awareness'
          };
        }

        categorySummary[category].totalProgress += progress.progress;
        categorySummary[category].count += 1;
        
        // Определяем максимальный уровень в категории
        const levelOrder = ['awareness', 'knowledge', 'application', 'mastery', 'expertise'];
        const currentLevelIndex = levelOrder.indexOf(progress.currentLevel);
        const maxLevelIndex = levelOrder.indexOf(categorySummary[category].maxLevel);
        
        if (currentLevelIndex > maxLevelIndex) {
          categorySummary[category].maxLevel = progress.currentLevel;
        }
      }

      // Вычисляем средний прогресс для каждой категории
      const result: Record<string, { 
        avgProgress: number; 
        count: number;
        maxLevel: string;
      }> = {};

      for (const [category, data] of Object.entries(categorySummary)) {
        result[category] = {
          avgProgress: Math.round(data.totalProgress / data.count),
          count: data.count,
          maxLevel: data.maxLevel
        };
      }

      return result;
    } catch (error) {
      console.error("Ошибка при получении сводки прогресса пользователя:", error);
      throw error;
    }
  }

  /**
   * Инициализирует демо-данные для пользователя с ID 999
   * @returns Результат инициализации
   */
  async initializeDemoData(): Promise<any> {
    try {
      console.log(`[DiagnosisService] Инициализация демо-данных для пользователя 999`);
      
      // Проверяем существует ли уже запись для пользователя 999
      const existingEntries = await db.select()
        .from(userSkillsDnaProgress)
        .where(eq(userSkillsDnaProgress.userId, 999));
      
      // Если данные уже существуют, возвращаем их
      if (existingEntries.length > 0) {
        console.log(`[DiagnosisService] Демо-данные уже существуют для пользователя 999, найдено ${existingEntries.length} записей`);
        return {
          success: true,
          message: "Демо-данные уже существуют",
          entries: existingEntries
        };
      }
      
      // Получаем все компетенции (Skills DNA)
      const allSkillsDna = await db.select().from(skillsDna);
      if (!allSkillsDna.length) {
        throw new Error("Не найдены компетенции Skills DNA в системе");
      }
      
      // Демо-данные навыков для разных категорий
      const demoSkills = {
        "AI Foundations": {
          "Machine Learning Basics": 85,
          "Neural Networks": 75,
          "Data Science": 90,
          "Computer Vision": 65,
          "Natural Language Processing": 80
        },
        "Tools & Platforms": {
          "OpenAI API": 95,
          "TensorFlow": 60,
          "PyTorch": 55,
          "Hugging Face": 70,
          "AI Development Environments": 85
        },
        "Prompt Engineering": {
          "Zero-shot Prompting": 90,
          "Few-shot Prompting": 85,
          "Chain of Thought": 80,
          "ReAct Pattern": 75,
          "Prompt Optimization": 95
        },
        "Business Applications": {
          "AI Project Management": 80,
          "AI Business Strategy": 85,
          "ROI Assessment": 75,
          "AI Ethics": 90,
          "AI Risk Management": 65
        }
      };
      
      // Создаем записи прогресса для демо-пользователя
      const savedEntries = [];
      
      for (const dna of allSkillsDna) {
        // Находим подходящую категорию и навык
        let progress = 0;
        let skillLevel = "awareness" as typeof skillsDnaLevelEnum.enumValues[number];
        
        // Пытаемся найти соответствие в наших демо-данных
        for (const [category, skills] of Object.entries(demoSkills)) {
          if (dna.category === category || dna.category.includes(category) || category.includes(dna.category)) {
            for (const [skillName, skillValue] of Object.entries(skills)) {
              if (dna.name.includes(skillName) || skillName.includes(dna.name)) {
                progress = skillValue;
                skillLevel = this.calculateSkillLevel(progress) as typeof skillsDnaLevelEnum.enumValues[number];
                break;
              }
            }
          }
        }
        
        // Если не нашли точное соответствие, установим случайное значение
        if (progress === 0) {
          // Используем консистентные значения на основе dnaId для воспроизводимости
          progress = 20 + ((dna.id * 17) % 70); // 20-90%
          skillLevel = this.calculateSkillLevel(progress) as typeof skillsDnaLevelEnum.enumValues[number];
        }
        
        // Создаем новую запись прогресса
        const newProgress: InsertUserSkillsDnaProgress = {
          userId: 999,
          dnaId: dna.id,
          currentLevel: skillLevel,
          progress,
          assessmentHistory: [{
            date: new Date().toISOString(),
            level: skillLevel,
            progress,
            source: 'demo-initialization'
          }]
        };
        
        const [insertedEntry] = await db.insert(userSkillsDnaProgress)
          .values(newProgress)
          .returning();
        
        savedEntries.push(insertedEntry);
      }
      
      console.log(`[DiagnosisService] Успешно созданы демо-данные для пользователя 999, создано ${savedEntries.length} записей`);
      
      return {
        success: true,
        message: "Демо-данные успешно инициализированы",
        entries: savedEntries
      };
    } catch (error) {
      console.error("[DiagnosisService] Ошибка при инициализации демо-данных:", error);
      throw error;
    }
  }
}

export const diagnosisService = new DiagnosisService();
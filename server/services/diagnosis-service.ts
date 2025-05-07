/**
 * diagnosis-service.ts
 * Сервис для обработки результатов диагностики и сохранения их в систему Skills DNA
 */

import { db } from "../db";
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
      
      // 1. Проверяем, существует ли пользователь
      const userExists = await this.userExists(userId);
      if (!userExists) {
        throw new Error(`Пользователь с ID ${userId} не найден`);
      }

      // 2. Получаем все компетенции (Skills DNA)
      const allSkillsDna = await db.select().from(skillsDna);
      if (!allSkillsDna.length) {
        throw new Error("Не найдены компетенции Skills DNA в системе");
      }

      // 3. Получаем мэппинг навыков на компетенции
      const skillsMappings = await db.select().from(skillToDnaMapping);
      if (!skillsMappings.length) {
        console.warn("Не найдены мэппинги навыков на компетенции");
      }

      // 4. Вычисляем прогресс для каждой компетенции DNA на основе диагностики
      const competencyProgress: Record<number, { 
        level: string, 
        progress: number, 
        source: string 
      }> = {};

      // Сначала рассчитываем прямые соответствия из диагностики
      for (const skillName in skills) {
        const skillValue = skills[skillName];
        
        // Находим подходящие компетенции для навыка через связи в БД
        // Если точного мэппинга нет, используем приблизительное соответствие по названию
        const skillDnaMappings = skillsMappings.filter(mapping => {
          const matchingDna = allSkillsDna.find(dna => dna.id === mapping.dnaId);
          // Проверяем на точное соответствие по мэппингу или приблизительное по названию
          return matchingDna && 
            (matchingDna.name.toLowerCase().includes(skillName.toLowerCase()) || 
             skillName.toLowerCase().includes(matchingDna.name.toLowerCase()));
        });

        // Если нашли мэппинги, рассчитываем прогресс для соответствующих компетенций
        if (skillDnaMappings.length > 0) {
          for (const mapping of skillDnaMappings) {
            if (!competencyProgress[mapping.dnaId]) {
              // Определяем уровень на основе значения навыка
              const level = this.calculateSkillLevel(skillValue);
              competencyProgress[mapping.dnaId] = {
                level,
                progress: skillValue,
                source: `diagnostic-${diagnosticType}`
              };
            } else {
              // Если компетенция уже есть в результатах, берем максимальное значение
              const currentProgress = competencyProgress[mapping.dnaId].progress;
              if (skillValue > currentProgress) {
                competencyProgress[mapping.dnaId] = {
                  level: this.calculateSkillLevel(skillValue),
                  progress: skillValue,
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
      // Получаем все записи прогресса пользователя
      const progressEntries = await db.select()
        .from(userSkillsDnaProgress)
        .where(eq(userSkillsDnaProgress.userId, userId));
      
      if (!progressEntries.length) {
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
      const progressWithDetails = await this.getUserDnaProgress(userId);
      
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
}

export const diagnosisService = new DiagnosisService();
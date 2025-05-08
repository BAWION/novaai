/**
 * time-saved-service.ts
 * 
 * Сервис для функциональности S4 (INSIGHT "Time-Saved")
 * Рассчитывает и отслеживает экономию времени пользователей на основе их навыков
 */

import { db } from "../db";
import { 
  skillTimeEfficiency, 
  userSkillsDnaProgress, 
  userSkillTimeSaved,
  userTimeSavedHistory,
  userTimeSavedGoals
} from "@shared/schema";
import { eq, and, sql, desc, gte } from "drizzle-orm";

export interface TimeSavedSummary {
  totalMinutesSaved: number;
  totalHoursSaved: number;
  dailyMinutesSaved: number;
  weeklyMinutesSaved: number;
  monthlyMinutesSaved: number;
  yearlyHoursSaved: number;
  topSkills: SkillTimeSavedDetails[];
  lastCalculatedAt: Date;
}

export interface SkillTimeSavedDetails {
  skillId: number;
  skillName: string;
  currentLevel: number;
  minutesSavedMonthly: number;
  hoursSavedMonthly: number;
  percentage: number; // Доля в общей экономии
}

export interface TimeSavedGoal {
  id: number;
  userId: number;
  targetMinutesMonthly: number;
  targetHoursMonthly: number;
  startDate: Date;
  targetDate: Date;
  status: string;
  progress: number; // От 0 до 1
  remainingDays: number;
}

export interface TimeSavedHistoryPoint {
  date: Date;
  totalMinutesSaved: number;
  totalHoursSaved: number;
}

/**
 * Сервис для расчета и отслеживания экономии времени
 */
export class TimeSavedService {
  /**
   * Проверяет необходимость обновления расчетов экономии времени
   * @param userId ID пользователя
   * @returns true если требуется обновление
   */
  async needsRecalculation(userId: number): Promise<boolean> {
    // Проверяем, когда в последний раз выполнялся расчет
    const [lastCalculation] = await db
      .select()
      .from(userTimeSavedHistory)
      .where(eq(userTimeSavedHistory.userId, userId))
      .orderBy(desc(userTimeSavedHistory.calculationDate))
      .limit(1);
    
    if (!lastCalculation) {
      return true; // Если расчетов еще не было, то требуется выполнить
    }
    
    // Проверяем наличие изменений в навыках с момента последнего расчета
    const [skillsUpdated] = await db
      .select({ count: sql<number>`count(*)` })
      .from(userSkillsDnaProgress)
      .where(and(
        eq(userSkillsDnaProgress.userId, userId),
        sql`${userSkillsDnaProgress.updatedAt} > ${lastCalculation.calculationDate}`
      ));
    
    // Если были обновления навыков после последнего расчета, нужно пересчитать
    return (skillsUpdated && skillsUpdated.count > 0);
  }
  
  /**
   * Расчет экономии времени для пользователя по всем его навыкам
   * @param userId ID пользователя
   */
  async calculateTimeSaved(userId: number): Promise<TimeSavedSummary> {
    console.log(`Расчет экономии времени для пользователя ${userId}...`);
    
    try {
      // Получаем текущие навыки пользователя
      const userSkills = await db
        .select()
        .from(userSkillsDnaProgress)
        .where(eq(userSkillsDnaProgress.userId, userId));
      
      if (!userSkills || userSkills.length === 0) {
        console.log(`У пользователя ${userId} нет навыков для расчета экономии времени`);
        
        // Возвращаем нулевые показатели
        return {
          totalMinutesSaved: 0,
          totalHoursSaved: 0,
          dailyMinutesSaved: 0,
          weeklyMinutesSaved: 0,
          monthlyMinutesSaved: 0,
          yearlyHoursSaved: 0,
          topSkills: [],
          lastCalculatedAt: new Date()
        };
      }
      
      // Для каждого навыка получаем данные по экономии времени и рассчитываем
      const skillDetails: SkillTimeSavedDetails[] = [];
      let totalMonthlyMinutes = 0;
      
      for (const skill of userSkills) {
        if (!skill.currentLevel || skill.currentLevel < 1) {
          continue; // Пропускаем навыки с нулевым уровнем
        }
        
        // Получаем данные по эффективности для конкретного навыка и уровня
        const [efficiency] = await db
          .select()
          .from(skillTimeEfficiency)
          .where(and(
            eq(skillTimeEfficiency.dnaId, skill.dnaId),
            eq(skillTimeEfficiency.level, skill.currentLevel)
          ));
        
        if (!efficiency) {
          console.log(`Нет данных об эффективности для навыка ${skill.dnaId} уровня ${skill.currentLevel}`);
          continue;
        }
        
        // Расчет минут, сэкономленных в месяц с этим навыком
        const minutesSavedMonthly = efficiency.minutesSavedPerTask * efficiency.typicalTasksPerMonth;
        totalMonthlyMinutes += minutesSavedMonthly;
        
        // Получаем информацию о названии навыка
        const [skillInfo] = await db
          .select()
          .from(userSkillsDnaProgress)
          .innerJoin('skills_dna', sql`skills_dna.id = ${userSkillsDnaProgress.dnaId}`)
          .where(and(
            eq(userSkillsDnaProgress.userId, userId),
            eq(userSkillsDnaProgress.dnaId, skill.dnaId)
          ));
        
        // Сохраняем детали по навыку
        skillDetails.push({
          skillId: skill.dnaId,
          skillName: skillInfo?.skills_dna?.name || `Навык #${skill.dnaId}`,
          currentLevel: skill.currentLevel,
          minutesSavedMonthly,
          hoursSavedMonthly: minutesSavedMonthly / 60,
          percentage: 0 // Заполним позже, когда будет известна общая сумма
        });
        
        // Обновляем или создаем запись в таблице userSkillTimeSaved
        const [existingRecord] = await db
          .select()
          .from(userSkillTimeSaved)
          .where(and(
            eq(userSkillTimeSaved.userId, userId),
            eq(userSkillTimeSaved.dnaId, skill.dnaId)
          ));
        
        if (existingRecord) {
          await db
            .update(userSkillTimeSaved)
            .set({
              currentLevel: skill.currentLevel,
              minutesSavedMonthly,
              lastCalculatedAt: new Date(),
              updatedAt: new Date()
            })
            .where(eq(userSkillTimeSaved.id, existingRecord.id));
        } else {
          await db
            .insert(userSkillTimeSaved)
            .values({
              userId,
              dnaId: skill.dnaId,
              currentLevel: skill.currentLevel,
              minutesSavedMonthly,
              lastCalculatedAt: new Date()
            });
        }
      }
      
      // Теперь, когда у нас есть общая сумма, рассчитываем проценты
      for (const detail of skillDetails) {
        detail.percentage = totalMonthlyMinutes > 0 
          ? (detail.minutesSavedMonthly / totalMonthlyMinutes) * 100 
          : 0;
      }
      
      // Сортируем навыки по убыванию экономии времени
      skillDetails.sort((a, b) => b.minutesSavedMonthly - a.minutesSavedMonthly);
      
      // Берем топ-5 навыков
      const topSkills = skillDetails.slice(0, 5);
      
      // Записываем историю экономии времени
      await db
        .insert(userTimeSavedHistory)
        .values({
          userId,
          totalMinutesSaved: totalMonthlyMinutes,
          calculationDate: new Date()
        });
      
      // Формируем и возвращаем итоговую информацию
      const summary: TimeSavedSummary = {
        totalMinutesSaved: totalMonthlyMinutes,
        totalHoursSaved: totalMonthlyMinutes / 60,
        dailyMinutesSaved: totalMonthlyMinutes / 30, // Примерно в день
        weeklyMinutesSaved: (totalMonthlyMinutes / 30) * 7, // Примерно в неделю
        monthlyMinutesSaved: totalMonthlyMinutes,
        yearlyHoursSaved: (totalMonthlyMinutes * 12) / 60, // В часах за год
        topSkills,
        lastCalculatedAt: new Date()
      };
      
      console.log(`Расчет завершен. Экономия: ${totalMonthlyMinutes} минут в месяц.`);
      return summary;
      
    } catch (error) {
      console.error(`Ошибка при расчете экономии времени для пользователя ${userId}:`, error);
      throw error;
    }
  }
  
  /**
   * Получение сводки по экономии времени пользователя
   * @param userId ID пользователя
   */
  async getTimeSavedSummary(userId: number): Promise<TimeSavedSummary> {
    try {
      // Проверяем, нужно ли обновить расчеты
      const needsUpdate = await this.needsRecalculation(userId);
      
      if (needsUpdate) {
        console.log(`Требуется пересчет экономии времени для пользователя ${userId}`);
        return this.calculateTimeSaved(userId);
      }
      
      // Если пересчет не требуется, получаем данные из базы
      const [latestHistory] = await db
        .select()
        .from(userTimeSavedHistory)
        .where(eq(userTimeSavedHistory.userId, userId))
        .orderBy(desc(userTimeSavedHistory.calculationDate))
        .limit(1);
      
      // Если истории нет, запускаем расчет
      if (!latestHistory) {
        console.log(`История экономии времени не найдена для ${userId}, запуск расчета`);
        return this.calculateTimeSaved(userId);
      }
      
      // Получаем детализацию по навыкам
      const skillDetails = await db
        .select()
        .from(userSkillTimeSaved)
        .innerJoin('skills_dna', sql`skills_dna.id = ${userSkillTimeSaved.dnaId}`)
        .where(eq(userSkillTimeSaved.userId, userId))
        .orderBy(desc(userSkillTimeSaved.minutesSavedMonthly));
      
      // Преобразуем в нужный формат
      const totalMonthlyMinutes = latestHistory.totalMinutesSaved;
      
      const topSkills: SkillTimeSavedDetails[] = skillDetails.slice(0, 5).map(item => ({
        skillId: item.userSkillTimeSaved.dnaId,
        skillName: item.skills_dna?.name || `Навык #${item.userSkillTimeSaved.dnaId}`,
        currentLevel: item.userSkillTimeSaved.currentLevel,
        minutesSavedMonthly: item.userSkillTimeSaved.minutesSavedMonthly,
        hoursSavedMonthly: item.userSkillTimeSaved.minutesSavedMonthly / 60,
        percentage: totalMonthlyMinutes > 0 
          ? (item.userSkillTimeSaved.minutesSavedMonthly / totalMonthlyMinutes) * 100 
          : 0
      }));
      
      // Формируем итоговую сводку
      const summary: TimeSavedSummary = {
        totalMinutesSaved: totalMonthlyMinutes,
        totalHoursSaved: totalMonthlyMinutes / 60,
        dailyMinutesSaved: totalMonthlyMinutes / 30, // Примерно в день
        weeklyMinutesSaved: (totalMonthlyMinutes / 30) * 7, // Примерно в неделю
        monthlyMinutesSaved: totalMonthlyMinutes,
        yearlyHoursSaved: (totalMonthlyMinutes * 12) / 60, // В часах за год
        topSkills,
        lastCalculatedAt: latestHistory.calculationDate
      };
      
      return summary;
      
    } catch (error) {
      console.error(`Ошибка при получении сводки экономии времени для ${userId}:`, error);
      throw error;
    }
  }
  
  /**
   * Получение истории экономии времени пользователя
   * @param userId ID пользователя
   * @param limit Ограничение количества записей
   */
  async getTimeSavedHistory(userId: number, limit: number = 12): Promise<TimeSavedHistoryPoint[]> {
    try {
      const history = await db
        .select()
        .from(userTimeSavedHistory)
        .where(eq(userTimeSavedHistory.userId, userId))
        .orderBy(desc(userTimeSavedHistory.calculationDate))
        .limit(limit);
      
      return history.map(item => ({
        date: item.calculationDate,
        totalMinutesSaved: item.totalMinutesSaved,
        totalHoursSaved: item.totalMinutesSaved / 60
      }));
      
    } catch (error) {
      console.error(`Ошибка при получении истории экономии времени для ${userId}:`, error);
      return [];
    }
  }
  
  /**
   * Создание цели по экономии времени
   * @param userId ID пользователя
   * @param targetMinutesMonthly Целевая экономия минут в месяц
   * @param targetDateStr Целевая дата в формате "YYYY-MM-DD"
   */
  async createTimeSavedGoal(userId: number, targetMinutesMonthly: number, targetDateStr: string): Promise<TimeSavedGoal> {
    try {
      // Валидация параметров
      if (targetMinutesMonthly <= 0) {
        throw new Error("Целевая экономия времени должна быть положительным числом");
      }
      
      const targetDate = new Date(targetDateStr);
      if (isNaN(targetDate.getTime())) {
        throw new Error("Недействительная целевая дата");
      }
      
      const now = new Date();
      if (targetDate <= now) {
        throw new Error("Целевая дата должна быть в будущем");
      }
      
      // Создаем новую цель
      const [newGoal] = await db
        .insert(userTimeSavedGoals)
        .values({
          userId,
          targetMinutesMonthly,
          startDate: now,
          targetDate,
          status: "active"
        })
        .returning();
      
      // Рассчитываем прогресс - сколько времени пользователь уже экономит
      const summary = await this.getTimeSavedSummary(userId);
      const progress = Math.min(1, summary.monthlyMinutesSaved / targetMinutesMonthly);
      
      // Рассчитываем оставшиеся дни
      const remainingDays = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      return {
        id: newGoal.id,
        userId: newGoal.userId,
        targetMinutesMonthly: newGoal.targetMinutesMonthly,
        targetHoursMonthly: newGoal.targetMinutesMonthly / 60,
        startDate: newGoal.startDate,
        targetDate: newGoal.targetDate,
        status: newGoal.status,
        progress,
        remainingDays
      };
      
    } catch (error) {
      console.error(`Ошибка при создании цели экономии времени для ${userId}:`, error);
      throw error;
    }
  }
  
  /**
   * Получение целей пользователя по экономии времени
   * @param userId ID пользователя
   */
  async getUserTimeSavedGoals(userId: number): Promise<TimeSavedGoal[]> {
    try {
      // Получаем все цели пользователя
      const goals = await db
        .select()
        .from(userTimeSavedGoals)
        .where(eq(userTimeSavedGoals.userId, userId))
        .orderBy(desc(userTimeSavedGoals.createdAt));
      
      // Получаем текущую экономию времени
      const summary = await this.getTimeSavedSummary(userId);
      const now = new Date();
      
      // Формируем ответ с прогрессом
      return goals.map(goal => {
        const progress = Math.min(1, summary.monthlyMinutesSaved / goal.targetMinutesMonthly);
        const remainingDays = Math.max(0, Math.ceil((goal.targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
        
        return {
          id: goal.id,
          userId: goal.userId,
          targetMinutesMonthly: goal.targetMinutesMonthly,
          targetHoursMonthly: goal.targetMinutesMonthly / 60,
          startDate: goal.startDate,
          targetDate: goal.targetDate,
          status: goal.status,
          progress,
          remainingDays
        };
      });
      
    } catch (error) {
      console.error(`Ошибка при получении целей экономии времени для ${userId}:`, error);
      return [];
    }
  }
  
  /**
   * Обновление статуса целей пользователя (завершение достигнутых целей)
   * @param userId ID пользователя
   */
  async updateGoalsStatus(userId: number): Promise<number> {
    try {
      // Получаем все активные цели пользователя
      const activeGoals = await db
        .select()
        .from(userTimeSavedGoals)
        .where(and(
          eq(userTimeSavedGoals.userId, userId),
          eq(userTimeSavedGoals.status, "active")
        ));
      
      if (activeGoals.length === 0) {
        return 0; // Нет активных целей
      }
      
      // Получаем текущую экономию времени
      const summary = await this.getTimeSavedSummary(userId);
      let updatedCount = 0;
      
      // Проверяем каждую цель
      for (const goal of activeGoals) {
        // Проверяем достигнута ли цель по времени
        if (summary.monthlyMinutesSaved >= goal.targetMinutesMonthly) {
          await db
            .update(userTimeSavedGoals)
            .set({
              status: "completed",
              updatedAt: new Date()
            })
            .where(eq(userTimeSavedGoals.id, goal.id));
          
          updatedCount++;
        }
        // Проверяем истек ли срок цели
        else if (new Date() > goal.targetDate) {
          await db
            .update(userTimeSavedGoals)
            .set({
              status: "expired",
              updatedAt: new Date()
            })
            .where(eq(userTimeSavedGoals.id, goal.id));
          
          updatedCount++;
        }
      }
      
      return updatedCount;
      
    } catch (error) {
      console.error(`Ошибка при обновлении статуса целей для ${userId}:`, error);
      return 0;
    }
  }
}

// Экспортируем экземпляр сервиса
export const timeSavedService = new TimeSavedService();
import { db } from "../db";
import { 
  userSkills,
  timeSaved,
  timeSavedHistory,
  timeSavedGoals
} from "@shared/schema";
import { desc, eq, sql, gte, and } from "drizzle-orm";

/**
 * Сервис для работы с функциональностью экономии времени
 */
export class TimeSavedService {
  /**
   * Рассчитывает экономию времени для пользователя на основе его уровней навыков
   * @param userId ID пользователя
   */
  async calculateTimeSaved(userId: number) {
    try {
      // Получаем все навыки пользователя
      const skills = await db
        .select()
        .from(userSkills)
        .where(eq(userSkills.userId, userId));
      
      if (!skills.length) {
        return { totalMinutesSaved: 0 };
      }

      // Расчет экономии времени на основе уровней навыка
      // Формула: сумма (уровень * коэффициент эффективности для навыка)
      let totalMinutesSaved = 0;
      const coefficientsByLevel = {
        'awareness': 5,     // 5 минут в день
        'knowledge': 15,    // 15 минут в день
        'application': 30,  // 30 минут в день
        'mastery': 60,      // 1 час в день
        'expertise': 120    // 2 часа в день
      };

      const effectivenessMultipliers: Record<number, number> = {};
      
      // Получаем коэффициенты эффективности для всех навыков пользователя
      // (в реальной системе будут храниться в базе данных)
      for (const skill of skills) {
        // Базовый коэффициент эффективности зависит от категории навыка
        const effectivenessMultiplier = this.getEffectivenessMultiplier(skill.skillId);
        effectivenessMultipliers[skill.skillId] = effectivenessMultiplier;
      }

      // Расчет общей экономии времени
      for (const skill of skills) {
        const levelName = skill.level.toLowerCase();
        const baseMinutes = coefficientsByLevel[levelName as keyof typeof coefficientsByLevel] || 0;
        const effectiveness = effectivenessMultipliers[skill.skillId] || 1;
        
        const minutesSaved = baseMinutes * effectiveness;
        totalMinutesSaved += minutesSaved;
      }

      // Сохраняем расчет в базу данных
      const today = new Date();
      
      // Записываем в основную таблицу экономии времени
      const [existingRecord] = await db
        .select()
        .from(timeSaved)
        .where(eq(timeSaved.userId, userId));

      if (existingRecord) {
        await db
          .update(timeSaved)
          .set({
            minutesPerDay: totalMinutesSaved,
            updatedAt: today
          })
          .where(eq(timeSaved.userId, userId));
      } else {
        await db
          .insert(timeSaved)
          .values({
            userId,
            minutesPerDay: totalMinutesSaved,
            createdAt: today,
            updatedAt: today
          });
      }

      // Записываем в историю
      await db
        .insert(timeSavedHistory)
        .values({
          userId,
          date: today,
          minutesSaved: totalMinutesSaved
        });

      return { totalMinutesSaved };
    } catch (error) {
      console.error('Ошибка при расчете экономии времени:', error);
      throw error;
    }
  }

  /**
   * Получает сводную информацию об экономии времени для пользователя
   * @param userId ID пользователя
   */
  async getTimeSavedSummary(userId: number) {
    try {
      // Получаем текущую экономию времени
      const [timeSavedRecord] = await db
        .select()
        .from(timeSaved)
        .where(eq(timeSaved.userId, userId));

      if (!timeSavedRecord) {
        // Если записей нет, выполняем расчет
        await this.calculateTimeSaved(userId);
        const [newRecord] = await db
          .select()
          .from(timeSaved)
          .where(eq(timeSaved.userId, userId));
        
        if (!newRecord) {
          return {
            minutesPerDay: 0,
            hoursPerWeek: 0,
            hoursPerMonth: 0,
            hoursPerYear: 0,
            daysPerYear: 0
          };
        }
        
        return this.formatTimeSavedSummary(newRecord.minutesPerDay);
      }

      return this.formatTimeSavedSummary(timeSavedRecord.minutesPerDay);
    } catch (error) {
      console.error('Ошибка при получении сводки экономии времени:', error);
      throw error;
    }
  }

  /**
   * Получает историю экономии времени для пользователя
   * @param userId ID пользователя
   * @param limit Ограничение на количество записей
   */
  async getTimeSavedHistory(userId: number, limit = 30) {
    try {
      const history = await db
        .select()
        .from(timeSavedHistory)
        .where(eq(timeSavedHistory.userId, userId))
        .orderBy(desc(timeSavedHistory.date))
        .limit(limit);

      return history;
    } catch (error) {
      console.error('Ошибка при получении истории экономии времени:', error);
      throw error;
    }
  }

  /**
   * Создает новую цель по экономии времени
   * @param userId ID пользователя
   * @param targetMinutesMonthly Целевое количество минут ежемесячной экономии
   * @param targetDate Дата достижения цели
   */
  async createTimeSavedGoal(
    userId: number,
    targetMinutesMonthly: number,
    targetDate: Date
  ) {
    try {
      const [newGoal] = await db
        .insert(timeSavedGoals)
        .values({
          userId,
          targetMinutesMonthly,
          targetDate,
          status: 'active',
          createdAt: new Date()
        })
        .returning();

      return newGoal;
    } catch (error) {
      console.error('Ошибка при создании цели экономии времени:', error);
      throw error;
    }
  }

  /**
   * Получает цели по экономии времени для пользователя с расчетом прогресса
   * @param userId ID пользователя
   */
  async getTimeSavedGoals(userId: number) {
    try {
      const goals = await db
        .select()
        .from(timeSavedGoals)
        .where(eq(timeSavedGoals.userId, userId))
        .orderBy(desc(timeSavedGoals.createdAt));

      // Получаем текущую экономию времени
      const [currentTimeSaved] = await db
        .select()
        .from(timeSaved)
        .where(eq(timeSaved.userId, userId));

      // Если нет целей или текущей экономии, возвращаем пустой список
      if (!goals.length || !currentTimeSaved) {
        return [];
      }

      // Для каждой цели рассчитываем прогресс
      const goalsWithProgress = goals.map(goal => {
        const currentMonthlyMinutes = currentTimeSaved.minutesPerDay * 30; // Приблизительно в месяц
        const progressPercent = Math.min(
          100,
          Math.round((currentMonthlyMinutes / goal.targetMinutesMonthly) * 100)
        );

        // Определяем, достигнута ли цель
        const isAchieved = progressPercent >= 100;
        
        // Обновляем статус, если цель достигнута, но статус не изменен
        if (isAchieved && goal.status === 'active') {
          // Асинхронно обновляем статус (не ждем завершения)
          this.updateGoalStatus(goal.id, 'achieved').catch(console.error);
        }

        return {
          ...goal,
          currentMonthlyMinutes,
          progressPercent,
          isAchieved
        };
      });

      return goalsWithProgress;
    } catch (error) {
      console.error('Ошибка при получении целей по экономии времени:', error);
      throw error;
    }
  }

  /**
   * Обновляет статус цели
   * @param goalId ID цели
   * @param status Новый статус
   */
  async updateGoalStatus(goalId: number, status: string) {
    try {
      await db
        .update(timeSavedGoals)
        .set({ status })
        .where(eq(timeSavedGoals.id, goalId));
    } catch (error) {
      console.error('Ошибка при обновлении статуса цели:', error);
      throw error;
    }
  }

  // Вспомогательные методы

  /**
   * Форматирует данные об экономии времени
   * @param minutesPerDay Минут экономии в день
   */
  private formatTimeSavedSummary(minutesPerDay: number) {
    const hoursPerDay = minutesPerDay / 60;
    const hoursPerWeek = hoursPerDay * 7;
    const hoursPerMonth = hoursPerDay * 30;
    const hoursPerYear = hoursPerDay * 365;
    const daysPerYear = hoursPerYear / 24;

    return {
      minutesPerDay,
      hoursPerWeek: parseFloat(hoursPerWeek.toFixed(1)),
      hoursPerMonth: parseFloat(hoursPerMonth.toFixed(1)),
      hoursPerYear: parseFloat(hoursPerYear.toFixed(1)),
      daysPerYear: parseFloat(daysPerYear.toFixed(1))
    };
  }

  /**
   * Получает коэффициент эффективности для навыка
   * @param skillId ID навыка
   */
  private getEffectivenessMultiplier(skillId: number) {
    // В реальной системе эти коэффициенты будут храниться в базе данных
    // и могут зависеть от различных факторов

    // Базовые коэффициенты по категориям навыков:
    // 1-100: Базовые навыки программирования (1.0)
    // 101-200: Навыки работы с данными (1.2)
    // 201-300: Навыки работы с ИИ (1.5)
    // 301-400: Навыки управления проектами (1.3)
    // 401-500: Навыки коммуникации (1.1)
    // Остальные: 1.0

    if (skillId >= 1 && skillId <= 100) return 1.0;
    if (skillId >= 101 && skillId <= 200) return 1.2;
    if (skillId >= 201 && skillId <= 300) return 1.5;
    if (skillId >= 301 && skillId <= 400) return 1.3;
    if (skillId >= 401 && skillId <= 500) return 1.1;
    return 1.0;
  }
}
/**
 * Типы данных для функциональности S4 (INSIGHT "Time-Saved")
 */

export interface SkillTimeSavedDetails {
  skillId: number;
  skillName: string;
  currentLevel: number;
  minutesSavedMonthly: number;
  hoursSavedMonthly: number;
  percentage: number; // Доля в общей экономии
}

export interface TimeSavedSummary {
  totalMinutesSaved: number;
  totalHoursSaved: number;
  dailyMinutesSaved: number;
  weeklyMinutesSaved: number;
  monthlyMinutesSaved: number;
  yearlyHoursSaved: number;
  topSkills: SkillTimeSavedDetails[];
  lastCalculatedAt: string | Date;
}

export interface TimeSavedHistoryPoint {
  date: string | Date;
  totalMinutesSaved: number;
  totalHoursSaved: number;
}

export interface TimeSavedGoal {
  id: number;
  userId: number;
  targetMinutesMonthly: number;
  targetHoursMonthly: number;
  startDate: string | Date;
  targetDate: string | Date;
  status: string;
  progress: number; // От 0 до 1
  remainingDays: number;
}
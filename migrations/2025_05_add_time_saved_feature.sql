-- Миграция для S4 (INSIGHT "Time-Saved")
-- Добавляет таблицы для расчета и отслеживания экономии времени пользователей

-- Таблица сопоставления навыков и экономии времени
CREATE TABLE IF NOT EXISTS "skill_time_efficiency" (
  "id" SERIAL PRIMARY KEY,
  "dna_id" INTEGER NOT NULL REFERENCES "skills_dna"("id") ON DELETE CASCADE,
  "level" INTEGER NOT NULL, -- уровень навыка (1-5)
  "minutes_saved_per_task" INTEGER NOT NULL, -- минут сэкономлено на одной задаче
  "typical_tasks_per_month" INTEGER NOT NULL, -- типичное количество задач в месяц
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("dna_id", "level")
);

-- Таблица истории экономии времени пользователя
CREATE TABLE IF NOT EXISTS "user_time_saved_history" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "total_minutes_saved" INTEGER NOT NULL DEFAULT 0,
  "calculation_date" TIMESTAMP NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица детализации экономии времени по навыкам
CREATE TABLE IF NOT EXISTS "user_skill_time_saved" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "dna_id" INTEGER NOT NULL REFERENCES "skills_dna"("id") ON DELETE CASCADE,
  "current_level" INTEGER NOT NULL,
  "minutes_saved_monthly" INTEGER NOT NULL DEFAULT 0,
  "last_calculated_at" TIMESTAMP NOT NULL,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE ("user_id", "dna_id")
);

-- Таблица целей по экономии времени
CREATE TABLE IF NOT EXISTS "user_time_saved_goals" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "target_minutes_monthly" INTEGER NOT NULL,
  "start_date" TIMESTAMP NOT NULL,
  "target_date" TIMESTAMP NOT NULL,
  "status" VARCHAR(20) NOT NULL DEFAULT 'active', -- active, completed, abandoned
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Добавим начальные значения эффективности для основных навыков
INSERT INTO "skill_time_efficiency" ("dna_id", "level", "minutes_saved_per_task", "typical_tasks_per_month")
VALUES
  -- Python Basics
  (1, 1, 5, 10),   -- Начальный уровень - малая экономия
  (1, 2, 10, 15),  -- Средняя экономия
  (1, 3, 20, 20),  -- Значительная экономия
  (1, 4, 30, 25),  -- Высокая экономия
  (1, 5, 45, 30),  -- Экспертная экономия
  
  -- AI Prompting
  (2, 1, 8, 20),   -- Даже базовые навыки промптинга дают хорошую экономию
  (2, 2, 15, 30),
  (2, 3, 25, 40),
  (2, 4, 40, 50),
  (2, 5, 60, 60),  -- Эксперты в промптинге существенно экономят время
  
  -- Data Analysis
  (3, 1, 10, 5),
  (3, 2, 20, 10),
  (3, 3, 35, 15),
  (3, 4, 50, 20),
  (3, 5, 75, 25),
  
  -- Machine Learning
  (4, 1, 15, 3),
  (4, 2, 30, 5),
  (4, 3, 60, 8),
  (4, 4, 90, 12),
  (4, 5, 120, 15),
  
  -- AI Ethics
  (5, 1, 3, 5),
  (5, 2, 5, 10),
  (5, 3, 10, 15),
  (5, 4, 15, 20),
  (5, 5, 20, 25)
ON CONFLICT ("dna_id", "level") DO UPDATE 
SET 
  "minutes_saved_per_task" = EXCLUDED."minutes_saved_per_task",
  "typical_tasks_per_month" = EXCLUDED."typical_tasks_per_month",
  "updated_at" = CURRENT_TIMESTAMP;

-- Создаем представление для быстрого расчета экономии времени
CREATE OR REPLACE VIEW "user_time_saved_summary" AS
SELECT 
  uss."user_id",
  SUM(uss."minutes_saved_monthly") AS "total_minutes_saved_monthly",
  SUM(uss."minutes_saved_monthly") / 60.0 AS "total_hours_saved_monthly",
  MAX(uss."last_calculated_at") AS "last_calculated_at"
FROM 
  "user_skill_time_saved" uss
GROUP BY 
  uss."user_id";
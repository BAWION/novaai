-- Миграция для создания мониторинга диагностики Skills DNA
-- Создаем механизм отслеживания потерянных сессий диагностики

-- Добавляем новый тип ивента в events если еще не существует
DO $$BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type 
    WHERE typname = 'event_type' 
  ) THEN
    CREATE TYPE event_type AS ENUM (
      'page_view', 
      'course_start', 
      'course_complete', 
      'login', 
      'registration',
      'diagnosis_started',
      'diagnosis_completed',
      'diagnosis_cached',
      'diagnosis_recovered',
      'diagnosis_lost_session'
    );
  ELSE
    -- Добавляем новые значения в существующий тип enum
    ALTER TYPE event_type ADD VALUE IF NOT EXISTS 'diagnosis_started';
    ALTER TYPE event_type ADD VALUE IF NOT EXISTS 'diagnosis_completed';
    ALTER TYPE event_type ADD VALUE IF NOT EXISTS 'diagnosis_cached';
    ALTER TYPE event_type ADD VALUE IF NOT EXISTS 'diagnosis_recovered';
    ALTER TYPE event_type ADD VALUE IF NOT EXISTS 'diagnosis_lost_session';
  END IF;
END$$;

-- Создаем таблицу для метрик диагностики если не существует
CREATE TABLE IF NOT EXISTS diagnosis_metrics (
  id SERIAL PRIMARY KEY,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  diagnostic_type VARCHAR(20) NOT NULL,
  sessions_started INTEGER NOT NULL DEFAULT 0,
  sessions_completed INTEGER NOT NULL DEFAULT 0,
  sessions_lost INTEGER NOT NULL DEFAULT 0,
  recovery_attempts INTEGER NOT NULL DEFAULT 0,
  successful_recoveries INTEGER NOT NULL DEFAULT 0,
  avg_recovery_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (metric_date, diagnostic_type)
);

-- Создаем индексы для быстрого доступа
CREATE INDEX IF NOT EXISTS idx_diagnosis_metrics_date 
  ON diagnosis_metrics (metric_date);

CREATE INDEX IF NOT EXISTS idx_diagnosis_metrics_type 
  ON diagnosis_metrics (diagnostic_type);

-- Создаем функцию для обновления метрик
CREATE OR REPLACE FUNCTION update_diagnosis_metrics()
RETURNS TRIGGER AS $$
BEGIN
  -- Инкрементируем соответствующие счетчики
  IF NEW.event_type = 'diagnosis_started' THEN
    INSERT INTO diagnosis_metrics (metric_date, diagnostic_type, sessions_started)
    VALUES (CURRENT_DATE, NEW.data->>'diagnosticType', 1)
    ON CONFLICT (metric_date, diagnostic_type) 
    DO UPDATE SET 
      sessions_started = diagnosis_metrics.sessions_started + 1,
      updated_at = NOW();
  ELSIF NEW.event_type = 'diagnosis_completed' THEN
    INSERT INTO diagnosis_metrics (metric_date, diagnostic_type, sessions_completed)
    VALUES (CURRENT_DATE, NEW.data->>'diagnosticType', 1)
    ON CONFLICT (metric_date, diagnostic_type) 
    DO UPDATE SET 
      sessions_completed = diagnosis_metrics.sessions_completed + 1,
      updated_at = NOW();
  ELSIF NEW.event_type = 'diagnosis_lost_session' THEN
    INSERT INTO diagnosis_metrics (metric_date, diagnostic_type, sessions_lost)
    VALUES (CURRENT_DATE, NEW.data->>'diagnosticType', 1)
    ON CONFLICT (metric_date, diagnostic_type) 
    DO UPDATE SET 
      sessions_lost = diagnosis_metrics.sessions_lost + 1,
      updated_at = NOW();
  ELSIF NEW.event_type = 'diagnosis_recovered' THEN
    INSERT INTO diagnosis_metrics (
      metric_date, diagnostic_type, recovery_attempts, successful_recoveries,
      avg_recovery_time_ms
    )
    VALUES (
      CURRENT_DATE, 
      NEW.data->>'diagnosticType', 
      1, 
      CASE WHEN NEW.data->>'success' = 'true' THEN 1 ELSE 0 END,
      (NEW.data->>'recoveryTimeMs')::INTEGER
    )
    ON CONFLICT (metric_date, diagnostic_type) 
    DO UPDATE SET 
      recovery_attempts = diagnosis_metrics.recovery_attempts + 1,
      successful_recoveries = diagnosis_metrics.successful_recoveries + 
                             CASE WHEN NEW.data->>'success' = 'true' THEN 1 ELSE 0 END,
      avg_recovery_time_ms = (
        (diagnosis_metrics.avg_recovery_time_ms * diagnosis_metrics.recovery_attempts + 
         (NEW.data->>'recoveryTimeMs')::INTEGER) / 
        (diagnosis_metrics.recovery_attempts + 1)
      ),
      updated_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Создаем триггер если его еще не существует
DO $$BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'trg_update_diagnosis_metrics'
  ) THEN
    CREATE TRIGGER trg_update_diagnosis_metrics
    AFTER INSERT ON events
    FOR EACH ROW
    WHEN (
      NEW.event_type IN (
        'diagnosis_started', 
        'diagnosis_completed', 
        'diagnosis_lost_session',
        'diagnosis_recovered'
      )
    )
    EXECUTE FUNCTION update_diagnosis_metrics();
  END IF;
END$$;

-- Создаем представление для мониторинга конверсии
CREATE OR REPLACE VIEW diagnosis_conversion_rates AS
SELECT 
  metric_date,
  diagnostic_type,
  sessions_started,
  sessions_completed,
  sessions_lost,
  recovery_attempts,
  successful_recoveries,
  CASE 
    WHEN sessions_started = 0 THEN 0
    ELSE ROUND((sessions_completed::FLOAT / sessions_started) * 100, 2)
  END AS completion_rate,
  CASE 
    WHEN recovery_attempts = 0 THEN 0
    ELSE ROUND((successful_recoveries::FLOAT / recovery_attempts) * 100, 2)
  END AS recovery_rate,
  CASE 
    WHEN sessions_started = 0 THEN 0
    ELSE ROUND((sessions_lost::FLOAT / sessions_started) * 100, 2)
  END AS loss_rate,
  avg_recovery_time_ms
FROM 
  diagnosis_metrics
ORDER BY 
  metric_date DESC, 
  diagnostic_type;

-- Создаем правило для алерта при слишком высокой частоте потерянных сессий
-- Примечание: Для настоящего алерта нужно настроить отдельный инструмент, как PostgreSQL notify или внешний мониторинг
COMMENT ON VIEW diagnosis_conversion_rates IS 
  'Alert: Высокий уровень потерянных сессий (>5%) требует проверки процесса диагностики';

-- Добавляем индекс для быстрого поиска событий диагностики
CREATE INDEX IF NOT EXISTS idx_events_diagnosis_types
ON events (event_type)
WHERE event_type IN (
  'diagnosis_started', 
  'diagnosis_completed', 
  'diagnosis_cached',
  'diagnosis_recovered',
  'diagnosis_lost_session'
);
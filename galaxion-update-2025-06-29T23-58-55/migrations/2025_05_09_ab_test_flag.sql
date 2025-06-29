-- Миграция для добавления A/B тестирования в алгоритмы рекомендаций
-- Создает флаг, который определяет, должен ли пользователь быть в группе тестирования

-- Добавляем флаг для A/B тестирования в таблицу пользователей
ALTER TABLE users ADD COLUMN IF NOT EXISTS recommendation_test_group BOOLEAN DEFAULT FALSE;

-- Создаем таблицу для A/B метрик, если ее еще нет
CREATE TABLE IF NOT EXISTS recommendation_ab_metrics (
  id SERIAL PRIMARY KEY,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  test_group BOOLEAN NOT NULL,
  impressions INTEGER NOT NULL DEFAULT 0,
  clicks INTEGER NOT NULL DEFAULT 0,
  completions INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (metric_date, test_group)
);

-- Создаем индексы для быстрого доступа
CREATE INDEX IF NOT EXISTS idx_metrics_date_group 
  ON recommendation_ab_metrics (metric_date, test_group);

-- Создаем функцию для распределения пользователей по группам тестирования
CREATE OR REPLACE FUNCTION assign_recommendation_test_group()
RETURNS TRIGGER AS $$
BEGIN
  -- Распределяем 50/50 между контрольной и тестовой группами
  NEW.recommendation_test_group := (random() > 0.5);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Создаем триггер для автоматического назначения группы при создании пользователя
DO $$BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'trg_assign_recommendation_test_group'
  ) THEN
    CREATE TRIGGER trg_assign_recommendation_test_group
    BEFORE INSERT ON users
    FOR EACH ROW
    EXECUTE FUNCTION assign_recommendation_test_group();
  END IF;
END$$;

-- Создаем функцию для обновления метрик
CREATE OR REPLACE FUNCTION update_recommendation_metrics(
  p_test_group BOOLEAN, 
  p_impression_delta INTEGER DEFAULT 0,
  p_click_delta INTEGER DEFAULT 0,
  p_completion_delta INTEGER DEFAULT 0
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO recommendation_ab_metrics (
    metric_date, 
    test_group, 
    impressions, 
    clicks, 
    completions
  )
  VALUES (
    CURRENT_DATE,
    p_test_group,
    p_impression_delta,
    p_click_delta,
    p_completion_delta
  )
  ON CONFLICT (metric_date, test_group) 
  DO UPDATE SET 
    impressions = recommendation_ab_metrics.impressions + p_impression_delta,
    clicks = recommendation_ab_metrics.clicks + p_click_delta,
    completions = recommendation_ab_metrics.completions + p_completion_delta,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Создаем представление для расчета CTR по группам
CREATE OR REPLACE VIEW recommendation_ab_metrics_summary AS
SELECT 
  metric_date,
  test_group,
  impressions,
  clicks,
  completions,
  CASE 
    WHEN impressions = 0 THEN 0
    ELSE ROUND((clicks::FLOAT / impressions) * 100, 2)
  END AS ctr,
  CASE 
    WHEN clicks = 0 THEN 0
    ELSE ROUND((completions::FLOAT / clicks) * 100, 2)
  END AS completion_rate
FROM 
  recommendation_ab_metrics
ORDER BY 
  metric_date DESC, 
  test_group;

-- Обновляем существующие записи пользователей для распределения по группам
-- Только если группа еще не назначена (recommendation_test_group IS NULL)
DO $$
DECLARE
    user_count INTEGER;
    updated_count INTEGER;
BEGIN
    -- Проверяем, нужно ли обновлять существующих пользователей
    SELECT COUNT(*) INTO user_count FROM users WHERE recommendation_test_group IS NULL;
    
    IF user_count > 0 THEN
        -- Обновляем записи с NULL, устанавливая случайное значение
        UPDATE users 
        SET recommendation_test_group = (random() > 0.5)
        WHERE recommendation_test_group IS NULL;
        
        GET DIAGNOSTICS updated_count = ROW_COUNT;
        RAISE NOTICE 'Обновлено % пользователей с назначением групп A/B тестирования', updated_count;
    END IF;
END$$;
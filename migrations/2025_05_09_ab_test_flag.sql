-- Миграция для добавления A/B-теста для улучшенных рекомендаций
-- 1. Создание feature flag для A/B тестирования
INSERT INTO feature_flags (name, description, status, rollout_percentage, target_audience, created_at, updated_at)
VALUES (
  'ab_testing', 
  'Мастер-флаг для включения системы A/B тестирования', 
  'enabled', 
  100, 
  '{}', 
  NOW(), 
  NOW()
);

-- 2. Создание конкретного A/B теста для улучшенного алгоритма рекомендаций
INSERT INTO feature_flags (name, description, status, rollout_percentage, target_audience, created_at, updated_at)
VALUES (
  'ab_test_enhanced_recommendations', 
  'A/B тест для улучшенного алгоритма рекомендаций с порогом релевантности и разнообразием по навыкам', 
  'enabled', 
  50, 
  '{"description": "Тестирование улучшенного алгоритма рекомендаций с фильтрацией по порогу и разнообразием", "metrics": ["clicks", "course_completions", "time_spent"]}', 
  NOW(), 
  NOW()
);

-- 3. Feature flag для включения улучшенного алгоритма рекомендаций (для ручного управления)
INSERT INTO feature_flags (name, description, status, rollout_percentage, target_audience, created_at, updated_at)
VALUES (
  'enhanced_recommendations', 
  'Улучшенный алгоритм рекомендаций с порогом и разнообразием', 
  'beta', 
  0, 
  '{"description": "Принудительное включение улучшенного алгоритма рекомендаций для всех пользователей"}', 
  NOW(), 
  NOW()
);

-- 4. Обновление таблицы user_recommendations для хранения метаданных
-- Первая проверка, есть ли уже колонка meta_data
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'user_recommendations' AND column_name = 'meta_data'
    ) THEN
        ALTER TABLE user_recommendations ADD COLUMN meta_data JSONB;
    END IF;
END $$;
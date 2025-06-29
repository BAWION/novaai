-- Миграция для исправления типов в ML-моделях

-- Обновление типа modelScore с TEXT на FLOAT в таблице user_recommendations
ALTER TABLE user_recommendations ALTER COLUMN model_score TYPE FLOAT USING model_score::FLOAT;

-- Добавление поля primarySkill в рекомендации
ALTER TABLE user_recommendations ADD COLUMN IF NOT EXISTS primary_skill VARCHAR(100);

-- Добавление метаданных для работы с AB-тестированием
ALTER TABLE user_recommendations ADD COLUMN IF NOT EXISTS ab_test_group VARCHAR(50);

-- Индекс для ускорения фильтрации низкокачественных рекомендаций
CREATE INDEX IF NOT EXISTS idx_user_recommendations_model_score ON user_recommendations(model_score);

-- Индекс для фильтрации рекомендаций по основному навыку
CREATE INDEX IF NOT EXISTS idx_user_recommendations_primary_skill ON user_recommendations(primary_skill);

-- Обновление схемы таблицы метрик для учета CTR в AB-тестах
ALTER TABLE metrics ADD COLUMN IF NOT EXISTS experiment_name VARCHAR(100);
ALTER TABLE metrics ADD COLUMN IF NOT EXISTS experiment_group VARCHAR(50);

-- Обновление модели courses для более точной рекомендации
ALTER TABLE courses ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '[]';
ALTER TABLE courses ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 0;
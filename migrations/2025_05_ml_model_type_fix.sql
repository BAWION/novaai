-- Миграция для исправления значений ml_model_type
-- Обновляем существующие записи, меняя "course_recommendation" на "recommendation"

-- Временно выключаем тип ml_model_type
ALTER TABLE ml_models ALTER COLUMN type TYPE VARCHAR(100);

-- Обновляем значения с "course_recommendation" на "recommendation"
UPDATE ml_models
SET type = 'recommendation'
WHERE type = 'course_recommendation';

-- Восстанавливаем проверку типа
ALTER TABLE ml_models ALTER COLUMN type TYPE ml_model_type USING type::ml_model_type;

-- Убедимся, что все флаги feature flags для функции рекомендаций активны
-- Флаги могут быть с именем "course_recommendations", но это не меняем, т.к. это название функции
UPDATE feature_flags
SET status = 'enabled',
    updated_at = NOW()
WHERE name IN ('course_recommendations', 'smart_quest');
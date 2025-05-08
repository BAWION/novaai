-- AB Test Flags Table для хранения флагов экспериментов
CREATE TABLE IF NOT EXISTS ab_test_flags (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  experiment_name VARCHAR(100) NOT NULL,
  is_in_experiment BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, experiment_name)
);

-- AB Test Configurations Table для хранения конфигураций экспериментов
CREATE TABLE IF NOT EXISTS ab_test_configs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- AB Test Events Table для хранения событий экспериментов
CREATE TABLE IF NOT EXISTS ab_test_events (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  experiment_name VARCHAR(100) NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для оптимизации запросов
CREATE INDEX IF NOT EXISTS idx_ab_test_flags_user_id ON ab_test_flags(user_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_flags_experiment_name ON ab_test_flags(experiment_name);
CREATE INDEX IF NOT EXISTS idx_ab_test_events_user_id ON ab_test_events(user_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_events_experiment_name ON ab_test_events(experiment_name);
CREATE INDEX IF NOT EXISTS idx_ab_test_events_event_type ON ab_test_events(event_type);

-- Вставка начальных экспериментов
INSERT INTO ab_test_configs (name, description, is_enabled, config)
VALUES 
  ('recommendation_diversity', 'Эксперимент по повышению разнообразия рекомендаций с учетом первичного навыка', TRUE, '{"threshold": 0.4, "description": "Фильтрация рекомендаций с modelScore < 0.4 и повышение разнообразия по первичному навыку"}')
ON CONFLICT (name) DO UPDATE 
SET description = EXCLUDED.description,
    is_enabled = EXCLUDED.is_enabled,
    config = EXCLUDED.config,
    updated_at = CURRENT_TIMESTAMP;
-- Создание перечислений для S2 SKILL-PROBE
CREATE TYPE skill_probe_type AS ENUM ('multiple_choice', 'coding', 'fill_blanks', 'matching', 'practical');
CREATE TYPE skill_probe_difficulty AS ENUM ('basic', 'intermediate', 'advanced', 'expert');

-- Создание таблицы тестов Skill Probe
CREATE TABLE IF NOT EXISTS skill_probes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  skill_id INTEGER REFERENCES skills(id),
  dna_id INTEGER REFERENCES skills_dna(id),
  probe_type skill_probe_type NOT NULL,
  difficulty skill_probe_difficulty DEFAULT 'intermediate',
  estimated_time_minutes INTEGER DEFAULT 5,
  passing_score INTEGER DEFAULT 70,
  questions JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Индексы для таблицы skill_probes
CREATE INDEX skill_probe_skill_idx ON skill_probes(skill_id);
CREATE INDEX skill_probe_dna_idx ON skill_probes(dna_id);

-- Создание таблицы результатов прохождения Skill Probe тестов
CREATE TABLE IF NOT EXISTS skill_probe_results (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  probe_id INTEGER NOT NULL REFERENCES skill_probes(id),
  score INTEGER NOT NULL,
  pass_status BOOLEAN NOT NULL,
  answers JSONB,
  started_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP NOT NULL,
  time_spent_seconds INTEGER,
  skill_level_before INTEGER,
  skill_level_after INTEGER,
  feedback TEXT
);

-- Индексы для таблицы skill_probe_results
CREATE INDEX user_probe_idx ON skill_probe_results(user_id, probe_id);
CREATE INDEX probe_completed_at_idx ON skill_probe_results(completed_at);

-- Создание таблицы рекомендаций на основе результатов тестов
CREATE TABLE IF NOT EXISTS skill_probe_recommendations (
  id SERIAL PRIMARY KEY,
  result_id INTEGER NOT NULL REFERENCES skill_probe_results(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  recommendation_type VARCHAR(100) NOT NULL,
  entity_id INTEGER NOT NULL,
  reason TEXT,
  priority INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  followed BOOLEAN DEFAULT FALSE
);

-- Индексы для таблицы skill_probe_recommendations
CREATE INDEX recommendation_user_idx ON skill_probe_recommendations(user_id);
CREATE INDEX recommendation_result_idx ON skill_probe_recommendations(result_id);

-- Добавляем триггер для автоматического обновления поля updated_at
CREATE OR REPLACE FUNCTION update_modified_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER skill_probes_updated
BEFORE UPDATE ON skill_probes
FOR EACH ROW
EXECUTE PROCEDURE update_modified_timestamp();
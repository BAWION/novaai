-- Добавление поля updated_at в таблицу user_skills для отслеживания последних изменений
ALTER TABLE user_skills ADD COLUMN updated_at TIMESTAMP DEFAULT now();

-- Добавляем триггер для автоматического обновления timestamps
CREATE OR REPLACE FUNCTION update_user_skills_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now(); 
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_skills_timestamp
BEFORE UPDATE ON user_skills
FOR EACH ROW
EXECUTE FUNCTION update_user_skills_timestamp();
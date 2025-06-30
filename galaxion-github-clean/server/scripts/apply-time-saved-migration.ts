/**
 * Скрипт для применения миграции таблиц функциональности S4 (INSIGHT "Time-Saved")
 * 
 * Запуск: npx tsx server/scripts/apply-time-saved-migration.ts
 */

import fs from 'fs';
import path from 'path';
import { pool } from '../db';

async function applyMigration() {
  console.log("Начинаем применение миграции S4 (INSIGHT Time-Saved)...");
  
  try {
    // Читаем файл миграции
    const migrationPath = path.join(process.cwd(), 'migrations', '2025_05_add_time_saved_feature.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Выполняем SQL из файла миграции
    await pool.query(migrationSQL);
    
    console.log("Миграция S4 (INSIGHT Time-Saved) успешно применена!");
    console.log("Созданы таблицы:");
    console.log("- skill_time_efficiency: эффективность навыков по времени");
    console.log("- user_time_saved_history: история экономии времени пользователей");
    console.log("- user_skill_time_saved: детализация по экономии времени с разбивкой по навыкам");
    console.log("- user_time_saved_goals: цели пользователей по экономии времени");
    console.log("Создано представление: user_time_saved_summary");
    
  } catch (error) {
    console.error("Ошибка при применении миграции S4 (INSIGHT Time-Saved):", error);
    throw error;
  } finally {
    // Закрываем соединение с базой данных
    await pool.end();
  }
}

// Запускаем применение миграции
applyMigration()
  .then(() => {
    console.log("Скрипт применения миграции S4 (INSIGHT Time-Saved) завершен успешно");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Скрипт применения миграции S4 (INSIGHT Time-Saved) завершен с ошибкой:", error);
    process.exit(1);
  });
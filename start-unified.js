#!/usr/bin/env node

/**
 * Запуск единого сервера NovaAI University на порту 5000
 * Объединяет фронтенд и API в одном процессе
 */

import('./server/index.js').catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
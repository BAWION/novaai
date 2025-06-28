#!/usr/bin/env node

/**
 * Стартовый скрипт для NovaAI University
 * Запускает единый сервер на порту 5000 с полной функциональностью
 */

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Запуск NovaAI University...');

// Запускаем рабочий сервер
const serverProcess = spawn('node', ['working-server.cjs'], {
  cwd: __dirname,
  stdio: 'inherit'
});

serverProcess.on('error', (err) => {
  console.error('❌ Ошибка запуска сервера:', err);
  process.exit(1);
});

serverProcess.on('exit', (code) => {
  console.log(`🔄 Сервер завершился с кодом ${code}`);
  process.exit(code);
});

// Обработка сигналов для корректного завершения
process.on('SIGINT', () => {
  console.log('\n⏹️ Остановка сервера...');
  serverProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n⏹️ Завершение сервера...');
  serverProcess.kill('SIGTERM');
});
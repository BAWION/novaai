#!/usr/bin/env node
/**
 * Быстрая синхронизация с GitHub
 * Упрощенная версия для ежедневного использования
 */

import { createGitHubSyncPackage } from './auto-github-sync.js';

console.log('🚀 Запуск быстрой синхронизации с GitHub...\n');
createGitHubSyncPackage();
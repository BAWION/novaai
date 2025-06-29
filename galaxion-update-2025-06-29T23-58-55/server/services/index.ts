/**
 * Экспорт всех сервисов для использования в приложении
 */

import { MLStorage } from "../storage-ml";
import { MLService } from "./ml-service";
import { storage } from "../storage";

// Инициализация mlStorage
const mlStorage = new MLStorage();

// Инициализация ML сервиса
export const mlService = new MLService(mlStorage);

// Другие сервисы можно добавить по мере необходимости
export * from "./skill-graph-service";
export * from "./progress-service";
export * from "./skill-probe-service";
export * from "./lightgbm-bridge";
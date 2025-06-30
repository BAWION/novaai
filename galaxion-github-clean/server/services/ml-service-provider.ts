/**
 * ml-service-provider.ts
 * Единая точка доступа к ML-сервису
 */

import { MLService } from "./ml-service";
import { MLStorage } from "../storage-ml";

// Создаем хранилище для ML и сервис
const mlStorage = new MLStorage();
export const mlService = new MLService(mlStorage);

// Экспортируем по умолчанию для совместимости
export default mlService;
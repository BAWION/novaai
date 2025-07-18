# S3 (SMART QUEST) - Документация по улучшенным рекомендациям с ML

## Обзор

S3 (SMART QUEST) - это система рекомендаций курсов на основе машинного обучения для NovaAI University. Данная функциональность заменяет эвристические алгоритмы рекомендаций более точной моделью на основе LightGBM для обеспечения персонализированного подбора курсов для каждого пользователя.

## Архитектура

Система SMART QUEST состоит из следующих компонентов:

1. **Мост LightGBM (lightgbm-bridge.ts)** - модуль-обертка для работы с моделью LightGBM, который позволяет загружать, обучать и использовать ML-модели без необходимости установки полной библиотеки LightGBM.

2. **Сервис ML (ml-service.ts)** - сервис для работы с ML-моделями и рекомендациями, который использует модель LightGBM для генерации персонализированных рекомендаций курсов.

3. **Хранилище ML (storage-ml.ts)** - расширение для DatabaseStorage с методами для ML-компонентов, включая работу с моделями, рекомендациями, эмбеддингами и т.д.

4. **API-маршрут рекомендаций (recommended-courses.ts)** - маршрут API для получения рекомендованных курсов с использованием SMART QUEST.

5. **Скрипты для обучения и тестирования** - вспомогательные скрипты для обучения и тестирования модели рекомендаций.

## Принцип работы

### 1. Сбор данных

Система собирает данные о пользователях, их навыках и курсах, включая:
- Профили пользователей и их Skills DNA
- Записи на курсы и их завершение
- Оценки курсов пользователями
- Активность пользователей с курсами

### 2. Подготовка признаков

Для каждой пары "пользователь-курс" система подготавливает набор признаков:
- Уровень пользователя
- Завершенность диагностики
- Количество и уровень навыков
- Предпочтения пользователя
- Сложность курса
- Средний уровень требуемых навыков
- Популярность курса
- И другие признаки...

### 3. Обучение модели

Модель LightGBM обучается предсказывать релевантность курса для пользователя на основе собранных данных. Обучение выполняется скриптом `train-recommendation-model.ts`.

### 4. Генерация рекомендаций

При запросе рекомендаций система:
- Проверяет, активирована ли функция SMART QUEST
- Если активирована, использует модель LightGBM для оценки релевантности каждого курса
- Сортирует курсы по релевантности и возвращает топ-N рекомендаций
- Сохраняет рекомендации в профиле пользователя и логирует событие

## Включение и отключение SMART QUEST

SMART QUEST управляется через систему флагов функций. Для включения/отключения используйте:

```typescript
// В скрипте test-smart-quest.ts
await toggleSmartQuest(true); // Включить
await toggleSmartQuest(false); // Отключить
```

## Тестирование

Для тестирования функциональности SMART QUEST используйте скрипт `test-smart-quest.ts`:

```shell
# Включить SMART QUEST и протестировать рекомендации для пользователя с ID 1
npx tsx server/scripts/test-smart-quest.ts --enable --user 1

# Отключить SMART QUEST
npx tsx server/scripts/test-smart-quest.ts --disable
```

## Обучение модели

Для обучения новой модели SMART QUEST используйте скрипт `train-recommendation-model.ts`:

```shell
npx tsx server/scripts/train-recommendation-model.ts
```

Рекомендуется запускать этот скрипт по расписанию (например, раз в неделю) для постоянного улучшения модели на основе новых данных.

## Структура данных модели

Модель SMART QUEST имеет следующую структуру:

```typescript
interface LightGBMModel {
  id: number;
  name: string;
  version: string;
  features: string[];
  weights: Record<string, number>;
  thresholds: Record<string, number>;
  bias: number;
  hyperparams: Record<string, any>;
  metrics: Record<string, number>;
}
```

## Метрики производительности

Модель SMART QUEST оценивается по следующим метрикам:
- Точность (accuracy)
- Полнота (recall)
- Точность предсказания (precision)
- F1-мера (f1)

## Дальнейшие улучшения

Планируемые улучшения для SMART QUEST:

1. **Обучение на реальных данных**: Переход от имитационных данных к реальным данным пользователей
2. **A/B тестирование**: Сравнение производительности SMART QUEST с эвристическими рекомендациями
3. **Объяснимость рекомендаций**: Предоставление пользователям объяснений, почему курс был рекомендован
4. **Динамическое обновление модели**: Автоматическое обновление модели при получении новых данных
5. **Оффлайн-анализ качества рекомендаций**: Инструменты для оценки качества рекомендаций
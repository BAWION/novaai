import { z } from "zod";

// Определения типов с подсказками для выпадающих списков
export const industries = [
  "it", // IT/Технологии
  "finance", // Финансы/Банкинг
  "education", // Образование
  "healthcare", // Здравоохранение
  "manufacturing", // Производство
  "retail", // Торговля
  "telecom", // Телекоммуникации
  "media", // Медиа/Развлечения
  "government", // Государственный сектор
  "science", // Наука/Исследования
  "student", // Студент
  "other", // Другое
] as const;

export const specificGoals = [
  "изучить_машинное_обучение", // Изучить машинное обучение
  "развить_навыки_программирования", // Развить навыки программирования
  "построить_портфолио", // Построить портфолио проектов
  "сменить_карьеру", // Сменить карьерный путь
  "подготовиться_к_собеседованию", // Подготовиться к собеседованию
  "получить_повышение", // Получить повышение на текущей работе
  "основать_стартап", // Основать AI-стартап
  "автоматизировать_процессы", // Автоматизировать рабочие процессы
  "применить_AI_в_своей_отрасли", // Применить AI в своей отрасли
  "нарастить_исследовательские_навыки", // Нарастить исследовательские навыки
] as const;

export const learningStyles = [
  "visual", // Визуальное обучение (видео, диаграммы, инфографика)
  "practical", // Практическое обучение (проекты, лабораторные работы, практические задания)
  "theoretical", // Теоретическое обучение (чтение, лекции, концептуальный анализ)
  "mixed", // Смешанный стиль обучения
] as const;

export const difficultiesLevels = [
  "easy", // Начинающий
  "moderate", // Средний
  "challenging", // Высокий
] as const;

export const experienceLevels = [
  "beginner", // Начинающий (нет опыта)
  "learning-basics", // Изучаю основы
  "experienced", // Имею опыт
  "expert", // Эксперт
] as const;

export const roles = [
  "student", // Студент 
  "professional", // Профессионал (работает в индустрии)
  "teacher", // Преподаватель/тренер
  "researcher", // Исследователь
] as const;

export const interests = [
  "machine-learning", // Машинное обучение
  "neural-networks", // Нейронные сети
  "data-science", // Наука о данных
  "computer-vision", // Компьютерное зрение
  "nlp", // Обработка естественного языка
  "robotics", // Робототехника
  "ai-for-business", // ИИ для бизнеса
  "generative-ai", // Генеративный ИИ
] as const;

export const goals = [
  "find-internship", // Найти стажировку или работу
  "practice-skills", // Практиковать навыки
  "career-change", // Сменить карьеру
  "create-project", // Создать свой проект
  "learn-fundamentals", // Изучить основы
  "stay-current", // Быть в курсе последних тенденций
] as const;

// Схема валидации расширенного онбординга
export const extendedOnboardingSchema = z.object({
  // Базовые поля профиля (уже были в схеме)
  role: z.enum(roles, {
    required_error: "Выберите вашу роль",
    invalid_type_error: "Выберите правильное значение из списка",
  }),
  pythonLevel: z.number({
    required_error: "Выберите уровень знания Python",
    invalid_type_error: "Уровень должен быть числом от 1 до 5",
  }).min(1).max(5),
  experience: z.enum(experienceLevels, {
    required_error: "Выберите ваш уровень опыта",
    invalid_type_error: "Выберите правильное значение из списка",
  }),
  interest: z.enum(interests, {
    required_error: "Выберите область интересов",
    invalid_type_error: "Выберите правильное значение из списка",
  }),
  goal: z.enum(goals, {
    required_error: "Выберите вашу основную цель",
    invalid_type_error: "Выберите правильное значение из списка",
  }),
  
  // Расширенные поля для улучшенного онбординга
  industry: z.enum(industries, {
    required_error: "Выберите вашу отрасль",
    invalid_type_error: "Выберите правильное значение из списка",
  }),
  jobTitle: z.string().min(2, {
    message: "Укажите вашу должность (минимум 2 символа)",
  }).max(100).optional(),
  specificGoals: z.array(z.enum(specificGoals)).min(1, {
    message: "Выберите хотя бы одну конкретную цель",
  }).max(5, {
    message: "Выберите не более 5 конкретных целей",
  }),
  preferredLearningStyle: z.enum(learningStyles, {
    required_error: "Выберите предпочтительный стиль обучения",
    invalid_type_error: "Выберите правильное значение из списка",
  }),
  availableTimePerWeek: z.number({
    required_error: "Укажите доступное время в часах",
    invalid_type_error: "Значение должно быть числом",
  }).min(1, {
    message: "Минимум 1 час в неделю",
  }).max(40, {
    message: "Максимум 40 часов в неделю",
  }),
  preferredDifficulty: z.enum(difficultiesLevels, {
    required_error: "Выберите предпочтительный уровень сложности",
    invalid_type_error: "Выберите правильное значение из списка",
  }),
});

// Тип данных формы онбординга, выведенный из схемы валидации
export type ExtendedOnboardingFormData = z.infer<typeof extendedOnboardingSchema>;

// Преобразование в пользовательский профиль
export function convertToUserProfile(data: ExtendedOnboardingFormData, userId: number) {
  return {
    userId,
    ...data,
    recommendedTrack: "pending", // Будет обновлено после обработки данных
    completedOnboarding: 1,
  };
}
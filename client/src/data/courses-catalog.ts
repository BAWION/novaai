// Полный каталог курсов NovaAI University
// Основан на карте-каталоге "не только код" с курсами различных категорий

import { v4 as uuidv4 } from 'uuid';

export interface CatalogCourse {
  id: string;
  title: string;
  description: string;
  icon: string;
  modules: number;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string[];
  track: string;  // Основной трек/направление курса
  subTrack: string; // Подкатегория
  instructor?: string;
  duration?: string;
  rating?: number;
  enrolled?: number;
  updated?: string;
  color: 'primary' | 'secondary' | 'accent' | 'purple' | 'green' | 'blue';
  themeStyle?: 'space' | 'business'; // Стиль оформления (космический или деловой)
  skillMatch?: {
    percentage: number;
    label: string;
    isRecommended?: boolean;
  };
  isNew?: boolean;
  isFeatured?: boolean;
  forRole?: string[]; // Для конкретных ролей пользователей
}

// Основной каталог курсов
export const coursesCatalog: CatalogCourse[] = [
  // 1. БАЗОВАЯ ГРАМОТНОСТЬ
  {
    id: uuidv4(),
    title: "AI Literacy 101",
    description: "Введение в мир искусственного интеллекта: основные понятия, история развития, современные возможности и ограничения технологии.",
    icon: "lightbulb",
    modules: 5,
    level: "beginner",
    category: ["ai", "fundamentals", "literacy"],
    track: "Базовая грамотность",
    subTrack: "AI Literacy 101",
    instructor: "NOVA AI Ассистент",
    duration: "4 часа",
    rating: 4.7,
    enrolled: 3245,
    updated: "2025-04-15",
    color: "primary",
    themeStyle: "space",
    skillMatch: {
      percentage: 100,
      label: "Рекомендуем всем новичкам",
      isRecommended: true
    },
    isNew: false,
    isFeatured: true,
    forRole: ["student", "professional", "teacher", "researcher"]
  },
  {
    id: uuidv4(),
    title: "Prompt Thinking",
    description: "Искусство формулирования запросов к ИИ: роли и контекст, chain-of-thought, техники улучшения ответов, создание эффективных инструкций.",
    icon: "sparkles",
    modules: 5,
    level: "beginner",
    category: ["ai", "prompt-engineering", "gpt"],
    track: "Базовая грамотность",
    subTrack: "Prompt Thinking",
    instructor: "NOVA AI Ассистент",
    duration: "6 часов",
    rating: 4.8,
    enrolled: 2785,
    updated: "2025-04-29",
    color: "accent",
    themeStyle: "space",
    skillMatch: {
      percentage: 98,
      label: "Новый курс - рекомендуем!",
      isRecommended: true
    },
    isNew: true,
    isFeatured: true,
    forRole: ["student", "professional", "teacher", "researcher"]
  },
  {
    id: uuidv4(),
    title: "AI Ethics & Safety",
    description: "Этические аспекты искусственного интеллекта: предвзятость алгоритмов, прозрачность, объяснимость, безопасность и ответственное использование ИИ.",
    icon: "balance-scale",
    modules: 6,
    level: "intermediate",
    category: ["ethics", "ai-safety", "responsible-ai"],
    track: "Базовая грамотность",
    subTrack: "AI Ethics & Safety",
    instructor: "Елена Морозова",
    duration: "8 часов",
    rating: 4.6,
    enrolled: 980,
    updated: "2025-04-10",
    color: "purple",
    themeStyle: "space",
    isNew: false,
    isFeatured: false,
    forRole: ["teacher", "professional", "researcher"]
  },

  // 2. ЛИЧНАЯ ПРОДУКТИВНОСТЬ
  {
    id: uuidv4(),
    title: "AI Study Buddy",
    description: "Использование ИИ для повышения эффективности обучения: генерация интерактивных материалов, создание планов обучения, подготовка к экзаменам.",
    icon: "graduation-cap",
    modules: 4,
    level: "beginner",
    category: ["productivity", "education", "learning"],
    track: "Личная продуктивность",
    subTrack: "AI Study Buddy",
    instructor: "Мария Климентьева",
    duration: "5 часов",
    rating: 4.9,
    enrolled: 3420,
    updated: "2025-04-12",
    color: "primary",
    themeStyle: "space",
    skillMatch: {
      percentage: 95,
      label: "Идеально для студентов",
      isRecommended: true
    },
    isNew: false,
    isFeatured: true,
    forRole: ["student"]
  },
  {
    id: uuidv4(),
    title: "Everyday AI",
    description: "ИИ для повседневных задач: планирование питания, управление финансами, организация путешествий, подбор рецептов и создание персональных рекомендаций.",
    icon: "calendar-check",
    modules: 6,
    level: "beginner",
    category: ["productivity", "lifestyle", "planning"],
    track: "Личная продуктивность",
    subTrack: "Everyday AI",
    instructor: "Александр Петров",
    duration: "7 часов",
    rating: 4.7,
    enrolled: 2150,
    updated: "2025-04-18",
    color: "green",
    themeStyle: "space",
    isNew: false,
    isFeatured: false,
    forRole: ["student", "professional"]
  },
  {
    id: uuidv4(),
    title: "Creativity Boost",
    description: "Инструменты ИИ для творчества: создание изображений с помощью Midjourney и StableDiffusion, генерация и редактирование видео в Runway, контент для соцсетей.",
    icon: "paint-brush",
    modules: 8,
    level: "intermediate",
    category: ["creativity", "visual-arts", "content-creation"],
    track: "Личная продуктивность",
    subTrack: "Creativity Boost",
    instructor: "Дарья Соколова",
    duration: "10 часов",
    rating: 4.8,
    enrolled: 1870,
    updated: "2025-04-05",
    color: "accent",
    themeStyle: "space",
    isNew: false,
    isFeatured: true,
    forRole: ["student", "professional"]
  },

  // 3. БИЗНЕС-ИНСТРУМЕНТЫ
  {
    id: uuidv4(),
    title: "AI для Product Manager",
    description: "Применение ИИ для оптимизации работы продакт-менеджера: генерация roadmap, создание спецификаций, анализ данных и формирование гипотез A/B-тестирования.",
    icon: "sitemap",
    modules: 7,
    level: "intermediate",
    category: ["business", "product-management", "analytics"],
    track: "Бизнес-инструменты",
    subTrack: "AI for PM/PO",
    instructor: "Никита Волков",
    duration: "12 часов",
    rating: 4.8,
    enrolled: 950,
    updated: "2025-04-02",
    color: "blue",
    themeStyle: "business",
    isNew: false,
    isFeatured: true,
    forRole: ["professional"]
  },
  {
    id: uuidv4(),
    title: "GPT для маркетологов",
    description: "Практическое применение GPT-моделей в маркетинге: персонализированные email-рассылки, эффективные рекламные тексты, SEO-оптимизация контента.",
    icon: "bullhorn",
    modules: 6,
    level: "intermediate",
    category: ["business", "marketing", "content"],
    track: "Бизнес-инструменты",
    subTrack: "GPT for Marketers",
    instructor: "Ольга Романова",
    duration: "9 часов",
    rating: 4.7,
    enrolled: 875,
    updated: "2025-04-14",
    color: "secondary",
    themeStyle: "business",
    isNew: true,
    isFeatured: false,
    forRole: ["professional"]
  },
  {
    id: uuidv4(),
    title: "AI Customer Support",
    description: "Внедрение ИИ в службу поддержки: создание базы знаний, разработка RAG-чат-бота, автоматизация обработки запросов и классификация обращений.",
    icon: "headset",
    modules: 5,
    level: "intermediate",
    category: ["business", "customer-service", "automation"],
    track: "Бизнес-инструменты",
    subTrack: "AI Customer Support",
    instructor: "Иван Черных",
    duration: "8 часов",
    rating: 4.6,
    enrolled: 620,
    updated: "2025-03-30",
    color: "green",
    themeStyle: "business",
    isNew: false,
    isFeatured: false,
    forRole: ["professional"]
  },
  {
    id: uuidv4(),
    title: "HR & Recruiting AI",
    description: "ИИ для HR-специалистов: автоматизация скрининга резюме, чат-боты для предварительных интервью, персонализация адаптации и off-boarding сотрудников.",
    icon: "users-cog",
    modules: 6,
    level: "intermediate",
    category: ["business", "hr", "recruiting"],
    track: "Бизнес-инструменты",
    subTrack: "HR & Recruiting AI",
    instructor: "Анна Сергеева",
    duration: "10 часов",
    rating: 4.7,
    enrolled: 580,
    updated: "2025-04-08",
    color: "purple",
    themeStyle: "business",
    isNew: false,
    isFeatured: false,
    forRole: ["professional"]
  },

  // 4. ИНДУСТРИИ
  {
    id: uuidv4(),
    title: "Finance & Fintech AI",
    description: "Применение искусственного интеллекта в финансовой сфере: подготовка отчетов XBRL, построение риск-моделей, выявление мошенничества с помощью LLM.",
    icon: "chart-line",
    modules: 8,
    level: "advanced",
    category: ["finance", "fintech", "risk-management"],
    track: "Индустрии",
    subTrack: "Finance & Fintech",
    instructor: "Михаил Федоров",
    duration: "14 часов",
    rating: 4.8,
    enrolled: 430,
    updated: "2025-04-03",
    color: "green",
    themeStyle: "business",
    isNew: false,
    isFeatured: true,
    forRole: ["professional"]
  },
  {
    id: uuidv4(),
    title: "Retail & e-Commerce AI",
    description: "ИИ в розничной торговле: персонализированные витрины и рекомендации, динамическое ценообразование, чат-боты для поддержки клиентов.",
    icon: "shopping-cart",
    modules: 7,
    level: "intermediate",
    category: ["retail", "e-commerce", "personalization"],
    track: "Индустрии",
    subTrack: "Retail/e-Commerce",
    instructor: "Екатерина Иванова",
    duration: "12 часов",
    rating: 4.6,
    enrolled: 510,
    updated: "2025-03-25",
    color: "accent",
    themeStyle: "business",
    isNew: false,
    isFeatured: false,
    forRole: ["professional"]
  },
  {
    id: uuidv4(),
    title: "Health & Med-Edu AI",
    description: "ИИ в здравоохранении: система предварительной диагностики (triage-бот), обучение медицинских специалистов, безопасные практики применения ИИ в медицине.",
    icon: "heartbeat",
    modules: 9,
    level: "advanced",
    category: ["healthcare", "medical", "education"],
    track: "Индустрии",
    subTrack: "Health & Med-Edu",
    instructor: "Дмитрий Соловьев",
    duration: "16 часов",
    rating: 4.9,
    enrolled: 380,
    updated: "2025-04-17",
    color: "primary",
    themeStyle: "business",
    isNew: true,
    isFeatured: true,
    forRole: ["professional", "researcher"]
  },
  {
    id: uuidv4(),
    title: "Manufacturing AI",
    description: "ИИ на производстве: системы визуального контроля качества, предиктивное обслуживание оборудования, оптимизация производственных процессов.",
    icon: "industry",
    modules: 8,
    level: "advanced",
    category: ["manufacturing", "quality-control", "maintenance"],
    track: "Индустрии",
    subTrack: "Manufacturing",
    instructor: "Алексей Семенов",
    duration: "14 часов",
    rating: 4.7,
    enrolled: 290,
    updated: "2025-03-28",
    color: "secondary",
    themeStyle: "business",
    isNew: false,
    isFeatured: false,
    forRole: ["professional"]
  },

  // 5. БЕЗ КОДА
  {
    id: uuidv4(),
    title: "No-Code AI",
    description: "Создание ИИ-решений без программирования: интеграция Zapier с GPT, автоматизация рабочих процессов, управление данными без кода.",
    icon: "puzzle-piece",
    modules: 5,
    level: "beginner",
    category: ["no-code", "automation", "integration"],
    track: "Без кода, но с конструктором",
    subTrack: "No-Code AI",
    instructor: "Светлана Морозова",
    duration: "8 часов",
    rating: 4.6,
    enrolled: 1750,
    updated: "2025-04-10",
    color: "accent",
    themeStyle: "space",
    isNew: false,
    isFeatured: true,
    forRole: ["student", "professional"]
  },
  {
    id: uuidv4(),
    title: "Chatbot Builder",
    description: "Создание чат-ботов без программирования: использование Botpress, Voiceflow и построение RAG-систем на базе Google Docs.",
    icon: "comments",
    modules: 6,
    level: "intermediate",
    category: ["no-code", "chatbots", "customer-service"],
    track: "Без кода, но с конструктором",
    subTrack: "Chatbot Builder",
    instructor: "Роман Петров",
    duration: "9 часов",
    rating: 4.7,
    enrolled: 920,
    updated: "2025-04-05",
    color: "primary",
    themeStyle: "space",
    isNew: false,
    isFeatured: false,
    forRole: ["student", "professional"]
  },
  {
    id: uuidv4(),
    title: "Data to Dashboard",
    description: "Создание аналитических панелей без кода: от запросов на естественном языке к SQL-запросам и интерактивным графикам на Supabase.",
    icon: "chart-bar",
    modules: 7,
    level: "intermediate",
    category: ["no-code", "data-analysis", "visualization"],
    track: "Без кода, но с конструктором",
    subTrack: "Data to Dashboard",
    instructor: "Инна Козлова",
    duration: "11 часов",
    rating: 4.8,
    enrolled: 680,
    updated: "2025-03-20",
    color: "secondary",
    themeStyle: "space",
    isNew: false,
    isFeatured: false,
    forRole: ["professional"]
  },

  // 6. LOW-CODE
  {
    id: uuidv4(),
    title: "LangChain Cookbook",
    description: "Практический курс по LangChain: создание приложений для суммаризации текстов, классификации данных, перевода и обработки документов.",
    icon: "link",
    modules: 5,
    level: "intermediate",
    category: ["low-code", "langchain", "nlp"],
    track: "Low-code / citizen-dev",
    subTrack: "LangChain Cookbook",
    instructor: "Тимур Ахметов",
    duration: "8 часов",
    rating: 4.8,
    enrolled: 1120,
    updated: "2025-04-12",
    color: "accent",
    themeStyle: "space",
    isNew: true,
    isFeatured: true,
    forRole: ["student", "professional"]
  },
  {
    id: uuidv4(),
    title: "Custom-Vision за 3 часа",
    description: "Быстрое создание систем компьютерного зрения: использование Azure Custom Vision, Roboflow и Jet-ML для распознавания объектов и классификации изображений.",
    icon: "eye",
    modules: 4,
    level: "intermediate",
    category: ["low-code", "computer-vision", "image-recognition"],
    track: "Low-code / citizen-dev",
    subTrack: "Custom-Vision in 3 часа",
    instructor: "Сергей Белов",
    duration: "6 часов",
    rating: 4.7,
    enrolled: 850,
    updated: "2025-03-30",
    color: "secondary",
    themeStyle: "space",
    isNew: false,
    isFeatured: false,
    forRole: ["professional"]
  },

  // 7. ЛИДЕРСТВО / СТРАТЕГИЯ
  {
    id: uuidv4(),
    title: "AI Ops & Governance",
    description: "Управление ИИ-системами в организации: стандарты ISO 42001, реестр рисков, мониторинг затрат и оптимизация использования ИИ-ресурсов.",
    icon: "shield-alt",
    modules: 7,
    level: "expert",
    category: ["leadership", "governance", "compliance"],
    track: "Лидерство / стратегия",
    subTrack: "AI Ops & Governance",
    instructor: "Максим Кузнецов",
    duration: "15 часов",
    rating: 4.9,
    enrolled: 210,
    updated: "2025-04-08",
    color: "blue",
    themeStyle: "business",
    isNew: false,
    isFeatured: true,
    forRole: ["professional"]
  },
  {
    id: uuidv4(),
    title: "AI Product Strategy",
    description: "Стратегия создания ИИ-продуктов: оценка рынка, анализ конкурентов, выбор между собственной разработкой и использованием готовых решений.",
    icon: "chess",
    modules: 6,
    level: "expert",
    category: ["leadership", "product-strategy", "market-analysis"],
    track: "Лидерство / стратегия",
    subTrack: "AI Product Strategy",
    instructor: "Наталья Орлова",
    duration: "12 часов",
    rating: 4.8,
    enrolled: 180,
    updated: "2025-03-25",
    color: "purple",
    themeStyle: "business",
    isNew: false,
    isFeatured: false,
    forRole: ["professional"]
  },
  {
    id: uuidv4(),
    title: "Change Management для ИИ",
    description: "Управление изменениями при внедрении ИИ: эффективная коммуникация, программы обучения персонала, измерение эффективности и KPI.",
    icon: "people-arrows",
    modules: 5,
    level: "expert",
    category: ["leadership", "change-management", "organizational"],
    track: "Лидерство / стратегия",
    subTrack: "Change Management",
    instructor: "Владимир Козлов",
    duration: "10 часов",
    rating: 4.7,
    enrolled: 160,
    updated: "2025-04-01",
    color: "green",
    themeStyle: "business",
    isNew: false,
    isFeatured: false,
    forRole: ["professional"]
  },

  // 8. РАСШИРЕННЫЕ СПЕЦИАЛИЗИРОВАННЫЕ
  {
    id: uuidv4(),
    title: "Deepfake Detection",
    description: "Методы обнаружения синтетического контента: технологии проверки подлинности изображений и видео, протоколы бережной коммуникации о дезинформации.",
    icon: "user-secret",
    modules: 8,
    level: "advanced",
    category: ["specialized", "deepfake", "media-verification"],
    track: "Расширенные специализированные",
    subTrack: "Deepfake Detection",
    instructor: "Евгений Морозов",
    duration: "14 часов",
    rating: 4.9,
    enrolled: 340,
    updated: "2025-04-10",
    color: "accent",
    themeStyle: "space",
    isNew: true,
    isFeatured: true,
    forRole: ["professional", "researcher"]
  },
  {
    id: uuidv4(),
    title: "AI for Accessibility",
    description: "Использование ИИ для повышения доступности: генерация субтитров, преобразование голоса в текст, инструменты для соответствия стандартам WCAG.",
    icon: "universal-access",
    modules: 6,
    level: "intermediate",
    category: ["specialized", "accessibility", "inclusive-design"],
    track: "Расширенные специализированные",
    subTrack: "AI for Accessibility",
    instructor: "Мария Иванова",
    duration: "10 часов",
    rating: 4.8,
    enrolled: 290,
    updated: "2025-03-22",
    color: "primary",
    themeStyle: "space",
    isNew: false,
    isFeatured: false,
    forRole: ["professional"]
  },
  {
    id: uuidv4(),
    title: "RegTech & Compliance AI",
    description: "ИИ для регуляторного соответствия: автоматизация процессов KYC, скрининг по санкционным спискам, выявление подозрительных транзакций.",
    icon: "gavel",
    modules: 7,
    level: "advanced",
    category: ["specialized", "regtech", "compliance"],
    track: "Расширенные специализированные",
    subTrack: "RegTech & Compliance AI",
    instructor: "Андрей Смирнов",
    duration: "12 часов",
    rating: 4.7,
    enrolled: 220,
    updated: "2025-04-05",
    color: "secondary",
    themeStyle: "business",
    isNew: false,
    isFeatured: false,
    forRole: ["professional"]
  }
];

// Получение курсов по треку
export function getCoursesByTrack(track: string): CatalogCourse[] {
  return coursesCatalog.filter(course => course.track === track);
}

// Получение курсов по подкатегории
export function getCoursesBySubTrack(subTrack: string): CatalogCourse[] {
  return coursesCatalog.filter(course => course.subTrack === subTrack);
}

// Получение рекомендованных курсов
export function getRecommendedCourses(): CatalogCourse[] {
  return coursesCatalog.filter(course => course.skillMatch?.isRecommended);
}

// Получение новых курсов
export function getNewCourses(): CatalogCourse[] {
  return coursesCatalog.filter(course => course.isNew);
}

// Получение избранных курсов
export function getFeaturedCourses(): CatalogCourse[] {
  return coursesCatalog.filter(course => course.isFeatured);
}

// Получение курсов по роли пользователя
export function getCoursesByRole(role: string): CatalogCourse[] {
  return coursesCatalog.filter(course => course.forRole?.includes(role));
}

// Получение бизнес-курсов без космического дизайна
export function getBusinessCourses(): CatalogCourse[] {
  return coursesCatalog.filter(course => course.themeStyle === 'business');
}

// Получение базовых курсов для новичков
export function getBeginnerCourses(): CatalogCourse[] {
  return coursesCatalog.filter(course => course.level === 'beginner');
}

// Все категории курсов
export const courseCategories = [
  { id: "basic-literacy", name: "Базовая грамотность", count: getCoursesByTrack("Базовая грамотность").length },
  { id: "personal-productivity", name: "Личная продуктивность", count: getCoursesByTrack("Личная продуктивность").length },
  { id: "business-tools", name: "Бизнес-инструменты", count: getCoursesByTrack("Бизнес-инструменты").length },
  { id: "industries", name: "Индустрии", count: getCoursesByTrack("Индустрии").length },
  { id: "no-code", name: "Без кода", count: getCoursesByTrack("Без кода, но с конструктором").length },
  { id: "low-code", name: "Low-code", count: getCoursesByTrack("Low-code / citizen-dev").length },
  { id: "leadership", name: "Лидерство", count: getCoursesByTrack("Лидерство / стратегия").length },
  { id: "specialized", name: "Специализированные", count: getCoursesByTrack("Расширенные специализированные").length }
];

// Все подкатегории курсов
export const courseSubCategories = [
  // Базовая грамотность
  { id: "ai-literacy", name: "AI Literacy 101", parentId: "basic-literacy" },
  { id: "prompt-thinking", name: "Prompt Thinking", parentId: "basic-literacy" },
  { id: "ai-ethics", name: "AI Ethics & Safety", parentId: "basic-literacy" },
  
  // Личная продуктивность
  { id: "study-buddy", name: "AI Study Buddy", parentId: "personal-productivity" },
  { id: "everyday-ai", name: "Everyday AI", parentId: "personal-productivity" },
  { id: "creativity", name: "Creativity Boost", parentId: "personal-productivity" },
  
  // Бизнес-инструменты
  { id: "pm-po", name: "AI for PM/PO", parentId: "business-tools" },
  { id: "marketers", name: "GPT for Marketers", parentId: "business-tools" },
  { id: "customer-support", name: "AI Customer Support", parentId: "business-tools" },
  { id: "hr-recruiting", name: "HR & Recruiting AI", parentId: "business-tools" },
  
  // Индустрии
  { id: "finance", name: "Finance & Fintech", parentId: "industries" },
  { id: "retail", name: "Retail/e-Commerce", parentId: "industries" },
  { id: "healthcare", name: "Health & Med-Edu", parentId: "industries" },
  { id: "manufacturing", name: "Manufacturing", parentId: "industries" },
  
  // Без кода
  { id: "no-code-ai", name: "No-Code AI", parentId: "no-code" },
  { id: "chatbot-builder", name: "Chatbot Builder", parentId: "no-code" },
  { id: "data-dashboard", name: "Data to Dashboard", parentId: "no-code" },
  
  // Low-code
  { id: "langchain", name: "LangChain Cookbook", parentId: "low-code" },
  { id: "custom-vision", name: "Custom-Vision in 3 часа", parentId: "low-code" },
  
  // Лидерство
  { id: "ops-governance", name: "AI Ops & Governance", parentId: "leadership" },
  { id: "product-strategy", name: "AI Product Strategy", parentId: "leadership" },
  { id: "change-management", name: "Change Management", parentId: "leadership" },
  
  // Специализированные
  { id: "deepfake", name: "Deepfake Detection", parentId: "specialized" },
  { id: "accessibility", name: "AI for Accessibility", parentId: "specialized" },
  { id: "regtech", name: "RegTech & Compliance AI", parentId: "specialized" }
];
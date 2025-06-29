/**
 * Practice Projects Creation Script
 * Creates hands-on projects for comprehensive learning experience
 */

const practiceProjects = [
  {
    title: "Система рекомендаций фильмов",
    description: "Создайте рекомендательную систему на основе предпочтений пользователей",
    difficulty: "intermediate",
    duration: "2-3 weeks",
    skills: ["machine-learning", "python", "pandas", "scikit-learn"],
    objectives: [
      "Изучить алгоритмы коллаборативной фильтрации",
      "Реализовать content-based рекомендации",
      "Создать гибридную систему рекомендаций",
      "Оценить качество рекомендаций"
    ],
    deliverables: [
      "Jupyter notebook с анализом данных",
      "Реализация 3 типов рекомендательных алгоритмов",
      "Web-интерфейс для демонстрации",
      "Отчет с метриками качества"
    ],
    resources: [
      "MovieLens dataset",
      "Документация scikit-learn",
      "Примеры кода на GitHub",
      "Научные статьи по рекомендательным системам"
    ]
  },
  {
    title: "Анализ тональности отзывов",
    description: "Постройте систему классификации эмоциональной окраски текстов",
    difficulty: "beginner",
    duration: "1-2 weeks",
    skills: ["nlp", "python", "tensorflow", "text-processing"],
    objectives: [
      "Освоить предобработку текстовых данных",
      "Изучить методы векторизации текста",
      "Сравнить классические и нейросетевые подходы",
      "Создать API для анализа тональности"
    ],
    deliverables: [
      "Очищенный и размеченный датасет",
      "Модели классификации (Naive Bayes, LSTM, BERT)",
      "REST API с документацией",
      "Веб-интерфейс для тестирования"
    ],
    resources: [
      "IMDb movie reviews dataset",
      "Hugging Face Transformers",
      "NLTK и spaCy документация",
      "Flask/FastAPI tutorials"
    ]
  },
  {
    title: "Детекция объектов на изображениях",
    description: "Разработайте систему распознавания объектов с использованием YOLO",
    difficulty: "advanced",
    duration: "3-4 weeks",
    skills: ["computer-vision", "deep-learning", "pytorch", "opencv"],
    objectives: [
      "Изучить архитектуры CNN для детекции",
      "Обучить модель YOLO на custom dataset",
      "Оптимизировать модель для продакшена",
      "Создать real-time детекцию"
    ],
    deliverables: [
      "Собранный и размеченный датасет",
      "Обученная YOLO модель",
      "Веб-приложение с загрузкой изображений",
      "Мобильное приложение или Telegram бот"
    ],
    resources: [
      "COCO dataset",
      "YOLOv5/YOLOv8 repositories",
      "Roboflow для аннотации",
      "OpenCV tutorials"
    ]
  },
  {
    title: "Прогнозирование цен на криптовалюты",
    description: "Создайте модель для предсказания движения цен криптовалют",
    difficulty: "intermediate",
    duration: "2-3 weeks",
    skills: ["time-series", "machine-learning", "api-integration", "data-visualization"],
    objectives: [
      "Освоить анализ временных рядов",
      "Изучить технические индикаторы",
      "Создать LSTM модель для прогнозирования",
      "Интегрировать внешние API данных"
    ],
    deliverables: [
      "Pipeline сбора данных из API",
      "Модели прогнозирования (ARIMA, LSTM, Prophet)",
      "Dashboard с визуализацией прогнозов",
      "Бэктестинг стратегии"
    ],
    resources: [
      "CoinGecko API",
      "Yahoo Finance API",
      "Facebook Prophet",
      "Plotly/Dash documentation"
    ]
  },
  {
    title: "Чат-бот для клиентской поддержки",
    description: "Разработайте интеллектуального чат-бота с использованием LLM",
    difficulty: "intermediate",
    duration: "2-3 weeks",
    skills: ["nlp", "llm", "api-development", "database"],
    objectives: [
      "Создать knowledge base из FAQ",
      "Интегрировать языковую модель",
      "Реализовать context-aware диалоги",
      "Добавить аналитику разговоров"
    ],
    deliverables: [
      "База знаний в векторном формате",
      "RAG система для поиска ответов",
      "Telegram/Discord бот",
      "Admin панель с аналитикой"
    ],
    resources: [
      "OpenAI API / Anthropic Claude",
      "ChromaDB или Pinecone",
      "LangChain framework",
      "Telegram Bot API"
    ]
  },
  {
    title: "Система предиктивного обслуживания",
    description: "Постройте модель для предсказания поломок оборудования",
    difficulty: "advanced",
    duration: "3-4 weeks",
    skills: ["iot", "anomaly-detection", "time-series", "machine-learning"],
    objectives: [
      "Анализировать данные датчиков IoT",
      "Детектировать аномалии в поведении оборудования",
      "Прогнозировать время до поломки",
      "Создать систему уведомлений"
    ],
    deliverables: [
      "Симулятор данных датчиков",
      "Модели детекции аномалий",
      "Dashboard мониторинга",
      "Система алертов"
    ],
    resources: [
      "NASA bearing dataset",
      "Isolation Forest, Autoencoder tutorials",
      "InfluxDB для временных рядов",
      "Grafana для визуализации"
    ]
  }
];

const projectChallenges = [
  {
    title: "AI Хакатон: Решение климатических проблем",
    description: "48-часовой хакатон по созданию ИИ-решений для борьбы с изменением климата",
    difficulty: "all_levels",
    duration: "48 hours",
    format: "team_competition",
    prizes: [
      "1 место: Сертификат и консультация с экспертами",
      "2 место: Доступ к премиум курсам на 6 месяцев",
      "3 место: Книги по ИИ и машинному обучению"
    ],
    themes: [
      "Оптимизация энергопотребления",
      "Прогнозирование природных катастроф",
      "Умное сельское хозяйство",
      "Переработка отходов с помощью ИИ"
    ]
  },
  {
    title: "Месячный челлендж: 30 дней ML",
    description: "Ежедневные задачи по машинному обучению возрастающей сложности",
    difficulty: "progressive",
    duration: "30 days",
    format: "individual_challenge",
    structure: [
      "Дни 1-10: Основы Python и pandas",
      "Дни 11-20: Классическое машинное обучение",
      "Дни 21-30: Глубокое обучение и проекты"
    ],
    rewards: [
      "Ежедневные badges за выполнение",
      "Сертификат за завершение челленджа",
      "Доступ к эксклюзивным материалам"
    ]
  }
];

const portfolioProjects = [
  {
    category: "Beginner Portfolio",
    projects: [
      "Анализ продаж интернет-магазина",
      "Предсказание цен на недвижимость",
      "Классификация изображений с CIFAR-10",
      "Анализ социальных сетей"
    ],
    skills_covered: ["data-analysis", "visualization", "basic-ml", "statistics"]
  },
  {
    category: "Intermediate Portfolio",
    projects: [
      "Рекомендательная система",
      "Обработка естественного языка",
      "Computer Vision проект",
      "Time Series прогнозирование"
    ],
    skills_covered: ["advanced-ml", "deep-learning", "nlp", "cv"]
  },
  {
    category: "Advanced Portfolio",
    projects: [
      "MLOps pipeline",
      "Распределенное обучение",
      "Reinforcement Learning",
      "Исследовательский проект"
    ],
    skills_covered: ["mlops", "scalability", "research", "innovation"]
  }
];

export {
  practiceProjects,
  projectChallenges,
  portfolioProjects
};

console.log('✅ Practice projects structure created!');
console.log(`📚 Created ${practiceProjects.length} hands-on projects`);
console.log(`🏆 Added ${projectChallenges.length} competitive challenges`);
console.log(`💼 Designed ${portfolioProjects.length} portfolio tracks`);
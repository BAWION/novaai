export const ethicsCourse = {
  id: 'ethics-ai-safety',
  title: 'AI Ethics & Safety 101',
  description: 'Этика и безопасность в сфере искусственного интеллекта. Курс охватывает ключевые принципы этичного использования ИИ, проблемы предвзятости, прозрачности и социального воздействия технологий.',
  icon: 'balance-scale',
  modulesCount: 3,
  estimatedDuration: 480, // 8 часов в минутах
  difficulty: 'intermediate',
  color: 'purple',
  category: 'ethics',
  overview: `
    Этот курс исследует этические, социальные и безопасностные аспекты искусственного интеллекта. 
    Вы изучите ключевые принципы ответственного ИИ, методы анализа и минимизации предвзятости в данных, 
    способы обеспечения прозрачности алгоритмов и подходы к оценке социального воздействия ИИ-технологий.
  `,
  modules: [
    {
      id: 1,
      title: 'История и принципы этики ИИ',
      description: 'Эволюция этических вопросов в ИИ и основные принципы этически ответственного подхода',
      estimatedDuration: 90,
      lessons: [
        {
          id: 1,
          title: 'Исторические кейсы ИИ-этики',
          type: 'video',
          estimatedDuration: 25,
          description: 'Исследование знаковых случаев этических проблем с ИИ, включая кейс Microsoft Tay Bot',
          completed: false
        },
        {
          id: 2,
          title: 'Монреальская декларация',
          type: 'text',
          estimatedDuration: 15,
          description: 'Изучение Монреальской декларации об ответственном ИИ и ее основных принципов',
          completed: false
        },
        {
          id: 3,
          title: 'Принципы благодеяния и ненанесения вреда',
          type: 'interactive',
          estimatedDuration: 20,
          description: 'Интерактивное занятие по применению принципов beneficence и non-maleficence в разработке ИИ',
          completed: false
        },
        {
          id: 4,
          title: 'Практический анализ кейса',
          type: 'quiz',
          estimatedDuration: 25,
          description: 'Решение этической дилеммы на основе изученных принципов с обратной связью',
          completed: false
        }
      ]
    },
    {
      id: 2,
      title: 'Справедливость и предвзятость',
      description: 'Выявление и решение проблем предвзятости в алгоритмах машинного обучения',
      estimatedDuration: 160,
      lessons: [
        {
          id: 5,
          title: 'Типы алгоритмической предвзятости',
          type: 'video',
          estimatedDuration: 30,
          description: 'Обзор различных типов предвзятости в алгоритмах: исходные данные, представление, измерение',
          completed: false
        },
        {
          id: 6,
          title: 'Демонстрация bias в датасетах',
          type: 'interactive',
          estimatedDuration: 35,
          description: 'Практический анализ предвзятости в публичных датасетах с использованием инструментов визуализации',
          completed: false
        },
        {
          id: 7,
          title: 'Интерактив «пройди тест»',
          type: 'interactive',
          estimatedDuration: 25,
          description: 'Имплицитный ассоциативный тест для определения собственных неосознанных предубеждений',
          completed: false
        },
        {
          id: 8,
          title: 'Метрики справедливости',
          type: 'text',
          estimatedDuration: 30,
          description: 'Изучение различных метрик для оценки справедливости алгоритмов: disparate impact, equal opportunity',
          completed: false
        },
        {
          id: 9,
          title: 'Мини-проект: анализ fairness',
          type: 'quiz',
          estimatedDuration: 40,
          description: 'Применение изученных методов для анализа справедливости рекомендательной системы',
          completed: false
        }
      ]
    },
    {
      id: 3,
      title: 'Прозрачность и объяснимость',
      description: 'Методы создания понятных и объяснимых ИИ-систем',
      estimatedDuration: 145,
      lessons: [
        {
          id: 10,
          title: 'Основы объяснимого ИИ (XAI)',
          type: 'video',
          estimatedDuration: 30,
          description: 'Введение в концепции объяснимого ИИ и его важности для доверия к системам',
          completed: false
        },
        {
          id: 11,
          title: 'SHAP-визуализация',
          type: 'interactive',
          estimatedDuration: 45,
          description: 'Практика с SHAP (SHapley Additive exPlanations) для объяснения предсказаний моделей',
          completed: false
        },
        {
          id: 12,
          title: 'LIME и другие локальные методы',
          type: 'text',
          estimatedDuration: 30,
          description: 'Обзор Local Interpretable Model-agnostic Explanations и других методов локальной интерпретации',
          completed: false
        },
        {
          id: 13,
          title: 'Практика: написать model card',
          type: 'interactive',
          estimatedDuration: 40,
          description: 'Создание карточки модели (model card) для документирования особенностей и ограничений ИИ-системы',
          completed: false
        }
      ]
    }
  ]
};
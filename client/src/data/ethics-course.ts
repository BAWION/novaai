import { v4 as uuidv4 } from 'uuid';

export const ethicsCourse = {
  id: 'ai-ethics-101',
  title: 'AI Ethics & Safety 101',
  description: 'Этика и безопасность в сфере искусственного интеллекта. Курс охватывает ключевые принципы этичного использования ИИ, проблемы предвзятости, прозрачности и социального воздействия технологий.',
  icon: 'balance-scale',
  modulesCount: 6,
  estimatedDuration: 480, // 8 часов в минутах
  color: 'purple',
  category: 'ethics',
  overview: `
    Этот курс исследует этические, социальные и безопасностные аспекты искусственного интеллекта. 
    Вы изучите ключевые принципы ответственного ИИ, методы анализа и минимизации предвзятости в данных, 
    способы обеспечения прозрачности алгоритмов и подходы к оценке социального воздействия ИИ-технологий.
    
    Курс сочетает теоретические материалы с практическими упражнениями, анализом реальных кейсов и интерактивными 
    занятиями в лаборатории LabHub. После завершения вы получите сертификат "Ethics Ready" и сможете применять 
    полученные знания при разработке и внедрении ИИ-решений в соответствии с этическими стандартами.
  `,
  courseModules: [
    {
      id: uuidv4(),
      title: 'История и принципы этики ИИ',
      description: 'Эволюция этических вопросов в ИИ и основные принципы этически ответственного подхода',
      sections: [
        {
          id: uuidv4(),
          title: 'Основы',
          lessons: [
            {
              id: 1,
              title: 'Исторические кейсы ИИ-этики',
              type: 'video',
              duration: 25,
              description: 'Исследование знаковых случаев этических проблем с ИИ, включая кейс Microsoft Tay Bot',
              difficulty: 1,
              locked: false
            },
            {
              id: 2,
              title: 'Монреальская декларация',
              type: 'text',
              duration: 15,
              description: 'Изучение Монреальской декларации об ответственном ИИ и ее основных принципов',
              difficulty: 1,
              locked: false
            },
            {
              id: 3,
              title: 'Принципы благодеяния и ненанесения вреда',
              type: 'interactive',
              duration: 20,
              description: 'Интерактивное занятие по применению принципов beneficence и non-maleficence в разработке ИИ',
              difficulty: 1,
              locked: false
            },
            {
              id: 4,
              title: 'Практический анализ кейса',
              type: 'quiz',
              duration: 25,
              description: 'Решение этической дилеммы на основе изученных принципов с обратной связью',
              difficulty: 2,
              locked: false
            }
          ]
        }
      ]
    },
    {
      id: uuidv4(),
      title: 'Справедливость и предвзятость',
      description: 'Выявление и решение проблем предвзятости в алгоритмах машинного обучения',
      sections: [
        {
          id: uuidv4(),
          title: 'Разделы',
          lessons: [
            {
              id: 5,
              title: 'Типы алгоритмической предвзятости',
              type: 'video',
              duration: 30,
              description: 'Обзор различных типов предвзятости в алгоритмах: исходные данные, представление, измерение',
              difficulty: 2,
              locked: false
            },
            {
              id: 6,
              title: 'Демонстрация bias в датасетах',
              type: 'interactive',
              duration: 35,
              description: 'Практический анализ предвзятости в публичных датасетах с использованием инструментов визуализации',
              difficulty: 2,
              locked: false
            },
            {
              id: 7,
              title: 'Интерактив «пройди тест»',
              type: 'interactive',
              duration: 25,
              description: 'Имплицитный ассоциативный тест для определения собственных неосознанных предубеждений',
              difficulty: 1,
              locked: false
            },
            {
              id: 8,
              title: 'Метрики справедливости',
              type: 'text',
              duration: 30,
              description: 'Изучение различных метрик для оценки справедливости алгоритмов: disparate impact, equal opportunity',
              difficulty: 3,
              locked: false
            },
            {
              id: 9,
              title: 'Мини-проект: анализ fairness',
              type: 'quiz',
              duration: 40,
              description: 'Применение изученных методов для анализа справедливости рекомендательной системы',
              difficulty: 3,
              locked: false
            }
          ]
        }
      ]
    },
    {
      id: uuidv4(),
      title: 'Прозрачность и объяснимость',
      description: 'Методы обеспечения прозрачности и понятности работы ИИ-систем',
      sections: [
        {
          id: uuidv4(),
          title: 'Разделы',
          lessons: [
            {
              id: 10,
              title: 'Основы объяснимого ИИ (XAI)',
              type: 'video',
              duration: 30,
              description: 'Введение в концепции объяснимого ИИ и его важности для доверия к системам',
              difficulty: 2,
              locked: false
            },
            {
              id: 11,
              title: 'SHAP-визуализация',
              type: 'interactive',
              duration: 45,
              description: 'Практика с SHAP (SHapley Additive exPlanations) для объяснения предсказаний моделей',
              difficulty: 3,
              locked: false
            },
            {
              id: 12,
              title: 'LIME и другие локальные методы',
              type: 'text',
              duration: 30,
              description: 'Обзор Local Interpretable Model-agnostic Explanations и других методов локальной интерпретации',
              difficulty: 3,
              locked: false
            },
            {
              id: 13,
              title: 'Практика: написать model card',
              type: 'interactive',
              duration: 40,
              description: 'Создание карточки модели (model card) для документирования особенностей и ограничений ИИ-системы',
              difficulty: 2,
              locked: false
            }
          ]
        }
      ]
    },
    {
      id: uuidv4(),
      title: 'Безопасность и Red-teaming',
      description: 'Методы тестирования и обеспечения безопасности ИИ-систем',
      sections: [
        {
          id: uuidv4(),
          title: 'Разделы',
          lessons: [
            {
              id: 14,
              title: 'Концепции безопасности ИИ',
              type: 'video',
              duration: 35,
              description: 'Обзор основных концепций безопасности ИИ: робастность, устойчивость, защита от манипуляций',
              difficulty: 2,
              locked: false
            },
            {
              id: 15,
              title: 'Типы атак на ИИ-системы',
              type: 'text',
              duration: 30,
              description: 'Изучение различных типов атак: adversarial examples, prompt injection, jailbreak и других',
              difficulty: 3,
              locked: false
            },
            {
              id: 16,
              title: 'Red-team Lab',
              type: 'interactive',
              duration: 60,
              description: 'Практическое занятие в LabHub песочнице по тестированию моделей на уязвимости',
              difficulty: 3,
              locked: false
            },
            {
              id: 17,
              title: 'Разработка threat model',
              type: 'quiz',
              duration: 40,
              description: 'Создание и оценка модели угроз для генеративной ИИ-системы',
              difficulty: 3,
              locked: false
            }
          ]
        }
      ]
    },
    {
      id: uuidv4(),
      title: 'Управление и аудит',
      description: 'Подходы к организации процессов управления этикой ИИ в организациях',
      sections: [
        {
          id: uuidv4(),
          title: 'Разделы',
          lessons: [
            {
              id: 18,
              title: 'Стандарты в области этики ИИ',
              type: 'video',
              duration: 35,
              description: 'Обзор существующих и разрабатываемых стандартов, включая ISO/IEC 42001',
              difficulty: 2,
              locked: false
            },
            {
              id: 19,
              title: 'Структура управления этикой ИИ',
              type: 'text',
              duration: 25,
              description: 'Организационная структура для эффективного управления этическими аспектами ИИ в компании',
              difficulty: 2,
              locked: false
            },
            {
              id: 20,
              title: 'Аудит этичности ИИ-систем',
              type: 'text',
              duration: 30,
              description: 'Методология и чек-листы для проведения этического аудита алгоритмических систем',
              difficulty: 2,
              locked: false
            },
            {
              id: 21,
              title: 'Как вести Audit Trail',
              type: 'interactive',
              duration: 30,
              description: 'Практические упражнения по ведению журнала этического аудита и документации',
              difficulty: 2,
              locked: false
            },
            {
              id: 22,
              title: 'Тест: управление этикой ИИ',
              type: 'quiz',
              duration: 20,
              description: 'Проверка знаний по стандартам, процессам и инструментам управления этикой ИИ',
              difficulty: 2,
              locked: false
            }
          ]
        }
      ]
    },
    {
      id: uuidv4(),
      title: 'Этический практикум',
      description: 'Финальный проект по комплексной этической оценке ИИ-решения',
      sections: [
        {
          id: uuidv4(),
          title: 'Разделы',
          lessons: [
            {
              id: 23,
              title: 'Методология этической оценки',
              type: 'video',
              duration: 25,
              description: 'Комплексный подход к этической оценке ИИ-систем на всех этапах жизненного цикла',
              difficulty: 2,
              locked: false
            },
            {
              id: 24,
              title: 'Capstone проект: описание',
              type: 'text',
              duration: 15,
              description: 'Подробное описание финального проекта и критериев его оценки',
              difficulty: 2,
              locked: false
            },
            {
              id: 25,
              title: 'Capstone проект: разработка',
              type: 'interactive',
              duration: 90,
              description: 'Проведение полной этической оценки вымышленного ИИ-продукта по разработанному чек-листу',
              difficulty: 3,
              locked: false
            },
            {
              id: 26,
              title: 'Peer-review',
              type: 'interactive',
              duration: 40,
              description: 'Взаимная оценка проектов другими студентами курса с конструктивной обратной связью',
              difficulty: 2,
              locked: false
            },
            {
              id: 27,
              title: 'Итоговая аттестация',
              type: 'quiz',
              duration: 30,
              description: 'Финальный тест по всем темам курса для получения сертификата "Ethics Ready"',
              difficulty: 3,
              locked: false
            }
          ]
        }
      ]
    }
  ],
  requirements: [
    'Базовое понимание принципов работы ИИ',
    'Интерес к этическим аспектам технологий',
    'Критическое мышление и открытость к дискуссии'
  ],
  objectives: [
    'Понимать основные этические проблемы, связанные с ИИ и автоматизированными системами',
    'Выявлять и оценивать предвзятость в алгоритмах и данных',
    'Применять методы объяснимого ИИ для повышения прозрачности систем',
    'Проводить тестирование ИИ-систем на безопасность и устойчивость',
    'Разрабатывать стратегии этического управления ИИ в организации',
    'Осуществлять комплексную этическую оценку ИИ-решений'
  ],
  outcomes: [
    'Сертификат "Ethics Ready" с NFT-подтверждением',
    'Портфолио этической оценки ИИ-продукта',
    'Чек-лист для проведения этического аудита систем ИИ',
    'Практические навыки работы с инструментами XAI и оценки fairness'
  ]
};
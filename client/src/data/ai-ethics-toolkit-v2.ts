// AI Ethics Toolkit 2.0 - Brilliant-style Interactive Course
// Полностью интерактивный подход без видео и длинных текстов

export interface InteractiveModule {
  id: string;
  title: string;
  description: string;
  duration: number; // в минутах
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'interactive' | 'simulation' | 'assessment' | 'toolkit';
  icon: string;
  color: string;
  activities: InteractiveActivity[];
  completionCriteria: CompletionCriteria;
}

export interface InteractiveActivity {
  id: string;
  type: 'drag_drop' | 'scenario_choice' | 'slider_input' | 'card_sort' | 'flowchart' | 'quiz_interactive' | 'simulation';
  title: string;
  description: string;
  duration: number;
  component: string; // React component name
  data: any; // Specific data for the activity
  validation: ValidationRule[];
  feedback: FeedbackRule[];
}

export interface CompletionCriteria {
  minScore: number;
  requiredActivities: string[];
  timeLimit?: number;
}

export interface ValidationRule {
  field: string;
  rule: 'required' | 'min_selection' | 'max_selection' | 'range' | 'pattern';
  value: any;
  message: string;
}

export interface FeedbackRule {
  condition: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  explanation?: string;
}

export const aiEthicsToolkitV2: InteractiveModule[] = [
  {
    id: 'ethics-foundations',
    title: 'Основы этики ИИ',
    description: 'Интерактивное знакомство с ключевыми принципами через практические сценарии',
    duration: 15,
    difficulty: 'beginner',
    type: 'interactive',
    icon: 'fa-balance-scale',
    color: 'from-blue-500 to-purple-600',
    activities: [
      {
        id: 'ethics-principles-sort',
        type: 'card_sort',
        title: 'Сортировка этических принципов',
        description: 'Распределите принципы по категориям важности для вашей отрасли',
        duration: 5,
        component: 'CardSortActivity',
        data: {
          cards: [
            { id: 'fairness', title: 'Справедливость', description: 'Равные возможности для всех пользователей' },
            { id: 'transparency', title: 'Прозрачность', description: 'Понятность решений ИИ' },
            { id: 'accountability', title: 'Ответственность', description: 'Четкое распределение обязанностей' },
            { id: 'privacy', title: 'Конфиденциальность', description: 'Защита персональных данных' },
            { id: 'safety', title: 'Безопасность', description: 'Предотвращение вреда от ИИ' }
          ],
          categories: [
            { id: 'critical', title: 'Критически важно', color: 'red' },
            { id: 'important', title: 'Важно', color: 'orange' },
            { id: 'moderate', title: 'Умеренно важно', color: 'yellow' }
          ]
        },
        validation: [
          { field: 'critical', rule: 'min_selection', value: 2, message: 'Выберите минимум 2 критически важных принципа' }
        ],
        feedback: [
          { condition: 'fairness_in_critical', type: 'success', message: 'Отлично! Справедливость - основа доверия к ИИ' },
          { condition: 'transparency_in_critical', type: 'success', message: 'Правильно! Прозрачность ключевая для принятия решений' }
        ]
      },
      {
        id: 'bias-scenario',
        type: 'scenario_choice',
        title: 'Сценарий: Предвзятость в найме',
        description: 'ИИ-система отклоняет 80% женских резюме. Ваши действия?',
        duration: 7,
        component: 'ScenarioChoiceActivity',
        data: {
          scenario: {
            title: 'Критическая ситуация в HR',
            description: 'Ваша ИИ-система для отбора резюме показывает странные результаты: из 1000 женских резюме одобрено только 200, тогда как из 1000 мужских - 850. Компания готовится к массовому найму.',
            image: '/scenarios/hiring-bias.svg',
            urgency: 'high',
            stakeholders: ['HR-менеджер', 'CTO', 'Кандидаты', 'Юридический отдел']
          },
          choices: [
            {
              id: 'ignore',
              title: 'Игнорировать',
              description: 'Система работает технически корректно',
              consequences: 'Риск дискриминации и судебных исков',
              ethicsScore: 1
            },
            {
              id: 'pause',
              title: 'Приостановить систему',
              description: 'Немедленно остановить использование до выяснения',
              consequences: 'Задержка в найме, но предотвращение дискриминации',
              ethicsScore: 8
            },
            {
              id: 'investigate',
              title: 'Провести аудит',
              description: 'Детальный анализ данных и алгоритмов',
              consequences: 'Найдена причина: обучение на исторических данных с предвзятостью',
              ethicsScore: 9
            },
            {
              id: 'adjust',
              title: 'Быстро настроить',
              description: 'Изменить веса для выравнивания результатов',
              consequences: 'Может скрыть проблему, но не решить корень',
              ethicsScore: 4
            }
          ]
        },
        validation: [
          { field: 'choice', rule: 'required', value: true, message: 'Выберите один из вариантов действий' }
        ],
        feedback: [
          { condition: 'choice_investigate', type: 'success', message: 'Отлично! Системный подход к решению проблемы' },
          { condition: 'choice_pause', type: 'success', message: 'Правильно! Безопасность превыше скорости' },
          { condition: 'choice_ignore', type: 'error', message: 'Опасно! Игнорирование может привести к серьезным последствиям' }
        ]
      },
      {
        id: 'ethics-impact-slider',
        type: 'slider_input',
        title: 'Оценка этического воздействия',
        description: 'Настройте параметры ИИ-системы для медицинской диагностики',
        duration: 3,
        component: 'SliderInputActivity',
        data: {
          scenario: 'Система ИИ для диагностики рака. Настройте чувствительность.',
          sliders: [
            {
              id: 'sensitivity',
              label: 'Чувствительность (выявление болезни)',
              min: 0,
              max: 100,
              default: 85,
              unit: '%',
              description: 'Процент правильно выявленных случаев'
            },
            {
              id: 'specificity',
              label: 'Специфичность (исключение здоровых)',
              min: 0,
              max: 100,
              default: 90,
              unit: '%',
              description: 'Процент правильно исключенных здоровых случаев'
            }
          ],
          tradeoffs: [
            {
              condition: 'sensitivity > 95',
              effect: 'Много ложных тревог, стресс пациентов',
              type: 'warning'
            },
            {
              condition: 'sensitivity < 70',
              effect: 'Пропуск реальных случаев, опасность для жизни',
              type: 'error'
            }
          ]
        },
        validation: [
          { field: 'sensitivity', rule: 'range', value: [70, 95], message: 'Чувствительность должна быть 70-95%' }
        ],
        feedback: [
          { condition: 'balanced_approach', type: 'success', message: 'Отлично! Вы нашли баланс между рисками' }
        ]
      }
    ],
    completionCriteria: {
      minScore: 70,
      requiredActivities: ['ethics-principles-sort', 'bias-scenario'],
      timeLimit: 20
    }
  },
  {
    id: 'bias-detection',
    title: 'Детекция предвзятости',
    description: 'Интерактивные инструменты для обнаружения и исправления предвзятости',
    duration: 18,
    difficulty: 'intermediate',
    type: 'toolkit',
    icon: 'fa-search',
    color: 'from-red-500 to-orange-600',
    activities: [
      {
        id: 'dataset-analysis',
        type: 'drag_drop',
        title: 'Анализ датасета',
        description: 'Перетащите подозрительные паттерны в соответствующие категории',
        duration: 8,
        component: 'DragDropActivity',
        data: {
          instructions: 'Проанализируйте данные о кредитных заявках и выявите потенциальные источники предвзятости',
          items: [
            { id: 'age_distribution', title: 'Возраст 65+: 5% датасета', type: 'underrepresented' },
            { id: 'gender_salary', title: 'Средняя зарплата мужчин на 20% выше', type: 'historical_bias' },
            { id: 'zip_code', title: 'Почтовый индекс как фактор', type: 'proxy_discrimination' },
            { id: 'education', title: 'Образование: равномерное распределение', type: 'acceptable' },
            { id: 'credit_history', title: 'Кредитная история: основной фактор', type: 'acceptable' }
          ],
          categories: [
            { id: 'historical_bias', title: 'Историческая предвзятость', color: 'red' },
            { id: 'underrepresented', title: 'Недопредставленные группы', color: 'orange' },
            { id: 'proxy_discrimination', title: 'Скрытая дискриминация', color: 'yellow' },
            { id: 'acceptable', title: 'Приемлемо', color: 'green' }
          ]
        },
        validation: [
          { field: 'historical_bias', rule: 'min_selection', value: 1, message: 'Найдите историческую предвзятость' }
        ],
        feedback: [
          { condition: 'gender_salary_classified', type: 'success', message: 'Правильно! Разрыв в зарплатах - классическая историческая предвзятость' }
        ]
      },
      {
        id: 'bias-metrics',
        type: 'simulation',
        title: 'Симуляция метрик справедливости',
        description: 'Посмотрите как разные подходы влияют на справедливость',
        duration: 10,
        component: 'BiasMetricsSimulation',
        data: {
          scenario: 'Система оценки кредитоспособности',
          demographics: [
            { group: 'Мужчины', population: 6000, baseline_approval: 0.75 },
            { group: 'Женщины', population: 4000, baseline_approval: 0.68 }
          ],
          metrics: [
            { id: 'demographic_parity', name: 'Демографический паритет', formula: 'P(Y=1|A=0) = P(Y=1|A=1)' },
            { id: 'equalized_odds', name: 'Равные шансы', formula: 'P(Y=1|A=0,Y*=y) = P(Y=1|A=1,Y*=y)' },
            { id: 'predictive_parity', name: 'Предсказательный паритет', formula: 'P(Y*=1|A=0,Y=1) = P(Y*=1|A=1,Y=1)' }
          ],
          interventions: [
            { id: 'threshold_adjustment', name: 'Настройка порогов', description: 'Разные пороги для разных групп' },
            { id: 'feature_removal', name: 'Удаление признаков', description: 'Исключение коррелированных признаков' },
            { id: 'data_augmentation', name: 'Дополнение данных', description: 'Увеличение представленности' }
          ]
        },
        validation: [
          { field: 'intervention_selected', rule: 'required', value: true, message: 'Выберите метод исправления' }
        ],
        feedback: [
          { condition: 'threshold_adjustment_selected', type: 'info', message: 'Эффективно, но может снизить общую точность' }
        ]
      }
    ],
    completionCriteria: {
      minScore: 75,
      requiredActivities: ['dataset-analysis', 'bias-metrics'],
      timeLimit: 25
    }
  },
  {
    id: 'transparency-tools',
    title: 'Инструменты прозрачности',
    description: 'Практические техники объяснения решений ИИ',
    duration: 20,
    difficulty: 'advanced',
    type: 'toolkit',
    icon: 'fa-eye',
    color: 'from-green-500 to-blue-600',
    activities: [
      {
        id: 'lime-shap-interactive',
        type: 'simulation',
        title: 'LIME vs SHAP сравнение',
        description: 'Интерактивное сравнение методов объяснения',
        duration: 12,
        component: 'LimeShapComparison',
        data: {
          dataset: 'german_credit',
          model: 'random_forest',
          sample_predictions: [
            { id: 1, features: { age: 35, job: 'manager', credit_amount: 5000 }, prediction: 0.78, actual: 'approved' },
            { id: 2, features: { age: 22, job: 'student', credit_amount: 15000 }, prediction: 0.34, actual: 'denied' }
          ],
          explanation_methods: ['lime', 'shap'],
          interactive_features: true
        },
        validation: [
          { field: 'method_comparison', rule: 'required', value: true, message: 'Сравните оба метода' }
        ],
        feedback: [
          { condition: 'lime_vs_shap_analyzed', type: 'success', message: 'Отлично! Вы понимаете разницу между локальными и глобальными объяснениями' }
        ]
      },
      {
        id: 'explanation-dashboard',
        type: 'flowchart',
        title: 'Создание дашборда объяснений',
        description: 'Спроектируйте интерфейс для объяснения решений пользователям',
        duration: 8,
        component: 'ExplanationDashboardDesign',
        data: {
          user_personas: [
            { id: 'business_user', title: 'Бизнес-пользователь', needs: ['Быстрое понимание', 'Ключевые факторы'] },
            { id: 'data_scientist', title: 'Дата-сайентист', needs: ['Детальные метрики', 'Техническая информация'] },
            { id: 'end_customer', title: 'Конечный клиент', needs: ['Простое объяснение', 'Способы улучшения'] }
          ],
          components: [
            { id: 'confidence_meter', title: 'Уровень уверенности', complexity: 'low' },
            { id: 'feature_importance', title: 'Важность признаков', complexity: 'medium' },
            { id: 'counterfactual', title: 'Альтернативные сценарии', complexity: 'high' },
            { id: 'similar_cases', title: 'Похожие случаи', complexity: 'medium' }
          ]
        },
        validation: [
          { field: 'personas_matched', rule: 'min_selection', value: 2, message: 'Учтите потребности минимум 2 персон' }
        ],
        feedback: [
          { condition: 'end_customer_considered', type: 'success', message: 'Отлично! Помните о конечных пользователях' }
        ]
      }
    ],
    completionCriteria: {
      minScore: 80,
      requiredActivities: ['lime-shap-interactive', 'explanation-dashboard'],
      timeLimit: 25
    }
  },
  {
    id: 'privacy-security',
    title: 'Приватность и безопасность',
    description: 'Практические методы защиты данных и обеспечения безопасности ИИ',
    duration: 16,
    difficulty: 'intermediate',
    type: 'toolkit',
    icon: 'fa-shield-alt',
    color: 'from-purple-500 to-pink-600',
    activities: [
      {
        id: 'privacy-techniques',
        type: 'card_sort',
        title: 'Выбор техник приватности',
        description: 'Подберите подходящие методы для разных сценариев',
        duration: 8,
        component: 'PrivacyTechniquesSort',
        data: {
          scenarios: [
            { id: 'medical_research', title: 'Медицинские исследования', sensitivity: 'high', data_type: 'personal' },
            { id: 'marketing_analytics', title: 'Маркетинговая аналитика', sensitivity: 'medium', data_type: 'behavioral' },
            { id: 'financial_scoring', title: 'Кредитный скоринг', sensitivity: 'high', data_type: 'financial' }
          ],
          techniques: [
            { id: 'differential_privacy', title: 'Дифференциальная приватность', complexity: 'high', effectiveness: 'high' },
            { id: 'k_anonymity', title: 'K-анонимность', complexity: 'medium', effectiveness: 'medium' },
            { id: 'homomorphic_encryption', title: 'Гомоморфное шифрование', complexity: 'high', effectiveness: 'high' },
            { id: 'federated_learning', title: 'Федеративное обучение', complexity: 'high', effectiveness: 'medium' },
            { id: 'data_masking', title: 'Маскирование данных', complexity: 'low', effectiveness: 'low' }
          ]
        },
        validation: [
          { field: 'medical_research', rule: 'min_selection', value: 1, message: 'Выберите технику для медицинских данных' }
        ],
        feedback: [
          { condition: 'differential_privacy_medical', type: 'success', message: 'Отлично! Дифференциальная приватность идеальна для медицинских данных' }
        ]
      },
      {
        id: 'security-threats',
        type: 'scenario_choice',
        title: 'Реагирование на угрозы',
        description: 'Ваша модель подвергается атаке. Как действовать?',
        duration: 8,
        component: 'SecurityThreatResponse',
        data: {
          threat_scenario: {
            type: 'adversarial_attack',
            description: 'Обнаружены целенаправленные попытки обмануть систему распознавания изображений',
            severity: 'high',
            affected_systems: ['image_classification', 'fraud_detection'],
            indicators: ['Необычные паттерны входных данных', 'Падение точности модели', 'Аномальные запросы']
          },
          response_options: [
            {
              id: 'immediate_shutdown',
              title: 'Немедленное отключение',
              description: 'Остановить все затронутые системы',
              pros: ['Предотвращение дальнейшего ущерба'],
              cons: ['Прерывание бизнес-процессов'],
              effectiveness: 9
            },
            {
              id: 'monitoring_mode',
              title: 'Усиленный мониторинг',
              description: 'Продолжить работу с повышенным контролем',
              pros: ['Сохранение работоспособности', 'Сбор данных об атаке'],
              cons: ['Риск продолжения атаки'],
              effectiveness: 6
            },
            {
              id: 'gradual_rollback',
              title: 'Постепенный откат',
              description: 'Вернуться к предыдущей версии модели',
              pros: ['Компромисс между безопасностью и работоспособностью'],
              cons: ['Потеря улучшений'],
              effectiveness: 7
            }
          ]
        },
        validation: [
          { field: 'response_choice', rule: 'required', value: true, message: 'Выберите стратегию реагирования' }
        ],
        feedback: [
          { condition: 'immediate_shutdown_chosen', type: 'success', message: 'Правильно! Безопасность превыше всего при критических угрозах' }
        ]
      }
    ],
    completionCriteria: {
      minScore: 75,
      requiredActivities: ['privacy-techniques', 'security-threats'],
      timeLimit: 20
    }
  },
  {
    id: 'compliance-assessment',
    title: 'Оценка соответствия',
    description: 'Практические инструменты для проверки соответствия регуляторным требованиям',
    duration: 22,
    difficulty: 'advanced',
    type: 'assessment',
    icon: 'fa-clipboard-check',
    color: 'from-indigo-500 to-purple-600',
    activities: [
      {
        id: 'gdpr-compliance-check',
        type: 'quiz_interactive',
        title: 'GDPR чек-лист',
        description: 'Интерактивная проверка соответствия GDPR',
        duration: 10,
        component: 'GDPRComplianceCheck',
        data: {
          compliance_areas: [
            {
              id: 'data_processing',
              title: 'Обработка данных',
              questions: [
                {
                  id: 'lawful_basis',
                  text: 'Есть ли законное основание для обработки данных?',
                  type: 'multiple_choice',
                  options: [
                    { id: 'consent', text: 'Согласие', weight: 10 },
                    { id: 'contract', text: 'Исполнение договора', weight: 10 },
                    { id: 'legal_obligation', text: 'Правовое обязательство', weight: 10 },
                    { id: 'none', text: 'Не определено', weight: 0 }
                  ]
                },
                {
                  id: 'data_minimization',
                  text: 'Собираются ли только необходимые данные?',
                  type: 'boolean',
                  weight: 8
                }
              ]
            },
            {
              id: 'individual_rights',
              title: 'Права субъектов данных',
              questions: [
                {
                  id: 'right_to_explanation',
                  text: 'Можете ли вы объяснить автоматизированные решения?',
                  type: 'scale',
                  min: 1,
                  max: 5,
                  weight: 9
                }
              ]
            }
          ]
        },
        validation: [
          { field: 'all_questions_answered', rule: 'required', value: true, message: 'Ответьте на все вопросы' }
        ],
        feedback: [
          { condition: 'high_compliance_score', type: 'success', message: 'Отлично! Высокий уровень соответствия GDPR' },
          { condition: 'low_compliance_score', type: 'warning', message: 'Необходимо улучшить соответствие требованиям' }
        ]
      },
      {
        id: 'risk-assessment-matrix',
        type: 'drag_drop',
        title: 'Матрица рисков',
        description: 'Разместите выявленные риски в матрице вероятность/воздействие',
        duration: 12,
        component: 'RiskAssessmentMatrix',
        data: {
          risks: [
            { id: 'data_breach', title: 'Утечка данных', description: 'Несанкционированный доступ к персональным данным' },
            { id: 'algorithmic_bias', title: 'Алгоритмическая предвзятость', description: 'Дискриминация определенных групп' },
            { id: 'model_drift', title: 'Деградация модели', description: 'Снижение точности со временем' },
            { id: 'adversarial_attack', title: 'Состязательная атака', description: 'Целенаправленный обман системы' },
            { id: 'regulatory_changes', title: 'Изменения в законодательстве', description: 'Новые требования соответствия' }
          ],
          matrix: {
            probability_axis: ['Очень низкая', 'Низкая', 'Средняя', 'Высокая', 'Очень высокая'],
            impact_axis: ['Минимальное', 'Низкое', 'Среднее', 'Высокое', 'Критическое']
          },
          risk_levels: [
            { range: [1, 4], level: 'low', color: 'green', action: 'Мониторинг' },
            { range: [5, 12], level: 'medium', color: 'yellow', action: 'Планирование мер' },
            { range: [13, 20], level: 'high', color: 'orange', action: 'Активные меры' },
            { range: [21, 25], level: 'critical', color: 'red', action: 'Немедленные действия' }
          ]
        },
        validation: [
          { field: 'all_risks_placed', rule: 'required', value: true, message: 'Разместите все риски в матрице' }
        ],
        feedback: [
          { condition: 'data_breach_high_impact', type: 'success', message: 'Правильно! Утечка данных - критический риск' },
          { condition: 'bias_properly_assessed', type: 'success', message: 'Отлично! Алгоритмическая предвзятость требует внимания' }
        ]
      }
    ],
    completionCriteria: {
      minScore: 85,
      requiredActivities: ['gdpr-compliance-check', 'risk-assessment-matrix'],
      timeLimit: 30
    }
  }
];

// Utility functions for course management
export const getCourseProgress = (moduleId: string): number => {
  // В реальности будет браться из состояния пользователя
  return Math.random() * 100;
};

export const getEstimatedTime = (activities: InteractiveActivity[]): number => {
  return activities.reduce((total, activity) => total + activity.duration, 0);
};

export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'beginner': return 'from-green-400 to-blue-500';
    case 'intermediate': return 'from-yellow-400 to-orange-500';
    case 'advanced': return 'from-red-400 to-purple-500';
    default: return 'from-gray-400 to-gray-600';
  }
};

export const getActivityTypeIcon = (type: string): string => {
  switch (type) {
    case 'drag_drop': return 'fa-hand-rock';
    case 'scenario_choice': return 'fa-route';
    case 'slider_input': return 'fa-sliders-h';
    case 'card_sort': return 'fa-layer-group';
    case 'flowchart': return 'fa-project-diagram';
    case 'quiz_interactive': return 'fa-question-circle';
    case 'simulation': return 'fa-play-circle';
    default: return 'fa-puzzle-piece';
  }
};

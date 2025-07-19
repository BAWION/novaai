// AI Ethics Toolkit 2.0 - Brilliant-style Interactive Course
export interface InteractiveModule {
  id: string;
  title: string;
  description: string;
  duration: number;
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
  component: string;
  data: any;
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
            { id: 'transparency', title: 'Прозрачность', description: 'Понятность решений ИИ' }
          ],
          categories: [
            { id: 'critical', title: 'Критически важно', color: 'red' },
            { id: 'important', title: 'Важно', color: 'orange' }
          ]
        },
        validation: [
          { field: 'critical', rule: 'min_selection', value: 1, message: 'Выберите минимум 1 принцип' }
        ],
        feedback: [
          { condition: 'fairness_in_critical', type: 'success', message: 'Отлично! Справедливость - основа доверия к ИИ' }
        ]
      }
    ],
    completionCriteria: {
      minScore: 80,
      requiredActivities: ['ethics-principles-sort']
    }
  }
];

export const getCourseProgress = (moduleId: string): number => {
  return Math.random() * 100;
};

export const getEstimatedTime = (activities: InteractiveActivity[]): number => {
  return activities.reduce((total, activity) => total + activity.duration, 0);
};

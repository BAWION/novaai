export type CourseTrack = 'zero-to-hero' | 'applied-ds' | 'research-ai' | 'nlp-expert';
export type UserRole = 'student' | 'professional' | 'teacher' | 'researcher';
export type SkillLevel = 1 | 2 | 3 | 4 | 5;
export type AIExperience = 'beginner' | 'learning-basics' | 'experienced' | 'expert';
export type UserInterest = 'machine-learning' | 'neural-networks' | 'data-science' | 'computer-vision' | 'ethics' | 'law';
export type UserGoal = 'find-internship' | 'practice-skills' | 'career-change' | 'create-project';

export interface OnboardingQuestion {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    icon: string;
    value: string;
  }[];
}

export const onboardingQuestions: OnboardingQuestion[] = [
  {
    id: 'role',
    question: 'Какая у вас роль?',
    options: [
      { id: 'student', text: 'Студент', icon: 'user-graduate', value: 'student' },
      { id: 'professional', text: 'Профессионал', icon: 'briefcase', value: 'professional' },
      { id: 'teacher', text: 'Преподаватель', icon: 'chalkboard-teacher', value: 'teacher' },
      { id: 'researcher', text: 'Исследователь', icon: 'lightbulb', value: 'researcher' }
    ]
  },
  {
    id: 'python',
    question: 'Оцените свои знания Python',
    options: [
      { id: 'py1', text: '1 из 5', icon: '', value: '1' },
      { id: 'py2', text: '2 из 5', icon: '', value: '2' },
      { id: 'py3', text: '3 из 5', icon: '', value: '3' },
      { id: 'py4', text: '4 из 5', icon: '', value: '4' },
      { id: 'py5', text: '5 из 5', icon: '', value: '5' }
    ]
  },
  {
    id: 'experience',
    question: 'Опыт работы с ML/AI',
    options: [
      { id: 'exp1', text: 'Начинающий', icon: 'seedling', value: 'beginner' },
      { id: 'exp2', text: 'Изучаю основы', icon: 'book-reader', value: 'learning-basics' },
      { id: 'exp3', text: 'Имею опыт', icon: 'laptop-code', value: 'experienced' },
      { id: 'exp4', text: 'Эксперт', icon: 'award', value: 'expert' }
    ]
  },
  {
    id: 'interest',
    question: 'Что вас интересует больше всего?',
    options: [
      { id: 'int1', text: 'Машинное обучение', icon: 'brain', value: 'machine-learning' },
      { id: 'int2', text: 'Нейронные сети', icon: 'robot', value: 'neural-networks' },
      { id: 'int3', text: 'Data Science', icon: 'chart-line', value: 'data-science' },
      { id: 'int4', text: 'Computer Vision', icon: 'microchip', value: 'computer-vision' },
      { id: 'int5', text: 'Этика ИИ', icon: 'balance-scale', value: 'ethics' },
      { id: 'int6', text: 'Право и регулирование ИИ', icon: 'gavel', value: 'law' }
    ]
  },
  {
    id: 'goal',
    question: 'Ваша главная цель?',
    options: [
      { id: 'goal1', text: 'Найти стажировку', icon: 'user-tie', value: 'find-internship' },
      { id: 'goal2', text: 'Практиковать навыки', icon: 'laptop-code', value: 'practice-skills' },
      { id: 'goal3', text: 'Сменить профессию', icon: 'exchange-alt', value: 'career-change' },
      { id: 'goal4', text: 'Создать проект', icon: 'project-diagram', value: 'create-project' }
    ]
  }
];

export interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  modules: number;
  level: 'basic' | 'practice' | 'in-progress' | 'upcoming';
  color: 'primary' | 'secondary' | 'accent' | 'purple' | 'green';
  category?: 'tech' | 'ethics' | 'law' | 'business' | 'ml' | 'other';
}

export const courses: Course[] = [
  {
    id: 'python-basics',
    title: 'Python Basics',
    description: 'Основы программирования на Python',
    icon: 'code',
    modules: 8,
    level: 'basic',
    color: 'secondary',
    category: 'tech'
  },
  {
    id: 'math-lite',
    title: 'Math Lite',
    description: 'Математика для машинного обучения',
    icon: 'calculator',
    modules: 5,
    level: 'basic',
    color: 'primary',
    category: 'tech'
  },
  {
    id: 'data-analysis',
    title: 'Data Analysis',
    description: 'Анализ и визуализация данных',
    icon: 'database',
    modules: 6,
    level: 'practice',
    color: 'secondary',
    category: 'tech'
  },
  {
    id: 'ml-foundations',
    title: 'ML Foundations',
    description: 'Основы машинного обучения',
    icon: 'brain',
    modules: 7,
    level: 'in-progress',
    color: 'primary',
    category: 'ml'
  },
  {
    id: 'capstone',
    title: 'Capstone Project',
    description: 'Выпускной проект',
    icon: 'project-diagram',
    modules: 3,
    level: 'upcoming',
    color: 'accent',
    category: 'tech'
  },
  {
    id: 'ai-ethics-101',
    title: 'AI Ethics & Safety 101',
    description: 'Этика и безопасность в сфере искусственного интеллекта',
    icon: 'balance-scale',
    modules: 6,
    level: 'basic',
    color: 'purple',
    category: 'ethics'
  },
  {
    id: 'ai-law-ru-eu',
    title: 'Legal Frameworks for AI',
    description: 'Правовые основы ИИ в России и ЕС',
    icon: 'gavel',
    modules: 5,
    level: 'practice',
    color: 'green',
    category: 'law'
  }
];

export interface SkillNode {
  id: string;
  name: string;
  icon: string;
  size: 'xs' | 'sm' | 'md' | 'lg';
  color: 'primary' | 'secondary' | 'accent';
  intensity: number;
  position: { x: number; y: number };
}

export interface SkillConnection {
  from: string;
  to: string;
}

export const skillNodes: SkillNode[] = [
  { id: 'python', name: 'Python', icon: 'fab fa-python', size: 'lg', color: 'secondary', intensity: 100, position: { x: 20, y: 10 } },
  { id: 'pandas', name: 'Pandas', icon: 'fas fa-table', size: 'md', color: 'primary', intensity: 80, position: { x: 45, y: 20 } },
  { id: 'numpy', name: 'NumPy', icon: 'fas fa-calculator', size: 'md', color: 'primary', intensity: 70, position: { x: 80, y: 15 } },
  { id: 'stats', name: 'Stats', icon: 'fas fa-chart-bar', size: 'sm', color: 'primary', intensity: 60, position: { x: 30, y: 40 } },
  { id: 'viz', name: 'DataViz', icon: 'fas fa-chart-line', size: 'sm', color: 'primary', intensity: 60, position: { x: 65, y: 45 } },
  { id: 'ml', name: 'ML Basics', icon: 'fas fa-brain', size: 'md', color: 'secondary', intensity: 80, position: { x: 25, y: 80 } },
  { id: 'dl', name: 'Deep', icon: 'fas fa-network-wired', size: 'xs', color: 'accent', intensity: 40, position: { x: 75, y: 75 } },
  { id: 'deploy', name: 'Deploy', icon: 'fas fa-cloud-upload-alt', size: 'md', color: 'accent', intensity: 60, position: { x: 45, y: 90 } }
];

export const skillConnections: SkillConnection[] = [
  { from: 'python', to: 'pandas' },
  { from: 'python', to: 'numpy' },
  { from: 'pandas', to: 'stats' },
  { from: 'pandas', to: 'viz' },
  { from: 'numpy', to: 'viz' },
  { from: 'numpy', to: 'stats' },
  { from: 'stats', to: 'ml' },
  { from: 'viz', to: 'ml' },
  { from: 'ml', to: 'dl' },
  { from: 'ml', to: 'deploy' }
];

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: 'primary' | 'secondary' | 'accent';
}

export const quickActions: QuickAction[] = [
  {
    id: 'continue-learning',
    title: 'Продолжить обучение',
    description: 'Модуль 4: "Линейная регрессия"',
    icon: 'play-circle',
    color: 'secondary'
  },
  {
    id: 'sandbox',
    title: 'Практическая песочница',
    description: 'Лаборатория с ноутбуками и тестами',
    icon: 'laptop-code',
    color: 'primary'
  },
  {
    id: 'community',
    title: 'Комьюнити',
    description: 'Discord/Telegram-хабы и события',
    icon: 'users',
    color: 'accent'
  }
];

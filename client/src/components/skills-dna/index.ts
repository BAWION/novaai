export { CompactSkillsDnaCard } from './compact-card';
export { SkillsTriangleChart } from './triangle-chart';
export { SkillsDnaModal } from './modal-dialog';
export { AdvancedRadarChart } from './advanced-radar-chart';
export { DetailedSkillsDnaProfile } from './detailed-profile';

// Экспортируем только типы из оригинального файла
import { RecommendedCourse, CourseRecWithMatchPercentage } from './recommended-courses';
export type { RecommendedCourse, CourseRecWithMatchPercentage };

// Используем исправленную версию компонента
export { FixedRecommendedCourses as RecommendedCourses } from './fixed-recommended-courses';

// Экспорт виджета Skills DNA с радаром
export { default as SkillsDnaWidget } from './skills-dna-widget';
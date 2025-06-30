import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { useAuth } from "@/hooks/useAuth";
import { 
  Route, Clock, Target, BookOpen, Award, Lock, 
  User, TrendingUp, Brain, CheckCircle, PlayCircle,
  AlertCircle, Timer, Star, ArrowRight
} from 'lucide-react';

interface SkillsDnaData {
  id: number;
  name: string;
  currentLevel: string;
  progress: number;
  category: string;
  description?: string;
}

interface CourseNode {
  id: number;
  title: string;
  description: string;
  estimatedHours: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisiteSkills: string[];
  improvesSkills: string[];
  status: 'completed' | 'in-progress' | 'recommended' | 'available' | 'locked';
  progress: number;
}

interface RoadmapPath {
  courses: CourseNode[];
  totalHours: number;
  estimatedWeeks: number;
  skillImprovements: { skill: string; expectedProgress: number }[];
}

export function SmartRoadmapWidget() {
  const { user, isAuthenticated } = useAuth();
  const [isSkillsDnaConnected, setIsSkillsDnaConnected] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseNode | null>(null);
  const [hoveredCourse, setHoveredCourse] = useState<number | null>(null);
  const [roadmapPath, setRoadmapPath] = useState<RoadmapPath | null>(null);

  // Загружаем Skills DNA данные пользователя
  const { data: skillsDnaData, isLoading: skillsLoading } = useQuery({
    queryKey: ['/api/diagnosis/progress', user?.id],
    enabled: isAuthenticated && isSkillsDnaConnected && !!user?.id,
    retry: false,
  }) as { data: { data: SkillsDnaData[] } | undefined, isLoading: boolean };

  // Загружаем курсы
  const { data: courses = [] } = useQuery({
    queryKey: ['/api/courses'],
  }) as { data: any[] };

  // Генерируем персональную дорожную карту на основе Skills DNA
  useEffect(() => {
    if (skillsDnaData?.data && Array.isArray(skillsDnaData.data) && Array.isArray(courses) && courses.length > 0) {
      generatePersonalizedRoadmap(skillsDnaData.data, courses);
    }
  }, [skillsDnaData, courses]);

  const generatePersonalizedRoadmap = (skills: SkillsDnaData[], availableCourses: any[]) => {
    // Анализируем текущий уровень навыков
    const weakestSkills = skills
      .filter(skill => skill.progress < 60)
      .sort((a, b) => a.progress - b.progress);

    const strongSkills = skills
      .filter(skill => skill.progress >= 60)
      .map(skill => skill.name.toLowerCase());

    // Создаем персонализированный путь обучения
    const recommendedCourses: CourseNode[] = [];

    availableCourses.forEach((course, index) => {
      let status: CourseNode['status'] = 'available';
      let progress = 0;

      // Определяем статус курса на основе навыков
      const courseSkills = getCourseSkills(course.title.toLowerCase());
      const hasPrerequisites = courseSkills.prerequisites.every(prereq => 
        strongSkills.includes(prereq)
      );

      if (!hasPrerequisites) {
        status = 'locked';
      } else if (weakestSkills.some(skill => 
        courseSkills.improves.includes(skill.name.toLowerCase())
      )) {
        status = 'recommended';
      }

      // Симулируем прогресс для демонстрации
      if (index < 2) {
        status = 'completed';
        progress = 100;
      } else if (index === 2) {
        status = 'in-progress';
        progress = 45;
      }

      recommendedCourses.push({
        id: course.id,
        title: course.title,
        description: course.description || getDefaultDescription(course.title),
        estimatedHours: getEstimatedHours(course.title),
        difficulty: getDifficulty(course.title),
        prerequisiteSkills: courseSkills.prerequisites,
        improvesSkills: courseSkills.improves,
        status,
        progress
      });
    });

    // Сортируем курсы по приоритету
    recommendedCourses.sort((a, b) => {
      const statusOrder = { 'in-progress': 0, 'recommended': 1, 'available': 2, 'completed': 3, 'locked': 4 };
      return statusOrder[a.status] - statusOrder[b.status];
    });

    const totalHours = recommendedCourses.reduce((sum, course) => sum + course.estimatedHours, 0);
    const estimatedWeeks = Math.ceil(totalHours / 10); // 10 часов в неделю

    setRoadmapPath({
      courses: recommendedCourses.slice(0, 8), // Показываем первые 8 курсов
      totalHours,
      estimatedWeeks,
      skillImprovements: weakestSkills.slice(0, 3).map(skill => ({
        skill: skill.name,
        expectedProgress: Math.min(skill.progress + 30, 100)
      }))
    });

    if (recommendedCourses.length > 0) {
      setSelectedCourse(recommendedCourses[0]);
    }
  };

  const getCourseSkills = (courseTitle: string) => {
    const skillsMap: Record<string, { prerequisites: string[], improves: string[] }> = {
      'основы искусственного интеллекта': {
        prerequisites: [],
        improves: ['машинное обучение', 'python программирование']
      },
      'python для начинающих': {
        prerequisites: [],
        improves: ['python программирование']
      },
      'машинное обучение': {
        prerequisites: ['python программирование'],
        improves: ['машинное обучение', 'данные и аналитика']
      },
      'этика ии': {
        prerequisites: ['машинное обучение'],
        improves: ['этика ии', 'критическое мышление']
      },
      'no-code ai': {
        prerequisites: [],
        improves: ['автоматизация', 'no-code инструменты']
      }
    };

    return skillsMap[courseTitle] || { prerequisites: [], improves: [] };
  };

  const getEstimatedHours = (courseTitle: string): number => {
    const hoursMap: Record<string, number> = {
      'основы искусственного интеллекта': 20,
      'python для начинающих': 30,
      'машинное обучение': 40,
      'этика ии': 15,
      'no-code ai': 25
    };
    return hoursMap[courseTitle.toLowerCase()] || 20;
  };

  const getDifficulty = (courseTitle: string): 'beginner' | 'intermediate' | 'advanced' => {
    if (courseTitle.toLowerCase().includes('начинающих') || courseTitle.toLowerCase().includes('основы')) {
      return 'beginner';
    }
    if (courseTitle.toLowerCase().includes('продвинутый') || courseTitle.toLowerCase().includes('advanced')) {
      return 'advanced';
    }
    return 'intermediate';
  };

  const getDefaultDescription = (title: string): string => {
    return `Изучите ${title.toLowerCase()} с практическими примерами и интерактивными заданиями.`;
  };

  const getStatusIcon = (status: CourseNode['status']) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return PlayCircle;
      case 'recommended': return Star;
      case 'available': return BookOpen;
      case 'locked': return Lock;
      default: return BookOpen;
    }
  };

  const getStatusColor = (status: CourseNode['status']) => {
    switch (status) {
      case 'completed': return 'from-green-500 to-emerald-600';
      case 'in-progress': return 'from-blue-500 to-cyan-600';
      case 'recommended': return 'from-amber-500 to-orange-600';
      case 'available': return 'from-gray-500 to-gray-600';
      case 'locked': return 'from-gray-700 to-gray-800';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getDifficultyColor = (difficulty: CourseNode['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400';
      case 'intermediate': return 'text-yellow-400';
      case 'advanced': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const formatTime = (hours: number) => {
    if (hours < 24) return `${hours}ч`;
    const days = Math.floor(hours / 8);
    return `${days}д`;
  };

  if (!isAuthenticated) {
    return (
      <div className="w-full">
        <Glassmorphism className="rounded-xl p-8 text-center">
          <User className="w-16 h-16 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-orbitron font-bold text-white mb-2">
            Персональная дорожная карта
          </h3>
          <p className="text-white/70 mb-6">
            Войдите в систему для создания персонализированного плана обучения на основе вашего Skills DNA профиля
          </p>
          <button className="bg-gradient-to-r from-primary to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-all">
            Войти в систему
          </button>
        </Glassmorphism>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Переключатель Skills DNA */}
      <Glassmorphism className="rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-primary" />
            <div>
              <h3 className="text-white font-orbitron font-bold">
                Подключить Skills DNA
              </h3>
              <p className="text-white/60 text-sm">
                Используйте результаты вашей диагностики для персонализированной дорожной карты
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {skillsLoading && isSkillsDnaConnected && (
              <div className="flex items-center gap-2 text-primary">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Анализ данных...</span>
              </div>
            )}
            <button
              onClick={() => setIsSkillsDnaConnected(!isSkillsDnaConnected)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isSkillsDnaConnected ? 'bg-primary' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isSkillsDnaConnected ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </Glassmorphism>

      {/* Дорожная карта */}
      {isSkillsDnaConnected && roadmapPath && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Основная карта */}
          <div className="lg:col-span-2">
            <Glassmorphism className="rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Route className="w-6 h-6 text-primary" />
                  <h3 className="text-white font-orbitron font-bold text-xl">
                    Ваша дорожная карта
                  </h3>
                </div>
                <div className="flex items-center gap-4 text-sm text-white/70">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{roadmapPath.totalHours}ч</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Timer className="w-4 h-4" />
                    <span>{roadmapPath.estimatedWeeks} недель</span>
                  </div>
                </div>
              </div>

              {/* Временная шкала */}
              <div className="mb-8">
                <div className="flex items-center justify-between text-xs text-white/50 mb-2">
                  <span>Сейчас</span>
                  <span>Через {roadmapPath.estimatedWeeks} недель</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full relative overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-purple-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '25%' }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                  <div className="absolute top-0 left-1/4 w-0.5 h-full bg-white/30" />
                  <div className="absolute top-0 left-2/4 w-0.5 h-full bg-white/30" />
                  <div className="absolute top-0 left-3/4 w-0.5 h-full bg-white/30" />
                </div>
                <div className="flex justify-between text-xs text-white/40 mt-1">
                  <span>1 нед</span>
                  <span>{Math.floor(roadmapPath.estimatedWeeks / 4)} нед</span>
                  <span>{Math.floor(roadmapPath.estimatedWeeks / 2)} нед</span>
                  <span>{Math.floor(roadmapPath.estimatedWeeks * 0.75)} нед</span>
                </div>
              </div>

              {/* Курсы в виде интерактивных узлов */}
              <div className="relative">
                <div className="grid grid-cols-4 gap-4">
                  {roadmapPath.courses.map((course, index) => {
                    const StatusIcon = getStatusIcon(course.status);
                    const isHovered = hoveredCourse === course.id;
                    const isSelected = selectedCourse?.id === course.id;

                    return (
                      <motion.div
                        key={course.id}
                        className="relative"
                        onHoverStart={() => setHoveredCourse(course.id)}
                        onHoverEnd={() => setHoveredCourse(null)}
                        onClick={() => setSelectedCourse(course)}
                      >
                        {/* Соединительная линия */}
                        {index < roadmapPath.courses.length - 1 && (
                          <div className="absolute top-6 left-full w-4 h-0.5 bg-gradient-to-r from-primary/50 to-transparent z-0" />
                        )}

                        {/* Узел курса */}
                        <motion.div
                          className={`relative cursor-pointer ${
                            isSelected ? 'ring-2 ring-primary' : ''
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          animate={{
                            y: isHovered ? -5 : 0,
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <div
                            className={`w-12 h-12 rounded-full bg-gradient-to-br ${getStatusColor(course.status)} 
                            flex items-center justify-center text-white shadow-lg relative z-10`}
                          >
                            <StatusIcon className="w-5 h-5" />
                            
                            {/* Пульсирующий эффект для рекомендованных курсов */}
                            {course.status === 'recommended' && (
                              <motion.div
                                className="absolute inset-0 rounded-full bg-amber-400/30"
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                            )}
                          </div>

                          {/* Индикатор прогресса */}
                          {course.progress > 0 && (
                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white/20 rounded-full">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${course.progress}%` }}
                              />
                            </div>
                          )}

                          {/* Название курса */}
                          <div className="mt-2 text-center">
                            <p className="text-xs font-medium text-white/80 leading-tight">
                              {course.title.length > 15 
                                ? `${course.title.substring(0, 15)}...` 
                                : course.title
                              }
                            </p>
                          </div>

                          {/* Детальная информация при наведении */}
                          <AnimatePresence>
                            {isHovered && (
                              <motion.div
                                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-20"
                                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                                transition={{ duration: 0.15 }}
                              >
                                <div className="bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-lg p-3 shadow-xl min-w-[200px]">
                                  <h4 className="font-medium text-white text-sm mb-1">
                                    {course.title}
                                  </h4>
                                  <p className="text-white/70 text-xs mb-2">
                                    {course.description}
                                  </p>
                                  <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      <span className="text-white/60">
                                        {formatTime(course.estimatedHours)}
                                      </span>
                                    </div>
                                    <span className={`font-medium ${getDifficultyColor(course.difficulty)}`}>
                                      {course.difficulty === 'beginner' && 'Начальный'}
                                      {course.difficulty === 'intermediate' && 'Средний'}
                                      {course.difficulty === 'advanced' && 'Продвинутый'}
                                    </span>
                                  </div>
                                  
                                  {/* Стрелка */}
                                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900/95" />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </Glassmorphism>
          </div>

          {/* Боковая панель с деталями */}
          <div className="space-y-4">
            {/* Детали выбранного курса */}
            {selectedCourse && (
              <Glassmorphism className="rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${getStatusColor(selectedCourse.status)} 
                    flex items-center justify-center text-white shadow-lg`}
                  >
                    {React.createElement(getStatusIcon(selectedCourse.status), { className: "w-5 h-5" })}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{selectedCourse.title}</h4>
                    <p className="text-white/60 text-sm">
                      {selectedCourse.status === 'completed' && 'Завершен'}
                      {selectedCourse.status === 'in-progress' && 'В процессе'}
                      {selectedCourse.status === 'recommended' && 'Рекомендуется'}
                      {selectedCourse.status === 'available' && 'Доступен'}
                      {selectedCourse.status === 'locked' && 'Заблокирован'}
                    </p>
                  </div>
                </div>

                <p className="text-white/70 text-sm mb-4">
                  {selectedCourse.description}
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Время изучения:</span>
                    <span className="text-white">{formatTime(selectedCourse.estimatedHours)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Сложность:</span>
                    <span className={getDifficultyColor(selectedCourse.difficulty)}>
                      {selectedCourse.difficulty === 'beginner' && 'Начальный'}
                      {selectedCourse.difficulty === 'intermediate' && 'Средний'}
                      {selectedCourse.difficulty === 'advanced' && 'Продвинутый'}
                    </span>
                  </div>
                  {selectedCourse.progress > 0 && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/70">Прогресс:</span>
                        <span className="text-white">{selectedCourse.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full">
                        <motion.div
                          className="h-full bg-primary rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedCourse.progress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {selectedCourse.status === 'available' && (
                  <button className="w-full bg-gradient-to-r from-primary to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2">
                    <PlayCircle className="w-4 h-4" />
                    Начать курс
                  </button>
                )}

                {selectedCourse.status === 'in-progress' && (
                  <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Продолжить
                  </button>
                )}

                {selectedCourse.status === 'recommended' && (
                  <button className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2">
                    <Star className="w-4 h-4" />
                    Рекомендуется
                  </button>
                )}
              </Glassmorphism>
            )}

            {/* Ожидаемые улучшения навыков */}
            <Glassmorphism className="rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-white">Прогресс навыков</h4>
              </div>
              <div className="space-y-3">
                {roadmapPath.skillImprovements.map((improvement, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">{improvement.skill}</span>
                      <span className="text-primary">+{improvement.expectedProgress - (skillsDnaData?.data?.find((s: any) => s.name === improvement.skill)?.progress || 0)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-purple-600 rounded-full"
                        initial={{ width: `${skillsDnaData?.data?.find((s: any) => s.name === improvement.skill)?.progress || 0}%` }}
                        animate={{ width: `${improvement.expectedProgress}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Glassmorphism>
          </div>
        </div>
      )}

      {/* Состояние когда Skills DNA не подключен */}
      {!isSkillsDnaConnected && (
        <Glassmorphism className="rounded-xl p-8 text-center">
          <Brain className="w-16 h-16 text-primary/50 mx-auto mb-4" />
          <h3 className="text-xl font-orbitron font-bold text-white mb-2">
            Активируйте умную дорожную карту
          </h3>
          <p className="text-white/60 mb-4">
            Подключите ваши данные Skills DNA для создания персонализированного плана обучения
          </p>
          <p className="text-white/40 text-sm">
            Используются результаты уже пройденной диагностики — повторное тестирование не требуется
          </p>
        </Glassmorphism>
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Glassmorphism } from '@/components/ui/glassmorphism';
import { 
  Route, 
  Brain, 
  Clock, 
  Timer, 
  User,
  BookOpen,
  Lock,
  CheckCircle,
  PlayCircle,
  Star,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SkillsDnaData {
  id: number;
  name: string;
  progress: number;
  currentLevel: string;
  category: string;
}

interface CourseNode {
  id: number;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  hours: number;
  status: 'completed' | 'in-progress' | 'recommended' | 'available' | 'locked';
  progress: number;
}

interface SkillImprovement {
  skill: string;
  currentProgress: number;
  expectedProgress: number;
  reason: string;
}

interface RoadmapPath {
  totalHours: number;
  estimatedWeeks: number;
  courses: CourseNode[];
  skillImprovements: SkillImprovement[];
}

export const SmartRoadmapWidget: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [isSkillsDnaConnected, setIsSkillsDnaConnected] = useState(false);
  const [roadmapPath, setRoadmapPath] = useState<RoadmapPath | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<CourseNode | null>(null);
  const [hoveredCourse, setHoveredCourse] = useState<number | null>(null);

  // Загружаем Skills DNA данные пользователя
  const { data: skillsDnaData, isLoading: skillsLoading } = useQuery({
    queryKey: ['/api/diagnosis/progress', user?.id],
    enabled: isAuthenticated && isSkillsDnaConnected && !!user?.id,
    retry: false,
  });

  // Загружаем курсы
  const { data: courses = [] } = useQuery({
    queryKey: ['/api/courses'],
  });

  // Генерируем персональную дорожную карту на основе Skills DNA
  useEffect(() => {
    if (skillsDnaData?.data && Array.isArray(skillsDnaData.data) && Array.isArray(courses) && courses.length > 0) {
      generatePersonalizedRoadmap(skillsDnaData.data, courses);
    }
  }, [skillsDnaData, courses]);

  const generatePersonalizedRoadmap = (skillsData: SkillsDnaData[], availableCourses: any[]) => {
    // Находим слабые навыки (прогресс < 50%)
    const weakSkills = skillsData.filter(skill => skill.progress < 50);
    
    // Создаем рекомендованные курсы на основе слабых навыков
    const recommendedCourses: CourseNode[] = [];
    let totalHours = 0;

    // Добавляем курсы для каждого слабого навыка
    weakSkills.forEach(skill => {
      const relatedCourse = availableCourses.find(course => 
        course.title.toLowerCase().includes(skill.name.toLowerCase()) ||
        course.description?.toLowerCase().includes(skill.name.toLowerCase())
      );

      if (relatedCourse && !recommendedCourses.find(c => c.id === relatedCourse.id)) {
        const courseHours = Math.floor(Math.random() * 20) + 15; // 15-35 часов
        totalHours += courseHours;

        recommendedCourses.push({
          id: relatedCourse.id,
          title: relatedCourse.title,
          description: relatedCourse.description || 'Курс для улучшения ваших навыков',
          difficulty: skill.progress < 20 ? 'beginner' : skill.progress < 40 ? 'intermediate' : 'advanced',
          hours: courseHours,
          status: skill.progress < 30 ? 'recommended' : 'available',
          progress: Math.floor(Math.random() * 15) // 0-15% начальный прогресс
        });
      }
    });

    // Если курсов мало, добавляем дополнительные
    if (recommendedCourses.length < 4) {
      const additionalCourses = availableCourses
        .filter(course => !recommendedCourses.find(c => c.id === course.id))
        .slice(0, 4 - recommendedCourses.length);

      additionalCourses.forEach(course => {
        const courseHours = Math.floor(Math.random() * 15) + 10;
        totalHours += courseHours;

        recommendedCourses.push({
          id: course.id,
          title: course.title,
          description: course.description || 'Дополнительный курс для расширения знаний',
          difficulty: 'intermediate',
          hours: courseHours,
          status: 'available',
          progress: 0
        });
      });
    }

    // Создаем ожидаемые улучшения навыков
    const skillImprovements: SkillImprovement[] = weakSkills.map(skill => ({
      skill: skill.name,
      currentProgress: skill.progress,
      expectedProgress: Math.min(skill.progress + 30 + Math.floor(Math.random() * 20), 85),
      reason: `Изучение специализированных курсов поможет улучшить навык`
    }));

    const roadmap: RoadmapPath = {
      totalHours,
      estimatedWeeks: Math.ceil(totalHours / 10), // 10 часов в неделю
      courses: recommendedCourses.slice(0, 5), // Максимум 5 курсов
      skillImprovements
    };

    setRoadmapPath(roadmap);
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
    <div className="w-full">
      {/* Компактная дорожная карта для широкого формата */}
      <Glassmorphism className="rounded-2xl p-6 max-h-80 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Route className="w-6 h-6 text-primary" />
            <div>
              <h3 className="text-white font-orbitron font-bold text-xl">
                Персональная Дорожная Карта
              </h3>
              <p className="text-white/60 text-sm">
                Ваш индивидуальный путь обучения на основе Skills DNA
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {skillsLoading && isSkillsDnaConnected && (
              <div className="flex items-center gap-2 text-primary">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Создание маршрута...</span>
              </div>
            )}
            
            <div className="flex items-center gap-3">
              <span className="text-sm text-white/70">Активировать Skills DNA</span>
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
        </div>

        {/* Дорожная карта */}
        {isSkillsDnaConnected && roadmapPath && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
            {/* Временная шкала */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-orbitron font-bold text-white mb-1">
                    {roadmapPath.estimatedWeeks}
                  </div>
                  <div className="text-sm text-white/60">недель</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-medium text-primary mb-1">
                    {roadmapPath.totalHours}ч
                  </div>
                  <div className="text-sm text-white/60">общее время</div>
                </div>
              </div>
            </div>
            
            {/* Курсы в горизонтальной линии */}
            <div className="lg:col-span-3">
              <div className="relative">
                {/* Соединительная линия */}
                <div className="absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
                
                <div className="flex justify-between items-center relative z-10">
                  {roadmapPath.courses.map((course, index) => {
                    const Icon = getStatusIcon(course.status);
                    return (
                      <motion.div
                        key={course.id}
                        className="flex flex-col items-center group cursor-pointer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                        onMouseEnter={() => setHoveredCourse(course.id)}
                        onMouseLeave={() => setHoveredCourse(null)}
                        onClick={() => setSelectedCourse(course)}
                      >
                        {/* Узел курса */}
                        <div className={`
                          w-16 h-16 rounded-full bg-gradient-to-br ${getStatusColor(course.status)}
                          flex items-center justify-center shadow-lg border-2 border-white/20
                          group-hover:scale-110 transition-all duration-300
                          ${course.status === 'recommended' ? 'animate-pulse' : ''}
                        `}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        
                        {/* Название курса */}
                        <div className="mt-2 text-center">
                          <div className="text-sm font-medium text-white group-hover:text-primary transition-colors">
                            {course.title}
                          </div>
                          <div className="text-xs text-white/60 mt-1">
                            {formatTime(course.hours)} • {course.difficulty}
                          </div>
                        </div>
                        
                        {/* Детальная информация при hover */}
                        {hoveredCourse === course.id && (
                          <motion.div
                            className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 w-64 p-4 bg-space-900/95 backdrop-blur-md rounded-xl border border-primary/30 shadow-2xl"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <h4 className="text-white font-medium mb-2">{course.title}</h4>
                            <p className="text-white/70 text-sm mb-3">{course.description}</p>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-white/60">Длительность:</span>
                                <span className="text-primary">{formatTime(course.hours)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-white/60">Сложность:</span>
                                <span className={getDifficultyColor(course.difficulty)}>
                                  {course.difficulty}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-white/60">Статус:</span>
                                <span className="text-primary capitalize">{course.status}</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Состояние без данных Skills DNA */}
        {isSkillsDnaConnected && !roadmapPath && !skillsLoading && (
          <div className="mt-6 text-center py-8">
            <Brain className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h4 className="text-white font-medium mb-2">Данные Skills DNA не найдены</h4>
            <p className="text-white/60 text-sm">
              Пройдите диагностику Skills DNA для создания персональной дорожной карты
            </p>
          </div>
        )}

        {/* Состояние по умолчанию */}
        {!isSkillsDnaConnected && (
          <div className="mt-6 text-center py-8">
            <Route className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h4 className="text-white font-medium mb-2">Дорожная карта не активна</h4>
            <p className="text-white/60 text-sm">
              Активируйте Skills DNA для создания персонального плана обучения
            </p>
          </div>
        )}
      </Glassmorphism>
    </div>
  );
};
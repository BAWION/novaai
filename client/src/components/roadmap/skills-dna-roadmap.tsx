import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Glassmorphism } from '@/components/ui/glassmorphism';
import { Route, Target, Zap, Lock, CheckCircle, Clock, ArrowRight } from 'lucide-react';

interface SkillProgress {
  id: number;
  name: string;
  description: string;
  category: string;
  currentLevel: string;
  progress: number;
  targetLevel?: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  level: string;
  modules: number;
  estimatedHours: number;
  prerequisites: number[];
  skillsImproved: string[];
}

interface RoadmapNode {
  id: string;
  courseId: number;
  title: string;
  description: string;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  progress: number;
  estimatedHours: number;
  skillsImproved: string[];
  prerequisites: string[];
  position: { x: number; y: number };
  level: number;
}

interface Connection {
  from: string;
  to: string;
  required: boolean;
}

interface SkillsDnaRoadmapProps {
  className?: string;
  onSwitchToTraditional?: () => void;
}

export function SkillsDnaRoadmap({ className = '', onSwitchToTraditional }: SkillsDnaRoadmapProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [roadmapNodes, setRoadmapNodes] = useState<RoadmapNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);

  // Загружаем Skills DNA прогресс
  const { data: skillsProgress, isLoading: skillsLoading } = useQuery({
    queryKey: ['/api/diagnosis/progress'],
    retry: false,
  });

  // Загружаем рекомендованные курсы
  const { data: recommendedCourses, isLoading: coursesLoading } = useQuery({
    queryKey: ['/api/courses/recommended'],
    retry: false,
  });

  // Загружаем все курсы для построения полной дорожной карты
  const { data: allCourses, isLoading: allCoursesLoading } = useQuery({
    queryKey: ['/api/courses'],
  });

  // Построение дорожной карты на основе Skills DNA
  useEffect(() => {
    if (!(skillsProgress as any)?.data || !allCourses || !recommendedCourses) return;

    const skills = (skillsProgress as any)?.data as SkillProgress[];
    const courses = allCourses as Course[];
    const recommended = recommendedCourses as Course[];

    // Анализируем слабые навыки
    const weakSkills = skills
      .filter(skill => skill.progress < 50)
      .sort((a, b) => a.progress - b.progress);

    // Строим узлы дорожной карты
    const nodes: RoadmapNode[] = [];
    const nodeConnections: Connection[] = [];

    // Определяем начальные курсы (рекомендованные)
    const startingCourses = recommended.slice(0, 3);
    
    // Создаем узлы для рекомендованных курсов
    startingCourses.forEach((course, index) => {
      const skillsForCourse = getSkillsForCourse(course.category);
      const courseProgress = getCourseProgress(course.id);
      
      nodes.push({
        id: `course-${course.id}`,
        courseId: course.id,
        title: course.title,
        description: course.description,
        status: determineNodeStatus(course.id, courseProgress),
        progress: courseProgress,
        estimatedHours: course.estimatedHours || 0,
        skillsImproved: skillsForCourse,
        prerequisites: [],
        position: {
          x: 20 + (index * 35), // Горизонтальное размещение
          y: 15 // Первый уровень
        },
        level: 1
      });
    });

    // Добавляем следующий уровень курсов
    const intermediateCourses = courses.filter(course => 
      course.level === 'intermediate' && 
      !startingCourses.find(sc => sc.id === course.id)
    ).slice(0, 4);

    intermediateCourses.forEach((course, index) => {
      const skillsForCourse = getSkillsForCourse(course.category);
      const courseProgress = getCourseProgress(course.id);
      const prerequisites = getPrerequisites(course, nodes);
      
      nodes.push({
        id: `course-${course.id}`,
        courseId: course.id,
        title: course.title,
        description: course.description,
        status: determineNodeStatus(course.id, courseProgress, prerequisites),
        progress: courseProgress,
        estimatedHours: course.estimatedHours || 0,
        skillsImproved: skillsForCourse,
        prerequisites: prerequisites,
        position: {
          x: 10 + (index * 20),
          y: 40 // Второй уровень
        },
        level: 2
      });

      // Создаем связи с предыдущим уровнем
      if (index < startingCourses.length) {
        nodeConnections.push({
          from: `course-${startingCourses[index].id}`,
          to: `course-${course.id}`,
          required: true
        });
      }
    });

    // Добавляем продвинутые курсы
    const advancedCourses = courses.filter(course => 
      course.level === 'advanced' && 
      weakSkills.some(skill => course.category === skill.category)
    ).slice(0, 3);

    advancedCourses.forEach((course, index) => {
      const skillsForCourse = getSkillsForCourse(course.category);
      const courseProgress = getCourseProgress(course.id);
      const prerequisites = getPrerequisites(course, nodes);
      
      nodes.push({
        id: `course-${course.id}`,
        courseId: course.id,
        title: course.title,
        description: course.description,
        status: determineNodeStatus(course.id, courseProgress, prerequisites),
        progress: courseProgress,
        estimatedHours: course.estimatedHours || 0,
        skillsImproved: skillsForCourse,
        prerequisites: prerequisites,
        position: {
          x: 20 + (index * 30),
          y: 65 // Третий уровень
        },
        level: 3
      });

      // Создаем связи с промежуточным уровнем
      const parentIndex = index < intermediateCourses.length ? index : 0;
      if (intermediateCourses[parentIndex]) {
        nodeConnections.push({
          from: `course-${intermediateCourses[parentIndex].id}`,
          to: `course-${course.id}`,
          required: true
        });
      }
    });

    setRoadmapNodes(nodes);
    setConnections(nodeConnections);

    // Автоматически выбираем первый доступный узел
    const firstAvailable = nodes.find(node => node.status === 'available' || node.status === 'in-progress');
    if (firstAvailable) {
      setSelectedNode(firstAvailable.id);
    }
  }, [skillsProgress, allCourses, recommendedCourses]);

  // Вспомогательные функции
  function getSkillsForCourse(category: string): string[] {
    const skillMapping: Record<string, string[]> = {
      'ai': ['Машинное обучение', 'ИИ этика', 'Языковые технологии'],
      'programming': ['Python программирование', 'Структуры данных'],
      'ml': ['Машинное обучение', 'Математические основы'],
      'automation': ['Автоматизация процессов', 'No-Code платформы'],
      'data': ['Анализ данных', 'Python программирование']
    };
    return skillMapping[category] || [];
  }

  function getCourseProgress(courseId: number): number {
    // В реальной системе здесь был бы запрос к API прогресса курсов
    return Math.floor(Math.random() * 100);
  }

  function determineNodeStatus(courseId: number, progress: number, prerequisites: string[] = []): 'locked' | 'available' | 'in-progress' | 'completed' {
    if (progress >= 100) return 'completed';
    if (progress > 0) return 'in-progress';
    
    // Проверяем выполнение предварительных условий
    const allPrereqsCompleted = prerequisites.every(prereqId => {
      const prereqNode = roadmapNodes.find(node => node.id === prereqId);
      return prereqNode?.status === 'completed';
    });

    return allPrereqsCompleted ? 'available' : 'locked';
  }

  function getPrerequisites(course: Course, existingNodes: RoadmapNode[]): string[] {
    return course.prerequisites?.map(prereqId => `course-${prereqId}`) || [];
  }

  function getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'bg-gradient-to-br from-green-500 to-emerald-600';
      case 'in-progress': return 'bg-gradient-to-br from-blue-500 to-cyan-600';
      case 'available': return 'bg-gradient-to-br from-amber-500 to-orange-600';
      case 'locked': return 'bg-gradient-to-br from-gray-500 to-gray-600';
      default: return 'bg-gradient-to-br from-gray-500 to-gray-600';
    }
  }

  function getStatusIcon(status: string): React.ReactNode {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Zap className="w-4 h-4" />;
      case 'available': return <Target className="w-4 h-4" />;
      case 'locked': return <Lock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  }

  function getConnectionPath(from: RoadmapNode, to: RoadmapNode): string {
    const startX = from.position.x + 3; // Центр узла
    const startY = from.position.y + 6; // Низ узла
    const endX = to.position.x + 3; // Центр узла
    const endY = to.position.y; // Верх узла
    
    const midY = startY + (endY - startY) / 2;
    
    return `M ${startX} ${startY} Q ${startX} ${midY} ${endX} ${endY}`;
  }

  if (skillsLoading || coursesLoading || allCoursesLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Glassmorphism className="rounded-xl p-6">
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-white/70">Построение персональной дорожной карты...</span>
          </div>
        </Glassmorphism>
      </div>
    );
  }

  // Демо-режим для неавторизованных пользователей
  if (!skillsProgress || !(skillsProgress as any)?.data) {
    return (
      <div className={`space-y-6 ${className}`}>
        <Glassmorphism className="rounded-xl p-6">
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] rounded-full flex items-center justify-center">
              <i className="fas fa-dna text-2xl text-white"></i>
            </div>
            <h3 className="text-xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#B28DFF] via-[#8BE0F7] to-[#B28DFF]">
              Персональная дорожная карта Skills DNA
            </h3>
            <p className="text-white/70 mb-6 max-w-md mx-auto">
              Пройдите диагностику Skills DNA, чтобы получить персональную дорожную карту обучения, 
              адаптированную под ваши слабые места и цели
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/diagnosis">
                <button className="px-6 py-3 bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] text-white rounded-lg hover:scale-105 transition-all">
                  <i className="fas fa-brain mr-2"></i>
                  Пройти диагностику
                </button>
              </Link>
              {onSwitchToTraditional && (
                <button 
                  onClick={onSwitchToTraditional}
                  className="px-6 py-3 bg-space-800 text-white rounded-lg hover:bg-space-700 transition-all"
                >
                  <i className="fas fa-route mr-2"></i>
                  Стандартная карта
                </button>
              )}
            </div>
          </div>
        </Glassmorphism>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Заголовок с анализом Skills DNA */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white font-orbitron">Персональная дорожная карта</h2>
          <p className="text-white/70 mt-1">Построена на основе вашего Skills DNA профиля</p>
        </div>
        <div className="flex items-center gap-2 text-primary">
          <Route className="w-5 h-5" />
          <span className="text-sm font-medium">{roadmapNodes.length} курсов в маршруте</span>
        </div>
      </div>

      {/* Статистика и прогресс */}
      {(skillsProgress as any)?.data && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Glassmorphism className="p-4 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {roadmapNodes.filter(n => n.status === 'completed').length}
              </div>
              <div className="text-sm text-white/70">Завершено</div>
            </div>
          </Glassmorphism>
          <Glassmorphism className="p-4 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {roadmapNodes.filter(n => n.status === 'in-progress').length}
              </div>
              <div className="text-sm text-white/70">В процессе</div>
            </div>
          </Glassmorphism>
          <Glassmorphism className="p-4 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-400">
                {roadmapNodes.filter(n => n.status === 'available').length}
              </div>
              <div className="text-sm text-white/70">Доступно</div>
            </div>
          </Glassmorphism>
          <Glassmorphism className="p-4 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {roadmapNodes.reduce((sum, node) => sum + node.estimatedHours, 0)}ч
              </div>
              <div className="text-sm text-white/70">Общее время</div>
            </div>
          </Glassmorphism>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Визуализация дорожной карты */}
        <div className="w-full lg:w-8/12">
          <Glassmorphism className="rounded-xl p-6 min-h-[500px]">
            <div className="overflow-auto">
              <div className="relative w-full min-w-[800px] h-[600px]">
                {/* SVG для связей между узлами */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                  {connections.map((connection, index) => {
                    const fromNode = roadmapNodes.find(n => n.id === connection.from);
                    const toNode = roadmapNodes.find(n => n.id === connection.to);
                    
                    if (!fromNode || !toNode) return null;
                    
                    return (
                      <motion.path
                        key={index}
                        d={getConnectionPath(fromNode, toNode)}
                        stroke={connection.required ? "url(#gradient)" : "#6B7280"}
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray={connection.required ? "0" : "5,5"}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.8 }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                      />
                    );
                  })}
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366F1" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Узлы курсов */}
                {roadmapNodes.map((node, index) => (
                  <motion.div
                    key={node.id}
                    className="absolute cursor-pointer"
                    style={{
                      left: `${node.position.x}%`,
                      top: `${node.position.y}%`,
                      zIndex: selectedNode === node.id ? 20 : 10
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedNode(node.id)}
                  >
                    <div className={`relative ${selectedNode === node.id ? 'scale-110' : ''} transition-transform duration-200`}>
                      {/* Узел курса */}
                      <div className={`w-16 h-16 rounded-full ${getStatusColor(node.status)} flex items-center justify-center text-white shadow-xl border-2 border-white/20`}>
                        {getStatusIcon(node.status)}
                      </div>
                      
                      {/* Название курса */}
                      <div className="mt-2 text-center max-w-24">
                        <p className="font-medium text-xs text-white/90 leading-tight">
                          {node.title.length > 20 ? node.title.substring(0, 20) + '...' : node.title}
                        </p>
                        
                        {/* Прогресс-бар */}
                        {node.progress > 0 && (
                          <div className="w-16 h-1 bg-white/20 rounded-full mt-1">
                            <div 
                              className={`h-full rounded-full ${
                                node.status === 'completed' ? 'bg-green-400' :
                                node.status === 'in-progress' ? 'bg-blue-400' : 'bg-amber-400'
                              }`}
                              style={{ width: `${node.progress}%` }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Индикатор улучшаемых навыков */}
                      {node.skillsImproved.length > 0 && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-white">
                          {node.skillsImproved.length}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Индикатор уровней */}
                <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-around text-white/50 text-sm">
                  <div>Базовый</div>
                  <div>Средний</div>
                  <div>Продвинутый</div>
                </div>
              </div>
            </div>
          </Glassmorphism>
        </div>

        {/* Детали выбранного курса */}
        <div className="w-full lg:w-4/12">
          <Glassmorphism className="rounded-xl p-6 sticky top-6">
            <AnimatePresence mode="wait">
              {selectedNode && roadmapNodes.find(n => n.id === selectedNode) ? (
                <motion.div
                  key={selectedNode}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {(() => {
                    const node = roadmapNodes.find(n => n.id === selectedNode)!;
                    return (
                      <div>
                        <div className="flex items-center mb-4">
                          <div className={`w-12 h-12 rounded-full ${getStatusColor(node.status)} flex items-center justify-center text-white shadow-lg mr-4`}>
                            {getStatusIcon(node.status)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white text-lg leading-tight">{node.title}</h3>
                            <p className="text-white/60 text-sm">
                              {node.status === 'completed' && 'Завершено'}
                              {node.status === 'in-progress' && 'В процессе'}
                              {node.status === 'available' && 'Доступно к изучению'}
                              {node.status === 'locked' && 'Требует выполнения условий'}
                            </p>
                          </div>
                        </div>

                        {/* Прогресс */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-white/80">Прогресс</span>
                            <span className="text-white/80">{node.progress}%</span>
                          </div>
                          <div className="w-full h-2 bg-white/10 rounded-full">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                node.status === 'completed' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                                node.status === 'in-progress' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                                'bg-gradient-to-r from-amber-500 to-orange-500'
                              }`}
                              style={{ width: `${node.progress}%` }}
                            />
                          </div>
                        </div>

                        <p className="text-white/70 text-sm mb-4">{node.description}</p>

                        {/* Улучшаемые навыки */}
                        {node.skillsImproved.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-white/80 text-sm font-medium mb-2">Улучшаемые навыки:</h4>
                            <div className="flex flex-wrap gap-2">
                              {node.skillsImproved.map((skill, index) => (
                                <span key={index} className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Время изучения */}
                        <div className="mb-6 flex items-center gap-2 text-white/60 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>Примерное время: {node.estimatedHours}ч</span>
                        </div>

                        {/* Кнопки действий */}
                        {node.status === 'available' && (
                          <button 
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2"
                          >
                            <Target className="w-4 h-4" />
                            Начать курс
                          </button>
                        )}

                        {node.status === 'in-progress' && (
                          <button 
                            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
                          >
                            <ArrowRight className="w-4 h-4" />
                            Продолжить
                          </button>
                        )}

                        {node.status === 'completed' && (
                          <button 
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Повторить
                          </button>
                        )}

                        {node.status === 'locked' && (
                          <div className="w-full bg-gray-600 text-white/60 py-3 px-4 rounded-lg font-medium text-center flex items-center justify-center gap-2">
                            <Lock className="w-4 h-4" />
                            Завершите предыдущие курсы
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-white/60 py-12"
                >
                  <Route className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Выберите курс на дорожной карте для просмотра деталей</p>
                </motion.div>
              )}
            </AnimatePresence>
          </Glassmorphism>
        </div>
      </div>
    </div>
  );
}
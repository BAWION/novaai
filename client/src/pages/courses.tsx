import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { motion } from "framer-motion";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import { CourseGrid } from "@/components/courses/course-grid";
import { CourseCard } from "@/components/courses/course-card";

// Define course types and data
interface Course {
  id: number;
  slug: string;
  title: string;
  description: string;
  icon: string;
  modules: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string[];
  instructor: string;
  duration: string;
  rating: number;
  enrolled: number;
  progress?: number;
  updated: string;
  color: 'primary' | 'secondary' | 'accent';
  difficulty?: number;
  access?: string;
  estimatedDuration?: number;
}

const SAMPLE_COURSES: Course[] = [
  {
    id: 0, // Специальный ID для нашего AI-курса (ставим первым в списке)
    slug: "python-for-ai-beginners",
    title: "Python для начинающих в AI",
    description: "Курс знакомит с основами программирования на Python, библиотеками для анализа данных и простыми алгоритмами машинного обучения. Этот курс разработан специально для новичков без опыта программирования.",
    icon: "graduation-cap", // Используем иконку, которая точно существует
    modules: 3,
    level: "beginner",
    category: ["programming", "ai", "python"],
    instructor: "NOVA AI Ассистент",
    duration: "20 часов",
    rating: 4.9,
    enrolled: 1852,
    updated: "2025-04-22",
    color: "primary",
    difficulty: 1,
    access: "free",
    estimatedDuration: 1200
  },
  {
    id: 1,
    slug: "python-for-data-science",
    title: "Python для Data Science",
    description: "Основы Python и его применение для анализа данных, работы с библиотеками NumPy, Pandas и визуализации.",
    icon: "python",
    modules: 12,
    level: "beginner",
    category: ["programming", "data-science"],
    instructor: "Алексей Иванов",
    duration: "24 часа",
    rating: 4.8,
    enrolled: 1245,
    progress: 45,
    updated: "2025-03-15",
    color: "primary",
    difficulty: 2,
    access: "free",
    estimatedDuration: 1440
  },
  {
    id: 2,
    slug: "machine-learning-basics",
    title: "Машинное обучение: основы",
    description: "Фундаментальные концепции и алгоритмы машинного обучения, от линейной регрессии до случайных лесов.",
    icon: "brain",
    modules: 15,
    level: "intermediate",
    category: ["machine-learning", "algorithms"],
    instructor: "Мария Петрова",
    duration: "32 часа",
    rating: 4.9,
    enrolled: 980,
    progress: 15,
    updated: "2025-04-02",
    color: "secondary",
    difficulty: 3,
    access: "free",
    estimatedDuration: 1920
  },
  {
    id: 3,
    slug: "deep-learning-pytorch",
    title: "Глубокое обучение с PyTorch",
    description: "Нейронные сети, архитектуры и обучение глубоких моделей с использованием фреймворка PyTorch.",
    icon: "network-wired",
    modules: 18,
    level: "advanced",
    category: ["deep-learning", "frameworks"],
    instructor: "Сергей Смирнов",
    duration: "40 часов",
    rating: 4.7,
    enrolled: 750,
    updated: "2025-04-10",
    color: "accent",
    difficulty: 4,
    access: "pro",
    estimatedDuration: 2400
  },
  {
    id: 4,
    slug: "mathematics-for-ml",
    title: "Математика для ML",
    description: "Основы линейной алгебры, дифференциального исчисления и статистики, необходимые для понимания ML алгоритмов.",
    icon: "calculator",
    modules: 16,
    level: "intermediate",
    category: ["mathematics", "theory"],
    instructor: "Екатерина Белова",
    duration: "30 часов",
    rating: 4.6,
    enrolled: 1100,
    updated: "2025-04-05",
    color: "primary",
    difficulty: 3,
    access: "free",
    estimatedDuration: 1800
  },
  {
    id: 5,
    slug: "computer-vision",
    title: "Computer Vision",
    description: "Алгоритмы и методы компьютерного зрения, от классических методов до глубоких сверточных сетей.",
    icon: "eye",
    modules: 14,
    level: "advanced",
    category: ["computer-vision", "deep-learning"],
    instructor: "Антон Черных",
    duration: "36 часов",
    rating: 4.9,
    enrolled: 620,
    updated: "2025-04-15",
    color: "secondary",
    difficulty: 4,
    access: "pro",
    estimatedDuration: 2160
  },
  {
    id: 6,
    slug: "nlp-text-processing",
    title: "NLP и обработка текстов",
    description: "Методы обработки естественного языка, от классических подходов до трансформеров и BERT.",
    icon: "comments",
    modules: 12,
    level: "advanced",
    category: ["nlp", "transformers"],
    instructor: "Ольга Соколова",
    duration: "30 часов",
    rating: 4.8,
    enrolled: 580,
    updated: "2025-04-20",
    color: "accent",
    difficulty: 5,
    access: "premium",
    estimatedDuration: 1800
  }
];

// Helper components
const LevelBadge = ({ level }: { level: string }) => {
  const getColor = () => {
    switch (level) {
      case 'beginner':
        return 'bg-green-500/20 text-green-400';
      case 'intermediate':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'advanced':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-white/10 text-white/70';
    }
  };

  const getLabel = () => {
    switch (level) {
      case 'beginner':
        return 'Начальный';
      case 'intermediate':
        return 'Средний';
      case 'advanced':
        return 'Продвинутый';
      default:
        return level;
    }
  };

  return (
    <span className={`px-2 py-1 text-xs rounded-full ${getColor()}`}>
      {getLabel()}
    </span>
  );
};

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [, setLocation] = useLocation();

  // Filter courses based on search and filters
  const filteredCourses = SAMPLE_COURSES.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory ? course.category.includes(selectedCategory) : true;
    
    const matchesLevel = selectedLevel ? course.level === selectedLevel : true;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  // All unique categories
  const categories = Array.from(
    new Set(SAMPLE_COURSES.flatMap(course => course.category))
  );

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Подготовленные курсы для CourseGrid
  const gridCourses = filteredCourses.map(course => ({
    id: course.id,
    slug: course.slug,
    title: course.title,
    description: course.description,
    icon: course.icon,
    modules: course.modules,
    level: course.level,
    color: course.color,
    difficulty: course.difficulty || 1,
    access: course.access || "free",
    estimatedDuration: course.estimatedDuration,
    progress: course.progress
  }));

  // Обработчик клика по карточке курса
  const handleCourseSelect = (course: {id: number}) => {
    const selectedCourse = SAMPLE_COURSES.find(c => c.id === course.id);
    if (selectedCourse) {
      setSelectedCourse(selectedCourse);
    }
  };
  
  // Обработчик изменения фильтров
  const handleFilterChange = (filters: { level: string; access: string; search: string }) => {
    setSearchTerm(filters.search);
    setSelectedLevel(filters.level ? filters.level : null);
    // setSelectedAccess если бы он был реализован
  };

  return (
    <DashboardLayout 
      title="Каталог курсов" 
      subtitle="Исследуйте нашу библиотеку курсов по AI и Data Science"
    >
      {selectedCourse ? (
        <div className="space-y-6">
          {/* Кнопка "Назад к каталогу" */}
          <button 
            onClick={() => setSelectedCourse(null)}
            className="flex items-center text-white/70 hover:text-white transition-colors mb-4"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Назад к каталогу
          </button>
          
          {/* Course Details */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full lg:w-2/3"
            >
              <Glassmorphism className="p-6 rounded-xl">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${
                      selectedCourse.color === 'primary' ? 'from-[#6E3AFF] to-[#9E6AFF]' :
                      selectedCourse.color === 'secondary' ? 'from-[#2EBAE1] to-[#5ED1F9]' :
                      'from-[#FF3A8C] to-[#FF6AB5]'
                    } flex items-center justify-center text-white`}>
                      <i className={`fas fa-${selectedCourse.icon} text-2xl`}></i>
                    </div>
                    <div>
                      <h2 className="font-orbitron text-2xl font-bold">
                        {selectedCourse.title}
                      </h2>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <LevelBadge level={selectedCourse.level} />
                        {selectedCourse.category.map(cat => (
                          <span key={cat} className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedCourse(null)}
                    className="text-white/50 hover:text-white"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                
                <div className="mt-6">
                  <div className="flex flex-wrap gap-6 text-sm">
                    <div>
                      <div className="text-white/50">Инструктор</div>
                      <div className="flex items-center mt-1">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-2">
                          <i className="fas fa-user text-xs"></i>
                        </div>
                        {selectedCourse.instructor}
                      </div>
                    </div>
                    <div>
                      <div className="text-white/50">Продолжительность</div>
                      <div className="flex items-center mt-1">
                        <i className="far fa-clock mr-2"></i>
                        {selectedCourse.duration}
                      </div>
                    </div>
                    <div>
                      <div className="text-white/50">Модули</div>
                      <div className="flex items-center mt-1">
                        <i className="fas fa-book mr-2"></i>
                        {selectedCourse.modules} модулей
                      </div>
                    </div>
                    <div>
                      <div className="text-white/50">Рейтинг</div>
                      <div className="flex items-center mt-1">
                        <i className="fas fa-star text-yellow-400 mr-2"></i>
                        {selectedCourse.rating.toFixed(1)} ({selectedCourse.enrolled} студентов)
                      </div>
                    </div>
                    <div>
                      <div className="text-white/50">Обновлено</div>
                      <div className="flex items-center mt-1">
                        <i className="fas fa-calendar-alt mr-2"></i>
                        {formatDate(selectedCourse.updated)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="font-medium text-lg mb-3">О курсе</h3>
                    <p className="text-white/70 leading-relaxed">
                      {selectedCourse.description}
                      {/* More detailed description would go here */}
                      <br /><br />
                      Этот курс предназначен для тех, кто хочет получить глубокое понимание предмета и приобрести практические навыки. Вы изучите теоретические концепции и применение их на практике через интерактивные LabHub задания и проекты. По окончании курса вы сможете уверенно применять полученные знания в реальных проектах.
                    </p>
                    
                    <h3 className="font-medium text-lg mt-6 mb-3">Чему вы научитесь</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-start">
                        <div className="text-green-400 mr-2 mt-1"><i className="fas fa-check-circle"></i></div>
                        <div>Понимать фундаментальные концепции и принципы</div>
                      </div>
                      <div className="flex items-start">
                        <div className="text-green-400 mr-2 mt-1"><i className="fas fa-check-circle"></i></div>
                        <div>Работать с современными инструментами и библиотеками</div>
                      </div>
                      <div className="flex items-start">
                        <div className="text-green-400 mr-2 mt-1"><i className="fas fa-check-circle"></i></div>
                        <div>Создавать и оптимизировать собственные модели</div>
                      </div>
                      <div className="flex items-start">
                        <div className="text-green-400 mr-2 mt-1"><i className="fas fa-check-circle"></i></div>
                        <div>Решать практические задачи из реальных проектов</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link 
                      to={selectedCourse.id === 0 ? "/course-ai/python-for-ai-beginners" : "#"}
                      className="bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] hover:from-[#4922B2] hover:to-[#1682A1] text-white py-3 px-6 rounded-lg font-medium transition duration-300 flex items-center"
                    >
                      <i className="fas fa-play-circle mr-2"></i>
                      {selectedCourse.progress ? 'Продолжить обучение' : 'Начать обучение'}
                    </Link>
                    <button className="border border-white/20 hover:bg-white/10 text-white py-3 px-6 rounded-lg font-medium transition duration-300 flex items-center">
                      <i className="far fa-bookmark mr-2"></i>
                      Добавить в избранное
                    </button>
                  </div>
                </div>
              </Glassmorphism>
            </motion.div>
            
            {/* Sidebar Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full lg:w-1/3 space-y-4"
            >
              {/* Course Curriculum */}
              <Glassmorphism className="p-5 rounded-xl">
                <h3 className="font-medium mb-4">Учебный план</h3>
                <div className="space-y-3">
                  <div className="bg-space-800/80 hover:bg-space-700/80 rounded-lg p-3 cursor-pointer transition-all">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">1. Введение</h4>
                      <span className="text-xs text-white/50">3 урока</span>
                    </div>
                    <p className="text-white/60 text-sm mt-1">Обзор курса и базовые концепции</p>
                  </div>
                  <div className="bg-space-800/80 hover:bg-space-700/80 rounded-lg p-3 cursor-pointer transition-all">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">2. Основы</h4>
                      <span className="text-xs text-white/50">5 уроков</span>
                    </div>
                    <p className="text-white/60 text-sm mt-1">Фундаментальные концепции и принципы</p>
                  </div>
                  <div className="bg-space-800/80 hover:bg-space-700/80 rounded-lg p-3 cursor-pointer transition-all">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">3. Продвинутые техники</h4>
                      <span className="text-xs text-white/50">4 урока</span>
                    </div>
                    <p className="text-white/60 text-sm mt-1">Углубленное изучение сложных тем</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex justify-between text-sm">
                    <span>Всего</span>
                    <span>{selectedCourse.modules} модулей • 12 уроков</span>
                  </div>
                </div>
              </Glassmorphism>
              
              {/* Stats */}
              <Glassmorphism className="p-5 rounded-xl">
                <h3 className="font-medium mb-4">Статистика</h3>
                
                {selectedCourse.progress !== undefined && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Прогресс</span>
                      <span>{selectedCourse.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full">
                      <div 
                        className={`h-full rounded-full bg-gradient-to-r ${
                          selectedCourse.color === 'primary' ? 'from-[#6E3AFF] to-[#9E6AFF]' :
                          selectedCourse.color === 'secondary' ? 'from-[#2EBAE1] to-[#5ED1F9]' :
                          'from-[#FF3A8C] to-[#FF6AB5]'
                        }`}
                        style={{ width: `${selectedCourse.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-space-800/80 rounded-lg p-3">
                    <div className="text-xs text-white/50 mb-1">Завершили</div>
                    <div className="font-medium">{Math.round(selectedCourse.enrolled * 0.62)}</div>
                  </div>
                  <div className="bg-space-800/80 rounded-lg p-3">
                    <div className="text-xs text-white/50 mb-1">Уровень</div>
                    <div className="font-medium capitalize">
                      {selectedCourse.level === 'beginner' ? 'Начальный' :
                        selectedCourse.level === 'intermediate' ? 'Средний' :
                        'Продвинутый'}
                    </div>
                  </div>
                  <div className="bg-space-800/80 rounded-lg p-3">
                    <div className="text-xs text-white/50 mb-1">Доступ</div>
                    <div className="font-medium">
                      {selectedCourse.access === 'free' ? 'Бесплатный' :
                        selectedCourse.access === 'pro' ? 'Pro' :
                        'Premium'}
                    </div>
                  </div>
                  <div className="bg-space-800/80 rounded-lg p-3">
                    <div className="text-xs text-white/50 mb-1">Оценки</div>
                    <div className="font-medium flex items-center">
                      <i className="fas fa-star text-yellow-400 mr-1 text-xs"></i>
                      <span>{selectedCourse.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </Glassmorphism>
            </motion.div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <CourseGrid 
            courses={gridCourses}
            loading={false}
            emptyMessage="Курсы не найдены. Попробуйте изменить параметры поиска."
            variant="default"
            columns={3}
            showFilters={true}
            className="mb-8"
            onCourseSelect={handleCourseSelect}
            filterInitialState={{
              level: selectedLevel || "",
              access: "",
              search: searchTerm
            }}
            onFilterChange={handleFilterChange}
          />
        </div>
      )}
    </DashboardLayout>
  );
}
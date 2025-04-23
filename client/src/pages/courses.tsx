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

  return (
    <DashboardLayout 
      title="Каталог курсов" 
      subtitle="Исследуйте нашу библиотеку курсов по AI и Data Science"
    >
      {selectedCourse ? (
        <div className="space-y-6">
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
                    <p className="text-white/60 text-sm mt-1">Углубленное изучение методов и алгоритмов</p>
                  </div>
                  
                  <div className="text-center pt-2">
                    <button className="text-[#B28DFF] hover:text-[#D2B8FF] text-sm">
                      Показать все модули ({selectedCourse.modules})
                    </button>
                  </div>
                </div>
              </Glassmorphism>
              
              {/* Requirements */}
              <Glassmorphism className="p-5 rounded-xl">
                <h3 className="font-medium mb-4">Требования</h3>
                <ul className="space-y-2 pl-5 list-disc text-white/70 text-sm">
                  <li>Базовые знания программирования</li>
                  <li>Основы математики и статистики</li>
                  <li>Python (начальный уровень)</li>
                </ul>
              </Glassmorphism>
              
              {/* Resources */}
              <Glassmorphism className="p-5 rounded-xl">
                <h3 className="font-medium mb-4">Ресурсы</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <i className="fas fa-file-pdf text-red-400 mr-3 text-lg"></i>
                    <span>Конспекты лекций (PDF)</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <i className="fas fa-code text-green-400 mr-3 text-lg"></i>
                    <span>Исходный код примеров</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <i className="fas fa-file-csv text-blue-400 mr-3 text-lg"></i>
                    <span>Наборы данных</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <i className="fas fa-video text-purple-400 mr-3 text-lg"></i>
                    <span>Видео-материалы</span>
                  </div>
                </div>
              </Glassmorphism>
            </motion.div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Search and filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2 lg:w-2/3">
              <div className="relative">
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50"></i>
                <Input 
                  className="bg-space-800/50 border-white/10 pl-10 pr-4 py-3 w-full rounded-lg"
                  placeholder="Поиск курсов..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 lg:w-1/3 flex gap-2">
              <select 
                className="w-1/2 mr-2 bg-space-800/50 border border-white/10 px-4 py-3 rounded-lg text-white appearance-none focus:outline-none focus:ring-1 focus:ring-primary relative"
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                style={{ 
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgba(255, 255, 255, 0.5)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '1rem',
                  color: 'white'
                }}
              >
                <option value="" style={{backgroundColor: '#1a1a2e', color: 'white'}}>Все категории</option>
                {categories.map(category => (
                  <option key={category} value={category} style={{backgroundColor: '#1a1a2e', color: 'white'}}>{category}</option>
                ))}
              </select>
              
              <select 
                className="w-1/2 bg-space-800/50 border border-white/10 px-4 py-3 rounded-lg text-white appearance-none focus:outline-none focus:ring-1 focus:ring-primary"
                value={selectedLevel || ''}
                onChange={(e) => setSelectedLevel(e.target.value || null)}
                style={{ 
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgba(255, 255, 255, 0.5)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '1rem',
                  color: 'white'
                }}
              >
                <option value="" style={{backgroundColor: '#1a1a2e', color: 'white'}}>Все уровни</option>
                <option value="beginner" style={{backgroundColor: '#1a1a2e', color: 'white'}}>Начальный</option>
                <option value="intermediate" style={{backgroundColor: '#1a1a2e', color: 'white'}}>Средний</option>
                <option value="advanced" style={{backgroundColor: '#1a1a2e', color: 'white'}}>Продвинутый</option>
              </select>
            </div>
          </div>
          
          {/* Course grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: course.id * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="h-full"
              >
                <Glassmorphism className="p-0 rounded-xl overflow-hidden h-full flex flex-col">
                  <div className={`bg-gradient-to-r ${
                    course.color === 'primary' ? 'from-[#6E3AFF]/30 to-[#9E6AFF]/10' :
                    course.color === 'secondary' ? 'from-[#2EBAE1]/30 to-[#5ED1F9]/10' :
                    'from-[#FF3A8C]/30 to-[#FF6AB5]/10'
                  } p-5`}>
                    <div className="flex justify-between items-start">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${
                        course.color === 'primary' ? 'from-[#6E3AFF] to-[#9E6AFF]' :
                        course.color === 'secondary' ? 'from-[#2EBAE1] to-[#5ED1F9]' :
                        'from-[#FF3A8C] to-[#FF6AB5]'
                      } flex items-center justify-center text-white`}>
                        <i className={`fas fa-${course.icon} text-lg`}></i>
                      </div>
                      <LevelBadge level={course.level} />
                    </div>
                    <h3 className="font-semibold text-lg mt-4">{course.title}</h3>
                    <div className="flex items-center mt-2 text-sm">
                      <i className="fas fa-user-tie mr-1 text-white/50"></i>
                      <span className="text-white/70">{course.instructor}</span>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <p className="text-white/70 text-sm line-clamp-2 mb-4 flex-grow">
                      {course.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-white/60">
                      <div className="flex items-center">
                        <i className="far fa-clock mr-1"></i>
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-book mr-1"></i>
                        <span>{course.modules} модулей</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-users mr-1"></i>
                        <span>{course.enrolled} студентов</span>
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-star text-yellow-400 mr-1"></i>
                        <span>{course.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    
                    {course.progress !== undefined && (
                      <div className="w-full h-1.5 bg-white/10 rounded-full mb-4">
                        <div 
                          className={`h-full rounded-full bg-gradient-to-r ${
                            course.color === 'primary' ? 'from-[#6E3AFF] to-[#9E6AFF]' :
                            course.color === 'secondary' ? 'from-[#2EBAE1] to-[#5ED1F9]' :
                            'from-[#FF3A8C] to-[#FF6AB5]'
                          }`}
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    )}
                    
                    <button 
                      onClick={() => setSelectedCourse(course)}
                      className="w-full bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition duration-300"
                    >
                      {course.progress ? 'Продолжить' : 'Подробнее'}
                    </button>
                  </div>
                </Glassmorphism>
              </motion.div>
            ))}
          </div>
          
          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-20">
                <i className="fas fa-search"></i>
              </div>
              <h3 className="text-xl font-semibold mb-2">Курсы не найдены</h3>
              <p className="text-white/60">
                Попробуйте изменить параметры поиска или фильтры
              </p>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
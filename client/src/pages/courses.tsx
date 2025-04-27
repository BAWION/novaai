import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { motion } from "framer-motion";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { ethicsCourse, lawCourse } from "@/data";
import { useQuery } from "@tanstack/react-query";

// Define course types and data
interface Course {
  id: number | string;
  title: string;
  description: string;
  icon: string;
  modules: number;
  level?: 'beginner' | 'intermediate' | 'advanced';
  category: string[] | string;
  instructor?: string;
  duration?: string;
  rating?: number;
  enrolled: number;
  progress?: number;
  updated: string;
  color: 'primary' | 'secondary' | 'accent';
  skillMatch?: {
    percentage: number;
    label: string;
    isRecommended?: boolean;
  };
}

const SAMPLE_COURSES: Course[] = [
  {
    id: 0, // Специальный ID для нашего AI-курса (ставим первым в списке)
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
    skillMatch: {
      percentage: 95,
      label: "Идеально подходит",
      isRecommended: true
    }
  },
  {
    id: 1,
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
    skillMatch: {
      percentage: 85,
      label: "Хорошо подходит",
      isRecommended: true
    }
  },
  {
    id: 2,
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
    skillMatch: {
      percentage: 70,
      label: "Средний уровень соответствия"
    }
  },
  {
    id: 3,
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
    color: "accent"
  },
  {
    id: 4,
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
    color: "primary"
  },
  {
    id: 5,
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
    color: "secondary"
  },
  {
    id: 6,
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
    skillMatch: {
      percentage: 30,
      label: "Требуются дополнительные навыки"
    }
  },
  {
    id: 7,
    title: "AI Ethics & Safety 101",
    description: "Этика и безопасность в сфере искусственного интеллекта. Курс охватывает ключевые принципы этичного использования ИИ, проблемы предвзятости, прозрачности и социального воздействия технологий.",
    icon: "balance-scale",
    modules: 6,
    level: "beginner",
    category: ["ethics", "ai"],
    instructor: "Ирина Соколова",
    duration: "8 часов",
    rating: 4.8,
    enrolled: 625,
    updated: "2025-04-24",
    color: "primary",
    skillMatch: {
      percentage: 90,
      label: "Рекомендуется всем",
      isRecommended: true
    }
  },
  {
    id: 8,
    title: "Legal Frameworks for AI",
    description: "Правовые основы ИИ в России и ЕС. Курс рассматривает нормативные требования, вопросы GDPR, ответственности разработчиков и правовые риски при внедрении AI-решений.",
    icon: "gavel",
    modules: 5,
    level: "intermediate",
    category: ["law", "ai"],
    instructor: "Антон Кравченко",
    duration: "7 часов",
    rating: 4.7,
    enrolled: 412,
    updated: "2025-04-24",
    color: "secondary",
    skillMatch: {
      percentage: 75,
      label: "Для бизнеса и разработчиков"
    }
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

// Компонент индикатора соответствия навыкам
const SkillMatchBadge = ({ skillMatch }: { skillMatch?: Course['skillMatch'] }) => {
  if (!skillMatch) return null;
  
  const getColor = () => {
    const percentage = skillMatch.percentage;
    if (percentage >= 85) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (percentage >= 70) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    if (percentage >= 50) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  return (
    <div className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border ${getColor()} text-xs`}>
      <div className="flex items-center">
        <i className="fas fa-brain mr-1"></i>
        <span>{skillMatch.percentage}%</span>
      </div>
      <span className="max-w-[120px] line-clamp-1">{skillMatch.label}</span>
      {skillMatch.isRecommended && (
        <i className="fas fa-check-circle text-emerald-400"></i>
      )}
    </div>
  );
};

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Получаем данные курсов из API
  const { data: apiCourses, isLoading } = useQuery({ 
    queryKey: ['/api/courses'],
    staleTime: 5 * 60 * 1000, // 5 минут кэширования
  });

  // Преобразуем курсы из API в формат для UI
  const apiCoursesFormatted = React.useMemo(() => {
    if (!apiCourses || !Array.isArray(apiCourses)) return [];
    
    return apiCourses.map((course: any): Course => ({
      id: course.id,
      title: course.title,
      description: course.description || "Нет описания",
      icon: course.icon || "book",
      modules: course.modules || 0,
      level: course.level || "beginner",
      category: course.category || "other",
      enrolled: Math.floor(Math.random() * 1000) + 100, // Добавляем метаданные для отображения
      updated: course.updatedAt ? new Date(course.updatedAt).toISOString().split('T')[0] : "2025-04-27",
      color: course.color || "primary",
      skillMatch: {
        percentage: 0,
        label: "Пройдите диагностику для рекомендаций",
        isRecommended: false
      }
    }));
  }, [apiCourses]);

  // Добавление курсов из новых категорий
  const ethicsCourseFormatted: Course = {
    id: ethicsCourse.id,
    title: ethicsCourse.title,
    description: ethicsCourse.description,
    icon: ethicsCourse.icon,
    modules: ethicsCourse.modulesCount,
    level: 'beginner',
    category: ['ethics', 'ai'],
    instructor: "Ирина Соколова",
    duration: "8 часов",
    rating: 4.8,
    enrolled: 625,
    updated: "2025-04-24",
    color: "primary",
    skillMatch: {
      percentage: 90,
      label: "Рекомендуется всем",
      isRecommended: true
    }
  };

  const lawCourseFormatted: Course = {
    id: lawCourse.id,
    title: lawCourse.title,
    description: lawCourse.description,
    icon: lawCourse.icon,
    modules: lawCourse.modulesCount,
    level: 'intermediate',
    category: ['law', 'ai'],
    instructor: "Антон Кравченко",
    duration: "7 часов",
    rating: 4.7,
    enrolled: 412,
    updated: "2025-04-24",
    color: "secondary",
    skillMatch: {
      percentage: 75,
      label: "Для бизнеса и разработчиков"
    }
  };

  // Проверка на загрузку данных
  if (isLoading) {
    return (
      <DashboardLayout 
        title="Каталог курсов" 
        subtitle="Исследуйте нашу библиотеку курсов по AI и Data Science"
      >
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">
              <i className="fas fa-circle-notch"></i>
            </div>
            <div className="text-xl">Загрузка курсов...</div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Объединяем все курсы (в приоритете курсы из API)
  // Убираем дубликаты по id и title
  const combinedCourses = [
    ...apiCoursesFormatted,
    ...SAMPLE_COURSES.filter(sampleCourse => 
      !apiCoursesFormatted.some(apiCourse => 
        apiCourse.title === sampleCourse.title || 
        (typeof apiCourse.id === 'number' && apiCourse.id === sampleCourse.id)
      )
    )
  ];

  // Проверяем, нет ли уже курсов с такими же id или title из ethicsCourse и lawCourse
  const ethicsExists = combinedCourses.some(course => 
    course.title === ethicsCourse.title || 
    course.id === ethicsCourse.id
  );
  
  const lawExists = combinedCourses.some(course => 
    course.title === lawCourse.title || 
    course.id === lawCourse.id
  );
  
  const allCourses = [
    ...combinedCourses,
    ...(!ethicsExists ? [ethicsCourseFormatted] : []),
    ...(!lawExists ? [lawCourseFormatted] : [])
  ];

  // Filter courses based on search and filters
  // Преобразовать id в строки для поддержки строковых идентификаторов
  const coursesWithFixedId = allCourses.map(course => ({
    ...course,
    id: typeof course.id === 'number' ? String(course.id) : course.id
  }));
  
  const filteredCourses = coursesWithFixedId.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory ? 
      (Array.isArray(course.category) 
        ? course.category.includes(selectedCategory) 
        : course.category === selectedCategory) 
      : true;
    
    const matchesLevel = selectedLevel ? course.level === selectedLevel : true;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  // All unique categories
  const categories = Array.from(
    new Set(allCourses.flatMap(course => 
      Array.isArray(course.category) ? course.category : [course.category]
    ))
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
                      <span className="text-2xl">📚</span>
                    </div>
                    <div>
                      <h2 className="font-orbitron text-2xl font-bold">
                        {selectedCourse.title}
                      </h2>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <LevelBadge level={selectedCourse.level || 'beginner'} />
                        {Array.isArray(selectedCourse.category) 
                          ? selectedCourse.category.map(cat => (
                              <span key={cat} className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full">
                                {cat}
                              </span>
                            ))
                          : <span className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-full">
                              {selectedCourse.category}
                            </span>
                        }
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
                          <span className="text-xs">👤</span>
                        </div>
                        {selectedCourse.instructor}
                      </div>
                    </div>
                    <div>
                      <div className="text-white/50">Продолжительность</div>
                      <div className="flex items-center mt-1">
                        <span className="mr-2">⏱️</span>
                        {selectedCourse.duration}
                      </div>
                    </div>
                    <div>
                      <div className="text-white/50">Модули</div>
                      <div className="flex items-center mt-1">
                        <span className="mr-2">📚</span>
                        {selectedCourse.modules} модулей
                      </div>
                    </div>
                    <div>
                      <div className="text-white/50">Рейтинг</div>
                      <div className="flex items-center mt-1">
                        <span className="text-yellow-400 mr-2">★</span>
                        {selectedCourse.rating ? selectedCourse.rating.toFixed(1) : '4.5'} ({selectedCourse.enrolled} студентов)
                      </div>
                    </div>
                    <div>
                      <div className="text-white/50">Обновлено</div>
                      <div className="flex items-center mt-1">
                        <span className="mr-2">📅</span>
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
                        <div className="text-green-400 mr-2 mt-1">✓</div>
                        <div>Понимать фундаментальные концепции и принципы</div>
                      </div>
                      <div className="flex items-start">
                        <div className="text-green-400 mr-2 mt-1">✓</div>
                        <div>Работать с современными инструментами и библиотеками</div>
                      </div>
                      <div className="flex items-start">
                        <div className="text-green-400 mr-2 mt-1">✓</div>
                        <div>Создавать и оптимизировать собственные модели</div>
                      </div>
                      <div className="flex items-start">
                        <div className="text-green-400 mr-2 mt-1">✓</div>
                        <div>Решать практические задачи из реальных проектов</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link 
                      to={selectedCourse.id === "0" ? "/course-ai/python-for-ai-beginners" : "#"}
                      className="bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] hover:from-[#4922B2] hover:to-[#1682A1] text-white py-3 px-6 rounded-lg font-medium transition duration-300 flex items-center"
                    >
                      <span className="mr-2">▶️</span>
                      {selectedCourse.progress ? 'Продолжить обучение' : 'Начать обучение'}
                    </Link>
                    <button className="border border-white/20 hover:bg-white/10 text-white py-3 px-6 rounded-lg font-medium transition duration-300 flex items-center">
                      <span className="mr-2">🔖</span>
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
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50">🔍</span>
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
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredCourses.map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
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
                      <LevelBadge level={course.level || 'beginner'} />
                    </div>
                    <h3 className="font-semibold text-lg mt-4">{course.title}</h3>
                    {course.skillMatch && (
                      <div className="mt-2">
                        <SkillMatchBadge skillMatch={course.skillMatch} />
                      </div>
                    )}
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
                        <span>{course.rating ? course.rating.toFixed(1) : '4.5'}</span>
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
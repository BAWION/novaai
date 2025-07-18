import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { motion } from "framer-motion";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import { ethicsCourse, lawCourse } from "@/data";
import { useQuery } from "@tanstack/react-query";
import { coursesCatalog, courseCategories, courseSubCategories } from "@/data/courses-catalog";


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
    id: "ai-ethics-v2", // Новый интерактивный курс этики ИИ
    title: "Этика и безопасность ИИ 2.0",
    description: "Интерактивный курс по этике искусственного интеллекта с практическими упражнениями. Изучите принципы ответственного ИИ через игровые механики, кейсы и симуляции реальных сценариев.",
    icon: "shield-check", // Иконка безопасности для этики ИИ
    modules: 5,
    level: "intermediate",
    category: ["ai", "ethics", "safety"],
    instructor: "NOVA AI Ассистент",
    duration: "4 часа 15 минут",
    rating: 4.9,
    enrolled: 623,
    updated: "2025-07-15",
    color: "secondary",
    skillMatch: {
      percentage: 100,
      label: "🎯 Интерактивная методология",
      isRecommended: true
    }
  },
  {
    id: -1, // Новый курс по промпт-инженерии (ставим вторым)
    title: "Prompt-инжиниринг для GPT-моделей",
    description: "Курс обучает созданию эффективных промптов для GPT-моделей с практикой в чат-песочнице. Изучите роли, контекст, техники улучшения ответов и создайте свой мини-бот для AI-ассистентов.",
    icon: "sparkles", // Иконка для промпт-инженерии
    modules: 5,
    level: "intermediate",
    category: ["ai", "prompt-engineering", "gpt"],
    instructor: "NOVA AI Ассистент",
    duration: "6 часов",
    rating: 4.8,
    enrolled: 785,
    updated: "2025-04-29",
    color: "accent",
    skillMatch: {
      percentage: 98,
      label: "Новый курс - рекомендуем!",
      isRecommended: true
    }
  },
  {
    id: 0, // Специальный ID для нашего AI-курса (теперь вторым в списке)
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
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);

  const [showAllCourses, setShowAllCourses] = useState(false);
  const [showBusinessOnly, setShowBusinessOnly] = useState(false);
  
  // Преобразуем данные из каталога курсов в формат Course для совместимости
  const convertCatalogCourseToOldFormat = (catalogCourse: any): Course => {
    return {
      id: catalogCourse.id,
      title: catalogCourse.title,
      description: catalogCourse.description,
      icon: catalogCourse.icon,
      modules: catalogCourse.modules,
      level: catalogCourse.level as 'beginner' | 'intermediate' | 'advanced',
      category: catalogCourse.category,
      instructor: catalogCourse.instructor,
      duration: catalogCourse.duration,
      rating: catalogCourse.rating,
      enrolled: catalogCourse.enrolled || 0,
      updated: catalogCourse.updated || "2025-04-01",
      color: catalogCourse.color as 'primary' | 'secondary' | 'accent',
      skillMatch: catalogCourse.skillMatch
    };
  };
  
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

  // Получаем курсы из API
  const { data: apiCourses = [], isLoading: isLoadingApiCourses } = useQuery({
    queryKey: ['/api/courses'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/courses');
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        console.log('API курсы:', data); // Отладка для просмотра данных
        return data;
      } catch (error) {
        console.error('Ошибка при загрузке курсов:', error);
        return [];
      }
    }
  });

  // Преобразуем курсы из API в формат нашего приложения
  const formattedApiCourses = apiCourses.map((course: any) => ({
    id: course.slug, // используем slug для корректной навигации
    title: course.title,
    description: course.description,
    icon: course.icon || 'book',
    modules: course.modules || 0,
    level: course.level || 'beginner',
    category: course.tags || ['ai'],
    instructor: 'Nova AI',
    duration: course.estimatedDuration ? `${Math.floor(course.estimatedDuration / 60)} часов` : 'Не указано',
    rating: 4.8,
    enrolled: 100,
    updated: course.updatedAt || new Date().toISOString(),
    color: course.color as 'primary' | 'secondary' | 'accent' || 'primary',
    access: course.access || 'free',
    slug: course.slug, // добавляем slug для правильной навигации
    skillMatch: {
      percentage: 90,
      label: "Рекомендуется",
      isRecommended: true
    }
  }));

  // Конвертируем новый каталог курсов в старый формат
  const catalogCoursesFormatted = coursesCatalog.map(convertCatalogCourseToOldFormat);
  
  // Получаем только курс "Этика и безопасность ИИ 2.0" для показа всегда
  const ethicsV2Course = SAMPLE_COURSES.find(course => course.id === "ai-ethics-v2");
  
  // Объединяем курсы из API с локальными курсами и новым каталогом
  const allCourses = showAllCourses 
    ? [...SAMPLE_COURSES, ...formattedApiCourses, ethicsCourseFormatted, lawCourseFormatted, ...catalogCoursesFormatted]
    : [ethicsV2Course, ...formattedApiCourses, ...catalogCoursesFormatted].filter(Boolean); // Всегда показываем новый интерактивный курс

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
    
    // Фильтр по треку (новое)
    const isBusinessCourse = showBusinessOnly && course.themeStyle === 'business';
    const matchesTrack = selectedTrack 
      ? (catalogCoursesFormatted.some(c => c.id === course.id && (c as any).track === selectedTrack))
      : true;
    
    // Учитываем фильтр по бизнес-курсам
    const passesBusinessFilter = showBusinessOnly ? isBusinessCourse : true;
    
    return matchesSearch && matchesCategory && matchesLevel && matchesTrack && passesBusinessFilter;
  });

  // All unique categories
  const categories = Array.from(
    new Set(allCourses.flatMap(course => 
      Array.isArray(course.category) ? course.category : [course.category]
    ))
  );
  
  // Все треки из нового каталога
  const tracks = Array.from(
    new Set(coursesCatalog.map(course => course.track))
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
      {false ? (
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
                        {selectedCourse.rating ? selectedCourse.rating.toFixed(1) : '4.5'} ({selectedCourse.enrolled} студентов)
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
                    <button 
                      onClick={() => {
                        // Получаем ID курса из API или используем стандартный slug
                        const courseId = String(selectedCourse.id).startsWith('api_') 
                          ? selectedCourse.id.substring(4) // Убираем префикс 'api_'
                          : selectedCourse.id;
                          
                        // Получаем slug курса из API или используем стандартный slug
                        let courseSlug;
                        if (apiCourses && apiCourses.length > 0) {
                          // Ищем курс в API курсах по ID
                          const apiCourse = apiCourses.find((c: any) => c.id === Number(courseId));
                          
                          if (apiCourse && apiCourse.slug) {
                            courseSlug = apiCourse.slug;
                            console.log(`Найден slug курса в API: ${courseSlug}`);
                          }
                        }
                        
                        // Если не нашли slug, используем стандартное поведение
                        if (!courseSlug) {
                          if (selectedCourse.id === "0") {
                            setLocation("/course-ai/python-for-ai-beginners");
                            return;
                          } else if (selectedCourse.id === 7 || selectedCourse.title.includes("AI Ethics")) {
                            // AI Ethics курсы - ведем на детальную страницу курса
                            courseSlug = "ai-ethics";
                          } else if (selectedCourse.title.includes("AI Literacy")) {
                            courseSlug = "ai-literacy-101";
                          } else {
                            // По умолчанию используем индекс курса
                            courseSlug = String(courseId);
                          }
                        }
                        
                        console.log(`Переход на страницу курса: /courses/${courseSlug}`);
                        setLocation(`/courses/${courseSlug}`);
                      }}
                      className="bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] hover:from-[#4922B2] hover:to-[#1682A1] text-white py-3 px-6 rounded-lg font-medium transition duration-300 flex items-center min-w-[180px]"
                    >
                      <i className="fas fa-play-circle mr-2"></i>
                      {selectedCourse.progress ? 'Продолжить обучение' : 'Начать обучение'}
                    </button>
                    <button className="border border-white/20 hover:bg-white/10 text-white py-3 px-6 rounded-lg font-medium transition duration-300 flex items-center min-w-[180px]">
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
          {/* Lightning Lab Quick Access */}
          <Glassmorphism className="p-6 rounded-xl border border-[#6E3AFF]/30 bg-gradient-to-r from-[#6E3AFF]/10 to-[#2EBAE1]/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] p-3 rounded-lg">
                  <i className="fas fa-bolt text-white text-xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    ⚡ Lightning Lab: Экспресс-аудит этики за 20 минут
                  </h3>
                  <p className="text-white/70 text-sm">
                    Быстрая оценка этичности вашего ИИ-проекта → готовый отчёт для руководства
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setLocation('/lightning-ethics')}
                className="bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] hover:from-[#4922B2] hover:to-[#1682A1] text-white py-2 px-4 rounded-lg font-medium transition duration-300 flex items-center text-sm"
              >
                <i className="fas fa-rocket mr-2"></i>
                Начать за 20 мин
              </button>
            </div>
          </Glassmorphism>

          {/* Search and filters */}
          <div className="space-y-4">
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
                  <option value="expert" style={{backgroundColor: '#1a1a2e', color: 'white'}}>Экспертный</option>
                </select>
                
                <div className="w-1/2 flex">
                  <button 
                    className={`mr-2 flex-1 py-3 px-3 rounded-lg font-medium transition-all ${showAllCourses ? 'bg-primary/70 hover:bg-primary' : 'bg-space-800/50 hover:bg-space-700/50 border border-white/10'}`}
                    onClick={() => setShowAllCourses(!showAllCourses)}
                  >
                    <i className={`fas fa-graduation-cap ${showAllCourses ? 'text-white' : 'text-white/60'}`}></i>
                    <span className="sr-only">Все курсы</span>
                  </button>
                  <button 
                    className={`flex-1 py-3 px-3 rounded-lg font-medium transition-all ${showBusinessOnly ? 'bg-blue-600/80 hover:bg-blue-600' : 'bg-space-800/50 hover:bg-space-700/50 border border-white/10'}`}
                    onClick={() => setShowBusinessOnly(!showBusinessOnly)}
                  >
                    <i className={`fas fa-briefcase ${showBusinessOnly ? 'text-white' : 'text-white/60'}`}></i>
                    <span className="sr-only">Бизнес-курсы</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Трек-фильтры */}
            <div>
              <h3 className="text-white/70 text-sm mb-2">Треки обучения:</h3>
              <div className="flex flex-wrap gap-2">
                <span 
                  className={`px-3 py-1.5 rounded-full cursor-pointer text-sm transition-all ${selectedTrack === null ? 'bg-primary/80 text-white' : 'bg-space-800/70 text-white/70 hover:bg-space-700/70'}`}
                  onClick={() => setSelectedTrack(null)}
                >
                  Все треки
                </span>
                {tracks.map(track => (
                  <span 
                    key={track}
                    className={`px-3 py-1.5 rounded-full cursor-pointer text-sm transition-all ${selectedTrack === track ? 'bg-primary/80 text-white' : 'bg-space-800/70 text-white/70 hover:bg-space-700/70'}`}
                    onClick={() => setSelectedTrack(track)}
                  >
                    {track}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Категории */}
            <div>
              <div className="flex justify-between">
                <h3 className="text-white/70 text-sm mb-2">Категории:</h3>
                <span className="text-white/50 text-xs cursor-pointer hover:text-white/70 transition-colors" onClick={() => setSelectedCategory(null)}>
                  Сбросить
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span 
                  className={`px-3 py-1.5 rounded-full cursor-pointer text-sm transition-all ${selectedCategory === null ? 'bg-secondary/80 text-white' : 'bg-space-800/70 text-white/70 hover:bg-space-700/70'}`}
                  onClick={() => setSelectedCategory(null)}
                >
                  Все категории
                </span>
                {categories.slice(0, 10).map(category => (
                  <span 
                    key={category}
                    className={`px-3 py-1.5 rounded-full cursor-pointer text-sm transition-all ${selectedCategory === category ? 'bg-secondary/80 text-white' : 'bg-space-800/70 text-white/70 hover:bg-space-700/70'}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </span>
                ))}
                {categories.length > 10 && (
                  <span className="px-3 py-1.5 rounded-full text-sm text-white/50">
                    и ещё {categories.length - 10}...
                  </span>
                )}
              </div>
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
                      } flex items-center justify-center text-white relative`}>
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
                      onClick={() => {
                        // Получаем ID курса из API или используем стандартный slug
                        const courseId = String(course.id).startsWith('api_') 
                          ? course.id.substring(4) // Убираем префикс 'api_'
                          : course.id;
                          
                        // Получаем slug курса из API или используем стандартный slug
                        let courseSlug;
                        if (apiCourses && apiCourses.length > 0) {
                          // Ищем курс в API курсах по ID
                          const apiCourse = apiCourses.find((c: any) => c.id === Number(courseId));
                          
                          if (apiCourse && apiCourse.slug) {
                            courseSlug = apiCourse.slug;
                            console.log(`Найден slug курса в API: ${courseSlug}`);
                          }
                        }
                        
                        // Если не нашли slug, используем стандартное поведение
                        if (!courseSlug) {
                          if (course.id === "ai-ethics-v2") {
                            // Этика и безопасность ИИ 2.0 - интерактивный курс
                            console.log(`Переход на интерактивный курс: /ai-ethics-v2`);
                            setLocation("/ai-ethics-v2");
                            return;
                          } else if (course.id === "0") {
                            setLocation("/course-details/python-for-ai-beginners");
                            return;
                          } else if (course.title.includes("AI Ethics Toolkit")) {
                            // AI Ethics Toolkit 1.0 - ведем на новую страницу toolkit
                            console.log(`Переход на AI Ethics Toolkit: /ai-ethics-toolkit`);
                            setLocation("/ai-ethics-toolkit");
                            return;
                          } else if (course.id === 7 || course.title.includes("AI Ethics")) {
                            // AI Ethics курсы - ведем на страницу деталей курса
                            courseSlug = "ai-ethics";
                          } else if (course.title.includes("AI Literacy")) {
                            courseSlug = "ai-literacy-101";
                          } else {
                            // По умолчанию используем индекс курса
                            courseSlug = String(courseId);
                          }
                        }
                        
                        console.log(`Переход на страницу деталей курса: /course-details/${courseSlug}`);
                        setLocation(`/course-details/${courseSlug}`);
                      }}
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
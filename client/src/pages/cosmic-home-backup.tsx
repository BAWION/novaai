import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Rocket, 
  Brain, 
  BookOpen, 
  Users, 
  Zap, 
  Star,
  ArrowRight,
  Sparkles,
  Globe,
  Bot,
  Clock,
  Award,
  Target,
  ChevronDown
} from 'lucide-react';

// Course Galaxy Filter Component
const CourseGalaxyFilter = () => {
  const [selectedGalaxy, setSelectedGalaxy] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const galaxies = [
    {
      id: 'machine-learning',
      name: 'Машинное обучение',
      description: 'Алгоритмы и модели ML',
      color: 'from-blue-500 to-cyan-500',
      icon: Brain,
      categories: ['Основы ML', 'Глубокое обучение', 'Классификация', 'Регрессия'],
      courses: [
        {
          title: 'AI Literacy 101',
          description: 'Основы искусственного интеллекта',
          modules: 5,
          duration: '3 часа',
          level: 'Новичок'
        },
        {
          title: 'Машинное обучение',
          description: 'От линейной регрессии до нейросетей',
          modules: 10,
          duration: '15 часов',
          level: 'Продвинутый'
        },
        {
          title: 'Deep Learning',
          description: 'Нейронные сети и глубокое обучение',
          modules: 12,
          duration: '20 часов',
          level: 'Эксперт'
        }
      ]
    },
    {
      id: 'computer-vision',
      name: 'Компьютерное зрение',
      description: 'Обработка изображений и видео',
      color: 'from-purple-500 to-pink-500',
      icon: Bot,
      categories: ['Обработка изображений', 'Детекция объектов', 'Распознавание', 'Сегментация'],
      courses: [
        {
          title: 'Computer Vision',
          description: 'Обработка изображений и видео с ИИ',
          modules: 9,
          duration: '14 часов',
          level: 'Продвинутый'
        }
      ]
    },
    {
      id: 'nlp',
      name: 'Обработка языка',
      description: 'NLP и языковые модели',
      color: 'from-green-500 to-emerald-500',
      icon: Sparkles,
      categories: ['Обработка текста', 'Языковые модели', 'Чатботы', 'Анализ тональности'],
      courses: [
        {
          title: 'NLP и языковые модели',
          description: 'Обработка естественного языка',
          modules: 11,
          duration: '18 часов',
          level: 'Продвинутый'
        },
        {
          title: 'Prompt Engineering',
          description: 'Мастерство работы с языковыми моделями',
          modules: 5,
          duration: '4 часа',
          level: 'Базовый'
        }
      ]
    },
    {
      id: 'automation',
      name: 'Автоматизация',
      description: 'No-Code и автоматизация',
      color: 'from-orange-500 to-red-500',
      icon: Zap,
      categories: ['No-Code платформы', 'API интеграции', 'Бизнес-процессы', 'Боты'],
      courses: [
        {
          title: 'Автоматизация No-Code',
          description: 'Make.com + ChatGPT интеграции',
          modules: 6,
          duration: '5 часов',
          level: 'Базовый'
        },
        {
          title: 'Telegram-боты с ИИ',
          description: 'Создание умных ботов без кода',
          modules: 7,
          duration: '6 часов',
          level: 'Базовый'
        }
      ]
    },
    {
      id: 'business-ai',
      name: 'Бизнес и этика ИИ',
      description: 'Применение ИИ в бизнесе',
      color: 'from-indigo-500 to-purple-600',
      icon: Star,
      categories: ['Этика ИИ', 'Бизнес-применение', 'MLOps', 'Стратегия'],
      courses: [
        {
          title: 'AI Ethics & Safety',
          description: 'Этика и безопасность ИИ',
          modules: 6,
          duration: '8 часов',
          level: 'Все уровни'
        },
        {
          title: 'AI для бизнеса',
          description: 'Внедрение ИИ в бизнес-процессы',
          modules: 9,
          duration: '10 часов',
          level: 'Руководители'
        },
        {
          title: 'MLOps и продакшн',
          description: 'Развертывание ML-моделей в продакшн',
          modules: 8,
          duration: '12 часов',
          level: 'Эксперт'
        }
      ]
    }
  ];

  const handleGalaxySelect = (galaxyId: string) => {
    if (selectedGalaxy === galaxyId) {
      setSelectedGalaxy(null);
      setSelectedCategory(null);
    } else {
      setSelectedGalaxy(galaxyId);
      setSelectedCategory(null);
    }
  };

  const selectedGalaxyData = galaxies.find(g => g.id === selectedGalaxy);

  return (
    <div className="space-y-8">
      {/* Galaxy Selector */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {galaxies.map((galaxy, index) => {
          const Icon = galaxy.icon;
          const isSelected = selectedGalaxy === galaxy.id;
          
          return (
            <motion.div
              key={galaxy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative cursor-pointer group ${isSelected ? 'z-10' : ''}`}
              onClick={() => handleGalaxySelect(galaxy.id)}
            >
              <div className={`relative p-4 rounded-xl backdrop-blur-sm border transition-all duration-300 ${
                isSelected 
                  ? `bg-gradient-to-br ${galaxy.color} border-white/30 shadow-2xl scale-105`
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:scale-102'
              }`}>
                <div className="text-center">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center ${
                    isSelected 
                      ? 'bg-white/20' 
                      : `bg-gradient-to-br ${galaxy.color}`
                  }`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">
                    {galaxy.name}
                  </h3>
                  <p className="text-gray-400 text-xs leading-tight">
                    {galaxy.description}
                  </p>
                </div>
                
                {/* Selection indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                  >
                    <ChevronDown className="w-4 h-4 text-gray-800" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Galaxy Content */}
      {selectedGalaxyData && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.4 }}
          className="overflow-hidden"
        >
          <div className={`relative p-6 rounded-2xl bg-gradient-to-br ${selectedGalaxyData.color}/10 border border-white/20 backdrop-blur-md`}>
            {/* Categories */}
            <div className="mb-6">
              <h4 className="text-white font-semibold mb-4 flex items-center">
                <selectedGalaxyData.icon className="w-5 h-5 mr-2" />
                Разделы в галактике "{selectedGalaxyData.name}"
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedGalaxyData.categories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? `bg-gradient-to-r ${selectedGalaxyData.color} text-white shadow-lg`
                        : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Courses */}
            <div>
              <h4 className="text-white font-semibold mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Курсы ({selectedGalaxyData.courses.length})
              </h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedGalaxyData.courses.map((course, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className={`w-10 h-10 mb-3 bg-gradient-to-br ${selectedGalaxyData.color} rounded-lg flex items-center justify-center`}>
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <h5 className="text-white font-semibold mb-2">{course.title}</h5>
                    <p className="text-gray-400 text-sm mb-3">{course.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>{course.modules} модулей</span>
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${selectedGalaxyData.color} text-white`}>
                        {course.level}
                      </span>
                      <Button size="sm" className={`bg-gradient-to-r ${selectedGalaxyData.color} hover:scale-105 transition-transform`}>
                        <Rocket className="w-3 h-3 mr-1" />
                        Начать
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Mobile version fallback */}
      <div className="md:hidden">
        <CourseDrumCarousel />
      </div>
    </div>
  );
};

// Mobile Drum Carousel Component
const CourseDrumCarousel = () => {
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const courses = [
    {
      title: "AI Literacy 101",
      description: "Основы искусственного интеллекта для начинающих",
      fullDescription: "Полный курс по основам ИИ: от истории до современных применений. Изучите алгоритмы машинного обучения, нейронные сети и этические аспекты ИИ.",
      modules: 5,
      duration: "3 часа",
      category: "Начальный",
      color: "from-blue-500 to-cyan-500",
      level: "Новичок",
      skills: ["Основы ИИ", "ML алгоритмы", "Этика ИИ"]
    },
    {
      title: "Python для Data Science",
      description: "Полный курс Python для анализа данных",
      fullDescription: "Изучите Python с нуля: pandas, numpy, matplotlib. Работа с данными, визуализация, статистический анализ и подготовка к машинному обучению.",
      modules: 8,
      duration: "12 часов",
      category: "Python",
      color: "from-green-500 to-emerald-500",
      level: "Базовый",
      skills: ["Python", "Pandas", "Matplotlib", "NumPy"]
    },
    {
      title: "Машинное обучение",
      description: "От линейной регрессии до нейросетей",
      fullDescription: "Углубленное изучение ML: алгоритмы классификации и регрессии, ансамбли, введение в глубокое обучение и практическая реализация проектов.",
      modules: 10,
      duration: "15 часов",
      category: "ML",
      color: "from-purple-500 to-pink-500",
      level: "Продвинутый",
      skills: ["Scikit-learn", "Регрессия", "Классификация", "Нейросети"]
    },
    {
      title: "Deep Learning",
      description: "Нейронные сети и глубокое обучение",
      fullDescription: "Современные архитектуры нейронных сетей: CNN, RNN, Transformers. Практика с TensorFlow и PyTorch на реальных задачах.",
      modules: 12,
      duration: "20 часов",
      category: "DL",
      color: "from-indigo-500 to-purple-600",
      level: "Эксперт",
      skills: ["TensorFlow", "PyTorch", "CNN", "RNN"]
    },
    {
      title: "Computer Vision",
      description: "Обработка изображений и видео с ИИ",
      fullDescription: "Обработка изображений, детекция объектов, сегментация, распознавание лиц. Практические проекты с OpenCV и современными фреймворками.",
      modules: 9,
      duration: "14 часов",
      category: "CV",
      color: "from-cyan-500 to-blue-600",
      level: "Продвинутый",
      skills: ["OpenCV", "YOLO", "Сегментация", "Детекция"]
    },
    {
      title: "NLP и языковые модели",
      description: "Обработка естественного языка",
      fullDescription: "Современный NLP: от tokenization до Transformers. Работа с BERT, GPT, создание чатботов и анализ тональности текста.",
      modules: 11,
      duration: "18 часов",
      category: "NLP",
      color: "from-pink-500 to-rose-600",
      level: "Продвинутый",
      skills: ["BERT", "GPT", "Tokenization", "Sentiment"]
    },
    {
      title: "Автоматизация No-Code",
      description: "Make.com + ChatGPT интеграции",
      fullDescription: "Создание автоматизированных бизнес-процессов без программирования. Интеграция с ИИ, CRM системами и мессенджерами.",
      modules: 6,
      duration: "5 часов",
      category: "Автоматизация",
      color: "from-orange-500 to-red-500",
      level: "Базовый",
      skills: ["Make.com", "Zapier", "API интеграции", "Автоматизация"]
    },
    {
      title: "Telegram-боты с ИИ",
      description: "Создание умных ботов без кода",
      fullDescription: "Полный цикл создания Telegram-ботов: от BotFather до продвинутых функций. Интеграция с ChatGPT, платежными системами и базами данных.",
      modules: 7,
      duration: "6 часов",
      category: "Боты",
      color: "from-blue-400 to-indigo-500",
      level: "Базовый",
      skills: ["Telegram API", "ChatGPT API", "Webhooks", "Payments"]
    }
  ];

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
        setSelectedCourse(null);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const handleCourseSelect = (index: number) => {
    if (selectedCourse === index) {
      setSelectedCourse(null);
    } else {
      setSelectedCourse(index);
    }
  };

  return (
    <div className="md:hidden relative">
      {/* Course Strips */}
      <div className="relative h-80 overflow-hidden rounded-xl bg-gradient-to-b from-black/40 to-black/60 backdrop-blur-sm border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
        
        <div className="relative h-full flex flex-col justify-center py-4">
          <div className="space-y-2 px-4">
            {courses.map((course, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative cursor-pointer transition-all duration-300 ${
                  selectedCourse === index ? 'transform scale-105' : 'hover:scale-102'
                }`}
                onClick={() => handleCourseSelect(index)}
              >
                <div className={`relative p-3 rounded-lg backdrop-blur-sm border transition-all duration-300 ${
                  selectedCourse === index 
                    ? `bg-gradient-to-r ${course.color} border-white/30 shadow-lg`
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedCourse === index 
                          ? 'bg-white/20' 
                          : `bg-gradient-to-br ${course.color}`
                      }`}>
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-sm truncate">
                          {course.title}
                        </h3>
                        <p className="text-gray-300 text-xs">
                          {course.modules} модулей • {course.duration}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selectedCourse === index 
                          ? 'bg-white/20 text-white'
                          : `bg-gradient-to-r ${course.color} text-white`
                      }`}>
                        {course.level}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-white transition-transform duration-300 ${
                        selectedCourse === index ? 'rotate-180' : ''
                      }`} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Expanded Course Details */}
      {selectedCourse !== null && !isScrolling && (
        <motion.div
          initial={{ opacity: 0, y: 20, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: 20, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 overflow-hidden"
        >
          <Card className="bg-gradient-to-br from-white/10 to-white/5 border-white/20 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4 mb-4">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${courses[selectedCourse].color} flex items-center justify-center`}>
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {courses[selectedCourse].title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-3">
                    {courses[selectedCourse].fullDescription}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {courses[selectedCourse].modules}
                  </div>
                  <div className="text-xs text-gray-400">Модулей</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {courses[selectedCourse].duration}
                  </div>
                  <div className="text-xs text-gray-400">Времени</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1">
                    FREE
                  </div>
                  <div className="text-xs text-gray-400">Доступ</div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-semibold text-white mb-2">Изучаемые навыки:</h4>
                <div className="flex flex-wrap gap-2">
                  {courses[selectedCourse].skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300 border border-white/20"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <Button 
                className={`w-full bg-gradient-to-r ${courses[selectedCourse].color} hover:scale-105 transition-transform`}
                size="lg"
              >
                <Rocket className="w-4 h-4 mr-2" />
                Начать изучение
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

const CosmicHome = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const y3 = useTransform(scrollY, [0, 300], [0, -150]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: Brain,
      title: "Skills DNA",
      description: "Интеллектуальная диагностика ваших навыков в области ИИ с детальной радарной картой компетенций",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Rocket,
      title: "Персональные маршруты",
      description: "ИИ-алгоритмы создают индивидуальную траекторию обучения на основе вашего Skills DNA профиля",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: BookOpen,
      title: "Адаптивные курсы",
      description: "Микро-уроки с автоматической адаптацией сложности и темпа под ваш стиль обучения",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Bot,
      title: "NovaAI Тьютор",
      description: "Персональный ИИ-ассистент, который объясняет концепции и отвечает на вопросы 24/7",
      color: "from-orange-500 to-red-500"
    }
  ];

  const stats = [
    { number: "15+", label: "Курсов по ИИ", icon: BookOpen },
    { number: "7", label: "Этапов Skills DNA", icon: Brain },
    { number: "1000+", label: "Учащихся", icon: Users },
    { number: "24/7", label: "ИИ-поддержка", icon: Zap }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden relative">
      {/* Animated Background Stars */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      {/* Floating Planets */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-20"
        style={{ y: y1 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full opacity-15"
        style={{ y: y2 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full opacity-10"
        style={{ y: y3 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      {/* Mouse follower effect */}
      <motion.div
        className="fixed w-96 h-96 bg-gradient-radial from-blue-500/10 via-purple-500/5 to-transparent rounded-full pointer-events-none z-0"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      />
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="flex justify-between items-center p-6 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Galaxion.ai</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4"
          >
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Войти
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                Начать путешествие
              </Button>
            </Link>
          </motion.div>
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="mb-8">
              <motion.div
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30 mb-6"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4 text-blue-400 mr-2" />
                <span className="text-blue-300 text-sm font-medium">
                  Путешествие в мир искусственного интеллекта
                </span>
              </motion.div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                Вселенная ИИ
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                ждет исследователей
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Присоединяйтесь к космическому путешествию по галактикам знаний. 
              Ваш персональный корабль Galaxion готов к запуску в бесконечную вселенную 
              искусственного интеллекта.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4 h-auto">
                  <Rocket className="w-5 h-5 mr-2" />
                  Запустить корабль
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/skills-dna">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4 h-auto backdrop-blur-sm">
                  <Brain className="w-5 h-5 mr-2" />
                  Создать Skills DNA
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Floating Spaceship */}
          <motion.div
            className="absolute right-10 top-1/2 transform -translate-y-1/2"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            <div className="w-32 h-32 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full opacity-30 blur-xl" />
              <div className="relative w-full h-full bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center">
                <Rocket className="w-16 h-16 text-blue-600" />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Технологии будущего
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Каждая функция Galaxion создана для максимально эффективного обучения ИИ
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm h-full hover:bg-white/10 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${feature.color} rounded-full flex items-center justify-center`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
                  <stat.icon className="w-8 h-8 text-blue-400" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Course Library Section */}
        <section className="container mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Галактики знаний ИИ
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Выберите галактику для изучения направления искусственного интеллекта
            </p>
          </motion.div>

          <CourseGalaxyFilter />
        </section>
            {[
              {
                title: "AI Literacy 101",
                description: "Основы искусственного интеллекта",
                modules: 5,
                duration: "3 часа",
                category: "Начальный",
                color: "from-blue-500 to-cyan-500",
                level: "Новичок"
              },
              {
                title: "Python для Data Science",
                description: "Полный курс Python для анализа данных",
                modules: 8,
                duration: "12 часов",
                category: "Python",
                color: "from-green-500 to-emerald-500",
                level: "Базовый"
              },
              {
                title: "Машинное обучение",
                description: "От линейной регрессии до нейросетей",
                modules: 10,
                duration: "15 часов",
                category: "ML",
                color: "from-purple-500 to-pink-500",
                level: "Продвинутый"
              },
              {
                title: "Автоматизация No-Code",
                description: "Make.com + ChatGPT интеграции",
                modules: 6,
                duration: "5 часов",
                category: "Автоматизация",
                color: "from-orange-500 to-red-500",
                level: "Базовый"
              },
              {
                title: "Deep Learning",
                description: "Нейронные сети и глубокое обучение",
                modules: 12,
                duration: "20 часов",
                category: "DL",
                color: "from-indigo-500 to-purple-600",
                level: "Эксперт"
              },
              {
                title: "Computer Vision",
                description: "Обработка изображений и видео с ИИ",
                modules: 9,
                duration: "14 часов",
                category: "CV",
                color: "from-cyan-500 to-blue-600",
                level: "Продвинутый"
              },
              {
                title: "NLP и языковые модели",
                description: "Обработка естественного языка",
                modules: 11,
                duration: "18 часов",
                category: "NLP",
                color: "from-pink-500 to-rose-600",
                level: "Продвинутый"
              },
              {
                title: "AI Ethics & Safety",
                description: "Этика и безопасность ИИ",
                modules: 6,
                duration: "8 часов",
                category: "Этика",
                color: "from-amber-500 to-orange-600",
                level: "Все уровни"
              },
              {
                title: "MLOps и продакшн",
                description: "Развертывание ML-моделей в продакшн",
                modules: 8,
                duration: "12 часов",
                category: "MLOps",
                color: "from-teal-500 to-green-600",
                level: "Эксперт"
              },
              {
                title: "Telegram-боты с ИИ",
                description: "Создание умных ботов без кода",
                modules: 7,
                duration: "6 часов",
                category: "Боты",
                color: "from-blue-400 to-indigo-500",
                level: "Базовый"
              },
              {
                title: "Prompt Engineering",
                description: "Мастерство работы с языковыми моделями",
                modules: 5,
                duration: "4 часа",
                category: "Промпты",
                color: "from-violet-500 to-purple-600",
                level: "Базовый"
              },
              {
                title: "AI для бизнеса",
                description: "Внедрение ИИ в бизнес-процессы",
                modules: 9,
                duration: "10 часов",
                category: "Бизнес",
                color: "from-emerald-500 to-teal-600",
                level: "Руководители"
              }
            ].map((course, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm h-full hover:bg-white/10 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 mb-4 bg-gradient-to-br ${course.color} rounded-lg flex items-center justify-center`}>
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {course.modules} модулей
                      </span>
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${course.color} text-white`}>
                        {course.category}
                      </span>
                      <span className="text-xs text-gray-400">{course.level}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Mobile Drum Carousel */}
          <CourseDrumCarousel />
        </section>

        {/* Testimonials Section */}
        <section className="container mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Отзывы наших исследователей
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Узнайте, что говорят люди, уже совершившие путешествие по вселенной ИИ
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                name: "Александр К.",
                role: "Data Scientist в Яндекс", 
                text: "После прохождения курса по глубокому обучению я получил повышение и теперь работаю над реальными AI-проектами. Особенно ценны были практические задания.",
                avatar: "👨‍💻"
              },
              {
                name: "Мария П.",
                role: "ML Engineer в Сбере",
                text: "Galaxion полностью изменил мою карьеру. За 6 месяцев я перешла из маркетинга в ML-разработку. Модульная система обучения позволила учиться в своем темпе.",
                avatar: "👩‍🔬"
              },
              {
                name: "Дмитрий В.",
                role: "Руководитель IT-отдела",
                text: "Business AI Module помог нам оценить потенциал внедрения ИИ в нашу компанию. Расчет ROI и консультации экспертов сэкономили нам миллионы.",
                avatar: "👨‍💼"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm h-full hover:bg-white/10 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="text-4xl text-blue-400 mb-4">
                      <Star className="w-8 h-8" />
                    </div>
                    <p className="text-gray-300 mb-6 italic leading-relaxed">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-2xl border border-blue-500/30">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-white">{testimonial.name}</p>
                        <p className="text-gray-400 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl p-12 border border-blue-500/20 backdrop-blur-sm"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Готовы к запуску?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Ваш корабль Galaxion ждет команды к старту. Присоединяйтесь к сообществу из более чем 50,000 исследователей и начните персональное путешествие в мир ИИ уже сегодня.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/onboarding-intro">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-4 h-auto">
                  <Rocket className="w-5 h-5 mr-2" />
                  Начать бесплатное обучение для всех уровней
                </Button>
              </Link>
              <Link href="/courses">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4 h-auto backdrop-blur-sm">
                  <Star className="w-5 h-5 mr-2" />
                  Посмотреть демо
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="bg-black/50 backdrop-blur-md border-t border-white/10">
          <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Galaxion.ai</span>
                </div>
                <p className="text-gray-400 mb-4 leading-relaxed">
                  Образовательная платформа нового поколения для изучения искусственного интеллекта и науки о данных. Преимущественно бесплатная для всех уровней.
                </p>

              </div>
              
              <div>
                <h4 className="font-bold mb-4 text-white">Навигация</h4>
                <ul className="space-y-3 text-gray-400">
                  <li>
                    <Link href="/" className="hover:text-white transition-colors flex items-center">
                      <Rocket className="w-4 h-4 mr-2" />
                      Главная
                    </Link>
                  </li>
                  <li>
                    <Link href="/courses" className="hover:text-white transition-colors flex items-center">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Курсы
                    </Link>
                  </li>
                  <li>
                    <Link href="/skills-dna" className="hover:text-white transition-colors flex items-center">
                      <Brain className="w-4 h-4 mr-2" />
                      Skills DNA
                    </Link>
                  </li>
                  <li>
                    <Link href="/community" className="hover:text-white transition-colors flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Сообщество
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-4 text-white">Курсы по ИИ</h4>
                <ul className="space-y-3 text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white transition-colors flex items-center">
                      <Sparkles className="w-4 h-4 mr-2" />
                      AI Literacy 101
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors flex items-center">
                      <Bot className="w-4 h-4 mr-2" />
                      Python для Data Science
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors flex items-center">
                      <Brain className="w-4 h-4 mr-2" />
                      Машинное обучение
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors flex items-center">
                      <Zap className="w-4 h-4 mr-2" />
                      Автоматизация No-Code
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors flex items-center">
                      <Star className="w-4 h-4 mr-2" />
                      Computer Vision
                    </a>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold mb-4 text-white">Контакты</h4>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    support@galaxion.ai
                  </li>
                  <li className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Telegram-сообщество
                  </li>
                  <li className="flex items-center">
                    <Rocket className="w-4 h-4 mr-2" />
                    Космическая штаб-квартира
                  </li>
                  <li>
                    <Link 
                      href="/presentation-selector" 
                      className="hover:text-white text-purple-300 font-medium transition-colors flex items-center"
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Для инвесторов
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="pt-6 border-t border-white/10 text-center">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-500">
                  © 2025 Galaxion. Все права защищены. Исследуйте вселенную ИИ с нами.
                </p>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <a href="#" className="hover:text-white transition-colors">Политика конфиденциальности</a>
                  <a href="#" className="hover:text-white transition-colors">Условия использования</a>
                  <a href="#" className="hover:text-white transition-colors">Поддержка</a>
                </div>
              </div>
              
              {/* Easter Egg for Admin */}
              <div className="mt-4 flex justify-center">
                <div className="w-6 h-6 opacity-20 hover:opacity-60 transition-opacity cursor-pointer">
                  <Star className="w-full h-full text-blue-400" />
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CosmicHome;
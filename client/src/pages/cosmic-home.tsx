import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Course Galaxy Filter Component
const CourseGalaxyFilter = () => {
  const [selectedGalaxy, setSelectedGalaxy] = useState<string | null>('machine-learning');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const galaxies = [
    {
      id: 'machine-learning',
      name: 'Машинное обучение',
      description: 'Алгоритмы и модели ML',
      color: 'from-blue-400 to-cyan-400',
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
      color: 'from-purple-400 to-pink-400',
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
      color: 'from-green-400 to-emerald-400',
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
      color: 'from-orange-400 to-red-400',
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
      color: 'from-indigo-400 to-purple-500',
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
    <div className="space-y-6">
      {/* Galaxy Selector - Desktop grid */}
      <div className="hidden md:grid md:grid-cols-5 md:gap-4">
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

      {/* Mobile Galaxy Selector - Ultra Compact */}
      <div className="md:hidden">
        <div className="flex gap-0.5 justify-between px-2 pb-4 max-w-full overflow-hidden">
          {galaxies.map((galaxy, index) => {
            const Icon = galaxy.icon;
            const isSelected = selectedGalaxy === galaxy.id;
            
            return (
              <motion.div
                key={galaxy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`relative cursor-pointer flex-1 max-w-[60px] ${isSelected ? 'z-10' : ''}`}
                onClick={() => handleGalaxySelect(galaxy.id)}
              >
                <div className="flex flex-col items-center text-center min-w-0">
                  <div className={`w-8 h-8 mb-1 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    isSelected 
                      ? 'bg-white/20 shadow-md scale-105' 
                      : `bg-gradient-to-br ${galaxy.color} hover:scale-105 hover:shadow-sm`
                  }`}>
                    <Icon className="w-4 h-4 text-white drop-shadow-sm flex-shrink-0" />
                  </div>
                  <span className={`font-medium leading-none transition-colors duration-300 text-center drop-shadow-sm ${
                    isSelected ? 'text-white' : 'text-gray-200'
                  }`} style={{ 
                    fontSize: '9px',
                    lineHeight: '10px',
                    maxWidth: '56px',
                    wordBreak: 'break-word',
                    hyphens: 'auto',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {galaxy.name}
                  </span>
                  
                  {/* Selection indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-white rounded-full flex items-center justify-center shadow-md"
                    >
                      <ChevronDown className="w-2 h-2 text-gray-800" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
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
    </div>
  );
};

// Platform Screenshots Slider Component
const PlatformScreenshotsSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const screenshots = [
    {
      src: "/screenshot0.png",
      title: "Мостик управления",
      description: "Персональная траектория обучения и Skills DNA диагностика"
    },
    {
      src: "/screenshot1.png",
      title: "Вселенная ИИ",
      description: "Космическая дорожная карта обучения с галактиками знаний"
    },
    {
      src: "/screenshot2.png", 
      title: "Каталог курсов",
      description: "Обширная библиотека курсов по ИИ и Data Science"
    },
    {
      src: "/screenshot3.png",
      title: "ИИ-Тьютор NovaAI",
      description: "Персональный помощник для изучения искусственного интеллекта"
    },
    {
      src: "/screenshot4.png",
      title: "Хранилище знаний",
      description: "Библиотека статей, туториалов и знаний по ИИ"
    }
  ];

  // Auto-slide effect
  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % screenshots.length);
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(interval);
  }, [isHovered, screenshots.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % screenshots.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="w-full max-w-full overflow-hidden">
      <h3 className="text-lg sm:text-xl font-bold text-white mb-3 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Платформа Galaxion
      </h3>
      
      <div 
        className="relative w-full max-w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ touchAction: 'pan-y' }}
      >
        {/* Slider Container */}
        <div className="relative overflow-hidden rounded-xl bg-black/30 border border-white/20 shadow-2xl touch-pan-y">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {screenshots.map((screenshot, index) => (
              <div key={index} className="w-full flex-shrink-0">
                <div className="relative">
                  <img
                    src={screenshot.src}
                    alt={screenshot.title}
                    className="w-full h-64 sm:h-72 md:h-80 lg:h-96 object-cover object-top"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 sm:p-6">
                    <h4 className="text-white font-bold text-lg sm:text-xl mb-2">
                      {screenshot.title}
                    </h4>
                    <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                      {screenshot.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full p-3 transition-all duration-200 border border-white/20"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full p-3 transition-all duration-200 border border-white/20"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>



        <p className="text-center text-white/80 text-sm mt-2 max-w-xl mx-auto">
          Откройте для себя возможности платформы ИИ
        </p>
      </div>
    </div>
  );
};

const CosmicHome = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const y3 = useTransform(scrollY, [0, 300], [0, -150]);
  
  // Admin login state
  const [, setLocation] = useLocation();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState("");

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdminLoading(true);
    setAdminError("");

    // Check credentials
    if (adminUsername === "borabora" && adminPassword === "28934f_EF_#R") {
      // Simulate authentication
      localStorage.setItem("admin-session", "authenticated");
      localStorage.setItem("admin-role", "admin");
      localStorage.setItem("admin-user", JSON.stringify({
        username: "borabora",
        role: "admin",
        permissions: ["all"]
      }));
      
      setTimeout(() => {
        setIsAdminLoading(false);
        setShowAdminLogin(false);
        setLocation("/admin");
      }, 1000);
    } else {
      setTimeout(() => {
        setIsAdminLoading(false);
        setAdminError("Неверные учетные данные");
        setAdminUsername("");
        setAdminPassword("");
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden w-full max-w-full" style={{ touchAction: 'pan-y' }}>
      {/* Navigation Header */}
      <header className="relative z-20 px-6 py-4 backdrop-blur-md bg-black/50 border-b border-white/10">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Galaxion
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/courses" className="text-gray-300 hover:text-white transition-colors flex items-center">
              <BookOpen className="w-4 h-4 mr-2" />
              Курсы
            </Link>
            <Link href="/skills-dna" className="text-gray-300 hover:text-white transition-colors flex items-center">
              <Brain className="w-4 h-4 mr-2" />
              Skills DNA
            </Link>
            <Link href="/community" className="text-gray-300 hover:text-white transition-colors flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Сообщество
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 h-auto text-sm font-medium backdrop-blur-sm">
                Войти
              </Button>
            </Link>
            <Link href="/onboarding-intro">
              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-4 py-2 h-auto text-sm font-medium shadow-lg">
                Начать
              </Button>
            </Link>
          </div>
        </div>
      </header>
      {/* Cosmic Background */}
      <div className="fixed inset-0 z-0 will-change-transform performance-optimized pointer-events-none">
        {/* Stars - Reduced count for better performance */}
        {Array.from({ length: 80 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full will-change-transform pointer-events-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        {/* Floating particles - Reduced count */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full blur-sm will-change-transform pointer-events-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}

        {/* Small nebula effects - non-blocking */}
        <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-blue-500/10 rounded-full blur-xl animate-pulse performance-optimized pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-6 h-6 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000 performance-optimized pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/3 w-4 h-4 bg-cyan-500/10 rounded-full blur-xl animate-pulse delay-2000 performance-optimized pointer-events-none" />
      </div>
      <div className="relative z-10 will-change-scroll w-full max-w-full">
        {/* Hero Section */}
        <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 relative">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
              <motion.div 
                className="flex-1 w-full"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                  Освойте <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600">искусственный интеллект</span> и стройте карьеру будущего
                </h1>

                <p className="text-base sm:text-lg md:text-xl text-white/80 mb-6 sm:mb-8 max-w-xl">
                  <span className="font-bold text-white">Galaxion</span> — это <span className="font-bold text-white">преимущественно бесплатная</span> образовательная платформа для <span className="font-bold text-white">всех уровней</span> — от школьников до Senior-разработчиков, с адаптивной AI-системой обучения от NovaAI.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/onboarding-intro" className="flex-1 sm:flex-none">
                    <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-sm px-4 py-2 h-9 w-full sm:w-auto min-w-[140px]">
                      Начать обучение
                      <Rocket className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                  <Link href="/skills-dna" className="flex-1 sm:flex-none">
                    <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-sm px-4 py-2 h-9 w-full sm:w-auto min-w-[140px] backdrop-blur-sm">
                      Skills DNA
                      <Brain className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex-1 w-full mt-8 md:mt-0"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <PlatformScreenshotsSlider />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-8 sm:py-10 px-4 sm:px-6 bg-black/30 backdrop-blur-md">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
              {[
                { value: "30+", label: "Авторских курсов" },
                { value: "50k+", label: "Активных учеников" },
                { value: "96%", label: "Трудоустройство" },
                { value: "4.8", label: "Средняя оценка" }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-1 sm:mb-2">
                    {stat.value}
                  </p>
                  <p className="text-sm sm:text-base text-white/70">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>


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
              Ключевые возможности
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Исследуйте передовые технологии обучения в космической среде
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: Brain,
                title: "Skills DNA",
                description: "Персонализированная диагностика навыков с адаптивными рекомендациями"
              },
              {
                icon: Rocket,
                title: "Умный подбор курсов",
                description: "ИИ-алгоритмы подбирают идеальные курсы на основе ваших целей"
              },
              {
                icon: Target,
                title: "Адаптивный прогресс",
                description: "Система автоматически адаптируется под ваш темп обучения"
              },
              {
                icon: Bot,
                title: "ИИ-тьютор NovaAI",
                description: "Персональный ассистент для ответов на вопросы и помощи"
              },
              {
                icon: Zap,
                title: "LabHub",
                description: "Интерактивная лаборатория для практики с реальными проектами"
              },
              {
                icon: Users,
                title: "Сообщество",
                description: "Telegram-канал с экспертами и актуальными новостями ИИ"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="bg-white/5 border-white/10 backdrop-blur-sm h-full hover:bg-white/10 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
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

        {/* Skills DNA Section */}
        <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <motion.div 
              className="text-left"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                <span className="text-blue-400">Skills DNA</span>{' '}
                <span className="text-white">— ваш навигатор в мире ИИ</span>
              </h2>
              
              <p className="text-gray-300 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
                <span className="hidden sm:inline">Galaxion создает персональную карту навыков Skills DNA, которая обновляется после каждого урока и автоматически подбирает оптимальные курсы для вашего роста с помощью ИИ-ассистента NovaAI.</span>
                <span className="sm:hidden">Персональная карта навыков, которая обновляется после каждого урока и подбирает оптимальные курсы с помощью ИИ.</span>
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mt-1">
                    <Brain className="w-3 h-3 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Skills DNA диагностика</h3>
                    <p className="text-gray-400 text-sm">многоуровневая оценка навыков с визуализацией на радарной диаграмме</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center mt-1">
                    <Sparkles className="w-3 h-3 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Умный подбор курсов</h3>
                    <p className="text-gray-400 text-sm">ИИ анализирует ваш профиль и рекомендует оптимальные курсы</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mt-1">
                    <Zap className="w-3 h-3 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Живое обновление навыков</h3>
                    <p className="text-gray-400 text-sm">Skills DNA обновляется после каждого завершенного урока</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => window.location.href = '/diagnosis'}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Создать Skills DNA профиль
              </button>
            </motion.div>

            {/* Right Visual - Skills DNA Visualization */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative bg-slate-900/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 h-80 flex items-center justify-center">
                {/* DNA Helix Visual */}
                <div className="relative w-40 h-60">
                  <div className="absolute inset-0 opacity-20">
                    {/* DNA Strands */}
                    <svg className="w-full h-full" viewBox="0 0 100 150">
                      <defs>
                        <linearGradient id="dnaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#8B5CF6" />
                          <stop offset="50%" stopColor="#3B82F6" />
                          <stop offset="100%" stopColor="#06B6D4" />
                        </linearGradient>
                      </defs>
                      
                      {/* Left strand */}
                      <path
                        d="M 20 0 Q 30 25 20 50 Q 10 75 20 100 Q 30 125 20 150"
                        stroke="url(#dnaGradient)"
                        strokeWidth="3"
                        fill="none"
                        className="animate-pulse"
                      />
                      
                      {/* Right strand */}
                      <path
                        d="M 80 0 Q 70 25 80 50 Q 90 75 80 100 Q 70 125 80 150"
                        stroke="url(#dnaGradient)"
                        strokeWidth="3"
                        fill="none"
                        className="animate-pulse"
                        style={{ animationDelay: '0.5s' }}
                      />
                      
                      {/* Cross connections */}
                      {Array.from({ length: 8 }).map((_, i) => (
                        <line
                          key={i}
                          x1={i % 2 === 0 ? 20 : 25}
                          y1={15 + i * 17}
                          x2={i % 2 === 0 ? 80 : 75}
                          y2={15 + i * 17}
                          stroke="url(#dnaGradient)"
                          strokeWidth="2"
                          opacity="0.6"
                          className="animate-pulse"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        />
                      ))}
                    </svg>
                  </div>

                  {/* Center Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-xl">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Floating skill indicators */}
                  <div className="absolute top-4 left-8 w-8 h-8 rounded-full bg-blue-500/30 backdrop-blur-sm border border-blue-400/50 flex items-center justify-center animate-bounce">
                    <Bot className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="absolute top-16 right-4 w-8 h-8 rounded-full bg-purple-500/30 backdrop-blur-sm border border-purple-400/50 flex items-center justify-center animate-bounce" style={{ animationDelay: '0.3s' }}>
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="absolute bottom-16 left-4 w-8 h-8 rounded-full bg-green-500/30 backdrop-blur-sm border border-green-400/50 flex items-center justify-center animate-bounce" style={{ animationDelay: '0.6s' }}>
                    <Zap className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="absolute bottom-4 right-8 w-8 h-8 rounded-full bg-orange-500/30 backdrop-blur-sm border border-orange-400/50 flex items-center justify-center animate-bounce" style={{ animationDelay: '0.9s' }}>
                    <Star className="w-4 h-4 text-orange-400" />
                  </div>
                </div>

                {/* Title overlay */}
                <div className="absolute bottom-4 left-0 right-0 text-center px-2">
                  <h3 className="text-gray-400 text-base sm:text-lg font-semibold">Skills DNA в действии</h3>
                  <p className="text-gray-500 text-xs sm:text-sm mt-1 leading-tight">
                    <span className="hidden sm:inline">Система анализирует ваши навыки и автоматически обновляет<br />радарную диаграмму после каждого урока</span>
                    <span className="sm:hidden">Анализ навыков и обновление диаграммы</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Course Library Section */}
        <section className="container mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Галактики знаний ИИ
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Выберите галактику для изучения направления искусственного интеллекта
            </p>
          </motion.div>

          <CourseGalaxyFilter />
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
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-2xl mx-auto">
              <Link href="/onboarding-intro" className="flex-1 sm:flex-none">
                <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-sm px-4 py-2 h-9 w-full sm:w-auto min-w-[140px]">
                  <Rocket className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span>Начать</span>
                </Button>
              </Link>
              <Link href="/courses" className="flex-1 sm:flex-none">
                <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-sm px-4 py-2 h-9 w-full sm:w-auto backdrop-blur-sm min-w-[140px]">
                  <Star className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span>Демо</span>
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="bg-black/50 backdrop-blur-md border-t border-white/10 pb-safe">
          <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Galaxion</span>
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
                <p className="text-gray-500 text-sm leading-relaxed max-w-full">
                  © 2025 Galaxion. Все права защищены. <span className="hidden sm:inline">Исследуйте вселенную ИИ с нами.</span>
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500">
                  <a href="#" className="hover:text-white transition-colors whitespace-nowrap">Политика конфиденциальности</a>
                  <a href="#" className="hover:text-white transition-colors whitespace-nowrap">Условия использования</a>
                  <a href="#" className="hover:text-white transition-colors whitespace-nowrap">Поддержка</a>
                  <span className="flex items-center gap-1 text-blue-400 font-medium whitespace-nowrap">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 3a1 1 0 000 2h10a1 1 0 100-2H5zm0 4a1 1 0 100 2h10a1 1 0 100-2H5z" clipRule="evenodd" />
                    </svg>
                    Web App
                  </span>
                </div>
              </div>
              
              {/* Admin Easter Egg */}
              <div 
                className="inline-block mt-2 cursor-pointer hover:scale-110 transition-all duration-300 opacity-30 hover:opacity-70"
                onClick={() => setShowAdminLogin(true)}
                title="System Access"
              >
                <svg 
                  className="w-4 h-4 text-white/40 hover:text-white/60 transition-colors" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M21.7 3.3c.4-.4.3-1-.2-1.3-1.2-.7-2.6-.9-4 0L3.6 15.4c-.4.4-.4 1 0 1.4l1.4 1.4c.4.4 1 .4 1.4 0L20.3 4.3c.4-.4.4-1 0-1.4l-1.4-1.4c-.4-.4-1-.4-1.4 0L3.6 15.4M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77 5.82 21.02 7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
            </div>
          </div>
        </footer>
      </div>
      
      {/* Admin Login Modal */}
      <AnimatePresence>
        {showAdminLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAdminLogin(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Системный доступ</h2>
                <button
                  onClick={() => setShowAdminLogin(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Логин
                  </label>
                  <Input
                    type="text"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="Введите логин"
                    required
                    disabled={isAdminLoading}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Пароль
                  </label>
                  <Input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Введите пароль"
                    required
                    disabled={isAdminLoading}
                  />
                </div>
                
                {adminError && (
                  <div className="text-red-600 text-sm">{adminError}</div>
                )}
                
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={isAdminLoading}
                    className="flex-1"
                  >
                    {isAdminLoading ? "Вход..." : "Войти"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAdminLogin(false)}
                    disabled={isAdminLoading}
                  >
                    Отмена
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CosmicHome;
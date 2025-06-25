import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import { ParticlesBackground } from "@/components/particles-background";
import { useQuery } from "@tanstack/react-query";
// Removed AppIntegrationTest import
import { screenshots } from "../screenshots";

export default function HomePage() {
  const [, setLocation] = useLocation();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState("");

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

  // Примеры скриншотов для демонстрации функционала платформы
  const platformScreenshots = [
    {
      id: "courses",
      title: "Каталог курсов",
      description: "Библиотека AI и Data Science курсов для всех уровней",
      image: screenshots.coursesCatalog,
      icon: "fa-book-open"
    },
    {
      id: "labhub",
      title: "LabHub",
      description: "Интерактивная лаборатория для практики ML и Data Science",
      image: screenshots.labhub,
      icon: "fa-flask"
    },
    {
      id: "business",
      title: "Business AI Module",
      description: "Внедрение ИИ-решений в бизнес-процессы",
      image: screenshots.businessAi,
      icon: "fa-briefcase"
    },
    {
      id: "profile",
      title: "Профиль пользователя",
      description: "Управление прогрессом, достижения и сертификаты",
      image: screenshots.profile,
      icon: "fa-user-graduate"
    }
  ];

  // Ключевые возможности платформы
  const keyFeatures = [
    {
      icon: "fa-dna",
      title: "Skills DNA",
      description: "Многоуровневая диагностика навыков с визуализацией на радарной диаграмме. Отслеживайте рост компетенций в реальном времени после каждого урока"
    },
    {
      icon: "fa-brain",
      title: "Умный подбор курсов",
      description: "ИИ анализирует ваш Skills DNA профиль и автоматически рекомендует оптимальные курсы для закрытия пробелов в знаниях"
    },
    {
      icon: "fa-chart-line",
      title: "Адаптивный прогресс",
      description: "Каждый завершенный урок мгновенно обновляет ваш Skills DNA. Видите влияние обучения на развитие навыков сразу"
    },
    {
      icon: "fa-robot",
      title: "ИИ-тьютор",
      description: "Персональный наставник на базе OpenAI GPT-4o помогает в изучении материала, отвечает на вопросы и дает подсказки 24/7"
    },
    {
      icon: "fa-flask",
      title: "LabHub",
      description: "Интерактивная лаборатория для практики ML и Data Science с реальными проектами и автоматической проверкой кода"
    },
    {
      icon: "fa-users",
      title: "Сообщество",
      description: "Telegram-канал с экспертами, новостями ИИ и возможностью общения с единомышленниками из мира технологий"
    }
  ];

  // Статистика платформы
  const stats = [
    { value: "30+", label: "Авторских курсов" },
    { value: "50k+", label: "Активных учеников" },
    { value: "96%", label: "Трудоустройство" },
    { value: "4.8", label: "Средняя оценка" }
  ];

  return (
    <div className="min-h-screen w-full bg-space-900 text-white overflow-x-hidden overflow-y-auto">
      <ParticlesBackground />
      {/* Header/Navigation */}
      <header className="w-full py-4 px-4 sm:px-6 backdrop-blur-sm bg-black/30 fixed top-0 z-50 fixed-header">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">NovaAI Academy</span>
          </div>
          <nav className="hidden md:flex gap-6 items-center">
            <a href="#features" className="text-white/70 hover:text-white transition-colors">Возможности</a>
            <a href="#courses" className="text-white/70 hover:text-white transition-colors">Курсы</a>
            <a href="#screenshots" className="text-white/70 hover:text-white transition-colors">Платформа</a>
            <a href="#testimonials" className="text-white/70 hover:text-white transition-colors">Отзывы</a>
          </nav>
          <div className="flex gap-2">
            <a href="/login" className="btn-mobile px-3 sm:px-4 py-2 rounded-lg border-2 border-white/30 hover:bg-white/10 active:bg-white/20 transition-all duration-150 text-white font-medium no-underline inline-block tap-highlight-none text-sm sm:text-base">
              Войти
            </a>
            <a href="/onboarding-intro" className="btn-mobile px-3 sm:px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 active:bg-primary/80 transition-all duration-150 text-white font-medium no-underline inline-block tap-highlight-none text-sm sm:text-base">
              Начать
            </a>
          </div>
        </div>
      </header>
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
              <motion.div 
                className="flex-1 w-full"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                  Освойте <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-secondary">искусственный интеллект</span> и стройте карьеру будущего
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-white/80 mb-6 sm:mb-8 max-w-xl">
                  NovaAI Academy — это <span className="font-bold text-white">преимущественно бесплатная</span> образовательная платформа для <span className="font-bold text-white">всех уровней</span> — от школьников до Senior-разработчиков, с адаптивной AI-системой обучения.
                </p>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  <a href="/onboarding-intro" className="inline-block py-2 sm:py-3 px-4 sm:px-8 text-base sm:text-lg rounded bg-primary hover:bg-primary/90 active:bg-primary/80 transition-colors text-white no-underline font-medium tap-highlight-none">
                    Начать бесплатно
                    <i className="fas fa-arrow-right ml-2"></i>
                  </a>
                  <a href="#screenshots" className="inline-block py-2 sm:py-3 px-4 sm:px-8 text-base sm:text-lg rounded border border-white/20 hover:bg-white/10 active:bg-white/20 transition-colors text-white no-underline font-medium tap-highlight-none">
                    Посмотреть демо
                    <i className="fas fa-desktop ml-2"></i>
                  </a>
                </div>
              </motion.div>
              <motion.div 
                className="flex-1 w-full mt-8 md:mt-0"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <Glassmorphism className="p-6 sm:p-8 md:p-10 rounded-xl backdrop-blur-md shadow-lg shadow-primary/20 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30 opacity-20"></div>
                  <div className="relative z-10 text-center">
                    <i className="fas fa-brain text-primary/70 text-5xl sm:text-6xl md:text-8xl mb-4 sm:mb-6 block"></i>
                    <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="bg-white/5 p-2 sm:p-3 rounded-lg">
                        <i className="fas fa-robot text-xl sm:text-2xl md:text-3xl text-secondary/70"></i>
                      </div>
                      <div className="bg-white/5 p-2 sm:p-3 rounded-lg">
                        <i className="fas fa-code text-xl sm:text-2xl md:text-3xl text-secondary/70"></i>
                      </div>
                      <div className="bg-white/5 p-2 sm:p-3 rounded-lg">
                        <i className="fas fa-chart-pie text-xl sm:text-2xl md:text-3xl text-secondary/70"></i>
                      </div>
                    </div>
                    <p className="text-sm sm:text-base md:text-xl text-white/80">Искусственный интеллект • Машинное обучение • Data Science</p>
                  </div>
                </Glassmorphism>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-8 sm:py-10 px-4 sm:px-6 bg-black/30 backdrop-blur-md">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-1 sm:mb-2">
                    {stat.value}
                  </p>
                  <p className="text-sm sm:text-base text-white/70">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6">
          <div className="container mx-auto">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Почему выбирают NovaAI </h2>
              <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
                Платформа с <span className="font-bold text-white">Skills DNA диагностикой</span> и <span className="font-bold text-white">умным подбором курсов</span> для персонализированного обучения ИИ
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {keyFeatures.map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Glassmorphism className="h-full p-4 sm:p-6 rounded-xl border border-white/5">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-3 sm:mb-4">
                      <i className={`fas ${feature.icon} text-xl sm:text-2xl`}></i>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{feature.title}</h3>
                    <p className="text-sm sm:text-base text-white/70">{feature.description}</p>
                  </Glassmorphism>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Courses Library Section */}
        <CourseCatalogSection />
        
        {/* Platform Demo */}
        <section className="py-12 px-6 bg-black/30">
          <div className="container mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Glassmorphism className="px-6 py-10 rounded-xl border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="max-w-lg">
                    <h2 className="text-3xl font-bold mb-6">
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Skills DNA</span> — ваш навигатор в мире ИИ
                    </h2>
                    <p className="text-white/80 text-lg mb-8">
                      NovaAI University создает персональную карту навыков Skills DNA, которая обновляется после каждого урока и автоматически подбирает оптимальные курсы для вашего роста.
                    </p>
                    <ul className="space-y-4 mb-8">
                      <li className="flex gap-3 items-start">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-1">
                          <i className="fas fa-dna text-sm"></i>
                        </div>
                        <p className="text-white/80"><span className="font-bold text-white">Skills DNA диагностика</span>: многоуровневая оценка навыков с визуализацией на радарной диаграмме</p>
                      </li>
                      <li className="flex gap-3 items-start">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-1">
                          <i className="fas fa-brain text-sm"></i>
                        </div>
                        <p className="text-white/80"><span className="font-bold text-white">Умный подбор курсов</span>: ИИ анализирует ваш профиль и рекомендует оптимальные курсы</p>
                      </li>
                      <li className="flex gap-3 items-start">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-1">
                          <i className="fas fa-chart-line text-sm"></i>
                        </div>
                        <p className="text-white/80"><span className="font-bold text-white">Живое обновление навыков</span>: Skills DNA обновляется после каждого завершенного урока</p>
                      </li>
                    </ul>
                    <a href="/onboarding-intro" className="inline-block py-2 px-6 rounded bg-primary hover:bg-primary/90 transition-colors text-white no-underline font-medium">
                      Создать Skills DNA профиль
                    </a>
                  </div>
                  <div className="relative overflow-hidden rounded-lg border border-white/10 bg-black/30 h-full flex items-center justify-center">
                    <div className="text-center p-8">
                      <i className="fas fa-dna text-6xl text-primary/60 mb-6 block"></i>
                      <h3 className="text-xl font-bold mb-4">Skills DNA в действии</h3>
                      <p className="text-white/70">Система анализирует ваши навыки и автоматически обновляет радарную диаграмму после каждого урока</p>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/0 pointer-events-none"></div>
                  </div>
                </div>
              </Glassmorphism>
            </motion.div>
          </div>
        </section>

        {/* Platform Screenshots */}
        <section id="screenshots" className="py-20 px-6 bg-black/20">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Взгляните на нашу платформу</h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Современный интерфейс и удобная навигация делают обучение комфортным и эффективным
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="overflow-hidden rounded-xl border border-white/10 h-full flex flex-col"
              >
                <div className="p-6 bg-black/50 backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <i className="fas fa-book-open text-2xl"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Каталог курсов</h3>
                      <p className="text-white/70">Библиотека AI и Data Science курсов для всех уровней</p>
                    </div>
                  </div>
                </div>
                <div className="bg-black/40 p-2 flex-grow">
                  <div className="rounded border border-white/10 bg-[#070218] p-4 h-full text-left">
                    <h3 className="text-xl font-semibold mb-2">Каталог курсов</h3>
                    <p className="text-gray-300 mb-6">Исследуйте нашу библиотеку курсов по AI и Data Science</p>
                    
                    <div className="w-full mb-6">
                      <div className="flex w-full gap-4">
                        <div className="flex-1 rounded bg-[#0A051F] p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 text-slate-500">
                              <i className="fas fa-search"></i>
                            </div>
                            <div className="text-slate-500 text-sm">Найти курс...</div>
                          </div>
                        </div>
                        
                        {/* Выпадающий список категорий */}
                        <div className="w-1/3 relative">
                          <select 
                            className="w-full appearance-none bg-[#0A051F] rounded p-3 text-white/70 border border-white/10 focus:outline-none focus:ring-1 focus:ring-primary"
                            style={{ 
                              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgba(255, 255, 255, 0.5)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                              backgroundRepeat: 'no-repeat',
                              backgroundPosition: 'right 1rem center',
                              backgroundSize: '1rem',
                              paddingRight: '2.5rem'
                            }}
                          >
                            <option value="">Все категории</option>
                            <option value="python">Python</option>
                            <option value="ml">Machine Learning</option>
                            <option value="dl">Deep Learning</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex gap-2">
                        <div className="px-2 py-1 bg-purple-800/30 rounded text-xs text-purple-300">
                          <i className="fas fa-hashtag mr-1"></i>Python
                        </div>
                        <div className="px-2 py-1 bg-blue-800/30 rounded text-xs text-blue-300">
                          <i className="fas fa-hashtag mr-1"></i>ML
                        </div>
                        <div className="px-2 py-1 bg-pink-800/30 rounded text-xs text-pink-300">
                          <i className="fas fa-hashtag mr-1"></i>Нейросети
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="rounded-lg bg-[#130A34] p-3">
                        <div className="w-12 h-12 rounded-lg bg-purple-600/70 mb-4 flex items-center justify-center text-white">
                          <i className="fas fa-brain text-xl"></i>
                        </div>
                        <div className="text-white text-sm font-medium mb-1">Основы нейронных сетей</div>
                        <div className="text-xs text-gray-400 mb-3">12 модулей • 8 недель</div>
                        <div className="w-full h-1.5 bg-slate-800/50 rounded-full mt-4">
                          <div className="w-3/4 h-1.5 bg-purple-600 rounded-full"></div>
                        </div>
                        <div className="text-right text-xs text-purple-400 mt-1">75%</div>
                      </div>
                      
                      <div className="rounded-lg bg-[#0B1F33] p-3">
                        <div className="w-12 h-12 rounded-lg bg-cyan-600/70 mb-4 flex items-center justify-center text-white">
                          <i className="fas fa-chart-line text-xl"></i>
                        </div>
                        <div className="text-white text-sm font-medium mb-1">Data Science на Python</div>
                        <div className="text-xs text-gray-400 mb-3">14 модулей • 10 недель</div>
                        <div className="w-full h-1.5 bg-slate-800/50 rounded-full mt-4">
                          <div className="w-1/2 h-1.5 bg-cyan-600 rounded-full"></div>
                        </div>
                        <div className="text-right text-xs text-cyan-400 mt-1">50%</div>
                      </div>
                      
                      <div className="rounded-lg bg-[#291627] p-3">
                        <div className="w-12 h-12 rounded-lg bg-pink-600/70 mb-4 flex items-center justify-center text-white">
                          <i className="fas fa-eye text-xl"></i>
                        </div>
                        <div className="text-white text-sm font-medium mb-1">Computer Vision</div>
                        <div className="text-xs text-gray-400 mb-3">16 модулей • 12 недель</div>
                        <div className="w-full h-1.5 bg-slate-800/50 rounded-full mt-4">
                          <div className="w-1/4 h-1.5 bg-pink-600 rounded-full"></div>
                        </div>
                        <div className="text-right text-xs text-pink-400 mt-1">25%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="overflow-hidden rounded-xl border border-white/10 h-full flex flex-col"
              >
                <div className="p-6 bg-black/50 backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <i className="fas fa-flask text-2xl"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">LabHub</h3>
                      <p className="text-white/70">Интерактивная лаборатория для практики ML и Data Science</p>
                    </div>
                  </div>
                </div>
                <div className="bg-black/40 p-2 flex-grow">
                  <div className="rounded border border-white/10 bg-[#070218] p-3 h-full text-left">
                    <h3 className="text-lg font-semibold text-purple-300 mb-2">LabHub</h3>
                    <p className="text-sm text-gray-300 mb-4">Интерактивная лаборатория для практики Data Science и ML</p>
                    
                    <div className="flex mb-4">
                      <div className="bg-slate-800/50 px-3 py-1 rounded-l-md border-r border-slate-700">Задания</div>
                      <div className="bg-slate-900/30 px-3 py-1 rounded-r-md">История</div>
                    </div>
                    
                    <h4 className="text-white font-medium mb-3">Доступные задания</h4>
                    
                    <div className="space-y-3">
                      <div className="rounded-lg border-l-4 border-l-violet-600 bg-[#0a0225] p-3">
                        <div className="flex justify-between mb-1">
                          <div className="font-medium">Линейная регрессия</div>
                          <div className="text-xs text-amber-400">Средняя</div>
                        </div>
                        <p className="text-xs text-gray-400 mb-3">Реализуйте алгоритм линейной регрессии...</p>
                        <div className="flex justify-between items-center">
                          <div className="text-xs text-gray-500">2-3 часа</div>
                          <div className="px-3 py-0.5 rounded bg-slate-800 text-xs">Начать</div>
                        </div>
                      </div>
                      
                      <div className="rounded-lg border-l-4 border-l-red-600 bg-[#0a0225] p-3">
                        <div className="flex justify-between mb-1">
                          <div className="font-medium">Анализ текстовых данных</div>
                          <div className="text-xs text-red-400">Сложная</div>
                        </div>
                        <p className="text-xs text-gray-400 mb-3">Используйте NLP-библиотеки для анализа...</p>
                        <div className="flex justify-between items-center">
                          <div className="text-xs text-gray-500">3-4 часа</div>
                          <div className="px-3 py-0.5 rounded bg-slate-800 text-xs">Начать</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="overflow-hidden rounded-xl border border-white/10 h-full flex flex-col"
              >
                <div className="p-6 bg-black/50 backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <i className="fas fa-briefcase text-2xl"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Business AI Module</h3>
                      <p className="text-white/70">Внедрение ИИ-решений в бизнес-процессы</p>
                    </div>
                  </div>
                </div>
                <div className="bg-black/40 p-2 flex-grow">
                  <div className="rounded border border-white/10 bg-[#070218] p-3 h-full text-left">
                    <h3 className="text-lg font-semibold text-blue-300 mb-2">Business AI Module</h3>
                    <p className="text-sm text-gray-300 mb-4">Внедрение ИИ-решений в бизнес-процессы</p>
                    
                    <div className="mb-4 bg-black/30 rounded-lg p-3">
                      <h4 className="text-white font-medium mb-2">Трансформируйте бизнес с помощью ИИ</h4>
                      <p className="text-xs text-gray-400 mb-3">Business AI Module поможет руководителям и продукт-менеджерам быстро определить, какие ИИ-решения из экосистемы NovaAI подойдут для бизнеса, оценить стоимость внедрения и рассчитать ожидаемый ROI.</p>
                      <div className="flex gap-2 mb-3">
                        <div className="px-3 py-1 rounded bg-blue-800/30 text-xs flex items-center gap-1">
                          <i className="fas fa-play-circle"></i>
                          <span>Смотреть видео-обзор (1 мин)</span>
                        </div>
                        <div className="px-3 py-1 rounded bg-slate-800/50 text-xs flex items-center gap-1">
                          <i className="fas fa-chart-bar"></i>
                          <span>Оценить готовность к ИИ</span>
                        </div>
                      </div>
                    </div>
                    
                    <h4 className="text-white text-sm font-medium mb-2">Карта применения ИИ по отраслям</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs">Финансы & FinTech</span>
                        <div className="w-1/2 bg-slate-800/30 rounded-full h-1.5">
                          <div className="bg-blue-500 h-1.5 rounded-full" style={{width: '85%'}}></div>
                        </div>
                        <span className="text-xs">85%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs">Розничная торговля</span>
                        <div className="w-1/2 bg-slate-800/30 rounded-full h-1.5">
                          <div className="bg-purple-500 h-1.5 rounded-full" style={{width: '75%'}}></div>
                        </div>
                        <span className="text-xs">75%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="overflow-hidden rounded-xl border border-white/10 h-full flex flex-col"
              >
                <div className="p-6 bg-black/50 backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <i className="fas fa-user-graduate text-2xl"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Профиль пользователя</h3>
                      <p className="text-white/70">Управление прогрессом, достижения и сертификаты</p>
                    </div>
                  </div>
                </div>
                <div className="bg-black/40 p-2 flex-grow">
                  <div className="rounded border border-white/10 bg-[#070218] p-3 h-full text-left">
                    <h3 className="text-lg font-semibold text-purple-300 mb-2">Профиль пользователя</h3>
                    <p className="text-sm text-gray-300 mb-4">Управление профилем, достижения и сертификаты</p>
                    
                    <div className="flex mb-4 bg-[#0a0225] rounded-md overflow-hidden">
                      <div className="bg-slate-800/50 px-3 py-1 rounded-l-md border-r border-slate-700">Обзор</div>
                      <div className="bg-slate-900/30 px-3 py-1">Сертификаты</div>
                      <div className="bg-slate-900/30 px-3 py-1">Курсы</div>
                      <div className="bg-slate-900/30 px-3 py-1 rounded-r-md">Достижения</div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="col-span-1">
                        <div className="w-20 h-20 rounded-full bg-slate-800/50 mx-auto mb-2"></div>
                        <div className="text-center text-sm font-medium">Анна</div>
                        <div className="text-center text-xs text-purple-300 mb-3">Преподаватель</div>
                        
                        <div className="flex justify-center gap-4 mb-3">
                          <div className="text-center">
                            <div className="text-sm">3</div>
                            <div className="text-xs text-gray-500">Курсы</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm">2</div>
                            <div className="text-xs text-gray-500">Сертификаты</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm">8</div>
                            <div className="text-xs text-gray-500">Бейджи</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-span-2 space-y-3">
                        <div className="bg-black/30 p-2 rounded">
                          <div className="text-sm font-medium mb-1">Обо мне</div>
                          <p className="text-xs text-gray-400">Data Scientist и ML-инженер с интересом к NLP и компьютерному зрению</p>
                        </div>
                        
                        <div className="bg-black/30 p-2 rounded">
                          <div className="text-sm font-medium mb-2">Общий прогресс</div>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex-grow h-1.5 bg-slate-800/50 rounded-full">
                              <div className="bg-purple-500 h-1.5 rounded-full w-[68%]"></div>
                            </div>
                            <div className="text-sm text-purple-400">68%</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20 px-6">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Отзывы наших студентов</h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Узнайте, что говорят люди, уже прошедшие обучение на NovaAI University
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Александр К.",
                  role: "Data Scientist в Яндекс",
                  text: "После прохождения курса по глубокому обучению я получил повышение и теперь работаю над реальными AI-проектами. Особенно ценны были практические задания и поддержка менторов."
                },
                {
                  name: "Мария П.",
                  role: "ML Engineer в Сбере",
                  text: "NovaAI University полностью изменил мою карьеру. За 6 месяцев я перешла из маркетинга в ML-разработку. Модульная система обучения позволила мне учиться в своем темпе."
                },
                {
                  name: "Дмитрий В.",
                  role: "Руководитель IT-отдела",
                  text: "Business AI Module помог нам оценить потенциал внедрения ИИ в нашу компанию. Расчет ROI и консультации экспертов сэкономили нам миллионы на разработке."
                }
              ].map((testimonial, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Glassmorphism className="h-full p-6 rounded-xl relative">
                    <div className="mb-4 text-4xl text-primary/30">
                      <i className="fas fa-quote-left"></i>
                    </div>
                    <p className="mb-6 text-white/80 italic">"{testimonial.text}"</p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <i className="fas fa-user text-primary"></i>
                      </div>
                      <div>
                        <p className="font-bold">{testimonial.name}</p>
                        <p className="text-white/60 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                  </Glassmorphism>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="container mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Glassmorphism className="p-10 md:p-16 rounded-xl border-t-4 border-t-primary text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Готовы начать свой путь в мир AI?
                </h2>
                <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                  Присоединяйтесь к сообществу из более чем 50,000 студентов и начните осваивать
                  искусственный интеллект уже сегодня.
                </p>
                <a href="/onboarding-intro" className="inline-block text-lg px-10 py-6 rounded bg-primary hover:bg-primary/90 active:bg-primary/80 transition-colors text-white no-underline font-medium">
                  Начать бесплатное обучение для всех уровней
                  <i className="fas fa-rocket ml-2"></i>
                </a>
              </Glassmorphism>
            </motion.div>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="py-10 px-6 bg-black/50 backdrop-blur-md">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div>
              <h3 className="text-xl font-bold mb-4">NovaAI Academy</h3>
              <p className="text-white/70 mb-4">
                Образовательная платформа нового поколения для изучения искусственного интеллекта и науки о данных.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-white/50 hover:text-white">
                  <i className="fab fa-telegram text-xl"></i>
                </a>
                <a href="#" className="text-white/50 hover:text-white">
                  <i className="fab fa-vk text-xl"></i>
                </a>
                <a href="#" className="text-white/50 hover:text-white">
                  <i className="fab fa-youtube text-xl"></i>
                </a>
                <a href="#" className="text-white/50 hover:text-white">
                  <i className="fab fa-github text-xl"></i>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4">Навигация</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white">Главная</a></li>
                <li><a href="#courses" className="hover:text-white">Курсы</a></li>
                <li><a href="#features" className="hover:text-white">Возможности</a></li>
                <li><a href="#testimonials" className="hover:text-white">Отзывы</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Курсы</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white">Python для Data Science</a></li>
                <li><a href="#" className="hover:text-white">Машинное обучение</a></li>
                <li><a href="#" className="hover:text-white">Глубокое обучение</a></li>
                <li><a href="#" className="hover:text-white">Computer Vision</a></li>
                <li><a href="#" className="hover:text-white">NLP и обработка текстов</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Контакты</h4>
              <ul className="space-y-2 text-white/70">
                <li><i className="fas fa-envelope mr-2"></i> support@novai.edu</li>
                <li><i className="fas fa-phone mr-2"></i> +7 (800) 555-35-35</li>
                <li><i className="fas fa-map-marker-alt mr-2"></i> Москва, Инновационный центр Сколково</li>
                <li>
                  <Link href="/presentation-selector" className="hover:text-white text-purple-300 font-medium">
                    <i className="fas fa-chart-line mr-2"></i>Для инвесторов
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-white/10 text-center text-white/50">
            <p>© 2025 NovaAI Academy. Все права защищены.</p>
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
}

// Type definitions
interface Course {
  id: number;
  title: string;
  description?: string;
  level?: string;
  duration?: number;
  slug?: string;
  moduleCount?: number;
  estimatedHours?: number;
  progress?: number;
}

// Course Catalog Section Component
function CourseCatalogSection() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Fetch courses data
  const { data: courses, isLoading } = useQuery({
    queryKey: ["/api/courses"],
    queryFn: async () => {
      const response = await fetch("/api/courses");
      if (!response.ok) throw new Error("Failed to fetch courses");
      return response.json();
    },
  });

  // Course categories for filtering
  const categories = [
    { id: "all", name: "Все курсы", icon: "fa-book-open" },
    { id: "ai", name: "Искусственный интеллект", icon: "fa-brain" },
    { id: "python", name: "Python", icon: "fa-code" },
    { id: "automation", name: "Автоматизация", icon: "fa-robot" },
    { id: "no-code", name: "No-Code", icon: "fa-magic" },
  ];

  // Get course level color and icon
  const getLevelInfo = (level: string | undefined) => {
    switch (level?.toLowerCase()) {
      case "beginner":
      case "начальный":
        return { color: "from-green-500 to-emerald-500", text: "Базовый" };
      case "intermediate":
      case "средний":
        return { color: "from-yellow-500 to-orange-500", text: "Средний" };
      case "advanced":
      case "продвинутый":
        return { color: "from-red-500 to-pink-500", text: "Эксперт" };
      default:
        return { color: "from-blue-500 to-purple-500", text: "Любой" };
    }
  };

  // Функции для получения реальных данных курсов
  const getModuleCount = (course: Course) => {
    // Реальные данные по модулям для каждого курса
    const moduleData: { [key: string]: number } = {
      "AI Literacy 101": 5,
      "Основы искусственного интеллекта": 5,
      "Python Basics": 8,
      "Основы Python": 8,
      "Prompt Engineering": 4,
      "Промпт-инжиниринг": 4,
      "Этика ИИ": 3,
      "No-Code AI": 8,
      "Создание Telegram-ботов на Replit без кода": 5,
      "Автоматизация Make.com+ChatGPT": 6
    };
    
    return moduleData[course.title] || course.moduleCount || Math.floor(Math.random() * 6) + 3;
  };

  const getEstimatedHours = (course: Course) => {
    // Реальные данные по времени для каждого курса
    const hoursData: { [key: string]: number } = {
      "AI Literacy 101": 12,
      "Основы искусственного интеллекта": 12,
      "Python Basics": 25,
      "Основы Python": 25,
      "Prompt Engineering": 8,
      "Промпт-инжиниринг": 8,
      "Этика ИИ": 6,
      "No-Code AI": 18,
      "Создание Telegram-ботов на Replit без кода": 15,
      "Автоматизация Make.com+ChatGPT": 20
    };
    
    return hoursData[course.title] || course.estimatedHours || Math.floor(Math.random() * 15) + 8;
  };

  const getCourseTags = (course: Course) => {
    // Реальные теги для каждого курса
    const courseTags: { [key: string]: string[] } = {
      "AI Literacy 101": ["Основы", "Теория", "Концепции"],
      "Основы искусственного интеллекта": ["Основы", "Теория", "Концепции"],
      "Python Basics": ["Программирование", "Практика", "Синтаксис"],
      "Основы Python": ["Программирование", "Практика", "Синтаксис"],
      "Prompt Engineering": ["GPT", "Промпты", "Оптимизация"],
      "Промпт-инжиниринг": ["GPT", "Промпты", "Оптимизация"],
      "Этика ИИ": ["Этика", "Ответственность", "Общество"],
      "No-Code AI": ["Автоматизация", "Интеграции", "API"],
      "Создание Telegram-ботов на Replit без кода": ["Боты", "Telegram", "Без кода"],
      "Автоматизация Make.com+ChatGPT": ["Make.com", "ChatGPT", "Воркфлоу"]
    };

    // Общие теги на основе категории
    const categoryTag = getCourseCategory(course.title, course.description);
    const defaultTags = {
      "ai": ["Машинное обучение", "Нейросети"],
      "python": ["Алгоритмы", "Данные"],
      "automation": ["Интеграции", "API"],
      "no-code": ["Визуальное программирование", "Инструменты"]
    };

    return courseTags[course.title] || defaultTags[categoryTag] || ["Технологии", "Обучение"];
  };

  // Get course category
  const getCourseCategory = (title: string, description: string | undefined) => {
    const text = `${title} ${description || ""}`.toLowerCase();
    if (text.includes("python")) return "python";
    if (text.includes("автоматизация") || text.includes("zapier") || text.includes("make")) return "automation";
    if (text.includes("no-code") || text.includes("без кода")) return "no-code";
    if (text.includes("ai") || text.includes("ии") || text.includes("нейрон") || text.includes("машинное")) return "ai";
    return "ai"; // default to AI category
  };

  // Filter courses by category
  const filteredCourses = courses?.filter((course: Course) => {
    if (selectedCategory === "all") return true;
    return getCourseCategory(course.title, course.description || "") === selectedCategory;
  }) || [];

  if (isLoading) {
    return (
      <section id="courses" className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-black/40 to-black/20">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin mx-auto"></div>
            <p className="text-white/70 mt-4">Загружаем библиотеку курсов...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="courses" className="py-16 sm:py-20 px-4 sm:px-6 bg-gradient-to-b from-black/40 to-black/20">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.h2 
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Библиотека <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">курсов</span>
          </motion.h2>
          <motion.p 
            className="text-lg sm:text-xl text-white/70 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Исследуйте нашу коллекцию образовательных курсов по искусственному интеллекту, программированию и инновационным технологиям
          </motion.p>
        </div>

        {/* Category Filter */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25"
                  : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            >
              <i className={`fas ${category.icon} mr-2`}></i>
              {category.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          <AnimatePresence mode="wait">
            {filteredCourses.map((course: Course, index: number) => {
              const levelInfo = getLevelInfo(course.level);
              
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <Glassmorphism className="h-full p-4 rounded-lg border border-white/10 bg-black/20 backdrop-blur-md overflow-hidden relative hover:border-primary/30 transition-all duration-300">
                    {/* Header with Category and Level */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-white/60 uppercase tracking-wider">
                        {categories.find(cat => cat.id === getCourseCategory(course.title, course.description))?.name || 'Общее'}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium bg-gradient-to-r ${levelInfo.color} whitespace-nowrap min-w-[70px] text-center flex-shrink-0`}>
                        {levelInfo.text}
                      </span>
                    </div>

                    {/* Course Title */}
                    <h3 className="text-lg font-bold mb-2 text-white group-hover:text-primary transition-colors duration-300 line-clamp-2">
                      {course.title}
                    </h3>

                    {/* Course Description */}
                    <p className="text-white/70 text-sm mb-3 line-clamp-2">
                      {course.description || "Изучите современные технологии и методики"}
                    </p>

                    {/* Course Stats - Compact */}
                    <div className="flex items-center justify-between text-xs text-white/60 mb-3">
                      <span>{getModuleCount(course)} модулей</span>
                      <span>{getEstimatedHours(course)} ч</span>
                    </div>

                    {/* Progress Bar (if available) */}
                    {course.progress !== undefined && course.progress > 0 && (
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-white/60">Прогресс</span>
                          <span className="text-xs text-primary">{course.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progress}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Course Tags */}
                    <div className="flex flex-wrap gap-1">
                      {getCourseTags(course).slice(0, 3).map((tag, tagIndex) => (
                        <span 
                          key={tagIndex}
                          className="px-1.5 py-0.5 bg-white/10 text-white/70 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Glassmorphism>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <i className="fas fa-search text-6xl text-white/30 mb-4"></i>
            <h3 className="text-xl font-bold text-white/70 mb-2">Курсы не найдены</h3>
            <p className="text-white/50">Попробуйте выбрать другую категорию</p>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-12 sm:mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p className="text-white/70 mb-6">Не нашли подходящий курс?</p>
          <a 
            href="/onboarding-intro" 
            className="inline-flex items-center py-3 px-8 rounded-lg border-2 border-primary/50 hover:bg-primary/10 text-primary font-medium transition-all duration-300 hover:border-primary"
          >
            Пройти диагностику навыков
            <i className="fas fa-chart-pie ml-2"></i>
          </a>
        </motion.div>
      </div>
    </section>
  );
}


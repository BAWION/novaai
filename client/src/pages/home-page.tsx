import React from "react";
import { motion } from "framer-motion";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ParticlesBackground } from "@/components/particles-background";
import { screenshots } from "../screenshots";

export default function HomePage() {

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
      icon: "fa-graduation-cap",
      title: "Персонализированное обучение",
      description: "AI-система подбирает оптимальный путь обучения на основе ваших целей и опыта"
    },
    {
      icon: "fa-laptop-code",
      title: "Практические задания",
      description: "Интерактивные лаборатории с автоматической проверкой решений и мгновенной обратной связью"
    },
    {
      icon: "fa-certificate",
      title: "NFT сертификаты",
      description: "Подтверждение квалификации с помощью защищенных от подделки сертификатов на блокчейне"
    },
    {
      icon: "fa-users",
      title: "Сообщество специалистов",
      description: "Общение с единомышленниками, участие в хакатонах и совместная работа над проектами"
    },
    {
      icon: "fa-rocket",
      title: "Карьерная поддержка",
      description: "Трудоустройство в компании-партнеры и помощь в построении карьеры в AI и Data Science"
    },
    {
      icon: "fa-briefcase",
      title: "Business AI Module",
      description: "Инструменты для внедрения ИИ в бизнес-процессы и расчета ROI"
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
    <div className="min-h-screen w-full bg-space-900 text-white overflow-hidden">
      <ParticlesBackground />
      
      {/* Header/Navigation */}
      <header className="w-full py-4 px-6 backdrop-blur-sm bg-black/30 fixed top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              NovaAI University
            </span>
          </div>
          <nav className="hidden md:flex gap-6 items-center">
            <a href="#features" className="text-white/70 hover:text-white transition-colors">Возможности</a>
            <a href="#courses" className="text-white/70 hover:text-white transition-colors">Курсы</a>
            <a href="#screenshots" className="text-white/70 hover:text-white transition-colors">Платформа</a>
            <a href="#testimonials" className="text-white/70 hover:text-white transition-colors">Отзывы</a>
          </nav>
          <div className="flex gap-4">
            <a href="/login" className="inline-block">
              <Button variant="outline" type="button" className="pointer-events-auto">Войти</Button>
            </a>
            <a href="/onboarding" className="inline-block">
              <Button type="button" className="pointer-events-auto">Начать обучение</Button>
            </a>
          </div>
        </div>
      </header>

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 md:py-32 px-6">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <motion.div 
                className="flex-1"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Освойте <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-secondary">искусственный интеллект</span> и стройте карьеру будущего
                </h1>
                <p className="text-xl text-white/80 mb-8 max-w-xl">
                  NovaAI University — это современная образовательная платформа с адаптивной системой обучения и практическими лабораториями для освоения AI и Data Science.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a href="/onboarding" className="inline-block">
                    <Button size="lg" type="button" className="text-lg px-8 pointer-events-auto">
                      Начать бесплатно
                      <i className="fas fa-arrow-right ml-2"></i>
                    </Button>
                  </a>
                  <a href="#screenshots">
                    <Button size="lg" variant="outline" className="text-lg px-8">
                      Посмотреть демо
                      <i className="fas fa-desktop ml-2"></i>
                    </Button>
                  </a>
                </div>
              </motion.div>
              <motion.div 
                className="flex-1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                <Glassmorphism className="p-10 rounded-xl backdrop-blur-md shadow-lg shadow-primary/20 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30 opacity-20"></div>
                  <div className="relative z-10 text-center">
                    <i className="fas fa-brain text-primary/70 text-8xl mb-6 block"></i>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-white/5 p-3 rounded-lg">
                        <i className="fas fa-robot text-3xl text-secondary/70"></i>
                      </div>
                      <div className="bg-white/5 p-3 rounded-lg">
                        <i className="fas fa-code text-3xl text-secondary/70"></i>
                      </div>
                      <div className="bg-white/5 p-3 rounded-lg">
                        <i className="fas fa-chart-pie text-3xl text-secondary/70"></i>
                      </div>
                    </div>
                    <p className="text-xl text-white/80">Искусственный интеллект • Машинное обучение • Data Science</p>
                  </div>
                </Glassmorphism>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-10 px-6 bg-black/30 backdrop-blur-md">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <p className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-2">
                    {stat.value}
                  </p>
                  <p className="text-white/70">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-6">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Почему выбирают NovaAI University</h2>
              <p className="text-xl text-white/70 max-w-2xl mx-auto">
                Инновационный подход к обучению искусственному интеллекту, сочетающий теорию с практикой
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {keyFeatures.map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Glassmorphism className="h-full p-6 rounded-xl border border-white/5">
                    <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4">
                      <i className={`fas ${feature.icon} text-2xl`}></i>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-white/70">{feature.description}</p>
                  </Glassmorphism>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

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
                      Ваш персональный путь <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">в мир AI</span>
                    </h2>
                    <p className="text-white/80 text-lg mb-8">
                      NovaAI University создает персонализированный маршрут обучения на основе ваших целей, опыта и темпа обучения.
                    </p>
                    <ul className="space-y-4 mb-8">
                      <li className="flex gap-3 items-start">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-1">
                          <i className="fas fa-check text-sm"></i>
                        </div>
                        <p className="text-white/80">Интерактивные дашборды для отслеживания прогресса</p>
                      </li>
                      <li className="flex gap-3 items-start">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-1">
                          <i className="fas fa-check text-sm"></i>
                        </div>
                        <p className="text-white/80">AI-подбор курсов на основе ваших целей и опыта</p>
                      </li>
                      <li className="flex gap-3 items-start">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0 mt-1">
                          <i className="fas fa-check text-sm"></i>
                        </div>
                        <p className="text-white/80">Визуализация прогресса в освоении навыков</p>
                      </li>
                    </ul>
                    <a href="/onboarding" className="inline-block">
                      <Button type="button" className="pointer-events-auto">Персонализировать свой путь</Button>
                    </a>
                  </div>
                  <div className="relative overflow-hidden rounded-lg border border-white/10 bg-black/30 h-full flex items-center justify-center">
                    <div className="text-center p-8">
                      <i className="fas fa-chart-line text-6xl text-primary/60 mb-6 block"></i>
                      <h3 className="text-xl font-bold mb-4">Адаптивное обучение</h3>
                      <p className="text-white/70">Платформа формирует индивидуальную траекторию обучения и рекомендует наиболее релевантные курсы</p>
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
                <Link href="/onboarding">
                  <Button size="lg" className="text-lg px-10 py-6">
                    Начать бесплатное обучение
                    <i className="fas fa-rocket ml-2"></i>
                  </Button>
                </Link>
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
              <h3 className="text-xl font-bold mb-4">NovaAI University</h3>
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
              </ul>
            </div>
          </div>
          <div className="pt-6 border-t border-white/10 text-center text-white/50">
            <p>© 2025 NovaAI University. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
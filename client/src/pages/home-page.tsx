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
            <Link href="/login">
              <Button variant="outline">Войти</Button>
            </Link>
            <Link href="/onboarding">
              <Button>Начать обучение</Button>
            </Link>
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
                  <Link href="/onboarding">
                    <Button size="lg" className="text-lg px-8">
                      Начать бесплатно
                      <i className="fas fa-arrow-right ml-2"></i>
                    </Button>
                  </Link>
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
                    <Link href="/onboarding">
                      <Button>Персонализировать свой путь</Button>
                    </Link>
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
                <div className="bg-black/40 p-2 flex-grow overflow-hidden">
                  <img 
                    src="/screenshots_new/courses-catalog.png" 
                    alt="Каталог курсов NovaAI" 
                    className="w-full h-auto rounded border border-white/10"
                  />
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
                <div className="bg-black/40 p-2 flex-grow overflow-hidden">
                  <img 
                    src="/screenshots_new/labhub.png" 
                    alt="LabHub - Интерактивная лаборатория" 
                    className="w-full h-auto rounded border border-white/10"
                  />
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
                <div className="bg-black/40 p-2 flex-grow overflow-hidden">
                  <img 
                    src="/screenshots_new/business-ai.png" 
                    alt="Business AI Module" 
                    className="w-full h-auto rounded border border-white/10"
                  />
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
                <div className="bg-black/40 p-2 flex-grow overflow-hidden">
                  <img 
                    src="/screenshots_new/profile.png" 
                    alt="Профиль пользователя" 
                    className="w-full h-auto rounded border border-white/10"
                  />
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
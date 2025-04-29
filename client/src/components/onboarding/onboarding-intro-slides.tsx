import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface OnboardingIntroSlidesProps {
  currentSlide: number;
}

/**
 * Компонент слайдов для введения в онбординг
 * Объясняет пользователю ценность диагностики и что его ждет дальше
 */
export function OnboardingIntroSlides({ currentSlide }: OnboardingIntroSlidesProps) {
  const slides = [
    // Слайд 1: Приветствие и объяснение ценности диагностики
    {
      title: "Добро пожаловать в систему персонализированного обучения",
      content: (
        <div className="space-y-4">
          <p className="text-lg text-white/80">
            Мы рады приветствовать вас в NovaAI University - платформе, где искусственный интеллект адаптирует образовательный контент под ваши потребности.
          </p>
          <p className="text-lg text-white/80">
            Прежде чем начать, мы проведем <span className="text-primary font-medium">быструю диагностику ваших навыков и целей</span>, чтобы создать идеально подходящий для вас учебный план.
          </p>
          <div className="bg-primary/10 p-4 rounded-lg border border-primary/20 mt-6">
            <h3 className="text-primary flex items-center gap-2 mb-2">
              <i className="fas fa-lightbulb"></i>
              <span>Почему это важно?</span>
            </h3>
            <p className="text-white/80">
              Благодаря диагностике мы сможем точно определить, какие курсы и материалы будут наиболее полезны именно для вас, экономя ваше время на поиске подходящего контента.
            </p>
          </div>
        </div>
      ),
      icon: "fas fa-user-check",
    },
    
    // Слайд 2: Объяснение процесса диагностики
    {
      title: "Как работает диагностика",
      content: (
        <div className="space-y-4">
          <p className="text-lg text-white/80">
            Процесс диагностики состоит из нескольких простых шагов:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
            <div className="bg-space-800/50 border border-white/10 p-4 rounded-lg flex flex-col">
              <div className="flex gap-3 items-center mb-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 flex-shrink-0">
                  <span className="font-bold">1</span>
                </div>
                <h3 className="font-medium">Базовая информация</h3>
              </div>
              <p className="text-white/70 text-sm flex-grow">
                Расскажите нам о своей роли, опыте и целях в изучении ИИ и Data Science
              </p>
            </div>
            
            <div className="bg-space-800/50 border border-white/10 p-4 rounded-lg flex flex-col">
              <div className="flex gap-3 items-center mb-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 flex-shrink-0">
                  <span className="font-bold">2</span>
                </div>
                <h3 className="font-medium">Интересы</h3>
              </div>
              <p className="text-white/70 text-sm flex-grow">
                Выберите области ИИ и Data Science, которые вам наиболее интересны
              </p>
            </div>
            
            <div className="bg-space-800/50 border border-white/10 p-4 rounded-lg flex flex-col">
              <div className="flex gap-3 items-center mb-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 flex-shrink-0">
                  <span className="font-bold">3</span>
                </div>
                <h3 className="font-medium">Технические навыки</h3>
              </div>
              <p className="text-white/70 text-sm flex-grow">
                Расскажите о своем текущем уровне в Python и Machine Learning
              </p>
            </div>
            
            <div className="bg-space-800/50 border border-white/10 p-4 rounded-lg flex flex-col">
              <div className="flex gap-3 items-center mb-3">
                <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-400 flex-shrink-0">
                  <span className="font-bold">4</span>
                </div>
                <h3 className="font-medium">Карьерные цели</h3>
              </div>
              <p className="text-white/70 text-sm flex-grow">
                Определите, каких результатов вы хотите достичь с помощью обучения
              </p>
            </div>
          </div>
        </div>
      ),
      icon: "fas fa-clipboard-list",
    },
    
    // Слайд 3: Что происходит с данными диагностики
    {
      title: "Что мы делаем с вашими данными",
      content: (
        <div className="space-y-4">
          <p className="text-lg text-white/80">
            После заполнения формы, наша AI-система:
          </p>
          
          <div className="space-y-5 mt-5">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                <i className="fas fa-brain text-xl"></i>
              </div>
              <div>
                <h3 className="font-medium text-lg mb-1">Анализирует ваш профиль</h3>
                <p className="text-white/70">
                  Искусственный интеллект обрабатывает ваши ответы, определяя оптимальную точку входа в обучение и перспективные направления развития
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                <i className="fas fa-route text-xl"></i>
              </div>
              <div>
                <h3 className="font-medium text-lg mb-1">Создает персональную траекторию</h3>
                <p className="text-white/70">
                  На основе анализа формируется индивидуальный учебный план, включающий подходящие курсы в оптимальной последовательности
                </p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 flex-shrink-0">
                <i className="fas fa-shield-alt text-xl"></i>
              </div>
              <div>
                <h3 className="font-medium text-lg mb-1">Защищает конфиденциальность</h3>
                <p className="text-white/70">
                  Ваши данные используются исключительно для образовательных целей и рекомендаций. Мы не передаем их третьим лицам
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
      icon: "fas fa-lock",
    },
    
    // Слайд 4: Что будет после диагностики
    {
      title: "Что будет после диагностики",
      content: (
        <div className="space-y-4">
          <p className="text-lg text-white/80">
            После завершения диагностики вы получите:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-gradient-to-br from-primary/20 to-purple-500/20 p-5 rounded-lg border border-primary/20">
              <i className="fas fa-compass text-primary text-3xl mb-4"></i>
              <h3 className="text-lg font-medium mb-2">Персональные рекомендации</h3>
              <p className="text-white/70">
                Подборка курсов, наиболее соответствующих вашему уровню и целям
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-5 rounded-lg border border-blue-500/20">
              <i className="fas fa-map text-blue-400 text-3xl mb-4"></i>
              <h3 className="text-lg font-medium mb-2">Карту развития навыков</h3>
              <p className="text-white/70">
                Визуализацию вашего учебного пути с отметками ключевых навыков
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 p-5 rounded-lg border border-amber-500/20">
              <i className="fas fa-graduation-cap text-amber-400 text-3xl mb-4"></i>
              <h3 className="text-lg font-medium mb-2">Доступ к платформе</h3>
              <p className="text-white/70">
                После регистрации вы получите полный доступ к рекомендованным курсам и материалам
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-green-500/20 to-teal-500/20 p-5 rounded-lg border border-green-500/20">
              <i className="fas fa-robot text-green-400 text-3xl mb-4"></i>
              <h3 className="text-lg font-medium mb-2">AI-ассистента</h3>
              <p className="text-white/70">
                Персонального помощника, который будет сопровождать вас на всех этапах обучения
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <p className="text-xl font-medium text-white/90">
              Готовы начать свой персонализированный путь в мир AI?
            </p>
            <p className="text-white/70 mt-2">
              Нажмите "Начать диагностику", чтобы перейти к форме
            </p>
          </div>
        </div>
      ),
      icon: "fas fa-rocket",
    },
  ];

  return (
    <AnimatePresence mode="wait">
      {slides.map((slide, index) => (
        index === currentSlide && (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                <i className={`${slide.icon} text-xl`}></i>
              </div>
              <h2 className="text-2xl font-medium text-white">{slide.title}</h2>
            </div>
            
            <div className="text-white/80">
              {slide.content}
            </div>
          </motion.div>
        )
      ))}
    </AnimatePresence>
  );
}
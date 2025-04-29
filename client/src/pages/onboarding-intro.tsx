import React, { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { OnboardingIntroSlides } from "@/components/onboarding/onboarding-intro-slides";
import { Button } from "@/components/ui/button";

/**
 * Страница введения в онбординг (Путь 1)
 * Показывает пользователю краткое объяснение процесса диагностики
 * и направляет его на страницу с формой онбординга
 */
export default function OnboardingIntro() {
  const [, setLocation] = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 4; // Общее количество слайдов в презентации

  // Переход к следующему слайду
  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      // Если все слайды просмотрены, переходим на страницу онбординга
      startOnboarding();
    }
  };

  // Переход к предыдущему слайду
  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  // Начало процесса онбординга
  const startOnboarding = () => {
    setLocation("/deep-diagnosis");
  };

  // Пропустить вступление
  const skipIntro = () => {
    startOnboarding();
  };

  return (
    <div 
      className="relative min-h-screen bg-space-950 bg-no-repeat bg-cover bg-center overflow-hidden"
      style={{ 
        backgroundImage: "radial-gradient(circle at 50% 50%, rgba(110, 58, 255, 0.1) 0%, rgba(21, 26, 48, 0) 70%)"
      }}
    >
      {/* Фоновые элементы */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>
      
      {/* Верхний блок с логотипом и названием */}
      <header className="pt-10 pb-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-[#B28DFF] via-[#8BE0F7] to-[#B28DFF]">
            NovaAI University
          </h1>
          <p className="text-white/60 mt-2">
            Персонализированный AI-опыт обучения
          </p>
        </motion.div>
      </header>
      
      {/* Основной контент */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-space-900/40 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
            {/* Верхний блок с индикаторами слайдов */}
            <div className="p-6 flex justify-between items-center border-b border-white/10">
              <h2 className="text-xl font-semibold text-white/90">Познакомьтесь с нашей платформой</h2>
              <div className="flex gap-1.5">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <div 
                    key={index}
                    className={`h-1.5 rounded-full ${index === currentSlide ? 'w-6 bg-primary' : 'w-3 bg-white/20'}`}
                  />
                ))}
              </div>
            </div>
            
            {/* Слайды с контентом */}
            <div className="p-6 min-h-[400px]">
              <OnboardingIntroSlides currentSlide={currentSlide} />
            </div>
            
            {/* Нижний блок с кнопками */}
            <div className="p-6 flex justify-between items-center border-t border-white/10">
              <div>
                {currentSlide > 0 && (
                  <Button variant="outline" onClick={prevSlide}>
                    <i className="fas fa-arrow-left mr-2"></i> Назад
                  </Button>
                )}
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={skipIntro}>
                  Пропустить
                </Button>
                <Button onClick={nextSlide}>
                  {currentSlide < totalSlides - 1 ? 'Далее' : 'Начать диагностику'} 
                  <i className="fas fa-arrow-right ml-2"></i>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
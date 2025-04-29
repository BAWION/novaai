import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { OnboardingIntroSlides } from "@/components/onboarding/onboarding-intro-slides";
import { ParticlesBackground } from "@/components/particles-background";
import { useAuth } from "@/context/auth-context";

export default function OnboardingIntro() {
  const [location, setLocation] = useLocation();
  const [showIntroSlides, setShowIntroSlides] = useState(true);
  const { isAuthenticated, user } = useAuth();

  // Если пользователь авторизован, проверяем, нужно ли перенаправить его
  // на дашборд (если уже прошел онбординг) или на страницу онбординга
  useEffect(() => {
    if (isAuthenticated && user) {
      // В будущем здесь можно проверить, прошел ли пользователь онбординг
      // Если да - перенаправить на dashboard
      // Если нет - перенаправить на onboarding-page
      // console.log("Пользователь уже авторизован");
    }
  }, [isAuthenticated, user, setLocation]);

  // Обработчик завершения слайдов
  const handleIntroComplete = () => {
    // Перенаправляем на страницу онбординга
    setLocation("/onboarding-page");
  };

  return (
    <div className="min-h-screen bg-space-900 flex items-center justify-center">
      <ParticlesBackground />
      
      {/* Фоновый контент для красоты, пока открыты слайды */}
      <motion.div 
        className="container mx-auto px-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-[#B28DFF] via-[#8BE0F7] to-[#B28DFF]">
          NovaAI University
        </h1>
        <p className="text-xl text-white/70 mt-4 max-w-xl mx-auto">
          Персонализированная образовательная платформа на основе искусственного интеллекта
        </p>
      </motion.div>

      {/* Модальные окна с вводной информацией */}
      <OnboardingIntroSlides 
        isOpen={showIntroSlides}
        onOpenChange={setShowIntroSlides}
        onComplete={handleIntroComplete}
      />
    </div>
  );
}
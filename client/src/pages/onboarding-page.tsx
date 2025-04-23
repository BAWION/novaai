import React, { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useUserProfile } from "@/context/user-profile-context";
import { useAuth } from "@/context/auth-context";
import { ExtendedOnboardingForm } from "@/components/onboarding/extended-onboarding-form";
import { RecommendationsDisplay } from "@/components/onboarding/recommendations-display";

/**
 * Страница расширенного онбординга
 * Направляет пользователя через форму сбора данных профиля
 * и отображает рекомендации по завершении
 */
export default function OnboardingPage() {
  const { userProfile, updateUserProfile } = useUserProfile();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [completedOnboarding, setCompletedOnboarding] = useState(false);
  const [recommendedCourseIds, setRecommendedCourseIds] = useState<number[]>([]);
  
  // ID пользователя из authContext или 0 для анонимного пользователя
  const userId = user?.id || 0;
  
  // Проверяем, если пользователь аутентифицирован и уже прошел онбординг
  // Обратите внимание, что эта проверка сработает только для аутентифицированных пользователей
  if (userId > 0 && userProfile && userProfile.hasOwnProperty('completedOnboarding') && 
      (userProfile as any).completedOnboarding && !completedOnboarding) {
    setLocation("/dashboard");
    return null;
  }
  
  // Обработчик завершения онбординга
  const handleOnboardingComplete = (courseIds: number[]) => {
    // Обновляем локально состояние
    setCompletedOnboarding(true);
    setRecommendedCourseIds(courseIds);
    
    // Если пользователь авторизован, обновляем данные в профиле
    if (userId > 0 && userProfile) {
      // Обновляем профиль, отмечая что онбординг пройден
      updateUserProfile({
        ...userProfile,
        completedOnboarding: true
      });
    }
  };
  
  // Обработчик для быстрого старта курса
  const handleQuickStart = (courseId: number) => {
    setLocation(`/courses/${courseId}`);
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
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* Левая колонка (форма или рекомендации) */}
          <div className="lg:w-3/5 w-full">
            {!completedOnboarding ? (
              <ExtendedOnboardingForm 
                userId={userId} 
                defaultValues={userProfile ? {
                  role: userProfile.role as any,
                  pythonLevel: userProfile.pythonLevel,
                  experience: userProfile.experience as any,
                  interest: userProfile.interest as any,
                  goal: userProfile.goal as any,
                } : undefined}
                onComplete={handleOnboardingComplete}
              />
            ) : (
              <RecommendationsDisplay 
                courseIds={recommendedCourseIds}
                onQuickStart={handleQuickStart}
              />
            )}
          </div>
          
          {/* Правая колонка (информация) */}
          <div className="lg:w-2/5 w-full">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-space-900/50 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <h2 className="text-xl font-semibold mb-4 text-white/90">Почему это важно?</h2>
                
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="p-2 rounded-lg bg-primary/20 text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.04Z"/>
                        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.04Z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Персонализированный опыт</h3>
                      <p className="text-sm text-white/60 mt-1">
                        Ваши ответы помогают нам настроить образовательный путь и 
                        подобрать курсы, которые идеально подходят для ваших целей.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Адаптивное обучение</h3>
                      <p className="text-sm text-white/60 mt-1">
                        Наш AI-движок учитывает ваш уровень, интересы и цели,
                        чтобы адаптировать контент и создать оптимальный путь обучения.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2v8"/>
                        <path d="m4.93 10.93 1.41 1.41"/>
                        <path d="M2 18h2"/>
                        <path d="M20 18h2"/>
                        <path d="m19.07 10.93-1.41 1.41"/>
                        <path d="M22 22H2"/>
                        <path d="m16 6-4 4-4-4"/>
                        <path d="M16 18a4 4 0 0 0-8 0"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium">Экономия времени</h3>
                      <p className="text-sm text-white/60 mt-1">
                        Быстрый доступ к релевантному контенту без необходимости 
                        самостоятельного поиска через весь каталог курсов.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-green-500/10 rounded-lg">
                  <h3 className="text-green-400 font-medium mb-2">Ваши данные в безопасности</h3>
                  <p className="text-sm text-white/70">
                    Мы используем ваши ответы исключительно для улучшения вашего 
                    образовательного опыта. Ваша информация не передается третьим лицам.
                  </p>
                </div>
              </div>
            </motion.div>
            
            {!completedOnboarding && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-6 bg-space-900/50 backdrop-blur-sm rounded-xl p-6 border border-white/10"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 8v4"/>
                      <path d="M12 16h.01"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Вы всегда можете изменить эти настройки</h3>
                    <p className="text-sm text-white/60 mt-1">
                      Все параметры доступны в вашем профиле и могут быть 
                      обновлены в любое время для корректировки рекомендаций.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
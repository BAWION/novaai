import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { OrbitalLayout } from "@/components/orbital-layout";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { useUserProfile } from "@/context/user-profile-context";
import { useAuth } from "@/context/auth-context";
import { apiRequest } from "@/lib/queryClient";
import { Link, useLocation } from "wouter";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LearningTimeline } from "@/components/progress/learning-timeline";
import { default as SkillProgress } from "@/components/progress/skill-progress";
import { WelcomeModal } from "@/components/onboarding/welcome-modal";
import { CompactSkillsDnaCard } from "@/components/skills-dna";
import { SkillsDnaProfile } from "@/components/skills-dna-profile";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const { userProfile, updateUserProfile } = useUserProfile();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [showOnboardingPrompt, setShowOnboardingPrompt] = useState(true);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  
  // Определяем, находимся ли мы в демо-режиме
  const isDemoMode = userProfile?.userId === 999 || !user; // Считаем неавторизованных пользователей как демо
  const demoUserId = 999;
  
  // Получение рекомендуемых курсов с учетом демо-режима
  const { data: recommendedCourses = [] } = useQuery({
    queryKey: ['/api/courses/recommended', isDemoMode ? demoUserId : user?.id],
    queryFn: async () => {
      try {
        // Формируем URL с параметром userId для демо-режима
        const endpoint = isDemoMode 
          ? `/api/courses/recommended?userId=${demoUserId}` 
          : '/api/courses/recommended';
          
        console.log(`[Dashboard] Запрос рекомендаций, демо-режим: ${isDemoMode}, endpoint: ${endpoint}`);
        
        const res = await apiRequest('GET', endpoint);
        if (!res.ok) {
          console.error(`[Dashboard] Ошибка при загрузке рекомендуемых курсов: ${res.status}`);
          throw new Error('Ошибка при загрузке рекомендуемых курсов');
        }
        const data = await res.json();
        console.log(`[Dashboard] Получены рекомендации: ${data.length} курсов`);
        return data;
      } catch (error) {
        console.error('Ошибка при загрузке рекомендуемых курсов:', error);
        // Возвращаем пустой массив при ошибке
        return [];
      }
    },
    // Если пользователь не авторизован, используем демо-данные
    enabled: !!user
  });

  // Настройки для компонентов и состояний интерфейса
  const [viewMode, setViewMode] = useState('orbital');
  const [currentModule, setCurrentModule] = useState(1);
  
  // Данные прогресса обучения (позже заменим на данные из API)
  const [userLevel, setUserLevel] = useState({
    level: 2,
    title: "Искатель",
    progress: 65,
    nextMilestone: "Закончить модуль 'Введение в нейронные сети'"
  });
  
  // Совет от ИИ
  const [aiAdvice, setAiAdvice] = useState({
    content: "Рекомендую добавить больше практики по градиентному спуску и использовать интерактивные задания."
  });
  
  // Данные для секции адаптивного ИИ
  const [adaptiveAIData, setAdaptiveAIData] = useState({
    currentTrajectory: {
      title: "Индивидуальная траектория ИИ инженера",
      adjustments: [
        {
          date: "Сегодня",
          change: "Добавлен новый модуль по трансформерам",
          reason: "Обнаружен интерес к обработке естественного языка"
        },
        {
          date: "3 дня назад",
          change: "Увеличен уровень сложности задач по Python",
          reason: "Высокие результаты тестирования (92%)"
        }
      ]
    }
  });

  // Возвращаем основной компонент дашборда с размещенными виджетами
  return (
    <DashboardLayout>
      <div className="container max-w-screen-2xl mx-auto px-4 lg:px-8 py-8">
        {/* Верхняя секция с профилем и рекомендациями */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Skills DNA - Left side */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Glassmorphism className="h-full rounded-xl overflow-hidden border border-purple-500/30 p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600/40 to-purple-700/20 flex items-center justify-center">
                  <i className="fas fa-brain text-purple-300"></i>
                </div>
                <h2 className="font-orbitron text-xl font-semibold ml-3">
                  Skills DNA
                </h2>
              </div>
              <CompactSkillsDnaCard showHeader={false} className="bg-transparent border-0" />
            </Glassmorphism>
          </motion.div>

          {/* Recommended Courses - Right side */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full"
          >
            <Glassmorphism className="h-full rounded-xl overflow-hidden border border-indigo-500/30 p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600/40 to-indigo-700/20 flex items-center justify-center">
                  <i className="fas fa-book text-indigo-300"></i>
                </div>
                <h2 className="font-orbitron text-xl font-semibold ml-3">
                  Рекомендуемые курсы
                </h2>
              </div>
              
              <div className="space-y-4">
                {recommendedCourses.length > 0 ? (
                  // Показываем список курсов, если есть рекомендации
                  recommendedCourses.slice(0, 2).map((course: any) => (
                    <div 
                      key={course.id}
                      className="bg-space-900/50 hover:bg-space-900/70 border border-space-700 rounded-lg p-4 transition-all cursor-pointer"
                      onClick={() => setLocation(`/courses/${course.id}`)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 text-xs rounded-md ${
                              course.matchPercentage && course.matchPercentage > 90 
                                ? 'bg-green-500/20 text-green-300' 
                                : course.matchPercentage && course.matchPercentage > 75
                                  ? 'bg-yellow-500/20 text-yellow-300'
                                  : 'bg-blue-500/20 text-blue-300'
                            }`}>
                              {course.matchPercentage ? `${course.matchPercentage}% совпадение` : '95% совпадение'}
                            </span>
                            
                            <span className="text-xs px-1.5 py-0.5 bg-space-800 rounded text-white/60">
                              Уровень {course.level || 1}
                            </span>
                          </div>
                          
                          <h3 className="font-medium text-white mt-2">{course.title}</h3>
                          <p className="text-sm text-white/70 mt-1 line-clamp-2">{course.description}</p>
                          
                          <div className="flex flex-wrap items-center gap-3 mt-3">
                            <div className="flex items-center gap-1.5">
                              <i className="fas fa-signal text-white/60"></i>
                              <span className="text-white/60 text-xs">Сложность: {course.level || 1}/5</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <i className="fas fa-clock text-white/60"></i>
                              <span className="text-white/60 text-xs">120 мин</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <i className="fas fa-layer-group text-white/60"></i>
                              <span className="text-white/60 text-xs">5 модулей</span>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <span className="text-purple-400 text-xs">Почему подходит:</span>
                            <p className="text-white/80 text-xs mt-1">
                              {course.id === 1 
                                ? 'Идеально для начала обучения машинному обучению на вашем уровне' 
                                : 'Поможет заполнить пробелы в математической подготовке'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex flex-wrap gap-2">
                        {course.id === 1 ? (
                          <>
                            <span className="px-2 py-1 bg-space-800/60 text-white/80 text-xs rounded-md">Линейная алгебра</span>
                            <span className="px-2 py-1 bg-space-800/60 text-white/80 text-xs rounded-md">Статистика</span>
                            <span className="px-2 py-1 bg-space-800/60 text-white/80 text-xs rounded-md">Оптимизация</span>
                          </>
                        ) : (
                          <>
                            <span className="px-2 py-1 bg-space-800/60 text-white/80 text-xs rounded-md">Программирование</span>
                            <span className="px-2 py-1 bg-space-800/60 text-white/80 text-xs rounded-md">Python</span>
                            <span className="px-2 py-1 bg-space-800/60 text-white/80 text-xs rounded-md">Алгоритмы</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  // Показываем сообщение о необходимости пройти диагностику
                  <div className="bg-space-900/50 border border-amber-500/30 rounded-lg p-6 text-center">
                    <div className="bg-space-800/70 rounded-full p-3 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                    </div>
                    <h3 className="text-white font-medium mb-2">Требуется диагностика</h3>
                    <p className="text-white/70 text-sm mb-4">
                      Для получения персональных рекомендаций по курсам необходимо пройти диагностику навыков
                    </p>
                    <button 
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 px-4 py-2 rounded-md text-white text-sm font-medium"
                      onClick={() => setLocation("/deep-diagnosis")}
                    >
                      Пройти диагностику
                    </button>
                  </div>
                )}
              </div>
            </Glassmorphism>
          </motion.div>
        </div>

        {/* TODO: Добавьте здесь остальные секции дашборда */}
      </div>
    </DashboardLayout>
  );
}
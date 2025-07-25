import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import GalaxyUniverse from "@/components/galaxy-map/galaxy-universe-new";
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
import { SkillsDnaResultsWidget } from "@/components/skills-dna/results-widget";
import { SkillsDnaProfile } from "@/components/skills-dna-profile";
import { CourseCard } from "@/components/courses/course-card";
import { TimeSavedPage } from "@/components/time-saved/TimeSavedPage";
import { diagnosisApi } from "@/api/diagnosis-api";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import RoadmapWidget from "@/components/roadmap/roadmap-widget";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const { userProfile, updateUserProfile } = useUserProfile();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [showOnboardingPrompt, setShowOnboardingPrompt] = useState(true);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [isFullscreenMap, setIsFullscreenMap] = useState(false);
  
  // Получение рекомендуемых курсов
  const { data: rawRecommendedCourses = [] } = useQuery({
    queryKey: ['/api/courses/recommended'],
    queryFn: async () => {
      try {
        const res = await apiRequest('GET', '/api/courses/recommended');
        if (!res.ok) {
          throw new Error('Ошибка при загрузке рекомендуемых курсов');
        }
        const data = await res.json();
        return data;
      } catch (error) {
        console.error('Ошибка при загрузке рекомендуемых курсов:', error);
        return [
          {
            id: 1,
            title: "AI Literacy 101",
            description: "Базовый курс по основам ИИ и его применению",
            level: 1,
            matchPercentage: 95,
            modelScore: 0.95
          },
          {
            id: 2,
            title: "Математика для ИИ",
            description: "Основы математики, необходимые для понимания алгоритмов ИИ",
            level: 2,
            matchPercentage: 85,
            modelScore: 0.85
          }
        ];
      }
    },
    enabled: !!user
  });
  
  // Фильтрация курсов с низкой релевантностью
  const recommendedCourses = React.useMemo(() => {
    const filtered = rawRecommendedCourses.filter((course: any) => {
      const score = course.modelScore !== undefined 
        ? course.modelScore 
        : (course.matchPercentage ? course.matchPercentage / 100 : 0);
      return score >= 0.4;
    });
    
    return filtered.sort((a: any, b: any) => {
      const scoreA = a.modelScore !== undefined ? a.modelScore : (a.matchPercentage ? a.matchPercentage / 100 : 0);
      const scoreB = b.modelScore !== undefined ? b.modelScore : (b.matchPercentage ? b.matchPercentage / 100 : 0);
      return scoreB - scoreA;
    });
  }, [rawRecommendedCourses]);
  
  const [viewMode, setViewMode] = useState<'orbital' | 'tracks'>('orbital');
  const [isSkillsDnaDialogOpen, setIsSkillsDnaDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>(undefined);
  
  const { toast } = useToast();
  
  // Эффект для проверки и применения кэшированных результатов диагностики
  useEffect(() => {
    if (user && diagnosisApi.hasCachedDiagnosticResults()) {
      console.log('[Dashboard] Обнаружены кэшированные результаты диагностики');
      
      const cachedData = diagnosisApi.getCachedDiagnosticResults();
      if (cachedData) {
        const { results, timestamp } = cachedData;
        
        const resultsWithUserId = {
          ...results,
          userId: user.id
        };
        
        const cacheAgeMinutes = (new Date().getTime() - new Date(timestamp).getTime()) / (1000 * 60);
        
        if (cacheAgeMinutes <= 30) {
          console.log('[Dashboard] Отправляем кэшированные результаты диагностики на сервер');
          
          diagnosisApi.saveResults(resultsWithUserId)
            .then((response) => {
              console.log('[Dashboard] Кэшированные результаты диагностики успешно отправлены', response);
              
              queryClient.invalidateQueries({ queryKey: [`/api/diagnosis/progress/${user.id}`] });
              queryClient.invalidateQueries({ queryKey: [`/api/diagnosis/summary/${user.id}`] });
              queryClient.invalidateQueries({ queryKey: ['/api/courses/recommended'] });
              
              toast({
                title: "Результаты диагностики применены",
                description: "Ваш профиль Skills DNA успешно обновлен на основе предыдущей диагностики",
                variant: "default",
              });
              
              if (userProfile) {
                updateUserProfile({
                  ...userProfile,
                  hasCompletedDiagnostics: true
                });
              }
            })
            .catch((error) => {
              console.error('[Dashboard] Ошибка при отправке кэшированных результатов диагностики', error);
              
              toast({
                title: "Не удалось применить результаты диагностики",
                description: "Произошла ошибка при обновлении профиля Skills DNA",
                variant: "destructive",
              });
            });
        } else {
          console.log('[Dashboard] Кэшированные результаты диагностики устарели');
          diagnosisApi.clearCachedDiagnosticResults();
        }
      }
    }
  }, [user, userProfile, updateUserProfile, toast]);

  // Обработчик события для показа подробного анализа Skills DNA
  useEffect(() => {
    const handleShowSkillsDnaDetails = (event: Event) => {
      const customEvent = event as CustomEvent;
      const userId = customEvent.detail?.userId;
      console.log("[Dashboard] Получено событие showSkillsDnaDetails, userId:", userId);
      
      setSelectedUserId(userId || userProfile?.userId);
      setIsSkillsDnaDialogOpen(true);
    };

    window.addEventListener('showSkillsDnaDetails', handleShowSkillsDnaDetails);

    return () => {
      window.removeEventListener('showSkillsDnaDetails', handleShowSkillsDnaDetails);
    };
  }, [userProfile]);

  // Проверка статуса пользователя и показ приветственного модального окна
  useEffect(() => {
    const fromRegistration = sessionStorage.getItem("fromRegistration");
    const fromOnboarding = sessionStorage.getItem("fromOnboarding");
    
    if (fromRegistration === "true" || fromOnboarding === "true") {
      setShowWelcomeModal(true);
      sessionStorage.removeItem("fromRegistration");
      sessionStorage.removeItem("fromOnboarding");
    }
  }, [user]);

  const handleWelcomeModalChange = (isOpen: boolean) => {
    setShowWelcomeModal(isOpen);
  };

  const handleStartOnboarding = () => {
    setLocation("/onboarding");
    setShowOnboardingPrompt(false);
  };

  const handleDismissOnboarding = () => {
    setShowOnboardingPrompt(false);
  };

  const userLevel = {
    title: "Продвинутый",
    level: 3,
    nextMilestone: "Эксперт",
    progress: 72,
    description: "Подходит для всех пользователей от новичка до эксперта"
  };

  return (
    <DashboardLayout title="" subtitle="">
      {/* Приветственное модальное окно для новых пользователей */}
      <WelcomeModal 
        isOpen={showWelcomeModal} 
        onOpenChange={handleWelcomeModalChange} 
        userName={user?.displayName || "студент"}
      />
      {/* Модальное окно для подробного анализа Skills DNA */}
      <Dialog open={isSkillsDnaDialogOpen} onOpenChange={setIsSkillsDnaDialogOpen}>
        <DialogContent className="sm:max-w-4xl bg-space-900 border-space-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white flex items-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#B28DFF] via-[#8BE0F7] to-[#B28DFF]">
                Подробный анализ Skills DNA
              </span>
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Полный анализ ваших навыков и компетенций в области искусственного интеллекта
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-2">
            <SkillsDnaProfile 
              userId={selectedUserId} 
              showHeader={false} 
              className="pt-2" 
            />
          </div>
        </DialogContent>
      </Dialog>
      <div className="flex flex-col gap-6">
        {/* Header - Заметный заголовок "Мостик" */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-6"
        >
          <h1 className="font-orbitron text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#B28DFF] via-[#8BE0F7] to-[#B28DFF] mb-2">Мостик</h1>
          <p className="text-white/70 text-lg">Командный центр вашего космического путешествия в мире ИИ</p>
        </motion.div>
      
        {/* Подсказка для прохождения онбординга */}
        {userProfile && !userProfile.completedOnboarding && showOnboardingPrompt && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full bg-gradient-to-r from-[#6E3AFF]/20 to-[#2EBAE1]/20 border border-[#6E3AFF]/30 rounded-xl p-4 mb-6 relative"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="p-3 rounded-full bg-primary/20 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.04Z"/>
                  <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.04Z"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-1">Пройдите персонализированный онбординг</h3>
                <p className="text-white/70 mb-2">
                  Расскажите о своих целях и интересах, чтобы мы создали для вас персональный план обучения.
                  ИИ-алгоритм подстроит программу под ваши потребности и опыт.
                </p>
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={handleStartOnboarding}
                    className="px-4 py-2 bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] hover:from-[#5A2AE0] hover:to-[#1A9ACA] rounded-lg text-white font-medium transition-all"
                  >
                    Начать онбординг
                  </button>
                  <button
                    onClick={handleDismissOnboarding}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/80 transition-all"
                  >
                    Позже
                  </button>
                </div>
              </div>
              <button
                onClick={handleDismissOnboarding}
                className="absolute top-3 right-3 text-white/50 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"/>
                  <path d="m6 6 12 12"/>
                </svg>
              </button>
            </div>
          </motion.div>
        )}

        {/* Main title - упрощенный заголовок */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="font-orbitron text-xl md:text-2xl font-semibold text-white mb-2">
            Мой образовательный путь
          </h2>
        </motion.div>
        
        {/* Main Content - Skills DNA and Recommended Courses */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <SkillsDnaResultsWidget userId={user?.id} />
        </motion.div>

        {/* Roadmap Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <RoadmapWidget />
        </motion.div>

        {/* All Courses Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-space-800/50 rounded-xl p-4 mt-8"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-orbitron text-xl font-semibold">
              Вселенная ИИ
            </h2>
            <button
              onClick={() => setIsFullscreenMap(true)}
              className="px-4 py-2 bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] text-white rounded-lg hover:opacity-90 transition-all duration-200 flex items-center gap-2 text-sm font-medium"
              title="Открыть карту на весь экран"
            >
              <i className="fas fa-expand text-sm"></i>
              Развернуть
            </button>
          </div>
          <GalaxyUniverse />
          <div className="flex justify-end mt-2">
            <Link href="/courses">
              <div className="text-sm text-white/70 hover:text-white transition inline-flex items-center">
                Смотреть все курсы
                <i className="fas fa-chevron-right ml-1.5 text-xs"></i>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
      {/* Полноэкранная карта галактики */}
      {isFullscreenMap && (
        <div className="fixed inset-0 z-50 bg-black">
          {/* Заголовок полноэкранной карты */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 via-black/40 to-transparent p-4 pointer-events-none">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] flex items-center justify-center">
                  <i className="fas fa-rocket text-white text-sm"></i>
                </div>
                <h1 className="text-white font-orbitron text-xl font-bold">
                  Галактическая карта ИИ
                </h1>
              </div>
              <div className="hidden sm:block text-white/60 text-sm">
                Исследуйте вселенную знаний
              </div>
            </div>
          </div>

          {/* Горизонтальная карта во весь экран */}
          <div className="w-full h-full pt-16">
            <GalaxyUniverse fullScreen={true} onClose={() => setIsFullscreenMap(false)} />
          </div>

          {/* Подсказки управления */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <div className="bg-black/60 backdrop-blur-sm border border-white/20 rounded-lg p-3">
              <div className="flex flex-wrap items-center justify-center gap-4 text-white/70 text-sm">
                <div className="flex items-center gap-2">
                  <i className="fas fa-mouse text-xs"></i>
                  <span>Двойной клик - войти в галактику</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-scroll text-xs"></i>
                  <span>Скролл - навигация по уровням</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-arrows-alt text-xs"></i>
                  <span>Перетаскивание - перемещение по карте</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
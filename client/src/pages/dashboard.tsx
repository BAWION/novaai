import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { OrbitalLayout } from "@/components/orbital-layout";
import { GalaxyOrbitalLayout } from "@/components/galaxy-orbital-layout";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { useUserProfile } from "@/context/user-profile-context";
import { apiRequest } from "@/lib/queryClient";
import { Link, useLocation } from "wouter";

export default function Dashboard() {
  const { userProfile } = useUserProfile();
  const [, setLocation] = useLocation();
  
  const [lastActivity, setLastActivity] = useState<any>(null);
  const [streak, setStreak] = useState(0);
  const [xpLevel, setXpLevel] = useState({
    currentXP: 680,
    levelXP: 1000,
    level: 3
  });
  const [nextEvent, setNextEvent] = useState({
    id: "ev123",
    title: "AMA: Карьера в AI-исследованиях",
    time: "19:00",
    speaker: "Анна Иванова, Ph.D.",
    participants: 78
  });
  const [aiAdvice, setAiAdvice] = useState({
    title: "AI-подсказка: MSE в регрессии",
    content: "В последней лабораторной работе у вас заметно повышенный MSE. Попробуйте нормализовать входные данные перед тренировкой модели, это может решить проблему.",
    area: "LabHub: Linear Regression"
  });
  const [personalStats, setPersonalStats] = useState({
    totalHours: 47,
    completedModules: 12,
    rank: 42
  });
  const [forumTopic, setForumTopic] = useState({
    title: "Как оптимизировать pipeline для NLP?",
    replies: 8,
    hot: true
  });
  const [nextDeadline, setNextDeadline] = useState({
    title: "Проект: Классификатор изображений",
    dueDate: "2025-04-26T23:59:59Z", // через 3 дня
    courseId: 2
  });
  const [viewMode, setViewMode] = useState<'orbital' | 'tracks'>('orbital');

  useEffect(() => {
    const fetchLastActivity = async () => {
      try {
        // В реальном приложении здесь был бы API-запрос
        const mockLastActivity = {
          courseId: 1,
          courseName: "Python for Data Science",
          moduleName: "Продвинутые функции",
          lessonName: "Рекурсия и оптимизация в Python",
          progress: 45,
          lastAccessed: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        };
        
        setLastActivity(mockLastActivity);
      } catch (error) {
        console.error("Error fetching last activity:", error);
      }
    };

    const fetchUserStats = async () => {
      try {
        // В реальном приложении здесь был бы API-запрос
        const streakDays = userProfile?.streakDays || Math.floor(Math.random() * 7) + 1;
        setStreak(streakDays);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };

    fetchLastActivity();
    fetchUserStats();
  }, [userProfile]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const formatDueDate = (dateString: string) => {
    const now = new Date();
    const dueDate = new Date(dateString);
    const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Сегодня";
    if (diffDays === 1) return "Завтра";
    if (diffDays > 1 && diffDays < 7) return `Через ${diffDays} дней`;
    
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit'
    }).format(dueDate);
  };

  return (
    <DashboardLayout title="" subtitle="">
      <div className="flex flex-col gap-6">
        {/* Header with breadcrumb & search */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-between items-center bg-space-900/50 rounded-lg py-2 px-4"
        >
          <div className="text-white/60 text-sm flex items-center gap-2">
            <span className="text-primary">NovaAI</span>
            <i className="fas fa-chevron-right text-xs"></i>
            <span>Панель управления</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-space-800/50 rounded-lg px-3 py-1.5 text-white/50 text-sm">
              <i className="fas fa-search text-xs"></i>
              <span>Cmd+K</span>
            </div>
            <div className="relative">
              <i className="fas fa-bell text-white/60 hover:text-white cursor-pointer transition"></i>
              <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-primary"></div>
            </div>
          </div>
        </motion.div>
      
        {/* Main title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-2"
        >
          <h1 className="font-orbitron text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#B28DFF] via-[#8BE0F7] to-[#B28DFF]">
            Мой космический центр
          </h1>
          <p className="text-white/70 text-md mt-1">Добро пожаловать на персональную орбиту обучения</p>
        </motion.div>
        
        {/* Content columns */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          {/* Left column - Main orbital view (70%) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-space-800/50 rounded-xl p-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-orbitron text-xl font-semibold">
                  Ваши образовательные орбиты
                </h2>
                <div className="flex items-center bg-space-900/50 rounded-lg overflow-hidden">
                  <button 
                    onClick={() => setViewMode('orbital')}
                    className={`px-3 py-1.5 text-sm ${viewMode === 'orbital' ? 'bg-primary/30 text-white' : 'text-white/60'}`}
                  >
                    <i className="fas fa-globe-americas mr-1"></i>
                    Орбиты
                  </button>
                  <button 
                    onClick={() => setViewMode('tracks')}
                    className={`px-3 py-1.5 text-sm ${viewMode === 'tracks' ? 'bg-primary/30 text-white' : 'text-white/60'}`}
                  >
                    <i className="fas fa-road mr-1"></i>
                    По трекам
                  </button>
                </div>
              </div>
              <OrbitalLayout />
            </motion.div>
            
            {/* AI Advice Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Glassmorphism className="rounded-xl p-5 border border-[#2EBAE1]/30">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[#2EBAE1]/20 to-[#2EBAE1]/10 text-[#8BE0F7]">
                    <i className="fas fa-robot text-xl"></i>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-lg">{aiAdvice.title}</h3>
                    <p className="text-white/50 text-xs">{aiAdvice.area}</p>
                  </div>
                </div>
                <p className="text-white/80 text-sm mb-3">
                  {aiAdvice.content}
                </p>
                <div className="flex gap-2 mt-3">
                  <button className="px-3 py-1 bg-[#2EBAE1]/20 hover:bg-[#2EBAE1]/30 rounded-lg text-xs text-[#8BE0F7] flex items-center">
                    <i className="fas fa-code mr-1.5"></i>
                    Показать пример кода
                  </button>
                  <button className="px-3 py-1 bg-black/20 hover:bg-black/30 rounded-lg text-xs text-white/70 flex items-center">
                    <i className="fas fa-check mr-1.5"></i>
                    Полезно
                  </button>
                </div>
              </Glassmorphism>
            </motion.div>
            
            {/* Personal Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col md:flex-row gap-4"
            >
              <Glassmorphism className="rounded-xl p-4 md:w-1/3">
                <div className="flex flex-col items-center justify-center h-full">
                  <i className="fas fa-clock text-2xl text-primary/70 mb-1"></i>
                  <div className="text-2xl font-orbitron">{personalStats.totalHours}</div>
                  <div className="text-white/50 text-xs text-center">Часов обучения</div>
                </div>
              </Glassmorphism>
              
              <Glassmorphism className="rounded-xl p-4 md:w-1/3">
                <div className="flex flex-col items-center justify-center h-full">
                  <i className="fas fa-book text-2xl text-secondary/70 mb-1"></i>
                  <div className="text-2xl font-orbitron">{personalStats.completedModules}</div>
                  <div className="text-white/50 text-xs text-center">Завершенных модулей</div>
                </div>
              </Glassmorphism>
              
              <Glassmorphism className="rounded-xl p-4 md:w-1/3">
                <div className="flex flex-col items-center justify-center h-full">
                  <i className="fas fa-trophy text-2xl text-[#FF3A8C]/70 mb-1"></i>
                  <div className="text-2xl font-orbitron">#{personalStats.rank}</div>
                  <div className="text-white/50 text-xs text-center">Ваш ранг</div>
                </div>
              </Glassmorphism>
            </motion.div>
          </div>

          {/* Right column (30%) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Continue Learning Card */}
            {lastActivity && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Glassmorphism className="rounded-xl p-5 border-l-4 border-l-[#6E3AFF]">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">Продолжить обучение</h3>
                      <p className="text-white/70 mt-1 text-sm">
                        {lastActivity.courseName} • {lastActivity.moduleName}
                      </p>
                      <p className="font-medium mt-2">{lastActivity.lessonName}</p>
                      <p className="text-white/50 text-xs mt-1">
                        Последний доступ: {formatDate(lastActivity.lastAccessed)}
                      </p>
                    </div>
                    <div className="ml-4">
                      <ProgressRing percent={lastActivity.progress} size={50} strokeWidth={4}>
                        <span className="text-xs font-medium">{lastActivity.progress}%</span>
                      </ProgressRing>
                    </div>
                  </div>
                  <button
                    onClick={() => setLocation(`/courses/${lastActivity.courseId}/lesson/next`)}
                    className="mt-4 inline-block bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] hover:from-[#4922B2] hover:to-[#1682A1] text-white py-2 px-4 rounded-lg font-medium transition duration-300 w-full text-center"
                  >
                    <i className="fas fa-play-circle mr-2"></i> 1-клик продолжить
                  </button>
                </Glassmorphism>
              </motion.div>
            )}
            
            {/* Next Deadline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Glassmorphism className="rounded-xl p-5 border-l-4 border-l-amber-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Ближайший дедлайн</h3>
                  <div className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs font-medium">
                    {formatDueDate(nextDeadline.dueDate)}
                  </div>
                </div>
                <p className="font-medium">{nextDeadline.title}</p>
                <button
                  onClick={() => setLocation(`/courses/${nextDeadline.courseId}/projects`)}
                  className="mt-3 text-sm text-white/70 hover:text-white transition flex items-center"
                >
                  Перейти к проекту
                  <i className="fas fa-arrow-right ml-1.5"></i>
                </button>
              </Glassmorphism>
            </motion.div>

            {/* Streak & XP Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Glassmorphism className="rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[#FF3A8C]/20 to-[#FF3A8C]/10 text-[#FF3A8C]">
                      <i className="fas fa-fire text-xl"></i>
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold">Streak</h3>
                      <p className="text-white/70 text-sm">{streak} дней подряд</p>
                    </div>
                  </div>
                  <div className="text-white font-orbitron text-3xl">{streak}</div>
                </div>

                <button className="mb-4 w-full px-4 py-2 rounded-lg bg-black/20 hover:bg-black/30 text-white/80 hover:text-white transition text-sm flex items-center justify-center gap-2">
                  <i className="fab fa-telegram"></i>
                  <span>Поделиться прогрессом</span>
                </button>

                <div className="p-3 border border-white/10 rounded-lg mb-2">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="text-amber-400 text-xs font-medium px-2 py-0.5 bg-amber-400/10 rounded">
                        Уровень {xpLevel.level}
                      </div>
                      <div className="text-xs text-white/60">
                        {xpLevel.currentXP} / {xpLevel.levelXP} XP
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full" 
                      style={{ width: `${(xpLevel.currentXP / xpLevel.levelXP) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </Glassmorphism>
            </motion.div>
            
            {/* Today's event */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Glassmorphism className="rounded-xl p-5 border-l-4 border-l-[#2EBAE1]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Событие дня</h3>
                  <div className="px-2 py-0.5 bg-space-700 text-white/60 rounded text-xs font-medium">
                    {nextEvent.time}
                  </div>
                </div>
                <p className="font-medium mb-1">{nextEvent.title}</p>
                <p className="text-white/60 text-sm mb-3">
                  Спикер: {nextEvent.speaker}
                </p>
                <div className="flex items-center text-white/50 text-xs mb-4">
                  <i className="fas fa-users mr-1.5"></i>
                  <span>{nextEvent.participants} участников</span>
                </div>
                <button className="w-full bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition duration-300 text-sm">
                  Присоединиться
                </button>
              </Glassmorphism>
            </motion.div>
            
            {/* Forum Topic */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Glassmorphism className="rounded-xl p-5">
                <div className="flex items-start gap-3 mb-1">
                  <div className="w-10 h-10 rounded-full bg-space-700 flex items-center justify-center">
                    <i className="fas fa-comments text-white/70"></i>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-sm">Форум</h3>
                      {forumTopic.hot && (
                        <div className="px-1.5 py-0.5 bg-red-500/20 rounded text-xs text-red-400 flex items-center">
                          <i className="fas fa-fire-alt mr-1 text-[0.6rem]"></i>
                          Активное обсуждение
                        </div>
                      )}
                    </div>
                    <p className="text-sm mt-1">{forumTopic.title}</p>
                    <p className="text-white/50 text-xs mt-1">
                      {forumTopic.replies} ответов
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <button className="text-xs text-white/70 hover:text-white transition flex items-center">
                    Открыть обсуждение
                    <i className="fas fa-arrow-right ml-1.5"></i>
                  </button>
                </div>
              </Glassmorphism>
            </motion.div>
            
            {/* Settings button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex justify-end"
            >
              <button className="text-sm text-white/50 hover:text-white/80 transition flex items-center gap-1.5">
                <i className="fas fa-cog"></i>
                <span>Настроить панель</span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
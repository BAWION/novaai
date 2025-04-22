import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { OrbitalLayout } from "@/components/orbital-layout";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { useUserProfile } from "@/context/user-profile-context";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

export default function Dashboard() {
  const { userProfile } = useUserProfile();
  const [lastActivity, setLastActivity] = useState<any>(null);
  const [streak, setStreak] = useState(0);
  const [achievement, setAchievement] = useState({
    name: "Stellar Explorer",
    description: "Пройдите 5 дней подряд",
    progress: 0,
    target: 5
  });

  useEffect(() => {
    const fetchLastActivity = async () => {
      try {
        // В реальном приложении здесь был бы API-запрос
        const mockLastActivity = {
          courseId: 1,
          courseName: "Python Basics",
          moduleName: "Работа с функциями",
          lessonName: "Рекурсия в Python",
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
        
        // Обновляем прогресс достижения на основе streakDays
        setAchievement(prev => ({
          ...prev,
          progress: Math.min(streakDays, prev.target)
        }));
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

  return (
    <DashboardLayout 
      title="Мой космический центр" 
      subtitle="Добро пожаловать на персональную орбиту обучения"
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left column - Main orbital view */}
        <div className="w-full md:w-3/5">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="font-orbitron text-xl font-semibold mb-4">
              Ваши образовательные орбиты
            </h2>
            <div className="bg-space-800/50 rounded-xl p-4">
              <OrbitalLayout />
            </div>
          </motion.div>
        </div>

        {/* Right column - Last activity and achievements */}
        <div className="w-full md:w-2/5 space-y-6">
          {/* Continue Learning Card */}
          {lastActivity && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
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
                <Link href={`/courses/${lastActivity.courseId}/lessons`}>
                  <a className="mt-4 inline-block bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] hover:from-[#4922B2] hover:to-[#1682A1] text-white py-2 px-4 rounded-lg font-medium transition duration-300 w-full text-center">
                    Продолжить <i className="fas fa-arrow-right ml-2"></i>
                  </a>
                </Link>
              </Glassmorphism>
            </motion.div>
          )}

          {/* Achievement Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
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

              <div className="bg-space-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{achievement.name}</h4>
                    <p className="text-white/60 text-xs">{achievement.description}</p>
                  </div>
                  <div className="ml-2 text-sm text-white/80">
                    {achievement.progress}/{achievement.target}
                  </div>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#FF3A8C] to-[#FFAA8C] rounded-full" 
                    style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                  ></div>
                </div>
              </div>
            </Glassmorphism>
          </motion.div>

          {/* Daily Tip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Glassmorphism className="rounded-xl p-5 border border-[#2EBAE1]/30">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-[#2EBAE1]/20 to-[#2EBAE1]/10 text-[#8BE0F7]">
                  <i className="fas fa-lightbulb text-lg"></i>
                </div>
                <h3 className="ml-3 font-medium">Космический совет дня</h3>
              </div>
              <p className="text-white/80 text-sm">
                "Используйте Numpy для векторизации математических операций — это может ускорить ваш код в 100-1000 раз по сравнению с циклами Python."
              </p>
            </Glassmorphism>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
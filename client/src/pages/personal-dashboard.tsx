import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { SkillMap } from "@/components/skill-map";
import { ProgressRing } from "@/components/ui/progress-ring";
import { useUserProfile } from "@/context/user-profile-context";
import {
  CalendarIcon,
  ChartIcon,
  FileIcon,
  GraduationCapIcon,
  HistoryIcon,
  RocketIcon,
  SettingsIcon,
  StarIcon,
  UserIcon
} from "@/components/ui/icons";

// Компонент с аватаром и общей информацией
const UserProfileOverview = () => {
  const { userProfile } = useUserProfile();
  const [achievements, setAchievements] = useState({
    completed_courses: 3,
    achievement_count: 12,
    skill_points: 850,
    streak_days: 14
  });

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/3">
        <Glassmorphism className="p-6 rounded-xl">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full mb-4 overflow-hidden border-2 border-primary/40">
              <img 
                src={userProfile.avatarUrl || "https://via.placeholder.com/100"} 
                alt="Аватар пользователя"
                className="w-full h-full object-cover" 
              />
            </div>
            <h3 className="text-xl font-semibold mb-1">{userProfile.fullName}</h3>
            <p className="text-sm text-white/60 mb-4">{userProfile.occupation}</p>
            
            <div className="w-full mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-white/70">Общий прогресс</span>
                <span className="text-sm font-medium">{userProfile.overallProgress || 68}%</span>
              </div>
              <div className="w-full h-2 bg-space-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1]" 
                  style={{ width: `${userProfile.overallProgress || 68}%` }}
                ></div>
              </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-3 mt-6">
              <div className="bg-space-800/50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <GraduationCapIcon className="h-4 w-4 text-primary/60" />
                  <span className="text-xs text-white/70">Курсы</span>
                </div>
                <p className="text-lg font-semibold mt-1">{achievements.completed_courses}</p>
              </div>
              <div className="bg-space-800/50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <StarIcon className="h-4 w-4 text-amber-500/60" />
                  <span className="text-xs text-white/70">Достижения</span>
                </div>
                <p className="text-lg font-semibold mt-1">{achievements.achievement_count}</p>
              </div>
              <div className="bg-space-800/50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <ChartIcon className="h-4 w-4 text-emerald-500/60" />
                  <span className="text-xs text-white/70">Навыки</span>
                </div>
                <p className="text-lg font-semibold mt-1">{achievements.skill_points}</p>
              </div>
              <div className="bg-space-800/50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-orange-500/60" />
                  <span className="text-xs text-white/70">Дней подряд</span>
                </div>
                <p className="text-lg font-semibold mt-1">{achievements.streak_days}</p>
              </div>
            </div>
          </div>
        </Glassmorphism>
      </div>
      
      <div className="w-full md:w-2/3">
        <Glassmorphism className="p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Текущая активность</h3>
          
          <div className="space-y-4">
            <div className="bg-space-800/50 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium mb-1">AI Literacy 101</h4>
                  <p className="text-sm text-white/60">Модуль: Основы искусственного интеллекта</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm text-primary">67% завершено</span>
                  <div className="text-xs text-white/50 mt-1">Последняя активность: сегодня</div>
                </div>
              </div>
              <div className="w-full h-2 bg-space-700 rounded-full overflow-hidden mt-3">
                <div className="h-full bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1]" style={{ width: "67%" }}></div>
              </div>
            </div>
            
            <div className="bg-space-800/50 p-4 rounded-lg">
              <h4 className="font-medium mb-1">Диагностика Skills DNA</h4>
              <p className="text-sm text-white/60">Определение уровня владения ключевыми компетенциями</p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-white/50">2 из 5 разделов завершено</span>
                <button className="text-xs bg-primary/20 text-primary hover:bg-primary/30 transition px-3 py-1 rounded-full">
                  Продолжить
                </button>
              </div>
            </div>
            
            <div className="bg-space-800/50 p-4 rounded-lg">
              <div className="flex justify-between">
                <h4 className="font-medium">Рекомендации на сегодня</h4>
                <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">
                  ТОП-3
                </span>
              </div>
              <ul className="mt-3 space-y-2">
                <li className="flex items-center gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  Завершить урок "Исторические предпосылки развития AI"
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Пройти тест по модулю "Основы искусственного интеллекта"
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                  Практическое задание: "Создание простого AI-помощника"
                </li>
              </ul>
            </div>
          </div>
        </Glassmorphism>
      </div>
    </div>
  );
};

// Компонент с картой образовательной траектории
const EducationalPathSection = () => {
  const roadmapNodes = [
    { 
      id: 'ai-literacy', 
      title: 'AI Literacy 101', 
      status: 'in-progress', 
      progress: 67 
    },
    { 
      id: 'python-basics', 
      title: 'Python для AI разработчиков', 
      status: 'available', 
      progress: 0 
    },
    { 
      id: 'ml-intro', 
      title: 'Введение в машинное обучение', 
      status: 'locked', 
      progress: 0 
    },
    { 
      id: 'genai-prompt', 
      title: 'Prompt-инжиниринг', 
      status: 'available', 
      progress: 0 
    },
  ];

  const getProgressBarColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'from-green-500 to-emerald-500';
      case 'in-progress': 
        return 'from-[#6E3AFF] to-[#2EBAE1]';
      case 'available':
        return 'from-amber-500 to-orange-500';
      default:
        return 'from-gray-600 to-gray-500';
    }
  };

  return (
    <Glassmorphism className="p-6 rounded-xl">
      <h3 className="text-lg font-semibold mb-6">Образовательная траектория</h3>
      
      <div className="space-y-6">
        {roadmapNodes.map((node) => (
          <div key={node.id} className="relative">
            <div className={`p-4 rounded-lg border ${
              node.status === 'in-progress' ? 'border-primary/40 bg-primary/5' : 
              node.status === 'available' ? 'border-amber-500/40 bg-amber-500/5' : 
              'border-white/10 bg-space-800/30'
            }`}>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{node.title}</h4>
                  <div className="flex items-center mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      node.status === 'in-progress' ? 'bg-primary/20 text-primary' :
                      node.status === 'available' ? 'bg-amber-500/20 text-amber-400' :
                      node.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      'bg-white/10 text-white/60'
                    }`}>
                      {node.status === 'in-progress' ? 'В процессе' :
                       node.status === 'available' ? 'Доступно' :
                       node.status === 'completed' ? 'Завершено' : 
                       'Заблокировано'}
                    </span>
                  </div>
                </div>

                {node.status !== 'locked' && (
                  <button className={`px-4 py-1 rounded text-sm ${
                    node.status === 'in-progress' ? 'bg-primary/20 text-primary hover:bg-primary/30' :
                    node.status === 'available' ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' :
                    'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  }`}>
                    {node.status === 'in-progress' ? 'Продолжить' :
                     node.status === 'available' ? 'Начать' : 'Повторить'}
                  </button>
                )}
              </div>
              
              {node.status !== 'locked' && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/60">Прогресс</span>
                    <span>{node.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-space-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${getProgressBarColor(node.status)}`}
                      style={{ width: `${node.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="text-center mt-8">
          <button className="px-4 py-2 bg-primary/20 text-primary hover:bg-primary/30 transition rounded-lg text-sm">
            Просмотреть полную карту обучения
          </button>
        </div>
      </div>
    </Glassmorphism>
  );
};

// Компонент с картой компетенций
const CompetencyMapSection = () => {
  return (
    <Glassmorphism className="p-6 rounded-xl">
      <h3 className="text-lg font-semibold mb-6">Skills DNA: Карта компетенций</h3>
      
      <div className="space-y-6">
        <div className="max-w-3xl mx-auto mb-6">
          <div className="bg-space-800/30 p-4 rounded-lg border border-space-700">
            <div className="flex items-center justify-center mb-4">
              <div className="w-32 h-32">
                <ProgressRing 
                  progress={42} 
                  strokeWidth={8}
                  radius={60}
                  className="text-primary" 
                />
              </div>
            </div>
            <h4 className="text-center font-semibold mb-2">Общий прогресс Skills DNA</h4>
            <p className="text-center text-sm text-white/60 mb-4">
              Ваш профиль компетенций развивается. Продолжайте обучение, чтобы заполнить пробелы в знаниях.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
              <div className="bg-space-800/50 p-2 rounded text-center">
                <div className="text-xs text-white/60 mb-1">Технические</div>
                <div className="text-sm font-medium">56%</div>
              </div>
              <div className="bg-space-800/50 p-2 rounded text-center">
                <div className="text-xs text-white/60 mb-1">Теоретические</div>
                <div className="text-sm font-medium">72%</div>
              </div>
              <div className="bg-space-800/50 p-2 rounded text-center">
                <div className="text-xs text-white/60 mb-1">Практические</div>
                <div className="text-sm font-medium">38%</div>
              </div>
              <div className="bg-space-800/50 p-2 rounded text-center">
                <div className="text-xs text-white/60 mb-1">Этические</div>
                <div className="text-sm font-medium">65%</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
            <div className="bg-space-800/30 p-4 rounded-lg border border-space-700">
              <h4 className="font-medium mb-2">Топ навыков</h4>
              <ul className="space-y-2">
                <li className="flex justify-between items-center">
                  <span className="text-sm">Понимание принципов AI</span>
                  <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded">Продвинутый</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-sm">Prompt-инжиниринг</span>
                  <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded">Средний</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-sm">Этика AI</span>
                  <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded">Средний</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-space-800/30 p-4 rounded-lg border border-space-700">
              <h4 className="font-medium mb-2">Области для развития</h4>
              <ul className="space-y-2">
                <li className="flex justify-between items-center">
                  <span className="text-sm">Нейронные сети</span>
                  <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded">Базовый</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-sm">Машинное обучение</span>
                  <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded">Базовый</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-sm">Computer Vision</span>
                  <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-400 rounded">Начальный</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <button className="px-4 py-2 bg-primary/20 text-primary hover:bg-primary/30 transition rounded-lg text-sm">
            Просмотреть полную карту компетенций
          </button>
        </div>
      </div>
    </Glassmorphism>
  );
};

// Главный компонент страницы личного кабинета
export default function PersonalDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <DashboardLayout
      title="Личный кабинет"
      subtitle="Управление обучением, прогресс и персональная траектория"
    >
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-8 w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <ChartIcon className="h-4 w-4" />
            <span>Обзор</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            <span>Профиль</span>
          </TabsTrigger>
          <TabsTrigger value="path" className="flex items-center gap-2">
            <RocketIcon className="h-4 w-4" />
            <span>Образовательная траектория</span>
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center gap-2">
            <StarIcon className="h-4 w-4" />
            <span>Skills DNA</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <HistoryIcon className="h-4 w-4" />
            <span>Статистика</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Вкладка "Обзор" */}
        <TabsContent value="overview" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <UserProfileOverview />
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Glassmorphism className="p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">Навыки и компетенции</h3>
                <div className="p-4 h-64 flex items-center justify-center">
                  <p className="text-center text-white/60">
                    [Здесь будет компактная визуализация Skills DNA]
                  </p>
                </div>
                <div className="text-center mt-4">
                  <button 
                    className="px-4 py-2 bg-primary/20 text-primary hover:bg-primary/30 transition rounded-lg text-sm"
                    onClick={() => setActiveTab("skills")}
                  >
                    Подробнее
                  </button>
                </div>
              </Glassmorphism>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Glassmorphism className="p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">Активные курсы</h3>
                <div className="space-y-4">
                  <div className="bg-space-800/50 p-3 rounded-lg">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium text-sm">AI Literacy 101</h4>
                        <p className="text-xs text-white/60 mt-1">Модуль: Основы искусственного интеллекта</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-primary">67%</span>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-space-700 rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1]" style={{ width: "67%" }}></div>
                    </div>
                  </div>
                  
                  <div className="bg-space-800/50 p-3 rounded-lg">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium text-sm">Prompt-инжиниринг для генеративных моделей</h4>
                        <p className="text-xs text-white/60 mt-1">Новый курс</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs text-amber-400">Доступно</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <button 
                    className="px-4 py-2 bg-primary/20 text-primary hover:bg-primary/30 transition rounded-lg text-sm"
                    onClick={() => setActiveTab("path")}
                  >
                    Вся траектория
                  </button>
                </div>
              </Glassmorphism>
            </motion.div>
          </div>
        </TabsContent>
        
        {/* Вкладка "Профиль" */}
        <TabsContent value="profile" className="space-y-6">
          <Glassmorphism className="p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-6">Профиль пользователя</h3>
            <p className="text-white/60 text-center">
              [Здесь будет полная информация о профиле и настройки аккаунта]
            </p>
          </Glassmorphism>
        </TabsContent>
        
        {/* Вкладка "Образовательная траектория" */}
        <TabsContent value="path" className="space-y-6">
          <EducationalPathSection />
        </TabsContent>
        
        {/* Вкладка "Skills DNA" */}
        <TabsContent value="skills" className="space-y-6">
          <CompetencyMapSection />
        </TabsContent>
        
        {/* Вкладка "Статистика" */}
        <TabsContent value="stats" className="space-y-6">
          <Glassmorphism className="p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-6">Статистика обучения</h3>
            <p className="text-white/60 text-center">
              [Здесь будет детальная статистика обучения с графиками и диаграммами]
            </p>
          </Glassmorphism>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
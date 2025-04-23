import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { KnowledgeRadar, SkillRadarData } from '@/components/knowledge-radar';
import { Glassmorphism } from '@/components/ui/glassmorphism';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Примеры данных для радара знаний
const skillsData: SkillRadarData[] = [
  {
    id: '1',
    name: 'Python',
    category: 'Языки программирования',
    level: 85,
    color: '#38BDF8',
    icon: '🐍',
  },
  {
    id: '2',
    name: 'JavaScript',
    category: 'Языки программирования',
    level: 65,
    color: '#FACC15',
    icon: 'JS',
  },
  {
    id: '3',
    name: 'SQL',
    category: 'Базы данных',
    level: 70,
    color: '#4ADE80',
    icon: '💾',
  },
  {
    id: '4',
    name: 'MongoDB',
    category: 'Базы данных',
    level: 50,
    color: '#22C55E',
    icon: '🍃',
  },
  {
    id: '5',
    name: 'TensorFlow',
    category: 'Машинное обучение',
    level: 75,
    color: '#F472B6',
    icon: 'TF',
  },
  {
    id: '6',
    name: 'PyTorch',
    category: 'Машинное обучение',
    level: 60,
    color: '#FB7185',
    icon: 'PT',
  },
  {
    id: '7',
    name: 'Computer Vision',
    category: 'Специализации',
    level: 65,
    color: '#A78BFA',
    icon: '👁️',
  },
  {
    id: '8',
    name: 'NLP',
    category: 'Специализации',
    level: 45,
    color: '#818CF8',
    icon: '💬',
  },
  {
    id: '9',
    name: 'Reinforcement Learning',
    category: 'Специализации',
    level: 30,
    color: '#60A5FA',
    icon: '🎮',
  },
  {
    id: '10',
    name: 'Git',
    category: 'Инструменты',
    level: 80,
    color: '#F87171',
    icon: '📦',
  },
  {
    id: '11',
    name: 'Docker',
    category: 'Инструменты',
    level: 55,
    color: '#E879F9',
    icon: '🐳',
  },
];

// Примеры достижений
const achievements = [
  {
    id: '1',
    title: 'Первые шаги в ML',
    description: 'Успешно обучите свою первую модель машинного обучения',
    icon: '🚀',
    unlocked: true,
    progress: 100,
    xp: 500
  },
  {
    id: '2',
    title: 'Дата-инженер',
    description: 'Создайте полноценный пайплайн обработки данных',
    icon: '📊',
    unlocked: true,
    progress: 100,
    xp: 750
  },
  {
    id: '3',
    title: 'Лидер сообщества',
    description: 'Наберите 100 лайков за ваши публикации в сообществе',
    icon: '👑',
    unlocked: false,
    progress: 68,
    xp: 1000
  },
  {
    id: '4',
    title: 'Гуру визуализации',
    description: 'Создайте 10 интерактивных визуализаций данных',
    icon: '📈',
    unlocked: false,
    progress: 40,
    xp: 600
  },
  {
    id: '5',
    title: 'Искатель знаний',
    description: 'Пройдите курсы из 5 разных категорий',
    icon: '🔍',
    unlocked: false,
    progress: 80,
    xp: 800
  },
];

// Пример статистики
const stats = {
  totalXP: 12850,
  level: 15,
  nextLevelXP: 15000,
  rank: 42,
  completedCourses: 8,
  completedLessons: 73,
  practiceSessions: 26,
  timeSpent: '47ч 30м'
};

export default function Progress() {
  const [activeTab, setActiveTab] = useState('skills');
  
  return (
    <DashboardLayout title="" subtitle="">
      <div className="flex flex-col gap-6">
        {/* Header with breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-between items-center bg-space-900/50 rounded-lg py-2 px-4"
        >
          <div className="text-white/60 text-sm flex items-center gap-2">
            <span className="text-primary">NovaAI</span>
            <i className="fas fa-chevron-right text-xs"></i>
            <span>Мой прогресс</span>
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
            Карта вашего прогресса
          </h1>
          <p className="text-white/70 text-md mt-1">Отслеживайте рост своих навыков и достижений</p>
        </motion.div>
        
        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          {/* Left column (Skills radar and achievements - 70%) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Glassmorphism className="rounded-xl p-4">
                <Tabs defaultValue="skills" onValueChange={setActiveTab}>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="font-orbitron text-xl font-semibold">
                      Радар ваших знаний
                    </h2>
                    <TabsList className="bg-space-900/50">
                      <TabsTrigger value="skills">Навыки</TabsTrigger>
                      <TabsTrigger value="achievements">Достижения</TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="skills" className="flex justify-center">
                    <KnowledgeRadar 
                      data={skillsData} 
                      size={400}
                      title="Ваши навыки и компетенции" 
                    />
                  </TabsContent>
                  
                  <TabsContent value="achievements">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {achievements.map((achievement) => (
                        <div 
                          key={achievement.id}
                          className={`rounded-lg border p-4 transition-all ${
                            achievement.unlocked 
                              ? 'border-green-500/30 bg-green-500/10' 
                              : 'border-white/10 bg-white/5'
                          }`}
                        >
                          <div className="flex items-start">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                              achievement.unlocked ? 'bg-green-500/30' : 'bg-white/10'
                            }`}>
                              {achievement.icon}
                            </div>
                            <div className="ml-3">
                              <h3 className="font-medium text-white">
                                {achievement.title}
                                {achievement.unlocked && (
                                  <span className="ml-2 text-green-400 text-xs">
                                    <i className="fas fa-check-circle"></i>
                                  </span>
                                )}
                              </h3>
                              <p className="text-white/60 text-sm mt-1">{achievement.description}</p>
                            </div>
                          </div>
                          
                          {!achievement.unlocked && (
                            <div className="mt-3">
                              <div className="flex justify-between text-xs text-white/60 mb-1">
                                <span>Прогресс</span>
                                <span>{achievement.progress}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-white/10 rounded-full">
                                <div 
                                  className="h-full bg-primary rounded-full"
                                  style={{ width: `${achievement.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                          
                          {achievement.unlocked && (
                            <div className="mt-3 text-xs text-white/60">
                              <span>Награда: +{achievement.xp} XP</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </Glassmorphism>
            </motion.div>
            
            {/* Skill recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Glassmorphism className="rounded-xl p-5 border border-[#2EBAE1]/30">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[#2EBAE1]/20 to-[#2EBAE1]/10 text-[#8BE0F7]">
                    <i className="fas fa-lightbulb text-xl"></i>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-lg">Рекомендации по развитию</h3>
                    <p className="text-white/50 text-xs">На основе вашего радара знаний</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <i className="fas fa-arrow-trend-up"></i>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">NLP и обработка языка</h4>
                      <p className="text-white/70 text-sm mt-1">
                        Это ваша самая слабая область в специализациях. Рекомендуем пройти курс "Основы NLP с трансформерами"
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
                      <i className="fas fa-code-branch"></i>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">Docker и контейнеризация</h4>
                      <p className="text-white/70 text-sm mt-1">
                        Улучшите навыки работы с инструментами DevOps для более эффективного развертывания ML-моделей
                      </p>
                    </div>
                  </div>
                </div>
              </Glassmorphism>
            </motion.div>
          </div>
          
          {/* Right column (Stats and level - 30%) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Level progress card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Glassmorphism className="rounded-xl p-5">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500/30 to-amber-600/30 flex items-center justify-center border-4 border-amber-500/30 mb-3">
                    <div className="text-3xl font-bold text-white">{stats.level}</div>
                  </div>
                  
                  <div className="font-medium text-white text-lg mb-4">Уровень</div>
                  
                  <div className="w-full mb-1 flex justify-between text-xs">
                    <span className="text-white/60">{stats.totalXP} XP</span>
                    <span className="text-white/60">{stats.nextLevelXP} XP</span>
                  </div>
                  
                  <div className="w-full h-2 bg-white/10 rounded-full mb-1">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"
                      style={{ width: `${(stats.totalXP / stats.nextLevelXP) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="text-xs text-white/60 mt-1">
                    До следующего уровня: {stats.nextLevelXP - stats.totalXP} XP
                  </div>
                </div>
              </Glassmorphism>
            </motion.div>
            
            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Glassmorphism className="rounded-xl p-5">
                <h3 className="font-semibold text-lg text-white mb-4">Ваша статистика</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/70">Рейтинг</span>
                    <span className="font-medium text-white">#{stats.rank}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-white/70">Завершено курсов</span>
                    <span className="font-medium text-white">{stats.completedCourses}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-white/70">Пройдено уроков</span>
                    <span className="font-medium text-white">{stats.completedLessons}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-white/70">Практических заданий</span>
                    <span className="font-medium text-white">{stats.practiceSessions}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-white/70">Потрачено времени</span>
                    <span className="font-medium text-white">{stats.timeSpent}</span>
                  </div>
                </div>
              </Glassmorphism>
            </motion.div>
            
            {/* Mastery Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Glassmorphism className="rounded-xl p-5">
                <h3 className="font-semibold text-lg text-white mb-3">Знаки мастерства</h3>
                
                <div className="flex flex-wrap gap-3 justify-center">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center border-2 border-blue-500/30 mb-1">
                      <i className="fas fa-code text-blue-400"></i>
                    </div>
                    <span className="text-xs text-white/70">Python</span>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center border-2 border-green-500/30 mb-1">
                      <i className="fas fa-database text-green-400"></i>
                    </div>
                    <span className="text-xs text-white/70">SQL</span>
                  </div>
                  
                  <div className="flex flex-col items-center opacity-40">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center border-2 border-purple-500/30 mb-1">
                      <i className="fas fa-brain text-purple-400"></i>
                    </div>
                    <span className="text-xs text-white/70">TensorFlow</span>
                  </div>
                  
                  <div className="flex flex-col items-center opacity-40">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/20 flex items-center justify-center border-2 border-red-500/30 mb-1">
                      <i className="fas fa-eye text-red-400"></i>
                    </div>
                    <span className="text-xs text-white/70">CV</span>
                  </div>
                </div>
                
                <div className="text-xs text-center text-white/50 mt-4">
                  Разблокировано 2 из 12 знаков мастерства
                </div>
              </Glassmorphism>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
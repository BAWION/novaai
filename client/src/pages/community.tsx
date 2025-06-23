import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { motion } from "framer-motion";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProgressRing } from "@/components/ui/progress-ring";
import TelegramFeed from "@/components/telegram-feed";

// Types for community data
interface ForumThread {
  id: string;
  title: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  replies: number;
  views: number;
  lastActivity: string;
  pinned?: boolean;
}

interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  host: string;
  participants: number;
  type: 'webinar' | 'ama' | 'hackathon' | 'competition';
}

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  rank: number;
  score: number;
  streak: number;
  badges: string[];
}

// Sample data
const SAMPLE_THREADS: ForumThread[] = [
  {
    id: "thread-1",
    title: "Какие библиотеки лучше всего подходят для визуализации нейронных сетей?",
    author: {
      name: "Анна К.",
      avatar: "https://i.pravatar.cc/150?img=1"
    },
    category: "deep-learning",
    replies: 8,
    views: 156,
    lastActivity: "2025-04-21T14:35:22",
    pinned: true
  },
  {
    id: "thread-2",
    title: "Проблема с переобучением модели в задаче классификации",
    author: {
      name: "Максим Л.",
      avatar: "https://i.pravatar.cc/150?img=3"
    },
    category: "machine-learning",
    replies: 12,
    views: 203,
    lastActivity: "2025-04-22T10:20:45"
  },
  {
    id: "thread-3",
    title: "Как оптимизировать Pipeline для большого датасета?",
    author: {
      name: "Елена С.",
      avatar: "https://i.pravatar.cc/150?img=5"
    },
    category: "data-engineering",
    replies: 6,
    views: 97,
    lastActivity: "2025-04-21T19:45:12"
  },
  {
    id: "thread-4",
    title: "Интеграция LabHub с внешними Python пакетами",
    author: {
      name: "Дмитрий В.",
      avatar: "https://i.pravatar.cc/150?img=7"
    },
    category: "labhub",
    replies: 3,
    views: 65,
    lastActivity: "2025-04-22T09:12:33"
  },
  {
    id: "thread-5",
    title: "Помогите с интерпретацией SHAP values",
    author: {
      name: "Ольга М.",
      avatar: "https://i.pravatar.cc/150?img=9"
    },
    category: "model-interpretability",
    replies: 7,
    views: 112,
    lastActivity: "2025-04-20T15:30:21"
  }
];

const UPCOMING_EVENTS: EventData[] = [
  {
    id: "event-1",
    title: "AMA с экспертом GPT-5",
    description: "Задайте вопросы ведущему разработчику OpenAI об архитектуре и возможностях GPT-5.",
    date: "2025-05-05",
    time: "19:00",
    host: "Марк Джонсон, OpenAI",
    participants: 145,
    type: "ama"
  },
  {
    id: "event-2",
    title: "Вебинар: Трансформеры в компьютерном зрении",
    description: "Подробный обзор применения архитектуры трансформеров в задачах компьютерного зрения.",
    date: "2025-04-28",
    time: "16:30",
    host: "Профессор Алексей Петров",
    participants: 87,
    type: "webinar"
  },
  {
    id: "event-3",
    title: "Хакатон: AI для здравоохранения",
    description: "48-часовой хакатон по разработке AI-решений для медицинской диагностики и мониторинга.",
    date: "2025-05-15",
    time: "10:00",
    host: "NovaAI University & MedTech Labs",
    participants: 210,
    type: "hackathon"
  }
];

const LEADERBOARD: LeaderboardUser[] = [
  {
    id: "user-1",
    name: "Мария В.",
    avatar: "https://i.pravatar.cc/150?img=5",
    rank: 1,
    score: 4850,
    streak: 45,
    badges: ["guru", "mentor", "innovator"]
  },
  {
    id: "user-2",
    name: "Антон К.",
    avatar: "https://i.pravatar.cc/150?img=12",
    rank: 2,
    score: 4720,
    streak: 32,
    badges: ["guru", "solver", "fast-learner"]
  },
  {
    id: "user-3",
    name: "Елена Г.",
    avatar: "https://i.pravatar.cc/150?img=9",
    rank: 3,
    score: 4680,
    streak: 38,
    badges: ["guru", "contributor"]
  },
  {
    id: "user-4",
    name: "Михаил С.",
    avatar: "https://i.pravatar.cc/150?img=8",
    rank: 4,
    score: 4540,
    streak: 29,
    badges: ["solver", "innovator"]
  },
  {
    id: "user-5",
    name: "Ольга Д.",
    avatar: "https://i.pravatar.cc/150?img=1",
    rank: 5,
    score: 4320,
    streak: 42,
    badges: ["fast-learner", "contributor"]
  }
];

export default function Community() {
  const [activeTab, setActiveTab] = useState("news");

  // Helper functions
  const formatDateRelative = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} д. назад`;
    } else if (diffHours > 0) {
      return `${diffHours} ч. назад`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} мин. назад`;
    } else {
      return "сейчас";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'deep-learning': 'bg-purple-500/20 text-purple-300',
      'machine-learning': 'bg-blue-500/20 text-blue-300',
      'data-engineering': 'bg-green-500/20 text-green-300',
      'labhub': 'bg-orange-500/20 text-orange-300',
      'model-interpretability': 'bg-yellow-500/20 text-yellow-300'
    };
    
    return colors[category] || 'bg-gray-500/20 text-gray-300';
  };

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'ama': 'bg-purple-500/20 text-purple-300',
      'webinar': 'bg-blue-500/20 text-blue-300',
      'hackathon': 'bg-orange-500/20 text-orange-300',
      'competition': 'bg-green-500/20 text-green-300'
    };
    
    return colors[type] || 'bg-gray-500/20 text-gray-300';
  };

  const getBadgeIcon = (badge: string) => {
    const icons: Record<string, string> = {
      'guru': 'crown',
      'mentor': 'chalkboard-teacher',
      'innovator': 'lightbulb',
      'solver': 'puzzle-piece',
      'contributor': 'hands-helping',
      'fast-learner': 'bolt'
    };
    
    return icons[badge] || 'award';
  };

  const getBadgeColor = (badge: string) => {
    const colors: Record<string, string> = {
      'guru': 'text-yellow-400',
      'mentor': 'text-blue-400',
      'innovator': 'text-purple-400',
      'solver': 'text-green-400',
      'contributor': 'text-orange-400',
      'fast-learner': 'text-pink-400'
    };
    
    return colors[badge] || 'text-gray-400';
  };

  return (
    <DashboardLayout 
      title="Сообщество" 
      subtitle="Обсуждения, мероприятия и соревнования"
    >
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="news">Новости</TabsTrigger>
          <TabsTrigger value="forum">Форум</TabsTrigger>
          <TabsTrigger value="events">События</TabsTrigger>
          <TabsTrigger value="leaderboard">Таблица лидеров</TabsTrigger>
          <TabsTrigger value="discord">Discord</TabsTrigger>
        </TabsList>
        
        <TabsContent value="news" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TelegramFeed />
            </div>
            <div className="space-y-4">
              <Glassmorphism className="p-5 rounded-xl">
                <h3 className="font-medium mb-4">Источники новостей</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <i className="fab fa-telegram-plane text-white text-sm"></i>
                    </div>
                    <div>
                      <div className="font-medium text-sm">@humanreadytech</div>
                      <div className="text-xs text-white/60">Канал об ИИ и технологиях</div>
                    </div>
                  </div>
                </div>
              </Glassmorphism>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="forum" className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main forum content */}
            <div className="w-full lg:w-3/4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-orbitron text-xl font-semibold">
                  Дискуссии сообщества
                </h2>
                <div className="flex gap-3">
                  <select className="bg-space-800/50 border-white/10 px-3 py-2 rounded-lg text-sm text-white/70">
                    <option value="recent">Недавние</option>
                    <option value="active">Активные</option>
                    <option value="popular">Популярные</option>
                  </select>
                  <button className="bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] hover:from-[#4922B2] hover:to-[#1682A1] text-white py-2 px-4 rounded-lg font-medium transition duration-300 text-sm">
                    <i className="fas fa-plus mr-2"></i>
                    Создать тему
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {SAMPLE_THREADS.map((thread) => (
                  <motion.div
                    key={thread.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Glassmorphism className={`p-4 rounded-xl ${thread.pinned ? 'border-l-4 border-l-[#6E3AFF]' : ''}`}>
                      <div className="flex items-start gap-4">
                        <div className="hidden sm:block">
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            <img src={thread.author.avatar} alt={thread.author.name} className="w-full h-full object-cover" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-0.5 text-xs rounded-full ${getCategoryColor(thread.category)}`}>
                              {thread.category}
                            </span>
                            {thread.pinned && (
                              <span className="px-2 py-0.5 text-xs rounded-full bg-[#6E3AFF]/20 text-[#B28DFF]">
                                <i className="fas fa-thumbtack mr-1"></i> Закреплено
                              </span>
                            )}
                          </div>
                          <h3 className="font-medium text-lg mb-2 hover:text-[#B28DFF] cursor-pointer transition-colors">
                            {thread.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/60">
                            <span>
                              <i className="fas fa-user mr-1"></i> {thread.author.name}
                            </span>
                            <span>
                              <i className="fas fa-reply mr-1"></i> {thread.replies} ответов
                            </span>
                            <span>
                              <i className="fas fa-eye mr-1"></i> {thread.views} просмотров
                            </span>
                            <span>
                              <i className="fas fa-clock mr-1"></i> {formatDateRelative(thread.lastActivity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Glassmorphism>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-center">
                <button className="bg-white/10 hover:bg-white/20 text-white py-2 px-6 rounded-lg transition duration-300">
                  Загрузить еще
                </button>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="w-full lg:w-1/4 space-y-4">
              {/* Categories */}
              <Glassmorphism className="p-5 rounded-xl">
                <h3 className="font-medium mb-4">Категории</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                      <span className="text-sm">Deep Learning</span>
                    </div>
                    <span className="text-white/50 text-xs">128</span>
                  </div>
                  <div className="flex justify-between items-center group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-sm">Machine Learning</span>
                    </div>
                    <span className="text-white/50 text-xs">96</span>
                  </div>
                  <div className="flex justify-between items-center group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm">Data Engineering</span>
                    </div>
                    <span className="text-white/50 text-xs">64</span>
                  </div>
                  <div className="flex justify-between items-center group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-orange-500 mr-2"></div>
                      <span className="text-sm">LabHub</span>
                    </div>
                    <span className="text-white/50 text-xs">42</span>
                  </div>
                  <div className="flex justify-between items-center group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                      <span className="text-sm">Model Interpretability</span>
                    </div>
                    <span className="text-white/50 text-xs">36</span>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <button className="text-[#B28DFF] hover:text-[#D2B8FF] text-xs">
                    Показать все категории
                  </button>
                </div>
              </Glassmorphism>
              
              {/* Active users */}
              <Glassmorphism className="p-5 rounded-xl">
                <h3 className="font-medium mb-4">Онлайн</h3>
                <div className="flex flex-wrap gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-green-500">
                    <img src="https://i.pravatar.cc/150?img=1" alt="User" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-green-500">
                    <img src="https://i.pravatar.cc/150?img=2" alt="User" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-green-500">
                    <img src="https://i.pravatar.cc/150?img=3" alt="User" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-green-500">
                    <img src="https://i.pravatar.cc/150?img=4" alt="User" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-green-500">
                    <img src="https://i.pravatar.cc/150?img=5" alt="User" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs">
                    +42
                  </div>
                </div>
                <div className="text-white/60 text-xs mt-2">
                  47 пользователей онлайн
                </div>
              </Glassmorphism>
              
              {/* Stats */}
              <Glassmorphism className="p-5 rounded-xl">
                <h3 className="font-medium mb-4">Статистика форума</h3>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-space-800/60 rounded-lg p-3">
                    <div className="text-2xl font-orbitron text-white/90">824</div>
                    <div className="text-white/60 text-xs">Темы</div>
                  </div>
                  <div className="bg-space-800/60 rounded-lg p-3">
                    <div className="text-2xl font-orbitron text-white/90">5.2k</div>
                    <div className="text-white/60 text-xs">Ответы</div>
                  </div>
                  <div className="bg-space-800/60 rounded-lg p-3">
                    <div className="text-2xl font-orbitron text-white/90">3.8k</div>
                    <div className="text-white/60 text-xs">Пользователи</div>
                  </div>
                  <div className="bg-space-800/60 rounded-lg p-3">
                    <div className="text-2xl font-orbitron text-white/90">128</div>
                    <div className="text-white/60 text-xs">Сегодня</div>
                  </div>
                </div>
              </Glassmorphism>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="events" className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Events calendar */}
            <div className="w-full lg:w-2/3">
              <h2 className="font-orbitron text-xl font-semibold mb-6">
                Предстоящие события
              </h2>
              
              <div className="grid grid-cols-1 gap-4">
                {UPCOMING_EVENTS.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Glassmorphism className="p-6 rounded-xl">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Date display */}
                        <div className="md:w-1/6 flex md:block items-center">
                          <div className="bg-space-800/60 rounded-lg p-3 text-center w-20 md:w-full">
                            <div className="text-xs text-white/60 uppercase">
                              {new Date(event.date).toLocaleDateString('ru-RU', { month: 'short' })}
                            </div>
                            <div className="text-3xl font-orbitron">
                              {new Date(event.date).getDate()}
                            </div>
                            <div className="text-sm font-medium text-white/80">
                              {event.time}
                            </div>
                          </div>
                        </div>
                        
                        {/* Event details */}
                        <div className="md:w-5/6">
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className={`px-2 py-0.5 text-xs rounded-full ${getEventTypeColor(event.type)}`}>
                              {event.type === 'ama' ? 'AMA' : 
                               event.type === 'webinar' ? 'Вебинар' : 
                               event.type === 'hackathon' ? 'Хакатон' : 
                               'Соревнование'}
                            </span>
                            <span className="px-2 py-0.5 text-xs rounded-full bg-white/10 text-white/70">
                              <i className="fas fa-users mr-1"></i> {event.participants} участников
                            </span>
                          </div>
                          <h3 className="font-medium text-lg mb-2">{event.title}</h3>
                          <p className="text-white/70 text-sm mb-4">
                            {event.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/60 mb-4">
                            <span>
                              <i className="fas fa-user mr-1"></i> {event.host}
                            </span>
                            <span>
                              <i className="fas fa-calendar mr-1"></i> {formatDate(event.date)}
                            </span>
                            <span>
                              <i className="fas fa-clock mr-1"></i> {event.time}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button className="bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] hover:from-[#4922B2] hover:to-[#1682A1] text-white py-2 px-4 rounded-lg transition duration-300 text-sm">
                              Зарегистрироваться
                            </button>
                            <button className="bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition duration-300 text-sm">
                              Добавить в календарь
                            </button>
                          </div>
                        </div>
                      </div>
                    </Glassmorphism>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <button className="bg-white/10 hover:bg-white/20 text-white py-2 px-6 rounded-lg transition duration-300">
                  Показать все события
                </button>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="w-full lg:w-1/3 space-y-4">
              {/* Current event */}
              <Glassmorphism className="p-5 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                  <h3 className="font-medium">Сейчас проходит</h3>
                </div>
                
                <div className="bg-space-800/60 rounded-lg p-4">
                  <div className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-300 inline-block mb-2">
                    Вебинар
                  </div>
                  <h4 className="font-medium mb-1">Оптимизация моделей для продакшн</h4>
                  <p className="text-white/60 text-xs mb-2">
                    Изучите техники развертывания и оптимизации моделей ML для высоконагруженных систем.
                  </p>
                  <button className="bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] hover:from-[#4922B2] hover:to-[#1682A1] text-white py-1.5 px-3 rounded-lg transition duration-300 text-xs w-full">
                    Присоединиться сейчас
                  </button>
                </div>
              </Glassmorphism>
              
              {/* Calendar */}
              <Glassmorphism className="p-5 rounded-xl">
                <h3 className="font-medium mb-4">Календарь событий</h3>
                {/* Simple calendar representation */}
                <div className="bg-space-800/60 rounded-lg p-3">
                  <div className="grid grid-cols-7 gap-1 text-center mb-2">
                    <div className="text-white/50 text-xs">Пн</div>
                    <div className="text-white/50 text-xs">Вт</div>
                    <div className="text-white/50 text-xs">Ср</div>
                    <div className="text-white/50 text-xs">Чт</div>
                    <div className="text-white/50 text-xs">Пт</div>
                    <div className="text-white/50 text-xs">Сб</div>
                    <div className="text-white/50 text-xs">Вс</div>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 30 }).map((_, i) => {
                      // Just a mock calendar display
                      const day = i + 1;
                      const isToday = day === 22;
                      const hasEvent = [5, 15, 28].includes(day);
                      
                      return (
                        <div 
                          key={i} 
                          className={`w-full aspect-square flex items-center justify-center text-xs rounded-md ${
                            isToday ? 'bg-[#6E3AFF] text-white' : 
                            hasEvent ? 'bg-white/10 text-white cursor-pointer' : 
                            'text-white/50'
                          }`}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="mt-3 flex justify-center">
                  <button className="text-[#B28DFF] hover:text-[#D2B8FF] text-xs">
                    Открыть полный календарь
                  </button>
                </div>
              </Glassmorphism>
              
              {/* Upcoming challenges */}
              <Glassmorphism className="p-5 rounded-xl">
                <h3 className="font-medium mb-4">Соревнования</h3>
                <div className="space-y-3">
                  <div className="bg-space-800/60 hover:bg-space-800/80 transition-colors rounded-lg p-3 cursor-pointer">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm">Предсказание цен на акции</h4>
                      <span className="text-white/50 text-xs">5 дней</span>
                    </div>
                    <div className="text-white/60 text-xs mt-1">
                      Призовой фонд: ₽100,000
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full mt-2">
                      <div className="h-full w-3/4 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="bg-space-800/60 hover:bg-space-800/80 transition-colors rounded-lg p-3 cursor-pointer">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm">Классификация изображений</h4>
                      <span className="text-white/50 text-xs">2 недели</span>
                    </div>
                    <div className="text-white/60 text-xs mt-1">
                      Призовой фонд: ₽250,000
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full mt-2">
                      <div className="h-full w-1/4 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </Glassmorphism>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="leaderboard" className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main leaderboard */}
            <div className="w-full lg:w-2/3">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-orbitron text-xl font-semibold">
                  Таблица лидеров
                </h2>
                <div className="flex gap-3">
                  <select className="bg-space-800/50 border-white/10 px-3 py-2 rounded-lg text-sm text-white/70">
                    <option value="all-time">За все время</option>
                    <option value="month">Месяц</option>
                    <option value="week">Неделя</option>
                  </select>
                </div>
              </div>
              
              <Glassmorphism className="rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-white/70 border-b border-white/10 bg-space-800/50">
                        <th className="py-4 px-6">Ранг</th>
                        <th className="py-4 px-6">Участник</th>
                        <th className="py-4 px-6">Очки</th>
                        <th className="py-4 px-6">Streak</th>
                        <th className="py-4 px-6">Бейджи</th>
                      </tr>
                    </thead>
                    <tbody>
                      {LEADERBOARD.map((user) => (
                        <motion.tr 
                          key={user.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-b border-white/5 hover:bg-white/5"
                        >
                          <td className="py-4 px-6">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium ${
                              user.rank === 1 ? 'bg-yellow-500' :
                              user.rank === 2 ? 'bg-gray-400' :
                              user.rank === 3 ? 'bg-amber-600' :
                              'bg-white/10'
                            }`}>
                              {user.rank}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-white/50 text-xs">ID: {user.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="font-mono font-medium">{user.score}</div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <div className="text-[#FF3A8C] mr-2">
                                <i className="fas fa-fire"></i>
                              </div>
                              <div className="font-medium">{user.streak} дней</div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex gap-2">
                              {user.badges.map(badge => (
                                <div 
                                  key={badge} 
                                  className={`w-8 h-8 rounded-full bg-white/10 flex items-center justify-center ${getBadgeColor(badge)}`}
                                  title={badge}
                                >
                                  <i className={`fas fa-${getBadgeIcon(badge)}`}></i>
                                </div>
                              ))}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Glassmorphism>
              
              <div className="mt-6 flex justify-center">
                <button className="bg-white/10 hover:bg-white/20 text-white py-2 px-6 rounded-lg transition duration-300">
                  Посмотреть больше
                </button>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="w-full lg:w-1/3 space-y-4">
              {/* Your rank */}
              <Glassmorphism className="p-5 rounded-xl">
                <h3 className="font-medium mb-4">Ваш ранг</h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 relative">
                    <ProgressRing percent={72} size={64} strokeWidth={6}>
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img src="https://i.pravatar.cc/150?img=8" alt="Your avatar" className="w-full h-full object-cover" />
                      </div>
                    </ProgressRing>
                  </div>
                  <div>
                    <div className="text-sm text-white/60">Ваш ранг</div>
                    <div className="text-2xl font-orbitron">#42</div>
                    <div className="text-sm text-white/60">из 3,842 участников</div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="bg-space-800/60 rounded-lg p-2">
                    <div className="text-lg font-medium">2,850</div>
                    <div className="text-white/60 text-xs">Очки</div>
                  </div>
                  <div className="bg-space-800/60 rounded-lg p-2">
                    <div className="text-lg font-medium">14</div>
                    <div className="text-white/60 text-xs">Streak</div>
                  </div>
                  <div className="bg-space-800/60 rounded-lg p-2">
                    <div className="text-lg font-medium">3</div>
                    <div className="text-white/60 text-xs">Бейджа</div>
                  </div>
                </div>
              </Glassmorphism>
              
              {/* Daily Challenge */}
              <Glassmorphism className="p-5 rounded-xl">
                <h3 className="font-medium mb-4">Ежедневный вызов</h3>
                <div className="bg-space-800/60 rounded-lg p-4">
                  <div className="text-[#B28DFF] text-sm font-medium mb-2">
                    <i className="fas fa-star mr-1"></i> +50 очков
                  </div>
                  <h4 className="font-medium mb-1">Визуализация данных</h4>
                  <p className="text-white/70 text-sm mb-3">
                    Создайте интерактивную визуализацию датасета о климатических изменениях.
                  </p>
                  <div className="flex items-center text-xs text-white/50 mb-3">
                    <i className="fas fa-clock mr-1"></i> Осталось 8 часов
                  </div>
                  <button className="bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] hover:from-[#4922B2] hover:to-[#1682A1] text-white py-2 px-4 rounded-lg transition duration-300 text-sm w-full">
                    Принять вызов
                  </button>
                </div>
              </Glassmorphism>
              
              {/* Achievement progress */}
              <Glassmorphism className="p-5 rounded-xl">
                <h3 className="font-medium mb-4">Прогресс достижений</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="text-sm">Мыслитель <i className="fas fa-brain text-purple-400"></i></div>
                      <div className="text-xs text-white/60">7/10</div>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full">
                      <div className="h-full w-[70%] bg-purple-500 rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="text-sm">Кодер <i className="fas fa-code text-blue-400"></i></div>
                      <div className="text-xs text-white/60">12/15</div>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full">
                      <div className="h-full w-[80%] bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="text-sm">Исследователь <i className="fas fa-flask text-green-400"></i></div>
                      <div className="text-xs text-white/60">3/10</div>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full">
                      <div className="h-full w-[30%] bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <button className="text-[#B28DFF] hover:text-[#D2B8FF] text-xs">
                    Все достижения (8/24)
                  </button>
                </div>
              </Glassmorphism>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="discord" className="space-y-6">
          <div className="flex flex-col">
            <h2 className="font-orbitron text-xl font-semibold mb-2">
              Discord сообщество
            </h2>
            <p className="text-white/70 mb-6">
              Присоединяйтесь к нашему активному сообществу в Discord для обсуждений, помощи и совместной работы.
            </p>
            
            <Glassmorphism className="rounded-xl overflow-hidden p-0">
              <div className="relative h-[600px] w-full">
                {/* This would be an iframe to the Discord widget in a real app */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-8xl text-white/10 mb-4">
                    <i className="fab fa-discord"></i>
                  </div>
                  <h3 className="text-xl font-medium mb-2">Подключитесь к Discord</h3>
                  <p className="text-white/60 text-center max-w-md mb-6">
                    В реальном приложении здесь был бы встроенный виджет Discord. Присоединяйтесь к более чем 5000 участников нашего сообщества!
                  </p>
                  <a 
                    href="https://discord.gg/example" 
                    target="_blank" 
                    className="bg-[#5865F2] hover:bg-[#4752C4] text-white py-3 px-6 rounded-lg font-medium transition duration-300 flex items-center"
                  >
                    <i className="fab fa-discord mr-2"></i>
                    Присоединиться к серверу
                  </a>
                </div>
              </div>
            </Glassmorphism>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
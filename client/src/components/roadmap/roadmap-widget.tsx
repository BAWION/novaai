import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { useUserProfile } from "@/context/user-profile-context";

// Define types for our roadmap data
interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: 'completed' | 'in-progress' | 'available' | 'locked';
  duration: string;
  children: string[];
}

interface RoadmapData {
  [key: string]: RoadmapNode;
}

export function RoadmapWidget() {
  const { userProfile } = useUserProfile();
  const [roadmapData, setRoadmapData] = useState<RoadmapData>({});
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Generate roadmap data based on user's profile
  useEffect(() => {
    const track = userProfile?.recommendedTrack || 'zero-to-hero';
    
    const generateRoadmapData = () => {
      const data: RoadmapData = {};
      
      // Root node
      data['root'] = {
        id: 'root',
        title: 'Начало пути',
        description: 'Добро пожаловать в NovaAI University! Это начало вашего путешествия в мир искусственного интеллекта.',
        progress: 100,
        status: 'completed',
        duration: '45 мин',
        children: ['python-basics', 'math-foundations']
      };
      
      // Basic track nodes
      data['python-basics'] = {
        id: 'python-basics',
        title: 'Основы Python',
        description: 'Изучение основ программирования на Python: переменные, типы данных, условия, циклы, функции.',
        progress: 85,
        status: 'in-progress',
        duration: '2ч 30м',
        children: ['data-structures']
      };
      
      data['math-foundations'] = {
        id: 'math-foundations',
        title: 'Математические основы',
        description: 'Линейная алгебра, статистика и исчисление для машинного обучения.',
        progress: 40,
        status: 'in-progress',
        duration: '3ч 15м',
        children: ['ml-intro']
      };
      
      data['data-structures'] = {
        id: 'data-structures',
        title: 'Структуры данных',
        description: 'Изучение списков, словарей, множеств и других структур данных в Python.',
        progress: 0,
        status: 'available',
        duration: '1ч 45м',
        children: ['numpy-pandas']
      };
      
      data['numpy-pandas'] = {
        id: 'numpy-pandas',
        title: 'NumPy и Pandas',
        description: 'Работа с массивами, матрицами и таблицами данных с использованием NumPy и Pandas.',
        progress: 0,
        status: 'locked',
        duration: '2ч 10м',
        children: ['data-visualization']
      };
      
      data['data-visualization'] = {
        id: 'data-visualization',
        title: 'Визуализация данных',
        description: 'Использование Matplotlib, Seaborn и Plotly для визуализации данных.',
        progress: 0,
        status: 'locked',
        duration: '1ч 30м',
        children: ['deep-learning']
      };
      
      data['ml-intro'] = {
        id: 'ml-intro',
        title: 'Введение в ML',
        description: 'Основные концепции и алгоритмы машинного обучения: регрессия, классификация, кластеризация.',
        progress: 0,
        status: 'locked',
        duration: '4ч 20м',
        children: ['deep-learning']
      };
      
      data['deep-learning'] = {
        id: 'deep-learning',
        title: 'Глубокое обучение',
        description: 'Нейронные сети, функции активации, оптимизаторы. Работа с TensorFlow и PyTorch.',
        progress: 0,
        status: 'locked',
        duration: '6ч 45м',
        children: []
      };
      
      // Additional nodes for each track
      if (track === 'research-ai') {
        data['ml-research'] = {
          id: 'ml-research',
          title: 'Исследования в ML',
          description: 'Методики проведения исследований в области машинного обучения, написание научных статей.',
          progress: 0,
          status: 'locked',
          duration: '5ч 30м',
          children: []
        };
        
        data['deep-learning'].children.push('ml-research');
      } else if (track === 'applied-ds') {
        data['ml-deployment'] = {
          id: 'ml-deployment',
          title: 'MLOps и развертывание',
          description: 'Развертывание и поддержка ML-моделей в production-среде.',
          progress: 0,
          status: 'locked',
          duration: '4ч 15м',
          children: []
        };
        
        data['deep-learning'].children.push('ml-deployment');
      }
      
      return data;
    };
    
    const data = generateRoadmapData();
    setRoadmapData(data);
    setSelectedNode('root');
  }, [userProfile]);

  // Function to get the status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'in-progress':
        return 'bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1]';
      case 'available':
        return 'bg-gradient-to-r from-amber-500 to-orange-500';
      case 'locked':
      default:
        return 'bg-[#333333]';
    }
  };

  // Function to get the status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'fa-check';
      case 'in-progress':
        return 'fa-circle-notch fa-spin';
      case 'available':
        return 'fa-play';
      case 'locked':
      default:
        return 'fa-lock';
    }
  };

  // Function to navigate to the next available module
  const startNextModule = () => {
    const availableNode = Object.values(roadmapData).find(
      node => node.status === 'available'
    );
    
    if (availableNode) {
      console.log(`Starting module: ${availableNode.title}`);
      alert(`Начинаем модуль: ${availableNode.title}`);
    }
  };

  // Set the color of progress bar based on status
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

  // Функции для расчета статистики галактического маршрута
  const getTotalTime = () => {
    const totalMinutes = Object.values(roadmapData).reduce((sum, module: any) => {
      const duration = module.duration || '0 мин';
      const minutes = parseInt(duration.replace(/\D/g, '')) || 0;
      return sum + minutes;
    }, 0);
    
    if (totalMinutes >= 60) {
      const hours = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;
      return mins > 0 ? `${hours}ч ${mins}м` : `${hours}ч`;
    }
    return `${totalMinutes}м`;
  };

  const getCompletedModules = () => {
    return Object.values(roadmapData).filter((module: any) => module.status === 'completed').length;
  };

  const getAvailableModules = () => {
    return Object.values(roadmapData).filter((module: any) => module.status === 'available').length;
  };

  const getOverallProgress = () => {
    const modules = Object.values(roadmapData);
    const totalProgress = modules.reduce((sum, module: any) => sum + (module.progress || 0), 0);
    return Math.round(totalProgress / modules.length);
  };

  return (
    <div className="space-y-6">
      {/* Галактическая дорожная карта */}
      <div className="w-full">
        <Glassmorphism className="rounded-xl p-8 min-h-[700px] relative overflow-hidden">
          {/* Космический фон */}
          <div className="absolute inset-0 opacity-30">
            {/* Звезды */}
            {Array.from({ length: 50 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-0.5 h-0.5 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [0.5, 1.2, 0.5],
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
            {/* Туманности */}
            <div className="absolute top-10 right-20 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-2xl" />
            <div className="absolute bottom-20 left-10 w-40 h-40 bg-gradient-to-br from-cyan-500/20 to-green-500/20 rounded-full blur-3xl" />
          </div>

          {/* Заголовок с общей информацией */}
          <div className="relative z-10 mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h2 className="text-2xl font-orbitron font-bold text-white mb-2">🌌 Дорожная карта</h2>
                <p className="text-white/70">Персонализированный путь во вселенной искусственного интеллекта</p>
              </div>
              <div className="bg-gradient-to-r from-space-800/80 to-space-700/80 backdrop-blur-sm rounded-xl p-4 border border-primary/30">
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-primary font-bold text-lg">{getTotalTime()}</div>
                    <div className="text-white/60">Общее время</div>
                  </div>
                  <div className="w-px h-8 bg-white/20" />
                  <div className="text-center">
                    <div className="text-green-400 font-bold text-lg">{getCompletedModules()}</div>
                    <div className="text-white/60">Завершено</div>
                  </div>
                  <div className="w-px h-8 bg-white/20" />
                  <div className="text-center">
                    <div className="text-amber-400 font-bold text-lg">{getAvailableModules()}</div>
                    <div className="text-white/60">Доступно</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Галактическая дорожная карта */}
          <div className="relative z-10 overflow-x-auto">
            <div className="min-w-[800px] lg:min-w-[1200px] h-[500px] lg:h-[600px] relative">
              {Object.keys(roadmapData).length > 0 && (
                <div className="relative w-full h-full">
                  {/* Космические соединительные пути */}
                  <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                    <defs>
                      <linearGradient id="cosmicPath" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#10B981', stopOpacity: 0.6 }} />
                        <stop offset="50%" style={{ stopColor: '#3B82F6', stopOpacity: 0.8 }} />
                        <stop offset="100%" style={{ stopColor: '#8B5CF6', stopOpacity: 0.6 }} />
                      </linearGradient>
                    </defs>
                    
                    {/* Адаптивные орбитальные пути */}
                    <path d="M 400 80 L 250 160" stroke="url(#cosmicPath)" strokeWidth="2" fill="none" strokeDasharray="4,4" opacity="0.7" className="hidden lg:block" />
                    <path d="M 400 80 L 550 160" stroke="url(#cosmicPath)" strokeWidth="2" fill="none" strokeDasharray="4,4" opacity="0.7" className="hidden lg:block" />
                    <path d="M 250 220 L 250 300" stroke="url(#cosmicPath)" strokeWidth="2" fill="none" strokeDasharray="3,3" opacity="0.5" className="hidden lg:block" />
                    <path d="M 550 220 L 550 300" stroke="url(#cosmicPath)" strokeWidth="2" fill="none" strokeDasharray="3,3" opacity="0.5" className="hidden lg:block" />
                    <path d="M 250 360 L 400 400" stroke="url(#cosmicPath)" strokeWidth="1" fill="none" strokeDasharray="2,2" opacity="0.4" className="hidden lg:block" />
                    <path d="M 550 360 L 400 400" stroke="url(#cosmicPath)" strokeWidth="1" fill="none" strokeDasharray="2,2" opacity="0.4" className="hidden lg:block" />
                    
                    {/* Мобильные пути */}
                    <path d="M 600 100 L 350 220" stroke="url(#cosmicPath)" strokeWidth="2" fill="none" strokeDasharray="4,4" opacity="0.7" className="lg:hidden" />
                    <path d="M 600 100 L 850 220" stroke="url(#cosmicPath)" strokeWidth="2" fill="none" strokeDasharray="4,4" opacity="0.7" className="lg:hidden" />
                    <path d="M 350 280 L 350 400" stroke="url(#cosmicPath)" strokeWidth="2" fill="none" strokeDasharray="3,3" opacity="0.5" className="lg:hidden" />
                    <path d="M 850 280 L 850 400" stroke="url(#cosmicPath)" strokeWidth="2" fill="none" strokeDasharray="3,3" opacity="0.5" className="lg:hidden" />
                    <path d="M 350 460 L 600 520" stroke="url(#cosmicPath)" strokeWidth="1" fill="none" strokeDasharray="2,2" opacity="0.4" className="lg:hidden" />
                    <path d="M 850 460 L 600 520" stroke="url(#cosmicPath)" strokeWidth="1" fill="none" strokeDasharray="2,2" opacity="0.4" className="lg:hidden" />
                  </svg>

                  {/* Стартовая планета (центр) */}
                  <div className="absolute top-[50px] lg:top-[70px] left-1/2 transform -translate-x-1/2 z-10">
                    <motion.div 
                      className={`cursor-pointer ${selectedNode === 'root' ? 'scale-110' : ''}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedNode('root')}
                    >
                      <div className={`w-12 h-12 lg:w-16 lg:h-16 rounded-full ${getStatusColor(roadmapData['root']?.status || 'available')} flex items-center justify-center text-white shadow-2xl border-2 border-white/30 relative`}>
                        <div className="absolute inset-0 rounded-full border border-white/20 animate-pulse" />
                        <i className={`fas ${getStatusIcon(roadmapData['root']?.status || 'available')} text-lg`}></i>
                      </div>
                      <div className="mt-2 lg:mt-3 text-center">
                        <p className="font-medium text-xs lg:text-sm text-white">{roadmapData['root']?.title || 'AI Основы'}</p>
                        <p className="text-xs text-primary font-semibold">{roadmapData['root']?.duration || '2 часа'}</p>
                        <div className="w-12 lg:w-16 h-1.5 lg:h-2 bg-white/20 rounded-full mt-1 lg:mt-2">
                          <div 
                            className={`h-full rounded-full bg-gradient-to-r ${getProgressBarColor(roadmapData['root']?.status || 'available')}`} 
                            style={{ width: `${roadmapData['root']?.progress || 0}%` }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Базовые планеты */}
                  <div className="absolute top-[150px] lg:top-[200px] left-[200px] lg:left-[320px] z-10">
                    <motion.div 
                      className={`cursor-pointer ${selectedNode === 'python-basics' ? 'scale-110' : ''}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedNode('python-basics')}
                      animate={{ y: [-2, 2, -2] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <div className={`w-10 h-10 lg:w-14 lg:h-14 rounded-full ${getStatusColor(roadmapData['python-basics']?.status || 'locked')} flex items-center justify-center text-white shadow-xl border border-white/20 relative`}>
                        {(roadmapData['python-basics']?.status || 'locked') === 'locked' && (
                          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                            <i className="fas fa-lock text-white/60 text-sm"></i>
                          </div>
                        )}
                        <i className={`fas ${getStatusIcon(roadmapData['python-basics']?.status || 'locked')} text-base`}></i>
                      </div>
                      <div className="mt-1 lg:mt-2 text-center">
                        <p className="font-medium text-xs lg:text-xs text-white">{roadmapData['python-basics']?.title || 'Python'}</p>
                        <p className="text-xs text-primary font-semibold">{roadmapData['python-basics']?.duration || '3 часа'}</p>
                        <div className="w-10 lg:w-14 h-1 lg:h-1.5 bg-white/20 rounded-full mt-1">
                          <div 
                            className={`h-full rounded-full bg-gradient-to-r ${getProgressBarColor(roadmapData['python-basics']?.status || 'locked')}`} 
                            style={{ width: `${roadmapData['python-basics']?.progress || 0}%` }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <div className="absolute top-[150px] lg:top-[200px] left-[520px] lg:left-[820px] z-10">
                    <motion.div 
                      className={`cursor-pointer ${selectedNode === 'math-foundations' ? 'scale-110' : ''}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedNode('math-foundations')}
                      animate={{ y: [2, -2, 2] }}
                      transition={{ duration: 3.5, repeat: Infinity }}
                    >
                      <div className={`w-14 h-14 rounded-full ${getStatusColor(roadmapData['math-foundations']?.status || 'locked')} flex items-center justify-center text-white shadow-xl border border-white/20 relative`}>
                        {(roadmapData['math-foundations']?.status || 'locked') === 'locked' && (
                          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                            <i className="fas fa-lock text-white/60 text-sm"></i>
                          </div>
                        )}
                        <i className={`fas ${getStatusIcon(roadmapData['math-foundations']?.status || 'locked')} text-base`}></i>
                      </div>
                      <div className="mt-2 text-center">
                        <p className="font-medium text-xs text-white">{roadmapData['math-foundations']?.title || 'Математика'}</p>
                        <p className="text-xs text-primary font-semibold">{roadmapData['math-foundations']?.duration || '4 часа'}</p>
                        <div className="w-14 h-1.5 bg-white/20 rounded-full mt-1">
                          <div 
                            className={`h-full rounded-full bg-gradient-to-r ${getProgressBarColor(roadmapData['math-foundations']?.status || 'locked')}`} 
                            style={{ width: `${roadmapData['math-foundations']?.progress || 0}%` }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Специализированные планеты */}
                  <div className="absolute top-[280px] lg:top-[380px] left-[200px] lg:left-[320px] z-10">
                    <motion.div 
                      className={`cursor-pointer ${selectedNode === 'data-structures' ? 'scale-110' : ''}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedNode('data-structures')}
                      animate={{ rotate: [0, 2, 0, -2, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <div className={`w-12 h-12 rounded-full ${getStatusColor(roadmapData['data-structures']?.status || 'locked')} flex items-center justify-center text-white shadow-lg border border-white/20 relative`}>
                        {(roadmapData['data-structures']?.status || 'locked') === 'locked' && (
                          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                            <i className="fas fa-lock text-white/60 text-xs"></i>
                          </div>
                        )}
                        <i className={`fas ${getStatusIcon(roadmapData['data-structures']?.status || 'locked')} text-sm`}></i>
                      </div>
                      <div className="mt-2 text-center">
                        <p className="font-medium text-xs text-white">{roadmapData['data-structures']?.title || 'Данные'}</p>
                        <p className="text-xs text-primary font-semibold">{roadmapData['data-structures']?.duration || '2 часа'}</p>
                      </div>
                    </motion.div>
                  </div>

                  <div className="absolute top-[280px] lg:top-[380px] left-[520px] lg:left-[820px] z-10">
                    <motion.div 
                      className={`cursor-pointer ${selectedNode === 'ml-intro' ? 'scale-110' : ''}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedNode('ml-intro')}
                      animate={{ rotate: [0, -2, 0, 2, 0] }}
                      transition={{ duration: 4.5, repeat: Infinity }}
                    >
                      <div className={`w-12 h-12 rounded-full ${getStatusColor(roadmapData['ml-intro']?.status || 'locked')} flex items-center justify-center text-white shadow-lg border border-white/20 relative`}>
                        {(roadmapData['ml-intro']?.status || 'locked') === 'locked' && (
                          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                            <i className="fas fa-lock text-white/60 text-xs"></i>
                          </div>
                        )}
                        <i className={`fas ${getStatusIcon(roadmapData['ml-intro']?.status || 'locked')} text-sm`}></i>
                      </div>
                      <div className="mt-2 text-center">
                        <p className="font-medium text-xs text-white">{roadmapData['ml-intro']?.title || 'ML Основы'}</p>
                        <p className="text-xs text-primary font-semibold">{roadmapData['ml-intro']?.duration || '5 часов'}</p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Продвинутые спутники */}
                  <div className="absolute top-[380px] lg:top-[500px] left-[260px] lg:left-[360px] z-10">
                    <motion.div 
                      className={`cursor-pointer ${selectedNode === 'numpy-pandas' ? 'scale-110' : ''}`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedNode('numpy-pandas')}
                      animate={{ y: [-1, 1, -1] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    >
                      <div className={`w-10 h-10 rounded-full ${getStatusColor(roadmapData['numpy-pandas']?.status || 'locked')} flex items-center justify-center text-white shadow-md`}>
                        <i className={`fas ${getStatusIcon(roadmapData['numpy-pandas']?.status || 'locked')} text-xs`}></i>
                      </div>
                      <div className="mt-1 text-center">
                        <p className="font-medium text-xs text-white">{roadmapData['numpy-pandas']?.title || 'NumPy'}</p>
                        <p className="text-xs text-primary font-semibold">{roadmapData['numpy-pandas']?.duration || '1 час'}</p>
                      </div>
                    </motion.div>
                  </div>

                  <div className="absolute top-[380px] lg:top-[500px] left-[460px] lg:left-[580px] z-10">
                    <motion.div 
                      className={`cursor-pointer ${selectedNode === 'deep-learning' ? 'scale-110' : ''}`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedNode('deep-learning')}
                      animate={{ y: [1, -1, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <div className={`w-10 h-10 rounded-full ${getStatusColor(roadmapData['deep-learning']?.status || 'locked')} flex items-center justify-center text-white shadow-md`}>
                        <i className={`fas ${getStatusIcon(roadmapData['deep-learning']?.status || 'locked')} text-xs`}></i>
                      </div>
                      <div className="mt-1 text-center">
                        <p className="font-medium text-xs text-white">{roadmapData['deep-learning']?.title || 'Deep Learning'}</p>
                        <p className="text-xs text-primary font-semibold">{roadmapData['deep-learning']?.duration || '6 часов'}</p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Мобильная легенда */}
                  <div className="absolute bottom-2 left-2 lg:bottom-4 lg:left-4 bg-space-800/90 backdrop-blur-sm rounded-lg p-2 lg:p-3 border border-white/10">
                    <div className="text-xs text-white/60 mb-1 lg:mb-2 font-semibold">СТАТУСЫ</div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-2 lg:gap-x-4 gap-y-1 text-xs">
                      <div className="flex items-center gap-1 lg:gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-white/80 text-xs">Завершен</span>
                      </div>
                      <div className="flex items-center gap-1 lg:gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-white/80 text-xs">В процессе</span>
                      </div>
                      <div className="flex items-center gap-1 lg:gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                        <span className="text-white/80 text-xs">Доступен</span>
                      </div>
                      <div className="flex items-center gap-1 lg:gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                        <span className="text-white/80 text-xs">Блокирован</span>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-2 right-2 lg:bottom-4 lg:right-4 bg-space-800/90 backdrop-blur-sm rounded-lg p-2 lg:p-3 border border-white/10">
                    <div className="text-xs text-white/60 mb-1 lg:mb-2 font-semibold">ПРОГРЕСС</div>
                    <div className="w-20 lg:w-28 h-1.5 lg:h-2 bg-white/20 rounded-full">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-green-500 to-purple-500"
                        style={{ width: `${getOverallProgress()}%` }}
                      />
                    </div>
                    <div className="text-xs text-primary font-semibold mt-1">{getOverallProgress()}%</div>
                  </div>


                </div>
              )}
            </div>
          </div>
        </Glassmorphism>
      </div>
      {/* Sidebar with module details */}
      <div className="w-full lg:w-4/12">
        <Glassmorphism className="rounded-xl p-4 lg:p-6">
          {selectedNode && roadmapData[selectedNode] && (
            <div>
              <div className="flex items-center mb-4">
                <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full ${getStatusColor(roadmapData[selectedNode].status)} flex items-center justify-center text-white shadow-lg mr-3 lg:mr-4`}>
                  <i className={`fas ${getStatusIcon(roadmapData[selectedNode].status)} text-sm lg:text-lg`}></i>
                </div>
                <div>
                  <h3 className="font-semibold text-white text-base lg:text-lg">{roadmapData[selectedNode].title}</h3>
                  <p className="text-white/60 text-sm">
                    {roadmapData[selectedNode].status === 'completed' && 'Завершено'}
                    {roadmapData[selectedNode].status === 'in-progress' && 'В процессе'}
                    {roadmapData[selectedNode].status === 'available' && 'Доступно'}
                    {roadmapData[selectedNode].status === 'locked' && 'Заблокировано'}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/80">Длительность</span>
                  <span className="text-primary font-semibold">{roadmapData[selectedNode].duration}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/80">Прогресс</span>
                  <span className="text-white/80">{roadmapData[selectedNode].progress}%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r ${getProgressBarColor(roadmapData[selectedNode].status)}`}
                    style={{ width: `${roadmapData[selectedNode].progress}%` }}
                  ></div>
                </div>
              </div>

              <p className="text-white/70 text-sm mb-6">{roadmapData[selectedNode].description}</p>

              {roadmapData[selectedNode].status === 'available' && (
                <button 
                  onClick={startNextModule}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 px-4 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all"
                >
                  Начать модуль
                </button>
              )}

              {roadmapData[selectedNode].status === 'in-progress' && (
                <button 
                  className="w-full bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-all"
                >
                  Продолжить
                </button>
              )}

              {roadmapData[selectedNode].status === 'completed' && (
                <button 
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-all"
                >
                  Повторить
                </button>
              )}

              {roadmapData[selectedNode].status === 'locked' && (
                <div className="w-full bg-gray-600 text-white/60 py-2 px-4 rounded-lg font-medium text-center">
                  Завершите предыдущие модули
                </div>
              )}
            </div>
          )}
        </Glassmorphism>
      </div>
    </div>
  );
}
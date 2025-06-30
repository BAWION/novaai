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
                <h2 className="text-2xl font-orbitron font-bold text-white mb-2">
                  🌌 Галактический маршрут обучения
                </h2>
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

          {/* Дорожная карта */}
          <div className="relative z-10 overflow-x-auto">
            <div className="min-w-[1200px] h-[600px] relative">
              {Object.keys(roadmapData).length > 0 && (
                <div className="relative w-full h-full">
                  {/* Орбитальные пути */}
                  <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                    <defs>
                      <linearGradient id="mainOrbit" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: '#10B981', stopOpacity: 0.6 }} />
                        <stop offset="50%" style={{ stopColor: '#3B82F6', stopOpacity: 0.8 }} />
                        <stop offset="100%" style={{ stopColor: '#8B5CF6', stopOpacity: 0.6 }} />
                      </linearGradient>
                      <linearGradient id="secondaryOrbit" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: '#6366F1', stopOpacity: 0.5 }} />
                        <stop offset="100%" style={{ stopColor: '#EC4899', stopOpacity: 0.5 }} />
                      </linearGradient>
                    </defs>
                    
                    {/* Соединительные пути */}
                    <path
                      d="M 600 80 Q 450 120 350 180 Q 320 200 320 230"
                      stroke="url(#mainOrbit)"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="5,5"
                      className="animate-pulse"
                    />
                    <path
                      d="M 600 80 Q 750 120 850 180 Q 880 200 880 230"
                      stroke="url(#mainOrbit)"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="5,5"
                      className="animate-pulse"
                    />
                    <path
                      d="M 320 280 Q 300 350 320 420"
                      stroke="url(#secondaryOrbit)"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M 880 280 Q 900 350 880 420"
                      stroke="url(#secondaryOrbit)"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      d="M 360 450 Q 500 480 640 450"
                      stroke="url(#secondaryOrbit)"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>

                  {/* Уровень 1: Стартовая планета */}
                  <div className="absolute top-[50px] left-1/2 transform -translate-x-1/2 z-10">
                    <motion.div 
                      className={`cursor-pointer ${selectedNode === 'root' ? 'scale-110' : ''}`}
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedNode('root')}
                      animate={{ 
                        boxShadow: roadmapData['root'].status === 'completed' 
                          ? ["0 0 20px rgba(16, 185, 129, 0.5)", "0 0 40px rgba(16, 185, 129, 0.8)", "0 0 20px rgba(16, 185, 129, 0.5)"]
                          : roadmapData['root'].status === 'in-progress'
                          ? ["0 0 15px rgba(59, 130, 246, 0.5)", "0 0 25px rgba(59, 130, 246, 0.7)", "0 0 15px rgba(59, 130, 246, 0.5)"]
                          : "0 0 10px rgba(107, 114, 128, 0.3)"
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className={`w-16 h-16 rounded-full ${getStatusColor(roadmapData['root'].status)} flex items-center justify-center text-white shadow-2xl border-2 border-white/20 relative overflow-hidden`}>
                        {/* Анимированные кольца */}
                        <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping" />
                        <div className="absolute inset-1 rounded-full border border-white/20 animate-pulse" />
                        <i className={`fas ${getStatusIcon(roadmapData['root'].status)} text-lg relative z-10`}></i>
                      </div>
                      <div className="mt-3 text-center">
                        <p className="font-medium text-sm text-white whitespace-nowrap">{roadmapData['root'].title}</p>
                        <p className="text-xs text-primary font-semibold mt-1">{roadmapData['root'].duration}</p>
                        <div className="w-16 h-2 bg-white/10 rounded-full mt-2">
                          <div 
                            className={`h-full rounded-full bg-gradient-to-r ${getProgressBarColor(roadmapData['root'].status)}`} 
                            style={{ width: `${roadmapData['root'].progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Уровень 2: Базовые планеты */}
                  <div className="absolute top-[200px] left-[280px] z-10">
                    <motion.div 
                      className={`cursor-pointer ${selectedNode === 'python-basics' ? 'scale-110' : ''}`}
                      whileHover={{ scale: 1.05, rotate: -3 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedNode('python-basics')}
                      animate={{ 
                        y: [-2, 2, -2],
                        boxShadow: roadmapData['python-basics'].status === 'completed' 
                          ? ["0 0 15px rgba(16, 185, 129, 0.4)", "0 0 25px rgba(16, 185, 129, 0.6)", "0 0 15px rgba(16, 185, 129, 0.4)"]
                          : roadmapData['python-basics'].status === 'available'
                          ? ["0 0 10px rgba(245, 158, 11, 0.4)", "0 0 20px rgba(245, 158, 11, 0.6)", "0 0 10px rgba(245, 158, 11, 0.4)"]
                          : "0 0 5px rgba(107, 114, 128, 0.3)"
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <div className={`w-14 h-14 rounded-full ${getStatusColor(roadmapData['python-basics'].status)} flex items-center justify-center text-white shadow-xl border border-white/20 relative`}>
                        {roadmapData['python-basics'].status === 'locked' && (
                          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                            <i className="fas fa-lock text-white/60 text-xs"></i>
                          </div>
                        )}
                        <i className={`fas ${getStatusIcon(roadmapData['python-basics'].status)} text-base`}></i>
                      </div>
                      <div className="mt-2 text-center">
                        <p className="font-medium text-xs text-white whitespace-nowrap">{roadmapData['python-basics'].title}</p>
                        <p className="text-xs text-primary font-semibold">{roadmapData['python-basics'].duration}</p>
                        <div className="w-14 h-1.5 bg-white/10 rounded-full mt-1">
                          <div 
                            className={`h-full rounded-full bg-gradient-to-r ${getProgressBarColor(roadmapData['python-basics'].status)}`} 
                            style={{ width: `${roadmapData['python-basics'].progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <div className="absolute top-[200px] left-[840px] z-10">
                    <motion.div 
                      className={`cursor-pointer ${selectedNode === 'math-foundations' ? 'scale-110' : ''}`}
                      whileHover={{ scale: 1.05, rotate: 3 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedNode('math-foundations')}
                      animate={{ 
                        y: [2, -2, 2],
                        boxShadow: roadmapData['math-foundations'].status === 'completed' 
                          ? ["0 0 15px rgba(16, 185, 129, 0.4)", "0 0 25px rgba(16, 185, 129, 0.6)", "0 0 15px rgba(16, 185, 129, 0.4)"]
                          : roadmapData['math-foundations'].status === 'available'
                          ? ["0 0 10px rgba(245, 158, 11, 0.4)", "0 0 20px rgba(245, 158, 11, 0.6)", "0 0 10px rgba(245, 158, 11, 0.4)"]
                          : "0 0 5px rgba(107, 114, 128, 0.3)"
                      }}
                      transition={{ duration: 3.5, repeat: Infinity }}
                    >
                      <div className={`w-14 h-14 rounded-full ${getStatusColor(roadmapData['math-foundations'].status)} flex items-center justify-center text-white shadow-xl border border-white/20 relative`}>
                        {roadmapData['math-foundations'].status === 'locked' && (
                          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                            <i className="fas fa-lock text-white/60 text-xs"></i>
                          </div>
                        )}
                        <i className={`fas ${getStatusIcon(roadmapData['math-foundations'].status)} text-base`}></i>
                      </div>
                      <div className="mt-2 text-center">
                        <p className="font-medium text-xs text-white whitespace-nowrap">{roadmapData['math-foundations'].title}</p>
                        <p className="text-xs text-primary font-semibold">{roadmapData['math-foundations'].duration}</p>
                        <div className="w-14 h-1.5 bg-white/10 rounded-full mt-1">
                          <div 
                            className={`h-full rounded-full bg-gradient-to-r ${getProgressBarColor(roadmapData['math-foundations'].status)}`} 
                            style={{ width: `${roadmapData['math-foundations'].progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Vertical lines from root */}
                  <div className="absolute top-[90px] left-[40%] w-0.5 h-[60px] bg-gradient-to-b from-green-500 to-emerald-500"></div>
                  <div className="absolute top-[90px] left-[60%] w-0.5 h-[60px] bg-gradient-to-b from-green-500 to-emerald-500"></div>

                  {/* Level 2: First branching */}
                  <div className="absolute top-[150px] left-[30%] z-10">
                    <motion.div 
                      className={`cursor-pointer ${selectedNode === 'python-basics' ? 'scale-110' : ''}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedNode('python-basics')}
                    >
                      <div className={`w-12 h-12 rounded-full ${getStatusColor(roadmapData['python-basics'].status)} flex items-center justify-center text-white shadow-lg`}>
                        <i className={`fas ${getStatusIcon(roadmapData['python-basics'].status)} text-sm`}></i>
                      </div>
                      <div className="mt-2 text-center">
                        <p className="font-medium text-xs whitespace-nowrap">{roadmapData['python-basics'].title}</p>
                        <div className="w-12 h-1 bg-white/10 rounded-full mt-1">
                          <div 
                            className={`h-full rounded-full bg-gradient-to-r ${getProgressBarColor(roadmapData['python-basics'].status)}`} 
                            style={{ width: `${roadmapData['python-basics'].progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <div className="absolute top-[150px] left-[70%] z-10">
                    <motion.div 
                      className={`cursor-pointer ${selectedNode === 'math-foundations' ? 'scale-110' : ''}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedNode('math-foundations')}
                    >
                      <div className={`w-12 h-12 rounded-full ${getStatusColor(roadmapData['math-foundations'].status)} flex items-center justify-center text-white shadow-lg`}>
                        <i className={`fas ${getStatusIcon(roadmapData['math-foundations'].status)} text-sm`}></i>
                      </div>
                      <div className="mt-2 text-center">
                        <p className="font-medium text-xs whitespace-nowrap">{roadmapData['math-foundations'].title}</p>
                        <div className="w-12 h-1 bg-white/10 rounded-full mt-1">
                          <div 
                            className={`h-full rounded-full bg-gradient-to-r ${getProgressBarColor(roadmapData['math-foundations'].status)}`} 
                            style={{ width: `${roadmapData['math-foundations'].progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Уровень 3: Специализированные планеты */}
                  <div className="absolute top-[380px] left-[280px] z-10">
                    <motion.div 
                      className={`cursor-pointer ${selectedNode === 'data-structures' ? 'scale-110' : ''}`}
                      whileHover={{ scale: 1.05, rotate: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedNode('data-structures')}
                      animate={{ 
                        rotate: [0, 2, 0, -2, 0],
                        boxShadow: roadmapData['data-structures'].status === 'completed' 
                          ? ["0 0 12px rgba(16, 185, 129, 0.4)", "0 0 20px rgba(16, 185, 129, 0.6)", "0 0 12px rgba(16, 185, 129, 0.4)"]
                          : roadmapData['data-structures'].status === 'available'
                          ? ["0 0 8px rgba(245, 158, 11, 0.4)", "0 0 15px rgba(245, 158, 11, 0.6)", "0 0 8px rgba(245, 158, 11, 0.4)"]
                          : "0 0 5px rgba(107, 114, 128, 0.3)"
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <div className={`w-12 h-12 rounded-full ${getStatusColor(roadmapData['data-structures'].status)} flex items-center justify-center text-white shadow-lg border border-white/20 relative`}>
                        {roadmapData['data-structures'].status === 'locked' && (
                          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                            <i className="fas fa-lock text-white/60 text-xs"></i>
                          </div>
                        )}
                        <i className={`fas ${getStatusIcon(roadmapData['data-structures'].status)} text-sm`}></i>
                      </div>
                      <div className="mt-2 text-center">
                        <p className="font-medium text-xs text-white whitespace-nowrap">{roadmapData['data-structures'].title}</p>
                        <p className="text-xs text-primary font-semibold">{roadmapData['data-structures'].duration}</p>
                        <div className="w-12 h-1 bg-white/10 rounded-full mt-1">
                          <div 
                            className={`h-full rounded-full bg-gradient-to-r ${getProgressBarColor(roadmapData['data-structures'].status)}`} 
                            style={{ width: `${roadmapData['data-structures'].progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <div className="absolute top-[380px] left-[840px] z-10">
                    <motion.div 
                      className={`cursor-pointer ${selectedNode === 'ml-intro' ? 'scale-110' : ''}`}
                      whileHover={{ scale: 1.05, rotate: 2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedNode('ml-intro')}
                      animate={{ 
                        rotate: [0, -2, 0, 2, 0],
                        boxShadow: roadmapData['ml-intro'].status === 'completed' 
                          ? ["0 0 12px rgba(16, 185, 129, 0.4)", "0 0 20px rgba(16, 185, 129, 0.6)", "0 0 12px rgba(16, 185, 129, 0.4)"]
                          : roadmapData['ml-intro'].status === 'available'
                          ? ["0 0 8px rgba(245, 158, 11, 0.4)", "0 0 15px rgba(245, 158, 11, 0.6)", "0 0 8px rgba(245, 158, 11, 0.4)"]
                          : "0 0 5px rgba(107, 114, 128, 0.3)"
                      }}
                      transition={{ duration: 4.5, repeat: Infinity }}
                    >
                      <div className={`w-12 h-12 rounded-full ${getStatusColor(roadmapData['ml-intro'].status)} flex items-center justify-center text-white shadow-lg border border-white/20 relative`}>
                        {roadmapData['ml-intro'].status === 'locked' && (
                          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                            <i className="fas fa-lock text-white/60 text-xs"></i>
                          </div>
                        )}
                        <i className={`fas ${getStatusIcon(roadmapData['ml-intro'].status)} text-sm`}></i>
                      </div>
                      <div className="mt-2 text-center">
                        <p className="font-medium text-xs text-white whitespace-nowrap">{roadmapData['ml-intro'].title}</p>
                        <p className="text-xs text-primary font-semibold">{roadmapData['ml-intro'].duration}</p>
                        <div className="w-12 h-1 bg-white/10 rounded-full mt-1">
                          <div 
                            className={`h-full rounded-full bg-gradient-to-r ${getProgressBarColor(roadmapData['ml-intro'].status)}`} 
                            style={{ width: `${roadmapData['ml-intro'].progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Уровень 4: Продвинутые спутники */}
                  <div className="absolute top-[520px] left-[320px] z-10">
                    <motion.div 
                      className={`cursor-pointer ${selectedNode === 'numpy-pandas' ? 'scale-110' : ''}`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedNode('numpy-pandas')}
                      animate={{ 
                        y: [-1, 1, -1],
                        boxShadow: roadmapData['numpy-pandas'].status === 'completed' 
                          ? ["0 0 8px rgba(16, 185, 129, 0.4)", "0 0 15px rgba(16, 185, 129, 0.6)", "0 0 8px rgba(16, 185, 129, 0.4)"]
                          : roadmapData['numpy-pandas'].status === 'available'
                          ? ["0 0 6px rgba(245, 158, 11, 0.4)", "0 0 12px rgba(245, 158, 11, 0.6)", "0 0 6px rgba(245, 158, 11, 0.4)"]
                          : "0 0 3px rgba(107, 114, 128, 0.3)"
                      }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    >
                      <div className={`w-10 h-10 rounded-full ${getStatusColor(roadmapData['numpy-pandas'].status)} flex items-center justify-center text-white shadow-md border border-white/20 relative`}>
                        {roadmapData['numpy-pandas'].status === 'locked' && (
                          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                            <i className="fas fa-lock text-white/60 text-xs"></i>
                          </div>
                        )}
                        <i className={`fas ${getStatusIcon(roadmapData['numpy-pandas'].status)} text-xs`}></i>
                      </div>
                      <div className="mt-1 text-center">
                        <p className="font-medium text-xs text-white whitespace-nowrap">{roadmapData['numpy-pandas'].title}</p>
                        <p className="text-xs text-primary font-semibold">{roadmapData['numpy-pandas'].duration}</p>
                      </div>
                    </motion.div>
                  </div>

                  <div className="absolute top-[520px] left-[600px] z-10">
                    <motion.div 
                      className={`cursor-pointer ${selectedNode === 'deep-learning' ? 'scale-110' : ''}`}
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedNode('deep-learning')}
                      animate={{ 
                        y: [1, -1, 1],
                        boxShadow: roadmapData['deep-learning'].status === 'completed' 
                          ? ["0 0 8px rgba(16, 185, 129, 0.4)", "0 0 15px rgba(16, 185, 129, 0.6)", "0 0 8px rgba(16, 185, 129, 0.4)"]
                          : roadmapData['deep-learning'].status === 'available'
                          ? ["0 0 6px rgba(245, 158, 11, 0.4)", "0 0 12px rgba(245, 158, 11, 0.6)", "0 0 6px rgba(245, 158, 11, 0.4)"]
                          : "0 0 3px rgba(107, 114, 128, 0.3)"
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <div className={`w-10 h-10 rounded-full ${getStatusColor(roadmapData['deep-learning'].status)} flex items-center justify-center text-white shadow-md border border-white/20 relative`}>
                        {roadmapData['deep-learning'].status === 'locked' && (
                          <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center">
                            <i className="fas fa-lock text-white/60 text-xs"></i>
                          </div>
                        )}
                        <i className={`fas ${getStatusIcon(roadmapData['deep-learning'].status)} text-xs`}></i>
                      </div>
                      <div className="mt-1 text-center">
                        <p className="font-medium text-xs text-white whitespace-nowrap">{roadmapData['deep-learning'].title}</p>
                        <p className="text-xs text-primary font-semibold">{roadmapData['deep-learning'].duration}</p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Легенда статусов */}
                  <div className="absolute bottom-4 left-4 bg-space-800/90 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                    <div className="text-xs text-white/60 mb-2 font-semibold">СТАТУС МОДУЛЕЙ</div>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"></div>
                        <span className="text-white/80">Завершен</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                        <span className="text-white/80">В процессе</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500"></div>
                        <span className="text-white/80">Доступен</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                        <span className="text-white/80">Заблокирован</span>
                      </div>
                    </div>
                  </div>

                  {/* Прогресс пути */}
                  <div className="absolute bottom-4 right-4 bg-space-800/90 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                    <div className="text-xs text-white/60 mb-2 font-semibold">ПРОГРЕСС ПУТИ</div>
                    <div className="w-32 h-2 bg-white/10 rounded-full">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500"
                        style={{ width: `${getOverallProgress()}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-primary font-semibold mt-1">{getOverallProgress()}% завершено</div>
                  </div>

                  {/* Vertical lines to level 3 */}
                  <div className="absolute top-[210px] left-[30%] w-0.5 h-[60px] bg-gradient-to-b from-[#6E3AFF] to-[#2EBAE1]"></div>
                  <div className="absolute top-[210px] left-[70%] w-0.5 h-[60px] bg-gradient-to-b from-[#6E3AFF] to-[#2EBAE1]"></div>

                  {/* Level 3: Second branching */}
                  <div className="absolute top-[270px] left-[30%] z-10">
                    <motion.div 
                      className={`cursor-pointer ${selectedNode === 'data-structures' ? 'scale-110' : ''}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedNode('data-structures')}
                    >
                      <div className={`w-12 h-12 rounded-full ${getStatusColor(roadmapData['data-structures'].status)} flex items-center justify-center text-white shadow-lg`}>
                        <i className={`fas ${getStatusIcon(roadmapData['data-structures'].status)} text-sm`}></i>
                      </div>
                      <div className="mt-2 text-center">
                        <p className="font-medium text-xs whitespace-nowrap">{roadmapData['data-structures'].title}</p>
                        <div className="w-12 h-1 bg-white/10 rounded-full mt-1">
                          <div 
                            className={`h-full rounded-full bg-gradient-to-r ${getProgressBarColor(roadmapData['data-structures'].status)}`} 
                            style={{ width: `${roadmapData['data-structures'].progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <div className="absolute top-[270px] left-[70%] z-10">
                    <motion.div 
                      className={`cursor-pointer ${selectedNode === 'ml-intro' ? 'scale-110' : ''}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedNode('ml-intro')}
                    >
                      <div className={`w-12 h-12 rounded-full ${getStatusColor(roadmapData['ml-intro'].status)} flex items-center justify-center text-white shadow-lg`}>
                        <i className={`fas ${getStatusIcon(roadmapData['ml-intro'].status)} text-sm`}></i>
                      </div>
                      <div className="mt-2 text-center">
                        <p className="font-medium text-xs whitespace-nowrap">{roadmapData['ml-intro'].title}</p>
                        <div className="w-12 h-1 bg-white/10 rounded-full mt-1">
                          <div 
                            className={`h-full rounded-full bg-gradient-to-r ${getProgressBarColor(roadmapData['ml-intro'].status)}`} 
                            style={{ width: `${roadmapData['ml-intro'].progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Vertical lines to level 4 */}
                  <div className="absolute top-[330px] left-[30%] w-0.5 h-[60px] bg-white/30"></div>
                  <div className="absolute top-[330px] left-[70%] w-0.5 h-[60px] bg-white/30"></div>

                  {/* Level 4: Final nodes */}
                  <div className="absolute top-[390px] left-[20%] z-10">
                    <motion.div 
                      className={`cursor-pointer ${selectedNode === 'numpy-pandas' ? 'scale-110' : ''}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedNode('numpy-pandas')}
                    >
                      <div className={`w-10 h-10 rounded-full ${getStatusColor(roadmapData['numpy-pandas'].status)} flex items-center justify-center text-white shadow-lg`}>
                        <i className={`fas ${getStatusIcon(roadmapData['numpy-pandas'].status)} text-xs`}></i>
                      </div>
                      <div className="mt-1 text-center">
                        <p className="font-medium text-xs whitespace-nowrap">{roadmapData['numpy-pandas'].title}</p>
                      </div>
                    </motion.div>
                  </div>

                  <div className="absolute top-[390px] left-[50%] z-10">
                    <motion.div 
                      className={`cursor-pointer ${selectedNode === 'deep-learning' ? 'scale-110' : ''}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedNode('deep-learning')}
                    >
                      <div className={`w-10 h-10 rounded-full ${getStatusColor(roadmapData['deep-learning'].status)} flex items-center justify-center text-white shadow-lg`}>
                        <i className={`fas ${getStatusIcon(roadmapData['deep-learning'].status)} text-xs`}></i>
                      </div>
                      <div className="mt-1 text-center">
                        <p className="font-medium text-xs whitespace-nowrap">{roadmapData['deep-learning'].title}</p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Glassmorphism>
      </div>

      {/* Sidebar with module details */}
      <div className="w-full lg:w-4/12">
        <Glassmorphism className="rounded-xl p-6">
          {selectedNode && roadmapData[selectedNode] && (
            <div>
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-full ${getStatusColor(roadmapData[selectedNode].status)} flex items-center justify-center text-white shadow-lg mr-4`}>
                  <i className={`fas ${getStatusIcon(roadmapData[selectedNode].status)} text-lg`}></i>
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">{roadmapData[selectedNode].title}</h3>
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
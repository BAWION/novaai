import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Code, Calculator, Database, Zap, MessageCircle, Eye, Trophy, Star, Lock, Play, Route } from 'lucide-react';

interface RoadmapNode {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'locked';
  level: number;
  xp: number;
  totalXp: number;
  icon: string;
  color: string;
  position: 'left' | 'center' | 'right';
  galaxy: string;
  system: string;
}

interface CompactRoadmapWidgetProps {
  userId?: number;
}

export function CompactRoadmapWidget({ userId }: CompactRoadmapWidgetProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Компактные данные дорожной карты с зигзагообразным расположением
  const roadmapNodes: RoadmapNode[] = [
    {
      id: 'basics',
      title: 'Основы ИИ',
      description: 'Базовые концепции и терминология искусственного интеллекта',
      status: 'completed',
      level: 1,
      xp: 500,
      totalXp: 500,
      icon: 'brain',
      color: 'from-green-500 to-emerald-500',
      position: 'center',
      galaxy: 'Машинное обучение',
      system: 'Основы ИИ'
    },
    {
      id: 'python',
      title: 'Python для ИИ',
      description: 'Изучение Python и библиотек для машинного обучения',
      status: 'current',
      level: 2,
      xp: 450,
      totalXp: 500,
      icon: 'code',
      color: 'from-blue-500 to-cyan-500',
      position: 'left',
      galaxy: 'Программирование',
      system: 'Python'
    },
    {
      id: 'math',
      title: 'Математика ИИ',
      description: 'Линейная алгебра, статистика и вероятности',
      status: 'current',
      level: 2,
      xp: 300,
      totalXp: 500,
      icon: 'calculator',
      color: 'from-purple-500 to-violet-500',
      position: 'right',
      galaxy: 'Математика',
      system: 'Статистика'
    },
    {
      id: 'data',
      title: 'Data Science',
      description: 'Работа с данными и их анализ',
      status: 'locked',
      level: 3,
      xp: 0,
      totalXp: 600,
      icon: 'database',
      color: 'from-orange-500 to-red-500',
      position: 'center',
      galaxy: 'Обработка данных',
      system: 'Анализ данных'
    },
    {
      id: 'ml',
      title: 'Машинное обучение',
      description: 'Алгоритмы и модели машинного обучения',
      status: 'locked',
      level: 4,
      xp: 0,
      totalXp: 800,
      icon: 'zap',
      color: 'from-yellow-500 to-amber-500',
      position: 'left',
      galaxy: 'Машинное обучение',
      system: 'Алгоритмы ML'
    },
    {
      id: 'nlp',
      title: 'Обработка языка',
      description: 'Natural Language Processing и работа с текстом',
      status: 'locked',
      level: 4,
      xp: 0,
      totalXp: 800,
      icon: 'messageCircle',
      color: 'from-green-500 to-emerald-500',
      position: 'right',
      galaxy: 'Языковые технологии',
      system: 'NLP'
    },
    {
      id: 'cv',
      title: 'Компьютерное зрение',
      description: 'Обработка изображений и видео с помощью ИИ',
      status: 'locked',
      level: 5,
      xp: 0,
      totalXp: 1000,
      icon: 'eye',
      color: 'from-indigo-500 to-blue-500',
      position: 'center',
      galaxy: 'Компьютерное зрение',
      system: 'Обработка изображений'
    },
    {
      id: 'advanced',
      title: 'Продвинутый ИИ',
      description: 'Глубокое обучение и нейронные сети',
      status: 'locked',
      level: 6,
      xp: 0,
      totalXp: 1200,
      icon: 'trophy',
      color: 'from-pink-500 to-rose-500',
      position: 'center',
      galaxy: 'Глубокое обучение',
      system: 'Нейронные сети'
    }
  ];

  const getNodeIcon = (iconName: string) => {
    switch (iconName) {
      case 'brain': return Brain;
      case 'code': return Code;
      case 'calculator': return Calculator;
      case 'database': return Database;
      case 'zap': return Zap;
      case 'messageCircle': return MessageCircle;
      case 'eye': return Eye;
      case 'trophy': return Trophy;
      default: return Brain;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return Star;
      case 'current': return Play;
      case 'locked': return Lock;
      default: return Lock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500 border-green-400 text-white';
      case 'current': return 'bg-blue-500 border-blue-400 text-white';
      case 'locked': return 'bg-gray-500 border-gray-400 text-gray-300';
      default: return 'bg-gray-500 border-gray-400';
    }
  };

  // Функция для создания волнистой SVG дороги
  const createWavyPath = (fromY: number, toY: number, fromX: number, toX: number) => {
    const midY = (fromY + toY) / 2;
    const controlX1 = fromX + (toX - fromX) * 0.3;
    const controlX2 = fromX + (toX - fromX) * 0.7;
    const waveOffset = 20;
    
    return `M ${fromX} ${fromY} 
            Q ${controlX1} ${midY - waveOffset} ${fromX + (toX - fromX) * 0.5} ${midY}
            Q ${controlX2} ${midY + waveOffset} ${toX} ${toY}`;
  };

  const getNodePosition = (position: string, level: number) => {
    const baseY = level * 120 + 50; // Отступ сверху
    // Ширина должна совпадать с SVG viewBox
    const containerWidth = isDesktop ? 600 : 320;
    let x = containerWidth / 2; // center по умолчанию
    
    if (position === 'left') {
      x = containerWidth * 0.25; // 25% от общей ширины
    } else if (position === 'right') {
      x = containerWidth * 0.75; // 75% от общей ширины
    }
    
    return { x, y: baseY };
  };

  return (
    <div className="relative bg-gradient-to-br from-space-900/90 to-space-800/90 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden w-full max-w-sm mx-auto lg:max-w-none lg:mx-0">
      <div className="p-3 lg:p-4 border-b border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Route className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm lg:text-lg font-semibold text-white">Моя дорожная карта обучения</h3>
            <p className="text-xs lg:text-sm text-gray-400">Персонализированный путь через галактики ИИ</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-white/70 text-xs lg:text-sm mb-1">Последний урок:</div>
            <div className="text-white text-sm lg:text-base font-medium">Python для ИИ • вчера</div>
          </div>
          <div className="text-right">
            <div className="text-xl lg:text-2xl font-bold text-primary">29%</div>
            <div className="text-xs text-white/60">Общий прогресс</div>
          </div>
        </div>
      </div>

      {/* Волнистая дорожная карта */}
      <div className="relative h-[calc(100vh-260px)] lg:h-[calc(100vh-300px)] overflow-y-auto overflow-x-hidden">
        <div className="relative w-full px-4 py-8" style={{ minHeight: roadmapNodes.length * 150 + 200 }}>
          {/* SVG для волнистого пути */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none" 
            style={{ height: roadmapNodes.length * 150 + 200 }}
            viewBox={`0 0 400 ${roadmapNodes.length * 150 + 200}`}
            preserveAspectRatio="xMidYMin meet"
          >
            <defs>
              <linearGradient id="wavyRoadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            
            {/* Генерируем волнистый путь - всегда вниз */}
            {roadmapNodes.map((node, index) => {
              if (index === roadmapNodes.length - 1) return null;
              
              const containerWidth = 400;
              const containerHeight = roadmapNodes.length * 150 + 200;
              
              // Используем 6/10 от ширины контейнера для волнистой дороги
              const roadWidth = containerWidth * 0.6; // 60% ширины
              const centerX = containerWidth / 2;
              const leftBound = centerX - roadWidth / 2;
              const rightBound = centerX + roadWidth / 2;
              
              // Позиции узлов - всегда идем вниз с увеличивающимся Y
              const nodeSpacing = 150; // Расстояние между узлами (минимум 2 высоты иконки)
              const currentY = 80 + index * nodeSpacing;
              const nextY = 80 + (index + 1) * nodeSpacing;
              
              // X координаты создают волнистость, но Y всегда увеличивается
              const currentX = centerX + Math.sin(index * 0.8) * (roadWidth * 0.4);
              const nextX = centerX + Math.sin((index + 1) * 0.8) * (roadWidth * 0.4);
              
              // Контрольные точки для плавной S-образной кривой
              const midY = (currentY + nextY) / 2;
              const cp1X = currentX + Math.sin(index * 1.2) * 30;
              const cp1Y = currentY + nodeSpacing * 0.3;
              const cp2X = nextX - Math.sin((index + 1) * 1.2) * 30;
              const cp2Y = nextY - nodeSpacing * 0.3;
              
              return (
                <path
                  key={`wavy-path-${index}`}
                  d={`M ${currentX} ${currentY} C ${cp1X} ${cp1Y} ${cp2X} ${cp2Y} ${nextX} ${nextY}`}
                  stroke="url(#wavyRoadGradient)"
                  strokeWidth="4"
                  fill="none"
                  className="drop-shadow-lg"
                />
              );
            })}
          </svg>

          {/* Узлы на волнистом пути */}
          {roadmapNodes.map((node, index) => {
            const NodeIcon = getNodeIcon(node.icon);
            const StatusIcon = getStatusIcon(node.status);
            const isSelected = selectedNode === node.id;
            
            // Вычисляем позицию узла - простая формула для вертикального расположения
            const containerWidth = 400;
            const roadWidth = containerWidth * 0.6;
            const centerX = containerWidth / 2;
            
            const nodeSpacing = 150;
            const nodeY = 80 + index * nodeSpacing;
            const nodeX = centerX + Math.sin(index * 0.8) * (roadWidth * 0.4);
            
            return (
              <motion.div
                key={node.id}
                className="absolute cursor-pointer"
                style={{ 
                  left: `${(nodeX / 400) * 100}%`,
                  top: `${nodeY}px`,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => setSelectedNode(isSelected ? null : node.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Главная иконка узла */}
                <div className={`
                  relative w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl border-2 
                  bg-gradient-to-br ${node.color} ${getStatusColor(node.status)}
                  shadow-lg flex items-center justify-center
                  ${node.status === 'current' ? 'animate-pulse' : ''}
                `}>
                  <NodeIcon className="w-5 h-5 lg:w-7 lg:h-7" />
                  
                  {/* Статус индикатор */}
                  <div className="absolute -top-0.5 -right-0.5 lg:-top-1 lg:-right-1 w-4 h-4 lg:w-5 lg:h-5 bg-white rounded-full flex items-center justify-center shadow-md">
                    <StatusIcon className="w-2 h-2 lg:w-3 lg:h-3 text-gray-800" />
                  </div>
                  
                  {/* XP прогресс */}
                  {node.status !== 'locked' && (
                    <div className="absolute -bottom-5 lg:-bottom-6 left-1/2 transform -translate-x-1/2">
                      <div className="bg-black/50 rounded-full px-1.5 lg:px-2 py-0.5">
                        <div className="text-xs text-white font-medium">
                          {node.xp}/{node.totalXp} XP
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Табличка с информацией о галактике и системе */}
                <div className="absolute top-12 lg:top-16 left-1/2 transform -translate-x-1/2 text-center">
                  <div className="bg-black/80 rounded-lg px-2 py-1 backdrop-blur-sm border border-white/20">
                    <div className="text-xs font-medium text-white whitespace-nowrap">
                      {node.title}
                    </div>
                    <div className="text-xs text-blue-300 whitespace-nowrap">
                      🌌 {node.galaxy}
                    </div>
                    <div className="text-xs text-purple-300 whitespace-nowrap">
                      ⭐ {node.system}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Детальная информация о выбранном узле */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            className="absolute inset-0 bg-space-900/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedNode(null)}
          >
            <motion.div
              className="bg-gradient-to-br from-space-800 to-space-700 rounded-xl p-6 border border-white/20 max-w-sm w-full"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const node = roadmapNodes.find(n => n.id === selectedNode);
                if (!node) return null;
                
                const NodeIcon = getNodeIcon(node.icon);
                
                return (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${node.color} flex items-center justify-center`}>
                        <NodeIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{node.title}</h3>
                        <p className="text-white/60 text-sm">Уровень {node.level}</p>
                      </div>
                    </div>
                    
                    <p className="text-white/80 text-sm mb-4">{node.description}</p>
                    
                    {node.status !== 'locked' && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-white/60 mb-1">
                          <span>Прогресс</span>
                          <span>{node.xp}/{node.totalXp} XP</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-primary to-primary-light h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(node.xp / node.totalXp) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      {node.status === 'current' && (
                        <button className="flex-1 bg-primary hover:bg-primary-dark text-white rounded-lg py-2 px-4 text-sm font-medium transition-colors">
                          Продолжить обучение
                        </button>
                      )}
                      {node.status === 'completed' && (
                        <button className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 px-4 text-sm font-medium transition-colors">
                          Повторить курс
                        </button>
                      )}
                      {node.status === 'locked' && (
                        <button disabled className="flex-1 bg-gray-600 text-gray-400 rounded-lg py-2 px-4 text-sm font-medium cursor-not-allowed">
                          Заблокировано
                        </button>
                      )}
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

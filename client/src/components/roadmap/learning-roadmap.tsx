import React, { useState } from 'react';
import { ChevronRight, Globe, MapPin, Star, Clock, Lightbulb, Target, Sparkles, ZoomIn, ZoomOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface LearningMilestone {
  id: number;
  title: string;
  type: 'course' | 'project' | 'assessment' | 'achievement';
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  estimatedTime?: string;
  importance: 'high' | 'medium' | 'low';
  skills?: string[];
  progress?: number;
  position?: 'main' | 'branch'; // для отображения основного или параллельного пути
  dependencies?: number[]; // ID вех, от которых зависит данная веха
}

interface LearningRoadmapProps {
  className?: string;
  milestones?: LearningMilestone[];
  isDemoMode?: boolean;
}

export function LearningRoadmap({ 
  className,
  milestones: propMilestones,
  isDemoMode = true
}: LearningRoadmapProps) {
  // Состояние для управления масштабом
  const [zoomLevel, setZoomLevel] = useState(1);
  
  // Увеличить масштаб
  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 1.8));
  };
  
  // Уменьшить масштаб
  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.6));
  };

  // Демо-данные, если не были переданы
  const defaultMilestones: LearningMilestone[] = [
    {
      id: 1,
      title: "Основы ИИ и машинного обучения",
      type: "course",
      description: "Фундаментальные понятия и принципы искусственного интеллекта",
      status: "completed",
      estimatedTime: "10 часов",
      importance: "high",
      skills: ["Теория ИИ", "История ИИ", "Этика"],
      progress: 100,
      position: "main",
    },
    {
      id: 2,
      title: "Практика использования Chat-GPT",
      type: "course",
      description: "Эффективное формулирование запросов и работа с нейросетями",
      status: "current",
      estimatedTime: "6 часов",
      importance: "high",
      skills: ["Промпт-инжиниринг", "Контекстные запросы"],
      progress: 65,
      position: "main",
      dependencies: [1]
    },
    {
      id: 3,
      title: "Проект: Создание персонального ассистента",
      type: "project",
      description: "Применение знаний для создания собственного ассистента на базе API",
      status: "upcoming",
      estimatedTime: "8 часов",
      importance: "medium",
      skills: ["Работа с API", "Промпт-инжиниринг", "Персонализация"],
      progress: 0,
      position: "branch",
      dependencies: [2]
    },
    {
      id: 4,
      title: "Стабильная диффузия и генерация изображений",
      type: "course",
      description: "Основы генерации и редактирования изображений с помощью нейросетей",
      status: "upcoming",
      estimatedTime: "12 часов",
      importance: "medium",
      skills: ["Генерация изображений", "Промпты для изображений"],
      progress: 0,
      position: "branch",
      dependencies: [1]
    },
    {
      id: 5,
      title: "Сертификационное тестирование",
      type: "assessment",
      description: "Итоговое тестирование для получения сертификата по базовому курсу ИИ",
      status: "upcoming",
      estimatedTime: "2 часа",
      importance: "high",
      skills: ["Все изученные навыки"],
      progress: 0,
      position: "main",
      dependencies: [2, 3, 4]
    }
  ];

  const milestones = propMilestones || defaultMilestones;

  // Получение цвета планеты в зависимости от статуса
  const getPlanetColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-400';
      case 'current':
        return 'bg-blue-400';
      default:
        return 'bg-gray-700/40';
    }
  };
  
  // Получение цвета свечения в зависимости от статуса
  const getGlowColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'shadow-green-500/30';
      case 'current':
        return 'shadow-blue-500/30';
      default:
        return 'shadow-gray-500/10';
    }
  };
  
  // Получение анимации для планеты
  const getAnimation = (status: string) => {
    return status === 'current' ? 'animate-pulse' : '';
  };

  // Получение текущей вехи
  const currentMilestone = milestones.find(m => m.status === 'current');

  return (
    <Card className={cn("bg-space-950/95 border-blue-500/20 overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Globe className="h-5 w-5 mr-2 text-white/80" />
            <CardTitle className="text-white">
              Галактическая карта обучения
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {isDemoMode && (
              <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-300 text-xs">
                Demo
              </Badge>
            )}
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 rounded-full bg-space-800/50 text-white/70 hover:text-white hover:bg-space-800"
                onClick={zoomOut}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 rounded-full bg-space-800/50 text-white/70 hover:text-white hover:bg-space-800"
                onClick={zoomIn}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 relative overflow-hidden">
        {/* Космический фон со звездами */}
        <div className="absolute inset-0 bg-space-950">
          <div className="stars-bg absolute inset-0"></div>
        </div>

        {/* Масштабируемая галактическая карта */}
        <div 
          className="relative galaxy-map min-h-[400px] transition-transform duration-300 overflow-hidden"
          style={{ 
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'center center',
            height: '400px'
          }}
        >
          {/* Соединительные линии между планетами (маршруты) */}
          <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 1000 400" preserveAspectRatio="none">
            {/* Основной маршрут */}
            <path 
              d="M100,200 L900,200" 
              stroke="rgba(59, 130, 246, 0.3)" 
              strokeWidth="2"
              fill="none"
            />
            
            {/* Соединение с Проектом */}
            <path 
              d="M475,200 L475,325 L475,325" 
              stroke="rgba(147, 51, 234, 0.25)" 
              strokeWidth="1.5"
              fill="none"
            />
            
            {/* Соединение со Стабильной диффузией */}
            <path 
              d="M150,200 L150,325 L150,325" 
              stroke="rgba(147, 51, 234, 0.25)" 
              strokeWidth="1.5"
              fill="none"
            />
          </svg>

          {/* Планеты (курсы) */}
          {/* Основы ИИ */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className={cn(
                    "absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full shadow-glow border-4 transition-all",
                    getPlanetColor('completed'),
                    getGlowColor('completed'),
                    getAnimation('completed'),
                    "w-20 h-20 border-green-400/70"
                  )}
                  style={{ left: '150px', top: '200px' }}
                >
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-space-800/95 border-space-700 text-white max-w-xs">
                <div>
                  <div className="font-medium mb-1">Основы ИИ и машинного обучения</div>
                  <div className="text-xs text-white/75 mb-2">Фундаментальные понятия и принципы искусственного интеллекта</div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-green-500/20 border-green-500/30 text-green-300">
                      Завершено
                    </Badge>
                    <div className="text-xs flex items-center text-white/75">
                      <Clock className="h-3 w-3 mr-1" />
                      10 часов
                    </div>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="absolute whitespace-nowrap" style={{ left: '150px', top: '235px', transform: 'translateX(-50%)' }}>
            <span className="text-xs font-medium text-green-300">
              Основы ИИ и машинного обучения
            </span>
          </div>

          {/* Практика использования Chat-GPT */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className={cn(
                    "absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full shadow-glow border-4 transition-all",
                    getPlanetColor('current'),
                    getGlowColor('current'),
                    getAnimation('current'),
                    "w-20 h-20 border-blue-400/70"
                  )}
                  style={{ left: '475px', top: '200px' }}
                >
                  <div 
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `conic-gradient(rgb(96, 165, 250) 65%, transparent 0)`,
                      transform: 'rotate(-90deg)'
                    }}
                  ></div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-space-800/95 border-space-700 text-white max-w-xs">
                <div>
                  <div className="font-medium mb-1">Практика использования Chat-GPT</div>
                  <div className="text-xs text-white/75 mb-2">Эффективное формулирование запросов и работа с нейросетями</div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-blue-500/20 border-blue-500/30 text-blue-300">
                      Текущее
                    </Badge>
                    <div className="text-xs flex items-center text-white/75">
                      <Clock className="h-3 w-3 mr-1" />
                      6 часов
                    </div>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="absolute whitespace-nowrap" style={{ left: '475px', top: '235px', transform: 'translateX(-50%)' }}>
            <span className="text-xs font-medium text-blue-300">
              Практика использования Chat-GPT
            </span>
          </div>

          {/* Сертификационное тестирование */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className={cn(
                    "absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full shadow-glow border-2 transition-all",
                    getPlanetColor('upcoming'),
                    getGlowColor('upcoming'),
                    getAnimation('upcoming'),
                    "w-24 h-24 border-gray-500/30"
                  )}
                  style={{ left: '800px', top: '200px' }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Target className="w-6 h-6 text-gray-400/60" />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-space-800/95 border-space-700 text-white max-w-xs">
                <div>
                  <div className="font-medium mb-1">Сертификационное тестирование</div>
                  <div className="text-xs text-white/75 mb-2">Итоговое тестирование для получения сертификата по базовому курсу ИИ</div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-gray-500/20 border-gray-500/30 text-gray-300">
                      Предстоит
                    </Badge>
                    <div className="text-xs flex items-center text-white/75">
                      <Clock className="h-3 w-3 mr-1" />
                      2 часа
                    </div>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="absolute whitespace-nowrap" style={{ left: '800px', top: '235px', transform: 'translateX(-50%)' }}>
            <span className="text-xs font-medium text-gray-400">
              Сертификационное тестирование
            </span>
          </div>

          {/* Проект: Создание персонального ассистента */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className={cn(
                    "absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full shadow-glow border-2 transition-all",
                    getPlanetColor('upcoming'),
                    getGlowColor('upcoming'),
                    getAnimation('upcoming'),
                    "w-16 h-16 border-gray-500/30"
                  )}
                  style={{ left: '475px', top: '325px' }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Star className="w-5 h-5 text-gray-400/60" />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-space-800/95 border-space-700 text-white max-w-xs">
                <div>
                  <div className="font-medium mb-1">Проект: Создание персонального ассистента</div>
                  <div className="text-xs text-white/75 mb-2">Применение знаний для создания собственного ассистента на базе API</div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-gray-500/20 border-gray-500/30 text-gray-300">
                      Предстоит
                    </Badge>
                    <div className="text-xs flex items-center text-white/75">
                      <Clock className="h-3 w-3 mr-1" />
                      8 часов
                    </div>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="absolute whitespace-nowrap" style={{ left: '475px', top: '355px', transform: 'translateX(-50%)' }}>
            <span className="text-xs font-medium text-gray-400">
              Проект: Создание персонального ассистента
            </span>
          </div>

          {/* Стабильная диффузия */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className={cn(
                    "absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full shadow-glow border-2 transition-all",
                    getPlanetColor('upcoming'),
                    getGlowColor('upcoming'),
                    getAnimation('upcoming'),
                    "w-16 h-16 border-gray-500/30"
                  )}
                  style={{ left: '150px', top: '325px' }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-gray-400/60" />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-space-800/95 border-space-700 text-white max-w-xs">
                <div>
                  <div className="font-medium mb-1">Стабильная диффузия и генерация изображений</div>
                  <div className="text-xs text-white/75 mb-2">Основы генерации и редактирования изображений с помощью нейросетей</div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-gray-500/20 border-gray-500/30 text-gray-300">
                      Предстоит
                    </Badge>
                    <div className="text-xs flex items-center text-white/75">
                      <Clock className="h-3 w-3 mr-1" />
                      12 часов
                    </div>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="absolute whitespace-nowrap" style={{ left: '150px', top: '355px', transform: 'translateX(-50%)' }}>
            <span className="text-xs font-medium text-gray-400">
              Стабильная диффузия
            </span>
          </div>
        </div>
        
        {/* Информация о текущем этапе */}
        {currentMilestone && (
          <div className="relative px-4 pt-2 pb-4 z-20">
            <div className="bg-space-800/80 border border-blue-500/20 rounded-lg p-3 max-w-3xl mx-auto">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="h-5 w-5 text-blue-400" />
                <h3 className="font-medium text-white text-lg">
                  Ваш текущий этап: {currentMilestone.title}
                </h3>
              </div>
              
              {currentMilestone.progress !== undefined && (
                <div className="relative pt-1 pb-2">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm text-white/70">{currentMilestone.progress}% выполнено</div>
                  </div>
                  <div className="w-full bg-space-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-blue-400"
                      style={{ width: `${currentMilestone.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              <Button
                className="mt-1 bg-blue-600 hover:bg-blue-700 text-white border-none w-full"
              >
                Продолжить обучение <ChevronRight className="h-4 w-4 ml-1"/>
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      <style dangerouslySetInnerHTML={{ __html: `
        .shadow-glow {
          box-shadow: 0 0 20px currentColor;
        }
        
        .stars-bg {
          background-image: 
            radial-gradient(1px 1px at 25px 5px, white, rgba(255, 255, 255, 0)),
            radial-gradient(1px 1px at 50px 25px, white, rgba(255, 255, 255, 0)),
            radial-gradient(1px 1px at 125px 20px, white, rgba(255, 255, 255, 0)),
            radial-gradient(1.5px 1.5px at 50px 75px, white, rgba(255, 255, 255, 0)),
            radial-gradient(2px 2px at 15px 125px, white, rgba(255, 255, 255, 0)),
            radial-gradient(2.5px 2.5px at 110px 80px, white, rgba(255, 255, 255, 0)),
            radial-gradient(1px 1px at 210px 155px, white, rgba(255, 255, 255, 0)),
            radial-gradient(1.5px 1.5px at 260px 280px, white, rgba(255, 255, 255, 0)),
            radial-gradient(1px 1px at 300px 350px, white, rgba(255, 255, 255, 0)),
            radial-gradient(1px 1px at 350px 280px, white, rgba(255, 255, 255, 0)),
            radial-gradient(2px 2px at 400px 100px, white, rgba(255, 255, 255, 0)),
            radial-gradient(1px 1px at 450px 380px, white, rgba(255, 255, 255, 0)),
            radial-gradient(1.5px 1.5px at 500px 230px, white, rgba(255, 255, 255, 0)),
            radial-gradient(1px 1px at 550px 320px, white, rgba(255, 255, 255, 0)),
            radial-gradient(2px 2px at 600px 180px, white, rgba(255, 255, 255, 0)),
            radial-gradient(1px 1px at 650px 150px, white, rgba(255, 255, 255, 0)),
            radial-gradient(1.5px 1.5px at 700px 350px, white, rgba(255, 255, 255, 0)),
            radial-gradient(1px 1px at 750px 260px, white, rgba(255, 255, 255, 0)),
            radial-gradient(2px 2px at 800px 120px, white, rgba(255, 255, 255, 0)),
            radial-gradient(1px 1px at 850px 280px, white, rgba(255, 255, 255, 0));
          background-size: 900px 400px;
          animation: starsAnimation 240s linear infinite;
          opacity: 0.7;
        }
        
        @keyframes starsAnimation {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 900px 400px;
          }
        }
      `}} />
    </Card>
  );
}
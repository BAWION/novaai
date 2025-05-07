import React from 'react';
import { ChevronRight, Globe, MapPin, Star, Clock, Lightbulb, Target, Sparkles } from 'lucide-react';
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <Lightbulb className="h-4 w-4" />;
      case 'project':
        return <Star className="h-4 w-4" />;
      case 'assessment':
        return <Target className="h-4 w-4" />;
      case 'achievement':
        return <Sparkles className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getPlanetColor = (status: string, type: string) => {
    // Базовый класс для всех планет
    let baseClass = "flex items-center justify-center rounded-full border-2 shadow-glow z-20 transition-all duration-300";
    
    // Цвета в зависимости от статуса и типа
    if (status === 'completed') {
      baseClass += " bg-green-900/40 border-green-400 shadow-green-500/30";
    } else if (status === 'current') {
      baseClass += " bg-blue-900/40 border-blue-400 shadow-blue-500/30 animate-pulse";
    } else {
      baseClass += " bg-space-800/60 border-space-600/40 shadow-space-700/20";
    }
    
    // Размер планеты в зависимости от типа
    if (type === 'course') {
      baseClass += " w-14 h-14";
    } else if (type === 'project') {
      baseClass += " w-12 h-12";
    } else if (type === 'assessment') {
      baseClass += " w-16 h-16";
    } else { // achievement
      baseClass += " w-10 h-10";
    }
    
    return baseClass;
  };

  const getIconColor = (status: string) => {
    switch (status) {
      case 'completed':
        return "text-green-200";
      case 'current':
        return "text-blue-200";
      case 'upcoming':
        return "text-gray-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 border-green-500/30 text-green-300';
      case 'current':
        return 'bg-blue-500/20 border-blue-500/30 text-blue-300';
      case 'upcoming':
        return 'bg-gray-500/20 border-gray-500/30 text-gray-300';
      default:
        return 'bg-gray-500/20 border-gray-500/30 text-gray-300';
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high':
        return 'bg-red-500/20 border-red-500/30 text-red-300';
      case 'medium':
        return 'bg-orange-500/20 border-orange-500/30 text-orange-300';
      case 'low':
        return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300';
      default:
        return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300';
    }
  };

  // Группируем вехи по их позиции (основные и ответвления)
  const mainPath = milestones.filter(m => !m.position || m.position === 'main');
  const branchPaths = milestones.filter(m => m.position === 'branch');

  return (
    <Card className={cn("bg-space-900/80 border-blue-500/20 overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-white flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Галактическая карта обучения
          </CardTitle>
          {isDemoMode && (
            <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-300 text-xs">
              Demo
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-2 relative">
        {/* Космический фон с звездами */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-space-800 to-space-950 opacity-80">
          <div className="stars-bg absolute inset-0 opacity-50"></div>
        </div>
        
        {/* Орбитальные пути */}
        <div className="relative galaxy-map min-h-[400px] p-4">
          {/* Основной путь - орбитальная линия */}
          <div className="absolute left-[10%] right-[10%] top-1/2 h-1 bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-blue-500/0 rounded-full"></div>
          
          {/* Ответвления - дополнительные орбитальные линии */}
          <div className="absolute left-1/4 w-1/2 top-[70%] h-0.5 bg-gradient-to-r from-purple-500/0 via-purple-500/30 to-purple-500/0 rounded-full"></div>
          <div className="absolute left-1/3 w-1/3 top-[30%] h-0.5 bg-gradient-to-r from-cyan-500/0 via-cyan-500/30 to-cyan-500/0 rounded-full"></div>

          {/* Планеты основного пути */}
          <div className="flex justify-between relative z-10 h-full">
            {mainPath.map((milestone, index) => {
              // Позиционируем планеты равномерно по орбите
              const leftPosition = `${10 + (index * (80 / (mainPath.length - 1)))}%`;
              
              return (
                <div 
                  key={milestone.id}
                  className="absolute transform -translate-y-1/2 milestone-planet"
                  style={{ 
                    left: leftPosition,
                    top: '50%'
                  }}
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className={getPlanetColor(milestone.status, milestone.type)}>
                          <div className={cn("planet-icon", getIconColor(milestone.status))}>
                            {getTypeIcon(milestone.type)}
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-space-800/95 border-space-700 text-white max-w-xs">
                        <div>
                          <div className="font-medium mb-1">{milestone.title}</div>
                          <div className="text-xs text-white/75 mb-2">{milestone.description}</div>
                          
                          <div className="flex flex-wrap gap-1.5">
                            <Badge variant="outline" className={getStatusColor(milestone.status)}>
                              {milestone.status === 'completed' ? 'Завершено' : 
                              milestone.status === 'current' ? 'Текущее' : 'Предстоит'}
                            </Badge>
                            {milestone.estimatedTime && (
                              <div className="text-xs flex items-center text-white/75">
                                <Clock className="h-3 w-3 mr-1" />
                                {milestone.estimatedTime}
                              </div>
                            )}
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  {/* Название планеты под ней */}
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <span className={cn(
                      "text-xs font-medium", 
                      milestone.status === 'completed' ? "text-green-300" : 
                      milestone.status === 'current' ? "text-blue-300" : 
                      "text-white/60"
                    )}>
                      {milestone.title}
                    </span>
                  </div>
                  
                  {/* Прогресс-кольцо вокруг планеты */}
                  {milestone.progress !== undefined && milestone.progress > 0 && (
                    <div 
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `conic-gradient(${
                          milestone.status === 'completed' ? 'rgb(74, 222, 128)' : 'rgb(96, 165, 250)'
                        } ${milestone.progress}%, transparent 0)`,
                        transform: 'rotate(-90deg)'
                      }}
                    ></div>
                  )}
                  
                  {/* Соединительные линии с зависимостями */}
                  {milestone.dependencies?.map(depId => {
                    const depIndex = mainPath.findIndex(m => m.id === depId);
                    if (depIndex !== -1 && depIndex < index) {
                      return (
                        <div 
                          key={`conn-${milestone.id}-${depId}`}
                          className="absolute w-full h-0.5 bg-gradient-to-r from-blue-500/30 to-blue-500/10 origin-left"
                          style={{
                            left: '-100%',
                            top: '50%',
                            width: `${100 * (index - depIndex)}%`,
                          }}
                        ></div>
                      );
                    }
                    return null;
                  })}
                </div>
              );
            })}
          </div>
          
          {/* Планеты на ответвлениях */}
          {branchPaths.map((milestone, index) => {
            // Находим от каких основных вех зависит данная ветвь
            const dependencies = milestone.dependencies || [];
            const mainDeps = dependencies.filter(id => mainPath.some(m => m.id === id));
            let mainDepIndex = -1;
            
            if (mainDeps.length > 0) {
              mainDepIndex = mainPath.findIndex(m => m.id === mainDeps[0]);
            }
            
            // Позиция по X относительно зависимой вехи основного пути
            const leftPosition = mainDepIndex !== -1 
              ? `${10 + (mainDepIndex * (80 / (mainPath.length - 1)))}%`
              : `${30 + (index * 20)}%`;
              
            // Определяем, верхняя или нижняя ветвь
            const isUpperBranch = index % 2 === 0;
            const topPosition = isUpperBranch ? '30%' : '70%';
            
            return (
              <div 
                key={milestone.id}
                className="absolute transform -translate-y-1/2 milestone-planet"
                style={{ 
                  left: leftPosition,
                  top: topPosition
                }}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={getPlanetColor(milestone.status, milestone.type)}>
                        <div className={cn("planet-icon", getIconColor(milestone.status))}>
                          {getTypeIcon(milestone.type)}
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side={isUpperBranch ? "top" : "bottom"} className="bg-space-800/95 border-space-700 text-white max-w-xs">
                      <div>
                        <div className="font-medium mb-1">{milestone.title}</div>
                        <div className="text-xs text-white/75 mb-2">{milestone.description}</div>
                        
                        <div className="flex flex-wrap gap-1.5">
                          <Badge variant="outline" className={getStatusColor(milestone.status)}>
                            {milestone.status === 'completed' ? 'Завершено' : 
                            milestone.status === 'current' ? 'Текущее' : 'Предстоит'}
                          </Badge>
                          {milestone.estimatedTime && (
                            <div className="text-xs flex items-center text-white/75">
                              <Clock className="h-3 w-3 mr-1" />
                              {milestone.estimatedTime}
                            </div>
                          )}
                        </div>
                        
                        {/* Навыки в подсказке */}
                        {milestone.skills && milestone.skills.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {milestone.skills.map((skill, idx) => (
                              <span 
                                key={idx} 
                                className="bg-space-700/80 text-xs px-1.5 py-0.5 rounded-full text-white/60"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                {/* Название планеты рядом с ней */}
                <div className={cn(
                  "absolute whitespace-nowrap",
                  isUpperBranch ? "-bottom-6 left-1/2 transform -translate-x-1/2" : "-top-6 left-1/2 transform -translate-x-1/2"
                )}>
                  <span className={cn(
                    "text-xs font-medium", 
                    milestone.status === 'completed' ? "text-green-300" : 
                    milestone.status === 'current' ? "text-blue-300" : 
                    "text-white/60"
                  )}>
                    {milestone.title}
                  </span>
                </div>
                
                {/* Соединительные линии с зависимостями на основном пути */}
                {mainDeps.map(depId => {
                  const depIndex = mainPath.findIndex(m => m.id === depId);
                  if (depIndex !== -1) {
                    return (
                      <div 
                        key={`conn-${milestone.id}-${depId}`}
                        className="absolute bg-gradient-to-b from-purple-500/20 to-blue-500/20"
                        style={{
                          left: '50%',
                          top: isUpperBranch ? '100%' : '0',
                          width: '1px',
                          height: isUpperBranch ? `${20}%` : `${20}%`,
                          transform: isUpperBranch ? 'translateY(0)' : 'translateY(-100%)'
                        }}
                      ></div>
                    );
                  }
                  return null;
                })}
              </div>
            );
          })}
          
          {/* Панель информации о текущем этапе */}
          {milestones.filter(m => m.status === 'current').map(milestone => (
            <div 
              key={`info-${milestone.id}`}
              className="absolute left-1/2 transform -translate-x-1/2 bottom-2 bg-space-800/80 border border-blue-500/20 rounded-lg p-3 max-w-md w-full"
            >
              <h3 className="font-medium text-white flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                Ваш текущий этап: {milestone.title}
              </h3>
              
              {milestone.progress !== undefined && (
                <div className="relative pt-2 pb-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-xs text-white/70">{milestone.progress}% выполнено</div>
                  </div>
                  <div className="w-full bg-space-700 rounded-full h-1.5">
                    <div 
                      className="h-1.5 rounded-full bg-blue-400"
                      style={{ width: `${milestone.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              <Button
                variant="outline"
                className="mt-2 bg-blue-500/20 border-blue-500/30 text-blue-300 hover:bg-blue-500/30 hover:text-blue-200 text-xs w-full"
              >
                Продолжить обучение <ChevronRight className="h-3 w-3 ml-1"/>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
      
      <style jsx global>{`
        .shadow-glow {
          box-shadow: 0 0 15px currentColor;
        }
        
        .planet-icon {
          font-size: 18px;
        }
        
        .stars-bg {
          background-image: 
            radial-gradient(1px 1px at 25px 5px, white, rgba(255, 255, 255, 0)),
            radial-gradient(1px 1px at 50px 25px, white, rgba(255, 255, 255, 0)),
            radial-gradient(1px 1px at 125px 20px, white, rgba(255, 255, 255, 0)),
            radial-gradient(1.5px 1.5px at 50px 75px, white, rgba(255, 255, 255, 0)),
            radial-gradient(2px 2px at 15px 125px, white, rgba(255, 255, 255, 0)),
            radial-gradient(2.5px 2.5px at 110px 80px, white, rgba(255, 255, 255, 0));
          background-size: 200px 200px;
          animation: starsAnimation 200s linear infinite;
        }
        
        @keyframes starsAnimation {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 200px 200px;
          }
        }
      `}</style>
    </Card>
  );
}
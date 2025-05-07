import React from 'react';
import { ChevronRight, MapPin, Star, Clock, Lightbulb, Target } from 'lucide-react';
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
      description: "Изучите фундаментальные понятия и принципы искусственного интеллекта",
      status: "completed",
      estimatedTime: "10 часов",
      importance: "high",
      skills: ["Теория ИИ", "История ИИ", "Этика"],
      progress: 100
    },
    {
      id: 2,
      title: "Практика использования Chat-GPT",
      type: "course",
      description: "Научитесь эффективно формулировать запросы и работать с нейросетями",
      status: "current",
      estimatedTime: "6 часов",
      importance: "high",
      skills: ["Промпт-инжиниринг", "Контекстные запросы"],
      progress: 65
    },
    {
      id: 3,
      title: "Проект: Создание персонального ассистента",
      type: "project",
      description: "Примените полученные знания для создания собственного ассистента на базе API",
      status: "upcoming",
      estimatedTime: "8 часов",
      importance: "medium",
      skills: ["Работа с API", "Промпт-инжиниринг", "Персонализация"],
      progress: 0
    },
    {
      id: 4,
      title: "Стабильная диффузия и генерация изображений",
      type: "course",
      description: "Изучите основы генерации и редактирования изображений с помощью нейросетей",
      status: "upcoming",
      estimatedTime: "12 часов",
      importance: "medium",
      skills: ["Генерация изображений", "Промпты для изображений"],
      progress: 0
    },
    {
      id: 5,
      title: "Сертификационное тестирование",
      type: "assessment",
      description: "Пройдите итоговое тестирование для получения сертификата по базовому курсу ИИ",
      status: "upcoming",
      estimatedTime: "2 часа",
      importance: "high",
      skills: ["Все изученные навыки"],
      progress: 0
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
        return <Star className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
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

  return (
    <Card className={cn("bg-space-800/70 border-blue-500/20", className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-white flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Дорожная карта обучения
          </CardTitle>
          {isDemoMode && (
            <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-300 text-xs">
              Demo
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="relative">
          {/* Соединительная линия от начала до конца */}
          <div className="absolute top-6 left-1.5 bottom-6 w-0.5 bg-space-700/70"></div>
          
          {/* Вехи обучения */}
          <div className="space-y-4">
            {milestones.map((milestone, index) => (
              <div key={milestone.id} className="flex">
                {/* Маркер вехи */}
                <div className={cn(
                  "w-3.5 h-3.5 rounded-full mt-1.5 z-10",
                  milestone.status === 'completed' ? "bg-green-400" : 
                  milestone.status === 'current' ? "bg-blue-400" : 
                  "bg-gray-400/50"
                )}></div>
                
                {/* Описание вехи */}
                <div className="ml-4 bg-space-900/40 rounded-lg p-3 flex-1 border border-space-700">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium text-white">
                      {milestone.title}
                    </h3>
                    <div className="flex space-x-1.5">
                      <Badge variant="outline" className={getStatusColor(milestone.status)}>
                        {milestone.status === 'completed' ? 'Завершено' : 
                         milestone.status === 'current' ? 'Текущее' : 'Предстоит'}
                      </Badge>
                      <Badge variant="outline" className={getImportanceColor(milestone.importance)}>
                        {milestone.importance === 'high' ? 'Важно' : 
                         milestone.importance === 'medium' ? 'Средне' : 'Опционально'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-white/70 text-sm mb-2">
                    {milestone.description}
                  </div>
                  
                  {/* Дополнительная информация */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    <div className="bg-space-800/80 px-2 py-1 rounded-md flex items-center text-xs text-white/80">
                      {getTypeIcon(milestone.type)}
                      <span className="ml-1.5">
                        {milestone.type === 'course' ? 'Курс' : 
                         milestone.type === 'project' ? 'Проект' : 
                         milestone.type === 'assessment' ? 'Тестирование' : 'Достижение'}
                      </span>
                    </div>
                    
                    {milestone.estimatedTime && (
                      <div className="bg-space-800/80 px-2 py-1 rounded-md flex items-center text-xs text-white/80">
                        <Clock className="h-3.5 w-3.5" />
                        <span className="ml-1.5">{milestone.estimatedTime}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Прогресс */}
                  {(milestone.progress !== undefined && milestone.progress > 0) && (
                    <div className="relative pt-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs text-white/70">{milestone.progress}% выполнено</div>
                      </div>
                      <div className="w-full bg-space-700 rounded-full h-1.5">
                        <div 
                          className={cn(
                            "h-1.5 rounded-full", 
                            milestone.status === 'completed' ? "bg-green-400" : 
                            "bg-blue-400"
                          )}
                          style={{ width: `${milestone.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {/* Связанные навыки */}
                  {milestone.skills && milestone.skills.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {milestone.skills.map((skill, idx) => (
                        <TooltipProvider key={idx}>
                          <Tooltip>
                            <TooltipTrigger>
                              <span className="bg-space-700/80 text-xs px-2 py-0.5 rounded-full text-white/60 inline-block">
                                {skill}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">{skill}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    </div>
                  )}

                  {/* Кнопка для текущей вехи */}
                  {milestone.status === 'current' && (
                    <Button
                      variant="link"
                      className="text-blue-300 hover:text-blue-200 p-0 h-6 mt-2 flex items-center text-xs"
                    >
                      Продолжить <ChevronRight className="h-3 w-3 ml-1"/>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
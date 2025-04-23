import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { format, isSameDay, parseISO, subDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import { LearningEvent } from '@shared/schema';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Glassmorphism } from '@/components/ui/glassmorphism';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BookOpen,
  Calendar,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  Flame,
  Flag,
  Layers,
  LayoutGrid,
  ListFilter,
  Loader2,
  Pen,
  Pin,
  Play,
  Search,
  Star,
  Target,
  Trophy,
  Users,
  Zap
} from 'lucide-react';

interface LearningTimelineProps {
  userId?: number;
  showTitle?: boolean;
  compact?: boolean;
  limit?: number;
  onEventSelect?: (eventId: number) => void;
  onEntitySelect?: (entityType: string, entityId: number) => void;
}

export function LearningTimeline({
  userId,
  showTitle = true,
  compact = false,
  limit = 10,
  onEventSelect,
  onEntitySelect
}: LearningTimelineProps) {
  const [timelineView, setTimelineView] = useState<'list' | 'calendar'>('list');
  const [filterType, setFilterType] = useState<string | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  
  // Загрузка данных о событиях обучения
  const { data, isLoading, error } = useQuery<LearningEvent[]>({
    queryKey: ['/api/learning/timeline', userId, limit],
    enabled: !!userId
  });
  
  // Эффект для скроллирования к последнему событию при загрузке
  useEffect(() => {
    if (data && data.length > 0 && timelineRef.current) {
      timelineRef.current.scrollTop = 0;
    }
  }, [data]);
  
  // Функция для фильтрации событий
  const filteredEvents = () => {
    if (!data) return [];
    
    if (!filterType) return data;
    
    return data.filter(event => event.eventType.startsWith(filterType));
  };
  
  // Функция для группировки событий по дням
  const getEventsByDay = () => {
    if (!data) return new Map();
    
    const events = filteredEvents();
    const eventsByDay = new Map<string, LearningEvent[]>();
    
    events.forEach(event => {
      const date = new Date(event.timestamp);
      const dateKey = format(date, 'yyyy-MM-dd');
      
      if (!eventsByDay.has(dateKey)) {
        eventsByDay.set(dateKey, []);
      }
      
      eventsByDay.get(dateKey)!.push(event);
    });
    
    return eventsByDay;
  };
  
  // Функция для получения цвета для типа события
  const getEventColor = (eventType: string) => {
    if (eventType.startsWith('lesson')) return 'bg-blue-500/20 text-blue-400';
    if (eventType.startsWith('quiz')) return 'bg-purple-500/20 text-purple-400';
    if (eventType.startsWith('course')) return 'bg-green-500/20 text-green-400';
    if (eventType.startsWith('skill')) return 'bg-amber-500/20 text-amber-400';
    if (eventType.startsWith('milestone')) return 'bg-red-500/20 text-red-400';
    if (eventType.startsWith('streak')) return 'bg-orange-500/20 text-orange-400';
    return 'bg-slate-500/20 text-slate-400';
  };
  
  // Функция для получения иконки для типа события
  const getEventIcon = (eventType: string) => {
    if (eventType === 'lesson.started') return <Play size={16} />;
    if (eventType === 'lesson.completed') return <CheckCheck size={16} />;
    if (eventType === 'quiz.started') return <Target size={16} />;
    if (eventType === 'quiz.completed') return <Trophy size={16} />;
    if (eventType === 'course.started') return <BookOpen size={16} />;
    if (eventType === 'course.completed') return <CheckCheck size={16} />;
    if (eventType === 'skill.gained') return <Star size={16} />;
    if (eventType === 'skill.improved') return <Zap size={16} />;
    if (eventType === 'milestone.reached') return <Flag size={16} />;
    if (eventType === 'streak.continued') return <Flame size={16} />;
    if (eventType === 'streak.broken') return <Flag size={16} />;
    return <Zap size={16} />;
  };
  
  // Функция для получения названия типа события
  const getEventTypeLabel = (eventType: string) => {
    const mapping: Record<string, string> = {
      'lesson.started': 'Начат урок',
      'lesson.completed': 'Завершен урок',
      'quiz.started': 'Начат тест',
      'quiz.completed': 'Завершен тест',
      'quiz.passed': 'Тест пройден',
      'quiz.failed': 'Тест не пройден',
      'course.started': 'Начат курс',
      'course.completed': 'Завершен курс',
      'skill.gained': 'Получен навык',
      'skill.improved': 'Улучшен навык',
      'milestone.reached': 'Достигнута веха',
      'streak.continued': 'Продолжена серия',
      'streak.broken': 'Серия прервана',
      'streak.milestone': 'Рекорд серии'
    };
    
    return mapping[eventType] || 'Событие';
  };
  
  // Функция для получения события в формате JSON
  const getEventDataText = (data: any) => {
    if (!data) return '';
    
    try {
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      
      return JSON.stringify(data, null, 2);
    } catch (e) {
      return typeof data === 'string' ? data : JSON.stringify(data);
    }
  };
  
  // Функция для форматирования даты
  const formatEventDate = (timestamp: any) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return format(date, 'dd MMMM yyyy, HH:mm', { locale: ru });
  };
  
  // Функция для форматирования относительной даты (сегодня, вчера и т.д.)
  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    
    if (isSameDay(date, today)) {
      return 'Сегодня';
    }
    
    if (isSameDay(date, subDays(today, 1))) {
      return 'Вчера';
    }
    
    return format(date, 'd MMMM', { locale: ru });
  };
  
  // Рендер во время загрузки
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Загрузка событий...</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }
  
  // Рендер при ошибке
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ошибка загрузки событий</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Произошла ошибка при загрузке событий обучения. Пожалуйста, попробуйте позже.</p>
        </CardContent>
      </Card>
    );
  }
  
  // Если нет данных
  if (!data || data.length === 0) {
    return (
      <Card className={compact ? "border-0 shadow-none bg-transparent" : "border-primary/20 bg-space-900/50 backdrop-blur-sm"}>
        {showTitle && (
          <CardHeader>
            <CardTitle>Хронология обучения</CardTitle>
            <CardDescription>
              История ваших учебных активностей и достижений
            </CardDescription>
          </CardHeader>
        )}
        
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <div className="bg-primary/10 rounded-full p-6 mb-4">
            <Calendar className="h-12 w-12 text-primary" />
          </div>
          <h3 className="text-xl font-medium mb-2">Нет данных о обучении</h3>
          <p className="text-white/60 max-w-md">
            У вас пока нет записанных учебных событий. Начните проходить курсы и уроки, 
            чтобы ваш прогресс отображался здесь.
          </p>
        </CardContent>
        
        <CardFooter className="justify-center">
          <Button>
            Начать обучение
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className={compact ? "border-0 shadow-none bg-transparent" : "border-primary/20 bg-space-900/50 backdrop-blur-sm"}>
      {showTitle && (
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Хронология обучения</CardTitle>
              <CardDescription>
                История ваших учебных активностей и достижений
              </CardDescription>
            </div>
            
            <div className="flex">
              <Tabs 
                value={timelineView}
                onValueChange={(value: string) => setTimelineView(value as 'list' | 'calendar')}
                className="mr-2"
              >
                <TabsList className="h-8">
                  <TabsTrigger value="list" className="px-2 text-xs">
                    <Layers size={14} className="mr-1" />
                    Список
                  </TabsTrigger>
                  <TabsTrigger value="calendar" className="px-2 text-xs">
                    <LayoutGrid size={14} className="mr-1" />
                    Календарь
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Button variant="outline" size="sm" className="h-8">
                <Filter size={14} className="mr-1" />
                <span className="text-xs">Фильтры</span>
              </Button>
            </div>
          </div>
          
          {/* Фильтры по типам событий */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              className={`text-xs h-7 ${!filterType ? 'bg-primary/10 border-primary/50' : ''}`}
              onClick={() => setFilterType(null)}
            >
              Все
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className={`text-xs h-7 ${filterType === 'lesson' ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' : ''}`}
              onClick={() => setFilterType(filterType === 'lesson' ? null : 'lesson')}
            >
              <BookOpen size={12} className="mr-1" />
              Уроки
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className={`text-xs h-7 ${filterType === 'quiz' ? 'bg-purple-500/10 border-purple-500/50 text-purple-400' : ''}`}
              onClick={() => setFilterType(filterType === 'quiz' ? null : 'quiz')}
            >
              <Target size={12} className="mr-1" />
              Тесты
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className={`text-xs h-7 ${filterType === 'course' ? 'bg-green-500/10 border-green-500/50 text-green-400' : ''}`}
              onClick={() => setFilterType(filterType === 'course' ? null : 'course')}
            >
              <Layers size={12} className="mr-1" />
              Курсы
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className={`text-xs h-7 ${filterType === 'skill' ? 'bg-amber-500/10 border-amber-500/50 text-amber-400' : ''}`}
              onClick={() => setFilterType(filterType === 'skill' ? null : 'skill')}
            >
              <Star size={12} className="mr-1" />
              Навыки
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className={`text-xs h-7 ${filterType === 'milestone' ? 'bg-red-500/10 border-red-500/50 text-red-400' : ''}`}
              onClick={() => setFilterType(filterType === 'milestone' ? null : 'milestone')}
            >
              <Flag size={12} className="mr-1" />
              Вехи
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className={`text-xs h-7 ${filterType === 'streak' ? 'bg-orange-500/10 border-orange-500/50 text-orange-400' : ''}`}
              onClick={() => setFilterType(filterType === 'streak' ? null : 'streak')}
            >
              <Flame size={12} className="mr-1" />
              Серии
            </Button>
          </div>
        </CardHeader>
      )}
      
      <CardContent>
        <TabsContent value="list" className="mt-0">
          <div 
            className="space-y-4 overflow-y-auto pr-1 max-h-[500px]"
            ref={timelineRef}
          >
            {/* Группировка событий по дням */}
            {Array.from(getEventsByDay().entries()).map(([dateKey, events]) => (
              <div key={dateKey}>
                <div className="mb-2 mt-4 first:mt-0">
                  <Badge variant="outline" className="bg-space-800 text-white/70">
                    {formatRelativeDate(dateKey)}
                  </Badge>
                </div>
                
                <div className="space-y-3 relative ml-3">
                  {/* Вертикальная линия для соединения событий */}
                  <div className="absolute left-2.5 top-0 bottom-0 w-px bg-white/10 -ml-3"></div>
                  
                  {events.map((event) => (
                    <Glassmorphism
                      key={event.id}
                      className="p-4 rounded-md relative hover:bg-white/5 cursor-pointer"
                      onClick={() => onEventSelect && onEventSelect(event.id)}
                    >
                      {/* Точка на временной шкале */}
                      <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full bg-space-800 border-2 border-white/20 -ml-6 flex items-center justify-center">
                        <div className={`w-2.5 h-2.5 rounded-full ${getEventColor(event.eventType).split(' ')[0]}`}></div>
                      </div>
                      
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <Badge className={`${getEventColor(event.eventType)} border-0 mr-2`}>
                              <span className="flex items-center">
                                {getEventIcon(event.eventType)}
                                <span className="ml-1">{getEventTypeLabel(event.eventType)}</span>
                              </span>
                            </Badge>
                            <span className="text-xs text-white/60">
                              {format(new Date(event.timestamp), 'HH:mm')}
                            </span>
                          </div>
                          
                          <div className="mt-1">
                            <h4 className="font-medium text-sm">
                              {event.data && event.data.title ? event.data.title : 
                                event.entityType === 'lesson' ? 'Урок' :
                                event.entityType === 'course' ? 'Курс' :
                                event.entityType === 'skill' ? 'Навык' :
                                event.entityType === 'quiz' ? 'Тест' :
                                'Событие'
                              }
                              {event.data && event.data.name && `: ${event.data.name}`}
                            </h4>
                            <p className="text-xs text-white/60 mt-0.5">
                              {event.data && event.data.description ? event.data.description : 
                                event.data && event.data.details ? event.data.details :
                                event.entityType === 'lesson' ? 'Прогресс урока' :
                                event.entityType === 'course' ? 'Прогресс курса' :
                                event.entityType === 'skill' ? 'Изменение навыка' :
                                event.entityType === 'quiz' ? 'Результаты теста' :
                                'Дополнительная информация недоступна'
                              }
                            </p>
                          </div>
                          
                          {/* Дополнительные данные события */}
                          {event.data && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {event.data.progress !== undefined && (
                                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-0">
                                  Прогресс: {event.data.progress}%
                                </Badge>
                              )}
                              
                              {event.data.score !== undefined && (
                                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-0">
                                  Результат: {event.data.score}%
                                </Badge>
                              )}
                              
                              {event.data.timeSpent !== undefined && (
                                <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-0">
                                  <Clock size={12} className="mr-1" />
                                  {event.data.timeSpent < 60 
                                    ? `${event.data.timeSpent} сек`
                                    : `${Math.floor(event.data.timeSpent / 60)} мин`
                                  }
                                </Badge>
                              )}
                              
                              {event.data.level !== undefined && (
                                <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-0">
                                  Уровень: {event.data.level}
                                </Badge>
                              )}
                              
                              {event.data.streak !== undefined && (
                                <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-0">
                                  <Flame size={12} className="mr-1" />
                                  Серия: {event.data.streak} {event.data.streak === 1 ? 'день' : 
                                    event.data.streak < 5 ? 'дня' : 'дней'}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onEntitySelect) {
                              onEntitySelect(event.entityType, event.entityId);
                            }
                          }}
                        >
                          <ChevronRight size={16} />
                        </Button>
                      </div>
                    </Glassmorphism>
                  ))}
                </div>
              </div>
            ))}
            
            {filteredEvents().length === 0 && (
              <div className="text-center p-8 bg-space-800/50 rounded-lg">
                <Search className="h-12 w-12 mx-auto mb-3 text-white/20" />
                <h3 className="font-medium mb-1">Нет событий с выбранным фильтром</h3>
                <p className="text-white/60 text-sm">
                  Измените фильтр или продолжите обучение, чтобы создать новые события
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-0">
          <div className="flex justify-center p-10 bg-space-800/50 rounded-lg">
            <div className="text-center">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-white/20" />
              <h3 className="font-medium mb-1">Календарь обучения</h3>
              <p className="text-white/60 text-sm">
                Функция календаря будет доступна в следующей версии приложения
              </p>
            </div>
          </div>
        </TabsContent>
      </CardContent>
      
      <CardFooter className="justify-between">
        <Button variant="outline" size="sm" onClick={() => setFilterType(null)}>
          <ListFilter size={16} className="mr-1" /> Сбросить фильтры
        </Button>
        
        {filteredEvents().length >= limit && (
          <Button variant="outline" size="sm">
            Загрузить больше <ChevronRight size={16} className="ml-1" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
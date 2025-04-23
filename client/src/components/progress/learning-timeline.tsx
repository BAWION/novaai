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

interface GroupedEvents {
  date: Date;
  events: LearningEvent[];
}

// Временная замена для объекта LearningEvent из схемы
interface LearningEvent {
  id: number;
  userId: number;
  eventType: string;
  entityType: string;
  entityId: number;
  detail: {
    title: string;
    description?: string;
    entityName?: string;
    duration?: number;
    progress?: number;
    score?: number;
    previousValue?: any;
    newValue?: any;
    source?: string;
  };
  metadata?: Record<string, any>;
  createdAt: string;
}

export function LearningTimeline({
  userId,
  showTitle = true,
  compact = false,
  limit = 10,
  onEventSelect,
  onEntitySelect
}: LearningTimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'all' | 'lessons' | 'quizzes' | 'achievements'>('all');
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('week');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Запрос на получение данных о событиях обучения
  const { data: events, isLoading } = useQuery<LearningEvent[]>({
    queryKey: ['/api/learning-events/timeline', userId, period, limit],
    enabled: !!userId
  });
  
  // Прокрутка к текущему дню при загрузке
  useEffect(() => {
    if (timelineRef.current && events?.length && !selectedDate) {
      // Найти позицию для прокрутки (к последнему событию)
      const timelineElement = timelineRef.current;
      const today = new Date();
      
      // Находим ближайший элемент к текущей дате
      const dateElements = timelineElement.querySelectorAll('[data-date]');
      let closestElement = null;
      let closestDiff = Infinity;
      
      dateElements.forEach(element => {
        const dateStr = element.getAttribute('data-date');
        if (dateStr) {
          const date = new Date(dateStr);
          const diff = Math.abs(today.getTime() - date.getTime());
          if (diff < closestDiff) {
            closestDiff = diff;
            closestElement = element;
          }
        }
      });
      
      // Прокручиваем к найденному элементу
      if (closestElement) {
        closestElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [events, selectedDate]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Демо-данные для отображения событий обучения
  const demoEvents: LearningEvent[] = [
    {
      id: 1,
      userId: 999,
      eventType: 'lesson_completed',
      entityType: 'lesson',
      entityId: 101,
      detail: {
        title: 'Рекурсия и оптимизация в Python',
        description: 'Завершен урок по рекурсии и оптимизации в Python',
        entityName: 'Продвинутые функции',
        duration: 45,
        score: 95
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
    },
    {
      id: 2,
      userId: 999,
      eventType: 'quiz_completed',
      entityType: 'quiz',
      entityId: 102,
      detail: {
        title: 'Тест по алгоритмам',
        description: 'Завершен тест по алгоритмам и структурам данных',
        score: 85,
        duration: 25
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 - 1000 * 60 * 30).toISOString()
    },
    {
      id: 3,
      userId: 999,
      eventType: 'skill_level_changed',
      entityType: 'skill',
      entityId: 103,
      detail: {
        title: 'Повышение уровня навыка',
        description: 'Ваш уровень владения Python повысился',
        entityName: 'Python',
        previousValue: 65,
        newValue: 70
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 - 1000 * 60 * 35).toISOString()
    },
    {
      id: 4,
      userId: 999,
      eventType: 'achievement_unlocked',
      entityType: 'achievement',
      entityId: 104,
      detail: {
        title: 'Достижение разблокировано',
        description: 'Получено достижение "Алгоритмический мыслитель"',
        entityName: 'Алгоритмический мыслитель'
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 - 1000 * 60 * 40).toISOString()
    },
    {
      id: 5,
      userId: 999,
      eventType: 'course_started',
      entityType: 'course',
      entityId: 105,
      detail: {
        title: 'Курс начат',
        description: 'Вы начали курс "Машинное обучение с Python"',
        entityName: 'Машинное обучение с Python'
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString()
    },
    {
      id: 6,
      userId: 999,
      eventType: 'lesson_completed',
      entityType: 'lesson',
      entityId: 106,
      detail: {
        title: 'Введение в машинное обучение',
        description: 'Завершен урок по введению в машинное обучение',
        entityName: 'Основы машинного обучения',
        duration: 35,
        score: 90
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1 - 1000 * 60 * 60 * 2).toISOString()
    },
    {
      id: 7,
      userId: 999,
      eventType: 'practice_completed',
      entityType: 'practice',
      entityId: 107,
      detail: {
        title: 'Практика завершена',
        description: 'Выполнена практическая работа "Классификация данных"',
        entityName: 'Классификация данных',
        duration: 50,
        score: 88
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1 - 1000 * 60 * 60 * 3).toISOString()
    },
    {
      id: 8,
      userId: 999,
      eventType: 'learning_streak',
      entityType: 'user',
      entityId: 999,
      detail: {
        title: 'Учебная серия',
        description: 'Вы занимаетесь 5 дней подряд!',
        newValue: 5
      },
      createdAt: new Date().toISOString()
    },
    {
      id: 9,
      userId: 999,
      eventType: 'recommendation_updated',
      entityType: 'user',
      entityId: 999,
      detail: {
        title: 'Рекомендации обновлены',
        description: 'Ваши рекомендуемые курсы обновлены на основе прогресса',
        source: 'AI tutor'
      },
      createdAt: new Date().toISOString()
    },
    {
      id: 10,
      userId: 999,
      eventType: 'lesson_progress',
      entityType: 'lesson',
      entityId: 108,
      detail: {
        title: 'Прогресс по уроку',
        description: 'Вы продвинулись в изучении урока "Линейная регрессия"',
        entityName: 'Линейная регрессия',
        progress: 60
      },
      createdAt: new Date().toISOString()
    }
  ];
  
  // Используем демо-данные, если реальные не загружены
  const displayEvents = events || demoEvents;
  
  // Фильтруем события на основе выбранного режима просмотра
  const filteredEvents = displayEvents.filter(event => {
    if (viewMode === 'all') return true;
    if (viewMode === 'lessons') return event.entityType === 'lesson';
    if (viewMode === 'quizzes') return event.entityType === 'quiz';
    if (viewMode === 'achievements') return event.entityType === 'achievement';
    return true;
  });
  
  // Ограничиваем количество отображаемых событий, если задан лимит
  const limitedEvents = limit ? filteredEvents.slice(0, limit) : filteredEvents;
  
  // Группируем события по дате
  const groupedEvents: GroupedEvents[] = limitedEvents.reduce((groups, event) => {
    const eventDate = parseISO(event.createdAt);
    const dateString = format(eventDate, 'yyyy-MM-dd');
    const existingGroup = groups.find(g => format(g.date, 'yyyy-MM-dd') === dateString);
    
    if (existingGroup) {
      existingGroup.events.push(event);
    } else {
      groups.push({
        date: eventDate,
        events: [event]
      });
    }
    
    return groups;
  }, [] as GroupedEvents[]);
  
  // Сортируем группы по дате (от новых к старым)
  groupedEvents.sort((a, b) => b.date.getTime() - a.date.getTime());
  
  // Получаем иконку для типа события
  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'lesson_completed':
        return <CheckCheck className="h-5 w-5 text-green-500" />;
      case 'lesson_progress':
        return <Play className="h-5 w-5 text-blue-500" />;
      case 'quiz_completed':
        return <Pen className="h-5 w-5 text-violet-500" />;
      case 'skill_level_changed':
        return <Target className="h-5 w-5 text-amber-500" />;
      case 'achievement_unlocked':
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 'course_started':
        return <BookOpen className="h-5 w-5 text-indigo-500" />;
      case 'practice_completed':
        return <Layers className="h-5 w-5 text-emerald-500" />;
      case 'learning_streak':
        return <Flame className="h-5 w-5 text-red-500" />;
      case 'recommendation_updated':
        return <Zap className="h-5 w-5 text-cyan-500" />;
      default:
        return <Flag className="h-5 w-5 text-white" />;
    }
  };
  
  // Получаем текст для относительной даты
  const getRelativeDateText = (date: Date) => {
    const today = new Date();
    const yesterday = subDays(today, 1);
    
    if (isSameDay(date, today)) {
      return 'Сегодня';
    } else if (isSameDay(date, yesterday)) {
      return 'Вчера';
    } else {
      return format(date, 'dd MMMM, EEEE', { locale: ru });
    }
  };
  
  return (
    <Glassmorphism className="p-6">
      {showTitle && (
        <div className="mb-4">
          <h2 className="text-2xl font-semibold">Хронология обучения</h2>
          <p className="text-white/60">
            История ваших достижений и учебной активности
          </p>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <Tabs defaultValue={viewMode} onValueChange={(value) => setViewMode(value as any)}>
          <TabsList>
            <TabsTrigger value="all">Все</TabsTrigger>
            <TabsTrigger value="lessons">Уроки</TabsTrigger>
            <TabsTrigger value="quizzes">Тесты</TabsTrigger>
            <TabsTrigger value="achievements">Достижения</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2">
          <Button
            variant={period === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriod('week')}
          >
            Неделя
          </Button>
          <Button
            variant={period === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriod('month')}
          >
            Месяц
          </Button>
          <Button
            variant={period === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPeriod('all')}
          >
            Все время
          </Button>
        </div>
      </div>
      
      {groupedEvents.length > 0 ? (
        <div ref={timelineRef} className="relative">
          {/* Вертикальная линия хронологии */}
          <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/80 to-primary/5"></div>
          
          {/* События сгруппированные по дням */}
          <div className="space-y-8 pl-1">
            {groupedEvents.map((group, groupIndex) => (
              <div key={format(group.date, 'yyyy-MM-dd')} data-date={format(group.date, 'yyyy-MM-dd')}>
                <div className="relative flex items-center mb-4 gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary ring-4 ring-background"></div>
                  <h3 className="text-md font-medium">{getRelativeDateText(group.date)}</h3>
                </div>
                
                <div className="space-y-3 ml-6">
                  {group.events.map((event, eventIndex) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: eventIndex * 0.05 }}
                    >
                      <Card 
                        className="bg-space-900/40 border-primary/10 hover:bg-space-900/60 transition-colors cursor-pointer"
                        onClick={() => onEventSelect && onEventSelect(event.id)}
                      >
                        <CardHeader className="pb-2 flex flex-row items-start gap-3">
                          <div className="mt-1 bg-space-800 p-1.5 rounded-md">
                            {getEventIcon(event.eventType)}
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-md">{event.detail.title}</CardTitle>
                            {event.detail.entityName && (
                              <CardDescription className="mt-0.5">
                                {event.detail.entityName}
                              </CardDescription>
                            )}
                          </div>
                          <div className="text-xs text-white/50">
                            {format(parseISO(event.createdAt), 'HH:mm')}
                          </div>
                        </CardHeader>
                        
                        {!compact && (
                          <CardContent className="pb-4 pt-0">
                            {event.detail.description && (
                              <p className="text-sm text-white/80 mb-3">
                                {event.detail.description}
                              </p>
                            )}
                            
                            <div className="flex flex-wrap gap-2 items-center">
                              {event.detail.duration && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" /> {event.detail.duration} мин
                                </Badge>
                              )}
                              
                              {event.detail.score && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                  <Star className="h-3 w-3" /> {event.detail.score}%
                                </Badge>
                              )}
                              
                              {event.detail.progress && (
                                <div className="flex items-center gap-2">
                                  <div className="w-16 h-1.5 bg-space-700 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-primary rounded-full"
                                      style={{ width: `${event.detail.progress}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs">{event.detail.progress}%</span>
                                </div>
                              )}
                              
                              {event.detail.previousValue !== undefined && event.detail.newValue !== undefined && (
                                <Badge variant="secondary" className="flex items-center gap-1">
                                  {event.detail.previousValue} → <span className="font-medium">{event.detail.newValue}</span>
                                </Badge>
                              )}
                              
                              {event.detail.source && (
                                <Badge variant="outline" className="text-white/70">
                                  Источник: {event.detail.source}
                                </Badge>
                              )}
                              
                              {event.entityType && event.entityId && onEntitySelect && (
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="ml-auto h-7 px-2 text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onEntitySelect(event.entityType, event.entityId);
                                  }}
                                >
                                  Перейти <ChevronRight size={14} className="ml-1" />
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center p-8 bg-space-900/40 rounded-lg">
          <p className="text-white/60">Нет событий для выбранного периода или фильтра</p>
        </div>
      )}
    </Glassmorphism>
  );
}
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { SkillGapsData, SkillWithInfo, UserSkillGap } from '@shared/schema';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowUpRight,
  BookOpen,
  BrainCircuit,
  ChevronRight,
  Clock,
  EyeOff,
  Filter,
  Lightbulb,
  RefreshCw,
  Search,
  Shield,
  Sparkles,
  Target,
  XCircle,
  Zap
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Glassmorphism } from '@/components/ui/glassmorphism';
import { Progress } from '@/components/ui/progress';

interface SkillGapsProps {
  userId?: number;
  showTitle?: boolean;
  compact?: boolean;
  onGapSelect?: (gapId: number, skillId: number) => void;
  onCourseSelect?: (courseId: number) => void;
}

export function SkillGaps({
  userId,
  showTitle = true,
  compact = false,
  onGapSelect,
  onCourseSelect
}: SkillGapsProps) {
  // Состояние для фильтрации
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  
  // Загрузка данных о пробелах в навыках
  const { data, isLoading, error } = useQuery<SkillGapsData>({
    queryKey: ['/api/skills/gaps', userId],
    enabled: !!userId
  });
  
  // Функция для фильтрации пробелов
  const getFilteredGaps = () => {
    if (!data) return [];
    
    return data.gaps.filter(gap => {
      if (priorityFilter === 'all') return true;
      if (priorityFilter === 'high') return gap.priority === 5 || gap.priority === 4;
      if (priorityFilter === 'medium') return gap.priority === 3;
      if (priorityFilter === 'low') return gap.priority === 2 || gap.priority === 1;
      return true;
    });
  };
  
  // Получение строки с "последней практикой"
  const getLastPracticedText = (date?: Date) => {
    if (!date) return 'Никогда не практиковали';
    
    const now = new Date();
    const practiceDate = new Date(date);
    const diffDays = Math.floor((now.getTime() - practiceDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Сегодня';
    if (diffDays === 1) return 'Вчера';
    if (diffDays < 7) return `${diffDays} дня назад`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} недели назад`;
    return `${Math.floor(diffDays / 30)} месяцев назад`;
  };
  
  // Получение цвета для приоритета
  const getPriorityColor = (priority?: number) => {
    if (!priority) return 'text-white/60';
    if (priority >= 4) return 'text-red-400';
    if (priority === 3) return 'text-orange-400';
    return 'text-yellow-400';
  };
  
  // Получение индикатора размера пробела
  const getGapSizeText = (gapSize?: number) => {
    if (!gapSize) return 'Нет пробела';
    if (gapSize >= 70) return 'Критический пробел';
    if (gapSize >= 40) return 'Значительный пробел';
    return 'Небольшой пробел';
  };
  
  // Рендеринг во время загрузки
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Загрузка данных...</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }
  
  // Рендеринг при ошибке
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ошибка загрузки данных</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Произошла ошибка при загрузке пробелов в навыках. Пожалуйста, попробуйте позже.</p>
        </CardContent>
      </Card>
    );
  }
  
  // Если нет данных или пробелов
  if (!data || data.totalGaps === 0) {
    return (
      <Card className={compact ? "border-0 shadow-none bg-transparent" : "border-primary/20 bg-space-900/50 backdrop-blur-sm"}>
        {showTitle && (
          <CardHeader>
            <CardTitle>Пробелы в навыках</CardTitle>
            <CardDescription>
              Анализ ваших навыков и выявление областей, требующих дополнительного внимания
            </CardDescription>
          </CardHeader>
        )}
        
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <div className="bg-green-500/10 rounded-full p-6 mb-4">
            <Shield className="h-12 w-12 text-green-400" />
          </div>
          <h3 className="text-xl font-medium mb-2">Пробелов не обнаружено</h3>
          <p className="text-white/60 max-w-md">
            На данный момент у вас нет выявленных пробелов в навыках. Продолжайте обучение, 
            чтобы система могла анализировать ваш прогресс и выявлять потенциальные области для улучшения.
          </p>
        </CardContent>
        
        <CardFooter className="justify-center">
          <Button>
            Пройти тестирование навыков
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
              <CardTitle>Пробелы в навыках</CardTitle>
              <CardDescription>
                Выявлено {data.totalGaps} пробел{data.totalGaps === 1 ? '' : data.totalGaps < 5 ? 'а' : 'ов'} в ваших навыках
              </CardDescription>
            </div>
            
            <div className="flex">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <RefreshCw className="h-4 w-4 text-white/60" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Обновить анализ</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <BrainCircuit className="h-4 w-4 text-white/60" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Пройти тест навыков</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          {/* Индикаторы приоритетности */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-red-500/10 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-white/60">Высокий приоритет</span>
                <Badge className="bg-red-500/90">{data.priorityHigh}</Badge>
              </div>
              <Progress 
                value={(data.priorityHigh / data.totalGaps) * 100} 
                className="h-1 bg-white/10" 
                indicatorClassName="bg-red-500" 
              />
            </div>
            
            <div className="bg-orange-500/10 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-white/60">Средний приоритет</span>
                <Badge className="bg-orange-500/90">{data.priorityMedium}</Badge>
              </div>
              <Progress 
                value={(data.priorityMedium / data.totalGaps) * 100} 
                className="h-1 bg-white/10" 
                indicatorClassName="bg-orange-500" 
              />
            </div>
            
            <div className="bg-yellow-500/10 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-white/60">Низкий приоритет</span>
                <Badge className="bg-yellow-500/90">{data.priorityLow}</Badge>
              </div>
              <Progress 
                value={(data.priorityLow / data.totalGaps) * 100} 
                className="h-1 bg-white/10" 
                indicatorClassName="bg-yellow-500" 
              />
            </div>
          </div>
        </CardHeader>
      )}
      
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-white/80">Выявленные пробелы</h3>
          
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Все приоритеты" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все приоритеты</SelectItem>
              <SelectItem value="high">Высокий приоритет</SelectItem>
              <SelectItem value="medium">Средний приоритет</SelectItem>
              <SelectItem value="low">Низкий приоритет</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-3">
          <AnimatePresence>
            {getFilteredGaps().map((gap) => (
              <motion.div
                key={gap.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Glassmorphism
                  className="p-4 rounded-lg cursor-pointer hover:bg-white/5 transition-all"
                  onClick={() => onGapSelect && onGapSelect(gap.id, gap.skillId)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h4 className="font-medium">
                          {gap.skill.displayName}
                        </h4>
                        <Badge variant="outline" className={`ml-2 border-0 text-xs ${
                          gap.priority >= 4 ? 'bg-red-500/20 text-red-400' : 
                          gap.priority === 3 ? 'bg-orange-500/20 text-orange-400' : 
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {gap.priority >= 4 ? 'Высокий' : gap.priority === 3 ? 'Средний' : 'Низкий'} приоритет
                        </Badge>
                      </div>
                      
                      <div className="text-xs text-white/60 mt-1 flex flex-wrap gap-2">
                        <span>{gap.skill.categoryName || 'Категория'}</span>
                        <span>•</span>
                        <span>Уровень {gap.skill.level || 1}</span>
                        <span>•</span>
                        <span>{getLastPracticedText(gap.skill.lastPracticed)}</span>
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex justify-between items-center mb-1">
                          <div className="text-xs text-white/60">
                            Уровень владения
                          </div>
                          <div className="text-xs font-medium">
                            {gap.skill.userLevel || 0}/100
                          </div>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-400"
                            style={{ width: `${gap.skill.userLevel || 0}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="mt-1.5">
                        <div className="flex justify-between items-center mb-1">
                          <div className="text-xs text-white/60">
                            {getGapSizeText(gap.gapSize)}
                          </div>
                          <div className="text-xs font-medium">
                            Разрыв {gap.gapSize}%
                          </div>
                        </div>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              gap.gapSize >= 70 ? 'bg-red-400' : 
                              gap.gapSize >= 40 ? 'bg-orange-400' : 
                              'bg-yellow-400'
                            }`}
                            style={{ width: `${gap.gapSize}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Рекомендуемые ресурсы */}
                  {gap.recommendedResources && Array.isArray(gap.recommendedResources) && gap.recommendedResources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-white/10">
                      <div className="text-xs text-white/60 mb-2">Рекомендуемые ресурсы:</div>
                      <div className="flex flex-wrap gap-2">
                        {gap.recommendedResources.map((resource: any, i: number) => (
                          <Button 
                            key={i}
                            variant="outline" 
                            size="sm"
                            className="h-8 text-xs border-white/10 hover:bg-white/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (resource.type === 'course' && resource.id && onCourseSelect) {
                                onCourseSelect(resource.id);
                              }
                            }}
                          >
                            {resource.type === 'course' && <BookOpen size={12} className="mr-1" />}
                            {resource.type === 'exercise' && <Target size={12} className="mr-1" />}
                            {resource.type === 'quiz' && <BrainCircuit size={12} className="mr-1" />}
                            {resource.label || resource.name || 'Ресурс'}
                            <ArrowUpRight size={12} className="ml-1 text-white/60" />
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </Glassmorphism>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {getFilteredGaps().length === 0 && (
            <div className="text-center p-8 bg-space-800/50 rounded-lg">
              <EyeOff className="h-12 w-12 mx-auto mb-3 text-white/20" />
              <h3 className="font-medium mb-1">Нет пробелов с выбранным фильтром</h3>
              <p className="text-white/60 text-sm">
                Попробуйте изменить фильтр или пройдите больше уроков для выявления пробелов в навыках
              </p>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="justify-between">
        <Button variant="outline" size="sm" onClick={() => setPriorityFilter('all')}>
          <Filter size={16} className="mr-1" /> Сбросить фильтры
        </Button>
        
        <Button size="sm">
          <Lightbulb size={16} className="mr-1" /> Рекомендации по устранению
        </Button>
      </CardFooter>
    </Card>
  );
}
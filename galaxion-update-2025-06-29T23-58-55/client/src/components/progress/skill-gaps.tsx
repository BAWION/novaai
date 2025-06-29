import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Loader2, ExternalLink, ChevronRight, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Glassmorphism } from '@/components/ui/glassmorphism';
import { Progress } from '@/components/ui/progress';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

interface SkillWithInfo {
  id: number;
  name: string;
  category: string;
  level: number;
  targetLevel: number;
  description: string;
  status: 'critical' | 'moderate' | 'minor';
  requiredFor: {
    courses: {
      id: number;
      title: string;
      level: string;
    }[];
    jobs: {
      title: string;
      demand: number;
    }[];
  };
  recommendedCourses: {
    id: number;
    title: string;
    difficulty: number;
    duration: string;
    progress?: number;
  }[];
}

interface SkillGapsData {
  gaps: SkillWithInfo[];
  summary: {
    criticalCount: number;
    moderateCount: number;
    minorCount: number;
    overallCompleteness: number;
  };
}

interface SkillGapsProps {
  userId?: number;
  showTitle?: boolean;
  limit?: number;
  onGapSelect?: (gapId: number, skillId: number) => void;
  onCourseSelect?: (courseId: number) => void;
}

export function SkillGaps({
  userId,
  showTitle = true,
  limit,
  onGapSelect,
  onCourseSelect
}: SkillGapsProps) {
  const [selectedGap, setSelectedGap] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'critical' | 'moderate' | 'minor'>('all');
  
  // Запрос на получение данных о пробелах в навыках
  const { data: gapsData, isLoading } = useQuery<SkillGapsData>({
    queryKey: ['/api/skills/gaps', userId],
    enabled: !!userId
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Демо-данные для отображения пробелов в навыках
  const demoData: SkillGapsData = {
    gaps: [
      {
        id: 1,
        name: "Python",
        category: "Программирование",
        level: 35,
        targetLevel: 70,
        description: "Базовый уровень Python недостаточен для эффективной работы с библиотеками анализа данных и машинного обучения.",
        status: "critical",
        requiredFor: {
          courses: [
            { id: 1, title: "Машинное обучение с Python", level: "Продвинутый" },
            { id: 2, title: "Анализ данных с Pandas", level: "Средний" }
          ],
          jobs: [
            { title: "Data Scientist", demand: 85 },
            { title: "ML Engineer", demand: 78 }
          ]
        },
        recommendedCourses: [
          { id: 3, title: "Python для анализа данных", difficulty: 2, duration: "15 часов" },
          { id: 4, title: "Алгоритмы и структуры данных на Python", difficulty: 3, duration: "20 часов" }
        ]
      },
      {
        id: 2,
        name: "SQL",
        category: "Базы данных",
        level: 25,
        targetLevel: 60,
        description: "Знания SQL недостаточны для эффективной работы с большими объемами данных и сложными запросами.",
        status: "moderate",
        requiredFor: {
          courses: [
            { id: 5, title: "Бизнес-аналитика", level: "Средний" }
          ],
          jobs: [
            { title: "Data Analyst", demand: 72 },
            { title: "BI Developer", demand: 65 }
          ]
        },
        recommendedCourses: [
          { id: 6, title: "SQL для анализа данных", difficulty: 2, duration: "12 часов", progress: 15 },
          { id: 7, title: "Оптимизация запросов SQL", difficulty: 3, duration: "8 часов" }
        ]
      },
      {
        id: 3,
        name: "Статистика",
        category: "Математика",
        level: 40,
        targetLevel: 65,
        description: "Недостаточные знания статистики ограничивают возможности интерпретации результатов аналитических моделей.",
        status: "moderate",
        requiredFor: {
          courses: [
            { id: 8, title: "Статистический анализ в Python", level: "Продвинутый" }
          ],
          jobs: [
            { title: "Data Scientist", demand: 85 },
            { title: "Research Analyst", demand: 70 }
          ]
        },
        recommendedCourses: [
          { id: 9, title: "Основы статистики", difficulty: 2, duration: "10 часов" },
          { id: 10, title: "Статистический анализ данных", difficulty: 3, duration: "18 часов" }
        ]
      },
      {
        id: 4,
        name: "Machine Learning",
        category: "Искусственный интеллект",
        level: 15,
        targetLevel: 50,
        description: "Базовые концепции ML освоены недостаточно для разработки собственных моделей и решения нетривиальных задач.",
        status: "critical",
        requiredFor: {
          courses: [
            { id: 11, title: "Глубокое обучение", level: "Продвинутый" }
          ],
          jobs: [
            { title: "ML Engineer", demand: 78 },
            { title: "AI Researcher", demand: 80 }
          ]
        },
        recommendedCourses: [
          { id: 12, title: "Введение в машинное обучение", difficulty: 3, duration: "25 часов" },
          { id: 13, title: "Практический ML на Python", difficulty: 4, duration: "30 часов" }
        ]
      },
      {
        id: 5,
        name: "Git",
        category: "Инструменты разработки",
        level: 30,
        targetLevel: 50,
        description: "Недостаточные навыки работы с системой контроля версий ограничивают эффективность в командных проектах.",
        status: "minor",
        requiredFor: {
          courses: [],
          jobs: [
            { title: "Software Developer", demand: 90 },
            { title: "DevOps Engineer", demand: 85 }
          ]
        },
        recommendedCourses: [
          { id: 14, title: "Git и GitHub для разработчиков", difficulty: 1, duration: "6 часов" }
        ]
      },
      {
        id: 6,
        name: "Deep Learning",
        category: "Искусственный интеллект",
        level: 5,
        targetLevel: 40,
        description: "Начальное понимание глубокого обучения требует развития для работы с современными нейронными сетями.",
        status: "moderate",
        requiredFor: {
          courses: [],
          jobs: [
            { title: "AI Researcher", demand: 80 },
            { title: "Computer Vision Engineer", demand: 75 }
          ]
        },
        recommendedCourses: [
          { id: 15, title: "Основы нейронных сетей", difficulty: 3, duration: "20 часов" },
          { id: 16, title: "PyTorch для глубокого обучения", difficulty: 4, duration: "25 часов" }
        ]
      }
    ],
    summary: {
      criticalCount: 2,
      moderateCount: 3,
      minorCount: 1,
      overallCompleteness: 65
    }
  };
  
  // Используем демо-данные, если реальные не загружены
  const displayData = gapsData || demoData;
  
  // Фильтруем пробелы на основе выбранного режима просмотра
  const filteredGaps = displayData.gaps.filter(gap => {
    if (viewMode === 'all') return true;
    return gap.status === viewMode;
  });
  
  // Ограничиваем количество отображаемых пробелов, если задан лимит
  const displayGaps = limit ? filteredGaps.slice(0, limit) : filteredGaps;
  
  // Определяем цвет для статуса пробела
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-500';
      case 'moderate': return 'bg-amber-500';
      case 'minor': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };
  
  // Определяем текст для статуса пробела
  const getStatusText = (status: string) => {
    switch (status) {
      case 'critical': return 'Критический';
      case 'moderate': return 'Умеренный';
      case 'minor': return 'Незначительный';
      default: return 'Неизвестно';
    }
  };
  
  // Получаем выбранный пробел
  const selectedGapData = selectedGap !== null 
    ? displayData.gaps.find(gap => gap.id === selectedGap)
    : null;
  
  return (
    <Glassmorphism className="p-6">
      {showTitle && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">Пробелы в навыках</h2>
          <p className="text-white/60">
            Анализ пробелов в ваших навыках с рекомендациями по их заполнению
          </p>
        </div>
      )}
      
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)} className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList>
            <TabsTrigger value="all">Все ({displayData.gaps.length})</TabsTrigger>
            <TabsTrigger value="critical" className="text-red-500">
              Критические ({displayData.summary.criticalCount})
            </TabsTrigger>
            <TabsTrigger value="moderate" className="text-amber-500">
              Умеренные ({displayData.summary.moderateCount})
            </TabsTrigger>
            <TabsTrigger value="minor" className="text-blue-500">
              Незначительные ({displayData.summary.minorCount})
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/70">Общая полнота навыков:</span>
            <div className="w-32 h-2 bg-space-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-green-500 rounded-full"
                style={{ width: `${displayData.summary.overallCompleteness}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium">{displayData.summary.overallCompleteness}%</span>
          </div>
        </div>
        
        <TabsContent value="all" className="m-0">
          <GapsList 
            gaps={displayGaps} 
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
            selectedGapId={selectedGap}
            onGapSelect={(id) => {
              setSelectedGap(id === selectedGap ? null : id);
              if (onGapSelect && id !== selectedGap) onGapSelect(id, id);
            }}
          />
        </TabsContent>
        <TabsContent value="critical" className="m-0">
          <GapsList 
            gaps={displayGaps} 
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
            selectedGapId={selectedGap}
            onGapSelect={(id) => {
              setSelectedGap(id === selectedGap ? null : id);
              if (onGapSelect && id !== selectedGap) onGapSelect(id, id);
            }}
          />
        </TabsContent>
        <TabsContent value="moderate" className="m-0">
          <GapsList 
            gaps={displayGaps} 
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
            selectedGapId={selectedGap}
            onGapSelect={(id) => {
              setSelectedGap(id === selectedGap ? null : id);
              if (onGapSelect && id !== selectedGap) onGapSelect(id, id);
            }}
          />
        </TabsContent>
        <TabsContent value="minor" className="m-0">
          <GapsList 
            gaps={displayGaps} 
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
            selectedGapId={selectedGap}
            onGapSelect={(id) => {
              setSelectedGap(id === selectedGap ? null : id);
              if (onGapSelect && id !== selectedGap) onGapSelect(id, id);
            }}
          />
        </TabsContent>
      </Tabs>
      
      {selectedGapData && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <Card className="bg-space-900/50 border-primary/20">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div>
                <CardTitle>{selectedGapData.name}</CardTitle>
                <CardDescription>{selectedGapData.category}</CardDescription>
              </div>
              <Badge className={getStatusColor(selectedGapData.status)}>
                {getStatusText(selectedGapData.status)}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-white/80 mb-3">
                  {selectedGapData.description}
                </p>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Текущий уровень</span>
                    <span className="font-medium">{selectedGapData.level}%</span>
                  </div>
                  <Progress value={selectedGapData.level} className="h-2" />
                </div>
                
                <div className="space-y-1 mt-2">
                  <div className="flex justify-between text-xs">
                    <span>Целевой уровень</span>
                    <span className="font-medium">{selectedGapData.targetLevel}%</span>
                  </div>
                  <div className="h-2 bg-space-800 rounded-full relative">
                    <div className="absolute inset-0 mt-0.5 flex justify-end" style={{ width: `${selectedGapData.targetLevel}%` }}>
                      <div className="w-1 h-1 rounded-full bg-amber-500"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedGapData.requiredFor.courses.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Требуется для курсов</h4>
                  <div className="space-y-2">
                    {selectedGapData.requiredFor.courses.map(course => (
                      <div key={course.id} className="flex items-center justify-between bg-space-800 p-2 rounded-md">
                        <div className="text-sm">{course.title}</div>
                        <div className="text-xs text-white/60">{course.level}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedGapData.requiredFor.jobs.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Востребован в профессиях</h4>
                  <div className="space-y-2">
                    {selectedGapData.requiredFor.jobs.map((job, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-space-800 p-2 rounded-md">
                        <div className="text-sm">{job.title}</div>
                        <div className="text-xs">
                          <span className="text-white/60">Спрос: </span>
                          <span className="font-medium">{job.demand}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium mb-2">Рекомендуемые курсы</h4>
                <div className="space-y-3">
                  {selectedGapData.recommendedCourses.map(course => (
                    <div key={course.id} className="bg-space-800 p-3 rounded-md">
                      <div className="flex justify-between items-start">
                        <div className="text-sm font-medium">{course.title}</div>
                        <Badge variant="outline" className="text-xs">
                          {course.difficulty === 1 ? 'Легкий' :
                          course.difficulty === 2 ? 'Базовый' :
                          course.difficulty === 3 ? 'Средний' :
                          course.difficulty === 4 ? 'Сложный' : 'Эксперт'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-white/60">{course.duration}</span>
                        
                        {course.progress !== undefined ? (
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-space-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs">{course.progress}%</span>
                          </div>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-7 px-2 text-xs"
                            onClick={() => onCourseSelect && onCourseSelect(course.id)}
                          >
                            Начать <ChevronRight size={14} className="ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </Glassmorphism>
  );
}

function GapsList({
  gaps,
  getStatusColor,
  getStatusText,
  selectedGapId,
  onGapSelect
}: {
  gaps: SkillWithInfo[];
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
  selectedGapId: number | null;
  onGapSelect: (id: number) => void;
}) {
  if (gaps.length === 0) {
    return (
      <div className="text-center p-8 bg-space-900/40 rounded-lg">
        <p className="text-white/60">Нет обнаруженных пробелов в навыках для текущего фильтра</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {gaps.map(gap => (
        <Card 
          key={gap.id} 
          className={`bg-space-900/30 hover:bg-space-900/50 transition-colors cursor-pointer border-primary/10 ${selectedGapId === gap.id ? 'ring-1 ring-primary' : ''}`}
          onClick={() => onGapSelect(gap.id)}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{gap.name}</CardTitle>
              <Badge className={getStatusColor(gap.status)}>
                {getStatusText(gap.status)}
              </Badge>
            </div>
            <CardDescription>{gap.category}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Текущий уровень</span>
                  <span className="font-medium">{gap.level}%</span>
                </div>
                <Progress value={gap.level} className="h-1.5" />
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Целевой уровень</span>
                  <span className="font-medium">{gap.targetLevel}%</span>
                </div>
                <div className="h-1.5 bg-space-800 rounded-full relative">
                  <div className="absolute inset-0 mt-0.5 flex justify-end" style={{ width: `${gap.targetLevel}%` }}>
                    <div className="w-0.5 h-0.5 rounded-full bg-amber-500"></div>
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-white/70 line-clamp-2 mt-1">
                {gap.description}
              </div>
              
              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-xs text-white/60 mr-1">Рекомендуемые курсы:</span>
                  <span className="text-xs font-medium">{gap.recommendedCourses.length}</span>
                </div>
                
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-6 px-2 text-xs"
                >
                  Подробнее <ChevronRight size={12} className="ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
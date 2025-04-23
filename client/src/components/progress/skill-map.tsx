import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import { Radar } from 'react-d3-radar';
import { useQuery } from '@tanstack/react-query';
import { SkillMapData, SkillWithInfo } from '@shared/schema';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Glassmorphism } from '@/components/ui/glassmorphism';
import {
  BarChart3,
  BookOpen,
  Brain,
  Check,
  ChevronRight,
  Filter,
  Lightbulb,
  ListFilter,
  Network,
  Search,
  Sparkles,
  Target,
  Zap
} from 'lucide-react';

interface SkillMapProps {
  userId?: number;
  showTitle?: boolean;
  showFilter?: boolean;
  showTabs?: boolean;
  compact?: boolean;
  onSkillSelect?: (skillId: number) => void;
}

export function SkillMap({
  userId,
  showTitle = true,
  showFilter = true,
  showTabs = true,
  compact = false,
  onSkillSelect
}: SkillMapProps) {
  // Состояние для хранения данных карты навыков
  const [skillsData, setSkillsData] = useState<SkillMapData | null>(null);
  
  // Состояние для фильтров и поиска
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [showOnlyGaps, setShowOnlyGaps] = useState(false);
  
  // Загрузка данных навыков пользователя
  const { data, isLoading, error } = useQuery<SkillMapData>({
    queryKey: ['/api/skills/map', userId],
    enabled: !!userId
  });
  
  // Обновляем состояние при получении данных
  useEffect(() => {
    if (data) {
      setSkillsData(data);
      
      // Устанавливаем выбранную категорию, если она еще не выбрана
      if (!selectedCategory && data.categories.length > 0) {
        setSelectedCategory(data.categories[0].id);
      }
    }
  }, [data, selectedCategory]);
  
  // Функция для фильтрации навыков
  const getFilteredSkills = (): SkillWithInfo[] => {
    if (!skillsData) return [];
    
    let skills: SkillWithInfo[] = [];
    
    // Если выбрана категория, фильтруем по ней
    if (selectedCategory) {
      const category = skillsData.categories.find(cat => cat.id === selectedCategory);
      if (category) {
        skills = category.skills;
      }
    } else {
      // Иначе берем все навыки из всех категорий
      skills = skillsData.categories.flatMap(cat => cat.skills);
    }
    
    // Применяем остальные фильтры
    return skills.filter(skill => {
      // Фильтр по поисковому запросу
      const matchesSearch = searchTerm ? 
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        skill.displayName.toLowerCase().includes(searchTerm.toLowerCase()) : 
        true;
      
      // Фильтр по уровню сложности
      const matchesLevel = selectedLevel ? skill.level === selectedLevel : true;
      
      // Фильтр по пробелам в навыках
      const matchesGaps = showOnlyGaps ? (skill.gapSize && skill.gapSize > 0) : true;
      
      return matchesSearch && matchesLevel && matchesGaps;
    });
  };
  
  // Функция для получения данных для радара
  const getRadarData = () => {
    if (!skillsData) return { variables: [], sets: [] };
    
    const category = skillsData.categories.find(cat => cat.id === selectedCategory);
    if (!category) return { variables: [], sets: [] };
    
    // Готовим данные для радара (до 8 навыков с наибольшим гэпом)
    const gapSkills = [...category.skills]
      .filter(skill => skill.gapSize && skill.gapSize > 0)
      .sort((a, b) => (b.gapSize || 0) - (a.gapSize || 0))
      .slice(0, 8);
    
    // Если навыков с пробелами недостаточно, добавляем обычные навыки
    const skills = gapSkills.length < 3 ? 
      [...gapSkills, ...category.skills
        .filter(skill => !skill.gapSize || skill.gapSize === 0)
        .slice(0, 8 - gapSkills.length)] :
      gapSkills;
    
    return {
      variables: skills.map(skill => ({
        key: skill.id.toString(),
        label: skill.displayName
      })),
      sets: [
        {
          key: 'current',
          label: 'Текущий уровень',
          values: Object.fromEntries(
            skills.map(skill => [skill.id.toString(), skill.userLevel || 0])
          )
        },
        {
          key: 'target',
          label: 'Целевой уровень',
          values: Object.fromEntries(
            skills.map(skill => [skill.id.toString(), skill.targetLevel || 0])
          )
        }
      ]
    };
  };
  
  // Рендеринг во время загрузки
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Загрузка карты навыков...</CardTitle>
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
          <CardTitle>Ошибка загрузки навыков</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Произошла ошибка при загрузке карты навыков. Пожалуйста, попробуйте позже.</p>
        </CardContent>
      </Card>
    );
  }
  
  // Рендеринг, если данных еще нет
  if (!skillsData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Карта навыков</CardTitle>
          <CardDescription>
            Информация о ваших навыках еще не собрана. Пройдите несколько уроков, чтобы увидеть свой прогресс.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <Button>Начать обучение</Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={compact ? "border-0 shadow-none bg-transparent" : "border-primary/20 bg-space-900/50 backdrop-blur-sm"}>
      {showTitle && (
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Карта навыков</CardTitle>
              <CardDescription>
                Отслеживайте прогресс и выявляйте пробелы в своих знаниях
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-400 mr-1"></div>
                <span>Текущий</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-purple-400 mr-1"></div>
                <span>Целевой</span>
              </div>
            </div>
          </div>
          
          {/* Общий прогресс */}
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-white/60">Общий прогресс</span>
              <span className="text-sm font-medium">{skillsData.overallProgress}%</span>
            </div>
            <Progress value={skillsData.overallProgress} className="h-2" />
          </div>
          
          {/* Информация о навыках */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="flex flex-col items-center text-center p-2 rounded-lg bg-primary/10">
              <div className="text-2xl font-bold">{skillsData.masteredSkills}</div>
              <div className="text-xs text-white/60">Освоенных навыков</div>
            </div>
            <div className="flex flex-col items-center text-center p-2 rounded-lg bg-purple-500/10">
              <div className="text-2xl font-bold">{skillsData.learningSkills}</div>
              <div className="text-xs text-white/60">В процессе изучения</div>
            </div>
            <div className="flex flex-col items-center text-center p-2 rounded-lg bg-red-500/10">
              <div className="text-2xl font-bold">{skillsData.gapCount}</div>
              <div className="text-xs text-white/60">Выявленных пробелов</div>
            </div>
          </div>
        </CardHeader>
      )}
      
      <CardContent>
        {/* Фильтры */}
        {showFilter && (
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-white/40" />
              <Input
                placeholder="Поиск навыков..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className={showOnlyGaps ? "bg-red-500/20" : ""}
                onClick={() => setShowOnlyGaps(!showOnlyGaps)}
              >
                <Target size={16} className="mr-1" />
                Пробелы
              </Button>
              
              <Button variant="outline" size="sm" onClick={() => {
                setSearchTerm('');
                setSelectedLevel(null);
                setShowOnlyGaps(false);
              }}>
                <ListFilter size={16} className="mr-1" />
                Сбросить
              </Button>
            </div>
          </div>
        )}
        
        {/* Вкладки категорий */}
        {showTabs && (
          <Tabs 
            defaultValue={selectedCategory || skillsData.categories[0]?.id} 
            onValueChange={setSelectedCategory}
            className="mb-6"
          >
            <TabsList className="w-full grid grid-cols-3 sm:grid-cols-5 h-auto">
              {skillsData.categories.map((category) => (
                <TabsTrigger 
                  key={category.id}
                  value={category.id}
                  className="relative py-2 px-2 sm:px-4"
                >
                  <span>{category.name}</span>
                  <span className="absolute top-0 right-0 text-xs bg-primary/90 text-white px-1 rounded-bl-md rounded-tr-md">
                    {category.overallProgress}%
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {skillsData.categories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    {/* Радарная диаграмма */}
                    <div className="bg-space-800/50 rounded-lg p-4 h-[350px] flex items-center justify-center">
                      {getRadarData().variables.length > 0 ? (
                        <Radar
                          width={300}
                          height={300}
                          padding={30}
                          domainMax={100}
                          highlighted={null}
                          data={getRadarData()}
                          options={{
                            axes: { 
                              ticks: 5,
                              distance: 1,
                              fontSize: 10,
                              // @ts-ignore - неверная типизация в react-d3-radar
                              color: 'rgba(255, 255, 255, 0.5)'
                            },
                            dots: {
                              radius: 3,
                            },
                            zoomDistance: 1.0,
                            setColors: {
                              current: '#38BDF8',
                              target: '#C084FC'
                            }
                          }}
                        />
                      ) : (
                        <div className="text-center text-white/60">
                          <Brain size={48} className="mx-auto mb-2 opacity-50" />
                          <p>Недостаточно данных для построения диаграммы</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    {/* Список навыков */}
                    <div className="bg-space-800/50 rounded-lg p-4 h-[350px] overflow-y-auto space-y-2">
                      {getFilteredSkills().length > 0 ? getFilteredSkills().map((skill) => (
                        <Glassmorphism
                          key={skill.id}
                          className="p-3 relative rounded-md cursor-pointer hover:bg-white/5 transition-all"
                          onClick={() => onSkillSelect && onSkillSelect(skill.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center">
                                <h4 className="font-medium text-sm">
                                  {skill.displayName}
                                </h4>
                                {skill.gapSize && skill.gapSize > 0 && (
                                  <Badge variant="outline" className="ml-2 bg-red-500/20 text-red-400 border-0 text-xs">
                                    Пробел
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-white/60 mt-1">
                                {skill.categoryName || category.name} • Уровень {skill.level}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center text-xs">
                                <span className="text-white/80 mr-1">
                                  {skill.userLevel || 0}/100
                                </span>
                                {skill.isLearning && (
                                  <Badge variant="outline" className="ml-1 bg-blue-500/20 text-blue-400 border-0 text-xs">
                                    Изучается
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-2">
                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${
                                  (skill.userLevel || 0) >= 80 ? 'bg-green-400' : 
                                  (skill.userLevel || 0) >= 50 ? 'bg-blue-400' : 
                                  (skill.userLevel || 0) >= 20 ? 'bg-yellow-400' : 
                                  'bg-red-400'
                                }`}
                                style={{ width: `${skill.userLevel || 0}%` }}
                              />
                            </div>
                            
                            {skill.targetLevel && skill.targetLevel > 0 && (
                              <div 
                                className="h-2 w-1 bg-purple-400 absolute rounded-sm" 
                                style={{ 
                                  left: `calc(${skill.targetLevel}% + 1.25rem)`, 
                                  bottom: '1.25rem',
                                  transform: 'translateX(-50%)'
                                }}
                              />
                            )}
                          </div>
                        </Glassmorphism>
                      )) : (
                        <div className="flex flex-col items-center justify-center h-full text-white/60">
                          <Search size={36} className="mb-2 opacity-50" />
                          <p>Навыки не найдены</p>
                          <p className="text-xs">Попробуйте изменить критерии поиска</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          <BarChart3 size={16} className="mr-1" /> Статистика
        </Button>
        
        <Button variant="outline" size="sm">
          Подробный анализ <ChevronRight size={16} className="ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}
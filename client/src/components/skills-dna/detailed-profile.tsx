import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  AlertTriangle, Award, Brain, ChartBar, Download, FileText, 
  Info, LineChart, RefreshCw, Settings, Star, Target, Zap 
} from "lucide-react";
import { AdvancedRadarChart } from "./advanced-radar-chart";
import { SkillsTriangleChart } from "./triangle-chart";
import useSkillsDna from "@/hooks/use-skills-dna";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

interface DetailedSkillsDnaProfileProps {
  userId?: number;
  className?: string;
  showHeader?: boolean;
}

/**
 * Детализированный профиль Skills DNA с расширенной аналитикой
 * Предоставляет полную информацию о навыках пользователя в различных визуализациях
 */
export function DetailedSkillsDnaProfile({
  userId,
  className = "",
  showHeader = true
}: DetailedSkillsDnaProfileProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("radar");
  
  // Получаем данные Skills DNA для пользователя
  const { 
    skills, 
    summary, 
    isLoading, 
    error, 
    refetch,
    isEmpty,
    isDemoMode,
    progressHistory
  } = useSkillsDna(userId);
  
  // Преобразуем объект навыков в формат для радарной диаграммы
  const radarSkills = Object.entries(skills).map(([name, value]) => ({
    name,
    value: value as number,
    // Добавляем случайные подкатегории для более детальной визуализации
    subcategories: [
      { name: "Теория", value: Math.min(100, Math.max(0, (value as number) + Math.floor(Math.random() * 15) - 7)) },
      { name: "Практика", value: Math.min(100, Math.max(0, (value as number) + Math.floor(Math.random() * 15) - 7)) },
      { name: "Критическое мышление", value: Math.min(100, Math.max(0, (value as number) + Math.floor(Math.random() * 15) - 7)) }
    ]
  }));
  
  // Преобразуем данные для треугольной диаграммы
  const triangleSkills = {
    top: { 
      name: "Понимание основ ИИ", 
      value: skills["Понимание основ ИИ"] || skills["Основы ИИ"] || skills["Машинное обучение"] || 40
    },
    bottomLeft: { 
      name: "Этические аспекты", 
      value: skills["Этические аспекты использования ИИ"] || skills["Этика ИИ"] || 25
    },
    bottomRight: { 
      name: "Критическое мышление", 
      value: skills["Критическое мышление в контексте ИИ"] || skills["Аналитическое мышление"] || 65
    }
  };
  
  // Группировка навыков по категориям
  const skillCategories = {
    "Технические": Object.entries(skills)
      .filter(([name]) => 
        name.includes("программирование") || 
        name.includes("Алгоритмы") || 
        name.includes("Машинное обучение") ||
        name.includes("Технологии")
      ),
    "Мягкие": Object.entries(skills)
      .filter(([name]) => 
        name.includes("мышление") || 
        name.includes("коммуникация") || 
        name.includes("Критическое")
      ),
    "Знания": Object.entries(skills)
      .filter(([name]) => 
        name.includes("Понимание") || 
        name.includes("основы") || 
        name.includes("Основы")
      ),
    "Этика": Object.entries(skills)
      .filter(([name]) => 
        name.includes("Этика") || 
        name.includes("этические") || 
        name.includes("Этические")
      )
  };
  
  // Экспорт данных в PDF или CSV
  const handleExportData = (format: 'pdf' | 'csv') => {
    toast({
      title: `Экспорт данных в ${format.toUpperCase()}`,
      description: "Ваши данные Skills DNA скоро будут скачаны",
    });
    
    // Здесь будет логика экспорта данных
  };
  
  // Состояние загрузки
  if (isLoading) {
    return (
      <div className={className}>
        <Card className="bg-space-800/70 border-blue-500/20">
          <CardHeader className="pb-2">
            {showHeader && (
              <CardTitle className="text-white flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                Расширенный профиль Skills DNA
              </CardTitle>
            )}
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="flex flex-col items-center justify-center py-12">
              <Skeleton className="w-64 h-64 rounded-full bg-white/5" />
              <div className="space-y-2 mt-6 w-full max-w-md">
                <Skeleton className="w-full h-6 bg-white/5" />
                <Skeleton className="w-full h-6 bg-white/5" />
                <Skeleton className="w-full h-6 bg-white/5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Если нет данных или есть ошибка
  if (error || isEmpty) {
    return (
      <div className={className}>
        <Card className="bg-space-800/70 border-blue-500/20">
          <CardHeader className="pb-2">
            {showHeader && (
              <CardTitle className="text-white flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                Расширенный профиль Skills DNA
              </CardTitle>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center text-center py-12">
              <AlertTriangle className="h-12 w-12 text-red-400 mb-4" />
              <h3 className="text-xl font-medium mb-3 text-white">
                {error ? "Не удалось загрузить данные" : "Данные Skills DNA отсутствуют"}
              </h3>
              <p className="text-white/70 max-w-md mb-6">
                {error 
                  ? "Произошла ошибка при загрузке вашего профиля Skills DNA. Пожалуйста, пройдите диагностику, чтобы мы могли создать для вас персональную карту навыков." 
                  : "У вас пока нет профиля Skills DNA. Пройдите диагностику, чтобы мы могли проанализировать ваши знания и навыки в области ИИ и составить для вас персональную карту компетенций."}
              </p>
              
              <div className="flex flex-wrap gap-3 justify-center">
                <Button 
                  variant="default" 
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                  onClick={() => window.location.href = "/quick-diagnosis"}
                >
                  Быстрая диагностика
                </Button>
                <Button 
                  variant="outline" 
                  className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10"
                  onClick={() => window.location.href = "/deep-diagnosis"}
                >
                  Глубокая диагностика
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className={className}>
      <Card className="bg-space-800/70 border-blue-500/20">
        {showHeader && (
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center">
                <Brain className="h-5 w-5 mr-2 text-purple-400" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#B28DFF] via-[#8BE0F7] to-[#B28DFF]">
                  Расширенный профиль Skills DNA
                </span>
              </CardTitle>
              <div className="flex items-center gap-2">
                {isDemoMode && (
                  <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-300">
                    Демо-режим
                  </Badge>
                )}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={refetch} className="h-8 w-8">
                        <RefreshCw className="h-4 w-4 text-white/70" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Обновить данные</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardHeader>
        )}
        <CardContent className="pt-2">
          {/* Общая статистика */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-space-900/50 rounded-lg p-3 border border-space-800">
              <div className="flex items-center mb-2">
                <div className="p-2 rounded-full bg-purple-500/20">
                  <ChartBar className="h-4 w-4 text-purple-400" />
                </div>
                <span className="text-white/80 text-sm ml-2">Общий уровень</span>
              </div>
              <div className="flex items-end">
                <span className="text-2xl font-bold text-white">{summary?.overallLevel || 0}%</span>
                <Badge 
                  variant="outline" 
                  className="ml-2 bg-green-500/10 border-green-500/30 text-green-300 text-xs"
                >
                  +5%
                </Badge>
              </div>
              <Progress 
                value={summary?.overallLevel || 0} 
                max={100} 
                className="h-1.5 mt-2 bg-space-800"
              />
            </div>
            
            <div className="bg-space-900/50 rounded-lg p-3 border border-space-800">
              <div className="flex items-center mb-2">
                <div className="p-2 rounded-full bg-blue-500/20">
                  <Star className="h-4 w-4 text-blue-400" />
                </div>
                <span className="text-white/80 text-sm ml-2">Сильные навыки</span>
              </div>
              <div className="flex items-end">
                <span className="text-2xl font-bold text-white">
                  {Object.values(skills).filter(v => (v as number) >= 70).length}
                </span>
                <span className="text-white/60 ml-2 mb-1">из {Object.keys(skills).length}</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {Object.entries(skills)
                  .filter(([_, value]) => (value as number) >= 70)
                  .slice(0, 2)
                  .map(([name]) => (
                    <Badge 
                      key={name} 
                      variant="outline"
                      className="bg-blue-500/10 border-blue-500/30 text-blue-300 text-xs"
                    >
                      {name}
                    </Badge>
                  ))}
              </div>
            </div>
            
            <div className="bg-space-900/50 rounded-lg p-3 border border-space-800">
              <div className="flex items-center mb-2">
                <div className="p-2 rounded-full bg-amber-500/20">
                  <Target className="h-4 w-4 text-amber-400" />
                </div>
                <span className="text-white/80 text-sm ml-2">Рекомендации</span>
              </div>
              <div className="flex items-end">
                <span className="text-2xl font-bold text-white">
                  {summary?.recommendations?.length || 0}
                </span>
              </div>
              <div className="text-white/60 text-xs mt-2 leading-tight">
                {summary?.recommendations?.[0] || "Пройдите глубокую диагностику для получения рекомендаций"}
              </div>
            </div>
            
            <div className="bg-space-900/50 rounded-lg p-3 border border-space-800">
              <div className="flex items-center mb-2">
                <div className="p-2 rounded-full bg-emerald-500/20">
                  <LineChart className="h-4 w-4 text-emerald-400" />
                </div>
                <span className="text-white/80 text-sm ml-2">Прогресс</span>
              </div>
              <div className="flex items-end">
                <span className="text-2xl font-bold text-white">
                  {progressHistory?.length || 0}
                </span>
                <span className="text-white/60 ml-2 mb-1">изменений</span>
              </div>
              <div className="text-white/60 text-xs mt-2 leading-tight">
                {progressHistory?.length ? "Последнее обновление: 3 дня назад" : "Нет данных о прогрессе"}
              </div>
            </div>
          </div>
          
          {/* Основная часть с вкладками */}
          <Tabs
            defaultValue="radar"
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <TabsList className="bg-space-900/50 p-1">
                <TabsTrigger 
                  value="radar" 
                  className="data-[state=active]:bg-space-700 data-[state=active]:text-white"
                >
                  Радарная диаграмма
                </TabsTrigger>
                <TabsTrigger 
                  value="triangle" 
                  className="data-[state=active]:bg-space-700 data-[state=active]:text-white"
                >
                  Треугольная диаграмма
                </TabsTrigger>
                <TabsTrigger 
                  value="categories" 
                  className="data-[state=active]:bg-space-700 data-[state=active]:text-white"
                >
                  Категории
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className="data-[state=active]:bg-space-700 data-[state=active]:text-white"
                >
                  Аналитика
                </TabsTrigger>
              </TabsList>
              
              <div className="flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 border-space-700 bg-space-900/50 text-white/70"
                        onClick={() => handleExportData('pdf')}
                      >
                        <Download className="h-3.5 w-3.5 mr-1" />
                        PDF
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Экспорт в PDF</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 border-space-700 bg-space-900/50 text-white/70"
                        onClick={() => handleExportData('csv')}
                      >
                        <Download className="h-3.5 w-3.5 mr-1" />
                        CSV
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Экспорт в CSV</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 border-space-700 bg-space-900/50 text-white/70"
                      >
                        <Settings className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Настройки визуализации</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            
            {/* Вкладка с радарной диаграммой */}
            <TabsContent value="radar" className="space-y-6">
              <div className="flex flex-col items-center justify-center">
                <AdvancedRadarChart
                  skills={radarSkills}
                  width={600}
                  height={500}
                  showLegend={true}
                  showValues={true}
                  colorScheme={["rgba(151, 92, 239, 0.7)", "rgba(46, 186, 225, 0.7)"]}
                  className="mx-auto"
                />
              </div>
              
              <div className="bg-space-900/50 rounded-lg p-4 border border-space-800">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="h-4 w-4 text-blue-400" />
                  <h3 className="text-white font-medium">О радарной диаграмме</h3>
                </div>
                <p className="text-white/70 text-sm">
                  Радарная диаграмма предоставляет полный обзор всех ваших навыков в области искусственного интеллекта. 
                  Чем дальше от центра находится точка на диаграмме, тем лучше развит соответствующий навык. 
                  Наведите курсор на любую точку, чтобы увидеть подробную информацию о конкретном навыке и его подкатегориях.
                </p>
              </div>
            </TabsContent>
            
            {/* Вкладка с треугольной диаграммой */}
            <TabsContent value="triangle" className="space-y-6">
              <div className="flex flex-col items-center justify-center">
                <SkillsTriangleChart
                  skills={triangleSkills}
                  width={500}
                  height={500}
                  className="mx-auto"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-space-900/50 rounded-lg p-4 border border-space-800">
                  <h3 className="text-white font-medium mb-2 flex items-center">
                    <span className="w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
                    {triangleSkills.top.name}
                  </h3>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white/70 text-sm">Уровень:</span>
                    <span className="text-white font-medium">{triangleSkills.top.value}%</span>
                  </div>
                  <Progress 
                    value={triangleSkills.top.value} 
                    max={100} 
                    className="h-1.5 bg-space-800" 
                  />
                  <p className="text-white/60 text-xs mt-3">
                    Включает в себя понимание основных концепций, алгоритмов и методов машинного обучения, 
                    нейронных сетей и обработки данных.
                  </p>
                </div>
                
                <div className="bg-space-900/50 rounded-lg p-4 border border-space-800">
                  <h3 className="text-white font-medium mb-2 flex items-center">
                    <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
                    {triangleSkills.bottomLeft.name}
                  </h3>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white/70 text-sm">Уровень:</span>
                    <span className="text-white font-medium">{triangleSkills.bottomLeft.value}%</span>
                  </div>
                  <Progress 
                    value={triangleSkills.bottomLeft.value} 
                    max={100} 
                    className="h-1.5 bg-space-800" 
                  />
                  <p className="text-white/60 text-xs mt-3">
                    Охватывает знание этических принципов, правовых норм и социальных последствий 
                    использования искусственного интеллекта в различных областях.
                  </p>
                </div>
                
                <div className="bg-space-900/50 rounded-lg p-4 border border-space-800">
                  <h3 className="text-white font-medium mb-2 flex items-center">
                    <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                    {triangleSkills.bottomRight.name}
                  </h3>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white/70 text-sm">Уровень:</span>
                    <span className="text-white font-medium">{triangleSkills.bottomRight.value}%</span>
                  </div>
                  <Progress 
                    value={triangleSkills.bottomRight.value} 
                    max={100} 
                    className="h-1.5 bg-space-800" 
                  />
                  <p className="text-white/60 text-xs mt-3">
                    Отражает способность анализировать, оценивать и интерпретировать результаты работы 
                    ИИ-систем, а также принимать взвешенные решения на их основе.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            {/* Вкладка с категориями навыков */}
            <TabsContent value="categories" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(skillCategories).map(([category, skills]) => (
                  <div key={category} className="bg-space-900/50 rounded-lg p-4 border border-space-800">
                    <h3 className="text-white font-medium mb-3">{category} навыки</h3>
                    {skills.length > 0 ? (
                      <div className="space-y-3">
                        {skills.map(([name, value]) => (
                          <div key={name}>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-white/80 text-sm">{name}</span>
                              <span className="text-white/70 text-xs">{value}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-space-800 rounded-full">
                              <div 
                                className="h-full rounded-full bg-gradient-to-r from-purple-500/70 to-blue-500/70"
                                style={{ width: `${value}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-white/50 text-sm italic">
                        Нет данных в этой категории
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Рекомендации */}
                <div className="md:col-span-2 bg-space-900/50 rounded-lg p-4 border border-space-800">
                  <h3 className="text-white font-medium mb-3 flex items-center">
                    <Zap className="h-4 w-4 mr-1 text-amber-400" />
                    Персональные рекомендации
                  </h3>
                  
                  {summary?.recommendations && summary.recommendations.length > 0 ? (
                    <ul className="space-y-2">
                      {summary.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="min-w-5 h-5 flex items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium mt-0.5">
                            {index + 1}
                          </div>
                          <p className="text-white/80 text-sm">{rec}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-white/50 text-sm italic">
                      Пройдите глубокую диагностику для получения персональных рекомендаций
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            {/* Вкладка с аналитикой */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Сильные стороны */}
                <div className="bg-space-900/50 rounded-lg p-4 border border-space-800">
                  <h3 className="text-white font-medium mb-3 flex items-center">
                    <Award className="h-4 w-4 mr-1 text-yellow-400" />
                    Сильные стороны
                  </h3>
                  
                  {Object.entries(skills)
                    .filter(([_, value]) => (value as number) >= 70)
                    .sort(([_, a], [__, b]) => (b as number) - (a as number))
                    .slice(0, 5)
                    .map(([name, value]) => (
                      <div key={name} className="mb-3">
                        <div className="flex justify-between mb-1">
                          <span className="text-white/80 text-sm">{name}</span>
                          <Badge 
                            variant="outline"
                            className="bg-yellow-500/10 border-yellow-500/30 text-yellow-300 text-xs"
                          >
                            {value}%
                          </Badge>
                        </div>
                        <div className="w-full h-1.5 bg-space-800 rounded-full">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-yellow-500/70 to-amber-500/70"
                            style={{ width: `${value}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  
                  {Object.entries(skills).filter(([_, value]) => (value as number) >= 70).length === 0 && (
                    <div className="text-white/50 text-sm italic">
                      Пока нет сильных сторон. Продолжайте обучение!
                    </div>
                  )}
                </div>
                
                {/* Области для развития */}
                <div className="bg-space-900/50 rounded-lg p-4 border border-space-800">
                  <h3 className="text-white font-medium mb-3 flex items-center">
                    <Target className="h-4 w-4 mr-1 text-blue-400" />
                    Области для развития
                  </h3>
                  
                  {Object.entries(skills)
                    .filter(([_, value]) => (value as number) < 50)
                    .sort(([_, a], [__, b]) => (a as number) - (b as number))
                    .slice(0, 5)
                    .map(([name, value]) => (
                      <div key={name} className="mb-3">
                        <div className="flex justify-between mb-1">
                          <span className="text-white/80 text-sm">{name}</span>
                          <Badge 
                            variant="outline"
                            className="bg-blue-500/10 border-blue-500/30 text-blue-300 text-xs"
                          >
                            {value}%
                          </Badge>
                        </div>
                        <div className="w-full h-1.5 bg-space-800 rounded-full">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-blue-500/70 to-cyan-500/70"
                            style={{ width: `${value}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  
                  {Object.entries(skills).filter(([_, value]) => (value as number) < 50).length === 0 && (
                    <div className="text-white/50 text-sm italic">
                      Отлично! У вас нет явных слабых сторон.
                    </div>
                  )}
                </div>
                
                {/* Сравнение с другими */}
                <div className="bg-space-900/50 rounded-lg p-4 border border-space-800">
                  <h3 className="text-white font-medium mb-3 flex items-center">
                    <ChartBar className="h-4 w-4 mr-1 text-green-400" />
                    Сравнение с другими
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-white/80 text-sm">Ваш уровень</span>
                        <span className="text-white/70 text-xs">{summary?.overallLevel || 0}%</span>
                      </div>
                      <div className="w-full h-2 bg-space-800 rounded-full">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                          style={{ width: `${summary?.overallLevel || 0}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-white/80 text-sm">Средний уровень</span>
                        <span className="text-white/70 text-xs">45%</span>
                      </div>
                      <div className="w-full h-2 bg-space-800 rounded-full">
                        <div 
                          className="h-full rounded-full bg-white/30"
                          style={{ width: '45%' }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-white/80 text-sm">Профессионалы</span>
                        <span className="text-white/70 text-xs">78%</span>
                      </div>
                      <div className="w-full h-2 bg-space-800 rounded-full">
                        <div 
                          className="h-full rounded-full bg-white/30"
                          style={{ width: '78%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-space-700">
                    <h4 className="text-white/90 text-sm font-medium mb-2">Ваш персональный рейтинг</h4>
                    <div className="flex items-center">
                      <div className="text-2xl font-bold text-white">
                        {Math.round((summary?.overallLevel || 0) / 10) + 1}
                      </div>
                      <div className="text-white/60 text-xs ml-2">
                        из 10 уровней<br />
                        <span className="text-green-400">Выше 63% пользователей</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Прогресс во времени */}
              <div className="bg-space-900/50 rounded-lg p-4 border border-space-800">
                <h3 className="text-white font-medium mb-3 flex items-center">
                  <LineChart className="h-4 w-4 mr-1 text-indigo-400" />
                  Динамика навыков
                </h3>
                
                {progressHistory && progressHistory.length > 0 ? (
                  <div className="space-y-6">
                    {/* График прогресса с течением времени */}
                    <div className="min-h-[200px] pt-4">
                      <div className="text-white/80 text-sm mb-4">
                        График динамики навыков с течением времени:
                      </div>

                      <div className="relative h-[200px] rounded-md bg-space-900/30 border border-space-800">
                        {/* Оси координат */}
                        <div className="absolute bottom-0 left-0 h-full w-full border-t border-l border-white/10 p-4">
                          {/* Вертикальная ось (%) */}
                          <div className="absolute top-0 left-0 h-full flex flex-col justify-between text-white/50 text-xs">
                            <span>100%</span>
                            <span>75%</span>
                            <span>50%</span>
                            <span>25%</span>
                            <span>0%</span>
                          </div>
                          
                          {/* Горизонтальные линии сетки */}
                          <div className="absolute top-0 left-8 right-4 h-full">
                            <div className="border-b border-white/5 h-1/4"></div>
                            <div className="border-b border-white/5 h-1/4"></div>
                            <div className="border-b border-white/5 h-1/4"></div>
                            <div className="border-b border-white/5 h-1/4"></div>
                          </div>
                          
                          {/* Горизонтальная ось (время) */}
                          <div className="absolute bottom-0 left-8 right-4 flex justify-between text-white/50 text-xs">
                            {progressHistory.map((entry, index) => (
                              <span key={entry.date} style={{position: 'absolute', left: `${index * (100 / (progressHistory.length - 1))}%`}}>
                                {new Date(entry.date).toLocaleDateString('ru-RU', {month: 'short', year: '2-digit'})}
                              </span>
                            ))}
                          </div>
                          
                          {/* Линии графика для каждого навыка */}
                          <div className="absolute top-4 left-8 right-4 bottom-6">
                            {Object.keys(progressHistory[0].skills).slice(0, 3).map((skillName, skillIndex) => {
                              const points = progressHistory.map((entry, entryIndex) => {
                                const xPercent = entryIndex * (100 / (progressHistory.length - 1));
                                const yPercent = 100 - (entry.skills[skillName] || 0);
                                return `${xPercent}% ${yPercent}%`;
                              }).join(', ');
                              
                              const colors = ['rgba(151, 92, 239, 0.7)', 'rgba(46, 186, 225, 0.7)', 'rgba(75, 192, 192, 0.7)'];
                              
                              return (
                                <div key={skillName} className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
                                  <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    <polyline 
                                      points={points} 
                                      fill="none" 
                                      stroke={colors[skillIndex % colors.length]} 
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    {progressHistory.map((entry, entryIndex) => {
                                      const xPercent = entryIndex * (100 / (progressHistory.length - 1));
                                      const yPercent = 100 - (entry.skills[skillName] || 0);
                                      return (
                                        <circle 
                                          key={`${skillName}-${entryIndex}`}
                                          cx={`${xPercent}%`} 
                                          cy={`${yPercent}%`} 
                                          r="2" 
                                          fill={colors[skillIndex % colors.length]}
                                        />
                                      );
                                    })}
                                  </svg>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Легенда и дополнительная информация */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {Object.keys(progressHistory[0].skills).slice(0, 3).map((skillName, index) => {
                        const currentValue = progressHistory[0].skills[skillName] || 0;
                        const oldestValue = progressHistory[progressHistory.length - 1].skills[skillName] || 0;
                        const change = currentValue - oldestValue;
                        const colors = ['#975cef', '#2ebae1', '#4bc0c0'];
                        
                        return (
                          <div key={skillName} className="bg-space-900/30 rounded-md p-3 border border-space-800">
                            <div className="flex items-center mb-2">
                              <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: colors[index % colors.length]}}></div>
                              <span className="text-white/90 text-sm font-medium truncate">{skillName}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-white/70 text-sm">Текущий: {currentValue}%</span>
                              <Badge 
                                variant="outline" 
                                className={`
                                  ${change > 0 ? 'bg-green-500/10 border-green-500/30 text-green-300' : 'bg-amber-500/10 border-amber-500/30 text-amber-300'} 
                                  text-xs
                                `}
                              >
                                {change >= 0 ? '+' : ''}{change}%
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="bg-space-900/20 rounded-md p-3 border border-space-800">
                      <div className="text-white/70 text-sm">
                        <strong>Общий прогресс: </strong> 
                        {progressHistory[0].overallLevel}% (
                        {progressHistory[0].overallLevel && progressHistory[progressHistory.length - 1].overallLevel 
                          ? (progressHistory[0].overallLevel - progressHistory[progressHistory.length - 1].overallLevel) >= 0 
                            ? `+${progressHistory[0].overallLevel - progressHistory[progressHistory.length - 1].overallLevel}%` 
                            : `${progressHistory[0].overallLevel - progressHistory[progressHistory.length - 1].overallLevel}%`
                          : '+0%'
                        } за последние 3 месяца)
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="min-h-[150px] flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="h-8 w-8 text-white/20 mx-auto mb-2" />
                      <p className="text-white/50 text-sm mb-3">
                        Недостаточно данных для отображения динамики навыков.
                        Проходите диагностику регулярно, чтобы видеть свой прогресс.
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10"
                        onClick={() => window.location.href = "/deep-diagnosis"}
                      >
                        Пройти диагностику
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
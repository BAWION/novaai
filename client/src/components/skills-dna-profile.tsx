import React, { useEffect } from "react";
import SkillsRadarChart from "@/components/skills-radar-chart";
import { SkillsTriangleChart } from "@/components/skills-dna";
import { useSkillsDna } from "@/hooks/use-skills-dna";
import { useUserProfile } from "@/context/user-profile-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Award, Book, Brain, ChartBar, ChevronRight, FileText, LineChart, RefreshCw, Star, Target, Zap } from "lucide-react";
import { useLocation } from "wouter";
import { diagnosisApi } from "@/api/diagnosis-api";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip, Legend } from "recharts";

interface SkillsDnaProfileProps {
  userId?: number;
  showHeader?: boolean;
  className?: string;
  isDeepdDiagnosis?: boolean;
}

/**
 * Компонент профиля Skills DNA пользователя
 * Отображает карту навыков, рекомендации и прогресс обучения
 */
export function SkillsDnaProfile({ 
  userId, 
  showHeader = true,
  className = "",
  isDeepdDiagnosis = false
}: SkillsDnaProfileProps) {
  const { userProfile } = useUserProfile();
  const currentUserId = userId || userProfile?.userId;
  const [_, setLocation] = useLocation();

  // Получаем данные Skills DNA для пользователя с улучшенной обработкой ошибок
  const { 
    skills, 
    summary, 
    isLoading, 
    error, 
    refetch,
    isEmpty,
    isDemoMode,
    userId: resolvedUserId
  } = useSkillsDna(currentUserId);
  
  // Выводим отладочную информацию о полученных данных
  console.log("[SkillsDnaProfile] Получены данные:", { 
    requestedUserId: currentUserId,
    resolvedUserId, 
    skillsCount: Object.keys(skills).length,
    hasError: !!error,
    isDataEmpty: isEmpty,
    isDemoMode
  });
  
  // Если это демо-режим и данных нет, автоматически инициализируем демо-данные
  useEffect(() => {
    if (isDemoMode && isEmpty && !isLoading) {
      console.log("[SkillsDnaProfile] Автоматическая инициализация демо-данных");
      
      (async () => {
        try {
          await diagnosisApi.initializeDemoData();
          console.log("[SkillsDnaProfile] Демо-данные инициализированы, обновляем профиль");
          refetch();
        } catch (initError) {
          console.error("[SkillsDnaProfile] Ошибка при инициализации демо-данных:", initError);
        }
      })();
    }
  }, [isDemoMode, isEmpty, isLoading, refetch]);

  if (!currentUserId) {
    return (
      <div className={className}>
        <Card className="bg-space-800/70 border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              Skills DNA
            </CardTitle>
            <CardDescription className="text-white/70">
              Полный анализ ваших навыков и компетенций в области искусственного интеллекта
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Заголовок */}
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">Необходимо войти в систему</h2>
              <p className="text-white/70 mb-4">
                Зарегистрируйтесь или войдите в систему, чтобы получить доступ к персонализированным данным о ваших навыках
              </p>
            </div>
            
            {/* Центрированная кнопка входа */}
            <div className="flex justify-center">
              <Button 
                variant="default" 
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 px-6 py-2"
                onClick={() => window.location.href = '/auth'}
              >
                Войти в систему
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Если есть ошибка или нет данных (пустые результаты), показываем предложение пройти диагностику
  if (!isLoading && (error || isEmpty)) {
    return (
      <div className={className}>
        <Card className={`bg-space-800/70 border-blue-500/20`}>
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              Skills DNA
            </CardTitle>
            <CardDescription className="text-white/70">
              Для построения профиля Skills DNA необходимо пройти диагностику
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center justify-center text-center py-6">
              <div className="bg-space-800/70 rounded-full p-5 mb-4 relative">
                <Brain className="h-16 w-16 text-purple-400/50" />
                <Badge 
                  variant="outline" 
                  className="absolute top-0 right-0 bg-amber-500/20 border-amber-500/30 text-amber-300 animate-pulse"
                >
                  Требуется диагностика
                </Badge>
              </div>
              
              <h3 className="text-xl font-medium mb-3 text-white">
                Для доступа к Skills DNA необходимо пройти диагностику
              </h3>
              <p className="text-white/70 max-w-md mb-6">
                Пройдите единую диагностику из 15 вопросов, чтобы мы могли проанализировать ваш уровень знаний 
                и навыков в области ИИ, а также предоставить вам персонализированные рекомендации по обучению.
              </p>
              
              <Button 
                variant="default" 
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                onClick={() => setLocation("/deep-diagnosis")}
              >
                Пройти диагностику
              </Button>
            </div>
            
            {/* Дополнительная информация о диагностике */}
            <div className="bg-space-900/30 rounded-md p-4 border border-space-800 text-sm">
              <h4 className="text-white font-medium mb-2 flex items-center">
                <Book className="h-4 w-4 mr-1 text-blue-400" />
                Что такое диагностика Skills DNA?
              </h4>
              <p className="text-white/70 text-sm mb-3">
                Диагностика Skills DNA — это единый тест из 15 вопросов, который помогает определить ваш текущий уровень 
                знаний и навыков в области искусственного интеллекта. На основе результатов диагностики формируется ваш 
                персональный профиль компетенций и предлагаются индивидуальные рекомендации по обучению.
              </p>
              <p className="text-white/70 text-sm">
                После прохождения диагностики вы получите доступ ко всем расширенным возможностям Skills DNA.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={className}>
      {showHeader && (
        <div className="mb-6">
          <div className="flex items-center justify-between">

            {isDemoMode && (
              <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-300">
                Демо-режим
              </Badge>
            )}
          </div>

        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Основной профиль навыков */}
        <div className="lg:col-span-2">
          <div className="bg-space-800/70 border-blue-500/20 rounded-md p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Skills DNA</h3>
              {!isLoading && !error && (
                <Button variant="ghost" size="icon" onClick={refetch} title="Обновить данные" className="h-8 w-8">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Skeleton className="w-64 h-64 rounded-md bg-white/5" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center text-center py-8">
                <AlertTriangle className="h-10 w-10 text-red-400 mb-2" />
                <p className="text-red-300 mb-1">Ошибка загрузки данных</p>
                <p className="text-white/60 text-sm mb-3">
                  {error instanceof Error ? error.message : 'Неизвестная ошибка'}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refetch}
                  className="border-white/20 hover:border-white/40"
                >
                  Попробовать снова
                </Button>
              </div>
            ) : (
              <div className="flex flex-col">
                <SkillsRadarChart 
                  skills={skills}
                  title=""
                  className="mb-6"
                  showControls={false}
                  maxValue={100}
                />
                
                {/* Общая картина - Analysis Summary */}
                <div className="bg-space-900/50 border border-purple-500/20 rounded-lg p-6">
                  <h3 className="text-white font-medium text-lg mb-4">Общая картина</h3>
                  
                  {/* Compact Radar Chart */}
                  <div className="w-full h-64 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart 
                        cx="50%" 
                        cy="50%" 
                        outerRadius="65%" 
                        data={Object.entries(skills).map(([name, value]) => ({
                          category: name.length > 15 ? name.substring(0, 12) + '...' : name,
                          value: value
                        }))}
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                      >
                        <PolarGrid stroke="#ffffff20" />
                        <PolarAngleAxis 
                          dataKey="category" 
                          tick={{ fill: "#ffffffaa", fontSize: 10 }} 
                        />
                        <Radar
                          name="Уровень навыков"
                          dataKey="value"
                          stroke="#B28DFF"
                          fill="#B28DFF"
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "#191c29", 
                            border: "1px solid #414868",
                            borderRadius: "4px",
                            color: "#fff"
                          }} 
                          formatter={(value) => [`${value}%`, "Уровень"]}
                        />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <p className="text-white/80 mb-4 leading-relaxed">
                    Вы находитесь на начальном этапе обучения. Ваш профиль показывает хороший потенциал для роста. 
                    Рекомендуем сначала укрепить фундаментальные основы.
                  </p>

                </div>
              </div>
            )}
          </div>
        </div>

        {/* Сводная информация */}
        <div className="lg:col-span-1">
          <Card className="bg-space-800/70 border-blue-500/20 h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <span>Компетенции</span>
                {!isLoading && !error && (
                  <Button variant="ghost" size="icon" onClick={refetch} title="Обновить данные">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="w-full h-6 bg-white/5" />
                  <Skeleton className="w-full h-6 bg-white/5" />
                  <Skeleton className="w-full h-6 bg-white/5" />
                  <Skeleton className="w-full h-6 bg-white/5" />
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center text-center py-4">
                  <AlertTriangle className="h-10 w-10 text-red-400 mb-2" />
                  <p className="text-red-300 mb-1">Ошибка загрузки данных</p>
                  <p className="text-white/60 text-sm mb-3">
                    {error instanceof Error ? error.message : 'Неизвестная ошибка'}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={refetch}
                    className="border-white/20 hover:border-white/40"
                  >
                    Попробовать снова
                  </Button>
                </div>
              ) : Object.keys(skills).length > 0 ? (
                <div className="space-y-4">
                  {/* Сильные навыки */}
                  <div>
                    <h3 className="text-white font-medium mb-2 flex items-center">
                      <Award className="h-4 w-4 mr-1 text-yellow-400" />
                      Сильные стороны
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(skills)
                        .filter(([_, value]) => value >= 70)
                        .sort(([_, a], [__, b]) => b - a)
                        .slice(0, 3)
                        .map(([skill, value]) => (
                          <Badge 
                            key={skill} 
                            variant="outline"
                            className="bg-yellow-500/10 border-yellow-500/30 text-yellow-300"
                          >
                            {skill} ({value}%)
                          </Badge>
                        ))}
                      {Object.entries(skills).filter(([_, value]) => value >= 70).length === 0 && (
                        <p className="text-white/60 text-sm">
                          Пока нет сильных сторон. Продолжайте обучение!
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Навыки для развития */}
                  <div>
                    <h3 className="text-white font-medium mb-2 flex items-center">
                      <Target className="h-4 w-4 mr-1 text-blue-400" />
                      Области для развития
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(skills)
                        .filter(([_, value]) => value < 50)
                        .sort(([_, a], [__, b]) => a - b)
                        .slice(0, 3)
                        .map(([skill, value]) => (
                          <Badge 
                            key={skill} 
                            variant="outline"
                            className="bg-blue-500/10 border-blue-500/30 text-blue-300"
                          >
                            {skill} ({value}%)
                          </Badge>
                        ))}
                      {Object.entries(skills).filter(([_, value]) => value < 50).length === 0 && (
                        <p className="text-white/60 text-sm">
                          Отлично! У вас нет явных слабых сторон.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Общий прогресс */}
                  <div>
                    <h3 className="text-white font-medium mb-2 flex items-center">
                      <LineChart className="h-4 w-4 mr-1 text-green-400" />
                      Общий прогресс
                    </h3>
                    {summary ? (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-white text-sm">Общий уровень</span>
                          <span className="text-white/80 text-sm font-medium">
                            {summary.overallLevel || 0}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full">
                          <div 
                            className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"
                            style={{ width: `${summary.overallLevel || 0}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <p className="text-white/60 text-sm">
                        Информация о прогрессе недоступна.
                      </p>
                    )}
                  </div>

                  {/* Рекомендации для улучшения */}
                  {summary?.recommendations && (
                    <div>
                      <h3 className="text-white font-medium mb-2 flex items-center">
                        <Zap className="h-4 w-4 mr-1 text-purple-400" />
                        Рекомендации
                      </h3>
                      <ul className="text-white/80 text-sm space-y-1 list-disc list-inside">
                        {summary.recommendations.map((rec: string, index: number) => (
                          <li key={index}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-4">
                  <FileText className="h-10 w-10 text-white/30 mb-2" />
                  <p className="text-white/80 mb-1">Нет данных о навыках</p>
                  <p className="text-white/60 text-sm mb-3">
                    Пройдите диагностику, чтобы получить карту ваших навыков
                  </p>
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => setLocation("/deep-diagnosis")}
                  >
                    Пройти глубокую диагностику
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        {/* Кнопка для рекомендуемых курсов (только после глубокой диагностики) */}
        {isDeepdDiagnosis && !isEmpty && !isLoading && !error && (
          <div className="col-span-1 lg:col-span-3 mt-4">
            <Card className="bg-gradient-to-r from-emerald-900/30 to-green-900/30 border-emerald-500/20">
              <CardContent className="flex flex-col items-center justify-center py-5">
                <div className="flex items-center mb-3">
                  <Target className="h-5 w-5 text-emerald-400 mr-2" />
                  <h3 className="text-lg font-medium text-white">Персональные рекомендации</h3>
                </div>
                <p className="text-white/70 mb-4 text-center max-w-lg">
                  На основе вашего Skills DNA профиля мы подготовили персонализированные рекомендации курсов, 
                  которые помогут вам развить необходимые навыки.
                </p>
                <Button 
                  variant="default" 
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white"
                  onClick={() => setLocation("/courses?filter=recommended")}
                >
                  Посмотреть рекомендуемые курсы
                  <Target className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
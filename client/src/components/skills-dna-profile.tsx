import React from "react";
import SkillsRadarChart from "@/components/skills-radar-chart";
import { useSkillsDna } from "@/hooks/use-skills-dna";
import { useUserProfile } from "@/context/user-profile-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Award, Book, Brain, ChartBar, FileText, LineChart, RefreshCw, Star, Target, Zap } from "lucide-react";
import { useLocation } from "wouter";

interface SkillsDnaProfileProps {
  userId?: number;
  showHeader?: boolean;
  className?: string;
}

/**
 * Компонент профиля Skills DNA пользователя
 * Отображает карту навыков, рекомендации и прогресс обучения
 */
export function SkillsDnaProfile({ 
  userId, 
  showHeader = true,
  className = "" 
}: SkillsDnaProfileProps) {
  const { userProfile } = useUserProfile();
  const currentUserId = userId || userProfile?.userId;
  const [_, setLocation] = useLocation();

  const { 
    skills, 
    summary, 
    isLoading, 
    error, 
    refetch,
    isEmpty
  } = useSkillsDna(currentUserId);

  if (!currentUserId) {
    return (
      <Card className="bg-space-800/70 border-blue-500/20">
        <CardHeader>
          <CardTitle className="text-white">Skills DNA</CardTitle>
          <CardDescription className="text-white/70">
            Необходимо войти в систему для просмотра вашего профиля Skills DNA
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <p className="text-white/60 mb-4">Зарегистрируйтесь или войдите в систему, чтобы получить доступ к персонализированным данным о ваших навыках</p>
          <Button 
            variant="default" 
            onClick={() => window.location.href = '/auth'}
          >
            Войти в систему
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  // Если есть ошибка или нет данных (пустые результаты), показываем предложение пройти диагностику
  if (!isLoading && (error || isEmpty)) {
    return (
      <Card className={`bg-space-800/70 border-blue-500/20 ${className}`}>
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            Skills DNA
          </CardTitle>
          <CardDescription className="text-white/70">
            Для построения профиля Skills DNA необходимо пройти диагностику
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <AlertTriangle className="h-12 w-12 mb-4 text-amber-400 opacity-70" />
          <h3 className="text-lg font-medium mb-2">Данные Skills DNA отсутствуют</h3>
          <p className="text-white/60 mb-6">
            {error ? 
              "Не удалось загрузить ваш профиль Skills DNA. Пожалуйста, пройдите диагностику для построения карты ваших навыков." : 
              "У вас пока нет профиля Skills DNA. Пройдите диагностику, чтобы мы могли составить карту ваших навыков."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="default" 
              onClick={() => setLocation("/quick-diagnosis")}
            >
              Быстрая диагностика
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setLocation("/deep-diagnosis")}
            >
              Глубокая диагностика
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      {showHeader && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#B28DFF] via-[#8BE0F7] to-[#B28DFF] flex items-center">
            <Brain className="h-6 w-6 mr-2 text-current opacity-80" />
            Skills DNA
          </h2>
          <p className="text-white/70 mt-1">
            Ваш персональный профиль навыков и компетенций в области искусственного интеллекта
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Основной профиль навыков */}
        <div className="lg:col-span-2">
          <SkillsRadarChart 
            userId={currentUserId}
            skills={skills}
            isLoading={isLoading}
            error={error instanceof Error ? error : null}
            title="Карта навыков"
            subtitle="Skills DNA"
            onRefresh={refetch}
          />
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
                    onClick={() => setLocation("/quick-diagnosis")}
                  >
                    Пройти диагностику
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, ChevronRight, Award, Target, LineChart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";
import useSkillsDna from "@/hooks/use-skills-dna";
import { Button } from "@/components/ui/button";
import SimpleRadarChart from "@/components/skills-radar-simple";
import TriangleSkillsChart from "@/components/triangle-skills-chart";

interface CompactSkillsDnaProps {
  userId?: number;
  className?: string;
  showHeader?: boolean;
}

/**
 * Компактный компонент Skills DNA для интеграции на страницу Мостика
 */
export function CompactSkillsDna({
  userId,
  className = "",
  showHeader = true
}: CompactSkillsDnaProps) {
  const [_, setLocation] = useLocation();
  
  // Получаем данные Skills DNA для пользователя
  const {
    skills,
    summary,
    isLoading,
    error,
    isEmpty,
    isDemoMode
  } = useSkillsDna(userId);

  // Показать подробную информацию о Skills DNA на текущей странице
  const handleViewFullProfile = (e: React.MouseEvent) => {
    e.preventDefault();
    // Передаем в родительский компонент информацию о том, что нужно показать модальное окно
    // или раскрыть полную информацию внутри текущей страницы
    if (typeof window !== 'undefined') {
      // Диспатчим пользовательское событие, которое будет обрабатываться в родительском компоненте
      const event = new CustomEvent('showSkillsDnaDetails', { detail: { userId } });
      window.dispatchEvent(event);
    }
  };

  // Переход к диагностике
  const handleStartDiagnostics = () => {
    setLocation("/quick-diagnosis");
  };

  // Рендеринг состояния загрузки
  if (isLoading) {
    return (
      <Card className={`bg-space-800/70 border-blue-500/20 ${className}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            Skills DNA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="w-full h-4 bg-white/5" />
            <Skeleton className="w-full h-4 bg-white/5" />
            <Skeleton className="w-full h-4 bg-white/5" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Рендеринг ошибки или отсутствия данных
  if (error || isEmpty) {
    return (
      <Card className={`bg-space-800/70 border-blue-500/20 ${className}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            Skills DNA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Пустая радарная диаграмма с разметкой */}
          <div className="pt-2 relative">
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="rounded-full bg-space-900/80 p-4 backdrop-blur-sm border border-purple-500/30">
                <Badge 
                  variant="outline" 
                  className="bg-purple-500/20 border-purple-500/30 text-purple-300 text-xs animate-pulse"
                >
                  Требуется диагностика
                </Badge>
              </div>
            </div>
            <div className="opacity-20">
              <TriangleSkillsChart 
                skills={{
                  skill1: { name: "Понимание основ ИИ", value: 0 },
                  skill2: { name: "Этические аспекты использования ИИ", value: 0 },
                  skill3: { name: "Критическое мышление в контексте ИИ", value: 0 }
                }}
                height={300}
                width={300}
                className="mx-auto"
              />
            </div>
          </div>
          
          {/* Информационный блок */}
          <div className="bg-space-900/30 rounded-md p-3 border border-space-800">
            <h3 className="text-white font-medium mb-2 text-center">Карта навыков</h3>
            <p className="text-white/80 text-sm text-center mb-4">
              {error 
                ? "Не удалось загрузить ваш профиль Skills DNA. Пожалуйста, пройдите диагностику, чтобы мы могли создать для вас персональную карту навыков." 
                : "Пройдите диагностику, чтобы мы могли проанализировать ваши знания и навыки в области ИИ и составить для вас персональную карту компетенций."}
            </p>
            
            <Button 
              variant="default" 
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
              onClick={handleStartDiagnostics}
            >
              Пройти диагностику
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Подготовка данных для отображения
  const strongSkills = Object.entries(skills)
    .filter(([_, value]) => value >= 70)
    .sort(([_, a], [__, b]) => b - a)
    .slice(0, 2);

  const weakSkills = Object.entries(skills)
    .filter(([_, value]) => value < 50)
    .sort(([_, a], [__, b]) => a - b)
    .slice(0, 2);

  const overallLevel = summary?.overallLevel || 0;

  return (
    <Card className={`bg-space-800/70 border-blue-500/20 h-full ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-white flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            Skills DNA
          </CardTitle>
          {isDemoMode && (
            <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-300 text-xs">
              Demo
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Треугольная диаграмма навыков */}
        <div className="pt-2">
          {Object.keys(skills).length >= 3 ? (
            <TriangleSkillsChart 
              skills={{
                skill1: { 
                  name: "Понимание основ ИИ", 
                  value: skills["Понимание основ ИИ"] || skills["Основы ИИ"] || 
                         skills["Машинное обучение"] || skills["Программирование"] || 40 
                },
                skill2: { 
                  name: "Этические аспекты использования ИИ", 
                  value: skills["Этические аспекты использования ИИ"] || skills["Этика и право в ИИ"] || 
                         skills["Этика ИИ"] || skills["Применение в бизнесе"] || 25 
                },
                skill3: { 
                  name: "Критическое мышление в контексте ИИ", 
                  value: skills["Критическое мышление в контексте ИИ"] || skills["Аналитическое мышление"] || 
                         skills["Решение проблем"] || skills["Анализ данных"] || 65 
                }
              }}
              height={300}
              width={300}
              className="mx-auto"
            />
          ) : (
            <SimpleRadarChart 
              skills={skills} 
              height={300}
              className="mx-auto"
            />
          )}
        </div>
        
        {/* Общая картина */}
        <div className="bg-space-900/30 rounded-md p-3 border border-space-800">
          <h3 className="text-white font-medium mb-2">Общая картина</h3>
          <p className="text-white/80 text-sm">
            {summary?.description || 
              "Вы находитесь на начальном этапе обучения. Ваш профиль показывает хороший потенциал для роста. Рекомендуем сначала укрепить фундаментальные основы."}
          </p>
          
          <button 
            onClick={handleViewFullProfile}
            className="mt-3 text-white bg-space-800 hover:bg-space-700 transition w-full py-3 rounded-md text-sm font-medium flex items-center justify-center"
          >
            <span>Подробный анализ Skills DNA</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </button>
        </div>

        {/* Сильные навыки и области для развития (на мобильных устройствах) */}
        <div className="md:hidden space-y-3">
          {/* Сильные навыки */}
          <div>
            <h3 className="text-white text-sm font-medium mb-1.5 flex items-center">
              <Award className="h-3.5 w-3.5 mr-1 text-yellow-400" />
              Сильные стороны
            </h3>
            <div className="flex flex-wrap gap-2">
              {strongSkills.length > 0 ? (
                strongSkills.map(([skill, value]) => (
                  <Badge 
                    key={skill} 
                    variant="outline"
                    className="bg-yellow-500/10 border-yellow-500/30 text-yellow-300 text-xs"
                  >
                    {skill} ({value}%)
                  </Badge>
                ))
              ) : (
                <p className="text-white/60 text-xs">
                  Пока нет сильных сторон. Продолжайте обучение!
                </p>
              )}
            </div>
          </div>

          {/* Области для развития */}
          <div>
            <h3 className="text-white text-sm font-medium mb-1.5 flex items-center">
              <Target className="h-3.5 w-3.5 mr-1 text-blue-400" />
              Области для развития
            </h3>
            <div className="flex flex-wrap gap-2">
              {weakSkills.length > 0 ? (
                weakSkills.map(([skill, value]) => (
                  <Badge 
                    key={skill} 
                    variant="outline"
                    className="bg-blue-500/10 border-blue-500/30 text-blue-300 text-xs"
                  >
                    {skill} ({value}%)
                  </Badge>
                ))
              ) : (
                <p className="text-white/60 text-xs">
                  Отлично! У вас нет явных слабых сторон.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Общий прогресс */}
        <div className="md:hidden">
          <h3 className="text-white text-sm font-medium mb-1.5 flex items-center">
            <LineChart className="h-3.5 w-3.5 mr-1 text-green-400" />
            Общий прогресс
          </h3>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-xs">Общий уровень</span>
              <span className="text-white/80 text-xs font-medium">
                {overallLevel}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full"
                style={{ width: `${overallLevel}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
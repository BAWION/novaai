import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, ChevronRight, Award, Target, LineChart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocation } from "wouter";
import useSkillsDna from "@/hooks/use-skills-dna";
import { Button } from "@/components/ui/button";

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

  // Переход к полной странице Skills DNA
  const handleViewFullProfile = () => {
    setLocation("/skills-dna");
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
        <CardContent className="text-center">
          <p className="text-white/70 mb-3 text-sm">
            {error 
              ? "Не удалось загрузить ваш профиль Skills DNA" 
              : "Пройдите диагностику, чтобы мы построили карту ваших навыков"}
          </p>
          <Button 
            variant="default" 
            size="sm"
            onClick={handleStartDiagnostics}
          >
            Пройти диагностику
          </Button>
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
      <CardContent className="space-y-3">
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

        {/* Общий прогресс */}
        <div>
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

        {/* Кнопка для перехода к полному профилю */}
        <button 
          onClick={handleViewFullProfile}
          className="w-full mt-2 text-white/70 hover:text-white text-xs flex items-center justify-center py-1.5 rounded-md hover:bg-white/5 transition"
        >
          <span>Подробный профиль</span>
          <ChevronRight className="h-3.5 w-3.5 ml-1" />
        </button>
      </CardContent>
    </Card>
  );
}
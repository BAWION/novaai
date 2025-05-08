import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Brain, ChevronRight, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useSkillsDna from "@/hooks/use-skills-dna";
import { SkillsTriangleChart } from "./triangle-chart";
import { SkillsDnaModal } from "./modal-dialog";
import SkillsRadarChart from "@/components/skills-radar-chart";
import { useAuth } from "@/context/auth-context";

interface CompactSkillsDnaCardProps {
  userId?: number;
  className?: string;
  showHeader?: boolean;
  forceLocked?: boolean;
}

/**
 * Компактная карточка для отображения Skills DNA на странице мостика
 */
export function CompactSkillsDnaCard({
  userId,
  className = "",
  showHeader = true,
  forceLocked = false
}: CompactSkillsDnaCardProps) {
  const [, setLocation] = useLocation();
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();
  
  // Получаем данные Skills DNA
  const {
    skills,
    summary,
    isLoading,
    error,
    isEmpty,
    isDemoMode
  } = useSkillsDna(userId);
  
  // Обработчик для открытия модального окна
  const handleViewFullProfile = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowModal(true);
    
    // Также отправляем событие для родительских компонентов
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('showSkillsDnaDetails', { detail: { userId } });
      window.dispatchEvent(event);
    }
  };
  
  // Переход к диагностике
  const handleStartDiagnostics = () => {
    setLocation("/deep-diagnosis");
  };
  
  // Состояние загрузки
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
          <div className="space-y-4">
            <Skeleton className="w-full h-[200px] bg-white/5" />
            <Skeleton className="w-full h-4 bg-white/5" />
            <Skeleton className="w-full h-4 bg-white/5" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Если пользователь авторизован, но нужно показать заблюренное состояние
  // Всегда показываем заблюренное состояние для авторизованных пользователей без данных
  const shouldShowLocked = forceLocked || (user && (error || isEmpty));
  
  // Если нужно показать заблюренное состояние
  if (shouldShowLocked || error || isEmpty) {
    return (
      <Card className={`bg-space-800/70 border-blue-500/20 h-full ${className}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-[#6E3AFF]" />
              <div className="text-2xl font-semibold text-white">Skills DNA</div>
            </div>
            <Badge 
              variant="outline" 
              className="bg-amber-500/20 border-amber-500/30 text-amber-300 text-sm px-3 py-1"
            >
              Доступно после диагностики
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="relative p-0">
          <div className="flex flex-col items-center justify-center text-center pt-10 pb-14">
            <Lock className="h-16 w-16 text-[#6E3AFF] mb-6" />
            
            <h3 className="text-white text-xl font-medium mb-2">
              Доступно после диагностики
            </h3>
            <p className="text-white/70 text-base mb-8 max-w-sm text-center">
              Пройдите единую диагностику из 15 вопросов для получения персональных рекомендаций
            </p>
            
            <Button 
              variant="default" 
              size="lg"
              className="bg-gradient-to-r from-[#6E3AFF] to-indigo-500 hover:from-[#6E3AFF]/90 hover:to-indigo-600 px-8 py-6 text-base h-auto"
              onClick={handleStartDiagnostics}
            >
              Пройти диагностику
            </Button>
          </div>
          
          {/* Размытое фоновое содержимое для эффекта blur */}
          <div className="filter blur-md opacity-30">
            <div className="h-64">
              {/* Здесь вставляем пустую радарную диаграмму для фона */}
              <div className="w-full h-full flex items-center justify-center">
                <svg viewBox="0 0 200 200" className="w-3/4 h-3/4">
                  <g transform="translate(100,100)">
                    <circle r="80" className="fill-none stroke-[#6E3AFF]/20 stroke-[0.5]" />
                    <circle r="60" className="fill-none stroke-[#6E3AFF]/20 stroke-[0.5]" />
                    <circle r="40" className="fill-none stroke-[#6E3AFF]/20 stroke-[0.5]" />
                    <circle r="20" className="fill-none stroke-[#6E3AFF]/20 stroke-[0.5]" />
                    <path d="M0,-80 L69.28,-40 L69.28,40 L0,80 L-69.28,40 L-69.28,-40 Z" className="fill-none stroke-[#6E3AFF]/20 stroke-[0.5]" />
                    <polygon points="0,-30 26,-15 26,15 0,30 -26,15 -26,-15" className="fill-[#6E3AFF]/20" />
                  </g>
                </svg>
              </div>
            </div>
            
            <div className="bg-space-900/30 rounded-md p-3 mt-4">
              <h3 className="text-white font-medium mb-2">Общая картина</h3>
              <div className="h-4 bg-white/10 rounded mb-2"></div>
              <div className="h-4 bg-white/10 rounded mb-2"></div>
              <div className="h-4 bg-white/10 rounded w-3/4"></div>
              
              <div className="mt-3 h-10 bg-space-800/70 rounded-md"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Извлекаем три ключевых навыка или используем значения по умолчанию
  const skillEntries = Object.entries(skills);
  // Возьмем первые три навыка или дополним пустыми, если навыков меньше 3
  let mainSkills: [string, number][] = skillEntries
    .slice(0, 3)
    .map(([name, value]) => [name, value as number]);
    
  if (mainSkills.length < 3) {
    const defaults: [string, number][] = [
      ['Понимание основ ИИ', 40],
      ['Этические аспекты использования ИИ', 25],
      ['Критическое мышление в контексте ИИ', 65]
    ];
    
    // Добавляем недостающие навыки
    for (let i = mainSkills.length; i < 3; i++) {
      mainSkills.push(defaults[i]);
    }
  }
  
  // Формируем объект с тремя основными навыками
  const triangleSkills = {
    top: { name: mainSkills[0][0], value: mainSkills[0][1] as number },
    bottomLeft: { name: mainSkills[1][0], value: mainSkills[1][1] as number },
    bottomRight: { name: mainSkills[2][0], value: mainSkills[2][1] as number }
  };
  
  // Выделяем сильные и слабые навыки
  const strongSkills = skillEntries
    .filter(([_, value]) => value >= 70)
    .sort(([_, a], [__, b]) => b - a)
    .slice(0, 2);
  
  const weakSkills = skillEntries
    .filter(([_, value]) => value < 50)
    .sort(([_, a], [__, b]) => a - b)
    .slice(0, 2);
  
  const overallLevel = summary?.overallLevel || 0;
  
  return (
    <>
      <Card className={`bg-space-800/70 border-blue-500/20 h-full ${className}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-[#6E3AFF]" />
              <div className="text-2xl font-semibold text-white">Skills DNA</div>
            </div>
            {isDemoMode && (
              <Badge variant="outline" className="bg-amber-500/20 border-amber-500/30 text-amber-300 text-sm px-3 py-1">
                Demo
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Радарная диаграмма навыков */}
          <div className="pt-2">
            <div className="h-64">
              <SkillsRadarChart 
                skills={skills}
                title=""
                showControls={false}
                className="bg-transparent border-0"
              />
              <div className="text-center mt-2 mb-3">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 bg-[#6E3AFF]/60 rounded-full"></div>
                  <span className="text-white/70 text-sm">Уровень навыков</span>
                </div>
              </div>
            </div>
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
          
          {/* Модальное окно с полным профилем */}
          <SkillsDnaModal 
            open={showModal} 
            onOpenChange={setShowModal}
            userId={userId}
          />
        </CardContent>
      </Card>
    </>
  );
}
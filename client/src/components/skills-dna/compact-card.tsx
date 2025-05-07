import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Brain, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useSkillsDna from "@/hooks/use-skills-dna";
import { SkillsTriangleChart } from "./triangle-chart";
import { SkillsDnaModal } from "./modal-dialog";

interface CompactSkillsDnaCardProps {
  userId?: number;
  className?: string;
  showHeader?: boolean;
}

/**
 * Компактная карточка для отображения Skills DNA на странице мостика
 */
export function CompactSkillsDnaCard({
  userId,
  className = "",
  showHeader = true
}: CompactSkillsDnaCardProps) {
  const [, setLocation] = useLocation();
  const [showModal, setShowModal] = useState(false);
  
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
    setLocation("/quick-diagnosis");
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
  
  // Если нет данных или есть ошибка
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
          {/* Пустая треугольная диаграмма с разметкой */}
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
              <SkillsTriangleChart 
                skills={{
                  top: { name: "Понимание основ ИИ", value: 0 },
                  bottomLeft: { name: "Этические аспекты использования ИИ", value: 0 },
                  bottomRight: { name: "Критическое мышление в контексте ИИ", value: 0 }
                }}
                height={280}
                width={280}
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
            <SkillsTriangleChart 
              skills={triangleSkills}
              height={280}
              width={280}
              className="mx-auto"
            />
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
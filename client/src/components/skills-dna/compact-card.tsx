import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Brain, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useSkillsDna from "@/hooks/use-skills-dna";
import SkillsRadarChart from "@/components/skills-radar-chart";
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
    isDemoMode,
    userId: resolvedUserId,
    refetch
  } = useSkillsDna(userId);
  
  // Проверяем наличие данных в sessionStorage
  const [hasSavedData, setHasSavedData] = useState(false);
  const [storedSkills, setStoredSkills] = useState<Record<string, number>>({});
  
  useEffect(() => {
    try {
      const savedData = sessionStorage.getItem('skillsDnaResults');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        const hasSkills = Object.keys(parsedData.skills || {}).length > 0;
        setHasSavedData(hasSkills);
        
        // Сохраняем навыки из сессии для последующего использования
        if (hasSkills) {
          setStoredSkills(parsedData.skills);
        }
        
        console.log("[CompactSkillsDnaCard] Найдены сохраненные данные:", {
          skillsCount: Object.keys(parsedData.skills || {}).length,
          recommendationsCount: parsedData.recommendations?.length || 0,
          isEmpty,
          isLoading
        });
      }
    } catch (error) {
      console.error("[CompactSkillsDnaCard] Ошибка при чтении данных из sessionStorage:", error);
    }
  }, [isEmpty, isLoading]);
  
  // Проверка и загрузка сохраненных данных из sessionStorage при необходимости
  useEffect(() => {
    if (isEmpty && !isLoading && hasSavedData) {
      console.log("[CompactSkillsDnaCard] Обнаружены сохраненные данные, перезапускаем загрузку");
      refetch();
    }
  }, [isEmpty, isLoading, hasSavedData, refetch]);

  // Обработчик для открытия модального окна
  const handleViewFullProfile = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Если есть сохраненные данные в sessionStorage, но API не вернуло данные,
    // пробуем принудительно перезагрузить данные
    if (isEmpty && hasSavedData) {
      console.log("[CompactSkillsDnaCard] Принудительная перезагрузка данных перед показом деталей");
      refetch();
    }
    
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
  
  // Если нет данных или есть ошибка
  if (error || (isEmpty && !hasSavedData)) {
    // Проверяем наличие сохраненных данных в sessionStorage
    // Пытаемся найти и применить их, если API не вернул данных
    try {
      const savedData = sessionStorage.getItem('skillsDnaResults');
      if (savedData && isEmpty) {
        const parsedData = JSON.parse(savedData);
        // Если есть сохраненные данные с навыками, используем их
        if (parsedData.skills && Object.keys(parsedData.skills).length > 0) {
          console.log("[CompactSkillsDnaCard] Применяем сохраненные данные:", {
            skillsCount: Object.keys(parsedData.skills).length,
            source: "sessionStorage"
          });

          // Данные найдены, обновляем пользовательский интерфейс
          // Продолжим выполнение, не возвращая раннее состояние
          // Код ниже проанализирует эти данные и выведет нужный UI
          // Логика обработки навыков поддерживает как API данные, так и сохраненные
          return (
            <Card className={`bg-space-800/70 border-blue-500/20 ${className}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center">
                    <Brain className="h-5 w-5 mr-2" />
                    Skills DNA
                  </div>
                  <Badge 
                    variant="outline" 
                    className="bg-amber-500/20 border-amber-500/30 text-amber-300 text-xs"
                  >
                    Локальные данные
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="bg-space-800/70 rounded-full p-4 mb-4 relative">
                    <Brain className="h-12 w-12 text-purple-400/70" />
                  </div>
                  
                  <h3 className="text-white font-medium mb-2">
                    Найдены данные диагностики
                  </h3>
                  <p className="text-white/70 text-sm mb-5">
                    Обнаружены результаты предыдущей диагностики, загружаем профиль...
                  </p>
                  
                  <Button 
                    variant="default" 
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                    onClick={handleViewFullProfile}
                  >
                    Показать профиль
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        }
      }
    } catch (error) {
      console.error("[CompactSkillsDnaCard] Ошибка при чтении данных из sessionStorage:", error);
    }
    
    // Если нет сохраненных данных или произошла ошибка при их чтении, показываем стандартный UI
    return (
      <Card className={`bg-space-800/70 border-blue-500/20 ${className}`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              Skills DNA
            </div>
            <Badge 
              variant="outline" 
              className="bg-amber-500/20 border-amber-500/30 text-amber-300 text-xs animate-pulse"
            >
              Требуется диагностика
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="bg-space-800/70 rounded-full p-4 mb-4 relative">
              <Brain className="h-12 w-12 text-purple-400/40" />
            </div>
            
            <h3 className="text-white font-medium mb-2">
              Необходима диагностика
            </h3>
            <p className="text-white/70 text-sm mb-5">
              Пройдите единую диагностику из 15 вопросов для формирования персонального профиля Skills DNA
            </p>
            
            <Button 
              variant="default" 
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
              onClick={handleStartDiagnostics}
            >
              Пройти диагностику
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Определяем финальный набор навыков для отображения
  // Если есть навыки из API, используем их, иначе - данные из sessionStorage
  const finalSkills = Object.keys(skills).length > 0 ? skills : 
    (hasSavedData && storedSkills && Object.keys(storedSkills).length > 0) ? storedSkills : skills;
  
  // Извлекаем три ключевых навыка или используем значения по умолчанию
  const skillEntries = Object.entries(finalSkills);
  console.log("[CompactSkillsDnaCard] Используемые навыки:", {
    count: skillEntries.length,
    usingFromAPI: Object.keys(skills).length > 0,
    usingFromStorage: Object.keys(skills).length === 0 && hasSavedData
  });
  
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
    .filter(([_, value]) => (value as number) >= 70)
    .sort(([_, a], [__, b]) => (b as number) - (a as number))
    .slice(0, 2);
  
  const weakSkills = skillEntries
    .filter(([_, value]) => (value as number) < 50)
    .sort(([_, a], [__, b]) => (a as number) - (b as number))
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
          {/* Радарная диаграмма навыков */}
          <div className="pt-2">
            <SkillsRadarChart 
              skills={finalSkills}
              title="Skills DNA"
              showControls={false}
              maxValue={100}
              className="w-full"
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
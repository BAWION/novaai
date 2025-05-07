import React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SkillsRadarChart from "@/components/skills-radar-chart";
import { useUserProfile } from "@/context/user-profile-context";
import { useAuth } from "@/context/auth-context";
import { motion } from "framer-motion";
import { Compass, Map, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

/**
 * Компонент RoadmapWidget 
 * Упрощенный виджет дорожной карты обучения для страницы Капитанского Мостика
 */
const RoadmapWidget: React.FC = () => {
  // Типичные статусы для модулей: "completed", "in-progress", "available", "locked"
  
  // Получение текущего активного модуля
  const getActiveModule = () => {
    return {
      title: "Машинное обучение: основы",
      progress: 42,
      status: "in-progress"
    };
  };
  
  // Получение следующего доступного модуля
  const getNextModule = () => {
    return {
      title: "Нейронные сети",
      status: "available"
    };
  };
  
  // Определение цвета прогресс-бара в зависимости от статуса
  const getProgressBarColor = (status: string) => {
    switch (status) {
      case "completed":
        return "from-green-500 to-emerald-500";
      case "in-progress": 
        return "from-[#6E3AFF] to-[#2EBAE1]";
      case "available":
        return "from-amber-500 to-orange-500";
      default:
        return "from-gray-600 to-gray-500";
    }
  };
  
  const activeModule = getActiveModule();
  const nextModule = getNextModule();
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg">Ваш путь обучения</CardTitle>
        <Button variant="link" size="sm" className="gap-1">
          Полная карта
          <Map className="h-4 w-4" />
        </Button>
      </div>
      
      <Separator className="bg-white/10" />
      
      <div className="space-y-4">
        {/* Текущий модуль */}
        <div className="bg-space-800/60 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-[#6E3AFF]/20 flex items-center justify-center text-[#6E3AFF]">
              <Compass className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <div className="font-medium">{activeModule.title}</div>
              <div className="text-white/60 text-xs">В процессе</div>
            </div>
          </div>
          
          <div className="mt-3">
            <div className="text-white/80 text-xs mb-1">Прогресс:</div>
            <div className="w-full h-2 bg-white/10 rounded-full">
              <div 
                className={`h-full rounded-full bg-gradient-to-r ${getProgressBarColor(activeModule.status)}`} 
                style={{ width: `${activeModule.progress}%` }}
              ></div>
            </div>
            <div className="text-right text-white/60 text-xs mt-1">
              {activeModule.progress}%
            </div>
          </div>
          
          <Button className="w-full mt-3" size="sm">
            Продолжить обучение
          </Button>
        </div>
        
        {/* Следующий модуль */}
        <div className="bg-space-800/30 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
              <Map className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <div className="font-medium">{nextModule.title}</div>
              <div className="text-white/60 text-xs">Доступен</div>
            </div>
          </div>
          
          <Button variant="outline" className="w-full mt-3" size="sm">
            Начать модуль
          </Button>
        </div>
      </div>
    </div>
  );
};

/**
 * Компонент NextStepsGrid
 * Отображает следующие шаги и рекомендуемые действия
 */
const NextStepsGrid: React.FC = () => {
  // Получаем следующие шаги для пользователя
  const getNextSteps = () => {
    return [
      {
        id: 1,
        title: "Завершить текущий урок",
        description: "Машинное обучение: введение в алгоритмы",
        priority: "high",
        type: "lesson"
      },
      {
        id: 2,
        title: "Диагностика навыков",
        description: "Пройдите расширенную диагностику для более точной траектории",
        priority: "medium",
        type: "diagnostic"
      },
      {
        id: 3,
        title: "Практическое задание",
        description: "Классификация изображений на Python",
        priority: "low",
        type: "practice"
      }
    ];
  };
  
  // Получаем приоритетный цвет
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400";
      case "medium":
        return "bg-amber-500/20 text-amber-400";
      case "low":
        return "bg-blue-500/20 text-blue-400";
      default:
        return "bg-white/20 text-white/80";
    }
  };
  
  // Получаем иконку типа задачи
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "lesson":
        return "fa-book-open";
      case "diagnostic":
        return "fa-brain";
      case "practice":
        return "fa-code";
      default:
        return "fa-chevron-right";
    }
  };
  
  const nextSteps = getNextSteps();
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg">Следующие шаги</CardTitle>
        <Button variant="link" size="sm" className="gap-1">
          Все задачи
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      
      <Separator className="bg-white/10" />
      
      <div className="space-y-3">
        {nextSteps.map((step) => (
          <div key={step.id} className="bg-space-800/60 p-4 rounded-lg hover:bg-space-800/80 transition cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <i className={`fas ${getTypeIcon(step.type)}`}></i>
                </div>
                <div className="ml-3">
                  <div className="font-medium">{step.title}</div>
                  <div className="text-white/60 text-xs">{step.description}</div>
                </div>
              </div>
              <Badge className={`ml-2 ${getPriorityColor(step.priority)}`}>
                {step.priority === "high" ? "Важно" : step.priority === "medium" ? "Средне" : "Опционально"}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Основной компонент страницы "Captain's Bridge" (Капитанский Мостик)
 */
export default function BridgePage() {
  const { userProfile } = useUserProfile();
  const { user } = useAuth();
  
  return (
    <DashboardLayout
      title="Капитанский Мостик"
      subtitle="Центр управления вашим обучением в NovaAI University"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        {/* Skills DNA Radar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Skills DNA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <SkillsRadarChart 
                userId={user?.id} 
                title="Ваш Skills DNA"
                showControls={true}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Roadmap Widget */}
        <Card>
          <CardHeader>
            <CardTitle>Roadmap</CardTitle>
          </CardHeader>
          <CardContent>
            <RoadmapWidget />
          </CardContent>
        </Card>
        
        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Что дальше?</CardTitle>
          </CardHeader>
          <CardContent>
            <NextStepsGrid />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
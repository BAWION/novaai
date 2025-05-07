import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SkillsTriangleChart } from "@/components/skills-dna";
import SkillsRadarChart from "@/components/skills-radar-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Glassmorphism } from "@/components/ui/glassmorphism";

interface SkillsDnaWidgetProps {
  skills: Record<string, number>;
  className?: string;
  showHeader?: boolean;
  headerText?: string;
  showBoth?: boolean;
}

/**
 * Виджет Skills DNA с возможностью переключения между треугольником и радаром
 */
export default function SkillsDnaWidget({
  skills,
  className = "",
  showHeader = true,
  headerText = "Ваш Skills DNA профиль",
  showBoth = false
}: SkillsDnaWidgetProps) {
  
  // Получение основных навыков для треугольника
  const triangleSkills = {
    top: { 
      name: "Понимание основ ИИ", 
      value: skills["Понимание основ ИИ"] || skills["Основы ИИ"] || 
              skills["Машинное обучение"] || skills["Программирование"] || 40 
    },
    bottomLeft: { 
      name: "Этические аспекты использования ИИ", 
      value: skills["Этические аспекты использования ИИ"] || skills["Этика и право в ИИ"] || 
              skills["Этика ИИ"] || skills["Применение в бизнесе"] || 25 
    },
    bottomRight: { 
      name: "Критическое мышление в контексте ИИ", 
      value: skills["Критическое мышление в контексте ИИ"] || skills["Аналитическое мышление"] || 
              skills["Решение проблем"] || skills["Анализ данных"] || 65 
    }
  };

  // Если нужно отображать оба визуализации одновременно
  if (showBoth) {
    return (
      <Glassmorphism className={`p-4 rounded-lg ${className}`} borderGradient>
        {showHeader && (
          <div className="mb-4">
            <h3 className="text-xl font-medium text-white">{headerText}</h3>
            <p className="text-white/70 text-sm">Ваш персональный профиль навыков</p>
          </div>
        )}
        
        <div className="space-y-6">
          {/* Треугольник навыков */}
          <div className="flex flex-col items-center justify-center">
            <SkillsTriangleChart 
              skills={triangleSkills}
              height={220}
              width={220}
              className="mx-auto"
            />
          </div>
          
          {/* Радар навыков */}
          <div>
            <SkillsRadarChart 
              skills={skills}
              title="Детализация навыков"
              showControls={false}
              maxValue={100}
              className="w-full"
            />
          </div>
        </div>
      </Glassmorphism>
    );
  }

  // Версия с табами для переключения между визуализациями
  return (
    <Glassmorphism className={`p-4 rounded-lg ${className}`} borderGradient>
      {showHeader && (
        <div className="mb-4">
          <h3 className="text-xl font-medium text-white">{headerText}</h3>
          <p className="text-white/70 text-sm">Ваш персональный профиль навыков</p>
        </div>
      )}
      
      <Tabs defaultValue="triangle" className="w-full">
        <TabsList className="mb-4 bg-space-800/50 mx-auto">
          <TabsTrigger value="triangle">Основные навыки</TabsTrigger>
          <TabsTrigger value="radar">Детализация</TabsTrigger>
        </TabsList>
        
        <TabsContent value="triangle">
          <div className="flex flex-col items-center justify-center py-2">
            <SkillsTriangleChart 
              skills={triangleSkills}
              height={250}
              width={250}
              className="mx-auto"
            />
          </div>
        </TabsContent>
        
        <TabsContent value="radar">
          <Card className="border-none bg-transparent">
            <CardContent className="p-0">
              <SkillsRadarChart 
                skills={skills}
                showHeader={false}
                showControls={false}
                maxValue={100}
                className="w-full"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Glassmorphism>
  );
}
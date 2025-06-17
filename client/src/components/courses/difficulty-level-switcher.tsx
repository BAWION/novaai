import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Users, GraduationCap } from "lucide-react";

interface DifficultyLevelSwitcherProps {
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  onLevelChange: (level: 'beginner' | 'intermediate' | 'advanced') => void;
  lessonContent: string;
  className?: string;
}

export function DifficultyLevelSwitcher({ 
  currentLevel, 
  onLevelChange, 
  lessonContent,
  className = "" 
}: DifficultyLevelSwitcherProps) {
  const [isLoading, setIsLoading] = useState(false);

  const levels = [
    {
      id: 'beginner' as const,
      name: 'Новичок',
      icon: <Users className="h-4 w-4" />,
      description: 'Простые объяснения с основами',
      color: 'bg-green-500/10 text-green-600 border-green-500/20'
    },
    {
      id: 'intermediate' as const,
      name: 'Средний',
      icon: <Brain className="h-4 w-4" />,
      description: 'Детальные объяснения с примерами',
      color: 'bg-blue-500/10 text-blue-600 border-blue-500/20'
    },
    {
      id: 'advanced' as const,
      name: 'Продвинутый',
      icon: <GraduationCap className="h-4 w-4" />,
      description: 'Глубокий анализ и сложные концепции',
      color: 'bg-purple-500/10 text-purple-600 border-purple-500/20'
    }
  ];

  const handleLevelChange = async (newLevel: 'beginner' | 'intermediate' | 'advanced') => {
    if (newLevel === currentLevel) return;

    setIsLoading(true);
    try {
      // Здесь можно добавить API вызов для получения адаптированного контента
      await new Promise(resolve => setTimeout(resolve, 500)); // Имитация API вызова
      onLevelChange(newLevel);
    } catch (error) {
      console.error('Error changing difficulty level:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Уровень объяснения</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {levels.map((level) => (
          <Button
            key={level.id}
            variant={currentLevel === level.id ? "default" : "outline"}
            className={`w-full justify-start text-left h-auto p-3 whitespace-normal ${
              currentLevel === level.id 
                ? level.color
                : "hover:bg-muted/50"
            }`}
            onClick={() => handleLevelChange(level.id)}
            disabled={isLoading}
          >
            <div className="flex items-start gap-3 w-full">
              <div className="flex-shrink-0 mt-0.5">
                {level.icon}
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm leading-tight">{level.name}</span>
                  {currentLevel === level.id && (
                    <Badge variant="secondary" className="text-xs flex-shrink-0">
                      Активный
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed break-words">
                  {level.description}
                </p>
              </div>
            </div>
          </Button>
        ))}

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            Выберите уровень сложности объяснений, который подходит вам лучше всего. 
            AI-ассистент адаптирует свои ответы под выбранный уровень.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
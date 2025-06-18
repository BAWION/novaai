import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Lightbulb, Zap } from "lucide-react";

interface DifficultyLevelSwitcherProps {
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  onLevelChange: (level: 'beginner' | 'intermediate' | 'advanced') => void;
  className?: string;
}

export function DifficultyLevelSwitcher({ 
  currentLevel, 
  onLevelChange, 
  className = "" 
}: DifficultyLevelSwitcherProps) {
  const levels = [
    {
      key: 'beginner' as const,
      label: 'Новичок',
      icon: Lightbulb,
      description: 'Простое объяснение',
      color: 'bg-green-500/20 text-green-400 border-green-500/30'
    },
    {
      key: 'intermediate' as const,
      label: 'Средний',
      icon: Brain,
      description: 'Стандартный уровень',
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    },
    {
      key: 'advanced' as const,
      label: 'Эксперт',
      icon: Zap,
      description: 'Глубокий разбор',
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    }
  ];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-white/60 mr-2">Уровень сложности:</span>
      {levels.map((level) => {
        const Icon = level.icon;
        const isActive = currentLevel === level.key;
        
        return (
          <Button
            key={level.key}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => onLevelChange(level.key)}
            className={`
              relative h-8 px-3 transition-all duration-200 
              ${isActive ? 
                level.color + ' border' : 
                'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white/80 border-white/20'
              }
            `}
          >
            <Icon className="w-3 h-3 mr-1.5" />
            <span className="text-xs font-medium">{level.label}</span>
            {isActive && (
              <Badge 
                variant="secondary" 
                className="absolute -top-1 -right-1 h-4 w-4 p-0 text-[10px] bg-white/20 text-white"
              >
                ✓
              </Badge>
            )}
          </Button>
        );
      })}
    </div>
  );
}
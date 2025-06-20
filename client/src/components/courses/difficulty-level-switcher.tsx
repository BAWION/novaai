import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, BookOpen, Zap } from "lucide-react";

interface DifficultyLevelSwitcherProps {
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  onLevelChange: (level: 'beginner' | 'intermediate' | 'advanced') => void;
  content: {
    beginner: string;
    intermediate: string;
    advanced: string;
  };
}

export default function DifficultyLevelSwitcher({ 
  currentLevel, 
  onLevelChange, 
  content 
}: DifficultyLevelSwitcherProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const levels = [
    {
      key: 'beginner' as const,
      label: 'Новичок',
      icon: BookOpen,
      color: 'bg-green-500/20 text-green-400 border-green-500/30',
      description: 'Простое объяснение с примерами'
    },
    {
      key: 'intermediate' as const,
      label: 'Средний',
      icon: Brain,
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      description: 'Подробное изложение с деталями'
    },
    {
      key: 'advanced' as const,
      label: 'Эксперт',
      icon: Zap,
      color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      description: 'Техническая глубина и нюансы'
    }
  ];

  const currentLevelData = levels.find(level => level.key === currentLevel);
  const CurrentIcon = currentLevelData?.icon || BookOpen;

  return (
    <div className="mb-6 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
      {/* Level Selector */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <CurrentIcon className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-medium text-white/80">Уровень сложности:</span>
          <Badge className={currentLevelData?.color}>
            {currentLevelData?.label}
          </Badge>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-white/60 hover:text-white hover:bg-white/10"
        >
          {isExpanded ? 'Скрыть' : 'Изменить'}
        </Button>
      </div>

      {/* Level Options */}
      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {levels.map((level) => {
            const Icon = level.icon;
            const isActive = currentLevel === level.key;
            
            return (
              <button
                key={level.key}
                onClick={() => {
                  onLevelChange(level.key);
                  setIsExpanded(false);
                }}
                className={`p-3 rounded-lg border transition-all ${
                  isActive 
                    ? level.color + ' border-opacity-100' 
                    : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white/80'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{level.label}</span>
                </div>
                <p className="text-xs opacity-80 text-left">
                  {level.description}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {/* Content Display */}
      <div className="prose prose-invert max-w-none">
        <div 
          className="text-white/90 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content[currentLevel] }}
        />
      </div>

      {/* Quick Actions */}
      {!isExpanded && (
        <div className="flex gap-2 mt-4 pt-3 border-t border-white/10">
          {currentLevel !== 'beginner' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLevelChange('beginner')}
              className="text-green-400 hover:text-green-300 hover:bg-green-500/10"
            >
              📚 Объяснить проще
            </Button>
          )}
          {currentLevel !== 'advanced' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLevelChange('advanced')}
              className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
            >
              🔬 Больше деталей
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
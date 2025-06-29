import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Brain, Zap, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface QuickExplainProps {
  selectedText: string;
  context: string;
  onClose: () => void;
}

export default function QuickExplain({ selectedText, context, onClose }: QuickExplainProps) {
  const [explanation, setExplanation] = useState<string>("");
  const [currentLevel, setCurrentLevel] = useState<'simpler' | 'current' | 'deeper'>('current');

  const explainMutation = useMutation({
    mutationFn: async ({ text, level }: { text: string; level: string }) => {
      return await apiRequest('/api/ai/quick-explain', 'POST', {
        text,
        level,
        context
      });
    },
    onSuccess: (data: any) => {
      if (data && typeof data === 'object' && 'explanation' in data) {
        setExplanation(data.explanation);
      } else if (typeof data === 'string') {
        setExplanation(data);
      } else {
        setExplanation('Объяснение получено, но формат ответа неожиданный');
      }
    }
  });

  const handleExplain = (level: 'simpler' | 'current' | 'deeper') => {
    setCurrentLevel(level);
    explainMutation.mutate({ 
      text: selectedText, 
      level 
    });
  };

  const getPromptForLevel = (level: string) => {
    switch (level) {
      case 'simpler':
        return 'Объясни это простыми словами, как для ребенка';
      case 'deeper':
        return 'Дай более глубокое техническое объяснение';
      default:
        return 'Объясни это на текущем уровне';
    }
  };

  return (
    <Card className="absolute z-50 bg-black/90 backdrop-blur-lg border border-white/20 p-4 max-w-md">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-white text-sm">Быстрое объяснение</h4>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
          className="text-white/60 hover:text-white p-1 h-auto"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="mb-3">
        <p className="text-xs text-white/60 mb-2">Выбранный текст:</p>
        <p className="text-sm text-blue-400 bg-blue-500/10 p-2 rounded border border-blue-500/20">
          "{selectedText}"
        </p>
      </div>

      <div className="flex gap-2 mb-4">
        <Button
          size="sm"
          variant={currentLevel === 'simpler' ? 'default' : 'outline'}
          onClick={() => handleExplain('simpler')}
          disabled={explainMutation.isPending}
          className="flex-1 text-xs"
        >
          <Sparkles className="w-3 h-3 mr-1" />
          Проще
        </Button>
        <Button
          size="sm"
          variant={currentLevel === 'current' ? 'default' : 'outline'}
          onClick={() => handleExplain('current')}
          disabled={explainMutation.isPending}
          className="flex-1 text-xs"
        >
          <Brain className="w-3 h-3 mr-1" />
          Обычно
        </Button>
        <Button
          size="sm"
          variant={currentLevel === 'deeper' ? 'default' : 'outline'}
          onClick={() => handleExplain('deeper')}
          disabled={explainMutation.isPending}
          className="flex-1 text-xs"
        >
          <Zap className="w-3 h-3 mr-1" />
          Глубже
        </Button>
      </div>

      {explainMutation.isPending && (
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <div className="animate-spin w-4 h-4 border-2 border-white/20 border-t-blue-400 rounded-full"></div>
          Генерирую объяснение...
        </div>
      )}

      {explanation && (
        <div className="bg-white/5 p-3 rounded border border-white/10">
          <p className="text-sm text-white/90 leading-relaxed">
            {explanation}
          </p>
        </div>
      )}

      {explainMutation.isError && (
        <div className="bg-red-500/10 border border-red-500/20 p-3 rounded text-red-400 text-sm">
          Не удалось получить объяснение. Попробуйте снова.
        </div>
      )}
    </Card>
  );
}
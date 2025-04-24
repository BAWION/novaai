import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Lightbulb, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Темы, которые можно объяснить
const TOPICS = [
  { id: "python-basics", label: "Основы Python" },
  { id: "ml-algorithms", label: "Алгоритмы машинного обучения" },
  { id: "deep-learning", label: "Глубокое обучение" },
  { id: "ai-ethics", label: "Этика ИИ" },
  { id: "ai-law", label: "Правовые основы ИИ" },
];

// Уровни сложности объяснения
const DIFFICULTY_LEVELS = [
  { value: "easy", label: "Простой" },
  { value: "medium", label: "Средний" },
  { value: "hard", label: "Сложный" },
];

type PersonalizedExplanationProps = {
  className?: string;
};

/**
 * Компонент для получения персонализированного объяснения сложных тем
 */
export function PersonalizedExplanation({ className }: PersonalizedExplanationProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("medium");
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Функция для получения персонализированного объяснения
  const getExplanation = async () => {
    if (!selectedTopic || isLoading) return;

    setIsLoading(true);
    setExplanation(null);

    try {
      const response = await apiRequest("POST", "/api/ai-assistant/explain", {
        topicId: selectedTopic,
        difficulty,
      });

      const data = await response.json();
      setExplanation(data.explanation);
    } catch (error) {
      console.error("Ошибка при получении объяснения:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось получить персонализированное объяснение",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Если пользователь не авторизован, не показываем компонент
  if (!user) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-primary" />
          <CardTitle>Персонализированное объяснение</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Выберите тему</label>
            <Select value={selectedTopic} onValueChange={setSelectedTopic}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите тему для объяснения" />
              </SelectTrigger>
              <SelectContent>
                {TOPICS.map((topic) => (
                  <SelectItem key={topic.id} value={topic.id}>
                    {topic.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Уровень сложности</label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTY_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={getExplanation} 
            disabled={!selectedTopic || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Генерация объяснения...
              </>
            ) : (
              "Получить объяснение"
            )}
          </Button>
        </div>

        {explanation && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div className="space-y-2">
                <h3 className="font-medium">
                  {TOPICS.find((t) => t.id === selectedTopic)?.label}
                </h3>
                <div className="text-sm whitespace-pre-line">
                  {explanation}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
import React, { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { LearningTrackingService } from "@/lib/learning-tracking";
import { queryClient } from "@/lib/queryClient";
import { CheckCircle2, Clock } from "lucide-react";
import { useLessonTimer } from "@/hooks/use-lesson-timer";
import { useToast } from "@/hooks/use-toast";

interface LessonProgressBarProps {
  lessonId: number;
  autoTrack?: boolean;
  showControls?: boolean;
  className?: string;
}

export default function LessonProgressBar({
  lessonId,
  autoTrack = true,
  showControls = true,
  className
}: LessonProgressBarProps) {
  const { toast } = useToast();
  const [isTracking, setIsTracking] = useState(autoTrack);
  
  // Получаем текущий прогресс урока
  const { data: lessonProgress, isLoading } = useQuery({
    queryKey: [`/api/lessons/progress/${lessonId}`],
    placeholderData: { progress: 0, completed: 0, timeSpent: 0 }
  });
  
  // Используем хук для отслеживания времени
  const { elapsedTime } = useLessonTimer({
    lessonId,
    isActive: isTracking,
    onRecordSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/lessons/progress/${lessonId}`] });
    },
    onRecordError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось записать прогресс. Попробуйте позже.",
        variant: "destructive"
      });
    }
  });
  
  // Мутация для отметки урока как завершенного
  const markAsCompletedMutation = useMutation({
    mutationFn: () => 
      LearningTrackingService.updateLessonProgress({
        lessonId,
        progress: 100,
        completed: true
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/lessons/progress/${lessonId}`] });
      toast({
        title: "Урок завершен!",
        description: "Ваш прогресс успешно сохранен.",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось отметить урок как завершенный. Попробуйте позже.",
        variant: "destructive"
      });
    }
  });
  
  // Форматирование времени
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Совмещаем записанное и текущее время
  const totalTimeSpent = (lessonProgress?.timeSpent || 0) + elapsedTime;
  
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Progress 
            value={lessonProgress?.progress || 0} 
            className="w-40 h-2 sm:w-64"
          />
          <span className="text-sm font-medium">{lessonProgress?.progress || 0}%</span>
        </div>
        
        {showControls && (
          <div className="flex items-center gap-2">
            {lessonProgress?.completed ? (
              <span className="inline-flex items-center text-sm text-green-600">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Завершено
              </span>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => markAsCompletedMutation.mutate()}
                disabled={markAsCompletedMutation.isPending}
              >
                {markAsCompletedMutation.isPending ? 
                  "Сохранение..." : 
                  "Отметить как завершенный"}
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              title={isTracking ? "Остановить отслеживание" : "Начать отслеживание"}
              onClick={() => setIsTracking(!isTracking)}
            >
              <Clock className={`h-4 w-4 ${isTracking ? "text-primary" : "text-muted-foreground"}`} />
            </Button>
            
            <span className="text-sm text-muted-foreground inline-flex items-center">
              {formatTime(totalTimeSpent)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
import { useEffect, useRef, useState } from "react";
import { LearningTrackingService } from "@/lib/learning-tracking";
import { queryClient } from "@/lib/queryClient";

interface LessonTimerParams {
  lessonId: number;
  isActive?: boolean;
  recordInterval?: number; // интервал записи в секундах
  onRecordSuccess?: (data: any) => void;
  onRecordError?: (error: Error) => void;
}

/**
 * Хук для автоматического отслеживания времени, проведенного на уроке
 */
export function useLessonTimer({
  lessonId,
  isActive = true,
  recordInterval = 30, // по умолчанию запись каждые 30 секунд
  onRecordSuccess,
  onRecordError
}: LessonTimerParams) {
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [lastRecordedTime, setLastRecordedTime] = useState<number>(0);
  const timerRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(Date.now());
  
  // Функция для записи времени на сервер
  const recordTime = async (seconds: number) => {
    if (seconds <= 0) return;
    
    try {
      const data = await LearningTrackingService.recordLessonView({
        lessonId,
        duration: seconds
      });
      
      // Сбрасываем накопленное время и записываем успешно отправленное время
      setLastRecordedTime(prev => prev + seconds);
      
      // Инвалидируем кэш для обновления прогресса
      queryClient.invalidateQueries({ queryKey: [`/api/lessons/progress/${lessonId}`] });
      
      onRecordSuccess?.(data);
    } catch (error) {
      console.error("Failed to record lesson view time:", error);
      onRecordError?.(error as Error);
    }
  };
  
  // Запуск/остановка таймера при изменении активности
  useEffect(() => {
    if (isActive && !timerRef.current) {
      // Запускаем таймер
      lastUpdateTimeRef.current = Date.now();
      timerRef.current = window.setInterval(() => {
        const now = Date.now();
        const deltaSeconds = Math.floor((now - lastUpdateTimeRef.current) / 1000);
        lastUpdateTimeRef.current = now;
        
        setElapsedTime(prev => prev + deltaSeconds);
      }, 1000);
    } else if (!isActive && timerRef.current) {
      // Останавливаем таймер
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isActive]);
  
  // Запись времени урока на сервер по интервалу
  useEffect(() => {
    const timeToRecord = elapsedTime - lastRecordedTime;
    
    if (timeToRecord >= recordInterval) {
      recordTime(timeToRecord);
    }
  }, [elapsedTime, lastRecordedTime, recordInterval]);
  
  // Запись оставшегося времени при размонтировании компонента
  useEffect(() => {
    return () => {
      const timeToRecord = elapsedTime - lastRecordedTime;
      
      if (timeToRecord > 0) {
        recordTime(timeToRecord);
      }
    };
  }, [elapsedTime, lastRecordedTime]);
  
  return {
    elapsedTime,
    lastRecordedTime,
    isTracking: isActive && timerRef.current !== null,
    recordManually: (seconds: number = elapsedTime - lastRecordedTime) => recordTime(seconds)
  };
}
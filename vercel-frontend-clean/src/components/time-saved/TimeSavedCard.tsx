import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, RotateCcw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type TimeSavedSummary = {
  minutesPerDay: number;
  hoursPerWeek: number;
  hoursPerMonth: number;
  hoursPerYear: number;
  daysPerYear: number;
};

interface TimeSavedCardProps {
  summary?: TimeSavedSummary;
  isLoading: boolean;
  onRecalculate: () => void;
  isRecalculating: boolean;
}

export const TimeSavedCard: React.FC<TimeSavedCardProps> = ({
  summary,
  isLoading,
  onRecalculate,
  isRecalculating
}) => {
  // Преобразование дней в удобочитаемый формат
  const formatDays = (days: number) => {
    const wholeDays = Math.floor(days);
    const hours = Math.round((days - wholeDays) * 24);
    
    if (wholeDays === 0) {
      return `${hours} ч`;
    }
    
    return `${wholeDays} д ${hours} ч`;
  };

  // Форматирование оставшихся часов в формат с дробью
  const formatHours = (hours: number) => {
    return hours.toFixed(1).replace('.', ',') + ' ч';
  };

  return (
    <Card className="w-full h-full relative overflow-hidden glassmorphism">
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
        <Clock className="w-10 h-10 text-primary/50" />
      </div>
      
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">Экономия времени</CardTitle>
        <CardDescription>
          На основе ваших навыков NovaAI рассчитывает, сколько времени вы экономите ежедневно
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        ) : summary ? (
          <div className="space-y-6">
            <div className="bg-primary/10 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ежедневная экономия</p>
                <h3 className="text-2xl md:text-3xl font-bold">{summary.minutesPerDay} минут</h3>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onRecalculate}
                disabled={isRecalculating}
                className="flex items-center gap-1"
              >
                <RotateCcw className={`h-4 w-4 ${isRecalculating ? 'animate-spin' : ''}`} />
                <span>Пересчитать</span>
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card rounded-lg border p-3">
                <p className="text-sm font-medium text-muted-foreground">В неделю</p>
                <h4 className="text-xl font-bold">{formatHours(summary.hoursPerWeek)}</h4>
              </div>
              
              <div className="bg-card rounded-lg border p-3">
                <p className="text-sm font-medium text-muted-foreground">В месяц</p>
                <h4 className="text-xl font-bold">{formatHours(summary.hoursPerMonth)}</h4>
              </div>
              
              <div className="bg-card rounded-lg border p-3">
                <p className="text-sm font-medium text-muted-foreground">В год</p>
                <h4 className="text-xl font-bold">{formatHours(summary.hoursPerYear)}</h4>
              </div>
              
              <div className="bg-card rounded-lg border p-3">
                <p className="text-sm font-medium text-muted-foreground">Дней в год</p>
                <h4 className="text-xl font-bold">{formatDays(summary.daysPerYear)}</h4>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground italic">
              Расчет основан на эффективности навыков, полученных в процессе обучения,
              и их применении в повседневной работе.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6">
            <p className="text-muted-foreground mb-4">
              Данные об экономии времени отсутствуют. Пройдите диагностику навыков для расчета экономии.
            </p>
            <Button 
              variant="outline" 
              onClick={onRecalculate}
              disabled={isRecalculating}
            >
              <RotateCcw className={`mr-2 h-4 w-4 ${isRecalculating ? 'animate-spin' : ''}`} />
              Рассчитать
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
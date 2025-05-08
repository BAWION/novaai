import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Clock, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { TimeSavedChart } from './TimeSavedChart';
import { TimeSavedSummary } from '@/types/time-saved';

export function TimeSavedCard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isRecalculating, setIsRecalculating] = useState(false);

  // Запрос данных об экономии времени
  const {
    data: timeSavedData,
    isLoading,
    error,
    refetch
  } = useQuery<TimeSavedSummary>({
    queryKey: ['/api/time-saved/summary', user?.id],
    enabled: !!user,
  });

  // Если произошла ошибка при загрузке данных
  useEffect(() => {
    if (error) {
      toast({
        title: 'Ошибка загрузки данных',
        description: 'Не удалось загрузить информацию об экономии времени',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  // Функция для принудительного пересчета экономии времени
  const handleRecalculate = async () => {
    if (!user) return;
    
    setIsRecalculating(true);
    try {
      await fetch(`/api/time-saved/recalculate/${user.id}`, {
        method: 'POST',
      });
      
      await refetch();
      
      toast({
        title: 'Данные обновлены',
        description: 'Расчет экономии времени успешно обновлен',
      });
    } catch (err) {
      toast({
        title: 'Ошибка обновления',
        description: 'Не удалось пересчитать экономию времени',
        variant: 'destructive',
      });
    } finally {
      setIsRecalculating(false);
    }
  };

  // Отображение состояния загрузки
  if (isLoading || !timeSavedData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Экономия времени</CardTitle>
          <CardDescription>Загрузка данных...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Если нет никаких навыков с экономией времени
  if (timeSavedData.totalMinutesSaved === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Экономия времени</CardTitle>
          <CardDescription>Ваша библиотека навыков</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center py-8">
          <Clock className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Пока нет экономии времени</h3>
          <p className="text-muted-foreground max-w-md">
            Изучайте курсы и улучшайте навыки, чтобы начать экономить время на задачах.
            Чем выше уровень навыка, тем больше времени вы будете экономить!
          </p>
        </CardContent>
      </Card>
    );
  }

  // Форматирование даты последнего расчета
  const lastCalculatedDate = new Date(timeSavedData.lastCalculatedAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Экономия времени
            </CardTitle>
            <CardDescription>
              На основе ваших навыков и их уровней
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRecalculate}
            disabled={isRecalculating}
          >
            {isRecalculating ? 'Обновление...' : 'Пересчитать'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Основные показатели */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-primary/10 rounded-lg p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Экономия в месяц</h3>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-primary">{Math.round(timeSavedData.totalHoursSaved)}</span>
              <span className="text-xl ml-1">часов</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{Math.round(timeSavedData.monthlyMinutesSaved)} минут</p>
          </div>
          
          <div className="bg-secondary/10 rounded-lg p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">В год</h3>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-secondary">{Math.round(timeSavedData.yearlyHoursSaved)}</span>
              <span className="text-xl ml-1">часов</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">~{Math.round(timeSavedData.yearlyHoursSaved / 24)} рабочих дней</p>
          </div>
          
          <div className="bg-accent/10 rounded-lg p-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Ежедневно</h3>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-accent">{Math.round(timeSavedData.dailyMinutesSaved)}</span>
              <span className="text-xl ml-1">минут</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{Math.round(timeSavedData.weeklyMinutesSaved)} минут в неделю</p>
          </div>
        </div>
        
        {/* График экономии по навыкам */}
        <div className="border rounded-lg p-4">
          <h3 className="text-sm font-medium mb-3">Топ-5 навыков по экономии времени</h3>
          <TimeSavedChart skills={timeSavedData.topSkills} />
        </div>
        
        {/* Детализация по навыкам */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Детализация по навыкам</h3>
          
          {timeSavedData.topSkills.map((skill) => (
            <div key={skill.skillId} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-medium">{skill.skillName}</span>
                <span className="text-sm">{Math.round(skill.hoursSavedMonthly * 10) / 10} ч/мес</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={skill.percentage} className="h-2" />
                <span className="text-xs text-muted-foreground min-w-[45px]">{Math.round(skill.percentage)}%</span>
              </div>
              <p className="text-xs text-muted-foreground">Уровень {skill.currentLevel}/5</p>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground border-t pt-4">
        Последнее обновление: {lastCalculatedDate}
      </CardFooter>
    </Card>
  );
}
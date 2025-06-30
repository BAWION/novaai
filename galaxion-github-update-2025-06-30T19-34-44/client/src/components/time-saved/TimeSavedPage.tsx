import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { TimeSavedCard } from './TimeSavedCard';
import { TimeSavedChart } from './TimeSavedChart';
import { TimeSavedGoalCard } from './TimeSavedGoalCard';
import { TimeSavedHistoryGraph } from './TimeSavedHistoryGraph';

export const TimeSavedPage: React.FC = () => {
  const { toast } = useToast();
  const [isRecalculating, setIsRecalculating] = useState(false);

  // Получение сводной информации об экономии времени
  const { 
    data: summary, 
    isLoading: isSummaryLoading,
    refetch: refetchSummary
  } = useQuery({
    queryKey: ['/api/time-saved/summary'],
    queryFn: async () => {
      const res = await fetch('/api/time-saved/summary');
      if (!res.ok) {
        throw new Error('Не удалось загрузить данные об экономии времени');
      }
      return res.json();
    }
  });

  // Получение истории экономии времени
  const { 
    data: history, 
    isLoading: isHistoryLoading,
    refetch: refetchHistory
  } = useQuery({
    queryKey: ['/api/time-saved/history'],
    queryFn: async () => {
      const res = await fetch('/api/time-saved/history');
      if (!res.ok) {
        throw new Error('Не удалось загрузить историю экономии времени');
      }
      return res.json();
    }
  });

  // Получение целей по экономии времени
  const { 
    data: goals, 
    isLoading: isGoalsLoading,
    refetch: refetchGoals
  } = useQuery({
    queryKey: ['/api/time-saved/goals'],
    queryFn: async () => {
      const res = await fetch('/api/time-saved/goals');
      if (!res.ok) {
        throw new Error('Не удалось загрузить цели по экономии времени');
      }
      return res.json();
    }
  });

  // Функция для пересчета экономии времени
  const recalculateTimeSaved = async () => {
    try {
      setIsRecalculating(true);
      const res = await apiRequest('POST', '/api/time-saved/recalculate');
      
      if (!res.ok) {
        throw new Error('Не удалось выполнить пересчет экономии времени');
      }
      
      // Обновляем данные
      await Promise.all([
        refetchSummary(),
        refetchHistory(),
        refetchGoals()
      ]);
      
      toast({
        title: 'Готово!',
        description: 'Расчет экономии времени успешно выполнен',
        variant: 'default',
      });
    } catch (error) {
      console.error('Ошибка при пересчете экономии времени:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось выполнить пересчет экономии времени',
        variant: 'destructive',
      });
    } finally {
      setIsRecalculating(false);
    }
  };

  // Обратный вызов после создания новой цели
  const onGoalCreated = () => {
    refetchGoals();
  };

  // Проверяем, загружены ли все данные
  const isLoading = isSummaryLoading || isHistoryLoading || isGoalsLoading;

  if (isLoading && !summary && !history && !goals) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-2/3">
          <TimeSavedCard 
            summary={summary} 
            isLoading={isSummaryLoading}
            onRecalculate={recalculateTimeSaved}
            isRecalculating={isRecalculating}
          />
        </div>
        <div className="w-full lg:w-1/3">
          <TimeSavedGoalCard 
            goals={goals || []} 
            isLoading={isGoalsLoading}
            onGoalCreated={onGoalCreated}
          />
        </div>
      </div>

      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="w-full max-w-md mx-auto mb-4">
          <TabsTrigger value="chart" className="flex-1">График экономии</TabsTrigger>
          <TabsTrigger value="history" className="flex-1">История</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chart" className="mt-0">
          <div className="rounded-lg border bg-card shadow p-6">
            <h3 className="text-lg font-medium mb-4">Динамика экономии времени</h3>
            <TimeSavedChart history={history || []} isLoading={isHistoryLoading} />
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="mt-0">
          <div className="rounded-lg border bg-card shadow p-6">
            <h3 className="text-lg font-medium mb-4">История экономии времени</h3>
            <TimeSavedHistoryGraph history={history || []} isLoading={isHistoryLoading} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
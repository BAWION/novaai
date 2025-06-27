import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { TimeSavedHistoryPoint } from '@/types/time-saved';
import { BarChart2 } from 'lucide-react';

export function TimeSavedHistoryGraph() {
  const { user } = useAuth();

  // Запрос истории экономии времени
  const { data: historyData, isLoading, error } = useQuery<TimeSavedHistoryPoint[]>({
    queryKey: ['/api/time-saved/history', user?.id],
    enabled: !!user,
  });

  // Отображение состояния загрузки
  if (isLoading || !historyData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>История экономии времени</CardTitle>
          <CardDescription>Загрузка данных...</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Если произошла ошибка или нет данных
  if (error || historyData.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>История экономии времени</CardTitle>
          <CardDescription>
            {error ? 'Не удалось загрузить историю' : 'Пока нет данных для отображения'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center py-8">
          <BarChart2 className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Нет исторических данных</h3>
          <p className="text-muted-foreground max-w-md">
            По мере использования платформы здесь будет отображаться история экономии времени
          </p>
        </CardContent>
      </Card>
    );
  }

  // Подготовка данных для графика
  const chartData = historyData
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((point) => ({
      date: format(new Date(point.date), 'dd.MM.yyyy'),
      hours: Math.round(point.totalHoursSaved * 10) / 10,
      minutes: point.totalMinutesSaved,
    }));

  // Кастомный тултип
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-md shadow-md p-3">
          <p className="font-medium text-sm">{label}</p>
          <p className="text-sm">
            <span className="font-medium">{payload[0].value}</span> часов
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {payload[1].value} минут
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-primary" />
          История экономии времени
        </CardTitle>
        <CardDescription>
          Изменение показателей с течением времени
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                yAxisId="hours"
                tick={{ fontSize: 12 }}
                width={30}
                tickFormatter={(value) => `${value}ч`}
              />
              <YAxis 
                yAxisId="minutes"
                orientation="right" 
                tick={{ fontSize: 12 }}
                width={30}
                tickFormatter={(value) => `${value}м`}
                hide
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                yAxisId="hours"
                type="monotone"
                dataKey="hours"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                activeDot={{ r: 6 }}
                name="Часов"
              />
              <Line
                yAxisId="minutes"
                type="monotone"
                dataKey="minutes"
                stroke="transparent"
                name="Минут"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
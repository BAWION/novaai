import React from 'react';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

type TimeSavedHistoryItem = {
  id: number;
  userId: number;
  date: string | Date;
  minutesSaved: number;
};

interface TimeSavedChartProps {
  history: TimeSavedHistoryItem[];
  isLoading: boolean;
}

export const TimeSavedChart: React.FC<TimeSavedChartProps> = ({ history, isLoading }) => {
  // Если история пуста, создаем пустой график с данными за последние 7 дней
  const getChartData = () => {
    if (history.length === 0) {
      const emptyData = [];
      // Создаем пустые данные за последние 7 дней
      for (let i = 6; i >= 0; i--) {
        const date = subDays(new Date(), i);
        emptyData.push({
          date: format(date, 'dd.MM'),
          minutes: 0
        });
      }
      return emptyData;
    }

    // Преобразование данных для графика
    const chartData = history.map(item => ({
      date: typeof item.date === 'string' 
        ? format(new Date(item.date), 'dd.MM') 
        : format(item.date, 'dd.MM'),
      minutes: item.minutesSaved
    }));

    return chartData;
  };
  
  // Форматирование всплывающей подсказки
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded p-2 shadow-md">
          <p className="text-sm font-medium">{`Дата: ${label}`}</p>
          <p className="text-sm text-primary">
            {`Экономия: ${payload[0].value} мин`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  const chartData = getChartData();

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }} 
            axisLine={{ stroke: '#888', strokeWidth: 1 }}
            tickLine={{ stroke: '#888' }}
          />
          <YAxis 
            tick={{ fontSize: 12 }} 
            axisLine={{ stroke: '#888', strokeWidth: 1 }}
            tickLine={{ stroke: '#888' }}
            label={{ 
              value: 'Минут в день', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle', fontSize: 12, fill: '#888' }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="minutes"
            stroke="var(--primary)"
            strokeWidth={2}
            dot={{ r: 4, fill: "var(--primary)" }}
            activeDot={{ r: 6, fill: "var(--primary)" }}
          />
        </LineChart>
      </ResponsiveContainer>
      
      {history.length === 0 && (
        <div className="flex justify-center mt-4">
          <p className="text-sm text-muted-foreground">
            Данные об экономии времени пока не доступны
          </p>
        </div>
      )}
    </div>
  );
};
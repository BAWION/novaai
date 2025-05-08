import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { SkillTimeSavedDetails } from '@/types/time-saved';

interface TimeSavedChartProps {
  skills: SkillTimeSavedDetails[];
}

export function TimeSavedChart({ skills }: TimeSavedChartProps) {
  // Если нет навыков, показываем пустое состояние
  if (!skills || skills.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground">
        Нет данных для отображения
      </div>
    );
  }

  // Подготовка данных для графика
  const chartData = skills.map((skill) => ({
    name: skill.skillName,
    minutesSaved: Math.round(skill.minutesSavedMonthly),
    hoursSaved: Math.round(skill.hoursSavedMonthly * 10) / 10, // Округляем до 1 знака после запятой
    percentage: Math.round(skill.percentage),
    level: skill.currentLevel,
  }));

  // Цвета для баров
  const barColors = [
    'hsl(var(--primary))',
    'hsl(var(--secondary))',
    'hsl(var(--accent))',
    'hsl(var(--info))',
    'hsl(var(--success))'
  ];

  // Кастомный тултип
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-md shadow-md p-3">
          <p className="font-medium text-sm">{data.name}</p>
          <p className="text-sm">
            <span className="font-medium">{data.hoursSaved}</span> часов в месяц
          </p>
          <p className="text-sm text-muted-foreground">
            {data.minutesSaved} минут &middot; {data.percentage}% от общей экономии
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Текущий уровень: {data.level}/5
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        layout="vertical"
      >
        <XAxis type="number" hide />
        <YAxis
          dataKey="name"
          type="category"
          width={120}
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="minutesSaved" barSize={20} radius={[0, 4, 4, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
          ))}
          <LabelList 
            dataKey="hoursSaved" 
            position="right" 
            formatter={(value: number) => `${value} ч.`}
            style={{ fill: 'hsl(var(--foreground))', fontSize: 12, fontWeight: 500 }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
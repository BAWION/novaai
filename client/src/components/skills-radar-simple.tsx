import React from "react";
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  Radar, 
  Tooltip,
  Legend
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Интерфейс для элемента данных навыка в формате радарной диаграммы
 */
export interface SkillData {
  category: string;
  value: number;
  fullMark: number;
}

/**
 * Упрощенная версия SkillsRadarChart без переключения режимов отображения
 */
interface SimpleRadarChartProps {
  skills?: Record<string, number>;
  height?: number | string;
  className?: string;
  isLoading?: boolean;
  maxValue?: number;
}

export default function SimpleRadarChart({
  skills,
  height = 240,
  className = "",
  isLoading = false,
  maxValue = 100
}: SimpleRadarChartProps) {
  
  // Если данных нет или компонент в режиме загрузки
  if (isLoading || !skills || Object.keys(skills).length === 0) {
    return (
      <div className={`w-full ${className}`} style={{ height }}>
        <Skeleton className="w-full h-full rounded-md bg-white/5" />
      </div>
    );
  }
  
  // Преобразование данных для радарной диаграммы
  const chartData = Object.entries(skills).map(([key, value]) => ({
    category: key,
    value: value,
    fullMark: maxValue
  }));
  
  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart 
          cx="50%" 
          cy="50%" 
          outerRadius="80%" 
          data={chartData}
        >
          <PolarGrid stroke="#ffffff20" />
          <PolarAngleAxis 
            dataKey="category" 
            tick={{ fill: "#ffffffaa", fontSize: 11 }} 
          />
          <Radar
            name="Уровень навыков"
            dataKey="value"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "#191c29", 
              border: "1px solid #414868",
              borderRadius: "4px",
              color: "#fff"
            }} 
            formatter={(value) => [`${value}%`, "Уровень"]}
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
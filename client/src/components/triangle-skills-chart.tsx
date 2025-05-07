import React from "react";

interface TriangleSkillsChartProps {
  skills: {
    skill1: { name: string; value: number; };
    skill2: { name: string; value: number; };
    skill3: { name: string; value: number; };
  };
  height?: number;
  width?: number;
  className?: string;
  showLabels?: boolean;
  fillColor?: string;
  strokeColor?: string;
}

/**
 * Компонент для отображения навыков в виде треугольной диаграммы.
 * Отображает ровно 3 навыка в виде треугольника, как на дизайн-макете.
 */
export default function TriangleSkillsChart({
  skills,
  height = 300,
  width = 300,
  className = "",
  showLabels = true,
  fillColor = "rgba(177, 141, 255, 0.3)",
  strokeColor = "rgba(177, 141, 255, 0.6)"
}: TriangleSkillsChartProps) {
  // Константы для позиционирования треугольника
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(centerX, centerY) * 0.8;
  
  // Вычисление точек треугольника
  const topPoint = { x: centerX, y: centerY - radius };
  const bottomLeftPoint = { x: centerX - radius * 0.85, y: centerY + radius * 0.5 };
  const bottomRightPoint = { x: centerX + radius * 0.85, y: centerY + radius * 0.5 };
  
  // Вычисление точек для данных
  const dataPoints = calculateDataPoints({
    skill1: skills.skill1.value / 100,
    skill2: skills.skill2.value / 100,
    skill3: skills.skill3.value / 100
  }, topPoint, bottomLeftPoint, bottomRightPoint);
  
  // Построение строки для полигона с данными
  const polygonPoints = `${dataPoints.point1.x},${dataPoints.point1.y} ${dataPoints.point2.x},${dataPoints.point2.y} ${dataPoints.point3.x},${dataPoints.point3.y}`;
  
  // Построение строки для внешнего треугольника (максимальное значение)
  const outerPolygonPoints = `${topPoint.x},${topPoint.y} ${bottomLeftPoint.x},${bottomLeftPoint.y} ${bottomRightPoint.x},${bottomRightPoint.y}`;
  
  // Построение промежуточных уровней треугольника
  const levelPoints = [0.25, 0.5, 0.75].map(level => {
    const p1 = interpolatePoint(centerX, centerY, topPoint.x, topPoint.y, level);
    const p2 = interpolatePoint(centerX, centerY, bottomLeftPoint.x, bottomLeftPoint.y, level);
    const p3 = interpolatePoint(centerX, centerY, bottomRightPoint.x, bottomRightPoint.y, level);
    return `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`;
  });
  
  // Позиционирование названий навыков
  const labelPositions = {
    top: { x: topPoint.x, y: topPoint.y - 15 },
    bottomLeft: { x: bottomLeftPoint.x - 5, y: bottomLeftPoint.y + 15 },
    bottomRight: { x: bottomRightPoint.x + 5, y: bottomRightPoint.y + 15 }
  };
  
  return (
    <div className={className} style={{ width, height }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        {/* Фоновый треугольник */}
        <polygon 
          points={outerPolygonPoints} 
          fill="rgba(100, 100, 255, 0.05)" 
          stroke="rgba(255, 255, 255, 0.1)" 
          strokeWidth="1"
        />
        
        {/* Уровни навыков (концентрические треугольники) */}
        {levelPoints.map((points, index) => (
          <polygon 
            key={index}
            points={points} 
            fill="none" 
            stroke="rgba(255, 255, 255, 0.1)" 
            strokeWidth="1"
            strokeDasharray={index === 1 ? "none" : "4 2"}
          />
        ))}
        
        {/* Линии от центра к вершинам */}
        <line 
          x1={centerX} y1={centerY} 
          x2={topPoint.x} y2={topPoint.y} 
          stroke="rgba(255, 255, 255, 0.1)" 
          strokeWidth="1"
        />
        <line 
          x1={centerX} y1={centerY} 
          x2={bottomLeftPoint.x} y2={bottomLeftPoint.y} 
          stroke="rgba(255, 255, 255, 0.1)" 
          strokeWidth="1"
        />
        <line 
          x1={centerX} y1={centerY} 
          x2={bottomRightPoint.x} y2={bottomRightPoint.y} 
          stroke="rgba(255, 255, 255, 0.1)" 
          strokeWidth="1"
        />
        
        {/* Полигон с данными */}
        <polygon 
          points={polygonPoints} 
          fill={fillColor} 
          stroke={strokeColor} 
          strokeWidth="1.5"
        />
        
        {/* Подписи навыков */}
        {showLabels && (
          <>
            <text 
              x={labelPositions.top.x} 
              y={labelPositions.top.y} 
              textAnchor="middle"
              fill="rgba(255, 255, 255, 0.8)"
              fontSize="11"
            >
              {skills.skill1.name}
            </text>
            <text 
              x={labelPositions.bottomLeft.x} 
              y={labelPositions.bottomLeft.y} 
              textAnchor="end"
              fill="rgba(255, 255, 255, 0.8)"
              fontSize="11"
            >
              {skills.skill2.name}
            </text>
            <text 
              x={labelPositions.bottomRight.x} 
              y={labelPositions.bottomRight.y} 
              textAnchor="start"
              fill="rgba(255, 255, 255, 0.8)"
              fontSize="11"
            >
              {skills.skill3.name}
            </text>
          </>
        )}
        
        {/* Легенда */}
        <text 
          x={centerX} 
          y={height - 10} 
          textAnchor="middle" 
          fill="rgba(177, 141, 255, 0.6)"
          fontSize="11"
        >
          Уровень навыков
        </text>
      </svg>
    </div>
  );
}

// Функция для вычисления точек данных внутри треугольника
function calculateDataPoints(
  values: { skill1: number; skill2: number; skill3: number },
  topPoint: { x: number; y: number },
  bottomLeftPoint: { x: number; y: number },
  bottomRightPoint: { x: number; y: number }
) {
  // Вычисляем центр треугольника
  const centerX = (topPoint.x + bottomLeftPoint.x + bottomRightPoint.x) / 3;
  const centerY = (topPoint.y + bottomLeftPoint.y + bottomRightPoint.y) / 3;
  
  // Вычисляем точки данных (интерполируем от центра к вершинам)
  const point1 = interpolatePoint(centerX, centerY, topPoint.x, topPoint.y, values.skill1);
  const point2 = interpolatePoint(centerX, centerY, bottomLeftPoint.x, bottomLeftPoint.y, values.skill2);
  const point3 = interpolatePoint(centerX, centerY, bottomRightPoint.x, bottomRightPoint.y, values.skill3);
  
  return { point1, point2, point3 };
}

// Функция для линейной интерполяции точки между центром и вершиной
function interpolatePoint(
  centerX: number, centerY: number,
  pointX: number, pointY: number,
  value: number // от 0 до 1
) {
  return {
    x: centerX + (pointX - centerX) * value,
    y: centerY + (pointY - centerY) * value
  };
}
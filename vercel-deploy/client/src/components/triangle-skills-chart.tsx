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
  bgColor?: string;
  showLevelText?: boolean;
}

/**
 * Компонент для отображения навыков в виде треугольной диаграммы.
 * Точно воспроизводит дизайн с макета.
 */
export default function TriangleSkillsChart({
  skills,
  height = 300,
  width = 300,
  className = "",
  showLabels = true,
  fillColor = "rgba(151, 92, 239, 0.25)",
  strokeColor = "rgba(151, 92, 239, 0.8)",
  bgColor = "rgba(23, 29, 52, 0.1)",
  showLevelText = true
}: TriangleSkillsChartProps) {
  // Определение размера треугольника
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(centerX, centerY) * 0.75;
  
  // Вычисление точек треугольника
  const topPoint = { x: centerX, y: centerY - radius * 0.85 };
  const bottomLeftPoint = { x: centerX - radius * 0.85, y: centerY + radius * 0.65 };
  const bottomRightPoint = { x: centerX + radius * 0.85, y: centerY + radius * 0.65 };
  
  // Точки для внешнего треугольника
  const outerPolygonPoints = `${topPoint.x},${topPoint.y} ${bottomLeftPoint.x},${bottomLeftPoint.y} ${bottomRightPoint.x},${bottomRightPoint.y}`;
  
  // Вычисление точек для треугольника с данными
  const skillValue1 = Math.max(0, Math.min(100, skills.skill1.value)) / 100;
  const skillValue2 = Math.max(0, Math.min(100, skills.skill2.value)) / 100;
  const skillValue3 = Math.max(0, Math.min(100, skills.skill3.value)) / 100;
  
  // Функция для расчета точки на линии между центром и вершиной
  const interpolate = (center: {x: number, y: number}, point: {x: number, y: number}, value: number) => {
    return {
      x: center.x + (point.x - center.x) * value,
      y: center.y + (point.y - center.y) * value
    };
  };
  
  // Центр треугольника
  const center = {
    x: (topPoint.x + bottomLeftPoint.x + bottomRightPoint.x) / 3,
    y: (topPoint.y + bottomLeftPoint.y + bottomRightPoint.y) / 3
  };
  
  // Вычисление точек для треугольника с данными
  const topSkillPoint = interpolate(center, topPoint, skillValue1);
  const leftSkillPoint = interpolate(center, bottomLeftPoint, skillValue2);
  const rightSkillPoint = interpolate(center, bottomRightPoint, skillValue3);
  
  // Строка для полигона с данными
  const dataPolygon = `${topSkillPoint.x},${topSkillPoint.y} ${leftSkillPoint.x},${leftSkillPoint.y} ${rightSkillPoint.x},${rightSkillPoint.y}`;
  
  // Создаем точки для внутренних треугольников (индикаторы уровней)
  const levelTriangles = [0.25, 0.5, 0.75].map(level => {
    const pt = interpolate(center, topPoint, level);
    const pl = interpolate(center, bottomLeftPoint, level);
    const pr = interpolate(center, bottomRightPoint, level);
    return `${pt.x},${pt.y} ${pl.x},${pl.y} ${pr.x},${pr.y}`;
  });
  
  // Позиции для текста
  const topLabelPos = { x: topPoint.x, y: topPoint.y - 15 };
  const leftLabelPos = { x: bottomLeftPoint.x - 10, y: bottomLeftPoint.y + 15 };
  const rightLabelPos = { x: bottomRightPoint.x + 10, y: bottomRightPoint.y + 15 };
  
  // Позиции для текста значений
  const topValuePos = { x: (topPoint.x + center.x) / 2, y: (topPoint.y + center.y) / 2 };
  const leftValuePos = { x: (bottomLeftPoint.x + center.x) / 2, y: (bottomLeftPoint.y + center.y) / 2 };
  const rightValuePos = { x: (bottomRightPoint.x + center.x) / 2, y: (bottomRightPoint.y + center.y) / 2 };
  
  // Позиции для меток уровней
  const bottomCenterPos = { 
    x: centerX, 
    y: centerY + radius * 0.8
  };
  
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <svg 
        width="100%" 
        height="100%" 
        viewBox={`0 0 ${width} ${height}`} 
        className="transform scale-90 sm:scale-100"
      >
        {/* Фоновый треугольник */}
        <polygon 
          points={outerPolygonPoints} 
          fill={bgColor} 
          stroke="rgba(255, 255, 255, 0.15)" 
          strokeWidth="1"
        />
        
        {/* Линии от центра к вершинам */}
        <line 
          x1={center.x} y1={center.y} 
          x2={topPoint.x} y2={topPoint.y} 
          stroke="rgba(255, 255, 255, 0.1)" 
          strokeWidth="1"
        />
        <line 
          x1={center.x} y1={center.y} 
          x2={bottomLeftPoint.x} y2={bottomLeftPoint.y} 
          stroke="rgba(255, 255, 255, 0.1)" 
          strokeWidth="1"
        />
        <line 
          x1={center.x} y1={center.y} 
          x2={bottomRightPoint.x} y2={bottomRightPoint.y} 
          stroke="rgba(255, 255, 255, 0.1)" 
          strokeWidth="1"
        />
        
        {/* Концентрические треугольники (уровни) */}
        {levelTriangles.map((points, index) => (
          <polygon 
            key={`level-${index}`} 
            points={points} 
            fill="none" 
            stroke="rgba(255, 255, 255, 0.1)" 
            strokeWidth="1"
            strokeDasharray={index === 1 ? "none" : "3 2"}
          />
        ))}
        
        {/* Полигон с данными */}
        <polygon 
          points={dataPolygon} 
          fill={fillColor} 
          stroke={strokeColor} 
          strokeWidth="1.5"
        />
        
        {/* Подписи навыков */}
        {showLabels && (
          <>
            <text 
              x={topLabelPos.x} 
              y={topLabelPos.y} 
              textAnchor="middle" 
              fill="rgba(255, 255, 255, 0.9)"
              fontSize="12"
              fontWeight="500"
              className="font-medium"
            >
              {skills.skill1.name}
            </text>
            <text 
              x={leftLabelPos.x} 
              y={leftLabelPos.y} 
              textAnchor="end" 
              fill="rgba(255, 255, 255, 0.9)"
              fontSize="12"
              fontWeight="500"
              className="font-medium"
            >
              {skills.skill2.name}
            </text>
            <text 
              x={rightLabelPos.x} 
              y={rightLabelPos.y} 
              textAnchor="start" 
              fill="rgba(255, 255, 255, 0.9)"
              fontSize="12"
              fontWeight="500"
              className="font-medium"
            >
              {skills.skill3.name}
            </text>
            
            {/* Текст со значениями навыков */}
            <text 
              x={topValuePos.x} 
              y={topValuePos.y - 2} 
              textAnchor="middle"
              fontSize="10"
              fill="rgba(255, 255, 255, 0.9)"
              fontWeight="medium"
            >
              {Math.round(skillValue1 * 100)}%
            </text>
            <text 
              x={leftValuePos.x - 5} 
              y={leftValuePos.y} 
              textAnchor="end"
              fontSize="10"
              fill="rgba(255, 255, 255, 0.9)"
              fontWeight="medium"
            >
              {Math.round(skillValue2 * 100)}%
            </text>
            <text 
              x={rightValuePos.x + 5} 
              y={rightValuePos.y} 
              textAnchor="start"
              fontSize="10"
              fill="rgba(255, 255, 255, 0.9)"
              fontWeight="medium"
            >
              {Math.round(skillValue3 * 100)}%
            </text>
          </>
        )}
        
        {/* Надпись внизу */}
        {showLevelText && (
          <text 
            x={bottomCenterPos.x} 
            y={bottomCenterPos.y} 
            textAnchor="middle"
            fontSize="11"
            fill="rgba(255, 255, 255, 0.6)"
            className="font-light"
          >
            Уровень навыков
          </text>
        )}
      </svg>
    </div>
  );
}
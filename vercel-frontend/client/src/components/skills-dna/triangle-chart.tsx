import React from "react";

interface SkillsTriangleProps {
  skills: {
    top: { 
      name: string; 
      value: number; 
    };
    bottomLeft: { 
      name: string; 
      value: number; 
    };
    bottomRight: { 
      name: string; 
      value: number; 
    };
  };
  width?: number;
  height?: number;
  className?: string;
}

/**
 * Треугольная диаграмма навыков для профиля Skills DNA
 * Точное соответствие дизайну из макета
 */
export function SkillsTriangleChart({
  skills,
  width = 300,
  height = 300,
  className = ""
}: SkillsTriangleProps) {
  // Создаем треугольник
  const centerX = width / 2;
  const centerY = height / 2;
  const triangleHeight = height * 0.8;
  const triangleWidth = width * 0.9;
  
  // Координаты вершин треугольника
  const topPoint = { x: centerX, y: centerY - triangleHeight * 0.4 };
  const bottomLeftPoint = { x: centerX - triangleWidth * 0.45, y: centerY + triangleHeight * 0.4 };
  const bottomRightPoint = { x: centerX + triangleWidth * 0.45, y: centerY + triangleHeight * 0.4 };
  
  // Точки треугольника для фона
  const trianglePoints = `${topPoint.x},${topPoint.y} ${bottomLeftPoint.x},${bottomLeftPoint.y} ${bottomRightPoint.x},${bottomRightPoint.y}`;
  
  // Нормализованные значения навыков (от 0 до 1)
  const topValue = Math.max(0, Math.min(100, skills.top.value)) / 100;
  const bottomLeftValue = Math.max(0, Math.min(100, skills.bottomLeft.value)) / 100;
  const bottomRightValue = Math.max(0, Math.min(100, skills.bottomRight.value)) / 100;
  
  // Центр треугольника
  const triangleCenter = {
    x: (topPoint.x + bottomLeftPoint.x + bottomRightPoint.x) / 3,
    y: (topPoint.y + bottomLeftPoint.y + bottomRightPoint.y) / 3
  };
  
  // Функция для интерполяции точек
  const interpolatePoint = (start: {x: number, y: number}, end: {x: number, y: number}, ratio: number) => {
    return {
      x: start.x + (end.x - start.x) * ratio,
      y: start.y + (end.y - start.y) * ratio
    };
  };
  
  // Создаем точки для треугольника данных
  const topSkillPoint = interpolatePoint(triangleCenter, topPoint, topValue);
  const bottomLeftSkillPoint = interpolatePoint(triangleCenter, bottomLeftPoint, bottomLeftValue);
  const bottomRightSkillPoint = interpolatePoint(triangleCenter, bottomRightPoint, bottomRightValue);
  
  // Формируем точки для треугольника с данными
  const skillTrianglePoints = `${topSkillPoint.x},${topSkillPoint.y} ${bottomLeftSkillPoint.x},${bottomLeftSkillPoint.y} ${bottomRightSkillPoint.x},${bottomRightSkillPoint.y}`;
  
  // Создаем точки для вспомогательных треугольников (уровни)
  const levelTriangles = [0.25, 0.5, 0.75].map(level => {
    const levelTopPoint = interpolatePoint(triangleCenter, topPoint, level);
    const levelBottomLeftPoint = interpolatePoint(triangleCenter, bottomLeftPoint, level);
    const levelBottomRightPoint = interpolatePoint(triangleCenter, bottomRightPoint, level);
    return `${levelTopPoint.x},${levelTopPoint.y} ${levelBottomLeftPoint.x},${levelBottomLeftPoint.y} ${levelBottomRightPoint.x},${levelBottomRightPoint.y}`;
  });
  
  // Создаем точки для подписей
  const topLabel = { x: topPoint.x, y: topPoint.y - 16 };
  const bottomLeftLabel = { x: bottomLeftPoint.x - 8, y: bottomLeftPoint.y + 16 };
  const bottomRightLabel = { x: bottomRightPoint.x + 8, y: bottomRightPoint.y + 16 };
  
  // Создаем точки для значений
  const topValueLabel = interpolatePoint(triangleCenter, topPoint, 0.5);
  const bottomLeftValueLabel = interpolatePoint(triangleCenter, bottomLeftPoint, 0.5);
  const bottomRightValueLabel = interpolatePoint(triangleCenter, bottomRightPoint, 0.5);
  
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <svg 
        width="100%" 
        height="100%" 
        viewBox={`0 0 ${width} ${height}`}
        className="transform scale-95 md:scale-100"
        style={{ 
          filter: "drop-shadow(0px 0px 8px rgba(120, 87, 255, 0.1))",
        }}
      >
        {/* Базовый треугольник */}
        <polygon
          points={trianglePoints}
          fill="rgba(25, 28, 41, 0.3)"
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth="1"
        />
        
        {/* Линии от центра к вершинам */}
        <line
          x1={triangleCenter.x}
          y1={triangleCenter.y}
          x2={topPoint.x}
          y2={topPoint.y}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="1"
        />
        <line
          x1={triangleCenter.x}
          y1={triangleCenter.y}
          x2={bottomLeftPoint.x}
          y2={bottomLeftPoint.y}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="1"
        />
        <line
          x1={triangleCenter.x}
          y1={triangleCenter.y}
          x2={bottomRightPoint.x}
          y2={bottomRightPoint.y}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="1"
        />
        
        {/* Уровни */}
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
        
        {/* Треугольник с данными */}
        <polygon
          points={skillTrianglePoints}
          fill="rgba(151, 92, 239, 0.25)"
          stroke="rgba(151, 92, 239, 0.8)"
          strokeWidth="1.5"
        />
        
        {/* Подписи навыков */}
        <text
          x={topLabel.x}
          y={topLabel.y}
          textAnchor="middle"
          fill="rgba(255, 255, 255, 0.9)"
          fontSize="12"
          className="font-medium"
        >
          {skills.top.name}
        </text>
        <text
          x={bottomLeftLabel.x}
          y={bottomLeftLabel.y}
          textAnchor="end"
          fill="rgba(255, 255, 255, 0.9)"
          fontSize="12"
          className="font-medium"
        >
          {skills.bottomLeft.name}
        </text>
        <text
          x={bottomRightLabel.x}
          y={bottomRightLabel.y}
          textAnchor="start"
          fill="rgba(255, 255, 255, 0.9)"
          fontSize="12"
          className="font-medium"
        >
          {skills.bottomRight.name}
        </text>
        
        {/* Значения навыков */}
        <text
          x={topValueLabel.x}
          y={topValueLabel.y}
          textAnchor="middle"
          fill="rgba(255, 255, 255, 0.9)"
          fontSize="10"
          className="font-medium"
        >
          {skills.top.value}%
        </text>
        <text
          x={bottomLeftValueLabel.x - 5}
          y={bottomLeftValueLabel.y}
          textAnchor="end"
          fill="rgba(255, 255, 255, 0.9)"
          fontSize="10"
          className="font-medium"
        >
          {skills.bottomLeft.value}%
        </text>
        <text
          x={bottomRightValueLabel.x + 5}
          y={bottomRightValueLabel.y}
          textAnchor="start"
          fill="rgba(255, 255, 255, 0.9)"
          fontSize="10"
          className="font-medium"
        >
          {skills.bottomRight.value}%
        </text>
        
        {/* Подпись внизу */}
        <text
          x={centerX}
          y={centerY + triangleHeight * 0.45}
          textAnchor="middle"
          fill="rgba(255, 255, 255, 0.6)"
          fontSize="11"
          className="font-light"
        >
          Уровень навыков
        </text>
      </svg>
    </div>
  );
}
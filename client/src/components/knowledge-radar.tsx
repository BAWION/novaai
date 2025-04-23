import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface SkillRadarData {
  id: string;
  name: string;
  category: string;
  level: number; // от 0 до 100
  color: string;
  icon?: string;
}

interface KnowledgeRadarProps {
  data: SkillRadarData[];
  className?: string;
  showLabels?: boolean;
  interactive?: boolean;
  size?: number;
  levels?: number;
  title?: string;
}

export function KnowledgeRadar({
  data,
  className,
  showLabels = true,
  interactive = true,
  size = 400,
  levels = 5,
  title = 'Радар знаний'
}: KnowledgeRadarProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredSkill, setHoveredSkill] = useState<SkillRadarData | null>(null);
  const [activeSkill, setActiveSkill] = useState<SkillRadarData | null>(null);
  
  // Группируем навыки по категориям
  const categoriesSet = new Set(data.map(skill => skill.category));
  const categories = Array.from(categoriesSet);
  const categoryCount = categories.length;
  
  // Константы для расчетов
  const center = size / 2;
  const maxRadius = (size / 2) * 0.85;
  const categoryAngleStep = (2 * Math.PI) / categoryCount;
  
  // Размещаем навыки по осям категорий
  const calculatePosition = (angle: number, level: number) => {
    const radius = (maxRadius * level) / 100;
    const x = center + radius * Math.cos(angle - Math.PI / 2);
    const y = center + radius * Math.sin(angle - Math.PI / 2);
    return { x, y, radius };
  };
  
  const renderAxisLines = () => {
    return categories.map((category, i) => {
      const angle = i * categoryAngleStep;
      const { x, y } = calculatePosition(angle, 100);
      
      return (
        <g key={`axis-${i}`}>
          <line
            x1={center}
            y1={center}
            x2={x}
            y2={y}
            stroke="#334155"
            strokeWidth="1"
            strokeDasharray="3,3"
          />
          {showLabels && (
            <text
              x={x + (x > center ? 10 : -10)}
              y={y + (y > center ? 10 : -10)}
              fontSize="11"
              fill="#94a3b8"
              textAnchor={x > center ? 'start' : 'end'}
              dominantBaseline={y > center ? 'hanging' : 'text-before-edge'}
            >
              {category}
            </text>
          )}
        </g>
      );
    });
  };
  
  const renderLevelCircles = () => {
    return Array.from({ length: levels }).map((_, i) => {
      const levelRadius = maxRadius * ((i + 1) / levels);
      return (
        <circle
          key={`level-${i}`}
          cx={center}
          cy={center}
          r={levelRadius}
          fill="none"
          stroke="#334155"
          strokeWidth="1"
          opacity={0.3}
        />
      );
    });
  };
  
  const renderPolygon = () => {
    if (data.length === 0) return null;
    
    const points: { x: number; y: number }[] = [];
    
    // Создаем точки для каждой категории
    categories.forEach((category, i) => {
      const angle = i * categoryAngleStep;
      const categorySkills = data.filter(skill => skill.category === category);
      
      // Если в категории есть навыки, берем максимальный уровень
      if (categorySkills.length > 0) {
        const maxLevel = Math.max(...categorySkills.map(skill => skill.level));
        const { x, y } = calculatePosition(angle, maxLevel);
        points.push({ x, y });
      } else {
        const { x, y } = calculatePosition(angle, 0);
        points.push({ x, y });
      }
    });
    
    // Создаем строку для полигона
    const pointsString = points.map(p => `${p.x},${p.y}`).join(' ');
    
    return (
      <polygon
        points={pointsString}
        fill="rgba(56, 189, 248, 0.2)"
        stroke="rgba(56, 189, 248, 0.8)"
        strokeWidth="2"
      />
    );
  };
  
  const renderSkillPoints = () => {
    return data.map((skill, i) => {
      const categoryIndex = categories.indexOf(skill.category);
      const angle = categoryIndex * categoryAngleStep;
      const { x, y } = calculatePosition(angle, skill.level);
      
      const isHovered = hoveredSkill?.id === skill.id;
      const isActive = activeSkill?.id === skill.id;
      
      return (
        <g
          key={`skill-${skill.id}`}
          onMouseEnter={() => setHoveredSkill(skill)}
          onMouseLeave={() => setHoveredSkill(null)}
          onClick={() => setActiveSkill(isActive ? null : skill)}
          style={{ cursor: 'pointer' }}
        >
          <circle
            cx={x}
            cy={y}
            r={isHovered || isActive ? 8 : 6}
            fill={skill.color}
            stroke="#fff"
            strokeWidth={isHovered || isActive ? 2 : 1}
            opacity={isHovered || isActive ? 1 : 0.8}
          />
          {(isHovered || isActive) && skill.icon && (
            <text 
              x={x} 
              y={y} 
              textAnchor="middle" 
              dominantBaseline="middle" 
              fontSize="8" 
              fill="#fff"
            >
              {skill.icon}
            </text>
          )}
        </g>
      );
    });
  };
  
  // Эффекты для интерактивности
  useEffect(() => {
    if (!interactive || !svgRef.current) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      // Можно добавить дополнительные эффекты при движении мыши
    };
    
    svgRef.current.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      svgRef.current?.removeEventListener('mousemove', handleMouseMove);
    };
  }, [interactive]);
  
  return (
    <div className={cn("relative", className)}>
      <div className="text-center mb-2 font-semibold text-white/80">{title}</div>
      
      <div className="relative" style={{ width: size, height: size }}>
        {/* Основной SVG радар */}
        <svg
          ref={svgRef}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transition-all duration-300"
        >
          {/* Фон */}
          <circle
            cx={center}
            cy={center}
            r={maxRadius}
            fill="rgba(15, 23, 42, 0.3)"
            stroke="#334155"
            strokeWidth="1"
          />
          
          {/* Уровни */}
          {renderLevelCircles()}
          
          {/* Оси категорий */}
          {renderAxisLines()}
          
          {/* Область покрытия навыков */}
          {renderPolygon()}
          
          {/* Точки навыков */}
          {renderSkillPoints()}
        </svg>
        
        {/* Информационная панель при наведении */}
        {interactive && hoveredSkill && !activeSkill && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute left-1/2 transform -translate-x-1/2 bottom-4 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg p-2 shadow-lg z-10 min-w-[150px]"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: hoveredSkill.color }}
              ></div>
              <div className="font-medium text-white">{hoveredSkill.name}</div>
            </div>
            <div className="text-xs text-gray-300 mt-1">
              Уровень: {hoveredSkill.level}/100
            </div>
          </motion.div>
        )}
        
        {/* Детальная информация при выборе навыка */}
        {interactive && activeSkill && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center p-4 z-20"
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
              style={{ backgroundColor: `${activeSkill.color}30` }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                style={{ backgroundColor: activeSkill.color }}
              >
                {activeSkill.icon || activeSkill.name.charAt(0)}
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-1">{activeSkill.name}</h3>
            <p className="text-gray-300 text-sm mb-3">{activeSkill.category}</p>
            
            <div className="w-full max-w-[80%] bg-gray-700/50 h-2 rounded-full mb-4">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${activeSkill.level}%`,
                  backgroundColor: activeSkill.color,
                }}
              ></div>
            </div>
            
            <div className="text-sm text-gray-300 mb-1">
              Уровень владения: <span className="text-white font-medium">{activeSkill.level}/100</span>
            </div>
            
            <button
              onClick={() => setActiveSkill(null)}
              className="mt-4 px-4 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm text-white transition"
            >
              Закрыть
            </button>
          </motion.div>
        )}
        
        {/* Легенда */}
        {showLabels && (
          <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-1 text-xs text-gray-400">
            {Array.from({ length: levels }).map((_, i) => (
              <div key={`legend-${i}`}>
                {((i + 1) * 20)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
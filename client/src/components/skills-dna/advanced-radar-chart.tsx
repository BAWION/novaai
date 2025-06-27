import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface SkillCategory {
  name: string;
  value: number;
  description?: string;
  subcategories?: { name: string; value: number }[];
}

interface AdvancedRadarChartProps {
  skills: SkillCategory[];
  width?: number;
  height?: number;
  className?: string;
  levels?: number;
  showLabels?: boolean;
  showLegend?: boolean;
  showGrid?: boolean;
  showValues?: boolean;
  colorScheme?: string[];
  backgroundColor?: string;
  glowEffect?: boolean;
  animated?: boolean;
}

/**
 * Продвинутая диаграмма Skills DNA с более детальным отображением навыков
 * Визуализирует множество категорий навыков в формате радарной диаграммы повышенной детализации
 */
export function AdvancedRadarChart({
  skills,
  width = 500,
  height = 500,
  className = "",
  levels = 5,
  showLabels = true,
  showLegend = true,
  showGrid = true,
  showValues = true,
  colorScheme = ["rgba(151, 92, 239, 0.7)", "rgba(46, 186, 225, 0.7)", "rgba(75, 192, 192, 0.7)",
                 "rgba(110, 58, 255, 0.7)", "rgba(255, 159, 64, 0.7)", "rgba(54, 162, 235, 0.7)"],
  backgroundColor = "rgba(25, 28, 41, 0.3)",
  glowEffect = true,
  animated = true
}: AdvancedRadarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!svgRef.current || skills.length === 0) return;
    
    // Очищаем предыдущую диаграмму
    d3.select(svgRef.current).selectAll("*").remove();
    
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const radius = Math.min(chartWidth, chartHeight) / 2;
    
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);
    
    // Создаем фильтр свечения для элементов
    if (glowEffect) {
      const defs = svg.append("defs");
      const filter = defs.append("filter")
        .attr("id", "glow");
      
      filter.append("feGaussianBlur")
        .attr("stdDeviation", "2.5")
        .attr("result", "coloredBlur");
      
      const feMerge = filter.append("feMerge");
      feMerge.append("feMergeNode")
        .attr("in", "coloredBlur");
      feMerge.append("feMergeNode")
        .attr("in", "SourceGraphic");
    }
    
    // Вычисляем максимальное значение для навыков
    const maxValue = Math.max(...skills.map(s => s.value), 100);
    
    // Настройка шкалы
    const angleSlice = (Math.PI * 2) / skills.length;
    
    // Шкала для радиуса
    const rScale = d3.scaleLinear()
      .domain([0, maxValue])
      .range([0, radius]);
    
    // Создаем сетку уровней
    if (showGrid) {
      // Фоновые круги
      const backgroundCircles = svg.selectAll(".radar-grid-circle")
        .data(d3.range(1, levels + 1).reverse())
        .enter()
        .append("circle")
        .attr("class", "radar-grid-circle")
        .attr("r", d => radius * d / levels)
        .style("fill", backgroundColor)
        .style("stroke", "rgba(255, 255, 255, 0.1)")
        .style("stroke-dasharray", "3,3")
        .style("filter", glowEffect ? "url(#glow)" : "none")
        .style("fill-opacity", 0.2);
      
      // Анимация при загрузке
      if (animated) {
        backgroundCircles
          .style("opacity", 0)
          .transition()
          .duration(500)
          .delay((_, i) => i * 100)
          .style("opacity", 1);
      }
      
      // Осевые линии
      const axisGrid = svg.selectAll(".radar-axis")
        .data(skills)
        .enter()
        .append("g")
        .attr("class", "radar-axis");
      
      // Линии от центра к каждой оси
      axisGrid.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", (d, i) => rScale(maxValue) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("y2", (d, i) => rScale(maxValue) * Math.sin(angleSlice * i - Math.PI / 2))
        .style("stroke", "rgba(255, 255, 255, 0.1)")
        .style("stroke-width", "1px");
      
      // Добавляем значения шкалы (процентные метки)
      if (showValues) {
        svg.selectAll(".radar-scale-label")
          .data(d3.range(1, levels + 1))
          .enter()
          .append("text")
          .attr("class", "radar-scale-label")
          .attr("x", 5)
          .attr("y", d => -d * radius / levels)
          .attr("dy", "0.4em")
          .text(d => `${Math.round(maxValue * d / levels)}%`)
          .style("font-size", "9px")
          .style("fill", "rgba(255, 255, 255, 0.6)");
      }
    }
    
    // Добавляем подписи осей
    if (showLabels) {
      svg.selectAll(".radar-axis-label")
        .data(skills)
        .enter()
        .append("text")
        .attr("class", "radar-axis-label")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("x", (d, i) => (radius + 20) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("y", (d, i) => (radius + 20) * Math.sin(angleSlice * i - Math.PI / 2))
        .text(d => d.name)
        .style("font-size", "12px")
        .style("fill", "rgba(255, 255, 255, 0.9)")
        .style("font-weight", "500")
        .each(function(d, i) {
          const self = d3.select(this);
          const x = (radius + 20) * Math.cos(angleSlice * i - Math.PI / 2);
          if (x < -10) self.attr("text-anchor", "end");
          else if (x > 10) self.attr("text-anchor", "start");
        });
    }
    
    // Создаем функцию для построения путей на радаре
    const radarLine = d3.lineRadial<SkillCategory>()
      .radius(d => rScale(d.value))
      .angle((d, i) => i * angleSlice)
      .curve(d3.curveLinearClosed);
    
    // Сортируем навыки по кругу для корректного отображения
    const skillsData = [...skills].map((s, i) => ({
      ...s,
      angle: angleSlice * i
    }));
    
    // Добавляем основную область радарной диаграммы
    const radarArea = svg.append("path")
      .datum(skillsData)
      .attr("class", "radar-area")
      .attr("d", radarLine as any)
      .style("fill", colorScheme[0])
      .style("fill-opacity", 0.5)
      .style("stroke", colorScheme[0])
      .style("stroke-width", "2px")
      .style("filter", glowEffect ? "url(#glow)" : "none");
    
    // Добавляем точки на каждом узле
    const radarPoints = svg.selectAll(".radar-point")
      .data(skillsData)
      .enter()
      .append("circle")
      .attr("class", "radar-point")
      .attr("r", 6)
      .attr("cx", (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("cy", (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
      .style("fill", (d, i) => colorScheme[i % colorScheme.length])
      .style("stroke", "#fff")
      .style("stroke-width", "1px")
      .style("filter", glowEffect ? "url(#glow)" : "none")
      .style("cursor", "pointer");
    
    // Добавляем значения возле точек
    if (showValues) {
      svg.selectAll(".radar-value")
        .data(skillsData)
        .enter()
        .append("text")
        .attr("class", "radar-value")
        .attr("x", (d, i) => (rScale(d.value) + 13) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("y", (d, i) => (rScale(d.value) + 13) * Math.sin(angleSlice * i - Math.PI / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "11px")
        .style("font-weight", "bold")
        .style("fill", "rgba(255, 255, 255, 0.9)")
        .text(d => `${d.value}%`);
    }
    
    // Анимация при загрузке
    if (animated) {
      // Анимируем основную область
      const originalArea = radarArea.attr("d");
      
      radarArea
        .attr("d", radarLine(skillsData.map(d => ({ ...d, value: 0 }))) as any)
        .transition()
        .duration(1000)
        .attr("d", originalArea);
      
      // Анимируем точки
      radarPoints
        .style("opacity", 0)
        .attr("cx", 0)
        .attr("cy", 0)
        .transition()
        .duration(1000)
        .style("opacity", 1)
        .attr("cx", (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("cy", (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2));
    }
    
    // Создаем тултипы при наведении на точки
    if (tooltipRef.current) {
      const tooltip = d3.select(tooltipRef.current)
        .style("position", "absolute")
        .style("opacity", 0)
        .style("background", "rgba(0, 0, 0, 0.8)")
        .style("border-radius", "4px")
        .style("padding", "8px 12px")
        .style("color", "#fff")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("z-index", "10000")
        .style("box-shadow", "0 0 15px rgba(0, 0, 0, 0.2)");
      
      radarPoints
        .on("mouseover", function(event, d) {
          tooltip.transition()
            .duration(200)
            .style("opacity", 1);
          
          const tooltipContent = `
            <div>
              <strong>${d.name}</strong>
              <div>Уровень: ${d.value}%</div>
              ${d.description ? `<div>${d.description}</div>` : ''}
              ${d.subcategories ? `
                <div style="margin-top: 5px;">
                  ${d.subcategories.map(sub => `
                    <div style="display: flex; justify-content: space-between; margin-top: 3px;">
                      <span>${sub.name}:</span>
                      <span>${sub.value}%</span>
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          `;
          
          tooltip.html(tooltipContent)
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 15}px`);
          
          d3.select(this)
            .transition()
            .duration(200)
            .attr("r", 9);
        })
        .on("mousemove", function(event) {
          tooltip
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 15}px`);
        })
        .on("mouseout", function() {
          tooltip.transition()
            .duration(200)
            .style("opacity", 0);
          
          d3.select(this)
            .transition()
            .duration(200)
            .attr("r", 6);
        });
    }
    
    // Добавляем легенду
    if (showLegend) {
      const legend = svg.append("g")
        .attr("class", "radar-legend")
        .attr("transform", `translate(${-width / 2 + 20}, ${-height / 2 + 20})`);
      
      const legendItems = legend.selectAll(".legend-item")
        .data(skills)
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", (_, i) => `translate(0, ${i * 20})`);
      
      legendItems.append("rect")
        .attr("width", 12)
        .attr("height", 12)
        .style("fill", (_, i) => colorScheme[i % colorScheme.length]);
      
      legendItems.append("text")
        .attr("x", 20)
        .attr("y", 10)
        .style("font-size", "10px")
        .style("fill", "rgba(255, 255, 255, 0.9)")
        .text(d => `${d.name} (${d.value}%)`);
    }
  }, [skills, width, height, levels, showLabels, showLegend, showGrid, showValues, colorScheme, backgroundColor, glowEffect, animated]);
  
  return (
    <div className={`relative ${className}`}>
      <svg ref={svgRef} width={width} height={height}></svg>
      <div ref={tooltipRef} className="tooltip" style={{ position: 'absolute', opacity: 0 }}></div>
    </div>
  );
}
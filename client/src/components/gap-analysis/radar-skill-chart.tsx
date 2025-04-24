import React, { useEffect, useRef } from "react";
import { UserSkillGap, Skill } from "@shared/schema";
import * as d3 from "d3";

interface RadarSkillChartProps {
  skillGaps: UserSkillGap[];
  skills: Map<number, Skill>;
  size?: number;
  margin?: number;
}

export function RadarSkillChart({
  skillGaps,
  skills,
  size = 400,
  margin = 70,
}: RadarSkillChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!skillGaps.length || !svgRef.current) return;

    // Очищаем предыдущий график
    d3.select(svgRef.current).selectAll("*").remove();

    // Подготавливаем данные
    const skillData = skillGaps.map((gap) => ({
      skill: skills.get(gap.skillId)?.name || `Навык ${gap.skillId}`,
      currentLevel: gap.currentLevel,
      desiredLevel: gap.desiredLevel,
      id: gap.skillId,
    }));

    // Настройка размеров
    const width = size;
    const height = size;
    const radius = Math.min(width, height) / 2 - margin;
    const center = { x: width / 2, y: height / 2 };

    // Создаем SVG контейнер
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${center.x}, ${center.y})`);

    // Определяем угловую шкалу
    const angleScale = d3
      .scalePoint()
      .domain(skillData.map((d) => d.skill))
      .range([0, 2 * Math.PI]);

    // Определяем радиальную шкалу
    const maxLevel = Math.max(...skillData.map((d) => d.desiredLevel), 100);
    const radialScale = d3.scaleLinear().domain([0, maxLevel]).range([0, radius]);

    // Создаем фоновые круги для шкалы
    const ticks = [maxLevel * 0.2, maxLevel * 0.4, maxLevel * 0.6, maxLevel * 0.8, maxLevel];
    
    ticks.forEach((tick) => {
      svg
        .append("circle")
        .attr("r", radialScale(tick))
        .attr("fill", "none")
        .attr("stroke", "rgba(180, 190, 230, 0.15)")
        .attr("stroke-width", 1);
        
      svg
        .append("text")
        .attr("x", 5)
        .attr("y", -radialScale(tick))
        .attr("font-size", "10px")
        .attr("fill", "rgba(180, 190, 230, 0.6)")
        .text(tick);
    });

    // Создаем оси навыков
    skillData.forEach((skill) => {
      const angle = angleScale(skill.skill)!;
      const line = [
        { x: 0, y: 0 },
        {
          x: radius * Math.cos(angle - Math.PI / 2),
          y: radius * Math.sin(angle - Math.PI / 2),
        },
      ];

      svg
        .append("line")
        .attr("x1", line[0].x)
        .attr("y1", line[0].y)
        .attr("x2", line[1].x)
        .attr("y2", line[1].y)
        .attr("stroke", "rgba(180, 190, 230, 0.4)")
        .attr("stroke-width", 1);

      // Добавляем подписи к навыкам
      const labelRadius = radius + 20;
      svg
        .append("text")
        .attr("x", labelRadius * Math.cos(angle - Math.PI / 2))
        .attr("y", labelRadius * Math.sin(angle - Math.PI / 2))
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("font-size", "12px")
        .attr("fill", "rgba(255, 255, 255, 0.8)")
        .text(skill.skill);
    });

    // Создаем путь для желаемого уровня (внешний контур)
    const desiredLine = d3
      .lineRadial()
      .angle((d: any) => angleScale(d.skill)! - Math.PI / 2)
      .radius((d: any) => radialScale(d.desiredLevel))
      .curve(d3.curveLinearClosed);

    svg
      .append("path")
      .datum(skillData)
      .attr("d", desiredLine as any)
      .attr("fill", "rgba(49, 91, 255, 0.1)")
      .attr("stroke", "rgba(49, 91, 255, 0.6)")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "5,3");

    // Создаем путь для текущего уровня (внутренний контур)
    const currentLine = d3
      .lineRadial()
      .angle((d: any) => angleScale(d.skill)! - Math.PI / 2)
      .radius((d: any) => radialScale(d.currentLevel))
      .curve(d3.curveLinearClosed);

    svg
      .append("path")
      .datum(skillData)
      .attr("d", currentLine as any)
      .attr("fill", "rgba(126, 101, 254, 0.3)")
      .attr("stroke", "rgba(126, 101, 254, 0.8)")
      .attr("stroke-width", 2);

    // Добавляем точки для текущих значений
    skillData.forEach((skill) => {
      const angle = angleScale(skill.skill)! - Math.PI / 2;
      const radius = radialScale(skill.currentLevel);

      svg
        .append("circle")
        .attr("cx", radius * Math.cos(angle))
        .attr("cy", radius * Math.sin(angle))
        .attr("r", 5)
        .attr("fill", "rgba(126, 101, 254, 1)")
        .attr("stroke", "white")
        .attr("stroke-width", 1);
    });

    // Добавляем легенду
    const legend = svg
      .append("g")
      .attr("transform", `translate(${-width / 2 + 30}, ${-height / 2 + 30})`);

    // Текущий уровень
    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", "rgba(126, 101, 254, 0.3)")
      .attr("stroke", "rgba(126, 101, 254, 0.8)")
      .attr("stroke-width", 2);

    legend
      .append("text")
      .attr("x", 25)
      .attr("y", 12)
      .attr("fill", "white")
      .attr("font-size", "12px")
      .text("Текущий уровень");

    // Желаемый уровень
    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", 25)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", "rgba(49, 91, 255, 0.1)")
      .attr("stroke", "rgba(49, 91, 255, 0.6)")
      .attr("stroke-width", 1.5)
      .attr("stroke-dasharray", "5,3");

    legend
      .append("text")
      .attr("x", 25)
      .attr("y", 37)
      .attr("fill", "white")
      .attr("font-size", "12px")
      .text("Желаемый уровень");

  }, [skillGaps, skills, size, margin]);

  return (
    <div className="flex justify-center items-center w-full h-full bg-black/20 rounded-md backdrop-blur-sm p-4">
      <svg ref={svgRef} />
    </div>
  );
}

export default RadarSkillChart;
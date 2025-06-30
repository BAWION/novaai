import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as d3 from 'd3';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Glassmorphism } from '@/components/ui/glassmorphism';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SkillNode {
  id: number;
  name: string;
  level: number;
  category: string;
  subcategory?: string;
  description?: string;
  links: number[];
  status: 'mastered' | 'learning' | 'recommended' | 'not_started';
  importance: number;
  x?: number;
  y?: number;
}

interface SkillMapData {
  categories: {
    [key: string]: {
      name: string;
      color: string;
      skills: SkillNode[];
    }
  };
}

interface SkillMapProps {
  userId?: number;
  showTitle?: boolean;
  showControls?: boolean;
  onSkillSelect?: (skillId: number) => void;
}

export function SkillMap({
  userId,
  showTitle = true,
  showControls = true,
  onSkillSelect
}: SkillMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'active' | 'recommended'>('all');
  const [zoom, setZoom] = useState<number>(1);
  
  // Запрос на получение данных карты навыков
  const { data: skillMapData, isLoading } = useQuery<SkillMapData>({
    queryKey: ['/api/skills/map', userId],
    enabled: !!userId
  });
  
  // D3 логика для создания карты навыков
  useEffect(() => {
    if (!skillMapData || !svgRef.current) return;
    
    // Очищаем предыдущий граф
    d3.select(svgRef.current).selectAll('*').remove();
    
    const width = 900;
    const height = 600;
    
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('style', 'max-width: 100%; height: auto;');
    
    // Извлекаем все навыки из категорий
    const allSkills: SkillNode[] = Object.values(skillMapData.categories)
      .reduce((acc, category) => [...acc, ...category.skills], [] as SkillNode[]);
    
    // Создаем связи между навыками
    const links = allSkills.reduce((acc, skill) => {
      const sourceLinks = skill.links.map(targetId => ({
        source: skill.id,
        target: targetId,
        value: 1
      }));
      return [...acc, ...sourceLinks];
    }, [] as { source: number; target: number; value: number }[]);
    
    // Фильтрация навыков в зависимости от режима просмотра
    const visibleSkills = viewMode === 'all' 
      ? allSkills 
      : viewMode === 'active' 
        ? allSkills.filter(s => s.status === 'learning' || s.status === 'mastered')
        : allSkills.filter(s => s.status === 'recommended');
    
    // Фильтрация связей на основе видимых навыков
    const visibleSkillIds = new Set(visibleSkills.map(s => s.id));
    const visibleLinks = links.filter(
      link => visibleSkillIds.has(link.source as number) && visibleSkillIds.has(link.target as number)
    );
    
    // Создаем форсированную симуляцию для распределения узлов
    const simulation = d3.forceSimulation(visibleSkills as d3.SimulationNodeDatum[])
      .force('link', d3.forceLink(visibleLinks).id((d: any) => d.id).distance(80))
      .force('charge', d3.forceManyBody().strength(-150))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30));
    
    // Добавляем группу для связей
    const link = svg.append('g')
      .attr('stroke-opacity', 0.3)
      .selectAll('line')
      .data(visibleLinks)
      .enter().append('line')
      .attr('stroke', '#8a63d2')
      .attr('stroke-width', 1.5);
    
    // Добавляем группу для узлов
    const node = svg.append('g')
      .selectAll('.node')
      .data(visibleSkills)
      .enter().append('g')
      .attr('class', 'node')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));
    
    // Добавляем круги для узлов (навыков)
    node.append('circle')
      .attr('r', d => 10 + (d.importance * 2))
      .attr('fill', d => {
        const category = Object.values(skillMapData.categories).find(
          cat => cat.skills.some(s => s.id === d.id)
        );
        return category ? category.color : '#6E3AFF';
      })
      .attr('stroke', '#ffffff')
      .attr('stroke-width', d => d.status === 'mastered' ? 2 : 0)
      .style('cursor', 'pointer')
      .style('filter', 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))')
      .on('click', (event, d) => {
        setSelectedSkill(d);
        if (onSkillSelect) onSkillSelect(d.id);
      });
    
    // Добавляем метки с названиями навыков
    node.append('text')
      .attr('dx', 12)
      .attr('dy', '.35em')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('fill', '#ffffff')
      .attr('stroke', 'none')
      .text(d => d.name);
    
    // Добавляем индикаторы прогресса для навыков в процессе изучения
    node.filter(d => d.status === 'learning')
      .append('circle')
      .attr('r', d => 10 + (d.importance * 2))
      .attr('fill', 'none')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', (d) => {
        const circumference = 2 * Math.PI * (10 + (d.importance * 2));
        return `${circumference * d.level / 100} ${circumference * (1 - d.level / 100)}`;
      })
      .attr('transform', 'rotate(-90)') // Начинаем с 12 часов
      .style('filter', 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.7))');
    
    // Обновляем положение элементов при каждом тике симуляции
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as any).x)
        .attr('y1', d => (d.source as any).y)
        .attr('x2', d => (d.target as any).x)
        .attr('y2', d => (d.target as any).y);
      
      node
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });
    
    // Функции для поддержки перетаскивания узлов
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    
    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }
    
    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
    
    // Возвращаем функцию очистки
    return () => {
      simulation.stop();
    };
  }, [skillMapData, viewMode, zoom, onSkillSelect]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // Генерируем временные данные для демонстрации, если данные не загружены
  const demoData: SkillMapData = {
    categories: {
      programming: {
        name: "Программирование",
        color: "#6E3AFF",
        skills: [
          { id: 1, name: "Python", level: 75, category: "programming", links: [2, 3, 4], status: "mastered", importance: 4 },
          { id: 2, name: "JavaScript", level: 60, category: "programming", links: [5], status: "learning", importance: 3 },
          { id: 3, name: "SQL", level: 45, category: "programming", links: [6], status: "learning", importance: 3 },
          { id: 4, name: "TypeScript", level: 30, category: "programming", links: [], status: "learning", importance: 2 },
          { id: 5, name: "React", level: 0, category: "programming", links: [], status: "recommended", importance: 2 },
          { id: 6, name: "PostgreSQL", level: 0, category: "programming", links: [], status: "recommended", importance: 2 }
        ]
      },
      data_science: {
        name: "Анализ данных",
        color: "#2EBAE1",
        skills: [
          { id: 7, name: "NumPy", level: 65, category: "data_science", links: [8, 9], status: "learning", importance: 3 },
          { id: 8, name: "Pandas", level: 55, category: "data_science", links: [10, 11], status: "learning", importance: 3 },
          { id: 9, name: "Matplotlib", level: 40, category: "data_science", links: [10], status: "learning", importance: 2 },
          { id: 10, name: "Data Visualization", level: 30, category: "data_science", links: [], status: "learning", importance: 2 },
          { id: 11, name: "Scikit-learn", level: 0, category: "data_science", links: [12], status: "recommended", importance: 3 },
          { id: 12, name: "Machine Learning", level: 0, category: "data_science", links: [], status: "not_started", importance: 4 }
        ]
      },
      ai: {
        name: "Искусственный интеллект",
        color: "#FF5757",
        skills: [
          { id: 13, name: "Neural Networks", level: 0, category: "ai", links: [14, 15], status: "not_started", importance: 4 },
          { id: 14, name: "Deep Learning", level: 0, category: "ai", links: [], status: "not_started", importance: 4 },
          { id: 15, name: "NLP", level: 0, category: "ai", links: [], status: "not_started", importance: 3 }
        ]
      }
    }
  };
  
  // Используем демо-данные, если реальные не загружены
  const displayData = skillMapData || demoData;
  
  // Получаем информацию о выбранном навыке
  const selectedSkillInfo = selectedSkill && {
    ...selectedSkill,
    category: Object.values(displayData.categories).find(
      cat => cat.skills.some(s => s.id === selectedSkill.id)
    )
  };
  
  return (
    <Glassmorphism className="p-6 min-h-[600px]">
      {showTitle && (
        <div className="mb-4">
          <h2 className="text-2xl font-semibold">Карта навыков</h2>
          <p className="text-white/60">
            Визуализация вашего текущего прогресса по навыкам и их взаимосвязей
          </p>
        </div>
      )}
      
      {showControls && (
        <div className="flex flex-wrap gap-2 mb-4">
          <Button 
            variant={viewMode === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('all')}
          >
            Все навыки
          </Button>
          <Button 
            variant={viewMode === 'active' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('active')}
          >
            Активные
          </Button>
          <Button 
            variant={viewMode === 'recommended' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setViewMode('recommended')}
          >
            Рекомендуемые
          </Button>
          <div className="ml-auto flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
              disabled={zoom <= 0.5}
            >
              -
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setZoom(prev => Math.min(2, prev + 0.1))}
              disabled={zoom >= 2}
            >
              +
            </Button>
          </div>
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-grow bg-space-900/40 rounded-lg overflow-hidden relative" style={{ minHeight: '500px' }}>
          <div className="absolute inset-0 flex items-center justify-center p-4" style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}>
            <svg ref={svgRef} width="100%" height="100%" />
          </div>
          
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
            {Object.values(displayData.categories).map(category => (
              <div key={category.name} className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                <span className="text-xs text-white/80">{category.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        {selectedSkillInfo && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-80 shrink-0"
          >
            <Card className="bg-space-900/40 border-primary/20">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{selectedSkillInfo.name}</CardTitle>
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: selectedSkillInfo.category?.color }}
                  ></div>
                </div>
                <CardDescription>
                  {selectedSkillInfo.category?.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedSkillInfo.status === 'mastered' && (
                    <Badge className="bg-green-500">Освоен</Badge>
                  )}
                  {selectedSkillInfo.status === 'learning' && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge className="bg-blue-500">Изучается</Badge>
                        <span className="text-sm font-medium">{selectedSkillInfo.level}%</span>
                      </div>
                      <div className="w-full h-2 bg-space-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-primary rounded-full"
                          style={{ width: `${selectedSkillInfo.level}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  {selectedSkillInfo.status === 'recommended' && (
                    <Badge className="bg-amber-500">Рекомендуется</Badge>
                  )}
                  {selectedSkillInfo.status === 'not_started' && (
                    <Badge className="bg-white/20">Не начат</Badge>
                  )}
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Описание</h4>
                    <p className="text-sm text-white/70">
                      {selectedSkillInfo.description || 
                       'Этот навык является важной частью вашего образовательного пути. Освоение этого навыка поможет вам в работе с проектами и дальнейшем обучении.'}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Связанные навыки</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSkillInfo.links.map(linkId => {
                        const linkedSkill = Object.values(displayData.categories)
                          .flatMap(cat => cat.skills)
                          .find(s => s.id === linkId);
                          
                        return linkedSkill ? (
                          <TooltipProvider key={linkId}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div 
                                  className="w-6 h-6 rounded-full cursor-pointer flex items-center justify-center text-xs border-2 border-white/20"
                                  style={{ 
                                    backgroundColor: Object.values(displayData.categories).find(
                                      cat => cat.skills.some(s => s.id === linkedSkill.id)
                                    )?.color 
                                  }}
                                  onClick={() => setSelectedSkill(linkedSkill)}
                                >
                                  {linkedSkill.name.charAt(0)}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{linkedSkill.name}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ) : null;
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </Glassmorphism>
  );
}
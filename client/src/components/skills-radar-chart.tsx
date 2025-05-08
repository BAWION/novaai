import React, { useState, useEffect } from "react";
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  Radar, 
  Tooltip, 
  Legend 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { AlertTriangle } from "lucide-react";

/**
 * Интерфейс для элемента данных навыка в формате радарной диаграммы
 */
export interface SkillData {
  category: string;
  value: number;
  fullMark: number;
}

/**
 * Интерфейс для категории навыков
 */
export interface SkillCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
}

/**
 * Свойства компонента Skills Radar Chart
 */
interface SkillsRadarChartProps {
  userId?: number;
  skills?: Record<string, number>;
  title?: string;
  showControls?: boolean;
  className?: string;
  subtitle?: string;
  categories?: SkillCategory[];
  isLoading?: boolean;
  maxValue?: number;
  error?: Error | null;
  onRefresh?: () => void;
}

// Категории навыков по умолчанию
const defaultCategories: SkillCategory[] = [
  { id: "technical", name: "Технические навыки", color: "#8884d8", description: "Программирование, алгоритмы, инструменты" },
  { id: "theory", name: "Теоретические знания", color: "#82ca9d", description: "Фундаментальные концепции и математика" },
  { id: "practical", name: "Практические навыки", color: "#ffc658", description: "Применение знаний в реальных проектах" },
  { id: "cognitive", name: "Когнитивные способности", color: "#ff8042", description: "Решение проблем, аналитическое мышление" },
  { id: "business", name: "Бизнес-применение", color: "#0088fe", description: "Применение AI в бизнес-задачах" }
];

/**
 * Компонент для отображения Skills DNA пользователя в виде радарной диаграммы
 */
export default function SkillsRadarChart({
  userId,
  skills,
  title = "Карта навыков",
  subtitle,
  showControls = true,
  className = "",
  categories = defaultCategories,
  isLoading = false,
  maxValue = 100,
  error = null,
  onRefresh
}: SkillsRadarChartProps) {
  // Состояния
  const [chartData, setChartData] = useState<SkillData[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [viewType, setViewType] = useState<string>("radar");

  // Эффект для преобразования данных навыков в формат для радарной диаграммы
  useEffect(() => {
    console.log('[SkillsRadarChart] Обработка входящих данных:', {
      userId, 
      skillsCount: skills ? Object.keys(skills).length : 0,
      skills: skills ? Object.entries(skills).map(([k, v]) => `${k}: ${v}`).join(', ') : 'none'
    });
    
    if (skills && Object.keys(skills).length > 0) {
      // Формируем данные для диаграммы
      const formattedData = Object.entries(skills).map(([key, value]) => ({
        category: key,
        value: value,
        fullMark: maxValue
      }));
      
      console.log('[SkillsRadarChart] Сформированы данные для диаграммы:', formattedData.length, 'элементов');
      setChartData(formattedData);
    } else {
      console.log('[SkillsRadarChart] Нет данных навыков для отображения');
      setChartData([]);
    }
  }, [skills, maxValue, userId]);

  // Фильтрация данных по активной категории
  const filteredData = activeCategory === "all" 
    ? chartData 
    : chartData.filter(item => {
        // Здесь может быть логика для определения категории навыка
        // Пока просто используем простое сопоставление по ключевым словам
        const categoryMapping: Record<string, string[]> = {
          "technical": ["Программирование", "Машинное обучение", "Глубокое обучение", "Обработка данных"],
          "theory": ["Математика", "статистика", "Теория вероятностей"],
          "practical": ["Анализ данных", "Обработка данных"],
          "cognitive": ["Аналитическое мышление", "Решение проблем", "Внимание к деталям"],
          "business": ["Применение в бизнесе", "Этика и право"]
        };
        
        return categoryMapping[activeCategory]?.some(keyword => 
          item.category.toLowerCase().includes(keyword.toLowerCase())
        );
      });

  // Рендеринг состояния загрузки
  if (isLoading) {
    return (
      <Card className={`bg-space-800/70 border-blue-500/20 ${className}`}>
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <span>{title}</span>
            {subtitle && <span className="text-sm font-normal opacity-70">{subtitle}</span>}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <div className="w-full h-64">
            <Skeleton className="w-full h-full rounded-md bg-white/5" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Рендеринг состояния ошибки
  if (error) {
    return (
      <Card className={`bg-space-800/70 border-red-500/30 ${className}`}>
        <CardHeader>
          <CardTitle className="text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-red-400 mb-4" />
          <p className="text-red-300 mb-2">Не удалось загрузить карту навыков</p>
          <p className="text-white/60 text-sm mb-4">{error.message}</p>
          {onRefresh && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh}
              className="border-white/20 hover:border-white/40"
            >
              Попробовать снова
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // Рендеринг пустого состояния
  if (!chartData.length) {
    return (
      <Card className={`bg-space-800/70 border-blue-500/20 ${className}`}>
        <CardHeader>
          <CardTitle className="text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          <p className="text-white/60 mb-4">Нет данных о навыках. Пройдите диагностику, чтобы увидеть карту навыков.</p>
          <Button 
            variant="default" 
            onClick={() => window.location.href = '/quick-diagnosis'}
          >
            Пройти диагностику
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Основной рендеринг диаграммы
  return (
    <Card className={`bg-space-800/70 border-blue-500/20 ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-white">{title}</CardTitle>
          {subtitle && <span className="text-sm font-normal text-white/70">{subtitle}</span>}
        </div>
        
        {showControls && (
          <div className="flex flex-wrap gap-2 pt-2">
            <Tabs 
              defaultValue="radar" 
              value={viewType}
              onValueChange={setViewType}
              className="w-auto"
            >
              <TabsList className="bg-space-700/50">
                <TabsTrigger value="radar">Радар</TabsTrigger>
                <TabsTrigger value="list">Список</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Select 
              value={activeCategory} 
              onValueChange={setActiveCategory}
            >
              <SelectTrigger className="w-[180px] bg-space-700/50 border-white/10">
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent className="bg-space-700 border-white/10 text-white">
                <SelectItem value="all">Все навыки</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pt-2">
        {showControls ? (
          <>
            <Tabs defaultValue="radar" value={viewType}>
              <TabsContent value="radar" className="mt-0">
                <div className="w-full h-64 md:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart 
                      cx="50%" 
                      cy="50%" 
                      outerRadius="80%" 
                      data={filteredData}
                    >
                      <PolarGrid stroke="#ffffff10" gridType="polygon" />
                      <PolarAngleAxis 
                        dataKey="category" 
                        tick={{ fill: "#ffffffcc", fontSize: 10 }}
                        tickLine={false}
                      />
                      <Radar
                        name="Уровень навыков"
                        dataKey="value"
                        stroke="#6E3AFF"
                        fill="#6E3AFF"
                        fillOpacity={0.4}
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
              </TabsContent>
              
              <TabsContent value="list" className="mt-0">
                <div className="space-y-2 pt-4">
                  {filteredData.map((skill, index) => (
                    <div key={index} className="flex flex-col">
                      <div className="flex justify-between items-center">
                        <span className="text-white text-sm">{skill.category}</span>
                        <span className="text-white/80 text-sm font-medium">{skill.value}%</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full mt-1">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full"
                          style={{ width: `${skill.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          // Простая радарная диаграмма без табов
          <div className="w-full h-64 md:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart 
                cx="50%" 
                cy="50%" 
                outerRadius="80%" 
                data={filteredData}
              >
                <PolarGrid stroke="#ffffff10" gridType="polygon" />
                <PolarAngleAxis 
                  dataKey="category" 
                  tick={{ fill: "#ffffffcc", fontSize: 10 }}
                  tickLine={false}
                />
                <Radar
                  name="Уровень навыков"
                  dataKey="value"
                  stroke="#6E3AFF"
                  fill="#6E3AFF"
                  fillOpacity={0.4}
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
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
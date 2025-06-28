import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Brain, Code, Users, Briefcase, Database, Target, Award, AlertTriangle } from "lucide-react";

interface CategoryAnalysisProps {
  skillsData: any[];
  summaryData?: any;
}

interface SkillData {
  name: string;
  progress: number;
  category: string;
  assessmentHistory?: any[];
}

const categoryIcons = {
  'ml': Brain,
  'programming': Code,
  'soft-skills': Users,
  'domain-knowledge': Briefcase,
  'data': Database
};

const categoryNames = {
  'ml': 'Машинное обучение',
  'programming': 'Программирование',
  'soft-skills': 'Навыки общения',
  'domain-knowledge': 'Знание предметной области',
  'data': 'Работа с данными'
};

export function CategoryAnalysis({ skillsData, summaryData }: CategoryAnalysisProps) {
  // Группировка навыков по категориям
  const groupedSkills = skillsData.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as { [key: string]: any[] });

  // Анализ категорий
  const categoryAnalysis = Object.entries(groupedSkills).map(([category, skills]) => {
    const avgProgress = skills.reduce((sum, skill) => sum + skill.progress, 0) / skills.length;
    const maxProgress = Math.max(...skills.map(skill => skill.progress));
    const minProgress = Math.min(...skills.map(skill => skill.progress));
    const skillCount = skills.length;
    
    // Определение уровня категории
    let level = 'Начинающий';
    if (avgProgress >= 70) level = 'Эксперт';
    else if (avgProgress >= 50) level = 'Продвинутый';
    else if (avgProgress >= 30) level = 'Средний';
    
    // Анализ тренда (если есть история)
    let trend = 'stable';
    let trendValue = 0;
    
    skills.forEach(skill => {
      if (skill.assessmentHistory && skill.assessmentHistory.length >= 2) {
        const history = skill.assessmentHistory.sort((a: any, b: any) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        const change = history[history.length - 1].progress - history[0].progress;
        trendValue += change;
      }
    });
    
    if (trendValue > 5) trend = 'growing';
    else if (trendValue < -5) trend = 'declining';
    
    return {
      category,
      name: categoryNames[category as keyof typeof categoryNames] || category,
      skills,
      avgProgress: Math.round(avgProgress),
      maxProgress,
      minProgress,
      skillCount,
      level,
      trend,
      trendValue: Math.round(trendValue)
    };
  }).sort((a, b) => b.avgProgress - a.avgProgress);

  // Данные для графика
  const chartData = categoryAnalysis.map(cat => ({
    name: cat.name,
    progress: cat.avgProgress,
    skillCount: cat.skillCount
  }));

  const colors = ['#B28DFF', '#8BE0F7', '#FF6B9D', '#4ECDC4', '#45B7D1'];

  return (
    <div className="space-y-6">
      {/* Обзор категорий */}
      <Card className="bg-space-800/70 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Анализ по категориям навыков
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis 
                  dataKey="name" 
                  stroke="#ffffff60"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  stroke="#ffffff60"
                  fontSize={12}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "#191c29",
                    border: "1px solid #414868",
                    borderRadius: "8px",
                    color: "#fff"
                  }}
                  formatter={(value: any, name: string) => [
                    name === 'progress' ? `${value}%` : `${value} навыков`,
                    name === 'progress' ? 'Средний прогресс' : 'Количество навыков'
                  ]}
                />
                <Bar dataKey="progress" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Детальный анализ категорий */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {categoryAnalysis.map((category, index) => {
          const IconComponent = categoryIcons[category.category as keyof typeof categoryIcons] || Brain;
          
          return (
            <Card key={category.category} className="bg-space-800/70 border-blue-500/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <IconComponent className="h-5 w-5 mr-2 text-blue-400" />
                    <CardTitle className="text-white text-lg">{category.name}</CardTitle>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`
                      ${category.level === 'Эксперт' ? 'bg-green-500/20 text-green-300 border-green-500/30' : ''}
                      ${category.level === 'Продвинутый' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' : ''}
                      ${category.level === 'Средний' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' : ''}
                      ${category.level === 'Начинающий' ? 'bg-red-500/20 text-red-300 border-red-500/30' : ''}
                    `}
                  >
                    {category.level}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Общий прогресс категории */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/80 text-sm">Средний прогресс</span>
                    <span className="text-white font-medium">{category.avgProgress}%</span>
                  </div>
                  <Progress value={category.avgProgress} className="h-2" />
                </div>

                {/* Статистика категории */}
                <div className="grid grid-cols-3 gap-4 py-2">
                  <div className="text-center">
                    <div className="text-white text-lg font-bold">{category.skillCount}</div>
                    <div className="text-white/60 text-xs">Навыков</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white text-lg font-bold">{category.maxProgress}%</div>
                    <div className="text-white/60 text-xs">Лучший</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white text-lg font-bold">{category.minProgress}%</div>
                    <div className="text-white/60 text-xs">Слабый</div>
                  </div>
                </div>

                {/* Тренд категории */}
                {category.trendValue !== 0 && (
                  <div className="flex items-center justify-between bg-space-900/50 rounded-lg p-3">
                    <span className="text-white/80 text-sm">Динамика</span>
                    <div className="flex items-center">
                      <span className={`text-sm font-medium mr-2 ${
                        category.trend === 'growing' ? 'text-green-400' : 
                        category.trend === 'declining' ? 'text-red-400' : 'text-yellow-400'
                      }`}>
                        {category.trendValue > 0 ? '+' : ''}{category.trendValue}%
                      </span>
                      {category.trend === 'growing' && <Award className="h-4 w-4 text-green-400" />}
                      {category.trend === 'declining' && <AlertTriangle className="h-4 w-4 text-red-400" />}
                    </div>
                  </div>
                )}

                {/* Список навыков в категории */}
                <div className="space-y-2">
                  <h4 className="text-white/80 text-sm font-medium">Навыки в категории:</h4>
                  <div className="space-y-1">
                    {category.skills.map((skill) => (
                      <div key={skill.name} className="flex justify-between items-center py-1">
                        <span className="text-white/70 text-sm">{skill.name}</span>
                        <span className="text-white text-sm font-medium">{skill.progress}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
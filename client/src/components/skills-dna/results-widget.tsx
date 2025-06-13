import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, ChevronRight, Target, TrendingUp, Book } from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/context/auth-context";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip, Legend } from "recharts";

interface SkillsData {
  name: string;
  value: number;
  category: string;
}

interface RecommendedCourse {
  id: number;
  title: string;
  description: string;
  matchPercentage: number;
  difficulty: string;
  duration: string;
  modules: number;
}

interface SkillsDnaResultsWidgetProps {
  userId?: number;
}

export function SkillsDnaResultsWidget({ userId }: SkillsDnaResultsWidgetProps) {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Получение данных Skills DNA
  const { data: skillsData, isLoading: skillsLoading } = useQuery({
    queryKey: [`/api/diagnosis/summary/${userId}`],
    queryFn: async () => {
      if (!userId) return null;
      const res = await apiRequest('GET', `/api/diagnosis/summary/${userId}`);
      if (!res.ok) return null;
      const data = await res.json();
      console.log('[SkillsDnaResultsWidget] Получены данные диагностики:', data);
      console.log('[SkillsDnaResultsWidget] Структура данных:', data?.data ? Object.keys(data.data) : 'нет данных');
      return data;
    },
    enabled: !!userId
  });

  // Получение рекомендуемых курсов (только для авторизованных пользователей)
  const { data: recommendedCourses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ['/api/courses/recommended'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/courses/recommended');
      if (!res.ok) {
        throw new Error('Failed to fetch recommended courses');
      }
      return res.json();
    },
    enabled: !!user, // Запрос выполняется только для авторизованных пользователей
    retry: false
  });

  // Демо-данные для неавторизованных пользователей
  const demoRecommendedCourses = [
    {
      id: 1,
      title: "AI Literacy 101",
      description: "Базовый курс по основам ИИ и его применению",
      matchPercentage: 95,
      difficulty: "2/5",
      modules: 8,
      duration: "120 мин"
    },
    {
      id: 2,
      title: "Математика для ИИ", 
      description: "Основы математики, необходимые для понимания алгоритмов ИИ",
      matchPercentage: 85,
      difficulty: "4/5",
      modules: 12,
      duration: "180 мин"
    }
  ];

  // Используем демо-данные для неавторизованных пользователей
  const coursesToDisplay = user ? recommendedCourses : demoRecommendedCourses;
  const isCoursesLoading = user ? coursesLoading : false;

  const handleStartDiagnosis = () => {
    setLocation("/deep-diagnosis");
  };

  const handleViewFullProfile = () => {
    setLocation("/skills-dna");
  };

  const handleViewAllCourses = () => {
    setLocation("/courses");
  };

  if (skillsLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-space-800/70 border-blue-500/20">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-white/10 rounded w-1/2"></div>
              <div className="h-32 bg-white/10 rounded"></div>
              <div className="space-y-2">
                <div className="h-4 bg-white/10 rounded"></div>
                <div className="h-4 bg-white/10 rounded w-3/4"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-space-800/70 border-blue-500/20">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-white/10 rounded w-1/2"></div>
              <div className="space-y-3">
                <div className="h-16 bg-white/10 rounded"></div>
                <div className="h-16 bg-white/10 rounded"></div>
                <div className="h-16 bg-white/10 rounded"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!skillsData || !skillsData.data || Object.keys(skillsData.data).length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills DNA Section - Empty State */}
        <Card className="bg-space-800/70 border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              Результаты диагностики Skills DNA
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center py-8">
              <div className="bg-purple-500/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Brain className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-white font-medium mb-2">Необходима диагностика</h3>
              <p className="text-white/70 text-sm mb-4">
                Пройдите единую диагностику из 15 вопросов для формирования персонального профиля Skills DNA
              </p>
              <Button 
                onClick={handleStartDiagnosis}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
              >
                Пройти диагностику
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Courses Section */}
        <Card className="bg-space-800/70 border-blue-500/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center">
                <Book className="h-5 w-5 mr-2" />
                Рекомендуемые курсы
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={handleViewAllCourses}>
                <span className="text-blue-300">Все курсы</span>
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isCoursesLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-20 bg-white/10 rounded"></div>
                  </div>
                ))}
              </div>
            ) : coursesToDisplay.length > 0 ? (
              coursesToDisplay.slice(0, 2).map((course: any) => (
                <div key={course.id} className="bg-space-900/50 border border-purple-500/20 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-white font-medium">{course.title}</h4>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      {course.matchPercentage || Math.round((course.modelScore || 0.85) * 100)}% совпадение
                    </Badge>
                  </div>
                  <p className="text-white/70 text-sm mb-3">{course.description}</p>
                  <div className="flex items-center text-xs text-white/60 space-x-4">
                    <span>Сложность: {course.difficulty || 'Средняя'}</span>
                    <span>{course.modules || 8} модулей</span>
                    <span>{course.duration || '120 мин'}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="bg-indigo-500/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Book className="h-8 w-8 text-indigo-400" />
                </div>
                <h3 className="text-white font-medium mb-2">Рекомендации скоро появятся</h3>
                <p className="text-white/70 text-sm">
                  Пройдите диагностику навыков, чтобы получить персонализированные рекомендации курсов
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Данные есть - показываем полный профиль
  const skillsDataObj = skillsData.data || {};
  const skills = Object.entries(skillsDataObj).flatMap(([category, categoryData]: [string, any]) => {
    if (categoryData && typeof categoryData === 'object' && categoryData.skills) {
      return Object.entries(categoryData.skills).map(([name, value]) => ({
        name,
        value: value as number,
        category
      }));
    }
    return [];
  });

  const topSkills = skills.sort((a, b) => b.value - a.value).slice(0, 3);
  const weakSkills = skills.sort((a, b) => a.value - b.value).slice(0, 2);
  const overallProgress = skills.reduce((acc, skill) => acc + skill.value, 0) / skills.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Skills DNA Results - Left Side */}
      <Card className="bg-space-800/70 border-blue-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <Brain className="h-5 w-5 mr-2" />
              Результаты диагностики Skills DNA
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={handleViewFullProfile}>
              <span className="text-blue-300">Подробный анализ</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Radar Chart Visualization */}
          <div className="bg-space-900/50 border border-purple-500/20 rounded-lg p-4">
            <h3 className="text-white font-medium mb-4">Профиль навыков</h3>
            
            {/* Radar Chart */}
            <div className="w-full h-64 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart 
                  cx="50%" 
                  cy="50%" 
                  outerRadius="70%" 
                  data={skills.map(skill => ({
                    category: skill.name.length > 15 ? skill.name.substring(0, 12) + '...' : skill.name,
                    value: skill.value
                  }))}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <PolarGrid stroke="#ffffff20" />
                  <PolarAngleAxis 
                    dataKey="category" 
                    tick={{ fill: "#ffffffaa", fontSize: 10 }} 
                  />
                  <Radar
                    name="Уровень навыков"
                    dataKey="value"
                    stroke="#B28DFF"
                    fill="#B28DFF"
                    fillOpacity={0.3}
                    strokeWidth={2}
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
            
            {/* Top Skills Summary */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {topSkills.map((skill, index) => (
                <div key={skill.name} className="text-center">
                  <div className="text-lg font-bold text-white mb-1">{skill.value}%</div>
                  <div className="text-xs text-white/70">{skill.name}</div>
                </div>
              ))}
            </div>
            
            {/* Overall Progress */}
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/70">Общий прогресс: {Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>
          </div>



          {/* Areas for Development */}
          <div className="space-y-2">
            <h3 className="text-white font-medium">Области для развития</h3>
            {weakSkills.map((skill) => (
              <div key={skill.name} className="text-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-white/80">{skill.name}: {skill.value}%</span>
                </div>
                <Progress value={skill.value} className="h-1" />
              </div>
            ))}
          </div>

          <Button 
            onClick={handleViewFullProfile}
            variant="outline" 
            className="w-full border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
          >
            Подробный анализ Skills DNA
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>

      {/* Recommended Courses - Right Side */}
      <Card className="bg-space-800/70 border-blue-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <Book className="h-5 w-5 mr-2" />
              Рекомендуемые курсы
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={handleViewAllCourses}>
              <span className="text-blue-300">Все курсы</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {coursesLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-24 bg-white/10 rounded"></div>
                </div>
              ))}
            </div>
          ) : coursesToDisplay.length > 0 ? (
            coursesToDisplay.slice(0, 2).map((course: any, index: number) => (
              <div key={course.id} className="bg-space-900/50 border border-purple-500/20 rounded-lg p-4 hover:border-purple-500/40 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="text-white font-medium mb-1">{course.title}</h4>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                      {course.matchPercentage || Math.round((course.modelScore || 0.95 - index * 0.1) * 100)}% совпадение
                    </Badge>
                  </div>
                </div>
                <p className="text-white/70 text-sm mb-3">{course.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="text-xs text-white/60">
                    <span className="inline-flex items-center mr-4">
                      <Target className="h-3 w-3 mr-1" />
                      Сложность: {course.difficulty || (index === 0 ? '2/5' : '4/5')}
                    </span>
                    <span className="inline-flex items-center mr-4">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {course.modules || (5 + index * 3)} модулей
                    </span>
                    <span>{course.duration || (60 + index * 30)} мин</span>
                  </div>
                </div>
                <div className="text-xs text-purple-300 mb-3">
                  Почему подходит: {index === 0 ? 'Укрепит ваши знания в машинном обучении' : 'Развитие навыков программирования'}
                </div>
                <Button 
                  size="sm" 
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                  onClick={() => setLocation(`/courses/${course.slug || course.id}`)}
                >
                  Начать изучение
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="bg-indigo-500/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Book className="h-8 w-8 text-indigo-400" />
              </div>
              <h3 className="text-white font-medium mb-2">Рекомендации скоро появятся</h3>
              <p className="text-white/70 text-sm">
                Пройдите диагностику навыков, чтобы получить персонализированные рекомендации курсов
              </p>
            </div>
          )}

          <Button 
            onClick={handleViewAllCourses}
            variant="outline" 
            className="w-full border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
          >
            Все рекомендуемые курсы
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
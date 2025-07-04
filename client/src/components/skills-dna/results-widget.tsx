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

  // Получение детальных данных Skills DNA для радар-чарта
  const { data: skillsData, isLoading: skillsLoading } = useQuery({
    queryKey: [`/api/diagnosis/progress/${userId}`],
    queryFn: async () => {
      if (!userId) return null;
      const res = await apiRequest('GET', `/api/diagnosis/progress/${userId}`);
      if (!res.ok) return null;
      const data = await res.json();
      console.log('[SkillsDnaResultsWidget] Получены детальные данные диагностики:', data);
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

  if (!skillsData || !skillsData.data || !Array.isArray(skillsData.data) || skillsData.data.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills DNA Section - Empty State - Мобильная оптимизация */}
        <Card className="bg-space-800/70 border-blue-500/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-white flex items-center text-lg">
              <Brain className="h-5 w-5 mr-2 flex-shrink-0" />
              <span className="truncate">Результаты диагностики Skills DNA</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-6">
              <div className="bg-purple-500/20 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <Brain className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-white font-medium mb-2 text-base">Необходима диагностика</h3>
              <p className="text-white/70 text-sm mb-4 px-2">
                Пройдите диагностику для формирования персонального профиля Skills DNA
              </p>
              <Button 
                onClick={handleStartDiagnosis}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 w-full sm:w-auto"
              >
                Пройти диагностику
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Courses Section - Мобильная оптимизация */}
        <Card className="bg-space-800/70 border-blue-500/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-white flex items-center text-lg">
              <Book className="h-5 w-5 mr-2 flex-shrink-0" />
              <span className="truncate">Рекомендуемые курсы</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isCoursesLoading ? (
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-white/10 rounded"></div>
                  </div>
                ))}
              </div>
            ) : coursesToDisplay.length > 0 ? (
              coursesToDisplay.slice(0, 2).map((course: any) => (
                <div key={course.id} className="bg-space-900/50 border border-purple-500/20 rounded-lg p-3">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="text-white font-medium text-sm truncate pr-2">{course.title}</h4>
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs flex-shrink-0">
                        {course.matchPercentage || Math.round((course.modelScore || 0.85) * 100)}%
                      </Badge>
                    </div>
                    <p className="text-white/70 text-xs leading-relaxed">{course.description}</p>
                    <div className="flex flex-wrap items-center text-xs text-white/60 gap-2">
                      <span className="bg-white/5 px-2 py-1 rounded">Сложность: {course.difficulty || 'Средняя'}</span>
                      <span className="bg-white/5 px-2 py-1 rounded">{course.modules || 8} модулей</span>
                      <span className="bg-white/5 px-2 py-1 rounded">{course.duration || '120 мин'}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <div className="bg-indigo-500/20 rounded-full p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <Book className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-white font-medium mb-2 text-base">Рекомендации скоро появятся</h3>
                <p className="text-white/70 text-sm px-2 mb-4">
                  Пройдите диагностику навыков для получения персонализированных рекомендаций
                </p>
                <Button 
                  onClick={handleViewAllCourses}
                  variant="outline" 
                  size="sm"
                  className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10"
                >
                  Все курсы
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Данные есть - показываем полный профиль
  const skillsArray = skillsData.data || [];
  
  const skills = skillsArray.map((skill: any) => ({
    name: skill.name,
    value: skill.progress,
    category: skill.category
  }));

  const topSkills = skills.sort((a, b) => b.value - a.value).slice(0, 3);
  const weakSkills = skills.sort((a, b) => a.value - b.value).slice(0, 2);
  const overallProgress = skills.reduce((acc, skill) => acc + skill.value, 0) / skills.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Skills DNA Results - Мобильная оптимизация */}
      <Card className="bg-space-800/70 border-blue-500/20">
        <CardHeader className="pb-4">
          <CardTitle className="text-white flex items-center text-lg">
            <Brain className="h-5 w-5 mr-2 flex-shrink-0" />
            <span className="truncate">Результаты диагностики Skills DNA</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Radar Chart Visualization - Адаптивный размер */}
          <div className="bg-space-900/50 border border-purple-500/20 rounded-lg p-3 sm:p-4">
            <h3 className="text-white font-medium mb-3 text-base">Профиль навыков</h3>
            
            {/* Radar Chart - Меньший размер на мобильных */}
            <div className="w-full h-48 sm:h-64 mb-3">
              {skills.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart 
                    cx="50%" 
                    cy="50%" 
                    outerRadius="65%" 
                    data={skills.map(skill => ({
                      category: skill.name.length > 12 ? skill.name.substring(0, 8) + '...' : skill.name,
                      value: skill.value
                    }))}
                    margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                  >
                    <PolarGrid stroke="#ffffff20" />
                    <PolarAngleAxis 
                      dataKey="category" 
                      tick={{ fill: "#ffffffaa", fontSize: 9 }} 
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
                        color: "#fff",
                        fontSize: "12px"
                      }} 
                      formatter={(value: any) => [`${value}%`, "Уровень"]}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-white/60">
                  <div className="text-center">
                    <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Нет данных для отображения</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Top Skills Summary - Адаптивная сетка */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
              {topSkills.slice(0, 3).map((skill, index) => (
                <div key={skill.name} className="text-center">
                  <div className="text-base sm:text-lg font-bold text-white mb-1">{skill.value}%</div>
                  <div className="text-xs text-white/70 truncate" title={skill.name}>
                    {skill.name}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Кнопка подробного анализа Skills DNA */}
            <Button 
              onClick={() => setLocation('/skills-dna')}
              variant="outline" 
              className="w-full border-purple-500/30 text-purple-300 hover:bg-purple-500/10 text-sm"
            >
              <Brain className="h-4 w-4 mr-2" />
              Подробный анализ Skills DNA
            </Button>
            
          </div>

          {/* Areas for Development - Компактно */}
          <div className="space-y-2">
            <h3 className="text-white font-medium text-base">Области для развития</h3>
            {weakSkills.slice(0, 2).map((skill) => (
              <div key={skill.name} className="text-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-white/80 truncate pr-2">{skill.name}</span>
                  <span className="text-white/60 text-xs flex-shrink-0">{skill.value}%</span>
                </div>
                <Progress value={skill.value} className="h-1.5" />
              </div>
            ))}
          </div>


        </CardContent>
      </Card>

      {/* Recommended Courses - Мобильная оптимизация */}
      <Card className="bg-space-800/70 border-blue-500/20">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center text-lg">
              <Book className="h-5 w-5 mr-2 flex-shrink-0" />
              <span className="truncate">Рекомендуемые курсы</span>
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={handleViewAllCourses} className="flex-shrink-0">
              <span className="text-blue-300 hidden sm:inline">Все курсы</span>
              <span className="text-blue-300 sm:hidden">Все</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
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
              <div key={course.id} className="bg-space-900/50 border border-purple-500/20 rounded-lg p-3 hover:border-purple-500/40 transition-colors">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="text-white font-medium text-sm truncate pr-2">{course.title}</h4>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs flex-shrink-0">
                      {course.matchPercentage || Math.round((course.modelScore || 0.95 - index * 0.1) * 100)}%
                    </Badge>
                  </div>
                  <p className="text-white/70 text-xs leading-relaxed">{course.description}</p>
                  <div className="flex flex-wrap items-center text-xs text-white/60 gap-2">
                    <span className="bg-white/5 px-2 py-1 rounded flex items-center">
                      <Target className="h-3 w-3 mr-1" />
                      {course.difficulty || (index === 0 ? '2/5' : '4/5')}
                    </span>
                    <span className="bg-white/5 px-2 py-1 rounded flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {course.modules || (5 + index * 3)} мод.
                    </span>
                    <span className="bg-white/5 px-2 py-1 rounded">{course.duration || (60 + index * 30)} мин</span>
                  </div>
                  <div className="text-xs text-purple-300 bg-purple-500/10 rounded p-2">
                    <strong>Почему подходит:</strong> {index === 0 ? 'Укрепит ваши знания в машинном обучении' : 'Развитие навыков программирования'}
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-sm"
                    onClick={() => setLocation(`/courses/${course.slug || course.id}`)}
                  >
                    Начать изучение
                  </Button>
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

          <Button 
            onClick={handleViewAllCourses}
            variant="outline" 
            className="w-full border-blue-500/30 text-blue-300 hover:bg-blue-500/10 text-sm"
          >
            <span className="hidden sm:inline">Все рекомендуемые курсы</span>
            <span className="sm:hidden">Все курсы</span>
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

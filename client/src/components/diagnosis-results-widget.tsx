import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, BookOpen, ChevronRight, Target, Clock, Layers } from "lucide-react";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { apiRequest } from "@/lib/queryClient";

interface SkillProgress {
  id: number;
  name: string;
  progress: number;
  level: string;
}

interface DiagnosisResultsWidgetProps {
  userId?: number;
}

export function DiagnosisResultsWidget({ userId }: DiagnosisResultsWidgetProps) {
  const { data: skillsProgress, isLoading } = useQuery({
    queryKey: ['/api/diagnosis/progress', userId],
    queryFn: async () => {
      if (!userId) return [];
      const res = await apiRequest('GET', `/api/diagnosis/progress/${userId}`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.data || [];
    },
    enabled: !!userId
  });
  
  if (isLoading) {
    return (
      <Card className="bg-space-800/50 border-white/10">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-white/10 rounded mb-4"></div>
            <div className="h-20 bg-white/10 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!skillsProgress || skillsProgress.length === 0) {
    return (
      <Card className="bg-space-800/50 border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center text-white">
            <Brain className="h-5 w-5 mr-2 text-primary" />
            Skills DNA
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-white/70 mb-4">
            Пройдите диагностику, чтобы увидеть ваш профиль навыков
          </p>
          <Button 
            variant="outline" 
            className="border-white/20 hover:border-white/30"
            onClick={() => window.location.href = '/quick-diagnosis'}
          >
            Пройти диагностику
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Преобразуем данные прогресса в формат для радарной диаграммы
  const skillsForChart: {[key: string]: number} = {};
  if (skillsProgress) {
    skillsProgress.forEach((skill: SkillProgress) => {
      skillsForChart[skill.name] = skill.progress;
    });
  }

  // Получаем топ 3 навыка для рекомендаций
  const topSkills = skillsProgress
    ? skillsProgress
        .sort((a: SkillProgress, b: SkillProgress) => b.progress - a.progress)
        .slice(0, 3)
    : [];

  // Получаем навыки с низким прогрессом для рекомендаций
  const improvementSkills = skillsProgress
    ? skillsProgress
        .filter((skill: SkillProgress) => skill.progress < 50)
        .sort((a: SkillProgress, b: SkillProgress) => a.progress - b.progress)
        .slice(0, 3)
    : [];

  // Простые рекомендации курсов на основе навыков
  const recommendations = [
    {
      id: 1,
      title: "Основы машинного обучения",
      description: "Базовый курс по теории и практике машинного обучения",
      match: 95,
      difficulty: 2,
      duration: 120,
      modules: 8,
      reason: "Укрепит ваши знания в машинном обучении"
    },
    {
      id: 2,
      title: "Python для анализа данных",
      description: "Практический курс по использованию Python в обработке данных",
      match: 87,
      difficulty: 2,
      duration: 90,
      modules: 6,
      reason: "Развитие навыков программирования"
    },
    {
      id: 3,
      title: "Этика искусственного интеллекта",
      description: "Изучение этических аспектов разработки и применения ИИ",
      match: 78,
      difficulty: 1,
      duration: 60,
      modules: 4,
      reason: "Важная область для комплексного понимания ИИ"
    }
  ];

  return (
    <Card className="bg-space-800/50 border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <Brain className="h-5 w-5 mr-2 text-primary" />
          Результаты диагностики Skills DNA
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Профиль навыков - Skills DNA Radar Chart */}
          <div>
            <h4 className="text-lg font-medium mb-4 flex items-center text-white">
              <Brain className="h-5 w-5 mr-2 text-primary" />
              Профиль навыков
            </h4>
            
            <Glassmorphism className="p-4 rounded-lg">
              <div className="h-64 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 w-full">
                  {Object.entries(skillsForChart).slice(0, 6).map(([skill, value]) => (
                    <div key={skill} className="text-center">
                      <div className="relative w-16 h-16 mx-auto mb-2">
                        <div className="absolute inset-0 rounded-full bg-primary/20"></div>
                        <div 
                          className="absolute inset-0 rounded-full bg-gradient-to-t from-primary to-primary/60"
                          style={{ clipPath: `polygon(50% 50%, 50% 0%, ${50 + value/2}% 0%, 50% 50%)` }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold">
                          {value}%
                        </div>
                      </div>
                      <p className="text-xs text-white/80 text-center">{skill}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 border-t border-white/10 pt-4">
                <h5 className="text-sm font-medium mb-2 text-white">
                  Сильные стороны
                </h5>
                <div className="flex flex-wrap gap-2 mb-3">
                  {topSkills.map((skill) => (
                    <Badge 
                      key={skill.id} 
                      className="bg-green-500/20 text-green-400 border-0"
                    >
                      {skill.name}: {skill.progress}%
                    </Badge>
                  ))}
                </div>
                
                {improvementSkills.length > 0 && (
                  <>
                    <h5 className="text-sm font-medium mb-2 text-white">
                      Области для развития
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {improvementSkills.map((skill) => (
                        <Badge 
                          key={skill.id} 
                          className="bg-blue-500/20 text-blue-400 border-0"
                        >
                          {skill.name}: {skill.progress}%
                        </Badge>
                      ))}
                    </div>
                  </>
                )}
                
                <div className="mt-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-white/20 hover:border-white/30 text-white"
                    onClick={() => window.location.href = '/skills-dna'}
                  >
                    Подробный анализ Skills DNA
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Glassmorphism>
          </div>
          
          {/* Рекомендации */}
          <div>
            <h4 className="text-lg font-medium mb-4 flex items-center text-white">
              <BookOpen className="h-5 w-5 mr-2 text-primary" />
              Рекомендуемые курсы
            </h4>
            
            <div className="space-y-3">
              {recommendations.map((course) => (
                <Glassmorphism 
                  key={course.id}
                  className="p-3 rounded-lg border-l-2 border-primary"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h5 className="font-medium text-white">{course.title}</h5>
                        <Badge className="bg-green-500/20 text-green-400 border-0">
                          {course.match}% совпадение
                        </Badge>
                      </div>
                      <p className="text-sm text-white/70 mt-1">{course.description}</p>
                      
                      <div className="mt-2 text-xs text-white/60 flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          <span>Сложность: {course.difficulty}/5</span>
                        </div>
                        
                        {course.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{course.duration} мин</span>
                          </div>
                        )}
                        
                        {course.modules && (
                          <div className="flex items-center gap-1">
                            <Layers className="h-3 w-3" />
                            <span>{course.modules} модулей</span>
                          </div>
                        )}
                      </div>
                      
                      {course.reason && (
                        <div className="mt-2 text-xs p-1.5 bg-primary/10 rounded">
                          <span className="text-primary font-medium">Почему подходит:</span> {course.reason}
                        </div>
                      )}
                    </div>
                  </div>
                </Glassmorphism>
              ))}
            </div>
            
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="w-full border-white/20 hover:border-white/30 text-white"
                onClick={() => window.location.href = '/courses?filter=recommended'}
              >
                Все рекомендуемые курсы
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
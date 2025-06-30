import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Brain, Compass, ArrowRight, BookOpen, Star, Clock, Download, Sparkles, Loader2 } from "lucide-react";

// Типы для рекомендаций
interface RecommendedStep {
  id: string;
  title: string;
  type: "lesson" | "module" | "course";
  explanation: string;
  link?: string;
}

interface RecommendedCourse {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  explanation: string;
  estimatedHours: number;
}

interface SkillGap {
  skill: string;
  currentLevel: number;
  recommendedLevel: number;
  improvementSuggestion: string;
}

interface LearningPath {
  week: number;
  focus: string;
  objectives: string[];
  resources: Array<{
    id: string;
    type: "lesson" | "module" | "course";
    title: string;
  }>;
}

interface Recommendations {
  nextSteps: RecommendedStep[];
  recommendedCourses: RecommendedCourse[];
  skillGaps: SkillGap[];
  personalizedLearningPath: LearningPath[];
  estimatedCompletionTime: number;
  message: string;
  focusAreas: string[];
}

/**
 * Компонент Образовательного Навигатора - интеллектуального ИИ-агента
 * для персонализации образовательной траектории
 */
export function EducationalNavigator() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Загружаем рекомендации от ИИ-агента
  const {
    data: recommendations,
    isLoading,
    isError,
    refetch
  } = useQuery<Recommendations>({
    queryKey: ["/api/ai-agent/recommendations"],
    refetchOnWindowFocus: false,
  });

  // Если загрузка данных не удалась, показываем сообщение об ошибке
  useEffect(() => {
    if (isError) {
      toast({
        title: "Ошибка загрузки рекомендаций",
        description: "Не удалось получить персонализированные рекомендации. Попробуйте позже.",
        variant: "destructive",
      });
    }
  }, [isError, toast]);

  if (isLoading) {
    return (
      <Card className="bg-space-900/70 shadow-glow-md border-space-700 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Образовательный Навигатор
          </CardTitle>
          <CardDescription>
            Получение персонализированных рекомендаций...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">
            ИИ анализирует ваш прогресс и формирует рекомендации...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isError || !recommendations) {
    return (
      <Card className="bg-space-900/70 shadow-glow-md border-space-700 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Образовательный Навигатор
          </CardTitle>
          <CardDescription>
            Персонализированные рекомендации недоступны
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 px-4 rounded-lg bg-red-900/20 border border-red-900/40">
            <p className="text-red-300 mb-4 text-center">
              В данный момент невозможно загрузить персонализированные рекомендации.
            </p>
            <Button 
              variant="outline" 
              onClick={() => refetch()}
              className="border-red-700 text-red-300 hover:bg-red-800/30"
            >
              Попробовать снова
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-space-900/70 shadow-glow-md border-space-700 overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Образовательный Навигатор
          </CardTitle>
          <Badge variant="outline" className="border-primary/40 text-primary-foreground px-2 py-1">
            ИИ-агент
          </Badge>
        </div>
        <CardDescription className="text-space-300">
          Персонализированные рекомендации на основе вашего прогресса
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-1">
        {/* Личное сообщение от ИИ */}
        <div className="mb-6 p-4 rounded-lg bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-800/40">
          <p className="text-white leading-relaxed">{recommendations.message}</p>
        </div>
        
        {/* Области фокусировки */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
            <Sparkles className="h-4 w-4 text-primary mr-2" />
            Рекомендуемые области фокуса
          </h3>
          <div className="flex flex-wrap gap-2 mt-1">
            {recommendations.focusAreas.map((area, index) => (
              <Badge key={index} variant="secondary" className="bg-indigo-900/30 text-indigo-200 border border-indigo-800/50">
                {area}
              </Badge>
            ))}
          </div>
        </div>
        
        <Separator className="my-4 bg-space-700" />
        
        {/* Вкладки с рекомендациями */}
        <Tabs defaultValue="next-steps" className="w-full">
          <TabsList className="w-full bg-space-800 mb-4">
            <TabsTrigger value="next-steps" className="flex-1">Следующие шаги</TabsTrigger>
            <TabsTrigger value="courses" className="flex-1">Курсы</TabsTrigger>
            <TabsTrigger value="skills" className="flex-1">Навыки</TabsTrigger>
            <TabsTrigger value="path" className="flex-1">Траектория</TabsTrigger>
          </TabsList>
          
          {/* Следующие шаги */}
          <TabsContent value="next-steps" className="space-y-4">
            {recommendations.nextSteps.map((step, index) => (
              <div key={index} className="p-3 rounded-lg bg-space-800/60 border border-space-700 hover:border-primary/40 transition-colors">
                <div className="flex items-start">
                  <div className="mt-1 mr-3 h-6 w-6 bg-primary/20 rounded-full flex items-center justify-center text-primary font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{step.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{step.explanation}</p>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-primary flex items-center"
                      onClick={() => {
                        if (step.link) {
                          navigate(step.link);
                        }
                      }}
                    >
                      Начать <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
          
          {/* Рекомендуемые курсы */}
          <TabsContent value="courses" className="space-y-4">
            {recommendations.recommendedCourses.map((course, index) => (
              <div key={index} className="p-3 rounded-lg bg-space-800/60 border border-space-700 hover:border-primary/40 transition-colors">
                <div className="flex items-start">
                  <div className="mt-1 mr-3 flex-shrink-0">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-white">{course.title}</h4>
                      <Badge variant="outline" className="text-xs border-space-600">
                        {course.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{course.description}</p>
                    <div className="flex items-center text-xs text-muted-foreground mb-2">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{course.estimatedHours} часов</span>
                    </div>
                    <p className="text-xs text-indigo-300 mb-2 italic">{course.explanation}</p>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-primary flex items-center"
                      onClick={() => {
                        navigate(`/courses/${course.id}`);
                      }}
                    >
                      Подробнее <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
          
          {/* Пробелы в навыках */}
          <TabsContent value="skills" className="space-y-4">
            {recommendations.skillGaps.map((gap, index) => (
              <div key={index} className="p-3 rounded-lg bg-space-800/60 border border-space-700">
                <h4 className="font-medium text-white mb-2">{gap.skill}</h4>
                <div className="mb-2">
                  <div className="flex justify-between mb-1 text-xs">
                    <span className="text-muted-foreground">Текущий уровень</span>
                    <span className="text-muted-foreground">{Math.round(gap.currentLevel * 100)}%</span>
                  </div>
                  <Progress value={gap.currentLevel * 100} className="h-2" />
                </div>
                <div className="mb-3">
                  <div className="flex justify-between mb-1 text-xs">
                    <span className="text-muted-foreground">Рекомендуемый уровень</span>
                    <span className="text-primary">{Math.round(gap.recommendedLevel * 100)}%</span>
                  </div>
                  <Progress value={gap.recommendedLevel * 100} className="h-2" />
                </div>
                <p className="text-sm text-muted-foreground">{gap.improvementSuggestion}</p>
              </div>
            ))}
          </TabsContent>
          
          {/* Персонализированная траектория */}
          <TabsContent value="path" className="space-y-5">
            {recommendations.personalizedLearningPath.map((week, index) => (
              <div key={index} className="bg-space-800/60 border border-space-700 rounded-lg overflow-hidden">
                <div className="bg-space-700 p-2 flex items-center">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2 text-primary text-sm">
                    {week.week}
                  </div>
                  <h4 className="font-medium text-white">Неделя {week.week}: {week.focus}</h4>
                </div>
                <div className="p-3">
                  <h5 className="text-sm font-medium text-muted-foreground mb-2">Цели обучения:</h5>
                  <ul className="space-y-1 mb-3">
                    {week.objectives.map((objective, idx) => (
                      <li key={idx} className="text-sm text-space-300 flex items-start">
                        <Star className="h-3 w-3 text-primary shrink-0 mt-1 mr-2" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <h5 className="text-sm font-medium text-muted-foreground mb-2">Рекомендуемые ресурсы:</h5>
                  <ul className="space-y-1">
                    {week.resources.map((resource, idx) => (
                      <li key={idx} className="text-sm text-space-300 flex items-start">
                        <div className="shrink-0 mt-0.5 mr-2">
                          {resource.type === "lesson" ? (
                            <BookOpen className="h-3 w-3 text-indigo-400" />
                          ) : resource.type === "module" ? (
                            <Compass className="h-3 w-3 text-green-400" />
                          ) : (
                            <Brain className="h-3 w-3 text-purple-400" />
                          )}
                        </div>
                        <span>{resource.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => refetch()}
          className="text-muted-foreground"
        >
          Обновить рекомендации
        </Button>
        
        <Button 
          variant="default" 
          size="sm"
          className="bg-primary hover:bg-primary/90"
          onClick={() => {
            if (recommendations.nextSteps[0]?.link) {
              navigate(recommendations.nextSteps[0].link);
            }
          }}
        >
          Начать обучение
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
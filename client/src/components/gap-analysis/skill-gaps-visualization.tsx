import React, { useState, useEffect } from "react";
import { UserSkillGap, Skill } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowUpRight, BookOpen, Brain, Info, RefreshCw } from "lucide-react";

interface SkillGapsVisualizationProps {
  userId: number;
}

export function SkillGapsVisualization({ userId }: SkillGapsVisualizationProps) {
  const [skillGaps, setSkillGaps] = useState<UserSkillGap[]>([]);
  const [skills, setSkills] = useState<Map<number, Skill>>(new Map());
  const [recommendedCourseIds, setRecommendedCourseIds] = useState<number[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    // Устанавливаем флаги для предотвращения бесконечных запросов при ошибках
    let isComponentMounted = true;
    let requestAttempted = false;
    
    const fetchData = async () => {
      // Проверяем, был ли уже выполнен запрос и монтирован ли компонент
      if (requestAttempted || !isComponentMounted) return;
      
      requestAttempted = true;
      await loadSkillGaps();
    };
    
    fetchData();
    
    // Очищаем эффект и предотвращаем выполнение запросов после размонтирования
    return () => {
      isComponentMounted = false;
    };
  }, [userId]);

  // Загрузка пробелов в навыках
  const loadSkillGaps = async () => {
    try {
      setIsLoading(true);
      
      // Получаем пробелы в навыках
      const gapsResponse = await apiRequest("GET", `/api/gap-analysis/gaps/${userId}`);
      
      // Проверяем статус ответа
      if (gapsResponse.status === 401) {
        // Если получили 401 Unauthorized, показываем ошибку и прекращаем загрузку
        toast({
          title: "Ошибка авторизации",
          description: "Для доступа к анализу пробелов необходимо авторизоваться",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      const gaps = await gapsResponse.json();
      
      // Если пробелов нет, запускаем анализ
      if (gaps.length === 0) {
        await performGapAnalysis();
        return;
      }
      
      setSkillGaps(gaps);
      
      // Загружаем информацию о всех навыках
      // Этот эндпоинт еще нужно реализовать на сервере
      await loadSkillsData();
      
      // Получаем рекомендованные курсы
      await loadRecommendations();
      
      setIsLoading(false);
    } catch (error) {
      console.error("Ошибка при загрузке пробелов в навыках:", error);
      toast({
        title: "Ошибка при загрузке данных",
        description: "Не удалось загрузить данные о пробелах в навыках",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Эта функция должна получать данные о навыках с сервера
  // Пока используем стаб - это нужно доработать позже
  const loadSkillsData = async () => {
    // TODO: Реализовать API для получения информации о навыках
    const skillsMap = new Map<number, Skill>();
    
    // Временное решение: создаем имена навыков на основе ID
    skillGaps.forEach(gap => {
      if (!skillsMap.has(gap.skillId)) {
        const skill: Skill = {
          id: gap.skillId,
          name: getSkillNameById(gap.skillId),
          description: "Описание навыка",
          category: "programming", // Пример категории по умолчанию
          parentSkillId: null,
          createdAt: new Date()
        };
        skillsMap.set(gap.skillId, skill);
      }
    });
    
    setSkills(skillsMap);
  };

  // Вспомогательная функция для получения имени навыка по ID
  // Это временное решение, пока нет полного API для навыков
  const getSkillNameById = (skillId: number): string => {
    const skillNames: Record<number, string> = {
      1: "Python базовый",
      2: "SQL",
      3: "Статистика",
      4: "Алгоритмы машинного обучения",
      5: "Глубокое обучение",
      6: "Визуализация данных",
      7: "Этика ИИ",
      8: "Правовые основы ИИ"
    };
    
    return skillNames[skillId] || `Навык #${skillId}`;
  };

  // Загрузка рекомендаций курсов
  const loadRecommendations = async () => {
    try {
      const recommendationsResponse = await apiRequest(
        "GET", 
        `/api/gap-analysis/recommendations/${userId}`
      );
      const data = await recommendationsResponse.json();
      
      if (data.recommendedCourseIds) {
        setRecommendedCourseIds(data.recommendedCourseIds);
      }
    } catch (error) {
      console.error("Ошибка при загрузке рекомендаций курсов:", error);
    }
  };

  // Запуск анализа пробелов
  const performGapAnalysis = async () => {
    try {
      setIsAnalyzing(true);
      
      const analyzeResponse = await apiRequest(
        "POST", 
        `/api/gap-analysis/analyze/${userId}`
      );
      const newGaps = await analyzeResponse.json();
      
      setSkillGaps(newGaps);
      
      // Загружаем информацию о навыках и рекомендации
      await loadSkillsData();
      await loadRecommendations();
      
      toast({
        title: "Анализ завершен",
        description: `Выявлено ${newGaps.length} пробелов в навыках`,
      });
      
      setIsAnalyzing(false);
      setIsLoading(false);
    } catch (error) {
      console.error("Ошибка при выполнении анализа пробелов:", error);
      toast({
        title: "Ошибка анализа",
        description: "Не удалось выполнить анализ пробелов в навыках",
        variant: "destructive",
      });
      setIsAnalyzing(false);
      setIsLoading(false);
    }
  };

  // Отображение для состояния загрузки
  if (isLoading) {
    return (
      <Card className="h-[400px] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-10 w-10 text-primary animate-spin mx-auto mb-4" />
          <p>Загрузка данных о навыках...</p>
        </div>
      </Card>
    );
  }

  // Отображение, если пробелов не найдено
  if (skillGaps.length === 0) {
    return (
      <Card className="h-[400px] flex items-center justify-center">
        <div className="text-center p-6">
          <Brain className="h-16 w-16 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Пробелов в навыках не обнаружено</h3>
          <p className="text-muted-foreground mb-4">
            Мы не нашли значительных пробелов в ваших навыках. Вы можете запустить повторный анализ или продолжить обучение.
          </p>
          <Button 
            onClick={performGapAnalysis} 
            disabled={isAnalyzing}
            className="mx-auto"
          >
            {isAnalyzing ? "Анализируем..." : "Запустить анализ"}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="gaps" className="w-full">
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="gaps">Пробелы в навыках</TabsTrigger>
          <TabsTrigger value="recommendations">Рекомендации</TabsTrigger>
        </TabsList>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={performGapAnalysis} 
          disabled={isAnalyzing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
          {isAnalyzing ? "Анализируем..." : "Обновить анализ"}
        </Button>
      </div>

      <TabsContent value="gaps" className="mt-0">
        <Card>
          <CardHeader>
            <CardTitle>Пробелы в ваших навыках</CardTitle>
            <CardDescription>
              На основе анализа ваших текущих навыков и требований курсов мы выявили следующие пробелы
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {skillGaps
                .sort((a, b) => (b.priority || 0) - (a.priority || 0)) // Сортировка по приоритету с проверкой на null
                .map((gap) => (
                  <div key={gap.skillId} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-lg">
                          {skills.get(gap.skillId)?.name || `Навык #${gap.skillId}`}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {skills.get(gap.skillId)?.description || "Описание недоступно"}
                        </p>
                      </div>
                      <div className="bg-primary/10 text-primary rounded-full px-2 py-1 text-xs">
                        Приоритет: {gap.priority}
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Текущий уровень: {gap.currentLevel}</span>
                        <span>Желаемый уровень: {gap.desiredLevel}</span>
                      </div>
                      <div className="relative pt-1">
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-secondary">
                          <Progress 
                            value={(gap.currentLevel / gap.desiredLevel) * 100} 
                            className="h-2"
                          />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 flex">
                          <div 
                            className="border-r border-primary h-3" 
                            style={{ 
                              left: `${(gap.currentLevel / gap.desiredLevel) * 100}%`,
                              position: 'absolute'
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="recommendations" className="mt-0">
        <Card>
          <CardHeader>
            <CardTitle>Рекомендуемые курсы</CardTitle>
            <CardDescription>
              На основе выявленных пробелов в навыках мы подобрали для вас следующие курсы
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recommendedCourseIds.length === 0 ? (
              <div className="text-center py-10">
                <Info className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                <p>Рекомендации курсов пока недоступны</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Пройдите больше курсов, чтобы получить персонализированные рекомендации
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recommendedCourseIds.map((courseId) => (
                  <div
                    key={courseId}
                    className="border rounded-lg p-4 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">Курс #{courseId}</h3>
                        <p className="text-sm text-muted-foreground">
                          Этот курс поможет преодолеть пробелы в ваших навыках
                        </p>
                      </div>
                      <BookOpen className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Button variant="link" className="mt-2 h-8 px-0" asChild>
                      <a href={`/course/${courseId}`}>
                        Перейти к курсу <ArrowUpRight className="ml-1 h-3 w-3" />
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export default SkillGapsVisualization;
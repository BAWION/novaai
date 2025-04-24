import React, { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SkillGapsVisualization } from "@/components/gap-analysis/skill-gaps-visualization";
import { RadarSkillChart } from "@/components/gap-analysis/radar-skill-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserSkillGap, Skill } from "@shared/schema";
import { Loader2, BrainCircuit, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

const GapAnalysisPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [skillGaps, setSkillGaps] = useState<UserSkillGap[]>([]);
  const [skills, setSkills] = useState<Map<number, Skill>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [isSeedingData, setIsSeedingData] = useState(false);

  useEffect(() => {
    if (user) {
      loadSkillGapsData();
    }
  }, [user]);

  const loadSkillGapsData = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Получаем пробелы в навыках
      const gapsResponse = await apiRequest("GET", `/api/gap-analysis/gaps/${user.id}`);
      const gaps = await gapsResponse.json();
      
      setSkillGaps(gaps);
      
      // Загружаем информацию о навыках (временное решение)
      const skillsMap = new Map<number, Skill>();
      
      gaps.forEach((gap: UserSkillGap) => {
        if (!skillsMap.has(gap.skillId)) {
          const skill: Skill = {
            id: gap.skillId,
            name: getSkillNameById(gap.skillId),
            description: "Описание навыка",
            category: "programming", // Пример категории по умолчанию
            createdAt: new Date()
          };
          skillsMap.set(gap.skillId, skill);
        }
      });
      
      setSkills(skillsMap);
      setIsLoading(false);
    } catch (error) {
      console.error("Ошибка при загрузке данных Gap-анализа:", error);
      toast({
        title: "Ошибка при загрузке данных",
        description: "Не удалось загрузить данные анализа навыков",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Временное решение для имен навыков
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

  // Для разработки: создание тестовых данных
  const seedTestData = async () => {
    try {
      setIsSeedingData(true);
      
      const response = await apiRequest("POST", "/api/gap-analysis/seed-test-data");
      const result = await response.json();
      
      toast({
        title: "Данные созданы",
        description: "Тестовые данные для Gap-анализа успешно созданы",
      });
      
      // Перезагружаем данные после создания
      if (user) {
        await loadSkillGapsData();
      }
      
      setIsSeedingData(false);
    } catch (error) {
      console.error("Ошибка при создании тестовых данных:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать тестовые данные",
        variant: "destructive",
      });
      setIsSeedingData(false);
    }
  };

  // Если пользователь не авторизован, показываем сообщение
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background/80 to-background">
        <Card className="w-[400px] shadow-lg">
          <CardHeader>
            <CardTitle>Требуется авторизация</CardTitle>
            <CardDescription>
              Для доступа к анализу навыков необходимо войти в систему
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Button onClick={() => navigate("/login")}>Войти в систему</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-4"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>
        <h1 className="text-3xl font-bold">Анализ пробелов в знаниях</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Левая колонка с информацией */}
        <div className="lg:col-span-1">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>О Gap-анализе</CardTitle>
              <CardDescription>
                Определите свои пробелы в знаниях и получите рекомендации
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Gap-анализ использует информацию о ваших текущих навыках и сравнивает их с требованиями различных курсов, 
                чтобы выявить области, требующие улучшения.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/20 p-2 rounded-full">
                    <BrainCircuit className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Персонализированный анализ</p>
                    <p className="text-xs text-muted-foreground">Основан на вашем прогрессе и активности</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="bg-primary/20 p-2 rounded-full">
                    <BrainCircuit className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Рекомендации курсов</p>
                    <p className="text-xs text-muted-foreground">Подобраны специально для заполнения пробелов</p>
                  </div>
                </div>
              </div>
              
              {/* Кнопка для создания тестовых данных (только для разработки) */}
              <div className="mt-6 pt-6 border-t border-muted">
                <p className="text-xs text-muted-foreground mb-2">Инструменты для тестирования:</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={seedTestData}
                  disabled={isSeedingData}
                  className="w-full"
                >
                  {isSeedingData ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Создание данных...
                    </>
                  ) : (
                    "Создать тестовые данные"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Правая колонка с визуализацией */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <Card className="h-[500px] flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
                <p>Загрузка данных анализа...</p>
              </div>
            </Card>
          ) : (
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Подробности</TabsTrigger>
                <TabsTrigger value="radar">Радар навыков</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-0">
                <SkillGapsVisualization userId={user.id} />
              </TabsContent>
              
              <TabsContent value="radar" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Радар навыков</CardTitle>
                    <CardDescription>
                      Визуализация ваших текущих и желаемых уровней навыков
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    {skillGaps.length === 0 ? (
                      <div className="text-center py-10">
                        <BrainCircuit className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p>Нет данных для визуализации</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Запустите анализ, чтобы увидеть радар навыков
                        </p>
                      </div>
                    ) : (
                      <div className="w-full flex justify-center">
                        <RadarSkillChart 
                          skillGaps={skillGaps} 
                          skills={skills} 
                          size={400} 
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default GapAnalysisPage;
import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowLeft, ArrowRight, BookOpen, Clock, Video, FileText, HelpCircle, Target, LightbulbIcon, PuzzleIcon, BookOpenCheck, ThumbsUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import ReactMarkdown from "react-markdown";

interface LessonStructure {
  id: number;
  lessonId: number;
  hook: string;
  explanation: string;
  demo: string;
  practice: string;
  reflection: string;
}

interface UserProgress {
  userId: number;
  lessonId: number;
  hookCompleted: boolean;
  explanationCompleted: boolean;
  demoCompleted: boolean;
  practiceCompleted: boolean;
  reflectionCompleted: boolean;
  practiceScore: number;
  timeSpentSeconds: number;
  timeSpentIncrement?: boolean; // Добавляем поле для инкремента времени
}

interface MicroLessonStructureProps {
  lessonId: number;
  userId: number;
  onComplete?: () => void;
}

export function MicroLessonStructure({ lessonId, userId, onComplete }: MicroLessonStructureProps) {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<string>("hook");
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [timeSpent, setTimeSpent] = useState<number>(0);

  // Запрос данных структуры урока
  const { data: lessonStructure, isLoading: structureLoading } = useQuery<LessonStructure>({
    queryKey: [`/api/lessons/${lessonId}/structure`],
    enabled: !!lessonId,
  });

  // Запрос прогресса пользователя
  const { data: userProgress, isLoading: progressLoading } = useQuery<UserProgress>({
    queryKey: [`/api/lessons/${lessonId}/progress`],
    enabled: !!lessonId,
  });

  // Мутация для обновления прогресса пользователя
  const updateProgressMutation = useMutation({
    mutationFn: async (data: Partial<UserProgress>) => {
      const res = await fetch(`/api/lessons/${lessonId}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        throw new Error("Не удалось обновить прогресс");
      }
      
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/lessons/${lessonId}/progress`] });
      queryClient.setQueryData([`/api/lessons/${lessonId}/progress`], data);
      
      // Проверка, если все секции завершены
      if (
        data.hookCompleted &&
        data.explanationCompleted &&
        data.demoCompleted &&
        data.practiceCompleted &&
        data.reflectionCompleted
      ) {
        toast({
          title: "Урок завершен!",
          description: "Все части урока завершены. Отличная работа!",
          variant: "default",
        });
        
        // Вызываем переданный коллбэк завершения
        if (onComplete) {
          onComplete();
        }
      }
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `Не удалось обновить прогресс: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Обновляем таймер при переходе между разделами
  useEffect(() => {
    // Для отслеживания времени, проведенного на странице
    const currentTimer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    
    setTimer(currentTimer);
    
    return () => {
      if (timer) clearInterval(timer);
      // При размонтировании компонента сохраняем время
      if (timeSpent > 0) {
        updateProgressMutation.mutate({
          timeSpentSeconds: timeSpent,
          timeSpentIncrement: true
        });
      }
    };
  }, []);

  // Функция для перехода к следующему разделу
  const goToNextSection = () => {
    if (!userProgress) return;
    
    // Отмечаем текущий раздел как завершенный
    const updatedData: Partial<UserProgress> = {};
    
    switch (activeSection) {
      case "hook":
        updatedData.hookCompleted = true;
        setActiveSection("explanation");
        break;
      case "explanation":
        updatedData.explanationCompleted = true;
        setActiveSection("demo");
        break;
      case "demo":
        updatedData.demoCompleted = true;
        setActiveSection("practice");
        break;
      case "practice":
        updatedData.practiceCompleted = true;
        setActiveSection("reflection");
        break;
      case "reflection":
        updatedData.reflectionCompleted = true;
        break;
    }
    
    // Если есть данные для обновления, отправляем запрос
    if (Object.keys(updatedData).length > 0) {
      updateProgressMutation.mutate(updatedData);
    }
  };

  // Функция для перехода к предыдущему разделу
  const goToPreviousSection = () => {
    switch (activeSection) {
      case "explanation":
        setActiveSection("hook");
        break;
      case "demo":
        setActiveSection("explanation");
        break;
      case "practice":
        setActiveSection("demo");
        break;
      case "reflection":
        setActiveSection("practice");
        break;
    }
  };

  // Вычисляем прогресс в процентах
  const calculateProgress = () => {
    if (!userProgress) return 0;
    
    let completed = 0;
    const total = 5; // 5 секций
    
    if (userProgress.hookCompleted) completed++;
    if (userProgress.explanationCompleted) completed++;
    if (userProgress.demoCompleted) completed++;
    if (userProgress.practiceCompleted) completed++;
    if (userProgress.reflectionCompleted) completed++;
    
    return (completed / total) * 100;
  };

  // Если данные загружаются
  if (structureLoading || progressLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-sm">Загрузка структуры урока...</p>
        </div>
      </div>
    );
  }

  // Если структура урока не найдена
  if (!lessonStructure) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Структура урока не найдена</CardTitle>
          <CardDescription>
            Для этого урока еще не создана микроструктура. Используйте основное содержимое урока.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6">
            <BookOpen className="h-16 w-16 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">
              Микроструктура урока (hook-explain-demo-practice-reflect) будет доступна в следующих версиях.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Проверяем, завершен ли уже урок
  const isLessonCompleted = userProgress && 
    userProgress.hookCompleted && 
    userProgress.explanationCompleted && 
    userProgress.demoCompleted && 
    userProgress.practiceCompleted && 
    userProgress.reflectionCompleted;

  // Если урок уже пройден полностью
  if (isLessonCompleted) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Урок завершен</CardTitle>
            <Badge variant="success" className="bg-green-500 text-white">
              100% Завершено
            </Badge>
          </div>
          <CardDescription>
            Вы успешно прошли все части этого урока
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <p className="mt-4 text-center">
              Поздравляем! Вы завершили все разделы этого урока и освоили материал. 
              Вы можете просмотреть любой раздел повторно, выбрав его ниже.
            </p>
            
            <Tabs defaultValue="hook" value={activeSection} onValueChange={setActiveSection} className="w-full mt-6">
              <TabsList className="grid grid-cols-5">
                <TabsTrigger value="hook">Крючок</TabsTrigger>
                <TabsTrigger value="explanation">Объяснение</TabsTrigger>
                <TabsTrigger value="demo">Демонстрация</TabsTrigger>
                <TabsTrigger value="practice">Практика</TabsTrigger>
                <TabsTrigger value="reflection">Рефлексия</TabsTrigger>
              </TabsList>
              
              <TabsContent value="hook" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Вступление</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-lg max-w-none dark:prose-invert">
                    <ReactMarkdown>{lessonStructure.hook}</ReactMarkdown>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="explanation" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Объяснение</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-lg max-w-none dark:prose-invert">
                    <ReactMarkdown>{lessonStructure.explanation}</ReactMarkdown>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="demo" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Демонстрация</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-lg max-w-none dark:prose-invert">
                    <ReactMarkdown>{lessonStructure.demo}</ReactMarkdown>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="practice" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Практика</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-lg max-w-none dark:prose-invert">
                    <ReactMarkdown>{lessonStructure.practice}</ReactMarkdown>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reflection" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Рефлексия</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-lg max-w-none dark:prose-invert">
                    <ReactMarkdown>{lessonStructure.reflection}</ReactMarkdown>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Рендеринг активного раздела
  const renderActiveSection = () => {
    switch (activeSection) {
      case "hook":
        return (
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  <span className="flex items-center">
                    <LightbulbIcon className="w-5 h-5 mr-2 text-yellow-500" />
                    Вступление
                  </span>
                </CardTitle>
                <Badge variant={userProgress?.hookCompleted ? "success" : "outline"}>
                  {userProgress?.hookCompleted ? "Завершено" : "Актуально"}
                </Badge>
              </div>
              <CardDescription>
                В этом разделе вы ознакомитесь с ключевыми моментами урока
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm">
              <ReactMarkdown>{lessonStructure.hook}</ReactMarkdown>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div></div>
              <Button onClick={goToNextSection} disabled={updateProgressMutation.isPending}>
                {updateProgressMutation.isPending ? "Обработка..." : "Далее"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        );
        
      case "explanation":
        return (
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  <span className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                    Объяснение
                  </span>
                </CardTitle>
                <Badge variant={userProgress?.explanationCompleted ? "success" : "outline"}>
                  {userProgress?.explanationCompleted ? "Завершено" : "Актуально"}
                </Badge>
              </div>
              <CardDescription>
                Изучите основные концепции и теорию
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm">
              <ReactMarkdown>{lessonStructure.explanation}</ReactMarkdown>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button variant="outline" onClick={goToPreviousSection}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад
              </Button>
              <Button onClick={goToNextSection} disabled={updateProgressMutation.isPending}>
                {updateProgressMutation.isPending ? "Обработка..." : "Далее"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        );
        
      case "demo":
        return (
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  <span className="flex items-center">
                    <Video className="w-5 h-5 mr-2 text-purple-500" />
                    Демонстрация
                  </span>
                </CardTitle>
                <Badge variant={userProgress?.demoCompleted ? "success" : "outline"}>
                  {userProgress?.demoCompleted ? "Завершено" : "Актуально"}
                </Badge>
              </div>
              <CardDescription>
                Наглядные примеры и демонстрации концепций
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm">
              <ReactMarkdown>{lessonStructure.demo}</ReactMarkdown>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button variant="outline" onClick={goToPreviousSection}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад
              </Button>
              <Button onClick={goToNextSection} disabled={updateProgressMutation.isPending}>
                {updateProgressMutation.isPending ? "Обработка..." : "Далее"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        );
        
      case "practice":
        return (
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  <span className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-red-500" />
                    Практика
                  </span>
                </CardTitle>
                <Badge variant={userProgress?.practiceCompleted ? "success" : "outline"}>
                  {userProgress?.practiceCompleted ? "Завершено" : "Актуально"}
                </Badge>
              </div>
              <CardDescription>
                Применение изученного материала на практике
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm">
              <ReactMarkdown>{lessonStructure.practice}</ReactMarkdown>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button variant="outline" onClick={goToPreviousSection}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад
              </Button>
              <Button onClick={goToNextSection} disabled={updateProgressMutation.isPending}>
                {updateProgressMutation.isPending ? "Обработка..." : "Далее"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        );
        
      case "reflection":
        return (
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  <span className="flex items-center">
                    <BookOpenCheck className="w-5 h-5 mr-2 text-green-500" />
                    Рефлексия
                  </span>
                </CardTitle>
                <Badge variant={userProgress?.reflectionCompleted ? "success" : "outline"}>
                  {userProgress?.reflectionCompleted ? "Завершено" : "Актуально"}
                </Badge>
              </div>
              <CardDescription>
                Подведение итогов и осмысление изученного
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm">
              <ReactMarkdown>{lessonStructure.reflection}</ReactMarkdown>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button variant="outline" onClick={goToPreviousSection}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад
              </Button>
              <Button 
                onClick={() => {
                  updateProgressMutation.mutate({ reflectionCompleted: true });
                  if (onComplete) {
                    onComplete();
                  }
                }} 
                disabled={updateProgressMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {updateProgressMutation.isPending ? "Завершение..." : "Завершить урок"}
                <CheckCircle className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Прогресс урока */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Прогресс урока</h3>
          <span className="text-sm text-muted-foreground">{Math.round(calculateProgress())}%</span>
        </div>
        <Progress value={calculateProgress()} className="h-2" />
        <div className="grid grid-cols-5 mt-2">
          <div 
            className={`flex flex-col items-center ${userProgress?.hookCompleted ? 'text-green-500' : 'text-muted-foreground'}`}
            onClick={() => setActiveSection("hook")}
          >
            <LightbulbIcon className={`h-4 w-4 ${activeSection === "hook" ? 'text-primary' : ''}`} />
            <span className="text-xs mt-1 cursor-pointer">Крючок</span>
          </div>
          <div 
            className={`flex flex-col items-center ${userProgress?.explanationCompleted ? 'text-green-500' : 'text-muted-foreground'}`}
            onClick={() => setActiveSection("explanation")}
          >
            <BookOpen className={`h-4 w-4 ${activeSection === "explanation" ? 'text-primary' : ''}`} />
            <span className="text-xs mt-1 cursor-pointer">Объяснение</span>
          </div>
          <div 
            className={`flex flex-col items-center ${userProgress?.demoCompleted ? 'text-green-500' : 'text-muted-foreground'}`}
            onClick={() => setActiveSection("demo")}
          >
            <Video className={`h-4 w-4 ${activeSection === "demo" ? 'text-primary' : ''}`} />
            <span className="text-xs mt-1 cursor-pointer">Демо</span>
          </div>
          <div 
            className={`flex flex-col items-center ${userProgress?.practiceCompleted ? 'text-green-500' : 'text-muted-foreground'}`}
            onClick={() => setActiveSection("practice")}
          >
            <Target className={`h-4 w-4 ${activeSection === "practice" ? 'text-primary' : ''}`} />
            <span className="text-xs mt-1 cursor-pointer">Практика</span>
          </div>
          <div 
            className={`flex flex-col items-center ${userProgress?.reflectionCompleted ? 'text-green-500' : 'text-muted-foreground'}`}
            onClick={() => setActiveSection("reflection")}
          >
            <BookOpenCheck className={`h-4 w-4 ${activeSection === "reflection" ? 'text-primary' : ''}`} />
            <span className="text-xs mt-1 cursor-pointer">Рефлексия</span>
          </div>
        </div>
      </div>
      
      {/* Отображение текущего активного раздела */}
      {renderActiveSection()}
    </div>
  );
}
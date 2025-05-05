import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { queryClient } from "@/lib/queryClient";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModuleAccordion } from "@/components/courses/module-accordion";
import { Loader2, BookOpen, CheckCircle, Lock, Clock, Trophy } from "lucide-react";
import { CourseOutline } from "@/components/courses/course-outline";
import { ResumeBanner } from "@/components/courses/resume-banner";
import { AIAssistantPanel } from "@/components/courses/ai-assistant-panel";

// Типы данных курса
interface Lesson {
  id: number;
  title: string;
  description: string;
  content: string;
  type: string;
  orderIndex: number;
  estimatedDuration: number;
  completed?: boolean;
  progress?: number;
}

interface Module {
  id: number;
  title: string;
  description: string;
  orderIndex: number;
  estimatedDuration: number;
  lessons: Lesson[];
  completed?: boolean;
  progress?: number;
}

interface Course {
  id: number;
  title: string;
  description: string;
  difficulty: number;
  level: string;
  modules: number;
  estimatedDuration: number;
  icon: string;
  tags: string[];
  color: string;
  category: string;
  access: string;
  objectives: string[];
  prerequisites: string[];
  skillsGained: string[];
}

export default function AILiteracyCoursePage() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [currentModuleId, setCurrentModuleId] = useState<number | null>(null);
  const [currentLessonId, setCurrentLessonId] = useState<number | null>(null);

  // Проверка аутентификации
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    }
  }, [user, isAuthenticated, navigate]);

  // Запрос информации о курсе
  const { data: course, isLoading: courseLoading } = useQuery<Course>({
    queryKey: ["/api/courses/slug/ai-literacy-101"],
    enabled: !!user,
  });

  // Запрос модулей курса
  const { data: modules, isLoading: modulesLoading } = useQuery<Module[]>({
    queryKey: ["/api/courses/ai-literacy-101/modules"],
    enabled: !!course?.id,
  });

  // Запрос прогресса пользователя
  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: ["/api/courses/progress/user"],
    enabled: !!user,
  });

  // Мутация для обновления прогресса
  const updateProgressMutation = useMutation({
    mutationFn: async ({ courseId, data }: { courseId: number, data: any }) => {
      const res = await fetch(`/api/courses/${courseId}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        throw new Error("Не удалось обновить прогресс");
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses/progress/user"] });
      toast({
        title: "Прогресс обновлен",
        description: "Ваш прогресс по курсу успешно сохранен",
        variant: "default",
      });
    },
    onError: (err) => {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить прогресс: " + err.message,
        variant: "destructive",
      });
    },
  });

  // Получаем данные урока
  const { data: currentLesson, isLoading: lessonLoading } = useQuery<Lesson>({
    queryKey: ["/api/lessons", currentLessonId],
    enabled: !!currentLessonId,
  });

  // Обработка завершения урока
  const handleLessonComplete = (lessonId: number) => {
    if (!course) return;
    
    updateProgressMutation.mutate({
      courseId: course.id,
      data: {
        progress: calculateNewProgress(),
        completedModules: calculateCompletedModules(),
      }
    });
    
    toast({
      title: "Урок завершен",
      description: "Поздравляем с завершением урока!",
      variant: "default",
    });
  };

  // Вычисление прогресса курса на основе завершенных уроков
  const calculateNewProgress = () => {
    // Здесь должна быть логика вычисления прогресса
    return 25; // Пример значения
  };

  // Вычисление количества завершенных модулей
  const calculateCompletedModules = () => {
    // Здесь должна быть логика подсчета завершенных модулей
    return 1; // Пример значения
  };

  // Загрузка данных
  if (courseLoading || modulesLoading || progressLoading) {
    return (
      <DashboardLayout title="AI Literacy 101">
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Загрузка курса...</span>
        </div>
      </DashboardLayout>
    );
  }

  // Если курс не найден
  if (!course) {
    return (
      <DashboardLayout title="Курс не найден">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold">Курс не найден</h1>
          <p className="mt-2 text-muted-foreground">Проверьте URL или выберите другой курс</p>
          <Button className="mt-4" onClick={() => navigate("/courses")}>
            Вернуться к курсам
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={course.title || "AI Literacy 101"}>
      <div className="container mx-auto py-8 px-4">
        {/* Заголовок курса */}
        <Glassmorphism className="p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start">
            <div>
              <div className="flex items-center">
                <span className="text-3xl mr-3">{course.icon}</span>
                <h1 className="text-3xl font-bold">{course.title}</h1>
              </div>
              <p className="mt-2 text-lg text-muted-foreground">{course.description}</p>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline" className="bg-primary/10">
                  {course.level}
                </Badge>
                <Badge variant="outline" className="bg-primary/10">
                  <Clock className="mr-1 h-3 w-3" /> {course.estimatedDuration} часов
                </Badge>
                <Badge variant="outline" className="bg-primary/10">
                  {course.category}
                </Badge>
                {course.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="bg-primary/10">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 w-full md:w-auto">
              <Card className="w-full md:w-64">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Прогресс курса</CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={25} className="h-2 mb-2" />
                  <div className="text-sm text-muted-foreground">
                    Завершено 25% курса
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => setActiveTab("modules")}>
                    Продолжить обучение
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </Glassmorphism>

        {/* Основной контент */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Левая колонка (2/3 ширины) */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Обзор</TabsTrigger>
                <TabsTrigger value="modules">Модули</TabsTrigger>
                <TabsTrigger value="lessons">Уроки</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                {/* Баннер продолжения обучения */}
                <ResumeBanner
                  courseTitle={course.title}
                  lastLesson="Определение искусственного интеллекта"
                  progress={25}
                  onContinue={() => {
                    setActiveTab("lessons");
                    setCurrentLessonId(1); // Установка ID последнего урока
                  }}
                />
                
                {/* Цели обучения */}
                <Card>
                  <CardHeader>
                    <CardTitle>Цели обучения</CardTitle>
                    <CardDescription>
                      После прохождения курса вы сможете:
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 list-disc pl-5">
                      {course.objectives.map((objective, index) => (
                        <li key={index}>{objective}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                {/* Предварительные требования */}
                <Card>
                  <CardHeader>
                    <CardTitle>Предварительные требования</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 list-disc pl-5">
                      {course.prerequisites.map((prereq, index) => (
                        <li key={index}>{prereq}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                {/* Получаемые навыки */}
                <Card>
                  <CardHeader>
                    <CardTitle>Получаемые навыки</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {course.skillsGained.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="modules">
                <CourseOutline
                  modules={[
                    {
                      id: 1,
                      title: "Основы ИИ — что такое искусственный интеллект?",
                      description: "Понимание базовых концепций и терминологии искусственного интеллекта",
                      completed: false,
                      progress: 25,
                      lessons: [
                        {
                          id: 1,
                          title: "Определение искусственного интеллекта",
                          completed: true,
                          type: "text",
                          duration: 60
                        },
                        {
                          id: 2,
                          title: "Отличие ИИ от других технологий",
                          completed: false,
                          type: "text",
                          duration: 60
                        },
                        {
                          id: 3,
                          title: "Типы искусственного интеллекта",
                          completed: false,
                          type: "text",
                          duration: 90
                        },
                        {
                          id: 4,
                          title: "Мифы и заблуждения об ИИ",
                          completed: false,
                          type: "quiz",
                          duration: 60
                        }
                      ]
                    },
                    {
                      id: 2,
                      title: "История искусственного интеллекта",
                      description: "Ключевые этапы развития ИИ от философских концепций до современных систем",
                      completed: false,
                      progress: 0,
                      lessons: [
                        {
                          id: 5,
                          title: "Философские корни ИИ",
                          completed: false,
                          type: "text",
                          duration: 60
                        },
                        {
                          id: 6,
                          title: "Рождение ИИ как науки (1940-1950-е)",
                          completed: false,
                          type: "text",
                          duration: 60
                        },
                        {
                          id: 7,
                          title: "Периоды расцвета и упадка (1960-1990-е)",
                          completed: false,
                          type: "text",
                          duration: 90
                        },
                        {
                          id: 8,
                          title: "Современная эра ИИ (2000-н.в.)",
                          completed: false,
                          type: "text",
                          duration: 60
                        }
                      ]
                    }
                  ]}
                  onModuleSelect={(moduleId) => {
                    setCurrentModuleId(moduleId);
                    setActiveTab("lessons");
                  }}
                  onLessonSelect={(lessonId) => {
                    setCurrentLessonId(lessonId);
                    setActiveTab("lessons");
                  }}
                />
              </TabsContent>
              
              <TabsContent value="lessons">
                {currentLesson ? (
                  <Card className="shadow-lg">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>{currentLesson.title}</CardTitle>
                        <Badge variant="outline">
                          {currentLesson.type === "text" ? "Текст" : 
                           currentLesson.type === "video" ? "Видео" : 
                           currentLesson.type === "quiz" ? "Тест" : 
                           "Интерактивный"}
                        </Badge>
                      </div>
                      <CardDescription>{currentLesson.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="prose prose-lg max-w-none dark:prose-invert">
                      {/* Контент урока в формате Markdown */}
                      <div dangerouslySetInnerHTML={{ __html: "Контент урока будет отображаться здесь" }} />
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">Предыдущий урок</Button>
                      <Button onClick={() => handleLessonComplete(currentLesson.id)}>
                        Завершить урок <CheckCircle className="ml-2 h-4 w-4" />
                      </Button>
                      <Button>Следующий урок</Button>
                    </CardFooter>
                  </Card>
                ) : (
                  <div className="text-center p-12">
                    <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">Выберите урок</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Выберите модуль и урок из раздела "Модули" для начала обучения
                    </p>
                    <Button className="mt-4" onClick={() => setActiveTab("modules")}>
                      Перейти к модулям
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Правая колонка (1/3 ширины) */}
          <div>
            <AIAssistantPanel
              title="AI-ассистент курса"
              description="Задайте вопрос по материалам курса"
              onSendMessage={(message) => {
                console.log("Сообщение отправлено:", message);
                // Здесь будет логика отправки сообщения ассистенту
                toast({
                  title: "Сообщение отправлено",
                  description: "Получение ответа от ассистента...",
                });
              }}
            />
            
            {/* Дополнительные ресурсы */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Дополнительные ресурсы</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-primary hover:underline flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      История искусственного интеллекта
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-primary hover:underline flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Глоссарий терминов ИИ
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-primary hover:underline flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Этические аспекты использования ИИ
                    </a>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            {/* Статистика прохождения */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Ваша статистика</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Уроков завершено</span>
                    <span className="font-medium">1 из 4</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Времени затрачено</span>
                    <span className="font-medium">1ч 30м</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Последняя активность</span>
                    <span className="font-medium">Сегодня</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
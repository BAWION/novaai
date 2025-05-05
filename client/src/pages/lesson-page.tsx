import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowLeft, ArrowRight, BookOpen, Clock, Video, FileText, HelpCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIAssistantPanel } from "@/components/courses/ai-assistant-panel";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { queryClient } from "@/lib/queryClient";
import { LessonView } from "@/components/courses/lesson-view";
import ReactMarkdown from "react-markdown";

interface Lesson {
  id: number;
  title: string;
  description: string;
  content: string;
  type: string;
  orderIndex: number;
  moduleId: number;
  estimatedDuration: number;
  completed?: boolean;
  progress?: number;
}

interface Module {
  id: number;
  title: string;
  description: string;
  orderIndex: number;
  courseId: number;
  lessons: Lesson[];
}

interface LessonPageProps {
  inCourseContext?: string;
}

export default function LessonPage({ inCourseContext }: LessonPageProps = {}) {
  const { moduleId, lessonId } = useParams();
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("content");
  const [isLoading, setIsLoading] = useState(true);

  // Проверка аутентификации
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
    }
  }, [user, isAuthenticated, navigate]);
  
  // Проверяем валидность параметров URL
  useEffect(() => {
    if (!moduleId || !lessonId || isNaN(Number(moduleId)) || isNaN(Number(lessonId))) {
      console.error("Некорректные параметры URL:", { moduleId, lessonId });
    }
  }, [moduleId, lessonId]);
  
  // Определяем контекст курса для навигации
  const courseContext = inCourseContext || "ai-literacy-101";
  
  console.log('LessonPage: Параметры URL:', { moduleId, lessonId, inCourseContext, courseContext });

  // Запрос данных урока
  const { data: lesson, isLoading: lessonLoading } = useQuery<Lesson>({
    queryKey: [`/api/lessons/${lessonId}`],
    enabled: !!lessonId,
    queryFn: async () => {
      try {
        console.log(`Загрузка урока с ID ${lessonId}`);
        const response = await fetch(`/api/lessons/${lessonId}`);
        if (!response.ok) {
          throw new Error('Не удалось загрузить урок');
        }
        const lessonData = await response.json();
        console.log('Полученные данные урока:', lessonData);
        return lessonData;
      } catch (error) {
        console.error('Ошибка при загрузке урока:', error);
        throw error;
      }
    }
  });

  // Запрос данных модуля
  const { data: module, isLoading: moduleLoading } = useQuery<Module>({
    queryKey: [`/api/modules/${moduleId}`],
    enabled: !!moduleId,
    queryFn: async () => {
      try {
        console.log(`Загрузка модуля с ID ${moduleId}`);
        const response = await fetch(`/api/modules/${moduleId}`);
        if (!response.ok) {
          throw new Error('Не удалось загрузить модуль');
        }
        
        const moduleData = await response.json();
        
        // Если у нас уже есть урок, но он не включен в уроки модуля, 
        // дополнительно загрузим уроки модуля
        if (!moduleData.lessons || moduleData.lessons.length === 0) {
          console.log(`Загрузка уроков для модуля ${moduleId}`);
          const lessonsResponse = await fetch(`/api/modules/${moduleId}/lessons`);
          if (lessonsResponse.ok) {
            moduleData.lessons = await lessonsResponse.json();
          }
        }
        
        return moduleData;
      } catch (error) {
        console.error('Ошибка при загрузке модуля:', error);
        throw error;
      }
    }
  });

  // Мутация для обновления прогресса
  const completeLessonMutation = useMutation({
    mutationFn: async () => {
      if (!lesson) throw new Error("Урок не найден");
      
      const res = await fetch(`/api/lessons/${lessonId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      
      if (!res.ok) {
        throw new Error("Не удалось отметить урок как завершенный");
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/modules", moduleId, "lessons"] });
      queryClient.invalidateQueries({ queryKey: ["/api/courses/progress/user"] });
      
      toast({
        title: "Урок завершен!",
        description: "Ваш прогресс сохранен. Переходим к следующему уроку.",
        variant: "default",
      });

      // Найти следующий урок в модуле
      if (module?.lessons) {
        const currentIndex = module.lessons.findIndex(l => l.id.toString() === lessonId);
        if (currentIndex !== -1 && currentIndex < module.lessons.length - 1) {
          const nextLesson = module.lessons[currentIndex + 1];
          // Перейти к следующему уроку (используя новый формат URL)
          navigate(`/courses/${courseContext}/modules/${moduleId}/lessons/${nextLesson.id}`);
        } else {
          // Если это последний урок в модуле, вернуться к странице курса
          navigate(`/courses/${courseContext}`);
        }
      }
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `Не удалось отметить урок как завершенный: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const handleLessonComplete = () => {
    completeLessonMutation.mutate();
  };

  // Функция для перехода к предыдущему уроку с использованием ReactQuery для плавного перехода
  const goToPreviousLesson = () => {
    if (!module?.lessons) return;
    
    const currentIndex = module.lessons.findIndex(l => l.id.toString() === lessonId);
    if (currentIndex > 0) {
      const prevLesson = module.lessons[currentIndex - 1];
      
      // Предварительно загружаем данные следующего урока, чтобы переход был плавным
      queryClient.prefetchQuery({
        queryKey: [`/api/lessons/${prevLesson.id}`],
        queryFn: async () => {
          const response = await fetch(`/api/lessons/${prevLesson.id}`);
          if (!response.ok) throw new Error('Не удалось загрузить урок');
          return response.json();
        }
      }).then(() => {
        // После предзагрузки делаем переход
        navigate(`/courses/${courseContext}/modules/${moduleId}/lessons/${prevLesson.id}`);
      });
    }
  };

  // Функция для перехода к следующему уроку с предзагрузкой
  const goToNextLesson = () => {
    if (!module?.lessons) return;
    
    const currentIndex = module.lessons.findIndex(l => l.id.toString() === lessonId);
    if (currentIndex !== -1 && currentIndex < module.lessons.length - 1) {
      const nextLesson = module.lessons[currentIndex + 1];
      
      // Предварительно загружаем данные следующего урока
      queryClient.prefetchQuery({
        queryKey: [`/api/lessons/${nextLesson.id}`],
        queryFn: async () => {
          const response = await fetch(`/api/lessons/${nextLesson.id}`);
          if (!response.ok) throw new Error('Не удалось загрузить урок');
          return response.json();
        }
      }).then(() => {
        // После предзагрузки делаем переход
        navigate(`/courses/${courseContext}/modules/${moduleId}/lessons/${nextLesson.id}`);
      });
    }
  };

  // Определить, является ли урок первым или последним в модуле
  const isFirstLesson = module?.lessons && module.lessons.findIndex(l => l.id.toString() === lessonId) === 0;
  const isLastLesson = module?.lessons && module.lessons.findIndex(l => l.id.toString() === lessonId) === module.lessons.length - 1;

  // Отладка: выводим содержимое урока и модуля
  useEffect(() => {
    if (lesson) {
      console.log('Текущий урок:', lesson);
      console.log('Содержимое урока:', lesson.content);
    }
    if (module) {
      console.log('Текущий модуль:', module);
    }
  }, [lesson, module]);

  // Отображение загрузки
  if (lessonLoading || moduleLoading) {
    return (
      <DashboardLayout title="Загрузка урока...">
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-lg">Загрузка урока...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Если урок не найден
  if (!lesson || !module) {
    return (
      <DashboardLayout title="Урок не найден">
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold">Урок не найден</h1>
          <p className="mt-2 text-muted-foreground">Проверьте URL или выберите другой урок</p>
          <Button className="mt-4" onClick={() => navigate(`/courses/${courseContext}`)}>
            Вернуться к курсу
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={`${module.title} | ${lesson.title}`}>
      <div className="container mx-auto py-6 px-4">
        {/* Навигационный заголовок */}
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(`/courses/${courseContext}`)}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Вернуться к курсу
          </Button>
          <div>
            <p className="text-sm text-muted-foreground">{module.title}</p>
            <h1 className="text-2xl font-bold">{lesson.title}</h1>
          </div>
        </div>

        {/* Основной контент */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Левая колонка (2/3 ширины) - Контент урока */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="content" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="content">Содержание</TabsTrigger>
                <TabsTrigger value="materials">Материалы</TabsTrigger>
                <TabsTrigger value="notes">Заметки</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content">
                <LessonView 
                  lessonId={lessonId || ''} 
                  moduleId={moduleId || ''} 
                  courseSlug={courseContext}
                  onComplete={handleLessonComplete}
                />
              </TabsContent>
              
              <TabsContent value="materials">
                <Card>
                  <CardHeader>
                    <CardTitle>Дополнительные материалы</CardTitle>
                    <CardDescription>
                      Ресурсы для углубленного изучения темы
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start p-4 border rounded-lg">
                      <FileText className="h-6 w-6 mr-4 text-primary" />
                      <div>
                        <h3 className="font-medium">Руководство по основам ИИ</h3>
                        <p className="text-sm text-muted-foreground">PDF, 2.3 MB</p>
                        <Button variant="link" className="p-0 h-auto mt-1">Скачать</Button>
                      </div>
                    </div>
                    <div className="flex items-start p-4 border rounded-lg">
                      <Video className="h-6 w-6 mr-4 text-primary" />
                      <div>
                        <h3 className="font-medium">Видеолекция: История развития ИИ</h3>
                        <p className="text-sm text-muted-foreground">MP4, 45 минут</p>
                        <Button variant="link" className="p-0 h-auto mt-1">Просмотреть</Button>
                      </div>
                    </div>
                    <div className="flex items-start p-4 border rounded-lg">
                      <BookOpen className="h-6 w-6 mr-4 text-primary" />
                      <div>
                        <h3 className="font-medium">Рекомендуемая литература</h3>
                        <p className="text-sm text-muted-foreground">Список книг и статей по теме</p>
                        <Button variant="link" className="p-0 h-auto mt-1">Открыть</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notes">
                <Card>
                  <CardHeader>
                    <CardTitle>Мои заметки</CardTitle>
                    <CardDescription>
                      Сохраняйте важные мысли и идеи во время обучения
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <textarea 
                      className="w-full min-h-[300px] p-4 border rounded-lg resize-none"
                      placeholder="Введите ваши заметки по этому уроку..."
                    ></textarea>
                  </CardContent>
                  <CardFooter className="justify-end">
                    <Button>Сохранить заметки</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Правая колонка (1/3 ширины) - ИИ-ассистент */}
          <div>
            <AIAssistantPanel
              title="Помощник по уроку"
              description="Задайте вопрос по материалам этого урока"
              onSendMessage={(message) => {
                console.log("Сообщение ассистенту:", message);
                // Здесь будет логика отправки сообщения ассистенту
              }}
            />
            
            {/* Подсказки по курсу */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                  Полезные подсказки
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <strong>Совет 1:</strong> Делайте заметки во время изучения материала, это поможет лучше запомнить информацию.
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <strong>Совет 2:</strong> Используйте ИИ-ассистента, если у вас возникли вопросы по материалу урока.
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <strong>Совет 3:</strong> После завершения урока попробуйте применить полученные знания на практике.
                </div>
              </CardContent>
            </Card>
            
            {/* Прогресс по модулю */}
            <Card className="mt-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Прогресс по модулю</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Общий прогресс</span>
                      <span>35%</span>
                    </div>
                    <Progress value={35} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    {module.lessons.map((moduleLesson) => (
                      <div 
                        key={moduleLesson.id}
                        className={`p-2 rounded-md flex items-center ${moduleLesson.id.toString() === lessonId ? 'bg-primary/20' : ''}`}
                      >
                        {moduleLesson.completed ? (
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        ) : moduleLesson.id.toString() === lessonId ? (
                          <div className="h-4 w-4 mr-2 bg-primary rounded-full"></div>
                        ) : (
                          <div className="h-4 w-4 mr-2 border rounded-full"></div>
                        )}
                        <span className={`text-sm ${moduleLesson.completed ? 'line-through opacity-70' : ''}`}>
                          {moduleLesson.title}
                        </span>
                      </div>
                    ))}
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
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

  // Запрос данных урока с предотвращением кэширования
  const { data: lesson, isLoading: lessonLoading } = useQuery<Lesson>({
    queryKey: [`/api/lessons/${lessonId}`, new Date().getTime()], // Добавляем timestamp для предотвращения кэширования
    enabled: !!lessonId,
    staleTime: 0, // Данные всегда считаются устаревшими
    gcTime: 0, // Отключаем кэширование (в TanStack Query v5 cacheTime заменён на gcTime)
    queryFn: async () => {
      try {
        console.log(`Загрузка урока с ID ${lessonId}, timestamp: ${new Date().getTime()}`);
        
        // Добавляем параметр запроса для предотвращения кэширования
        const timestamp = new Date().getTime();
        const url = `/api/lessons/${lessonId}?_t=${timestamp}`;
        
        const response = await fetch(url, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Не удалось загрузить урок: ${response.status} ${response.statusText}`);
        }
        
        const lessonData = await response.json();
        console.log('Полученные данные урока:', JSON.stringify(lessonData, null, 2));
        
        // Проверка наличия контента
        if (!lessonData.content) {
          console.warn(`Урок с ID ${lessonId} не содержит контента!`);
        } else {
          console.log(`Урок с ID ${lessonId} содержит контент длиной ${lessonData.content.length} символов`);
        }
        
        return lessonData;
      } catch (error) {
        console.error('Ошибка при загрузке урока:', error);
        throw error;
      }
    }
  });

  // Запрос данных модуля с предотвращением кэширования
  const { data: module, isLoading: moduleLoading } = useQuery<Module>({
    queryKey: [`/api/modules/${moduleId}`, new Date().getTime()], // Добавляем timestamp для предотвращения кэширования
    enabled: !!moduleId,
    staleTime: 0, // Данные всегда считаются устаревшими
    gcTime: 0, // Отключаем кэширование (в TanStack Query v5 cacheTime заменён на gcTime)
    queryFn: async () => {
      try {
        console.log(`Загрузка модуля с ID ${moduleId}, timestamp: ${new Date().getTime()}`);
        
        // Добавляем параметр запроса для предотвращения кэширования
        const timestamp = new Date().getTime();
        const url = `/api/modules/${moduleId}?_t=${timestamp}`;
        
        const response = await fetch(url, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Не удалось загрузить модуль: ${response.status} ${response.statusText}`);
        }
        
        const moduleData = await response.json();
        console.log('Полученные данные модуля:', JSON.stringify(moduleData, null, 2));
        
        // Если у нас уже есть урок, но он не включен в уроки модуля, 
        // дополнительно загрузим уроки модуля
        if (!moduleData.lessons || moduleData.lessons.length === 0) {
          console.log(`Загрузка уроков для модуля ${moduleId}`);
          const lessonsUrl = `/api/modules/${moduleId}/lessons?_t=${timestamp}`;
          const lessonsResponse = await fetch(lessonsUrl, {
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache', 
              'Expires': '0'
            }
          });
          
          if (lessonsResponse.ok) {
            moduleData.lessons = await lessonsResponse.json();
            console.log(`Загружено ${moduleData.lessons.length} уроков для модуля ${moduleId}`);
          } else {
            console.error(`Ошибка при загрузке уроков для модуля ${moduleId}: ${lessonsResponse.status}`);
          }
        } else {
          console.log(`Модуль ${moduleId} уже содержит ${moduleData.lessons.length} уроков`);
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
                {/* Прямое отображение урока вместо компонента LessonView */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>{lesson.title}</CardTitle>
                      <Badge variant="outline">
                        {lesson.type === "text" ? "Текст" : 
                        lesson.type === "video" ? "Видео" : 
                        lesson.type === "quiz" ? "Тест" : 
                        "Интерактивный"}
                      </Badge>
                    </div>
                    <CardDescription>
                      <div className="flex items-center mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{lesson.estimatedDuration} минут</span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="prose prose-lg max-w-none dark:prose-invert">
                    {/* Отладочная информация */}
                    <div className="p-4 mb-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
                      <h3 className="font-semibold">Информация об уроке:</h3>
                      <p>ID урока: {lesson.id}</p>
                      <p>Название: {lesson.title}</p>
                      <p>Тип: {lesson.type}</p>
                      <p>Длительность: {lesson.estimatedDuration} минут</p>
                      <p>Контент присутствует: {lesson.content ? 'Да' : 'Нет'}</p>
                      <p>Длина контента: {lesson.content ? lesson.content.length : 0} символов</p>
                      {lesson.content && (
                        <div className="mt-2">
                          <p>Начало контента:</p>
                          <pre className="bg-gray-100 p-2 mt-1 text-xs overflow-auto max-h-20">
                            {lesson.content.substring(0, 100)}...
                          </pre>
                        </div>
                      )}
                    </div>
                    
                    {lesson.type === "text" ? (
                      <div>
                        {lesson.content ? (
                          <div className="lesson-content">
                            <ReactMarkdown>{lesson.content}</ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-muted-foreground italic">Содержимое урока отсутствует</p>
                        )}
                      </div>
                    ) : lesson.type === "video" ? (
                      <div>
                        {lesson.content ? (
                          <div>
                            <ReactMarkdown>{lesson.content}</ReactMarkdown>
                            <div className="aspect-video bg-muted rounded-lg mt-4 flex items-center justify-center">
                              <Video className="h-16 w-16 text-muted-foreground" />
                              <p className="ml-4">Видеоматериал урока</p>
                            </div>
                          </div>
                        ) : (
                          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                            <Video className="h-16 w-16 text-muted-foreground" />
                            <p className="ml-4">Видеоматериал недоступен</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        {lesson.content ? (
                          <ReactMarkdown>{lesson.content}</ReactMarkdown>
                        ) : (
                          <p className="text-muted-foreground italic">Содержимое урока отсутствует</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter className="flex justify-between border-t pt-6">
                    <Button 
                      variant="outline" 
                      onClick={goToPreviousLesson}
                      disabled={isFirstLesson}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Предыдущий урок
                    </Button>
                    
                    <Button onClick={handleLessonComplete}>
                      Завершить урок <CheckCircle className="ml-2 h-4 w-4" />
                    </Button>
                    
                    <Button 
                      onClick={goToNextLesson}
                      disabled={isLastLesson}
                    >
                      Следующий урок
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
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
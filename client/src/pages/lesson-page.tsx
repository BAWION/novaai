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
import { CheckCircle, ArrowLeft, ArrowRight, BookOpen, Clock, Video, FileText, HelpCircle, LayersIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIAssistantPanel } from "@/components/courses/ai-assistant-panel";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { queryClient } from "@/lib/queryClient";
import ReactMarkdown from "react-markdown";
import { MicroLessonStructure } from "@/components/courses/micro-lesson-structure";

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
        return await response.json();
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

  // Мутация для обновления прогресса через новую систему управления курсами
  const completeLessonMutation = useMutation({
    mutationFn: async () => {
      if (!lesson) throw new Error("Урок не найден");
      
      const res = await fetch(`/api/course-management/complete-lesson/${lessonId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      });
      
      if (!res.ok) {
        throw new Error("Не удалось завершить урок");
      }
      
      return res.json();
    },
    onSuccess: (data) => {
      // Инвалидируем запросы курса и прогресса
      queryClient.invalidateQueries({ queryKey: [`/api/modules/${moduleId}/lessons`] });
      queryClient.invalidateQueries({ queryKey: [`/api/lessons/${lessonId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/modules/${moduleId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/learning/progress"] });
      queryClient.invalidateQueries({ queryKey: ["/api/course-management/user-progress/2"] });
      queryClient.invalidateQueries({ queryKey: ["/api/course-management/course/2"] });
      
      // Вручную обновляем текущий урок в кэше
      const currentLessonKey = [`/api/lessons/${lessonId}`];
      const currentLesson = queryClient.getQueryData<Lesson>(currentLessonKey);
      
      if (currentLesson) {
        queryClient.setQueryData(currentLessonKey, {
          ...currentLesson,
          completed: true
        });
      }
      
      // Обновляем список уроков модуля
      const moduleLessonsKey = [`/api/modules/${moduleId}/lessons`];
      const moduleLessons = queryClient.getQueryData<Lesson[]>(moduleLessonsKey);
      
      if (moduleLessons) {
        const updatedLessons = moduleLessons.map(l => 
          l.id.toString() === lessonId 
            ? { ...l, completed: true } 
            : l
        );
        queryClient.setQueryData(moduleLessonsKey, updatedLessons);
      }
      
      toast({
        title: "Урок завершен!",
        description: data.skillsUpdated ? 
          "Урок завершен. Skills DNA обновлен!" : 
          "Ваш прогресс сохранен. Переходим к следующему уроку.",
        variant: "default",
      });

      // Найти следующий урок в модуле
      if (module?.lessons) {
        const currentIndex = module.lessons.findIndex(l => l.id.toString() === lessonId);
        if (currentIndex !== -1 && currentIndex < module.lessons.length - 1) {
          const nextLesson = module.lessons[currentIndex + 1];
          // Перейти к следующему уроку (используя новый формат URL)
          setTimeout(() => {
            navigate(`/courses/${courseContext}/modules/${moduleId}/lessons/${nextLesson.id}`);
          }, 1000);
        } else {
          // Если это последний урок в модуле, вернуться к странице курса
          setTimeout(() => {
            navigate(`/courses/${courseContext}`);
          }, 1000);
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

  // Функция для перехода к предыдущему уроку
  const goToPreviousLesson = () => {
    if (!module?.lessons) return;
    
    const currentIndex = module.lessons.findIndex(l => l.id.toString() === lessonId);
    if (currentIndex > 0) {
      const prevLesson = module.lessons[currentIndex - 1];
      navigate(`/courses/${courseContext}/modules/${moduleId}/lessons/${prevLesson.id}`);
    }
  };

  // Функция для перехода к следующему уроку
  const goToNextLesson = () => {
    if (!module?.lessons) return;
    
    const currentIndex = module.lessons.findIndex(l => l.id.toString() === lessonId);
    if (currentIndex !== -1 && currentIndex < module.lessons.length - 1) {
      const nextLesson = module.lessons[currentIndex + 1];
      navigate(`/courses/${courseContext}/modules/${moduleId}/lessons/${nextLesson.id}`);
    }
  };

  // Определить, является ли урок первым или последним в модуле
  const isFirstLesson = module?.lessons && module.lessons.findIndex(l => l.id.toString() === lessonId) === 0;
  const isLastLesson = module?.lessons && module.lessons.findIndex(l => l.id.toString() === lessonId) === module.lessons.length - 1;

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
                <TabsTrigger value="microlesson">
                  <div className="flex items-center">
                    <LayersIcon className="w-4 h-4 mr-2" />
                    Микроструктура
                  </div>
                </TabsTrigger>
                <TabsTrigger value="materials">Материалы</TabsTrigger>
                <TabsTrigger value="notes">Заметки</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content">
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
                  <CardContent className="prose prose-lg max-w-none dark:prose-invert bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm">
                    {lesson.type === "text" ? (
                      <div>
                        {lesson.content ? (
                          <div className="dark:text-white text-black">
                            <ReactMarkdown>{lesson.content}</ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-muted-foreground italic">Содержимое урока отсутствует</p>
                        )}
                      </div>
                    ) : lesson.type === "video" ? (
                      <div>
                        {lesson.content ? (
                          // Если в содержимом есть ссылка на видео, можно ее отобразить
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
                    ) : lesson.type === "quiz" ? (
                      <div>
                        {lesson.content ? (
                          <div>
                            <ReactMarkdown>{lesson.content}</ReactMarkdown>
                            <div className="mt-6 space-y-6 border-t pt-6">
                              <h3 className="text-xl font-medium">Тестирование знаний</h3>
                              <p className="text-muted-foreground">Ответьте на вопросы, чтобы проверить свое понимание материала</p>
                              {/* В будущем здесь будут отображаться вопросы теста */}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <p className="text-muted-foreground italic">Содержимое теста отсутствует</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        {lesson.content ? (
                          <div>
                            <ReactMarkdown>{lesson.content}</ReactMarkdown>
                            <div className="mt-6 border-t pt-6">
                              <h3 className="text-xl font-medium">Практическое задание</h3>
                              <p className="text-muted-foreground">Интерактивная часть урока будет доступна в будущих версиях</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-10">
                            <FileText className="h-16 w-16 text-muted-foreground" />
                            <p className="mt-4">Интерактивное содержимое урока отсутствует</p>
                          </div>
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
                    <Button 
                      onClick={handleLessonComplete}
                      disabled={completeLessonMutation.isPending}
                    >
                      {completeLessonMutation.isPending ? (
                        <>Отмечаем как завершенный...</>
                      ) : (
                        <>Завершить урок <CheckCircle className="ml-2 h-4 w-4" /></>
                      )}
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
              
              <TabsContent value="microlesson">
                {/* Здесь вставляем компонент микроструктуры урока */}
                {user ? (
                  <MicroLessonStructure 
                    lessonId={parseInt(lessonId || "0")}
                    userId={user.id}
                    onComplete={handleLessonComplete}
                  />
                ) : (
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>Требуется авторизация</CardTitle>
                      <CardDescription>
                        Для доступа к микроструктуре урока необходимо авторизоваться
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center justify-center py-6">
                        <p className="text-muted-foreground">
                          Пожалуйста, войдите в систему для доступа к полной функциональности.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
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
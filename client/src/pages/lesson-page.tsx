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
import { CheckCircle, ArrowLeft, ArrowRight, BookOpen, Clock, Video, FileText, HelpCircle, LayersIcon, Edit3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIAssistantPanel } from "@/components/courses/ai-assistant-panel";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { queryClient } from "@/lib/queryClient";
import ReactMarkdown from "react-markdown";
import { ProgressiveLessonStructure } from "@/components/courses/progressive-lesson-structure";
import { ContextualAIAssistant } from "@/components/courses/contextual-ai-assistant";
import InlineQuiz from "@/components/courses/inline-quiz";

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
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [isAIMinimized, setIsAIMinimized] = useState(false);
  const [userSkillsLevel, setUserSkillsLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [useMicroLessons, setUseMicroLessons] = useState(false);

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

  // Создаем короткие части для урока (по 2-5 минут каждая)
  const createMicroSections = (lessonContent: string) => {
    if (!lessonContent) return [];

    const sections = [
      {
        id: 'introduction',
        title: 'Введение',
        content: lessonContent.substring(0, Math.min(500, lessonContent.length)),
        estimatedMinutes: 2,
        type: 'text' as const
      },
      {
        id: 'main-content',
        title: 'Основной материал',
        content: lessonContent.substring(500, Math.min(1500, lessonContent.length)),
        estimatedMinutes: 5,
        type: 'text' as const
      },
      {
        id: 'examples',
        title: 'Примеры и практика',
        content: lessonContent.substring(1500, Math.min(2500, lessonContent.length)),
        estimatedMinutes: 4,
        type: 'interactive' as const
      },
      {
        id: 'summary',
        title: 'Заключение',
        content: lessonContent.substring(2500) || "Подведение итогов урока и ключевые выводы.",
        estimatedMinutes: 2,
        type: 'text' as const
      }
    ].filter(section => section.content.length > 50);

    return sections;
  };

  const microSections = lesson ? createMicroSections(lesson.content) : [];

  const handleMicroSectionComplete = (sectionId: string) => {
    console.log(`Micro section completed: ${sectionId}`);
  };

  const handleToggleAIAssistant = () => {
    setShowAIAssistant(!showAIAssistant);
    setIsAIMinimized(false);
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

  // Если урок найден, отображаем его
  if (lesson) {
    return (
      <DashboardLayout title={lesson.title}>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Основное содержимое урока */}
            <div className="lg:col-span-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-5 mb-6">
                  <TabsTrigger value="content">
                    <div className="flex flex-col items-center">
                      <BookOpen className="h-4 w-4 mb-1" />
                      Урок
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="quiz">
                    <div className="flex flex-col items-center">
                      <HelpCircle className="h-4 w-4 mb-1" />
                      Квиз
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="microlesson">
                    <div className="flex flex-col items-center">
                      <LayersIcon className="h-4 w-4 mb-1" />
                      Микро-уроки
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="materials">
                    <div className="flex flex-col items-center">
                      <FileText className="h-4 w-4 mb-1" />
                      Материалы
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="notes">
                    <div className="flex flex-col items-center">
                      <Edit3 className="h-4 w-4 mb-1" />
                      Заметки
                    </div>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="content">
                  {useMicroLessons && microSections.length > 0 ? (
                    <MicroLessonNavigation
                      sections={microSections}
                      lessonTitle={lesson.title}
                      onSectionComplete={handleMicroSectionComplete}
                      onLessonComplete={handleLessonComplete}
                    />
                  ) : (
                    <Card className="shadow-lg">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle>{lesson.title}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {lesson.type === "text" ? "Текст" : 
                               lesson.type === "video" ? "Видео" : 
                               lesson.type === "quiz" ? "Тест" : 
                               "Интерактивный"}
                            </Badge>
                          </div>
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
                          onClick={goToNextLesson}
                          disabled={isLastLesson}
                        >
                          Следующий урок
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="quiz">
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>Проверка знаний</CardTitle>
                      <CardDescription>
                        Квиз по материалам урока "{lesson.title}"
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <InlineQuiz
                        lessonId={lesson.id}
                        questions={[
                          {
                            id: "q1",
                            type: "multiple-choice",
                            question: "Что из перечисленного НЕ является характеристикой современного искусственного интеллекта?",
                            options: [
                              "Способность обучаться на данных",
                              "Распознавание образов и речи",
                              "Полная независимость от человеческого контроля",
                              "Обработка естественного языка"
                            ],
                            correctAnswer: 2,
                            explanation: "Современный ИИ не является полностью независимым от человеческого контроля. ИИ-системы требуют надзора, настройки и проверки результатов человеком."
                          },
                          {
                            id: "q2",
                            type: "multiple-choice",
                            question: "Какой тип ИИ существует в настоящее время?",
                            options: [
                              "Только общий искусственный интеллект (AGI)",
                              "Только узкий искусственный интеллект (ANI)",
                              "И узкий, и общий искусственный интеллект",
                              "Сверхинтеллект (ASI)"
                            ],
                            correctAnswer: 1,
                            explanation: "В настоящее время существует только узкий (слабый) ИИ - системы, специализирующиеся на конкретных задачах. Общий ИИ пока остается целью исследований."
                          },
                          {
                            id: "q3",
                            type: "true-false",
                            question: "Машинное обучение является подразделом искусственного интеллекта",
                            correctAnswer: 0,
                            explanation: "Верно. Машинное обучение - это метод достижения искусственного интеллекта, при котором системы автоматически улучшаются через опыт."
                          },
                          {
                            id: "q4",
                            type: "multiple-choice",
                            question: "Выберите все области применения современного ИИ:",
                            options: [
                              "Медицинская диагностика",
                              "Автономные транспортные средства", 
                              "Рекомендательные системы",
                              "Все перечисленное"
                            ],
                            correctAnswer: 3,
                            explanation: "ИИ активно применяется во всех перечисленных областях: от медицинской диагностики до автопилотов и персонализации контента."
                          }
                        ]}
                        onComplete={(score: number) => {
                          toast({
                            title: "Квиз завершен!",
                            description: `Ваш результат: ${score}%`,
                            variant: "default"
                          });
                        }}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="microlesson">
                  {user ? (
                    <ProgressiveLessonStructure 
                      lessonId={parseInt(lessonId || "0")}
                      userId={user.id}
                      onComplete={handleLessonComplete}
                    />
                  ) : (
                    <Card className="shadow-lg">
                      <CardHeader>
                        <CardTitle>Требуется авторизация</CardTitle>
                        <CardDescription>
                          Для доступа к пошаговому изучению урока необходимо авторизоваться
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
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>Материалы урока</CardTitle>
                      <CardDescription>
                        Дополнительные материалы и ресурсы для изучения
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Дополнительные материалы будут доступны в будущих версиях
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="notes">
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>Заметки</CardTitle>
                      <CardDescription>
                        Ваши личные заметки по уроку
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Функция заметок будет доступна в будущих версиях
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Боковая панель с функциями урока */}
            <div className="lg:col-span-1 space-y-4">
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Функции урока</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left overflow-hidden"
                    onClick={() => setUseMicroLessons(!useMicroLessons)}
                  >
                    <LayersIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">
  {useMicroLessons ? "Обычный вид" : "По частям"}
                    </span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left overflow-hidden"
                    onClick={handleToggleAIAssistant}
                  >
                    <HelpCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">AI-Помощник</span>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Прогресс урока</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Завершение</span>
                      <span>{lesson.completed ? "100%" : "0%"}</span>
                    </div>
                    <Progress 
                      value={lesson.completed ? 100 : 0} 
                      className="h-2"
                    />
                    <Button
                      className="w-full text-left overflow-hidden"
                      onClick={handleLessonComplete}
                      disabled={completeLessonMutation.isPending || lesson.completed}
                    >
                      {completeLessonMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 flex-shrink-0"></div>
                          <span className="truncate">Завершение...</span>
                        </>
                      ) : lesson.completed ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">Завершено</span>
                        </>
                      ) : (
                        <span className="truncate">Завершить урок</span>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Контекстуальный AI-ассистент */}
          {showAIAssistant && lesson && (
            <ContextualAIAssistant
              lessonId={lesson.id}
              lessonTitle={lesson.title}
              lessonContent={lesson.content}
              userSkillsLevel={userSkillsLevel}
              isMinimized={isAIMinimized}
              onToggleMinimize={() => setIsAIMinimized(!isAIMinimized)}
              onClose={() => setShowAIAssistant(false)}
            />
          )}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Урок не найден">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto text-center">
          <CardHeader>
            <CardTitle>Урок не найден</CardTitle>
            <CardDescription>
              Урок с указанным ID не найден или недоступен
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Возможно, урок был удален или у вас нет доступа к нему
            </p>
            <Button onClick={() => navigate("/courses")}>
              Вернуться к курсам
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
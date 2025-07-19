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
import { CheckCircle, ArrowLeft, ArrowRight, BookOpen, Clock, Video, FileText, HelpCircle, Edit3, Save, Trash2, CheckSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { AIAssistantPanel } from "@/components/courses/ai-assistant-panel";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { queryClient } from "@/lib/queryClient";
import ReactMarkdown from "react-markdown";

import { ContextualAIAssistant } from "@/components/courses/contextual-ai-assistant";
import InlineQuiz from "@/components/courses/inline-quiz";
import AssignmentViewer from "@/components/assignments/assignment-viewer";

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
  const { moduleId, lessonId, courseSlug } = useParams();
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("content");
  const [isLoading, setIsLoading] = useState(true);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [isAIMinimized, setIsAIMinimized] = useState(false);
  const [userSkillsLevel, setUserSkillsLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');

  const [noteContent, setNoteContent] = useState("");
  const [isNoteSaving, setIsNoteSaving] = useState(false);

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
  
  // Получаем информацию о курсе по модулю для правильного формирования URL
  const { data: courseInfo } = useQuery({
    queryKey: [`/api/modules/${moduleId}/course`],
    enabled: !!moduleId,
    queryFn: async () => {
      const response = await fetch(`/api/modules/${moduleId}/course`);
      if (!response.ok) throw new Error('Failed to fetch course info');
      return await response.json();
    }
  });

  // Определяем контекст курса для навигации из URL или API
  const courseContext = courseSlug || courseInfo?.slug || inCourseContext || "ai-literacy-101";

  // Автоматическое перенаправление на правильный URL, если слаг курса не совпадает
  useEffect(() => {
    if (courseInfo?.slug && moduleId && lessonId && courseInfo.slug !== courseSlug && courseInfo.slug !== inCourseContext) {
      const correctUrl = `/courses/${courseInfo.slug}/modules/${moduleId}/lessons/${lessonId}`;
      console.log(`Перенаправляем на правильный URL: ${correctUrl}`);
      navigate(correctUrl, { replace: true });
    }
  }, [courseInfo, moduleId, lessonId, courseSlug, inCourseContext, navigate]);

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

  // Load lesson note
  const { data: lessonNote } = useQuery({
    queryKey: [`/api/lessons/${lessonId}/notes`],
    enabled: !!lessonId && !!user,
    queryFn: async () => {
      const response = await fetch(`/api/lessons/${lessonId}/notes`);
      if (!response.ok) {
        if (response.status === 404) return { content: "" };
        throw new Error('Не удалось загрузить заметку');
      }
      return await response.json();
    }
  });

  // Initialize note content when lesson note loads
  useEffect(() => {
    if (lessonNote) {
      setNoteContent(lessonNote.content || "");
    }
  }, [lessonNote]);

  // Load lesson assignments
  const { data: assignments, isLoading: assignmentsLoading } = useQuery({
    queryKey: [`/api/lessons/${lessonId}/assignments`],
    enabled: !!lessonId,
    queryFn: async () => {
      const response = await fetch(`/api/lessons/${lessonId}/assignments`);
      if (!response.ok) {
        if (response.status === 404) return [];
        throw new Error('Не удалось загрузить практические задания');
      }
      return await response.json();
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

  // Save lesson note mutation
  const saveNoteMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch(`/api/lessons/${lessonId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) {
        throw new Error('Не удалось сохранить заметку');
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/lessons/${lessonId}/notes`] });
      toast({
        title: "Заметка сохранена",
        description: "Ваша заметка успешно сохранена",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить заметку",
        variant: "destructive",
      });
    },
  });

  // Delete lesson note mutation
  const deleteNoteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/lessons/${lessonId}/notes`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Не удалось удалить заметку');
      }
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/lessons/${lessonId}/notes`] });
      setNoteContent("");
      toast({
        title: "Заметка удалена",
        description: "Заметка успешно удалена",
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить заметку",
        variant: "destructive",
      });
    },
  });

  const handleSaveNote = () => {
    if (!user) return;
    setIsNoteSaving(true);
    saveNoteMutation.mutate(noteContent, {
      onSettled: () => setIsNoteSaving(false),
    });
  };

  const handleDeleteNote = () => {
    if (!user) return;
    deleteNoteMutation.mutate();
  };

  const hasNoteChanged = noteContent !== (lessonNote?.content || "");

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
      <DashboardLayout title="">
        <div className="container mx-auto px-4 py-6">
          {/* Компактная навигация */}
          <div className="mb-6">
            {/* Хлебные крошки */}
            <div className="flex items-center text-sm text-white/60 mb-4">
              <button 
                className="hover:text-white transition"
                onClick={() => navigate("/courses")}
              >
                Курсы
              </button>
              <span className="mx-2">→</span>
              <button 
                className="hover:text-white transition"
                onClick={() => navigate(`/courses/${courseContext}`)}
              >
                {courseInfo?.title || "Курс"}
              </button>
              <span className="mx-2">→</span>
              <span className="text-white">{lesson.title}</span>
            </div>
            
            {/* Кнопка "К курсу" только на десктопе */}
            <div className="hidden sm:flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate(`/courses/${courseContext}`)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                К курсу
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Основное содержимое урока */}
            <div className="lg:col-span-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6 bg-space-800/30 border-white/10">
                  <TabsTrigger value="content" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span className="hidden sm:inline">Урок</span>
                  </TabsTrigger>
                  <TabsTrigger value="assignments" className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4" />
                    <span className="hidden sm:inline">Задания</span>
                    {assignments && assignments.length > 0 && (
                      <Badge variant="secondary" className="ml-1 h-5 text-xs bg-blue-500/20 text-blue-300">
                        {assignments.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="flex items-center gap-2">
                    <Edit3 className="h-4 w-4" />
                    <span className="hidden sm:inline">Заметки</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="content">
                  <Card className="shadow-lg border-white/10 bg-space-800/30 backdrop-blur-sm">
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="border-white/20">
                              {lesson.type === "text" ? "Текст" : 
                               lesson.type === "video" ? "Видео" : 
                               lesson.type === "quiz" ? "Тест" : 
                               "Интерактивный"}
                            </Badge>
                            <div className="flex items-center text-white/60">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{lesson.estimatedDuration} мин</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={handleToggleAIAssistant}
                            >
                              Помощь ИИ
                            </Button>
                          </div>
                        </div>
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
                              <div className="dark:text-white text-black">
                                <ReactMarkdown>{lesson.content}</ReactMarkdown>
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
                      <CardFooter className="border-t pt-6">
                        {/* Мобильная версия - вертикальные кнопки */}
                        <div className="flex flex-col gap-3 w-full sm:hidden">
                          <Button 
                            variant="outline" 
                            onClick={goToPreviousLesson}
                            disabled={isFirstLesson}
                            className="w-full"
                          >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Предыдущий урок
                          </Button>
                          <Button 
                            onClick={goToNextLesson}
                            disabled={isLastLesson}
                            className="w-full"
                          >
                            Следующий урок
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                        
                        {/* Десктопная версия - горизонтальные кнопки */}
                        <div className="hidden sm:flex justify-between w-full">
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
                        </div>
                      </CardFooter>
                    </Card>
                </TabsContent>
                


                <TabsContent value="assignments">
                  <Card className="shadow-lg border-white/10 bg-space-800/30 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckSquare className="h-5 w-5" />
                        Практические задания
                      </CardTitle>
                      <CardDescription>
                        Выполните задания для закрепления материала урока
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {assignmentsLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                          <p className="ml-3">Загрузка заданий...</p>
                        </div>
                      ) : (
                        <AssignmentViewer 
                          assignments={assignments || []}
                          lessonId={lesson.id}
                          onComplete={(assignmentId, score) => {
                            toast({
                              title: "Задание выполнено!",
                              description: `Получено баллов: ${score}`,
                              variant: "default"
                            });
                          }}
                        />
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="notes">
                  <Card className="shadow-lg border-white/10 bg-space-800/30 backdrop-blur-sm">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>Заметки к уроку</CardTitle>
                          <CardDescription>
                            Ваши личные заметки по уроку "{lesson?.title || 'Урок'}"
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          {noteContent.trim() && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleDeleteNote}
                              disabled={deleteNoteMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Удалить
                            </Button>
                          )}
                          <Button
                            size="sm"
                            onClick={handleSaveNote}
                            disabled={!hasNoteChanged || isNoteSaving || !user}
                            className="bg-primary hover:bg-primary/90"
                          >
                            {isNoteSaving ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                            ) : (
                              <Save className="h-4 w-4 mr-1" />
                            )}
                            Сохранить
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {!user ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground mb-4">
                            Войдите в систему, чтобы создавать заметки к урокам
                          </p>
                          <Button onClick={() => window.location.href = "/login"}>
                            Войти
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Textarea
                            placeholder="Введите ваши заметки по уроку..."
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            className="min-h-[300px] resize-y"
                          />
                          
                          {hasNoteChanged && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              Есть несохраненные изменения
                            </div>
                          )}

                          <div className="text-xs text-muted-foreground">
                            Заметки автоматически сохраняются в вашем профиле и доступны только вам.
                            Вы можете использовать их для запоминания ключевых моментов урока.
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Боковая панель с функциями урока */}
            <div className="lg:col-span-1 space-y-4 order-2 lg:order-none">
              
              {/* Мобильная версия - горизонтальные кнопки */}
              <div className="lg:hidden space-y-3 mb-4">
                {/* Кнопка К курсу для мобильной версии */}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate(`/courses/${courseContext}`)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  К курсу
                </Button>
                
                {/* Сетка функций */}
                <div className="grid grid-cols-2 gap-3">

                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-center border-dashed hover:border-solid transition-all duration-200"
                    style={{ 
                      minHeight: '55px', 
                      height: 'auto', 
                      padding: '8px 4px',
                      whiteSpace: 'normal'
                    }}
                    onClick={handleToggleAIAssistant}
                  >
                    <div className="flex flex-col items-center min-w-0">
                      <HelpCircle className="h-4 w-4 mb-1 flex-shrink-0 text-blue-500" />
                      <span 
                        className="font-medium text-center"
                        style={{ 
                          fontSize: '11px',
                          lineHeight: '1.2',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word'
                        }}
                      >
                        AI-Помощь
                      </span>
                    </div>
                  </Button>
                </div>
              </div>
              
              {/* Десктопная версия - полные карточки */}
              <div className="hidden lg:block space-y-4">
              
              <Card className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Функции урока</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">

                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full flex items-center justify-start text-left border-dashed hover:border-solid transition-all duration-200 h-auto min-h-[70px] p-3"
                    onClick={handleToggleAIAssistant}
                  >
                    <HelpCircle className="h-4 w-4 mr-3 flex-shrink-0 text-blue-500" />
                    <div className="flex flex-col items-start text-left flex-1 min-w-0">
                      <div className="text-sm font-medium leading-5 text-foreground">
                        AI-Помощник
                      </div>
                      <div className="text-xs text-muted-foreground leading-4 mt-1">
                        Помощь по уроку
                      </div>
                    </div>
                  </Button>
                </CardContent>
              </Card>

              <Card className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Прогресс урока</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Завершение</span>
                      <span className="font-medium">{lesson.completed ? "100%" : "0%"}</span>
                    </div>
                    <Progress 
                      value={lesson.completed ? 100 : 0} 
                      className="h-2 bg-muted"
                    />
                  </div>
                  
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-200 h-auto min-h-[60px] p-3"
                    onClick={handleLessonComplete}
                    disabled={completeLessonMutation.isPending || lesson.completed}
                  >
                    <div className="flex items-center justify-center w-full">
                      {completeLessonMutation.isPending ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3 flex-shrink-0"></div>
                          <span className="text-sm font-medium">
                            Завершение...
                          </span>
                        </>
                      ) : lesson.completed ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-3 flex-shrink-0 text-green-400" />
                          <span className="text-sm font-medium">
                            Завершено
                          </span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-3 flex-shrink-0" />
                          <span className="text-sm font-medium">
                            Завершить урок
                          </span>
                        </>
                      )}
                    </div>
                  </Button>
                  
                  {lesson.completed && (
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <p className="text-xs text-muted-foreground">Урок успешно завершен!</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              </div>
              
              {/* Мобильная версия прогресса */}
              <div className="lg:hidden">
                <Card className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">Прогресс</span>
                      <span className="text-sm font-medium">{lesson.completed ? "100%" : "0%"}</span>
                    </div>
                    <Progress 
                      value={lesson.completed ? 100 : 0} 
                      className="h-2 mb-3"
                    />
                    <Button
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-auto min-h-[50px] p-3"
                      onClick={handleLessonComplete}
                      disabled={completeLessonMutation.isPending || lesson.completed}
                      size="sm"
                    >
                      <div className="flex items-center justify-center w-full">
                        {completeLessonMutation.isPending ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 flex-shrink-0"></div>
                            <span className="text-sm font-medium">
                              Завершение...
                            </span>
                          </>
                        ) : lesson.completed ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2 text-green-400 flex-shrink-0" />
                            <span className="text-sm font-medium">
                              Завершено
                            </span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="text-sm font-medium">
                              Завершить урок
                            </span>
                          </>
                        )}
                      </div>
                    </Button>
                  </CardContent>
                </Card>
              </div>
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

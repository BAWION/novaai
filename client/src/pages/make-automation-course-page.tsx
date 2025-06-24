import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, BookOpen, Clock, CheckCircle, Play, Users, Star, Target, Zap, Bot, BarChart3 } from "lucide-react";
import { CourseOutline } from "@/components/courses/course-outline";
import { useAuth } from "@/hooks/useAuth";

interface Module {
  id: number;
  title: string;
  description: string;
  orderIndex: number;
  estimatedDuration: number;
  lessons: Lesson[];
}

interface Lesson {
  id: number;
  title: string;
  description: string;
  type: string;
  estimatedDuration: number;
  orderIndex: number;
  moduleId: number;
}

interface Course {
  id: number;
  title: string;
  description: string;
  slug: string;
  difficulty: string;
  estimatedDuration: number;
  modules: Module[];
}

export default function MakeAutomationCoursePage() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [expandedModuleIds, setExpandedModuleIds] = useState<number[]>([]);

  // Загрузка данных курса
  const { data: course, isLoading: courseLoading } = useQuery<Course>({
    queryKey: ["/api/courses/make-chatgpt-automation"],
    queryFn: async () => {
      const response = await fetch("/api/courses/make-chatgpt-automation");
      if (!response.ok) throw new Error("Failed to fetch course");
      return await response.json();
    }
  });

  // Загрузка модулей курса
  const { data: modules, isLoading: modulesLoading } = useQuery<Module[]>({
    queryKey: [`/api/courses/make-chatgpt-automation/modules`],
    enabled: !!course,
    queryFn: async () => {
      const response = await fetch(`/api/courses/make-chatgpt-automation/modules`);
      if (!response.ok) throw new Error("Failed to fetch modules");
      return await response.json();
    }
  });

  const handleLessonClick = (lessonId: number, moduleId: number) => {
    navigate(`/courses/make-chatgpt-automation/modules/${moduleId}/lessons/${lessonId}`);
  };

  const handleExpandToggle = (moduleId: number) => {
    setExpandedModuleIds(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const backToCatalog = () => {
    navigate("/courses");
  };

  // Статистика курса
  const totalLessons = modules?.reduce((acc, module) => acc + (module.lessons?.length || 0), 0) || 0;
  const totalDuration = modules?.reduce((acc, module) => 
    acc + (module.lessons?.reduce((lessonAcc, lesson) => lessonAcc + (lesson.estimatedDuration || 0), 0) || 0), 0
  ) || 0;

  if (courseLoading || modulesLoading) {
    return (
      <DashboardLayout title="Загрузка курса...">
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-lg">Загрузка курса...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout title="Курс не найден">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto text-center">
            <CardHeader>
              <CardTitle>Курс не найден</CardTitle>
              <CardDescription>
                Курс с указанным ID не найден или недоступен
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={backToCatalog}>
                Вернуться к каталогу курсов
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={course.title}>
      <div className="container mx-auto px-4 py-8">
        {/* Навигационный заголовок */}
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={backToCatalog}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            К каталогу курсов
          </Button>
          <div>
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <button 
                className="hover:text-primary transition"
                onClick={backToCatalog}
              >
                Курсы
              </button>
              <span className="mx-2">→</span>
              <span>Автоматизация бизнеса</span>
            </div>
            <h1 className="text-3xl font-bold">{course.title}</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Основная информация о курсе */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">{course.title}</CardTitle>
                    <CardDescription className="text-base">
                      {course.description}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="ml-4">
                    {course.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-sm text-muted-foreground">Модулей</p>
                    <p className="font-semibold">{modules?.length || 0}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-2">
                      <Zap className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-sm text-muted-foreground">Уроков</p>
                    <p className="font-semibold">{totalLessons}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-2">
                      <Clock className="h-6 w-6 text-purple-600" />
                    </div>
                    <p className="text-sm text-muted-foreground">Время</p>
                    <p className="font-semibold">{totalDuration} мин</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mx-auto mb-2">
                      <Bot className="h-6 w-6 text-orange-600" />
                    </div>
                    <p className="text-sm text-muted-foreground">ИИ+Авто</p>
                    <p className="font-semibold">100%</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Что вы изучите:</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      Создание автоматизаций без кода в Make.com
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      Интеграция ChatGPT для умных бизнес-процессов
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      Автоматизация email-маркетинга и контента
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      Умная обработка данных и документов
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      CRM-автоматизация и клиентский сервис
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      Продвинутые multi-step сценарии
                    </li>
                  </ul>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Практические проекты курса:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center">
                      <BarChart3 className="h-4 w-4 text-blue-600 mr-2" />
                      <span>Умный CRM-ассистент</span>
                    </div>
                    <div className="flex items-center">
                      <Bot className="h-4 w-4 text-purple-600 mr-2" />
                      <span>Контент-генератор для соцсетей</span>
                    </div>
                    <div className="flex items-center">
                      <Zap className="h-4 w-4 text-green-600 mr-2" />
                      <span>Автоматизация email-кампаний</span>
                    </div>
                    <div className="flex items-center">
                      <Target className="h-4 w-4 text-orange-600 mr-2" />
                      <span>Аналитический ассистент</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Структура курса */}
            <Card>
              <CardHeader>
                <CardTitle>Структура курса</CardTitle>
                <CardDescription>
                  {modules?.length || 0} модулей • {totalLessons} уроков • {totalDuration} минут
                </CardDescription>
              </CardHeader>
              <CardContent>
                {modules && (
                  <CourseOutline
                    modules={modules}
                    onModuleSelect={(moduleId) => {
                      setSelectedModuleId(moduleId);
                      if (!expandedModuleIds.includes(moduleId)) {
                        setExpandedModuleIds([...expandedModuleIds, moduleId]);
                      }
                    }}
                    onLessonSelect={handleLessonClick}
                    expandedModuleIds={expandedModuleIds}
                    onExpandToggle={handleExpandToggle}
                    completedLessons={[]}
                    currentLessonId={selectedLessonId}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Боковая панель */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Начать обучение</CardTitle>
                <CardDescription>
                  Практический курс автоматизации
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">Прогресс</span>
                    <span className="text-sm font-medium">0%</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>

                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => {
                    if (modules && modules[0]?.lessons && modules[0].lessons[0]) {
                      handleLessonClick(modules[0].lessons[0].id, modules[0].id);
                    }
                  }}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Начать курс
                </Button>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Инструменты курса</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Make.com (бесплатный план)</li>
                    <li>• OpenAI API (ChatGPT)</li>
                    <li>• Google Workspace</li>
                    <li>• Telegram/Slack</li>
                  </ul>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Для кого курс</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Предпринимателей</li>
                    <li>• Маркетологов</li>
                    <li>• Менеджеров проектов</li>
                    <li>• Всех, кто хочет автоматизировать рутину</li>
                  </ul>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-3">Результат</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 6+ готовых автоматизаций</li>
                    <li>• Экономия 2-4 часов в день</li>
                    <li>• Навыки no-code разработки</li>
                    <li>• Понимание ИИ-интеграций</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
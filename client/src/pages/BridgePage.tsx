import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SkillsRadarChart from "@/components/skills-radar-chart";
import { useUserProfile } from "@/context/user-profile-context";
import { useAuth } from "@/context/auth-context";
import { motion } from "framer-motion";
import { Compass, Map, ArrowRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Интерфейсы для отслеживания прогресса обучения
interface LearningProgress {
  courseId: number;
  progress: number;
  lastAccessed?: string;
  completed?: boolean;
  courseSlug?: string;
  courseTitle?: string;
}

/**
 * Компонент RoadmapWidget 
 * Упрощенный виджет дорожной карты обучения для страницы Капитанского Мостика
 */
const RoadmapWidget: React.FC<{ recommendedCourses?: RecommendedCourse[] }> = ({ recommendedCourses }) => {
  const { user } = useAuth();
  
  // Загрузка прогресса обучения пользователя
  const { data: learningProgress, isLoading } = useQuery({
    queryKey: ['/api/learning/progress'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/learning/progress');
      return await response.json() as LearningProgress[];
    },
    enabled: !!user?.id
  });
  
  // Загрузка последнего доступа к курсам
  const { data: lastAccessed } = useQuery({
    queryKey: ['/api/learning/last-accessed'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/learning/last-accessed');
      return await response.json() as Record<string, string>;
    },
    enabled: !!user?.id
  });
  
  // Загрузка данных курсов пользователя
  const { data: userCourses } = useQuery({
    queryKey: ['/api/courses/user'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/courses/user');
      return await response.json();
    },
    enabled: !!user?.id
  });
  
  // Загрузка общего списка курсов
  const { data: allCourses } = useQuery({
    queryKey: ['/api/courses'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/courses');
      return await response.json();
    },
    enabled: !!user?.id
  });
  
  // Определение текущего активного модуля
  const getActiveModule = () => {
    if (!learningProgress || learningProgress.length === 0) {
      return null;
    }
    
    // Находим курс с наибольшим прогрессом, который не завершен
    const inProgressCourses = learningProgress
      .filter(progress => progress.progress > 0 && progress.progress < 100)
      .sort((a, b) => b.progress - a.progress);
    
    if (inProgressCourses.length === 0) {
      return null;
    }
    
    // Находим информацию о курсе
    const activeCourse = inProgressCourses[0];
    const courseInfo = allCourses?.find((course: { id: number }) => course.id === activeCourse.courseId);
    
    return {
      id: activeCourse.courseId,
      title: courseInfo?.title || `Курс #${activeCourse.courseId}`,
      progress: activeCourse.progress,
      status: "in-progress",
      slug: courseInfo?.slug
    };
  };
  
  // Определение следующего рекомендуемого модуля
  const getNextModule = () => {
    // Если есть рекомендованные курсы и текущего активного модуля нет, используем первый рекомендуемый
    if (recommendedCourses && recommendedCourses.length > 0) {
      const activeModule = getActiveModule();
      
      // Исключаем текущий активный курс из рекомендаций
      const filteredRecommendations = activeModule 
        ? recommendedCourses.filter(course => course.id !== activeModule.id)
        : recommendedCourses;
      
      if (filteredRecommendations.length > 0) {
        return {
          id: filteredRecommendations[0].id,
          title: filteredRecommendations[0].title,
          status: "available",
          slug: filteredRecommendations[0].slug
        };
      }
    }
    
    // Если есть курсы, но нет рекомендаций или активного курса, используем первый доступный курс
    if (allCourses && allCourses.length > 0) {
      return {
        id: allCourses[0].id,
        title: allCourses[0].title,
        status: "available",
        slug: allCourses[0].slug
      };
    }
    
    // Если ничего не найдено, вернем фиксированное значение как резервный вариант
    return {
      id: 1,
      title: "AI Literacy 101",
      status: "available",
      slug: "ai-literacy-101"
    };
  };
  
  // Определение цвета прогресс-бара в зависимости от статуса
  const getProgressBarColor = (status: string) => {
    switch (status) {
      case "completed":
        return "from-green-500 to-emerald-500";
      case "in-progress": 
        return "from-[#6E3AFF] to-[#2EBAE1]";
      case "available":
        return "from-amber-500 to-orange-500";
      default:
        return "from-gray-600 to-gray-500";
    }
  };
  
  const activeModule = getActiveModule();
  const nextModule = getNextModule();
  
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg">Ваш путь обучения</CardTitle>
        <Link href="/roadmap">
          <Button variant="link" size="sm" className="gap-1">
            Полная карта
            <Map className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      
      <Separator className="bg-white/10" />
      
      <div className="space-y-4">
        {/* Текущий модуль */}
        {activeModule ? (
          <div className="bg-space-800/60 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#6E3AFF]/20 flex items-center justify-center text-[#6E3AFF]">
                <Compass className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <div className="font-medium">{activeModule.title}</div>
                <div className="text-white/60 text-xs">В процессе</div>
              </div>
            </div>
            
            <div className="mt-3">
              <div className="text-white/80 text-xs mb-1">Прогресс:</div>
              <div className="w-full h-2 bg-white/10 rounded-full">
                <div 
                  className={`h-full rounded-full bg-gradient-to-r ${getProgressBarColor(activeModule.status)}`} 
                  style={{ width: `${activeModule.progress}%` }}
                ></div>
              </div>
              <div className="text-right text-white/60 text-xs mt-1">
                {activeModule.progress}%
              </div>
            </div>
            
            <Link href={`/courses/${activeModule.slug}`}>
              <Button className="w-full mt-3" size="sm">
                Продолжить обучение
              </Button>
            </Link>
          </div>
        ) : (
          recommendedCourses && recommendedCourses.length > 0 ? (
            <div className="text-center p-3 bg-space-800/40 rounded-lg">
              <p className="text-white/70 mb-2">
                У вас нет активных курсов. Начните обучение с рекомендованного курса:
              </p>
            </div>
          ) : null
        )}
        
        {/* Следующий модуль */}
        {nextModule && (
          <div className="bg-space-800/30 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                <Map className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <div className="font-medium">{nextModule.title}</div>
                <div className="text-white/60 text-xs">Рекомендуется</div>
              </div>
            </div>
            
            <Link href={`/courses/${nextModule.slug}`}>
              <Button variant="outline" className="w-full mt-3" size="sm">
                Начать модуль
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

// Интерфейс для шага в NextStepsGrid
interface NextStep {
  id: number;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  type: 'lesson' | 'diagnostic' | 'practice' | 'course';
  url?: string;
}

/**
 * Компонент NextStepsGrid
 * Отображает следующие шаги и рекомендуемые действия
 */
const NextStepsGrid: React.FC<{ 
  recommendedCourses?: RecommendedCourse[], 
  diagnosisResults?: DiagnosticResult[] 
}> = ({ recommendedCourses, diagnosisResults }) => {
  const { user } = useAuth();
  const { data: learningProgress } = useQuery({
    queryKey: ['/api/learning/progress'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/learning/progress');
      return await response.json() as LearningProgress[];
    },
    enabled: !!user?.id
  });
  
  const { data: allCourses } = useQuery({
    queryKey: ['/api/courses'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/courses');
      return await response.json() as any[];
    },
    enabled: !!user?.id
  });
  
  // Получаем следующие шаги для пользователя на основе реальных данных
  const getNextSteps = (): NextStep[] => {
    const steps: NextStep[] = [];
    
    // Шаг 1: Если пользователь не прошел диагностику, рекомендуем сделать это
    const hasSkillsData = diagnosisResults && diagnosisResults.length > 0;
    if (!hasSkillsData) {
      steps.push({
        id: 1,
        title: "Пройти диагностику навыков",
        description: "Выявите ваши сильные и слабые стороны для персонализированного обучения",
        priority: "high",
        type: "diagnostic",
        url: "/deep-diagnosis"
      });
    }
    
    // Шаг 2: Если есть курс в процессе, рекомендуем его продолжить
    const inProgressCourse = learningProgress?.find(progress => progress.progress > 0 && progress.progress < 100);
    if (inProgressCourse) {
      const courseInfo = allCourses?.find((course: { id: number; title: string; slug: string }) => course.id === inProgressCourse.courseId);
      if (courseInfo) {
        steps.push({
          id: 2,
          title: `Продолжить курс "${courseInfo.title}"`,
          description: `Текущий прогресс: ${inProgressCourse.progress}%`,
          priority: "high",
          type: "lesson",
          url: `/courses/${courseInfo.slug}`
        });
      }
    }
    
    // Шаг 3: Добавляем рекомендации по курсам
    if (recommendedCourses && recommendedCourses.length > 0) {
      // Фильтруем, чтобы не рекомендовать курсы, которые уже проходит пользователь
      const filteredRecommendations = recommendedCourses.filter(rec => {
        return !inProgressCourse || rec.id !== inProgressCourse.courseId;
      });
      
      filteredRecommendations.slice(0, 3 - steps.length).forEach((course, index) => {
        steps.push({
          id: 3 + index,
          title: `Начать курс "${course.title}"`,
          description: course.matchScore 
            ? `Соответствие: ${Math.round(course.matchScore * 100)}%. ${course.description.substring(0, 50)}...`
            : course.description.substring(0, 70) + '...',
          priority: index === 0 ? "high" : "medium",
          type: "course",
          url: `/courses/${course.slug}`
        });
      });
    }
    
    // Если все еще не хватает шагов, добавляем общие рекомендации
    if (steps.length < 2) {
      steps.push({
        id: 100,
        title: "Изучить раздел AI Literacy",
        description: "Основы искусственного интеллекта и машинного обучения",
        priority: "medium",
        type: "course",
        url: "/courses/ai-literacy-101"
      });
    }
    
    return steps;
  };
  
  // Получаем приоритетный цвет
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400";
      case "medium":
        return "bg-amber-500/20 text-amber-400";
      case "low":
        return "bg-blue-500/20 text-blue-400";
      default:
        return "bg-white/20 text-white/80";
    }
  };
  
  // Получаем иконку типа задачи
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "lesson":
        return "fa-book-open";
      case "diagnostic":
        return "fa-brain";
      case "practice":
        return "fa-code";
      case "course":
        return "fa-graduation-cap";
      default:
        return "fa-chevron-right";
    }
  };
  
  const nextSteps = getNextSteps();
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <CardTitle className="text-lg">Следующие шаги</CardTitle>
        <Link href="/roadmap">
          <Button variant="link" size="sm" className="gap-1">
            Все задачи
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      
      <Separator className="bg-white/10" />
      
      <div className="space-y-3">
        {nextSteps.map((step) => (
          <Link key={step.id} href={step.url || '#'}>
            <div className="bg-space-800/60 p-4 rounded-lg hover:bg-space-800/80 transition cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <i className={`fas ${getTypeIcon(step.type)}`}></i>
                  </div>
                  <div className="ml-3">
                    <div className="font-medium">{step.title}</div>
                    <div className="text-white/60 text-xs">{step.description}</div>
                  </div>
                </div>
                <Badge className={`ml-2 ${getPriorityColor(step.priority)}`}>
                  {step.priority === "high" ? "Важно" : step.priority === "medium" ? "Средне" : "Опционально"}
                </Badge>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// Интерфейс для данных диагностики
interface DiagnosticResult {
  id: number;
  userId: number;
  skills: Record<string, number>;
  diagnosticType: 'quick' | 'deep';
  timestamp: string;
  metadata?: any;
}

// Интерфейс для рекомендованных курсов
interface RecommendedCourse {
  id: number;
  title: string;
  slug: string;
  description: string;
  level: string;
  imageUrl?: string;
  matchScore?: number;
  skillsGap?: string[];
}

/**
 * Основной компонент страницы "Captain's Bridge" (Капитанский Мостик)
 */
export default function BridgePage() {
  const { userProfile } = useUserProfile();
  const { user } = useAuth();
  const { toast } = useToast();
  const [skillsData, setSkillsData] = useState<Record<string, number>>({});
  
  // Загрузка данных диагностики
  const { data: diagnosisResults, isLoading: isLoadingDiagnosis, error: diagnosisError } = useQuery({
    queryKey: ['/api/diagnosis/results'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/diagnosis/results');
      return await response.json() as DiagnosticResult[];
    },
    enabled: !!user?.id
  });
  
  // Загрузка рекомендуемых курсов
  const { data: recommendedCourses, isLoading: isLoadingCourses, error: coursesError } = useQuery({
    queryKey: ['/api/courses/recommended'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/courses/recommended');
      return await response.json() as RecommendedCourse[];
    },
    enabled: !!user?.id
  });
  
  // Загрузка данных о навыках пользователя
  const { data: userSkills, isLoading: isLoadingSkills, error: skillsError } = useQuery({
    queryKey: ['/api/skills/user'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/skills/user');
      return await response.json();
    },
    enabled: !!user?.id
  });
  
  // Обработка данных для радар-диаграммы
  useEffect(() => {
    // Приоритет 1: Используем данные из userSkills (новый API)
    if (userSkills && Object.keys(userSkills).length > 0) {
      setSkillsData(userSkills);
    } 
    // Приоритет 2: Используем данные из последней диагностики
    else if (diagnosisResults && diagnosisResults.length > 0) {
      // Берем последний результат диагностики (сортировка по времени)
      const latestResult = [...diagnosisResults].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )[0];
      
      setSkillsData(latestResult.skills);
    }
  }, [userSkills, diagnosisResults]);
  
  // Отображение ошибки, если не удалось загрузить данные навыков
  const isLoading = isLoadingDiagnosis || isLoadingSkills || isLoadingCourses;
  const hasError = diagnosisError || skillsError || coursesError;
  const hasSkillsData = skillsData && Object.keys(skillsData).length > 0;
  
  // Создаем элементы для NextStepsGrid на основе рекомендованных курсов
  const getNextStepsFromRecommendations = () => {
    if (!recommendedCourses) return [];
    
    return recommendedCourses.slice(0, 3).map((course, index) => ({
      id: course.id,
      title: `Начать курс "${course.title}"`,
      description: course.description.substring(0, 80) + '...',
      priority: index === 0 ? "high" : index === 1 ? "medium" : "low",
      type: "lesson",
      url: `/courses/${course.slug}`
    }));
  };
  
  return (
    <DashboardLayout
      title="Капитанский Мостик"
      subtitle="Центр управления вашим обучением в NovaAI University"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        {/* Skills DNA Radar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Skills DNA</span>
              {!hasSkillsData && !isLoading && (
                <Link href="/deep-diagnosis">
                  <Button size="sm" variant="outline">
                    Пройти диагностику
                  </Button>
                </Link>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[400px] flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="mt-4 text-white/70">Загрузка данных Skills DNA...</p>
                </div>
              </div>
            ) : hasError ? (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Ошибка загрузки данных</AlertTitle>
                <AlertDescription>
                  Не удалось загрузить данные Skills DNA. Пожалуйста, попробуйте позже.
                </AlertDescription>
              </Alert>
            ) : !hasSkillsData ? (
              <div className="h-[400px] flex items-center justify-center">
                <div className="max-w-md text-center">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                  <h3 className="text-xl font-medium mb-2">Нет данных Skills DNA</h3>
                  <p className="text-white/70 mb-4">
                    Похоже, вы еще не прошли диагностику. Пройдите диагностику навыков, чтобы увидеть вашу личную карту Skills DNA.
                  </p>
                  <Link href="/deep-diagnosis">
                    <Button className="w-full">
                      Пройти диагностику
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="h-[400px]">
                <SkillsRadarChart 
                  userId={user?.id} 
                  skills={skillsData}
                  title="Ваш Skills DNA"
                  showControls={true}
                />
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Roadmap Widget */}
        <Card>
          <CardHeader>
            <CardTitle>Roadmap</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <RoadmapWidget recommendedCourses={recommendedCourses} />
            )}
          </CardContent>
        </Card>
        
        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Что дальше?</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : !hasSkillsData ? (
              <div className="text-center py-4">
                <p className="text-white/70 mb-3">
                  Пройдите диагностику, чтобы получить персонализированные рекомендации.
                </p>
                <Link href="/deep-diagnosis">
                  <Button size="sm">Начать диагностику</Button>
                </Link>
              </div>
            ) : (
              <NextStepsGrid 
                recommendedCourses={recommendedCourses} 
                diagnosisResults={diagnosisResults} 
              />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
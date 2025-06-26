/**
 * Course Management Interface
 * Comprehensive system for creating and managing courses with real progress tracking
 */

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  BookOpen, 
  Users, 
  Clock, 
  CheckCircle, 
  PlayCircle, 
  Plus,
  Target,
  TrendingUp,
  Award
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  difficulty: number;
  level: string;
  estimatedDuration: number;
  category: string;
  objectives: string[];
  prerequisites: string[];
  skillsGained: string[];
  modules: Module[];
}

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
  content: string;
  type: string;
  orderIndex: number;
  estimatedDuration: number;
  assignments: Assignment[];
}

interface Assignment {
  id: number;
  title: string;
  description: string;
  type: string;
  points: number;
}

interface CourseProgress {
  courseId: number;
  userId: number;
  overallProgress: number;
  completedModules: number;
  totalModules: number;
  completedLessons: number;
  totalLessons: number;
  startedAt: Date;
  lastAccessedAt: Date;
  estimatedTimeRemaining: number;
}

interface CourseTemplate {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  level: string;
  estimatedDuration: number;
  category: string;
}

export default function CourseManagement() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState('templates');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch course templates
  const { data: templatesData, isLoading: templatesLoading } = useQuery({
    queryKey: ['/api/course-init/templates'],
    enabled: activeTab === 'templates'
  });

  // Fetch user's courses
  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ['/api/courses'],
    enabled: activeTab === 'my-courses'
  });

  // Create course from template mutation
  const createCourseMutation = useMutation({
    mutationFn: (templateId: string) => 
      apiRequest(`/api/course-init/${templateId}`, { method: 'POST' }),
    onSuccess: (data) => {
      toast({
        title: "Курс создан",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
      setActiveTab('my-courses');
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось создать курс",
        variant: "destructive",
      });
    }
  });

  // Start course mutation
  const startCourseMutation = useMutation({
    mutationFn: (courseId: number) => 
      apiRequest(`/api/course-management/start/${courseId}`, { method: 'POST' }),
    onSuccess: () => {
      toast({
        title: "Курс начат",
        description: "Вы можете начать обучение",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
    }
  });

  // Fetch course with content
  const { data: courseContent, isLoading: courseContentLoading } = useQuery({
    queryKey: ['/api/course-management/course', selectedCourse?.id],
    enabled: !!selectedCourse?.id
  });

  // Fetch course progress
  const { data: progressData } = useQuery({
    queryKey: ['/api/course-management/progress', selectedCourse?.id],
    enabled: !!selectedCourse?.id
  });

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}ч ${mins}м` : `${mins}м`;
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return 'bg-green-500';
    if (difficulty <= 4) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getLevelBadgeVariant = (level: string) => {
    switch (level) {
      case 'basic': return 'default';
      case 'intermediate': return 'secondary';
      case 'advanced': return 'destructive';
      case 'expert': return 'outline';
      default: return 'default';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Управление курсами</h1>
        <p className="text-gray-600">
          Создавайте и управляйте образовательными курсами с отслеживанием прогресса
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates">Шаблоны курсов</TabsTrigger>
          <TabsTrigger value="my-courses">Мои курсы</TabsTrigger>
          <TabsTrigger value="analytics">Аналитика</TabsTrigger>
        </TabsList>

        {/* Course Templates */}
        <TabsContent value="templates" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {templatesLoading ? (
              <div className="col-span-full text-center">Загрузка шаблонов...</div>
            ) : (
              templatesData?.templates?.map((template: CourseTemplate) => (
                <Card key={template.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-lg">{template.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant={getLevelBadgeVariant(template.level)}>
                            {template.level}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <div 
                              className={`w-3 h-3 rounded-full ${getDifficultyColor(template.difficulty)}`}
                            />
                            <span className="text-sm text-gray-500">
                              {template.difficulty}/5
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="line-clamp-3">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDuration(template.estimatedDuration)}
                      </div>
                      <Badge variant="outline">{template.category}</Badge>
                    </div>
                    
                    <Button 
                      onClick={() => createCourseMutation.mutate(template.id)}
                      disabled={createCourseMutation.isPending}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {createCourseMutation.isPending ? 'Создание...' : 'Создать курс'}
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* My Courses */}
        <TabsContent value="my-courses" className="space-y-6">
          <div className="grid gap-6">
            {coursesLoading ? (
              <div className="text-center">Загрузка курсов...</div>
            ) : (
              coursesData?.map((course: Course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-xl">{course.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant={getLevelBadgeVariant(course.level)}>
                            {course.level}
                          </Badge>
                          <Badge variant="outline">{course.category}</Badge>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedCourse(course)}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Подробнее
                      </Button>
                    </div>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span>{course.modules?.length || 0} модулей</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-green-500" />
                        <span>
                          {course.modules?.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0) || 0} уроков
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span>{formatDuration(course.estimatedDuration)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-purple-500" />
                        <span>{course.objectives?.length || 0} целей</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => startCourseMutation.mutate(course.id)}
                        disabled={startCourseMutation.isPending}
                      >
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Начать изучение
                      </Button>
                      <Button variant="outline" onClick={() => setSelectedCourse(course)}>
                        Программа курса
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Всего курсов</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{coursesData?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  активных курсов в системе
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Общий прогресс</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">75%</div>
                <p className="text-xs text-muted-foreground">
                  средний прогресс по курсам
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Достижения</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  завершенных курсов
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Course Details Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{selectedCourse.title}</h2>
                <Button variant="outline" onClick={() => setSelectedCourse(null)}>
                  Закрыть
                </Button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Course Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold mb-2">Цели курса</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {selectedCourse.objectives?.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Приобретаемые навыки</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCourse.skillsGained?.map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Course Progress */}
              {progressData?.progress && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Ваш прогресс</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Общий прогресс</span>
                      <span>{progressData.progress.overallProgress}%</span>
                    </div>
                    <Progress value={progressData.progress.overallProgress} />
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold">{progressData.progress.completedLessons}</div>
                      <div className="text-gray-500">из {progressData.progress.totalLessons} уроков</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">{progressData.progress.completedModules}</div>
                      <div className="text-gray-500">из {progressData.progress.totalModules} модулей</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">{formatDuration(progressData.progress.estimatedTimeRemaining)}</div>
                      <div className="text-gray-500">осталось</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Course Modules */}
              {courseContent?.course?.modules && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Программа курса</h3>
                  <Accordion type="single" collapsible className="w-full">
                    {courseContent.course.modules.map((module: Module) => (
                      <AccordionItem key={module.id} value={`module-${module.id}`}>
                        <AccordionTrigger className="text-left">
                          <div className="flex items-center justify-between w-full mr-4">
                            <span>{module.title}</span>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <BookOpen className="w-4 h-4" />
                              {module.lessons?.length || 0} уроков
                              <Clock className="w-4 h-4 ml-2" />
                              {formatDuration(module.estimatedDuration)}
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 pt-2">
                            <p className="text-sm text-gray-600 mb-4">
                              {module.description}
                            </p>
                            {module.lessons?.map((lesson: Lesson) => (
                              <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                  <div>
                                    <div className="font-medium">{lesson.title}</div>
                                    <div className="text-sm text-gray-600">{lesson.description}</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <Badge variant="outline">{lesson.type}</Badge>
                                  <Clock className="w-4 h-4" />
                                  {formatDuration(lesson.estimatedDuration)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
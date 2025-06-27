import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Activity,
  Plus,
  Save,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Clock,
  Award,
  Target,
  Layout,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalLessons: number;
  completionRate: number;
  activeUsers: number;
  newUsersThisWeek: number;
  coursesCompleted: number;
  avgTimeSpent: number;
}

interface CourseArchitecture {
  id: number;
  title: string;
  slug: string;
  category: string;
  totalModules: number;
  totalLessons: number;
  completedLessons: number;
  estimatedDuration: number;
  status: 'draft' | 'in_progress' | 'completed' | 'published';
  completionPercentage: number;
  lastUpdated: string;
}

interface CourseIdea {
  id: number;
  title: string;
  description: string;
  targetAudience: string;
  difficultyLevel: string;
  estimatedDuration: number;
  marketDemand: string;
  implementationPriority: number;
  category: string;
  tags: string[];
  status: string;
  createdAt: string;
}

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [courseArchitecture, setCourseArchitecture] = useState<CourseArchitecture[]>([]);
  const [courseIdeas, setCourseIdeas] = useState<CourseIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [newIdeaForm, setNewIdeaForm] = useState({
    title: '',
    description: '',
    targetAudience: '',
    difficultyLevel: 'beginner',
    estimatedDuration: 120,
    marketDemand: 'medium',
    implementationPriority: 5,
    category: '',
    tags: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchAdminStats();
    fetchCourseArchitecture();
    fetchCourseIdeas();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        throw new Error('Failed to fetch admin stats');
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить статистику администратора",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseArchitecture = async () => {
    try {
      const response = await fetch('/api/admin/course-architecture');
      if (response.ok) {
        const data = await response.json();
        setCourseArchitecture(data);
      }
    } catch (error) {
      console.error('Error fetching course architecture:', error);
    }
  };

  const fetchCourseIdeas = async () => {
    try {
      const response = await fetch('/api/admin/course-ideas');
      if (response.ok) {
        const data = await response.json();
        setCourseIdeas(data);
      }
    } catch (error) {
      console.error('Error fetching course ideas:', error);
    }
  };

  const handleNewIdeaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/course-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newIdeaForm,
          tags: newIdeaForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        })
      });

      if (response.ok) {
        toast({
          title: "Успех",
          description: "Идея курса добавлена в план",
        });
        setNewIdeaForm({
          title: '',
          description: '',
          targetAudience: '',
          difficultyLevel: 'beginner',
          estimatedDuration: 120,
          marketDemand: 'medium',
          implementationPriority: 5,
          category: '',
          tags: ''
        });
        fetchCourseIdeas();
      } else {
        throw new Error('Failed to create course idea');
      }
    } catch (error) {
      console.error('Error creating course idea:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить идею курса",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'draft': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'text-red-600 font-bold';
    if (priority >= 6) return 'text-orange-600 font-semibold';
    return 'text-gray-600';
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'high': return 'text-red-600 font-bold';
      case 'medium': return 'text-yellow-600 font-semibold';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Загрузка...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Панель администратора</h1>
        <p className="text-gray-600">Управление платформой NovaAI University</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="courses">Курсы</TabsTrigger>
          <TabsTrigger value="architecture">Архитектура</TabsTrigger>
          <TabsTrigger value="planning">Планирование</TabsTrigger>
          <TabsTrigger value="users">Пользователи</TabsTrigger>
          <TabsTrigger value="analytics">Аналитика</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Пользователи</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    +{stats.newUsersThisWeek} на этой неделе
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Курсы</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCourses}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.totalLessons} уроков всего
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Активные пользователи</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.completionRate}% завершаемость
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Завершенные курсы</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.coursesCompleted}</div>
                  <p className="text-xs text-muted-foreground">
                    ⌀ {stats.avgTimeSpent} мин/сессия
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Быстрые действия</CardTitle>
              <CardDescription>Часто используемые функции администратора</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex flex-col">
                  <Plus className="h-6 w-6 mb-2" />
                  Новый курс
                </Button>
                <Button variant="outline" className="h-20 flex flex-col">
                  <Users className="h-6 w-6 mb-2" />
                  Пользователи
                </Button>
                <Button variant="outline" className="h-20 flex flex-col">
                  <BarChart3 className="h-6 w-6 mb-2" />
                  Отчеты
                </Button>
                <Button variant="outline" className="h-20 flex flex-col">
                  <Target className="h-6 w-6 mb-2" />
                  Настройки
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Управление курсами
              </CardTitle>
              <CardDescription>
                Создание и редактирование курсов платформы
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Функционал управления курсами в разработке</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="architecture" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5" />
                Архитектура курсов
              </CardTitle>
              <CardDescription>
                Обзор структуры и готовности курсов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courseArchitecture.length > 0 ? (
                  courseArchitecture.map((course) => (
                    <div key={course.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{course.title}</h3>
                          <p className="text-sm text-gray-600">
                            {course.totalModules} модулей • {course.totalLessons} уроков • 
                            {Math.round(course.estimatedDuration / 60)} часов
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(course.status)}>
                            {course.status === 'completed' ? 'Завершен' : 
                             course.status === 'in_progress' ? 'В разработке' : 
                             course.status === 'published' ? 'Опубликован' : 'Черновик'}
                          </Badge>
                          <span className="text-sm font-semibold">
                            {course.completionPercentage}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Готовность контента</span>
                          <span>{course.completedLessons}/{course.totalLessons} уроков</span>
                        </div>
                        <Progress value={course.completionPercentage} className="h-2" />
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Категория: {course.category}</span>
                        <span>Обновлен: {new Date(course.lastUpdated).toLocaleDateString('ru-RU')}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Загрузка архитектуры курсов...</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planning" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Добавить идею курса
                </CardTitle>
                <CardDescription>
                  Предложите новый курс для разработки
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleNewIdeaSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Название курса</Label>
                    <Input
                      id="title"
                      value={newIdeaForm.title}
                      onChange={(e) => setNewIdeaForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Введите название курса"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Описание</Label>
                    <Textarea
                      id="description"
                      value={newIdeaForm.description}
                      onChange={(e) => setNewIdeaForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Краткое описание курса и его ценности"
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="targetAudience">Целевая аудитория</Label>
                      <Input
                        id="targetAudience"
                        value={newIdeaForm.targetAudience}
                        onChange={(e) => setNewIdeaForm(prev => ({ ...prev, targetAudience: e.target.value }))}
                        placeholder="Начинающие, студенты..."
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Категория</Label>
                      <Input
                        id="category"
                        value={newIdeaForm.category}
                        onChange={(e) => setNewIdeaForm(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="ai, no-code, design..."
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="difficultyLevel">Уровень сложности</Label>
                      <Select value={newIdeaForm.difficultyLevel} onValueChange={(value) => setNewIdeaForm(prev => ({ ...prev, difficultyLevel: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Начинающий</SelectItem>
                          <SelectItem value="intermediate">Средний</SelectItem>
                          <SelectItem value="advanced">Продвинутый</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="estimatedDuration">Длительность (мин)</Label>
                      <Input
                        id="estimatedDuration"
                        type="number"
                        value={newIdeaForm.estimatedDuration}
                        onChange={(e) => setNewIdeaForm(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) }))}
                        placeholder="120"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="marketDemand">Спрос на рынке</Label>
                      <Select value={newIdeaForm.marketDemand} onValueChange={(value) => setNewIdeaForm(prev => ({ ...prev, marketDemand: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Низкий</SelectItem>
                          <SelectItem value="medium">Средний</SelectItem>
                          <SelectItem value="high">Высокий</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="priority">Приоритет (1-10)</Label>
                      <Input
                        id="priority"
                        type="number"
                        min="1"
                        max="10"
                        value={newIdeaForm.implementationPriority}
                        onChange={(e) => setNewIdeaForm(prev => ({ ...prev, implementationPriority: parseInt(e.target.value) }))}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="tags">Теги (через запятую)</Label>
                    <Input
                      id="tags"
                      value={newIdeaForm.tags}
                      onChange={(e) => setNewIdeaForm(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="ai, автоматизация, начинающие"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить в план
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  План курсов
                </CardTitle>
                <CardDescription>
                  Идеи курсов в разработке и планировании
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {courseIdeas
                    .sort((a, b) => b.implementationPriority - a.implementationPriority)
                    .map((idea) => (
                    <div key={idea.id} className="border rounded-lg p-3 text-sm">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm leading-tight">{idea.title}</h4>
                        <div className="flex items-center gap-1 ml-2">
                          <span className={`text-xs ${getPriorityColor(idea.implementationPriority)}`}>
                            {idea.implementationPriority}
                          </span>
                          <span className={`text-xs ${getDemandColor(idea.marketDemand)}`}>
                            {idea.marketDemand === 'high' ? '🔥' : idea.marketDemand === 'medium' ? '📈' : '📊'}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{idea.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{idea.targetAudience}</span>
                          <span>•</span>
                          <span>{Math.round(idea.estimatedDuration / 60)}ч</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {idea.category}
                        </Badge>
                      </div>
                      
                      {idea.tags && idea.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {idea.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="text-xs bg-gray-100 text-gray-600 px-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Управление пользователями
              </CardTitle>
              <CardDescription>
                Просмотр и редактирование профилей пользователей
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Функционал управления пользователями в разработке</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Аналитика и отчеты
              </CardTitle>
              <CardDescription>
                Детальная статистика использования платформы
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Аналитический dashboard в разработке</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
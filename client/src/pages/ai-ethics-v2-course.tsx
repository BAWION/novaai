import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { LightningEthicsLab } from '@/components/lightning-ethics-lab';
import { 
  Play, 
  Clock, 
  Trophy, 
  Users, 
  CheckCircle, 
  Lock,
  Zap,
  Brain,
  Shield,
  Scale,
  Lightbulb,
  Target,
  ArrowRight,
  Star,
  ArrowLeft,
  BarChart3,
  FileText
} from 'lucide-react';
import { Link } from 'wouter';

interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  icon: typeof Brain;
  lessons: number;
  practical: boolean;
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'reading' | 'practical' | 'quiz';
  status: 'locked' | 'available' | 'completed';
}

export default function AIEthicsV2Course() {
  const [currentView, setCurrentView] = useState<'overview' | 'lightning' | 'lesson'>('overview');
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const modules: Module[] = [
    {
      id: 'lightning-lab',
      title: 'Lightning Ethics Lab',
      description: '20-минутная экспресс-оценка этичности вашего ИИ-проекта',
      duration: '20 мин',
      status: 'available',
      icon: Zap,
      lessons: 1,
      practical: true
    },
    {
      id: 'foundations',
      title: 'Основы этики ИИ',
      description: 'Фундаментальные принципы этичного развития ИИ',
      duration: '2 ч 30 мин',
      status: 'available',
      icon: Brain,
      lessons: 6,
      practical: true
    },
    {
      id: 'bias-fairness',
      title: 'Предвзятость и справедливость',
      description: 'Выявление и устранение предвзятости в ИИ-системах',
      duration: '3 ч 15 мин',
      status: 'locked',
      icon: Scale,
      lessons: 8,
      practical: true
    },
    {
      id: 'transparency',
      title: 'Прозрачность и объяснимость',
      description: 'LIME, SHAP и другие методы интерпретации ИИ',
      duration: '4 ч 45 мин',
      status: 'locked',
      icon: Lightbulb,
      lessons: 10,
      practical: true
    },
    {
      id: 'privacy-security',
      title: 'Приватность и безопасность',
      description: 'Защита данных и кибербезопасность ИИ-систем',
      duration: '3 ч 30 мин',
      status: 'locked',
      icon: Shield,
      lessons: 7,
      practical: true
    },
    {
      id: 'governance',
      title: 'Управление и регулирование',
      description: 'Корпоративное управление и международные стандарты',
      duration: '2 ч 45 мин',
      status: 'locked',
      icon: Target,
      lessons: 5,
      practical: true
    }
  ];

  const handleModuleClick = (moduleId: string) => {
    if (moduleId === 'lightning-lab') {
      setCurrentView('lightning');
    } else {
      setSelectedModule(moduleId);
      setCurrentView('lesson');
    }
  };

  if (currentView === 'lightning') {
    return (
      <DashboardLayout title="Lightning Ethics Lab" subtitle="Экспресс-аудит этики ИИ">
        <div className="space-y-6">
          <div className="mb-6">
            <Button
              onClick={() => setCurrentView('overview')}
              variant="ghost"
              className="text-gray-400 hover:text-white mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Вернуться к курсу
            </Button>
          </div>
          <LightningEthicsLab />
        </div>
      </DashboardLayout>
    );
  }

  if (currentView === 'lesson' && selectedModule) {
    const module = modules.find(m => m.id === selectedModule);
    if (!module) return null;

    return (
      <DashboardLayout title={module.title} subtitle={module.description}>
        <div className="space-y-6">
          <div className="mb-6">
            <Button
              onClick={() => setCurrentView('overview')}
              variant="ghost"
              className="text-gray-400 hover:text-white mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Вернуться к курсу
            </Button>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white text-2xl">{module.title}</CardTitle>
              <CardDescription className="text-gray-400">
                {module.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <module.icon className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Модуль в разработке</h3>
                <p className="text-gray-400 mb-6">
                  Этот модуль будет доступен в следующих обновлениях курса
                </p>
                <Button 
                  onClick={() => setCurrentView('overview')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Вернуться к обзору курса
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // Overview страница курса
  return (
    <DashboardLayout title="Этика и безопасность ИИ 2.0" subtitle="Практический курс по этике искусственного интеллекта">
      <div className="space-y-6">
        {/* Хлебные крошки и навигация */}
        <div className="mb-6">
          <Link href="/catalog">
            <Button variant="ghost" className="text-gray-400 hover:text-white mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Вернуться к каталогу
            </Button>
          </Link>
        </div>

        {/* Course Header */}
        <Card className="bg-gradient-to-r from-blue-900 to-purple-900 border-blue-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-bold text-white mb-2">
                  Этика и безопасность ИИ 2.0
                </CardTitle>
                <CardDescription className="text-blue-200 text-lg">
                  Практический курс по этике искусственного интеллекта
                </CardDescription>
              </div>
              <Badge className="bg-yellow-600 text-white px-3 py-1">
                🎯 Интерактивная методология
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
              <div className="text-center">
                <Clock className="h-6 w-6 mx-auto mb-2 text-blue-300" />
                <div className="text-sm text-blue-200">Длительность</div>
                <div className="font-semibold">16 ч 45 мин</div>
              </div>
              <div className="text-center">
                <Users className="h-6 w-6 mx-auto mb-2 text-green-300" />
                <div className="text-sm text-green-200">Модулей</div>
                <div className="font-semibold">6</div>
              </div>
              <div className="text-center">
                <Trophy className="h-6 w-6 mx-auto mb-2 text-yellow-300" />
                <div className="text-sm text-yellow-200">Практических задач</div>
                <div className="font-semibold">37</div>
              </div>
              <div className="text-center">
                <Star className="h-6 w-6 mx-auto mb-2 text-purple-300" />
                <div className="text-sm text-purple-200">Сложность</div>
                <div className="font-semibold">Средняя</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Start - Lightning Lab */}
        <Card className="bg-gradient-to-r from-yellow-900 to-orange-900 border-yellow-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Zap className="h-6 w-6 mr-2 text-yellow-400" />
              Быстрый старт: Lightning Ethics Lab
            </CardTitle>
            <CardDescription className="text-yellow-200">
              Получите мгновенную оценку этичности вашего ИИ-проекта за 20 минут
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-white">
                <div className="text-lg font-semibold mb-1">Экспресс-аудит этики ИИ</div>
                <div className="text-yellow-200">
                  Практический инструмент для быстрой оценки этических рисков
                </div>
              </div>
              <Button 
                onClick={() => handleModuleClick('lightning-lab')}
                className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold"
              >
                <Zap className="h-4 w-4 mr-2" />
                Запустить Lab
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Ваш прогресс</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Общий прогресс</span>
                  <span className="text-white">16%</span>
                </div>
                <Progress value={16} className="h-2" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Завершено модулей:</span>
                  <span className="text-white ml-2">0/6</span>
                </div>
                <div>
                  <span className="text-gray-400">Практических задач:</span>
                  <span className="text-white ml-2">6/37</span>
                </div>
                <div>
                  <span className="text-gray-400">Времени потрачено:</span>
                  <span className="text-white ml-2">2ч 45м</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Modules */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Модули курса</h2>
          <div className="grid gap-4">
            {modules.map((module, index) => (
              <Card 
                key={module.id} 
                className={`bg-gray-800 border-gray-700 transition-all hover:border-blue-600 cursor-pointer ${
                  module.status === 'locked' ? 'opacity-60' : ''
                }`}
                onClick={() => module.status !== 'locked' && handleModuleClick(module.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${
                        module.id === 'lightning-lab' ? 'bg-yellow-600' :
                        module.status === 'completed' ? 'bg-green-600' :
                        module.status === 'in-progress' ? 'bg-blue-600' :
                        module.status === 'available' ? 'bg-blue-600' :
                        'bg-gray-600'
                      }`}>
                        {module.status === 'locked' ? (
                          <Lock className="h-6 w-6 text-white" />
                        ) : (
                          <module.icon className="h-6 w-6 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{module.title}</h3>
                        <p className="text-gray-400 mt-1">{module.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {module.duration}
                          </span>
                          <span className="flex items-center">
                            <Play className="h-4 w-4 mr-1" />
                            {module.lessons} уроков
                          </span>
                          {module.practical && (
                            <Badge variant="secondary" className="bg-green-600 text-white">
                              Практика
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {module.status === 'completed' && (
                        <CheckCircle className="h-6 w-6 text-green-400" />
                      )}
                      {module.status !== 'locked' && (
                        <ArrowRight className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* What You'll Learn */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Что вы изучите</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white">Быстрая оценка этических рисков</h4>
                    <p className="text-gray-400 text-sm">Lightning Lab за 20 минут выявит проблемы</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white">Практические инструменты LIME/SHAP</h4>
                    <p className="text-gray-400 text-sm">Реальные датасеты и кейсы из банковской сферы</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white">GDPR и регулирование данных</h4>
                    <p className="text-gray-400 text-sm">Соблюдение 152-ФЗ и международных стандартов</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white">Кибербезопасность ИИ-систем</h4>
                    <p className="text-gray-400 text-sm">Защита от атак и уязвимостей</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white">Корпоративное управление ИИ</h4>
                    <p className="text-gray-400 text-sm">Процессы и политики для бизнеса</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-1" />
                  <div>
                    <h4 className="font-semibold text-white">Отчеты для комплаенса</h4>
                    <p className="text-gray-400 text-sm">Готовые шаблоны для аудиторов</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Demo Activities */}
        <Card className="bg-gradient-to-r from-purple-900 to-pink-900 border-purple-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Play className="h-6 w-6 mr-2 text-purple-400" />
              Демо-активности курса
            </CardTitle>
            <CardDescription className="text-purple-200">
              Попробуйте интерактивные упражнения в стиле Brilliant.org
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/card-sort-demo">
                <Card className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-all cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <div className="bg-blue-600 p-3 rounded-lg w-fit mx-auto mb-3">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-white mb-2">Сортировка карт</h4>
                    <p className="text-gray-400 text-sm">Группируйте этические принципы по категориям</p>
                  </CardContent>
                </Card>
              </Link>
              
              <Link href="/slider-demo">
                <Card className="bg-gray-800 border-gray-700 hover:border-green-500 transition-all cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <div className="bg-green-600 p-3 rounded-lg w-fit mx-auto mb-3">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-white mb-2">Шкалы оценки</h4>
                    <p className="text-gray-400 text-sm">Оценивайте этические риски по шкале</p>
                  </CardContent>
                </Card>
              </Link>
              
              <Link href="/matching-demo">
                <Card className="bg-gray-800 border-gray-700 hover:border-yellow-500 transition-all cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <div className="bg-yellow-600 p-3 rounded-lg w-fit mx-auto mb-3">
                      <ArrowRight className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-white mb-2">Соединение пар</h4>
                    <p className="text-gray-400 text-sm">Связывайте термины с определениями</p>
                  </CardContent>
                </Card>
              </Link>
              
              <Link href="/scenario-demo">
                <Card className="bg-gray-800 border-gray-700 hover:border-red-500 transition-all cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <div className="bg-red-600 p-3 rounded-lg w-fit mx-auto mb-3">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-white mb-2">Анализ сценариев</h4>
                    <p className="text-gray-400 text-sm">Решайте этические дилеммы ИИ</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
            
            <div className="mt-6 p-4 bg-purple-800 bg-opacity-50 rounded-lg border border-purple-600">
              <div className="flex items-center space-x-3 mb-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="text-white font-semibold">Методология Brilliant.org</span>
              </div>
              <p className="text-purple-200 text-sm">
                Каждая активность следует принципу "learn by doing" с мгновенной обратной связью, 
                визуальными концепциями и прогрессивной сложностью для максимального вовлечения.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer Navigation */}
        <div className="mt-12 flex justify-between items-center">
          <Link href="/catalog">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              ← Вернуться к каталогу
            </Button>
          </Link>
          <Button 
            onClick={() => handleModuleClick('lightning-lab')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Начать с Lightning Lab
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
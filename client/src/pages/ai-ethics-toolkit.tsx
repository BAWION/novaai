import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Clock, 
  Zap, 
  FileText, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Star,
  ArrowRight,
  Target,
  Users,
  Briefcase,
  Building,
  Home
} from 'lucide-react';
import { Link } from 'wouter';
import DashboardLayout from '@/components/layout/dashboard-layout';
import ToolWrapper from '@/components/toolkit/tool-wrapper';
import { aiEthicsToolkit } from '@/data/ai-ethics-toolkit';

export default function AIEthicsToolkitPage() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [completedTools, setCompletedTools] = useState<Set<string>>(new Set());
  const [toolResults, setToolResults] = useState<Record<string, any>>({});

  // Получение списка доступных инструментов
  const { data: toolsList, isLoading } = useQuery({
    queryKey: ['/api/tools/list'],
    queryFn: async () => {
      const response = await fetch('/api/tools/list');
      if (!response.ok) throw new Error('Failed to fetch tools');
      return response.json();
    }
  });

  // Загружаем сохраненные результаты при загрузке страницы
  useEffect(() => {
    try {
      const savedResults = localStorage.getItem('aiEthicsToolkitResults');
      const savedCompleted = localStorage.getItem('aiEthicsToolkitCompleted');
      
      if (savedResults) {
        setToolResults(JSON.parse(savedResults));
      }
      if (savedCompleted) {
        setCompletedTools(new Set(JSON.parse(savedCompleted)));
      }
    } catch (error) {
      console.error('Error loading saved results:', error);
    }
  }, []);

  const handleToolComplete = (toolId: string, results: any) => {
    const newCompletedTools = new Set([...completedTools, toolId]);
    const newToolResults = {
      ...toolResults,
      [toolId]: {
        ...results,
        completedAt: new Date().toISOString(),
        toolName: toolsList?.tools?.find((t: any) => t.id === toolId)?.name || toolId
      }
    };
    
    setCompletedTools(newCompletedTools);
    setToolResults(newToolResults);
    
    // Сохраняем в localStorage
    try {
      localStorage.setItem('aiEthicsToolkitResults', JSON.stringify(newToolResults));
      localStorage.setItem('aiEthicsToolkitCompleted', JSON.stringify([...newCompletedTools]));
    } catch (error) {
      console.error('Error saving results:', error);
    }
    
    console.log(`Tool ${toolId} completed:`, results);
  };

  const getToolIcon = (toolId: string) => {
    const icons = {
      'lightning-ethics': Zap,
      'lightning-demo': Zap,
      'risk-calculator': AlertTriangle,
      'compliance-checker': Shield,
      'template-generator': FileText,
      'xai-explainer': Target,
      'redteam-sandbox': Users
    };
    return icons[toolId as keyof typeof icons] || FileText;
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 2: return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 3: return 'bg-red-100 text-red-800 hover:bg-red-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getDifficultyText = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'Легко';
      case 2: return 'Средне';
      case 3: return 'Сложно';
      default: return 'Неизвестно';
    }
  };

  const calculateProgress = () => {
    if (!toolsList?.tools) return 0;
    return Math.round((completedTools.size / toolsList.tools.length) * 100);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Заголовок с навигацией */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
          <Link href="/dashboard" className="hover:text-gray-700 flex items-center space-x-1">
            <Home className="w-4 h-4" />
            <span>Главная</span>
          </Link>
          <ArrowRight className="w-4 h-4" />
          <Link href="/catalog" className="hover:text-gray-700">
            Каталог курсов
          </Link>
          <ArrowRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">AI Ethics Toolkit 1.0</span>
        </div>
      </div>
      <div className="max-w-7xl">
      {/* Заголовок и прогресс */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold mb-2 text-[#ffffff]">
              AI Ethics Toolkit 1.0
            </h1>
            <p className="text-sm md:text-lg text-gray-600 mb-4">
              Практические инструменты для этичной разработки ИИ. Каждый инструмент дает результат за ≤5 минут.
            </p>
          </div>
          <div className="text-left md:text-right">
            <div className="text-sm text-gray-500 mb-1">
              Прогресс: {completedTools.size} из {toolsList?.tools?.length || 0} инструментов
            </div>
            <Progress value={calculateProgress()} className="w-full md:w-48" />
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold">30 мин</div>
                  <div className="text-sm text-gray-500">Общее время</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold">15+</div>
                  <div className="text-sm text-gray-500">Готовых отчетов</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold">5</div>
                  <div className="text-sm text-gray-500">Бизнес-кейсов</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Building className="w-5 h-5 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-sm text-gray-500">Практическое применение</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Основной контент */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Обзор инструментов</TabsTrigger>
          <TabsTrigger value="tools">Запуск инструментов</TabsTrigger>
          <TabsTrigger value="results">Мои результаты</TabsTrigger>
        </TabsList>

        {/* Вкладка: Обзор */}
        <TabsContent value="overview" className="space-y-6 pb-20 md:pb-6">
          <Alert>
            <Star className="h-4 w-4" />
            <AlertDescription>
              Начните с <strong>Lightning Demo</strong> для быстрого знакомства со всеми инструментами на примере вашего проекта.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {toolsList?.tools?.map((tool: any) => {
              const IconComponent = getToolIcon(tool.id);
              const isCompleted = completedTools.has(tool.id);
              // Объединяем данные из статического файла и сервера
              const mergedTool = {
                ...aiEthicsToolkit.tools.find((t: any) => t.id === tool.id),
                ...tool
              };
              
              return (
                <Card key={tool.id} className={`cursor-pointer transition-all hover:shadow-xl hover:scale-105 flex flex-col h-full bg-gray-900 border-gray-700 text-white`}>
                  <CardHeader className="pb-3 flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <IconComponent className={`w-6 h-6 ${isCompleted ? 'text-green-400' : 'text-blue-400'}`} />
                      {isCompleted && <CheckCircle className="w-5 h-5 text-green-400" />}
                    </div>
                    <CardTitle className="text-lg font-semibold text-white">{mergedTool.name}</CardTitle>
                    <CardDescription className="text-sm text-gray-300 min-h-[40px]">{mergedTool.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline" className="flex items-center space-x-1 border-gray-600 text-gray-300">
                        <Clock className="w-3 h-3" />
                        <span>{mergedTool.estimatedDuration} мин</span>
                      </Badge>
                      <Badge className={getDifficultyColor(mergedTool.difficulty)}>
                        {getDifficultyText(mergedTool.difficulty)}
                      </Badge>
                    </div>
                    
                    <div className="flex-grow"></div>
                    
                    <Button 
                      onClick={() => {
                        setSelectedTool(tool.id);
                        setActiveTab('tools');
                      }}
                      className="w-full mt-auto bg-purple-600 hover:bg-purple-700 text-white border-0 font-semibold"
                      variant="default"
                    >
                      {isCompleted ? 'Запустить снова' : 'Запустить инструмент'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Вкладка: Инструменты */}
        <TabsContent value="tools" className="space-y-6 pb-20 md:pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Список инструментов слева */}
            <div className="lg:col-span-1 max-h-[60vh] lg:max-h-full overflow-y-auto">
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Выберите инструмент</CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <div className="space-y-2">
                    {toolsList?.tools?.map((tool: any) => {
                      const IconComponent = getToolIcon(tool.id);
                      const isSelected = selectedTool === tool.id;
                      const isCompleted = completedTools.has(tool.id);
                      // Объединяем данные из статического файла и сервера для левого меню
                      const mergedTool = {
                        ...aiEthicsToolkit.tools.find((t: any) => t.id === tool.id),
                        ...tool
                      };
                      
                      return (
                        <Button
                          key={tool.id}
                          variant="ghost"
                          className={`w-full justify-start h-auto p-2 md:p-3 text-white hover:bg-gray-800 border-0 ${
                            isSelected 
                              ? 'bg-purple-600 hover:bg-purple-700' 
                              : isCompleted 
                                ? 'bg-green-800 hover:bg-green-700' 
                                : 'bg-gray-800'
                          }`}
                          onClick={() => setSelectedTool(tool.id)}
                        >
                          <div className="flex items-center space-x-3 w-full min-w-0">
                            <IconComponent className={`w-4 h-4 flex-shrink-0 ${
                              isSelected ? 'text-white' : isCompleted ? 'text-green-400' : 'text-blue-400'
                            }`} />
                            <div className="text-left flex-1 min-w-0">
                              <div className="font-medium text-xs md:text-sm text-white truncate">{mergedTool.name}</div>
                              <div className="text-xs text-gray-300 truncate">{mergedTool.estimatedDuration} мин</div>
                            </div>
                            {isCompleted && <CheckCircle className="w-3 h-3 text-green-400 ml-auto flex-shrink-0" />}
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Активный инструмент справа */}
            <div className="lg:col-span-3">
              {selectedTool ? (
                <ToolWrapper
                  tool={{
                    ...aiEthicsToolkit.tools.find((t: any) => t.id === selectedTool),
                    ...toolsList.tools.find((t: any) => t.id === selectedTool)
                  }}
                  onComplete={(results) => handleToolComplete(selectedTool, results)}
                />
              ) : (
                <Card className="bg-gray-900 border-gray-700">
                  <CardContent className="p-8 text-center">
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Выберите инструмент для запуска
                    </h3>
                    <p className="text-gray-300">
                      Нажмите на любой инструмент слева, чтобы начать работу с ним.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Вкладка: Результаты */}
        <TabsContent value="results" className="space-y-6 pb-20 md:pb-6">
          {completedTools.size > 0 ? (
            <div className="space-y-6">
              {/* Общая статистика результатов */}
              <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Мои результаты анализа</span>
                  </CardTitle>
                  <CardDescription>
                    Завершено {completedTools.size} из {toolsList?.tools?.length || 6} инструментов • 
                    Готово {Math.round(calculateProgress())}% от общего анализа этики ИИ
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Детальные результаты каждого инструмента */}
              <div className="space-y-4">
                {Object.entries(toolResults).map(([toolId, result]) => (
                  <Card key={toolId} className="bg-white border-gray-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <CardTitle className="text-lg">{result.toolName}</CardTitle>
                        <Badge variant="secondary">
                          {new Date(result.completedAt).toLocaleDateString()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {result.summary && (
                        <div>
                          <h4 className="font-medium text-sm text-gray-700 mb-1">Краткое резюме:</h4>
                          <p className="text-sm text-gray-600">{result.summary}</p>
                        </div>
                      )}
                      
                      {result.recommendations && result.recommendations.length > 0 && (
                        <div>
                          <h4 className="font-medium text-sm text-gray-700 mb-1">Рекомендации:</h4>
                          <ul className="list-disc pl-4 text-sm text-gray-600 space-y-1">
                            {result.recommendations.slice(0, 3).map((rec: string, index: number) => (
                              <li key={index}>{rec}</li>
                            ))}
                          </ul>
                          {result.recommendations.length > 3 && (
                            <p className="text-sm text-gray-500 mt-1">
                              И еще {result.recommendations.length - 3} рекомендаций...
                            </p>
                          )}
                        </div>
                      )}

                      {result.score !== undefined && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-700">Оценка этичности:</span>
                          <Badge className={
                            result.score >= 8 ? 'bg-green-100 text-green-800' :
                            result.score >= 6 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {result.score}/10
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Кнопки действий */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  className="flex-1"
                  onClick={() => {
                    const resultsText = Object.entries(toolResults)
                      .map(([toolId, result]) => `${result.toolName}:\n${result.summary || 'Результат сохранен'}\n`)
                      .join('\n');
                    
                    navigator.clipboard.writeText(resultsText);
                    // Здесь можно добавить toast-уведомление
                  }}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Скопировать отчет
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    const data = JSON.stringify(toolResults, null, 2);
                    const blob = new Blob([data], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `ai-ethics-analysis-${new Date().toISOString().split('T')[0]}.json`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Экспорт JSON
                </Button>
              </div>
            </div>
          ) : (
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-8 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Результатов пока нет
                </h3>
                <p className="text-gray-600 mb-4">
                  Запустите любой инструмент из вкладки "Обзор инструментов", чтобы увидеть результаты здесь.
                </p>
                <Button onClick={() => setActiveTab('overview')}>
                  Перейти к инструментам
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      </div>
    </DashboardLayout>
  );
}

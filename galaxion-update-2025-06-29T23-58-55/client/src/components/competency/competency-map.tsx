import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, Info, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Типы данных для компетенций
interface CompetencyIndicator {
  description: string;
  examples: string[];
}

interface Competency {
  id: number;
  name: string;
  description: string;
  category: string;
  level: string;
  parentId: number | null;
  behavioralIndicators: CompetencyIndicator[] | null;
  importance?: number;
  bloomLevel?: string;
  moduleDescription?: string;
}

interface ModuleWithCompetencies {
  id: number;
  title: string;
  description: string;
  orderIndex: number;
  competencies: Competency[];
}

interface UserCompetencyProgress {
  id: number;
  userId: number;
  dnaId: number;
  currentLevel: string;
  targetLevel: string | null;
  progress: number;
  lastAssessmentDate: string | null;
  competencyName: string;
  competencyDescription: string;
  competencyCategory: string;
  competencyLevel: string;
  behavioralIndicators: CompetencyIndicator[] | null;
}

interface CompetencyMapProps {
  courseId: number;
  userId?: number;
}

// Функция для цветового кодирования уровней компетенций
const getLevelColor = (level: string) => {
  switch (level) {
    case "awareness":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "knowledge":
      return "bg-green-100 text-green-800 border-green-300";
    case "application":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "mastery":
      return "bg-orange-100 text-orange-800 border-orange-300";
    case "expertise":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

// Функция для перевода уровней на русский язык
const getTranslatedLevel = (level: string) => {
  switch (level) {
    case "awareness":
      return "Осведомленность";
    case "knowledge":
      return "Знание";
    case "application":
      return "Применение";
    case "mastery":
      return "Освоение";
    case "expertise":
      return "Экспертиза";
    default:
      return level;
  }
};

// Функция для перевода категорий на русский язык
const getTranslatedCategory = (category: string) => {
  switch (category) {
    case "programming":
      return "Программирование";
    case "data":
      return "Данные";
    case "ml":
      return "Машинное обучение";
    case "soft-skills":
      return "Гибкие навыки";
    case "domain-knowledge":
      return "Предметная область";
    default:
      return category;
  }
};

// Отображение значка важности компетенции
const ImportanceIndicator = ({ importance }: { importance: number }) => {
  const dots = [];
  for (let i = 0; i < 3; i++) {
    dots.push(
      <span
        key={i}
        className={`inline-block w-2 h-2 mx-0.5 rounded-full ${
          i < importance ? "bg-blue-600" : "bg-gray-300"
        }`}
      />
    );
  }
  return (
    <div className="flex items-center ml-2" title={`Важность: ${importance}/3`}>
      {dots}
    </div>
  );
};

// Компонент карты компетенций
export const CompetencyMap: React.FC<CompetencyMapProps> = ({ courseId, userId }) => {
  const [activeTab, setActiveTab] = useState<string>("module");
  
  // Получение данных о компетенциях для курса
  const { data: moduleCompetencies, isLoading: isLoadingModules, error: moduleError } = useQuery({
    queryKey: ["/api/competency-map/course", courseId],
    queryFn: async () => {
      const response = await fetch(`/api/competency-map/course/${courseId}`);
      if (!response.ok) {
        throw new Error("Не удалось получить компетенции курса");
      }
      return response.json() as Promise<ModuleWithCompetencies[]>;
    },
    enabled: !!courseId
  });
  
  // Получение прогресса пользователя по компетенциям (если передан userId)
  const { data: userProgress, isLoading: isLoadingProgress } = useQuery({
    queryKey: ["/api/competency-map/user/progress", userId],
    queryFn: async () => {
      const response = await fetch(`/api/competency-map/user/${userId}/progress`);
      if (!response.ok) {
        throw new Error("Не удалось получить прогресс пользователя");
      }
      return response.json() as Promise<UserCompetencyProgress[]>;
    },
    enabled: !!userId
  });
  
  // Получение полной карты компетенций курса
  const { data: competencyMap, isLoading: isLoadingMap } = useQuery({
    queryKey: ["/api/competency-map/course/map", courseId],
    queryFn: async () => {
      const response = await fetch(`/api/competency-map/course/${courseId}/map`);
      if (!response.ok) {
        throw new Error("Не удалось получить карту компетенций");
      }
      return response.json();
    },
    enabled: !!courseId && activeTab === "map"
  });
  
  // Загрузка данных
  if (isLoadingModules || (isLoadingProgress && userId)) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Загрузка карты компетенций...</span>
      </div>
    );
  }
  
  // Ошибка загрузки
  if (moduleError) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Ошибка</AlertTitle>
        <AlertDescription>
          Не удалось загрузить карту компетенций. 
          Пожалуйста, попробуйте обновить страницу.
        </AlertDescription>
      </Alert>
    );
  }
  
  // Если нет данных о компетенциях
  if (!moduleCompetencies || moduleCompetencies.length === 0) {
    return (
      <Alert className="mb-4">
        <Info className="h-4 w-4" />
        <AlertTitle>Информация</AlertTitle>
        <AlertDescription>
          Для этого курса пока не определены компетенции.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="module" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="module">По модулям</TabsTrigger>
          <TabsTrigger value="category">По категориям</TabsTrigger>
          <TabsTrigger value="map">Карта компетенций</TabsTrigger>
          {userId && <TabsTrigger value="progress">Мой прогресс</TabsTrigger>}
        </TabsList>
        
        {/* Вкладка компетенций по модулям */}
        <TabsContent value="module" className="space-y-4">
          <div className="grid gap-4">
            {moduleCompetencies.map((module) => (
              <Accordion key={module.id} type="single" collapsible className="w-full">
                <AccordionItem value={`module-${module.id}`}>
                  <AccordionTrigger className="hover:bg-slate-50 px-4 rounded-lg">
                    <div>
                      <h3 className="text-lg font-medium">{module.title}</h3>
                      <span className="text-sm text-muted-foreground">
                        {module.competencies.length} компетенций
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2">
                    {module.competencies.length === 0 ? (
                      <p className="text-muted-foreground text-sm px-4">
                        Для этого модуля пока не определены компетенции
                      </p>
                    ) : (
                      <div className="grid gap-3 px-4">
                        {module.competencies.map((competency) => (
                          <Card key={`${module.id}-${competency.id}`} className="overflow-hidden">
                            <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between">
                              <div>
                                <div className="flex items-center">
                                  <CardTitle className="text-base">
                                    {competency.name}
                                  </CardTitle>
                                  {competency.importance && (
                                    <ImportanceIndicator importance={competency.importance} />
                                  )}
                                </div>
                                <CardDescription className="mt-1">
                                  {competency.description}
                                </CardDescription>
                              </div>
                              <div className="flex gap-2">
                                <Badge 
                                  variant="outline" 
                                  className={getLevelColor(competency.level)}
                                >
                                  {getTranslatedLevel(competency.level)}
                                </Badge>
                                <Badge 
                                  variant="outline" 
                                  className="bg-gray-100"
                                >
                                  {getTranslatedCategory(competency.category)}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-2">
                              {userId && userProgress && (
                                <div className="mb-2">
                                  {userProgress.find(p => p.dnaId === competency.id) ? (
                                    <div className="space-y-1">
                                      <div className="flex justify-between text-xs">
                                        <span>Прогресс</span>
                                        <span>{userProgress.find(p => p.dnaId === competency.id)?.progress}%</span>
                                      </div>
                                      <Progress 
                                        value={userProgress.find(p => p.dnaId === competency.id)?.progress || 0}
                                      />
                                    </div>
                                  ) : (
                                    <div className="text-xs text-muted-foreground">
                                      Нет данных о прогрессе
                                    </div>
                                  )}
                                </div>
                              )}
                              {competency.behavioralIndicators && competency.behavioralIndicators.length > 0 && (
                                <div className="mt-3">
                                  <h4 className="text-sm font-medium mb-2">Поведенческие индикаторы:</h4>
                                  <ul className="text-sm space-y-1 list-disc list-inside">
                                    {competency.behavioralIndicators.map((indicator, idx) => (
                                      <li key={idx}>{indicator.description}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {competency.moduleDescription && (
                                <div className="mt-3 text-sm text-muted-foreground">
                                  <p>
                                    <span className="font-medium">В контексте модуля: </span>
                                    {competency.moduleDescription}
                                  </p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        </TabsContent>
        
        {/* Вкладка компетенций по категориям */}
        <TabsContent value="category" className="space-y-4">
          {(() => {
            // Группируем все компетенции по категориям
            const categories: { [key: string]: Competency[] } = {};
            
            moduleCompetencies.forEach(module => {
              module.competencies.forEach(competency => {
                if (!categories[competency.category]) {
                  categories[competency.category] = [];
                }
                // Добавляем только уникальные компетенции
                if (!categories[competency.category].some(c => c.id === competency.id)) {
                  categories[competency.category].push(competency);
                }
              });
            });
            
            return Object.keys(categories).map(category => (
              <Accordion key={category} type="single" collapsible className="w-full">
                <AccordionItem value={`category-${category}`}>
                  <AccordionTrigger className="hover:bg-slate-50 px-4 rounded-lg">
                    <div>
                      <h3 className="text-lg font-medium">
                        {getTranslatedCategory(category)}
                      </h3>
                      <span className="text-sm text-muted-foreground">
                        {categories[category].length} компетенций
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2">
                    <div className="grid gap-3 px-4">
                      {categories[category].map((competency) => (
                        <Card key={competency.id} className="overflow-hidden">
                          <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between">
                            <div>
                              <CardTitle className="text-base">
                                {competency.name}
                              </CardTitle>
                              <CardDescription className="mt-1">
                                {competency.description}
                              </CardDescription>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={getLevelColor(competency.level)}
                            >
                              {getTranslatedLevel(competency.level)}
                            </Badge>
                          </CardHeader>
                          <CardContent className="p-4 pt-2">
                            {userId && userProgress && (
                              <div className="mb-2">
                                {userProgress.find(p => p.dnaId === competency.id) ? (
                                  <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                      <span>Прогресс</span>
                                      <span>{userProgress.find(p => p.dnaId === competency.id)?.progress}%</span>
                                    </div>
                                    <Progress 
                                      value={userProgress.find(p => p.dnaId === competency.id)?.progress || 0}
                                    />
                                  </div>
                                ) : (
                                  <div className="text-xs text-muted-foreground">
                                    Нет данных о прогрессе
                                  </div>
                                )}
                              </div>
                            )}
                            {competency.behavioralIndicators && competency.behavioralIndicators.length > 0 && (
                              <div className="mt-3">
                                <h4 className="text-sm font-medium mb-2">Поведенческие индикаторы:</h4>
                                <ul className="text-sm space-y-1 list-disc list-inside">
                                  {competency.behavioralIndicators.map((indicator, idx) => (
                                    <li key={idx}>{indicator.description}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ));
          })()}
        </TabsContent>
        
        {/* Вкладка карты компетенций */}
        <TabsContent value="map" className="space-y-4">
          {isLoadingMap ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2">Загрузка карты компетенций...</span>
            </div>
          ) : !competencyMap ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Информация</AlertTitle>
              <AlertDescription>
                Для этого курса пока не построена карта компетенций.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">{competencyMap.course.title}</h3>
                <p className="text-muted-foreground">{competencyMap.course.description}</p>
                
                <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {competencyMap.competencies
                    .filter(comp => !comp.parentId) // Только корневые компетенции
                    .map(competency => (
                      <Card key={competency.id} className="overflow-hidden">
                        <CardHeader className="p-4 pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{competency.name}</CardTitle>
                            <Badge variant="outline" className={getLevelColor(competency.level)}>
                              {getTranslatedLevel(competency.level)}
                            </Badge>
                          </div>
                          <CardDescription className="mt-1">{competency.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-2">
                          {/* Отображаем дочерние компетенции, если они есть */}
                          {competency.children && competency.children.length > 0 && (
                            <div className="mt-2">
                              <h4 className="text-sm font-medium mb-2">Включает в себя:</h4>
                              <ul className="space-y-2">
                                {competency.children.map(childId => {
                                  const child = competencyMap.competencies.find(c => c.id === childId);
                                  return child ? (
                                    <li key={childId} className="flex items-center text-sm">
                                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${getLevelColor(child.level)}`}></span>
                                      <span>{child.name}</span>
                                    </li>
                                  ) : null;
                                })}
                              </ul>
                            </div>
                          )}
                          
                          {/* Показываем модули, в которых встречается эта компетенция */}
                          <div className="mt-4">
                            <h4 className="text-sm font-medium mb-2">Развивается в модулях:</h4>
                            <div className="flex flex-wrap gap-2">
                              {competencyMap.modules
                                .filter(module => module.competencyIds.includes(competency.id))
                                .map(module => (
                                  <Badge key={module.id} variant="secondary">
                                    {module.title}
                                  </Badge>
                                ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            </div>
          )}
        </TabsContent>
        
        {/* Вкладка прогресса пользователя */}
        {userId && (
          <TabsContent value="progress" className="space-y-4">
            {!userProgress || userProgress.length === 0 ? (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Нет данных о прогрессе</AlertTitle>
                <AlertDescription>
                  У вас пока нет данных о прогрессе по компетенциям этого курса.
                  Пройдите диагностику или начните обучение, чтобы получить оценку уровня компетенций.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Ваш текущий уровень компетенций</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {userProgress.map(progress => (
                    <Card key={progress.id} className="overflow-hidden">
                      <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between">
                        <div>
                          <CardTitle className="text-base">{progress.competencyName}</CardTitle>
                          <CardDescription className="mt-1">
                            {progress.competencyDescription}
                          </CardDescription>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          <Badge variant="outline" className={getLevelColor(progress.currentLevel)}>
                            {getTranslatedLevel(progress.currentLevel)}
                          </Badge>
                          {progress.targetLevel && (
                            <Badge variant="outline" className="bg-purple-100 text-purple-800">
                              Цель: {getTranslatedLevel(progress.targetLevel)}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Прогресс</span>
                            <span>{progress.progress}%</span>
                          </div>
                          <Progress value={progress.progress} />
                        </div>
                        
                        {progress.lastAssessmentDate && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            Последняя оценка: {new Date(progress.lastAssessmentDate).toLocaleDateString()}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default CompetencyMap;
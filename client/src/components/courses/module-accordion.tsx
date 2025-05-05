import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Clock, CheckCircle, Lock, PlayCircle, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

interface Lesson {
  id: number;
  title: string;
  completed?: boolean;
  locked?: boolean;
  type: string;
  estimatedDuration: number;
  description?: string;
  content?: string;
}

interface Module {
  id: number;
  title: string;
  description: string;
  progress?: number;
  completed?: boolean;
  lessons?: Lesson[];
}

interface ModuleAccordionProps {
  modules: Module[];
  currentLessonId?: number;
  onLessonSelect: (lessonId: number) => void;
}

export function ModuleAccordion({ modules = [], currentLessonId, onLessonSelect }: ModuleAccordionProps) {
  const [, navigate] = useLocation();
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({});
  const [loadedModulesLessons, setLoadedModulesLessons] = useState<Record<number, boolean>>({});
  
  if (!modules || modules.length === 0) {
    return (
      <Card className="p-4 text-center">
        <p>Модули курса не найдены</p>
      </Card>
    );
  }

  const handleModuleToggle = (moduleId: number, isExpanded: boolean) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: isExpanded
    }));
  };
  
  return (
    <Accordion type="single" collapsible className="w-full">
      {modules.map((module) => {
        // Используем React Query для загрузки уроков каждого модуля
        const { data: moduleLessons, isLoading: isLoadingLessons } = useQuery({
          queryKey: [`/api/modules/${module.id}/lessons`],
          enabled: !!expandedModules[module.id], // Загружаем только если модуль развернут
          queryFn: async () => {
            try {
              console.log(`Загрузка уроков для модуля ${module.id}`);
              const response = await fetch(`/api/modules/${module.id}/lessons`);
              if (!response.ok) {
                throw new Error('Failed to fetch lessons');
              }
              const data = await response.json();
              console.log('Уроки модуля:', data);
              
              // Отмечаем модуль как загруженный
              setLoadedModulesLessons(prev => ({
                ...prev,
                [module.id]: true
              }));
              
              return data;
            } catch (error) {
              console.error('Ошибка при загрузке уроков:', error);
              return [];
            }
          }
        });

        // Уроки для отображения - либо из API, либо из пропсов (если есть)
        const lessonsToDisplay = (expandedModules[module.id] && moduleLessons) ? 
          moduleLessons : 
          module.lessons || [];

        // Вычисляем прогресс модуля (если не указан в данных)
        const moduleProgress = module.progress !== undefined ? 
          module.progress : 
          (lessonsToDisplay.length > 0 ? 
            Math.round((lessonsToDisplay.filter(l => l.completed).length / lessonsToDisplay.length) * 100) : 
            0);

        return (
          <AccordionItem 
            key={module.id} 
            value={`module-${module.id}`}
            onExpandedChange={(expanded) => {
              handleModuleToggle(module.id, expanded);
            }}
          >
            <AccordionTrigger className="hover:bg-accent/20 px-4 rounded-md">
              <div className="flex flex-col items-start text-left w-full">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    {module.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                      <span className="h-4 w-4 mr-2"></span>
                    )}
                    <span className="font-medium">{module.title}</span>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {module.completed ? "Завершено" : `${moduleProgress}%`}
                  </Badge>
                </div>
                <div className="mt-2 w-full">
                  <Progress value={moduleProgress} className="h-1" />
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              <p className="text-sm text-muted-foreground mb-4">{module?.description || 'Описание отсутствует'}</p>
              <div className="space-y-2">
                {isLoadingLessons && (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="ml-2">Загрузка уроков...</span>
                  </div>
                )}
                
                {!isLoadingLessons && lessonsToDisplay.length > 0 ? (
                  lessonsToDisplay.map((lesson) => (
                    <div
                      key={lesson.id}
                      className={`p-3 rounded-md border flex justify-between items-center ${
                        currentLessonId === lesson.id ? "bg-primary/10 border-primary" : ""
                      } ${lesson.locked ? "opacity-70" : "hover:bg-accent/20 cursor-pointer"}`}
                      onClick={() => {
                        if (!lesson.locked) {
                          onLessonSelect(lesson.id);
                          navigate(`/courses/ai-literacy-101/modules/${module.id}/lessons/${lesson.id}`);
                        }
                      }}
                    >
                      <div className="flex items-start">
                        {lesson.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                        ) : lesson.locked ? (
                          <Lock className="h-5 w-5 text-muted-foreground mt-0.5 mr-3 flex-shrink-0" />
                        ) : (
                          <PlayCircle className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                        )}
                        <div>
                          <div className="font-medium">{lesson.title}</div>
                          <div className="flex items-center mt-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{lesson.estimatedDuration || 0} мин</span>
                            <span className="mx-2">•</span>
                            <Badge variant="outline" className="text-xs py-0 h-5">
                              {lesson.type === "video"
                                ? "Видео"
                                : lesson.type === "quiz"
                                ? "Тест"
                                : lesson.type === "interactive"
                                ? "Практика"
                                : "Текст"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {lesson.locked ? (
                        <Badge variant="outline">Заблокировано</Badge>
                      ) : lesson.completed ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          Завершено
                        </Badge>
                      ) : currentLessonId === lesson.id ? (
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          Текущий
                        </Badge>
                      ) : (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/courses/ai-literacy-101/modules/${module.id}/lessons/${lesson.id}`);
                          }}
                        >
                          Начать
                        </Button>
                      )}
                    </div>
                  ))
                ) : !isLoadingLessons ? (
                  <div className="py-2 px-4 text-center text-muted-foreground">
                    <p>Уроки ещё не добавлены</p>
                  </div>
                ) : null}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
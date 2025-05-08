import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Rocket, ChevronRight, Clock, Star, Trophy, FileText } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Glassmorphism } from "@/components/ui/glassmorphism";

interface Course {
  id: number;
  title: string;
  description: string;
  slug: string;
  icon: string;
  modules: number;
  level: string;
  difficulty: number;
  color: string;
  access: string;
  estimatedDuration?: number;
  tags?: string[];
  authorId?: number;
  skillMatch?: number; // Процент соответствия навыкам пользователя
  recommendationReason?: string; // Причина рекомендации
}

interface RecommendationsDisplayProps {
  courseIds: number[];
  onQuickStart?: (courseId: number) => void;
}

export function RecommendationsDisplay({
  courseIds,
  onQuickStart
}: RecommendationsDisplayProps) {
  const [, setLocation] = useLocation();
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  
  // Загрузка данных о рекомендованных курсах
  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses/recommended", courseIds],
    queryFn: async () => {
      try {
        // Для демо-режима используем userId=999
        const isDemoMode = !localStorage.getItem('token'); // Проверка авторизации
        const endpoint = isDemoMode 
          ? `/api/courses/recommended?userId=999` 
          : `/api/courses/recommended`;
          
        console.log(`[RecommendationsDisplay] Запрос рекомендаций, демо-режим: ${isDemoMode}`);
        
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error(`Ошибка загрузки рекомендованных курсов: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`[RecommendationsDisplay] Получены рекомендации: ${data.length} курсов`);
        return data;
      } catch (error) {
        console.error("[RecommendationsDisplay] Ошибка:", error);
        return []; // Возвращаем пустой массив в случае ошибки
      }
    },
    enabled: courseIds.length > 0 || !localStorage.getItem('token'), // Включаем запрос для демо-режима
    placeholderData: [],
  });
  
  // Автоматический выбор первого курса при загрузке данных
  useEffect(() => {
    if (courses && courses.length > 0 && !selectedCourse) {
      setSelectedCourse(courses[0].id);
    }
  }, [courses, selectedCourse]);
  
  // Функция для обработки быстрого старта
  const handleQuickStart = (courseId: number) => {
    if (onQuickStart) {
      onQuickStart(courseId);
    } else {
      // Если колбэк не передан, просто перенаправляем на страницу курса
      setLocation(`/courses/${courseId}`);
    }
  };
  
  // Получение текущего выбранного курса
  const currentCourse = courses?.find(course => course.id === selectedCourse);
  
  // Компонент индикатора соответствия навыков
  const SkillMatchIndicator = ({ match }: { match?: number }) => {
    if (match === undefined) return null;
    
    const getColorClass = () => {
      if (match >= 80) return "text-green-400";
      if (match >= 60) return "text-yellow-400";
      if (match >= 40) return "text-orange-400";
      return "text-red-400";
    };
    
    return (
      <div className="flex items-center gap-1.5">
        <div className="h-1.5 w-16 bg-white/10 rounded-full overflow-hidden">
          <div 
            className={`h-full ${match >= 80 ? 'bg-green-400' : match >= 60 ? 'bg-yellow-400' : match >= 40 ? 'bg-orange-400' : 'bg-red-400'}`}
            style={{ width: `${match}%` }}
          ></div>
        </div>
        <span className={`text-xs font-medium ${getColorClass()}`}>{match}%</span>
      </div>
    );
  };
  
  // Функция для рендеринга иконки уровня сложности
  const renderDifficultyStars = (difficulty: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={12}
            className={i < difficulty ? "fill-yellow-400 text-yellow-400" : "text-white/20"}
          />
        ))}
      </div>
    );
  };
  
  // Функция для рендеринга бэйджа уровня курса
  const renderLevelBadge = (level: string) => {
    const levelConfig: Record<string, { color: string, label: string }> = {
      "basic": { color: "bg-blue-500/20 text-blue-400", label: "Базовый" },
      "intermediate": { color: "bg-green-500/20 text-green-400", label: "Средний" },
      "advanced": { color: "bg-orange-500/20 text-orange-400", label: "Продвинутый" },
      "expert": { color: "bg-red-500/20 text-red-400", label: "Экспертный" },
    };
    
    const config = levelConfig[level] || { color: "bg-gray-500/20 text-gray-400", label: level };
    
    return (
      <Badge variant="outline" className={`${config.color} border-0`}>
        {config.label}
      </Badge>
    );
  };
  
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Card className="border-primary/20 bg-space-900/50 backdrop-blur-sm">
          <CardHeader>
            <Skeleton className="h-8 w-3/5 mb-2" />
            <Skeleton className="h-4 w-4/5" />
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-4">
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
            <div className="md:col-span-2">
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!courses || courses.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <Card className="border-primary/20 bg-space-900/50 backdrop-blur-sm p-8 text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-orbitron text-center">
              Рекомендации еще не готовы
            </CardTitle>
            <CardDescription>
              Мы работаем над подбором курсов, которые наилучшим образом подойдут для вашего профиля
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              onClick={() => setLocation("/courses")}
              className="bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1]"
            >
              Просмотреть все курсы
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="border-primary/20 bg-space-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-orbitron text-center bg-clip-text text-transparent bg-gradient-to-r from-[#B28DFF] via-[#8BE0F7] to-[#B28DFF]">
            Ваши персональные рекомендации
          </CardTitle>
          <CardDescription className="text-center">
            На основе ваших ответов мы подобрали курсы, которые наилучшим образом подойдут для достижения ваших целей
          </CardDescription>
        </CardHeader>
        
        <CardContent className="grid md:grid-cols-3 gap-6">
          {/* Список курсов */}
          <div className="md:col-span-1 space-y-3">
            {courses.map((course) => (
              <Glassmorphism
                key={course.id}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  selectedCourse === course.id 
                    ? "border-l-4 border-l-primary" 
                    : "border-l-4 border-l-transparent hover:border-l-white/30"
                }`}
                onClick={() => setSelectedCourse(course.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded bg-${course.color || "primary"}/20 text-${course.color || "primary"}`}>
                    <div dangerouslySetInnerHTML={{ __html: course.icon }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{course.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <SkillMatchIndicator match={course.skillMatch} />
                      <Badge variant="outline" className="text-xs py-0 h-5">
                        {course.modules} {course.modules === 1 ? "модуль" : "модуля"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Glassmorphism>
            ))}
          </div>
          
          {/* Детали выбранного курса */}
          <div className="md:col-span-2">
            <AnimatePresence mode="wait">
              {currentCourse && (
                <motion.div
                  key={currentCourse.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <Glassmorphism className="p-6 rounded-lg h-full">
                    <div className="flex flex-col h-full">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-lg bg-${currentCourse.color || "primary"}/20 text-${currentCourse.color || "primary"}`}>
                            <div dangerouslySetInnerHTML={{ __html: currentCourse.icon }} />
                          </div>
                          <div>
                            <h2 className="text-xl font-semibold">{currentCourse.title}</h2>
                            <div className="flex items-center gap-2 mt-1">
                              {renderLevelBadge(currentCourse.level)}
                              <div className="flex items-center gap-1 text-white/60 text-xs">
                                <FileText size={12} />
                                <span>{currentCourse.modules} {currentCourse.modules === 1 ? "модуль" : "модуля"}</span>
                              </div>
                              <div className="flex items-center gap-1 text-white/60 text-xs">
                                <Clock size={12} />
                                <span>
                                  {currentCourse.estimatedDuration
                                    ? `${currentCourse.estimatedDuration} мин.`
                                    : "~" + currentCourse.modules * 40 + " мин."}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          {renderDifficultyStars(currentCourse.difficulty)}
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-white/80">{currentCourse.description}</p>
                      </div>
                      
                      {currentCourse.recommendationReason && (
                        <div className="mt-4 p-3 bg-primary/10 border-l-2 border-primary rounded-sm">
                          <p className="text-sm text-white/80">
                            <span className="font-semibold">Почему это для вас: </span>
                            {currentCourse.recommendationReason}
                          </p>
                        </div>
                      )}
                      
                      {currentCourse.tags && currentCourse.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {currentCourse.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="mt-6 flex gap-3">
                        <Button 
                          onClick={() => handleQuickStart(currentCourse.id)}
                          className="bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] flex-1"
                        >
                          <Rocket className="h-4 w-4 mr-2" />
                          Быстрый старт
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          onClick={() => setLocation(`/courses/${currentCourse.id}`)}
                        >
                          Подробнее
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                      
                      <Accordion type="single" collapsible className="mt-4">
                        <AccordionItem value="whatlearn">
                          <AccordionTrigger className="text-sm">Чему вы научитесь</AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-2">
                              {[1, 2, 3].map((i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <Check className="h-4 w-4 text-green-400 mt-0.5" />
                                  <span className="text-sm text-white/80">
                                    {i === 1 && "Освоите ключевые концепции"}
                                    {i === 2 && "Научитесь применять знания на практике"}
                                    {i === 3 && "Сможете создавать собственные проекты"}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                        
                        <AccordionItem value="requirements">
                          <AccordionTrigger className="text-sm">Требования</AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-2">
                              {[1, 2].map((i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <Trophy className="h-4 w-4 text-yellow-400 mt-0.5" />
                                  <span className="text-sm text-white/80">
                                    {i === 1 && "Базовые знания программирования"}
                                    {i === 2 && "Желание учиться и экспериментировать"}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </Glassmorphism>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
        
        <CardFooter className="justify-between flex-wrap gap-4">
          <Button 
            variant="outline" 
            onClick={() => setLocation("/courses")}
          >
            Все курсы
          </Button>
          
          <div className="text-sm text-white/60">
            Рекомендации обновляются автоматически на основе вашего прогресса
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
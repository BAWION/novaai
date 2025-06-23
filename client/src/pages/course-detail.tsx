import React, { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ethicsCourse } from "@/data";

export default function CourseDetailPage() {
  const [, params] = useRoute("/courses/:slug/detail");
  const [, setLocation] = useLocation();
  const [expandedModules, setExpandedModules] = useState<number[]>([]);

  // Получаем данные курса (пока используем локальные данные)
  const getCourseData = () => {
    const slug = params?.slug;
    if (slug === "ethics-ai-safety") {
      return ethicsCourse;
    }
    // Можно добавить другие курсы
    return null;
  };

  const course = getCourseData();

  if (!course) {
    return (
      <DashboardLayout title="Курс не найден">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Курс не найден</h2>
          <Button onClick={() => setLocation("/courses")}>
            Вернуться к курсам
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const startLearning = () => {
    // Переходим к первому уроку первого модуля
    const firstModule = course.modules[0];
    const firstLesson = firstModule.lessons[0];
    setLocation(`/courses/${params?.slug}/modules/${firstModule.id}/lessons/${firstLesson.id}`);
  };

  const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0);
  const completedLessons = course.modules.reduce((total, module) => 
    total + module.lessons.filter(lesson => lesson.completed).length, 0
  );
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "beginner": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "intermediate": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "advanced": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video": return "fa-play-circle";
      case "quiz": return "fa-question-circle";
      case "interactive": return "fa-code";
      case "reading": return "fa-book-open";
      default: return "fa-file-text";
    }
  };

  const getLessonTypeColor = (type: string) => {
    switch (type) {
      case "video": return "text-blue-400";
      case "quiz": return "text-purple-400";
      case "interactive": return "text-green-400";
      case "reading": return "text-orange-400";
      default: return "text-gray-400";
    }
  };

  return (
    <DashboardLayout title={course.title} subtitle="Детальный обзор курса">
      <div className="space-y-8">
        {/* Заголовок курса */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Glassmorphism className="p-6 md:p-8 rounded-xl">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                    <i className="fas fa-shield-alt text-2xl text-white"></i>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{course.title}</h1>
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getDifficultyColor(course.difficulty || "intermediate")}>
                        {course.difficulty === "beginner" ? "Начальный" : 
                         course.difficulty === "intermediate" ? "Средний" : "Продвинутый"}
                      </Badge>
                      <Badge variant="outline" className="border-white/20 text-white/80">
                        {course.modules.length} модулей
                      </Badge>
                      <Badge variant="outline" className="border-white/20 text-white/80">
                        {totalLessons} уроков
                      </Badge>
                      <Badge variant="outline" className="border-white/20 text-white/80">
                        ~{course.estimatedDuration} ч
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <p className="text-white/80 text-lg mb-6">{course.description}</p>
                
                <div className="flex flex-wrap gap-4">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    onClick={startLearning}
                  >
                    <i className="fas fa-play mr-2"></i>
                    {progressPercentage > 0 ? "Продолжить обучение" : "Начать обучение"}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-white/20 text-white hover:bg-white/10"
                    onClick={() => setLocation("/courses")}
                  >
                    <i className="fas fa-arrow-left mr-2"></i>
                    Назад к курсам
                  </Button>
                </div>
              </div>
              
              <div className="lg:w-80">
                <Card className="bg-black/30 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <i className="fas fa-chart-line text-green-400"></i>
                      Прогресс обучения
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-white/70">Завершено</span>
                          <span className="text-white font-medium">{completedLessons}/{totalLessons} уроков</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                        <div className="text-right text-sm text-white/70 mt-1">{progressPercentage}%</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-400">{course.modules.length}</div>
                          <div className="text-xs text-white/60">Модулей</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-400">{totalLessons}</div>
                          <div className="text-xs text-white/60">Уроков</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Glassmorphism>
        </motion.div>

        {/* Структура курса */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Glassmorphism className="p-6 rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <i className="fas fa-list-ul text-purple-400"></i>
                Структура курса
              </h2>
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 text-white/70 hover:bg-white/10"
                onClick={() => {
                  if (expandedModules.length === course.modules.length) {
                    setExpandedModules([]);
                  } else {
                    setExpandedModules(course.modules.map(m => m.id));
                  }
                }}
              >
                <i className={`fas ${expandedModules.length === course.modules.length ? 'fa-compress' : 'fa-expand'} mr-2`}></i>
                {expandedModules.length === course.modules.length ? "Свернуть все" : "Развернуть все"}
              </Button>
            </div>
            
            <div className="space-y-4">
              {course.modules.map((module, moduleIndex) => {
                const isExpanded = expandedModules.includes(module.id);
                const moduleProgress = module.lessons.filter(l => l.completed).length;
                const moduleTotal = module.lessons.length;
                const moduleProgressPercent = moduleTotal > 0 ? Math.round((moduleProgress / moduleTotal) * 100) : 0;
                
                return (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: moduleIndex * 0.1 }}
                  >
                    <Collapsible 
                      open={isExpanded} 
                      onOpenChange={() => toggleModule(module.id)}
                    >
                      <CollapsibleTrigger asChild>
                        <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600/30 to-blue-600/30 flex items-center justify-center text-purple-400 border border-purple-500/20">
                                  <span className="font-bold">{moduleIndex + 1}</span>
                                </div>
                                <div>
                                  <h3 className="text-lg font-semibold text-white mb-1">{module.title}</h3>
                                  <p className="text-white/60 text-sm">{module.description}</p>
                                  <div className="flex items-center gap-4 mt-2">
                                    <span className="text-xs text-white/50">{moduleTotal} уроков</span>
                                    <span className="text-xs text-white/50">~{module.estimatedDuration} мин</span>
                                    <div className="flex items-center gap-1">
                                      <Progress value={moduleProgressPercent} className="h-1 w-16" />
                                      <span className="text-xs text-white/70">{moduleProgressPercent}%</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                {moduleProgress === moduleTotal && moduleTotal > 0 && (
                                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <i className="fas fa-check text-green-400 text-sm"></i>
                                  </div>
                                )}
                                <i className={`fas ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'} text-white/50`}></i>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="ml-4 mt-4 space-y-2"
                            >
                              {module.lessons.map((lesson, lessonIndex) => (
                                <motion.div
                                  key={lesson.id}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.2, delay: lessonIndex * 0.05 }}
                                  className={`p-4 rounded-lg border transition-colors cursor-pointer ${
                                    lesson.completed 
                                      ? "bg-green-500/10 border-green-500/30 hover:bg-green-500/20" 
                                      : "bg-white/5 border-white/10 hover:bg-white/10"
                                  }`}
                                  onClick={() => setLocation(`/courses/${params?.slug}/modules/${module.id}/lessons/${lesson.id}`)}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        lesson.completed 
                                          ? "bg-green-500/20 text-green-400" 
                                          : "bg-white/10 text-white/60"
                                      }`}>
                                        {lesson.completed ? (
                                          <i className="fas fa-check text-sm"></i>
                                        ) : (
                                          <i className={`fas ${getLessonIcon(lesson.type)} text-sm ${getLessonTypeColor(lesson.type)}`}></i>
                                        )}
                                      </div>
                                      <div>
                                        <h4 className="font-medium text-white">{lesson.title}</h4>
                                        <div className="flex items-center gap-3 text-xs text-white/50">
                                          <span>{lesson.type === "video" ? "Видео" : 
                                                lesson.type === "quiz" ? "Тест" : 
                                                lesson.type === "interactive" ? "Интерактив" : "Чтение"}</span>
                                          <span>~{lesson.estimatedDuration} мин</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {lesson.completed && (
                                        <Badge variant="outline" className="border-green-500/30 text-green-400 text-xs">
                                          Завершено
                                        </Badge>
                                      )}
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-white/70 hover:text-white hover:bg-white/10"
                                      >
                                        <i className="fas fa-play text-sm"></i>
                                      </Button>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CollapsibleContent>
                    </Collapsible>
                  </motion.div>
                );
              })}
            </div>
          </Glassmorphism>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
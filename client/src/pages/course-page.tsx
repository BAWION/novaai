import React, { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { motion } from "framer-motion";
import { CourseOutline, QuizComponent, AIAssistantPanel } from "@/components/courses";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts.jsx";
import { CacheLessonButton } from "@/components/pwa/offline-status";
import { useOfflineStatus } from "@/hooks/use-pwa";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

// Пример демо-квиза для совместимости
const demoQuiz = {
  title: "Проверка знаний: Основы Python",
  description: "Проверьте ваше понимание основных концепций Python",
  totalPoints: 30,
  questions: [
    {
      id: 1,
      prompt: "Какой тип данных используется для хранения текста в Python?",
      type: "single-choice",
      points: 10,
      answers: [
        { id: 1, text: "int", isCorrect: false },
        { id: 2, text: "str", isCorrect: true },
        { id: 3, text: "float", isCorrect: false },
        { id: 4, text: "bool", isCorrect: false }
      ]
    }
  ]
};

export default function CoursePage() {
  const [, params] = useRoute("/courses/:slug");
  const [, setLocation] = useLocation();
  const [expandedModuleIds, setExpandedModuleIds] = useState<number[]>([]); 
  const [currentView, setCurrentView] = useState<"outline" | "content" | "quiz">("outline");
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  
  // Получаем данные о курсе из API
  const { data: apiCourse, isLoading: isLoadingCourse } = useQuery({
    queryKey: [`/api/courses/${params?.slug}`],
    enabled: !!params?.slug,
    queryFn: async () => {
      console.log(`Загрузка курса по slug: ${params?.slug}`);
      const response = await fetch(`/api/courses/${params?.slug}`);
      if (!response.ok) {
        throw new Error('Failed to fetch course');
      }
      const data = await response.json();
      console.log('API курс:', data);
      return data;
    }
  });
  
  // Получаем модули курса из API
  const { data: apiModules, isLoading: isLoadingModules } = useQuery({
    queryKey: [`/api/courses/${params?.slug}/modules`],
    enabled: !!params?.slug,
    queryFn: async () => {
      console.log(`Загрузка модулей для курса: ${params?.slug}`);
      const response = await fetch(`/api/courses/${params?.slug}/modules`);
      if (!response.ok) {
        throw new Error('Failed to fetch modules');
      }
      const data = await response.json();
      console.log('API модули:', data);
      return data;
    }
  });

  // Обработчик клика по уроку
  const handleLessonClick = (lessonId: number, moduleId: number) => {
    setSelectedLessonId(lessonId);
    setSelectedModuleId(moduleId);
    setCurrentView("content");
    
    if (!expandedModuleIds.includes(moduleId)) {
      setExpandedModuleIds([...expandedModuleIds, moduleId]);
    }
  };

  // Обработчик развертывания/сворачивания модуля
  const handleExpandToggle = (moduleId: number, expanded: boolean) => {
    if (expanded) {
      setExpandedModuleIds([...expandedModuleIds, moduleId]);
    } else {
      setExpandedModuleIds(expandedModuleIds.filter(id => id !== moduleId));
    }
  };

  // Переход к завершению квиза
  const handleQuizComplete = (score: number, total: number) => {
    console.log("Квиз завершен", { score, total });
    setCurrentView("outline");
  };

  // Переключение между содержимым урока и квизом
  const showQuiz = () => {
    setCurrentView("quiz");
  };

  // Возврат к оглавлению курса
  const backToOutline = () => {
    setCurrentView("outline");
  };

  // Переход к выбору всех курсов
  const backToCatalog = () => {
    setLocation("/courses");
  };

  // Найти текущий урок по ID (stub для совместимости)
  const findCurrentLesson = () => {
    return { type: "text", title: "Урок" };
  };

  // Найти предыдущий и следующий уроки (stub для совместимости)
  const findAdjacentLessons = () => {
    return { prev: null, next: null };
  };

  // Переход к предыдущему уроку
  const goToPrevLesson = () => {
    const { prev } = findAdjacentLessons();
    if (prev) {
      // handleLessonClick(prev.id, prev.moduleId);
    }
  };

  // Переход к следующему уроку
  const goToNextLesson = () => {
    const { next } = findAdjacentLessons();
    if (next) {
      // handleLessonClick(next.id, next.moduleId);
    }
  };

  // Клавиатурные сокращения
  const keyboardShortcuts = [
    {
      key: "j",
      handler: goToNextLesson,
      description: "Перейти к следующему уроку",
      group: "Навигация"
    },
    {
      key: "k",
      handler: goToPrevLesson,
      description: "Перейти к предыдущему уроку",
      group: "Навигация"
    },
    {
      key: "o",
      handler: backToOutline,
      description: "Вернуться к оглавлению курса",
      group: "Навигация"
    },
    {
      key: "c",
      handler: backToCatalog,
      description: "Вернуться к каталогу курсов",
      group: "Навигация"
    }
  ];

  const { ShortcutsHelp } = useKeyboardShortcuts(keyboardShortcuts);

  // Преобразование данных API в формат для компонента
  const prepareCourse = () => {
    if (!apiCourse || !apiModules) {
      return null;
    }
    
    return {
      id: apiCourse.id,
      title: apiCourse.title,
      description: apiCourse.description,
      modules: apiModules,
      progress: 0,
      estimatedDuration: apiCourse.estimatedDuration || 0,
      currentModuleId: null,
      currentLessonId: null
    };
  };

  const course = prepareCourse();

  // Показываем загрузку
  if (isLoadingCourse || isLoadingModules) {
    return (
      <DashboardLayout title="Загрузка курса...">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg">Загрузка курса...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Если курс не найден
  if (!course) {
    return (
      <DashboardLayout title="Курс не найден">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Курс не найден</h2>
            <p className="text-white/60 mb-6">Курс с указанным идентификатором не существует или недоступен.</p>
            <Button onClick={() => setLocation('/courses')}>
              Вернуться к курсам
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const { prev, next } = findAdjacentLessons();
  const currentLesson = findCurrentLesson();

  return (
    <DashboardLayout title={course?.title || "Курс"}>
      <div className="max-w-7xl mx-auto py-6 px-4">
        {/* Хлебные крошки и заголовок */}
        <div className="mb-6">
          <div className="flex items-center text-sm text-white/60 mb-2">
            <button 
              className="hover:text-white transition"
              onClick={backToCatalog}
            >
              Курсы
            </button>
            <i className="fas fa-chevron-right mx-2 text-xs"></i>
            <span className="text-white">{course.title}</span>
          </div>
          
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-semibold">{course.title}</h1>
            <div className="flex space-x-2">
              <Button 
                onClick={() => setLocation(`/courses/${params?.slug}/competency-map`)}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <i className="fas fa-map"></i>
                <span>Карта компетенций</span>
              </Button>
              <Button 
                onClick={backToCatalog}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <i className="fas fa-arrow-left"></i>
                <span>Вернуться к каталогу</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Основной контент */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Основной контент слева */}
          <div className="md:col-span-2">
            {currentView === "outline" && (
              <CourseOutline
                modules={course.modules || []}
                onModuleSelect={(moduleId) => {
                  setSelectedModuleId(moduleId);
                  setCurrentView("content");
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
            
            {currentView === "content" && (
              <div className="bg-space-800/30 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">{currentLesson?.title}</h2>
                  <button 
                    onClick={backToOutline}
                    className="text-white/60 hover:text-white"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                
                <div className="prose prose-invert max-w-none">
                  {currentLesson?.type === "text" && (
                    <div>
                      <p>Здесь будет содержимое текстового урока. Полная интеграция с TutorAI-функциями доступна в специальной странице урока.</p>
                    </div>
                  )}
                  
                  {currentLesson?.type === "video" && (
                    <div>
                      <div className="aspect-video bg-black/30 rounded-lg mb-4 flex items-center justify-center">
                        <i className="fas fa-play-circle text-4xl text-white/60"></i>
                      </div>
                      <p>Видеоурок будет здесь.</p>
                    </div>
                  )}
                  
                  {currentLesson?.type === "interactive" && (
                    <div>
                      <p>Интерактивный урок с примерами кода:</p>
                      <pre className="bg-black/30 p-3 rounded">
                        <code>
                          print("Hello, world!")<br/>
                          # Попробуйте изменить это приветствие
                        </code>
                      </pre>
                      <button className="px-4 py-2 bg-primary hover:bg-primary/80 rounded mt-2">
                        Запустить код
                      </button>
                    </div>
                  )}
                  
                  {currentLesson?.type === "quiz" && (
                    <div className="my-4">
                      <p>Пройдите квиз, чтобы проверить ваши знания.</p>
                      <button 
                        className="px-4 py-2 bg-primary hover:bg-primary/80 rounded mt-2"
                        onClick={showQuiz}
                      >
                        Начать квиз
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Навигация по урокам */}
                <div className="mt-8 flex justify-between border-t border-white/10 pt-4">
                  <Button
                    variant="secondary"
                    disabled={!prev}
                    onClick={goToPrevLesson}
                    className="flex items-center space-x-2"
                  >
                    <i className="fas fa-arrow-left"></i>
                    <span>Предыдущий урок</span>
                  </Button>
                  
                  <div className="text-sm text-white/60 self-center">
                    <kbd className="px-1.5 py-0.5 bg-space-700 rounded">J</kbd> / <kbd className="px-1.5 py-0.5 bg-space-700 rounded">K</kbd> для навигации
                  </div>
                  
                  <Button
                    variant="default"
                    disabled={!next}
                    onClick={goToNextLesson}
                    className="flex items-center space-x-2"
                  >
                    <span>Следующий урок</span>
                    <i className="fas fa-arrow-right"></i>
                  </Button>
                </div>
              </div>
            )}
            
            {currentView === "quiz" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <QuizComponent
                  quiz={demoQuiz}
                  onComplete={handleQuizComplete}
                />
              </motion.div>
            )}
          </div>
          
          {/* Боковая панель справа */}
          <div className="space-y-6">
            {/* Прогресс курса */}
            <div className="bg-space-800/50 p-4 rounded-xl border border-white/10">
              <h3 className="text-lg font-medium mb-3">Прогресс курса</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Завершено модулей:</span>
                  <span>0 из {course.modules?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Оставшееся время:</span>
                  <span>~{course.estimatedDuration || 0} мин</span>
                </div>
              </div>
            </div>
            
            {/* AI ассистент заглушка */}
            <div className="bg-space-800/50 p-4 rounded-xl border border-white/10">
              <h3 className="text-lg font-medium mb-3">AI Помощник</h3>
              <p className="text-sm text-white/60 mb-4">
                Полноценный AI-ассистент с TutorAI-функциями доступен на страницах уроков.
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  if (selectedLessonId && selectedModuleId) {
                    setLocation(`/courses/ai-literacy-101/modules/${selectedModuleId}/lessons/${selectedLessonId}`);
                  }
                }}
              >
                Перейти к уроку
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Модальная подсказка клавиатурных сокращений */}
      {ShortcutsHelp && <ShortcutsHelp />}
    </DashboardLayout>
  );
}
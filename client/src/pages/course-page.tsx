import React, { useState, useEffect } from "react";
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

// Пример данных для демонстрации UI
const demoModules = [
  {
    id: 1,
    title: "Введение в Python",
    description: "Основы языка Python и базовые концепции программирования",
    progress: 100,
    completed: true,
    estimatedDuration: 90,
    sections: [
      {
        id: 1,
        title: "Знакомство с Python",
        lessons: [
          {
            id: 101,
            title: "Что такое Python и его преимущества",
            type: "video",
            duration: 15,
            completed: true
          },
          {
            id: 102,
            title: "Установка Python и среды разработки",
            type: "text",
            duration: 10,
            completed: true
          },
          {
            id: 103,
            title: "Первая программа на Python",
            type: "interactive",
            duration: 20,
            completed: true
          }
        ]
      },
      {
        id: 2,
        title: "Основные типы данных",
        lessons: [
          {
            id: 104,
            title: "Числа и математические операции",
            type: "video",
            duration: 15,
            completed: true
          },
          {
            id: 105,
            title: "Строки и операции со строками",
            type: "text",
            duration: 15,
            completed: true
          },
          {
            id: 106,
            title: "Проверка знаний: типы данных",
            type: "quiz",
            duration: 15,
            completed: true
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Управляющие конструкции",
    description: "Условные операторы и циклы в Python",
    progress: 75,
    estimatedDuration: 120,
    sections: [
      {
        id: 3,
        title: "Условные операторы",
        lessons: [
          {
            id: 201,
            title: "Оператор if-else",
            type: "video",
            duration: 20,
            completed: true
          },
          {
            id: 202,
            title: "Вложенные условия и elif",
            type: "text",
            duration: 15,
            completed: true
          },
          {
            id: 203,
            title: "Логические операторы",
            type: "interactive",
            duration: 25,
            completed: true
          }
        ]
      },
      {
        id: 4,
        title: "Циклы",
        lessons: [
          {
            id: 204,
            title: "Цикл for и функция range()",
            type: "video",
            duration: 20,
            completed: true
          },
          {
            id: 205,
            title: "Цикл while",
            type: "text",
            duration: 15,
            completed: false
          },
          {
            id: 206,
            title: "Операторы break и continue",
            type: "interactive",
            duration: 25,
            completed: false
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Функции и модули",
    description: "Создание функций и работа с модулями в Python",
    progress: 0,
    estimatedDuration: 150,
    sections: [
      {
        id: 5,
        title: "Функции",
        lessons: [
          {
            id: 301,
            title: "Определение и вызов функций",
            type: "video",
            duration: 20,
            locked: false
          },
          {
            id: 302,
            title: "Параметры и возвращаемые значения",
            type: "text",
            duration: 20,
            locked: false
          },
          {
            id: 303,
            title: "Области видимости переменных",
            type: "interactive",
            duration: 30,
            locked: true
          }
        ]
      },
      {
        id: 6,
        title: "Модули и пакеты",
        lessons: [
          {
            id: 304,
            title: "Импорт модулей в Python",
            type: "video",
            duration: 25,
            locked: true
          },
          {
            id: 305,
            title: "Создание собственных модулей",
            type: "text",
            duration: 20,
            locked: true
          },
          {
            id: 306,
            title: "Популярные стандартные библиотеки",
            type: "quiz",
            duration: 35,
            locked: true
          }
        ]
      }
    ]
  }
];

const demoCourse = {
  id: 1,
  title: "Python для начинающих",
  description: "Полный курс по языку Python с нуля до первых проектов. Изучите основы программирования на одном из самых популярных и простых для освоения языков.",
  modules: demoModules,
  progress: 60,
  estimatedDuration: 360,
  currentModuleId: 2,
  currentLessonId: 205
};

// Пример данных для демонстрации квиза
const demoQuiz = {
  id: 1,
  title: "Проверка знаний: Типы данных в Python",
  description: "Проверьте свои знания базовых типов данных в Python",
  passingScore: 70,
  timeLimit: 5, // минуты
  questions: [
    {
      id: 1,
      prompt: "Какой тип данных не является изменяемым (immutable) в Python?",
      type: "single-choice",
      points: 10,
      answers: [
        { id: 1, text: "Список (list)", isCorrect: false },
        { id: 2, text: "Словарь (dict)", isCorrect: false },
        { id: 3, text: "Кортеж (tuple)", isCorrect: true },
        { id: 4, text: "Множество (set)", isCorrect: false }
      ]
    },
    {
      id: 2,
      prompt: "Выберите все правильные способы объявления строки в Python:",
      type: "multiple-choice",
      points: 15,
      answers: [
        { id: 5, text: "s = 'текст'", isCorrect: true },
        { id: 6, text: "s = \"текст\"", isCorrect: true },
        { id: 7, text: "s = {текст}", isCorrect: false },
        { id: 8, text: "s = '''текст'''", isCorrect: true }
      ]
    },
    {
      id: 3,
      prompt: "Что вернет выражение: 5 / 2 в Python 3?",
      type: "single-choice",
      points: 10,
      answers: [
        { id: 9, text: "2", isCorrect: false },
        { id: 10, text: "2.5", isCorrect: true },
        { id: 11, text: "2.0", isCorrect: false },
        { id: 12, text: "TypeError", isCorrect: false }
      ]
    }
  ]
};

// Пример данных для демонстрации AI ассистентов
const demoAssistants = [
  {
    id: "nova-teacher",
    name: "Нова Учитель",
    avatar: "👩‍🏫",
    specialty: "Python Expert",
    personality: "Вдумчивый, подробный, пошаговый",
    messages: [
      {
        id: "ai-welcome",
        sender: "ai",
        text: "Привет! Я Нова, ваш AI-ассистент в этом курсе Python. Я помогу вам разобраться с концепциями и ответить на вопросы. Что бы вы хотели узнать?",
        timestamp: new Date(),
        type: "info"
      }
    ]
  },
  {
    id: "quick-helper",
    name: "Быстрый Помощник",
    avatar: "⚡",
    specialty: "Code Solver",
    personality: "Краткий, по существу, с примерами кода",
    messages: [
      {
        id: "ai-welcome",
        sender: "ai",
        text: "Привет! Я помогу вам с конкретными примерами кода и быстрыми решениями. Задавайте вопросы о Python, и я постараюсь дать четкие и лаконичные ответы.",
        timestamp: new Date(),
        type: "info"
      }
    ]
  }
];

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
      try {
        console.log(`Загрузка курса по slug: ${params?.slug}`);
        const response = await fetch(`/api/courses/${params?.slug}`);
        if (!response.ok) {
          throw new Error('Failed to fetch course');
        }
        const data = await response.json();
        console.log('API курс:', data);
        return data;
      } catch (error) {
        console.error('Ошибка при загрузке курса:', error);
        throw error;
      }
    }
  });
  
  // Получаем модули курса из API
  const { data: apiModules, isLoading: isLoadingModules } = useQuery({
    queryKey: [`/api/courses/${params?.slug}/modules`],
    enabled: !!params?.slug,
    queryFn: async () => {
      try {
        console.log(`Загрузка модулей для курса: ${params?.slug}`);
        const response = await fetch(`/api/courses/${params?.slug}/modules`);
        if (!response.ok) {
          throw new Error('Failed to fetch modules');
        }
        const data = await response.json();
        console.log('API модули:', data);
        return data;
      } catch (error) {
        console.error('Ошибка при загрузке модулей:', error);
        throw error;
      }
    }
  });
  
  // Обработчик клика по уроку
  const handleLessonClick = (lessonId: number, moduleId: number) => {
    setSelectedLessonId(lessonId);
    setSelectedModuleId(moduleId);
    setCurrentView("content");
    
    // Если модуль не развернут, разворачиваем его
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
  const handleQuizComplete = (score: number, passed: boolean, answers: any[]) => {
    // В реальном приложении здесь отправили бы результаты на сервер
    console.log("Квиз завершен", { score, passed, answers });
    
    // Возвращаемся к контенту курса
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
  
  // Преобразование данных API в формат для компонента CourseOutline
  const prepareCourse = () => {
    if (!apiCourse || !apiModules) {
      return demoCourse; // Используем демо-данные, если API еще не загрузил данные
    }
    
    return {
      id: apiCourse.id,
      title: apiCourse.title,
      description: apiCourse.description,
      modules: apiModules,
      progress: 0, // Это нужно будет загружать из прогресса пользователя
      estimatedDuration: apiCourse.estimatedDuration || 0,
      currentModuleId: null,
      currentLessonId: null
    };
  };
  
  // Используем подготовленные данные курса
  const course = prepareCourse();
  
  // Найти текущий урок по ID (stub для совместимости)
  const findCurrentLesson = () => {
    return { type: "text", title: "Урок" }; // Временная заглушка
  };
  
  // Найти предыдущий и следующий уроки (stub для совместимости)
  const findAdjacentLessons = () => {
    return { prev: null, next: null }; // Временная заглушка
  };
  
  // Переход к предыдущему уроку
  const goToPrevLesson = () => {
    const { prev } = findAdjacentLessons();
    if (prev) {
      handleLessonClick(prev.id, prev.moduleId);
    }
  };
  
  // Переход к следующему уроку
  const goToNextLesson = () => {
    const { next } = findAdjacentLessons();
    if (next) {
      handleLessonClick(next.id, next.moduleId);
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
  
  // Получаем информацию о соседних уроках
  const { prev, next } = findAdjacentLessons();
  const currentLesson = findCurrentLesson();
  
  return (
    <DashboardLayout>
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
        
        {/* Основной контент */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Основной контент слева */}
          <div className="md:col-span-2">
            {currentView === "outline" && (
              <CourseOutline
                course={demoCourse}
                expandedModuleIds={expandedModuleIds}
                onLessonClick={handleLessonClick}
                onExpandToggle={handleExpandToggle}
              />
            )}
            
            {currentView === "content" && selectedLessonId && (
              <div className="bg-space-800/50 p-6 rounded-xl border border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <button
                    className="px-3 py-1.5 bg-space-700 rounded-md hover:bg-space-600 transition flex items-center text-sm"
                    onClick={backToOutline}
                  >
                    <i className="fas fa-arrow-left mr-2"></i> К оглавлению
                  </button>
                  
                  <div className="flex items-center gap-3">
                    {/* Кнопка кэширования урока для офлайн просмотра */}
                    <CacheLessonButton 
                      lessonId={selectedLessonId} 
                      resources={[
                        `/api/courses/${params?.slug}/lessons/${selectedLessonId}`,
                        // Добавьте здесь ссылки на ресурсы урока: видео, изображения и т.д.
                      ]} 
                    />
                    
                    <div className="text-sm text-white/60">
                      Урок {selectedLessonId} - {currentLesson?.type}
                    </div>
                  </div>
                </div>
                
                <h2 className="text-xl font-semibold mb-6">{currentLesson?.title}</h2>
                
                <div className="prose prose-invert max-w-none">
                  <p>Это пример содержимого урока. В реальном приложении здесь был бы контент урока, загруженный с сервера.</p>
                  
                  <p>Для урока типа <strong>{currentLesson?.type}</strong> можно было бы показать:</p>
                  
                  {currentLesson?.type === "video" && (
                    <div className="aspect-video bg-black/50 rounded-lg flex items-center justify-center mb-4">
                      <i className="fas fa-play-circle text-5xl text-primary"></i>
                    </div>
                  )}
                  
                  {currentLesson?.type === "interactive" && (
                    <div className="bg-space-900/70 p-4 rounded-lg my-4">
                      <h3>Интерактивный пример</h3>
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
                    variant="primary"
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
              <h3 className="font-medium mb-2">Прогресс курса</h3>
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white/70">Общий прогресс:</span>
                  <span className="text-white/70">{demoCourse.progress}%</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${demoCourse.progress}%` }}
                    transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
              
              <div className="text-sm text-white/60">
                <div className="flex justify-between mb-1">
                  <span>Модулей завершено:</span>
                  <span>{demoCourse.modules.filter(m => m.completed).length} из {demoCourse.modules.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Оставшееся время:</span>
                  <span>~{Math.round(demoCourse.estimatedDuration * (1 - demoCourse.progress/100))} мин</span>
                </div>
              </div>
            </div>
            
            {/* AI ассистент */}
            <AIAssistantPanel
              assistants={demoAssistants}
              currentLessonId={selectedLessonId || undefined}
              currentModuleId={selectedModuleId || undefined}
            />
          </div>
        </div>
      </div>
      
      {/* Модальная подсказка клавиатурных сокращений */}
      <ShortcutsHelp />
    </DashboardLayout>
  );
}
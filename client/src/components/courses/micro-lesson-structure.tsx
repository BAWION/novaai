import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowLeft, ArrowRight, BookOpen, Clock, Video, FileText, HelpCircle, Target, BookOpenCheck, ThumbsUp, Lightbulb } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import ReactMarkdown from "react-markdown";
import { QuizComponent, QuizQuestion, QuestionType } from "./quiz-component";
import { PracticeAssignment, AssignmentType } from "./practice-assignment";
import { FeedbackSystem, FeedbackItem, SubmitFeedbackData } from "./feedback-system";

interface LessonStructure {
  id: number;
  lessonId: number;
  hook: string;
  explanation: string;
  demo: string;
  practice: string;
  reflection: string;
}

interface UserProgress {
  userId: number;
  lessonId: number;
  hookCompleted: boolean;
  explanationCompleted: boolean;
  demoCompleted: boolean;
  practiceCompleted: boolean;
  reflectionCompleted: boolean;
  practiceScore: number;
  timeSpentSeconds: number;
  timeSpentIncrement?: boolean; // Добавляем поле для инкремента времени
}

interface MicroLessonStructureProps {
  lessonId: number;
  userId: number;
  onComplete?: () => void;
}

export function MicroLessonStructure({ lessonId, userId, onComplete }: MicroLessonStructureProps) {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<string>("hook");
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [timeSpent, setTimeSpent] = useState<number>(0);

  // Запрос данных структуры урока
  const { data: lessonStructure, isLoading: structureLoading } = useQuery<LessonStructure>({
    queryKey: [`/api/lessons/${lessonId}/structure`],
    enabled: !!lessonId,
  });

  // Запрос прогресса пользователя
  const { data: userProgress, isLoading: progressLoading } = useQuery<UserProgress>({
    queryKey: [`/api/lessons/${lessonId}/progress`],
    enabled: !!lessonId,
  });

  // Мутация для обновления прогресса пользователя
  const updateProgressMutation = useMutation({
    mutationFn: async (data: Partial<UserProgress>) => {
      const res = await fetch(`/api/lessons/${lessonId}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        throw new Error("Не удалось обновить прогресс");
      }
      
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/lessons/${lessonId}/progress`] });
      queryClient.setQueryData([`/api/lessons/${lessonId}/progress`], data);
      
      // Проверка, если все секции завершены
      if (
        data.hookCompleted &&
        data.explanationCompleted &&
        data.demoCompleted &&
        data.practiceCompleted &&
        data.reflectionCompleted
      ) {
        toast({
          title: "Урок завершен!",
          description: "Все части урока завершены. Отличная работа!",
          variant: "default",
        });
        
        // Вызываем переданный коллбэк завершения
        if (onComplete) {
          onComplete();
        }
      }
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: `Не удалось обновить прогресс: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Обновляем таймер при переходе между разделами
  useEffect(() => {
    // Для отслеживания времени, проведенного на странице
    const currentTimer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    
    setTimer(currentTimer);
    
    return () => {
      if (timer) clearInterval(timer);
      // При размонтировании компонента сохраняем время
      if (timeSpent > 0) {
        updateProgressMutation.mutate({
          timeSpentSeconds: timeSpent,
          timeSpentIncrement: true
        });
      }
    };
  }, []);

  // Функция для перехода к следующему разделу
  const goToNextSection = () => {
    if (!userProgress) return;
    
    // Отмечаем текущий раздел как завершенный
    const updatedData: Partial<UserProgress> = {};
    
    switch (activeSection) {
      case "hook":
        updatedData.hookCompleted = true;
        setActiveSection("explanation");
        break;
      case "explanation":
        updatedData.explanationCompleted = true;
        setActiveSection("demo");
        break;
      case "demo":
        updatedData.demoCompleted = true;
        setActiveSection("practice");
        break;
      case "practice":
        updatedData.practiceCompleted = true;
        setActiveSection("reflection");
        break;
      case "reflection":
        updatedData.reflectionCompleted = true;
        break;
    }
    
    // Если есть данные для обновления, отправляем запрос
    if (Object.keys(updatedData).length > 0) {
      updateProgressMutation.mutate(updatedData);
    }
  };

  // Функция для перехода к предыдущему разделу
  const goToPreviousSection = () => {
    switch (activeSection) {
      case "explanation":
        setActiveSection("hook");
        break;
      case "demo":
        setActiveSection("explanation");
        break;
      case "practice":
        setActiveSection("demo");
        break;
      case "reflection":
        setActiveSection("practice");
        break;
    }
  };

  // Вычисляем прогресс в процентах
  const calculateProgress = () => {
    if (!userProgress) return 0;
    
    let completed = 0;
    const total = 5; // 5 секций
    
    if (userProgress.hookCompleted) completed++;
    if (userProgress.explanationCompleted) completed++;
    if (userProgress.demoCompleted) completed++;
    if (userProgress.practiceCompleted) completed++;
    if (userProgress.reflectionCompleted) completed++;
    
    return (completed / total) * 100;
  };

  // Если данные загружаются
  if (structureLoading || progressLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-sm">Загрузка структуры урока...</p>
        </div>
      </div>
    );
  }

  // Если структура урока не найдена
  if (!lessonStructure) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Структура урока не найдена</CardTitle>
          <CardDescription>
            Для этого урока еще не создана микроструктура. Используйте основное содержимое урока.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6">
            <BookOpen className="h-16 w-16 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">
              Микроструктура урока (hook-explain-demo-practice-reflect) будет доступна в следующих версиях.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Проверяем, завершен ли уже урок
  const isLessonCompleted = userProgress && 
    userProgress.hookCompleted && 
    userProgress.explanationCompleted && 
    userProgress.demoCompleted && 
    userProgress.practiceCompleted && 
    userProgress.reflectionCompleted;

  // Если урок уже пройден полностью
  if (isLessonCompleted) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Урок завершен</CardTitle>
            <Badge variant="outline" className="bg-green-500 text-white">
              100% Завершено
            </Badge>
          </div>
          <CardDescription>
            Вы успешно прошли все части этого урока
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <p className="mt-4 text-center">
              Поздравляем! Вы завершили все разделы этого урока и освоили материал. 
              Вы можете просмотреть любой раздел повторно, выбрав его ниже.
            </p>
            
            <Tabs defaultValue="hook" value={activeSection} onValueChange={setActiveSection} className="w-full mt-6">
              <TabsList className="grid grid-cols-5">
                <TabsTrigger value="hook">Крючок</TabsTrigger>
                <TabsTrigger value="explanation">Объяснение</TabsTrigger>
                <TabsTrigger value="demo">Демонстрация</TabsTrigger>
                <TabsTrigger value="practice">Практика</TabsTrigger>
                <TabsTrigger value="reflection">Рефлексия</TabsTrigger>
              </TabsList>
              
              <TabsContent value="hook" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Вступление</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-lg max-w-none dark:prose-invert">
                    <ReactMarkdown>{lessonStructure.hook}</ReactMarkdown>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="explanation" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Объяснение</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-lg max-w-none dark:prose-invert">
                    <ReactMarkdown>{lessonStructure.explanation}</ReactMarkdown>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="demo" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Демонстрация</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-lg max-w-none dark:prose-invert">
                    <ReactMarkdown>{lessonStructure.demo}</ReactMarkdown>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="practice" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Практика</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-lg max-w-none dark:prose-invert">
                    <ReactMarkdown>{lessonStructure.practice}</ReactMarkdown>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reflection" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Рефлексия</CardTitle>
                  </CardHeader>
                  <CardContent className="prose prose-lg max-w-none dark:prose-invert">
                    <ReactMarkdown>{lessonStructure.reflection}</ReactMarkdown>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Тестовые данные для компонентов
  const sampleQuestions: QuizQuestion[] = [
    {
      id: "q1",
      question: "Что из перечисленного является ключевым компонентом AI Literacy?",
      type: QuestionType.MULTIPLE_CHOICE,
      options: [
        "Умение программировать на Python",
        "Способность критически оценивать результаты работы ИИ-систем",
        "Знание всех технических деталей нейросетей",
        "Умение эффективно формулировать запросы к ИИ"
      ],
      correctAnswer: [1, 3], // индексы правильных ответов
      explanation: "AI Literacy включает в себя способность критически оценивать результаты и умение формулировать запросы, но не обязательно требует глубоких технических знаний или навыков программирования."
    },
    {
      id: "q2",
      question: "Какой из запросов к ИИ-ассистенту, скорее всего, даст более полезный результат?",
      type: QuestionType.SINGLE_CHOICE,
      options: [
        "Напиши что-нибудь о космосе.",
        "Создай краткую информационную справку (300-400 слов) о системах экзопланет, открытых за последние 5 лет, с акцентом на потенциально обитаемые миры в зоне Златовласки.",
        "Расскажи про звезды.",
        "Можешь помочь мне с презентацией?"
      ],
      correctAnswer: 1, // индекс правильного ответа
      explanation: "Второй запрос содержит конкретную тему, формат, объем и фокус, что позволяет ИИ создать более полезный и целенаправленный ответ."
    },
    {
      id: "q3",
      question: "Какое утверждение о современных AI-системах верно?",
      type: QuestionType.TRUE_FALSE,
      statement: "Современные AI-системы могут полностью заменить человеческое мышление и не требуют критической оценки своих результатов.",
      correctAnswer: false,
      explanation: "Современные AI-системы имеют ограничения и могут делать ошибки, поэтому важно критически оценивать их результаты. Они дополняют, но не заменяют человеческое мышление."
    }
  ];

  // Тестовые данные для практического задания
  const sampleAssignment = {
    id: "assignment1",
    title: "Формулировка эффективного запроса",
    description: "В этом задании вы будете практиковаться в создании эффективных запросов к ИИ-ассистентам.",
    instructions: "Представьте, что вам нужно создать презентацию о влиянии искусственного интеллекта на образование. Напишите запрос к AI-ассистенту, который поможет вам получить наиболее полезный результат.",
    type: AssignmentType.TEXT,
    criteria: [
      "Конкретизация темы и аудитории",
      "Указание формата и объема",
      "Структурирование контента",
      "Указание стиля и тона"
    ],
    submissionInstructions: "Введите свой запрос в текстовое поле ниже и нажмите 'Отправить'."
  };

  // Тестовые данные для обратной связи
  const sampleFeedback: FeedbackItem[] = [
    {
      id: "fb1",
      type: "auto",
      content: "Ваш запрос содержит основные элементы эффективного запроса, включая указание темы и формата. Можно улучшить, добавив информацию о целевой аудитории и желаемом стиле презентации.",
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 час назад
      rating: 4,
      suggestedImprovements: [
        "Добавьте информацию о целевой аудитории (например, студенты, преподаватели, администрация)",
        "Укажите предпочтительный стиль презентации (формальный, неформальный, креативный и т.д.)",
        "Уточните желаемое количество слайдов и время презентации"
      ]
    },
    {
      id: "fb2",
      type: "instructor",
      content: "Хорошая работа над запросом! Вы включили специфические детали, что поможет получить более релевантный результат от ИИ. Однако рекомендую также указывать предполагаемую длительность презентации и количество слайдов, чтобы получить более структурированный ответ.",
      createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 минут назад
      rating: 5
    }
  ];

  // Рендеринг активного раздела
  const renderActiveSection = () => {
    switch (activeSection) {
      case "hook":
        return (
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  <span className="flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                    Вступление
                  </span>
                </CardTitle>
                <Badge variant="outline" className={userProgress?.hookCompleted ? "bg-green-500 text-white" : ""}>
                  {userProgress?.hookCompleted ? "Завершено" : "Актуально"}
                </Badge>
              </div>
              <CardDescription>
                В этом разделе вы ознакомитесь с ключевыми моментами урока
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-zinc-900 dark:to-zinc-800 p-6 rounded-lg shadow-sm border border-blue-100 dark:border-zinc-700">
              <div className="text-zinc-900 dark:text-zinc-100">
                <ReactMarkdown>{lessonStructure.hook}</ReactMarkdown>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div></div>
              <Button onClick={goToNextSection} disabled={updateProgressMutation.isPending}>
                {updateProgressMutation.isPending ? "Обработка..." : "Далее"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        );
        
      case "explanation":
        return (
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  <span className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                    Объяснение
                  </span>
                </CardTitle>
                <Badge variant="outline" className={userProgress?.explanationCompleted ? "bg-green-500 text-white" : ""}>
                  {userProgress?.explanationCompleted ? "Завершено" : "Актуально"}
                </Badge>
              </div>
              <CardDescription>
                Изучите основные концепции и теорию
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert bg-gradient-to-br from-green-50 to-emerald-50 dark:from-zinc-900 dark:to-zinc-800 p-6 rounded-lg shadow-sm border border-green-100 dark:border-zinc-700">
              <div className="text-zinc-900 dark:text-zinc-100">
                <ReactMarkdown>{lessonStructure.explanation}</ReactMarkdown>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button variant="outline" onClick={goToPreviousSection}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад
              </Button>
              <Button onClick={goToNextSection} disabled={updateProgressMutation.isPending}>
                {updateProgressMutation.isPending ? "Обработка..." : "Далее"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        );
        
      case "demo":
        return (
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  <span className="flex items-center">
                    <Video className="w-5 h-5 mr-2 text-purple-500" />
                    Демонстрация
                  </span>
                </CardTitle>
                <Badge variant="outline" className={userProgress?.demoCompleted ? "bg-green-500 text-white" : ""}>
                  {userProgress?.demoCompleted ? "Завершено" : "Актуально"}
                </Badge>
              </div>
              <CardDescription>
                Наглядные примеры и демонстрации концепций
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert bg-gradient-to-br from-purple-50 to-violet-50 dark:from-zinc-900 dark:to-zinc-800 p-6 rounded-lg shadow-sm border border-purple-100 dark:border-zinc-700">
              <div className="text-zinc-900 dark:text-zinc-100">
                <ReactMarkdown>{lessonStructure.demo}</ReactMarkdown>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button variant="outline" onClick={goToPreviousSection}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад
              </Button>
              <Button onClick={goToNextSection} disabled={updateProgressMutation.isPending}>
                {updateProgressMutation.isPending ? "Обработка..." : "Далее"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        );
        
      case "practice":
        // Примерные данные для интерактивных компонентов
        const sampleQuestions: QuizQuestion[] = [
          {
            id: "q1",
            type: QuestionType.SINGLE_CHOICE,
            question: "Какой из следующих методов лучше всего подходит для обработки больших объемов текстовых данных?",
            options: [
              { id: "a", text: "Нейронные сети", isCorrect: true },
              { id: "b", text: "Двоичный поиск", isCorrect: false },
              { id: "c", text: "Сортировка пузырьком", isCorrect: false },
              { id: "d", text: "Алгоритм Дейкстры", isCorrect: false }
            ],
            explanation: "Нейронные сети эффективны при работе с большими наборами текстовых данных благодаря их способности обнаруживать сложные паттерны и зависимости."
          },
          {
            id: "q2",
            type: QuestionType.MULTIPLE_CHOICE,
            question: "Выберите все методы, которые обычно используются в обработке естественного языка:",
            options: [
              { id: "a", text: "Токенизация", isCorrect: true },
              { id: "b", text: "Лемматизация", isCorrect: true },
              { id: "c", text: "Нормализация контраста", isCorrect: false },
              { id: "d", text: "Векторизация слов", isCorrect: true }
            ],
            explanation: "Токенизация, лемматизация и векторизация слов - это основные методы обработки естественного языка. Нормализация контраста относится к обработке изображений."
          },
          {
            id: "q3",
            type: QuestionType.TEXT_INPUT,
            question: "Как называется модель, которая используется для генерации текста по образцу (заполните одним словом)?",
            correctAnswer: "трансформер",
            explanation: "Трансформеры - это архитектура нейронных сетей, которая произвела революцию в обработке естественного языка и генерации текста."
          }
        ];
        
        const sampleAssignment: PracticeAssignment = {
          id: "assignment1",
          type: AssignmentType.CODE,
          title: "Создание простого классификатора текста",
          description: "Практическое задание по классификации текста с использованием машинного обучения",
          instructions: `
# Создание простого классификатора текста

В этом задании вы создадите базовый классификатор для определения тематики текста.

## Задание:
1. Создайте функцию, которая принимает текст и определяет его тематику
2. Реализуйте логику для распознавания трех категорий: спорт, технологии, развлечения
3. Используйте ключевые слова для определения категории

## Пример решения:
\`\`\`python
def classify_text(text):
    text = text.lower()
    
    sport_keywords = ["футбол", "матч", "соревнования", "тренировка"]
    tech_keywords = ["программирование", "компьютер", "технология", "код"]
    entertainment_keywords = ["фильм", "кино", "музыка", "концерт"]
    
    sport_score = sum(1 for word in sport_keywords if word in text)
    tech_score = sum(1 for word in tech_keywords if word in text)
    entertainment_score = sum(1 for word in entertainment_keywords if word in text)
    
    if sport_score > tech_score and sport_score > entertainment_score:
        return "спорт"
    elif tech_score > sport_score and tech_score > entertainment_score:
        return "технологии"
    elif entertainment_score > sport_score and entertainment_score > tech_score:
        return "развлечения"
    else:
        return "неопределенная тематика"
\`\`\`
`,
          hint: "Помните, что для определения категории можно использовать счетчик совпадений ключевых слов или более сложные алгоритмы на основе TF-IDF.",
          criteria: [
            "Функция должна корректно определять категорию для простых текстов",
            "Код должен быть оптимизирован и не содержать лишних операций",
            "Предусмотрите обработку случаев, когда категорию определить невозможно"
          ]
        };
        
        // Пример данных обратной связи
        const sampleFeedback: FeedbackItem[] = [
          {
            id: "f1",
            type: "ai",
            content: "Ваше решение правильно определяет категории в большинстве случаев. Хорошая работа с обработкой текста! Подумайте, как улучшить алгоритм, чтобы он мог работать с более сложными примерами.",
            rating: 4,
            createdAt: new Date(),
            suggestedImprovements: [
              "Добавьте предварительную обработку текста, чтобы удалить стоп-слова",
              "Используйте стемминг для обработки разных форм одного слова",
              "Рассмотрите возможность использования более продвинутых алгоритмов, таких как TF-IDF"
            ]
          }
        ];
        
        // Обработчики для интерактивных компонентов
        const handleQuizComplete = (score: number, total: number) => {
          toast({
            title: "Квиз завершен",
            description: `Вы набрали ${score} из ${total} баллов!`,
            variant: "default",
          });
          
          // Обновляем счет в прогрессе
          updateProgressMutation.mutate({
            practiceScore: Math.round((score / total) * 100)
          });
        };
        
        const handleAssignmentComplete = (solution: string) => {
          toast({
            title: "Задание выполнено",
            description: "Ваше решение было сохранено",
            variant: "default",
          });
        };
        
        const handleRequestFeedback = async (solution: string) => {
          // Имитация запроса обратной связи от ИИ
          await new Promise(resolve => setTimeout(resolve, 1500));
          return "Ваш код правильно классифицирует тексты. Хорошая реализация базовой логики. Можно улучшить, добавив предварительную обработку текста и расширив набор ключевых слов.";
        };
        
        const handleSubmitFeedback = async (data: SubmitFeedbackData) => {
          // Имитация отправки обратной связи
          await new Promise(resolve => setTimeout(resolve, 1000));
          toast({
            title: "Отзыв отправлен",
            description: "Спасибо за вашу обратную связь!",
            variant: "default",
          });
        };
        
        return (
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  <span className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-red-500" />
                    Практика
                  </span>
                </CardTitle>
                <Badge variant="outline" className={userProgress?.practiceCompleted ? "bg-green-500 text-white" : ""}>
                  {userProgress?.practiceCompleted ? "Завершено" : "Актуально"}
                </Badge>
              </div>
              <CardDescription>
                Применение изученного материала на практике
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Основное содержимое раздела */}
                <div className="prose prose-lg max-w-none dark:prose-invert bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm">
                  <ReactMarkdown>{lessonStructure.practice}</ReactMarkdown>
                </div>
                
                {/* Квиз для проверки знаний */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Проверьте свои знания</h3>
                  <QuizComponent questions={sampleQuestions} onComplete={handleQuizComplete} />
                </div>
                
                {/* Практическое задание */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Практическое задание</h3>
                  <PracticeAssignment 
                    assignment={sampleAssignment} 
                    onComplete={handleAssignmentComplete}
                    onRequestFeedback={handleRequestFeedback}
                  />
                </div>
                
                {/* Обратная связь */}
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Обратная связь</h3>
                  <FeedbackSystem 
                    feedbackItems={sampleFeedback}
                    lessonId={lessonId}
                    assignmentId="assignment1"
                    userId={userId}
                    onSubmitFeedback={handleSubmitFeedback}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button variant="outline" onClick={goToPreviousSection}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад
              </Button>
              <Button onClick={goToNextSection} disabled={updateProgressMutation.isPending}>
                {updateProgressMutation.isPending ? "Обработка..." : "Далее"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        );
        
      case "reflection":
        return (
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  <span className="flex items-center">
                    <BookOpenCheck className="w-5 h-5 mr-2 text-green-500" />
                    Рефлексия
                  </span>
                </CardTitle>
                <Badge variant="outline" className={userProgress?.reflectionCompleted ? "bg-green-500 text-white" : ""}>
                  {userProgress?.reflectionCompleted ? "Завершено" : "Актуально"}
                </Badge>
              </div>
              <CardDescription>
                Подведение итогов и осмысление изученного
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-lg max-w-none dark:prose-invert bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-sm">
              <ReactMarkdown>{lessonStructure.reflection}</ReactMarkdown>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button variant="outline" onClick={goToPreviousSection}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад
              </Button>
              <Button 
                onClick={() => {
                  updateProgressMutation.mutate({ reflectionCompleted: true });
                  if (onComplete) {
                    onComplete();
                  }
                }} 
                disabled={updateProgressMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {updateProgressMutation.isPending ? "Завершение..." : "Завершить урок"}
                <CheckCircle className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Прогресс урока */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Прогресс урока</h3>
          <span className="text-sm text-muted-foreground">{Math.round(calculateProgress())}%</span>
        </div>
        <Progress value={calculateProgress()} className="h-2" />
        <div className="grid grid-cols-5 mt-2">
          <div 
            className={`flex flex-col items-center ${userProgress?.hookCompleted ? 'text-green-500' : 'text-muted-foreground'}`}
            onClick={() => setActiveSection("hook")}
          >
            <Lightbulb className={`h-4 w-4 ${activeSection === "hook" ? 'text-primary' : ''}`} />
            <span className="text-xs mt-1 cursor-pointer">Крючок</span>
          </div>
          <div 
            className={`flex flex-col items-center ${userProgress?.explanationCompleted ? 'text-green-500' : 'text-muted-foreground'}`}
            onClick={() => setActiveSection("explanation")}
          >
            <BookOpen className={`h-4 w-4 ${activeSection === "explanation" ? 'text-primary' : ''}`} />
            <span className="text-xs mt-1 cursor-pointer">Объяснение</span>
          </div>
          <div 
            className={`flex flex-col items-center ${userProgress?.demoCompleted ? 'text-green-500' : 'text-muted-foreground'}`}
            onClick={() => setActiveSection("demo")}
          >
            <Video className={`h-4 w-4 ${activeSection === "demo" ? 'text-primary' : ''}`} />
            <span className="text-xs mt-1 cursor-pointer">Демо</span>
          </div>
          <div 
            className={`flex flex-col items-center ${userProgress?.practiceCompleted ? 'text-green-500' : 'text-muted-foreground'}`}
            onClick={() => setActiveSection("practice")}
          >
            <Target className={`h-4 w-4 ${activeSection === "practice" ? 'text-primary' : ''}`} />
            <span className="text-xs mt-1 cursor-pointer">Практика</span>
          </div>
          <div 
            className={`flex flex-col items-center ${userProgress?.reflectionCompleted ? 'text-green-500' : 'text-muted-foreground'}`}
            onClick={() => setActiveSection("reflection")}
          >
            <BookOpenCheck className={`h-4 w-4 ${activeSection === "reflection" ? 'text-primary' : ''}`} />
            <span className="text-xs mt-1 cursor-pointer">Рефлексия</span>
          </div>
        </div>
      </div>
      
      {/* Отображение текущего активного раздела */}
      {renderActiveSection()}
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  BookOpen, 
  Play, 
  Target, 
  Brain, 
  ArrowRight, 
  CheckCircle, 
  Clock,
  Zap,
  Award
} from "lucide-react";
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
}

interface ProgressiveLessonStructureProps {
  lessonId: number;
  userId: number;
  onComplete?: () => void;
}

const LESSON_STEPS = [
  {
    id: 'hook',
    title: 'Мотивация',
    icon: Lightbulb,
    description: 'Зачем это изучать?',
    color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    iconColor: 'text-yellow-600'
  },
  {
    id: 'explanation',
    title: 'Объяснение',
    icon: BookOpen,
    description: 'Изучаем теорию',
    color: 'bg-blue-50 border-blue-200 text-blue-800',
    iconColor: 'text-blue-600'
  },
  {
    id: 'demo',
    title: 'Демонстрация',
    icon: Play,
    description: 'Примеры на практике',
    color: 'bg-purple-50 border-purple-200 text-purple-800',
    iconColor: 'text-purple-600'
  },
  {
    id: 'practice',
    title: 'Практика',
    icon: Target,
    description: 'Применяем знания',
    color: 'bg-green-50 border-green-200 text-green-800',
    iconColor: 'text-green-600'
  },
  {
    id: 'reflection',
    title: 'Рефлексия',
    icon: Brain,
    description: 'Закрепляем понимание',
    color: 'bg-indigo-50 border-indigo-200 text-indigo-800',
    iconColor: 'text-indigo-600'
  }
];

export function ProgressiveLessonStructure({ lessonId, userId, onComplete }: ProgressiveLessonStructureProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showRewards, setShowRewards] = useState(false);
  const { toast } = useToast();

  // Получение структуры урока
  const { data: lessonStructure, isLoading } = useQuery({
    queryKey: [`/api/lessons/${lessonId}/structure`],
    enabled: !!lessonId,
  });

  // Получение прогресса пользователя
  const { data: userProgress } = useQuery({
    queryKey: [`/api/lessons/${lessonId}/progress`],
    enabled: !!lessonId && !!userId,
  });

  // Мутация для обновления прогресса
  const updateProgressMutation = useMutation({
    mutationFn: async (stepData: any) => {
      const response = await fetch(`/api/lessons/${lessonId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...stepData }),
        credentials: 'include',
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/lessons/${lessonId}/progress`] });
    },
  });

  // Инициализация завершенных шагов
  useEffect(() => {
    if (userProgress) {
      const completed = new Set<number>();
      if ((userProgress as any).hookCompleted) completed.add(0);
      if ((userProgress as any).explanationCompleted) completed.add(1);
      if ((userProgress as any).demoCompleted) completed.add(2);
      if ((userProgress as any).practiceCompleted) completed.add(3);
      if ((userProgress as any).reflectionCompleted) completed.add(4);
      setCompletedSteps(completed);
      
      // Найти первый незавершенный шаг
      for (let i = 0; i < LESSON_STEPS.length; i++) {
        if (!completed.has(i)) {
          setCurrentStep(i);
          break;
        }
      }
    }
  }, [userProgress]);

  const handleStepComplete = async () => {
    const stepKey = LESSON_STEPS[currentStep].id;
    const stepData = { [`${stepKey}Completed`]: true };
    
    await updateProgressMutation.mutateAsync(stepData);
    
    const newCompleted = new Set(completedSteps);
    newCompleted.add(currentStep);
    setCompletedSteps(newCompleted);

    // Показать награду за завершение шага
    setShowRewards(true);
    setTimeout(() => setShowRewards(false), 2000);

    // Переход к следующему шагу
    if (currentStep < LESSON_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete?.();
      toast({
        title: "Урок завершен!",
        description: "Поздравляем с успешным прохождением урока",
      });
    }
  };

  const renderStepContent = () => {
    if (!lessonStructure) return null;

    const step = LESSON_STEPS[currentStep];
    const stepKey = step.id as keyof LessonStructure;
    const content = (lessonStructure as any)[stepKey];

    return (
      <Card className={`border-2 ${step.color} transition-all duration-300`}>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full bg-white shadow-sm`}>
              <step.icon className={`h-5 w-5 ${step.iconColor}`} />
            </div>
            <div>
              <CardTitle className="text-lg">{step.title}</CardTitle>
              <CardDescription className="text-sm opacity-80">
                {step.description}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
          
          {/* Дополнительный контент для практического шага */}
          {currentStep === 3 && (
            <div className="mt-6 p-4 bg-white rounded-lg border border-green-200">
              <h4 className="font-medium mb-3 text-green-800">Практическое задание</h4>
              <QuizComponent
                quiz={{
                  id: 1,
                  lessonId: lessonId,
                  title: "Проверка понимания",
                  questions: [
                    {
                      id: 1,
                      text: "Какой из перечисленных принципов является основным в изученной теме?",
                      type: "multiple-choice" as QuestionType,
                      options: [
                        { id: "a", text: "Первый принцип", isCorrect: true },
                        { id: "b", text: "Второй принцип", isCorrect: false },
                        { id: "c", text: "Третий принцип", isCorrect: false },
                        { id: "d", text: "Четвертый принцип", isCorrect: false }
                      ],
                      explanation: "Правильный ответ основан на материале, изученном в предыдущих шагах."
                    }
                  ]
                }}
                onQuizComplete={(results) => {
                  toast({
                    title: "Практика завершена!",
                    description: `Результат: ${results.score}%`,
                  });
                }}
              />
            </div>
          )}
          
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Шаг {currentStep + 1} из {LESSON_STEPS.length}
            </div>
            <Button 
              onClick={handleStepComplete}
              disabled={updateProgressMutation.isPending}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {updateProgressMutation.isPending ? "Сохранение..." : 
               currentStep === LESSON_STEPS.length - 1 ? "Завершить урок" : "Следующий шаг"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const progressPercentage = (completedSteps.size / LESSON_STEPS.length) * 100;

  return (
    <div className="space-y-6">
      {/* Прогресс и навигация по шагам */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-blue-900">Прогресс изучения</h3>
            <div className="flex items-center space-x-2 text-sm text-blue-700">
              <Clock className="h-4 w-4" />
              <span>~15 минут</span>
            </div>
          </div>
          
          <Progress value={progressPercentage} className="h-2 mb-4" />
          
          <div className="flex justify-between">
            {LESSON_STEPS.map((step, index) => {
              const isCompleted = completedSteps.has(index);
              const isCurrent = index === currentStep;
              const isLocked = index > currentStep && !isCompleted;
              
              return (
                <div 
                  key={step.id}
                  className={`flex flex-col items-center space-y-1 cursor-pointer transition-all duration-200 ${
                    isLocked ? 'opacity-50' : 'hover:scale-105'
                  }`}
                  onClick={() => !isLocked && setCurrentStep(index)}
                >
                  <div className={`p-2 rounded-full border-2 transition-all duration-200 ${
                    isCompleted 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : isCurrent 
                        ? 'bg-blue-500 border-blue-500 text-white' 
                        : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <step.icon className="h-4 w-4" />
                    )}
                  </div>
                  <span className={`text-xs font-medium ${
                    isCurrent ? 'text-blue-700' : isCompleted ? 'text-green-700' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Анимация награды */}
      {showRewards && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span className="font-semibold">Шаг завершен!</span>
            <Zap className="h-5 w-5" />
          </div>
        </div>
      )}

      {/* Содержимое текущего шага */}
      {renderStepContent()}
    </div>
  );
}
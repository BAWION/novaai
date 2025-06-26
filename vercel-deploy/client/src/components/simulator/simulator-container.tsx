import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, AlertCircle, ChevronRight, Award } from "lucide-react";

// Типы заданий в симуляторе
export enum TaskType {
  TEXT_INPUT = "text_input",      // Ввод текста
  CHOICE = "choice",              // Выбор из вариантов
  DRAG_DROP = "drag_drop",        // Перетаскивание элементов
  CODE_COMPLETION = "code",       // Заполнение кода
  PROMPT_CREATION = "prompt",     // Создание промпта
  TOOL_USAGE = "tool"             // Использование инструмента
}

// Структура данных для шага задания
export interface SimulatorTask {
  id: string;
  type: TaskType;
  title: string;
  description: string;
  instruction: string;
  options?: string[];         // Для заданий с выбором
  correctAnswer?: string | string[]; // Правильный ответ
  hintText?: string;          // Подсказка
  toolConfig?: {              // Конфигурация инструмента для type: "tool"
    toolType: string;         // Тип инструмента (например, "nocode_builder", "prompt_template")
    initialState: any;        // Начальное состояние инструмента
    goalState?: any;          // Целевое состояние для проверки
  };
}

// Структура данных для урока в симуляторе
export interface SimulatorLesson {
  id: string;
  title: string;
  description: string;
  tasks: SimulatorTask[];     // Задания урока
  xpReward: number;           // Награда опыта за прохождение
  skillRewards: string[];     // Навыки, которые развивает урок
}

// Состояние пользователя в симуляторе
interface SimulatorProgress {
  currentTaskIndex: number;
  completedTasks: string[];
  userAnswers: Record<string, any>;
  score: number;
}

// Входные параметры компонента
interface SimulatorContainerProps {
  lesson: SimulatorLesson;
  onComplete?: (progress: SimulatorProgress) => void;
  onExit?: () => void;
}

// Основной компонент симулятора
export const SimulatorContainer: React.FC<SimulatorContainerProps> = ({
  lesson,
  onComplete,
  onExit
}) => {
  // Состояние симулятора
  const [progress, setProgress] = useState<SimulatorProgress>({
    currentTaskIndex: 0,
    completedTasks: [],
    userAnswers: {},
    score: 0
  });
  
  // Текущее задание
  const currentTask = lesson.tasks[progress.currentTaskIndex];
  
  // Состояние UI
  const [userInput, setUserInput] = useState<string | string[]>("");
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    message: string;
  } | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Прогресс в процентах
  const progressPercentage = 
    Math.floor((progress.completedTasks.length / lesson.tasks.length) * 100);
  
  // Обработка проверки ответа
  const checkAnswer = () => {
    // Для демонстрации мы сделаем простую проверку, в реальном приложении логика будет сложнее
    if (Array.isArray(currentTask.correctAnswer)) {
      const isCorrect = Array.isArray(userInput) && 
        currentTask.correctAnswer.every(answer => userInput.includes(answer));
      
      handleAnswerResult(isCorrect);
    } else {
      const isCorrect = userInput === currentTask.correctAnswer;
      handleAnswerResult(isCorrect);
    }
  };
  
  // Обработка результата ответа
  const handleAnswerResult = (isCorrect: boolean) => {
    // Обновляем состояние ответа и показываем обратную связь
    setFeedback({
      isCorrect,
      message: isCorrect 
        ? "Отлично! Ваш ответ верный." 
        : "Попробуйте еще раз. Ответ не совсем верный."
    });
    
    // Если ответ правильный, обновляем прогресс
    if (isCorrect) {
      const updatedProgress = {
        ...progress,
        completedTasks: [...progress.completedTasks, currentTask.id],
        userAnswers: {
          ...progress.userAnswers,
          [currentTask.id]: userInput
        },
        score: progress.score + 10 // Простая система подсчета очков
      };
      
      setProgress(updatedProgress);
      
      // Если это последнее задание, завершаем урок
      if (progress.currentTaskIndex === lesson.tasks.length - 1) {
        setIsCompleted(true);
        if (onComplete) {
          onComplete(updatedProgress);
        }
      }
    }
  };
  
  // Переход к следующему заданию
  const goToNextTask = () => {
    if (progress.currentTaskIndex < lesson.tasks.length - 1) {
      setProgress({
        ...progress,
        currentTaskIndex: progress.currentTaskIndex + 1
      });
      setUserInput("");
      setFeedback(null);
      setShowHint(false);
    }
  };
  
  // Рендер компонента в зависимости от типа задания
  const renderTaskComponent = () => {
    switch (currentTask.type) {
      case TaskType.TEXT_INPUT:
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-white/80">
              {currentTask.instruction}
            </label>
            <input
              type="text"
              value={userInput as string}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-full p-3 bg-space-800/50 border border-space-700 rounded-lg text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
              placeholder="Введите ваш ответ..."
            />
          </div>
        );
        
      case TaskType.CHOICE:
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-white/80 mb-2">
              {currentTask.instruction}
            </label>
            <div className="space-y-2">
              {currentTask.options?.map((option, index) => (
                <div
                  key={index}
                  className={`p-3 border rounded-lg cursor-pointer transition ${
                    userInput === option
                      ? "border-primary bg-primary/10"
                      : "border-space-700 bg-space-800/50 hover:bg-space-700/50"
                  }`}
                  onClick={() => setUserInput(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        );
        
      case TaskType.PROMPT_CREATION:
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-white/80">
              {currentTask.instruction}
            </label>
            <textarea
              value={userInput as string}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-full p-3 bg-space-800/50 border border-space-700 rounded-lg text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition min-h-[120px]"
              placeholder="Создайте промпт..."
            />
            <div className="text-xs text-white/60">
              <p>Подсказка: создавайте четкие, конкретные промпты с необходимым контекстом</p>
            </div>
          </div>
        );
        
      // Заглушки для остальных типов, в реальном проекте здесь будут соответствующие компоненты
      case TaskType.DRAG_DROP:
      case TaskType.CODE_COMPLETION:
      case TaskType.TOOL_USAGE:
      default:
        return (
          <div className="p-4 border border-dashed border-space-600 rounded-lg text-center">
            <p className="text-white/60">
              Компонент для этого типа задания находится в разработке
            </p>
          </div>
        );
    }
  };
  
  // Рендер компонента обратной связи
  const renderFeedback = () => {
    if (!feedback) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-lg mt-4 flex items-start gap-3 ${
          feedback.isCorrect ? "bg-green-900/20 border border-green-500/30" : "bg-amber-900/20 border border-amber-500/30"
        }`}
      >
        {feedback.isCorrect ? (
          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        )}
        <div>
          <p className={feedback.isCorrect ? "text-green-400" : "text-amber-400"}>
            {feedback.isCorrect ? "Правильно!" : "Попробуйте еще раз"}
          </p>
          <p className="text-sm text-white/80 mt-1">{feedback.message}</p>
          {!feedback.isCorrect && currentTask.hintText && !showHint && (
            <button
              onClick={() => setShowHint(true)}
              className="text-sm text-primary/80 hover:text-primary mt-2"
            >
              Показать подсказку
            </button>
          )}
          {showHint && (
            <div className="mt-2 p-2 bg-space-800/50 rounded border border-space-700">
              <p className="text-sm text-white/80">{currentTask.hintText}</p>
            </div>
          )}
        </div>
      </motion.div>
    );
  };
  
  // Рендер экрана завершения урока
  const renderCompletionScreen = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8"
    >
      <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 border-4 border-primary">
        <Award className="w-10 h-10 text-primary" />
      </div>
      <h3 className="text-2xl font-bold mb-2">Урок завершен!</h3>
      <p className="text-white/60 mb-6">
        Вы успешно прошли урок "{lesson.title}" и заработали {progress.score} XP
      </p>
      
      <div className="mb-6 px-4 py-3 bg-space-800/50 rounded-lg inline-block">
        <h4 className="text-sm text-white/80 mb-2">Приобретенные навыки:</h4>
        <div className="flex flex-wrap gap-2 justify-center">
          {lesson.skillRewards.map((skill, index) => (
            <span key={index} className="px-2 py-1 bg-primary/20 text-primary text-xs rounded">
              {skill}
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex gap-4 justify-center">
        <Button 
          onClick={onExit} 
          variant="outline"
        >
          К списку уроков
        </Button>
        <Button 
          onClick={onExit} 
          className="bg-primary hover:bg-primary/90"
        >
          Следующий урок
        </Button>
      </div>
    </motion.div>
  );
  
  return (
    <Glassmorphism className="p-6 rounded-xl">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-bold">{lesson.title}</h2>
          <span className="text-sm text-white/60">
            Задание {progress.currentTaskIndex + 1} из {lesson.tasks.length}
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2 bg-space-800" />
      </div>
      
      <AnimatePresence mode="wait">
        {isCompleted ? (
          renderCompletionScreen()
        ) : (
          <motion.div
            key={`task-${progress.currentTaskIndex}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">{currentTask.title}</h3>
              <p className="text-white/80">{currentTask.description}</p>
            </div>
            
            <div className="bg-space-800/30 border border-space-700 rounded-lg p-5">
              {renderTaskComponent()}
            </div>
            
            {renderFeedback()}
            
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={onExit}
              >
                Выйти
              </Button>
              
              <div className="flex gap-3">
                {!feedback?.isCorrect && (
                  <Button
                    onClick={checkAnswer}
                    className="bg-primary hover:bg-primary/90"
                    disabled={!userInput}
                  >
                    Проверить
                  </Button>
                )}
                
                {feedback?.isCorrect && (
                  <Button
                    onClick={goToNextTask}
                    className="bg-primary hover:bg-primary/90 flex items-center"
                  >
                    Далее <ChevronRight className="ml-1 w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Glassmorphism>
  );
};
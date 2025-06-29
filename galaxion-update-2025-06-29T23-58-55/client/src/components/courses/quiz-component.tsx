import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, AlertCircle, ChevronRight, RotateCcw } from "lucide-react";

// Типы вопросов
export enum QuestionType {
  SINGLE_CHOICE = "single-choice",
  MULTIPLE_CHOICE = "multiple-choice",
  TEXT_INPUT = "text-input",
  TRUE_FALSE = "true-false",
}

// Интерфейс варианта ответа
export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

// Интерфейс вопроса
export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  explanation?: string;
  options?: QuizOption[];
  correctAnswer?: string; // Для текстовых вопросов
  correctAnswers?: string[]; // Для вопросов с множественным выбором
}

// Интерфейс для ответа пользователя
interface UserAnswer {
  questionId: string;
  type: QuestionType;
  selectedOptionIds?: string[];
  textInput?: string;
}

// Props компонента квиза
interface QuizComponentProps {
  questions: QuizQuestion[];
  onComplete?: (score: number, total: number) => void;
}

export function QuizComponent({ questions, onComplete }: QuizComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  // Получение текущего вопроса
  const currentQuestion = questions[currentQuestionIndex];

  // Обработка выбора варианта для вопроса с одним ответом
  const handleSingleChoiceSelect = (optionId: string) => {
    const updatedUserAnswers = [...userAnswers];
    
    // Находим или создаем ответ пользователя для текущего вопроса
    const existingAnswerIndex = updatedUserAnswers.findIndex(
      (answer) => answer.questionId === currentQuestion.id
    );
    
    const answer: UserAnswer = {
      questionId: currentQuestion.id,
      type: QuestionType.SINGLE_CHOICE,
      selectedOptionIds: [optionId],
    };
    
    if (existingAnswerIndex >= 0) {
      updatedUserAnswers[existingAnswerIndex] = answer;
    } else {
      updatedUserAnswers.push(answer);
    }
    
    setUserAnswers(updatedUserAnswers);
  };

  // Обработка выбора вариантов для вопроса с множественным выбором
  const handleMultipleChoiceSelect = (optionId: string, isChecked: boolean) => {
    const updatedUserAnswers = [...userAnswers];
    
    // Находим или создаем ответ пользователя для текущего вопроса
    const existingAnswerIndex = updatedUserAnswers.findIndex(
      (answer) => answer.questionId === currentQuestion.id
    );
    
    let answer: UserAnswer;
    
    if (existingAnswerIndex >= 0) {
      answer = updatedUserAnswers[existingAnswerIndex];
      
      if (!answer.selectedOptionIds) {
        answer.selectedOptionIds = [];
      }
      
      if (isChecked) {
        answer.selectedOptionIds.push(optionId);
      } else {
        answer.selectedOptionIds = answer.selectedOptionIds.filter(id => id !== optionId);
      }
      
      updatedUserAnswers[existingAnswerIndex] = answer;
    } else {
      answer = {
        questionId: currentQuestion.id,
        type: QuestionType.MULTIPLE_CHOICE,
        selectedOptionIds: isChecked ? [optionId] : [],
      };
      
      updatedUserAnswers.push(answer);
    }
    
    setUserAnswers(updatedUserAnswers);
  };

  // Обработка ввода текста
  const handleTextInput = (text: string) => {
    const updatedUserAnswers = [...userAnswers];
    
    // Находим или создаем ответ пользователя для текущего вопроса
    const existingAnswerIndex = updatedUserAnswers.findIndex(
      (answer) => answer.questionId === currentQuestion.id
    );
    
    const answer: UserAnswer = {
      questionId: currentQuestion.id,
      type: QuestionType.TEXT_INPUT,
      textInput: text,
    };
    
    if (existingAnswerIndex >= 0) {
      updatedUserAnswers[existingAnswerIndex] = answer;
    } else {
      updatedUserAnswers.push(answer);
    }
    
    setUserAnswers(updatedUserAnswers);
  };

  // Проверка ответа
  const checkAnswer = () => {
    const userAnswer = userAnswers.find(answer => answer.questionId === currentQuestion.id);
    
    if (!userAnswer) {
      return;
    }

    let correct = false;
    
    switch (currentQuestion.type) {
      case QuestionType.SINGLE_CHOICE:
        if (userAnswer.selectedOptionIds && userAnswer.selectedOptionIds.length > 0) {
          const selectedOption = currentQuestion.options?.find(option => option.id === userAnswer.selectedOptionIds?.[0]);
          correct = !!selectedOption?.isCorrect;
        }
        break;
        
      case QuestionType.MULTIPLE_CHOICE:
        if (userAnswer.selectedOptionIds) {
          // Получаем все правильные варианты
          const correctOptionIds = currentQuestion.options
            ?.filter(option => option.isCorrect)
            .map(option => option.id) || [];
          
          // Проверяем, совпадают ли выбранные варианты с правильными
          const allCorrectSelected = correctOptionIds.every(id => userAnswer.selectedOptionIds?.includes(id));
          const noIncorrectSelected = userAnswer.selectedOptionIds.every(id => correctOptionIds.includes(id));
          
          correct = allCorrectSelected && noIncorrectSelected;
        }
        break;
        
      case QuestionType.TEXT_INPUT:
        if (userAnswer.textInput && currentQuestion.correctAnswer) {
          // Проверка без учета регистра и лишних пробелов
          correct = userAnswer.textInput.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase();
        }
        break;
        
      case QuestionType.TRUE_FALSE:
        if (userAnswer.selectedOptionIds && userAnswer.selectedOptionIds.length > 0) {
          const selectedOption = currentQuestion.options?.find(option => option.id === userAnswer.selectedOptionIds?.[0]);
          correct = !!selectedOption?.isCorrect;
        }
        break;
    }
    
    setIsAnswerCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setScore(prevScore => prevScore + 1);
    }
  };

  // Переход к следующему вопросу
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setShowFeedback(false);
      setIsAnswerCorrect(null);
    } else {
      // Завершение квиза
      setQuizCompleted(true);
      if (onComplete) {
        onComplete(score + (isAnswerCorrect ? 1 : 0), questions.length);
      }
    }
  };

  // Повторное прохождение квиза
  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowFeedback(false);
    setIsAnswerCorrect(null);
    setQuizCompleted(false);
    setScore(0);
  };

  // Если квиз завершен, показываем итоговый результат
  if (quizCompleted) {
    const finalScore = score;
    const percentage = Math.round((finalScore / questions.length) * 100);
    
    return (
      <Card className="shadow-lg bg-white dark:bg-zinc-800">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Результаты квиза</CardTitle>
          <CardDescription>
            Вы ответили правильно на {finalScore} из {questions.length} вопросов
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative h-36 w-36">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold">{percentage}%</span>
              </div>
              <svg className="h-full w-full" viewBox="0 0 100 100">
                <circle
                  className="fill-none stroke-zinc-200 dark:stroke-zinc-700"
                  cx="50"
                  cy="50"
                  r="40"
                  strokeWidth="10"
                />
                <circle
                  className={`fill-none ${
                    percentage >= 80 ? "stroke-green-500" : 
                    percentage >= 60 ? "stroke-yellow-500" : 
                    "stroke-red-500"
                  }`}
                  cx="50"
                  cy="50"
                  r="40"
                  strokeWidth="10"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * percentage) / 100}
                  transform="rotate(-90 50 50)"
                />
              </svg>
            </div>
            
            <p className="mt-4 text-center">
              {percentage >= 80
                ? "Отличная работа! Вы хорошо усвоили материал."
                : percentage >= 60
                ? "Хороший результат. Вы усвоили основную часть материала."
                : "Вам стоит еще раз изучить материал и повторить квиз."}
            </p>
          </div>
        </CardContent>
        <CardFooter className="pt-2 flex justify-center border-t">
          <Button onClick={resetQuiz} className="mt-2">
            <RotateCcw className="h-4 w-4 mr-2" />
            Пройти еще раз
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg bg-white dark:bg-zinc-800">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center">
            Вопрос {currentQuestionIndex + 1} из {questions.length}
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            Баллы: {score}/{questions.length}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{currentQuestion.question}</h3>
          
          {currentQuestion.type === QuestionType.SINGLE_CHOICE && (
            <RadioGroup
              onValueChange={handleSingleChoiceSelect}
              value={userAnswers.find(a => a.questionId === currentQuestion.id)?.selectedOptionIds?.[0]}
              className="space-y-2"
              disabled={showFeedback}
            >
              {currentQuestion.options?.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label
                    htmlFor={option.id}
                    className={`${
                      showFeedback && option.isCorrect ? "text-green-500 font-medium" : ""
                    }`}
                  >
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
          
          {currentQuestion.type === QuestionType.MULTIPLE_CHOICE && (
            <div className="space-y-2">
              {currentQuestion.options?.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={userAnswers.find(a => a.questionId === currentQuestion.id)?.selectedOptionIds?.includes(option.id)}
                    onCheckedChange={(isChecked) => handleMultipleChoiceSelect(option.id, !!isChecked)}
                    disabled={showFeedback}
                  />
                  <Label
                    htmlFor={option.id}
                    className={`${
                      showFeedback && option.isCorrect ? "text-green-500 font-medium" : ""
                    }`}
                  >
                    {option.text}
                  </Label>
                </div>
              ))}
            </div>
          )}
          
          {currentQuestion.type === QuestionType.TEXT_INPUT && (
            <div className="space-y-2">
              <Input
                placeholder="Введите ответ..."
                value={userAnswers.find(a => a.questionId === currentQuestion.id)?.textInput || ""}
                onChange={(e) => handleTextInput(e.target.value)}
                disabled={showFeedback}
              />
              {showFeedback && (
                <div className="mt-2">
                  <Label className="text-green-500 font-medium">
                    Правильный ответ: {currentQuestion.correctAnswer}
                  </Label>
                </div>
              )}
            </div>
          )}
          
          {currentQuestion.type === QuestionType.TRUE_FALSE && (
            <RadioGroup
              onValueChange={handleSingleChoiceSelect}
              value={userAnswers.find(a => a.questionId === currentQuestion.id)?.selectedOptionIds?.[0]}
              className="space-y-2"
              disabled={showFeedback}
            >
              {currentQuestion.options?.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label
                    htmlFor={option.id}
                    className={`${
                      showFeedback && option.isCorrect ? "text-green-500 font-medium" : ""
                    }`}
                  >
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
          
          {showFeedback && (
            <div className={`mt-4 p-4 rounded-lg ${
              isAnswerCorrect ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20"
            }`}>
              <div className="flex items-start">
                {isAnswerCorrect ? (
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 mr-2 text-red-500 flex-shrink-0" />
                )}
                <div>
                  <p className={`font-medium ${
                    isAnswerCorrect ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"
                  }`}>
                    {isAnswerCorrect ? "Правильно!" : "Неправильно"}
                  </p>
                  {currentQuestion.explanation && (
                    <p className="mt-1 text-sm">
                      {currentQuestion.explanation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2 border-t">
        {!showFeedback ? (
          <Button onClick={checkAnswer} disabled={
            !userAnswers.find(a => a.questionId === currentQuestion.id) ||
            (currentQuestion.type === QuestionType.MULTIPLE_CHOICE && 
              !userAnswers.find(a => a.questionId === currentQuestion.id)?.selectedOptionIds?.length)
          }>
            Проверить ответ
          </Button>
        ) : (
          <Button onClick={goToNextQuestion}>
            {currentQuestionIndex < questions.length - 1 ? "Следующий вопрос" : "Завершить квиз"}
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
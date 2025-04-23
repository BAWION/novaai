import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface QuizAnswer {
  id: number;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

interface QuizQuestion {
  id: number;
  prompt: string;
  type: "multiple-choice" | "single-choice" | "text" | "code";
  answers: QuizAnswer[];
  points: number;
}

interface Quiz {
  id: number;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  passingScore: number;
  timeLimit?: number; // в минутах
}

interface UserAnswer {
  questionId: number;
  answerIds: number[];
  textAnswer?: string;
}

interface QuizComponentProps {
  quiz: Quiz;
  onComplete?: (score: number, passed: boolean, answers: UserAnswer[]) => void;
  savedAnswers?: UserAnswer[];
  className?: string;
}

export function QuizComponent({
  quiz,
  onComplete,
  savedAnswers = [],
  className,
}: QuizComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>(savedAnswers);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(
    quiz.timeLimit ? quiz.timeLimit * 60 : null
  );

  // Восстанавливаем сохраненные ответы при монтировании
  useEffect(() => {
    if (savedAnswers.length > 0) {
      setUserAnswers(savedAnswers);
    } else {
      // Инициализируем пустые ответы для всех вопросов
      setUserAnswers(
        quiz.questions.map((q) => ({
          questionId: q.id,
          answerIds: [],
        }))
      );
    }
  }, [quiz, savedAnswers]);

  // Обратный отсчет времени
  useEffect(() => {
    if (!timeRemaining || isCompleted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev && prev > 0) {
          return prev - 1;
        } else {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isCompleted]);

  const handleAnswerChange = (
    questionId: number,
    answerId: number,
    questionType: string
  ) => {
    setUserAnswers((prevAnswers) => {
      return prevAnswers.map((ua) => {
        if (ua.questionId === questionId) {
          if (questionType === "single-choice") {
            return { ...ua, answerIds: [answerId] };
          } else if (questionType === "multiple-choice") {
            const updatedIds = ua.answerIds.includes(answerId)
              ? ua.answerIds.filter((id) => id !== answerId)
              : [...ua.answerIds, answerId];
            return { ...ua, answerIds: updatedIds };
          }
        }
        return ua;
      });
    });
  };

  const handleTextAnswerChange = (questionId: number, text: string) => {
    setUserAnswers((prevAnswers) => {
      return prevAnswers.map((ua) => {
        if (ua.questionId === questionId) {
          return { ...ua, textAnswer: text };
        }
        return ua;
      });
    });
  };

  const calculateScore = () => {
    let totalScore = 0;
    let totalPossibleScore = 0;

    quiz.questions.forEach((question) => {
      totalPossibleScore += question.points;
      const userAnswer = userAnswers.find((ua) => ua.questionId === question.id);

      if (!userAnswer) return;

      if (question.type === "single-choice" || question.type === "multiple-choice") {
        // Для выбора одного или нескольких вариантов
        const correctAnswerIds = question.answers
          .filter((a) => a.isCorrect)
          .map((a) => a.id);

        // Проверка на точное совпадение выбранных ответов
        if (
          userAnswer.answerIds.length === correctAnswerIds.length &&
          userAnswer.answerIds.every((id) => correctAnswerIds.includes(id))
        ) {
          totalScore += question.points;
        } else if (userAnswer.answerIds.length > 0) {
          // Частичные баллы для multiple-choice
          if (question.type === "multiple-choice") {
            const correctCount = userAnswer.answerIds.filter((id) =>
              correctAnswerIds.includes(id)
            ).length;
            const incorrectCount = userAnswer.answerIds.filter(
              (id) => !correctAnswerIds.includes(id)
            ).length;

            // Формула для частичных баллов (корректные минус некорректные)
            const partialScore = Math.max(
              0,
              (correctCount / correctAnswerIds.length) * question.points -
                (incorrectCount / (question.answers.length - correctAnswerIds.length)) *
                  question.points
            );
            totalScore += Math.round(partialScore);
          }
        }
      } else if (question.type === "text" || question.type === "code") {
        // Для текстовых ответов здесь может быть более сложная логика проверки
        // В реальном приложении это может потребовать проверки на серверной стороне
        // Здесь используем упрощенную логику как заглушку
        if (userAnswer.textAnswer && userAnswer.textAnswer.trim().length > 0) {
          totalScore += question.points / 2; // Половина баллов за любой непустой ответ
        }
      }
    });

    const percentageScore = Math.round((totalScore / totalPossibleScore) * 100);
    return { score: totalScore, percentageScore, totalPossibleScore };
  };

  const handleSubmitQuiz = () => {
    setIsSubmitting(true);
    
    // Подсчет результатов
    const { score, percentageScore, totalPossibleScore } = calculateScore();
    const passed = percentageScore >= quiz.passingScore;
    
    setScore(percentageScore);
    setIsCompleted(true);
    
    if (onComplete) {
      onComplete(percentageScore, passed, userAnswers);
    }
    
    setIsSubmitting(false);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  // Рендер компонента результатов
  const renderResults = () => {
    const { percentageScore } = calculateScore();
    const passed = percentageScore >= quiz.passingScore;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6 p-6 bg-space-800/50 rounded-xl border border-white/10"
      >
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Результаты квиза</h3>
          <p className="text-white/70">{quiz.title}</p>
        </div>

        <div className="flex justify-center">
          <div
            className={cn(
              "w-32 h-32 rounded-full flex items-center justify-center border-4 font-bold text-2xl",
              passed
                ? "border-green-500 text-green-400"
                : "border-red-500 text-red-400"
            )}
          >
            {percentageScore}%
          </div>
        </div>

        <div className="text-center">
          <div
            className={cn(
              "inline-block px-4 py-2 rounded-full font-medium",
              passed
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            )}
          >
            {passed ? "Тест пройден" : "Тест не пройден"}
          </div>
          <p className="mt-2 text-white/70">
            Проходной балл: {quiz.passingScore}%
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quiz.questions.map((question, idx) => {
            const userAnswer = userAnswers.find(
              (ua) => ua.questionId === question.id
            );
            const isCorrect =
              question.type === "single-choice" || question.type === "multiple-choice"
                ? question.answers
                    .filter((a) => a.isCorrect)
                    .every((a) => userAnswer?.answerIds.includes(a.id)) &&
                  userAnswer?.answerIds.length ===
                    question.answers.filter((a) => a.isCorrect).length
                : false;

            return (
              <div
                key={question.id}
                className={cn(
                  "p-4 rounded-lg",
                  isCorrect
                    ? "bg-green-500/10 border border-green-500/30"
                    : "bg-red-500/10 border border-red-500/30"
                )}
              >
                <div className="flex justify-between items-start">
                  <div className="font-medium">Вопрос {idx + 1}</div>
                  <div
                    className={cn(
                      "px-2 py-0.5 rounded-full text-xs",
                      isCorrect
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    )}
                  >
                    {isCorrect ? "Верно" : "Неверно"}
                  </div>
                </div>
                <p className="text-sm mt-1 text-white/80">{question.prompt}</p>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center pt-4">
          <button
            className="px-4 py-2 bg-primary hover:bg-primary/80 rounded-lg transition"
            onClick={() => window.scrollTo(0, 0)}
          >
            Вернуться к содержимому курса
          </button>
        </div>
      </motion.div>
    );
  };

  // Если тест завершен, показываем результаты
  if (isCompleted) {
    return renderResults();
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const currentUserAnswer = userAnswers.find(
    (ua) => ua.questionId === currentQuestion.id
  );

  return (
    <div className={className}>
      {/* Заголовок квиза */}
      <div className="bg-space-800/50 rounded-xl p-4 border border-white/10 mb-6">
        <h2 className="text-xl font-semibold">{quiz.title}</h2>
        {quiz.description && (
          <p className="text-white/70 mt-1">{quiz.description}</p>
        )}
        <div className="flex justify-between items-center mt-3">
          <div className="text-sm text-white/60">
            <i className="fas fa-question-circle mr-1"></i>
            {quiz.questions.length} вопросов
          </div>
          <div className="text-sm text-white/60">
            <i className="fas fa-award mr-1"></i>
            Проходной балл: {quiz.passingScore}%
          </div>
          {timeRemaining !== null && (
            <div className="text-sm text-white/60">
              <i className="fas fa-clock mr-1"></i>
              Осталось времени: {formatTime(timeRemaining)}
            </div>
          )}
        </div>
      </div>

      {/* Прогресс */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-white/60">
            Вопрос {currentQuestionIndex + 1} из {quiz.questions.length}
          </div>
          <div className="text-sm text-white/60">
            {Math.round(((currentQuestionIndex + 1) / quiz.questions.length) * 100)}%
            завершено
          </div>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full"
            style={{
              width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Текущий вопрос */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-space-800/50 rounded-xl p-6 border border-white/10 mb-6"
        >
          <div className="mb-4">
            <div className="text-sm text-primary mb-1">
              Вопрос {currentQuestionIndex + 1}
              {currentQuestion.points > 1 && ` · ${currentQuestion.points} баллов`}
            </div>
            <h3 className="text-lg font-medium">{currentQuestion.prompt}</h3>
          </div>

          {/* Варианты ответов */}
          {(currentQuestion.type === "single-choice" ||
            currentQuestion.type === "multiple-choice") && (
            <div className="space-y-3">
              {currentQuestion.answers.map((answer) => (
                <div
                  key={answer.id}
                  className={cn(
                    "flex items-center p-3 rounded-lg border border-white/10 cursor-pointer transition",
                    currentUserAnswer?.answerIds.includes(answer.id)
                      ? "bg-primary/20 border-primary/30"
                      : "bg-space-700 hover:bg-space-600"
                  )}
                  onClick={() =>
                    handleAnswerChange(
                      currentQuestion.id,
                      answer.id,
                      currentQuestion.type
                    )
                  }
                >
                  <div
                    className={cn(
                      "w-5 h-5 flex items-center justify-center rounded border mr-3",
                      currentUserAnswer?.answerIds.includes(answer.id)
                        ? "border-primary bg-primary/20 text-primary"
                        : "border-white/30 bg-space-800"
                    )}
                  >
                    {currentQuestion.type === "single-choice" ? (
                      <span
                        className={cn(
                          "w-3 h-3 rounded-full",
                          currentUserAnswer?.answerIds.includes(answer.id)
                            ? "bg-primary"
                            : "bg-transparent"
                        )}
                      />
                    ) : (
                      currentUserAnswer?.answerIds.includes(answer.id) && (
                        <i className="fas fa-check text-xs" />
                      )
                    )}
                  </div>
                  <span className="text-white/90">{answer.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* Текстовый ответ */}
          {(currentQuestion.type === "text" || currentQuestion.type === "code") && (
            <div className="space-y-3">
              <textarea
                className="w-full p-4 bg-space-700 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                rows={6}
                placeholder={
                  currentQuestion.type === "code"
                    ? "Введите ваш код здесь..."
                    : "Введите ваш ответ здесь..."
                }
                value={currentUserAnswer?.textAnswer || ""}
                onChange={(e) =>
                  handleTextAnswerChange(currentQuestion.id, e.target.value)
                }
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Навигация */}
      <div className="flex justify-between">
        <button
          className="px-4 py-2 bg-space-700 text-white/80 rounded-lg hover:bg-space-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
        >
          <i className="fas fa-arrow-left mr-2"></i>
          Предыдущий
        </button>

        {currentQuestionIndex < quiz.questions.length - 1 ? (
          <button
            className="px-4 py-2 bg-primary hover:bg-primary/80 rounded-lg transition flex items-center"
            onClick={handleNextQuestion}
          >
            Следующий
            <i className="fas fa-arrow-right ml-2"></i>
          </button>
        ) : (
          <button
            className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg transition flex items-center"
            onClick={handleSubmitQuiz}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Проверка...
              </>
            ) : (
              <>
                Завершить квиз
                <i className="fas fa-check ml-2"></i>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
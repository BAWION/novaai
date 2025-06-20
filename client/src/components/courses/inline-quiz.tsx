import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, HelpCircle, Lightbulb } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'open-ended' | 'true-false';
  question: string;
  options?: string[];
  correctAnswer?: string | number;
  explanation: string;
}

interface InlineQuizProps {
  questions: QuizQuestion[];
  lessonId: number;
  onComplete: (score: number) => void;
}

export default function InlineQuiz({ questions, lessonId, onComplete }: InlineQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(string | number | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [showExplanation, setShowExplanation] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const submitAnswerMutation = useMutation({
    mutationFn: async (answerData: any) => {
      return await apiRequest(`/api/lessons/${lessonId}/quiz-answer`, 'POST', answerData);
    }
  });

  const question = questions[currentQuestion];
  const userAnswer = userAnswers[currentQuestion];

  const handleAnswer = (answer: string | number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answer;
    setUserAnswers(newAnswers);
    setIsAnswered(true);
    setShowExplanation(true);

    // Submit answer to backend for analytics
    submitAnswerMutation.mutate({
      questionId: question.id,
      answer,
      questionType: question.type,
      isCorrect: question.type === 'open-ended' ? null : answer === question.correctAnswer
    });
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setIsAnswered(userAnswers[currentQuestion + 1] !== null);
      setShowExplanation(userAnswers[currentQuestion + 1] !== null);
    } else {
      completeQuiz();
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setIsAnswered(userAnswers[currentQuestion - 1] !== null);
      setShowExplanation(userAnswers[currentQuestion - 1] !== null);
    }
  };

  const completeQuiz = () => {
    const score = userAnswers.reduce((acc: number, answer, index) => {
      if (!answer) return acc;
      const q = questions[index];
      if (q.type === 'open-ended') return acc + 0.5; // Partial credit for open-ended
      return acc + (Number(answer) === Number(q.correctAnswer) ? 1 : 0);
    }, 0);
    
    const percentage = Math.round((score / questions.length) * 100);
    setQuizCompleted(true);
    onComplete(percentage);
  };

  const isCorrect = question.type === 'open-ended' ? null : userAnswer === question.correctAnswer;

  if (quizCompleted) {
    const score = userAnswers.reduce((acc: number, answer, index) => {
      if (!answer) return acc;
      const q = questions[index];
      if (q.type === 'open-ended') return acc + 0.5;
      return acc + (Number(answer) === Number(q.correctAnswer) ? 1 : 0);
    }, 0);
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <Card className="p-6 bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/30">
        <div className="text-center">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Квиз завершен!</h3>
          <p className="text-white/80 mb-4">
            Ваш результат: {percentage}% ({Math.round(score)}/{questions.length})
          </p>
          {percentage >= 80 && (
            <p className="text-green-400 font-medium">Отличная работа! Вы хорошо усвоили материал.</p>
          )}
          {percentage >= 60 && percentage < 80 && (
            <p className="text-yellow-400 font-medium">Хорошо! Рекомендуем повторить некоторые темы.</p>
          )}
          {percentage < 60 && (
            <p className="text-red-400 font-medium">Стоит перечитать урок и попробовать снова.</p>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 my-6">
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-medium text-white/80">
            Проверка знаний
          </span>
        </div>
        <span className="text-sm text-white/60">
          {currentQuestion + 1} из {questions.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/10 rounded-full h-2 mb-6">
        <div 
          className="bg-blue-400 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <h3 className="text-lg font-semibold text-white mb-4">
        {question.question}
      </h3>

      {/* Answer Options */}
      <div className="space-y-3 mb-4">
        {question.type === 'multiple-choice' && question.options && (
          question.options.map((option, index) => {
            const isSelected = userAnswer === index;
            const isCorrectOption = index === question.correctAnswer;
            
            return (
              <button
                key={index}
                onClick={() => !isAnswered && handleAnswer(index)}
                disabled={isAnswered}
                className={`w-full p-3 text-left rounded-lg border transition-all ${
                  isAnswered
                    ? isCorrectOption
                      ? 'bg-green-500/20 border-green-500/50 text-green-400'
                      : isSelected
                        ? 'bg-red-500/20 border-red-500/50 text-red-400'
                        : 'bg-white/5 border-white/10 text-white/60'
                    : isSelected
                      ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                      : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option}
                </div>
              </button>
            );
          })
        )}

        {question.type === 'true-false' && (
          ['Правда', 'Ложь'].map((option, index) => {
            const isSelected = userAnswer === index;
            const isCorrectOption = index === question.correctAnswer;
            
            return (
              <button
                key={index}
                onClick={() => !isAnswered && handleAnswer(index)}
                disabled={isAnswered}
                className={`w-full p-3 text-left rounded-lg border transition-all ${
                  isAnswered
                    ? isCorrectOption
                      ? 'bg-green-500/20 border-green-500/50 text-green-400'
                      : isSelected
                        ? 'bg-red-500/20 border-red-500/50 text-red-400'
                        : 'bg-white/5 border-white/10 text-white/60'
                    : isSelected
                      ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                      : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                }`}
              >
                {option}
              </button>
            );
          })
        )}

        {question.type === 'open-ended' && (
          <div>
            <Textarea
              value={userAnswer as string || ''}
              onChange={(e) => setUserAnswers(prev => {
                const newAnswers = [...prev];
                newAnswers[currentQuestion] = e.target.value;
                return newAnswers;
              })}
              placeholder="Введите ваш ответ..."
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              rows={4}
            />
            {!isAnswered && (
              <Button
                onClick={() => handleAnswer(userAnswer as string || '')}
                disabled={!userAnswer || (userAnswer as string).trim().length < 10}
                className="mt-3 bg-blue-600 hover:bg-blue-700"
              >
                Отправить ответ
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className="p-4 bg-white/5 rounded-lg border border-white/10 mb-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-white mb-2">Объяснение:</h4>
              <p className="text-white/80 text-sm leading-relaxed">
                {question.explanation}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={previousQuestion}
          disabled={currentQuestion === 0}
          className="text-white/60 hover:text-white hover:bg-white/10"
        >
          Назад
        </Button>

        {isAnswered && (
          <Button
            onClick={nextQuestion}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {currentQuestion < questions.length - 1 ? 'Следующий вопрос' : 'Завершить квиз'}
          </Button>
        )}
      </div>
    </Card>
  );
}
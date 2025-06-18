import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, HelpCircle, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface InlineQuizProps {
  question: QuizQuestion;
  onAnswer: (questionId: string, isCorrect: boolean) => void;
  className?: string;
}

export function InlineQuiz({ question, onAnswer, className = "" }: InlineQuizProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    setIsAnswered(true);
    
    const isCorrect = answerIndex === question.correctAnswer;
    onAnswer(question.id, isCorrect);
  };

  const isCorrect = selectedAnswer === question.correctAnswer;

  const difficultyColors = {
    beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
    intermediate: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    advanced: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  };

  return (
    <Card className={`bg-white/5 backdrop-blur-sm border-white/10 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-400" />
            <span className="font-medium text-white">Проверка знаний</span>
          </div>
          <Badge className={`${difficultyColors[question.difficulty]} border`}>
            {question.difficulty === 'beginner' ? 'Новичок' : 
             question.difficulty === 'intermediate' ? 'Средний' : 'Эксперт'}
          </Badge>
        </div>

        <div className="mb-6">
          <p className="text-white/90 leading-relaxed">{question.question}</p>
        </div>

        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => {
            let buttonClass = "w-full text-left p-4 rounded-lg border transition-all duration-200 ";
            
            if (!isAnswered) {
              buttonClass += "bg-white/5 hover:bg-white/10 border-white/20 hover:border-white/30 text-white/80";
            } else if (index === question.correctAnswer) {
              buttonClass += "bg-green-500/20 border-green-500/50 text-green-400";
            } else if (index === selectedAnswer && index !== question.correctAnswer) {
              buttonClass += "bg-red-500/20 border-red-500/50 text-red-400";
            } else {
              buttonClass += "bg-white/5 border-white/20 text-white/60";
            }

            return (
              <Button
                key={index}
                variant="outline"
                onClick={() => handleAnswerSelect(index)}
                disabled={isAnswered}
                className={buttonClass}
              >
                <div className="flex items-center justify-between w-full">
                  <span>{option}</span>
                  {isAnswered && index === question.correctAnswer && (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                  {isAnswered && index === selectedAnswer && index !== question.correctAnswer && (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                </div>
              </Button>
            );
          })}
        </div>

        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className={`p-4 rounded-lg border ${
                isCorrect 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-red-500/10 border-red-500/30'
              }`}>
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className={`font-medium mb-2 ${
                      isCorrect ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {isCorrect ? 'Правильно!' : 'Неправильно'}
                    </p>
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <p className="text-white/80 text-sm leading-relaxed">
                        {question.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
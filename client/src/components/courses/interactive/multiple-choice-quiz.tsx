import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, XCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface MultipleChoiceQuizProps {
  question: string;
  options: QuizOption[];
  explanation?: string;
  onComplete?: (isCorrect: boolean, selectedOption: string) => void;
  showFeedback?: boolean;
}

/**
 * Компонент для отображения квиза с выбором одного ответа
 */
const MultipleChoiceQuiz: React.FC<MultipleChoiceQuizProps> = ({
  question,
  options,
  explanation,
  onComplete,
  showFeedback = true
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [submittedOption, setSubmittedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleOptionSelect = (optionId: string) => {
    if (submittedOption === null) {
      setSelectedOption(optionId);
    }
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    
    const correctOption = options.find(option => option.isCorrect);
    const selected = options.find(option => option.id === selectedOption);
    const correct = selected?.isCorrect || false;
    
    setIsCorrect(correct);
    setSubmittedOption(selectedOption);
    setShowExplanation(true);
    
    if (onComplete) {
      onComplete(correct, selectedOption);
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
    setSubmittedOption(null);
    setIsCorrect(null);
    setShowExplanation(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-space-800/60 backdrop-blur-sm p-4 rounded-md border border-space-700">
        <div className="flex items-start gap-3">
          <div className="bg-primary/20 p-2 rounded-md">
            <HelpCircle size={20} className="text-primary" />
          </div>
          <h3 className="text-lg font-medium">{question}</h3>
        </div>
      </div>
      
      <div className="space-y-3">
        {options.map((option) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => handleOptionSelect(option.id)}
            className={cn(
              "cursor-pointer p-4 rounded-md border flex items-center gap-3 transition-colors",
              selectedOption === option.id && submittedOption === null
                ? "bg-primary/20 border-primary"
                : "bg-space-800/40 border-space-700 hover:border-space-600",
              submittedOption !== null && option.id === selectedOption && isCorrect
                ? "bg-green-900/30 border-green-700"
                : submittedOption !== null && option.id === selectedOption && !isCorrect
                ? "bg-red-900/30 border-red-700"
                : submittedOption !== null && option.isCorrect && showFeedback
                ? "bg-green-900/20 border-green-700/60"
                : ""
            )}
          >
            {submittedOption !== null && option.id === selectedOption && isCorrect ? (
              <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
            ) : submittedOption !== null && option.id === selectedOption && !isCorrect ? (
              <XCircle size={20} className="text-red-500 flex-shrink-0" />
            ) : submittedOption !== null && option.isCorrect && showFeedback ? (
              <CheckCircle2 size={20} className="text-green-500/60 flex-shrink-0" />
            ) : (
              <div className={cn(
                "w-5 h-5 border rounded-full flex-shrink-0",
                selectedOption === option.id
                  ? "border-primary bg-primary/20"
                  : "border-space-600 bg-space-800"
              )}></div>
            )}
            <span className={cn(
              "text-white/90",
              submittedOption !== null && option.id === selectedOption && "font-medium",
              submittedOption !== null && option.isCorrect && showFeedback && "font-medium"
            )}>
              {option.text}
            </span>
          </motion.div>
        ))}
      </div>
      
      {showExplanation && explanation && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="mt-4"
        >
          <Card className={cn(
            "border p-4",
            isCorrect ? "border-green-700 bg-green-900/20" : "border-amber-700 bg-amber-900/20"
          )}>
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className={isCorrect ? "text-green-400" : "text-amber-400"} />
              <div>
                <h4 className={cn(
                  "font-medium mb-1",
                  isCorrect ? "text-green-400" : "text-amber-400"
                )}>
                  {isCorrect ? "Верно!" : "Не совсем верно"}
                </h4>
                <p className="text-white/80">{explanation}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
      
      <div className="flex justify-end space-x-3">
        {submittedOption !== null ? (
          <Button onClick={handleReset} variant="outline">
            Попробовать снова
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className="px-8"
          >
            Проверить
          </Button>
        )}
      </div>
    </div>
  );
};

export default MultipleChoiceQuiz;
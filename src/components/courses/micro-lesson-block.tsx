import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Play, Pause, ArrowRight } from "lucide-react";
import DifficultyLevelSwitcher from "./difficulty-level-switcher";
import InlineQuiz from "./inline-quiz";

interface MicroLessonBlock {
  id: string;
  title: string;
  estimatedDuration: number; // in minutes
  content: {
    beginner: string;
    intermediate: string;
    advanced: string;
  };
  quiz?: {
    id: string;
    type: 'multiple-choice' | 'open-ended' | 'true-false';
    question: string;
    options?: string[];
    correctAnswer?: string | number;
    explanation: string;
  }[];
  completed?: boolean;
}

interface MicroLessonBlockProps {
  block: MicroLessonBlock;
  blockIndex: number;
  totalBlocks: number;
  onComplete: (blockId: string) => void;
  onNext: () => void;
}

export default function MicroLessonBlockComponent({ 
  block, 
  blockIndex, 
  totalBlocks, 
  onComplete, 
  onNext 
}: MicroLessonBlockProps) {
  const [isStarted, setIsStarted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [difficultyLevel, setDifficultyLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(block.completed || false);

  const progress = ((blockIndex + 1) / totalBlocks) * 100;

  const handleStart = () => {
    setIsStarted(true);
    // Start timer
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 60000); // Update every minute

    // Clean up timer after estimated duration
    setTimeout(() => {
      clearInterval(timer);
    }, block.estimatedDuration * 60 * 1000);
  };

  const handleComplete = () => {
    setIsCompleted(true);
    onComplete(block.id);
  };

  const handleQuizComplete = (score: number) => {
    setQuizCompleted(true);
    if (score >= 70) { // 70% passing score
      setTimeout(() => {
        handleComplete();
      }, 1000);
    }
  };

  const canProceed = isStarted && (!block.quiz || quizCompleted);

  return (
    <Card className="mb-6 bg-white/5 backdrop-blur-sm border border-white/10">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isCompleted ? 'bg-green-500' : isStarted ? 'bg-blue-500' : 'bg-white/20'
            }`}>
              {isCompleted ? (
                <CheckCircle className="w-4 h-4 text-white" />
              ) : (
                <span className="text-sm font-bold text-white">{blockIndex + 1}</span>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{block.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-4 h-4 text-white/60" />
                <span className="text-sm text-white/60">
                  {block.estimatedDuration} мин
                </span>
                {timeSpent > 0 && (
                  <Badge variant="outline" className="text-xs">
                    Потрачено: {timeSpent} мин
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {!isStarted ? (
            <Button onClick={handleStart} className="bg-blue-600 hover:bg-blue-700">
              <Play className="w-4 h-4 mr-2" />
              Начать
            </Button>
          ) : (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              В процессе
            </Badge>
          )}
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-white/60">
            <span>Прогресс урока</span>
            <span>{blockIndex + 1} из {totalBlocks}</span>
          </div>
          <Progress value={progress} className="h-2 bg-white/10" />
        </div>
      </div>

      {/* Content */}
      {isStarted && (
        <div className="p-6">
          <DifficultyLevelSwitcher
            currentLevel={difficultyLevel}
            onLevelChange={setDifficultyLevel}
            content={block.content}
          />

          {/* Quiz Section */}
          {block.quiz && !quizCompleted && (
            <div className="mt-6">
              <InlineQuiz
                questions={block.quiz}
                lessonId={parseInt(block.id)}
                onComplete={handleQuizComplete}
              />
            </div>
          )}

          {/* Completion and Navigation */}
          {canProceed && (
            <div className="mt-6 flex justify-between items-center pt-4 border-t border-white/10">
              {!isCompleted ? (
                <Button 
                  onClick={handleComplete}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Завершить блок
                </Button>
              ) : (
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">Блок завершен!</span>
                </div>
              )}

              {isCompleted && blockIndex < totalBlocks - 1 && (
                <Button 
                  onClick={onNext}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Следующий блок
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
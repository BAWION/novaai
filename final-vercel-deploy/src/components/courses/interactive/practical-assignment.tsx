import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BadgeCheck, Lightbulb, Send, CodeXml, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PracticalAssignmentProps {
  title: string;
  instructions: string;
  taskDescription: string;
  codeSample?: string;
  hints?: string[];
  onSubmit?: (solution: string) => void;
  onComplete?: () => void;
}

/**
 * Компонент для практических заданий в микроструктуре урока
 */
const PracticalAssignment: React.FC<PracticalAssignmentProps> = ({
  title,
  instructions,
  taskDescription,
  codeSample,
  hints = [],
  onSubmit,
  onComplete
}) => {
  const [solution, setSolution] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);

  const handleSubmit = () => {
    if (solution.trim().length === 0) return;
    
    setSubmitted(true);
    
    if (onSubmit) {
      onSubmit(solution);
    }
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    }
  };

  const handleReset = () => {
    setSolution('');
    setSubmitted(false);
    setShowHints(false);
    setCurrentHintIndex(0);
  };

  const showNextHint = () => {
    if (currentHintIndex < hints.length - 1) {
      setCurrentHintIndex(prev => prev + 1);
    }
  };

  return (
    <Card className="border-space-700 bg-space-800/60 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-medium text-primary">{title}</h3>
          {submitted && (
            <BadgeCheck size={20} className="text-green-400" />
          )}
        </div>
        <p className="text-white/80 text-sm">
          {instructions}
        </p>
      </CardHeader>
      
      <Separator className="mb-0" />
      
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="bg-space-900/60 border border-space-700 rounded-md p-4">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <CodeXml size={16} className="text-primary" />
              Задание:
            </h4>
            <div className="prose prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: taskDescription }} />
            </div>

            {codeSample && (
              <div className="mt-4 p-3 bg-space-900 rounded-md font-mono text-sm text-white/90 overflow-x-auto">
                <pre>{codeSample}</pre>
              </div>
            )}
          </div>
          
          {hints.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowHints(!showHints)}
                  className="text-white/70 hover:text-white flex items-center gap-1"
                >
                  <Lightbulb size={16} className="text-amber-400" />
                  {showHints ? "Скрыть подсказки" : "Показать подсказки"}
                </Button>
                
                {showHints && currentHintIndex < hints.length - 1 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={showNextHint}
                    className="text-white/70 hover:text-white text-xs"
                  >
                    Следующая подсказка
                  </Button>
                )}
              </div>
              
              {showHints && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {hints.slice(0, currentHintIndex + 1).map((hint, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        "bg-amber-900/20 border border-amber-700/50 rounded-md p-3 mb-2",
                        index === currentHintIndex ? "border-amber-600" : ""
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <Lightbulb size={18} className="text-amber-400 mt-0.5" />
                        <div className="text-white/90 text-sm">{hint}</div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">
              {submitted ? "Ваше решение:" : "Напишите ваше решение:"}
            </label>
            <Textarea 
              placeholder="Введите ваше решение здесь..."
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              className="min-h-[150px] bg-space-900/60 border-space-700"
              disabled={submitted}
            />
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t border-space-700 bg-space-900/30 gap-3 justify-end">
        {submitted ? (
          <>
            <Button variant="outline" onClick={handleReset}>
              <RefreshCw size={16} className="mr-2" />
              Сбросить
            </Button>
            <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">
              <BadgeCheck size={16} className="mr-2" />
              Отметить как выполненное
            </Button>
          </>
        ) : (
          <Button 
            onClick={handleSubmit}
            disabled={solution.trim().length === 0}
          >
            <Send size={16} className="mr-2" />
            Отправить решение
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PracticalAssignment;
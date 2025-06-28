import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Telescope, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { MultipleChoiceQuiz, PracticalAssignment } from '../interactive';
import type { QuizOption } from '../interactive';

export type InteractiveElementType = 'quiz' | 'practical' | 'text';

interface QuizData {
  type: 'quiz';
  question: string;
  options: QuizOption[];
  explanation?: string;
}

interface PracticalData {
  type: 'practical';
  title: string;
  instructions: string;
  taskDescription: string;
  codeSample?: string;
  hints?: string[];
}

interface TextData {
  type: 'text';
  content: string;
}

export type InteractiveElement = QuizData | PracticalData | TextData;

interface InteractiveQuickTryTemplateProps {
  title: string;
  introduction: string;
  interactiveElements: InteractiveElement[];
  onComplete?: () => void;
}

/**
 * Интерактивный шаблон для секции Quick Try с квизами и практическими заданиями
 */
const InteractiveQuickTryTemplate: React.FC<InteractiveQuickTryTemplateProps> = ({
  title,
  introduction,
  interactiveElements,
  onComplete
}) => {
  const [completedElements, setCompletedElements] = useState<Record<number, boolean>>({});
  
  // Процент выполненных интерактивных элементов
  const completionPercentage = interactiveElements.length > 0
    ? (Object.values(completedElements).filter(Boolean).length / interactiveElements.length) * 100
    : 0;
    
  // Все интерактивные элементы завершены
  const allCompleted = completionPercentage === 100;
  
  // Обработчик завершения отдельного интерактивного элемента
  const handleElementComplete = (index: number) => {
    setCompletedElements(prev => ({
      ...prev,
      [index]: true
    }));
    
    // Если все элементы завершены, вызываем onComplete
    const updatedCompletedCount = Object.values({
      ...completedElements,
      [index]: true
    }).filter(Boolean).length;
    
    if (updatedCompletedCount === interactiveElements.length && onComplete) {
      onComplete();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="border border-space-700 bg-space-800/60 backdrop-blur-sm overflow-hidden">
        <div className="absolute right-0 top-0 h-16 w-16">
          <div className="absolute transform rotate-45 bg-indigo-600 text-center text-white font-semibold py-1 right-[-35px] top-[24px] w-[140px]">
            Практикум
          </div>
        </div>
        
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Telescope size={22} className="text-indigo-400" />
            <h2 className="text-xl font-semibold text-indigo-400">{title}</h2>
          </div>

          <div className="prose prose-invert max-w-none mb-6">
            <div dangerouslySetInnerHTML={{ __html: introduction }} />
          </div>
          
          <div className="space-y-6 mt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${allCompleted ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                  <span>Прогресс выполнения</span>
                </div>
                <span className={allCompleted ? 'text-green-400' : ''}>
                  {Math.round(completionPercentage)}%
                  {allCompleted && <CheckCircle2 size={14} className="ml-1 inline" />}
                </span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>
            
            {interactiveElements.map((element, index) => (
              <div key={index} className="mb-8 last:mb-0">
                {element.type === 'quiz' && (
                  <MultipleChoiceQuiz 
                    question={element.question}
                    options={element.options}
                    explanation={element.explanation}
                    onComplete={() => handleElementComplete(index)}
                  />
                )}
                
                {element.type === 'practical' && (
                  <PracticalAssignment 
                    title={element.title}
                    instructions={element.instructions}
                    taskDescription={element.taskDescription}
                    codeSample={element.codeSample}
                    hints={element.hints}
                    onComplete={() => handleElementComplete(index)}
                  />
                )}
                
                {element.type === 'text' && (
                  <Card className="border-space-700 bg-space-800/60 p-4">
                    <div 
                      className="prose prose-invert max-w-none" 
                      dangerouslySetInnerHTML={{ __html: element.content }}
                    />
                  </Card>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InteractiveQuickTryTemplate;
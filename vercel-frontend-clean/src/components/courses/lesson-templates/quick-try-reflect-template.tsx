import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, Telescope, Sparkles, ThumbsUp, BookOpen, Send, Award } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

interface QuickTryReflectTemplateProps {
  quickTryTitle: string;
  quickTryInstructions: string;
  quickTryTask: string;
  reflectTitle: string;
  reflectPrompt: string;
  reflectQuestions: string[];
  onSubmitReflection?: (reflection: string) => void;
  onCompleteTask?: () => void;
}

/**
 * Шаблон для секций Quick Try и Reflect
 * Quick Try - практическое задание для быстрого закрепления материала
 * Reflect - рефлексия и осмысление изученного
 */
const QuickTryReflectTemplate: React.FC<QuickTryReflectTemplateProps> = ({
  quickTryTitle,
  quickTryInstructions,
  quickTryTask,
  reflectTitle,
  reflectPrompt,
  reflectQuestions,
  onSubmitReflection,
  onCompleteTask,
}) => {
  const [reflection, setReflection] = useState('');
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [reflectionSubmitted, setReflectionSubmitted] = useState(false);
  const [taskProgress, setTaskProgress] = useState(0);

  const handleCompleteTask = () => {
    setTaskCompleted(true);
    setTaskProgress(100);
    if (onCompleteTask) onCompleteTask();
  };

  const handleSubmitReflection = () => {
    if (reflection.trim().length > 0) {
      setReflectionSubmitted(true);
      if (onSubmitReflection) onSubmitReflection(reflection);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="space-y-6"
    >
      <Tabs defaultValue="quicktry" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="quicktry" className="flex items-center gap-2">
            <Telescope size={18} /> Практика
          </TabsTrigger>
          <TabsTrigger value="reflect" className="flex items-center gap-2">
            <Sparkles size={18} /> Рефлексия
          </TabsTrigger>
        </TabsList>

        {/* Quick Try Tab Content */}
        <TabsContent value="quicktry" className="space-y-4">
          <Card className="border border-space-700 bg-space-800/60 backdrop-blur-sm overflow-hidden">
            <div className="absolute right-0 top-0 h-16 w-16">
              <div className="absolute transform rotate-45 bg-green-600 text-center text-white font-semibold py-1 right-[-35px] top-[24px] w-[140px]">
                Практикум
              </div>
            </div>
            
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Telescope size={22} className="text-indigo-400" />
                <h2 className="text-xl font-semibold text-indigo-400">{quickTryTitle}</h2>
              </div>

              <div className="prose prose-invert max-w-none mb-6">
                <div dangerouslySetInnerHTML={{ __html: quickTryInstructions }} />
              </div>

              <div className="bg-space-900/60 border border-space-700 rounded-md p-5 mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-600/10 pointer-events-none" />
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <BookOpen size={18} className="text-indigo-400" />
                  Ваша задача:
                </h3>
                <div className="prose prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: quickTryTask }} />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${taskCompleted ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                    <span>Прогресс задания</span>
                  </div>
                  <span>{taskProgress}%</span>
                </div>
                <Progress value={taskProgress} className="h-2" />
              </div>
            </CardContent>
            
            <CardFooter className="bg-space-900/40 px-6 py-4">
              <div className="flex w-full justify-between items-center">
                <div className="text-sm text-white/60 italic">
                  {taskCompleted ? 
                    <span className="flex items-center gap-1 text-green-400">
                      <CheckCircle2 size={16} />
                      Задание выполнено
                    </span> : 
                    'Выполните задание и отметьте его как завершенное'
                  }
                </div>
                <Button 
                  onClick={handleCompleteTask}
                  disabled={taskCompleted}
                  variant={taskCompleted ? "outline" : "default"}
                  className={taskCompleted ? "bg-green-800/20 text-green-400 border-green-700" : ""}
                >
                  {taskCompleted ? (
                    <span className="flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      Выполнено
                    </span>
                  ) : (
                    "Отметить как выполненное"
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Reflect Tab Content */}
        <TabsContent value="reflect" className="space-y-4">
          <Card className="border border-space-700 bg-space-800/60 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Sparkles size={22} className="text-purple-400" />
                <h2 className="text-xl font-semibold text-purple-400">{reflectTitle}</h2>
              </div>

              <div className="prose prose-invert max-w-none mb-6">
                <div dangerouslySetInnerHTML={{ __html: reflectPrompt }} />
              </div>

              <Separator className="my-4" />

              <div className="space-y-4 mb-6">
                <h3 className="font-medium text-lg text-purple-300">Вопросы для размышления:</h3>
                {reflectQuestions.map((question, idx) => (
                  <motion.div 
                    key={idx} 
                    className="flex items-start gap-3 bg-space-900/60 p-3 rounded-md border border-space-700"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx }}
                  >
                    <div className="text-purple-400 text-sm font-semibold rounded-full w-5 h-5 flex items-center justify-center border border-purple-500 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-white/90">{question}</p>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <ThumbsUp size={16} className="text-purple-400" />
                  <h3 className="font-medium">Ваши мысли:</h3>
                </div>
                <Textarea 
                  placeholder="Запишите свои мысли и наблюдения здесь..."
                  className="bg-space-900/60 border-space-700 resize-y min-h-[120px]"
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  disabled={reflectionSubmitted}
                />
              </div>
            </CardContent>

            <CardFooter className="bg-space-900/40 px-6 py-4">
              <div className="flex w-full justify-between items-center">
                <div className="text-sm text-white/60 italic">
                  {reflectionSubmitted ? 
                    <span className="flex items-center gap-1 text-purple-400">
                      <Award size={16} />
                      Рефлексия сохранена
                    </span> : 
                    'Запишите свои мысли и отправьте их'
                  }
                </div>
                <Button 
                  onClick={handleSubmitReflection}
                  disabled={reflection.trim().length === 0 || reflectionSubmitted}
                  variant={reflectionSubmitted ? "outline" : "default"}
                  className={reflectionSubmitted ? "bg-purple-800/20 text-purple-400 border-purple-700" : ""}
                >
                  {reflectionSubmitted ? (
                    <span className="flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      Отправлено
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send size={16} />
                      Отправить
                    </span>
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default QuickTryReflectTemplate;
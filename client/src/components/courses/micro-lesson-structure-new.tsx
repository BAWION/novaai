import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { RocketLaunch, BookOpen, Coffee, ActivitySquare, CheckCircle2 } from 'lucide-react';

// Импортируем наши новые шаблоны
import { HookTemplate, ExplainDemoTemplate, QuickTryReflectTemplate } from './lesson-templates';

// Интерфейс структуры микроурока
interface LessonStructure {
  id: number;
  lessonId: number;
  hook: string;
  hookTitle?: string;
  hookImage?: string;
  explain: string;
  explainTitle?: string;
  demo: string;
  demoTitle?: string;
  demoCode?: string;
  quickTry: string;
  quickTryTitle?: string;
  quickTryTask?: string;
  reflect: string;
  reflectTitle?: string;
  reflectQuestions?: string[];
  keyPoints?: string[];
  externalLinks?: Array<{ url: string; title: string }>;
}

interface UserProgress {
  id?: number;
  userId: number;
  lessonId: number;
  hookCompleted: boolean;
  explainCompleted: boolean;
  demoCompleted: boolean;
  quickTryCompleted: boolean;
  reflectCompleted: boolean;
  reflectionText?: string;
  lastVisitedSection?: string;
  completedAt?: string;
}

interface MicroLessonStructureProps {
  lessonId: number;
  structure: LessonStructure;
  userProgress?: UserProgress;
  onProgressUpdate?: (progress: Partial<UserProgress>) => Promise<void>;
  onComplete?: () => void;
}

/**
 * Компонент структуры микроурока - новый вариант с красивыми шаблонами
 */
const MicroLessonStructureNew: React.FC<MicroLessonStructureProps> = ({
  lessonId,
  structure,
  userProgress,
  onProgressUpdate,
  onComplete
}) => {
  const [activeTab, setActiveTab] = useState<string>('hook');
  const [progress, setProgress] = useState<UserProgress>(
    userProgress || {
      userId: 0, // Будет заменено при сохранении прогресса
      lessonId,
      hookCompleted: false,
      explainCompleted: false,
      demoCompleted: false,
      quickTryCompleted: false,
      reflectCompleted: false
    }
  );

  // Общий прогресс завершения микроурока в процентах
  const completionPercentage = 
    (Object.entries(progress)
      .filter(([key]) => key.endsWith('Completed'))
      .filter(([_, value]) => value === true).length / 5) * 100;

  // Когда пользователь переключается на таб, отмечаем его как посещенный
  useEffect(() => {
    if (activeTab && activeTab !== progress.lastVisitedSection) {
      updateProgress({ lastVisitedSection: activeTab });
      
      // Автоматически отмечаем секции hook, explain и demo как завершенные при посещении
      if (activeTab === 'hook' && !progress.hookCompleted) {
        updateProgress({ hookCompleted: true });
      } else if (activeTab === 'explain' && !progress.explainCompleted) {
        updateProgress({ explainCompleted: true });
      } else if (activeTab === 'demo' && !progress.demoCompleted) {
        updateProgress({ demoCompleted: true });
      }
    }
  }, [activeTab]);

  // Обновляем прогресс пользователя
  const updateProgress = async (updates: Partial<UserProgress>) => {
    const updatedProgress = { ...progress, ...updates };
    setProgress(updatedProgress);
    
    if (onProgressUpdate) {
      await onProgressUpdate(updates);
    }
    
    // Проверяем, завершен ли урок
    const allCompleted = 
      updatedProgress.hookCompleted && 
      updatedProgress.explainCompleted && 
      updatedProgress.demoCompleted && 
      updatedProgress.quickTryCompleted && 
      updatedProgress.reflectCompleted;
    
    if (allCompleted && !progress.completedAt && onComplete) {
      onComplete();
    }
  };

  // Обработчик завершения быстрого задания
  const handleCompleteQuickTry = () => {
    updateProgress({ quickTryCompleted: true });
  };

  // Обработчик отправки рефлексии
  const handleSubmitReflection = (text: string) => {
    updateProgress({ 
      reflectCompleted: true,
      reflectionText: text 
    });
  };

  // Преобразуем reflectQuestions из строки в массив, если они существуют
  const reflectQuestionsArray = structure.reflectQuestions || 
    structure.reflect
      .split('\n')
      .filter(line => line.trim().startsWith('- ') || line.trim().startsWith('* '))
      .map(line => line.replace(/^[-*]\s+/, ''));

  return (
    <div className="space-y-6">
      {/* Прогресс микроурока */}
      <div className="bg-space-800/50 rounded-lg p-4 border border-space-700">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-white">Прогресс микроурока</h3>
          <Badge variant="outline" className={completionPercentage === 100 ? 'bg-green-900/30 text-green-400 border-green-700' : ''}>
            {completionPercentage === 100 ? (
              <span className="flex items-center gap-1">
                <CheckCircle2 size={14} />
                Завершено
              </span>
            ) : (
              `${Math.round(completionPercentage)}%`
            )}
          </Badge>
        </div>
        <Progress value={completionPercentage} className="h-2" />
        
        <div className="grid grid-cols-5 gap-1 mt-3">
          <div 
            className={`text-xs px-2 py-1 rounded flex items-center justify-center ${
              progress.hookCompleted ? 'bg-green-900/30 text-green-400' : 'bg-space-700 text-white/60'
            }`}
          >
            Hook
          </div>
          <div 
            className={`text-xs px-2 py-1 rounded flex items-center justify-center ${
              progress.explainCompleted ? 'bg-green-900/30 text-green-400' : 'bg-space-700 text-white/60'
            }`}
          >
            Explain
          </div>
          <div 
            className={`text-xs px-2 py-1 rounded flex items-center justify-center ${
              progress.demoCompleted ? 'bg-green-900/30 text-green-400' : 'bg-space-700 text-white/60'
            }`}
          >
            Demo
          </div>
          <div 
            className={`text-xs px-2 py-1 rounded flex items-center justify-center ${
              progress.quickTryCompleted ? 'bg-green-900/30 text-green-400' : 'bg-space-700 text-white/60'
            }`}
          >
            Quick Try
          </div>
          <div 
            className={`text-xs px-2 py-1 rounded flex items-center justify-center ${
              progress.reflectCompleted ? 'bg-green-900/30 text-green-400' : 'bg-space-700 text-white/60'
            }`}
          >
            Reflect
          </div>
        </div>
      </div>
      
      <Separator />
      
      {/* Вкладки микроурока */}
      <Tabs 
        defaultValue="hook" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-5 h-auto p-1">
          <TabsTrigger 
            value="hook" 
            className="flex flex-col items-center py-2 px-1 data-[state=active]:bg-sky-900/30"
          >
            <RocketLaunch size={16} />
            <span className="mt-1 text-xs">Hook</span>
          </TabsTrigger>
          <TabsTrigger 
            value="explain" 
            className="flex flex-col items-center py-2 px-1 data-[state=active]:bg-blue-900/30"
          >
            <BookOpen size={16} />
            <span className="mt-1 text-xs">Explain</span>
          </TabsTrigger>
          <TabsTrigger 
            value="demo" 
            className="flex flex-col items-center py-2 px-1 data-[state=active]:bg-indigo-900/30"
          >
            <Coffee size={16} />
            <span className="mt-1 text-xs">Demo</span>
          </TabsTrigger>
          <TabsTrigger 
            value="quicktry" 
            className="flex flex-col items-center py-2 px-1 data-[state=active]:bg-violet-900/30"
          >
            <ActivitySquare size={16} />
            <span className="mt-1 text-xs">Quick Try</span>
          </TabsTrigger>
          <TabsTrigger 
            value="reflect" 
            className="flex flex-col items-center py-2 px-1 data-[state=active]:bg-purple-900/30"
          >
            <CheckCircle2 size={16} />
            <span className="mt-1 text-xs">Reflect</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          {/* Hook */}
          <TabsContent value="hook" className="mt-0">
            <HookTemplate 
              title={structure.hookTitle || "Давайте начнем!"}
              content={structure.hook}
              imageUrl={structure.hookImage}
            />
          </TabsContent>
          
          {/* Explain и Demo в одном компоненте */}
          <TabsContent value="explain" className="mt-0">
            <ExplainDemoTemplate 
              explainTitle={structure.explainTitle || "Объяснение концепции"}
              explainContent={structure.explain}
              demoTitle={""}
              demoContent={""}
              keyPoints={structure.keyPoints}
            />
          </TabsContent>
          
          <TabsContent value="demo" className="mt-0">
            <ExplainDemoTemplate 
              explainTitle={""}
              explainContent={""}
              demoTitle={structure.demoTitle || "Демонстрация на практике"}
              demoContent={structure.demo}
              codeSnippet={structure.demoCode}
              externalLinks={structure.externalLinks}
            />
          </TabsContent>
          
          {/* QuickTry и Reflect в одном компоненте с разными табами */}
          <TabsContent value="quicktry" className="mt-0">
            <QuickTryReflectTemplate 
              quickTryTitle={structure.quickTryTitle || "Быстрая практика"}
              quickTryInstructions={structure.quickTry}
              quickTryTask={structure.quickTryTask || "Выполните небольшое задание для закрепления материала."}
              reflectTitle={""}
              reflectPrompt={""}
              reflectQuestions={[]}
              onCompleteTask={handleCompleteQuickTry}
            />
          </TabsContent>
          
          <TabsContent value="reflect" className="mt-0">
            <QuickTryReflectTemplate 
              quickTryTitle={""}
              quickTryInstructions={""}
              quickTryTask={""}
              reflectTitle={structure.reflectTitle || "Время для рефлексии"}
              reflectPrompt={structure.reflect}
              reflectQuestions={reflectQuestionsArray}
              onSubmitReflection={handleSubmitReflection}
            />
          </TabsContent>
        </div>
      </Tabs>
      
      {/* Кнопки навигации */}
      <div className="flex justify-between mt-4">
        <Button 
          variant="outline" 
          onClick={() => {
            const tabs = ['hook', 'explain', 'demo', 'quicktry', 'reflect'];
            const currentIndex = tabs.indexOf(activeTab);
            if (currentIndex > 0) {
              setActiveTab(tabs[currentIndex - 1]);
            }
          }}
          disabled={activeTab === 'hook'}
        >
          Назад
        </Button>
        
        <Button 
          variant="default" 
          onClick={() => {
            const tabs = ['hook', 'explain', 'demo', 'quicktry', 'reflect'];
            const currentIndex = tabs.indexOf(activeTab);
            if (currentIndex < tabs.length - 1) {
              setActiveTab(tabs[currentIndex + 1]);
            }
          }}
          disabled={activeTab === 'reflect'}
        >
          Вперед
        </Button>
      </div>
    </div>
  );
};

export default MicroLessonStructureNew;
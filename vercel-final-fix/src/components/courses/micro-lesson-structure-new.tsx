import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  HookTemplate,
  ExplainDemoTemplate,
  QuickTryReflectTemplate,
  InteractiveQuickTryTemplate,
  SimplifiedExplainDemo,
  SimplifiedQuickTryReflect
} from './lesson-templates';
import type { InteractiveElement } from './lesson-templates';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export interface LessonStructure {
  hook: {
    title: string;
    content: string;
    imageUrl?: string;
  };
  explain: {
    title: string;
    content: string;
  };
  demo: {
    title: string;
    content: string;
  };
  quickTry: {
    title: string;
    content?: string;
    type?: 'standard' | 'interactive';
    introduction?: string;
    interactiveElements?: InteractiveElement[];
  };
  reflect: {
    title: string;
    content: string;
  };
}

interface MicroLessonStructureProps {
  lessonId: number;
  moduleId: number;
  title: string;
  structure: LessonStructure;
  onComplete?: () => void;
}

/**
 * Новая реализация микроструктуры урока с поддержкой интерактивных элементов
 */
const MicroLessonStructure: React.FC<MicroLessonStructureProps> = ({
  lessonId,
  moduleId,
  title,
  structure,
  onComplete
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('hook');
  const [completedSections, setCompletedSections] = useState<Record<string, boolean>>({
    hook: false,
    explain: false,
    demo: false,
    quickTry: false,
    reflect: false
  });
  
  // Прогресс завершения урока (процент)
  const completionProgress = 
    (Object.values(completedSections).filter(Boolean).length / Object.keys(completedSections).length) * 100;
  
  // Загрузка прогресса урока из БД
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await apiRequest('GET', `/api/lessons/${lessonId}/structure-progress`);
        const data = await response.json();
        
        if (data && data.progress) {
          setCompletedSections(data.progress);
        }
      } catch (error) {
        console.error('Ошибка при загрузке прогресса микроструктуры:', error);
      }
    };
    
    fetchProgress();
  }, [lessonId]);
  
  // Сохранение прогресса при изменении завершенных секций
  useEffect(() => {
    const saveProgress = async () => {
      try {
        await apiRequest('POST', `/api/lessons/${lessonId}/structure-progress`, {
          progress: completedSections
        });
      } catch (error) {
        console.error('Ошибка при сохранении прогресса микроструктуры:', error);
      }
    };
    
    // Проверяем, есть ли хотя бы одна завершенная секция
    if (Object.values(completedSections).some(Boolean)) {
      saveProgress();
    }
  }, [completedSections, lessonId]);
  
  // Завершение секции
  const completeSection = (section: string) => {
    setCompletedSections(prevState => {
      const newState = {
        ...prevState,
        [section]: true
      };
      
      // Если все секции завершены, вызываем onComplete
      const allCompleted = Object.keys(completedSections).every(
        key => key === section ? true : newState[key]
      );
      
      if (allCompleted && onComplete) {
        onComplete();
        
        toast({
          title: "Урок завершен!",
          description: "Вы успешно прошли все секции урока.",
          variant: "default"
        });
      }
      
      return newState;
    });
  };
  
  // Переход к следующей секции
  const nextSection = () => {
    const sections = ['hook', 'explain', 'demo', 'quickTry', 'reflect'];
    const currentIndex = sections.indexOf(activeTab);
    
    if (currentIndex < sections.length - 1) {
      setActiveTab(sections[currentIndex + 1]);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-semibold">{title}</h2>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Прогресс урока</span>
            <span>{Math.round(completionProgress)}%</span>
          </div>
          <Progress value={completionProgress} className="h-2" />
        </div>
        
        <Tabs defaultValue="hook" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="hook" className="relative">
              Крючок
              {completedSections.hook && (
                <CheckCircle size={14} className="absolute -top-1 -right-1 text-green-400" />
              )}
            </TabsTrigger>
            <TabsTrigger value="explain" className="relative">
              Объяснение
              {completedSections.explain && (
                <CheckCircle size={14} className="absolute -top-1 -right-1 text-green-400" />
              )}
            </TabsTrigger>
            <TabsTrigger value="demo" className="relative">
              Демонстрация
              {completedSections.demo && (
                <CheckCircle size={14} className="absolute -top-1 -right-1 text-green-400" />
              )}
            </TabsTrigger>
            <TabsTrigger value="quickTry" className="relative">
              Практика
              {completedSections.quickTry && (
                <CheckCircle size={14} className="absolute -top-1 -right-1 text-green-400" />
              )}
            </TabsTrigger>
            <TabsTrigger value="reflect" className="relative">
              Рефлексия
              {completedSections.reflect && (
                <CheckCircle size={14} className="absolute -top-1 -right-1 text-green-400" />
              )}
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <TabsContent value="hook" className="space-y-4">
              <HookTemplate 
                title={structure.hook.title} 
                content={structure.hook.content}
                imageUrl={structure.hook.imageUrl}
              />
              
              <div className="flex justify-between pt-4">
                <Button 
                  variant="outline" 
                  disabled={completedSections.hook}
                  onClick={() => completeSection('hook')}
                >
                  <CheckCircle size={16} className="mr-2" />
                  Отметить прочитанным
                </Button>
                
                <Button onClick={nextSection}>
                  Далее
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="explain" className="space-y-4">
              <SimplifiedExplainDemo 
                title={structure.explain.title} 
                content={structure.explain.content}
                type="explain"
              />
              
              <div className="flex justify-between pt-4">
                <Button 
                  variant="outline" 
                  disabled={completedSections.explain}
                  onClick={() => completeSection('explain')}
                >
                  <CheckCircle size={16} className="mr-2" />
                  Отметить прочитанным
                </Button>
                
                <Button onClick={nextSection}>
                  Далее
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="demo" className="space-y-4">
              <SimplifiedExplainDemo 
                title={structure.demo.title} 
                content={structure.demo.content}
                type="demo"
              />
              
              <div className="flex justify-between pt-4">
                <Button 
                  variant="outline" 
                  disabled={completedSections.demo}
                  onClick={() => completeSection('demo')}
                >
                  <CheckCircle size={16} className="mr-2" />
                  Отметить прочитанным
                </Button>
                
                <Button onClick={nextSection}>
                  Далее
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="quickTry" className="space-y-4">
              {structure.quickTry.type === 'interactive' && structure.quickTry.interactiveElements ? (
                <InteractiveQuickTryTemplate 
                  title={structure.quickTry.title}
                  introduction={structure.quickTry.introduction || ''}
                  interactiveElements={structure.quickTry.interactiveElements}
                  onComplete={() => completeSection('quickTry')}
                />
              ) : (
                <SimplifiedQuickTryReflect 
                  title={structure.quickTry.title} 
                  content={structure.quickTry.content || ''}
                  type="quickTry"
                />
              )}
              
              {structure.quickTry.type !== 'interactive' && (
                <div className="flex justify-between pt-4">
                  <Button 
                    variant="outline" 
                    disabled={completedSections.quickTry}
                    onClick={() => completeSection('quickTry')}
                  >
                    <CheckCircle size={16} className="mr-2" />
                    Отметить выполненным
                  </Button>
                  
                  <Button onClick={nextSection}>
                    Далее
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="reflect" className="space-y-4">
              <SimplifiedQuickTryReflect 
                title={structure.reflect.title} 
                content={structure.reflect.content}
                type="reflect"
              />
              
              <div className="flex justify-between pt-4">
                <Button 
                  variant="outline" 
                  disabled={completedSections.reflect}
                  onClick={() => completeSection('reflect')}
                >
                  <CheckCircle size={16} className="mr-2" />
                  Отметить прочитанным
                </Button>
                
                {completionProgress === 100 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Button 
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 border-0"
                      onClick={onComplete}
                    >
                      <Sparkles size={16} className="mr-2" />
                      Завершить урок
                    </Button>
                  </motion.div>
                ) : null}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default MicroLessonStructure;
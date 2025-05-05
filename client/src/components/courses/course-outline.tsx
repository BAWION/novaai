import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ModuleAccordion } from "./module-accordion";
import { ChevronRight, Clock, CheckCircle } from "lucide-react";

interface Lesson {
  id: number;
  title: string;
  completed: boolean;
  type: string;
  duration: number;
}

interface Module {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  progress: number;
  lessons: Lesson[];
}

interface CourseOutlineProps {
  modules: Module[];
  onModuleSelect: (moduleId: number) => void;
  onLessonSelect: (lessonId: number) => void;
}

export function CourseOutline({
  modules,
  onModuleSelect,
  onLessonSelect,
}: CourseOutlineProps) {
  // Вычисляем общий прогресс курса
  const calculateCourseProgress = (): number => {
    if (modules.length === 0) return 0;
    
    const totalProgress = modules.reduce((sum, module) => sum + module.progress, 0);
    return Math.round(totalProgress / modules.length);
  };
  
  const totalProgress = calculateCourseProgress();
  const completedModules = modules.filter(m => m.completed).length;
  
  return (
    <div className="space-y-6">
      {/* Карточка с общим прогрессом курса */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <span>Общий прогресс курса</span>
            <Badge className="ml-auto" variant="outline">
              {completedModules} из {modules.length} модулей
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={totalProgress} className="h-2" />
            <div className="text-sm text-muted-foreground flex justify-between">
              <span>Общий прогресс: {totalProgress}%</span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {modules.reduce((sum, module) => sum + module.lessons.reduce((s, l) => s + l.duration, 0), 0)} мин
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Модули курса */}
      <ModuleAccordion 
        modules={modules} 
        onLessonSelect={onLessonSelect} 
      />
      
      {/* Рекомендуемый модуль для изучения */}
      {modules.length > 0 && modules[0].progress < 100 && !modules[0].completed && (
        <Card className="border-dashed border-primary/30 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Рекомендуемый модуль</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{modules[0].title}</h3>
                <p className="text-sm text-muted-foreground">{modules[0].description}</p>
              </div>
              <Badge variant="outline" className="ml-2">
                {modules[0].progress}% завершено
              </Badge>
            </div>
            <Progress value={modules[0].progress} className="h-1" />
            <Button 
              onClick={() => onModuleSelect(modules[0].id)}
              className="w-full"
            >
              Начать обучение <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
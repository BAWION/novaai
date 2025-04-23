import React from "react";
import { ModuleAccordion } from "./module-accordion";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Lesson {
  id: number;
  title: string;
  type: "video" | "text" | "quiz" | "interactive" | "practice";
  duration?: number;
  difficulty?: number;
  completed?: boolean;
  locked?: boolean;
}

interface Section {
  id: number;
  title: string;
  description?: string;
  lessons: Lesson[];
}

interface Module {
  id: number;
  title: string;
  description?: string;
  progress?: number;
  completed?: boolean;
  sections: Section[];
  estimatedDuration?: number;
}

interface Course {
  id: number;
  title: string;
  description: string;
  modules: Module[];
  progress?: number;
  estimatedDuration?: number;
  currentModuleId?: number;
  currentLessonId?: number;
}

interface CourseOutlineProps {
  course: Course;
  expandedModuleIds?: number[];
  onLessonClick?: (lessonId: number, moduleId: number) => void;
  onExpandToggle?: (moduleId: number, expanded: boolean) => void;
  className?: string;
}

export function CourseOutline({
  course,
  expandedModuleIds = [],
  onLessonClick,
  onExpandToggle,
  className,
}: CourseOutlineProps) {
  // Рассчитываем общий прогресс курса
  const calculateTotalProgress = () => {
    if (course.progress !== undefined) return course.progress;
    
    if (!course.modules.length) return 0;
    
    const totalProgress = course.modules.reduce((sum, module) => {
      return sum + (module.progress || 0);
    }, 0);
    
    return Math.round(totalProgress / course.modules.length);
  };

  // Рассчитываем общую продолжительность курса
  const calculateTotalDuration = () => {
    if (course.estimatedDuration !== undefined) return course.estimatedDuration;
    
    let total = 0;
    course.modules.forEach((module) => {
      if (module.estimatedDuration) {
        total += module.estimatedDuration;
      }
    });
    
    return total;
  };

  // Обработчик клика по уроку
  const handleLessonClick = (lessonId: number, moduleId: number) => {
    if (onLessonClick) {
      onLessonClick(lessonId, moduleId);
    }
  };

  // Проверка, есть ли текущий урок
  const hasCurrentLesson = course.currentLessonId !== undefined;

  return (
    <div className={className}>
      {/* Общая информация о курсе */}
      <div className="mb-6 bg-space-800/50 rounded-xl p-4 border border-white/10">
        <h2 className="text-xl font-semibold mb-2">Структура курса</h2>
        <p className="text-sm text-white/70 mb-4">{course.description}</p>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <i className="fas fa-book-open text-primary mr-2"></i>
            <span className="text-white/70">
              {course.modules.length} {course.modules.length === 1 ? "модуль" : 
              course.modules.length >= 2 && course.modules.length <= 4 ? "модуля" : "модулей"}
            </span>
          </div>
          
          <div className="flex items-center">
            <i className="fas fa-clock text-primary mr-2"></i>
            <span className="text-white/70">{calculateTotalDuration()} минут</span>
          </div>
          
          {calculateTotalProgress() > 0 && (
            <div className="flex items-center ml-auto">
              <div className="mr-2 text-white/70 text-sm">Общий прогресс:</div>
              <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${calculateTotalProgress()}%` }}
                  className={calculateTotalProgress() === 100 ? "h-full bg-green-500" : "h-full bg-primary"}
                />
              </div>
              <span className="ml-2 text-sm text-white/70">{calculateTotalProgress()}%</span>
            </div>
          )}
        </div>

        {hasCurrentLesson && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center">
              <i className="fas fa-bookmark text-primary mr-2"></i>
              <span className="text-white/70">Ваш текущий прогресс:</span>
            </div>
            <div className="mt-2 p-3 bg-primary/10 rounded-lg border border-primary/20 flex items-center">
              <i className="fas fa-play-circle text-primary mr-3 text-xl"></i>
              <div>
                <div className="text-sm text-white/50">
                  Продолжить с:
                </div>
                <div className="font-medium">
                  {course.modules.find(m => m.id === course.currentModuleId)?.title || ""}:
                  {" "}
                  {(() => {
                    // Находим текущий урок
                    let lessonTitle = "";
                    course.modules.forEach(module => {
                      if (module.id === course.currentModuleId) {
                        module.sections.forEach(section => {
                          const lesson = section.lessons.find(l => l.id === course.currentLessonId);
                          if (lesson) {
                            lessonTitle = lesson.title;
                          }
                        });
                      }
                    });
                    return lessonTitle;
                  })()}
                </div>
              </div>
              <button 
                className="ml-auto px-3 py-1.5 bg-primary hover:bg-primary/80 rounded-lg transition"
                onClick={() => {
                  if (course.currentLessonId && course.currentModuleId && onLessonClick) {
                    onLessonClick(course.currentLessonId, course.currentModuleId);
                  }
                }}
              >
                Продолжить
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Модули курса */}
      <div className="space-y-4">
        {course.modules.map((module) => (
          <ModuleAccordion
            key={module.id}
            module={module}
            currentLessonId={course.currentLessonId}
            expanded={expandedModuleIds.includes(module.id)}
            onLessonClick={(lessonId) => handleLessonClick(lessonId, module.id)}
            onExpandToggle={onExpandToggle}
          />
        ))}
      </div>
    </div>
  );
}
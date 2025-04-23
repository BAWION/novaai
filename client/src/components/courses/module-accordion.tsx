import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

interface ModuleAccordionProps {
  module: Module;
  currentLessonId?: number;
  expanded?: boolean;
  onLessonClick?: (lessonId: number) => void;
  onExpandToggle?: (moduleId: number, expanded: boolean) => void;
}

export function ModuleAccordion({
  module,
  currentLessonId,
  expanded = false,
  onLessonClick,
  onExpandToggle,
}: ModuleAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(expanded);

  // Синхронизация с внешним состоянием развернутости
  useEffect(() => {
    setIsExpanded(expanded);
  }, [expanded]);

  // Обработчик нажатия на аккордеон
  const handleToggle = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    if (onExpandToggle) {
      onExpandToggle(module.id, newExpandedState);
    }
  };

  // Обработчик клика по уроку
  const handleLessonClick = (lesson: Lesson) => {
    if (lesson.locked) return;
    
    if (onLessonClick) {
      onLessonClick(lesson.id);
    }
  };

  // Расчет общего количества уроков
  const totalLessons = module.sections.reduce(
    (sum, section) => sum + section.lessons.length,
    0
  );

  // Расчет общего времени на модуль
  const calculateTotalDuration = () => {
    if (module.estimatedDuration !== undefined) return module.estimatedDuration;
    
    let total = 0;
    module.sections.forEach((section) => {
      section.lessons.forEach((lesson) => {
        if (lesson.duration) {
          total += lesson.duration;
        }
      });
    });
    
    return total;
  };

  // Расчет адаптивного ETA (оставшееся время)
  const calculateRemainingTime = () => {
    if (!module.progress || module.progress >= 100) return 0;
    
    const totalDuration = calculateTotalDuration();
    const remainingPercentage = (100 - (module.progress || 0)) / 100;
    return Math.round(totalDuration * remainingPercentage);
  };

  // Иконка для типа урока
  const getLessonTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return "fas fa-video";
      case "text":
        return "fas fa-file-alt";
      case "quiz":
        return "fas fa-question-circle";
      case "interactive":
        return "fas fa-laptop-code";
      case "practice":
        return "fas fa-flask";
      default:
        return "fas fa-file";
    }
  };

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden bg-space-800/50">
      {/* Заголовок модуля */}
      <div
        className={cn(
          "p-4 flex justify-between items-center cursor-pointer hover:bg-space-700/50 transition",
          isExpanded ? "border-b border-white/10" : ""
        )}
        onClick={handleToggle}
      >
        <div className="flex items-center">
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center mr-3",
              module.completed
                ? "bg-green-500/20 text-green-400"
                : "bg-primary/20 text-primary"
            )}
          >
            {module.completed ? (
              <i className="fas fa-check"></i>
            ) : (
              <i className="fas fa-book"></i>
            )}
          </div>
          <div>
            <h3 className="font-medium">{module.title}</h3>
            <div className="text-xs text-white/60 flex space-x-3 mt-0.5">
              <span>
                <i className="fas fa-graduation-cap mr-1"></i>
                {totalLessons} {totalLessons === 1 ? "урок" : 
                  totalLessons >= 2 && totalLessons <= 4 ? "урока" : "уроков"}
              </span>
              <span>
                <i className="fas fa-clock mr-1"></i>
                {calculateTotalDuration()} мин
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          {/* Прогресс модуля */}
          {module.progress !== undefined && module.progress > 0 && (
            <div className="mr-4">
              <div className="flex items-center space-x-2">
                <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${module.progress}%` }}
                    transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
                    className={cn(
                      "h-full rounded-full",
                      module.progress === 100 ? "bg-green-500" : "bg-primary"
                    )}
                  />
                </div>
                <span className="text-xs text-white/60">{module.progress}%</span>
              </div>
              
              {/* Адаптивное ETA */}
              {module.progress < 100 && calculateRemainingTime() > 0 && (
                <div className="text-xs text-white/50 mt-0.5">
                  Осталось ~{calculateRemainingTime()} мин
                </div>
              )}
            </div>
          )}
          
          <i
            className={`fas fa-chevron-down text-white/60 transition-transform transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Содержимое модуля */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {module.description && (
              <div className="px-4 py-3 text-sm text-white/70 border-b border-white/10 bg-space-900/30">
                {module.description}
              </div>
            )}
            
            <div className="p-2">
              {module.sections.map((section) => (
                <div key={section.id} className="mb-3">
                  {/* Заголовок секции */}
                  {section.title && (
                    <div className="px-3 py-2 text-primary text-sm font-medium">
                      {section.title}
                    </div>
                  )}

                  {/* Уроки в секции */}
                  <div className="space-y-1">
                    {section.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        onClick={() => handleLessonClick(lesson)}
                        className={cn(
                          "px-3 py-2 rounded-lg flex items-center transition",
                          lesson.locked
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer hover:bg-space-700/80",
                          currentLessonId === lesson.id
                            ? "bg-primary/20 border-l-2 border-primary"
                            : "",
                          lesson.completed
                            ? "bg-green-500/10 border-l-2 border-green-400"
                            : ""
                        )}
                      >
                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center mr-3 text-sm",
                            lesson.completed
                              ? "bg-green-500/20 text-green-400"
                              : currentLessonId === lesson.id
                              ? "bg-primary/20 text-primary"
                              : "bg-space-700 text-white/70"
                          )}
                        >
                          {lesson.completed ? (
                            <i className="fas fa-check"></i>
                          ) : (
                            <i className={getLessonTypeIcon(lesson.type)}></i>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span
                              className={cn(
                                currentLessonId === lesson.id
                                  ? "font-medium text-primary"
                                  : lesson.completed
                                  ? "text-green-400"
                                  : ""
                              )}
                            >
                              {lesson.title}
                            </span>
                            {lesson.duration && (
                              <span className="text-xs text-white/50 ml-2">
                                {lesson.duration} мин
                              </span>
                            )}
                          </div>
                          {lesson.difficulty && (
                            <div className="flex items-center mt-1">
                              {[...Array(5)].map((_, i) => (
                                <i
                                  key={i}
                                  className={`text-xs fas fa-star ${
                                    i < lesson.difficulty!
                                      ? "text-amber-400"
                                      : "text-white/20"
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                        {lesson.locked && (
                          <i className="fas fa-lock text-white/40 ml-2"></i>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
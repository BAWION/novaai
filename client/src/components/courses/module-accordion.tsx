import React from "react";
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
  className?: string;
}

export function ModuleAccordion({
  module,
  currentLessonId,
  expanded: initialExpanded = false,
  onLessonClick,
  onExpandToggle,
  className,
}: ModuleAccordionProps) {
  const [expanded, setExpanded] = React.useState(initialExpanded);

  React.useEffect(() => {
    setExpanded(initialExpanded);
  }, [initialExpanded]);

  const toggleExpanded = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    if (onExpandToggle) {
      onExpandToggle(module.id, newExpanded);
    }
  };

  // Иконки для разных типов уроков
  const lessonTypeIcons = {
    video: "video",
    text: "file-alt",
    quiz: "question",
    interactive: "laptop-code",
    practice: "code",
  };

  // Расчет общего времени для модуля (если не предоставлено)
  const calculateTotalDuration = () => {
    if (module.estimatedDuration) return module.estimatedDuration;

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

  // Отображение значков сложности
  const renderDifficulty = (difficulty: number = 1) => {
    return (
      <div className="flex">
        {[...Array(difficulty)].map((_, i) => (
          <i key={i} className="fas fa-circle text-xs text-primary mr-0.5" />
        ))}
      </div>
    );
  };

  return (
    <div className={cn("border border-white/10 rounded-xl overflow-hidden", className)}>
      {/* Заголовок модуля */}
      <div
        className={cn(
          "flex items-center justify-between p-4 cursor-pointer transition",
          expanded ? "bg-space-800" : "bg-space-900",
          module.completed ? "border-l-4 border-l-green-500" : ""
        )}
        onClick={toggleExpanded}
      >
        <div className="flex items-center">
          <motion.div
            animate={{ rotate: expanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <i className="fas fa-chevron-right text-white/70 mr-3" />
          </motion.div>
          <div>
            <h3 className="font-medium">{module.title}</h3>
            {module.description && (
              <p className="text-sm text-white/60">{module.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {module.progress !== undefined && module.progress > 0 && (
            <div className="flex items-center">
              <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full",
                    module.completed ? "bg-green-500" : "bg-primary"
                  )}
                  style={{ width: `${module.progress}%` }}
                />
              </div>
              <span className="text-xs text-white/60 ml-2">{module.progress}%</span>
            </div>
          )}
          <div className="text-xs text-white/60">
            <i className="fas fa-clock mr-1" />
            {calculateTotalDuration()} мин
          </div>
        </div>
      </div>

      {/* Содержимое модуля */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {module.sections.map((section) => (
              <div key={section.id} className="border-t border-white/10">
                {/* Заголовок секции */}
                {(section.title || section.description) && (
                  <div className="px-4 py-3 bg-space-800/50">
                    {section.title && <h4 className="font-medium">{section.title}</h4>}
                    {section.description && (
                      <p className="text-sm text-white/60">{section.description}</p>
                    )}
                  </div>
                )}

                {/* Уроки в секции */}
                <div className="divide-y divide-white/5">
                  {section.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className={cn(
                        "px-4 py-3 flex items-center justify-between",
                        currentLessonId === lesson.id
                          ? "bg-primary/10 border-l-4 border-l-primary"
                          : "hover:bg-space-800",
                        lesson.locked ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
                        lesson.completed ? "border-l-4 border-l-green-500" : ""
                      )}
                      onClick={() => {
                        if (!lesson.locked && onLessonClick) {
                          onLessonClick(lesson.id);
                        }
                      }}
                    >
                      <div className="flex items-center">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center mr-3",
                            lesson.completed
                              ? "bg-green-500/20 text-green-400"
                              : "bg-space-700 text-white/70"
                          )}
                        >
                          {lesson.completed ? (
                            <i className="fas fa-check" />
                          ) : (
                            <i className={`fas fa-${lessonTypeIcons[lesson.type]}`} />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <span className={lesson.locked ? "text-white/50" : ""}>
                              {lesson.title}
                            </span>
                            {lesson.locked && (
                              <i className="fas fa-lock text-white/50 ml-2 text-xs" />
                            )}
                          </div>
                          {lesson.difficulty && (
                            <div className="mt-1">{renderDifficulty(lesson.difficulty)}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center">
                        {lesson.duration && (
                          <span className="text-xs text-white/60">
                            <i className="fas fa-clock mr-1" />
                            {lesson.duration} мин
                          </span>
                        )}
                        <div
                          className={cn(
                            "ml-3 w-6 h-6 rounded flex items-center justify-center",
                            lesson.type === "video"
                              ? "bg-blue-500/20 text-blue-400"
                              : lesson.type === "quiz"
                              ? "bg-amber-500/20 text-amber-400"
                              : lesson.type === "interactive" || lesson.type === "practice"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-white/10 text-white/70"
                          )}
                        >
                          <i className={`fas fa-${lessonTypeIcons[lesson.type]} text-xs`} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
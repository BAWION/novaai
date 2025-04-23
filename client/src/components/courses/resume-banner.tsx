import React from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface LastViewedCourse {
  id: number;
  slug: string;
  title: string;
  icon: string;
  progress: number;
  currentModuleTitle: string;
  currentLessonTitle: string;
  updatedAt: Date; // Время последнего просмотра
}

interface ResumeBannerProps {
  course: LastViewedCourse;
  onClose?: () => void;
  className?: string;
}

export function ResumeBanner({ course, onClose, className }: ResumeBannerProps) {
  const [, setLocation] = useLocation();

  // Расчет времени, прошедшего с последнего просмотра
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInMinutes < 1) return "только что";
    if (diffInMinutes < 60) return `${diffInMinutes} мин назад`;
    if (diffInHours < 24) return `${diffInHours} ч назад`;
    return `${diffInDays} дн назад`;
  };

  // Обработчик продолжения курса
  const handleResume = () => {
    setLocation(`/courses/${course.slug}`);
  };

  // Обработчик закрытия баннера
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        "relative bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/20 rounded-xl p-4 mb-6",
        className
      )}
    >
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 text-white/60 hover:text-white transition"
      >
        <i className="fas fa-times"></i>
      </button>
      
      <div className="flex items-center">
        <div className="bg-primary/20 text-primary rounded-xl p-3 mr-4">
          <i className={`fas fa-${course.icon} text-2xl`}></i>
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-semibold">{course.title}</h3>
            <span className="text-xs text-white/50">{getTimeAgo(course.updatedAt)}</span>
          </div>
          
          <p className="text-sm text-white/70 mb-2">
            Продолжить с: <span className="text-primary">{course.currentModuleTitle}: {course.currentLessonTitle}</span>
          </p>
          
          <div className="flex justify-between items-center">
            <div className="flex-1 mr-4">
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${course.progress}%` }}
                  transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
                  className={cn(
                    "h-full rounded-full",
                    course.progress === 100 ? "bg-green-500" : "bg-primary"
                  )}
                />
              </div>
              <div className="text-xs text-white/60 mt-1">
                {course.progress}% завершено
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleResume}
              className="bg-primary hover:bg-primary/80 text-white rounded-lg px-4 py-2 transition"
            >
              Продолжить <i className="fas fa-play ml-1"></i>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
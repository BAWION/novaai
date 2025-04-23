import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { cn } from "@/lib/utils";
import { useOnClickOutside } from "@/hooks/use-on-click-outside.tsx";

interface CourseCardProps {
  id: number;
  slug: string;
  title: string;
  description: string;
  icon: string;
  modules: number;
  level: string;
  color: string;
  difficulty?: number;
  access?: string;
  estimatedDuration?: number;
  progress?: number;
  className?: string;
  variant?: "default" | "compact" | "featured";
  onClick?: () => void;
}

export function CourseCard({
  id,
  slug,
  title,
  description,
  icon,
  modules,
  level,
  color,
  difficulty = 1,
  access = "free",
  estimatedDuration,
  progress = 0,
  className,
  variant = "default",
  onClick,
}: CourseCardProps) {
  const [, setLocation] = useLocation();
  const [showQuickView, setShowQuickView] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Закрываем Quick View при клике вне карточки
  useOnClickOutside(cardRef, () => setShowQuickView(false));

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setLocation(`/courses/${slug}`);
    }
  };
  
  // Управление отображением Quick View
  const handleMouseEnter = () => {
    // Задержка перед показом для избежания мерцания при случайном наведении
    const timer = setTimeout(() => {
      setShowQuickView(true);
    }, 500);
    
    return () => clearTimeout(timer);
  };
  
  const handleMouseLeave = () => {
    // Задержка перед скрытием, чтобы пользователь мог навести на Quick View
    const timer = setTimeout(() => {
      setShowQuickView(false);
    }, 300);
    
    return () => clearTimeout(timer);
  };

  // Визуальные настройки для разных цветов
  const colorStyles = {
    primary: {
      gradient: "from-primary/20 to-primary/5",
      border: "border-primary/20",
      icon: "bg-primary/20 text-primary",
      hover: "hover:border-primary/50",
    },
    secondary: {
      gradient: "from-secondary/20 to-secondary/5",
      border: "border-secondary/20",
      icon: "bg-secondary/20 text-secondary",
      hover: "hover:border-secondary/50",
    },
    accent: {
      gradient: "from-accent/20 to-accent/5",
      border: "border-accent/20",
      icon: "bg-accent/20 text-accent",
      hover: "hover:border-accent/50",
    },
  };

  const styles = colorStyles[color as keyof typeof colorStyles] || colorStyles.primary;

  // Визуальное отображение для разных уровней
  const levelDisplay = {
    basic: { text: "Начальный", bgColor: "bg-green-500/20 text-green-400" },
    intermediate: { text: "Средний", bgColor: "bg-blue-500/20 text-blue-400" },
    advanced: { text: "Продвинутый", bgColor: "bg-purple-500/20 text-purple-400" },
    expert: { text: "Экспертный", bgColor: "bg-red-500/20 text-red-400" },
  };

  const levelInfo = levelDisplay[level as keyof typeof levelDisplay] || levelDisplay.basic;

  // Визуальное отображение для разных типов доступа
  const accessDisplay = {
    free: { text: "Бесплатно", bgColor: "bg-green-500/20 text-green-400" },
    pro: { text: "PRO", bgColor: "bg-amber-500/20 text-amber-400" },
    premium: { text: "Премиум", bgColor: "bg-purple-500/20 text-purple-400" },
  };

  const accessInfo = accessDisplay[access as keyof typeof accessDisplay] || accessDisplay.free;

  // Отображение сложности курса в виде звездочек
  const renderDifficultyStars = () => {
    return (
      <div className="flex items-center" title={`Сложность: ${difficulty} из 5`}>
        {[...Array(5)].map((_, i) => (
          <i
            key={i}
            className={`fas fa-star text-xs ${
              i < difficulty ? "text-amber-400" : "text-white/20"
            }`}
          />
        ))}
      </div>
    );
  };

  // Отображение прогресса курса
  const renderProgress = () => {
    if (progress === 0) return null;

    return (
      <>
        <div className="w-full bg-white/10 h-1.5 rounded-full mt-1 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={cn(
              "h-full rounded-full",
              progress === 100 ? "bg-green-500" : "bg-primary"
            )}
          />
        </div>
        <div className="text-xs text-white/60 mt-1">
          {progress === 100 ? "Завершен" : `Прогресс ${progress}%`}
        </div>
      </>
    );
  };

  // Компактный вариант карточки
  if (variant === "compact") {
    return (
      <motion.div
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "flex space-x-3 p-3 border rounded-xl cursor-pointer",
          styles.border,
          styles.hover,
          "bg-gradient-to-br",
          styles.gradient,
          className
        )}
        onClick={handleClick}
      >
        <div className={cn("rounded-lg p-2", styles.icon)}>
          <i className={`fas fa-${icon} text-lg`}></i>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{title}</h3>
          {renderProgress()}
        </div>
      </motion.div>
    );
  }

  // Расширенный вариант карточки
  if (variant === "featured") {
    return (
      <motion.div
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "flex flex-col p-5 border rounded-xl cursor-pointer",
          styles.border,
          styles.hover,
          "bg-gradient-to-br",
          styles.gradient,
          className
        )}
        onClick={handleClick}
      >
        <div className="flex justify-between items-start mb-3">
          <div className={cn("rounded-xl p-3", styles.icon)}>
            <i className={`fas fa-${icon} text-2xl`}></i>
          </div>
          <div className="flex flex-col items-end">
            <span className={cn("px-2 py-0.5 rounded text-xs font-medium", levelInfo.bgColor)}>
              {levelInfo.text}
            </span>
            <span className={cn("px-2 py-0.5 rounded text-xs font-medium mt-1", accessInfo.bgColor)}>
              {accessInfo.text}
            </span>
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-white/70 mb-4 flex-1">{description}</p>
        <div className="flex justify-between items-center">
          <div className="text-sm text-white/60">
            <i className="fas fa-book-open mr-1"></i> {modules} модулей
            {estimatedDuration && (
              <span className="ml-2">
                <i className="fas fa-clock mr-1"></i> {estimatedDuration} мин
              </span>
            )}
          </div>
          {renderDifficultyStars()}
        </div>
        {renderProgress()}
      </motion.div>
    );
  }

  // Стандартный вариант карточки (по умолчанию)
  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "flex flex-col p-0 border rounded-xl cursor-pointer",
        styles.border,
        styles.hover,
        "bg-gradient-to-br",
        styles.gradient,
        className
      )}
      onClick={handleClick}
    >
      {/* Верхняя часть карточки с основной информацией */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className={cn("rounded-lg p-2", styles.icon)}>
            <i className={`fas fa-${icon} text-lg`}></i>
          </div>
          <div className="flex space-x-1">
            <span className={cn("px-2 py-0.5 rounded text-xs font-medium", levelInfo.bgColor)}>
              {levelInfo.text}
            </span>
            {access !== "free" && (
              <span className={cn("px-2 py-0.5 rounded text-xs font-medium", accessInfo.bgColor)}>
                {accessInfo.text}
              </span>
            )}
          </div>
        </div>
        <h3 className="font-semibold mt-3">{title}</h3>
      </div>

      {/* Нижняя часть карточки с подробной информацией */}
      <div className="p-4 border-t border-white/10 bg-space-900/30 rounded-b-xl">
        <p className="text-white/70 text-sm mb-3">{description}</p>
        
        <div className="space-y-2 mb-3">
          <div className="text-xs font-medium text-white/80">Что вы изучите:</div>
          <div className="text-xs text-white/60">
            <div className="flex items-start space-x-1.5">
              <i className="fas fa-check-circle text-green-400 mt-0.5"></i>
              <span>Фундаментальные концепции и принципы</span>
            </div>
            <div className="flex items-start space-x-1.5">
              <i className="fas fa-check-circle text-green-400 mt-0.5"></i>
              <span>Практические навыки работы</span>
            </div>
            <div className="flex items-start space-x-1.5">
              <i className="fas fa-check-circle text-green-400 mt-0.5"></i>
              <span>Современные подходы и технологии</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="text-xs text-white/60">
              <i className="fas fa-book-open mr-1"></i> {modules} модулей
            </div>
            {estimatedDuration && (
              <div className="text-xs text-white/60">
                <i className="fas fa-clock mr-1"></i> {estimatedDuration} мин
              </div>
            )}
          </div>
          {renderDifficultyStars()}
        </div>
        
        {renderProgress()}
        
        <button 
          className="w-full py-2 mt-3 bg-primary hover:bg-primary/80 rounded-lg transition text-sm font-medium"
        >
          {progress > 0 ? "Продолжить курс" : "Начать обучение"}
        </button>
      </div>
    </motion.div>
  );
}
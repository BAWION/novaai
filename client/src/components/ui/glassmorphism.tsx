import React from "react";
import { cn } from "@/lib/utils";

interface GlassmorphismProps {
  children: React.ReactNode;
  className?: string;
  intensity?: "low" | "medium" | "high";
  borderGradient?: boolean;
}

/**
 * Компонент для создания эффекта стеклянной панели
 */
export function Glassmorphism({
  children,
  className,
  intensity = "medium",
  borderGradient = false,
}: GlassmorphismProps) {
  // Задаем различные уровни интенсивности стеклянного эффекта
  const intensityStyles = {
    low: "bg-black/30 backdrop-blur-sm border-white/5",
    medium: "bg-black/40 backdrop-blur-md border-white/10",
    high: "bg-black/50 backdrop-blur-lg border-white/20",
  };

  // Стили для градиентной границы
  const borderGradientClass = borderGradient 
    ? "border-0 relative before:absolute before:inset-0 before:-z-10 before:p-[1px] before:rounded-[inherit] before:bg-gradient-to-r before:from-[#6E3AFF] before:to-[#2EBAE1]" 
    : "border";

  return (
    <div
      className={cn(
        borderGradientClass,
        "shadow-xl",
        intensityStyles[intensity],
        className
      )}
    >
      {children}
    </div>
  );
}
import React from "react";
import { cn } from "@/lib/utils";

interface GlassmorphismProps {
  children: React.ReactNode;
  className?: string;
  borderGradient?: boolean;
  onClick?: () => void; // Добавляем поддержку обработчика клика
}

export const Glassmorphism = ({
  children,
  className,
  borderGradient = false,
  onClick,
}: GlassmorphismProps) => {
  return (
    <div
      className={cn(
        "relative bg-space-800/30 backdrop-blur-md",
        borderGradient 
          ? "before:absolute before:inset-0 before:rounded-[inherit] before:p-[1px] before:bg-gradient-to-r before:from-[#6E3AFF]/40 before:to-[#2EBAE1]/40 before:-z-10"
          : "border border-white/10", 
        onClick ? "cursor-pointer" : "", // Добавляем курсор, если есть обработчик клика
        className
      )}
      onClick={onClick} // Передаем обработчик клика
    >
      {children}
    </div>
  );
};
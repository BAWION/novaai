import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Glassmorphism } from "@/components/ui/glassmorphism";

interface OptionButtonProps {
  text: string;
  icon?: string;
  value: string;
  isSelected?: boolean;
  onClick: (value: string) => void;
  variant?: "default" | "compact";
  className?: string;
}

export function OptionButton({
  text,
  icon,
  value,
  isSelected = false,
  onClick,
  variant = "default",
  className,
}: OptionButtonProps) {
  const handleClick = () => {
    onClick(value);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className={cn(
        variant === "default" ? "p-4 rounded-xl text-left" : "py-2 px-4 rounded-xl",
        "hover:border-[#6E3AFF] border transition-all duration-300",
        isSelected ? "border-[#6E3AFF]" : "border-transparent",
        className
      )}
    >
      <Glassmorphism className={cn(
        variant === "default" ? "p-4 rounded-xl" : "py-2 px-4 rounded-xl",
        "w-full"
      )}>
        {icon ? (
          <div className="flex items-center">
            <i className={`fas fa-${icon} text-[#8BE0F7] mr-3`}></i>
            <span>{text}</span>
          </div>
        ) : (
          <span>{text}</span>
        )}
      </Glassmorphism>
    </motion.button>
  );
}

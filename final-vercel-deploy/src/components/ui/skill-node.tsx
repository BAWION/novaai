import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkillNodeProps {
  id: string;
  name: string;
  icon: string;
  size: "xs" | "sm" | "md" | "lg";
  color: "primary" | "secondary" | "accent";
  intensity: number;
  style?: React.CSSProperties;
  onClick?: () => void;
  className?: string;
  highlighted?: boolean;
}

export function SkillNode({
  id,
  name,
  icon,
  size,
  color,
  intensity,
  style,
  onClick,
  className,
  highlighted = false,
}: SkillNodeProps) {
  // Size variations
  const sizeClasses = {
    xs: "w-12 h-12",
    sm: "w-14 h-14",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  };

  // Font size variations based on node size
  const fontSizeClasses = {
    xs: "text-sm",
    sm: "text-lg",
    md: "text-lg",
    lg: "text-xl",
  };

  // Text size variations based on node size
  const textSizeClasses = {
    xs: "text-[10px]",
    sm: "text-xs",
    md: "text-xs",
    lg: "text-xs",
  };

  // Color variations
  const colorGradients = {
    primary: `from-[#6E3AFF]/${intensity * 0.01} to-[#4922B2]/${intensity * 0.01}`,
    secondary: `from-[#2EBAE1]/${intensity * 0.01} to-[#1682A1]/${intensity * 0.01}`,
    accent: `from-[#FF3A8C]/${intensity * 0.01} to-[#CC2E6F]/${intensity * 0.01}`,
  };

  // Glow effects based on color and if highlighted
  const glowClasses = {
    primary: highlighted ? "shadow-[0_0_15px_rgba(110,58,255,0.5)]" : "",
    secondary: highlighted ? "shadow-[0_0_15px_rgba(46,186,225,0.5)]" : "",
    accent: highlighted ? "shadow-[0_0_15px_rgba(255,58,140,0.5)]" : "",
  };

  return (
    <motion.div
      className={cn(
        "absolute bg-gradient-to-br rounded-full flex items-center justify-center text-center cursor-pointer transition-all duration-300",
        sizeClasses[size],
        colorGradients[color],
        glowClasses[color],
        "hover:filter hover:brightness-110 hover:scale-105",
        className
      )}
      style={style}
      data-skill={id}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
    >
      <div>
        <i className={cn(icon, fontSizeClasses[size], "mb-1")}></i>
        <div className={textSizeClasses[size]}>{name}</div>
      </div>
    </motion.div>
  );
}

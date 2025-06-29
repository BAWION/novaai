import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Glassmorphism } from "./glassmorphism";

interface OrbitalItemProps {
  title: string;
  description: string;
  icon: string;
  modules?: number;
  level: string;
  color: "primary" | "secondary" | "accent";
  className?: string;
  style?: React.CSSProperties;
  highlighted?: boolean;
  onClick?: () => void;
}

export function OrbitalItem({
  title,
  description,
  icon,
  modules,
  level,
  color,
  className,
  style,
  highlighted = false,
  onClick,
}: OrbitalItemProps) {
  // Color variations based on the color prop
  const colorClasses = {
    icon: {
      primary: "bg-gradient-to-br from-[#6E3AFF]/50 to-[#6E3AFF]/10 text-[#B28DFF]",
      secondary: "bg-gradient-to-br from-[#2EBAE1]/50 to-[#2EBAE1]/10 text-[#8BE0F7]",
      accent: "bg-gradient-to-br from-[#FF3A8C]/50 to-[#FF3A8C]/10 text-[#FF3A8C]",
    },
    badge: {
      primary: "bg-[#6E3AFF]/20 text-[#B28DFF]",
      secondary: "bg-[#2EBAE1]/20 text-[#8BE0F7]",
      accent: "bg-[#FF3A8C]/20 text-[#FF3A8C]",
      default: "bg-space-700 text-white/60",
    },
    glow: {
      primary: highlighted ? "shadow-[0_0_15px_rgba(110,58,255,0.5)]" : "",
      secondary: highlighted ? "shadow-[0_0_15px_rgba(46,186,225,0.5)]" : "",
      accent: highlighted ? "shadow-[0_0_15px_rgba(255,58,140,0.5)]" : "",
    },
    border: {
      primary: highlighted ? "border-[#6E3AFF]/30" : "border-white/10",
      secondary: highlighted ? "border-[#2EBAE1]/30" : "border-white/10",
      accent: highlighted ? "border-[#FF3A8C]/30" : "border-white/10",
    }
  };

  // Level label mapping
  const levelLabel = {
    'basic': 'Основы',
    'practice': 'Практика',
    'in-progress': 'В процессе',
    'upcoming': 'Скоро',
  }[level] || 'Скоро';

  return (
    <motion.div
      className={cn(
        "absolute w-56",
        className
      )}
      style={style}
      whileHover={{ y: -5, scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <Glassmorphism
        className={cn(
          "rounded-xl p-5",
          colorClasses.glow[color],
          colorClasses.border[color],
          "transition-all duration-300 cursor-pointer",
          className
        )}
        onClick={onClick}
      >
        <div className="flex items-center mb-3">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center mr-3",
            colorClasses.icon[color]
          )}>
            <i className={`fas fa-${icon} text-xl`}></i>
          </div>
          <h3 className="font-space font-medium">{title}</h3>
        </div>
        <p className="text-white/60 text-sm mb-3">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/60">
            {modules !== undefined ? `${modules} модулей` : ""}
          </span>
          <span 
            className={cn(
              "text-xs px-2 py-1 rounded",
              level === 'upcoming' ? colorClasses.badge.default : colorClasses.badge[color]
            )}
          >
            {levelLabel}
          </span>
        </div>
      </Glassmorphism>
    </motion.div>
  );
}

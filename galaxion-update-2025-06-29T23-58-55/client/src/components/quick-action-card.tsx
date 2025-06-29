import React from "react";
import { motion } from "framer-motion";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { cn } from "@/lib/utils";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: string;
  color: "primary" | "secondary" | "accent";
  onClick?: () => void;
}

export function QuickActionCard({
  title,
  description,
  icon,
  color,
  onClick,
}: QuickActionCardProps) {
  // Color variations based on the color prop
  const colorClasses = {
    iconBg: {
      primary: "from-[#6E3AFF]/50 to-[#6E3AFF]/10",
      secondary: "from-[#2EBAE1]/50 to-[#2EBAE1]/10",
      accent: "from-[#FF3A8C]/50 to-[#FF3A8C]/10",
    },
    iconText: {
      primary: "text-[#B28DFF]",
      secondary: "text-[#8BE0F7]",
      accent: "text-[#FF3A8C]",
    },
    hoverBorder: {
      primary: "hover:border-[#6E3AFF]/30",
      secondary: "hover:border-[#2EBAE1]/30",
      accent: "hover:border-[#FF3A8C]/30",
    },
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Glassmorphism
        className={cn(
          "rounded-xl p-5 border border-white/10",
          colorClasses.hoverBorder[color],
          "transition-all duration-300 cursor-pointer"
        )}
        onClick={onClick}
      >
        <div className="flex items-center mb-3">
          <div
            className={cn(
              "w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center mr-3",
              colorClasses.iconBg[color],
              colorClasses.iconText[color]
            )}
          >
            <i className={`fas fa-${icon}`}></i>
          </div>
          <h3 className="font-space font-medium">{title}</h3>
        </div>
        <p className="text-white/60 text-sm">{description}</p>
      </Glassmorphism>
    </motion.div>
  );
}

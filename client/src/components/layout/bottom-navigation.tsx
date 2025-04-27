import React from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

const navItems = [
  { icon: "📊", label: "Главная", to: "/dashboard" },
  { icon: "📚", label: "Курсы", to: "/courses" },
  { icon: "💾", label: "Знания", to: "/knowledge-vault" },
  { icon: "🧪", label: "Практика", to: "/labhub" },
  { icon: "👨‍🚀", label: "Профиль", to: "/profile" },
];

export function BottomNavigation() {
  const isMobile = useIsMobile();
  const [location, setLocation] = useLocation();

  if (!isMobile) {
    return null;
  }

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 bg-space-800/95 backdrop-blur-md border-t border-white/10"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location === item.to;
          
          return (
            <motion.button
              key={item.to}
              className="flex flex-col items-center justify-center h-full w-full"
              onClick={() => setLocation(item.to)}
              whileTap={{ scale: 0.9 }}
            >
              <div
                className={`flex flex-col items-center justify-center transition-colors duration-200 ${
                  isActive ? "text-white" : "text-white/50"
                }`}
              >
                <div 
                  className={`w-10 h-10 flex items-center justify-center rounded-lg mb-1 ${
                    isActive
                      ? "bg-gradient-to-br from-[#6E3AFF] to-[#2EBAE1] text-white"
                      : "text-white/60"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                </div>
                <span className="text-xs">{item.label}</span>
              </div>
              
              {isActive && (
                <motion.div
                  className="absolute top-0 h-1 w-10 bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] rounded-b-md"
                  layoutId="bottomNavIndicator"
                  transition={{ type: "spring", stiffness: 400, damping: 40 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
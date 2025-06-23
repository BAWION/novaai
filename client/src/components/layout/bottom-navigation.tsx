import React, { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

const mainNavItems = [
  { icon: "fa-tachometer-alt", label: "Главная", to: "/dashboard" },
  { icon: "fa-book", label: "Курсы", to: "/courses" },
  { icon: "fa-robot", label: "ИИ-Тьютор", to: "/ai-tutor" },
];

const menuItems = [
  { icon: "fa-save", label: "Знания", to: "/knowledge-vault" },
  { icon: "fa-flask", label: "Практика", to: "/labhub" },
  { icon: "fa-user-astronaut", label: "Профиль", to: "/profile" },
  { icon: "fa-chart-line", label: "Skills DNA", to: "/skills-dna" },
  { icon: "fa-briefcase", label: "Business AI", to: "/business-ai" },
  { icon: "fa-cog", label: "Настройки", to: "/settings" },
];

export function BottomNavigation() {
  const isMobile = useIsMobile();
  const [location, setLocation] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!isMobile) {
    return null;
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed bottom-20 right-4 z-50 bg-space-800/95 backdrop-blur-md border border-white/20 rounded-xl p-2 min-w-[200px]"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="space-y-1">
              {menuItems.map((item) => {
                const isActive = location === item.to;
                
                return (
                  <motion.button
                    key={item.to}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive 
                        ? "bg-gradient-to-r from-[#6E3AFF]/20 to-[#2EBAE1]/20 text-white" 
                        : "text-white/70 hover:bg-white/10"
                    }`}
                    onClick={() => {
                      setLocation(item.to);
                      setIsMenuOpen(false);
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                      isActive
                        ? "bg-gradient-to-br from-[#6E3AFF] to-[#2EBAE1] text-white"
                        : "text-white/60"
                    }`}>
                      <i className={`fas ${item.icon} text-sm`}></i>
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-50 bg-space-800/95 backdrop-blur-md border-t border-white/10"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex justify-around items-center h-16">
          {mainNavItems.map((item) => {
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
                    <i className={`fas ${item.icon} text-lg`}></i>
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
          
          {/* Menu Button */}
          <motion.button
            className="flex flex-col items-center justify-center h-full w-full"
            onClick={toggleMenu}
            whileTap={{ scale: 0.9 }}
          >
            <div
              className={`flex flex-col items-center justify-center transition-colors duration-200 ${
                isMenuOpen ? "text-white" : "text-white/50"
              }`}
            >
              <div 
                className={`w-10 h-10 flex items-center justify-center rounded-lg mb-1 ${
                  isMenuOpen
                    ? "bg-gradient-to-br from-[#6E3AFF] to-[#2EBAE1] text-white"
                    : "text-white/60"
                }`}
              >
                <motion.i 
                  className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-lg`}
                  animate={{ rotate: isMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              <span className="text-xs">Меню</span>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}
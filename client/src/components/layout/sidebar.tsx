import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { useAuth } from "@/context/auth-context";
import { useIsMobile } from "@/hooks/use-mobile";

type NavItemProps = {
  icon: string;
  label: string;
  to: string;
  isActive: boolean;
  onClick?: () => void;
};

const NavItem = ({ icon, label, to, isActive, onClick }: NavItemProps) => {
  const handleClick = (event: React.MouseEvent) => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <motion.div
      className="relative"
      animate={{ scale: isActive ? 1.05 : 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link href={to}>
        <div
          onClick={handleClick}
          className={`flex items-center py-3 px-4 rounded-lg transition-all duration-300 mb-2 cursor-pointer ${
            isActive
              ? "bg-gradient-to-r from-[#6E3AFF]/20 to-[#2EBAE1]/10 border border-[#6E3AFF]/30 shadow-[0_0_15px_rgba(110,58,255,0.15)] translate-z-4"
              : "hover:bg-white/5"
          }`}
        >
          <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${
            isActive
              ? "bg-gradient-to-br from-[#6E3AFF] to-[#2EBAE1] text-white"
              : "bg-white/10 text-white/60"
          }`}>
            <i className={`fas ${icon} text-lg`}></i>
          </div>
          <span className={`ml-3 font-medium ${isActive ? "text-white" : "text-white/70"}`}>
            {label}
          </span>
          {isActive && (
            <motion.div
              className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#6E3AFF] to-[#2EBAE1] rounded-l-md"
              layoutId="activeIndicator"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export function Sidebar() {
  const [location] = useLocation();
  const { logout } = useAuth();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);

  useEffect(() => {
    setIsOpen(!isMobile);
  }, [isMobile]);
  
  const [, setLocation] = useLocation();
  
  const handleLogout = async () => {
    await logout();
    setLocation("/login");
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const navigationItems = [
    { icon: "fa-tachometer-alt", label: "Панель управления", to: "/dashboard" },
    { icon: "fa-route", label: "Дорожная карта", to: "/roadmap" },
    { icon: "fa-flask", label: "Лаборатория", to: "/labhub" },
    { icon: "fa-book", label: "Курсы", to: "/courses" },
    { icon: "fa-users", label: "Сообщество", to: "/community" },
    { icon: "fa-briefcase", label: "Business AI", to: "/business" },
    { icon: "fa-user-astronaut", label: "Профиль", to: "/profile" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        className={`fixed top-0 bottom-0 left-0 z-50 
        transition-all duration-300 transform
        bg-space-800/90 backdrop-blur-sm border-r border-white/10 flex flex-col`}
        initial={false}
        animate={{ 
          width: isOpen ? 256 : 80,
          x: 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Logo */}
        <div className="p-4 border-b border-white/10 flex items-center justify-center sm:justify-start">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6E3AFF] to-[#2EBAE1] flex items-center justify-center">
            <span className="text-white font-bold text-xl">N</span>
          </div>
          <motion.div 
            className="ml-3 overflow-hidden whitespace-nowrap"
            animate={{ opacity: isMobile || isOpen ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <h1 className="font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#B28DFF] to-[#8BE0F7]">
              NovaAI
            </h1>
            <p className="text-white/50 text-xs">University</p>
          </motion.div>
        </div>

        {/* Nav items */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <NavItem
                key={item.to}
                icon={item.icon}
                label={item.label}
                to={item.to}
                isActive={location === item.to}
                onClick={closeSidebar}
              />
            ))}
          </div>

          <div className="pt-6 mt-6 border-t border-white/10">
            <NavItem
              icon="fa-cog"
              label="Настройки"
              to="/settings"
              isActive={location === "/settings"}
              onClick={closeSidebar}
            />
            <button
              onClick={handleLogout}
              className="flex items-center w-full py-3 px-4 rounded-lg transition-all duration-300 hover:bg-white/5"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 text-white/60">
                <i className="fas fa-sign-out-alt text-lg"></i>
              </div>
              <span className="ml-3 font-medium text-white/70">Выйти</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Toggle button (показываем всегда) */}
      <button
        className={`fixed top-4 left-[240px] z-50 w-10 h-10 rounded-lg bg-space-800 border border-white/20 flex items-center justify-center transform transition-all duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-[-160px]'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className={`fas ${isOpen ? "fa-chevron-left" : "fa-chevron-right"} text-white`}></i>
      </button>
    </>
  );
}
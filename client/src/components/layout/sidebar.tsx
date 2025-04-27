import React, { useState, useEffect, createContext, useContext } from "react";
import { Link, useLocation } from "wouter";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { useAuth } from "@/context/auth-context";
import { useIsMobile } from "@/hooks/use-mobile";

// Создаем контекст для сайдбара
interface SidebarContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Хук для использования контекста
export const useSidebarContext = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebarContext must be used within a SidebarProvider");
  }
  return context;
};

// Провайдер контекста для сайдбара, который будет оборачивать приложение
export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);

  useEffect(() => {
    setIsOpen(!isMobile);
  }, [isMobile]);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

type NavItemProps = {
  icon: string;
  label: string;
  to: string;
  isActive: boolean;
  onClick?: () => void;
};

// Оптимизированный NavItem с мемоизацией для предотвращения ненужных ререндеров
const NavItem = React.memo(function NavItem({ icon, label, to, isActive, onClick }: NavItemProps) {
  const { isOpen } = useSidebarContext();
  
  // Просто вызываем переданный onClick, навигация теперь в handleNavigation
  const handleClick = React.useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    
    if (onClick) {
      onClick();
    }
  }, [onClick]);

  // Используем постоянный key для предотвращения перерисовки при навигации
  return (
    <div className="relative">
      <Link href={to}>
        <div
          onClick={handleClick}
          className={`flex items-center py-3 px-4 rounded-lg transition-colors duration-300 mb-2 cursor-pointer transform ${
            isActive
              ? "bg-gradient-to-r from-[#6E3AFF]/20 to-[#2EBAE1]/10 border border-[#6E3AFF]/30 shadow-[0_0_15px_rgba(110,58,255,0.15)] scale-105"
              : "hover:bg-white/5 scale-100 hover:scale-105"
          }`}
          style={{ willChange: 'transform, opacity' }}
        >
          <div 
            className={`w-10 h-10 flex items-center justify-center rounded-lg ${
              isActive
                ? "bg-gradient-to-br from-[#6E3AFF] to-[#2EBAE1] text-white"
                : "bg-white/10 text-white/60"
            }`}
            style={{ willChange: 'none' }}
          >
            <span className="text-lg">{icon}</span>
          </div>
          
          {/* Отображаем текст без анимации появления/исчезновения, используем только CSS-переходы */}
          <div 
            className={`ml-3 font-medium overflow-hidden transition-all duration-300 ${isActive ? "text-white" : "text-white/70"}`}
            style={{ 
              maxWidth: isOpen ? '160px' : '0px',
              opacity: isOpen ? 1 : 0,
              willChange: 'max-width, opacity',
              whiteSpace: 'nowrap'
            }}
          >
            {label}
          </div>
          
          {isActive && (
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#6E3AFF] to-[#2EBAE1] rounded-l-md"
            />
          )}
        </div>
      </Link>
    </div>
  );
});

export function Sidebar() {
  const [location] = useLocation();
  const { logout } = useAuth();
  const isMobile = useIsMobile();
  const { isOpen, setIsOpen } = useSidebarContext();
  
  const [, setLocation] = useLocation();
  
  // В мобильной версии не показываем сайдбар совсем
  if (isMobile) {
    return null;
  }
  
  const handleLogout = async () => {
    await logout();
    setLocation("/login");
  };

  // Оптимизированная функция для перехода между разделами
  // Не закрываем боковую панель на десктопе, чтобы избежать моргания
  const handleNavigation = (to: string) => {
    // Если мы уже на этой странице, ничего не делаем (предотвращаем перерендер)
    if (location === to) return;
    
    // Только на мобильных устройствах закрываем сайдбар
    if (isMobile) {
      setIsOpen(false);
    }
    
    // Используем setTimeout для плавного перехода
    setTimeout(() => {
      setLocation(to);
    }, 10);
  };

  const navigationItems = [
    { icon: "📊", label: "Панель управления", to: "/dashboard" },
    { icon: "🗺️", label: "Дорожная карта", to: "/roadmap" },
    { icon: "🧪", label: "Лаборатория", to: "/labhub" },
    { icon: "📚", label: "Курсы", to: "/courses" },
    { icon: "💾", label: "Хранилище знаний", to: "/knowledge-vault" },
    { icon: "🧠", label: "Gap-анализ", to: "/gap-analysis" },
    { icon: "🤖", label: "AI-ассистент", to: "/ai-assistant" },
    { icon: "👥", label: "Сообщество", to: "/community" },
    { icon: "💼", label: "Business AI", to: "/business" },
    { icon: "👨‍🚀", label: "Профиль", to: "/profile" },
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

      {/* Sidebar - переработан для стабильного отображения */}
      <div
        className="fixed top-0 bottom-0 z-50 bg-space-800/90 backdrop-blur-sm border-r border-white/10 flex flex-col transition-all duration-300"
        style={{ 
          width: isOpen ? (isMobile ? '256px' : '256px') : (isMobile ? '0' : '80px'),
          transform: isMobile && !isOpen ? 'translateX(-80px)' : 'translateX(0)',
          left: 0,
          willChange: 'width, transform',
          overflowX: 'hidden'
        }}
      >
        {/* Logo - переделан с использованием CSS без AnimatePresence */}
        <div className="p-4 border-b border-white/10 flex items-center justify-start">
          <div 
            className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6E3AFF] to-[#2EBAE1] flex items-center justify-center flex-shrink-0"
            style={{ willChange: 'contents' }}
          >
            <span className="text-white font-bold text-xl">N</span>
          </div>
          
          <div 
            className="ml-3 overflow-hidden whitespace-nowrap transition-all duration-300"
            style={{ 
              maxWidth: isOpen ? '160px' : '0px',
              opacity: isOpen ? 1 : 0,
              willChange: 'max-width, opacity'
            }}
          >
            <h1 className="font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#B28DFF] to-[#8BE0F7]">
              NovaAI
            </h1>
            <p className="text-white/50 text-xs">University</p>
          </div>
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
                onClick={() => handleNavigation(item.to)}
              />
            ))}
          </div>

          <div className="pt-6 mt-6 border-t border-white/10">
            <NavItem
              icon="⚙️"
              label="Настройки"
              to="/settings"
              isActive={location === "/settings"}
              onClick={() => handleNavigation("/settings")}
            />
            <div
              onClick={handleLogout}
              className="flex items-center w-full py-3 px-4 rounded-lg transition-colors duration-300 hover:bg-white/5 cursor-pointer"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 text-white/60 flex-shrink-0">
                <span className="text-lg">🚪</span>
              </div>
              
              <div 
                className="ml-3 font-medium overflow-hidden whitespace-nowrap transition-all duration-300 text-white/70"
                style={{ 
                  maxWidth: isOpen ? '160px' : '0px',
                  opacity: isOpen ? 1 : 0,
                  willChange: 'max-width, opacity'
                }}
              >
                Выйти
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toggle button (показывает в правильном месте в зависимости от состояния) */}
      <button
        className="fixed top-4 z-50 w-10 h-10 rounded-lg bg-space-800 border border-white/20 flex items-center justify-center transition-all duration-300"
        style={{
          left: isMobile 
            ? isOpen ? '230px' : '10px'
            : isOpen ? '230px' : '70px',
          willChange: 'left'
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-white">{isOpen ? "◀" : "☰"}</span>
      </button>
    </>
  );
}
import React, { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useUserProfile } from "@/context/user-profile-context";
import { useEventLogger } from "@/hooks/use-event-logger";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Book,
  BookOpen,
  Brain,
  Compass,
  Dna,
  GraduationCap,
  Home,
  LogOut,
  Menu,
  Star,
  User,
  X
} from "lucide-react";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [location] = useLocation();
  const { userProfile } = useUserProfile();
  const { logEvent } = useEventLogger();
  const [menuOpen, setMenuOpen] = React.useState(false);

  // Основные пункты навигации
  const menuItems = [
    { 
      path: "/", 
      label: "Главная", 
      icon: <Home className="h-5 w-5" /> 
    },
    { 
      path: "/catalog", 
      label: "Курсы", 
      icon: <BookOpen className="h-5 w-5" /> 
    },
    { 
      path: "/dashboard", 
      label: "Мое обучение", 
      icon: <Book className="h-5 w-5" />,
      authRequired: true
    },
    { 
      path: "/skills-dna", 
      label: "Skills DNA", 
      icon: <Dna className="h-5 w-5" /> 
    },
    { 
      path: "/navigator", 
      label: "AI-навигатор", 
      icon: <Compass className="h-5 w-5" />,
      authRequired: true
    }
  ];

  // Обработчик выхода из системы
  const handleLogout = () => {
    // Заглушка для выхода из системы
    logEvent("user_logout");
    window.location.href = "/";
  };

  // Обработчик переключения меню на мобильных устройствах
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Обработчик закрытия меню при переходе на новую страницу
  const handleNavigation = (path: string) => {
    setMenuOpen(false);
    logEvent("navigation", { destination: path });
  };

  return (
    <div className="min-h-screen bg-space-900 text-white flex flex-col">
      {/* Фон страницы */}
      <div className="fixed inset-0 bg-[url('/space-bg.jpg')] bg-cover bg-center opacity-20 z-0"></div>
      <div className="fixed inset-0 bg-gradient-to-b from-space-900/60 to-space-900/95 z-0"></div>
      
      {/* Хедер */}
      <header className="relative z-10 border-b border-white/10 bg-space-900/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Логотип */}
            <Link href="/">
              <a className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-indigo-400" />
                <span className="font-orbitron text-xl md:text-2xl bg-clip-text text-transparent bg-gradient-to-r from-[#B28DFF] via-[#8BE0F7] to-[#B28DFF]">
                  NovaAI
                </span>
              </a>
            </Link>
            
            {/* Десктопная навигация */}
            <nav className="hidden md:flex space-x-1">
              {menuItems.map((item) => {
                // Пропускаем пункты, требующие авторизации, если пользователь не вошел
                if (item.authRequired && !userProfile?.userId) {
                  return null;
                }
                
                return (
                  <Link key={item.path} href={item.path}>
                    <a 
                      className={`px-3 py-2 rounded-md text-sm flex items-center space-x-1 transition-colors
                        ${location === item.path 
                          ? 'bg-space-800 text-white' 
                          : 'text-white/70 hover:text-white hover:bg-space-800/40'
                        }`}
                      onClick={() => handleNavigation(item.path)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </a>
                  </Link>
                );
              })}
            </nav>
            
            {/* Действия пользователя */}
            <div className="hidden md:flex items-center space-x-2">
              {userProfile?.userId ? (
                <div className="flex items-center space-x-2">
                  <Link href="/profile">
                    <a className="flex items-center space-x-2 px-3 py-2 rounded-md bg-space-800/40 hover:bg-space-800 transition-colors">
                      <User className="h-4 w-4" />
                      <span className="text-sm">{userProfile.displayName || "Пользователь"}</span>
                    </a>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleLogout}
                    className="text-white/70 hover:text-white"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              ) : (
                <Link href="/auth">
                  <a>
                    <Button variant="default">
                      Войти
                    </Button>
                  </a>
                </Link>
              )}
            </div>
            
            {/* Мобильное меню */}
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMenu}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Мобильное меню (оверлей) */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 md:hidden">
          <div className="h-full flex flex-col bg-space-800 max-w-[80%] w-[280px]">
            <div className="p-4 flex justify-between items-center border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Brain className="h-7 w-7 text-indigo-400" />
                <span className="font-orbitron text-xl bg-clip-text text-transparent bg-gradient-to-r from-[#B28DFF] via-[#8BE0F7] to-[#B28DFF]">
                  NovaAI
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMenu}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4">
              <nav className="space-y-1 px-3">
                {menuItems.map((item) => {
                  // Пропускаем пункты, требующие авторизации, если пользователь не вошел
                  if (item.authRequired && !userProfile?.userId) {
                    return null;
                  }
                  
                  return (
                    <Link key={item.path} href={item.path}>
                      <a 
                        className={`flex items-center space-x-3 px-3 py-2.5 rounded-md transition-colors
                          ${location === item.path 
                            ? 'bg-indigo-600/20 text-indigo-400' 
                            : 'text-white/70 hover:text-white hover:bg-space-700/40'
                          }`}
                        onClick={() => handleNavigation(item.path)}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </a>
                    </Link>
                  );
                })}
              </nav>
              
              <Separator className="my-4 bg-white/10" />
              
              {userProfile?.userId ? (
                <div className="px-3 space-y-1">
                  <Link href="/profile">
                    <a className="flex items-center space-x-3 px-3 py-2.5 rounded-md transition-colors text-white/70 hover:text-white hover:bg-space-700/40">
                      <User className="h-5 w-5" />
                      <span>{userProfile.displayName || "Пользователь"}</span>
                    </a>
                  </Link>
                  
                  <a 
                    className="flex items-center space-x-3 px-3 py-2.5 rounded-md transition-colors text-white/70 hover:text-white hover:bg-space-700/40 cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Выйти</span>
                  </a>
                </div>
              ) : (
                <div className="px-6">
                  <Link href="/auth">
                    <a className="block w-full">
                      <Button className="w-full">
                        Войти
                      </Button>
                    </a>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Основное содержимое */}
      <main className="flex-1 relative z-10">
        {children}
      </main>
      
      {/* Футер */}
      <footer className="relative z-10 border-t border-white/10 bg-space-900/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Brain className="h-6 w-6 text-indigo-400" />
              <span className="font-orbitron text-lg bg-clip-text text-transparent bg-gradient-to-r from-[#B28DFF] via-[#8BE0F7] to-[#B28DFF]">
                NovaAI University
              </span>
            </div>
            
            <div className="text-white/50 text-sm">
              &copy; {new Date().getFullYear()} NovaAI University. Все права защищены.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
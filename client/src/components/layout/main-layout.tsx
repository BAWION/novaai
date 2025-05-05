import React, { useState, useEffect, Suspense, lazy } from "react";
import { useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar, useSidebarContext } from "./sidebar";
import { BottomNavigation } from "./bottom-navigation";
import { ParticlesBackground } from "@/components/particles-background";
import { useIsMobile } from "@/hooks/use-mobile";

// Динамический импорт для всех страниц (ленивая загрузка)
const Dashboard = lazy(() => import("@/pages/dashboard"));
const Roadmap = lazy(() => import("@/pages/roadmap"));
const Courses = lazy(() => import("@/pages/courses"));
const LabHub = lazy(() => import("@/pages/labhub"));
const KnowledgeVault = lazy(() => import("@/pages/knowledge-vault"));
const GapAnalysisPage = lazy(() => import("@/pages/gap-analysis-page"));
const AIAssistantPage = lazy(() => import("@/pages/ai-assistant-page"));
const Community = lazy(() => import("@/pages/community"));
const BusinessAIOverview = lazy(() => import("@/pages/business"));
const Profile = lazy(() => import("@/pages/profile"));
const Settings = lazy(() => import("@/pages/settings"));

interface MainLayoutProps {
  children?: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const isMobile = useIsMobile();
  const { isOpen } = useSidebarContext();
  const [location] = useLocation();
  const [currentContent, setCurrentContent] = useState<React.ReactNode | null>(null);
  const [pageTitle, setPageTitle] = useState("");
  const [pageSubtitle, setPageSubtitle] = useState("");
  
  // Эффект для обновления контента и заголовков страниц при изменении пути
  useEffect(() => {
    // Функция для определения компонента и заголовков на основе пути
    const getPageInfo = (path: string) => {
      // Объект с данными для каждой страницы
      const pageConfig: Record<string, { title: string; subtitle?: string; component: React.ReactNode }> = {
        "/dashboard": { 
          title: "Панель управления", 
          component: <Dashboard /> 
        },
        "/roadmap": { 
          title: "Дорожная карта", 
          component: <Roadmap /> 
        },
        "/courses": { 
          title: "Каталог курсов", 
          subtitle: "Исследуйте нашу библиотеку курсов по AI и Data Science", 
          component: <Courses /> 
        },
        "/labhub": { 
          title: "Лаборатория", 
          component: <LabHub /> 
        },
        "/knowledge-vault": { 
          title: "Хранилище знаний", 
          component: <KnowledgeVault /> 
        },
        "/gap-analysis": { 
          title: "Gap-анализ", 
          component: <GapAnalysisPage /> 
        },
        "/ai-assistant": { 
          title: "AI-ассистент", 
          component: <AIAssistantPage /> 
        },
        "/community": { 
          title: "Сообщество", 
          component: <Community /> 
        },
        "/business": { 
          title: "Business AI", 
          component: <BusinessAIOverview /> 
        },
        "/profile": { 
          title: "Профиль", 
          component: <Profile /> 
        },
        "/settings": { 
          title: "Настройки", 
          component: <Settings /> 
        }
      };
      
      // Возвращаем данные для текущего пути или запасной вариант
      return pageConfig[path] || { 
        title: "", 
        subtitle: "", 
        component: children 
      };
    };
    
    // Получаем информацию о странице
    const pageInfo = getPageInfo(location);
    
    // Обновляем состояние компонента
    setPageTitle(pageInfo.title);
    setPageSubtitle(pageInfo.subtitle || "");
    setCurrentContent(pageInfo.component);
  }, [location, children]);
  
  // Проверяем, нужно ли рендерить наш контейнер или вернуть children напрямую
  // Это нужно для страниц, которые имеют свою собственную компоновку
  const isMainRoutes = [
    "/dashboard", 
    "/roadmap", 
    "/courses", 
    "/labhub", 
    "/knowledge-vault", 
    "/gap-analysis", 
    "/ai-assistant", 
    "/community", 
    "/business", 
    "/profile", 
    "/settings"
  ].includes(location);
  
  // Если это не основные маршруты, просто возвращаем children
  if (!isMainRoutes) {
    return <>{children}</>;
  }
  
  // Рендер основной компоновки с анимированным переходом между страницами
  return (
    <div className="min-h-screen w-full flex flex-col bg-space-900">
      <ParticlesBackground />
      
      {!isMobile && <Sidebar />}
      <BottomNavigation />

      <main 
        className={`flex-1 transition-all duration-300 ${
          isMobile ? 'ml-0' : (isOpen ? 'ml-[256px]' : 'ml-[80px]')
        } ${isMobile ? 'pb-20' : ''}`}
        style={{ 
          overflowX: 'hidden',
          willChange: 'margin'
        }}
      >
        <div 
          className={`container mx-auto ${isMobile ? 'px-2' : 'px-6'} py-4 ${isMobile ? 'pt-20' : 'pt-16'} ${isMobile ? 'overflow-x-hidden w-full' : ''}`}
          style={{ willChange: 'contents', overflowX: 'hidden' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              {/* Заголовок страницы */}
              {pageTitle && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, type: 'spring', damping: 25 }}
                  className="mb-6"
                >
                  <h1 className="font-orbitron text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#B28DFF] via-[#8BE0F7] to-[#B28DFF]">
                    {pageTitle}
                  </h1>
                  {pageSubtitle && (
                    <p className="text-white/70 text-md mt-1">{pageSubtitle}</p>
                  )}
                </motion.div>
              )}
              
              {/* Содержимое страницы */}
              <Suspense fallback={
                <div className="flex items-center justify-center py-20">
                  <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
                </div>
              }>
                {currentContent}
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
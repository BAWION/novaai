import React, { Suspense, lazy, useEffect, useState } from "react";
import { Route, Switch, useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar, useSidebarContext } from "./sidebar";
import { BottomNavigation } from "./bottom-navigation";
import { ParticlesBackground } from "@/components/particles-background";
import { useIsMobile } from "@/hooks/use-mobile";
import { BusinessMenu } from "@/components/business/business-menu";

// Ленивая загрузка всех страниц приложения
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

// Типизация конфигурации страниц
type PageConfig = {
  [key: string]: {
    title: string;
    subtitle: string;
    component: React.LazyExoticComponent<() => React.JSX.Element>;
  }
};

// Конфигурация страниц
const pagesConfig: PageConfig = {
  dashboard: { 
    title: "Панель управления",
    subtitle: "",
    component: Dashboard
  },
  roadmap: { 
    title: "Дорожная карта",
    subtitle: "",
    component: Roadmap
  },
  courses: { 
    title: "Каталог курсов",
    subtitle: "Исследуйте нашу библиотеку курсов по AI и Data Science",
    component: Courses
  },
  labhub: { 
    title: "Лаборатория",
    subtitle: "Практические задания и эксперименты",
    component: LabHub
  },
  "knowledge-vault": { 
    title: "Хранилище знаний",
    subtitle: "Ваша персональная база знаний",
    component: KnowledgeVault
  },
  "gap-analysis": { 
    title: "Gap-анализ",
    subtitle: "Анализ разрывов в навыках",
    component: GapAnalysisPage
  },
  "ai-assistant": { 
    title: "AI-ассистент",
    subtitle: "Поддержка в изучении и применении AI",
    component: AIAssistantPage
  },
  community: { 
    title: "Сообщество",
    subtitle: "Общение с другими учениками",
    component: Community
  },
  business: { 
    title: "Business AI",
    subtitle: "Применение AI в бизнес-процессах",
    component: BusinessAIOverview
  },
  profile: { 
    title: "Профиль",
    subtitle: "Управление личной информацией",
    component: Profile
  },
  settings: { 
    title: "Настройки",
    subtitle: "Персонализация платформы",
    component: Settings
  }
};

export function AppLayout() {
  const isMobile = useIsMobile();
  const { isOpen } = useSidebarContext();
  const [location] = useLocation();
  const [pageTitle, setPageTitle] = useState("");
  const [pageSubtitle, setPageSubtitle] = useState("");
  
  // Определяем, на какой странице мы находимся
  const pagePath = location.replace('/app/', '');
  
  // Обновляем заголовок страницы при изменении пути
  useEffect(() => {
    // Создаем тип, гарантирующий, что мы проверяем ключ
    type PageConfigKey = keyof typeof pagesConfig;
    
    // Проверяем, что pagePath является валидным ключом
    if (Object.keys(pagesConfig).includes(pagePath)) {
      const page = pagesConfig[pagePath as PageConfigKey];
      setPageTitle(page.title);
      setPageSubtitle(page.subtitle || "");
    } else {
      // Если страница не найдена, используем дефолтные значения
      setPageTitle("NovaAI University");
      setPageSubtitle("");
    }
  }, [pagePath]);
  
  // Проверяем, находимся ли в бизнес-разделе
  const isBusinessSection = pagePath === 'business';
  
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
          {/* Заголовок страницы */}
          {pageTitle && (
            <motion.div
              key={`header-${pagePath}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, type: 'spring', damping: 25 }}
              className="mb-6"
            >
              {isBusinessSection ? (
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-white">
                    {pageTitle}
                  </h1>
                  <BusinessMenu />
                </div>
              ) : (
                <h1 className="font-orbitron text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#B28DFF] via-[#8BE0F7] to-[#B28DFF]">
                  {pageTitle}
                </h1>
              )}
              {pageSubtitle && (
                <p className="text-white/70 text-md mt-1">{pageSubtitle}</p>
              )}
            </motion.div>
          )}
          
          {/* Роутинг для вложенных страниц */}
          <AnimatePresence mode="wait">
            <motion.div
              key={pagePath}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <Suspense fallback={
                <div className="flex items-center justify-center py-20">
                  <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
                </div>
              }>
                <Switch>
                  {Object.entries(pagesConfig).map(([path, { component: Component }]) => (
                    <Route key={path} path={`/app/${path}`}>
                      <Component />
                    </Route>
                  ))}
                </Switch>
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
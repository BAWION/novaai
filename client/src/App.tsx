import React, { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/context/auth-context";
import { ParticlesBackground } from "@/components/particles-background";
import { SidebarProvider } from "@/components/layout/sidebar";
import { PWAInstallPrompt, MobilePWAInstallButton } from "@/components/pwa/install-prompt";
import { ConnectionStatus, PWAModeBadge } from "@/components/pwa/offline-status";
import { Providers } from "@/context/providers";
import { PageTransition } from "@/components/ui/page-transition";
import HomePage from "@/pages/home-page";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Onboarding from "@/pages/onboarding";
import OnboardingPage from "@/pages/onboarding-page";
import OnboardingIntro from "@/pages/onboarding-intro";
import RegisterAfterOnboarding from "@/pages/register-after-onboarding";
import QuickDiagnosis from "@/pages/quick-diagnosis";
import DeepDiagnosis from "@/pages/deep-diagnosis";
import OrbitalLobby from "@/pages/orbital-lobby";
import NotFound from "@/pages/not-found";
import CaseLibrary from "@/pages/business/cases";
import CourseAI from "@/pages/course-ai";
import CoursePage from "@/pages/course-page";
import SkillsPage from "@/pages/skills-page";
import AILiteracyCoursePage from "@/pages/ai-literacy-course";
import { MainLayout } from "@/components/layout/main-layout";

// Динамический импорт для страниц главного контейнера не требуется - они загружаются внутри MainLayout

interface ProtectedRouteProps {
  component: React.ComponentType;
  path: string;
}

// Protected route component
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, path }) => {
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();
  
  // Используем useEffect для выполнения проверки и перенаправления после рендеринга
  useEffect(() => {
    // Получаем актуальное состояние авторизации пользователя
    if (!isAuthenticated || !user) {
      // Перенаправляем на страницу авторизации с небольшой задержкой
      // чтобы уйти от ситуации race condition
      const redirectTimer = setTimeout(() => {
        console.log("Перенаправление на /login, так как пользователь не авторизован");
        setLocation("/login");
      }, 50);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [isAuthenticated, user, setLocation]);
  
  // Отображаем загрузку или пустой экран во время проверки авторизации 
  if (!isAuthenticated || !user) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen bg-space-900">
          <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
        </div>
      </Route>
    );
  }
  
  // Если пользователь авторизован, отрисовываем компонент с анимацией перехода
  return (
    <Route path={path}>
      <PageTransition location={path}>
        <Component />
      </PageTransition>
    </Route>
  );
};

function Router() {
  const { isAuthenticated } = useAuth();
  const [location] = useLocation();
  
  // Check if we're on public pages
  const isPublicPage = location === "/" || location === "/login" || location === "/register" || 
    location === "/onboarding" || location === "/onboarding-page" || location === "/quick-diagnosis" ||
    location === "/deep-diagnosis" || location === "/onboarding-intro" || location === "/register-after-onboarding";
  
  return (
    <div className="flex flex-col min-h-screen">
      {!isPublicPage && <ParticlesBackground />}
      
      <main className="flex-grow">
        <Switch>
          {/* Публичные маршруты */}
          <Route path="/" component={HomePage} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/onboarding" component={Onboarding} />
          <Route path="/onboarding-page" component={OnboardingPage} />
          <Route path="/onboarding-intro">
            {() => <OnboardingIntro />}
          </Route>
          <Route path="/register-after-onboarding">
            {() => <RegisterAfterOnboarding />}
          </Route>
          <Route path="/quick-diagnosis" component={QuickDiagnosis} />
          <Route path="/deep-diagnosis" component={DeepDiagnosis} />
          
          {/* Основной контейнер для приложения - MainLayout, который не перезагружает боковую панель */}
          <ProtectedRoute path="/dashboard" component={() => <MainLayout />} />
          <ProtectedRoute path="/roadmap" component={() => <MainLayout />} />
          <ProtectedRoute path="/courses" component={() => <MainLayout />} />
          <ProtectedRoute path="/labhub" component={() => <MainLayout />} />
          <ProtectedRoute path="/community" component={() => <MainLayout />} />
          <ProtectedRoute path="/profile" component={() => <MainLayout />} />
          <ProtectedRoute path="/settings" component={() => <MainLayout />} />
          <ProtectedRoute path="/orbital-lobby" component={OrbitalLobby} />
          
          {/* Business AI Module Routes */}
          <ProtectedRoute path="/business" component={() => <MainLayout />} />
          <ProtectedRoute path="/business/cases" component={CaseLibrary} />
          
          {/* Курсы с ИИ-ассистентом */}
          <ProtectedRoute path="/course-ai/:courseId?" component={CourseAI} />
          
          {/* Детальная страница курса */}
          <ProtectedRoute path="/courses/:slug" component={CoursePage} />
          
          {/* Knowledge Vault - Хранилище знаний */}
          <ProtectedRoute path="/knowledge-vault" component={() => <MainLayout />} />
          
          {/* Карта навыков и учебный прогресс */}
          <Route path="/skills" component={SkillsPage} />
          
          {/* Gap-анализ навыков */}
          <ProtectedRoute path="/gap-analysis" component={() => <MainLayout />} />
          
          {/* AI-ассистент */}
          <ProtectedRoute path="/ai-assistant" component={() => <MainLayout />} />
          
          {/* AI Literacy 101 - Course with Lessons */}
          <ProtectedRoute path="/courses/ai-literacy-101" component={() => {
            // Используем реализацию подстраниц - основная страница курса
            const [location] = useLocation();
            return (
              <PageTransition location={location} className="w-full h-full">
                <AILiteracyCoursePage />
              </PageTransition>
            );
          }} />
          
          {/* Lesson Page - внутри курса AI Literacy */}
          <ProtectedRoute path="/courses/ai-literacy-101/modules/:moduleId/lessons/:lessonId" component={() => {
            const LessonPage = React.lazy(() => import('@/pages/lesson-page'));
            const [location] = useLocation();
            
            return (
              <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
              </div>}>
                <PageTransition location={location} className="w-full h-full">
                  <LessonPage inCourseContext="ai-literacy-101" />
                </PageTransition>
              </React.Suspense>
            );
          }} />
          
          {/* Обратная совместимость для старых URL */}
          <Route path="/modules/:moduleId/lessons/:lessonId">
            {(params) => {
              const moduleId = params.moduleId;
              const lessonId = params.lessonId;
              const [, navigate] = useLocation();
              
              // Редирект на новый формат URL
              useEffect(() => {
                navigate(`/courses/ai-literacy-101/modules/${moduleId}/lessons/${lessonId}`);
              }, [moduleId, lessonId, navigate]);
              
              return (
                <div className="flex items-center justify-center min-h-screen">
                  <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
                </div>
              );
            }}
          </Route>
          
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <Providers>
      <SidebarProvider>
        <TooltipProvider>
          <Router />
          <PWAInstallPrompt />
          <MobilePWAInstallButton />
          <ConnectionStatus />
          <PWAModeBadge />
        </TooltipProvider>
      </SidebarProvider>
    </Providers>
  );
}

export default App;

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

// Импорт публичных страниц
import HomePage from "@/pages/home-page";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Onboarding from "@/pages/onboarding";
import OnboardingPage from "@/pages/onboarding-page";
import OnboardingIntro from "@/pages/onboarding-intro";
import RegisterAfterOnboarding from "@/pages/register-after-onboarding";
import QuickDiagnosis from "@/pages/quick-diagnosis";
import DeepDiagnosis from "@/pages/deep-diagnosis";
import NotFound from "@/pages/not-found";

// Импорт для личного кабинета
import { AppLayout } from "@/components/layout/app-layout";

// Импорт специальных страниц, которые будут работать вне AppLayout
import OrbitalLobby from "@/pages/orbital-lobby";
import CaseLibrary from "@/pages/business/cases";
import CourseAI from "@/pages/course-ai";
import CoursePage from "@/pages/course-page";
import SkillsPage from "@/pages/skills-page";
import AILiteracyCoursePage from "@/pages/ai-literacy-course";

// Защищенный маршрут: перенаправляет на /login если не авторизован
const ProtectedRoute: React.FC<{
  component: React.ComponentType;
  path: string;
}> = ({ component: Component, path }) => {
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    if (!isAuthenticated || !user) {
      const redirectTimer = setTimeout(() => {
        console.log("Перенаправление на /login, так как пользователь не авторизован");
        setLocation("/login");
      }, 50);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [isAuthenticated, user, setLocation]);
  
  if (!isAuthenticated || !user) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen bg-space-900">
          <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
        </div>
      </Route>
    );
  }
  
  return (
    <Route path={path}>
      <Component />
    </Route>
  );
};

function Router() {
  const { isAuthenticated } = useAuth();
  const [location] = useLocation();
  
  // Определяем, находимся ли мы на публичной странице
  const isPublicPage = location === "/" || location === "/login" || location === "/register" || 
    location === "/onboarding" || location === "/onboarding-page" || location === "/quick-diagnosis" ||
    location === "/deep-diagnosis" || location === "/onboarding-intro" || location === "/register-after-onboarding";
  
  // Определяем, находимся ли мы на специальной странице, требующей своего макета
  const isSpecialPage = 
    location.startsWith("/orbital-lobby") || 
    location.startsWith("/business/cases") || 
    location.startsWith("/course-ai") ||
    location.startsWith("/courses/") ||
    location.startsWith("/skills");
  
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
          
          {/* Основной макет приложения с сайдбаром и единым контейнером */}
          <ProtectedRoute path="/app" component={AppLayout} />
          
          {/* Специальные страницы со своим макетом */}
          <ProtectedRoute path="/orbital-lobby" component={OrbitalLobby} />
          <ProtectedRoute path="/business/cases" component={CaseLibrary} />
          <ProtectedRoute path="/course-ai/:courseId?" component={CourseAI} />
          <ProtectedRoute path="/courses/:slug" component={CoursePage} />
          <Route path="/skills" component={SkillsPage} />
          
          {/* AI Literacy 101 - Course with Lessons */}
          <ProtectedRoute path="/courses/ai-literacy-101" component={() => {
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
          
          {/* Маршруты для редиректа на /app/... */}
          <Route path="/dashboard">
            {() => { 
              const [, navigate] = useLocation();
              useEffect(() => { navigate("/app/dashboard"); }, [navigate]);
              return null;
            }}
          </Route>
          <Route path="/roadmap">
            {() => { 
              const [, navigate] = useLocation();
              useEffect(() => { navigate("/app/roadmap"); }, [navigate]);
              return null;
            }}
          </Route>
          <Route path="/courses">
            {() => { 
              const [, navigate] = useLocation();
              useEffect(() => { navigate("/app/courses"); }, [navigate]);
              return null;
            }}
          </Route>
          <Route path="/labhub">
            {() => { 
              const [, navigate] = useLocation();
              useEffect(() => { navigate("/app/labhub"); }, [navigate]);
              return null;
            }}
          </Route>
          <Route path="/community">
            {() => { 
              const [, navigate] = useLocation();
              useEffect(() => { navigate("/app/community"); }, [navigate]);
              return null;
            }}
          </Route>
          <Route path="/profile">
            {() => { 
              const [, navigate] = useLocation();
              useEffect(() => { navigate("/app/profile"); }, [navigate]);
              return null;
            }}
          </Route>
          <Route path="/settings">
            {() => { 
              const [, navigate] = useLocation();
              useEffect(() => { navigate("/app/settings"); }, [navigate]);
              return null;
            }}
          </Route>
          <Route path="/knowledge-vault">
            {() => { 
              const [, navigate] = useLocation();
              useEffect(() => { navigate("/app/knowledge-vault"); }, [navigate]);
              return null;
            }}
          </Route>
          <Route path="/gap-analysis">
            {() => { 
              const [, navigate] = useLocation();
              useEffect(() => { navigate("/app/gap-analysis"); }, [navigate]);
              return null;
            }}
          </Route>
          <Route path="/ai-assistant">
            {() => { 
              const [, navigate] = useLocation();
              useEffect(() => { navigate("/app/ai-assistant"); }, [navigate]);
              return null;
            }}
          </Route>
          <Route path="/business">
            {() => { 
              const [, navigate] = useLocation();
              useEffect(() => { navigate("/app/business"); }, [navigate]);
              return null;
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

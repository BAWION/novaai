import React, { useEffect, lazy, Suspense } from "react";
import { Switch, Route, useLocation } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/context/auth-context";
import { ParticlesBackground } from "@/components/particles-background";
import { SidebarProvider } from "@/components/layout/sidebar";
import { PWAInstallPrompt, MobilePWAInstallButton } from "@/components/pwa/install-prompt";
import { ConnectionStatus, PWAModeBadge } from "@/components/pwa/offline-status";
import { Providers } from "@/context/providers";
import HomePage from "@/pages/home-page";
import CosmicHome from "@/pages/cosmic-home";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Onboarding from "@/pages/onboarding";
import OnboardingPage from "@/pages/onboarding-page";
import OnboardingIntro from "@/pages/onboarding-intro";
import RegisterAfterOnboarding from "@/pages/register-after-onboarding";
import QuickDiagnosis from "@/pages/quick-diagnosis";
import DeepDiagnosis from "@/pages/deep-diagnosis";
import OrbitalLobby from "@/pages/orbital-lobby";
import Dashboard from "@/pages/dashboard";
import Roadmap from "@/pages/roadmap";
import Courses from "@/pages/courses";
import LabHub from "@/pages/labhub";
import Community from "@/pages/community";
import Profile from "@/pages/profile";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";
import BusinessAIOverview from "@/pages/business";
import CaseLibrary from "@/pages/business/cases";
import CourseAI from "@/pages/course-ai";
import CoursePage from "@/pages/course-page";
import CourseDetails from "@/pages/course-details";
import KnowledgeVault from "@/pages/knowledge-vault";
import SkillsPage from "@/pages/skills-page";
import AIAssistantPage from "@/pages/ai-assistant-page";
import AILiteracyCoursePage from "@/pages/ai-literacy-course";
import LessonPage from "@/pages/lesson-page";
import CompetencyMapPage from "@/pages/competency-map-page";
import TemplateDemoPage from "@/pages/template-demo-page";
import LessonStructurePage from "@/pages/admin/lesson-structure-page";
import PersonalDashboardPage from "@/pages/personal-dashboard";
import SimulatorDemoPage from "@/pages/simulator-demo-page";
import SkillsDnaPage from "@/pages/skills-dna";
import TimeSavedPageRoute from "@/pages/time-saved-page";
import InvestorPresentation from "@/pages/investor-presentation";
import PresentationSelector from "@/pages/presentation-selector";
import ProductDemo from "@/pages/product-demo";
import CourseManagement from "@/pages/course-management";
import AdminDashboard from "@/pages/admin/index";
import AdminPage from "@/pages/admin";
import AiTutorPage from "@/pages/ai-tutor";
import BusinessAIPage from "@/pages/business-ai";
import LightningEthicsPage from "@/pages/lightning-ethics";
import AIEthicsToolkitPage from "@/pages/ai-ethics-toolkit";
import AIEthicsToolkitV2Page from "@/pages/ai-ethics-toolkit-v2";
import CardSortDemo from "@/pages/card-sort-demo";
import SliderDemo from "@/pages/slider-demo";
import MatchingDemo from "@/pages/matching-demo";
import ScenarioDemo from "@/pages/scenario-demo";
import ActivitiesDemo from "@/pages/activities-demo";
import AIEthicsV2Course from "@/pages/ai-ethics-v2-course";

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
  
  // Если пользователь авторизован, отрисовываем компонент
  return (
    <Route path={path}>
      <Component />
    </Route>
  );
};

function Router() {
  const { isAuthenticated } = useAuth();
  const [location] = useLocation();
  
  // Check if we're on public pages
  const isPublicPage = location === "/" || location === "/abtest" || location === "/login" || location === "/register" || 
    location === "/onboarding" || location === "/onboarding-page" || location === "/quick-diagnosis" ||
    location === "/deep-diagnosis" || location === "/onboarding-intro" || location === "/register-after-onboarding" ||
    location === "/investor-presentation" || location === "/presentation-selector" ||
    location === "/product-demo";
  
  return (
    <div className="flex flex-col min-h-screen">
      {!isPublicPage && <ParticlesBackground />}
      
      <main className="flex-grow">
        <Switch>
          {/* Публичные маршруты */}
          <Route path="/" component={CosmicHome} />
          <Route path="/abtest" component={HomePage} />
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
          <ProtectedRoute path="/skills-dna" component={SkillsDnaPage} />
          <Route path="/investor-presentation" component={InvestorPresentation} />
          <Route path="/presentation-selector" component={PresentationSelector} />
          <Route path="/product-demo" component={ProductDemo} />
          <Route path="/lightning-ethics" component={LightningEthicsPage} />
          <Route path="/ai-ethics-toolkit" component={AIEthicsToolkitPage} />
          <Route path="/ai-ethics-toolkit-v2" component={AIEthicsToolkitV2Page} />
          <Route path="/card-sort-demo" component={CardSortDemo} />
          <Route path="/slider-demo" component={SliderDemo} />
          <Route path="/matching-demo" component={MatchingDemo} />
          <Route path="/scenario-demo" component={ScenarioDemo} />
          <Route path="/activities-demo" component={ActivitiesDemo} />
          <ProtectedRoute path="/ai-ethics-v2" component={AIEthicsV2Course} />
          
          {/* Admin Panel - Public access with authentication check */}
          <Route path="/admin" component={AdminDashboard} />
          
          {/* Protected Routes */}
          <ProtectedRoute path="/dashboard" component={Dashboard} />
          <ProtectedRoute path="/roadmap" component={Roadmap} />
          <ProtectedRoute path="/catalog" component={Courses} />
          <ProtectedRoute path="/labhub" component={LabHub} />
          <ProtectedRoute path="/admin/lesson-structure" component={LessonStructurePage} />
          <ProtectedRoute path="/community" component={Community} />
          <ProtectedRoute path="/profile" component={Profile} />
          <ProtectedRoute path="/settings" component={Settings} />
          <ProtectedRoute path="/ai-tutor" component={AiTutorPage} />
          <ProtectedRoute path="/orbital-lobby" component={OrbitalLobby} />
          <ProtectedRoute path="/personal-dashboard" component={PersonalDashboardPage} />
          
          {/* Business AI Module Routes */}
          <ProtectedRoute path="/business" component={BusinessAIOverview} />
          <ProtectedRoute path="/business-ai" component={BusinessAIPage} />
          <ProtectedRoute path="/business/cases" component={CaseLibrary} />
          
          {/* Курсы с ИИ-ассистентом */}
          <ProtectedRoute path="/course-ai/:courseId?" component={CourseAI} />
          
          {/* Страница деталей курса - защищенный доступ */}
          <ProtectedRoute path="/course-details/:slug" component={CourseDetails} />
          
          {/* Детальная страница курса - защищенный доступ */}
          <ProtectedRoute path="/courses/:slug" component={CoursePage} />
          
          {/* Управление курсами */}
          <ProtectedRoute path="/course-management" component={CourseManagement} />
          
          {/* Knowledge Vault - Хранилище знаний */}
          <ProtectedRoute path="/knowledge-vault" component={KnowledgeVault} />
          
          {/* Карта навыков и учебный прогресс */}
          <Route path="/skills" component={SkillsPage} />
          
          {/* Страница экономии времени (S4 Time-Saved) */}
          <ProtectedRoute path="/time-saved" component={TimeSavedPageRoute} />
          
          {/* AI-ассистент */}
          <ProtectedRoute path="/ai-assistant" component={AIAssistantPage} />
          
          {/* AI Literacy 101 - Course with Lessons */}
          <ProtectedRoute path="/courses/ai-literacy-101" component={() => {
            // Используем реализацию подстраниц - основная страница курса
            return <AILiteracyCoursePage />;
          }} />

          {/* Telegram Bots Course */}
          <ProtectedRoute path="/courses/telegram-bots-replit" component={() => {
            const TelegramBotsCoursePage = lazy(() => import("@/pages/telegram-bots-course-page"));
            return (
              <Suspense fallback={<div>Загрузка...</div>}>
                <TelegramBotsCoursePage />
              </Suspense>
            );
          }} />

          {/* Make.com + ChatGPT Automation Course */}
          <ProtectedRoute path="/courses/make-chatgpt-automation" component={() => {
            const MakeAutomationCoursePage = lazy(() => import("@/pages/make-automation-course-page"));
            return (
              <Suspense fallback={<div>Загрузка...</div>}>
                <MakeAutomationCoursePage />
              </Suspense>
            );
          }} />
          
          {/* Lesson Page - универсальный для любого курса */}
          <ProtectedRoute path="/courses/:courseSlug/modules/:moduleId/lessons/:lessonId" component={() => {
            // Универсальный компонент урока без жестко заданного контекста
            return <LessonPage />;
          }} />
          
          {/* Lesson Page - внутри курса AI Literacy (обратная совместимость) */}
          <ProtectedRoute path="/courses/ai-literacy-101/modules/:moduleId/lessons/:lessonId" component={() => {
            // Загружаем компонент и не используем Suspense, чтобы избежать моргания
            return <LessonPage inCourseContext="ai-literacy-101" />;
          }} />
          
          {/* Карта компетенций курса */}
          <ProtectedRoute path="/courses/:slug/competency-map" component={CompetencyMapPage} />
          
          {/* Демонстрация новых шаблонов */}
          <ProtectedRoute path="/template-demo" component={TemplateDemoPage} />
          
          {/* Демонстрация No-Code AI симулятора */}
          <ProtectedRoute path="/simulator-demo" component={SimulatorDemoPage} />
          
          {/* Админ - управление структурой уроков (маршрут уже добавлен выше) */}
          
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

import React, { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/auth-context";
import { useAuth } from "@/context/auth-context";
import { UserProfileProvider } from "@/context/user-profile-context";
import { ParticlesBackground } from "@/components/particles-background";
import { SidebarProvider } from "@/components/layout/sidebar";
import { PWAInstallPrompt, MobilePWAInstallButton } from "@/components/pwa/install-prompt";
import { ConnectionStatus, PWAModeBadge } from "@/components/pwa/offline-status";
import HomePage from "@/pages/home-page";
import Login from "@/pages/login";
import Onboarding from "@/pages/onboarding";
import OnboardingPage from "@/pages/onboarding-page";
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
import KnowledgeVault from "@/pages/knowledge-vault";
import SkillsPage from "@/pages/skills-page";
import GapAnalysisPage from "@/pages/gap-analysis-page";

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
  const isPublicPage = location === "/" || location === "/login" || location === "/onboarding" || location === "/onboarding-page";
  
  return (
    <div className="flex flex-col min-h-screen">
      {!isPublicPage && <ParticlesBackground />}
      
      <main className="flex-grow">
        <Switch>
          {/* Публичные маршруты */}
          <Route path="/" component={HomePage} />
          <Route path="/login" component={Login} />
          <Route path="/onboarding" component={Onboarding} />
          <Route path="/onboarding-page" component={OnboardingPage} />
          
          {/* Protected Routes */}
          <ProtectedRoute path="/dashboard" component={Dashboard} />
          <ProtectedRoute path="/roadmap" component={Roadmap} />
          <ProtectedRoute path="/courses" component={Courses} />
          <ProtectedRoute path="/labhub" component={LabHub} />
          <ProtectedRoute path="/community" component={Community} />
          <ProtectedRoute path="/profile" component={Profile} />
          <ProtectedRoute path="/settings" component={Settings} />
          <ProtectedRoute path="/orbital-lobby" component={OrbitalLobby} />
          
          {/* Business AI Module Routes */}
          <ProtectedRoute path="/business" component={BusinessAIOverview} />
          <ProtectedRoute path="/business/cases" component={CaseLibrary} />
          
          {/* Курсы с ИИ-ассистентом */}
          <ProtectedRoute path="/course-ai/:courseId?" component={CourseAI} />
          
          {/* Детальная страница курса */}
          <ProtectedRoute path="/courses/:slug" component={CoursePage} />
          
          {/* Knowledge Vault - Хранилище знаний */}
          <ProtectedRoute path="/knowledge-vault" component={KnowledgeVault} />
          
          {/* Карта навыков и учебный прогресс */}
          <Route path="/skills" component={SkillsPage} />
          
          {/* Gap-анализ навыков */}
          <ProtectedRoute path="/gap-analysis" component={GapAnalysisPage} />
          
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserProfileProvider>
          <SidebarProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
              <PWAInstallPrompt />
              <MobilePWAInstallButton />
              <ConnectionStatus />
              <PWAModeBadge />
            </TooltipProvider>
          </SidebarProvider>
        </UserProfileProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

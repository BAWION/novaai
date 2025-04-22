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
import Login from "@/pages/login";
import Onboarding from "@/pages/onboarding";
import OrbitalLobby from "@/pages/orbital-lobby";
import Dashboard from "@/pages/dashboard";
import Roadmap from "@/pages/roadmap";
import Courses from "@/pages/courses";
import LabHub from "@/pages/labhub";
import Community from "@/pages/community";
import Profile from "@/pages/profile";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

interface ProtectedRouteProps {
  component: React.ComponentType;
  path: string;
}

// Protected route component
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, path }) => {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  
  // Проверяем авторизацию и перенаправляем при необходимости
  if (!isAuthenticated) {
    // Перенаправляем на страницу авторизации
    setTimeout(() => setLocation("/login"), 0);
    return null;
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
  
  // Check if we're on the login page or other public pages
  const isPublicPage = location === "/login" || location === "/onboarding";
  
  return (
    <div className="flex flex-col min-h-screen">
      {!isPublicPage && <ParticlesBackground />}
      
      <main className="flex-grow">
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/onboarding" component={Onboarding} />
          
          {/* Protected Routes */}
          <ProtectedRoute path="/" component={Dashboard} />
          <ProtectedRoute path="/dashboard" component={Dashboard} />
          <ProtectedRoute path="/roadmap" component={Roadmap} />
          <ProtectedRoute path="/courses" component={Courses} />
          <ProtectedRoute path="/labhub" component={LabHub} />
          <ProtectedRoute path="/community" component={Community} />
          <ProtectedRoute path="/profile" component={Profile} />
          <ProtectedRoute path="/settings" component={Settings} />
          <ProtectedRoute path="/orbital-lobby" component={OrbitalLobby} />
          
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
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </UserProfileProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

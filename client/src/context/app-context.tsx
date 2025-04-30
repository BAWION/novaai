import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./auth-context";
import { useUserProfile } from "./user-profile-context";
import { useTracking } from "./tracking-context";
import { useEventLogging } from "@/hooks/use-event-logging";
import { apiRequest } from "@/lib/queryClient";

/**
 * Центральный контекст приложения, объединяющий все подконтексты
 * и обеспечивающий единую точку доступа к данным
 */
interface AppContextType {
  // Auth State
  auth: {
    isAuthenticated: boolean;
    user: any; // Используем типы из auth-context
    login: (user: any) => void;
    logout: () => void;
    isLoading: boolean;
  };
  
  // User Profile
  profile: {
    data: any; // Используем типы из user-profile-context
    isLoading: boolean;
    error: Error | null;
    updateProfile: (data: any) => Promise<void>;
  };
  
  // Course Management
  courses: {
    allCourses: any[];
    isLoading: boolean;
    error: Error | null;
    userCourses: any[];
    recommended: any[];
    fetchCourse: (id: number) => Promise<any>;
    filterCourses: (filters: Record<string, any>) => any[];
  };
  
  // Learning Management
  learning: {
    progress: any[];
    isLoading: boolean;
    error: Error | null;
    updateProgress: (courseId: number, data: any) => Promise<void>;
    completedLessons: number[];
    lastAccessed: any | null;
  };
  
  // Diagnosis & Skills
  skills: {
    userSkills: any[];
    isLoading: boolean;
    assessmentResults: any | null;
    updateSkills: (skills: any[]) => Promise<void>;
  };
  
  // Tracking
  tracking: {
    trackEvent: (eventType: string, data?: Record<string, any>) => void;
    trackPageView: (pageName: string) => void;
    trackCourseView: (courseId: number, courseName: string) => void;
  };
  
  // App State
  appState: {
    sidebarOpen: boolean;
    toggleSidebar: () => void;
    theme: "light" | "dark"; 
    setTheme: (theme: "light" | "dark") => void;
    lastNotification: string | null;
  };
  
  // Global Loading State
  isAppLoading: boolean;
  
  // Global Error Handling
  appError: Error | null;
  clearError: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  
  // Интеграция с существующими контекстами
  const { isAuthenticated, user, login, logout } = useAuth();
  const { userProfile, updateUserProfile } = useUserProfile();
  const tracking = useTracking();
  const { logEvent } = useEventLogging();
  
  // App State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [lastNotification, setLastNotification] = useState<string | null>(null);
  const [appError, setAppError] = useState<Error | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  
  // Courses Queries
  const { 
    data: allCourses = [] as any[],
    isLoading: isCoursesLoading,
    error: coursesError
  } = useQuery<any[]>({
    queryKey: ['/api/courses'],
    enabled: true, // Всегда загружаем курсы
  });
  
  // User Courses (если пользователь авторизован)
  const {
    data: userCourses = [] as any[],
    isLoading: isUserCoursesLoading,
    error: userCoursesError
  } = useQuery<any[]>({
    queryKey: ['/api/courses/user', user?.id],
    enabled: !!user?.id,
  });
  
  // Рекомендуемые курсы для пользователя
  const {
    data: recommendedCourses = [] as any[],
    isLoading: isRecommendedLoading,
    error: recommendedError
  } = useQuery<any[]>({
    queryKey: ['/api/courses/recommended', user?.id],
    enabled: !!user?.id,
  });
  
  // Прогресс обучения пользователя
  const {
    data: learningProgress = [] as any[],
    isLoading: isProgressLoading,
    error: progressError
  } = useQuery<any[]>({
    queryKey: ['/api/learning/progress', user?.id],
    enabled: !!user?.id,
  });
  
  // Навыки пользователя
  const {
    data: userSkills = [] as any[],
    isLoading: isSkillsLoading,
    error: skillsError
  } = useQuery<any[]>({
    queryKey: ['/api/skills/user', user?.id],
    enabled: !!user?.id,
  });
  
  // Последнее доступное обучение
  const {
    data: lastAccessed = null,
    isLoading: isLastAccessedLoading
  } = useQuery<any | null>({
    queryKey: ['/api/learning/last-accessed', user?.id],
    enabled: !!user?.id,
  });
  
  // Результаты диагностики навыков
  const {
    data: assessmentResults = null,
    isLoading: isAssessmentLoading
  } = useQuery<any | null>({
    queryKey: ['/api/diagnosis/results', user?.id],
    enabled: !!user?.id,
  });
  
  // Вычисляем общее состояние загрузки приложения
  const isAppLoading = 
    isCoursesLoading || 
    isUserCoursesLoading || 
    isRecommendedLoading || 
    isProgressLoading || 
    isSkillsLoading || 
    isLastAccessedLoading || 
    isAssessmentLoading ||
    isAuthLoading;
  
  // Вычисляем пройденные уроки на основе прогресса
  const completedLessons = Array.isArray(learningProgress) 
    ? learningProgress
        .filter((progress: any) => progress.completed)
        .map((progress: any) => progress.lessonId)
    : [];
  
  // Методы для работы с курсами
  const fetchCourse = async (id: number) => {
    try {
      const response = await apiRequest("GET", `/api/courses/${id}`);
      const course = await response.json();
      return course;
    } catch (error: any) {
      setAppError(error);
      throw error;
    }
  };
  
  const filterCourses = (filters: Record<string, any>) => {
    if (!Array.isArray(allCourses)) return [];
    
    return (allCourses as any[]).filter((course: any) => {
      let match = true;
      
      // Проверяем каждый фильтр
      for (const [key, value] of Object.entries(filters)) {
        if (value === null || value === undefined) continue;
        
        if (Array.isArray(course[key])) {
          // Если свойство - массив (например, tags)
          if (Array.isArray(value)) {
            // Если хотя бы одно значение совпадает
            match = match && value.some(v => course[key].includes(v));
          } else {
            match = match && course[key].includes(value);
          }
        } else if (typeof value === 'string' || typeof value === 'number') {
          match = match && course[key] === value;
        }
      }
      
      return match;
    });
  };
  
  // Методы для обновления прогресса
  const updateProgress = async (courseId: number, data: any) => {
    try {
      const response = await apiRequest("PATCH", `/api/learning/progress/${courseId}`, data);
      const updatedProgress = await response.json();
      
      // Инвалидируем кеш для обновления данных
      queryClient.invalidateQueries({ queryKey: ['/api/learning/progress', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['/api/learning/last-accessed', user?.id] });
      
      return updatedProgress;
    } catch (error: any) {
      setAppError(error);
      throw error;
    }
  };
  
  // Методы для обновления навыков
  const updateSkills = async (skills: any[]) => {
    try {
      const response = await apiRequest("POST", "/api/skills/update", { skills });
      const updatedSkills = await response.json();
      
      // Инвалидируем соответствующие кеши
      queryClient.invalidateQueries({ queryKey: ['/api/skills/user', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['/api/courses/recommended', user?.id] });
      
      return updatedSkills;
    } catch (error: any) {
      setAppError(error);
      throw error;
    }
  };
  
  // Обновление профиля через единую точку входа
  const updateProfile = async (data: any) => {
    try {
      // Используем существующий метод из контекста профиля
      updateUserProfile(data);
      
      // Инвалидируем все зависимые запросы
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
      queryClient.invalidateQueries({ queryKey: ['/api/courses/recommended', user?.id] });
    } catch (error: any) {
      setAppError(error);
      throw error;
    }
  };
  
  // Методы для трекинга через унифицированный интерфейс
  const trackEvent = (eventType: string, data?: Record<string, any>) => {
    tracking.trackEvent(eventType, data);
  };
  
  const trackPageView = (pageName: string) => {
    tracking.pageView(pageName);
  };
  
  const trackCourseView = (courseId: number, courseName: string) => {
    tracking.trackCourseView(courseId, courseName);
  };
  
  // Управление сайдбаром
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };
  
  // Очистка ошибок
  const clearError = () => {
    setAppError(null);
  };
  
  // Собираем все в единый контекст
  const appContextValue: AppContextType = {
    auth: {
      isAuthenticated,
      user,
      login,
      logout,
      isLoading: isAuthLoading
    },
    
    profile: {
      data: userProfile,
      isLoading: false, // Состояние загрузки из useUserProfile не экспортируется
      error: null, // Ошибки из useUserProfile не экспортируются
      updateProfile
    },
    
    courses: {
      allCourses: allCourses as any[],
      isLoading: isCoursesLoading,
      error: coursesError as Error | null,
      userCourses: userCourses as any[],
      recommended: recommendedCourses as any[],
      fetchCourse,
      filterCourses
    },
    
    learning: {
      progress: learningProgress as any[],
      isLoading: isProgressLoading,
      error: progressError as Error | null,
      updateProgress,
      completedLessons,
      lastAccessed
    },
    
    skills: {
      userSkills: userSkills as any[],
      isLoading: isSkillsLoading,
      assessmentResults,
      updateSkills
    },
    
    tracking: {
      trackEvent,
      trackPageView,
      trackCourseView
    },
    
    appState: {
      sidebarOpen,
      toggleSidebar,
      theme,
      setTheme,
      lastNotification
    },
    
    isAppLoading,
    appError,
    clearError
  };

  return (
    <AppContext.Provider value={appContextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

// Вспомогательные хуки для удобного доступа к отдельным частям контекста
export function useAppAuth() {
  return useApp().auth;
}

export function useAppProfile() {
  return useApp().profile;
}

export function useAppCourses() {
  return useApp().courses;
}

export function useAppLearning() {
  return useApp().learning;
}

export function useAppSkills() {
  return useApp().skills;
}

export function useAppTracking() {
  return useApp().tracking;
}

export function useAppState() {
  return useApp().appState;
}
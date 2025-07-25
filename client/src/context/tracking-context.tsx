import { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from 'react';
import { useLocation } from 'wouter';
import { useEventLogging } from '@/hooks/use-event-logging';


interface TrackingContextType {
  trackEvent: (eventType: string, data?: Record<string, any>) => void;
  pageView: (pageName: string, data?: Record<string, any>) => void;
  trackCourseView: (courseId: number, courseName: string) => void;
  trackCourseStart: (courseId: number, courseName: string) => void;
  trackModuleView: (moduleId: number, moduleName: string, courseId?: number) => void;
  trackLessonView: (lessonId: number, lessonName: string, moduleId?: number, courseId?: number) => void;
  trackLessonComplete: (lessonId: number, lessonName: string, moduleId?: number, courseId?: number) => void;
  trackQuizAttempt: (quizId: number, quizName: string, score: number, isPassed: boolean) => void;
  trackButtonClick: (buttonName: string, data?: Record<string, any>) => void;
  trackSearch: (query: string, resultsCount: number) => void;
  trackFeatureUse: (featureName: string, data?: Record<string, any>) => void;
}

const TrackingContext = createContext<TrackingContextType | null>(null);

export const TrackingProvider = ({ children }: { children: ReactNode }) => {
  const { logEvent } = useEventLogging();
  const [location] = useLocation();
  const [previousLocation, setPreviousLocation] = useState<string | null>(null);
  
  // Отслеживание изменения страницы
  useEffect(() => {
    if (location !== previousLocation) {
      const pageName = getPageNameFromPath(location);
      pageView(pageName, { path: location });
      setPreviousLocation(location);
    }
  }, [location]);
  
  // Вспомогательная функция для получения имени страницы из пути
  const getPageNameFromPath = (path: string): string => {
    if (path === '/') return 'home';
    
    // Удаляем начальный слеш и параметры запроса
    let pageName = path.substring(1).split('?')[0];
    
    // Если есть идентификатор в пути (например, /courses/123), обрабатываем его
    const parts = pageName.split('/');
    if (parts.length > 1 && !isNaN(parseInt(parts[1]))) {
      pageName = `${parts[0]}_detail`;
    }
    
    return pageName;
  };
  
  // Основная функция для отслеживания событий
  const trackEvent = (eventType: string, data: Record<string, any> = {}) => {
    logEvent(eventType, {
      ...data,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      // Добавляем информацию о пользователе (если доступна)
      userRole: 'anonymous' // Упрощено для избежания циклических зависимостей
    });
  };
  
  // Отслеживание просмотра страницы
  const pageView = (pageName: string, data: Record<string, any> = {}) => {
    trackEvent('page_view', {
      ...data,
      pageName,
    });
  };
  
  // Отслеживание просмотра курса
  const trackCourseView = (courseId: number, courseName: string) => {
    trackEvent('course_view', {
      courseId,
      courseName,
      entityType: 'course',
      entityId: courseId
    });
  };
  
  // Отслеживание начала курса
  const trackCourseStart = (courseId: number, courseName: string) => {
    trackEvent('course_start', {
      courseId,
      courseName,
      entityType: 'course',
      entityId: courseId
    });
  };
  
  // Отслеживание просмотра модуля
  const trackModuleView = (moduleId: number, moduleName: string, courseId?: number) => {
    trackEvent('module_view', {
      moduleId,
      moduleName,
      courseId,
      entityType: 'module',
      entityId: moduleId
    });
  };
  
  // Отслеживание просмотра урока
  const trackLessonView = (lessonId: number, lessonName: string, moduleId?: number, courseId?: number) => {
    trackEvent('lesson_view', {
      lessonId,
      lessonName,
      moduleId,
      courseId,
      entityType: 'lesson',
      entityId: lessonId
    });
  };
  
  // Отслеживание завершения урока
  const trackLessonComplete = (lessonId: number, lessonName: string, moduleId?: number, courseId?: number) => {
    trackEvent('lesson_complete', {
      lessonId,
      lessonName,
      moduleId,
      courseId,
      entityType: 'lesson',
      entityId: lessonId
    });
  };
  
  // Отслеживание попытки прохождения квиза
  const trackQuizAttempt = (quizId: number, quizName: string, score: number, isPassed: boolean) => {
    trackEvent('quiz_attempt', {
      quizId,
      quizName,
      score,
      isPassed,
      entityType: 'quiz',
      entityId: quizId
    });
  };
  
  // Отслеживание клика по кнопке
  const trackButtonClick = (buttonName: string, data: Record<string, any> = {}) => {
    trackEvent('button_click', {
      ...data,
      buttonName,
    });
  };
  
  // Отслеживание поиска
  const trackSearch = (query: string, resultsCount: number) => {
    trackEvent('search', {
      query,
      resultsCount,
    });
  };
  
  // Отслеживание использования функций
  const trackFeatureUse = (featureName: string, data: Record<string, any> = {}) => {
    trackEvent('feature_use', {
      ...data,
      featureName,
    });
  };
  
  // Создадим объект контекста
  const trackingContextValue: TrackingContextType = {
    trackEvent,
    pageView,
    trackCourseView,
    trackCourseStart,
    trackModuleView,
    trackLessonView,
    trackLessonComplete,
    trackQuizAttempt,
    trackButtonClick,
    trackSearch,
    trackFeatureUse
  };
  
  // Устанавливаем глобальный контекст для отладки
  setGlobalTrackingContext(trackingContextValue);
  
  return (
    <TrackingContext.Provider value={trackingContextValue}>
      {children}
    </TrackingContext.Provider>
  );
};

export const useTracking = () => {
  const context = useContext(TrackingContext);
  if (!context) {
    throw new Error('useTracking must be used within a TrackingProvider');
  }
  return context;
};

// Вспомогательная функция для экспорта трекера в глобальную область для тестирования
let globalTrackingContext: TrackingContextType | null = null;

export const setGlobalTrackingContext = (context: TrackingContextType) => {
  globalTrackingContext = context;
  // Добавляем в глобальный объект window для доступа из консоли
  if (typeof window !== 'undefined') {
    (window as any).novaTracking = globalTrackingContext;
  }
};
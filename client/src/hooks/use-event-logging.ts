import { useCallback } from 'react';

export interface EventData {
  eventType: string;
  data?: Record<string, any>;
}

export function useEventLogging() {
  const logEvent = useCallback(async (eventData: EventData) => {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        console.warn('Failed to log event:', eventData.eventType);
      }
    } catch (error) {
      console.error('Event logging error:', error);
    }
  }, []);

  const logPageView = useCallback((pageName: string, additionalData?: Record<string, any>) => {
    logEvent({
      eventType: 'page_view',
      data: {
        path: window.location.pathname,
        pageName,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        ...additionalData
      }
    });
  }, [logEvent]);

  const logUserAction = useCallback((action: string, details?: Record<string, any>) => {
    logEvent({
      eventType: 'user_action',
      data: {
        action,
        timestamp: new Date().toISOString(),
        path: window.location.pathname,
        ...details
      }
    });
  }, [logEvent]);

  return {
    logEvent,
    logPageView,
    logUserAction
  };
}

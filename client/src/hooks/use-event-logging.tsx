import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";

export type EventData = {
  eventType: string;
  data: Record<string, any>;
};

/**
 * Хук для логирования событий на стороне клиента
 * Позволяет записывать события для аналитики и метрик
 */
export function useEventLogging() {
  const { user } = useAuth();
  
  const logEventMutation = useMutation({
    mutationFn: async (eventData: EventData) => {
      // Добавляем userId из текущей сессии, если пользователь авторизован
      const event = {
        ...eventData,
        userId: user?.id,
      };
      
      const res = await apiRequest("POST", "/api/events", event);
      return await res.json();
    },
    onError: (error) => {
      // В случае ошибки только записываем ее в консоль, не показываем
      // пользователю, чтобы не прерывать его взаимодействие с приложением
      console.error("Error logging event:", error);
    },
  });
  
  /**
   * Функция для логирования событий
   * @param eventType Тип события (например, "page_view", "button_click", "course_start")
   * @param data Дополнительные данные о событии
   */
  const logEvent = async (eventType: string, data: Record<string, any> = {}) => {
    try {
      await logEventMutation.mutateAsync({
        eventType,
        data,
      });
    } catch (error) {
      // Ошибка уже обрабатывается в onError
    }
  };
  
  return { logEvent };
}
import { useCallback } from "react";
import { useUserProfile } from "@/context/user-profile-context";
import { apiRequest } from "@/lib/queryClient";

/**
 * Хук для логирования событий
 * Используется для отслеживания действий пользователя
 * и отправки их на сервер
 */
export function useEventLogger() {
  const { userProfile } = useUserProfile();

  /**
   * Функция для логирования события
   * @param eventType Тип события
   * @param data Дополнительные данные
   */
  const logEvent = useCallback(
    async (eventType: string, data: Record<string, any> = {}) => {
      try {
        const userId = userProfile?.userId;
        const eventData = {
          eventType,
          data: {
            ...data,
            timestamp: new Date().toISOString(),
            userRole: userId ? "authenticated" : "anonymous",
          },
        };

        await apiRequest("POST", "/api/events", eventData);
      } catch (error) {
        console.error("Failed to log event:", error);
      }
    },
    [userProfile?.userId]
  );

  return { logEvent };
}
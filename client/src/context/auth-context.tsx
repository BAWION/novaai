import React, { createContext, useState, useContext, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: number;
  username: string;
  displayName?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        console.log("AuthProvider: проверка статуса аутентификации...");
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include", // Важно для работы с сессией
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        });
        
        // Проверяем ответ на успешность
        if (response.ok) {
          const userData = await response.json();
          console.log("AuthProvider: пользователь авторизован:", userData);
          setUser(userData);
        } else {
          console.log("AuthProvider: пользователь не авторизован, статус:", response.status);
          setUser(null);
        }
      } catch (error) {
        // Ошибка сервера или сети
        console.error("AuthProvider: ошибка при проверке авторизации:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (userData: User) => {
    // Сначала устанавливаем пользователя локально для быстрого отклика UI
    setUser(userData);
    
    // При этом мы НЕ синхронизируем с сервером здесь:
    // синхронизация с сервером происходит в самом компоненте Login,
    // который вызывает API и только после успешного ответа вызывает login()
    
    // Проверяем наличие кэшированных результатов диагностики и восстанавливаем их
    try {
      // Динамический импорт для избежания циклических зависимостей
      const { diagnosisApi } = await import("@/api/diagnosis-api");
      
      if (diagnosisApi.hasCachedDiagnosticResults()) {
        console.log("[Auth] Обнаружены кэшированные результаты диагностики, начинаем восстановление...");
        
        // Небольшая задержка для завершения процесса авторизации
        setTimeout(async () => {
          try {
            const result = await diagnosisApi.recoverCachedResults(userData.id);
            if (result) {
              console.log("[Auth] Кэшированные результаты диагностики успешно восстановлены");
              
              // Логируем событие успешного восстановления
              await diagnosisApi.logDiagnosticEvent('diagnosis_cache_restored', {
                userId: userData.id,
                restoredAt: new Date().toISOString()
              });
            }
          } catch (error) {
            console.error("[Auth] Ошибка при восстановлении кэшированных результатов:", error);
            
            // Логируем ошибку восстановления
            await diagnosisApi.logDiagnosticEvent('diagnosis_cache_restore_failed', {
              userId: userData.id,
              error: error.message,
              failedAt: new Date().toISOString()
            });
          }
        }, 1000);
      }
    } catch (error) {
      console.error("[Auth] Ошибка при проверке кэшированных результатов:", error);
    }
  };

  const logout = async () => {
    try {
      console.log("AuthProvider: выполняем выход из системы...");
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // Важно для работы с сессией
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      });
      
      if (response.ok) {
        console.log("AuthProvider: успешный выход из системы");
      } else {
        console.error("AuthProvider: ошибка при выходе из системы:", response.status);
      }
    } catch (error) {
      console.error("AuthProvider: ошибка при выходе из системы:", error);
    }
    
    // В любом случае, очищаем локальное состояние пользователя
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        login,
        logout,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

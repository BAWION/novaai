import React, { createContext, useState, useContext, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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
  refreshAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
  refreshAuth: async () => false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Функция для проверки аутентификации, может вызываться из компонентов
  const refreshAuth = async (): Promise<boolean> => {
    try {
      console.log("AuthProvider: обновление статуса аутентификации...");
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
        return true;
      } else {
        console.log("AuthProvider: пользователь не авторизован, статус:", response.status);
        setUser(null);
        return false;
      }
    } catch (error) {
      // Ошибка сервера или сети
      console.error("AuthProvider: ошибка при проверке авторизации:", error);
      setUser(null);
      return false;
    }
  };

  useEffect(() => {
    // При старте приложения проверяем аутентификацию
    const checkAuth = async () => {
      try {
        await refreshAuth();
      } catch (error) {
        console.error("Ошибка при первичной проверке аутентификации:", error);
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
        refreshAuth,
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

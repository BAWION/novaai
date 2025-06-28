import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { API_BASE_URL } from "./constants";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  console.log(`API Request: ${method} ${url}`, data || '');
  
  try {
    // Расширенное логирование состояния документа и кук для отладки проблем аутентификации
    console.log(`[API-DEBUG] Cookies при отправке запроса:`, document.cookie ? document.cookie : 'нет кук');
    
    // Обеспечиваем полный URL для API запросов
    const fullUrl = url.startsWith('/api/') ? `${API_BASE_URL}${url}` : url;
    
    const res = await fetch(fullUrl, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include", // Всегда включаем куки в запросы
    });

    console.log(`API Response: ${method} ${url} - Status: ${res.status} ${res.statusText}`);
    console.log(`[API-DEBUG] Заголовки ответа для ${method} ${url}:`, 
      Array.from(res.headers.entries()).map(([key, value]) => `${key}: ${value}`).join(', '));
    
    if (!res.ok) {
      console.error(`API Error: ${method} ${url} - Status: ${res.status} ${res.statusText}`);
      // Клонируем ответ, чтобы можно было прочитать тело для логирования, но оставить для обработки ошибки
      const clonedRes = res.clone();
      try {
        const errorBody = await clonedRes.text();
        console.error('Error body:', errorBody);
      } catch (e) {
        console.error('Could not read error body');
      }
    }

    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    console.error(`API Request Failed: ${method} ${url}`, error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;
    const fullUrl = url.startsWith('/api/') ? `${API_BASE_URL}${url}` : url;
    
    const res = await fetch(fullUrl, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

import { QueryClient, QueryFunction } from "@tanstack/react-query";

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
    
    const res = await fetch(url, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include", // Всегда включаем куки в запросы
    });

    console.log(`API Response: ${method} ${url} - Status: ${res.status} ${res.statusText}`);
    console.log(`[API-DEBUG] Заголовки ответа для ${method} ${url}:`, 
      Array.from(res.headers.entries()).map(([key, value]) => `${key}: ${value}`).join(', '));
    
    if (!res.ok) {
      // Don't log 404 errors for profile endpoints as critical - they're expected for new users
      if (res.status === 404 && url.includes('/api/profile')) {
        console.log(`[Profile] Профиль не найден для ${url}, создаем базовый`);
      } else {
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
    }

    await throwIfResNotOk(res);
    return res;
  } catch (error: any) {
    // Don't log 404 profile errors as failures - they're expected for new users
    if (error?.message?.includes('404') && url.includes('/api/profile')) {
      console.log(`[Profile] Ожидаемая 404 ошибка для ${url} (новый пользователь)`);
    } else {
      console.error(`API Request Failed: ${method} ${url}`, error);
    }
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
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

/**
 * Клиентская утилита для работы с API
 */

/**
 * Создает запрос к API
 * @param method HTTP метод
 * @param endpoint Адрес API
 * @param data Данные запроса (для POST, PUT, PATCH)
 * @returns Promise с результатом запроса
 */
export async function apiRequest(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  endpoint: string,
  data?: any
): Promise<Response> {
  const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  
  const options: RequestInit = {
    method,
    headers,
    credentials: 'include'
  };
  
  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(data);
  }
  
  try {
    console.log(`API Request: ${method} ${url}`, data || '');
    const response = await fetch(url, options);
    
    console.log(`API Response: ${method} ${url} - Status: ${response.status} ${response.statusText}`);
    
    if (!response.ok && response.status !== 304) {
      let errorBody = '';
      try {
        errorBody = await response.text();
        console.log('Error body:', errorBody);
      } catch (e) {
        // Если не удалось прочитать тело ответа, просто игнорируем
      }
      
      console.error(`API Request Failed: ${method} ${url}`, data);
      
      // Если ответ - JSON, возвращаем его
      if (errorBody && errorBody.startsWith('{')) {
        try {
          const errorJson = JSON.parse(errorBody);
          const errorMessage = errorJson.message || errorJson.error || 'Неизвестная ошибка';
          throw new Error(errorMessage);
        } catch (jsonError) {
          // Если не удалось распарсить JSON, возвращаем статус
          throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
        }
      } else {
        // Если ответ не JSON, возвращаем статус
        throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
      }
    }
    
    return response;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}
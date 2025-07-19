import { useEffect, useRef } from 'react';

interface VKIDButtonProps {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

declare global {
  interface Window {
    VKIDSDK: any;
  }
}

export function VKIDButton({ onSuccess, onError }: VKIDButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Загружаем VK ID SDK
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@vkid/sdk@<3.0.0/dist-sdk/umd/index.js';
    script.onload = initVKID;
    document.head.appendChild(script);

    function initVKID() {
      if ('VKIDSDK' in window && containerRef.current) {
        const VKID = window.VKIDSDK;

        // Определяем redirect URL в зависимости от среды
        const isProduction = window.location.hostname === 'www.galaxion.ai' || window.location.hostname === 'galaxion.ai';
        const redirectUrl = isProduction 
          ? 'https://www.galaxion.ai/auth/vk/callback'
          : `${window.location.origin}/auth/vk/callback`;

        VKID.Config.init({
          app: 53936548,
          redirectUrl: redirectUrl,
          responseMode: VKID.ConfigResponseMode.Callback,
          source: VKID.ConfigSource.LOWCODE,
          scope: '', // Без email scope для начала
        });

        const oneTap = new VKID.OneTap();

        oneTap.render({
          container: containerRef.current,
          showAlternativeLogin: true
        })
        .on(VKID.WidgetEvents.ERROR, (error: any) => {
          console.error('[VK ID] Ошибка виджета:', error);
          onError?.(error);
        })
        .on(VKID.OneTapInternalEvents.LOGIN_SUCCESS, async function (payload: any) {
          console.log('[VK ID] Успешная авторизация:', payload);
          
          const code = payload.code;
          const deviceId = payload.device_id;

          try {
            // Обмениваем код на токен через VK ID SDK
            console.log('[VK ID SDK] Начинаем обмен кода на токены...');
            const data = await VKID.Auth.exchangeCode(code, deviceId);
            console.log('[VK ID SDK] Обмен кода успешен:', data);
            
            // Безопасная проверка структуры данных
            try {
              console.log('[VK ID SDK] Структура полученных данных:', Object.keys(data));
              console.log('[VK ID SDK] Тип данных:', typeof data);
            } catch (keyError) {
              console.error('[VK ID SDK] Ошибка при анализе ключей:', keyError);
            }
            
            // Проверяем, что у нас есть access_token
            if (!data || !data.access_token) {
              console.error('[VK ID SDK] Отсутствует access_token. Данные:', data);
              throw new Error('Нет access_token в ответе VK ID SDK');
            }
            
            console.log('[VK ID SDK] access_token найден, продолжаем...');
            
            // Подготавливаем данные в правильном формате для сервера
            const authData = {
              access_token: data.access_token,
              refresh_token: data.refresh_token,
              id_token: data.id_token,
              user_id: data.user_id,
              expires_in: data.expires_in,
              token_type: data.token_type,
              scope: data.scope,
              state: data.state
            };
            
            console.log('[VK ID SDK] Отправляем данные на backend:', authData);
            console.log('[VK ID SDK] URL для запроса:', window.location.origin + '/api/vk/auth');
            
            // Отправляем данные на наш backend
            console.log('[VK ID SDK] Начинаем fetch запрос...');
            const response = await fetch('/api/vk/auth', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include', // Важно для сессий
              body: JSON.stringify(authData)
            });
            
            console.log('[VK ID SDK] Fetch запрос выполнен, статус:', response.status);

            if (response.ok) {
              const result = await response.json();
              console.log('[VK ID SDK] Backend ответ успешен:', result);
              onSuccess?.(result);
              
              // Перенаправляем в dashboard
              if (result.redirect) {
                window.location.href = result.redirect;
              }
            } else {
              const errorData = await response.text();
              console.error('[VK ID SDK] Backend ошибка:', response.status, errorData);
              throw new Error(`Backend authentication failed: ${response.status}`);
            }
          } catch (error) {
            console.error('[VK ID SDK] КРИТИЧЕСКАЯ ОШИБКА В ПРОЦЕССЕ АВТОРИЗАЦИИ:', error);
            console.error('[VK ID SDK] Тип ошибки:', typeof error);
            console.error('[VK ID SDK] Детали ошибки:', error instanceof Error ? error.message : String(error));
            
            if (error instanceof Error) {
              console.error('[VK ID SDK] Stack trace:', error.stack);
            }
            
            onError?.(error);
          }
        });
      }
    }

    return () => {
      // Cleanup
      const scripts = document.querySelectorAll('script[src*="@vkid/sdk"]');
      scripts.forEach(script => script.remove());
    };
  }, [onSuccess, onError]);

  return (
    <div>
      <div ref={containerRef} className="vk-id-button-container" />
      <style>{`
        .vk-id-button-container {
          margin: 10px 0;
        }
        .vk-id-button-container iframe {
          border-radius: 8px !important;
        }
      `}</style>
    </div>
  );
}
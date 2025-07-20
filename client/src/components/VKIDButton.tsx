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
  console.log('[DEBUG] 🔥 VKIDButton: НОВАЯ ВЕРСИЯ ЗАГРУЖЕНА - v2.0 🔥');
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
            console.log('[VK ID SDK] ✅ Обмен кода завершен успешно!');
            console.log('[VK ID SDK] 🔍 НАЧИНАЕМ ДИАГНОСТИКУ ПОСЛЕ ПОЛУЧЕНИЯ ТОКЕНОВ...');
            
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
            
            console.log('[VK ID SDK] Подготавливаем данные для backend...');
            
            // Безопасная подготовка данных
            let authData;
            try {
              authData = {
                access_token: data.access_token || null,
                refresh_token: data.refresh_token || null,
                id_token: data.id_token || null,
                source: 'vk_id_sdk'
              };
              console.log('[VK ID SDK] Данные подготовлены:', authData);
            } catch (dataError) {
              console.error('[VK ID SDK] Ошибка при подготовке данных:', dataError);
              throw new Error('Не удалось подготовить данные для backend');
            }
            
            console.log('[VK ID SDK] Отправляем запрос на backend...');
            console.log('[VK ID SDK] URL:', window.location.origin + '/api/vk/auth');
            
            // Отправляем данные на backend
            console.log('[VK ID SDK] Выполняем fetch запрос...');
            let response;
            try {
              response = await fetch('/api/vk/auth', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(authData)
              });
              console.log('[VK ID SDK] Fetch завершен, статус:', response.status);
            } catch (fetchError) {
              console.error('[VK ID SDK] Ошибка fetch запроса:', fetchError);
              throw new Error('Не удалось отправить запрос на сервер');
            }

            if (response.ok) {
              console.log('[VK ID SDK] Ответ успешный, парсим JSON...');
              const result = await response.json();
              console.log('[VK ID SDK] Backend ответ:', result);
              
              // Обновляем состояние авторизации
              console.log('[VK ID SDK] Обновляем кеш авторизации...');
              
              // Если есть onSuccess callback, вызываем его
              if (onSuccess) {
                console.log('[VK ID SDK] Вызываем onSuccess callback...');
                onSuccess(result);
              }
              
              console.log('[VK ID SDK] ✅ Авторизация завершена успешно!');
              
            } else {
              console.log('[VK ID SDK] Ответ с ошибкой, читаем текст...');
              const errorText = await response.text();
              console.error('[VK ID SDK] Backend ошибка:', response.status, errorText);
              throw new Error(`Backend ошибка: ${response.status} - ${errorText}`);
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

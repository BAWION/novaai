import React, { useEffect, useRef } from 'react';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';

interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

interface TelegramLoginProps {
  botUsername?: string;
  buttonSize?: 'large' | 'medium' | 'small';
  cornerRadius?: number;
  requestAccess?: boolean;
  usePic?: boolean;
  className?: string;
}

declare global {
  interface Window {
    TelegramLoginWidget: {
      dataOnauth: (user: TelegramUser) => void;
    };
  }
}

export function TelegramLogin({
  botUsername = "galaxion_auth_bot", // Замените на ваш bot username
  buttonSize = "large",
  cornerRadius = 10,
  requestAccess = true,
  usePic = true,
  className = ""
}: TelegramLoginProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleTelegramAuth = async (user: TelegramUser) => {
    try {
      console.log('[Telegram Login] Получены данные от Telegram:', user);
      
      const response = await fetch('/api/telegram/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('[Telegram Login] Успешная авторизация:', data);
        
        toast({
          title: "Добро пожаловать!",
          description: `Вы успешно вошли через Telegram как ${data.user.displayName}`,
        });

        // Обновляем контекст авторизации
        await login(data.user);
        
        // Перенаправляем на главную страницу
        window.location.href = '/dashboard';
      } else {
        console.error('[Telegram Login] Ошибка авторизации:', data);
        toast({
          title: "Ошибка входа",
          description: data.message || "Не удалось войти через Telegram",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('[Telegram Login] Ошибка при обработке:', error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при входе через Telegram",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    // Устанавливаем глобальный callback для Telegram
    window.TelegramLoginWidget = {
      dataOnauth: handleTelegramAuth
    };

    // Создаем скрипт для Telegram Login Widget
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', botUsername);
    script.setAttribute('data-size', buttonSize);
    script.setAttribute('data-corner-radius', cornerRadius.toString());
    script.setAttribute('data-request-access', requestAccess ? 'write' : '');
    script.setAttribute('data-userpic', usePic.toString());
    script.setAttribute('data-onauth', 'TelegramLoginWidget.dataOnauth(user)');
    script.async = true;

    // Добавляем скрипт в контейнер
    if (containerRef.current) {
      containerRef.current.innerHTML = ''; // Очищаем контейнер
      containerRef.current.appendChild(script);
    }

    return () => {
      // Очистка при размонтировании
      if (window.TelegramLoginWidget) {
        window.TelegramLoginWidget = undefined;
      }
    };
  }, [botUsername, buttonSize, cornerRadius, requestAccess, usePic]);

  return (
    <div className={`telegram-login-widget ${className}`}>
      <div ref={containerRef} />
    </div>
  );
}
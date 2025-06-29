import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { ParticlesBackground } from "@/components/particles-background";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { TelegramLogin } from "@/components/auth/telegram-login";

export default function Login() {
  const [location, navigate] = useLocation();
  const { login, isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");
  
  // Если пользователь уже авторизован и пытается открыть страницу логина,
  // автоматически перенаправляем его на главную страницу
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("Пользователь уже авторизован, перенаправление на dashboard");
      navigate("/dashboard");
    }
  }, [isAuthenticated, user, navigate]);

  // Функция для обработки Telegram авторизации
  const handleTelegramAuth = async (user: any) => {
    try {
      setIsLoggingIn(true);
      
      const response = await fetch('/api/telegram/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Ошибка авторизации через Telegram');
      }
      
      const userData = await response.json();
      
      login(userData.user);
      
      toast({
        title: "Успешный вход через Telegram",
        description: `Добро пожаловать, ${userData.user.displayName || userData.user.username}!`,
      });
      
      navigate("/dashboard");
    } catch (error) {
      console.error('Telegram auth error:', error);
      toast({
        variant: "destructive",
        title: "Ошибка входа через Telegram",
        description: "Не удалось авторизоваться через Telegram",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Инициализация Telegram Login Widget
  useEffect(() => {
    // Добавляем глобальную функцию для Telegram Widget
    (window as any).onTelegramAuth = handleTelegramAuth;
    
    // Загружаем скрипт Telegram Widget, если его еще нет
    if (!document.querySelector('script[src*="telegram-widget"]')) {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-widget.js?22';
      script.setAttribute('data-telegram-login', 'Galaxion_Auth_bot'); // Username вашего бота авторизации
      script.setAttribute('data-size', 'large');
      script.setAttribute('data-onauth', 'onTelegramAuth(user)');
      script.setAttribute('data-request-access', 'write');
      script.async = true;
      
      // Обработчик ошибки загрузки
      script.onerror = () => {
        console.log('[Telegram Widget] Ошибка загрузки - показываем fallback');
        const fallback = document.getElementById('telegram-fallback');
        if (fallback) {
          fallback.classList.remove('hidden');
        }
      };
      
      const container = document.getElementById('telegram-login-widget');
      if (container) {
        container.appendChild(script);
        
        // Добавляем стили для кастомизации Telegram кнопки
        script.onload = () => {
          setTimeout(() => {
            const style = document.createElement('style');
            style.id = 'telegram-custom-styles';
            style.textContent = `
              .telegram-button-container iframe {
                width: 100% !important;
                height: 50px !important;
                border-radius: 8px !important;
                border: none !important;
              }
              .telegram-button-container {
                width: 100% !important;
              }
            `;
            
            // Удаляем предыдущие стили если есть
            const existingStyle = document.getElementById('telegram-custom-styles');
            if (existingStyle) {
              existingStyle.remove();
            }
            
            document.head.appendChild(style);
          }, 100);
        };
        
        // Таймаут для показа fallback, если Widget не загрузился за 3 секунды
        setTimeout(() => {
          const iframe = container.querySelector('iframe');
          if (!iframe || iframe.src === 'about:blank') {
            console.log('[Telegram Widget] Таймаут загрузки - показываем fallback');
            const fallback = document.getElementById('telegram-fallback');
            if (fallback) {
              fallback.classList.remove('hidden');
            }
          }
        }, 3000);
      }
    }
    
    return () => {
      // Очистка при размонтировании
      delete (window as any).onTelegramAuth;
    };
  }, []);

  const handleStartJourney = () => {
    // Перенаправляем на страницу расширенного онбординга
    navigate("/onboarding");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleLoginSubmit = async (e: React.FormEvent | React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    // Проверяем, заполнены ли логин и пароль
    if (!credentials.username || !credentials.password) {
      setError("Пожалуйста, введите имя пользователя и пароль");
      toast({
        variant: "destructive",
        title: "Ошибка входа",
        description: "Пожалуйста, введите имя пользователя и пароль",
      });
      return;
    }
    
    console.log("Начинаем процесс входа с данными:", { username: credentials.username, hasPassword: !!credentials.password });
    setIsLoggingIn(true);
    setError("");

    try {
      // ИСПРАВЛЕННЫЙ ПОДХОД: Используем прямой fetch вместо apiRequest
      console.log("Отправляем запрос на /api/auth/login");
      
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include" // Важно для сессии
      });
      
      console.log("Получен ответ:", response.status, response.statusText);
      
      // Проверяем ответ
      if (!response.ok) {
        let errorMessage = "Ошибка входа";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error("Не удалось прочитать тело ошибки");
        }
        
        if (response.status === 401) {
          errorMessage = "Неверное имя пользователя или пароль";
        } else if (response.status === 500) {
          errorMessage = "Ошибка сервера. Пожалуйста, попробуйте позже";
          console.error("Серверная ошибка при входе:", errorMessage);
        }
        
        throw new Error(errorMessage);
      }
      
      // Парсим данные пользователя
      const userData = await response.json();
      console.log("Получены данные пользователя:", userData);
      
      // Обновляем состояние авторизации
      console.log("Обновляем состояние авторизации");
      login(userData);
      
      // Показываем сообщение об успешном входе
      toast({
        title: "Успешный вход",
        description: `Добро пожаловать, ${userData.displayName || userData.username}!`,
      });
      
      // Проверяем, есть ли сохраненный URL для перенаправления после авторизации
      const redirectAfterAuth = sessionStorage.getItem("redirectAfterAuth");
      const hasDiagnosticResults = sessionStorage.getItem("diagnosticResults");
      
      console.log("Проверяем перенаправление после авторизации:", { 
        redirectAfterAuth, 
        hasDiagnosticResults: !!hasDiagnosticResults 
      });
      
      // Если у нас есть сохраненные результаты диагностики и перенаправление
      if (redirectAfterAuth && hasDiagnosticResults) {
        console.log(`Обнаружены результаты диагностики! Перенаправляем на: ${redirectAfterAuth}`);
        
        toast({
          title: "Данные диагностики восстановлены",
          description: "Ваш прогресс с предыдущего шага сохранен. Вы можете продолжить с того же места.",
          duration: 5000,
        });
        
        // Удаляем запись о перенаправлении, но оставляем данные диагностики
        sessionStorage.removeItem("redirectAfterAuth");
        
        setTimeout(() => {
          console.log(`Перенаправляем на ${redirectAfterAuth}`);
          navigate(redirectAfterAuth);
        }, 1000);
      } else {
        // Стандартное перенаправление на dashboard
        console.log("Планируем стандартное перенаправление на /dashboard");
        setTimeout(() => {
          console.log("Перенаправляем на /dashboard");
          navigate("/dashboard");
        }, 1000);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error instanceof Error ? error.message : "Произошла ошибка при входе");
      
      toast({
        variant: "destructive",
        title: "Ошибка входа",
        description: error instanceof Error ? error.message : "Произошла ошибка при входе",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const toggleLoginForm = () => {
    setShowLoginForm(prev => !prev);
    setError("");
  };

  return (
    <div className="min-h-screen w-full flex flex-col">
      <ParticlesBackground />
      <section className="container mx-auto px-4 min-h-[80vh] flex flex-col items-center justify-center mt-16">
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-orbitron text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#B28DFF] via-[#8BE0F7] to-[#B28DFF]"
          >Galaxion</motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto"
          >
            Полностью автоматизированная платформа, где искусственный интеллект проектирует, обновляет и персонализирует ваше обучение
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Glassmorphism className="rounded-2xl p-6 md:p-8 w-full max-w-md relative overflow-hidden border-white/10" borderGradient>
            <div className="text-center mb-6">
              <h2 className="font-orbitron text-2xl font-semibold">
                Добро пожаловать
              </h2>
              <p className="text-white/60 mt-1">Начните свой путь в мир ИИ</p>
            </div>

            {!showLoginForm ? (
              <>
                <div className="mb-6">
                  {/* Контейнер для Telegram Login Widget */}
                  <div className="telegram-button-container">
                    <div id="telegram-login-widget" className="flex justify-center">
                      {/* Telegram Login Widget загружается здесь автоматически */}
                    </div>
                  </div>
                  
                  {/* Информационное сообщение при проблемах */}
                  <div id="telegram-fallback" className="hidden mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span>
                        <strong>Настройка Telegram бота</strong><br/>
                        Проверьте настройки домена в @BotFather
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center my-6">
                  <div className="flex-grow h-px bg-white/10"></div>
                  <span className="px-3 text-white/50 text-sm">или</span>
                  <div className="flex-grow h-px bg-white/10"></div>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={toggleLoginForm}
                    className="w-full bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] hover:from-[#4922B2] hover:to-[#1682A1] text-white py-3 px-4 rounded-lg font-medium transition duration-300 flex items-center justify-center tap-highlight-none btn-mobile"
                  >
                    <i className="fas fa-user mr-2"></i>
                    <span>Войти с паролем</span>
                  </button>

                  <button
                    onClick={handleStartJourney}
                    className="w-full border border-white/20 hover:bg-white/10 text-white py-3 px-4 rounded-lg font-medium transition duration-300 flex items-center justify-center tap-highlight-none btn-mobile"
                  >
                    <span>Начать знакомство</span>
                    <i className="fas fa-arrow-right ml-2"></i>
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-white/80 text-sm font-medium mb-1">
                    Имя пользователя
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={credentials.username}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white placeholder:text-white/50 focus:ring-2 focus:ring-[#6E3AFF]/50 focus:border-[#6E3AFF] transition-all"
                    placeholder="Введите имя пользователя"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-white/80 text-sm font-medium mb-1">
                    Пароль
                  </label>
                  <style>
                    {`
                      .colorful-password-login {
                        color: #9d4edd !important;
                        text-shadow: 0 0 8px rgba(157, 78, 221, 0.5);
                      }
                    `}
                  </style>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white placeholder:text-white/50 focus:ring-2 focus:ring-[#6E3AFF]/50 focus:border-[#6E3AFF] transition-all colorful-password-login"
                    placeholder="Введите пароль"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-sm text-white">
                    {error}
                  </div>
                )}

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={toggleLoginForm}
                    className="flex-1 border border-white/20 hover:bg-white/10 text-white py-2 px-4 rounded-lg transition duration-300 tap-highlight-none btn-mobile"
                    disabled={isLoggingIn}
                  >
                    Назад
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      console.log("Кнопка входа нажата напрямую");
                      handleLoginSubmit(e as any);
                    }}
                    className="flex-1 bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] hover:from-[#4922B2] hover:to-[#1682A1] text-white py-2 px-4 rounded-lg font-medium transition duration-300 flex items-center justify-center tap-highlight-none btn-mobile"
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Вход...
                      </>
                    ) : (
                      'Войти'
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 text-center text-white/50 text-sm">
              Ещё нет аккаунта?{" "}
              <span 
                className="text-[#B28DFF] hover:text-[#D2B8FF] cursor-pointer"
                onClick={() => navigate("/register")}
              >
                Зарегистрироваться
              </span>
            </div>
            
            <div className="mt-2 text-center text-white/50 text-sm">
              Создавая аккаунт, вы соглашаетесь с{" "}
              <span 
                className="text-[#B28DFF] hover:text-[#D2B8FF] cursor-pointer"
                onClick={() => navigate("/terms")}
              >
                условиями использования
              </span>
            </div>
            
            <div className="mt-4 text-center">
              <button
                onClick={() => navigate("/")}
                className="text-white/70 hover:text-white py-2 px-4 rounded-lg text-sm transition-all border border-white/10 hover:bg-white/5 inline-flex items-center"
              >
                <i className="fas fa-home mr-2"></i>
                Вернуться на главную
              </button>
            </div>
          </Glassmorphism>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <Glassmorphism className="p-4 rounded-xl flex items-center max-w-[280px]">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[#6E3AFF]/20 to-[#6E3AFF]/10 text-[#B28DFF]">
              <i className="fas fa-robot text-xl"></i>
            </div>
            <div className="ml-4">
              <h3 className="font-medium">ИИ-онбординг</h3>
              <p className="text-white/60 text-sm">Персональный план обучения</p>
            </div>
          </Glassmorphism>

          <Glassmorphism className="p-4 rounded-xl flex items-center max-w-[280px]">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[#2EBAE1]/20 to-[#2EBAE1]/10 text-[#8BE0F7]">
              <i className="fas fa-graduation-cap text-xl"></i>
            </div>
            <div className="ml-4">
              <h3 className="font-medium">Адаптивные треки</h3>
              <p className="text-white/60 text-sm">Учитывают ваш уровень</p>
            </div>
          </Glassmorphism>

          <Glassmorphism className="p-4 rounded-xl flex items-center max-w-[280px]">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[#FF3A8C]/20 to-[#FF3A8C]/10 text-[#FF3A8C]">
              <i className="fas fa-certificate text-xl"></i>
            </div>
            <div className="ml-4">
              <h3 className="font-medium">NFT-сертификаты</h3>
              <p className="text-white/60 text-sm">Подтверждение навыков</p>
            </div>
          </Glassmorphism>
        </motion.div>
      </section>
    </div>
  );
}

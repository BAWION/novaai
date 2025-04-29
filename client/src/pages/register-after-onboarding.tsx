import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { ParticlesBackground } from "@/components/particles-background";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/context/auth-context";
import { ChevronRight, UserPlus, Check, Lock } from "lucide-react";

export default function RegisterAfterOnboarding() {
  const [location, navigate] = useLocation();
  const { login, isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [isRegistering, setIsRegistering] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    displayName: ""
  });
  const [error, setError] = useState("");

  // Проверяем, есть ли данные онбординга
  const [onboardingData, setOnboardingData] = useState<any>(null);
  
  useEffect(() => {
    // Если пользователь уже авторизован, перенаправляем на дашборд
    if (isAuthenticated && user) {
      navigate("/dashboard");
      return;
    }
    
    // Загружаем данные онбординга из sessionStorage
    const savedData = sessionStorage.getItem("onboardingData");
    if (savedData) {
      try {
        setOnboardingData(JSON.parse(savedData));
      } catch (e) {
        console.error("Ошибка при парсинге данных онбординга:", e);
      }
    } else {
      // Если данных нет, перенаправляем на страницу онбординга
      navigate("/onboarding-page");
    }
  }, [isAuthenticated, user, navigate]);

  const toggleRegisterForm = () => {
    setShowRegisterForm(!showRegisterForm);
    setError("");
  };

  const handleTelegramLogin = () => {
    // Здесь будет логика для входа через Telegram
    // ...
    toast({
      title: "Вход через Telegram",
      description: "Функция находится в разработке",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    setError("");

    // Проверяем заполненность полей
    if (!credentials.username || !credentials.password) {
      setError("Пожалуйста, заполните все обязательные поля");
      setIsRegistering(false);
      return;
    }

    try {
      // 1. Отправляем запрос на регистрацию
      const registerResponse = await apiRequest("POST", "/api/auth/register", credentials);
      
      if (!registerResponse.ok) {
        const errorData = await registerResponse.json();
        throw new Error(errorData.message || "Ошибка регистрации");
      }
      
      // 2. Получаем данные нового пользователя
      const userData = await registerResponse.json();
      
      // 3. Обновляем состояние авторизации
      login(userData);
      
      // 4. Отправляем данные онбординга на сервер, если они есть
      if (onboardingData) {
        try {
          const onboardingResponse = await apiRequest("POST", "/api/profiles/onboarding", {
            ...onboardingData,
            userId: userData.id
          });
          
          if (!onboardingResponse.ok) {
            console.error("Ошибка при сохранении данных онбординга");
          }
          
          // Очищаем данные из sessionStorage
          sessionStorage.removeItem("onboardingData");
          
        } catch (err) {
          console.error("Ошибка при отправке данных онбординга:", err);
        }
      }
      
      // 5. Показываем сообщение об успешной регистрации
      toast({
        title: "Регистрация прошла успешно",
        description: `Добро пожаловать, ${userData.displayName || userData.username}!`,
      });
      
      // 6. Перенаправляем на dashboard
      navigate("/dashboard");
      
    } catch (err: any) {
      setError(err.message || "Ошибка регистрации. Пожалуйста, попробуйте снова.");
      console.error("Ошибка регистрации:", err);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-space-900 relative overflow-hidden flex flex-col md:flex-row">
      <ParticlesBackground />
      
      <div className="flex-1 flex items-center justify-center p-4 md:p-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Glassmorphism className="rounded-2xl p-6 md:p-8 w-full relative overflow-hidden border-white/10" borderGradient>
            <div className="text-center mb-6">
              <h2 className="font-orbitron text-2xl font-semibold">
                Сохраните результаты диагностики
              </h2>
              <p className="text-white/60 mt-1">Создайте аккаунт для доступа к персонализированным рекомендациям</p>
            </div>

            {!showRegisterForm ? (
              <>
                <div className="mb-6">
                  <button
                    onClick={handleTelegramLogin}
                    className="w-full bg-[#0088cc] hover:bg-[#0099dd] text-white py-3 px-4 rounded-lg flex items-center justify-center transition duration-300 tap-highlight-none btn-mobile"
                  >
                    <i className="fab fa-telegram mr-2"></i>
                    Войти через Telegram
                  </button>
                </div>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-space-800 px-2 text-white/50">или</span>
                  </div>
                </div>

                <button
                  onClick={toggleRegisterForm}
                  className="w-full border border-white/20 hover:bg-white/10 text-white py-3 px-4 rounded-lg transition duration-300 tap-highlight-none btn-mobile"
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Зарегистрироваться с E-mail
                </button>
              </>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-white/80 text-sm font-medium mb-1">
                    Логин
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={credentials.username}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white placeholder:text-white/50 focus:ring-2 focus:ring-[#6E3AFF]/50 focus:border-[#6E3AFF] transition-all"
                    placeholder="Введите логин"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="displayName" className="block text-white/80 text-sm font-medium mb-1">
                    Имя (опционально)
                  </label>
                  <input
                    id="displayName"
                    name="displayName"
                    type="text"
                    value={credentials.displayName}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white placeholder:text-white/50 focus:ring-2 focus:ring-[#6E3AFF]/50 focus:border-[#6E3AFF] transition-all"
                    placeholder="Как к вам обращаться"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-white/80 text-sm font-medium mb-1">
                    Пароль
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-white placeholder:text-white/50 focus:ring-2 focus:ring-[#6E3AFF]/50 focus:border-[#6E3AFF] transition-all"
                    placeholder="Придумайте пароль"
                    required
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
                    onClick={toggleRegisterForm}
                    className="flex-1 border border-white/20 hover:bg-white/10 text-white py-2 px-4 rounded-lg transition duration-300 tap-highlight-none btn-mobile"
                    disabled={isRegistering}
                  >
                    Назад
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] text-white py-2 px-4 rounded-lg transition duration-300 tap-highlight-none btn-mobile"
                    disabled={isRegistering}
                  >
                    {isRegistering ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Регистрация...
                      </span>
                    ) : "Создать аккаунт"}
                  </button>
                </div>
              </form>
            )}
            
            <div className="mt-6 text-center text-sm text-white/50">
              Уже есть аккаунт?{" "}
              <a href="/login" className="text-[#8BE0F7] hover:underline">Войти</a>
            </div>
          </Glassmorphism>
        </motion.div>
      </div>
      
      {/* Правая колонка с преимуществами и рекомендациями */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-b from-indigo-900/30 to-purple-900/30 backdrop-blur-sm items-center justify-center p-10">
        <div className="max-w-md">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-3xl font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-[#B28DFF] via-[#8BE0F7] to-[#B28DFF] mb-6">
              Мы подготовили рекомендации для вас
            </h2>
            
            <Glassmorphism className="rounded-xl p-6 mb-6 border-white/10">
              <h3 className="text-xl font-medium text-white mb-4">
                На основе вашей диагностики
              </h3>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="bg-green-500/20 p-1 rounded-full mr-3 mt-0.5">
                    <Check className="h-4 w-4 text-green-400" />
                  </span>
                  <span className="text-white/80">Персонализированная траектория обучения</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-500/20 p-1 rounded-full mr-3 mt-0.5">
                    <Check className="h-4 w-4 text-green-400" />
                  </span>
                  <span className="text-white/80">Оптимальные курсы для вашего уровня</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-500/20 p-1 rounded-full mr-3 mt-0.5">
                    <Check className="h-4 w-4 text-green-400" />
                  </span>
                  <span className="text-white/80">Практические проекты соответствующей сложности</span>
                </li>
              </ul>
            </Glassmorphism>
            
            <div className="flex items-center p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <Lock className="h-5 w-5 text-blue-400 mr-3" />
              <p className="text-sm text-white/70">
                Создайте аккаунт, чтобы получить полный доступ к персонализированным рекомендациям и продолжить обучение.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
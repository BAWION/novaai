import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";

/**
 * Страница регистрации после прохождения онбординга (Путь 1)
 * Позволяет пользователю создать аккаунт после прохождения диагностики
 * для сохранения результатов и получения рекомендаций
 */
export default function RegisterAfterOnboarding() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user, login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [onboardingData, setOnboardingData] = useState<any>(null);
  
  // Определяем типы для формы регистрации
  interface RegisterFormData {
    username: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    email: string;
  }

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      email: ""
    }
  });

  // Если пользователь уже авторизован, перенаправляем его на дашборд
  useEffect(() => {
    if (user) {
      setLocation("/dashboard");
    }
    
    // Получаем данные онбординга из sessionStorage
    const storedData = sessionStorage.getItem("onboardingData");
    if (storedData) {
      try {
        setOnboardingData(JSON.parse(storedData));
      } catch (e) {
        console.error("Ошибка при загрузке данных онбординга:", e);
      }
    }
  }, [user, setLocation]);

  // Обработчик отправки формы
  const onSubmit = async (data: RegisterFormData) => {
    // Проверяем, совпадают ли пароли
    if (data.password !== data.confirmPassword) {
      toast({
        title: "Ошибка",
        description: "Пароли не совпадают",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Получаем данные онбординга из sessionStorage
      const onboardingDataString = sessionStorage.getItem("onboardingData");
      const profileData = onboardingDataString ? JSON.parse(onboardingDataString) : {};
      
      // Отправляем запрос на регистрацию с профилем
      const response = await fetch('/api/auth/register-and-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
          displayName: data.fullName,
          email: data.email,
          // Добавляем данные онбординга как профиль
          profile: {
            ...profileData,
            userId: 0 // Это будет заменено на сервере после создания пользователя
          }
        }),
        // Важно: добавляем credentials для сохранения сессии
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ошибка при регистрации");
      }
      
      // Получаем данные пользователя
      const userData = await response.json();

      // Важно: устанавливаем пользователя в контекст аутентификации
      // чтобы он сразу получил авторизацию
      login(userData);
      
      // После успешной регистрации показываем сообщение
      toast({
        title: "Успешно!",
        description: "Регистрация прошла успешно. Добро пожаловать в NovaAI University!",
      });
      
      // Очищаем данные онбординга из sessionStorage после успешной регистрации
      sessionStorage.removeItem("onboardingData");
      
      // Делаем дополнительный запрос, чтобы обновить сессию
      await fetch('/api/auth/me', {
        credentials: 'include'
      });
      
      // Устанавливаем флаг, что пользователь пришел с регистрации после онбординга
      // Это нужно для показа приветственного модального окна на дашборде
      sessionStorage.setItem("fromRegistrationAfterOnboarding", "true");
      
      // Добавляем задержку перед переходом на дашборд для успешного сохранения сессии
      setTimeout(async () => {
        try {
          // Еще раз запрашиваем текущего пользователя перед редиректом
          const meResponse = await fetch('/api/auth/me', {
            credentials: 'include'
          });
          
          if (meResponse.ok) {
            const sessionUser = await meResponse.json();
            console.log("Сессия обновлена перед переходом:", sessionUser);
            
            // Явно обновляем контекст авторизации с полученными данными пользователя
            login(sessionUser);
            
            // Используем прямое перенаправление для полной перезагрузки страницы и сессии
            window.location.href = '/dashboard';
          } else {
            // Если сессия все еще не установлена, отправляем данные авторизации снова
            console.log("Сессия не установлена, повторная попытка авторизации");
            const loginResponse = await fetch('/api/auth/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                username: data.username,
                password: data.password
              }),
              credentials: 'include'
            });
            
            if (loginResponse.ok) {
              window.location.href = '/dashboard';
            } else {
              console.error("Не удалось автоматически войти");
              // В крайнем случае перенаправляем на логин
              window.location.href = '/login?registered=true';
            }
          }
        } catch (error) {
          console.error("Ошибка при обновлении сессии:", error);
          window.location.href = '/dashboard';
        }
      }, 1000);
    } catch (error) {
      // Обрабатываем ошибку
      toast({
        title: "Ошибка регистрации",
        description: error instanceof Error ? error.message : "Произошла ошибка при регистрации",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div 
      className="relative min-h-screen bg-space-950 bg-no-repeat bg-cover bg-center overflow-hidden"
      style={{ 
        backgroundImage: "radial-gradient(circle at 50% 50%, rgba(110, 58, 255, 0.1) 0%, rgba(21, 26, 48, 0) 70%)"
      }}
    >
      {/* Фоновые элементы */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>
      {/* Верхний блок с логотипом и названием */}
      <header className="pt-10 pb-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-[#B28DFF] via-[#8BE0F7] to-[#B28DFF]">GALAXION</h1>
          <p className="text-white/60 mt-2">
            Последний шаг для получения персонализированных рекомендаций
          </p>
        </motion.div>
      </header>
      {/* Основной контент */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
          {/* Форма регистрации */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="md:w-1/2 w-full"
          >
            <Card className="border-white/5 bg-space-900/40 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Создайте аккаунт</CardTitle>
                <CardDescription>
                  Сохраните результаты диагностики и получите доступ к персонализированным рекомендациям
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Ваше имя</Label>
                    <Input
                      id="fullName"
                      type="text"
                      className="bg-space-800/50 border-white/10 font-medium"
                      style={{ fontSize: "18px", letterSpacing: "1px", color: "#000000" }}
                      {...register("fullName", { required: "Имя обязательно" })}
                    />
                    {errors.fullName && (
                      <p className="text-sm text-red-500">{errors.fullName.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="username">Имя пользователя</Label>
                    <Input
                      id="username"
                      type="text"
                      className="bg-space-800/50 border-white/10 font-medium"
                      style={{ fontSize: "18px", letterSpacing: "1px", color: "#000000" }}
                      {...register("username", { required: "Имя пользователя обязательно" })}
                    />
                    {errors.username && (
                      <p className="text-sm text-red-500">{errors.username.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Пароль</Label>
                    <style>
                      {`
                        .colorful-password {
                          font-size: 24px;
                          letter-spacing: 4px;
                          color: #9d4edd !important;
                          text-shadow: 0 0 8px rgba(157, 78, 221, 0.5);
                        }
                      `}
                    </style>
                    <Input
                      id="password"
                      type="password"
                      className="bg-space-800/50 border-white/20 text-white border-2 border-purple-500 colorful-password"
                      {...register("password", { 
                        required: "Пароль обязателен",
                        minLength: {
                          value: 6,
                          message: "Пароль должен содержать минимум 6 символов"
                        }
                      })}
                    />
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                    <style>
                      {`
                        .colorful-confirm-password {
                          font-size: 24px;
                          letter-spacing: 4px;
                          color: #0096c7 !important;
                          text-shadow: 0 0 8px rgba(0, 150, 199, 0.5);
                        }
                      `}
                    </style>
                    <Input
                      id="confirmPassword"
                      type="password"
                      className="bg-space-800/50 border-white/20 text-white border-2 border-blue-500 colorful-confirm-password"
                      {...register("confirmPassword", { 
                        required: "Подтверждение пароля обязательно"
                      })}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                  {/* Добавляем поле для email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (обязательно)</Label>
                    <Input
                      id="email"
                      type="email"
                      className="bg-space-800/50 border-white/10 font-medium"
                      style={{ fontSize: "18px", letterSpacing: "1px", color: "#000000" }}
                      {...register("email", { required: "Email обязателен" })}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>

                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="mr-2">Создание аккаунта</span>
                        <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                      </>
                    ) : "Создать аккаунт"}
                  </Button>
                  
                  <div className="relative w-full my-2">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-white/10"></span>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-space-900 px-2 text-white/40">или</span>
                    </div>
                  </div>
                  
                  <Button 
                    type="button" 
                    className="w-full bg-[#0088cc] hover:bg-[#0077b3] flex items-center justify-center gap-2"
                    onClick={() => window.location.href = '/api/auth/telegram'}
                  >
                    <i className="fab fa-telegram text-lg"></i>
                    <span>Войти через Telegram</span>
                  </Button>
                </CardFooter>
              </form>
            </Card>
            
            <div className="mt-4 text-center text-white/60 text-sm">
              Уже есть аккаунт?{" "}
              <a 
                href="/login" 
                className="text-primary hover:underline"
              >
                Войти
              </a>
            </div>
          </motion.div>
          
          {/* Информация справа */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:w-1/2 w-full"
          >
            <Card className="border-white/5 bg-space-900/40 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Результаты вашей диагностики</CardTitle>
                <CardDescription>
                  Создайте аккаунт, чтобы сохранить эти результаты и получить доступ к персональным рекомендациям
                </CardDescription>
              </CardHeader>
              <CardContent>
                {onboardingData ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <h3 className="font-medium mb-2 flex items-center gap-2">
                        <i className="fas fa-user-graduate text-primary"></i>
                        <span>Информация о профиле</span>
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-sm text-white/60">Роль</p>
                          <p className="font-medium">{onboardingData.role || 'Не указано'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-white/60">Опыт</p>
                          <p className="font-medium">{onboardingData.experience || 'Не указано'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-white/60">Уровень Python</p>
                          <p className="font-medium">{onboardingData.pythonLevel || 'Не указано'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-white/60">Интересы</p>
                          <p className="font-medium">{onboardingData.interest || 'Не указано'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-blue-500/10 rounded-lg">
                      <h3 className="font-medium mb-3 flex items-center gap-2">
                        <i className="fas fa-lightbulb text-blue-400"></i>
                        <span>Что вы получите после регистрации</span>
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <i className="fas fa-check text-green-400 mt-1"></i>
                          <span>Персонализированную подборку курсов и материалов</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <i className="fas fa-check text-green-400 mt-1"></i>
                          <span>Индивидуальную карту развития навыков</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <i className="fas fa-check text-green-400 mt-1"></i>
                          <span>Адаптивную систему обучения под ваш уровень</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <i className="fas fa-check text-green-400 mt-1"></i>
                          <span>Доступ к ИИ-ассистенту для сопровождения обучения</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6">
                    <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin mx-auto mb-4"></div>
                    <p className="text-white/60">Загрузка результатов диагностики...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
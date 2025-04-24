import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/auth-context";
import { RegisterForm } from "@/components/auth/register-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Register() {
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();
  
  // Если пользователь уже авторизован, перенаправляем на главную страницу
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log("Пользователь уже авторизован, перенаправление на dashboard");
      setLocation("/dashboard");
    }
  }, [isAuthenticated, user, setLocation]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero секция */}
      <div className="flex-1 relative overflow-hidden bg-space-900">
        <div className="absolute inset-0 bg-[url('/space-bg.jpg')] bg-cover bg-center opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-space-900"></div>
        
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-128px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Форма регистрации */}
              <Card className="w-full max-w-md mx-auto">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold text-center">
                    Создайте аккаунт
                  </CardTitle>
                  <CardDescription className="text-center">
                    Присоединяйтесь к нашей образовательной платформе и начните свой путь в мир ИИ
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RegisterForm />
                  
                  <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      Уже есть аккаунт?{" "}
                      <Button
                        variant="link"
                        className="p-0 h-auto text-primary"
                        onClick={() => setLocation("/login")}
                      >
                        Войдите
                      </Button>
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Информация о платформе */}
              <div className="text-white space-y-6 hidden md:block">
                <h1 className="text-4xl md:text-5xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-[#B28DFF] to-[#8BE0F7]">
                  NovaAI University
                </h1>
                <p className="text-xl text-white/90">
                  Единственная онлайн-экосистема на российском рынке, где сам ИИ проектирует, обновляет и персонализирует обучение.
                </p>
                
                <div className="space-y-4 mt-8">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mt-1 flex-shrink-0">
                      <ArrowRight className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Персонализированные траектории обучения</h3>
                      <p className="text-white/70">ИИ создает индивидуальный путь обучения, адаптированный под ваши цели и уровень знаний.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mt-1 flex-shrink-0">
                      <ArrowRight className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Интеллектуальная поддержка</h3>
                      <p className="text-white/70">Умный AI-ассистент поможет вам на каждом этапе обучения и ответит на вопросы.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mt-1 flex-shrink-0">
                      <ArrowRight className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Актуальные знания</h3>
                      <p className="text-white/70">Курсы регулярно обновляются искусственным интеллектом, чтобы соответствовать последним трендам.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
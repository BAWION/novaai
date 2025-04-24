import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { AIAssistantWidget } from "@/components/ai-assistant/ai-assistant-widget";
import { PersonalizedExplanation } from "@/components/ai-assistant/personalized-explanation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, BrainCircuit, Lightbulb, Sparkles } from "lucide-react";
import { useLocation } from "wouter";

/**
 * Страница AI-ассистента
 */
export default function AIAssistantPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Если пользователь не авторизован, показываем сообщение о необходимости входа
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background/80 to-background">
        <Card className="w-[400px] shadow-lg">
          <CardHeader>
            <CardTitle>Требуется авторизация</CardTitle>
            <CardDescription>
              Для доступа к AI-ассистенту необходимо войти в систему
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Button onClick={() => setLocation("/login")}>Войти в систему</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-4"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>
        <h1 className="text-3xl font-bold">AI-ассистент</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Левая колонка с информацией */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-primary" />
                <CardTitle>AI-ассистент - ваш персональный помощник</CardTitle>
              </div>
              <CardDescription>
                Получите персонализированную помощь в обучении
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                AI-ассистент анализирует ваш профиль, историю занятий и результаты тестов, 
                чтобы предоставить максимально эффективную помощь в обучении.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/20 p-2 rounded-full">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Персонализированные ответы</p>
                    <p className="text-xs text-muted-foreground">Ответы с учётом вашего уровня навыков</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="bg-primary/20 p-2 rounded-full">
                    <Lightbulb className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Проактивные подсказки</p>
                    <p className="text-xs text-muted-foreground">Советы на основе выявленных пробелов в знаниях</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="bg-primary/20 p-2 rounded-full">
                    <BrainCircuit className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Объяснение сложных тем</p>
                    <p className="text-xs text-muted-foreground">Понятное объяснение с учётом ваших предпочтений</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <PersonalizedExplanation />
        </div>

        {/* Правая колонка с ассистентом */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          <AIAssistantWidget className="h-full max-h-[600px]" />
        </div>
      </div>
    </div>
  );
}
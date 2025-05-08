import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, Brain, Presentation } from "lucide-react";
import { useUserProfile } from "@/context/user-profile-context";

interface WelcomeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userName?: string;
}

/**
 * Модальное окно приветствия для новых пользователей
 * Показывается после регистрации и кратко рассказывает о возможностях платформы
 */
export function WelcomeModal({ isOpen, onOpenChange, userName = "студент" }: WelcomeModalProps) {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(3); // Используем состояние для возможности изменения
  const { userProfile } = useUserProfile();
  
  // Определяем, находимся ли мы в демо-режиме
  const isDemoMode = userProfile?.userId === 999;
  
  // Автоматически открываем модальное окно для путей после регистрации через онбординг
  useEffect(() => {
    // Проверяем, был ли пользователь перенаправлен с регистрации после онбординга
    const isFromRegistration = sessionStorage.getItem("fromRegistrationAfterOnboarding");
    
    if (isFromRegistration === "true") {
      // Показываем модальное окно
      onOpenChange(true);
      // Устанавливаем шаг на первый (приветствие), пропуская предложение диагностики
      setStep(1);
      // Удаляем флаг после обработки
      sessionStorage.removeItem("fromRegistrationAfterOnboarding");
      // Сохраняем информацию, что пользователь уже прошел диагностику
      sessionStorage.setItem("diagnosticsCompleted", "true");
    }
  }, [onOpenChange]);

  // При открытии модального окна проверяем, прошел ли пользователь диагностику
  useEffect(() => {
    if (isOpen) {
      console.log("[WelcomeModal] Открыто модальное окно, демо-режим:", isDemoMode);
      
      // Если пользователь уже прошел диагностику (через путь "диагностика → регистрация")
      // или в демо-режиме
      const diagnosticsCompleted = sessionStorage.getItem("diagnosticsCompleted") === "true";
      
      if (diagnosticsCompleted || isDemoMode) {
        // Для демо-режима показываем только первый шаг с информацией о платформе
        // Адаптируем общее количество шагов
        setTotalSteps(1);
      } else {
        // Стандартное поведение - показываем все шаги включая диагностику
        setTotalSteps(3);
        setStep(1);
      }
    }
  }, [isOpen, isDemoMode]);

  // Функция для перехода к следующему шагу
  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // На последнем шаге закрываем модальное окно
      onOpenChange(false);
    }
  };

  // Функция для перехода к диагностике в контексте модального окна
  const goToDiagnostics = () => {
    // Вместо редиректа - начинаем диагностику прямо здесь
    onOpenChange(false);
    
    // Формируем данные для диагностики с учетом демо-режима
    const onboardingData = {
      username: userName,
      redirectAfterComplete: "/dashboard",
      // Для демо-режима добавляем специальное поле
      isDemoMode: isDemoMode
    };
    
    console.log("[WelcomeModal] Переход к диагностике, данные:", onboardingData);
    
    // Сохраняем данные диагностики, чтобы их можно было использовать на странице dashboard
    sessionStorage.setItem("onboardingData", JSON.stringify(onboardingData));
    
    // Переходим к полной версии диагностики
    setLocation("/deep-diagnosis");
  };

  // Функция для пропуска онбординга
  const skipOnboarding = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-space-800 border-blue-500/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-[#B28DFF] via-[#8BE0F7] to-[#B28DFF]">
            Добро пожаловать в NovaAI University
          </DialogTitle>
          <DialogDescription className="text-white/70">
            {step === 1 && `Привет, ${userName}! Мы рады видеть вас на нашей платформе.`}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-white/80">
                NovaAI University — это первая в России образовательная платформа, где искусственный интеллект:
              </p>
              <div className="space-y-3 mt-4">
                <div className="flex gap-3 items-start">
                  <div className="p-2 rounded-full bg-primary/20 text-primary">
                    <Brain className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Проектирует образовательные траектории</p>
                    <p className="text-sm text-white/60">
                      Создает персонализированные пути обучения с учетом ваших целей, навыков и опыта
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="p-2 rounded-full bg-primary/20 text-primary">
                    <Presentation className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Адаптируется под ваши результаты</p>
                    <p className="text-sm text-white/60">
                      Анализирует ваши успехи и корректирует обучение для повышения эффективности
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="p-2 rounded-full bg-primary/20 text-primary">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Обновляет и адаптирует контент</p>
                    <p className="text-sm text-white/60">
                      Регулярно актуализирует учебные материалы с учетом последних достижений в AI
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-white/80">
                Для начала эффективного обучения мы рекомендуем пройти диагностику, которая позволит нам:
              </p>
              <div className="space-y-3 mt-4">
                <div className="flex gap-3 items-start">
                  <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-400">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Выявить ваш текущий уровень</p>
                    <p className="text-sm text-white/60">
                      Определить имеющиеся навыки и знания в различных областях AI и программирования
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-400">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Сформировать персональные рекомендации</p>
                    <p className="text-sm text-white/60">
                      Подобрать оптимальные курсы и материалы с учетом ваших целей и опыта
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-400">
                    <Brain className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Построить индивидуальную траекторию</p>
                    <p className="text-sm text-white/60">
                      Создать оптимальный путь развития для достижения ваших профессиональных целей
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-white/80">
                Вы готовы начать?
              </p>
              <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg mt-2">
                <h3 className="font-medium text-indigo-400 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Рекомендация AI-ассистента
                </h3>
                <p className="text-sm text-white/70 mt-2">
                  Мы рекомендуем пройти диагностику для создания персонализированного плана обучения. 
                  Это займет всего 5-7 минут, но значительно повысит эффективность вашего обучения.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {step === totalSteps ? (
            <>
              {/* Модифицируем кнопки в зависимости от того, прошел ли пользователь диагностику */}
              {totalSteps === 1 ? (
                // Для пользователей, которые уже прошли диагностику
                <Button 
                  className="bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] hover:opacity-90 text-white w-full"
                  onClick={skipOnboarding}
                >
                  Начать обучение
                </Button>
              ) : (
                // Для новых пользователей, предлагаем пройти диагностику
                <>
                  <Button
                    variant="outline"
                    className="sm:ml-auto bg-transparent border-white/20 hover:bg-white/10 text-white"
                    onClick={skipOnboarding}
                  >
                    Пропустить диагностику
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] hover:opacity-90 text-white"
                    onClick={goToDiagnostics}
                  >
                    Пройти диагностику
                  </Button>
                </>
              )}
            </>
          ) : (
            <Button 
              className="bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] hover:opacity-90 text-white ml-auto"
              onClick={nextStep}
            >
              {`Далее (${step}/${totalSteps})`}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
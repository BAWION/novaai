import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Brain, Activity, Rocket } from "lucide-react";

interface OnboardingIntroSlidesProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

/**
 * Компонент, отображающий вводные слайды о диагностике
 */
export function OnboardingIntroSlides({ isOpen, onOpenChange, onComplete }: OnboardingIntroSlidesProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  // При открытии модального окна сбрасываем шаг на первый
  useEffect(() => {
    if (isOpen) {
      setStep(1);
    }
  }, [isOpen]);

  // Функция для перехода к следующему шагу
  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // На последнем шаге закрываем модальное окно и вызываем onComplete
      onOpenChange(false);
      onComplete();
    }
  };

  // Функция для пропуска всех шагов
  const skipSteps = () => {
    onOpenChange(false);
    onComplete();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-space-900/90 backdrop-blur-md border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-center font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-400 to-secondary">
            {step === 1 && "Добро пожаловать в NovaAI University"}
            {step === 2 && "Персонализация имеет значение"}
            {step === 3 && "Ваш путь к мастерству"}
          </DialogTitle>
        </DialogHeader>

        <div className="p-4 text-center">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="mx-auto w-16 h-16 mb-4 text-primary">
                <Brain className="h-16 w-16 mx-auto" />
              </div>
              <p className="text-white/80">
                Наш искусственный интеллект создаст персонализированную траекторию обучения специально для вас.
              </p>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="mx-auto w-16 h-16 mb-4 text-secondary">
                <Activity className="h-16 w-16 mx-auto" />
              </div>
              <p className="text-white/80">
                Диагностика навыков позволит нам подобрать оптимальные курсы и задания, соответствующие вашему уровню и целям.
              </p>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="mx-auto w-16 h-16 mb-4 text-primary">
                <Rocket className="h-16 w-16 mx-auto" />
              </div>
              <p className="text-white/80">
                После диагностики вы получите доступ к персонализированным рекомендациям и сможете сразу приступить к обучению.
              </p>
            </motion.div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between">
          {step < totalSteps ? (
            <div className="w-full flex justify-between">
              <Button variant="ghost" onClick={skipSteps} className="text-white/70 hover:text-white">
                Пропустить все
              </Button>
              <Button onClick={nextStep} className="bg-primary hover:bg-primary/90">
                Далее
                <span className="ml-2">→</span>
              </Button>
            </div>
          ) : (
            <div className="w-full flex justify-between">
              <Button variant="ghost" onClick={skipSteps} className="text-white/70 hover:text-white">
                Пропустить
              </Button>
              <Button onClick={nextStep} className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                Начать диагностику
                <Rocket className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
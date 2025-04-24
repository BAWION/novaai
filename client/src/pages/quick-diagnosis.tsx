import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/context/user-profile-context";
import { Brain, ArrowRight, Code, ChevronRight, ChevronLeft, BookOpen } from "lucide-react";

const specializations = [
  {
    id: "machine-learning",
    title: "Машинное обучение",
    description: "Создание алгоритмов, которые могут учиться из данных и делать прогнозы",
    icon: <Brain className="h-5 w-5" />,
  },
  {
    id: "data-science",
    title: "Наука о данных",
    description: "Анализ и интерпретация сложных данных для принятия решений",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    id: "programming",
    title: "Программирование ИИ",
    description: "Разработка приложений с использованием библиотек и фреймворков ИИ",
    icon: <Code className="h-5 w-5" />,
  },
];

const experienceLevels = [
  { id: "beginner", title: "Новичок", description: "Нет опыта в программировании или AI" },
  { id: "intermediate", title: "Средний", description: "Базовые знания программирования" },
  { id: "advanced", title: "Продвинутый", description: "Опыт работы с AI-инструментами" },
];

const goals = [
  { id: "learning", title: "Расширить знания", description: "Изучить новые технологии AI" },
  { id: "career", title: "Карьерное развитие", description: "Улучшить навыки для работы" },
  { id: "project", title: "Реализовать проект", description: "Применить AI в своем проекте" },
];

export default function QuickDiagnosis() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { userProfile, updateUserProfile } = useUserProfile();
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  
  const [formData, setFormData] = useState({
    specialization: "",
    experience: "",
    goal: "",
    languages: [] as string[],
  });
  
  const availableLanguages = ["Python", "JavaScript", "Java", "C++", "Julia"];
  
  // Загружаем данные из sessionStorage, если они есть
  useEffect(() => {
    const savedData = sessionStorage.getItem("onboardingData");
    if (savedData) {
      const { redirectAfterComplete } = JSON.parse(savedData);
      if (redirectAfterComplete) {
        // Запоминаем, куда перенаправить после диагностики
        setFormData(prev => ({ ...prev, redirectAfterComplete }));
      }
    }
  }, []);
  
  const handleNext = () => {
    // Проверка заполнения текущего шага
    if (step === 1 && !formData.specialization) {
      toast({
        title: "Заполните поле",
        description: "Пожалуйста, выберите интересующую вас специализацию",
        variant: "destructive",
      });
      return;
    }
    
    if (step === 2 && !formData.experience) {
      toast({
        title: "Заполните поле",
        description: "Пожалуйста, выберите ваш уровень опыта",
        variant: "destructive",
      });
      return;
    }
    
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Завершение диагностики
      handleComplete();
    }
  };
  
  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const handleComplete = async () => {
    try {
      // Преобразуем данные диагностики в формат для профиля пользователя
      const profileUpdate = {
        completedOnboarding: true,
        interest: formData.specialization as any,
        experience: formData.experience as any,
        goal: formData.goal as any,
        pythonLevel: formData.experience === "beginner" ? 1 : 
                     formData.experience === "intermediate" ? 2 : 3,
      };
      
      // Обновляем профиль пользователя
      await updateUserProfile(profileUpdate);
      
      toast({
        title: "Диагностика завершена",
        description: "Спасибо за заполнение! Ваш профиль обновлен.",
      });
      
      // Очищаем данные из sessionStorage
      sessionStorage.removeItem("onboardingData");
      
      // Перенаправляем на Dashboard или указанную страницу
      const redirectUrl = formData.redirectAfterComplete || "/dashboard";
      setLocation(redirectUrl);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить результаты диагностики. Попробуйте еще раз.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-space-900 text-white">
      <div className="absolute inset-0 bg-[url('/space-bg.jpg')] bg-cover bg-center opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-space-900/30 to-space-900/95"></div>
      
      <div className="container relative z-10 mx-auto px-4 py-12 max-w-4xl">
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-orbitron font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-[#B28DFF] via-[#8BE0F7] to-[#B28DFF]">
              Диагностика навыков
            </h1>
          </motion.div>
          <p className="text-white/70 text-center max-w-2xl mt-2">
            Чтобы создать персонализированный план обучения, нам нужно узнать немного больше о ваших интересах и опыте.
          </p>
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/60 text-sm">Прогресс</span>
            <span className="text-white/60 text-sm font-medium">{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <Progress value={(step / totalSteps) * 100} className="h-2 bg-white/10" />
          <div className="flex justify-between mt-1 text-xs text-white/50">
            <span>Специализация</span>
            <span>Опыт</span>
            <span>Цели</span>
          </div>
        </div>
        
        <Card className="bg-space-800/70 border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-xl text-white">
              {step === 1 && "Выберите интересующую вас специализацию"}
              {step === 2 && "Какой у вас уровень опыта?"}
              {step === 3 && "Какие у вас цели обучения?"}
            </CardTitle>
            <CardDescription className="text-white/70">
              {step === 1 && "Это поможет нам определить наиболее подходящие курсы"}
              {step === 2 && "Мы адаптируем сложность материалов под ваш уровень"}
              {step === 3 && "Мы подберем практические задания под ваши цели"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {/* Шаг 1: Выбор специализации */}
            {step === 1 && (
              <RadioGroup
                value={formData.specialization}
                onValueChange={(value) => setFormData({ ...formData, specialization: value })}
                className="space-y-3"
              >
                {specializations.map((spec) => (
                  <div
                    key={spec.id}
                    className={`flex items-start space-x-3 border rounded-lg p-4 transition-all cursor-pointer ${
                      formData.specialization === spec.id
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-white/10 hover:border-white/30"
                    }`}
                    onClick={() => setFormData({ ...formData, specialization: spec.id })}
                  >
                    <RadioGroupItem value={spec.id} id={spec.id} className="mt-1" />
                    <div className="space-y-1.5">
                      <div className="flex items-center">
                        <span className="text-primary mr-2">{spec.icon}</span>
                        <Label htmlFor={spec.id} className="text-lg font-medium cursor-pointer">
                          {spec.title}
                        </Label>
                      </div>
                      <p className="text-sm text-white/60">{spec.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            )}
            
            {/* Шаг 2: Уровень опыта */}
            {step === 2 && (
              <RadioGroup
                value={formData.experience}
                onValueChange={(value) => setFormData({ ...formData, experience: value })}
                className="space-y-3"
              >
                {experienceLevels.map((level) => (
                  <div
                    key={level.id}
                    className={`flex items-start space-x-3 border rounded-lg p-4 transition-all cursor-pointer ${
                      formData.experience === level.id
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-white/10 hover:border-white/30"
                    }`}
                    onClick={() => setFormData({ ...formData, experience: level.id })}
                  >
                    <RadioGroupItem value={level.id} id={level.id} className="mt-1" />
                    <div className="space-y-1.5">
                      <Label htmlFor={level.id} className="text-lg font-medium cursor-pointer">
                        {level.title}
                      </Label>
                      <p className="text-sm text-white/60">{level.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            )}
            
            {/* Шаг 3: Цели обучения и языки программирования */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-white mb-2 block">Выберите основную цель</Label>
                  <RadioGroup
                    value={formData.goal}
                    onValueChange={(value) => setFormData({ ...formData, goal: value })}
                    className="space-y-3"
                  >
                    {goals.map((goal) => (
                      <div
                        key={goal.id}
                        className={`flex items-start space-x-3 border rounded-lg p-4 transition-all cursor-pointer ${
                          formData.goal === goal.id
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-white/10 hover:border-white/30"
                        }`}
                        onClick={() => setFormData({ ...formData, goal: goal.id })}
                      >
                        <RadioGroupItem value={goal.id} id={goal.id} className="mt-1" />
                        <div className="space-y-1.5">
                          <Label htmlFor={goal.id} className="text-lg font-medium cursor-pointer">
                            {goal.title}
                          </Label>
                          <p className="text-sm text-white/60">{goal.description}</p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            )}
            
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                className={`${step === 1 ? "invisible" : ""} bg-transparent border-white/20 hover:bg-white/10 text-white`}
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Назад
              </Button>
              
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] hover:opacity-90 text-white"
              >
                {step === totalSteps ? "Завершить" : "Далее"}
                {step === totalSteps ? <ArrowRight className="h-4 w-4 ml-2" /> : <ChevronRight className="h-4 w-4 ml-2" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
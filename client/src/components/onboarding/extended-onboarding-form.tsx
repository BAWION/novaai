import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  extendedOnboardingSchema, 
  type ExtendedOnboardingFormData,
  industries,
  specificGoals,
  learningStyles,
  difficultiesLevels,
  experienceLevels,
  roles,
  interests,
  goals
} from "@/lib/onboarding-schema";

import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import { Rocket, Brain, Clock, Briefcase, Sparkles, Laptop } from "lucide-react";

interface ExtendedOnboardingFormProps {
  userId: number;
  defaultValues?: Partial<ExtendedOnboardingFormData>;
  onComplete: (recommendedCourseIds: number[]) => void;
}

export function ExtendedOnboardingForm({ 
  userId, 
  defaultValues = {}, 
  onComplete 
}: ExtendedOnboardingFormProps) {
  const { toast } = useToast();
  const [step, setStep] = React.useState(1);
  const totalSteps = 3;
  
  // Инициализация формы с валидатором
  const form = useForm<ExtendedOnboardingFormData>({
    resolver: zodResolver(extendedOnboardingSchema),
    defaultValues: {
      role: defaultValues.role || "student",
      pythonLevel: defaultValues.pythonLevel || 1,
      experience: defaultValues.experience || "beginner",
      interest: defaultValues.interest || "machine-learning",
      goal: defaultValues.goal || "practice-skills",
      industry: defaultValues.industry || "it",
      jobTitle: defaultValues.jobTitle || "",
      specificGoals: defaultValues.specificGoals || ["изучить_машинное_обучение"],
      preferredLearningStyle: defaultValues.preferredLearningStyle || "mixed",
      availableTimePerWeek: defaultValues.availableTimePerWeek || 5,
      preferredDifficulty: defaultValues.preferredDifficulty || "moderate",
    },
  });
  
  // Мутация для сохранения данных и получения рекомендаций
  const submitMutation = useMutation({
    mutationFn: async (data: ExtendedOnboardingFormData) => {
      const response = await apiRequest("POST", "/api/profiles/onboarding", {
        ...data,
        userId,
      });
      return await response.json();
    },
    onSuccess: (data) => {
      // Инвалидация кеша профиля пользователя для обновления данных
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      
      // Вызов колбэка для завершения онбординга
      if (data.recommendedCourseIds && Array.isArray(data.recommendedCourseIds)) {
        onComplete(data.recommendedCourseIds);
      } else {
        onComplete([]);
      }
      
      toast({
        title: "Профиль обновлен",
        description: "Ваш расширенный профиль успешно сохранен! Теперь вы получите персонализированные рекомендации.",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить ваш профиль. Пожалуйста, попробуйте снова.",
        variant: "destructive",
      });
    },
  });
  
  // Функция для обработки отправки формы
  function onSubmit(data: ExtendedOnboardingFormData) {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      submitMutation.mutate(data);
    }
  }
  
  // Функция для перехода на предыдущий шаг
  function goBack() {
    if (step > 1) {
      setStep(step - 1);
    }
  }
  
  // Получение перевода для полей перечислений
  function getLabelForEnum(value: string, enumType: string): string {
    const translations: Record<string, Record<string, string>> = {
      role: {
        "student": "Студент",
        "professional": "Профессионал",
        "teacher": "Преподаватель/тренер",
        "researcher": "Исследователь",
      },
      experience: {
        "beginner": "Начинающий (нет опыта)",
        "learning-basics": "Изучаю основы",
        "experienced": "Имею опыт",
        "expert": "Эксперт",
      },
      interest: {
        "machine-learning": "Машинное обучение",
        "neural-networks": "Нейронные сети",
        "data-science": "Наука о данных",
        "computer-vision": "Компьютерное зрение",
        "nlp": "Обработка естественного языка",
        "robotics": "Робототехника",
        "ai-for-business": "ИИ для бизнеса",
        "generative-ai": "Генеративный ИИ",
      },
      goal: {
        "find-internship": "Найти стажировку или работу",
        "practice-skills": "Практиковать навыки",
        "career-change": "Сменить карьеру",
        "create-project": "Создать свой проект",
        "learn-fundamentals": "Изучить основы",
        "stay-current": "Быть в курсе последних тенденций",
      },
      industry: {
        "it": "IT/Технологии",
        "finance": "Финансы/Банкинг",
        "education": "Образование",
        "healthcare": "Здравоохранение",
        "manufacturing": "Производство",
        "retail": "Торговля",
        "telecom": "Телекоммуникации",
        "media": "Медиа/Развлечения",
        "government": "Государственный сектор",
        "science": "Наука/Исследования",
        "student": "Студент",
        "other": "Другое",
      },
      specificGoals: {
        "изучить_машинное_обучение": "Изучить машинное обучение",
        "развить_навыки_программирования": "Развить навыки программирования",
        "построить_портфолио": "Построить портфолио проектов",
        "сменить_карьеру": "Сменить карьерный путь",
        "подготовиться_к_собеседованию": "Подготовиться к собеседованию",
        "получить_повышение": "Получить повышение на текущей работе",
        "основать_стартап": "Основать AI-стартап",
        "автоматизировать_процессы": "Автоматизировать рабочие процессы",
        "применить_AI_в_своей_отрасли": "Применить AI в своей отрасли",
        "нарастить_исследовательские_навыки": "Нарастить исследовательские навыки",
      },
      learningStyle: {
        "visual": "Визуальное обучение (видео, диаграммы, инфографика)",
        "practical": "Практическое обучение (проекты, лабораторные работы)",
        "theoretical": "Теоретическое обучение (чтение, лекции)",
        "mixed": "Смешанный стиль обучения",
      },
      difficulty: {
        "easy": "Начинающий",
        "moderate": "Средний",
        "challenging": "Высокий",
      },
    };

    return translations[enumType]?.[value] || value;
  }
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="border-primary/20 bg-space-900/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-orbitron text-center bg-clip-text text-transparent bg-gradient-to-r from-[#B28DFF] via-[#8BE0F7] to-[#B28DFF]">
            Настройка вашего образовательного пути
          </CardTitle>
          <CardDescription className="text-center">
            Шаг {step} из {totalSteps}: {
              step === 1 ? "Основная информация" :
              step === 2 ? "Карьерный профиль" :
              "Предпочтения обучения"
            }
          </CardDescription>
          
          {/* Прогресс-бар */}
          <div className="w-full h-1 bg-space-800 mt-4 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] rounded-full transition-all" 
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
        </CardHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ваша роль</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите вашу роль" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem key={role} value={role}>
                                  {getLabelForEnum(role, "role")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Это поможет подобрать подходящие материалы
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Уровень опыта</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите уровень опыта" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {experienceLevels.map((level) => (
                                <SelectItem key={level} value={level}>
                                  {getLabelForEnum(level, "experience")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Ваш опыт в сфере AI и программирования
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="pythonLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Уровень знания Python (1-5)</FormLabel>
                        <div className="flex flex-col space-y-1">
                          <div className="flex justify-between text-xs text-muted-foreground px-1">
                            <span>Новичок</span>
                            <span>Начинающий</span>
                            <span>Средний</span>
                            <span>Продвинутый</span>
                            <span>Эксперт</span>
                          </div>
                          <FormControl>
                            <Slider
                              defaultValue={[field.value]}
                              max={5}
                              min={1}
                              step={1}
                              onValueChange={(value) => field.onChange(value[0])}
                              className="py-4"
                            />
                          </FormControl>
                          <div className="flex justify-center">
                            <span className="font-medium text-center px-2 py-1 bg-space-800 rounded-md">
                              {field.value}
                            </span>
                          </div>
                        </div>
                        <FormDescription>
                          Базовый язык для большинства AI/ML проектов
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="interest"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Область интересов</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите область интересов" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {interests.map((interest) => (
                                <SelectItem key={interest} value={interest}>
                                  {getLabelForEnum(interest, "interest")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Основная область, которую хотите изучать
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="goal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Основная цель</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите основную цель" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {goals.map((goal) => (
                                <SelectItem key={goal} value={goal}>
                                  {getLabelForEnum(goal, "goal")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Зачем вам нужны эти знания?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </motion.div>
              )}
              
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Отрасль работы</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Выберите отрасль" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {industries.map((industry) => (
                                <SelectItem key={industry} value={industry}>
                                  {getLabelForEnum(industry, "industry")}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            В какой сфере вы работаете
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="jobTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Должность</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Например: Data Analyst"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Ваша текущая профессиональная позиция
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="specificGoals"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Конкретные цели</FormLabel>
                          <FormDescription>
                            Выберите от 1 до 5 конкретных целей обучения
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {specificGoals.map((item) => (
                            <FormField
                              key={item}
                              control={form.control}
                              name="specificGoals"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item}
                                    className="flex flex-row items-start space-x-3 space-y-0 bg-space-800/50 p-3 rounded-md"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, item])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== item
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-sm font-normal cursor-pointer">
                                      {getLabelForEnum(item, "specificGoals")}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}
              
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="preferredLearningStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Предпочтительный стиль обучения</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите стиль обучения" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {learningStyles.map((style) => (
                              <SelectItem key={style} value={style}>
                                {getLabelForEnum(style, "learningStyle")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Какой подход к обучению вам больше подходит
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="availableTimePerWeek"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Доступное время в неделю (часов)</FormLabel>
                        <div className="flex flex-col space-y-1">
                          <FormControl>
                            <Slider
                              defaultValue={[field.value]}
                              max={40}
                              min={1}
                              step={1}
                              onValueChange={(value) => field.onChange(value[0])}
                              className="py-4"
                            />
                          </FormControl>
                          <div className="flex justify-center">
                            <span className="font-medium text-center px-4 py-1 bg-space-800 rounded-md">
                              {field.value} {field.value === 1 ? "час" : field.value < 5 ? "часа" : "часов"}
                            </span>
                          </div>
                        </div>
                        <FormDescription>
                          Сколько времени в неделю вы готовы уделять обучению
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="preferredDifficulty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Предпочтительный уровень сложности</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите уровень сложности" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {difficultiesLevels.map((level) => (
                              <SelectItem key={level} value={level}>
                                {getLabelForEnum(level, "difficulty")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Насколько сложных заданий и материалов вы хотите
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between">
              {step > 1 ? (
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={goBack}
                  disabled={submitMutation.isPending}
                >
                  Назад
                </Button>
              ) : (
                <div></div>
              )}
              
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1]"
                disabled={submitMutation.isPending}
              >
                {submitMutation.isPending 
                  ? "Обработка..." 
                  : step === totalSteps 
                    ? "Завершить" 
                    : "Продолжить"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
      {/* Декоративные элементы */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute top-10 right-10 text-indigo-300 opacity-20"
      >
        <Brain size={120} />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1, delay: 0.7 }}
        className="absolute bottom-20 left-10 text-blue-300 opacity-20"
      >
        <Rocket size={100} />
      </motion.div>
    </div>
  );
}
import React, { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage, 
  FormDescription 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  RadioGroup, 
  RadioGroupItem 
} from "@/components/ui/radio-group";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { 
  Slider 
} from "@/components/ui/slider";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  CheckCircle2,
  BrainCircuit,
  User,
  Target,
  BadgePlus,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

// Схема формы онбординга
const extendedOnboardingSchema = z.object({
  role: z.enum(["student", "teacher", "employee", "researcher", "other"]),
  pythonLevel: z.number().min(0).max(5),
  experience: z.enum(["beginner", "learning-basics", "practical-experience", "professional", "expert"]),
  interest: z.enum([
    "machine-learning", 
    "neural-networks", 
    "data-science", 
    "computer-vision", 
    "nlp", 
    "robotics", 
    "ai-for-business", 
    "generative-ai"
  ]),
  goal: z.enum([
    "learn-basics", 
    "broaden-knowledge", 
    "practice-skills", 
    "create-project",
    "find-internship",
    "career-change",
    "research-purposes"
  ]),
  industry: z.string().optional(),
  jobTitle: z.string().optional(),
  specificGoals: z.array(z.string()).optional(),
  preferredLearningStyle: z.enum(["visual", "auditory", "reading", "practical"]).optional(),
  availableTimePerWeek: z.number().min(1).max(20).optional(),
  preferredDifficulty: z.enum(["easy", "moderate", "challenging"]).optional(),
});

type ExtendedOnboardingValues = z.infer<typeof extendedOnboardingSchema>;

interface ExtendedOnboardingFormProps {
  userId: number;
  defaultValues?: Partial<ExtendedOnboardingValues>;
  onComplete: (recommendedCourseIds: number[]) => void;
}

export function ExtendedOnboardingForm({
  userId,
  defaultValues,
  onComplete
}: ExtendedOnboardingFormProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Инициализация формы с переданными значениями или значениями по умолчанию
  const form = useForm<ExtendedOnboardingValues>({
    resolver: zodResolver(extendedOnboardingSchema),
    defaultValues: {
      role: defaultValues?.role || "student",
      pythonLevel: defaultValues?.pythonLevel || 2,
      experience: defaultValues?.experience || "beginner",
      interest: defaultValues?.interest || "machine-learning",
      goal: defaultValues?.goal || "learn-basics",
      industry: defaultValues?.industry || "",
      jobTitle: defaultValues?.jobTitle || "",
      specificGoals: defaultValues?.specificGoals || [],
      preferredLearningStyle: defaultValues?.preferredLearningStyle || "visual",
      availableTimePerWeek: defaultValues?.availableTimePerWeek || 5,
      preferredDifficulty: defaultValues?.preferredDifficulty || "moderate",
    },
  });
  
  // Мутация для отправки данных онбординга
  const onboardingMutation = useMutation({
    mutationFn: async (data: ExtendedOnboardingValues) => {
      console.log("Sending onboarding data:", {
        ...data,
        userId,
      });
      const res = await apiRequest("POST", "/api/profiles/onboarding", {
        ...data,
        userId,
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Ошибка при обработке данных");
      }
      return res.json();
    },
    onSuccess: (data) => {
      console.log("Онбординг успешно пройден:", data);
      // Вызываем колбэк с ID рекомендованных курсов
      onComplete(data.recommendedCourseIds || []);
      
      toast({
        title: "Профиль успешно обновлен",
        description: "На основе ваших ответов мы подготовили персональные рекомендации",
        variant: "default",
      });
    },
    onError: (error) => {
      console.error("Ошибка при онбординге:", error);
      
      toast({
        title: "Ошибка при обработке данных",
        description: error.message,
        variant: "destructive",
      });
      
      setIsSubmitting(false);
    },
  });
  
  // Функция для отправки формы
  const onSubmit = async (values: ExtendedOnboardingValues) => {
    setIsSubmitting(true);
    
    try {
      // Если на последнем шаге, отправляем данные
      if (step === 3) {
        onboardingMutation.mutate(values);
      } else {
        // Переходим к следующему шагу
        setStep(step + 1);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Ошибка при отправке формы:", error);
      setIsSubmitting(false);
    }
  };
  
  // Функция для отображения текущего шага
  const renderStep = () => {
    if (step === 1) {
      return renderBasicInfoStep();
    } else if (step === 2) {
      return renderExperienceStep();
    } else {
      return renderPreferencesStep();
    }
  };
  
  // Шаг 1: Основная информация
  const renderBasicInfoStep = () => {
    return (
      <>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Кто вы?</FormLabel>
                <FormDescription>
                  Выберите роль, которая наиболее точно описывает вас
                </FormDescription>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Выберите роль" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="student">Студент</SelectItem>
                    <SelectItem value="teacher">Преподаватель</SelectItem>
                    <SelectItem value="employee">Сотрудник компании</SelectItem>
                    <SelectItem value="researcher">Исследователь</SelectItem>
                    <SelectItem value="other">Другое</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Ваш опыт в AI/ML</FormLabel>
                <FormDescription>
                  Оцените свой текущий уровень опыта в области искусственного интеллекта и машинного обучения
                </FormDescription>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="beginner" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Новичок (только начинаю изучать тему)
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="learning-basics" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Изучаю основы (знаком с базовыми концепциями)
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="practical-experience" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Есть практический опыт (реализовывал проекты)
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="professional" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Профессионал (работаю в этой области)
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="expert" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Эксперт (глубокие знания и большой опыт)
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="pythonLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Уровень знания Python</FormLabel>
                <FormDescription>
                  Оцените ваш уровень владения Python от 0 (не знаком) до 5 (эксперт)
                </FormDescription>
                <FormControl>
                  <div className="space-y-3">
                    <Slider
                      value={[field.value]}
                      min={0}
                      max={5}
                      step={1}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-white/60">
                      <span>Не знаком</span>
                      <span>Начинающий</span>
                      <span>Средний</span>
                      <span>Хороший</span>
                      <span>Продвинутый</span>
                      <span>Эксперт</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                        {field.value}
                      </div>
                      <div className="text-sm">
                        {field.value === 0 && "Не знаком с Python"}
                        {field.value === 1 && "Базовые знания синтаксиса"}
                        {field.value === 2 && "Могу писать простые скрипты"}
                        {field.value === 3 && "Уверенное использование библиотек"}
                        {field.value === 4 && "Продвинутые навыки разработки"}
                        {field.value === 5 && "Экспертный уровень"}
                      </div>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-between mt-6">
          <div></div>
          <Button
            type="button"
            onClick={() => onSubmit(form.getValues())}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1]"
          >
            Далее
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </>
    );
  };
  
  // Шаг 2: Интересы и опыт
  const renderExperienceStep = () => {
    return (
      <>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="interest"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Область интересов</FormLabel>
                <FormDescription>
                  Выберите направление искусственного интеллекта, которое вас больше всего интересует
                </FormDescription>
                <FormControl>
                  <Tabs 
                    defaultValue={field.value} 
                    onValueChange={field.onChange}
                    className="w-full"
                  >
                    <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full h-auto">
                      <TabsTrigger value="machine-learning" className="py-2">ML</TabsTrigger>
                      <TabsTrigger value="neural-networks" className="py-2">Нейросети</TabsTrigger>
                      <TabsTrigger value="data-science" className="py-2">Data Science</TabsTrigger>
                      <TabsTrigger value="computer-vision" className="py-2">CV</TabsTrigger>
                      <TabsTrigger value="nlp" className="py-2">NLP</TabsTrigger>
                      <TabsTrigger value="robotics" className="py-2">Робототехника</TabsTrigger>
                      <TabsTrigger value="ai-for-business" className="py-2">AI для бизнеса</TabsTrigger>
                      <TabsTrigger value="generative-ai" className="py-2">Генеративный AI</TabsTrigger>
                    </TabsList>
                    <TabsContent value="machine-learning" className="p-4 border rounded-md mt-2">
                      <h4 className="font-medium">Машинное обучение</h4>
                      <p className="text-sm text-white/60">
                        Алгоритмы и модели, обучающиеся на данных для выполнения задач без явного программирования.
                      </p>
                    </TabsContent>
                    <TabsContent value="neural-networks" className="p-4 border rounded-md mt-2">
                      <h4 className="font-medium">Нейронные сети</h4>
                      <p className="text-sm text-white/60">
                        Структуры, имитирующие работу человеческого мозга для решения сложных задач обработки данных.
                      </p>
                    </TabsContent>
                    <TabsContent value="data-science" className="p-4 border rounded-md mt-2">
                      <h4 className="font-medium">Наука о данных</h4>
                      <p className="text-sm text-white/60">
                        Извлечение знаний и инсайтов из структурированных и неструктурированных данных.
                      </p>
                    </TabsContent>
                    <TabsContent value="computer-vision" className="p-4 border rounded-md mt-2">
                      <h4 className="font-medium">Компьютерное зрение</h4>
                      <p className="text-sm text-white/60">
                        Алгоритмы и системы для анализа, понимания и интерпретации визуальной информации.
                      </p>
                    </TabsContent>
                    <TabsContent value="nlp" className="p-4 border rounded-md mt-2">
                      <h4 className="font-medium">Обработка естественного языка</h4>
                      <p className="text-sm text-white/60">
                        Технологии для анализа, понимания и генерации человеческого языка AI системами.
                      </p>
                    </TabsContent>
                    <TabsContent value="robotics" className="p-4 border rounded-md mt-2">
                      <h4 className="font-medium">Робототехника</h4>
                      <p className="text-sm text-white/60">
                        Применение AI в роботах и автоматизированных системах, взаимодействующих с реальным миром.
                      </p>
                    </TabsContent>
                    <TabsContent value="ai-for-business" className="p-4 border rounded-md mt-2">
                      <h4 className="font-medium">AI для бизнеса</h4>
                      <p className="text-sm text-white/60">
                        Применение AI-технологий для оптимизации бизнес-процессов и принятия решений.
                      </p>
                    </TabsContent>
                    <TabsContent value="generative-ai" className="p-4 border rounded-md mt-2">
                      <h4 className="font-medium">Генеративный AI</h4>
                      <p className="text-sm text-white/60">
                        Системы и модели, способные создавать новый контент, в том числе изображения, тексты и музыку.
                      </p>
                    </TabsContent>
                  </Tabs>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="goal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ваша цель</FormLabel>
                <FormDescription>
                  Чего вы хотите достичь, изучая искусственный интеллект?
                </FormDescription>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Выберите цель" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="learn-basics">Изучить основы AI/ML</SelectItem>
                    <SelectItem value="broaden-knowledge">Расширить свои знания</SelectItem>
                    <SelectItem value="practice-skills">Получить практические навыки</SelectItem>
                    <SelectItem value="create-project">Создать свой проект</SelectItem>
                    <SelectItem value="find-internship">Найти стажировку</SelectItem>
                    <SelectItem value="career-change">Сменить карьеру</SelectItem>
                    <SelectItem value="research-purposes">Исследовательские цели</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {(form.watch("role") === "employee" || form.watch("role") === "researcher") && (
            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Отрасль</FormLabel>
                  <FormDescription>
                    В какой отрасли вы работаете или проводите исследования?
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="Например: медицина, финансы, образование" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          {(form.watch("role") === "employee" || form.watch("role") === "researcher") && (
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Должность</FormLabel>
                  <FormDescription>
                    Ваша текущая должность или роль
                  </FormDescription>
                  <FormControl>
                    <Input placeholder="Например: Data Scientist, инженер ML" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        
        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep(1)}
            disabled={isSubmitting}
          >
            Назад
          </Button>
          <Button
            type="button"
            onClick={() => onSubmit(form.getValues())}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1]"
          >
            Далее
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </>
    );
  };
  
  // Шаг 3: Дополнительные предпочтения
  const renderPreferencesStep = () => {
    return (
      <>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="preferredLearningStyle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Предпочтительный стиль обучения</FormLabel>
                <FormDescription>
                  Как вам удобнее всего воспринимать информацию?
                </FormDescription>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Выберите стиль обучения" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="visual">Визуально (схемы, графики, изображения)</SelectItem>
                    <SelectItem value="auditory">Аудио (слушать лекции, обсуждения)</SelectItem>
                    <SelectItem value="reading">Чтение (тексты, статьи, документация)</SelectItem>
                    <SelectItem value="practical">Практика (учиться на задачах, экспериментах)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="availableTimePerWeek"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Доступное время для обучения</FormLabel>
                <FormDescription>
                  Сколько часов в неделю вы готовы уделять на обучение?
                </FormDescription>
                <FormControl>
                  <div className="space-y-3">
                    <Slider
                      value={[field.value || 5]}
                      min={1}
                      max={20}
                      step={1}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-white/60">
                      <span>1 час</span>
                      <span>5 часов</span>
                      <span>10 часов</span>
                      <span>15 часов</span>
                      <span>20 часов</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                        {field.value || 5}
                      </div>
                      <div className="text-sm">
                        {(field.value || 5) === 1 && "Минимальное время"}
                        {(field.value || 5) > 1 && (field.value || 5) <= 5 && "Несколько часов в неделю"}
                        {(field.value || 5) > 5 && (field.value || 5) <= 10 && "Регулярное обучение"}
                        {(field.value || 5) > 10 && (field.value || 5) <= 15 && "Интенсивное обучение"}
                        {(field.value || 5) > 15 && "Полное погружение"}
                      </div>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="preferredDifficulty"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Предпочтительный уровень сложности</FormLabel>
                <FormDescription>
                  Какой уровень сложности материала вы предпочитаете?
                </FormDescription>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="easy" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Легкий (базовые концепции, постепенное введение)
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="moderate" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Средний (балансированный подход)
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="challenging" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Сложный (глубокое погружение, продвинутый материал)
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep(2)}
            disabled={isSubmitting}
          >
            Назад
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1]"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white animate-spin rounded-full mr-2"></div>
                Обработка...
              </>
            ) : (
              <>
                Завершить и получить рекомендации
                <BadgePlus className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </>
    );
  };
  
  return (
    <Card className="border-primary/20 bg-space-900/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-orbitron text-2xl text-center">
          Расширенное профилирование
        </CardTitle>
        <CardDescription className="text-center">
          Ответьте на несколько вопросов, чтобы получить персонализированный план обучения
        </CardDescription>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-white/60">Шаг {step} из 3</span>
            <span className="text-white/60">{Math.round((step / 3) * 100)}%</span>
          </div>
          <Progress value={(step / 3) * 100} className="h-1" />
        </div>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {renderStep()}
          </form>
        </Form>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-4">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="why">
            <AccordionTrigger className="text-sm">
              Зачем нужна эта информация?
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-white/70">
                Эти данные помогают нашей системе подобрать наиболее релевантные курсы и построить
                персонализированный план обучения, адаптированный к вашему уровню знаний, целям и предпочтениям.
                Мы используем эту информацию только для улучшения вашего образовательного опыта.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardFooter>
    </Card>
  );
}
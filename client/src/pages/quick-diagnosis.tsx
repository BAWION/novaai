import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/context/user-profile-context";
import { useAuth } from "@/context/auth-context"; // Добавляем импорт useAuth
import { Badge } from "@/components/ui/badge";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  SkillLevel, 
  AIExperience, 
  UserInterest, 
  UserGoal
} from "@/lib/constants";
import { diagnosisApi } from "@/api/diagnosis-api";
import { 
  Brain, 
  ArrowRight, 
  Code, 
  ChevronRight, 
  ChevronLeft, 
  BookOpen,
  Sparkles,
  Target,
  User,
  Clock,
  Rocket,
  FileText,
  Check,
  Trophy,
  Star
} from "lucide-react";

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
  const { user, isAuthenticated } = useAuth(); // Добавляем использование хука useAuth
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  
  // Расширенная структура данных формы, включающая redirectAfterComplete
  interface DiagnosticsFormData {
    specialization: string;
    experience: string;
    goal: string;
    languages: string[];
    redirectAfterComplete?: string;
  }
  
  const [formData, setFormData] = useState<DiagnosticsFormData>({
    specialization: "",
    experience: "",
    goal: "",
    languages: [],
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
  
  // Проверяем, нужно ли восстановить результаты диагностики после входа в систему
  useEffect(() => {
    const checkForSavedDiagnosticResults = () => {
      // Проверяем, авторизован ли пользователь и есть ли сохраненные результаты
      if (user && sessionStorage.getItem("diagnosticResults")) {
        try {
          console.log("[SkillsDNA] Обнаружены сохраненные результаты диагностики");
          
          // Получаем сохраненные данные
          const savedData = JSON.parse(sessionStorage.getItem("diagnosticResults") || "{}");
          
          // Проверяем, что данные содержат необходимые поля
          if (savedData.formData && savedData.skillProfile) {
            console.log("[SkillsDNA] Восстанавливаем данные диагностики:", {
              formData: savedData.formData,
              skillCount: Object.keys(savedData.skillProfile).length
            });
            
            // Показываем уведомление пользователю
            toast({
              title: "Восстановлены данные диагностики",
              description: "Ваши предыдущие ответы были сохранены. Продолжаем обработку результатов.",
              duration: 6000,
            });
            
            // Устанавливаем данные формы
            setFormData(savedData.formData);
            
            // Запускаем процесс сохранения результатов
            setTimeout(() => {
              // Имитируем отправку данных диагностики напрямую
              const diagnosisResult = {
                userId: user.id,
                skills: savedData.skillProfile,
                diagnosticType: 'quick' as import("@/api/diagnosis-api").DiagnosticType,
                metadata: {
                  ...savedData.formData,
                  profileUpdate: savedData.profileUpdate
                }
              };
              
              console.log("[SkillsDNA] Отправляем восстановленные результаты:", diagnosisResult);
              
              // Отправляем результаты в систему Skills DNA
              diagnosisApi.saveResults(diagnosisResult)
                .then(result => {
                  console.log("[SkillsDNA] Восстановленные результаты успешно сохранены:", result);
                  
                  // Очищаем временные данные
                  sessionStorage.removeItem("diagnosticResults");
                  
                  toast({
                    title: "Данные успешно сохранены",
                    description: "Результаты диагностики добавлены в ваш профиль Skills DNA",
                    variant: "default",
                  });
                  
                  // Перенаправляем на dashboard после успешного сохранения
                  setTimeout(() => {
                    setLocation("/dashboard");
                  }, 1000);
                })
                .catch(error => {
                  console.error("[SkillsDNA] Ошибка при сохранении восстановленных результатов:", error);
                  
                  toast({
                    title: "Ошибка сохранения",
                    description: "Не удалось сохранить результаты. Попробуйте пройти диагностику заново.",
                    variant: "destructive",
                  });
                });
            }, 1500);
            
            return true;
          }
        } catch (error) {
          console.error("[SkillsDNA] Ошибка при обработке сохраненных результатов:", error);
          
          // Очищаем поврежденные данные
          sessionStorage.removeItem("diagnosticResults");
          
          toast({
            title: "Ошибка восстановления данных",
            description: "Не удалось восстановить предыдущие результаты диагностики.",
            variant: "destructive",
          });
        }
      }
      
      return false;
    };
    
    // Запускаем проверку при изменении статуса пользователя
    if (user) {
      checkForSavedDiagnosticResults();
    }
  }, [user, toast, setLocation]);
  
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
  
  // Состояния для анимации "распределительной шляпы"
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [userSkillProfile, setUserSkillProfile] = useState<{[key: string]: number}>({});
  
  const handleComplete = async () => {
    try {
      // Функция для преобразования уровня опыта в SkillLevel
      const mapExperienceToLevel = (exp: string): SkillLevel => {
        switch (exp) {
          case "beginner": return 1;
          case "intermediate": return 2;
          case "advanced": return 3;
          default: return 1;
        }
      };
      
      // Функция для маппинга специализации в UserInterest
      const mapSpecializationToInterest = (spec: string): UserInterest => {
        switch (spec) {
          case "machine-learning": return "machine-learning";
          case "data-science": return "data-science";
          case "programming": return "computer-vision"; // Ближайшее соответствие
          default: return "machine-learning";
        }
      };
      
      // Функция для маппинга цели в UserGoal
      const mapGoalToUserGoal = (goalInput: string): UserGoal => {
        switch (goalInput) {
          case "learning": return "practice-skills";
          case "career": return "career-change";
          case "project": return "create-project";
          default: return "practice-skills";
        }
      };
      
      // Преобразуем данные диагностики в формат для профиля пользователя
      const profileUpdate = {
        completedOnboarding: true,
        interest: mapSpecializationToInterest(formData.specialization),
        experience: formData.experience as AIExperience || "beginner",
        goal: mapGoalToUserGoal(formData.goal),
        pythonLevel: mapExperienceToLevel(formData.experience),
      };
      
      // Начинаем анимацию анализа
      setIsAnalyzing(true);
      setStep(4); // Переходим на страницу анализа
      
      // Генерируем профиль навыков на основе выбранных параметров
      const skillProfile = {
        "Программирование AI": mapExperienceToLevel(formData.experience) * 20,
        "Машинное обучение": formData.specialization === "machine-learning" ? 70 : 40,
        "Работа с данными": formData.specialization === "data-science" ? 75 : 35,
        "Нейросети": formData.specialization === "machine-learning" ? 65 : 30,
        "Алгоритмы": mapExperienceToLevel(formData.experience) * 15,
        "Исследования": formData.goal === "learning" ? 60 : 40,
        "Практические навыки": formData.goal === "project" ? 75 : 50,
      };
      
      setUserSkillProfile(skillProfile);
      
      // Имитация последовательного анализа с задержками
      const updateUserProfileSafely = () => {
        try {
          updateUserProfile(profileUpdate);
          toast({
            title: "Диагностика завершена",
            description: "Ваш профиль обновлен, рекомендации готовы!",
          });
          
          // Очищаем данные из sessionStorage через 5 сек
          setTimeout(() => {
            sessionStorage.removeItem("onboardingData");
          }, 5000);
        } catch (error) {
          console.error("Ошибка при обновлении профиля:", error);
        }
      };
      
      // Сохраняем результаты в Skills DNA через новый API
      const saveSkillsToDna = async () => {
        try {
          // Выводим полную информацию о контексте пользователя для отладки
          console.log("[SkillsDNA] Контекст пользователя:", { 
            authUser: user, 
            profileUser: userProfile
          });
          
          // Используем ID пользователя из контекста auth, если доступен
          const userId = user?.id || userProfile?.userId;
          
          console.log("[SkillsDNA] Определен ID пользователя:", userId);
          
          // Сохраняем данные диагностики в sessionStorage для возможного восстановления после авторизации
          const diagnosticData = {
            formData,
            skillProfile,
            profileUpdate,
            timestamp: new Date().toISOString()
          };
          
          sessionStorage.setItem("diagnosticResults", JSON.stringify(diagnosticData));
          console.log("[SkillsDNA] Временно сохранены результаты диагностики в sessionStorage");
          
          // Проверяем авторизацию
          if (!userId) {
            console.warn("[SkillsDNA] Пользователь не авторизован, предлагаем войти в систему");
            
            toast({
              title: "Требуется авторизация",
              description: "Пожалуйста, войдите в систему, чтобы сохранить результаты диагностики и получить персонализированные рекомендации.",
              duration: 6000,
            });
            
            // Добавляем задержку перед перенаправлением, чтобы пользователь успел прочитать сообщение
            setTimeout(() => {
              // Сохраняем URL для возврата после авторизации (используем новый путь)
              sessionStorage.setItem("redirectAfterAuth", "/deep-diagnosis");
              
              // Перенаправляем на страницу авторизации
              setLocation("/auth");
            }, 2000);
            
            return;
          }
          
          // Только если пользователь авторизован
          // Импортируем тип DiagnosticType явно
          const diagnosticType: import("@/api/diagnosis-api").DiagnosticType = 'quick';
          
          // Выводим информацию о навыках для отладки
          console.log("[SkillsDNA] Сформированный профиль навыков:", { 
            skillCount: Object.keys(skillProfile).length,
            skills: Object.entries(skillProfile).map(([k, v]) => `${k}: ${v}`).join(', ')
          });
          
          // Подготавливаем данные для отправки
          const diagnosisResult: import("@/api/diagnosis-api").DiagnosisResult = {
            userId,
            skills: skillProfile,
            diagnosticType, // Теперь используем переменную с явным типом
            metadata: {
              specialization: formData.specialization,
              experience: formData.experience,
              goal: formData.goal,
              languages: formData.languages,
              formData,
              profileUpdate
            }
          };
          
          console.log("[SkillsDNA] Отправляем результаты диагностики для пользователя:", userId);
          
          try {
            // Отправляем результаты в систему Skills DNA
            const result = await diagnosisApi.saveResults(diagnosisResult);
            console.log("[SkillsDNA] Результаты диагностики успешно сохранены:", result);
            
            // Очищаем временные данные после успешного сохранения
            sessionStorage.removeItem("diagnosticResults");
            
            toast({
              title: "Данные сохранены",
              description: "Результаты диагностики успешно сохранены в вашем профиле Skills DNA",
              variant: "default",
            });
          } catch (error) {
            console.error("[SkillsDNA] Ошибка при сохранении результатов:", error);
            
            toast({
              title: "Ошибка сохранения",
              description: error instanceof Error ? error.message : "Не удалось сохранить результаты диагностики. Пожалуйста, попробуйте снова.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Ошибка при сохранении результатов в Skills DNA:", error);
        }
      };
      
      setTimeout(() => {
        setAnalysisStep(1); // Анализируем интересы
        
        setTimeout(() => {
          setAnalysisStep(2); // Анализируем опыт
          
          setTimeout(() => {
            setAnalysisStep(3); // Анализируем цели
            
            setTimeout(() => {
              setAnalysisStep(4); // Формируем рекомендации
              
              // Генерируем фиктивные рекомендации по курсам
              const mockRecommendations = [
                {
                  id: 1,
                  title: "Основы машинного обучения",
                  description: "Базовый курс по теории и практике машинного обучения",
                  match: 95,
                  difficulty: 2,
                  reason: formData.specialization === "machine-learning" 
                    ? "Идеально соответствует вашему интересу к машинному обучению"
                    : "Хорошая база для выбранной вами специализации"
                },
                {
                  id: 2,
                  title: "Python для анализа данных",
                  description: "Практический курс по использованию Python в обработке данных",
                  match: 87,
                  difficulty: formData.experience === "beginner" ? 2 : 3,
                  reason: formData.specialization === "data-science"
                    ? "Соответствует вашему интересу к науке о данных"
                    : "Полезные навыки для любой AI-специализации"
                },
                {
                  id: 3,
                  title: "Нейросетевые архитектуры",
                  description: "Углубленное изучение архитектур нейронных сетей",
                  match: formData.experience === "advanced" ? 91 : 78,
                  difficulty: 4,
                  reason: formData.experience === "advanced" 
                    ? "Соответствует вашему продвинутому уровню" 
                    : "Поможет развить ваши навыки до следующего уровня"
                },
              ];
              
              setRecommendations(mockRecommendations);
              
              setTimeout(() => {
                // Завершаем анализ и сохраняем профиль
                setAnalysisComplete(true);
                
                // Сохраняем результаты в профиль пользователя
                updateUserProfileSafely();
                
                // Сохраняем результаты в Skills DNA
                saveSkillsToDna();
                
              }, 1500);
            }, 1200);
          }, 1200);
        }, 1200);
      }, 1000);
      
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить результаты диагностики. Попробуйте еще раз.",
        variant: "destructive",
      });
      setIsAnalyzing(false);
    }
  };
  
  // Функция для перехода на Dashboard с результатами анализа
  const handleContinueToDashboard = () => {
    // Перенаправляем на Dashboard или указанную страницу
    const redirectUrl = formData.redirectAfterComplete || "/dashboard";
    setLocation(redirectUrl);
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
            
            {/* Шаг 4: Анализ и результаты */}
            {step === 4 && (
              <div className="py-4">
                {!analysisComplete ? (
                  <div className="text-center">
                    {/* Визуализация AI-анализа (распределительная шляпа) */}
                    <div className="relative mx-auto mb-8 w-32 h-32 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600/40 to-blue-600/40 animate-pulse"></div>
                      <div className="absolute inset-2 rounded-full bg-space-800 flex items-center justify-center">
                        <Sparkles className="h-12 w-12 text-purple-400" />
                      </div>
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-40">
                        <div className="bg-gradient-to-r from-purple-500/0 via-purple-500/50 to-purple-500/0 h-0.5"></div>
                      </div>
                      {/* Лучи света */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full h-10 w-1 bg-gradient-to-b from-purple-500/0 to-purple-500/50"></div>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full h-10 w-1 bg-gradient-to-t from-purple-500/0 to-purple-500/50"></div>
                    </div>
                    
                    <h3 className="text-xl font-orbitron mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#B28DFF] via-[#8BE0F7] to-[#B28DFF]">
                      NovaAI анализирует ваши навыки
                    </h3>
                    
                    <div className="space-y-6 max-w-md mx-auto">
                      {/* Прогресс анализа */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full ${analysisStep >= 1 ? 'bg-primary text-white' : 'bg-white/10'} flex items-center justify-center text-xs`}>
                            {analysisStep >= 1 ? <Check className="h-4 w-4" /> : '1'}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Анализ интересов</span>
                              {analysisStep >= 1 && <span className="text-xs text-primary">Завершено</span>}
                            </div>
                            <Progress value={analysisStep >= 1 ? 100 : 0} className="h-1.5" />
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full ${analysisStep >= 2 ? 'bg-primary text-white' : 'bg-white/10'} flex items-center justify-center text-xs`}>
                            {analysisStep >= 2 ? <Check className="h-4 w-4" /> : '2'}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Оценка опыта</span>
                              {analysisStep >= 2 && <span className="text-xs text-primary">Завершено</span>}
                            </div>
                            <Progress value={analysisStep >= 2 ? 100 : analysisStep === 1 ? 60 : 0} className="h-1.5" />
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full ${analysisStep >= 3 ? 'bg-primary text-white' : 'bg-white/10'} flex items-center justify-center text-xs`}>
                            {analysisStep >= 3 ? <Check className="h-4 w-4" /> : '3'}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Определение целей</span>
                              {analysisStep >= 3 && <span className="text-xs text-primary">Завершено</span>}
                            </div>
                            <Progress value={analysisStep >= 3 ? 100 : analysisStep === 2 ? 60 : 0} className="h-1.5" />
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full ${analysisStep >= 4 ? 'bg-primary text-white' : 'bg-white/10'} flex items-center justify-center text-xs`}>
                            {analysisStep >= 4 ? <Check className="h-4 w-4" /> : '4'}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Формирование рекомендаций</span>
                              {analysisStep >= 4 && <span className="text-xs text-primary">Завершено</span>}
                            </div>
                            <Progress value={analysisStep >= 4 ? 100 : analysisStep === 3 ? 60 : 0} className="h-1.5" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Комментарии к анализу */}
                      <div className="bg-space-900/50 rounded-lg p-4 border border-white/10 text-left">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={analysisStep}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.2 }}
                          >
                            {analysisStep === 0 && <p>Инициализация анализа...</p>}
                            {analysisStep === 1 && (
                              <div>
                                <p className="font-medium">Анализ интересов</p>
                                <p className="text-sm text-white/70 mt-1">
                                  {formData.specialization === "machine-learning" && "Ваш интерес к машинному обучению указывает на аналитический склад ума и стремление к решению сложных задач с использованием данных."}
                                  {formData.specialization === "data-science" && "Ваш интерес к науке о данных демонстрирует склонность к работе с большими объемами информации и извлечению из них полезных инсайтов."}
                                  {formData.specialization === "programming" && "Ваш интерес к программированию ИИ показывает склонность к технической реализации интеллектуальных систем и алгоритмов."}
                                </p>
                              </div>
                            )}
                            {analysisStep === 2 && (
                              <div>
                                <p className="font-medium">Оценка опыта</p>
                                <p className="text-sm text-white/70 mt-1">
                                  {formData.experience === "beginner" && "Будучи новичком, вы имеете отличную возможность построить прочный фундамент знаний, начиная с самых основ."}
                                  {formData.experience === "intermediate" && "Имея средний уровень опыта, вы можете углубить свои знания в специализированных областях."}
                                  {formData.experience === "advanced" && "С вашим продвинутым уровнем опыта мы подберем курсы, которые помогут вам достичь экспертного уровня."}
                                </p>
                              </div>
                            )}
                            {analysisStep === 3 && (
                              <div>
                                <p className="font-medium">Определение целей</p>
                                <p className="text-sm text-white/70 mt-1">
                                  {formData.goal === "learning" && "Ваша цель расширить знания требует разностороннего подхода с акцентом на теоретические основы и их практическое применение."}
                                  {formData.goal === "career" && "Ваша цель развития карьеры требует фокуса на востребованных навыках и технологиях с высокой рыночной ценностью."}
                                  {formData.goal === "project" && "Ваша цель реализовать проект требует практического подхода с фокусом на прикладные инструменты и технологии."}
                                </p>
                              </div>
                            )}
                            {analysisStep === 4 && (
                              <div>
                                <p className="font-medium">Формирование рекомендаций</p>
                                <p className="text-sm text-white/70 mt-1">
                                  На основе ваших интересов, опыта и целей мы подбираем оптимальный набор курсов и материалов для вашего образовательного пути. Почти готово...
                                </p>
                              </div>
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-8 text-center">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", duration: 0.8 }}
                        className="mx-auto mb-4 w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center"
                      >
                        <Check className="h-10 w-10 text-white" />
                      </motion.div>
                      <h3 className="text-xl font-orbitron mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#B28DFF] via-[#8BE0F7] to-[#B28DFF]">
                        Анализ завершен!
                      </h3>
                      <p className="text-white/70">
                        Мы определили ваш профиль навыков и подготовили персональные рекомендации.
                      </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Профиль навыков */}
                      <div>
                        <h4 className="text-lg font-medium mb-4 flex items-center">
                          <User className="h-5 w-5 mr-2 text-primary" />
                          Ваш профиль навыков
                        </h4>
                        
                        <Glassmorphism className="p-4 rounded-lg">
                          <div className="space-y-3">
                            {Object.entries(userSkillProfile).map(([skill, level]) => (
                              <div key={skill} className="space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-sm">{skill}</span>
                                  <span className="text-xs text-white/70">{level}%</span>
                                </div>
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      level > 70 ? 'bg-green-500' :
                                      level > 50 ? 'bg-blue-500' :
                                      level > 30 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${level}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </Glassmorphism>
                      </div>
                      
                      {/* Рекомендации */}
                      <div>
                        <h4 className="text-lg font-medium mb-4 flex items-center">
                          <BookOpen className="h-5 w-5 mr-2 text-primary" />
                          Рекомендуемые курсы
                        </h4>
                        
                        <div className="space-y-3">
                          {recommendations.map((course) => (
                            <Glassmorphism 
                              key={course.id}
                              className="p-3 rounded-lg border-l-2 border-primary"
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <h5 className="font-medium">{course.title}</h5>
                                    <Badge className="bg-green-500/20 text-green-400 border-0">
                                      {course.match}% совпадение
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-white/70 mt-1">{course.description}</p>
                                  
                                  <div className="mt-2 text-xs text-white/60 flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                      <Target className="h-3 w-3" />
                                      <span>Уровень сложности: {course.difficulty}/5</span>
                                    </div>
                                  </div>
                                  
                                  {course.reason && (
                                    <div className="mt-2 text-xs p-1.5 bg-primary/10 rounded">
                                      <span className="text-primary font-medium">Почему подходит:</span> {course.reason}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </Glassmorphism>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex justify-between mt-8">
              {step < 4 ? (
                <>
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
                </>
              ) : (
                <div className="w-full flex flex-col md:flex-row gap-4 justify-center items-center">
                  {analysisComplete && (
                    <>
                      <Button 
                        onClick={() => setLocation("/courses?filter=recommended")}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white"
                      >
                        Рекомендуемые курсы
                        <Target className="h-4 w-4 ml-2" />
                      </Button>
                      
                      <Button 
                        onClick={handleContinueToDashboard}
                        className="bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] hover:opacity-90 text-white"
                      >
                        Перейти к обучению
                        <Rocket className="h-4 w-4 ml-2" />
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
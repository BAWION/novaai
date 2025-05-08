import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useUserProfile } from "@/context/user-profile-context";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { 
  UserRole, 
  AIExperience, 
  SkillLevel, 
  UserInterest, 
  UserGoal 
} from "@/lib/constants";
import { diagnosisApi } from "@/api/diagnosis-api";
import SkillsRadarChart from "@/components/skills-radar-chart";
import SimpleRadarChart from "@/components/skills-radar-simple";

// Компоненты UI
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

// Иконки
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
  Star,
  BookType,
  GraduationCap,
  Briefcase,
  Search,
  Lightbulb,
  Zap,
  Timer,
  Layers,
  BarChart,
  Network
} from "lucide-react";

/**
 * Модель данных расширенной формы диагностики
 */
interface DeepDiagnosisFormData {
  // Основная информация
  role: string; // Роль пользователя
  experience: string; // Общий опыт в AI/ML
  ageGroup: string; // Возрастная группа
  education: string; // Уровень образования
  
  // Технические навыки
  pythonLevel: number; // Уровень владения Python
  programmingLanguages: string[]; // Другие языки программирования
  dataAnalysisLevel: number; // Уровень навыков анализа данных
  mathBackground: string; // Уровень математических знаний
  
  // Когнитивные способности и предпочтения
  analyticalThinking: number; // Аналитическое мышление (1-5)
  creativeProblemSolving: number; // Творческий подход к решению проблем (1-5)
  attentionToDetail: number; // Внимание к деталям (1-5)
  
  // Интересы и направления
  interest: string; // Основное направление интереса
  subdomains: string[]; // Поддомены или специализированные области
  
  // Цели и предпочтения
  goal: string; // Основная цель обучения
  timeCommitment: string; // Сколько времени готов уделять обучению
  desiredCompletionTime: string; // Желаемый срок освоения материала
  preferredLearningStyle: string; // Предпочтительный стиль обучения
  projectTypes: string[]; // Типы проектов, которые интересуют
  
  // Текущие барьеры и сложности
  learningBarriers: string[]; // Что мешает учиться
  
  // Дополнительно
  industry?: string; // Индустрия работы (если применимо)
  specificGoals?: string; // Конкретные цели обучения
  specificProjects?: string; // Конкретные проекты, которые хочет реализовать
  redirectAfterComplete?: string; // URL для перенаправления после завершения
}

/**
 * Структура профиля навыков пользователя
 */
interface SkillProfile {
  [key: string]: number; // название навыка: уровень от 0 до 100
}

/**
 * Структура рекомендации курса
 */
interface CourseRecommendation {
  id: number;
  title: string;
  description: string;
  match: number;
  difficulty: number;
  duration?: number;
  modules?: number;
  skillGaps?: string[];
  reason?: string;
}

/**
 * Компонент страницы глубокой диагностики
 */
export default function DeepDiagnosisPage() {
  const { toast } = useToast();
  const { userProfile, updateUserProfile } = useUserProfile();
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();
  
  // Состояния
  const [step, setStep] = useState(1);
  const [totalSteps] = useState(4);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [userSkillProfile, setUserSkillProfile] = useState<SkillProfile>({});
  const [recommendations, setRecommendations] = useState<CourseRecommendation[]>([]);
  
  // Это компонент глубокой диагностики, по умолчанию разрешаем показывать рекомендации
  const isDeepdDiagnosis = true;
  
  // Формы данных
  const [formData, setFormData] = useState<DeepDiagnosisFormData>({
    // Основная информация
    role: "student", // соответствует UserRole
    experience: "beginner", // соответствует AIExperience
    ageGroup: "18-24", 
    education: "bachelor",
    
    // Технические навыки
    pythonLevel: 2, // соответствует SkillLevel
    programmingLanguages: [],
    dataAnalysisLevel: 1,
    mathBackground: "basic",
    
    // Когнитивные способности
    analyticalThinking: 3,
    creativeProblemSolving: 3,
    attentionToDetail: 3,
    
    // Интересы и направления
    interest: "machine-learning", // соответствует UserInterest
    subdomains: [],
    
    // Цели и предпочтения
    goal: "practice-skills", // соответствует UserGoal
    timeCommitment: "medium",
    desiredCompletionTime: "3-6-months",
    preferredLearningStyle: "visual",
    projectTypes: [],
    
    // Барьеры
    learningBarriers: [],
    
    // Дополнительные детали
    specificGoals: "",
    specificProjects: "",
  });
  
  // Функция перехода к следующему шагу
  const handleNext = () => {
    // Проверяем, что текущий шаг заполнен
    if (step === 1 && !formData.role) {
      toast({
        title: "Требуется выбор",
        description: "Пожалуйста, укажите вашу роль",
        variant: "destructive",
      });
      return;
    }
    
    if (step === totalSteps) {
      handleSubmit();
    } else {
      setStep(step + 1);
    }
  };
  
  // Функция возврата к предыдущему шагу
  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  // Обработка отправки формы
  const handleSubmit = async () => {
    setIsAnalyzing(true);
    setAnalysisStep(0);
    
    try {
      // Начало анализа
      // Здесь была бы логика для обработки данных формы
      
      setTimeout(() => {
        setAnalysisStep(1); // Первый шаг анализа
        
        setTimeout(() => {
          setAnalysisStep(2); // Второй шаг анализа
          
          setTimeout(() => {
            setAnalysisStep(3); // Третий шаг анализа
            
            setTimeout(() => {
              setAnalysisStep(4); // Четвертый шаг анализа
              
              setTimeout(() => {
                setAnalysisStep(5); // Пятый шаг анализа
                
                // Сгенерировать результаты и завершить анализ
                setAnalysisComplete(true);
              }, 1000);
            }, 800);
          }, 800);
        }, 800);
      }, 800);
      
    } catch (error) {
      console.error("Error processing diagnosis:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось завершить диагностику. Пожалуйста, попробуйте еще раз.",
        variant: "destructive",
      });
      setIsAnalyzing(false);
    }
  };
  
  // Функция для перехода к профилю Skills DNA с результатами глубокой диагностики
  const handleViewSkillsDna = () => {
    setLocation("/profile?section=skills-dna&deep=true");
  };
  
  // Функция для перехода к регистрации после завершения диагностики
  const handleContinueToDashboard = () => {
    setLocation("/register-after-onboarding");
  };
  
  // Функция для генерации рекомендаций курсов на основе профиля
  const generateRecommendations = (): CourseRecommendation[] => {
    // Здесь была бы логика для генерации рекомендаций
    return [
      {
        id: 1,
        title: "Основы искусственного интеллекта",
        description: "Введение в ключевые концепции AI и ML",
        match: 95,
        difficulty: 1,
        duration: 4,
        modules: 6,
        skillGaps: ["Понимание основ ИИ", "Критическое мышление"],
        reason: "Идеально подходит для новичков в AI/ML"
      }
    ];
  };
  
  return (
    <div className="min-h-screen bg-space-900 text-white">
      <div className="container max-w-5xl mx-auto px-4 py-8">
        <Card className="bg-space-800/50 border-primary/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-center font-bold bg-gradient-to-r from-purple-400 to-blue-500 text-transparent bg-clip-text">
              Глубокая диагностика навыков
            </CardTitle>
            <CardDescription className="text-center text-gray-300">
              Пройдите расширенную диагностику для создания вашего персонализированного учебного плана
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="mb-6">
              {/* Индикатор прогресса */}
              {!isAnalyzing ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Шаг {step} из {totalSteps}</span>
                    <span>{Math.round((step / totalSteps) * 100)}%</span>
                  </div>
                  <Progress value={(step / totalSteps) * 100} className="h-2 bg-space-700" />
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Анализ данных</span>
                    <span>{analysisComplete ? "Завершено" : "В процессе..."}</span>
                  </div>
                  <Progress value={analysisComplete ? 100 : (analysisStep / 5) * 100} className="h-2 bg-space-700" />
                </div>
              )}
            </div>
            
            {/* Анализ в процессе */}
            {isAnalyzing && (
              <div className="flex flex-col items-center justify-center py-12">
                {!analysisComplete ? (
                  <div className="text-center">
                    {/* Визуализация AI-анализа (распределительная шляпа) */}
                    <div className="relative mx-auto mb-8 w-36 h-36 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600/40 to-blue-600/40 animate-pulse"></div>
                      <div className="absolute inset-3 rounded-full bg-space-800 flex items-center justify-center">
                        <Brain className="h-16 w-16 text-purple-400 animate-pulse" />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-4">AI анализирует ваши ответы</h3>
                    <p className="text-gray-300 mb-8 max-w-md mx-auto">
                      {analysisStep === 0 && "Инициализация анализа данных..."}
                      {analysisStep === 1 && "Анализ образовательного профиля..."}
                      {analysisStep === 2 && "Оценка технических навыков..."}
                      {analysisStep === 3 && "Анализ интересов и предпочтений..."}
                      {analysisStep === 4 && "Формирование персонализированных рекомендаций..."}
                      {analysisStep === 5 && "Создание карты навыков..."}
                    </p>
                    
                    <div className="flex justify-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-purple-500 animate-pulse"></div>
                      <div className="h-3 w-3 rounded-full bg-indigo-500 animate-pulse delay-100"></div>
                      <div className="h-3 w-3 rounded-full bg-blue-500 animate-pulse delay-200"></div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full">
                    <div className="flex justify-center mb-8">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-emerald-600 flex items-center justify-center">
                        <Check className="h-10 w-10 text-white" />
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-center mb-6">Анализ завершен!</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      {/* Результаты анализа */}
                      <Card className="bg-space-800/50 border-primary/20">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Ваш профиль навыков</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="aspect-square w-full max-w-[240px] mx-auto">
                            <SimpleRadarChart 
                              skills={{
                                "Программирование": 60,
                                "Анализ данных": 45,
                                "ML Теория": 30,
                                "Математика": 40,
                                "Практика": 50
                              }} 
                            />
                          </div>
                        </CardContent>
                      </Card>
                      
                      {/* Рекомендации по обучению */}
                      <Card className="bg-space-800/50 border-primary/20">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">Рекомендуемые направления</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-4">
                            <li className="flex items-start">
                              <div className="flex-shrink-0 mt-1">
                                <Target className="h-5 w-5 text-green-400" />
                              </div>
                              <div className="ml-3">
                                <h4 className="font-medium">Основы искусственного интеллекта</h4>
                                <p className="text-sm text-gray-400">Фокус на базовых концепциях и практическом применении</p>
                              </div>
                            </li>
                            <li className="flex items-start">
                              <div className="flex-shrink-0 mt-1">
                                <Code className="h-5 w-5 text-blue-400" />
                              </div>
                              <div className="ml-3">
                                <h4 className="font-medium">Python для анализа данных</h4>
                                <p className="text-sm text-gray-400">Работа с библиотеками для обработки данных</p>
                              </div>
                            </li>
                            <li className="flex items-start">
                              <div className="flex-shrink-0 mt-1">
                                <BarChart className="h-5 w-5 text-purple-400" />
                              </div>
                              <div className="ml-3">
                                <h4 className="font-medium">Визуализация данных</h4>
                                <p className="text-sm text-gray-400">Создание наглядных представлений и паттернов данных</p>
                              </div>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Навигационные кнопки */}
            <div className="flex justify-between mt-8">
              {step <= totalSteps && !isAnalyzing ? (
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
                    {step === totalSteps ? "Завершить анализ" : "Далее"}
                    {step === totalSteps ? <Sparkles className="h-4 w-4 ml-2" /> : <ChevronRight className="h-4 w-4 ml-2" />}
                  </Button>
                </>
              ) : (
                <div className="w-full flex justify-center">
                  {step === totalSteps && analysisComplete && (
                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                      {isAuthenticated ? (
                        <>
                          <Button 
                            onClick={() => setLocation("/courses?filter=recommended&deep=true")}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white"
                          >
                            Рекомендуемые курсы
                            <Target className="h-4 w-4 ml-2" />
                          </Button>
                          
                          <Button 
                            onClick={handleViewSkillsDna}
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white"
                          >
                            Посмотреть Skills DNA
                            <FileText className="h-4 w-4 ml-2" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            onClick={handleContinueToDashboard}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white"
                          >
                            Зарегистрироваться и увидеть рекомендации
                            <User className="h-4 w-4 ml-2" />
                          </Button>
                          
                          <Button 
                            onClick={handleViewSkillsDna}
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white"
                          >
                            Посмотреть Skills DNA
                            <FileText className="h-4 w-4 ml-2" />
                          </Button>
                        </>
                      )}
                    </div>
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
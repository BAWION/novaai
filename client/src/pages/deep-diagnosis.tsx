import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useUserProfile } from "@/context/user-profile-context";
import { useToast } from "@/hooks/use-toast";
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
  
  // Справочные данные
  const roles = [
    { id: "student", label: "Студент", description: "Обучаюсь в образовательном учреждении" },
    { id: "professional", label: "Специалист", description: "Работаю в IT/технической сфере" },
    { id: "researcher", label: "Исследователь", description: "Занимаюсь научной/исследовательской деятельностью" },
    { id: "manager", label: "Руководитель", description: "Управляю командой или проектами" },
    { id: "entrepreneur", label: "Предприниматель", description: "Развиваю собственный бизнес или стартап" },
    { id: "other", label: "Другое", description: "Не указано выше" }
  ];
  
  const experienceLevels = [
    { id: "beginner", title: "Новичок", description: "Только начинаю знакомство с искусственным интеллектом" },
    { id: "intermediate", title: "Средний уровень", description: "Имею базовые знания и некоторый практический опыт" },
    { id: "advanced", title: "Продвинутый", description: "Хорошо разбираюсь и имею опыт работы над проектами" }
  ];
  
  // Используем id, которые соответствуют типу UserInterest из констант
  const interestAreas = [
    { id: "machine-learning", label: "Машинное обучение", icon: <Brain /> },
    { id: "neural-networks", label: "Нейронные сети", icon: <Network /> },
    { id: "data-science", label: "Наука о данных", icon: <BarChart /> },
    { id: "computer-vision", label: "Компьютерное зрение", icon: <Search /> },
    { id: "ethics", label: "Этика ИИ", icon: <FileText /> },
    { id: "law", label: "Право и регулирование ИИ", icon: <BookType /> }
  ];
  
  const subdomains = {
    "machine-learning": [
      "supervised-learning", "unsupervised-learning", "reinforcement-learning",
      "feature-engineering", "model-evaluation", "model-deployment"
    ],
    "neural-networks": [
      "cnn", "rnn", "transformers", "generative-models", "attention-mechanisms",
      "lstm", "gans", "autoencoders", "transfer-learning"
    ],
    "data-science": [
      "data-exploration", "data-cleaning", "data-visualization", 
      "statistical-analysis", "big-data", "predictive-modeling"
    ],
    "computer-vision": [
      "image-classification", "object-detection", "image-segmentation", 
      "face-recognition", "video-analysis", "generative-vision"
    ],
    "ethics": [
      "bias-fairness", "transparency", "accountability", 
      "privacy", "social-impact", "governance"
    ],
    "law": [
      "ai-regulation", "intellectual-property", "privacy-law", 
      "liability", "compliance", "safety-standards"
    ]
  };
  
  const goals = [
    { id: "practice-skills", title: "Развить навыки", description: "Хочу глубже изучить теорию и концепции AI/ML" },
    { id: "career-change", title: "Сменить профессию", description: "Стремлюсь получить навыки для профессионального роста" },
    { id: "create-project", title: "Реализовать проект", description: "Хочу применить AI/ML для решения конкретной задачи" },
    { id: "find-internship", title: "Найти стажировку", description: "Хочу найти практику в компании" }
  ];
  
  const learningStyles = [
    { id: "visual", label: "Визуальный", description: "Лучше учусь через визуализации и диаграммы" },
    { id: "practical", label: "Практический", description: "Предпочитаю учиться на практике, выполняя задания" },
    { id: "theoretical", label: "Теоретический", description: "Предпочитаю глубокое понимание теории и концепций" },
    { id: "social", label: "Социальный", description: "Предпочитаю учиться в группе или с наставником" }
  ];
  
  const timeCommitments = [
    { id: "low", label: "1-3 часа в неделю", description: "Могу уделять минимальное время" },
    { id: "medium", label: "4-7 часов в неделю", description: "Готов регулярно заниматься несколько раз в неделю" },
    { id: "high", label: "8+ часов в неделю", description: "Могу уделять значительное время обучению" }
  ];
  
  const projectTypes = [
    { id: "data-analysis", label: "Анализ данных", description: "Извлечение инсайтов из данных" },
    { id: "predictive-models", label: "Предсказательные модели", description: "Прогнозирование на основе исторических данных" },
    { id: "nlp-apps", label: "NLP приложения", description: "Работа с текстовыми данными" },
    { id: "computer-vision-apps", label: "Компьютерное зрение", description: "Работа с изображениями и видео" },
    { id: "recommendation-systems", label: "Рекомендательные системы", description: "Персонализированные рекомендации" },
    { id: "chatbots-assistants", label: "Чат-боты и ассистенты", description: "Разработка диалоговых систем" }
  ];
  
  const programmingLanguages = [
    { id: "python", label: "Python" },
    { id: "r", label: "R" },
    { id: "javascript", label: "JavaScript" },
    { id: "java", label: "Java" },
    { id: "cpp", label: "C++" },
    { id: "sql", label: "SQL" },
    { id: "scala", label: "Scala" },
    { id: "julia", label: "Julia" }
  ];
  
  const mathBackgrounds = [
    { id: "basic", label: "Базовый", description: "Школьная математика, базовая статистика" },
    { id: "intermediate", label: "Средний", description: "Линейная алгебра, базовый мат. анализ, теория вероятностей" },
    { id: "advanced", label: "Продвинутый", description: "Продвинутая статистика, оптимизация, мат. моделирование" }
  ];
  
  const ageGroups = [
    { id: "under-18", label: "До 18 лет" },
    { id: "18-24", label: "18-24 года" },
    { id: "25-34", label: "25-34 года" },
    { id: "35-44", label: "35-44 года" },
    { id: "45-54", label: "45-54 года" },
    { id: "55-plus", label: "55 лет и старше" }
  ];
  
  const educationLevels = [
    { id: "school", label: "Среднее образование", description: "Школа или колледж" },
    { id: "bachelor", label: "Бакалавр", description: "Высшее образование (бакалавриат)" },
    { id: "master", label: "Магистр", description: "Высшее образование (магистратура)" },
    { id: "phd", label: "Доктор наук", description: "Кандидат или доктор наук" },
    { id: "self-taught", label: "Самоучка", description: "Самостоятельное образование" }
  ];
  
  const completionTimes = [
    { id: "less-than-month", label: "Менее месяца", description: "Нужно освоить максимально быстро" },
    { id: "1-3-months", label: "1-3 месяца", description: "Короткая интенсивная программа" },
    { id: "3-6-months", label: "3-6 месяцев", description: "Средняя по длительности программа" },
    { id: "6-12-months", label: "6-12 месяцев", description: "Длительная глубокая программа" },
    { id: "1-year-plus", label: "Более года", description: "Глубокое и всестороннее изучение" }
  ];
  
  const learningBarrierOptions = [
    { id: "time-constraints", label: "Нехватка времени", description: "Сложно выделить достаточно времени" },
    { id: "technical-background", label: "Технические знания", description: "Недостаточно базовых технических знаний" },
    { id: "math-knowledge", label: "Математические знания", description: "Сложности с математикой и статистикой" },
    { id: "english-language", label: "Знание английского", description: "Сложности с материалами на английском языке" },
    { id: "learning-approach", label: "Подход к обучению", description: "Трудно учиться самостоятельно без структуры" },
    { id: "motivation", label: "Мотивация", description: "Сложно поддерживать мотивацию длительное время" }
  ];

  
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
      // Подготовка данных для обновления профиля с учетом типов UserRole и т.д.
      const profileUpdate = {
        // Преобразуем строковые значения в соответствующие типы из констант
        role: formData.role as UserRole,
        experience: formData.experience as AIExperience,
        pythonLevel: formData.pythonLevel as SkillLevel,
        interest: formData.interest as UserInterest,
        goal: formData.goal as UserGoal,
        // Дополнительные данные сохраняем в metadata пользователя, так как
        // это расширенная диагностика и содержит дополнительные поля
        completedOnboarding: true,
        metadata: {
          demographic: {
            ageGroup: formData.ageGroup,
            education: formData.education,
          },
          learningPreferences: {
            style: formData.preferredLearningStyle,
            timeCommitment: formData.timeCommitment,
            desiredCompletionTime: formData.desiredCompletionTime,
            projectTypes: formData.projectTypes,
            learningBarriers: formData.learningBarriers,
          },
          technicalBackground: {
            programmingLanguages: formData.programmingLanguages,
            dataAnalysisLevel: formData.dataAnalysisLevel,
            mathBackground: formData.mathBackground,
          },
          cognitiveProfile: {
            analyticalThinking: formData.analyticalThinking,
            creativeProblemSolving: formData.creativeProblemSolving,
            attentionToDetail: formData.attentionToDetail,
          },
          interests: {
            primary: formData.interest,
            subdomains: formData.subdomains,
          },
          specificNeeds: {
            specificGoals: formData.specificGoals,
            specificProjects: formData.specificProjects,
          }
        }
      };
      
      // Генерируем детальный профиль навыков на основе формы
      const skillProfile: SkillProfile = {
        // Технические навыки
        "Программирование": calculateProgrammingScore(),
        "Математика и статистика": calculateMathScore(),
        "Машинное обучение": calculateMLScore(),
        "Анализ данных": calculateDataScienceScore(),
        "Глубокое обучение": calculateDeepLearningScore(),
        "Обработка данных": calculateDataProcessingScore(),
        
        // Когнитивные способности
        "Аналитическое мышление": formData.analyticalThinking * 20, // 0-100
        "Решение проблем": formData.creativeProblemSolving * 20, // 0-100
        "Внимание к деталям": formData.attentionToDetail * 20, // 0-100
        
        // Применение в различных областях
        "Применение в бизнесе": calculateBusinessApplicationScore(),
        "Исследовательские навыки": calculateResearchScore(),
        "Этика и право в ИИ": calculateEthicsAndLawScore(),
      };
      
      setUserSkillProfile(skillProfile);
      
      // Имитация последовательного анализа с задержками
      const updateUserProfileSafely = () => {
        try {
          updateUserProfile(profileUpdate);
          toast({
            title: "Диагностика успешно завершена",
            description: "Ваш профиль Skills DNA обновлен. Теперь вы можете просмотреть рекомендуемые курсы!",
            duration: 5000,
            variant: "default",
          });
          
          // Очищаем временные данные
          setTimeout(() => {
            sessionStorage.removeItem("diagnosisData");
          }, 5000);
        } catch (error) {
          console.error("Ошибка при обновлении профиля:", error);
        }
      };
      
      // Последовательные шаги анализа с задержками для имитации работы "распределительной шляпы"
      setTimeout(() => {
        setAnalysisStep(1); // Анализируем демографические данные
        
        setTimeout(() => {
          setAnalysisStep(2); // Анализируем технические навыки
          
          setTimeout(() => {
            setAnalysisStep(3); // Анализируем интересы
            
            setTimeout(() => {
              setAnalysisStep(4); // Анализируем цели и предпочтения
              
              setTimeout(() => {
                setAnalysisStep(5); // Формируем карту навыков
                
                // Запрашиваем персонализированные рекомендации с сервера
                // Для демо-пользователя используем специальный userId=999
                const fetchRecommendations = async () => {
                  try {
                    const userId = userProfile?.userId || 999; // Для демо-режима
                    const isDemoMode = userId === 999;
                    
                    console.log(`[DeepDiagnosis] Запрос рекомендаций для пользователя: ${userId}, демо-режим: ${isDemoMode}`);
                    
                    // Для демо-пользователя добавляем параметр userId в запрос
                    const endpoint = isDemoMode 
                      ? `/api/courses/recommended?userId=999` 
                      : `/api/courses/recommended`;
                      
                    const response = await fetch(endpoint);
                    
                    if (!response.ok) {
                      console.error(`[DeepDiagnosis] Ошибка при получении рекомендаций: ${response.status} ${response.statusText}`);
                      // В случае ошибки используем локально сгенерированные рекомендации
                      const fallbackRecommendations = generateRecommendations();
                      setRecommendations(fallbackRecommendations);
                      return;
                    }
                    
                    const data = await response.json();
                    console.log(`[DeepDiagnosis] Получены рекомендации: ${data.length} курсов`);
                    setRecommendations(data);
                  } catch (error) {
                    console.error("[DeepDiagnosis] Ошибка при получении рекомендаций:", error);
                    // В случае ошибки используем локально сгенерированные рекомендации
                    const fallbackRecommendations = generateRecommendations();
                    setRecommendations(fallbackRecommendations);
                  }
                };
                
                fetchRecommendations();
                
                // Сохраняем результаты в Skills DNA
                const saveSkillsToDna = async () => {
                  try {
                    // Определяем, используем ли демо-режим
                    const isDemoMode = !userProfile?.userId;
                    const userId = userProfile?.userId || 999; // Используем 999 для демо-режима
                    
                    // Сохраняем результаты для авторизованного пользователя или в демо-режиме
                    if (userProfile?.userId || isDemoMode) {
                      console.log(`[DeepDiagnosis] Сохранение результатов для пользователя: ${userId}, демо-режим: ${isDemoMode}`);
                      
                      // Подготавливаем данные для отправки
                      const diagnosisResult = {
                        userId: userId,
                        skills: skillProfile,
                        diagnosticType: 'deep' as 'deep', // явное приведение типа для TypeScript
                        metadata: {
                          profileData: {
                            role: formData.role,
                            experience: formData.experience,
                            pythonLevel: formData.pythonLevel,
                            interest: formData.interest,
                            goal: formData.goal
                          },
                          demographic: {
                            ageGroup: formData.ageGroup,
                            education: formData.education
                          },
                          technicalBackground: {
                            programmingLanguages: formData.programmingLanguages,
                            dataAnalysisLevel: formData.dataAnalysisLevel,
                            mathBackground: formData.mathBackground
                          },
                          cognitiveProfile: {
                            analyticalThinking: formData.analyticalThinking,
                            creativeProblemSolving: formData.creativeProblemSolving,
                            attentionToDetail: formData.attentionToDetail
                          },
                          interests: {
                            primary: formData.interest,
                            subdomains: formData.subdomains
                          },
                          formData // полные данные формы
                        }
                      };
                      
                      // Отправляем результаты в систему Skills DNA
                      const result = await diagnosisApi.saveResults(diagnosisResult);
                      console.log("Результаты глубокой диагностики сохранены в Skills DNA:", result);
                    } else {
                      console.warn("Пользователь не авторизован, результаты не будут сохранены в Skills DNA");
                    }
                  } catch (error) {
                    console.error("Ошибка при сохранении результатов в Skills DNA:", error);
                  }
                };
                
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
  
  // Функция для перехода к профилю Skills DNA с результатами глубокой диагностики
  const handleViewSkillsDna = () => {
    setLocation("/profile?section=skills-dna&deep=true");
  };
  
  // Функция для перехода к регистрации после завершения диагностики
  const handleContinueToDashboard = () => {
    // Сохраняем результаты диагностики и рекомендации в sessionStorage
    try {
      // Сохраняем данные диагностики для использования на странице регистрации
      sessionStorage.setItem("onboardingData", JSON.stringify({
        // Основная информация
        role: formData.role,
        experience: formData.experience,
        pythonLevel: formData.pythonLevel,
        interest: formData.interest,
        goal: formData.goal,
        // Дополнительные данные
        learningPreferences: {
          style: formData.preferredLearningStyle,
          timeCommitment: formData.timeCommitment
        },
        // Сохраняем результаты анализа
        skillProfile: userSkillProfile,
        recommendations: recommendations
      }));
      
      // Перенаправляем на страницу регистрации
      setLocation("/register-after-onboarding");
    } catch (error) {
      console.error("Ошибка при сохранении данных диагностики:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить результаты диагностики. Попробуйте еще раз.",
        variant: "destructive"
      });
    }
  };
  
  // Функции расчета уровней навыков на основе ответов
  const calculateProgrammingScore = (): number => {
    let score = formData.pythonLevel * 10; // 0-50
    score += formData.programmingLanguages.length * 5; // +5 за каждый язык
    return Math.min(100, score);
  };
  
  const calculateMathScore = (): number => {
    const baseScores = {
      "basic": 30,
      "intermediate": 60,
      "advanced": 90
    };
    let score = baseScores[formData.mathBackground as keyof typeof baseScores];
    return score;
  };
  
  const calculateMLScore = (): number => {
    const baseScores = {
      "beginner": 20,
      "intermediate": 50,
      "advanced": 80
    };
    let score = baseScores[formData.experience as keyof typeof baseScores];
    
    if (formData.interest === "machine-learning") score += 15;
    if (formData.subdomains.includes("supervised-learning")) score += 5;
    if (formData.subdomains.includes("unsupervised-learning")) score += 5;
    
    return Math.min(100, score);
  };
  
  const calculateDataScienceScore = (): number => {
    const baseScore = formData.dataAnalysisLevel * 15; // 0-75
    let score = baseScore;
    
    if (formData.interest === "data-science") score += 15;
    if (formData.subdomains.includes("data-exploration")) score += 5;
    if (formData.subdomains.includes("data-visualization")) score += 5;
    if (formData.programmingLanguages.includes("r")) score += 10;
    if (formData.programmingLanguages.includes("sql")) score += 10;
    
    return Math.min(100, score);
  };
  
  const calculateDeepLearningScore = (): number => {
    let score = 0;
    
    if (formData.interest === "neural-networks") score += 30;
    if (formData.subdomains.includes("cnn")) score += 15;
    if (formData.subdomains.includes("rnn")) score += 15;
    if (formData.subdomains.includes("transformers")) score += 15;
    if (formData.subdomains.includes("gans")) score += 10;
    if (formData.experience === "advanced") score += 20;
    if (formData.experience === "intermediate") score += 10;
    
    return Math.min(100, score);
  };
  
  const calculateDataProcessingScore = (): number => {
    let score = formData.dataAnalysisLevel * 10; // 0-50
    
    if (formData.subdomains.includes("data-cleaning")) score += 15;
    if (formData.subdomains.includes("feature-engineering")) score += 15;
    if (formData.programmingLanguages.includes("python")) score += 10;
    if (formData.programmingLanguages.includes("sql")) score += 10;
    
    return Math.min(100, score);
  };
  
  // Новые функции расчета навыков для дополнительных областей
  const calculateBusinessApplicationScore = (): number => {
    let score = 0;
    
    // Бизнес-профиль более высокий для руководителей и предпринимателей
    if (formData.role === "manager") score += 30;
    if (formData.role === "entrepreneur") score += 40;
    
    // Аналитическое мышление важно для бизнес-приложений
    score += formData.analyticalThinking * 5;
    
    // Интерес к применению в бизнесе
    if (formData.projectTypes.includes("recommendation-systems")) score += 20;
    if (formData.projectTypes.includes("predictive-models")) score += 15;
    
    return Math.min(100, score);
  };
  
  const calculateResearchScore = (): number => {
    let score = 0;
    
    // Исследовательский профиль более высокий для ученых
    if (formData.role === "researcher") score += 40;
    
    // Академическое образование повышает уровень
    if (formData.education === "phd") score += 30;
    if (formData.education === "master") score += 20;
    
    // Математический бэкграунд критичен для исследований
    if (formData.mathBackground === "advanced") score += 20;
    
    // Креативное мышление важно для исследований
    score += formData.creativeProblemSolving * 5;
    
    return Math.min(100, score);
  };
  
  const calculateEthicsAndLawScore = (): number => {
    let score = 0;
    
    // Прямой интерес к этике и правовым аспектам
    if (formData.interest === "ethics") score += 50;
    if (formData.interest === "law") score += 50;
    
    // Анализ поддоменов
    if (formData.subdomains.includes("bias-fairness")) score += 15;
    if (formData.subdomains.includes("transparency")) score += 15;
    if (formData.subdomains.includes("ai-regulation")) score += 20;
    if (formData.subdomains.includes("privacy-law")) score += 20;
    
    // Внимание к деталям важно для правовых аспектов
    score += formData.attentionToDetail * 5;
    
    return Math.min(100, score);
  };
  
  // Функция генерации персонализированных рекомендаций
  const generateRecommendations = (): CourseRecommendation[] => {
    // Основные курсы на основе интересов и уровня опыта
    const recommendations: CourseRecommendation[] = [];
    
    if (formData.interest === "machine-learning") {
      if (formData.experience === "beginner") {
        recommendations.push({
          id: 1,
          title: "Основы машинного обучения",
          description: "Введение в ключевые концепции и алгоритмы машинного обучения",
          match: 95,
          difficulty: 2,
          duration: 120,
          modules: 5,
          reason: "Идеально для начала обучения машинному обучению на вашем уровне"
        });
      } else if (formData.experience === "intermediate") {
        recommendations.push({
          id: 2,
          title: "Продвинутые алгоритмы машинного обучения",
          description: "Углубленное изучение алгоритмов ML и их применения",
          match: 92,
          difficulty: 3,
          duration: 180,
          modules: 7,
          reason: "Соответствует вашему среднему уровню и поможет углубить знания в ML"
        });
      } else {
        recommendations.push({
          id: 3,
          title: "Мастер-класс по ML инженерии",
          description: "Экспертные техники в разработке и развертывании ML систем",
          match: 90,
          difficulty: 4,
          duration: 240,
          modules: 8,
          reason: "Для продвинутых пользователей, желающих достичь экспертного уровня"
        });
      }
    }
    
    if (formData.interest === "data-science" || formData.programmingLanguages.includes("python")) {
      recommendations.push({
        id: 4,
        title: "Python для анализа данных",
        description: "Практический курс по использованию Python в обработке данных",
        match: 88,
        difficulty: formData.experience === "beginner" ? 2 : 3,
        duration: 150,
        modules: 6,
        reason: "Соответствует вашему интересу к обработке данных и уровню Python"
      });
    }
    
    if (formData.interest === "neural-networks" || formData.subdomains.includes("neural-networks")) {
      recommendations.push({
        id: 5,
        title: "Глубокое обучение и нейронные сети",
        description: "Комплексный курс по архитектурам глубокого обучения",
        match: formData.experience === "advanced" ? 93 : 78,
        difficulty: 4,
        duration: 210,
        modules: 8,
        reason: formData.experience === "advanced" 
          ? "Соответствует вашему продвинутому уровню" 
          : "Поможет вам углубиться в нейронные сети"
      });
    }
    
    if (formData.interest === "ethics") {
      recommendations.push({
        id: 6,
        title: "Этика и безопасность в ИИ",
        description: "Этические вопросы разработки и внедрения ИИ",
        match: 85,
        difficulty: 2,
        duration: 140,
        modules: 6,
        reason: "Специализированный курс по этическим аспектам ИИ"
      });
    }
    
    if (formData.interest === "computer-vision" || formData.subdomains.includes("image-classification")) {
      recommendations.push({
        id: 7,
        title: "Компьютерное зрение",
        description: "Алгоритмы и нейросети для работы с изображениями",
        match: 87,
        difficulty: 3,
        duration: 190,
        modules: 7,
        reason: "Подходит для вашего интереса к компьютерному зрению"
      });
    }
    
    if (formData.interest === "law") {
      recommendations.push({
        id: 9,
        title: "Правовые аспекты искусственного интеллекта",
        description: "Регулирование, лицензирование и юридические вопросы применения ИИ",
        match: 95,
        difficulty: 2,
        duration: 160,
        modules: 6,
        reason: "Полный курс по правовым аспектам ИИ"
      });
    }
    
    // Добавляем рекомендации на основе профиля навыков
    if (calculateMathScore() < 50) {
      recommendations.push({
        id: 8,
        title: "Математика для машинного обучения",
        description: "Необходимый минимум математики для успеха в AI/ML",
        match: 90,
        difficulty: 2,
        duration: 120,
        modules: 5,
        skillGaps: ["Линейная алгебра", "Статистика", "Оптимизация"],
        reason: "Поможет заполнить пробелы в математической подготовке"
      });
    }
    
    // Сортируем по соответствию и возвращаем топ-3
    return recommendations
      .sort((a, b) => b.match - a.match)
      .slice(0, 3);
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
            Ответьте на несколько вопросов, чтобы получить персонализированный план обучения
          </p>
        </div>
        
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-2">
            <div className="text-sm text-white/70 font-medium">Шаг {step} из {totalSteps}</div>
            <div className="flex-1 relative h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" 
                style={{ width: `${(step / totalSteps) * 100}%` }}
              ></div>
            </div>
            <div className="text-sm text-white/70 font-medium">{Math.round((step / totalSteps) * 100)}%</div>
          </div>
          <div className="flex justify-between text-xs text-indigo-400/80">
            <div className={`flex items-center ${step >= 1 ? 'text-indigo-400' : 'text-white/40'}`}>
              <div className={`w-4 h-4 rounded-full ${step >= 1 ? 'bg-indigo-500' : 'bg-white/20'} mr-1 flex items-center justify-center text-[10px] text-white`}>{step > 1 ? '✓' : '1'}</div>
              <span>Общая информация</span>
            </div>
            <div className={`flex items-center ${step >= 2 ? 'text-indigo-400' : 'text-white/40'}`}>
              <div className={`w-4 h-4 rounded-full ${step >= 2 ? 'bg-indigo-500' : 'bg-white/20'} mr-1 flex items-center justify-center text-[10px] text-white`}>{step > 2 ? '✓' : '2'}</div>
              <span>Навыки</span>
            </div>
            <div className={`flex items-center ${step >= 3 ? 'text-indigo-400' : 'text-white/40'}`}>
              <div className={`w-4 h-4 rounded-full ${step >= 3 ? 'bg-indigo-500' : 'bg-white/20'} mr-1 flex items-center justify-center text-[10px] text-white`}>{step > 3 ? '✓' : '3'}</div>
              <span>Интересы</span>
            </div>
            <div className={`flex items-center ${step >= 4 ? 'text-indigo-400' : 'text-white/40'}`}>
              <div className={`w-4 h-4 rounded-full ${step >= 4 ? 'bg-indigo-500' : 'bg-white/20'} mr-1 flex items-center justify-center text-[10px] text-white`}>{step > 4 ? '✓' : '4'}</div>
              <span>Цели</span>
            </div>
          </div>
        </div>
        
        <Card className="bg-space-800/70 border-blue-500/20">
          <CardHeader>
            <CardTitle className="text-xl text-white">
              {step === 1 && "Расскажите о себе"}
              {step === 2 && "Расскажите о своих технических навыках"}
              {step === 3 && "Какие направления вас интересуют?"}
              {step === 4 && "Ваши цели и предпочтения в обучении"}
            </CardTitle>
            <CardDescription className="text-white/70">
              {step === 1 && "Эта информация поможет настроить рекомендации под ваш профиль"}
              {step === 2 && "Мы оценим ваш текущий уровень для подбора подходящих материалов"}
              {step === 3 && "Выберите интересующие вас области искусственного интеллекта"}
              {step === 4 && "Определим оптимальный формат и темп обучения"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {/* Шаг 1: Основная информация */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-white mb-2 block">Кто вы?</Label>
                  <RadioGroup
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                    className="space-y-3"
                  >
                    {roles.map((role) => (
                      <div
                        key={role.id}
                        className={`flex items-start space-x-3 border rounded-lg p-4 transition-all cursor-pointer ${
                          formData.role === role.id
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-white/10 hover:border-white/30"
                        }`}
                        onClick={() => setFormData({ ...formData, role: role.id })}
                      >
                        <RadioGroupItem value={role.id} id={role.id} className="mt-1" />
                        <div className="space-y-1.5">
                          <Label htmlFor={role.id} className="text-lg font-medium cursor-pointer">
                            {role.label}
                          </Label>
                          <p className="text-sm text-white/60">{role.description}</p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                <div className="space-y-4">
                  <Label className="text-white mb-2 block">Ваш опыт в AI/ML</Label>
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
                </div>
                
                <div className="space-y-4">
                  <Label className="text-white mb-2 block">Ваш возраст</Label>
                  <RadioGroup
                    value={formData.ageGroup}
                    onValueChange={(value) => setFormData({ ...formData, ageGroup: value })}
                    className="grid grid-cols-2 md:grid-cols-3 gap-3"
                  >
                    {ageGroups.map((group) => (
                      <div
                        key={group.id}
                        className={`flex items-center space-x-2 border rounded-lg p-3 transition-all cursor-pointer ${
                          formData.ageGroup === group.id
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-white/10 hover:border-white/30"
                        }`}
                        onClick={() => setFormData({ ...formData, ageGroup: group.id })}
                      >
                        <RadioGroupItem value={group.id} id={`age-${group.id}`} />
                        <Label htmlFor={`age-${group.id}`} className="cursor-pointer">
                          {group.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                <div className="space-y-4">
                  <Label className="text-white mb-2 block">Ваше образование</Label>
                  <RadioGroup
                    value={formData.education}
                    onValueChange={(value) => setFormData({ ...formData, education: value })}
                    className="space-y-3"
                  >
                    {educationLevels.map((level) => (
                      <div
                        key={level.id}
                        className={`flex items-start space-x-3 border rounded-lg p-4 transition-all cursor-pointer ${
                          formData.education === level.id
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-white/10 hover:border-white/30"
                        }`}
                        onClick={() => setFormData({ ...formData, education: level.id })}
                      >
                        <RadioGroupItem value={level.id} id={`edu-${level.id}`} className="mt-1" />
                        <div className="space-y-1.5">
                          <Label htmlFor={`edu-${level.id}`} className="text-lg font-medium cursor-pointer">
                            {level.label}
                          </Label>
                          <p className="text-sm text-white/60">{level.description}</p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            )}
            
            {/* Шаг 2: Технические навыки */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label>Уровень знания Python</Label>
                  <div className="space-y-3">
                    <Slider
                      value={[formData.pythonLevel]}
                      min={0}
                      max={5}
                      step={1}
                      onValueChange={(value) => setFormData({ ...formData, pythonLevel: value[0] })}
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
                        {formData.pythonLevel}
                      </div>
                      <div className="text-sm">
                        {formData.pythonLevel === 0 && "Не знаком с Python"}
                        {formData.pythonLevel === 1 && "Базовые знания синтаксиса"}
                        {formData.pythonLevel === 2 && "Могу писать простые скрипты"}
                        {formData.pythonLevel === 3 && "Уверенное использование библиотек"}
                        {formData.pythonLevel === 4 && "Продвинутые навыки разработки"}
                        {formData.pythonLevel === 5 && "Экспертный уровень"}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Label>Какие еще языки программирования вы знаете?</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {programmingLanguages.map((lang) => (
                      <div key={lang.id} className="flex items-start space-x-2">
                        <Checkbox
                          id={`lang-${lang.id}`}
                          checked={formData.programmingLanguages.includes(lang.id)}
                          onCheckedChange={(checked) => {
                            const newLangs = checked
                              ? [...formData.programmingLanguages, lang.id]
                              : formData.programmingLanguages.filter((l) => l !== lang.id);
                            setFormData({ ...formData, programmingLanguages: newLangs });
                          }}
                        />
                        <Label htmlFor={`lang-${lang.id}`} className="text-sm cursor-pointer">
                          {lang.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Label>Уровень навыков анализа данных</Label>
                  <div className="space-y-3">
                    <Slider
                      value={[formData.dataAnalysisLevel]}
                      min={0}
                      max={5}
                      step={1}
                      onValueChange={(value) => setFormData({ ...formData, dataAnalysisLevel: value[0] })}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-white/60">
                      <span>Нет опыта</span>
                      <span>Базовый</span>
                      <span>Средний</span>
                      <span>Хороший</span>
                      <span>Продвинутый</span>
                      <span>Эксперт</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Label>Уровень математической подготовки</Label>
                  <RadioGroup
                    value={formData.mathBackground}
                    onValueChange={(value) => setFormData({ ...formData, mathBackground: value })}
                    className="space-y-3"
                  >
                    {mathBackgrounds.map((level) => (
                      <div
                        key={level.id}
                        className={`flex items-start space-x-3 border rounded-lg p-4 transition-all cursor-pointer ${
                          formData.mathBackground === level.id
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-white/10 hover:border-white/30"
                        }`}
                        onClick={() => setFormData({ ...formData, mathBackground: level.id })}
                      >
                        <RadioGroupItem value={level.id} id={`math-${level.id}`} className="mt-1" />
                        <div className="space-y-1.5">
                          <Label htmlFor={`math-${level.id}`} className="text-lg font-medium cursor-pointer">
                            {level.label}
                          </Label>
                          <p className="text-sm text-white/60">{level.description}</p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Оцените свои когнитивные способности</h3>
                  
                  <div className="space-y-5">
                    <div className="space-y-5">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label>Аналитическое мышление</Label>
                          <div className="text-sm font-medium text-purple-400">
                            {formData.analyticalThinking}/5
                          </div>
                        </div>
                        <div className="relative h-2.5 bg-gray-200/10 rounded-full overflow-hidden">
                          <div 
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                            style={{ width: `${(formData.analyticalThinking / 5) * 100}%` }}
                          ></div>
                          <Slider
                            value={[formData.analyticalThinking]}
                            min={1}
                            max={5}
                            step={1}
                            onValueChange={(value) => setFormData({ ...formData, analyticalThinking: value[0] })}
                            className="relative z-10"
                          />
                        </div>
                        <div className="flex justify-between text-xs text-white/60">
                          <span>Базовое</span>
                          <span className="mx-auto">Среднее</span>
                          <span>Экспертное</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label>Творческий подход к решению проблем</Label>
                          <div className="text-sm font-medium text-purple-400">
                            {formData.creativeProblemSolving}/5
                          </div>
                        </div>
                        <div className="relative h-2.5 bg-gray-200/10 rounded-full overflow-hidden">
                          <div 
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                            style={{ width: `${(formData.creativeProblemSolving / 5) * 100}%` }}
                          ></div>
                          <Slider
                            value={[formData.creativeProblemSolving]}
                            min={1}
                            max={5}
                            step={1}
                            onValueChange={(value) => setFormData({ ...formData, creativeProblemSolving: value[0] })}
                            className="relative z-10"
                          />
                        </div>
                        <div className="flex justify-between text-xs text-white/60">
                          <span>Базовое</span>
                          <span className="mx-auto">Среднее</span>
                          <span>Экспертное</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label>Внимание к деталям</Label>
                          <div className="text-sm font-medium text-purple-400">
                            {formData.attentionToDetail}/5
                          </div>
                        </div>
                        <div className="relative h-2.5 bg-gray-200/10 rounded-full overflow-hidden">
                          <div 
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                            style={{ width: `${(formData.attentionToDetail / 5) * 100}%` }}
                          ></div>
                          <Slider
                            value={[formData.attentionToDetail]}
                            min={1}
                            max={5}
                            step={1}
                            onValueChange={(value) => setFormData({ ...formData, attentionToDetail: value[0] })}
                            className="relative z-10"
                          />
                        </div>
                        <div className="flex justify-between text-xs text-white/60">
                          <span>Базовое</span>
                          <span className="mx-auto">Среднее</span>
                          <span>Экспертное</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Шаг 3: Интересы */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label>Какая область ИИ вас больше всего интересует?</Label>
                  <Tabs 
                    defaultValue={formData.interest} 
                    onValueChange={(value) => {
                      setFormData({ 
                        ...formData, 
                        interest: value,
                        // Сбрасываем поддомены при смене основного интереса
                        subdomains: [] 
                      });
                    }}
                    className="w-full"
                  >
                    <TabsList className="grid grid-cols-2 md:grid-cols-3 w-full h-auto">
                      {interestAreas.map((area) => (
                        <TabsTrigger key={area.id} value={area.id} className="py-2">
                          <span className="flex items-center gap-1.5">
                            <span className="w-4 h-4">{area.icon}</span>
                            <span>{area.label}</span>
                          </span>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    {interestAreas.map((area) => (
                      <TabsContent key={area.id} value={area.id} className="p-4 border rounded-md mt-2">
                        <h4 className="font-medium mb-2">{area.label}</h4>
                        <p className="text-sm text-white/60 mb-4">
                          {area.id === "machine-learning" && "Алгоритмы и модели, обучающиеся на данных для выполнения задач без явного программирования."}
                          {area.id === "deep-learning" && "Подвид машинного обучения, основанный на нейронных сетях с множеством слоев для моделирования сложных паттернов."}
                          {area.id === "data-science" && "Извлечение знаний и инсайтов из структурированных и неструктурированных данных."}
                          {area.id === "nlp" && "Взаимодействие между компьютерами и человеческим языком, обработка и анализ естественного языка."}
                          {area.id === "computer-vision" && "Алгоритмы и системы для анализа, понимания и интерпретации визуальной информации."}
                          {area.id === "ai-applications" && "Практическое применение искусственного интеллекта в различных областях и индустриях."}
                        </p>
                        
                        <Label className="mb-2 block">Выберите конкретные поддомены, которые вас интересуют:</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                          {/* @ts-ignore */}
                          {subdomains[area.id].map((subdomain: string) => (
                            <div key={subdomain} className="flex items-start space-x-2">
                              <Checkbox
                                id={`subdomain-${subdomain}`}
                                checked={formData.subdomains.includes(subdomain)}
                                onCheckedChange={(checked) => {
                                  const newSubdomains = checked
                                    ? [...formData.subdomains, subdomain]
                                    : formData.subdomains.filter((s) => s !== subdomain);
                                  setFormData({ ...formData, subdomains: newSubdomains });
                                }}
                              />
                              <Label htmlFor={`subdomain-${subdomain}`} className="text-sm cursor-pointer">
                                {subdomain === "supervised-learning" && "Обучение с учителем"}
                                {subdomain === "unsupervised-learning" && "Обучение без учителя"}
                                {subdomain === "reinforcement-learning" && "Обучение с подкреплением"}
                                {subdomain === "feature-engineering" && "Инженерия признаков"}
                                {subdomain === "model-evaluation" && "Оценка моделей"}
                                {subdomain === "model-deployment" && "Развертывание моделей"}
                                {subdomain === "neural-networks" && "Нейронные сети"}
                                {subdomain === "cnn" && "Сверточные сети (CNN)"}
                                {subdomain === "rnn" && "Рекуррентные сети (RNN)"}
                                {subdomain === "transformers" && "Трансформеры"}
                                {subdomain === "generative-models" && "Генеративные модели"}
                                {subdomain === "attention-mechanisms" && "Механизмы внимания"}
                                {subdomain === "data-exploration" && "Разведочный анализ данных"}
                                {subdomain === "data-cleaning" && "Очистка данных"}
                                {subdomain === "data-visualization" && "Визуализация данных"}
                                {subdomain === "statistical-analysis" && "Статистический анализ"}
                                {subdomain === "big-data" && "Большие данные"}
                                {subdomain === "predictive-modeling" && "Предиктивное моделирование"}
                                {subdomain === "text-classification" && "Классификация текста"}
                                {subdomain === "named-entity-recognition" && "Распознавание именованных сущностей"}
                                {subdomain === "sentiment-analysis" && "Анализ тональности"}
                                {subdomain === "machine-translation" && "Машинный перевод"}
                                {subdomain === "question-answering" && "Вопросно-ответные системы"}
                                {subdomain === "text-generation" && "Генерация текста"}
                                {subdomain === "image-classification" && "Классификация изображений"}
                                {subdomain === "object-detection" && "Обнаружение объектов"}
                                {subdomain === "image-segmentation" && "Сегментация изображений"}
                                {subdomain === "face-recognition" && "Распознавание лиц"}
                                {subdomain === "video-analysis" && "Анализ видео"}
                                {subdomain === "generative-vision" && "Генеративные модели для изображений"}
                                {subdomain === "recommendation-systems" && "Рекомендательные системы"}
                                {subdomain === "chatbots" && "Чат-боты"}
                                {subdomain === "fraud-detection" && "Обнаружение мошенничества"}
                                {subdomain === "predictive-maintenance" && "Предиктивное обслуживание"}
                                {subdomain === "healthcare-ai" && "ИИ в здравоохранении"}
                                {subdomain === "fintech-ai" && "ИИ в финтехе"}
                                {subdomain === "bias-fairness" && "Предвзятость и справедливость"}
                                {subdomain === "transparency" && "Прозрачность AI-систем"}
                                {subdomain === "privacy" && "Приватность данных"}
                                {subdomain === "accountability" && "Ответственность за AI-решения"}
                                {subdomain === "social-impact" && "Социальные последствия AI"}
                                {subdomain === "governance" && "Управление AI-системами"}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              </div>
            )}
            
            {/* Шаг 4: Цели и предпочтения */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="space-y-4">
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
                
                <div className="space-y-4">
                  <Label>Предпочтительный стиль обучения</Label>
                  <RadioGroup
                    value={formData.preferredLearningStyle}
                    onValueChange={(value) => setFormData({ ...formData, preferredLearningStyle: value })}
                    className="space-y-3"
                  >
                    {learningStyles.map((style) => (
                      <div
                        key={style.id}
                        className={`flex items-start space-x-3 border rounded-lg p-4 transition-all cursor-pointer ${
                          formData.preferredLearningStyle === style.id
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-white/10 hover:border-white/30"
                        }`}
                        onClick={() => setFormData({ ...formData, preferredLearningStyle: style.id })}
                      >
                        <RadioGroupItem value={style.id} id={`style-${style.id}`} className="mt-1" />
                        <div className="space-y-1.5">
                          <Label htmlFor={`style-${style.id}`} className="text-medium cursor-pointer">
                            {style.label}
                          </Label>
                          <p className="text-sm text-white/60">{style.description}</p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                <div className="space-y-4">
                  <Label>Сколько времени вы готовы уделять обучению?</Label>
                  <RadioGroup
                    value={formData.timeCommitment}
                    onValueChange={(value) => setFormData({ ...formData, timeCommitment: value })}
                    className="space-y-3"
                  >
                    {timeCommitments.map((time) => (
                      <div
                        key={time.id}
                        className={`flex items-start space-x-3 border rounded-lg p-4 transition-all cursor-pointer ${
                          formData.timeCommitment === time.id
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-white/10 hover:border-white/30"
                        }`}
                        onClick={() => setFormData({ ...formData, timeCommitment: time.id })}
                      >
                        <RadioGroupItem value={time.id} id={`time-${time.id}`} className="mt-1" />
                        <div className="space-y-1.5">
                          <Label htmlFor={`time-${time.id}`} className="text-medium cursor-pointer">
                            {time.label}
                          </Label>
                          <p className="text-sm text-white/60">{time.description}</p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                <div className="space-y-4">
                  <Label>Какие типы проектов вас интересуют?</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {projectTypes.map((project) => (
                      <div
                        key={project.id}
                        className={`flex items-start space-x-3 border rounded-lg p-3 transition-all cursor-pointer ${
                          formData.projectTypes.includes(project.id)
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-white/10 hover:border-white/30"
                        }`}
                        onClick={() => {
                          const newProjects = formData.projectTypes.includes(project.id)
                            ? formData.projectTypes.filter((p) => p !== project.id)
                            : [...formData.projectTypes, project.id];
                          setFormData({ ...formData, projectTypes: newProjects });
                        }}
                      >
                        <Checkbox
                          id={`project-${project.id}`}
                          checked={formData.projectTypes.includes(project.id)}
                          onCheckedChange={(checked) => {
                            const newProjects = checked
                              ? [...formData.projectTypes, project.id]
                              : formData.projectTypes.filter((p) => p !== project.id);
                            setFormData({ ...formData, projectTypes: newProjects });
                          }}
                          className="mt-1"
                        />
                        <div className="space-y-1">
                          <Label htmlFor={`project-${project.id}`} className="font-medium cursor-pointer">
                            {project.label}
                          </Label>
                          <p className="text-xs text-white/60">{project.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Label>За какой период вы хотели бы освоить ключевые навыки?</Label>
                  <RadioGroup
                    value={formData.desiredCompletionTime}
                    onValueChange={(value) => setFormData({ ...formData, desiredCompletionTime: value })}
                    className="space-y-3"
                  >
                    {completionTimes.map((option) => (
                      <div
                        key={option.id}
                        className={`flex items-start space-x-3 border rounded-lg p-4 transition-all cursor-pointer ${
                          formData.desiredCompletionTime === option.id
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-white/10 hover:border-white/30"
                        }`}
                        onClick={() => setFormData({ ...formData, desiredCompletionTime: option.id })}
                      >
                        <RadioGroupItem value={option.id} id={`compl-${option.id}`} className="mt-1" />
                        <div>
                          <Label htmlFor={`compl-${option.id}`} className="text-lg font-medium cursor-pointer">
                            {option.label}
                          </Label>
                          <p className="text-sm text-white/60">{option.description}</p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                
                <div className="space-y-4">
                  <Label>Что мешает вам учиться?</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {learningBarrierOptions.map((barrier) => (
                      <div key={barrier.id} className="flex items-start space-x-2">
                        <Checkbox
                          id={`barrier-${barrier.id}`}
                          checked={formData.learningBarriers.includes(barrier.id)}
                          onCheckedChange={(checked) => {
                            const newBarriers = checked
                              ? [...formData.learningBarriers, barrier.id]
                              : formData.learningBarriers.filter((b) => b !== barrier.id);
                            setFormData({ ...formData, learningBarriers: newBarriers });
                          }}
                        />
                        <div>
                          <Label htmlFor={`barrier-${barrier.id}`} className="text-sm font-medium cursor-pointer">
                            {barrier.label}
                          </Label>
                          <p className="text-xs text-white/60">{barrier.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-4">
                  <Label>Конкретные цели обучения (необязательно)</Label>
                  <Textarea
                    placeholder="Например: хочу научиться создавать чат-бот для собственного проекта, который будет отвечать на вопросы пользователей"
                    value={formData.specificGoals || ""}
                    onChange={(e) => setFormData({ ...formData, specificGoals: e.target.value })}
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="space-y-4">
                  <Label>Опишите конкретный проект, который вы хотели бы реализовать (необязательно)</Label>
                  <Textarea
                    placeholder="Например: создание системы рекомендаций для интернет-магазина на основе истории покупок пользователей"
                    value={formData.specificProjects || ""}
                    onChange={(e) => setFormData({ ...formData, specificProjects: e.target.value })}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            )}
            
            {/* Шаг 5: Анализ и результаты */}
            {step === totalSteps && isAnalyzing && (
              <div className="py-4">
                {!analysisComplete ? (
                  <div className="text-center">
                    {/* Визуализация AI-анализа (распределительная шляпа) */}
                    <div className="relative mx-auto mb-8 w-36 h-36 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600/40 to-blue-600/40 animate-pulse"></div>
                      <div className="absolute inset-3 rounded-full bg-space-800 flex items-center justify-center">
                        <Sparkles className="h-14 w-14 text-purple-400" />
                      </div>
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-48">
                        <div className="bg-gradient-to-r from-purple-500/0 via-purple-500/50 to-purple-500/0 h-0.5"></div>
                      </div>
                      {/* Лучи света */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full h-12 w-1 bg-gradient-to-b from-purple-500/0 to-purple-500/50"></div>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full h-12 w-1 bg-gradient-to-t from-purple-500/0 to-purple-500/50"></div>
                      
                      {/* Орбитальные частицы */}
                      <div className="absolute w-full h-full rounded-full animate-spin-slow origin-center">
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-400 rounded-full"></div>
                      </div>
                      <div className="absolute w-full h-full rounded-full animate-spin-slow-reverse origin-center" style={{ animationDelay: "-2s" }}>
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-purple-400 rounded-full"></div>
                      </div>
                      <div className="absolute w-3/4 h-3/4 rounded-full animate-spin-medium origin-center" style={{ animationDelay: "-1s" }}>
                        <div className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full"></div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-orbitron mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#B28DFF] via-[#8BE0F7] to-[#B28DFF]">
                      NovaAI анализирует ваш профиль
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
                              <span className="text-sm">Анализ демографических данных</span>
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
                              <span className="text-sm">Оценка технических навыков</span>
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
                              <span className="text-sm">Анализ интересов</span>
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
                              <span className="text-sm">Определение целей</span>
                              {analysisStep >= 4 && <span className="text-xs text-primary">Завершено</span>}
                            </div>
                            <Progress value={analysisStep >= 4 ? 100 : analysisStep === 3 ? 60 : 0} className="h-1.5" />
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full ${analysisStep >= 5 ? 'bg-primary text-white' : 'bg-white/10'} flex items-center justify-center text-xs`}>
                            {analysisStep >= 5 ? <Check className="h-4 w-4" /> : '5'}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm">Формирование карты навыков</span>
                              {analysisStep >= 5 && <span className="text-xs text-primary">Завершено</span>}
                            </div>
                            <Progress value={analysisStep >= 5 ? 100 : analysisStep === 4 ? 60 : 0} className="h-1.5" />
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
                            {analysisStep === 0 && <p>Инициализация системы анализа...</p>}
                            
                            {analysisStep === 1 && (
                              <div>
                                <p className="font-medium">Анализ демографических данных</p>
                                <p className="text-sm text-white/70 mt-1">
                                  {formData.role === "student" && "Вы указали, что являетесь студентом. Мы подберем материалы, соответствующие учебному процессу и помогающие расширить знания, полученные в образовательном учреждении."}
                                  {formData.role === "professional" && "Вы указали, что являетесь профессионалом в IT сфере. Мы сосредоточимся на практических материалах, которые можно быстро применить в работе."}
                                  {formData.role === "researcher" && "Вы указали, что занимаетесь исследовательской деятельностью. Мы подберем теоретически глубокие материалы с акцентом на научную составляющую."}
                                  {formData.role === "manager" && "Вы указали, что руководите командой или проектами. Мы сосредоточимся на прикладных аспектах AI/ML с фокусом на управленческие решения."}
                                  {formData.role === "entrepreneur" && "Вы указали, что развиваете собственный бизнес. Мы подберем материалы с фокусом на бизнес-применении AI/ML технологий."}
                                  {formData.role === "other" && "Мы учтем вашу уникальную ситуацию при подборе образовательных материалов."}
                                </p>
                              </div>
                            )}
                            
                            {analysisStep === 2 && (
                              <div>
                                <p className="font-medium">Оценка технических навыков</p>
                                <p className="text-sm text-white/70 mt-1">
                                  {formData.pythonLevel <= 2 && "У вас базовый уровень Python, который необходимо укрепить. Мы включим материалы по основам программирования на Python, чтобы создать прочный фундамент."}
                                  {formData.pythonLevel > 2 && formData.pythonLevel <= 4 && "У вас хороший уровень Python. Мы сосредоточимся на специализированных библиотеках для AI/ML, чтобы углубить ваши практические навыки."}
                                  {formData.pythonLevel > 4 && "У вас отличный уровень владения Python. Мы будем фокусироваться на продвинутых техниках и оптимизации кода для AI/ML задач."}
                                </p>
                                <p className="text-sm text-white/70 mt-2">
                                  {formData.mathBackground === "basic" && "Вам потребуется укрепить математическую базу. Будут рекомендованы материалы по основам линейной алгебры, анализа и статистики."}
                                  {formData.mathBackground === "intermediate" && "У вас есть хорошая математическая подготовка. Будут рекомендованы материалы для углубления знаний в специфических областях."}
                                  {formData.mathBackground === "advanced" && "Ваша математическая подготовка на высоком уровне. Можно сосредоточиться на продвинутых алгоритмах и методах."}
                                </p>
                              </div>
                            )}
                            
                            {analysisStep === 3 && (
                              <div>
                                <p className="font-medium">Анализ интересов</p>
                                <p className="text-sm text-white/70 mt-1">
                                  {formData.interest === "machine-learning" && "Ваш интерес к машинному обучению указывает на аналитический склад ума и стремление к решению сложных задач с использованием данных."}
                                  {formData.interest === "deep-learning" && "Ваш интерес к глубокому обучению показывает стремление к работе с нейронными сетями и решению сложных задач искусственного интеллекта."}
                                  {formData.interest === "data-science" && "Ваш интерес к науке о данных демонстрирует склонность к работе с большими объемами информации и извлечению из них полезных инсайтов."}
                                  {formData.interest === "nlp" && "Ваш интерес к обработке естественного языка указывает на желание работать с текстовыми данными и создавать системы для понимания человеческого языка."}
                                  {formData.interest === "computer-vision" && "Ваш интерес к компьютерному зрению показывает стремление работать с визуальными данными и создавать системы, способные видеть и интерпретировать окружающий мир."}
                                  {formData.interest === "ai-applications" && "Ваш интерес к прикладному ИИ демонстрирует практический подход и желание внедрять интеллектуальные технологии в различные сферы жизни."}
                                </p>
                                <p className="text-sm text-white/70 mt-2">
                                  {formData.subdomains.length > 0 && `Выбранные вами поддомены (${formData.subdomains.length}) позволяют точнее определить вашу специализацию и интересы.`}
                                </p>
                              </div>
                            )}
                            
                            {analysisStep === 4 && (
                              <div>
                                <p className="font-medium">Определение целей</p>
                                <p className="text-sm text-white/70 mt-1">
                                  {formData.goal === "learning" && "Ваша цель расширить знания требует разностороннего подхода с акцентом на теоретические основы и их практическое применение."}
                                  {formData.goal === "career" && "Ваша цель развития карьеры требует фокуса на востребованных навыках и технологиях с высокой рыночной ценностью."}
                                  {formData.goal === "project" && "Ваша цель реализовать проект требует практического подхода с фокусом на прикладные инструменты и технологии."}
                                </p>
                                <p className="text-sm text-white/70 mt-2">
                                  {formData.timeCommitment === "low" && "Учитывая ваши временные ограничения, мы подберем компактные модули и концентрированные материалы."}
                                  {formData.timeCommitment === "medium" && "Вы готовы уделять обучению достаточно времени, что позволит охватить широкий спектр материалов."}
                                  {formData.timeCommitment === "high" && "Вы готовы серьезно погрузиться в обучение, что позволит нам предложить глубокие и обширные материалы."}
                                </p>
                                <p className="text-sm text-white/70 mt-2">
                                  {formData.preferredLearningStyle === "visual" && "Учитывая ваш визуальный стиль обучения, будут рекомендованы материалы с наглядными примерами и визуализациями."}
                                  {formData.preferredLearningStyle === "practical" && "Учитывая ваш практический стиль обучения, будут рекомендованы интерактивные задания и проекты."}
                                  {formData.preferredLearningStyle === "theoretical" && "Учитывая ваш теоретический стиль обучения, будут рекомендованы материалы с глубоким погружением в концепции."}
                                  {formData.preferredLearningStyle === "social" && "Учитывая ваш социальный стиль обучения, будут рекомендованы групповые задания и материалы с элементами взаимодействия."}
                                </p>
                              </div>
                            )}
                            
                            {analysisStep === 5 && (
                              <div>
                                <p className="font-medium">Формирование карты навыков</p>
                                <p className="text-sm text-white/70 mt-1">
                                  На основе всех ваших ответов мы создаем детальную карту навыков и компетенций, которая будет определять ваш путь обучения. Анализируем сильные стороны и области для развития...
                                </p>
                                <div className="mt-2">
                                  <div className="inline-block animate-pulse px-2 py-1 rounded bg-primary/20 text-primary text-xs mr-1 mb-1">Анализ программирования</div>
                                  <div className="inline-block animate-pulse px-2 py-1 rounded bg-purple-500/20 text-purple-400 text-xs mr-1 mb-1">Оценка математических навыков</div>
                                  <div className="inline-block animate-pulse px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-xs mr-1 mb-1">Картирование ML компетенций</div>
                                  <div className="inline-block animate-pulse px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs mr-1 mb-1">Определение образовательной траектории</div>
                                </div>
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
                        Мы создали ваш детальный профиль навыков и подготовили персональные рекомендации.
                      </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Профиль навыков - Skills DNA Radar Chart */}
                      <div>
                        <h4 className="text-lg font-medium mb-4 flex items-center">
                          <Brain className="h-5 w-5 mr-2 text-primary" />
                          Skills DNA
                        </h4>
                        
                        <Glassmorphism className="p-4 rounded-lg">
                          <div className="h-64">
                            <SimpleRadarChart 
                              skills={userSkillProfile}
                              height={240}
                            />
                          </div>
                          
                          <div className="mt-6 border-t border-white/10 pt-4">
                            <h5 className="text-sm font-medium mb-2">
                              Общая картина
                            </h5>
                            <p className="text-xs text-white/70 leading-relaxed">
                              {formData.experience === "beginner" && "Вы находитесь на начальном этапе обучения. Ваш профиль показывает хороший потенциал для роста. Рекомендуем сначала укрепить фундаментальные основы."}
                              {formData.experience === "intermediate" && "Ваш профиль показывает хороший баланс навыков. Есть крепкая база, на которой можно строить более специализированные знания."}
                              {formData.experience === "advanced" && "Ваш профиль демонстрирует продвинутый уровень по нескольким направлениям. Рекомендуем сосредоточиться на углублении специализации и изучении смежных областей."}
                            </p>
                            <div className="mt-3">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full border-white/20 hover:border-white/30"
                                onClick={() => window.location.href = '/skills-dna'}
                              >
                                Подробный анализ Skills DNA
                                <ChevronRight className="ml-1 h-4 w-4" />
                              </Button>
                            </div>
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
                                      <span>Сложность: {course.difficulty}/5</span>
                                    </div>
                                    
                                    {course.duration && (
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        <span>{course.duration} мин</span>
                                      </div>
                                    )}
                                    
                                    {course.modules && (
                                      <div className="flex items-center gap-1">
                                        <Layers className="h-3 w-3" />
                                        <span>{course.modules} модулей</span>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {course.reason && (
                                    <div className="mt-2 text-xs p-1.5 bg-primary/10 rounded">
                                      <span className="text-primary font-medium">Почему подходит:</span> {course.reason}
                                    </div>
                                  )}
                                  
                                  {course.skillGaps && course.skillGaps.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1">
                                      {course.skillGaps.map((gap, index) => (
                                        <span key={index} className="text-xs px-1.5 py-0.5 bg-blue-500/10 text-blue-300 rounded">
                                          {gap}
                                        </span>
                                      ))}
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
                      <Button 
                        onClick={() => setLocation("/courses?filter=recommended")}
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
                      
                      <Button 
                        onClick={handleContinueToDashboard}
                        className="bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] hover:opacity-90 text-white"
                      >
                        Перейти к обучению
                        <Rocket className="h-4 w-4 ml-2" />
                      </Button>
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
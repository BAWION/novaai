import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { OrbitalLayout } from "@/components/orbital-layout";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { useUserProfile } from "@/context/user-profile-context";
import { useAuth } from "@/context/auth-context";
import { apiRequest } from "@/lib/queryClient";
import { Link, useLocation } from "wouter";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LearningTimeline } from "@/components/progress/learning-timeline";
import { default as SkillProgress } from "@/components/progress/skill-progress";
import { WelcomeModal } from "@/components/onboarding/welcome-modal";
import { CompactSkillsDnaCard } from "@/components/skills-dna";
import { SkillsDnaProfile } from "@/components/skills-dna-profile";
import { LearningRoadmap } from "@/components/roadmap";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const { userProfile, updateUserProfile } = useUserProfile();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [showOnboardingPrompt, setShowOnboardingPrompt] = useState(true);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  
  // Получение рекомендуемых курсов
  const { data: recommendedCourses = [] } = useQuery({
    queryKey: ['/api/courses/recommended'],
    queryFn: async () => {
      try {
        const res = await apiRequest('GET', '/api/courses/recommended');
        if (!res.ok) {
          throw new Error('Ошибка при загрузке рекомендуемых курсов');
        }
        const data = await res.json();
        return data;
      } catch (error) {
        console.error('Ошибка при загрузке рекомендуемых курсов:', error);
        // Возвращаем тестовые данные при ошибке
        return [
          {
            id: 1,
            title: "AI Literacy 101",
            description: "Базовый курс по основам ИИ и его применению",
            level: 1,
            matchPercentage: 95
          },
          {
            id: 2,
            title: "Математика для ИИ",
            description: "Основы математики, необходимые для понимания алгоритмов ИИ",
            level: 2,
            matchPercentage: 85
          }
        ];
      }
    },
    // Если пользователь не авторизован, используем демо-данные
    enabled: !!user
  });
  
  const [message, setMessage] = useState("");
  const [AITutorChat, setAITutorChat] = useState({
    messages: [
      {
        id: "1",
        sender: "ai",
        content: "Привет! Я твой ИИ-тьютор в NovaAI. Я здесь, чтобы помочь с любыми вопросами о твоем образовательном пути. Что тебя интересует?",
        timestamp: new Date()
      }
    ],
    isTyping: false,
    suggestions: [
      "Какие навыки мне стоит развивать дальше?",
      "Как мне лучше подготовиться к проекту?",
      "Почему изменился мой учебный план?",
      "Что мне нужно изучить для карьеры в AI?"
    ]
  });
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Добавляем сообщение пользователя
    const userMessage = {
      id: Date.now().toString(),
      sender: "user",
      content: message,
      timestamp: new Date()
    };
    
    setAITutorChat(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isTyping: true
    }));
    
    setMessage("");
    
    // Имитируем ответ ИИ-тьютора
    setTimeout(() => {
      const aiResponses = [
        "Основываясь на твоем прогрессе, я рекомендую углубиться в изучение pandas и визуализацию данных. Это поможет тебе в ближайших проектах по анализу данных.",
        "Я заметил, что ты проявляешь интерес к обработке естественного языка. Это отличный выбор! Для развития в этой области рекомендую обратить внимание на модуль по NLP, который я добавил в твою персональную программу.",
        "Анализируя твои результаты тестов, я вижу, что тебе может быть полезно дополнительное время на изучение продвинутых SQL-запросов. Я уже адаптировал твой учебный план.",
        "Отлично! Я заметил, что ты быстро освоил базовые концепции машинного обучения. Я рекомендую тебе продвинутый курс по нейронным сетям, который открыт в твоем профиле."
      ];
      
      const aiMessage = {
        id: Date.now().toString(),
        sender: "ai",
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        timestamp: new Date()
      };
      
      setAITutorChat(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        isTyping: false
      }));
    }, 1500);
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    // Можно также сразу отправить сообщение
    // setMessage(suggestion);
    // setTimeout(() => handleSendMessage(), 100);
  };
  
  const [lastActivity, setLastActivity] = useState<any>(null);
  const [streak, setStreak] = useState(0);
  const [xpLevel, setXpLevel] = useState({
    currentXP: 680,
    levelXP: 1000,
    level: 3
  });
  const [userLevel, setUserLevel] = useState({
    title: "Продвинутый",
    level: 3,
    nextMilestone: "Эксперт",
    progress: 72,
    description: "Подходит для всех пользователей от новичка до эксперта"
  });
  const [adaptiveAIData, setAdaptiveAIData] = useState({
    currentTrajectory: {
      title: "Текущие рекомендации",
      description: "Основано на вашем прогрессе за последние 2 недели",
      emphasis: ["Анализ данных", "Pandas", "Визуализация"],
      skills: [
        { name: "Python", level: 72, change: 0 },
        { name: "Pandas", level: 58, change: 4 },
        { name: "Data Visualization", level: 45, change: 8 },
        { name: "SQL", level: 32, change: 2 },
        { name: "Machine Learning", level: 29, change: -2 }
      ],
      adaptations: [
        {
          type: "Выделено больше времени",
          reason: "Сложности с пониманием",
          topic: "Продвинутый pandas",
          previous: "2 часа",
          current: "3.5 часа"
        },
        {
          type: "Добавлены дополнительные упражнения",
          reason: "Высокий интерес",
          topic: "Визуализация данных",
          previous: "3 упражнения",
          current: "5 упражнений"
        },
        {
          type: "Изменён порядок модулей",
          reason: "Оптимизация последовательности",
          topic: "Машинное обучение",
          previous: "После SQL",
          current: "После визуализации"
        }
      ],
      historyItems: [
        {
          date: "2025-04-16",
          change: "Увеличено время на модуль Pandas",
          reason: "Анализ прогресса: 68% правильных ответов в тестах (ниже целевых 80%)"
        },
        {
          date: "2025-04-19",
          change: "Добавлены практические примеры визуализации",
          reason: "Обнаружен высокий интерес: просмотрено 5 дополнительных материалов по теме"
        },
        {
          date: "2025-04-22",
          change: "Рекомендован курс по SQL",
          reason: "Анализ выполненных проектов: требуется навык работы с базами данных"
        }
      ]
    }
  });
  const [personalizationData, setPersonalizationData] = useState({
    personalizationScore: 87,
    adjustments: [
      {
        id: 1,
        title: "Адаптированный контент",
        description: "Учебные материалы и упражнения изменены под ваш стиль обучения",
        standard: "Универсальные материалы",
        personalized: "Материалы с визуальными компонентами и интерактивными заданиями",
        improvementPercent: 42
      },
      {
        id: 2,
        title: "Подбор проектов",
        description: "Проекты подобраны под ваши интересы и цели в карьере",
        standard: "Общие проекты для всех",
        personalized: "Проекты в области анализа данных и прогнозирования",
        improvementPercent: 65
      },
      {
        id: 3,
        title: "Скорость прохождения",
        description: "Темп обучения адаптирован к вашей скорости усвоения материала",
        standard: "Фиксированный темп",
        personalized: "Ускоренное прохождение базовых тем, углубленное изучение сложных",
        improvementPercent: 38
      }
    ],
    learningStyle: {
      visual: 65,
      auditory: 30,
      kinesthetic: 45,
      reading: 80
    },
    recommendedLearningPath: "Аналитика данных с акцентом на практическое применение"
  });
  const [practicalProjects, setPracticalProjects] = useState([
    {
      id: 1,
      title: "Прогнозирование цен на недвижимость",
      skillsUsed: ["Python", "Pandas", "Scikit-learn", "Data Visualization"],
      complexity: "Средняя",
      timeEstimate: "3-5 часов",
      description: "Примените навыки машинного обучения и анализа данных к реальному набору данных о недвижимости."
    },
    {
      id: 2,
      title: "Чат-бот с GPT-4",
      skillsUsed: ["API Integration", "Prompt Engineering", "JavaScript"],
      complexity: "Легкая",
      timeEstimate: "1-2 часа",
      description: "Создайте простой чат-интерфейс и интегрируйте его с OpenAI API."
    },
    {
      id: 3,
      title: "Анализатор эмоций в тексте",
      skillsUsed: ["NLP", "Python", "spaCy"],
      complexity: "Средняя",
      timeEstimate: "2-4 часа",
      description: "Постройте систему для определения эмоционального тона в тексте с обучением на реальных данных."
    }
  ]);
  const [nextEvent, setNextEvent] = useState({
    id: "ev123",
    title: "AMA: Карьера в AI-исследованиях",
    time: "19:00",
    speaker: "Анна Иванова, Ph.D.",
    participants: 78
  });
  const [aiAdvice, setAiAdvice] = useState({
    title: "AI-рекомендация по обучению",
    content: "Основываясь на вашем прогрессе, рекомендую сфокусироваться на модуле «Обработка данных». Это улучшит ваши навыки для следующего проекта и поможет лучше понять концепции машинного обучения.",
    area: "Персональная образовательная траектория"
  });
  const [personalStats, setPersonalStats] = useState({
    totalHours: 47,
    completedModules: 12,
    skillsAcquired: 8
  });
  const [forumTopic, setForumTopic] = useState({
    title: "Как оптимизировать pipeline для NLP?",
    replies: 8,
    hot: true
  });
  const [nextDeadline, setNextDeadline] = useState({
    title: "Проект: Классификатор изображений",
    dueDate: "2025-04-26T23:59:59Z", // через 3 дня
    courseId: 2
  });
  const [viewMode, setViewMode] = useState<'orbital' | 'tracks'>('orbital');
  const [isSkillsDnaDialogOpen, setIsSkillsDnaDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>(undefined);

  // Проверка наличия данных диагностики в sessionStorage и применение их при необходимости
  useEffect(() => {
    try {
      const savedData = sessionStorage.getItem('skillsDnaResults');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        console.log("[Dashboard] Найдены сохраненные данные диагностики:", {
          skillsCount: Object.keys(parsedData.skills || {}).length,
          diagnosticType: parsedData.diagnosticType,
          hasRecommendations: Array.isArray(parsedData.recommendations) && parsedData.recommendations.length > 0
        });
        
        // Убедимся, что данные в sessionStorage актуальны
        if (!sessionStorage.getItem('skillsDnaResultsPersisted')) {
          sessionStorage.setItem('skillsDnaResultsPersisted', 'true');
        }
      }
    } catch (error) {
      console.error("[Dashboard] Ошибка при проверке данных диагностики в sessionStorage:", error);
    }
  }, []);

  // Обработчик события для показа подробного анализа Skills DNA
  useEffect(() => {
    // Добавляем слушатель для события, которое генерирует компонент CompactSkillsDnaCard
    const handleShowSkillsDnaDetails = (event: Event) => {
      // Приводим event к CustomEvent, чтобы получить доступ к detail
      const customEvent = event as CustomEvent;
      
      // Получаем идентификатор пользователя из события
      const userId = customEvent.detail?.userId;
      console.log("[Dashboard] Получено событие showSkillsDnaDetails, userId:", userId);
      
      // Устанавливаем выбранного пользователя и открываем диалоговое окно
      setSelectedUserId(userId || userProfile?.userId || user?.id);
      setIsSkillsDnaDialogOpen(true);
    };

    // Регистрируем обработчик события
    window.addEventListener('showSkillsDnaDetails', handleShowSkillsDnaDetails);

    // Очищаем обработчик при размонтировании компонента
    return () => {
      window.removeEventListener('showSkillsDnaDetails', handleShowSkillsDnaDetails);
    };
  }, [userProfile, user]);

  // Проверка статуса пользователя и показ приветственного модального окна
  useEffect(() => {
    // Если пользователь пришел после регистрации из onboarding
    // или если пользователь авторизован, но еще не прошел онбординг
    const fromRegistration = sessionStorage.getItem("fromRegistrationAfterOnboarding") === "true";
    
    if (fromRegistration || (user && userProfile && !userProfile.completedOnboarding)) {
      // Показываем приветственное модальное окно, вместо обычной подсказки
      setShowWelcomeModal(true);
      console.log("Открываем приветственное модальное окно для нового пользователя");
      
      // Удаляем флаг, если он был установлен
      if (fromRegistration) {
        sessionStorage.removeItem("fromRegistrationAfterOnboarding");
      }
    }
  }, [user, userProfile]);

  // Обработчик начала онбординга - направляем сразу на глубокую диагностику
  const handleStartOnboarding = () => {
    setShowOnboardingPrompt(false);
    setShowWelcomeModal(false);
    setLocation("/deep-diagnosis");
  };

  // Обработчик закрытия подсказки об онбординге
  const handleDismissOnboarding = () => {
    setShowOnboardingPrompt(false);
    setShowWelcomeModal(false);
  };
  
  // Обработчик изменения состояния модального окна
  const handleWelcomeModalChange = (open: boolean) => {
    setShowWelcomeModal(open);
  };

  useEffect(() => {
    const fetchLastActivity = async () => {
      try {
        // В реальном приложении здесь был бы API-запрос
        const mockLastActivity = {
          courseId: 1,
          courseName: "Python for Data Science",
          moduleName: "Продвинутые функции",
          lessonName: "Рекурсия и оптимизация в Python",
          progress: 45,
          lastAccessed: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        };
        
        setLastActivity(mockLastActivity);
      } catch (error) {
        console.error("Error fetching last activity:", error);
      }
    };

    const fetchUserStats = async () => {
      try {
        // В реальном приложении здесь был бы API-запрос
        const streakDays = userProfile?.streakDays || Math.floor(Math.random() * 7) + 1;
        setStreak(streakDays);
      } catch (error) {
        console.error("Error fetching user stats:", error);
      }
    };

    fetchLastActivity();
    fetchUserStats();
  }, [userProfile]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const formatDueDate = (dateString: string) => {
    const now = new Date();
    const dueDate = new Date(dateString);
    const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Сегодня";
    if (diffDays === 1) return "Завтра";
    if (diffDays > 1 && diffDays < 7) return `Через ${diffDays} дней`;
    
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit'
    }).format(dueDate);
  };

  return (
    <DashboardLayout title="Мостик" subtitle="Управление обучением и персональная траектория">
      {/* Приветственное модальное окно для новых пользователей */}
      <WelcomeModal 
        isOpen={showWelcomeModal} 
        onOpenChange={handleWelcomeModalChange} 
        userName={user?.displayName || "студент"}
      />
      
      {/* Модальное окно для подробного анализа Skills DNA */}
      <Dialog open={isSkillsDnaDialogOpen} onOpenChange={setIsSkillsDnaDialogOpen}>
        <DialogContent className="sm:max-w-4xl bg-space-900 border-space-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white flex items-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#B28DFF] via-[#8BE0F7] to-[#B28DFF]">
                Подробный анализ Skills DNA
              </span>
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Полный анализ ваших навыков и компетенций в области искусственного интеллекта
            </DialogDescription>
          </DialogHeader>
          
          {/* Компонент полного профиля Skills DNA */}
          <div className="py-2">
            <SkillsDnaProfile 
              userId={selectedUserId} 
              showHeader={false} 
              className="pt-2" 
            />
          </div>
        </DialogContent>
      </Dialog>
      
      <div className="flex flex-col gap-6">
        {/* Header with breadcrumb & search */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-between items-center bg-space-900/50 rounded-lg py-2 px-4"
        >
          <div className="text-white/60 text-sm flex items-center gap-2">
            <span className="text-primary">NovaAI</span>
            <i className="fas fa-chevron-right text-xs"></i>
            <span>Образовательный центр</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-space-800/50 rounded-lg px-3 py-1.5 text-white/50 text-sm">
              <i className="fas fa-search text-xs"></i>
              <span>Cmd+K</span>
            </div>
            <div className="relative">
              <i className="fas fa-bell text-white/60 hover:text-white cursor-pointer transition"></i>
              <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-primary"></div>
            </div>
          </div>
        </motion.div>
      
        {/* Подсказка для прохождения онбординга (показывается только новым пользователям) */}
        {userProfile && !userProfile.completedOnboarding && showOnboardingPrompt && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full bg-gradient-to-r from-[#6E3AFF]/20 to-[#2EBAE1]/20 border border-[#6E3AFF]/30 rounded-xl p-4 mb-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="p-3 rounded-full bg-primary/20 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.04Z"/>
                  <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.04Z"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-1">Пройдите персонализированный онбординг</h3>
                <p className="text-white/70 mb-2">
                  Расскажите о своих целях и интересах, чтобы мы создали для вас персональный план обучения.
                  ИИ-алгоритм подстроит программу под ваши потребности и опыт.
                </p>
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={handleStartOnboarding}
                    className="px-4 py-2 bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] hover:from-[#5A2AE0] hover:to-[#1A9ACA] rounded-lg text-white font-medium transition-all"
                  >
                    Начать онбординг
                  </button>
                  <button
                    onClick={handleDismissOnboarding}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/80 transition-all"
                  >
                    Позже
                  </button>
                </div>
              </div>
              <button
                onClick={handleDismissOnboarding}
                className="absolute top-3 right-3 text-white/50 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"/>
                  <path d="m6 6 12 12"/>
                </svg>
              </button>
            </div>
          </motion.div>
        )}

        {/* Main title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-2"
        >
          <h1 className="font-orbitron text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#B28DFF] via-[#8BE0F7] to-[#B28DFF]">
            Мой образовательный путь
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-white/70 text-md">Персонализированная траектория развития в NovaAI</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-[#6E3AFF]/20 to-[#2EBAE1]/20 rounded-full border border-[#6E3AFF]/30 cursor-help">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1]"></div>
                    <span className="text-xs font-medium text-white/80">{userLevel.title}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div>
                    <div className="mb-2">
                      <span className="font-semibold">{userLevel.title} уровень</span>
                      <p className="text-sm opacity-80">{userLevel.description}</p>
                    </div>
                    <div className="mb-1 flex justify-between text-xs">
                      <span>Новичок</span>
                      <span>Продвинутый</span>
                      <span>Эксперт</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden relative mb-2">
                      <div 
                        className="h-full bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] rounded-full" 
                        style={{ width: `${userLevel.progress}%` }}
                      ></div>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`absolute top-0 w-px h-full bg-white/30 ${i < userLevel.level ? 'opacity-0' : 'opacity-100'}`} 
                          style={{ left: `${(i + 1) * 20}%` }}
                        ></div>
                      ))}
                    </div>
                    <p className="text-xs text-center">
                      <span>До следующего уровня: </span>
                      <span className="font-semibold">{userLevel.nextMilestone}</span>
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </motion.div>
        
        {/* Main Content - Skills DNA and Recommended Courses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Skills DNA Card - Left side */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full"
          >
            <Glassmorphism className="h-full rounded-xl overflow-hidden border border-purple-500/30 p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600/40 to-purple-700/20 flex items-center justify-center">
                  <i className="fas fa-brain text-purple-300"></i>
                </div>
                <h2 className="font-orbitron text-xl font-semibold ml-3">
                  Skills DNA
                </h2>
              </div>
              <CompactSkillsDnaCard 
                userId={userProfile?.userId || user?.id} 
                showHeader={false} 
                className="bg-transparent border-0" 
              />
            </Glassmorphism>
          </motion.div>

          {/* Recommended Courses - Right side */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full"
          >
            <Glassmorphism className="h-full rounded-xl overflow-hidden border border-indigo-500/30 p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600/40 to-indigo-700/20 flex items-center justify-center">
                  <i className="fas fa-book text-indigo-300"></i>
                </div>
                <h2 className="font-orbitron text-xl font-semibold ml-3">
                  Рекомендуемые курсы
                </h2>
              </div>
              
              <div className="space-y-4">
                {recommendedCourses.slice(0, 2).map((course: any) => (
                  <div 
                    key={course.id}
                    className="bg-space-900/50 hover:bg-space-900/70 border border-space-700 rounded-lg p-4 transition-all cursor-pointer"
                    onClick={() => setLocation(`/courses/${course.id}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 text-xs rounded-md ${
                            course.matchPercentage && course.matchPercentage > 90 
                              ? 'bg-green-500/20 text-green-300' 
                              : course.matchPercentage && course.matchPercentage > 75
                                ? 'bg-yellow-500/20 text-yellow-300'
                                : 'bg-blue-500/20 text-blue-300'
                          }`}>
                            {course.matchPercentage ? `${course.matchPercentage}% совпадение` : '95% совпадение'}
                          </span>
                        </div>
                        <h3 className="text-lg font-medium mt-2">{course.title}</h3>
                        <p className="text-white/60 text-sm mt-1">{course.description || 'Описание курса'}</p>
                        
                        <div className="flex flex-wrap items-center gap-3 mt-3">
                          <div className="flex items-center gap-1.5">
                            <i className="fas fa-signal text-white/60"></i>
                            <span className="text-white/60 text-xs">Сложность: {course.level}/5</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <i className="fas fa-clock text-white/60"></i>
                            <span className="text-white/60 text-xs">120 мин</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <i className="fas fa-layer-group text-white/60"></i>
                            <span className="text-white/60 text-xs">5 модулей</span>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <span className="text-purple-400 text-xs">Почему подходит:</span>
                          <p className="text-white/80 text-xs mt-1">
                            {course.id === 1 
                              ? 'Идеально для начала обучения машинному обучению на вашем уровне' 
                              : 'Поможет заполнить пробелы в математической подготовке'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      {course.id === 1 ? (
                        <>
                          <span className="px-2 py-1 bg-space-800/60 text-white/80 text-xs rounded-md">Линейная алгебра</span>
                          <span className="px-2 py-1 bg-space-800/60 text-white/80 text-xs rounded-md">Статистика</span>
                          <span className="px-2 py-1 bg-space-800/60 text-white/80 text-xs rounded-md">Оптимизация</span>
                        </>
                      ) : (
                        <>
                          <span className="px-2 py-1 bg-space-800/60 text-white/80 text-xs rounded-md">Программирование</span>
                          <span className="px-2 py-1 bg-space-800/60 text-white/80 text-xs rounded-md">Python</span>
                          <span className="px-2 py-1 bg-space-800/60 text-white/80 text-xs rounded-md">Алгоритмы</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
            </Glassmorphism>
          </motion.div>
        </div>

        {/* Additional Content Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          {/* Left column - Main orbital view (70%) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-space-800/50 rounded-xl p-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-orbitron text-xl font-semibold">
                  Все курсы
                </h2>
                <div className="flex items-center bg-space-900/50 rounded-lg overflow-hidden">
                  <button 
                    onClick={() => setViewMode('orbital')}
                    className={`px-3 py-1.5 text-sm ${viewMode === 'orbital' ? 'bg-primary/30 text-white' : 'text-white/60'}`}
                  >
                    <i className="fas fa-globe-americas mr-1"></i>
                    Орбиты
                  </button>
                  <button 
                    onClick={() => setViewMode('tracks')}
                    className={`px-3 py-1.5 text-sm ${viewMode === 'tracks' ? 'bg-primary/30 text-white' : 'text-white/60'}`}
                  >
                    <i className="fas fa-road mr-1"></i>
                    По навыкам
                  </button>
                </div>
              </div>
              <OrbitalLayout />
              <div className="flex justify-end mt-2">
                <Link href="/courses">
                  <div className="text-sm text-white/70 hover:text-white transition inline-flex items-center">
                    Смотреть все курсы
                    <i className="fas fa-chevron-right ml-1.5 text-xs"></i>
                  </div>
                </Link>
              </div>
            </motion.div>
            
            {/* Learning Roadmap */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mb-6"
            >
              <LearningRoadmap isDemoMode={true} />
            </motion.div>
            
            {/* AI Analysis Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Glassmorphism className="rounded-xl p-5 border border-[#2EBAE1]/30">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[#2EBAE1]/20 to-[#2EBAE1]/10 text-[#8BE0F7]">
                    <i className="fas fa-brain text-xl"></i>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-lg">ИИ анализирует ваш прогресс</h3>
                    <p className="text-white/50 text-xs">Адаптивная персонализация обучения</p>
                  </div>
                </div>
                
                <div className="bg-black/20 rounded-lg p-3 mb-3">
                  <div className="flex items-center mb-2">
                    <div className="text-[#2EBAE1] mr-2">
                      <i className="fas fa-chart-line"></i>
                    </div>
                    <p className="text-white/80 text-sm font-medium">Обнаружен паттерн обучения:</p>
                  </div>
                  <p className="text-white/70 text-sm ml-6 mb-2">
                    ИИ выявил ваши сильные стороны в обработке данных, но заметил затруднения с алгоритмами оптимизации.
                  </p>
                  <div className="flex items-center mb-2 mt-3">
                    <div className="text-[#2EBAE1] mr-2">
                      <i className="fas fa-robot"></i>
                    </div>
                    <p className="text-white/80 text-sm font-medium">Адаптация контента:</p>
                  </div>
                  <p className="text-white/70 text-sm ml-6">
                    {aiAdvice.content}
                  </p>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-white/60 text-xs">Персонализация контента:</p>
                    <p className="text-[#2EBAE1] text-xs font-medium">86%</p>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#2EBAE1] to-[#6E3AFF] rounded-full" 
                      style={{ width: '86%' }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-3">
                  <button 
                    onClick={() => setLocation('/roadmap')}
                    className="px-3 py-1 bg-[#2EBAE1]/20 hover:bg-[#2EBAE1]/30 rounded-lg text-xs text-[#8BE0F7] flex items-center"
                  >
                    <i className="fas fa-route mr-1.5"></i>
                    Показать в дорожной карте
                  </button>
                  <button
                    onClick={() => setLocation('/courses')}
                    className="px-3 py-1 bg-black/20 hover:bg-black/30 rounded-lg text-xs text-white/70 flex items-center"
                  >
                    <i className="fas fa-book mr-1.5"></i>
                    Найти курс
                  </button>
                </div>
              </Glassmorphism>
            </motion.div>
            
            {/* User Level Progression */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Glassmorphism className="rounded-xl p-5 border border-[#6E3AFF]/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[#6E3AFF]/20 to-[#6E3AFF]/10 text-[#B28DFF]">
                    <i className="fas fa-graduation-cap text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Ваш уровень: {userLevel.title}</h3>
                    <p className="text-white/50 text-xs">Платформа NovaAI для всех уровней: от новичка до эксперта</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-20 h-20 relative rounded-full flex items-center justify-center border-4 border-[#6E3AFF]/30 bg-space-900/30">
                    <div 
                      className="absolute inset-1 rounded-full"
                      style={{ 
                        background: `conic-gradient(#6E3AFF ${userLevel.progress}%, transparent 0%)`,
                        mask: 'radial-gradient(transparent 55%, black 56%)',
                        WebkitMask: 'radial-gradient(transparent 55%, black 56%)'
                      }}
                    ></div>
                    <span className="text-lg font-semibold">{userLevel.level}</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Новичок</span>
                      <span>Продвинутый</span>
                      <span>Эксперт</span>
                    </div>
                    <div className="h-2 bg-space-800 rounded-full relative mb-3">
                      <div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] rounded-full"
                        style={{ width: `${userLevel.progress}%` }}
                      ></div>
                      <div className="absolute top-0 h-full w-full flex justify-between px-[2%]">
                        {[1, 2, 3, 4, 5].map(level => (
                          <div 
                            key={level}
                            className={`w-4 h-4 rounded-full border-2 border-space-800 flex items-center justify-center relative -top-1 ${level <= userLevel.level ? 'bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1]' : 'bg-space-900/90'}`}
                          >
                            <span className="text-[9px] font-bold">{level}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-white/70">
                      <span className="text-white/90">Следующая цель: </span> 
                      <span className="font-medium text-[#B28DFF]">{userLevel.nextMilestone}</span>
                      <span className="text-white/50 ml-2">{`(${userLevel.progress}% выполнено)`}</span>
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 bg-space-900/40 p-3 rounded-lg mb-1">
                  <div className="text-center border-r border-white/10 pr-2">
                    <p className="text-white/50 text-xs mb-1">Доступный контент</p>
                    <p className="text-sm font-medium">Все уровни</p>
                  </div>
                  <div className="text-center border-r border-white/10 pr-2">
                    <p className="text-white/50 text-xs mb-1">Сложность</p>
                    <div className="flex justify-center items-center">
                      <i className="fas fa-star text-amber-400 text-xs"></i>
                      <i className="fas fa-star text-amber-400 text-xs mx-0.5"></i>
                      <i className="fas fa-star text-amber-400 text-xs"></i>
                      <i className="fas fa-star text-white/20 text-xs mx-0.5"></i>
                      <i className="fas fa-star text-white/20 text-xs"></i>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-white/50 text-xs mb-1">Доступ</p>
                    <p className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full inline-block">Полный</p>
                  </div>
                </div>
              </Glassmorphism>
            </motion.div>
            
            {/* AI Adaptivity Demonstration */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <Glassmorphism className="rounded-xl p-5 border border-purple-500/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-purple-500/10 text-purple-400">
                      <i className="fas fa-robot text-xl"></i>
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Адаптивный ИИ в действии</h3>
                      <p className="text-white/50 text-xs">ИИ постоянно корректирует вашу программу на основе результатов</p>
                    </div>
                  </div>
                  <button className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-lg text-xs hover:bg-purple-500/30 transition">
                    История изменений
                  </button>
                </div>
                
                <div className="bg-black/20 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{adaptiveAIData.currentTrajectory.title}</h4>
                    <span className="text-xs text-white/50">{adaptiveAIData.currentTrajectory.description}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h5 className="text-sm font-medium mb-2">Основной акцент</h5>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {adaptiveAIData.currentTrajectory.emphasis.map((item, index) => (
                          <div 
                            key={index}
                            className="bg-purple-500/20 border border-purple-500/30 text-white px-3 py-1 rounded-lg text-xs"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                      
                      <h5 className="text-sm font-medium mb-2">Навыки в фокусе</h5>
                      <div className="space-y-2">
                        {adaptiveAIData.currentTrajectory.skills.map((skill, index) => (
                          <div key={index} className="relative">
                            <div className="flex justify-between items-center mb-1 text-xs">
                              <span>{skill.name}</span>
                              <div className="flex items-center">
                                <span>{skill.level}%</span>
                                {skill.change !== 0 && (
                                  <span className={`ml-2 ${skill.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {skill.change > 0 ? '+' : ''}{skill.change}%
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="h-1.5 bg-space-800 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${
                                  skill.change > 0 
                                    ? 'bg-gradient-to-r from-purple-500 to-green-500' 
                                    : skill.change < 0 
                                      ? 'bg-gradient-to-r from-purple-500 to-red-500'
                                      : 'bg-purple-500'
                                }`}
                                style={{ width: `${skill.level}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium mb-2">Последние адаптации ИИ</h5>
                      <div className="space-y-3">
                        {adaptiveAIData.currentTrajectory.adaptations.map((adaptation, index) => (
                          <div key={index} className="bg-space-900/70 rounded-lg p-3">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-medium text-xs">{adaptation.type}</span>
                              <span className="text-xs bg-purple-500/20 text-purple-400 rounded px-1.5 py-0.5">
                                {adaptation.topic}
                              </span>
                            </div>
                            <p className="text-white/50 text-xs mb-2">{adaptation.reason}</p>
                            <div className="flex text-xs">
                              <div className="flex-1">
                                <span className="text-white/50">Было:</span>
                                <span className="ml-1 text-white/80">{adaptation.previous}</span>
                              </div>
                              <div className="flex-1">
                                <span className="text-white/50">Стало:</span>
                                <span className="ml-1 text-purple-400">{adaptation.current}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <h5 className="text-sm font-medium mb-2">История адаптаций</h5>
                  <div className="relative pl-4 border-l border-purple-500/30 space-y-3">
                    {adaptiveAIData.currentTrajectory.historyItems.map((item, index) => (
                      <div key={index} className="relative">
                        <div className="absolute -left-[17px] top-[2px] w-3 h-3 bg-space-900 rounded-full border-2 border-purple-500"></div>
                        <div className="text-xs text-white/50 mb-0.5">{item.date}</div>
                        <div className="text-sm">{item.change}</div>
                        <div className="text-xs text-white/60 mt-0.5">{item.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <button className="text-sm text-white/60 hover:text-white transition flex items-center">
                    <i className="fas fa-sync-alt mr-1.5"></i>
                    Запросить обновление
                  </button>
                  <button
                    onClick={() => setLocation('/analytics')}
                    className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-purple-500/10 rounded-lg text-xs text-purple-400 hover:bg-purple-500/30 transition"
                  >
                    <span>Детальная статистика</span>
                    <i className="fas fa-chart-line ml-1.5"></i>
                  </button>
                </div>
              </Glassmorphism>
            </motion.div>
            
            {/* Personalization Indicator */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
            >
              <Glassmorphism className="rounded-xl p-5 border border-[#2EBAE1]/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[#2EBAE1]/20 to-[#2EBAE1]/10 text-[#8BE0F7]">
                      <i className="fas fa-fingerprint text-xl"></i>
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Ваша уникальная программа</h3>
                      <p className="text-white/50 text-xs">Персонализация NovaAI делает ваш путь обучения эффективнее</p>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-16 relative flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full" style={{ 
                          background: `conic-gradient(#2EBAE1 ${personalizationData.personalizationScore}%, transparent 0%)`,
                          mask: 'radial-gradient(transparent 55%, black 56%)',
                          WebkitMask: 'radial-gradient(transparent 55%, black 56%)'
                        }}></div>
                        <div className="bg-space-900/80 absolute inset-2 rounded-full flex items-center justify-center">
                          <span className="text-lg font-semibold">{personalizationData.personalizationScore}%</span>
                        </div>
                      </div>
                      <div className="text-xs">
                        <p className="text-white/70">Уровень</p>
                        <p className="font-medium">персонализации</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/20 rounded-lg p-4 mb-4">
                  <h4 className="font-medium mb-3">Отличия вашей программы от стандартной</h4>
                  <div className="space-y-4">
                    {personalizationData.adjustments.map((adjustment) => (
                      <div key={adjustment.id} className="bg-space-900/50 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{adjustment.title}</span>
                          <span className="text-xs bg-[#2EBAE1]/20 text-[#8BE0F7] rounded-full px-2 py-0.5">
                            +{adjustment.improvementPercent}%
                          </span>
                        </div>
                        <p className="text-sm text-white/70 mb-3">{adjustment.description}</p>
                        <div className="flex gap-4 text-xs">
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5 mb-1">
                              <div className="w-3 h-3 rounded-full bg-white/20"></div>
                              <span className="text-white/60">Стандарт</span>
                            </div>
                            <div className="bg-white/5 rounded p-2 h-16 overflow-hidden">
                              {adjustment.standard}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5 mb-1">
                              <div className="w-3 h-3 rounded-full bg-[#2EBAE1]"></div>
                              <span className="text-[#8BE0F7]">Ваша программа</span>
                            </div>
                            <div className="bg-[#2EBAE1]/10 border border-[#2EBAE1]/20 rounded p-2 h-16 overflow-hidden">
                              {adjustment.personalized}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="bg-space-900/40 rounded-lg p-3 flex-1">
                    <h5 className="text-sm font-medium mb-2">Ваш стиль обучения</h5>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex flex-col">
                        <div className="flex justify-between mb-1">
                          <span className="text-white/60">Визуальный</span>
                          <span>{personalizationData.learningStyle.visual}%</span>
                        </div>
                        <div className="h-1.5 bg-space-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-400" 
                            style={{ width: `${personalizationData.learningStyle.visual}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex justify-between mb-1">
                          <span className="text-white/60">Аудиальный</span>
                          <span>{personalizationData.learningStyle.auditory}%</span>
                        </div>
                        <div className="h-1.5 bg-space-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-400" 
                            style={{ width: `${personalizationData.learningStyle.auditory}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex justify-between mb-1">
                          <span className="text-white/60">Кинестетический</span>
                          <span>{personalizationData.learningStyle.kinesthetic}%</span>
                        </div>
                        <div className="h-1.5 bg-space-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-purple-400" 
                            style={{ width: `${personalizationData.learningStyle.kinesthetic}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <div className="flex justify-between mb-1">
                          <span className="text-white/60">Чтение/письмо</span>
                          <span>{personalizationData.learningStyle.reading}%</span>
                        </div>
                        <div className="h-1.5 bg-space-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-emerald-400" 
                            style={{ width: `${personalizationData.learningStyle.reading}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-space-900/40 rounded-lg p-3 flex-1">
                    <h5 className="text-sm font-medium mb-2">Рекомендованный путь</h5>
                    <div className="text-xs text-white/80 mb-2 flex items-start">
                      <i className="fas fa-route text-[#8BE0F7] mr-2 mt-0.5"></i>
                      <span>{personalizationData.recommendedLearningPath}</span>
                    </div>
                    <button 
                      onClick={() => setLocation('/personalization')}
                      className="w-full mt-1 text-xs text-white/70 hover:text-white bg-black/30 hover:bg-black/40 transition rounded py-1.5"
                    >
                      <i className="fas fa-sliders-h mr-1.5"></i>
                      Настроить персонализацию
                    </button>
                  </div>
                </div>
              </Glassmorphism>
            </motion.div>
            
            {/* Practical Application */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Glassmorphism className="rounded-xl p-5 border border-[#FF3A8C]/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[#FF3A8C]/20 to-[#FF3A8C]/10 text-[#FF3A8C]">
                      <i className="fas fa-rocket text-xl"></i>
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Практическое применение</h3>
                      <p className="text-white/50 text-xs">Применяйте полученные навыки в реальных проектах сразу же</p>
                    </div>
                  </div>
                  <button className="text-white/60 hover:text-white/90 transition">
                    <i className="fas fa-ellipsis-h"></i>
                  </button>
                </div>
                
                <div className="bg-black/20 rounded-lg mb-4">
                  <div className="border-b border-white/10 px-4 py-3 flex justify-between items-center">
                    <h4 className="font-medium">Проекты, доступные с вашими навыками</h4>
                    <span className="text-xs bg-[#FF3A8C]/20 text-[#FF3A8C] px-2 py-0.5 rounded-full">Новые проекты</span>
                  </div>
                  
                  <div className="divide-y divide-white/5">
                    {practicalProjects.map((project) => (
                      <div key={project.id} className="p-4 hover:bg-white/5 transition cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium">{project.title}</h5>
                          <div className="flex items-center text-xs">
                            <span className="text-white/60">{project.complexity}</span>
                            <span className="mx-2 text-white/30">•</span>
                            <span className="text-white/60">{project.timeEstimate}</span>
                          </div>
                        </div>
                        <p className="text-sm text-white/70 mb-3">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.skillsUsed.map((skill, index) => (
                            <div key={index} className="text-xs bg-space-800 px-2 py-1 rounded-md text-white/70">
                              {skill}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <button className="inline-flex items-center text-sm text-white/60 hover:text-white transition">
                    <i className="fas fa-filter mr-1.5"></i>
                    Фильтр проектов
                  </button>
                  <button
                    onClick={() => setLocation('/projects')}
                    className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-[#FF3A8C]/20 to-[#FF3A8C]/10 rounded-lg text-xs text-[#FF3A8C] hover:from-[#FF3A8C]/30 hover:to-[#FF3A8C]/20 transition"
                  >
                    <span>Все проекты</span>
                    <i className="fas fa-arrow-right ml-1.5"></i>
                  </button>
                </div>
              </Glassmorphism>
            </motion.div>
            
            {/* Personal Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="flex flex-col md:flex-row gap-4"
            >
              <Glassmorphism className="rounded-xl p-4 md:w-1/3">
                <div className="flex flex-col items-center justify-center h-full">
                  <i className="fas fa-clock text-2xl text-primary/70 mb-1"></i>
                  <div className="text-2xl font-orbitron">{personalStats.totalHours}</div>
                  <div className="text-white/50 text-xs text-center">Часов обучения</div>
                </div>
              </Glassmorphism>
              
              <Glassmorphism className="rounded-xl p-4 md:w-1/3">
                <div className="flex flex-col items-center justify-center h-full">
                  <i className="fas fa-book text-2xl text-secondary/70 mb-1"></i>
                  <div className="text-2xl font-orbitron">{personalStats.completedModules}</div>
                  <div className="text-white/50 text-xs text-center">Завершенных модулей</div>
                </div>
              </Glassmorphism>
              
              <Glassmorphism className="rounded-xl p-4 md:w-1/3">
                <div className="flex flex-col items-center justify-center h-full">
                  <i className="fas fa-brain text-2xl text-[#FF3A8C]/70 mb-1"></i>
                  <div className="text-2xl font-orbitron">{personalStats.skillsAcquired}</div>
                  <div className="text-white/50 text-xs text-center">Приобретенных навыков</div>
                </div>
              </Glassmorphism>
            </motion.div>
            
            {/* Skills Progress */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {userProfile?.userId && (
                <SkillProgress 
                  userId={userProfile.userId} 
                  limit={5}
                />
              )}
            </motion.div>
            
            {/* Learning Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.65 }}
            >
              {userProfile?.userId && (
                <LearningTimeline 
                  userId={userProfile.userId} 
                  limit={4}
                />
              )}
            </motion.div>
          </div>

          {/* Right column (30%) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* AI Tutor Chat */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Glassmorphism className="rounded-xl overflow-hidden border border-purple-500/30">
                <div className="p-4 bg-gradient-to-r from-purple-600/20 to-purple-700/10 border-b border-purple-500/30">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                      <i className="fas fa-robot text-white"></i>
                    </div>
                    <div>
                      <h3 className="font-medium">ИИ-тьютор NovaAI</h3>
                      <p className="text-white/50 text-xs">Персональная помощь в обучении</p>
                    </div>
                    <div className="ml-auto flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <span className="text-xs text-white/60">Онлайн</span>
                    </div>
                  </div>
                </div>
                
                <div className="h-[300px] flex flex-col">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {AITutorChat.messages.map((msg) => (
                      <div 
                        key={msg.id}
                        className={`flex ${msg.sender === 'ai' ? 'justify-start' : 'justify-end'}`}
                      >
                        <div 
                          className={`max-w-[85%] rounded-lg p-3 ${
                            msg.sender === 'ai' 
                              ? 'bg-purple-900/40 border border-purple-700/30 rounded-tl-none' 
                              : 'bg-indigo-900/30 border border-indigo-700/30 rounded-tr-none'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-right text-[10px] text-white/40 mt-1">
                            {new Intl.DateTimeFormat('ru-RU', {
                              hour: '2-digit',
                              minute: '2-digit'
                            }).format(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {AITutorChat.isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-purple-900/40 border border-purple-700/30 rounded-lg rounded-tl-none p-3 max-w-[85%]">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="px-4 py-3 border-t border-white/10">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {AITutorChat.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-3 py-1 transition"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Задайте вопрос тьютору..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-purple-500/50"
                      />
                      <button 
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <i className="fas fa-paper-plane"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </Glassmorphism>
            </motion.div>
            
            {/* Continue Learning Card */}
            {lastActivity && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Glassmorphism className="rounded-xl p-5 border-l-4 border-l-[#6E3AFF]">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">Продолжить обучение</h3>
                      <p className="text-white/70 mt-1 text-sm">
                        {lastActivity.courseName} • {lastActivity.moduleName}
                      </p>
                      <p className="font-medium mt-2">{lastActivity.lessonName}</p>
                      <p className="text-white/50 text-xs mt-1">
                        Последний доступ: {formatDate(lastActivity.lastAccessed)}
                      </p>
                    </div>
                    <div className="ml-4">
                      <ProgressRing percent={lastActivity.progress} size={50} strokeWidth={4}>
                        <span className="text-xs font-medium">{lastActivity.progress}%</span>
                      </ProgressRing>
                    </div>
                  </div>
                  <button
                    onClick={() => setLocation(`/courses/${lastActivity.courseId}/lesson/next`)}
                    className="mt-4 inline-block bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] hover:from-[#4922B2] hover:to-[#1682A1] text-white py-2 px-4 rounded-lg font-medium transition duration-300 w-full text-center"
                  >
                    <i className="fas fa-play-circle mr-2"></i> 1-клик продолжить
                  </button>
                </Glassmorphism>
              </motion.div>
            )}
            
            {/* Next Deadline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Glassmorphism className="rounded-xl p-5 border-l-4 border-l-amber-500">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Ближайший дедлайн</h3>
                  <div className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs font-medium">
                    {formatDueDate(nextDeadline.dueDate)}
                  </div>
                </div>
                <p className="font-medium">{nextDeadline.title}</p>
                <button
                  onClick={() => setLocation(`/courses/${nextDeadline.courseId}/projects`)}
                  className="mt-3 text-sm text-white/70 hover:text-white transition flex items-center"
                >
                  Перейти к проекту
                  <i className="fas fa-arrow-right ml-1.5"></i>
                </button>
              </Glassmorphism>
            </motion.div>

            {/* Streak & XP Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Glassmorphism className="rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[#FF3A8C]/20 to-[#FF3A8C]/10 text-[#FF3A8C]">
                      <i className="fas fa-fire text-xl"></i>
                    </div>
                    <div className="ml-3">
                      <h3 className="font-semibold">Streak</h3>
                      <p className="text-white/70 text-sm">{streak} дней подряд</p>
                    </div>
                  </div>
                  <div className="text-white font-orbitron text-3xl">{streak}</div>
                </div>

                <button className="mb-4 w-full px-4 py-2 rounded-lg bg-black/20 hover:bg-black/30 text-white/80 hover:text-white transition text-sm flex items-center justify-center gap-2">
                  <i className="fab fa-telegram"></i>
                  <span>Поделиться прогрессом</span>
                </button>

                <div className="p-3 border border-white/10 rounded-lg mb-2">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="text-amber-400 text-xs font-medium px-2 py-0.5 bg-amber-400/10 rounded">
                        Уровень {xpLevel.level}
                      </div>
                      <div className="text-xs text-white/60">
                        {xpLevel.currentXP} / {xpLevel.levelXP} XP
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full" 
                      style={{ width: `${(xpLevel.currentXP / xpLevel.levelXP) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </Glassmorphism>
            </motion.div>
            
            {/* Today's event */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Glassmorphism className="rounded-xl p-5 border-l-4 border-l-[#2EBAE1]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Событие дня</h3>
                  <div className="px-2 py-0.5 bg-space-700 text-white/60 rounded text-xs font-medium">
                    {nextEvent.time}
                  </div>
                </div>
                <p className="font-medium mb-1">{nextEvent.title}</p>
                <p className="text-white/60 text-sm mb-3">
                  Спикер: {nextEvent.speaker}
                </p>
                <div className="flex items-center text-white/50 text-xs mb-4">
                  <i className="fas fa-users mr-1.5"></i>
                  <span>{nextEvent.participants} участников</span>
                </div>
                <button className="w-full bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition duration-300 text-sm">
                  Присоединиться
                </button>
              </Glassmorphism>
            </motion.div>
            
            {/* Forum Topic */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Glassmorphism className="rounded-xl p-5">
                <div className="flex items-start gap-3 mb-1">
                  <div className="w-10 h-10 rounded-full bg-space-700 flex items-center justify-center">
                    <i className="fas fa-comments text-white/70"></i>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-sm">Форум</h3>
                      {forumTopic.hot && (
                        <div className="px-1.5 py-0.5 bg-red-500/20 rounded text-xs text-red-400 flex items-center">
                          <i className="fas fa-fire-alt mr-1 text-[0.6rem]"></i>
                          Активное обсуждение
                        </div>
                      )}
                    </div>
                    <p className="text-sm mt-1">{forumTopic.title}</p>
                    <p className="text-white/50 text-xs mt-1">
                      {forumTopic.replies} ответов
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <button 
                    onClick={() => setLocation('/courses')}
                    className="text-xs text-white/70 hover:text-white transition flex items-center"
                  >
                    <i className="fas fa-graduation-cap mr-1.5"></i>
                    Назад к обучению
                  </button>
                  <button 
                    className="text-xs text-white/70 hover:text-white transition flex items-center"
                  >
                    Открыть обсуждение
                    <i className="fas fa-arrow-right ml-1.5"></i>
                  </button>
                </div>
              </Glassmorphism>
            </motion.div>
            
            {/* Settings button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex justify-end"
            >
              <button 
                onClick={() => setLocation('/roadmap')}
                className="text-sm text-white/50 hover:text-white/80 transition flex items-center gap-1.5"
              >
                <i className="fas fa-map"></i>
                <span>Перейти к карте обучения</span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
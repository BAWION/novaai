import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { useParams, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { check_secrets } from "../check-secrets";

// Interfaces для модели данных
interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'interactive';
  duration: number; // в минутах
  difficulty: 1 | 2 | 3;  // 1-легко, 2-средне, 3-сложно
  completed: boolean;
  progress: number; // 0-100
  concepts: string[]; // ключевые концепции урока
  prerequisites: string[]; // id предыдущих уроков, которые нужно знать
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  completed: boolean;
  progress: number; // 0-100
}

interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
  level: 'beginner' | 'intermediate' | 'advanced';
  skillLevel: number; // 1-10
  duration: number; // общее время в часах
  learningPath: string[]; // рекомендуемая последовательность модулей и уроков
  adaptivePath: string[]; // персонализированная последовательность
}

interface UserProfile {
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading-writing';
  strengths: string[];
  weaknesses: string[];
  preferredPace: 'slow' | 'medium' | 'fast';
  background: string[];
  goals: string[];
  interests: string[];
}

interface AIAssistant {
  name: string;
  avatar: string;
  specialty: string;
  personality: string;
  messages: AIMessage[];
}

interface AIMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: Date;
  type: 'tip' | 'question' | 'answer' | 'error' | 'success' | 'info';
  relatedConceptId?: string;
}

// Примеры данных (в реальном приложении это было бы из API)
const SAMPLE_COURSE: Course = {
  id: "python-for-ai-beginners",
  title: "Python для начинающих в AI",
  description: "Курс знакомит с основами программирования на Python, библиотеками для анализа данных и простыми алгоритмами машинного обучения. Этот курс разработан специально для новичков без опыта программирования.",
  level: "beginner",
  skillLevel: 1,
  duration: 20, // часов
  modules: [
    {
      id: "m1",
      title: "Введение в Python",
      description: "Основы синтаксиса, типы данных и простые операции в Python",
      completed: false,
      progress: 0,
      lessons: [
        {
          id: "m1l1",
          title: "Что такое Python и почему он важен для AI",
          type: "text",
          duration: 15,
          difficulty: 1,
          completed: false,
          progress: 0,
          concepts: ["python", "history", "applications"],
          prerequisites: []
        },
        {
          id: "m1l2",
          title: "Установка Python и первая программа",
          type: "video",
          duration: 20,
          difficulty: 1,
          completed: false,
          progress: 0,
          concepts: ["installation", "IDE", "hello-world"],
          prerequisites: ["m1l1"]
        },
        {
          id: "m1l3",
          title: "Переменные и типы данных",
          type: "interactive",
          duration: 30,
          difficulty: 2,
          completed: false,
          progress: 0,
          concepts: ["variables", "data-types", "casting"],
          prerequisites: ["m1l2"]
        },
        {
          id: "m1l4",
          title: "Базовые операции и выражения",
          type: "interactive",
          duration: 25,
          difficulty: 2,
          completed: false,
          progress: 0,
          concepts: ["operators", "expressions", "order-of-operations"],
          prerequisites: ["m1l3"]
        },
        {
          id: "m1l5",
          title: "Проверка знаний: основы Python",
          type: "quiz",
          duration: 15,
          difficulty: 2,
          completed: false,
          progress: 0,
          concepts: ["assessment", "basics-recap"],
          prerequisites: ["m1l1", "m1l2", "m1l3", "m1l4"]
        }
      ]
    },
    {
      id: "m2",
      title: "Управляющие конструкции",
      description: "Условные операторы, циклы и управление потоком выполнения программы",
      completed: false,
      progress: 0,
      lessons: [
        {
          id: "m2l1",
          title: "Условные операторы: if, elif, else",
          type: "text",
          duration: 20,
          difficulty: 2,
          completed: false,
          progress: 0,
          concepts: ["conditionals", "boolean-logic", "comparison-operators"],
          prerequisites: ["m1l5"]
        },
        {
          id: "m2l2",
          title: "Циклы: for и while",
          type: "interactive",
          duration: 30,
          difficulty: 2,
          completed: false,
          progress: 0,
          concepts: ["loops", "iteration", "break-continue"],
          prerequisites: ["m2l1"]
        },
        {
          id: "m2l3",
          title: "Обработка исключений: try/except",
          type: "video",
          duration: 25,
          difficulty: 3,
          completed: false,
          progress: 0,
          concepts: ["exceptions", "error-handling", "debugging"],
          prerequisites: ["m2l2"]
        },
        {
          id: "m2l4",
          title: "Практика: создание простой игры-викторины",
          type: "interactive",
          duration: 45,
          difficulty: 3,
          completed: false,
          progress: 0,
          concepts: ["project", "application", "integration"],
          prerequisites: ["m2l1", "m2l2", "m2l3"]
        }
      ]
    },
    {
      id: "m3",
      title: "Функции и модули",
      description: "Создание и использование функций, структурирование кода",
      completed: false,
      progress: 0,
      lessons: [
        {
          id: "m3l1",
          title: "Определение и вызов функций",
          type: "text",
          duration: 25,
          difficulty: 2,
          completed: false,
          progress: 0,
          concepts: ["functions", "parameters", "return-values"],
          prerequisites: ["m2l4"]
        },
        {
          id: "m3l2",
          title: "Аргументы функций и область видимости",
          type: "interactive",
          duration: 30,
          difficulty: 3,
          completed: false,
          progress: 0,
          concepts: ["args", "kwargs", "scope", "namespaces"],
          prerequisites: ["m3l1"]
        },
        {
          id: "m3l3",
          title: "Модули и пакеты",
          type: "video",
          duration: 25,
          difficulty: 2,
          completed: false,
          progress: 0,
          concepts: ["modules", "imports", "packages", "pip"],
          prerequisites: ["m3l2"]
        },
        {
          id: "m3l4",
          title: "Создание собственного модуля",
          type: "interactive",
          duration: 40,
          difficulty: 3,
          completed: false,
          progress: 0,
          concepts: ["module-creation", "distribution", "documentation"],
          prerequisites: ["m3l3"]
        },
        {
          id: "m3l5",
          title: "Финальный проект: анализатор текста",
          type: "interactive",
          duration: 60,
          difficulty: 3,
          completed: false,
          progress: 0,
          concepts: ["project", "text-analysis", "package-usage"],
          prerequisites: ["m3l1", "m3l2", "m3l3", "m3l4"]
        }
      ]
    }
  ],
  learningPath: [
    "m1l1", "m1l2", "m1l3", "m1l4", "m1l5", 
    "m2l1", "m2l2", "m2l3", "m2l4",
    "m3l1", "m3l2", "m3l3", "m3l4", "m3l5"
  ],
  adaptivePath: [] // будет заполнено AI на основе профиля пользователя
};

const SAMPLE_USER_PROFILE: UserProfile = {
  learningStyle: 'visual',
  strengths: ['visual-learning', 'pattern-recognition'],
  weaknesses: ['abstract-concepts', 'mathematical-notation'],
  preferredPace: 'medium',
  background: ['high-school-math', 'basic-computer-usage'],
  goals: ['career-change', 'data-science-basics'],
  interests: ['automation', 'data-analysis', 'ai-applications']
};

const NOVA_ASSISTANT: AIAssistant = {
  name: "NOVA",
  avatar: "👩‍🚀",
  specialty: "Python и основы AI",
  personality: "дружелюбная, поддерживающая, терпеливая",
  messages: [
    {
      id: "welcome-1",
      sender: "ai",
      text: "Привет! Я NOVA, твой ИИ-ассистент в изучении основ Python и AI. Я буду помогать тебе на протяжении всего курса. Какой у тебя опыт в программировании?",
      timestamp: new Date(),
      type: "info"
    }
  ]
};

const CODING_MENTOR: AIAssistant = {
  name: "CodeMaster",
  avatar: "👨‍💻",
  specialty: "Программирование и отладка",
  personality: "технический, точный, подробный",
  messages: [
    {
      id: "coding-welcome-1",
      sender: "ai",
      text: "Привет! Я CodeMaster, твой ментор по программированию. Я буду помогать с практическими заданиями и отладкой кода. Обращайся, когда столкнешься с трудностями в коде.",
      timestamp: new Date(),
      type: "info"
    }
  ]
};

const CONCEPT_TUTOR: AIAssistant = {
  name: "Профессор",
  avatar: "🧠",
  specialty: "Теоретические концепции и объяснения",
  personality: "аналитический, глубокий, использует аналогии",
  messages: [
    {
      id: "concept-welcome-1",
      sender: "ai",
      text: "Здравствуй, я Профессор. Моя роль — помогать тебе понять сложные теоретические концепции. Я объясню любую идею простыми словами и приведу наглядные примеры.",
      timestamp: new Date(),
      type: "info"
    }
  ]
};

// Генерация персонализированного пути обучения с помощью ИИ
const generateAdaptivePath = (course: Course, userProfile: UserProfile) => {
  // Здесь в реальном приложении был бы вызов OpenAI API
  // Для демонстрации просто вернем базовый путь
  return [...course.learningPath];
};

// Основной компонент страницы курса
export default function CourseAI() {
  // В реальном приложении мы бы получали id курса из URL
  const params = useParams<{ courseId: string }>();
  const courseId = params?.courseId || "python-for-ai-beginners";
  const [, setLocation] = useLocation();
  
  // State для хранения данных
  const [course, setCourse] = useState<Course>(SAMPLE_COURSE);
  const [userProfile, setUserProfile] = useState<UserProfile>(SAMPLE_USER_PROFILE);
  const [currentAssistant, setCurrentAssistant] = useState<AIAssistant>(NOVA_ASSISTANT);
  const [availableAssistants, setAvailableAssistants] = useState<AIAssistant[]>(
    [NOVA_ASSISTANT, CODING_MENTOR, CONCEPT_TUTOR]
  );
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'content' | 'assistant' | 'resources'>('content');
  
  // Функция возврата в каталог курсов
  const goToCoursesCatalog = () => {
    setLocation("/courses");
  };
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showLessonComplete, setShowLessonComplete] = useState(false);
  const [hasOpenAIKey, setHasOpenAIKey] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Прокрутка чата вниз при новых сообщениях
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentAssistant.messages]);

  // Проверка наличия API ключа OpenAI
  useEffect(() => {
    const checkAPIKey = async () => {
      const result = await check_secrets(['OPENAI_API_KEY']);
      setHasOpenAIKey(result.includes('OPENAI_API_KEY'));
      
      if (!result.includes('OPENAI_API_KEY')) {
        toast({
          title: "Требуется API ключ OpenAI",
          description: "Для полной функциональности ИИ-ассистентов необходим OpenAI API ключ",
          variant: "destructive"
        });
      }
    };
    
    checkAPIKey();
  }, [toast]);

  // Генерация адаптивного пути при загрузке
  useEffect(() => {
    if (course && userProfile) {
      const adaptivePath = generateAdaptivePath(course, userProfile);
      setCourse(prev => ({...prev, adaptivePath}));
    }
  }, []);

  // Обработка отправки сообщения ассистенту
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    
    // Добавляем сообщение пользователя
    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userInput,
      timestamp: new Date(),
      type: 'question'
    };
    
    setCurrentAssistant(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage]
    }));
    
    setUserInput("");
    setIsTyping(true);
    
    // Здесь будет обработка с помощью OpenAI
    setTimeout(() => {
      let aiResponse: AIMessage;
      
      if (hasOpenAIKey) {
        // В реальном приложении здесь был бы вызов API OpenAI
        // Имитируем ответ для демонстрации
        aiResponse = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: generateSampleResponse(userInput, currentAssistant.name),
          timestamp: new Date(),
          type: 'answer'
        };
      } else {
        // Ответ без AI
        aiResponse = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: "Для получения персонализированных ответов на ваши вопросы требуется OpenAI API ключ. Пока я могу предложить только базовые подсказки по текущему уроку.",
          timestamp: new Date(),
          type: 'info'
        };
      }
      
      setCurrentAssistant(prev => ({
        ...prev,
        messages: [...prev.messages, aiResponse]
      }));
      
      setIsTyping(false);
    }, 1500);
  };

  // Простая функция генерации ответов для демонстрации
  const generateSampleResponse = (input: string, assistantName: string) => {
    const lowercaseInput = input.toLowerCase();
    
    if (lowercaseInput.includes("привет") || lowercaseInput.includes("здравствуй")) {
      return `Привет! Я ${assistantName}. Чем я могу помочь тебе в изучении курса?`;
    }
    
    if (lowercaseInput.includes("трудно") || lowercaseInput.includes("сложно") || lowercaseInput.includes("не понимаю")) {
      return "Это нормально испытывать трудности при изучении нового материала. Давай разберем проблему по шагам. Что именно вызывает затруднение?";
    }
    
    if (lowercaseInput.includes("python") || lowercaseInput.includes("питон")) {
      return "Python - это мощный, но при этом доступный для новичков язык программирования. Он широко используется в AI и data science благодаря большому количеству специализированных библиотек.";
    }
    
    if (lowercaseInput.includes("функци")) {
      return "Функции в Python - это блоки кода, которые выполняются только при их вызове. Они позволяют структурировать код и избежать повторений. Пример простой функции: \n\n```python\ndef greet(name):\n    return f'Привет, {name}!'\n\nprint(greet('Андрей'))\n```";
    }
    
    if (lowercaseInput.includes("переменн")) {
      return "Переменные в Python создаются при первом присваивании значения. Например: `x = 5` создаст переменную x со значением 5. Python автоматически определяет тип данных.";
    }
    
    if (lowercaseInput.includes("цикл")) {
      return "В Python есть два основных типа циклов: for и while. Цикл for используется для итерации по последовательности (список, кортеж, строка), а while выполняется, пока условие истинно. Пример for-цикла: \n\n```python\nfor i in range(5):\n    print(i)  # Выведет числа от 0 до 4\n```";
    }
    
    // Общий ответ, если ничего не подошло
    return "Интересный вопрос! Давайте разберемся в этом подробнее. Можешь уточнить, что именно тебя интересует в контексте текущего урока?";
  };

  // Обработчик переключения между ассистентами
  const switchAssistant = (assistant: AIAssistant) => {
    setCurrentAssistant(assistant);
  };

  // Обработчик завершения урока
  const completeLesson = () => {
    const updatedCourse = {...course};
    const currentModule = updatedCourse.modules[currentModuleIndex];
    const currentLesson = currentModule.lessons[currentLessonIndex];
    
    // Отмечаем урок как завершенный
    currentLesson.completed = true;
    currentLesson.progress = 100;
    
    // Обновляем прогресс модуля
    const completedLessonsCount = currentModule.lessons.filter(l => l.completed).length;
    currentModule.progress = Math.round((completedLessonsCount / currentModule.lessons.length) * 100);
    
    // Если все уроки в модуле выполнены, отмечаем модуль как завершенный
    if (completedLessonsCount === currentModule.lessons.length) {
      currentModule.completed = true;
    }
    
    setCourse(updatedCourse);
    setShowLessonComplete(true);
    
    // Добавляем сообщение от ассистента
    const aiMessage: AIMessage = {
      id: `completion-${Date.now()}`,
      sender: 'ai',
      text: `Отлично! Вы завершили урок "${currentLesson.title}". Готовы двигаться дальше?`,
      timestamp: new Date(),
      type: 'success'
    };
    
    setCurrentAssistant(prev => ({
      ...prev,
      messages: [...prev.messages, aiMessage]
    }));
  };

  // Переход к следующему уроку
  const goToNextLesson = () => {
    const currentModule = course.modules[currentModuleIndex];
    
    if (currentLessonIndex < currentModule.lessons.length - 1) {
      // Переход к следующему уроку в том же модуле
      setCurrentLessonIndex(currentLessonIndex + 1);
    } else if (currentModuleIndex < course.modules.length - 1) {
      // Переход к первому уроку следующего модуля
      setCurrentModuleIndex(currentModuleIndex + 1);
      setCurrentLessonIndex(0);
    } else {
      // Курс завершен
      toast({
        title: "Поздравляем!",
        description: "Вы завершили весь курс!",
        variant: "default"
      });
    }
    
    setShowLessonComplete(false);
    setActiveTab('content'); // Возвращаемся к содержимому урока
  };

  // Получение данных о текущем уроке
  const getCurrentLesson = (): Lesson | null => {
    if (!course || 
        !course.modules[currentModuleIndex] || 
        !course.modules[currentModuleIndex].lessons[currentLessonIndex]) {
      return null;
    }
    
    return course.modules[currentModuleIndex].lessons[currentLessonIndex];
  };

  // Отображение содержимого урока
  const renderLessonContent = (lesson: Lesson) => {
    switch (lesson.type) {
      case 'text':
        return (
          <div className="prose prose-invert max-w-none">
            <h2>Что такое Python и почему он важен для AI</h2>
            <p>Python — это интерпретируемый, высокоуровневый, универсальный язык программирования, который стал стандартом в области искусственного интеллекта, машинного обучения и анализа данных. Он был создан Гвидо ван Россумом в 1991 году и с тех пор приобрел огромную популярность благодаря своей простоте, читаемости и обширной экосистеме библиотек.</p>
            
            <h3>Почему Python стал ключевым языком для AI?</h3>
            <ol>
              <li><strong>Простота и удобочитаемость</strong> — Python имеет чистый и интуитивно понятный синтаксис, что делает его идеальным языком для быстрого прототипирования алгоритмов машинного обучения.</li>
              <li><strong>Богатая экосистема библиотек</strong> — NumPy, Pandas, TensorFlow, PyTorch, scikit-learn и многие другие библиотеки предоставляют готовые инструменты для работы с данными и создания моделей.</li>
              <li><strong>Широкое сообщество</strong> — огромное количество разработчиков и исследователей используют Python, что обеспечивает обширную документацию, учебные материалы и поддержку.</li>
              <li><strong>Гибкость</strong> — Python можно использовать для самых разных задач: от анализа данных до веб-разработки и создания компьютерных игр.</li>
            </ol>
            
            <h3>Применение Python в AI и Data Science:</h3>
            <ul>
              <li>Обработка и анализ больших объемов данных</li>
              <li>Создание и обучение моделей машинного обучения</li>
              <li>Разработка нейронных сетей для компьютерного зрения и обработки естественного языка</li>
              <li>Автоматизация процессов и создание интеллектуальных агентов</li>
              <li>Визуализация данных для принятия решений</li>
            </ul>
            
            <p>В этом курсе мы начнем с самых основ Python, постепенно переходя к его применению в контексте AI и машинного обучения.</p>
          </div>
        );
      
      case 'video':
        return (
          <div className="flex flex-col space-y-4">
            <div className="aspect-video bg-space-800 rounded-lg flex items-center justify-center">
              <div className="text-center p-8">
                <i className="fas fa-play-circle text-6xl text-primary/70 mb-4"></i>
                <p className="text-white/70">Видео будет доступно после загрузки</p>
              </div>
            </div>
            <div className="prose prose-invert max-w-none">
              <h3>Основные моменты из видео:</h3>
              <ul>
                <li>Установка Python с официального сайта python.org</li>
                <li>Настройка среды разработки (IDE) – PyCharm или VS Code</li>
                <li>Запуск Python из командной строки</li>
                <li>Написание и запуск первой программы "Hello, World!"</li>
                <li>Использование Python в режиме интерактивной консоли</li>
              </ul>
            </div>
          </div>
        );
      
      case 'interactive':
        return (
          <div className="flex flex-col space-y-6">
            <div className="prose prose-invert max-w-none">
              <h2>Переменные и типы данных</h2>
              <p>В Python переменные создаются в момент первого присваивания значения. Тип данных определяется автоматически на основе присваиваемого значения.</p>
              
              <h3>Основные типы данных:</h3>
              <ul>
                <li><strong>int</strong> - целые числа (например, 5, -10)</li>
                <li><strong>float</strong> - числа с плавающей точкой (например, 3.14, -0.001)</li>
                <li><strong>str</strong> - строки текста (например, "Привет, мир!")</li>
                <li><strong>bool</strong> - логические значения (True или False)</li>
                <li><strong>list</strong> - списки (например, [1, 2, 3])</li>
                <li><strong>dict</strong> - словари (например, {`{"name": "Anna"}`})</li>
              </ul>
            </div>
            
            <div className="bg-space-900 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Интерактивный редактор кода</h3>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-space-700 hover:bg-space-600 rounded-md text-sm transition">
                    Запустить
                  </button>
                  <button className="px-3 py-1 bg-primary/20 hover:bg-primary/30 text-primary-foreground rounded-md text-sm transition">
                    Подсказка
                  </button>
                </div>
              </div>
              
              <div className="font-mono text-sm bg-space-950 p-4 rounded-md h-64 overflow-y-auto">
                <div className="text-gray-400"># Попробуйте создать разные типы переменных</div>
                <div className="text-white">
                  <div>number = 42</div>
                  <div>pi = 3.1415</div>
                  <div>name = "Python"</div>
                  <div>is_awesome = True</div>
                  <div>fruits = ["apple", "banana", "cherry"]</div>
                  <div>person = {`{"name": "Анна", "age": 25}`}</div>
                  <div> </div>
                  <div># Выведите типы переменных, используя функцию type()</div>
                  <div>print(type(number))</div>
                  <div>print(type(pi))</div>
                  <div>print(type(name))</div>
                  <div>print(type(is_awesome))</div>
                  <div>print(type(fruits))</div>
                  <div>print(type(person))</div>
                </div>
              </div>
            </div>
            
            <div className="bg-space-900 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Задание:</h3>
              <p className="mb-3">Создайте разные переменные для хранения информации о студенте: имя, возраст, средний балл и список изучаемых предметов.</p>
              
              <div className="font-mono text-sm bg-space-950 p-4 rounded-md h-40 overflow-y-auto">
                <div className="text-gray-400"># Создайте переменные для информации о студенте</div>
                <div className="text-white">
                  <div>student_name = </div>
                  <div>student_age = </div>
                  <div>gpa = </div>
                  <div>subjects = </div>
                  <div> </div>
                  <div># Выведите эту информацию в одно предложение, используя f-строки</div>
                  <div>print(f"...")</div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'quiz':
        return (
          <div className="flex flex-col space-y-6">
            <div className="prose prose-invert max-w-none">
              <h2>Проверка знаний: основы Python</h2>
              <p>Ответьте на следующие вопросы, чтобы проверить свое понимание основ Python.</p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-space-900 rounded-lg p-4">
                <h3 className="font-medium mb-3">1. Какой из следующих вариантов является правильным способом создания переменной в Python?</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="q1a" name="q1" className="w-4 h-4" />
                    <label htmlFor="q1a">var x = 10;</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="q1b" name="q1" className="w-4 h-4" />
                    <label htmlFor="q1b">x := 10</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="q1c" name="q1" className="w-4 h-4" />
                    <label htmlFor="q1c">x = 10</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="q1d" name="q1" className="w-4 h-4" />
                    <label htmlFor="q1d">let x = 10</label>
                  </div>
                </div>
              </div>
              
              <div className="bg-space-900 rounded-lg p-4">
                <h3 className="font-medium mb-3">2. Какой тип данных будет иметь переменная x после выполнения кода: x = 5 / 2?</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="q2a" name="q2" className="w-4 h-4" />
                    <label htmlFor="q2a">int</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="q2b" name="q2" className="w-4 h-4" />
                    <label htmlFor="q2b">float</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="q2c" name="q2" className="w-4 h-4" />
                    <label htmlFor="q2c">str</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="q2d" name="q2" className="w-4 h-4" />
                    <label htmlFor="q2d">bool</label>
                  </div>
                </div>
              </div>
              
              <div className="bg-space-900 rounded-lg p-4">
                <h3 className="font-medium mb-3">3. Какой результат выполнения следующего кода?</h3>
                <pre className="bg-space-950 p-3 rounded-md mb-3 overflow-x-auto">
                  <code>
                    fruits = ["apple", "banana", "cherry"] <br/>
                    print(fruits[1])
                  </code>
                </pre>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="q3a" name="q3" className="w-4 h-4" />
                    <label htmlFor="q3a">apple</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="q3b" name="q3" className="w-4 h-4" />
                    <label htmlFor="q3b">banana</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="q3c" name="q3" className="w-4 h-4" />
                    <label htmlFor="q3c">cherry</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="q3d" name="q3" className="w-4 h-4" />
                    <label htmlFor="q3d">Ошибка выполнения</label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={completeLesson}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition"
              >
                Проверить ответы
              </button>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="text-center py-8">
            <p className="text-white/70">Содержимое урока загружается...</p>
          </div>
        );
    }
  };

  // Отображение информации о текущем уроке
  const renderLessonInfo = (lesson: Lesson) => {
    const lessonTypeIcon = {
      'video': 'fa-video',
      'text': 'fa-file-alt',
      'quiz': 'fa-tasks',
      'interactive': 'fa-laptop-code'
    }[lesson.type];
    
    const difficultyText = {
      1: 'Начальный',
      2: 'Средний',
      3: 'Продвинутый'
    }[lesson.difficulty];
    
    return (
      <div className="flex items-center justify-between bg-space-900/70 rounded-lg p-3 mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-space-800 flex items-center justify-center mr-3">
            <i className={`fas ${lessonTypeIcon} text-primary/70`}></i>
          </div>
          <div>
            <div className="text-sm text-white/50">Тип урока</div>
            <div className="font-medium capitalize">
              {lesson.type === 'video' ? 'Видео' : 
               lesson.type === 'text' ? 'Текст' : 
               lesson.type === 'quiz' ? 'Тест' : 
               'Интерактивный'}
            </div>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-space-800 flex items-center justify-center mr-3">
            <i className="fas fa-clock text-secondary/70"></i>
          </div>
          <div>
            <div className="text-sm text-white/50">Длительность</div>
            <div className="font-medium">{lesson.duration} мин.</div>
          </div>
        </div>
        
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-space-800 flex items-center justify-center mr-3">
            <i className="fas fa-chart-line text-accent/70"></i>
          </div>
          <div>
            <div className="text-sm text-white/50">Сложность</div>
            <div className="font-medium">{difficultyText}</div>
          </div>
        </div>
      </div>
    );
  };

  // Рендер раздела модулей и уроков
  const renderModules = () => {
    return (
      <div className="bg-space-900 rounded-lg p-4 h-[calc(100vh-12rem)] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Содержание курса</h2>
        <div className="space-y-6">
          {course.modules.map((module, moduleIdx) => (
            <div key={module.id} className="space-y-2">
              <div 
                className={`font-medium py-2 px-3 rounded-lg flex items-center justify-between cursor-pointer ${
                  moduleIdx === currentModuleIndex ? 'bg-primary/20 text-primary' : 'hover:bg-space-800'
                }`}
                onClick={() => setCurrentModuleIndex(moduleIdx)}
              >
                <div className="flex items-center">
                  <div 
                    className={`w-6 h-6 rounded-full mr-2 flex items-center justify-center text-xs ${
                      module.completed ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/70'
                    }`}
                  >
                    {module.completed ? <i className="fas fa-check"></i> : moduleIdx + 1}
                  </div>
                  <span>{module.title}</span>
                </div>
                <div className="flex items-center">
                  <div className="text-xs text-white/50 mr-2">{module.progress}%</div>
                  <div className="w-12 h-1.5 bg-white/10 rounded-full">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${module.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {moduleIdx === currentModuleIndex && (
                <div className="pl-8 space-y-1">
                  {module.lessons.map((lesson, lessonIdx) => (
                    <div 
                      key={lesson.id}
                      className={`py-2 px-3 rounded-lg flex items-center text-sm cursor-pointer ${
                        lessonIdx === currentLessonIndex ? 'bg-space-700 text-white' : 'hover:bg-space-800/50 text-white/70'
                      }`}
                      onClick={() => setCurrentLessonIndex(lessonIdx)}
                    >
                      <div 
                        className={`w-5 h-5 rounded-full mr-2 flex items-center justify-center text-xs ${
                          lesson.completed ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/50'
                        }`}
                      >
                        {lesson.completed ? <i className="fas fa-check"></i> : lessonIdx + 1}
                      </div>
                      <span className="flex-1">{lesson.title}</span>
                      <span className="text-xs text-white/40">
                        {lesson.type === 'video' ? <i className="fas fa-video"></i> : 
                         lesson.type === 'text' ? <i className="fas fa-file-alt"></i> : 
                         lesson.type === 'quiz' ? <i className="fas fa-tasks"></i> : 
                         <i className="fas fa-laptop-code"></i>}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Главный интерфейс страницы курса
  return (
    <DashboardLayout title="" subtitle="">
      <div className="flex flex-col space-y-6">
        {/* Хлебные крошки и название курса */}
        <div>
          <div className="flex items-center text-sm text-white/50 mb-2">
            <span 
              className="hover:text-white cursor-pointer transition" 
              onClick={() => setLocation("/courses")}
            >
              Курсы
            </span>
            <i className="fas fa-chevron-right text-xs mx-2"></i>
            <span className="text-white">{course.title}</span>
          </div>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{course.title}</h1>
              <p className="text-white/70 mt-1 max-w-2xl">{course.description}</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={goToCoursesCatalog}
                className="flex items-center gap-2 bg-space-800 hover:bg-space-700 text-white px-3 py-2 rounded-lg transition-all"
              >
                <i className="fas fa-arrow-left"></i>
                <span>Вернуться к курсам</span>
              </button>
              
              <div className="flex items-center bg-space-900/70 rounded-lg px-3 py-1.5">
                <span 
                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                    course.level === 'beginner' ? 'bg-green-500/20 text-green-400' :
                    course.level === 'intermediate' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}
                >
                  {course.level === 'beginner' ? 'Начинающий' :
                   course.level === 'intermediate' ? 'Средний' : 'Продвинутый'}
                </span>
                <div className="mx-2 text-white/30">•</div>
                <span className="text-white/70 text-sm">{course.duration} часов</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Основной контент */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Левая колонка - модули курса */}
          <div className="lg:col-span-1">
            {renderModules()}
          </div>
          
          {/* Правая колонка - содержимое урока и ассистент */}
          <div className="lg:col-span-3">
            {/* Название текущего урока */}
            {getCurrentLesson() && (
              <div className="mb-4">
                <h2 className="text-xl font-semibold">
                  {course.modules[currentModuleIndex].title}: {getCurrentLesson()?.title}
                </h2>
              </div>
            )}
            
            {/* Вкладки */}
            <div className="flex border-b border-white/10 mb-6">
              <button 
                className={`py-2 px-4 text-sm font-medium ${activeTab === 'content' ? 'text-primary border-b-2 border-primary' : 'text-white/50 hover:text-white'}`}
                onClick={() => setActiveTab('content')}
              >
                <i className="fas fa-book-open mr-2"></i>
                Содержание урока
              </button>
              <button 
                className={`py-2 px-4 text-sm font-medium ${activeTab === 'assistant' ? 'text-primary border-b-2 border-primary' : 'text-white/50 hover:text-white'}`}
                onClick={() => setActiveTab('assistant')}
              >
                <i className="fas fa-robot mr-2"></i>
                AI-Ассистент
              </button>
              <button 
                className={`py-2 px-4 text-sm font-medium ${activeTab === 'resources' ? 'text-primary border-b-2 border-primary' : 'text-white/50 hover:text-white'}`}
                onClick={() => setActiveTab('resources')}
              >
                <i className="fas fa-link mr-2"></i>
                Дополнительные ресурсы
              </button>
            </div>
            
            {/* Контент выбранной вкладки */}
            <div className="bg-space-800/50 rounded-xl p-6">
              {activeTab === 'content' && getCurrentLesson() && (
                <div className="space-y-6">
                  {renderLessonInfo(getCurrentLesson()!)}
                  {renderLessonContent(getCurrentLesson()!)}
                  
                  <div className="flex justify-between mt-6">
                    <button 
                      className="px-4 py-2 bg-space-700 text-white/80 rounded-lg hover:bg-space-600 transition flex items-center"
                      onClick={() => {
                        if (currentLessonIndex > 0) {
                          setCurrentLessonIndex(currentLessonIndex - 1);
                        } else if (currentModuleIndex > 0) {
                          setCurrentModuleIndex(currentModuleIndex - 1);
                          setCurrentLessonIndex(course.modules[currentModuleIndex - 1].lessons.length - 1);
                        }
                      }}
                      disabled={currentModuleIndex === 0 && currentLessonIndex === 0}
                    >
                      <i className="fas fa-arrow-left mr-2"></i>
                      Предыдущий урок
                    </button>
                    
                    {!getCurrentLesson()?.completed ? (
                      <button 
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition"
                        onClick={completeLesson}
                      >
                        Завершить урок
                        <i className="fas fa-check ml-2"></i>
                      </button>
                    ) : (
                      <button 
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition flex items-center"
                        onClick={goToNextLesson}
                      >
                        Следующий урок
                        <i className="fas fa-arrow-right ml-2"></i>
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'assistant' && (
                <div className="space-y-4">
                  <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
                    {availableAssistants.map((assistant) => (
                      <button
                        key={assistant.name}
                        className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap flex items-center ${
                          currentAssistant.name === assistant.name
                            ? 'bg-primary/20 text-primary border border-primary/30'
                            : 'bg-space-700 text-white/70 hover:bg-space-600 border border-transparent'
                        }`}
                        onClick={() => switchAssistant(assistant)}
                      >
                        <span className="mr-1.5">{assistant.avatar}</span>
                        {assistant.name}
                      </button>
                    ))}
                  </div>
                  
                  <Glassmorphism className="p-4 rounded-xl h-96 flex flex-col">
                    <div className="flex items-center space-x-2 pb-3 border-b border-white/10 mb-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-lg">
                        {currentAssistant.avatar}
                      </div>
                      <div>
                        <div className="font-medium">{currentAssistant.name}</div>
                        <div className="text-xs text-white/50">{currentAssistant.specialty}</div>
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto mb-3 pr-2">
                      {currentAssistant.messages.map((msg) => (
                        <div 
                          key={msg.id} 
                          className={`mb-3 flex ${msg.sender === 'ai' ? 'justify-start' : 'justify-end'}`}
                        >
                          <div 
                            className={`max-w-[80%] rounded-xl p-3 ${
                              msg.sender === 'ai' 
                                ? 'bg-space-700 text-white rounded-tl-none' 
                                : 'bg-primary/20 text-white rounded-tr-none'
                            } ${
                              msg.type === 'error' ? 'bg-red-900/60 border border-red-500/50' :
                              msg.type === 'success' ? 'bg-green-900/60 border border-green-500/50' :
                              msg.type === 'info' ? 'bg-blue-900/60 border border-blue-500/50' : ''
                            }`}
                          >
                            <div className="whitespace-pre-wrap">{msg.text}</div>
                            <div className="text-right mt-1">
                              <span className="text-xs text-white/40">
                                {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {isTyping && (
                        <div className="flex justify-start mb-3">
                          <div className="bg-space-700 rounded-xl p-3 rounded-tl-none max-w-[80%]">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 rounded-full bg-white/50 animate-bounce"></div>
                              <div className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              <div className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div ref={messagesEndRef}></div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input 
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder={`Спросите ${currentAssistant.name} о чем угодно...`}
                        className="flex-1 bg-space-900 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                      />
                      <button 
                        onClick={handleSendMessage}
                        disabled={!userInput.trim()}
                        className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <i className="fas fa-paper-plane"></i>
                      </button>
                    </div>
                  </Glassmorphism>
                  
                  {!hasOpenAIKey && (
                    <div className="bg-amber-900/30 border border-amber-500/50 text-amber-200 p-3 rounded-lg text-sm">
                      <i className="fas fa-exclamation-triangle mr-2"></i>
                      Для персонализированных ответов от AI-ассистента требуется добавить OpenAI API ключ. Сейчас используются предварительно заготовленные ответы.
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'resources' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">Дополнительные ресурсы</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Glassmorphism className="p-4 rounded-xl">
                      <div className="flex items-start">
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
                          <i className="fas fa-book text-blue-400"></i>
                        </div>
                        <div>
                          <h4 className="font-medium">Официальная документация Python</h4>
                          <p className="text-sm text-white/70 mt-1">Полное руководство по языку Python со справочником и учебником</p>
                          <a href="https://docs.python.org/" target="_blank" rel="noopener noreferrer" className="text-primary text-sm flex items-center mt-2">
                            Открыть ресурс
                            <i className="fas fa-external-link-alt ml-1"></i>
                          </a>
                        </div>
                      </div>
                    </Glassmorphism>
                    
                    <Glassmorphism className="p-4 rounded-xl">
                      <div className="flex items-start">
                        <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mr-3">
                          <i className="fas fa-laptop-code text-green-400"></i>
                        </div>
                        <div>
                          <h4 className="font-medium">Python для Data Science</h4>
                          <p className="text-sm text-white/70 mt-1">Интерактивные учебники по использованию Python в анализе данных</p>
                          <a href="https://www.datacamp.com/courses/intro-to-python-for-data-science" target="_blank" rel="noopener noreferrer" className="text-primary text-sm flex items-center mt-2">
                            Открыть ресурс
                            <i className="fas fa-external-link-alt ml-1"></i>
                          </a>
                        </div>
                      </div>
                    </Glassmorphism>
                    
                    <Glassmorphism className="p-4 rounded-xl">
                      <div className="flex items-start">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mr-3">
                          <i className="fab fa-youtube text-purple-400"></i>
                        </div>
                        <div>
                          <h4 className="font-medium">Видеоуроки по Python</h4>
                          <p className="text-sm text-white/70 mt-1">Серия видеоуроков для начинающих программистов</p>
                          <a href="https://www.youtube.com/playlist?list=PL-osiE80TeTskrapNbzXhwoFUiLCjGgY7" target="_blank" rel="noopener noreferrer" className="text-primary text-sm flex items-center mt-2">
                            Открыть ресурс
                            <i className="fas fa-external-link-alt ml-1"></i>
                          </a>
                        </div>
                      </div>
                    </Glassmorphism>
                    
                    <Glassmorphism className="p-4 rounded-xl">
                      <div className="flex items-start">
                        <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center mr-3">
                          <i className="fas fa-code text-red-400"></i>
                        </div>
                        <div>
                          <h4 className="font-medium">Интерактивные задачи по Python</h4>
                          <p className="text-sm text-white/70 mt-1">Сборник упражнений для закрепления навыков программирования</p>
                          <a href="https://www.hackerrank.com/domains/python" target="_blank" rel="noopener noreferrer" className="text-primary text-sm flex items-center mt-2">
                            Открыть ресурс
                            <i className="fas fa-external-link-alt ml-1"></i>
                          </a>
                        </div>
                      </div>
                    </Glassmorphism>
                  </div>
                  
                  <Glassmorphism className="p-4 rounded-xl mt-6">
                    <h4 className="font-medium mb-3">Книги по Python для начинающих</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <i className="fas fa-book-open text-white/50 mr-2"></i>
                        <span>"Python. К вершинам мастерства" - Лучано Рамальо</span>
                      </li>
                      <li className="flex items-center">
                        <i className="fas fa-book-open text-white/50 mr-2"></i>
                        <span>"Изучаем Python" - Марк Лутц</span>
                      </li>
                      <li className="flex items-center">
                        <i className="fas fa-book-open text-white/50 mr-2"></i>
                        <span>"Python. Экспресс-курс" - Наоми Седер</span>
                      </li>
                      <li className="flex items-center">
                        <i className="fas fa-book-open text-white/50 mr-2"></i>
                        <span>"Грокаем алгоритмы" - Адитья Бхаргава</span>
                      </li>
                    </ul>
                  </Glassmorphism>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Модальное окно завершения урока */}
      <AnimatePresence>
        {showLessonComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-space-900 rounded-xl p-6 max-w-md w-full"
            >
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-check text-4xl"></i>
                </div>
                <h3 className="text-xl font-bold mb-2">Урок завершен!</h3>
                <p className="text-white/70 mb-6">
                  Вы успешно завершили урок "{getCurrentLesson()?.title}". Готовы двигаться дальше?
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowLessonComplete(false)}
                    className="flex-1 px-4 py-2 bg-space-700 text-white/80 rounded-lg hover:bg-space-600 transition"
                  >
                    Остаться
                  </button>
                  <button
                    onClick={goToNextLesson}
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition"
                  >
                    Следующий урок
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
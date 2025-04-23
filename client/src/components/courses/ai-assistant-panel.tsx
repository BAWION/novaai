import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { check_secrets } from "../../check-secrets";

interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: Date;
  type: "tip" | "question" | "answer" | "error" | "success" | "info";
  relatedConceptId?: string;
}

interface Assistant {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  personality: string;
  messages: ChatMessage[];
}

interface AIAssistantPanelProps {
  assistants: Assistant[];
  currentLessonId?: number;
  currentModuleId?: number;
  onAssistantRecommendation?: (lessonId: number) => void;
  className?: string;
}

export function AIAssistantPanel({
  assistants,
  currentLessonId,
  currentModuleId,
  onAssistantRecommendation,
  className,
}: AIAssistantPanelProps) {
  const [currentAssistant, setCurrentAssistant] = useState<Assistant>(assistants[0]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasOpenAIKey, setHasOpenAIKey] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Проверка наличия API ключа OpenAI
  useEffect(() => {
    const checkAPIKey = async () => {
      const result = await check_secrets(["OPENAI_API_KEY"]);
      setHasOpenAIKey(result.includes("OPENAI_API_KEY"));

      if (!result.includes("OPENAI_API_KEY")) {
        toast({
          title: "Требуется API ключ OpenAI",
          description: "Для полной функциональности ИИ-ассистентов необходим OpenAI API ключ",
          variant: "destructive",
        });
      }
    };

    checkAPIKey();
  }, [toast]);

  // Прокрутка чата вниз при новых сообщениях
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentAssistant.messages]);

  // Переключение ассистента
  const switchAssistant = (assistant: Assistant) => {
    setCurrentAssistant(assistant);
  };

  // Обработка отправки сообщения
  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    // Добавляем сообщение пользователя
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: userInput,
      timestamp: new Date(),
      type: "question",
    };

    const updatedAssistant = {
      ...currentAssistant,
      messages: [...currentAssistant.messages, userMessage],
    };

    setCurrentAssistant(updatedAssistant);
    setUserInput("");
    setIsTyping(true);

    try {
      // Формируем запрос к AI
      if (hasOpenAIKey) {
        // Имитация паузы перед ответом
        setTimeout(() => {
          // Здесь в реальном приложении был бы запрос к OpenAI API
          const aiResponse = generateSampleResponse(userInput, currentAssistant.name);
          
          const aiMessage: ChatMessage = {
            id: `ai-${Date.now()}`,
            sender: "ai",
            text: aiResponse,
            timestamp: new Date(),
            type: "answer",
          };

          setCurrentAssistant((prev) => ({
            ...prev,
            messages: [...prev.messages, aiMessage],
          }));

          setIsTyping(false);
        }, 1500);
      } else {
        // Ответ без AI
        setTimeout(() => {
          const aiMessage: ChatMessage = {
            id: `ai-${Date.now()}`,
            sender: "ai",
            text: "Для получения персонализированных ответов на ваши вопросы требуется OpenAI API ключ. Пока я могу предложить только базовые подсказки по текущему уроку.",
            timestamp: new Date(),
            type: "info",
          };

          setCurrentAssistant((prev) => ({
            ...prev,
            messages: [...prev.messages, aiMessage],
          }));

          setIsTyping(false);
        }, 1000);
      }
    } catch (error) {
      // Обработка ошибок
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: "ai",
        text: "Произошла ошибка при обработке запроса. Пожалуйста, попробуйте еще раз позже.",
        timestamp: new Date(),
        type: "error",
      };

      setCurrentAssistant((prev) => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
      }));

      setIsTyping(false);
    }
  };

  // Простая функция генерации ответов для демонстрации
  const generateSampleResponse = (input: string, assistantName: string) => {
    const lowercaseInput = input.toLowerCase();

    if (lowercaseInput.includes("привет") || lowercaseInput.includes("здравствуй")) {
      return `Привет! Я ${assistantName}. Чем я могу помочь тебе в изучении курса?`;
    }

    if (
      lowercaseInput.includes("трудно") ||
      lowercaseInput.includes("сложно") ||
      lowercaseInput.includes("не понимаю")
    ) {
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

  return (
    <div className={className}>
      {/* Переключатель ассистентов */}
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
        {assistants.map((assistant) => (
          <button
            key={assistant.id}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm whitespace-nowrap flex items-center",
              currentAssistant.id === assistant.id
                ? "bg-primary/20 text-primary border border-primary/30"
                : "bg-space-700 text-white/70 hover:bg-space-600 border border-transparent"
            )}
            onClick={() => switchAssistant(assistant)}
          >
            <span className="mr-1.5">{assistant.avatar}</span>
            {assistant.name}
          </button>
        ))}
      </div>

      {/* Интерфейс ассистента */}
      <Glassmorphism className="p-4 rounded-xl h-96 flex flex-col">
        {/* Информация об ассистенте */}
        <div className="flex items-center space-x-2 pb-3 border-b border-white/10 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-lg">
            {currentAssistant.avatar}
          </div>
          <div>
            <div className="font-medium">{currentAssistant.name}</div>
            <div className="text-xs text-white/50">{currentAssistant.specialty}</div>
          </div>
        </div>

        {/* Область сообщений */}
        <div className="flex-1 overflow-y-auto mb-3 pr-2 space-y-3">
          {/* Начальное сообщение, если чат пуст */}
          {currentAssistant.messages.length === 0 && (
            <div className="text-center text-white/50 py-8">
              <div className="text-4xl mb-2">{currentAssistant.avatar}</div>
              <p className="mb-2">
                Привет! Я {currentAssistant.name}, твой AI-ассистент в этом курсе.
              </p>
              <p className="text-sm">
                Задай мне вопрос о материале, и я помогу разобраться!
              </p>
            </div>
          )}

          {/* Список сообщений */}
          {currentAssistant.messages.map((msg) => (
            <div
              key={msg.id}
              className={cn("flex", msg.sender === "ai" ? "justify-start" : "justify-end")}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-xl p-3",
                  msg.sender === "ai"
                    ? "bg-space-700 text-white rounded-tl-none"
                    : "bg-primary/20 text-white rounded-tr-none",
                  msg.type === "error" ? "bg-red-900/60 border border-red-500/50" :
                  msg.type === "success" ? "bg-green-900/60 border border-green-500/50" :
                  msg.type === "info" ? "bg-blue-900/60 border border-blue-500/50" : ""
                )}
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

          {/* Индикатор набора текста */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-space-700 rounded-xl p-3 rounded-tl-none max-w-[80%]">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-white/50 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}

          {/* Маркер конца сообщений (для автоскролла) */}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Поле ввода сообщения */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
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

      {/* Уведомление о необходимости API ключа */}
      {!hasOpenAIKey && (
        <div className="bg-amber-900/30 border border-amber-500/50 text-amber-200 p-3 rounded-lg text-sm mt-4">
          <i className="fas fa-exclamation-triangle mr-2"></i>
          Для персонализированных ответов от AI-ассистента требуется добавить OpenAI API ключ. Сейчас используются предварительно заготовленные ответы.
        </div>
      )}
    </div>
  );
}
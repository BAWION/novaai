import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface NovaAssistantProps {
  defaultOpen?: boolean;
  context?: string;
  lessonId?: string;
}

export function NovaAssistant({ defaultOpen = false, context, lessonId }: NovaAssistantProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<{role: "assistant" | "user", content: string}[]>([
    {
      role: "assistant",
      content: "Привет! Я Орб - твой персональный ассистент в обучении. Если у тебя возникли вопросы по материалу, я помогу разобраться. Чем могу помочь?"
    }
  ]);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) return;
    
    // Добавляем вопрос пользователя в историю
    setConversation((prev) => [...prev, { role: "user", content: question }]);
    
    // Сохраняем вопрос и очищаем поле ввода
    const currentQuestion = question;
    setQuestion("");
    
    // Показываем состояние загрузки
    setIsLoading(true);
    
    try {
      // Симуляция запроса к API (в реальном приложении здесь будет настоящий запрос)
      setTimeout(() => {
        // Генерируем ответ на основе контекста урока
        let assistantResponse = "Извините, в данный момент я не могу ответить на этот вопрос.";
        
        if (currentQuestion.toLowerCase().includes("python")) {
          assistantResponse = "Python — это интерпретируемый язык программирования высокого уровня с простым синтаксисом. Он отлично подходит для начинающих и широко используется в машинном обучении, анализе данных и автоматизации. Что конкретно тебя интересует в Python?";
        } else if (currentQuestion.toLowerCase().includes("переменная") || currentQuestion.toLowerCase().includes("переменные")) {
          assistantResponse = "Переменная в программировании — это именованный контейнер для хранения данных. В Python ты создаешь переменную так: `имя_переменной = значение`. Например: `возраст = 16` или `имя = \"Даня\"`.";
        } else if (currentQuestion.toLowerCase().includes("print") || currentQuestion.toLowerCase().includes("вывод")) {
          assistantResponse = "Функция `print()` в Python используется для вывода информации на экран. Ты можешь выводить текст, переменные или их комбинацию. Например: `print(\"Привет\")` или `print(\"Меня зовут\", имя)`.";
        } else if (currentQuestion.toLowerCase().includes("комментарий") || currentQuestion.toLowerCase().includes("комментарии")) {
          assistantResponse = "Комментарии в Python начинаются с символа `#`. Всё, что следует за этим символом, игнорируется интерпретатором. Комментарии нужны для пояснения кода для людей. Например: `# Это комментарий`.";
        } else {
          // Общий ответ для других вопросов
          assistantResponse = "Интересный вопрос! Давай разберемся подробнее. " + 
            "В контексте текущего урока по основам Python, я могу помочь тебе с вопросами о переменных, функциях вывода, типах данных и простых операциях. " +
            "Попробуй задать более конкретный вопрос, связанный с материалом урока.";
        }
        
        // Добавляем ответ в историю
        setConversation((prev) => [...prev, { role: "assistant", content: assistantResponse }]);
        setIsLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error("Error fetching assistant response:", error);
      setIsLoading(false);
      toast({
        title: "Ошибка",
        description: "Не удалось получить ответ от ассистента",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {/* Кнопка вызова ассистента */}
      <motion.button
        className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-gradient-to-br from-[#6E3AFF] to-[#2EBAE1] flex items-center justify-center shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className={`fas ${isOpen ? "fa-times" : "fa-robot"} text-xl text-white`}></i>
      </motion.button>

      {/* Окно ассистента */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-30 w-[350px] max-h-[500px] overflow-hidden"
          >
            <Glassmorphism className="rounded-xl flex flex-col h-full">
              <div className="p-4 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6E3AFF] to-[#2EBAE1] flex items-center justify-center">
                    <i className="fas fa-robot text-white"></i>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-white">Орб</h3>
                    <p className="text-xs text-white/70">Твой ИИ-ассистент</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white/70 hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  <i className="fas fa-times"></i>
                </Button>
              </div>

              {/* Сообщения */}
              <div className="flex-1 overflow-y-auto p-4 max-h-[350px]">
                <div className="space-y-4">
                  {conversation.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`rounded-lg px-4 py-2 max-w-[80%] ${
                          message.role === "user"
                            ? "bg-primary text-white"
                            : "bg-black/20 text-white"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Индикатор загрузки */}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="rounded-lg px-4 py-2 bg-black/20">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Форма отправки сообщения */}
              <form onSubmit={handleSubmit} className="p-3 border-t border-white/10">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Задайте вопрос..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                  <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
                    <i className="fas fa-paper-plane"></i>
                  </Button>
                </div>
              </form>
            </Glassmorphism>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
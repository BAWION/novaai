import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Bot, User, Sparkles, BrainCircuit, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
};

type AIAssistantProps = {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
};

/**
 * AI-ассистент, отображаемый в виде виджета чата
 */
export function AIAssistantWidget({ 
  collapsed = false,
  onToggleCollapse, 
  className 
}: AIAssistantProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [proactiveHint, setProactiveHint] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!collapsed);

  // Функция для добавления сообщения в чат
  const addMessage = (content: string, isUser: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  // Функция для отправки сообщения ассистенту
  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Добавляем сообщение пользователя в чат
    addMessage(inputValue, true);
    setInputValue("");
    setIsLoading(true);

    try {
      // Отправляем запрос к AI-ассистенту
      const response = await apiRequest("POST", "/api/ai-assistant/ask", {
        question: inputValue,
      });

      const data = await response.json();

      // Добавляем ответ ассистента в чат
      addMessage(data.response, false);
    } catch (error) {
      console.error("Ошибка при отправке запроса к AI-ассистенту:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось получить ответ от ассистента",
        variant: "destructive",
      });
      addMessage(
        "Извините, произошла ошибка при получении ответа. Пожалуйста, попробуйте позже.",
        false
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для получения проактивной подсказки
  const fetchProactiveHint = async () => {
    try {
      const response = await apiRequest("GET", "/api/ai-assistant/hint");
      const data = await response.json();
      setProactiveHint(data.hint);
    } catch (error) {
      console.error("Ошибка при получении подсказки:", error);
    }
  };

  // Прокрутка чата вниз при добавлении новых сообщений
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Получаем проактивную подсказку при монтировании компонента
  useEffect(() => {
    if (user) {
      fetchProactiveHint();
    }
  }, [user]);

  // Обработка нажатия Enter для отправки сообщения
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Переключение состояния сворачивания
  const toggleCollapse = () => {
    setIsExpanded(!isExpanded);
    if (onToggleCollapse) {
      onToggleCollapse();
    }
  };

  // Если нет пользователя, не показываем ассистента
  if (!user) {
    return null;
  }

  return (
    <Card className={cn("w-full max-w-md shadow-lg", className)}>
      <CardHeader className="flex flex-row items-center justify-between py-2 px-4 border-b">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
            <BrainCircuit className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-lg">AI-ассистент</CardTitle>
        </div>
        <Button size="sm" variant="ghost" onClick={toggleCollapse}>
          {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </Button>
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="p-0">
              {/* Проактивная подсказка */}
              {proactiveHint && messages.length === 0 && (
                <div className="p-4 bg-primary/5 border-b">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm">{proactiveHint}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Сообщения чата */}
              <div className="max-h-[350px] overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-10">
                    <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground text-sm">
                      Задайте вопрос AI-ассистенту, чтобы получить персонализированную помощь
                    </p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3",
                        message.isUser ? "justify-end" : "justify-start"
                      )}
                    >
                      {!message.isUser && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/ai-assistant-avatar.png" />
                          <AvatarFallback className="bg-primary/20">
                            <Bot className="h-4 w-4 text-primary" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          "rounded-lg p-3 max-w-[80%]",
                          message.isUser
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      {message.isUser && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-secondary">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            <CardFooter className="p-3 border-t">
              <div className="flex w-full items-center gap-2">
                <Textarea
                  placeholder="Введите ваш вопрос..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  rows={1}
                  className="min-h-[40px] resize-none"
                  disabled={isLoading}
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={!inputValue.trim() || isLoading}
                  size="sm"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Отправить"
                  )}
                </Button>
              </div>
            </CardFooter>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
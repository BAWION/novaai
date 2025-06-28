import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { useIsMobile } from "@/hooks/use-mobile";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AssistantChatProps {
  initialMessages?: Message[];
  onSendMessage?: (message: string) => Promise<void> | void;
  onRequestVoiceInput?: () => void;
  isLoading?: boolean;
  disableVoice?: boolean;
}

export function AssistantChat({
  initialMessages = [],
  onSendMessage,
  onRequestVoiceInput,
  isLoading = false,
  disableVoice = false,
}: AssistantChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const isMobile = useIsMobile();

  // Проверяем поддержку Web Speech API
  useEffect(() => {
    setIsSpeechSupported(
      'SpeechRecognition' in window || 
      'webkitSpeechRecognition' in window
    );
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim() && !isLoading) {
      const newMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: input.trim(),
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, newMessage]);
      onSendMessage && onSendMessage(input.trim());
      setInput("");
      
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  const handleVoiceInput = () => {
    setIsVoiceActive((prev) => !prev);
    onRequestVoiceInput && onRequestVoiceInput();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Мобильная версия использует плавающую кнопку и выдвигающееся снизу окно
  // Десктопная версия использует боковую панель
  return (
    <>
      {/* Кнопка чата (разная для мобильной и десктопной версии) */}
      {isMobile ? (
        <motion.button
          className="fixed bottom-20 right-4 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] shadow-lg flex items-center justify-center text-white"
          onClick={toggleChat}
          whileTap={{ scale: 0.9 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
        >
          <i className={`fas ${isOpen ? 'fa-times' : 'fa-robot'} text-xl`}></i>
        </motion.button>
      ) : (
        <motion.button
          className="fixed top-20 right-4 z-40 bg-space-800/80 backdrop-blur-md border border-white/10 hover:bg-space-700/80 rounded-l-lg p-3 text-white/80 hover:text-white"
          onClick={toggleChat}
          initial={{ x: 100 }}
          animate={{ x: isOpen ? 0 : 20 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <i className={`fas ${isOpen ? 'fa-chevron-right' : 'fa-robot'} text-lg`}></i>
        </motion.button>
      )}

      {/* Окно чата (разное для мобильной и десктопной версии) */}
      <AnimatePresence>
        {isOpen && (
          isMobile ? (
            // Мобильное окно чата (снизу экрана)
            <>
              <motion.div
                className="fixed inset-0 bg-black/60 z-40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
              />
              
              <motion.div
                className="fixed bottom-0 left-0 right-0 z-50 bg-space-800/95 backdrop-blur-lg border-t border-white/10 rounded-t-2xl"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
              >
                {/* Заголовок чата */}
                <div className="border-b border-white/10 p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] flex items-center justify-center">
                      <i className="fas fa-robot text-white"></i>
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium text-white">AI Ассистент</h3>
                      <p className="text-xs text-white/60">Задайте вопрос о вашем обучении</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-white/80"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                
                {/* Сообщения чата */}
                <div 
                  ref={chatRef}
                  className="p-4 h-[50vh] overflow-y-auto"
                >
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-3">
                        <i className="fas fa-robot text-white/30 text-2xl"></i>
                      </div>
                      <p className="text-white/50 max-w-md">
                        Задайте вопрос, и я помогу вам в обучении на NovaAI University.
                      </p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`mb-4 flex ${
                          msg.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div className={`max-w-[85%] ${msg.role === "user" ? "bg-[#6E3AFF]/20 border border-[#6E3AFF]/20" : "bg-white/10 border border-white/10"} rounded-xl p-3`}>
                          <div className="text-sm text-white/90">{msg.content}</div>
                          <div className="text-right mt-1 text-xs text-white/40">
                            {formatTime(msg.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  
                  {isLoading && (
                    <div className="flex justify-start mb-4">
                      <div className="bg-white/10 rounded-xl p-3 max-w-[85%] flex items-center">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                          <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                          <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Ввод сообщения */}
                <div className="p-3 border-t border-white/10 flex items-end gap-2">
                  <div className="flex-1 bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                    <textarea
                      ref={inputRef}
                      className="w-full bg-transparent text-white p-3 outline-none resize-none max-h-32"
                      placeholder="Введите сообщение..."
                      value={input}
                      onChange={(e) => {
                        setInput(e.target.value);
                        // Автоматическое изменение высоты textarea
                        e.target.style.height = "auto";
                        e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                      }}
                      onKeyDown={handleKeyDown}
                      disabled={isLoading}
                      rows={1}
                    />
                  </div>
                  
                  {!disableVoice && isSpeechSupported && (
                    <button
                      onClick={handleVoiceInput}
                      className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                        isVoiceActive 
                          ? "bg-red-500/20 text-red-400 border border-red-500/30" 
                          : "bg-white/10 text-white/70 border border-white/10"
                      }`}
                    >
                      <i className={`fas ${isVoiceActive ? 'fa-stop' : 'fa-microphone'}`}></i>
                    </button>
                  )}
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !input.trim()}
                    className={`h-12 w-12 flex items-center justify-center rounded-lg 
                      ${
                        input.trim() && !isLoading
                          ? "bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] text-white"
                          : "bg-white/10 text-white/30"
                      }`}
                  >
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </motion.div>
            </>
          ) : (
            // Десктопное окно чата (справа)
            <motion.div
              className="fixed top-16 bottom-4 right-4 z-40 w-96 flex flex-col"
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <Glassmorphism className="w-full h-full flex flex-col rounded-xl overflow-hidden">
                {/* Заголовок чата */}
                <div className="border-b border-white/10 p-4 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] flex items-center justify-center">
                    <i className="fas fa-robot text-white"></i>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium text-white">AI Ассистент</h3>
                    <p className="text-xs text-white/60">Задайте вопрос о вашем обучении</p>
                  </div>
                </div>
                
                {/* Сообщения чата */}
                <div ref={chatRef} className="flex-1 p-4 overflow-y-auto">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-3">
                        <i className="fas fa-robot text-white/30 text-2xl"></i>
                      </div>
                      <p className="text-white/50 max-w-md">
                        Задайте вопрос, и я помогу вам в обучении на NovaAI University.
                      </p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`mb-4 flex ${
                          msg.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div className={`max-w-[85%] ${msg.role === "user" ? "bg-[#6E3AFF]/20 border border-[#6E3AFF]/20" : "bg-white/10 border border-white/10"} rounded-xl p-3`}>
                          <div className="text-sm text-white/90">{msg.content}</div>
                          <div className="text-right mt-1 text-xs text-white/40">
                            {formatTime(msg.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  
                  {isLoading && (
                    <div className="flex justify-start mb-4">
                      <div className="bg-white/10 rounded-xl p-3 max-w-[85%] flex items-center">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                          <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                          <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Ввод сообщения */}
                <div className="p-3 border-t border-white/10 flex items-end gap-2">
                  <div className="flex-1 bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                    <textarea
                      ref={inputRef}
                      className="w-full bg-transparent text-white p-3 outline-none resize-none max-h-32"
                      placeholder="Введите сообщение..."
                      value={input}
                      onChange={(e) => {
                        setInput(e.target.value);
                        // Автоматическое изменение высоты textarea
                        e.target.style.height = "auto";
                        e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                      }}
                      onKeyDown={handleKeyDown}
                      disabled={isLoading}
                      rows={1}
                    />
                  </div>
                  
                  {!disableVoice && isSpeechSupported && (
                    <button
                      onClick={handleVoiceInput}
                      className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        isVoiceActive 
                          ? "bg-red-500/20 text-red-400 border border-red-500/30" 
                          : "bg-white/10 text-white/70 border border-white/10"
                      }`}
                    >
                      <i className={`fas ${isVoiceActive ? 'fa-stop' : 'fa-microphone'}`}></i>
                    </button>
                  )}
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !input.trim()}
                    className={`h-10 w-10 flex items-center justify-center rounded-lg 
                      ${
                        input.trim() && !isLoading
                          ? "bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] text-white"
                          : "bg-white/10 text-white/30"
                      }`}
                  >
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </Glassmorphism>
            </motion.div>
          )
        )}
      </AnimatePresence>
    </>
  );
}
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, Bot, User, Lightbulb, MessageCircle, Brain, Zap, BookOpen } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  relatedTopics?: string[];
}

export function AiChat() {
  const isMobile = useIsMobile();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Привет! Я ваш ИИ-тьютор. Готов помочь с изучением искусственного интеллекта. О чем хотите узнать?',
      timestamp: new Date(),
      suggestions: isMobile ? [] : ['Что такое машинное обучение?', 'Как работают нейронные сети?']
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load initial suggestions
    loadSuggestions();
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const loadSuggestions = async () => {
    try {
      const response = await fetch('/api/ai-tutor/suggestions');
      const data = await response.json();
      if (data.success) {
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-tutor/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: content.trim(),
          context: {
            previousMessages: messages.slice(-3) // Send last 3 messages for context
          }
        })
      });
      
      const responseData = await response.json();

      if (responseData.success) {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: responseData.message,
          timestamp: new Date(),
          suggestions: responseData.suggestions,
          relatedTopics: responseData.relatedTopics
        };

        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(responseData.error || 'Failed to get AI response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Извините, произошла ошибка. Попробуйте переформулировать вопрос или обратиться позже.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const formatMessage = (content: string) => {
    // Simple formatting for better readability
    return content.split('\n').map((line, index) => (
      <div key={index} className={line.trim() === '' ? 'h-2' : ''}>
        {line}
      </div>
    ));
  };

  return (
    <Card className={`${isMobile ? 'h-[70vh]' : 'h-[600px]'} flex flex-col`}>
      <CardHeader className={`${isMobile ? 'pb-2 px-3 py-3' : 'pb-3'}`}>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-600" />
          <span className={isMobile ? 'text-lg' : ''}>ИИ-Тьютор</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className={`flex-1 flex flex-col ${isMobile ? 'p-3 pt-0' : 'p-4 pt-0'} overflow-hidden`}>
        {/* Messages */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 pr-4 mb-4">
          <div className="space-y-4 w-full">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 w-full max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-green-100 text-green-600'
                  }`}>
                    {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className={`rounded-lg p-3 w-full ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                        : 'bg-gradient-to-r from-gray-50 to-white text-gray-900 border border-gray-200 shadow-sm'
                    }`}>
                      <div className="text-sm whitespace-pre-wrap break-words word-wrap overflow-hidden">
                        {formatMessage(message.content)}
                      </div>
                      {message.type === 'ai' && !isMobile && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                          <Zap className="h-3 w-3" />
                          <span>Powered by AI</span>
                        </div>
                      )}
                    </div>
                    
                    {/* AI message suggestions and topics - упрощенные для мобильной версии */}
                    {message.type === 'ai' && (
                      <div className="space-y-2 min-w-0">
                        {message.suggestions && message.suggestions.length > 0 && !isMobile && (
                          <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Lightbulb className="h-4 w-4 text-yellow-600" />
                              <span className="text-sm font-medium text-yellow-800">Попробуйте спросить:</span>
                            </div>
                            <div className="flex flex-wrap gap-2 min-w-0">
                              {message.suggestions.map((suggestion, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="cursor-pointer hover:bg-yellow-100 hover:border-yellow-400 text-xs break-words max-w-full transition-colors border-yellow-300 text-yellow-900 bg-yellow-50"
                                  onClick={() => handleSuggestionClick(suggestion)}
                                >
                                  {suggestion}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {message.suggestions && message.suggestions.length > 0 && isMobile && (
                          <div className="flex flex-wrap gap-1 min-w-0">
                            {message.suggestions.slice(0, 2).map((suggestion, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="cursor-pointer hover:bg-blue-100 text-xs break-words max-w-full bg-blue-50 text-blue-700 border-blue-200"
                                onClick={() => handleSuggestionClick(suggestion)}
                              >
                                {suggestion}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start w-full">
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick suggestions */}
        {suggestions.length > 0 && messages.length === 1 && (
          <div className={`mb-4 ${
            isMobile 
              ? 'p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10' 
              : 'p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200'
          } min-w-0`}>
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle className={`h-4 w-4 ${isMobile ? 'text-white/80' : 'text-purple-600'}`} />
              <span className={`text-sm font-medium ${isMobile ? 'text-white' : 'text-purple-800'}`}>
                {isMobile ? 'Популярные вопросы:' : '🔥 Популярные вопросы:'}
              </span>
            </div>
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-1' : 'grid-cols-1 sm:grid-cols-2 gap-2'} min-w-0`}>
              {(isMobile ? suggestions.slice(0, 3) : suggestions).map((suggestion, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className={`cursor-pointer break-words max-w-full p-2 text-center transition-colors ${
                    isMobile 
                      ? 'hover:bg-white/20 border-white/30 text-white/90 bg-white/10 text-xs'
                      : 'hover:bg-purple-100 hover:border-purple-400 border-purple-300 text-purple-900 bg-purple-50'
                  }`}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t pt-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={isMobile ? "Спросите об ИИ..." : "💭 Спросите что-то интересное об ИИ..."}
                disabled={isLoading}
                className={`${isMobile ? '' : 'pr-10'} border-2 border-gray-200 focus:border-blue-400 transition-colors`}
              />
              {!isMobile && (
                <Brain className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              )}
            </div>
            <Button 
              type="submit" 
              disabled={isLoading || !inputValue.trim()}
              className={`transition-colors ${
                isMobile 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:scale-105'
              }`}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
          {!isMobile && (
            <div className="text-xs text-gray-500 mt-2 text-center">
              ✨ Powered by OpenAI GPT-4o | 🧠 Адаптивное обучение
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
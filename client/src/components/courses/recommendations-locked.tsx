import React from "react";
import { useLocation } from "wouter";
import { BookOpen, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RecommendationsLockedProps {
  className?: string;
}

/**
 * Компонент для отображения заблюренных рекомендаций курсов
 * Показывается, когда пользователь не прошел диагностику
 */
export function RecommendationsLocked({
  className = ""
}: RecommendationsLockedProps) {
  const [, setLocation] = useLocation();
  
  // Переход к диагностике
  const handleStartDiagnostics = () => {
    setLocation("/deep-diagnosis");
  };
  
  return (
    <Card className={`bg-space-800/70 border-blue-500/20 h-full ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Рекомендуемые курсы
          </div>
          <Badge 
            variant="outline" 
            className="bg-amber-500/20 border-amber-500/30 text-amber-300 text-xs"
          >
            Доступно после диагностики
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 relative">
        {/* Заблюренное содержимое */}
        <div className="backdrop-blur-sm absolute inset-0 z-10 flex flex-col items-center justify-center">
          <div className="bg-space-900/80 rounded-full p-4 mb-4 relative">
            <Lock className="h-10 w-10 text-[#6E3AFF]/70" />
          </div>
          
          <h3 className="text-white font-medium mb-2">
            Доступно после диагностики
          </h3>
          <p className="text-white/70 text-sm mb-5 max-w-xs text-center">
            Пройдите единую диагностику из 15 вопросов для получения персональных рекомендаций
          </p>
          
          <Button 
            variant="default" 
            className="bg-gradient-to-r from-[#6E3AFF] to-indigo-500 hover:from-[#6E3AFF]/90 hover:to-indigo-600"
            onClick={handleStartDiagnostics}
          >
            Пройти диагностику
          </Button>
        </div>
        
        {/* Размытое фоновое содержимое для эффекта blur */}
        <div className="filter blur-md opacity-30">
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="p-3 rounded-lg border-l-2 border-[#6E3AFF]/40 bg-space-900/50">
                <div className="flex">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <div className="h-5 bg-white/10 rounded w-1/3"></div>
                      <div className="px-2 py-0.5 bg-[#6E3AFF]/20 rounded-md w-20 h-4"></div>
                    </div>
                    <div className="h-4 bg-white/10 rounded mt-2"></div>
                    
                    <div className="mt-2 flex gap-4">
                      <div className="w-20 h-4 bg-white/10 rounded"></div>
                      <div className="w-20 h-4 bg-white/10 rounded"></div>
                      <div className="w-20 h-4 bg-white/10 rounded"></div>
                    </div>
                    
                    <div className="mt-2 h-12 rounded bg-[#6E3AFF]/10 p-1.5"></div>
                  </div>
                </div>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  <div className="px-2 py-1 bg-space-800/60 rounded-md w-16 h-5"></div>
                  <div className="px-2 py-1 bg-space-800/60 rounded-md w-24 h-5"></div>
                  <div className="px-2 py-1 bg-space-800/60 rounded-md w-20 h-5"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
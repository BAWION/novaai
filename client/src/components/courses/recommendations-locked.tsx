import React from "react";
import { useLocation } from "wouter";
import { Book, Lock } from "lucide-react";
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
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Book className="h-8 w-8 text-[#6E3AFF]" />
            <div className="text-2xl font-semibold text-white">Рекомендуемые курсы</div>
          </div>
          <Badge 
            variant="outline" 
            className="bg-amber-500/20 border-amber-500/30 text-amber-300 text-sm px-3 py-1"
          >
            Доступно после диагностики
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="relative p-0">
        <div className="flex flex-col items-center justify-center text-center pt-10 pb-14">
          <Lock className="h-16 w-16 text-[#6E3AFF] mb-6" />
          
          <h3 className="text-white text-xl font-medium mb-2">
            Доступно после диагностики
          </h3>
          <p className="text-white/70 text-base mb-8 max-w-sm text-center">
            Пройдите единую диагностику из 15 вопросов для получения персональных рекомендаций
          </p>
          
          <Button 
            variant="default" 
            size="lg"
            className="bg-gradient-to-r from-[#6E3AFF] to-indigo-500 hover:from-[#6E3AFF]/90 hover:to-indigo-600 px-8 py-6 text-base h-auto"
            onClick={handleStartDiagnostics}
          >
            Пройти диагностику
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
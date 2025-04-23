import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Book, CheckCircle2, Clock, BookOpen, BarChart } from "lucide-react";
import { formatDistance } from "date-fns";
import { ru } from "date-fns/locale";

interface LearningEvent {
  id: number;
  userId: number;
  eventType: string;
  entityType: string;
  entityId: number;
  data: any;
  duration: number | null;
  createdAt: string;
  sessionId: string | null;
}

interface LearningTimelineProps {
  userId?: number;
  limit?: number;
  showTitle?: boolean;
}

export default function LearningTimeline({
  userId,
  limit = 5,
  showTitle = true
}: LearningTimelineProps) {
  // Получение событий обучения
  const { data: events, isLoading } = useQuery<LearningEvent[]>({
    queryKey: ["/api/learning/timeline"],
    enabled: !!userId,
    placeholderData: []
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!events || events.length === 0) {
    return (
      <Card>
        <CardHeader>
          {showTitle && <CardTitle>Ваша активность</CardTitle>}
          <CardDescription>
            История вашего обучения появится здесь, когда вы начнете проходить курсы
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  // Сортировка событий по дате (от новых к старым) и ограничение количества
  const sortedEvents = [...events]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        {showTitle && <CardTitle>Ваша активность</CardTitle>}
        <CardDescription>
          История вашего обучения
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedEvents.map(event => (
            <div key={event.id} className="flex items-start space-x-3">
              <div className="mt-0.5">
                {getEventIcon(event.eventType)}
              </div>
              <div>
                <div className="font-medium text-sm">{getEventTitle(event)}</div>
                <div className="text-sm text-muted-foreground">
                  {formatDistance(new Date(event.createdAt), new Date(), { 
                    addSuffix: true,
                    locale: ru
                  })}
                  {event.duration && (
                    <span className="ml-2">• {formatDuration(event.duration)}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Вспомогательные функции
function getEventIcon(eventType: string) {
  switch (eventType) {
    case "lesson.view":
      return <BookOpen className="h-5 w-5 text-blue-500" />;
    case "lesson.complete":
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case "quiz.start":
      return <Book className="h-5 w-5 text-purple-500" />;
    case "quiz.submit":
      return <BarChart className="h-5 w-5 text-orange-500" />;
    default:
      return <Clock className="h-5 w-5 text-gray-500" />;
  }
}

function getEventTitle(event: LearningEvent): string {
  switch (event.eventType) {
    case "lesson.view":
      return `Просмотр урока #${event.entityId}`;
    case "lesson.complete":
      return `Завершен урок #${event.entityId}`;
    case "quiz.start":
      return `Начат тест #${event.entityId}`;
    case "quiz.submit":
      const score = event.data?.score || 0;
      const maxScore = event.data?.maxScore || 0;
      return `Выполнен тест #${event.entityId} (${score}/${maxScore} баллов)`;
    default:
      return `Событие обучения: ${event.eventType}`;
  }
}

function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} сек.`;
  }
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} мин.`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours} ч. ${remainingMinutes} мин.`;
}
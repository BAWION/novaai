import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle, Lightbulb, MessageSquare, Star, ThumbsDown, ThumbsUp } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

// Интерфейс для обратной связи
export interface FeedbackItem {
  id: string;
  type: "auto" | "instructor" | "ai"; // Тип обратной связи: автоматическая, от преподавателя, от ИИ
  content: string; // Содержание обратной связи
  rating?: number; // Оценка (от 1 до 5, если применимо)
  createdAt: Date; // Время создания
  suggestedImprovements?: string[]; // Предложения по улучшению
}

// Интерфейс отправки обратной связи
export interface SubmitFeedbackData {
  lessonId: number;
  assignmentId: string;
  userId: number;
  content: string;
  rating?: number;
  helpful?: boolean;
}

// Интерфейс свойств компонента
interface FeedbackSystemProps {
  feedbackItems: FeedbackItem[]; // Полученная обратная связь
  lessonId: number;
  assignmentId: string;
  userId: number;
  onSubmitFeedback?: (data: SubmitFeedbackData) => Promise<void>;
}

export function FeedbackSystem({
  feedbackItems,
  lessonId,
  assignmentId,
  userId,
  onSubmitFeedback,
}: FeedbackSystemProps) {
  const { toast } = useToast();
  const [feedbackContent, setFeedbackContent] = useState<string>("");
  const [rating, setRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [helpfulness, setHelpfulness] = useState<Record<string, boolean | null>>({});

  // Обработка отправки обратной связи
  const handleSubmitFeedback = async () => {
    if (!feedbackContent.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите текст обратной связи",
        variant: "destructive",
      });
      return;
    }

    if (onSubmitFeedback) {
      setIsSubmitting(true);
      try {
        await onSubmitFeedback({
          lessonId,
          assignmentId,
          userId,
          content: feedbackContent,
          rating,
          helpful: null,
        });
        
        toast({
          title: "Успешно",
          description: "Ваша обратная связь отправлена",
          variant: "default",
        });
        
        setFeedbackContent("");
        setRating(null);
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось отправить обратную связь. Пожалуйста, попробуйте позже.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Обработка оценки полезности обратной связи
  const handleHelpfulnessFeedback = (feedbackId: string, isHelpful: boolean) => {
    setHelpfulness({
      ...helpfulness,
      [feedbackId]: isHelpful,
    });
    
    toast({
      title: "Спасибо за оценку",
      description: `Вы отметили обратную связь как ${isHelpful ? "полезную" : "неполезную"}`,
      variant: "default",
    });
  };

  const renderTypeIcon = (type: FeedbackItem["type"]) => {
    switch (type) {
      case "auto":
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case "instructor":
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case "ai":
        return <Lightbulb className="h-5 w-5 text-purple-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Полученная обратная связь</h3>
        
        {feedbackItems.length === 0 ? (
          <Card className="bg-gray-50 dark:bg-zinc-900">
            <CardContent className="py-6">
              <div className="text-center text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto opacity-50" />
                <p className="mt-2">У вас пока нет обратной связи по этому заданию</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          feedbackItems.map((item) => (
            <Card key={item.id} className="bg-white dark:bg-zinc-800">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    {renderTypeIcon(item.type)}
                    <CardTitle className="text-base ml-2">
                      {item.type === "auto" ? "Автоматическая проверка" :
                       item.type === "instructor" ? "От преподавателя" :
                       "От ИИ-ассистента"}
                    </CardTitle>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Badge>
                </div>
                <CardDescription>
                  {item.rating && renderRatingStars(item.rating)}
                </CardDescription>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none dark:prose-invert pt-0">
                <ReactMarkdown>{item.content}</ReactMarkdown>
                
                {item.suggestedImprovements && item.suggestedImprovements.length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium">Предложения по улучшению:</p>
                    <ul className="pl-5 space-y-1 mt-1">
                      {item.suggestedImprovements.map((suggestion, index) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end pt-0">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground mr-1">Была ли полезна обратная связь?</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className={`${
                      helpfulness[item.id] === true ? "bg-green-100 dark:bg-green-900/20" : ""
                    }`}
                    onClick={() => handleHelpfulnessFeedback(item.id, true)}
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className={`${
                      helpfulness[item.id] === false ? "bg-red-100 dark:bg-red-900/20" : ""
                    }`}
                    onClick={() => handleHelpfulnessFeedback(item.id, false)}
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
      
      <Card className="bg-white dark:bg-zinc-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Оставить обратную связь</CardTitle>
          <CardDescription>
            Оставьте отзыв о задании или попросите дополнительную помощь
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <Textarea
            placeholder="Напишите свой отзыв или вопрос здесь..."
            className="min-h-32"
            value={feedbackContent}
            onChange={(e) => setFeedbackContent(e.target.value)}
          />
          
          <div>
            <h4 className="text-sm font-medium mb-2">Оцените сложность задания:</h4>
            <RadioGroup
              value={rating?.toString() || ""}
              onValueChange={(value) => setRating(parseInt(value, 10))}
              className="flex space-x-2"
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <div key={value} className="flex flex-col items-center">
                  <RadioGroupItem
                    value={value.toString()}
                    id={`rating-${value}`}
                    className="sr-only"
                  />
                  <Label
                    htmlFor={`rating-${value}`}
                    className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer ${
                      rating === value
                        ? "bg-primary text-primary-foreground"
                        : "border hover:bg-muted"
                    }`}
                  >
                    {value}
                  </Label>
                  <span className="text-xs mt-1">
                    {value === 1
                      ? "Очень легко"
                      : value === 2
                      ? "Легко"
                      : value === 3
                      ? "Средне"
                      : value === 4
                      ? "Сложно"
                      : "Очень сложно"}
                  </span>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="pt-2 border-t">
          <Button
            onClick={handleSubmitFeedback}
            disabled={!feedbackContent.trim() || isSubmitting}
            className="ml-auto"
          >
            {isSubmitting ? "Отправка..." : "Отправить отзыв"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
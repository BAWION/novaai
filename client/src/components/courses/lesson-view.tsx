import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Video, ArrowLeft, ArrowRight, CheckCircle, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { queryClient } from "@/lib/queryClient";

interface Lesson {
  id: number;
  title: string;
  description: string;
  content: string;
  type: string;
  orderIndex: number;
  moduleId: number;
  estimatedDuration: number;
  completed?: boolean;
  progress?: number;
}

interface Module {
  id: number;
  title: string;
  description: string;
  orderIndex: number;
  courseId: number;
  lessons: Lesson[];
}

interface LessonViewProps {
  lessonId: string | number;
  moduleId: string | number;
  courseSlug: string;
  onComplete?: (lessonId: number) => void;
}

export const LessonView: React.FC<LessonViewProps> = ({ 
  lessonId, 
  moduleId, 
  courseSlug,
  onComplete 
}) => {
  const [, navigate] = useLocation();

  // Получаем данные урока
  // Преобразуем ID в строку для безопасного использования
  const lessonIdStr = lessonId ? String(lessonId) : '';
  const moduleIdStr = moduleId ? String(moduleId) : '';
  
  const { data: lesson, isLoading: lessonLoading } = useQuery<Lesson>({
    queryKey: [`/api/lessons/${lessonIdStr}`],
    enabled: !!lessonIdStr,
    staleTime: 5 * 60 * 1000, // Кэшируем на 5 минут
    queryFn: async () => {
      try {
        console.log(`Загрузка урока с ID ${lessonIdStr}`);
        // Добавляем параметр времени для предотвращения кэширования браузером
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/lessons/${lessonIdStr}?t=${timestamp}`);
        if (!response.ok) {
          throw new Error('Не удалось загрузить урок');
        }
        const lessonData = await response.json();
        console.log('Полученные данные урока:', lessonData);
        
        // Проверяем наличие контента и выводим предупреждение, если его нет
        if (!lessonData.content) {
          console.warn(`Урок ${lessonIdStr} не содержит контента`);
        } else {
          console.log(`Длина контента урока ${lessonIdStr}: ${lessonData.content.length} символов`);
        }
        
        return lessonData;
      } catch (error) {
        console.error('Ошибка при загрузке урока:', error);
        throw error;
      }
    }
  });

  // Получаем данные модуля для навигации между уроками
  const { data: module, isLoading: moduleLoading } = useQuery<Module>({
    queryKey: [`/api/modules/${moduleId}`],
    enabled: !!moduleId,
    queryFn: async () => {
      try {
        console.log(`Загрузка модуля с ID ${moduleId}`);
        const response = await fetch(`/api/modules/${moduleId}`);
        if (!response.ok) {
          throw new Error('Не удалось загрузить модуль');
        }
        const moduleData = await response.json();
        
        // Если у нас уже есть урок, но он не включен в уроки модуля, 
        // дополнительно загрузим уроки модуля
        if (!moduleData.lessons || moduleData.lessons.length === 0) {
          console.log(`Загрузка уроков для модуля ${moduleId}`);
          const lessonsResponse = await fetch(`/api/modules/${moduleId}/lessons`);
          if (lessonsResponse.ok) {
            moduleData.lessons = await lessonsResponse.json();
          }
        }
        
        return moduleData;
      } catch (error) {
        console.error('Ошибка при загрузке модуля:', error);
        throw error;
      }
    }
  });

  // Переходы между уроками с предзагрузкой для бесшовной навигации
  const goToPreviousLesson = () => {
    if (!module?.lessons) return;
    
    const currentIndex = module.lessons.findIndex(l => l.id.toString() === lessonId.toString());
    if (currentIndex > 0) {
      const prevLesson = module.lessons[currentIndex - 1];
      
      // Предварительно загружаем данные предыдущего урока
      queryClient.prefetchQuery({
        queryKey: [`/api/lessons/${prevLesson.id}`],
        queryFn: async () => {
          const response = await fetch(`/api/lessons/${prevLesson.id}`);
          if (!response.ok) throw new Error('Не удалось загрузить урок');
          return response.json();
        }
      }).then(() => {
        // После предзагрузки делаем переход
        navigate(`/courses/${courseSlug}/modules/${moduleId}/lessons/${prevLesson.id}`);
      });
    }
  };

  const goToNextLesson = () => {
    if (!module?.lessons) return;
    
    const currentIndex = module.lessons.findIndex(l => l.id.toString() === lessonId.toString());
    if (currentIndex !== -1 && currentIndex < module.lessons.length - 1) {
      const nextLesson = module.lessons[currentIndex + 1];
      
      // Предварительно загружаем данные следующего урока
      queryClient.prefetchQuery({
        queryKey: [`/api/lessons/${nextLesson.id}`],
        queryFn: async () => {
          const response = await fetch(`/api/lessons/${nextLesson.id}`);
          if (!response.ok) throw new Error('Не удалось загрузить урок');
          return response.json();
        }
      }).then(() => {
        // После предзагрузки делаем переход
        navigate(`/courses/${courseSlug}/modules/${moduleId}/lessons/${nextLesson.id}`);
      });
    }
  };

  // Определить, является ли урок первым или последним в модуле
  const isFirstLesson = module?.lessons && 
    module.lessons.findIndex(l => l.id.toString() === lessonId.toString()) === 0;
  
  const isLastLesson = module?.lessons && 
    module.lessons.findIndex(l => l.id.toString() === lessonId.toString()) === module.lessons.length - 1;

  // Если идет загрузка
  if (lessonLoading || moduleLoading) {
    return (
      <div className="w-full flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="ml-4">Загрузка урока...</p>
      </div>
    );
  }

  // Если урок не найден
  if (!lesson || !module) {
    return (
      <div className="w-full p-8 text-center">
        <h2 className="text-xl font-semibold">Урок не найден</h2>
        <p className="text-muted-foreground mt-2">
          Проверьте URL или выберите другой урок
        </p>
        <Button className="mt-4" onClick={() => navigate(`/courses/${courseSlug}`)}>
          Вернуться к курсу
        </Button>
      </div>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{lesson.title}</CardTitle>
          <Badge variant="outline">
            {lesson.type === "text" ? "Текст" : 
             lesson.type === "video" ? "Видео" : 
             lesson.type === "quiz" ? "Тест" : 
             "Интерактивный"}
          </Badge>
        </div>
        <CardDescription>
          <div className="flex items-center mt-1">
            <Clock className="h-4 w-4 mr-1" />
            <span>{lesson.estimatedDuration} минут</span>
          </div>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="prose prose-lg max-w-none dark:prose-invert">
        {lesson.type === "text" ? (
          <div>
            {lesson.content ? (
              <ReactMarkdown>{lesson.content}</ReactMarkdown>
            ) : (
              <p className="text-muted-foreground italic">Содержимое урока отсутствует</p>
            )}
          </div>
        ) : lesson.type === "video" ? (
          <div>
            {lesson.content ? (
              <div>
                <ReactMarkdown>{lesson.content}</ReactMarkdown>
                <div className="aspect-video bg-muted rounded-lg mt-4 flex items-center justify-center">
                  <Video className="h-16 w-16 text-muted-foreground" />
                  <p className="ml-4">Видеоматериал урока</p>
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <Video className="h-16 w-16 text-muted-foreground" />
                <p className="ml-4">Видеоматериал недоступен</p>
              </div>
            )}
          </div>
        ) : lesson.type === "quiz" ? (
          <div>
            {lesson.content ? (
              <div>
                <ReactMarkdown>{lesson.content}</ReactMarkdown>
                <div className="mt-6 space-y-6 border-t pt-6">
                  <h3 className="text-xl font-medium">Тестирование знаний</h3>
                  <p className="text-muted-foreground">
                    Ответьте на вопросы, чтобы проверить свое понимание материала
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-muted-foreground italic">Содержимое теста отсутствует</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            {lesson.content ? (
              <div>
                <ReactMarkdown>{lesson.content}</ReactMarkdown>
                <div className="mt-6 border-t pt-6">
                  <h3 className="text-xl font-medium">Практическое задание</h3>
                  <p className="text-muted-foreground">
                    Интерактивная часть урока будет доступна в будущих версиях
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10">
                <FileText className="h-16 w-16 text-muted-foreground" />
                <p className="mt-4">Интерактивное содержимое урока отсутствует</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-6">
        <Button 
          variant="outline" 
          onClick={goToPreviousLesson}
          disabled={isFirstLesson}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Предыдущий урок
        </Button>
        
        {onComplete && (
          <Button onClick={() => onComplete(Number(lessonId))}>
            Завершить урок <CheckCircle className="ml-2 h-4 w-4" />
          </Button>
        )}
        
        <Button 
          onClick={goToNextLesson}
          disabled={isLastLesson}
        >
          Следующий урок
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
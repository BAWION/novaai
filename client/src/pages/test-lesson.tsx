import React, { useEffect, useState } from "react";
import { useParams } from "wouter";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Простой интерфейс для урока
interface Lesson {
  id: number;
  title: string;
  content: string;
  type: string;
}

export default function TestLessonPage() {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLesson() {
      try {
        setLoading(true);
        
        // Добавляем timestamp для предотвращения кэширования
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/lessons/${lessonId}?_t=${timestamp}`, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Полученные данные урока:', data);
        setLesson(data);
      } catch (err) {
        console.error('Error fetching lesson:', err);
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      } finally {
        setLoading(false);
      }
    }

    if (lessonId) {
      fetchLesson();
    }
  }, [lessonId]);

  if (loading) {
    return (
      <DashboardLayout title="Загрузка...">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-primary rounded-full"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Ошибка">
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold text-red-500">Произошла ошибка</h1>
          <p className="mt-2">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!lesson) {
    return (
      <DashboardLayout title="Урок не найден">
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold">Урок не найден</h1>
          <p className="mt-2">Проверьте идентификатор урока и попробуйте снова</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={lesson.title || "Тестовый урок"}>
      <div className="container mx-auto py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>{lesson.title}</CardTitle>
          </CardHeader>
          
          <CardContent>
            {/* Отладочная информация */}
            <div className="p-4 mb-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
              <h3 className="font-semibold">Информация об уроке:</h3>
              <p>ID урока: {lesson.id}</p>
              <p>Название: {lesson.title}</p>
              <p>Тип: {lesson.type}</p>
              <p>Контент присутствует: {lesson.content ? 'Да' : 'Нет'}</p>
              <p>Длина контента: {lesson.content ? lesson.content.length : 0} символов</p>
              {lesson.content && (
                <div className="mt-2">
                  <p>Начало контента:</p>
                  <pre className="bg-gray-100 p-2 mt-1 text-xs overflow-auto max-h-20">
                    {lesson.content.substring(0, 100)}...
                  </pre>
                </div>
              )}
            </div>

            {/* Отображение контента урока */}
            <div className="prose prose-lg max-w-none dark:prose-invert">
              {lesson.content ? (
                <ReactMarkdown>{lesson.content}</ReactMarkdown>
              ) : (
                <p className="text-muted-foreground italic">
                  Содержимое урока отсутствует
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
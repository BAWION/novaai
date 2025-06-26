import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { useAuth } from "@/context/auth-context";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import CompetencyMap from "@/components/competency/competency-map";
import PageHeader from "@/components/layout/page-header";

const CompetencyMapPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/courses/:slug/competency-map");
  const { user } = useAuth();
  const courseSlug = params?.slug;
  
  // Получение данных о курсе по slug
  const { data: course, isLoading: isLoadingCourse } = useQuery({
    queryKey: [`/api/courses/${courseSlug}`],
    queryFn: async () => {
      const response = await fetch(`/api/courses/${courseSlug}`);
      if (!response.ok) {
        throw new Error("Не удалось получить информацию о курсе");
      }
      return response.json();
    },
    enabled: !!courseSlug
  });
  
  // Если slug курса не передан, перенаправляем на страницу курсов
  useEffect(() => {
    if (!courseSlug) {
      setLocation("/courses");
    }
  }, [courseSlug, setLocation]);
  
  return (
    <>      
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => setLocation(`/courses/${courseSlug}`)}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Вернуться к курсу
        </Button>
        
        <PageHeader
          title={isLoadingCourse ? <Skeleton className="h-8 w-1/2" /> : `Карта компетенций: ${course?.title}`}
          description={
            isLoadingCourse ? (
              <Skeleton className="h-4 w-3/4 mt-2" />
            ) : (
              "Просмотрите все компетенции, которые развиваются в этом курсе, и их взаимосвязи"
            )
          }
        />
        
        <Separator className="my-6" />
        
        {isLoadingCourse ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        ) : course ? (
          <CompetencyMap 
            courseId={course.id} 
            userId={user?.id}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              Курс не найден или произошла ошибка при загрузке данных
            </p>
            <Button
              className="mt-4"
              onClick={() => setLocation("/courses")}
            >
              Перейти к списку курсов
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default CompetencyMapPage;
import React, { ReactNode, useEffect, useState } from "react";
import { DashboardLayout } from "./dashboard-layout";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ModuleAccordion } from "@/components/courses/module-accordion";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";

interface CourseLayoutProps {
  children: ReactNode;
  title?: string;
  courseId?: string;
  courseSlug?: string;
}

export function CourseLayout({
  children,
  title = "Курс",
  courseId,
  courseSlug
}: CourseLayoutProps) {
  const [, navigate] = useLocation();
  const [currentLessonId, setCurrentLessonId] = useState<number | undefined>();
  const [currentUrl, setCurrentUrl] = useState<string>("");
  
  // Получение пути из URL
  useEffect(() => {
    const path = window.location.pathname;
    setCurrentUrl(path);
    
    // Извлекаем ID урока из URL, если он там есть
    const match = path.match(/\/lessons\/(\d+)/);
    if (match && match[1]) {
      setCurrentLessonId(parseInt(match[1]));
    }
  }, [window.location.pathname]);
  
  // Запрос модулей курса
  const { data: modules, isLoading: isLoadingModules } = useQuery({
    queryKey: [`/api/courses/${courseSlug}/modules`],
    queryFn: async () => {
      const response = await fetch(`/api/courses/${courseSlug}/modules`);
      if (!response.ok) {
        throw new Error("Failed to fetch modules");
      }
      return response.json();
    },
    enabled: !!courseSlug,
  });
  
  // Обработчик выбора урока
  const handleLessonSelect = (lessonId: number) => {
    setCurrentLessonId(lessonId);
  };
  
  return (
    <DashboardLayout title={title}>
      <div className="flex flex-col md:flex-row gap-4 w-full">
        {/* Боковая панель с модулями, которая всегда видна */}
        <div className="w-full md:w-1/4 lg:w-1/5 md:min-w-[250px] md:max-w-[320px] bg-background/50 backdrop-blur-sm rounded-md border p-3 border-border/50 shadow-md">
          {isLoadingModules ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Загрузка модулей...</span>
            </div>
          ) : (
            <ModuleAccordion 
              modules={modules || []} 
              currentLessonId={currentLessonId}
              onLessonSelect={handleLessonSelect}
            />
          )}
        </div>
        
        {/* Основное содержимое, которое меняется */}
        <div className="course-layout-container w-full md:w-3/4 lg:w-4/5">
          <motion.div
            className="course-content-area"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
import React, { useEffect, useState, Suspense } from "react";
import { Route, Switch, useRoute, useLocation } from "wouter";
import { CourseLayout } from "@/components/layout/course-layout";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";

// Ленивая загрузка компонентов страниц
const AILiteracyCourse = React.lazy(() => import("@/pages/ai-literacy-course"));
const LessonPage = React.lazy(() => import("@/pages/lesson-page"));

interface CourseRouteHandlerProps {
  slug: string;
}

export function CourseRouteHandler({ slug }: CourseRouteHandlerProps) {
  const [currentPath, setCurrentPath] = useState<string>("");
  const [location] = useLocation();
  const [matchesLessonPath] = useRoute("/courses/:slug/modules/:moduleId/lessons/:lessonId");
  const [matchesCoursePath] = useRoute("/courses/:slug");
  
  // Запрос данных курса
  const { data: course, isLoading } = useQuery({
    queryKey: [`/api/courses/${slug}`],
    queryFn: async () => {
      const response = await fetch(`/api/courses/${slug}`);
      if (!response.ok) {
        throw new Error("Failed to fetch course");
      }
      return response.json();
    },
  });

  // Обновляем текущий путь при изменении location
  useEffect(() => {
    setCurrentPath(location);
  }, [location]);

  // Показываем загрузку, пока данные курса не получены
  if (isLoading) {
    return (
      <CourseLayout title="Загрузка курса...">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin mr-2" />
          <span>Загрузка курса...</span>
        </div>
      </CourseLayout>
    );
  }
  
  return (
    <CourseLayout title={course?.title || "Курс"} courseSlug={slug}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPath}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="w-full"
        >
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
              <Loader2 className="w-8 h-8 animate-spin mr-2" />
              <span>Загрузка...</span>
            </div>
          }>
            <Switch>
              <Route path="/courses/:slug">
                {(params) => (
                  <AILiteracyCourse />
                )}
              </Route>
              <Route path="/courses/:slug/modules/:moduleId/lessons/:lessonId">
                {(params) => (
                  <LessonPage 
                    inCourseContext={params.slug}
                  />
                )}
              </Route>
            </Switch>
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </CourseLayout>
  );
}
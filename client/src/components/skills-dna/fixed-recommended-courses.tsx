import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Award, 
  BookOpen, 
  Clock, 
  Layers, 
  Lightbulb, 
  Star, 
  Target, 
  Zap 
} from "lucide-react";
import { useLocation } from "wouter";

/**
 * Интерфейс для рекомендуемого курса (первый формат)
 */
export interface RecommendedCourse {
  id: number;
  title: string;
  description: string;
  match: number;
  difficulty: number;
  duration?: number;
  modules?: number;
  skillGaps?: string[];
  reason?: string;
}

// Альтернативный формат, который может прийти из API или из диагностики
export interface CourseRecWithMatchPercentage {
  id: number;
  title: string;
  description: string;
  matchPercentage: number; // вместо match
  level: number; // вместо difficulty
  duration?: number;
  modules?: number;
  skillGaps?: string[];
  reason?: string;
}

// Общий тип для работы с обоими форматами
type CourseFormat = RecommendedCourse | CourseRecWithMatchPercentage;

// Тип для нормализованного формата (внутренний)
interface NormalizedCourse {
  id: number;
  title: string;
  description: string;
  match: number;
  difficulty: number;
  duration?: number;
  modules?: number;
  skillGaps?: string[];
  reason?: string;
}

interface RecommendedCoursesProps {
  courses: CourseFormat[];
  className?: string;
  limit?: number;
  compact?: boolean;
}

/**
 * Функция для нормализации курса любого формата в стандартный внутренний формат
 */
const normalizeCourse = (course: CourseFormat): NormalizedCourse => {
  console.log("[FixedRecommendedCourses] Нормализация курса:", course);
  
  if ('matchPercentage' in course) {
    console.log("[FixedRecommendedCourses] Обнаружен формат с matchPercentage, конвертирую в формат с match");
    // Если это формат с matchPercentage, преобразуем его
    return {
      id: course.id,
      title: course.title,
      description: course.description,
      match: course.matchPercentage,
      difficulty: course.level,
      duration: course.duration,
      modules: course.modules,
      skillGaps: course.skillGaps,
      reason: course.reason
    };
  }
  
  console.log("[FixedRecommendedCourses] Обнаружен стандартный формат с match и difficulty");
  // Если это уже стандартный формат, просто возвращаем его
  return course;
};

/**
 * Компонент отображения списка рекомендуемых курсов
 */
export function FixedRecommendedCourses({ 
  courses = [], 
  className = "", 
  limit = 3,
  compact = false
}: RecommendedCoursesProps) {
  const [_, setLocation] = useLocation();
  
  // Нормализуем данные из разных форматов в один общий
  const normalizedCourses: NormalizedCourse[] = courses.map(normalizeCourse);
  
  // Ограничиваем количество отображаемых курсов
  const displayCourses = limit > 0 ? normalizedCourses.slice(0, limit) : normalizedCourses;
  
  // Если нет рекомендаций, показываем соответствующее сообщение
  if (courses.length === 0) {
    return (
      <Card className="bg-gradient-to-r from-zinc-900/60 to-zinc-800/60 border-zinc-700/40">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Lightbulb className="h-12 w-12 text-yellow-400 mb-3 opacity-70" />
          <h3 className="text-lg font-medium text-white mb-2">Рекомендации недоступны</h3>
          <p className="text-zinc-400 text-center max-w-md mb-4">
            Чтобы получить персонализированные рекомендации курсов, пройдите глубокую диагностику навыков.
          </p>
          <Button 
            variant="default"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white"
            onClick={() => setLocation("/deep-diagnosis")}
          >
            Пройти диагностику
            <Target className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  // Компактный вид для встраивания в другие компоненты
  if (compact) {
    return (
      <div className={`grid gap-3 ${className}`}>
        {displayCourses.map((course) => (
          <Card 
            key={course.id} 
            className="bg-gradient-to-r from-emerald-900/20 to-green-900/20 border-emerald-500/20 overflow-hidden hover:border-emerald-500/40 transition-all"
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-base font-medium text-white">{course.title}</h3>
                <Badge 
                  className={`
                    ml-2 mt-1
                    ${course.match >= 90 ? 'bg-green-600 hover:bg-green-700' : ''}
                    ${course.match >= 70 && course.match < 90 ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                    ${course.match < 70 ? 'bg-blue-600 hover:bg-blue-700' : ''}
                  `}
                >
                  {course.match}% совпадение
                </Badge>
              </div>
              <div className="flex items-center text-xs text-zinc-400 mb-3 space-x-3">
                <div className="flex items-center">
                  <Star className="h-3 w-3 text-yellow-500 mr-1" />
                  <span>Сложность: {getDifficultyText(course.difficulty)}</span>
                </div>
                {course.duration && (
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 text-blue-400 mr-1" />
                    <span>{course.duration} мин</span>
                  </div>
                )}
                {course.modules && (
                  <div className="flex items-center">
                    <Layers className="h-3 w-3 text-purple-400 mr-1" />
                    <span>{course.modules} модулей</span>
                  </div>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                className="w-full justify-between bg-white/5 hover:bg-white/10 text-zinc-300"
                onClick={() => setLocation(`/courses/${course.id}`)}
              >
                <span>Перейти к курсу</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
        
        {courses.length > limit && (
          <Button
            variant="ghost"
            className="mt-1 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/30"
            onClick={() => setLocation("/courses?filter=recommended")}
          >
            Посмотреть все рекомендации ({courses.length})
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    );
  }
  
  // Полноценное отображение списка рекомендаций
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Target className="h-5 w-5 text-emerald-400 mr-2" />
          <h2 className="text-xl font-medium text-white">Персональные рекомендации</h2>
        </div>
        <Badge 
          variant="outline" 
          className="bg-emerald-950/30 text-emerald-400 border-emerald-500/40"
        >
          {courses.length} курсов
        </Badge>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {displayCourses.map((course) => (
          <Card 
            key={course.id} 
            className="bg-gradient-to-br from-emerald-900/30 to-green-900/20 border-emerald-500/20 
                      hover:border-emerald-500/40 transition-all overflow-hidden"
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg text-white">{course.title}</CardTitle>
                <Badge 
                  className={`
                    ml-2
                    ${course.match >= 90 ? 'bg-green-600 hover:bg-green-700' : ''}
                    ${course.match >= 70 && course.match < 90 ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                    ${course.match < 70 ? 'bg-blue-600 hover:bg-blue-700' : ''}
                  `}
                >
                  {course.match}% совпадение
                </Badge>
              </div>
              <CardDescription className="text-zinc-400 mt-1">
                {course.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-3 gap-2 text-xs text-zinc-400 mb-3">
                <div className="flex items-center">
                  <Star className="h-3 w-3 text-yellow-500 mr-1" />
                  <span>Сложность: {getDifficultyText(course.difficulty)}</span>
                </div>
                {course.duration && (
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 text-blue-400 mr-1" />
                    <span>{course.duration} мин</span>
                  </div>
                )}
                {course.modules && (
                  <div className="flex items-center">
                    <Layers className="h-3 w-3 text-purple-400 mr-1" />
                    <span>{course.modules} модулей</span>
                  </div>
                )}
              </div>
              
              {course.reason && (
                <div className="bg-white/5 rounded-md p-2 text-xs text-zinc-300 mb-3">
                  <div className="flex items-start">
                    <Lightbulb className="h-3 w-3 text-yellow-400 mr-1 mt-0.5 flex-shrink-0" />
                    <span>{course.reason}</span>
                  </div>
                </div>
              )}
              
              {course.skillGaps && course.skillGaps.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs text-zinc-400 mb-1 flex items-center">
                    <Zap className="h-3 w-3 text-amber-400 mr-1" />
                    <span>Развиваемые навыки:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {course.skillGaps.map((skill) => (
                      <Badge key={skill} variant="outline" className="bg-amber-950/30 text-amber-300 border-amber-500/30 text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="pt-1">
              <Button 
                variant="default" 
                className="w-full justify-between bg-gradient-to-r from-emerald-600 to-green-600 hover:opacity-90 text-white"
                onClick={() => setLocation(`/courses/${course.id}`)}
              >
                <span>Начать обучение</span>
                <BookOpen className="h-4 w-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {courses.length > limit && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            className="border-emerald-500/30 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/30"
            onClick={() => setLocation("/courses?filter=recommended")}
          >
            Посмотреть все рекомендации ({courses.length})
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * Вспомогательная функция для получения текстового описания уровня сложности
 */
function getDifficultyText(level: number): string {
  switch(level) {
    case 1: return "Начальный";
    case 2: return "Базовый";
    case 3: return "Средний";
    case 4: return "Продвинутый";
    case 5: return "Экспертный";
    default: return "Средний";
  }
}
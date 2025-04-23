import React from "react";
import { CourseCard } from "./course-card";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

interface Course {
  id: number;
  slug: string;
  title: string;
  description: string;
  icon: string;
  modules: number;
  level: string;
  color: string;
  difficulty?: number;
  access?: string;
  estimatedDuration?: number;
  tags?: string[];
  progress?: number;
}

interface CourseGridProps {
  courses: Course[];
  loading?: boolean;
  emptyMessage?: string;
  variant?: "default" | "compact" | "featured";
  columns?: 2 | 3 | 4;
  showFilters?: boolean;
  className?: string;
}

interface CourseGridExtendedProps extends CourseGridProps {
  onCourseSelect?: (course: Course) => void;
  filterInitialState?: {
    level: string;
    access: string;
    search: string;
  };
  onFilterChange?: (filters: { level: string; access: string; search: string }) => void;
}

export function CourseGrid({
  courses,
  loading = false,
  emptyMessage = "Курсы не найдены",
  variant = "default",
  columns = 3,
  showFilters = true,
  className,
  onCourseSelect,
  filterInitialState,
  onFilterChange,
}: CourseGridExtendedProps) {
  const [, setLocation] = useLocation();
  const [filters, setFilters] = React.useState({
    level: filterInitialState?.level || "",
    access: filterInitialState?.access || "",
    search: filterInitialState?.search || "",
  });

  // Функция фильтрации курсов
  const filteredCourses = React.useMemo(() => {
    return courses.filter((course) => {
      // Фильтр по уровню
      if (filters.level && course.level !== filters.level) {
        return false;
      }

      // Фильтр по типу доступа
      if (filters.access && course.access !== filters.access) {
        return false;
      }

      // Фильтр по поисковому запросу
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          course.title.toLowerCase().includes(searchLower) ||
          course.description.toLowerCase().includes(searchLower) ||
          (course.tags && course.tags.some((tag) => tag.toLowerCase().includes(searchLower)))
        );
      }

      return true;
    });
  }, [courses, filters]);

  // Обработчик изменения фильтров
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    
    // Вызов внешнего обработчика изменения фильтров, если он предоставлен
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  // Компонент фильтрации
  const renderFilters = () => {
    if (!showFilters) return null;

    return (
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            name="search"
            placeholder="Поиск курсов..."
            className="w-full px-4 py-2 rounded-lg bg-space-800 border border-white/10 focus:outline-none focus:ring-1 focus:ring-primary"
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>
        <div className="flex gap-4">
          <select
            name="level"
            className="px-4 py-2 rounded-lg bg-space-800 border border-white/10 focus:outline-none focus:ring-1 focus:ring-primary"
            value={filters.level}
            onChange={handleFilterChange}
          >
            <option value="">Все уровни</option>
            <option value="basic">Начальный</option>
            <option value="intermediate">Средний</option>
            <option value="advanced">Продвинутый</option>
            <option value="expert">Экспертный</option>
          </select>
          <select
            name="access"
            className="px-4 py-2 rounded-lg bg-space-800 border border-white/10 focus:outline-none focus:ring-1 focus:ring-primary"
            value={filters.access}
            onChange={handleFilterChange}
          >
            <option value="">Все курсы</option>
            <option value="free">Бесплатно</option>
            <option value="pro">PRO</option>
            <option value="premium">Премиум</option>
          </select>
        </div>
      </div>
    );
  };

  // Генерация сетки курсов
  const renderCourses = () => {
    if (loading) {
      // Скелетон загрузки
      return Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="bg-space-800/50 animate-pulse rounded-xl h-64 p-4 border border-white/10"
        ></div>
      ));
    }

    if (filteredCourses.length === 0) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center p-12 border border-white/10 rounded-xl bg-space-800/50">
          <i className="fas fa-search text-4xl text-white/30 mb-4"></i>
          <p className="text-white/70 text-center">{emptyMessage}</p>
          <button
            onClick={() => setFilters({ level: "", access: "", search: "" })}
            className="mt-4 px-4 py-2 bg-primary/80 hover:bg-primary rounded-lg transition"
          >
            Сбросить фильтры
          </button>
        </div>
      );
    }

    return filteredCourses.map((course) => (
      <CourseCard
        key={course.id}
        id={course.id}
        slug={course.slug}
        title={course.title}
        description={course.description}
        icon={course.icon}
        modules={course.modules}
        level={course.level}
        color={course.color}
        difficulty={course.difficulty}
        access={course.access}
        estimatedDuration={course.estimatedDuration}
        progress={course.progress}
        variant={variant}
        onClick={onCourseSelect ? () => onCourseSelect(course) : undefined}
      />
    ));
  };

  return (
    <div className={className}>
      {renderFilters()}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`grid gap-6 grid-cols-1 ${
          columns === 2
            ? "sm:grid-cols-1 md:grid-cols-2"
            : columns === 3
            ? "sm:grid-cols-2 lg:grid-cols-3"
            : "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        }`}
      >
        {renderCourses()}
      </motion.div>
    </div>
  );
}
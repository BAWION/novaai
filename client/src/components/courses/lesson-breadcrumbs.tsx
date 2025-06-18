import React from "react";
import { ChevronRight, Home, BookOpen, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
}

interface LessonBreadcrumbsProps {
  course: {
    id: number;
    title: string;
    slug: string;
  };
  module: {
    id: number;
    title: string;
    orderIndex: number;
  };
  lesson: {
    id: number;
    title: string;
    orderIndex: number;
  };
  className?: string;
}

export function LessonBreadcrumbs({ 
  course, 
  module, 
  lesson, 
  className = "" 
}: LessonBreadcrumbsProps) {
  const [, navigate] = useLocation();

  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: "Главная",
      href: "/",
      icon: Home
    },
    {
      label: "Курсы",
      href: "/courses",
      icon: BookOpen
    },
    {
      label: course.title,
      href: `/courses/${course.slug}`,
      icon: BookOpen
    },
    {
      label: `Модуль ${module.orderIndex}: ${module.title}`,
      href: `/courses/${course.slug}/modules/${module.id}`
    },
    {
      label: `${lesson.orderIndex}. ${lesson.title}`,
      icon: FileText,
      isActive: true
    }
  ];

  const handleNavigate = (href: string) => {
    navigate(href);
  };

  return (
    <nav className={`flex items-center space-x-1 text-sm ${className}`}>
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const Icon = item.icon;

        return (
          <React.Fragment key={index}>
            <div className="flex items-center">
              {item.href && !isLast ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigate(item.href!)}
                  className="h-8 px-2 text-white/60 hover:text-white/90 hover:bg-white/10"
                >
                  {Icon && <Icon className="w-3 h-3 mr-1.5" />}
                  <span className="max-w-[150px] truncate">{item.label}</span>
                </Button>
              ) : (
                <div className={`flex items-center px-2 py-1 rounded ${
                  item.isActive 
                    ? 'text-white font-medium bg-white/10' 
                    : 'text-white/60'
                }`}>
                  {Icon && <Icon className="w-3 h-3 mr-1.5" />}
                  <span className="max-w-[150px] truncate">{item.label}</span>
                </div>
              )}
            </div>
            
            {!isLast && (
              <ChevronRight className="w-3 h-3 text-white/40 flex-shrink-0" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
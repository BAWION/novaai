import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

// Категории курсов с иконками и описаниями
const courseCategories = [
  {
    id: "all",
    name: "Все курсы",
    icon: "fa-book",
    description: "Полный каталог всех курсов платформы",
    path: "/courses"
  },
  {
    id: "python",
    name: "Python-разработка",
    icon: "fa-python",
    description: "Основы и продвинутые техники программирования на Python",
    path: "/courses?category=python"
  },
  {
    id: "machine-learning",
    name: "Машинное обучение",
    icon: "fa-brain",
    description: "Классические алгоритмы и современные подходы в ML",
    path: "/courses?category=machine-learning"
  },
  {
    id: "deep-learning",
    name: "Глубокое обучение",
    icon: "fa-network-wired",
    description: "Нейронные сети разных архитектур и их применение",
    path: "/courses?category=deep-learning"
  },
  {
    id: "nlp",
    name: "Обработка текстов (NLP)",
    icon: "fa-comment-dots",
    description: "Работа с естественным языком и текстовыми данными",
    path: "/courses?category=nlp"
  },
  {
    id: "computer-vision",
    name: "Компьютерное зрение",
    icon: "fa-eye",
    description: "Анализ и обработка изображений и видео",
    path: "/courses?category=computer-vision"
  },
  {
    id: "data-science",
    name: "Наука о данных",
    icon: "fa-database",
    description: "Анализ данных, статистика и визуализация",
    path: "/courses?category=data-science"
  },
  {
    id: "business-ai",
    name: "Business AI Module",
    icon: "fa-briefcase",
    description: "Инструменты внедрения ИИ в бизнес-процессы",
    path: "/courses?category=business-ai"
  }
];

export function CourseDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [_, navigate] = useLocation();

  // Закрываем дропдаун при клике вне его области
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-white/70 hover:text-white transition group"
      >
        <span>Курсы</span>
        <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 left-0 top-full mt-2 w-64 md:w-80"
          >
            <Glassmorphism className="shadow-lg py-3 backdrop-blur-lg border border-white/10 rounded-xl">
              <div className="py-1">
                {courseCategories.map((category) => (
                  <div 
                    key={category.id}
                    className="px-4 py-2 hover:bg-white/5 transition cursor-pointer"
                    onClick={() => {
                      navigate(category.path);
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 flex items-center justify-center text-primary">
                        <i className={`fas ${category.icon}`}></i>
                      </div>
                      <div className="ml-3">
                        <div className="text-white font-medium">{category.name}</div>
                        <div className="text-xs text-white/60">{category.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 mt-1 pt-2 px-4">
                <Link href="/courses">
                  <a className="text-primary text-sm font-medium flex items-center hover:text-primary/80 transition">
                    <span>Посмотреть все курсы</span>
                    <i className="fas fa-arrow-right ml-2"></i>
                  </a>
                </Link>
              </div>
            </Glassmorphism>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
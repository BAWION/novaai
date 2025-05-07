import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  calculateOrbitalPosition, 
  calculateAngle, 
  calculateDistance 
} from "@/lib/utils";
import { courses, Course } from "@/lib/constants";

interface OrbitalLayoutProps {
  onCourseSelect?: (course: Course) => void;
  level?: number;
  progress?: number;
  skills?: { name: string; level: number; change: number }[];
  emphasis?: string[];
}

export function OrbitalLayout({ 
  onCourseSelect,
  level = 1,
  progress = 0,
  skills = [],
  emphasis = [] 
}: OrbitalLayoutProps) {
  const [hoveredCourse, setHoveredCourse] = useState<string | null>(null);
  const [orbitRadius, setOrbitRadius] = useState(180);

  // Adjust orbit radius based on container size
  useEffect(() => {
    function handleResize() {
      const containerWidth = document.getElementById('orbital-container')?.clientWidth || 300;
      setOrbitRadius(Math.min(containerWidth / 2 - 100, 250));
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCourseClick = (course: Course) => {
    if (onCourseSelect) {
      onCourseSelect(course);
    }
  };

  // Простое расположение элементов в ряд с нахлестом
  const calculateBilliardPosition = (index: number, totalCourses: number) => {
    // Радиус элементов (меньше, чем orbitRadius)
    const courseRadius = orbitRadius / 2;
    
    // Начинаем размещение справа от центра и идем по кругу
    // Вычисляем угол для каждого элемента
    const angle = (index / totalCourses) * 270 + 45; // Распределяем по трем четвертям окружности от 45 до 315 градусов
    
    // Используем фиксированное расстояние от центра
    const distance = courseRadius + 40;
    
    // Рассчитываем позиции
    const x = distance * Math.cos(angle * Math.PI / 180);
    const y = distance * Math.sin(angle * Math.PI / 180);
    
    return { x, y };
  };

  return (
    <div 
      id="orbital-container"
      className="w-full h-[500px] relative flex items-center justify-center"
    >
      {/* Central element */}
      <motion.div
        className="w-20 h-20 absolute rounded-full bg-gradient-to-br from-[#6E3AFF] to-[#2EBAE1] flex items-center justify-center z-20"
        animate={{
          boxShadow: [
            "0 0 15px rgba(110, 58, 255, 0.5)",
            "0 0 25px rgba(110, 58, 255, 0.7)",
            "0 0 15px rgba(110, 58, 255, 0.5)"
          ]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <span className="text-white font-orbitron font-bold text-2xl">ИИ</span>
      </motion.div>

      {/* Рекомендованные курсы в виде рядов шаров, как в бильярде */}
      {courses.map((course, index) => {
        const { x, y } = calculateBilliardPosition(index, courses.length);
        const isHovered = hoveredCourse === course.id;

        // Определяем цвет курса на основе категории и уровня
        const getCourseColor = () => {
          // Приоритет: сначала используем категорию курса
          if (course.category) {
            switch (course.category) {
              case 'ethics':
                return 'bg-gradient-to-br from-purple/50 to-purple/30';
              case 'law':
                return 'bg-gradient-to-br from-green/50 to-green/30';
              case 'ml':
                return 'bg-gradient-to-br from-[#6E3AFF]/50 to-[#2EBAE1]/30';
              case 'business':
                return 'bg-gradient-to-br from-secondary/50 to-secondary/30';
              default:
                break;
            }
          }
          
          // Если категория не задана или не имеет специального стиля, используем уровень курса
          switch (course.level) {
            case 'basic':
              return 'bg-gradient-to-br from-green-500/40 to-green-700/40';
            case 'practice':
              return 'bg-gradient-to-br from-yellow-500/40 to-yellow-700/40';
            case 'in-progress':
              return 'bg-gradient-to-br from-[#6E3AFF]/40 to-[#2EBAE1]/40';
            case 'upcoming':
            default:
              return 'bg-gradient-to-br from-white/10 to-white/5';
          }
        };

        return (
          <motion.div
            key={course.id}
            className={`absolute z-10 ${
              isHovered ? 'z-30' : 'z-10'
            }`}
            style={{
              left: "50%",
              top: "50%",
            }}
            animate={{
              x: x,
              y: y,
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut"
            }}
          >
            <motion.div
              className={`cursor-pointer flex flex-col items-center ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
              onHoverStart={() => setHoveredCourse(course.id)}
              onHoverEnd={() => setHoveredCourse(null)}
              onClick={() => handleCourseClick(course)}
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div 
                className={`w-14 h-14 rounded-full ${getCourseColor()} flex items-center justify-center mb-2 shadow-lg`}
              >
                <i className={`fas fa-${course.icon} text-white text-lg`}></i>
              </div>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-16 whitespace-nowrap bg-space-800/80 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg text-center w-auto"
                >
                  <p className="font-medium text-sm">{course.title}</p>
                  <p className="text-white/70 text-xs">{course.modules} модулей</p>
                  {course.category && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full inline-block mt-1 ${
                      course.category === 'ethics' ? 'bg-purple/20 text-purple-foreground' :
                      course.category === 'law' ? 'bg-green/20 text-green-foreground' :
                      course.category === 'ml' ? 'bg-primary/20 text-primary-foreground' :
                      course.category === 'business' ? 'bg-secondary/20 text-secondary-foreground' :
                      'bg-gray-500/20 text-white'
                    }`}>
                      {course.category === 'ethics' ? 'Этика' :
                       course.category === 'law' ? 'Право' :
                       course.category === 'ml' ? 'ML' :
                       course.category === 'business' ? 'Бизнес' :
                       course.category}
                    </span>
                  )}
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
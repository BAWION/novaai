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
}

export function OrbitalLayout({ onCourseSelect }: OrbitalLayoutProps) {
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

  // Группируем курсы по категориям
  const coursesByCategory: Record<string, Course[]> = {
    'ethics': courses.filter(c => c.category === 'ethics'),
    'law': courses.filter(c => c.category === 'law'),
    'ml': courses.filter(c => c.category === 'ml'),
    'tech': courses.filter(c => c.category === 'tech'),
    'business': courses.filter(c => c.category === 'business'),
    'other': courses.filter(c => !c.category || c.category === 'other')
  };

  // Определяем положение категорий на орбите (в градусах)
  const categoryPositions: Record<string, number> = {
    'ethics': 0,    // сверху (12 часов)
    'law': 90,      // справа (3 часа)
    'ml': 180,      // снизу (6 часов)
    'tech': 270,    // слева (9 часов)
    'business': 45, // между этикой и правом (1:30)
    'other': 225    // между технологией и ML (7:30)
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

      {/* Orbit paths */}
      <div 
        className="absolute rounded-full border border-white/10"
        style={{ 
          width: orbitRadius * 2, 
          height: orbitRadius * 2 
        }}
      />

      {/* Визуальные метки категорий */}
      {Object.entries(categoryPositions).map(([category, angle]) => {
        // Отображаем только метку, если в категории есть курсы
        if (coursesByCategory[category] && coursesByCategory[category].length > 0) {
          const { x, y } = calculateOrbitalPosition(orbitRadius, angle, -90);
          
          // Определяем цвет и иконку категории
          let categoryColor = "bg-white/10";
          let categoryIcon = "folder";
          
          if (category === 'ethics') {
            categoryColor = "bg-purple/30";
            categoryIcon = "balance-scale";
          } else if (category === 'law') {
            categoryColor = "bg-green/30";
            categoryIcon = "gavel";
          } else if (category === 'ml') {
            categoryColor = "bg-primary/30";
            categoryIcon = "brain";
          } else if (category === 'tech') {
            categoryColor = "bg-secondary/30";
            categoryIcon = "code";
          } else if (category === 'business') {
            categoryColor = "bg-accent/30";
            categoryIcon = "briefcase";
          }
          
          return (
            <div 
              key={`category-${category}`}
              className="absolute"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: "translate(-50%, -50%)",
                zIndex: 5
              }}
            >
              <div 
                className={`w-10 h-10 rounded-full ${categoryColor} flex items-center justify-center opacity-50`}
              >
                <i className={`fas fa-${categoryIcon} text-white/70 text-sm`}></i>
              </div>
            </div>
          );
        }
        return null;
      })}

      {/* Категории курсов, распределенные по орбите */}
      {Object.entries(coursesByCategory).map(([category, categoryCourses]) => {
        if (categoryCourses.length === 0) return null;
        
        // Для каждой категории готовим массив курсов
        return categoryCourses.map((course, courseIndex) => {
          // Рассчитываем смещение в градусах для каждого курса внутри категории
          const categoryAngle = categoryPositions[category] || 0;
          const totalCoursesInCategory = categoryCourses.length;
          let angleOffset = 0;
          
          if (totalCoursesInCategory > 1) {
            // Распределяем курсы в секторе ±30 градусов
            const sectorSize = 60; // общий сектор 60 градусов (±30)
            angleOffset = -30 + (courseIndex * sectorSize / (totalCoursesInCategory - 1));
          }
          
          // Итоговый угол для курса
          const angle = categoryAngle + angleOffset;
          const { x, y } = calculateOrbitalPosition(orbitRadius, angle, -90);
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
        });
      })}
    </div>
  );
}
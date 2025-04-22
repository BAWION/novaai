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
  const [orbitRadius, setOrbitRadius] = useState(150);

  // Adjust orbit radius based on container size
  useEffect(() => {
    function handleResize() {
      const containerWidth = document.getElementById('orbital-container')?.clientWidth || 300;
      setOrbitRadius(Math.min(containerWidth / 2 - 80, 220));
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

  // Apply different orbital speeds for each course
  const getCourseAnimationDuration = (index: number) => {
    // Between 100-200 seconds, different for each course
    return 100 + (index * 15);
  };

  // Get position along orbit
  const getPosition = (index: number, totalCourses: number) => {
    const angle = (index / totalCourses) * 360;
    return calculateOrbitalPosition(orbitRadius, angle);
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

      {/* Course nodes */}
      {courses.map((course, index) => {
        const angle = (index / courses.length) * 360;
        const { x, y } = calculateOrbitalPosition(orbitRadius, angle);
        const animDuration = getCourseAnimationDuration(index);
        const isHovered = hoveredCourse === course.id;

        // Map the level to a color
        const getLevelColor = () => {
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
                className={`w-14 h-14 rounded-full ${getLevelColor()} flex items-center justify-center mb-2 shadow-lg`}
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
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { OrbitalItem } from "@/components/ui/orbital-item";
import { courses, Course } from "@/lib/constants";

interface OrbitalLayoutProps {
  onCourseSelect?: (course: Course) => void;
}

export function OrbitalLayout({ onCourseSelect }: OrbitalLayoutProps) {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [positions, setPositions] = useState<Array<{ top: string; left: string }>>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  // Calculate positions for orbital items
  useEffect(() => {
    const updatePositions = () => {
      const orbitalContainer = document.getElementById('orbital-container');
      if (orbitalContainer) {
        const { width, height } = orbitalContainer.getBoundingClientRect();
        setContainerSize({ width, height });
        
        // Calculate positions for each course
        const newPositions = courses.map((_, index) => {
          // These are fixed positions matching the design
          const fixedPositions = [
            { top: "10%", left: "25%" },
            { top: "25%", left: "75%" },
            { top: "75%", left: "20%" },
            { top: "60%", left: "75%" },
            { top: "45%", left: "10%" }
          ];
          
          return fixedPositions[index % fixedPositions.length];
        });
        
        setPositions(newPositions);
      }
    };

    updatePositions();
    window.addEventListener('resize', updatePositions);
    
    return () => {
      window.removeEventListener('resize', updatePositions);
    };
  }, []);

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course.id);
    if (onCourseSelect) {
      onCourseSelect(course);
    }
  };

  return (
    <div 
      id="orbital-container" 
      className="relative w-full max-w-5xl mx-auto h-[600px] mb-10"
    >
      {/* Center hub element */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-br from-[#6E3AFF]/30 to-[#2EBAE1]/30 flex items-center justify-center animate-pulse">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6E3AFF] to-[#2EBAE1] flex items-center justify-center shadow-[0_0_15px_rgba(110,58,255,0.5)]">
          <i className="fas fa-graduation-cap text-xl"></i>
        </div>
      </div>

      {/* Orbital Items */}
      {courses.map((course, index) => (
        positions[index] && (
          <OrbitalItem
            key={course.id}
            title={course.title}
            description={course.description}
            icon={course.icon}
            modules={course.modules}
            level={course.level}
            color={course.color}
            style={{
              top: positions[index].top,
              left: positions[index].left,
            }}
            highlighted={course.id === selectedCourse}
            onClick={() => handleCourseClick(course)}
          />
        )
      ))}
    </div>
  );
}

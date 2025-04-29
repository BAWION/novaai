import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

export function ParticlesBackground() {
  const isMobile = useIsMobile();
  
  // Упрощенная версия - вместо частиц, чтобы избежать проблем с типами
  // используем просто градиентный фон
  return (
    <div className="fixed inset-0 -z-10 bg-[#0B0F1B] bg-gradient-to-b from-[#0B0F1B] to-[#141D33]">
      {/* Звезды */}
      <div className="absolute inset-0 overflow-hidden opacity-70">
        {Array.from({ length: isMobile ? 50 : 100 }).map((_, index) => {
          const size = Math.random() * 3 + 1;
          const top = Math.random() * 100;
          const left = Math.random() * 100;
          const animationDuration = 3 + Math.random() * 7;
          const color = Math.random() > 0.7 
            ? '#6E3AFF' 
            : Math.random() > 0.5 
              ? '#2EBAE1' 
              : '#FFFFFF';
          
          return (
            <div
              key={index}
              className="absolute rounded-full animate-pulse"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                top: `${top}%`,
                left: `${left}%`,
                backgroundColor: color,
                animationDuration: `${animationDuration}s`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
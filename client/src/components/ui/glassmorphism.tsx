import React from 'react';

interface GlassmorphismProps {
  children: React.ReactNode;
  className?: string;
}

export function Glassmorphism({ children, className = '' }: GlassmorphismProps) {
  return (
    <div className={`bg-white/10 backdrop-blur-md rounded-xl border border-white/20 ${className}`}>
      {children}
    </div>
  );
}
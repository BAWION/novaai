import React from 'react';
import { cn } from '@/lib/utils';

interface GlassmorphismProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
  children: React.ReactNode;
}

export function Glassmorphism({
  intensity = 'medium',
  className,
  children,
  ...props
}: GlassmorphismProps) {
  const getBgOpacity = () => {
    switch (intensity) {
      case 'low':
        return 'bg-black/10 backdrop-blur-sm';
      case 'high':
        return 'bg-black/40 backdrop-blur-xl';
      case 'medium':
      default:
        return 'bg-black/20 backdrop-blur-md';
    }
  };

  return (
    <div
      className={cn(
        getBgOpacity(),
        'border border-white/10 shadow-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
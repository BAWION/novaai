import React from "react";
import { cn } from "@/lib/utils";

interface GlassmorphismProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  borderGradient?: boolean;
}

const Glassmorphism = React.forwardRef<HTMLDivElement, GlassmorphismProps>(
  ({ children, className, borderGradient = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative bg-[rgba(26,37,58,0.25)] backdrop-blur-xl border border-white/10 overflow-hidden",
          className
        )}
        {...props}
      >
        {borderGradient && (
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6E3AFF] via-[#2EBAE1] to-[#FF3A8C]"></div>
        )}
        {children}
      </div>
    );
  }
);

Glassmorphism.displayName = "Glassmorphism";

export { Glassmorphism };

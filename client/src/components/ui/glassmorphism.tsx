import React from "react";
import { cn } from "@/lib/utils";

interface GlassmorphismProps {
  children: React.ReactNode;
  className?: string;
}

export const Glassmorphism = ({
  children,
  className,
}: GlassmorphismProps) => {
  return (
    <div
      className={cn(
        "relative bg-space-800/30 backdrop-blur-md border border-white/10",
        className
      )}
    >
      {children}
    </div>
  );
};
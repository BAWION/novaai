import React from "react";
import { cn } from "@/lib/utils";
import { calculateStrokeDashoffset } from "@/lib/utils";

interface ProgressRingProps {
  percent: number;
  size: number;
  strokeWidth: number;
  children?: React.ReactNode;
  className?: string;
}

export function ProgressRing({
  percent,
  size,
  strokeWidth,
  children,
  className
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = calculateStrokeDashoffset(percent, circumference);

  return (
    <div className={cn("relative inline-block", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-in-out"
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
import React, { useEffect, useState } from "react";
import { cn, calculateStrokeDashoffset } from "@/lib/utils";

interface ProgressRingProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
}

export function ProgressRing({
  percent,
  size = 60,
  strokeWidth = 6,
  className,
  children,
}: ProgressRingProps) {
  const [offset, setOffset] = useState(0);
  
  // Calculate the properties of the circle
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  useEffect(() => {
    const progressOffset = calculateStrokeDashoffset(percent, circumference);
    setOffset(progressOffset);
  }, [percent, circumference]);

  return (
    <div className={cn("relative inline-block", className)}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-space-700"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-transparent transition-all duration-500 ease-in-out"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2EBAE1" />
            <stop offset="100%" stopColor="#6E3AFF" />
          </linearGradient>
        </defs>
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateProgress(currentStep: number, totalSteps: number): number {
  return Math.floor((currentStep / totalSteps) * 100);
}

export function generateStarryBackground(): string {
  return `radial-gradient(1px 1px at ${Math.floor(Math.random() * 100)}px ${Math.floor(
    Math.random() * 100
  )}px, white, rgba(255, 255, 255, 0)),
  radial-gradient(1px 1px at ${Math.floor(Math.random() * 100)}px ${Math.floor(
    Math.random() * 100
  )}px, white, rgba(255, 255, 255, 0)),
  radial-gradient(1px 1px at ${Math.floor(Math.random() * 100)}px ${Math.floor(
    Math.random() * 100
  )}px, white, rgba(255, 255, 255, 0)),
  radial-gradient(1.5px 1.5px at ${Math.floor(Math.random() * 100)}px ${Math.floor(
    Math.random() * 100
  )}px, white, rgba(255, 255, 255, 0)),
  radial-gradient(1.5px 1.5px at ${Math.floor(Math.random() * 100)}px ${Math.floor(
    Math.random() * 100
  )}px, white, rgba(255, 255, 255, 0))`;
}

export function calculateStrokeDashoffset(percent: number, circumference: number): number {
  const offset = circumference - (percent / 100) * circumference;
  return offset;
}

// Function to calculate position for orbital items in a circle
export function calculateOrbitalPosition(
  index: number,
  total: number,
  radius: number,
  centerX: number = 50,
  centerY: number = 50
): { top: string; left: string } {
  const angle = (index / total) * Math.PI * 2;
  const x = centerX + radius * Math.cos(angle);
  const y = centerY + radius * Math.sin(angle);
  
  return {
    top: `${y}%`,
    left: `${x}%`,
  };
}

// Helper for calculating the angle between two points
export function calculateAngle(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
}

// Helper for calculating the distance between two points
export function calculateDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

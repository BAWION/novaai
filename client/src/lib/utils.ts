import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Проверка устройства на мобильное
export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768
}

// Определить размер компонента в зависимости от устройства
export function getResponsiveSize() {
  return isMobile() ? 'mobile' : 'default'
}

// Рассчитать прогресс в процентах
export function calculateProgress(current: number, total: number): number {
  if (total <= 0) return 0
  return Math.min(100, Math.round((current / total) * 100))
}

// Вычислить смещение для круговой диаграммы прогресса
export function calculateStrokeDashoffset(percent: number, circumference: number): number {
  const offset = circumference - (percent / 100) * circumference;
  return offset;
}

// Рассчитать положение объекта на орбите
export function calculateOrbitalPosition(radius: number, angleDegrees: number): { x: number, y: number } {
  const angleRad = (angleDegrees - 90) * (Math.PI / 180); // Convert to radians, offset to start from top
  return {
    x: radius * Math.cos(angleRad),
    y: radius * Math.sin(angleRad)
  };
}

// Рассчитать угол между двумя точками
export function calculateAngle(x1: number, y1: number, x2: number, y2: number): number {
  return Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
}

// Рассчитать расстояние между двумя точками
export function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// Добавить обработку тач-событий для элемента
export function addTouchFeedback(element: HTMLElement) {
  if (!element) return
  
  element.classList.add('tap-highlight-none')
  
  element.addEventListener('touchstart', () => {
    element.style.opacity = '0.8'
    element.style.transform = 'scale(0.98)'
  })
  
  element.addEventListener('touchend', () => {
    element.style.opacity = '1'
    element.style.transform = 'scale(1)'
  })
}
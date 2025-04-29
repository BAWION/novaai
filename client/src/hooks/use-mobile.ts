import { useState, useEffect } from "react";

/**
 * Хук для определения, является ли текущее отображение мобильным
 * @param breakpoint Ширина экрана в пикселях, ниже которой считается мобильным устройством
 * @returns boolean, true если устройство мобильное
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Функция для проверки размера экрана
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Инициализация при первом рендере
    checkIsMobile();

    // Добавляем слушатель события изменения размера окна
    window.addEventListener("resize", checkIsMobile);

    // Очистка при размонтировании
    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, [breakpoint]);

  return isMobile;
}
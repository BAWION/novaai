import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Упрощенная регистрация сервис-воркера для Vercel
const registerSimpleServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker-simple.js')
        .then((registration) => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch((error) => {
          console.log('ServiceWorker registration failed: ', error);
        });
    });
  }
};
import { setupFullscreenEvents, isMobile } from "./lib/fullscreen-helper";
import { setupMobileOptimization } from "./lib/mobile-helper";

// Add FontAwesome script
const fontAwesomeScript = document.createElement("script");
fontAwesomeScript.src = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/js/all.min.js";
document.head.appendChild(fontAwesomeScript);

// Add Particles.js script
const particlesScript = document.createElement("script");
particlesScript.src = "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js";
document.head.appendChild(particlesScript);

// Инициализация мобильного режима и PWA функционала
if (typeof window !== 'undefined') {
  // Запускаем настройки для мобильных устройств
  if (isMobile()) {
    // Применяем улучшения для мобильных устройств
    window.addEventListener('load', () => {
      // Настраиваем fullscreen-helper
      setupFullscreenEvents();
      
      // Настраиваем дополнительные мобильные оптимизации
      setupMobileOptimization();
      
      // Отключаем кеширование при переключении между страницами
      window.onpageshow = function(event) {
        if (event.persisted) {
          window.location.reload();
        }
      };
      
      // Разрешаем стандартный скроллинг на мобильных устройствах
      // Предотвращаем только масштабирование пинчем, но не блокируем скроллинг
      document.addEventListener('touchmove', function(event: TouchEvent) {
        // Только если это жест масштабирования (pinch zoom)
        if ((event.touches.length > 1) && ((event as any).scale && (event as any).scale !== 1)) { 
          event.preventDefault(); 
        }
      }, { passive: false });
      
      // Улучшение отзывчивости касаний для всех элементов
      document.addEventListener('touchstart', function() {}, { passive: true });
    });
    
    // Добавляем классы для мобильного режима
    document.body.classList.add('mobile-device', 'fullscreen-mode');
    
    // Если мобильное устройство в PWA режиме
    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone || 
        window.location.search.includes('pwa=true') ||
        window.location.search.includes('fullscreen=true')) {
      document.body.classList.add('pwa-mode');
    }
  }
}

// Регистрируем упрощенный Service Worker для стабильной работы на Vercel
if (process.env.NODE_ENV === 'production') {
  registerSimpleServiceWorker();
}

createRoot(document.getElementById("root")!).render(<App />);

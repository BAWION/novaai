import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { registerServiceWorker } from "./lib/pwa-utils";
import { setupFullscreenEvents, isMobile } from "./lib/fullscreen-helper";

// Add FontAwesome script
const fontAwesomeScript = document.createElement("script");
fontAwesomeScript.src = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/js/all.min.js";
document.head.appendChild(fontAwesomeScript);

// Add Particles.js script
const particlesScript = document.createElement("script");
particlesScript.src = "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js";
document.head.appendChild(particlesScript);

// Инициализация полноэкранного режима и PWA функционала
if (typeof window !== 'undefined') {
  // Запускаем настройки полноэкранного режима для мобильных устройств
  if (isMobile()) {
    window.addEventListener('load', setupFullscreenEvents);
    
    // Добавляем класс для полноэкранного режима
    document.body.classList.add('fullscreen-mode');
    
    // Если мобильное устройство с PWA режимом
    if (window.matchMedia('(display-mode: standalone)').matches || 
        window.navigator.standalone || 
        window.location.search.includes('pwa=true') ||
        window.location.search.includes('fullscreen=true')) {
      document.body.classList.add('pwa-mode');
    }
  }
}

// Регистрируем Service Worker для PWA функционала
// Только в production окружении, чтобы избежать проблем с кэшированием в режиме разработки
if (import.meta.env.PROD) {
  registerServiceWorker();
}

createRoot(document.getElementById("root")!).render(<App />);

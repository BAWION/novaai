/**
 * Утилиты для работы с мобильными устройствами
 */

// Проверка на использование PWA (Progressive Web App)
export function isPwa(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator as any).standalone || 
         document.referrer.includes('android-app://');
}

// Добавление классов для мобильной оптимизации
export function setupMobileOptimization(): void {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    document.body.classList.add('mobile-device');
    
    if (isPwa()) {
      document.body.classList.add('pwa-mode');
    }
    
    // Отключаем масштабирование для лучшего UX
    disableZoom();
    
    // Применяем фиксы для мобильных устройств
    applyMobileFixes();
  }
}

// Отключение масштабирования для мобильных устройств
function disableZoom(): void {
  const viewportMeta = document.querySelector('meta[name="viewport"]');
  if (viewportMeta) {
    viewportMeta.setAttribute('content', 
      'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
  }
}

// Исправления известных проблем мобильных устройств
function applyMobileFixes(): void {
  // Фикс для предотвращения подсветки при нажатии
  document.addEventListener('touchstart', function() {}, { passive: true });
  
  // Улучшенная обработка скролла на iOS
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    document.documentElement.style.setProperty('height', '100%', 'important');
    document.body.style.setProperty('height', '100%', 'important');
    // Убираем блокировку скроллинга, которая мешала прокрутке на iOS
    document.documentElement.style.setProperty('overflow', 'auto', 'important');
    document.body.style.setProperty('overflow', 'auto', 'important');
    document.body.style.setProperty('-webkit-overflow-scrolling', 'touch', 'important');
  }
  
  // Исправление для soft keyboard на iOS
  const inputs = document.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 50);
    });
    
    input.addEventListener('blur', () => {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 50);
    });
  });
}

// Улучшенный обработчик клика для мобильных устройств
export function addMobileTapHandler(
  element: HTMLElement,
  handler: (e: Event) => void
): void {
  if (!element) return;
  
  // Добавляем классы для улучшенного взаимодействия
  element.classList.add('tap-highlight-none');
  
  // Эффект при нажатии
  element.addEventListener('touchstart', () => {
    element.style.opacity = '0.8';
    element.style.transform = 'scale(0.98)';
  }, { passive: true });
  
  // Возврат к нормальному состоянию
  element.addEventListener('touchend', (e) => {
    element.style.opacity = '1';
    element.style.transform = 'scale(1)';
    handler(e);
  });
  
  // Для случая, если пользователь отменил нажатие
  element.addEventListener('touchcancel', () => {
    element.style.opacity = '1';
    element.style.transform = 'scale(1)';
  }, { passive: true });
}

// Проверка ориентации экрана
export function isPortrait(): boolean {
  return window.matchMedia("(orientation: portrait)").matches;
}

// Переключение в полноэкранный режим (для видео и т.д.)
export function toggleFullscreen(element: HTMLElement = document.documentElement): void {
  if (!document.fullscreenElement) {
    element.requestFullscreen().catch(err => {
      console.error(`Ошибка при переключении в полноэкранный режим: ${err.message}`);
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}
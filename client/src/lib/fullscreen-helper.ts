/**
 * fullscreen-helper.ts
 * Утилиты для обработки полноэкранного режима на мобильных устройствах
 */

/**
 * Скрывает адресную строку браузера
 */
export function hideAddressBar() {
  if (typeof window === 'undefined') return;
  
  // Проверяем, запущено ли приложение как PWA
  const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                window.matchMedia('(display-mode: fullscreen)').matches || 
                (window.navigator as any).standalone || 
                window.location.search.includes('pwa=true');
  
  // Для iOS PWA не нужно скрывать адресную строку
  if ((/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream) && isPWA) {
    return;
  }
  
  setTimeout(() => {
    window.scrollTo(0, 1);
    
    // Для Android
    if (/Android/i.test(navigator.userAgent)) {
      document.documentElement.style.height = 'calc(100% + 1px)';
      setTimeout(() => {
        document.documentElement.style.height = '100%';
        window.scrollTo(0, 1);
      }, 300);
    }
    
    // Для iOS Safari
    if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream) {
      document.body.style.height = window.innerHeight + 'px';
      // Повторяем попытку несколько раз
      setTimeout(() => window.scrollTo(0, 1), 300);
      setTimeout(() => window.scrollTo(0, 1), 500);
      setTimeout(() => window.scrollTo(0, 1), 1000);
    }
  }, 100);
}

/**
 * Запрашивает полноэкранный режим, если доступен
 */
export function requestFullscreen() {
  if (typeof document === 'undefined') return false;
  
  // Проверяем, запущено ли приложение как PWA
  if (typeof window !== 'undefined') {
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                  window.matchMedia('(display-mode: fullscreen)').matches || 
                  (window.navigator as any).standalone;
    
    // В режиме PWA уже должен быть полноэкранный режим
    if (isPWA) return true;
  }
  
  const docEl = document.documentElement;
  
  // Проверяем наличие API полноэкранного режима
  const requestFullScreen = 
    docEl.requestFullscreen || 
    (docEl as any).webkitRequestFullscreen || 
    (docEl as any).mozRequestFullScreen || 
    (docEl as any).msRequestFullscreen;
    
  if (requestFullScreen) {
    try {
      requestFullScreen.call(docEl);
      return true;
    } catch (err) {
      console.warn('Fullscreen request failed:', err);
      return false;
    }
  }
  
  return false;
}

/**
 * Проверяет, находится ли приложение в полноэкранном режиме
 */
export function isFullscreen(): boolean {
  if (typeof document === 'undefined') return false;
  
  return !!(
    document.fullscreenElement || 
    (document as any).webkitFullscreenElement || 
    (document as any).mozFullScreenElement || 
    (document as any).msFullscreenElement
  );
}

/**
 * Устанавливает обработчики событий для предотвращения появления адресной строки
 */
export function setupFullscreenHandlers() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  
  // Обработчик свайпа вниз
  document.addEventListener('touchstart', (e) => {
    if (e.touches[0].clientY < 50 && window.scrollY <= 0) {
      e.preventDefault();
    }
  }, { passive: false });
  
  // Обработчики событий для скрытия адресной строки
  window.addEventListener('load', hideAddressBar);
  window.addEventListener('orientationchange', () => {
    setTimeout(hideAddressBar, 300);
  });
  window.addEventListener('resize', hideAddressBar);
  
  // Периодически пытаемся скрыть адресную строку
  // на устройствах где она может появиться снова
  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    setInterval(hideAddressBar, 2000);
  }
}

/**
 * Проверяет, запущено ли приложение как PWA
 */
export function isPWA(): boolean {
  if (typeof window === 'undefined') return false;
  
  return !!(
    window.matchMedia('(display-mode: standalone)').matches || 
    window.matchMedia('(display-mode: fullscreen)').matches || 
    (window.navigator as any).standalone || 
    window.location.search.includes('pwa=true')
  );
}

/**
 * Инициализирует все необходимые обработчики и настройки
 * для работы в полноэкранном режиме
 */
export function initializeFullscreenMode() {
  setupFullscreenHandlers();
  
  // На некоторых устройствах может потребоваться задержка
  setTimeout(hideAddressBar, 500);
  
  // Пытаемся запросить полноэкранный режим для мобильных устройств
  // если это не PWA и браузер поддерживает такую функцию
  if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) && !isPWA()) {
    // Запрашиваем на первое взаимодействие пользователя
    document.addEventListener('touchstart', function requestFullOnTouch() {
      requestFullscreen();
      document.removeEventListener('touchstart', requestFullOnTouch);
    }, { once: true, passive: true });
  }
  
  // Добавляем класс к body для применения специфичных стилей
  if (typeof document !== 'undefined') {
    document.body.classList.add('fullscreen-mode');
    
    // Добавляем класс pwa, если приложение запущено как PWA
    if (isPWA()) {
      document.body.classList.add('pwa-mode');
    }
  }
}
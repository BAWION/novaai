/**
 * fullscreen-helper.ts
 * Утилиты для обработки полноэкранного режима на мобильных устройствах
 */

/**
 * Скрывает адресную строку браузера
 */
export function hideAddressBar() {
  if (typeof window === 'undefined') return;
  
  setTimeout(() => {
    window.scrollTo(0, 1);
  }, 0);
}

/**
 * Запрашивает полноэкранный режим, если доступен
 */
export function requestFullscreen() {
  if (typeof document === 'undefined') return false;
  
  const docEl = document.documentElement;
  
  // Проверяем наличие API полноэкранного режима
  const requestFullScreen = 
    docEl.requestFullscreen || 
    (docEl as any).webkitRequestFullscreen || 
    (docEl as any).mozRequestFullScreen || 
    (docEl as any).msRequestFullscreen;
    
  if (requestFullScreen) {
    requestFullScreen.call(docEl);
    return true;
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
 * Инициализирует все необходимые обработчики и настройки
 * для работы в полноэкранном режиме
 */
export function initializeFullscreenMode() {
  setupFullscreenHandlers();
  
  // На некоторых устройствах может потребоваться задержка
  setTimeout(hideAddressBar, 500);
  
  // Добавляем класс к body для применения специфичных стилей
  if (typeof document !== 'undefined') {
    document.body.classList.add('fullscreen-mode');
  }
}
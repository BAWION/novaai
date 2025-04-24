/**
 * Агрессивный хелпер для полноэкранного режима
 * Использует множественные техники для всех браузеров
 */

// Проверка на PWA режим
export const isPWA = (): boolean => {
  return !!(
    window.matchMedia('(display-mode: standalone)').matches || 
    window.matchMedia('(display-mode: fullscreen)').matches || 
    window.navigator.standalone || 
    window.location.search.includes('pwa=true') ||
    window.location.search.includes('fullscreen=true')
  );
};

// Проверка на мобильное устройство
export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

// Проверка на iOS устройство
export const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
};

// Запрос полноэкранного режима с максимальным приоритетом
export const requestFullscreen = () => {
  const elem = document.documentElement;
  
  // Добавляем класс полноэкранного режима
  document.body.classList.add('fullscreen-mode');
  
  // Стандартные методы запроса полноэкранного режима
  try {
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(() => {
        forceFullscreenFallback();
      });
    } else if ((elem as any).webkitRequestFullscreen) {
      (elem as any).webkitRequestFullscreen();
    } else if ((elem as any).mozRequestFullScreen) {
      (elem as any).mozRequestFullScreen();
    } else if ((elem as any).msRequestFullscreen) {
      (elem as any).msRequestFullscreen();
    } else {
      forceFullscreenFallback();
    }
  } catch (error) {
    console.warn('Fullscreen API failed, using fallback methods');
    forceFullscreenFallback();
  }
  
  // Если мы на iOS, применяем специальные методы для iOS
  if (isIOS()) {
    iosFullscreenWorkaround();
  }
  
  // Скрываем адресную строку
  hideAddressBar();
};

// Принудительные методы для iOS
const iosFullscreenWorkaround = () => {
  // Устанавливаем размер тела документа
  document.body.style.height = window.innerHeight + 'px';
  document.body.style.width = window.innerWidth + 'px';
  
  // Добавляем специальные классы для iOS
  document.body.classList.add('ios-device');
  
  // Если это PWA, добавляем еще один класс
  if (window.navigator.standalone) {
    document.body.classList.add('ios-standalone');
  }
  
  // Повторяем скрытие адресной строки
  setTimeout(() => window.scrollTo(0, 1), 100);
  setTimeout(() => window.scrollTo(0, 1), 300);
  setTimeout(() => window.scrollTo(0, 1), 500);
  setTimeout(() => window.scrollTo(0, 1), 1000);
  setTimeout(() => window.scrollTo(0, 1), 2000);
};

// Резервный метод для стимуляции полноэкранного режима
const forceFullscreenFallback = () => {
  const body = document.body;
  
  // Устанавливаем стиль для имитации полноэкранного режима
  body.style.position = 'fixed';
  body.style.top = '0';
  body.style.left = '0';
  body.style.right = '0';
  body.style.bottom = '0';
  body.style.width = '100vw';
  body.style.height = '100vh';
  body.style.zIndex = '9999';
  body.style.backgroundColor = '#0e101c';
  
  // Добавляем класс для CSS правил
  body.classList.add('fullscreen-mode');
  
  // Скрываем адресную строку
  hideAddressBar();
};

// Агрессивное скрытие адресной строки
export const hideAddressBar = () => {
  // Скрытие адресной строки с помощью прокрутки
  window.scrollTo(0, 1);
  
  // Для Android устройств
  if (/Android/i.test(navigator.userAgent)) {
    // Растягиваем документ и затем скрываем адресную строку
    document.documentElement.style.height = 'calc(100% + 1px)';
    setTimeout(() => {
      document.documentElement.style.height = '100%';
      window.scrollTo(0, 1);
    }, 100);
  }
};

// Выход из полноэкранного режима
export const exitFullscreen = () => {
  document.body.classList.remove('fullscreen-mode');
  
  try {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {
        console.log('Could not exit fullscreen mode');
      });
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
      (document as any).mozCancelFullScreen();
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
    }
  } catch (error) {
    console.warn('Error exiting fullscreen:', error);
  }
  
  // Сброс принудительных стилей
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.bottom = '';
  document.body.style.width = '';
  document.body.style.height = '';
  document.body.style.zIndex = '';
};

// Проверка доступности полноэкранного режима
export const isFullscreenEnabled = (): boolean => {
  return !!(
    document.fullscreenEnabled ||
    (document as any).webkitFullscreenEnabled ||
    (document as any).mozFullScreenEnabled ||
    (document as any).msFullscreenEnabled
  );
};

// Проверка нахождения в полноэкранном режиме
export const isInFullscreenMode = (): boolean => {
  return !!(
    document.fullscreenElement ||
    (document as any).webkitFullscreenElement ||
    (document as any).mozFullScreenElement ||
    (document as any).msFullscreenElement ||
    document.body.classList.contains('fullscreen-mode') ||
    isPWA()
  );
};

// Установка обработчиков событий для полноэкранного режима при загрузке
export const setupFullscreenEvents = () => {
  // Если это мобильное устройство, добавляем события
  if (isMobile()) {
    // Добавляем обработчик для входа в полноэкранный режим
    document.addEventListener('click', requestFullscreen, { once: true });
    document.addEventListener('touchend', requestFullscreen, { once: true });
    
    // Регулярно проверяем и скрываем адресную строку
    setInterval(hideAddressBar, 2000);
    
    // Добавляем обработчики для блокировки жестов браузера
    document.addEventListener('touchstart', (e) => {
      if (
        e.touches.length > 1 || // Мультитач
        (e.touches[0].clientY < 50 && window.scrollY <= 0) || // Свайп вниз в верхней части
        (e.touches[0].clientY > window.innerHeight - 50 && 
         window.scrollY + window.innerHeight >= document.body.scrollHeight) // Свайп вверх в нижней части
      ) {
        e.preventDefault();
      }
    }, { passive: false });
    
    // Для iOS устройств добавляем специальные обработчики
    if (isIOS()) {
      document.addEventListener('gesturestart', (e) => {
        e.preventDefault();
      }, { passive: false });
      
      window.addEventListener('resize', () => {
        document.body.style.height = window.innerHeight + 'px';
      });
    }
  }
};
/**
 * Регистрирует Service Worker для PWA функционала
 */
export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('ServiceWorker registration successful with scope:', registration.scope);
      
      // Обновление Service Worker если есть обновление
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showUpdateNotification(() => {
                if (newWorker.state === 'installed') {
                  // Сообщаем ServiceWorker что можно обновляться
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                }
              });
            }
          });
        }
      });
    } catch (error) {
      console.log('ServiceWorker registration failed:', error);
    }
  }
}

/**
 * Показывает уведомление о наличии обновления
 */
function showUpdateNotification(onAccept: () => void) {
  const updateNotification = document.createElement('div');
  updateNotification.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 max-w-sm w-full bg-space-800 border border-[#6E3AFF]/30 rounded-lg p-4 shadow-lg z-50';
  updateNotification.innerHTML = `
    <div class="flex items-start">
      <div class="flex-1">
        <h3 class="font-medium text-white">Доступно обновление</h3>
        <p class="text-sm text-white/70 mt-1">Новая версия NovaAI University доступна. Обновить сейчас?</p>
      </div>
      <div class="ml-3 flex space-x-2">
        <button id="update-later" class="px-3 py-1 rounded bg-white/10 text-white/70 text-sm">Позже</button>
        <button id="update-now" class="px-3 py-1 rounded bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] text-white text-sm">Обновить</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(updateNotification);
  
  document.getElementById('update-now')?.addEventListener('click', () => {
    onAccept();
    updateNotification.remove();
    
    // Перезагрузка страницы для применения обновления
    window.location.reload();
  });
  
  document.getElementById('update-later')?.addEventListener('click', () => {
    updateNotification.remove();
  });
}

/**
 * Проверяет, поддерживается ли установка PWA
 */
export function getPWADisplayMode() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  if (document.referrer.startsWith('android-app://')) {
    return 'twa';
  } else if ((navigator as any).standalone || isStandalone) {
    return 'standalone';
  }
  return 'browser';
}

/**
 * Проверяет возможность установки PWA и показывает кнопку установки
 */
export function setupInstallPrompt(onCanInstall: () => void) {
  let deferredPrompt: any;
  
  // Сохраняем событие на потом
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    onCanInstall();
  });
  
  // Возвращаем функцию для запуска процесса установки
  return async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      deferredPrompt = null;
    }
  };
}

/**
 * Сохраняет ресурсы урока в кэш для офлайн-доступа
 * @param lessonId ID урока
 * @param resources Массив URL ресурсов для кэширования
 */
export async function cacheLessonForOffline(lessonId: number, resources: string[]): Promise<{ success: boolean, error?: string }> {
  if (!navigator.serviceWorker.controller) {
    return { 
      success: false, 
      error: 'Service Worker не активен' 
    };
  }
  
  return new Promise((resolve) => {
    const messageChannel = new MessageChannel();
    
    messageChannel.port1.onmessage = (event) => {
      if (event.data.error) {
        resolve({ 
          success: false, 
          error: event.data.error 
        });
      } else {
        resolve({
          success: true
        });
      }
    };
    
    const controller = navigator.serviceWorker.controller;
    if (controller) {
      controller.postMessage({
        type: 'CACHE_LESSON',
        lessonId,
        resources
      }, [messageChannel.port2]);
    } else {
      resolve({
        success: false,
        error: 'Service Worker контроллер не найден'
      });
    }
  });
}

/**
 * Проверяет доступность офлайн-режима
 */
export async function checkOfflineAvailability(): Promise<boolean> {
  return 'caches' in window && 'serviceWorker' in navigator && !!navigator.serviceWorker.controller;
}

/**
 * Инициирует фоновую синхронизацию данных
 */
export async function requestBackgroundSync() {
  if ('serviceWorker' in navigator && 'SyncManager' in window) {
    const registration = await navigator.serviceWorker.ready;
    try {
      // Используем приведение типов, поскольку интерфейс background sync
      // не полностью определен в TypeScript
      await (registration as any).sync.register('sync-user-progress');
      return true;
    } catch {
      return false;
    }
  }
  return false;
}
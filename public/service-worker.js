const CACHE_NAME = 'novaai-university-v1';
const OFFLINE_PAGE = '/offline.html';

// Ресурсы для предварительного кэширования 
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/login',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Установка Service Worker
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Pre-caching assets');
        // Предварительное кэширование базовых ресурсов
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        // Активация без ожидания других вкладок
        return self.skipWaiting();
      })
  );
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  
  event.waitUntil(
    // Удаление старых кэшей
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
    .then(() => {
      // Захват управления всеми вкладками
      return self.clients.claim();
    })
  );
});

// Обработка запросов 
self.addEventListener('fetch', (event) => {
  // Пропускаем запросы API и внешние ресурсы
  const url = new URL(event.request.url);
  
  // Не перехватываем API-запросы
  if (url.pathname.startsWith('/api/')) {
    return;
  }
  
  // Стратегия "Сначала сеть, потом кэш" для HTML-запросов (навигация)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // Если нет соединения, возвращаем оффлайн-страницу
          return caches.match(OFFLINE_PAGE);
        })
    );
    return;
  }
  
  // Стратегия "Сначала кэш, потом сеть" для остальных запросов
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Если ресурс найден в кэше, возвращаем его 
        if (response) {
          return response;
        }
        
        // Иначе делаем запрос к сети
        return fetch(event.request)
          .then((networkResponse) => {
            // Если ответ валиден, сохраняем в кэш
            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
              const clonedResponse = networkResponse.clone();
              
              caches.open(CACHE_NAME)
                .then((cache) => {
                  // Проверяем схему URL перед кэшированием
                  if (event.request.url.startsWith('http')) {
                    cache.put(event.request, clonedResponse);
                  }
                })
                .catch(err => console.log('Cache put error:', err));
            }
            
            return networkResponse;
          })
          .catch(() => {
            // Для изображений можно вернуть заглушку
            if (event.request.destination === 'image') {
              return caches.match('/icons/icon-placeholder.png');
            }
            
            // Для других ресурсов возвращаем ошибку
            return Promise.reject('Нет соединения');
          });
      })
  );
});

// Синхронизация данных в фоне
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-user-progress') {
    event.waitUntil(syncUserProgress());
  }
});

// Кэширование ресурсов урока
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_LESSON') {
    const { lessonId, resources } = event.data;
    
    event.waitUntil(
      caches.open(`lesson-${lessonId}`)
        .then((cache) => {
          return Promise.all(
            resources.map(url => {
              return fetch(url)
                .then(response => {
                  if (response.ok) {
                    return cache.put(url, response);
                  }
                  throw new Error(`Не удалось загрузить: ${url}`);
                });
            })
          );
        })
        .then(() => {
          // Сообщаем об успешном кэшировании
          if (event.ports && event.ports[0]) {
            event.ports[0].postMessage({ success: true });
          }
        })
        .catch((error) => {
          console.error('Ошибка кэширования урока:', error);
          if (event.ports && event.ports[0]) {
            event.ports[0].postMessage({ 
              success: false, 
              error: error.message 
            });
          }
        })
    );
  } else if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Оповещения Push Notifications
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/'
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Обработка клика по уведомлению
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});

// Функция синхронизации прогресса пользователя
async function syncUserProgress() {
  const offlineData = await getOfflineData();
  
  if (!offlineData || !offlineData.length) {
    return Promise.resolve();
  }
  
  // Пытаемся отправить накопленный прогресс на сервер
  try {
    const response = await fetch('/api/user-progress/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ progress: offlineData })
    });
    
    if (response.ok) {
      await clearOfflineData();
      return Promise.resolve();
    } else {
      return Promise.reject('Ошибка синхронизации');
    }
  } catch (error) {
    return Promise.reject(error);
  }
}

// Получение данных прогресса из IndexedDB
async function getOfflineData() {
  // В реальном приложении здесь будет получение из IndexedDB
  return [];
}

// Очистка данных из IndexedDB
async function clearOfflineData() {
  // В реальном приложении здесь будет очистка данных из IndexedDB
  return Promise.resolve();
}
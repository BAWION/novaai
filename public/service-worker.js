const CACHE_NAME = 'novai-university-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// В фазе установки кэшируем основные ресурсы
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Стратегия сначала кэш, потом сеть
self.addEventListener('fetch', (event) => {
  // Пропускаем запросы к API
  if (event.request.url.includes('/api/')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Возвращаем кэшированный ответ, если он есть
        if (response) {
          return response;
        }
        
        // Если нет в кэше - делаем запрос
        return fetch(event.request).then(
          (response) => {
            // Проверяем, что получили валидный ответ
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Клонируем ответ, т.к. он может быть использован только один раз
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                // Кэшируем новый ресурс
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Очистка старых кэшей при активации
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Получение обновлений
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Сохранение уроков для оффлайн-режима
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_LESSON') {
    const { lessonId, resources } = event.data;
    const LESSON_CACHE = `lesson-${lessonId}`;
    
    caches.open(LESSON_CACHE).then((cache) => {
      cache.addAll(resources).then(() => {
        event.ports[0].postMessage({ success: true });
      }).catch((error) => {
        event.ports[0].postMessage({ 
          success: false, 
          error: error.message 
        });
      });
    });
  }
});

// Фоновая синхронизация
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-user-progress') {
    event.waitUntil(syncUserProgress());
  }
});

async function syncUserProgress() {
  // Имитация синхронизации прогресса пользователя
  if ('indexedDB' in self) {
    // Тут будет реальная логика синхронизации с IDB
    console.log('Синхронизация прогресса пользователя');
  }
}
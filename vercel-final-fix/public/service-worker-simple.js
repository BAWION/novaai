// Упрощенный сервис-воркер для стабильной работы на Vercel
const CACHE_NAME = 'novaai-v1';
const urlsToCache = [
  '/',
  '/offline.html'
];

// Установка сервис-воркера
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log('Cache install error:', error);
      })
  );
});

// Активация сервис-воркера
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Обработка запросов
self.addEventListener('fetch', (event) => {
  // Пропускаем chrome-extension и другие нестандартные схемы
  if (!event.request.url.startsWith('http')) {
    return;
  }

  // Пропускаем API запросы
  if (event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Проверяем валидность ответа
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Клонируем ответ для кэширования
        const responseToCache = response.clone();

        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseToCache);
          })
          .catch((error) => {
            console.log('Cache put error:', error);
          });

        return response;
      })
      .catch(() => {
        // Возвращаем из кэша при ошибке сети
        return caches.match(event.request)
          .then((response) => {
            if (response) {
              return response;
            }
            // Возвращаем offline страницу для навигационных запросов
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
          });
      })
  );
});
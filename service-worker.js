const CACHE_NAME = 'novaai-university-v1';

// Файлы, которые должны быть доступны в оффлайн-режиме
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/index-replit.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Установка Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker установлен');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker активирован');
  
  // Удаляем старые кэши
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Стратегия кэширования: Network First, затем Cache
self.addEventListener('fetch', (event) => {
  // Обрабатываем только GET-запросы
  if (event.request.method !== 'GET') return;
  
  // Игнорируем API-запросы
  if (event.request.url.includes('/api/')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Сохраняем копию ответа в кэше
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Если сеть недоступна, используем кэш
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Для навигационных запросов возвращаем оффлайн-страницу
            if (event.request.mode === 'navigate') {
              return caches.match('/index-replit.html');
            }
            
            return new Response('Нет сетевого подключения');
          });
      })
  );
});

// Синхронизация данных при восстановлении соединения
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-user-progress') {
    event.waitUntil(syncUserProgress());
  }
});

// Собираем данные для синхронизации из локального хранилища
async function syncUserProgress() {
  try {
    const offlineData = await getOfflineData();
    
    if (offlineData && offlineData.length > 0) {
      // Отправляем данные на сервер
      await fetch('/api/sync-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: offlineData })
      });
      
      // Очищаем локальное хранилище
      await clearOfflineData();
    }
  } catch (error) {
    console.error('Ошибка синхронизации:', error);
  }
}

// Получение накопленных оффлайн-данных
async function getOfflineData() {
  return new Promise((resolve) => {
    const openRequest = indexedDB.open('NovaAiOfflineDB', 1);
    
    openRequest.onupgradeneeded = function() {
      const db = openRequest.result;
      if (!db.objectStoreNames.contains('userProgress')) {
        db.createObjectStore('userProgress', { keyPath: 'id', autoIncrement: true });
      }
    };
    
    openRequest.onsuccess = function() {
      const db = openRequest.result;
      const transaction = db.transaction('userProgress', 'readonly');
      const store = transaction.objectStore('userProgress');
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = function() {
        resolve(getAllRequest.result);
      };
      
      getAllRequest.onerror = function() {
        resolve([]);
      };
    };
    
    openRequest.onerror = function() {
      resolve([]);
    };
  });
}

// Очистка сохраненных оффлайн-данных
async function clearOfflineData() {
  return new Promise((resolve) => {
    const openRequest = indexedDB.open('NovaAiOfflineDB', 1);
    
    openRequest.onsuccess = function() {
      const db = openRequest.result;
      const transaction = db.transaction('userProgress', 'readwrite');
      const store = transaction.objectStore('userProgress');
      const clearRequest = store.clear();
      
      clearRequest.onsuccess = function() {
        resolve(true);
      };
      
      clearRequest.onerror = function() {
        resolve(false);
      };
    };
    
    openRequest.onerror = function() {
      resolve(false);
    };
  });
}
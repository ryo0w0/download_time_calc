// Service Worker for PWA
const CACHE_NAME = 'download-time-calc-v1';
const urlsToCache = [
  '/download_time_calc/',
  '/download_time_calc/index.html',
  '/download_time_calc/css/style.css',
  '/download_time_calc/js/main.js',
  '/download_time_calc/data/ja.json',
  '/download_time_calc/data/en.json',
  '/download_time_calc/favicon.svg',
  '/download_time_calc/images/apple-touch-icon.png',
  '/download_time_calc/manifest.json'
];

// インストール時の処理
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Cache installation failed:', error);
      })
  );
  // 新しいService Workerをすぐに有効化
  self.skipWaiting();
});

// アクティベート時の処理
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // すべてのクライアントを制御
  return self.clients.claim();
});

// フェッチ時の処理（ネットワークファースト戦略）
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // レスポンスが有効な場合、クローンしてキャッシュに保存
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
        }
        return response;
      })
      .catch(() => {
        // ネットワークエラーの場合、キャッシュから取得
        return caches.match(event.request)
          .then((response) => {
            if (response) {
              return response;
            }
            // オフラインの場合、index.htmlを返す
            if (event.request.mode === 'navigate') {
              return caches.match('/download_time_calc/index.html');
            }
          });
      })
  );
});


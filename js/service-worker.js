// Service Worker for PWA
const CACHE_NAME = 'download-time-calc-v5';
const STATIC_CACHE_NAME = 'download-time-calc-static-v5';

// キャッシュする静的アセット
const urlsToCache = [
  '/download_time_calc/',
  '/download_time_calc/index.html',
  '/download_time_calc/css/style.css',
  '/download_time_calc/js/main.js',
  '/download_time_calc/data/ja.json',
  '/download_time_calc/data/en.json',
  '/download_time_calc/data/privacy_ja.json',
  '/download_time_calc/data/privacy_en.json',
  '/download_time_calc/favicon.svg',
  '/download_time_calc/images/apple-touch-icon.png',
  '/download_time_calc/images/icon-192x192.png',
  '/download_time_calc/images/icon-512x512.png',
  '/download_time_calc/manifest.json',
  '/download_time_calc/pages/privacy.html'
];

// キャッシュしない外部URL
const excludeFromCache = [
  'googletagmanager.com',
  'google-analytics.com',
  'analytics.google.com'
];

// インストール時の処理
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // 個別にキャッシュして、1つ失敗しても他は続行
        return Promise.allSettled(
          urlsToCache.map(url => 
            cache.add(url).catch(err => {
              console.warn(`Failed to cache ${url}:`, err);
            })
          )
        );
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
  const cacheWhitelist = [CACHE_NAME, STATIC_CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
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

// URLが除外リストに含まれているかチェック
function shouldExcludeFromCache(url) {
  return excludeFromCache.some(domain => url.includes(domain));
}

// フェッチ時の処理
self.addEventListener('fetch', (event) => {
  const requestUrl = event.request.url;
  
  // 外部URLはキャッシュしない
  if (shouldExcludeFromCache(requestUrl)) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  // GET以外のリクエストはネットワークのみ
  if (event.request.method !== 'GET') {
    event.respondWith(fetch(event.request));
    return;
  }

  // ナビゲーションリクエスト（HTMLページ）はネットワークファースト
  if (event.request.mode === 'navigate') {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
          if (response && response.status === 200) {
          const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request)
          .then((response) => {
            if (response) {
              return response;
            }
              // オフライン時のフォールバック
              return caches.match('/download_time_calc/index.html');
            });
        })
    );
    return;
  }

  // 静的アセットはStale-While-Revalidate戦略
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // バックグラウンドでネットワークからフェッチ
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // ネットワークエラーの場合はキャッシュを返す
            return cachedResponse;
          });

        // キャッシュがあればすぐに返し、なければネットワークを待つ
        return cachedResponse || fetchPromise;
      })
  );
});

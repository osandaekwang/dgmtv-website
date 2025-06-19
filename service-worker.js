const CACHE_NAME = 'odk-dgm-cache-v2'; // 캐시 버전 업데이트
const URLS_TO_CACHE = [
  '/',
  '/index.html'
];

// 서비스 워커 설치 및 기본 파일 캐싱
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
  );
});

// 네트워크 우선 전략으로 요청 처리
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      // 네트워크 요청이 실패하면 캐시에서 찾아 반환
      return caches.match(event.request);
    })
  );
});

// 오래된 캐시 삭제
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

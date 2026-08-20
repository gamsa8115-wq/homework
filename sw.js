/* 더퍼스트 숙제관리 · 서비스워커
   ─────────────────────────────────────────────────────────────
   목적은 딱 하나 — 안드로이드 크롬이 "바로가기"가 아니라
   "설치형 앱(WebAPK)"으로 만들도록 하는 것.
   크롬은 매니페스트만으로는 앱으로 설치하지 않고,
   fetch 이벤트를 처리하는 서비스워커가 있어야 앱으로 인정한다.
   (없으면 파비콘에 크롬 배지가 붙은 바로가기가 생긴다)

   ★ 일부러 캐시를 쓰지 않는다.
     교사 앱은 자주 새 버전을 올리는데, 캐시를 두면 학생·선생님 폰에
     예전 버전이 남아 "고쳤는데 안 바뀐다"는 문제가 생긴다.
     항상 네트워크에서 최신본을 받아온다.
*/

const VERSION = 'v350';

// 새 서비스워커가 올라오면 기다리지 않고 바로 교체한다
self.addEventListener('install', () => {
  self.skipWaiting();
});

// 열려 있는 탭까지 즉시 새 워커가 맡는다
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // 예전 버전에서 만들어졌을 수 있는 캐시는 정리한다
    const keys = await caches.keys();
    await Promise.all(keys.map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

// 캐시 없이 그대로 네트워크로 넘긴다 (설치 조건을 만족시키기 위한 핸들러)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(fetch(event.request));
});

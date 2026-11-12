// Network first, so updates show up right away; falls back to the saved copy when offline.
const CACHE = 'knee-v1';
const IMGS = ['balance', 'bike', 'bridge', 'clamshell', 'gastroc', 'ham-long-sit', 'ham-towel', 'heel-raise', 'heel-slides',
  'knee-curl', 'laq', 'lunge-forward', 'lunge-trainer', 'quad-prone', 'quad-sets', 'saq', 'side-step', 'sit-stand', 'slr',
  'soleus', 'squat-single', 'step-lateral', 'wall-slide'];
const CORE = ['./', 'style.css', 'app.js', 'exercises.js', 'config.js', 'mateo/', 'kristen/']
  .concat(IMGS.map(n => `img/${n}.jpg`));

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(CORE.map(u => c.add(u).catch(() => {})))));
});
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }))
  );
});

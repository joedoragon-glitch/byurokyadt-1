const CACHE='byurokyadt-v7-local-2';
const CORE=[
 './','./index.html','./styles.css','./manifest.webmanifest','./icons/icon.svg',
 './js/app.js','./vendor/three.min.js',
 './assets/brezhnev_1982.svg','./assets/xi_five_year_plan_1981_1985.svg'
];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);if(url.origin!==self.location.origin)return;
 event.respondWith(caches.match(event.request).then(cached=>{
  if(cached)return cached;
  return fetch(event.request).then(resp=>{
   if(resp&&resp.ok){const copy=resp.clone();caches.open(CACHE).then(c=>c.put(event.request,copy))}
   return resp;
  }).catch(()=>event.request.mode==='navigate'?caches.match('./index.html'):Promise.reject('offline asset unavailable'));
 }));
});
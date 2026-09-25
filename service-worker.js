const CACHE='byurokyadt-v7-local-5';
const CORE=[
 './','./index.html','./styles.css','./manifest.webmanifest','./icons/icon.svg',
 './js/app.js','./vendor/three.min.js',
 './assets/brezhnev_party_poster.jpg','./assets/xi_five_year_plan_party_poster.jpg'
];

self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
 event.waitUntil(
  caches.keys()
   .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
   .then(()=>self.clients.claim())
 );
});

self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);
 if(url.origin!==self.location.origin)return;

 // Navigation is NETWORK-FIRST so a fixed loader is never trapped behind stale cached HTML.
 if(event.request.mode==='navigate'){
  event.respondWith(
   fetch(event.request,{cache:'no-cache'}).then(resp=>{
    if(resp&&resp.ok){
     const copy=resp.clone();
     caches.open(CACHE).then(c=>c.put(event.request,copy));
     caches.open(CACHE).then(c=>c.put('./index.html',resp.clone()));
    }
    return resp;
   }).catch(()=>caches.match(event.request).then(hit=>hit||caches.match('./index.html')))
  );
  return;
 }

 // Versioned static assets are CACHE-FIRST for fast offline startup.
 event.respondWith(
  caches.match(event.request).then(cached=>{
   if(cached)return cached;
   return fetch(event.request).then(resp=>{
    if(resp&&resp.ok){
     const copy=resp.clone();
     caches.open(CACHE).then(c=>c.put(event.request,copy));
    }
    return resp;
   });
  })
 );
});
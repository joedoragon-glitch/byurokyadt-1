const CACHE='byurokyadt-v9-0';
const CORE=[
 './','./index.html','./styles.css?v=9.0','./manifest.webmanifest','./icons/icon.svg',
 './js/app.js?v=9.0','./vendor/three.min.js',
 './assets/enamel-v9.webp','./js/audio.js?v=9.0',
 './assets/audio/ministry.ogg','./assets/audio/room.ogg','./assets/audio/relay.ogg','./assets/audio/feed.ogg','./assets/audio/scan.ogg','./assets/audio/stamp.ogg','./assets/audio/bell.ogg',
 './assets/brezhnev-party-v8.jpg','./assets/xi-plan-v8.jpg',
 './icons/icon-192.png','./icons/icon-512.png'
];

self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
 event.waitUntil(
  caches.keys()
   .then(keys=>Promise.all(keys.filter(k=>k.startsWith('byurokyadt-')&&k!==CACHE).map(k=>caches.delete(k))))
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
     const copy=resp.clone(),indexCopy=resp.clone();
     event.waitUntil(caches.open(CACHE).then(c=>Promise.all([c.put(event.request,copy),c.put('./index.html',indexCopy)])));
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
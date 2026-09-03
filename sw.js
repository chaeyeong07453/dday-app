const CACHE='dday-v1';
const ASSETS=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{ if(res.ok && e.request.url.startsWith(self.location.origin)){ const cp=res.clone(); caches.open(CACHE).then(c=>c.put(e.request,cp)); } return res; }).catch(()=>caches.match('./index.html'))));
});
self.addEventListener('push',e=>{ const d=e.data? e.data.json():{title:'92점',body:'확인'}; e.waitUntil(self.registration.showNotification(d.title||'92점 프로젝트',{body:d.body||'',icon:'./icon-192.png',badge:'./icon-192.png'})); });
self.addEventListener('notificationclick',e=>{ e.notification.close(); e.waitUntil(clients.openWindow('./')); });

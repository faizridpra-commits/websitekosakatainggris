const C='kosakata-v2';
const FILES=['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png','kosakata-1-77.xlsx'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(u.origin!==location.origin&&u.hostname!=='cdnjs.cloudflare.com')return;
  // GitHub Pages menyimpan cache HTTP ~10 menit; 'no-cache' memaksa cek ke server agar update cepat terlihat
  const req=u.origin===location.origin?new Request(e.request,{cache:'no-cache'}):e.request;
  e.respondWith(caches.match(e.request).then(hit=>{
    const net=fetch(req).then(r=>{if(r&&(r.ok||r.type==='opaque')){const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));}return r;}).catch(()=>hit);
    return hit||net;
  }));
});

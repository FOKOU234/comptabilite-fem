const V='lady-gaine-pro-v2';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
/* Réseau d'abord : la nouvelle version s'affiche tout de suite si internet marche ; sinon on utilise la copie du téléphone. */
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  e.respondWith(fetch(r,{cache:'no-store'}).then(res=>{if(res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res})
    .catch(()=>caches.match(r).then(hit=>hit||(r.mode==='navigate'?caches.match('./index.html'):Response.error()))))});

// Çevrimdışı önbellek: ilk açılışta her şeyi alır, sonra internetsiz açılır. Güncellemede SURUM'u artır.
const SURUM="yemek-v1";
const DOSYALAR=["./","index.html","manifest.json","ikon.png","html2canvas.min.js","jspdf.umd.min.js"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(SURUM).then(c=>c.addAll(DOSYALAR)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==SURUM).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).catch(()=>caches.match("index.html"))));
});

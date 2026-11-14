// Sinem'in rutin uygulamasındaki düzen (2026-11-06): önce ağ, güncelleme anında gelir; ağ yoksa önbellek (internetsiz çalışır).
const C="yemek-v5";
const DOSYALAR=["./","index.html","manifest.json","ikon.png","html2canvas.min.js","jspdf.umd.min.js"];
self.addEventListener("install",e=>e.waitUntil(caches.open(C).then(c=>c.addAll(DOSYALAR)).then(()=>self.skipWaiting())));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=="GET"||u.origin!==location.origin)return;
  // Zayıf çekimde takılmasın: 4 sn'de ağ cevap vermezse önbellekten aç.
  const ag=fetch(e.request,{cache:"no-cache"}).then(r=>{if(r.ok){const k=r.clone();caches.open(C).then(c=>c.put(e.request,k))}return r});
  const yedek=()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match("index.html"));
  e.respondWith(new Promise(res=>{
    let bitti=false;
    const t=setTimeout(()=>yedek().then(r=>{if(!bitti&&r){bitti=true;res(r)}}),4000);
    ag.then(r=>{if(!bitti){bitti=true;clearTimeout(t);res(r)}}).catch(()=>yedek().then(r=>{if(!bitti){bitti=true;clearTimeout(t);res(r||Response.error())}}));
  }));
});

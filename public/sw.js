importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js');

if (workbox) {
  console.log(`Workbox is loaded.`);

  workbox.precaching.precacheAndRoute([
  {
    "url": "completed.html",
    "revision": "e615be4a4e28bab7975a21def234779f"
  },
  {
    "url": "createTask.html",
    "revision": "94cf30d68b02665c643e12ae52803c4a"
  },
  {
    "url": "css/authentication.css",
    "revision": "bc584f47b04bdfe1dba0db7f20f0be81"
  },
  {
    "url": "css/base.css",
    "revision": "d94d4a66324d8ce569989e718fae638e"
  },
  {
    "url": "home.html",
    "revision": "384413a4ffc4059caf3781db92ac0f08"
  },
  {
    "url": "images/trash.png",
    "revision": "bef5443f99dcaa142198add989d09737"
  },
  {
    "url": "index.html",
    "revision": "c7ae6d7b6e9be2ab861ae5060c8026f3"
  },
  {
    "url": "js/app.js",
    "revision": "9aabf87c16fb9083850d1f6222c63ec0"
  },
  {
    "url": "js/main.js",
    "revision": "4804bd47a4a2ad64218fe35309e8a4cf"
  },
  {
    "url": "signup.html",
    "revision": "86a7e754e98a7c6a09964c894f08ac04"
  }
]);

  workbox.routing.registerRoute(
    /(.*)articles(.*)\.(?:png|gif|jpg)/,
    workbox.strategies.cacheFirst({
      cacheName: 'images-cache',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // cache for max of 30 days
        })
      ]
    })
  );

} else {
  console.log(`Workbox didn't load.`);
}
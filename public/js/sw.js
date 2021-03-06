importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js');

if (workbox) {
  console.log(`Workbox is loaded.`);

  workbox.precaching.precacheAndRoute([
  {
    "url": "completed.html",
    "revision": "1f206ef2f67941d4119430634bfacb43"
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
    "revision": "56c5f898028f2acf62b5c82874043a9f"
  },
  {
    "url": "images/L_192x192.png",
    "revision": "255e04d7fcfab59192d362d87ab4ca58"
  },
  {
    "url": "images/L_48x48.png",
    "revision": "a8d674393b62a7b98dbaf92b720e2f9b"
  },
  {
    "url": "images/L_512x512.png",
    "revision": "0460d1677a7ce713f843a83903f9e9cf"
  },
  {
    "url": "images/trash.png",
    "revision": "bef5443f99dcaa142198add989d09737"
  },
  {
    "url": "index.html",
    "revision": "ecc29eb4b81fd06e542c3af68a686c01"
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
    "revision": "c359a3403bffb7cc5b240a077d07eb4c"
  }
]);

  workbox.routing.registerRoute(
    /(.*)articles(.*)\.(?:png|gif|jpg)/,
    workbox.strategies.cacheFirst({
      cacheName: 'images-cache',
      plugins: [
        new workbox.expiration.Plugin({
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, /* Cache for max of 30 days */
        })
      ]
    })
  );

} else {
  console.log(`Workbox didn't load.`);
}

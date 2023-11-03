/**
 * * Cache Name
 *
 * ? The name of the cache used to store assets for the MiniGameBox web application.
 */
const CACHE_NAME = "v1_MiniGameBox";

/**
 * ? URLs to Cache
 *
 * * An array of URLs representing the initial set of assets to be cached when the service worker is installed.
 */
let urlsToCache = [
  "./",
  "style.css",
  "index.html",
  "memory.js",
  "hangman.js",
  "script.js",
  "https://memory-1-u4335091.deta.app/category/Emociones",
  "https://memory-1-u4335091.deta.app/category/Animales",
  "https://memory-1-u4335091.deta.app/category/Colores",
  "https://memory-1-u4335091.deta.app/category/Comidas",
  "https://memory-1-u4335091.deta.app/category/Figuras",
];

/**
 * ? Get Elements to Cache
 *
 * * Fetch additional elements to be cached from an external source and add them to the list of URLs to cache.
 */
async function GetElementsToCache() {
  let response = await fetch("auto/elements.json");
  let data = await response.json();
  urlsToCache = await [...urlsToCache, ...data.data];
  console.log(urlsToCache);
}

/**
 * ? Install Event
 *
 * * The event listener for the 'install' event of the service worker. It caches the specified assets when the service worker is installed.
 *
 * @param {ExtendableEvent} e - The 'install' event object.
 */
self.addEventListener("install", (e) => {
  e.waitUntil(
    GetElementsToCache().then(() => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(urlsToCache);
      });
    })
  );
});

/**
 * ? Activate Event
 *
 * * The event listener for the 'activate' event of the service worker. It cleans up old caches and activates the current cache.
 *
 * @param {ExtendableEvent} e - The 'activate' event object.
 */
self.addEventListener("activate", (e) => {
  const cacheWhitelist = [CACHE_NAME];
  e.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        self.clients.claim();
      })
  );
});

/**
 * ? Fetch Event
 *
 * * The event listener for the 'fetch' event of the service worker. It intercepts network requests and serves cached responses when available.
 *
 * @param {FetchEvent} e - The 'fetch' event object.
 */
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      if (res) {
        return res;
      }
      return fetch(e.request);
    })
  );
});

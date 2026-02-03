// Service Worker for Mental Strain Records
const CACHE_NAME = 'msr-cache-v5';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js',
    '/colour-combo-game.js',
    '/assets/MSR26forweb2.svg',
    '/assets/apple-touch-icon.png',
    '/assets/favicon-32x32.png',
    '/assets/favicon-16x16.png',
    '/assets/oat2.jpg',
    '/assets/post-kwebs.jpg',
    '/assets/wayne-street.jpg',
    '/assets/of-all-time.jpg',
    '/assets/octnov.jpg',
    '/assets/scintillating.jpg',
    '/assets/unlikely.jpg',
    '/assets/kwebspostimg.jpg',
    '/assets/site.webmanifest'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching assets');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    // Skip caching for audio files - let them stream normally
    if (url.pathname.includes('/assets/audio/') || 
        event.request.destination === 'audio') {
        return; // Don't intercept, let browser handle naturally
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                if (response) {
                    return response;
                }
                
                return fetch(event.request).then((response) => {
                    // Don't cache non-GET requests or non-successful responses
                    if (!response || response.status !== 200 || response.type === 'error' ||
                        event.request.method !== 'GET') {
                        return response;
                    }
                    
                    // Clone the response
                    const responseToCache = response.clone();
                    
                    // Cache dynamically fetched resources (excluding audio)
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    
                    return response;
                });
            })
            .catch(() => {
                // Optionally return a custom offline page
                return new Response('Offline - content not available', {
                    status: 503,
                    statusText: 'Service Unavailable',
                    headers: new Headers({
                        'Content-Type': 'text/plain'
                    })
                });
            })
    );
});

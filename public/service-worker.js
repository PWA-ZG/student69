const CACHE_NAME = 'my-pwa-cache-v2';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/manifest.json',
                '/main.js',
                '/styles.css'               
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).then((fetchResponse) => {
                if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                    return fetchResponse;
                }

                const responseToCache = fetchResponse.clone();

                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return fetchResponse;
            });
        })
    );
});

self.addEventListener('sync', (event) => {
    if (event.tag === 'my-sync-tag') {
        event.waitUntil(
            simulateBackgroundSyncSuccess()
                .then(() => {
                    return self.registration.showNotification('My PWA App', {
                        body: 'Background sync successful!',
                        icon: '/icon.png',
                    });
                })
                .catch((error) => {
                    console.error('Background sync failed:', error);
                })
        );
    }
});

self.addEventListener('push', (event) => {
    const options = {
        body: event.data.text(),
        icon: '/icon.png',
    };

    event.waitUntil(
        self.registration.showNotification('My PWA App', options)
    );
});

function simulateBackgroundSyncSuccess() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 2000);
    });
}

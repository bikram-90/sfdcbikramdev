export function serviceWorkerHelper() {

    self.addEventListener('install', function (event) {
        console.log('[SW] SW Installing ...', event);

    });

    self.addEventListener('activate', function (event) {
        console.log('[SW] SW activating ...', event);
        return self.Clients.claim();
    })

    self.addEventListener('fetch', function (event) {
        console.log('[SW] SW Fetching ...', event);
        //event.respondWith(null);
        event.respondWith(fetch(event.request));
    })

}
// ==========================================
// SERVICE WORKER PER NOTIFICHE PUSH
// ==========================================

self.addEventListener('install', (event) => {
    console.log('Service Worker installato');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker attivato');
    event.waitUntil(clients.claim());
});

// Gestione notifiche push
self.addEventListener('push', (event) => {
    console.log('Notifica push ricevuta');
    
    const data = event.data ? event.data.json() : {};
    const title = data.title || '⏱️ Ricorda di segnare le ore!';
    const options = {
        body: data.body || 'Non hai ancora registrato le ore di oggi. Clicca per aprire l\'app!',
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        vibrate: [200, 100, 200],
        tag: 'ore-reminder',
        requireInteraction: true,
        actions: [
            {
                action: 'open',
                title: 'Apri App'
            },
            {
                action: 'close',
                title: 'Chiudi'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Gestione click su notifica
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'open' || !event.action) {
        event.waitUntil(
            clients.openWindow('/operaio.html')
        );
    }
});

// Controllo periodico ore non registrate
// Nota: Service Worker non può fare setInterval vero, 
// questa funzione viene chiamata dall'app principale
self.addEventListener('message', async (event) => {
    if (event.data.type === 'CHECK_HOURS') {
        const { operaioId, hasRegisteredToday } = event.data;
        
        if (!hasRegisteredToday) {
            // Mostra notifica
            self.registration.showNotification('⏱️ Ricorda di segnare le ore!', {
                body: 'Non hai ancora registrato le ore di oggi.',
                icon: '/icon-192.png',
                vibrate: [200, 100, 200],
                tag: 'ore-reminder',
                requireInteraction: true
            });
        }
    }
});


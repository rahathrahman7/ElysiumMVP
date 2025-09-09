// ELYSIUM Service Worker for Performance Optimization
const CACHE_NAME = 'elysium-v1';
const STATIC_CACHE = 'elysium-static-v1';
const DYNAMIC_CACHE = 'elysium-dynamic-v1';
const IMAGE_CACHE = 'elysium-images-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/products',
  '/bespoke',
  '/education',
  '/about',
  '/contact',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Add critical CSS and JS files
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName.startsWith('elysium-') && 
                     cacheName !== STATIC_CACHE && 
                     cacheName !== DYNAMIC_CACHE && 
                     cacheName !== IMAGE_CACHE;
            })
            .map((cacheName) => caches.delete(cacheName))
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Handle different types of requests with appropriate strategies
  if (request.destination === 'image') {
    // Images: Cache First with fallback
    event.respondWith(handleImageRequest(request));
  } else if (isStaticAsset(url.pathname)) {
    // Static assets: Cache First
    event.respondWith(handleStaticRequest(request));
  } else if (isAPIRequest(url.pathname)) {
    // API requests: Network First
    event.respondWith(handleAPIRequest(request));
  } else {
    // Pages: Stale While Revalidate
    event.respondWith(handlePageRequest(request));
  }
});

// Image caching strategy - Cache First with fallback
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Serve from cache and update in background
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
          }
        })
        .catch(() => {
          // Network failed, but we have cache
        });
      
      return cachedResponse;
    }

    // Try network first for new images
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Clone before caching
      const responseClone = networkResponse.clone();
      cache.put(request, responseClone);
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
  } catch (error) {
    // Return fallback image
    return caches.match('/images/placeholder-ring.jpg') || 
           new Response('Image not available', { status: 404 });
  }
}

// Static assets - Cache First
async function handleStaticRequest(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    return new Response('Offline', { status: 503 });
  }
}

// API requests - Network First
async function handleAPIRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    return cachedResponse || new Response('Offline', { 
      status: 503,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Offline' })
    });
  }
}

// Page requests - Stale While Revalidate
async function handlePageRequest(request) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    // Always try to fetch from network
    const networkPromise = fetch(request)
      .then((networkResponse) => {
        if (networkResponse.ok) {
          cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      });

    // Return cached version immediately if available
    if (cachedResponse) {
      // Update cache in background
      networkPromise.catch(() => {
        // Network failed, but we served from cache
      });
      
      return cachedResponse;
    }

    // No cache, wait for network
    return networkPromise;
  } catch (error) {
    return new Response('Offline', { status: 503 });
  }
}

// Helper functions
function isStaticAsset(pathname) {
  return (
    pathname.startsWith('/_next/static/') ||
    pathname.startsWith('/icons/') ||
    pathname.startsWith('/logo/') ||
    pathname.endsWith('.css') ||
    pathname.endsWith('.js') ||
    pathname.endsWith('.woff2') ||
    pathname.endsWith('.woff') ||
    pathname === '/manifest.json' ||
    pathname === '/favicon.ico'
  );
}

function isAPIRequest(pathname) {
  return pathname.startsWith('/api/');
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'wishlist-sync') {
    event.waitUntil(syncWishlist());
  } else if (event.tag === 'cart-sync') {
    event.waitUntil(syncCart());
  }
});

// Sync wishlist when back online
async function syncWishlist() {
  try {
    const wishlistData = await getStoredWishlist();
    if (wishlistData.length > 0) {
      await fetch('/api/wishlist/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: wishlistData })
      });
      await clearStoredWishlist();
    }
  } catch (error) {
    console.log('Wishlist sync failed:', error);
  }
}

// Sync cart when back online
async function syncCart() {
  try {
    const cartData = await getStoredCart();
    if (cartData.length > 0) {
      await fetch('/api/cart/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cartData })
      });
      await clearStoredCart();
    }
  } catch (error) {
    console.log('Cart sync failed:', error);
  }
}

// IndexedDB helpers for offline storage
function getStoredWishlist() {
  return new Promise((resolve) => {
    // Simplified - would use IndexedDB in production
    resolve([]);
  });
}

function getStoredCart() {
  return new Promise((resolve) => {
    // Simplified - would use IndexedDB in production
    resolve([]);
  });
}

function clearStoredWishlist() {
  return Promise.resolve();
}

function clearStoredCart() {
  return Promise.resolve();
}

// Push notifications for updates
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'New update available',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      tag: data.tag || 'elysium-notification',
      data: data.url ? { url: data.url } : {},
      actions: data.actions || []
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'ELYSIUM', options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});
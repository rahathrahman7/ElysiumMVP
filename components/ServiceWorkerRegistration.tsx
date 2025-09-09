"use client";
import { useEffect, useState } from 'react';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      registerServiceWorker();
    }
  }, []);

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('Service Worker registered successfully:', registration);

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New update available
                showUpdateNotification();
              } else {
                // First time install
                console.log('Service Worker installed for the first time');
              }
            }
          });
        }
      });

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'CACHE_UPDATED') {
          console.log('Cache updated:', event.data.payload);
        }
      });

    } catch (error) {
      console.log('Service Worker registration failed:', error);
    }
  };

  const showUpdateNotification = () => {
    // Create a subtle notification for updates
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-[var(--color-ink)] text-[var(--color-white)] p-4 rounded-lg shadow-lg z-50 max-w-sm animate-slide-in-bottom';
    notification.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <h4 class="font-serif font-medium mb-1">Update Available</h4>
          <p class="text-sm opacity-90">A new version of ELYSIUM is ready.</p>
        </div>
        <button id="update-btn" class="ml-4 px-3 py-1 bg-[var(--color-gold)] text-[var(--color-ink)] rounded text-sm font-medium hover:bg-[var(--color-gold-light)] transition-colors">
          Update
        </button>
      </div>
      <button id="dismiss-btn" class="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-white/60 hover:text-white">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;

    document.body.appendChild(notification);

    // Handle update button
    const updateBtn = notification.querySelector('#update-btn');
    const dismissBtn = notification.querySelector('#dismiss-btn');

    updateBtn?.addEventListener('click', () => {
      window.location.reload();
    });

    dismissBtn?.addEventListener('click', () => {
      notification.remove();
    });

    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 10000);
  };

  return null; // This component doesn't render anything
}

// Hook for monitoring online/offline status
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Trigger background sync when back online
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        navigator.serviceWorker.ready.then(registration => {
          registration.sync.register('wishlist-sync');
          registration.sync.register('cart-sync');
        });
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}


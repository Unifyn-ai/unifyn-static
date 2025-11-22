/* Firebase Messaging Service Worker */
/* eslint-disable no-undef */

/* Load Firebase SDKs (compat build) for service worker usage */
importScripts('https://www.gstatic.com/firebasejs/12.6.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.6.0/firebase-messaging-compat.js');

/* Same config as used in the web app */
firebase.initializeApp({
  apiKey: "AIzaSyC2qxamCiw115ew3EnIeueiXAc1zFrTUAo",
  authDomain: "unifyn-app.firebaseapp.com",
  projectId: "unifyn-app",
  storageBucket: "unifyn-app.firebasestorage.app",
  messagingSenderId: "1063551145481",
  appId: "1:1063551145481:web:ffa9b8c5c65bbe8c210ad8",
  measurementId: "G-KECX2K59XQ"
});

const messaging = firebase.messaging();

/* Keep SW active and claim clients ASAP */
self.addEventListener('install', (event) => {
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

/* Handle background messages */
messaging.onBackgroundMessage((payload) => {
  // Fallback values
  const title = (payload && payload.notification && payload.notification.title) || 'Unifyn';
  const body = (payload && payload.notification && payload.notification.body) || '';
  const icon = '/android-chrome-192x192.png';

  const options = {
    body,
    icon,
    data: payload && payload.data ? payload.data : {},
    badge: '/favicon-32x32.png',
  };

  self.registration.showNotification(title, options);
});

/* Handle generic Web Push (covers some notification payload cases) */
self.addEventListener('push', (event) => {
  try {
    const data = event.data ? event.data.json() : {};
    const notification = (data && data.notification) || {};
    const title = notification.title || 'Unifyn';
    const body = notification.body || '';
    const icon = (notification.icon) || '/android-chrome-192x192.png';
    const options = {
      body,
      icon,
      data: (data && data.data) || {},
      badge: '/favicon-32x32.png',
    };
    event.waitUntil(self.registration.showNotification(title, options));
  } catch (e) {
    // Swallow to avoid breaking the push event
  }
});

/* Focus/open a relevant client when the user clicks the notification */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification && event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (let i = 0; i < clientList.length; i += 1) {
        const client = clientList[i];
        if ('focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
      return undefined;
    })
  );
});



import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import {
  getMessaging,
  getToken as getFcmRegistrationToken,
  onMessage,
  isSupported as isMessagingSupported,
  type Messaging,
} from "firebase/messaging";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2qxamCiw115ew3EnIeueiXAc1zFrTUAo",
  authDomain: "unifyn-app.firebaseapp.com",
  projectId: "unifyn-app",
  storageBucket: "unifyn-app.firebasestorage.app",
  messagingSenderId: "1063551145481",
  appId: "1:1063551145481:web:ffa9b8c5c65bbe8c210ad8",
  measurementId: "G-KECX2K59XQ"
};

// Initialize Firebase
let app: FirebaseApp;
let analytics: Analytics | null = null;
let messaging: Messaging | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    // Initialize only if no apps exist
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  }
  return app;
}

export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  if (analytics) {
    return analytics;
  }

  try {
    const supported = await isAnalyticsSupported();
    if (supported) {
      const app = getFirebaseApp();
      analytics = getAnalytics(app);
      return analytics;
    }
  } catch (error) {
    console.error('Firebase Analytics initialization error:', error);
  }

  return null;
}

/**
 * Initialize and return Firebase Messaging if supported in this environment.
 */
export async function getFirebaseMessaging(): Promise<Messaging | null> {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const supported = await isMessagingSupported();
    if (!supported) {
      return null;
    }
    if (!messaging) {
      const app = getFirebaseApp();
      messaging = getMessaging(app);
    }
    return messaging;
  } catch (error) {
    console.error('Firebase Messaging initialization error:', error);
    return null;
  }
}

/**
 * Requests browser notification permission, registers the service worker,
 * and returns an FCM registration token for this device/session.
 *
 * Provide your VAPID public key (Firebase Console → Project Settings → Cloud Messaging → Web configuration).
 */
export async function getFcmToken(vapidPublicKey: string): Promise<string | null> {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      console.warn('Notifications or ServiceWorker not supported in this browser.');
      return null;
    }

    // Ensure service worker is registered (idempotent)
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/' });

    // Ask for permission if needed
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Notification permission not granted:', permission);
      return null;
    }

    const msg = await getFirebaseMessaging();
    if (!msg) {
      console.warn('Firebase Messaging not supported or failed to initialize.');
      return null;
    }

    const token = await getFcmRegistrationToken(msg, {
      vapidKey: vapidPublicKey,
      serviceWorkerRegistration: registration,
    });
    return token ?? null;
  } catch (error) {
    console.error('Error obtaining FCM token:', error);
    return null;
  }
}

/**
 * Subscribes to foreground messages while the page is in focus.
 */
export async function subscribeToForegroundMessages(
  handler: (payload: unknown) => void
): Promise<void> {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    const msg = await getFirebaseMessaging();
    if (!msg) {
      return;
    }
    onMessage(msg, (payload) => {
      handler(payload);
    });
  } catch (error) {
    console.error('Error subscribing to foreground messages:', error);
  }
}


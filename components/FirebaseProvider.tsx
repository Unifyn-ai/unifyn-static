"use client";
import { useEffect, useState } from 'react';
import {
  getFirebaseApp,
  getFirebaseAnalytics,
  getFcmToken,
  subscribeToForegroundMessages,
} from '../lib/firebase';

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Initialize Firebase on client side only
    const initFirebase = async () => {
      try {
        // Initialize Firebase app
        getFirebaseApp();

        // Initialize Analytics (only works in browser)
        await getFirebaseAnalytics();

        // Always register the messaging service worker if supported
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
          try {
            const reg = await navigator.serviceWorker.register('/firebase-messaging-sw.js', { scope: '/' });
            // Useful when debugging SW lifecycle
            console.log('[SW] Registered firebase-messaging-sw.js with scope:', reg.scope);
          } catch (swErr) {
            console.warn('[SW] Registration failed:', swErr);
          }
        }

        setInitialized(true);
        console.log('Firebase Analytics initialized successfully');

        // Optional one-time web push test when visiting with ?pushTest=1
        if (typeof window !== 'undefined') {
          const searchParams = new URLSearchParams(window.location.search);
          const shouldTestPush = searchParams.get('pushTest') === '1';
          const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

          // Subscribe to foreground messages to debug payloads
          subscribeToForegroundMessages((payload) => {
            console.log('[FCM] Foreground message received:', payload);
          });

          if (shouldTestPush) {
            if (!vapidKey) {
              console.warn('Missing NEXT_PUBLIC_FIREBASE_VAPID_KEY env var. Generate it in Firebase Console → Cloud Messaging → Web configuration.');
            } else {
              const token = await getFcmToken(vapidKey);
              if (token) {
                // Surface the token for easy copy
                console.log('[FCM] Registration token:', token);
                // Small heads-up to check console for the token
                try {
                  // Non-blocking notification to the user
                  // eslint-disable-next-line no-alert
                  alert('Web push test ready. Open the console and copy the FCM token.');
                } catch {}
              }
            }
          }
        }
      } catch (error) {
        console.error('Error initializing Firebase:', error);
      }
    };

    initFirebase();
  }, []);

  return <>{children}</>;
}


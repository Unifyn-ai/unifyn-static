'use client';

import {
  APPLE_CLIENT_ID,
  APPLE_REDIRECT_URI,
  GOOGLE_CLIENT_ID,
  GOOGLE_REDIRECT_URI,
} from '../app/config';

export type OauthSource = 'google-id-token' | 'apple-id-token';

function randomString(length = 24) {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const array = new Uint32Array(length);
  if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
    return result;
  }
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function defaultRedirect(path: string) {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}${path}`;
}

export function buildGoogleAuthUrl() {
  const clientId = GOOGLE_CLIENT_ID;
  const redirectUri =
    GOOGLE_REDIRECT_URI || defaultRedirect('/auth/callback/google');
  
  console.log('[OAuth] Building Google Auth URL:', {
    clientId: clientId?.substring(0, 20) + '...',
    redirectUri,
    hasEnvRedirect: !!GOOGLE_REDIRECT_URI,
    defaultWouldBe: defaultRedirect('/auth/callback/google')
  });
  
  if (!clientId || !redirectUri) {
    throw new Error('Missing Google OAuth configuration.');
  }
  
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'id_token');
  url.searchParams.set('response_mode', 'fragment');
  url.searchParams.set('scope', 'openid email profile');
  url.searchParams.set('prompt', 'select_account');
  url.searchParams.set('nonce', randomString());
  url.searchParams.set('state', randomString());
  
  console.log('[OAuth] Generated OAuth URL:', url.toString());
  return url.toString();
}

export function buildAppleAuthUrl() {
  const clientId = APPLE_CLIENT_ID;
  const redirectUri =
    APPLE_REDIRECT_URI || defaultRedirect('/auth/callback/apple');
  if (!clientId || !redirectUri) {
    throw new Error('Missing Apple OAuth configuration.');
  }
  const url = new URL('https://appleid.apple.com/auth/authorize');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'id_token');
  url.searchParams.set('response_mode', 'fragment');
  url.searchParams.set('scope', 'name email');
  url.searchParams.set('nonce', randomString());
  url.searchParams.set('state', randomString());
  return url.toString();
}

function openBlankCenteredPopup(name: string) {
  const dualScreenLeft =
    window.screenLeft !== undefined ? window.screenLeft : (window as any).screen?.left;
  const dualScreenTop =
    window.screenTop !== undefined ? window.screenTop : (window as any).screen?.top;

  const width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
    ? document.documentElement.clientWidth
    : (window as any).screen?.width;
  const height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight
    ? document.documentElement.clientHeight
    : (window as any).screen?.height;

  const w = Math.min(480, Math.floor(width * 0.9));
  const h = Math.min(700, Math.floor(height * 0.9));
  const left = width / 2 - w / 2 + (dualScreenLeft || 0);
  const top = height / 2 - h / 2 + (dualScreenTop || 0);

  const features = `scrollbars=yes, width=${w}, height=${h}, top=${top}, left=${left}`;
  const popup = window.open('', name, features);
  popup?.focus();
  return popup;
}

export function oauthPopup(expectedSource: OauthSource, href: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    console.log('[OAuth Popup] Starting OAuth flow:', {
      expectedSource,
      href,
      timestamp: new Date().toISOString()
    });

    let popup: Window | null = null;
    let messageReceived = false;
    
    try {
      popup = openBlankCenteredPopup(expectedSource);
      if (!popup) {
        console.error('[OAuth Popup] Popup blocked by browser');
        window.location.href = href;
        reject(new Error('Popup blocked; redirected to provider in this tab.'));
        return;
      }
      console.log('[OAuth Popup] Popup opened successfully');
      popup.location.href = href;
      console.log('[OAuth Popup] Navigating popup to OAuth URL');
    } catch (err) {
      console.error('[OAuth Popup] Error opening popup:', err);
      try {
        window.location.href = href;
        reject(new Error('Unable to open popup; redirected to provider in this tab.'));
        return;
      } catch (e) {
        reject(new Error('Failed to initiate OAuth flow.'));
        return;
      }
    }

    const timer = setInterval(() => {
      if (popup && popup.closed) {
        clearInterval(timer);
        window.removeEventListener('message', onMessage);
        
        if (!messageReceived) {
          console.error('[OAuth Popup] Popup closed without receiving message', {
            expectedSource,
            messageReceived,
            timeSinceStart: Date.now()
          });
          reject(new Error('Popup closed before completing sign-in. Check redirect URI configuration.'));
        } else {
          console.log('[OAuth Popup] Popup closed normally after receiving message');
        }
      }
    }, 300);

    function onMessage(event: MessageEvent) {
      try {
        console.log('[OAuth Popup] Message received:', {
          origin: event.origin,
          expectedOrigin: window.location.origin,
          data: event.data
        });

        if (event.origin !== window.location.origin) {
          console.warn('[OAuth Popup] Message from wrong origin, ignoring');
          return;
        }
        
        const data: any = event.data || {};
        
        // Check for backend message format: { type, source, payload }
        if (data?.type === 'google-signin-callback' && data?.source === 'unifyn-login-service') {
          console.log('[OAuth Popup] Backend message format detected');
          const payload = data.payload || {};
          
          messageReceived = true;
          clearInterval(timer);
          window.removeEventListener('message', onMessage);
          
          if (payload.error) {
            console.error('[OAuth Popup] Error from backend:', payload.error_description || payload.error);
            reject(new Error(payload.error_description || payload.error));
          } else if (payload.id_token) {
            console.log('[OAuth Popup] ID token received successfully from backend');
            resolve(payload.id_token as string);
          } else {
            console.error('[OAuth Popup] No id_token in backend payload:', payload);
            reject(new Error('No id_token received from backend.'));
          }
          
          // Client closes popup after receiving message from backend
          try {
            console.log('[OAuth Popup] Closing popup from client');
            popup?.close();
          } catch (e) {
            console.warn('[OAuth Popup] Could not close popup:', e);
          }
          return;
        }
        
        // Check for Apple callback format
        if (data?.type === 'apple-signin-callback' && data?.source === 'unifyn-login-service') {
          console.log('[OAuth Popup] Apple backend message format detected');
          const payload = data.payload || {};
          
          messageReceived = true;
          clearInterval(timer);
          window.removeEventListener('message', onMessage);
          
          if (payload.error) {
            console.error('[OAuth Popup] Error from backend:', payload.error_description || payload.error);
            reject(new Error(payload.error_description || payload.error));
          } else if (payload.id_token) {
            console.log('[OAuth Popup] ID token received successfully from backend');
            resolve(payload.id_token as string);
          } else {
            console.error('[OAuth Popup] No id_token in backend payload:', payload);
            reject(new Error('No id_token received from backend.'));
          }
          
          // Client closes popup after receiving message from backend
          try {
            console.log('[OAuth Popup] Closing popup from client');
            popup?.close();
          } catch (e) {
            console.warn('[OAuth Popup] Could not close popup:', e);
          }
          return;
        }
        
        // Legacy frontend callback format: { source: 'google-id-token', id_token }
        if (data?.source === expectedSource) {
          console.log('[OAuth Popup] Legacy frontend callback format detected');
          
          messageReceived = true;
          clearInterval(timer);
          window.removeEventListener('message', onMessage);
          
          if (data.error) {
            console.error('[OAuth Popup] Error from callback:', data.error);
            reject(new Error(data.error));
          } else if (data.id_token) {
            console.log('[OAuth Popup] ID token received successfully');
            resolve(data.id_token as string);
          } else {
            console.error('[OAuth Popup] No id_token in message:', data);
            reject(new Error('No id_token received.'));
          }
          
          try {
            popup?.close();
          } catch (e) {
            console.warn('[OAuth Popup] Could not close popup:', e);
          }
          return;
        }
        
        console.log('[OAuth Popup] Message format not recognized:', {
          type: data?.type,
          source: data?.source,
          expectedSource
        });
      } catch (err) {
        console.error('[OAuth Popup] Error processing message:', err);
      }
    }

    window.addEventListener('message', onMessage);
    console.log('[OAuth Popup] Listening for postMessage from callback page');
  });
}



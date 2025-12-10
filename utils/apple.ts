'use client';

import { APPLE_CLIENT_ID, APPLE_REDIRECT_URI } from '../app/config';

declare global {
  interface Window {
    AppleID?: any;
    __appleJsLoaded?: boolean;
  }
}

function defaultRedirect(path: string) {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}${path}`;
}

let appleScriptPromise: Promise<void> | null = null;
let appleInitDone = false;

function loadAppleScript(): Promise<void> {
  if (window.__appleJsLoaded) return Promise.resolve();
  if (appleScriptPromise) return appleScriptPromise;
  appleScriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src =
      'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.__appleJsLoaded = true;
      resolve();
    };
    script.onerror = () => reject(new Error('Failed to load Apple Sign In JS'));
    document.head.appendChild(script);
  });
  return appleScriptPromise;
}

async function ensureAppleInit() {
  await loadAppleScript();
  if (appleInitDone) return;
  const AppleID = window.AppleID;
  if (!AppleID?.auth) throw new Error('AppleID.auth not available');
  AppleID.auth.init({
    clientId: APPLE_CLIENT_ID,
    scope: 'name email',
    redirectURI: APPLE_REDIRECT_URI || defaultRedirect('/auth/callback/apple'),
    usePopup: true,
  });
  appleInitDone = true;
}

export async function appleSignIn(): Promise<string> {
  await ensureAppleInit();
  const AppleID = window.AppleID;
  const result = await AppleID.auth.signIn();
  const idToken = result?.authorization?.id_token;
  if (!idToken) throw new Error('No Apple ID token returned');
  return idToken as string;
}











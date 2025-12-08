export const LIVE = process.env.NEXT_PUBLIC_LIVE === 'true';
export const SHOW_BROKER_UI = LIVE;
export const API_BASE_URL = 'https://home.unifyn.trade/api';
export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '1083679145981-7uapfectoq04orpvivjf9bgu2fcbpphq.apps.googleusercontent.com';
// Backend callback - server posts message to parent window with format:
// { type: 'google-signin-callback', source: 'unifyn-login-service', payload: { id_token, error } }
export const GOOGLE_REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || 'https://home.unifyn.trade/api/callbacks/google/signin';
export const APPLE_CLIENT_ID = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || 'ai.unifyn.app.signin';
// Backend callback - server posts message to parent window
export const APPLE_REDIRECT_URI = process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI || 'https://home.unifyn.trade/api/callbacks/apple/signin';

// Contact form API endpoints
export const CONTACT_ENDPOINTS = {
  INIT: '/api/public/contact/init',
  VERIFY: '/api/public/contact/verify',
  SUBMIT: '/api/public/contact',
} as const;
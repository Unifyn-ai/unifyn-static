'use client';

import { buildGoogleAuthUrl, oauthPopup } from './oauth';

/**
 * Sign in with Google using popup-based OAuth2 implicit flow
 * Opens a popup window, redirects to Google OAuth, and returns the ID token
 * 
 * This approach:
 * - Works with custom buttons (no need to use Google's button design)
 * - Uses implicit flow with response_type=id_token
 * - Returns a JWT ID token that can be verified by your backend
 * - No deprecated libraries (uses modern OAuth2 standards)
 */
export async function googleSignIn(): Promise<string> {
  try {
    const authUrl = buildGoogleAuthUrl();
    const idToken = await oauthPopup('google-id-token', authUrl);
    return idToken;
  } catch (error: any) {
    throw new Error(error?.message || 'Google sign-in failed');
  }
}



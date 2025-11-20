'use client';

import { useEffect, useState } from 'react';
import { logger } from '../../../../utils/logger';

export default function GoogleCallbackPage() {
  const [message, setMessage] = useState('Completing Google sign-in...');

  useEffect(() => {
    logger.log('[Google Callback] Page loaded', {
      url: window.location.href,
      hash: window.location.hash,
      hasOpener: !!window.opener,
      timestamp: new Date().toISOString()
    });

    try {
      const hash = (typeof window !== 'undefined' && window.location.hash) || '';
      const params = new URLSearchParams(hash.replace(/^#/, ''));
      const idToken = params.get('id_token');
      const state = params.get('state') || '';
      const error = params.get('error');
      const errorDesc = params.get('error_description');

      logger.log('[Google Callback] Parsed parameters:', {
        hasIdToken: !!idToken,
        idTokenLength: idToken?.length,
        state,
        error,
        errorDesc,
        allParams: Object.fromEntries(params.entries())
      });

      if (error) {
        const msg = `Google sign-in failed: ${errorDesc || error}`;
        logger.error('[Google Callback] Error in callback:', msg);
        setMessage(msg);
        if (window.opener) {
          logger.log('[Google Callback] Posting error to opener');
          window.opener.postMessage(
            { source: 'google-id-token', error: errorDesc || error, state },
            window.location.origin
          );
        } else {
          logger.warn('[Google Callback] No window.opener available');
        }
      } else if (idToken) {
        const msg = 'Google sign-in successful. You can close this window.';
        logger.log('[Google Callback] Success! Posting ID token to opener');
        setMessage(msg);
        if (window.opener) {
          window.opener.postMessage(
            { source: 'google-id-token', id_token: idToken, state },
            window.location.origin
          );
          logger.log('[Google Callback] Message posted successfully');
        } else {
          logger.warn('[Google Callback] No window.opener available');
        }
      } else {
        const msg = 'No id_token found in callback.';
        logger.warn('[Google Callback] No ID token in URL hash');
        setMessage(msg);
      }
    } catch (e: any) {
      const msg = `Unexpected error: ${e?.message || 'unknown'}`;
      logger.error('[Google Callback] Exception:', e);
      setMessage(msg);
    } finally {
      logger.log('[Google Callback] Scheduling window close in 600ms');
      setTimeout(() => {
        try {
          logger.log('[Google Callback] Closing window now');
          window.close();
        } catch (e) {
          logger.warn('[Google Callback] Could not close window:', e);
        }
      }, 600);
    }
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial, sans-serif',
      }}
    >
      <p>{message}</p>
    </div>
  );
}



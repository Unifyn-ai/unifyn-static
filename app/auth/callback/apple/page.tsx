'use client';

import { useEffect, useState } from 'react';

export default function AppleCallbackPage() {
  const [message, setMessage] = useState('Completing Apple sign-in...');

  useEffect(() => {
    try {
      const hash = (typeof window !== 'undefined' && window.location.hash) || '';
      const params = new URLSearchParams(hash.replace(/^#/, ''));
      const idToken = params.get('id_token');
      const state = params.get('state') || '';
      const error = params.get('error');
      const errorDesc = params.get('error_description');

      if (error) {
        setMessage(`Apple sign-in failed: ${errorDesc || error}`);
        if (window.opener) {
          window.opener.postMessage(
            { source: 'apple-id-token', error: errorDesc || error, state },
            window.location.origin
          );
        }
      } else if (idToken) {
        setMessage('Apple sign-in successful. You can close this window.');
        if (window.opener) {
          window.opener.postMessage(
            { source: 'apple-id-token', id_token: idToken, state },
            window.location.origin
          );
        }
      } else {
        setMessage('No id_token found in callback.');
      }
    } catch (e: any) {
      setMessage(`Unexpected error: ${e?.message || 'unknown'}`);
    } finally {
      setTimeout(() => {
        try {
          window.close();
        } catch {}
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










# Google Sign-In Redirect URI Issue

## 🔴 PROBLEM: Popup Closes Immediately

**Symptom:** When clicking "Continue with Google", the popup opens and closes immediately without completing sign-in.

**Root Cause:** The `GOOGLE_REDIRECT_URI` in `app/config.ts` is pointing to your **backend API** endpoint:
```typescript
GOOGLE_REDIRECT_URI = 'https://home.unifyn.trade/api/callbacks/google/signin'
```

But the **popup OAuth flow** expects to redirect to a **frontend callback page**:
```typescript
GOOGLE_REDIRECT_URI = 'https://unifyn.trade/auth/callback/google'  // ✅ Correct
```

## 🔍 WHAT'S HAPPENING

### Current (Broken) Flow:
```
1. User clicks "Continue with Google"
2. Popup opens → Google OAuth
3. User signs in with Google
4. Google redirects to: https://home.unifyn.trade/api/callbacks/google/signin ❌
5. Backend API responds (not a popup-friendly page)
6. Popup closes immediately without sending postMessage
7. Parent window never receives ID token
8. Error: "Popup closed before completing sign-in"
```

### Expected (Working) Flow:
```
1. User clicks "Continue with Google"
2. Popup opens → Google OAuth
3. User signs in with Google
4. Google redirects to: https://unifyn.trade/auth/callback/google ✅
5. Frontend callback page parses ID token from URL hash
6. Callback page posts message to parent window
7. Parent window receives ID token
8. Popup closes
9. Success! 🎉
```

## ✅ SOLUTION OPTIONS

### Option 1: Use Frontend Callback (RECOMMENDED)

Update `app/config.ts` to use the frontend callback page:

```typescript
// app/config.ts
export const GOOGLE_REDIRECT_URI = 
  process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || 
  ''; // Empty string = use frontend callback
  // Will default to: window.location.origin + '/auth/callback/google'
```

**OR set environment variable:**

```bash
# .env.local or Cloudflare Pages environment variables
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=https://unifyn.trade/auth/callback/google
```

### Option 2: Use Backend Callback (Requires Backend Changes)

If you **must** use the backend callback, you need to update your backend API to:

1. **Parse the ID token** from the URL hash (not query params!)
2. **Return an HTML page** that posts the ID token back to the parent window:

```html
<!-- Backend should return this HTML -->
<!DOCTYPE html>
<html>
<head>
  <title>Google Sign-In Callback</title>
</head>
<body>
  <p>Completing sign-in...</p>
  <script>
    // Parse ID token from URL hash
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const idToken = params.get('id_token');
    const error = params.get('error');
    
    // Post message to parent window
    if (window.opener) {
      window.opener.postMessage({
        source: 'google-id-token',
        id_token: idToken,
        error: error
      }, window.location.origin);
    }
    
    // Close popup
    setTimeout(() => window.close(), 500);
  </script>
</body>
</html>
```

## 🔧 RECOMMENDED FIX

**Step 1:** Update `app/config.ts`

```typescript
export const GOOGLE_REDIRECT_URI = 
  process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || '';
```

**Step 2:** Update Google Cloud Console

Go to: https://console.cloud.google.com/apis/credentials

1. Select your OAuth 2.0 Client ID
2. Add to **Authorized redirect URIs**:
   ```
   https://unifyn.trade/auth/callback/google
   http://localhost:3000/auth/callback/google
   ```
3. **Remove** (or keep for backend flows):
   ```
   https://home.unifyn.trade/api/callbacks/google/signin
   ```
4. Click **Save**
5. Wait 5-10 minutes for Google to propagate changes

**Step 3:** Test

```bash
# Clear browser cache
# Open browser DevTools Console
npm run dev

# Click "Continue with Google"
# Watch console logs with [OAuth] and [Google Callback] prefixes
```

## 📊 DEBUGGING WITH NEW LOGS

I've added comprehensive logging to help you debug:

### Console Logs to Watch:

```javascript
[LoginModal] Starting Google sign-in...
[OAuth] Building Google Auth URL: { redirectUri: "..." }
[OAuth] Generated OAuth URL: "https://accounts.google.com/..."
[OAuth Popup] Starting OAuth flow: { href: "..." }
[OAuth Popup] Popup opened successfully
[OAuth Popup] Navigating popup to OAuth URL
[OAuth Popup] Listening for postMessage from callback page

// After Google sign-in:
[Google Callback] Page loaded: { url: "...", hash: "#id_token=..." }
[Google Callback] Parsed parameters: { hasIdToken: true }
[Google Callback] Success! Posting ID token to opener
[Google Callback] Message posted successfully
[OAuth Popup] Message received: { data: { source: "google-id-token", ... } }
[OAuth Popup] ID token received successfully
[LoginModal] Google ID Token received: eyJhbGc...
```

### Common Error Logs:

**If redirect URI is wrong:**
```
[OAuth] Building Google Auth URL: { 
  redirectUri: "https://home.unifyn.trade/api/callbacks/google/signin" 
}
// Popup closes immediately, no callback logs appear
[OAuth Popup] Popup closed without receiving message
Error: "Popup closed before completing sign-in. Check redirect URI configuration."
```

**If Google rejects redirect URI:**
```
// In popup window, Google shows error page:
Error: redirect_uri_mismatch
```

**If callback page doesn't load:**
```
// No [Google Callback] logs appear
[OAuth Popup] Popup closed without receiving message
```

## 🧪 TESTING CHECKLIST

- [ ] Update `GOOGLE_REDIRECT_URI` in config
- [ ] Update Google Cloud Console redirect URIs
- [ ] Clear browser cache (Cmd+Shift+R / Ctrl+Shift+F5)
- [ ] Open DevTools Console before testing
- [ ] Click "Continue with Google"
- [ ] Watch for `[OAuth]` and `[Google Callback]` logs
- [ ] Verify popup shows Google sign-in screen
- [ ] Sign in with Google account
- [ ] Check console for ID token received
- [ ] Verify no errors in console

## 📝 CURRENT STATE

✅ **Added comprehensive logging** to all OAuth flow stages  
✅ **Logs show exact redirect URI being used**  
✅ **Logs show if callback page loads**  
✅ **Logs show if postMessage succeeds**  
⏳ **Need to update redirect URI configuration**

## 🆘 QUICK FIX

If you want to test RIGHT NOW without changing config:

```typescript
// Temporarily in utils/oauth.ts, line 38
const redirectUri = defaultRedirect('/auth/callback/google'); // Force use frontend
```

Then rebuild and test:
```bash
npm run build
npm run dev
```

---

**Next Step:** Update `app/config.ts` and Google Cloud Console, then test with the new detailed logging!



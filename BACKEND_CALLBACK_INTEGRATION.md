# Backend OAuth Callback Integration

## ✅ Fixed: Client Now Works with Backend Callback

Your backend OAuth callback has been fixed and now properly sends messages to the popup parent window. The client code has been updated to handle this.

## 🔄 Message Flow

### Backend Message Format
```javascript
{
  type: 'google-signin-callback',  // or 'apple-signin-callback'
  source: 'unifyn-login-service',
  payload: {
    id_token: 'eyJhbGc...',      // JWT ID token (on success)
    state: 'random-state-string',
    error: 'access_denied',       // error code (on failure)
    error_description: '...'      // error details (on failure)
  }
}
```

### Flow Diagram
```
┌─────────────────────────────────────────────────────────────────┐
│ 1. User clicks "Continue with Google" in your app              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. Client opens popup window                                    │
│    URL: https://accounts.google.com/o/oauth2/v2/auth           │
│    Params: client_id, redirect_uri (backend), response_type     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. User signs in with Google                                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. Google redirects to backend callback                         │
│    URL: https://home.unifyn.trade/api/callbacks/google/signin  │
│    Hash: #id_token=eyJhbGc...&state=xxx                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. Backend parses ID token from URL hash                        │
│    - Validates the token                                        │
│    - Returns HTML page with JavaScript                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 6. Backend JavaScript posts message to parent window            │
│    window.opener.postMessage({                                  │
│      type: 'google-signin-callback',                            │
│      source: 'unifyn-login-service',                            │
│      payload: { id_token, state }                               │
│    }, window.location.origin)                                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 7. Client receives message in parent window                     │
│    - Validates message origin                                   │
│    - Validates message type and source                          │
│    - Extracts id_token from payload                             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 8. Client closes popup window                                   │
│    popup.close() // Client responsibility                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 9. Client sends ID token to backend API                         │
│    POST /api/auth/google                                        │
│    Body: { token: id_token }                                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│ 10. Success! User is authenticated ✅                           │
└─────────────────────────────────────────────────────────────────┘
```

## 📝 Code Changes

### 1. Updated `utils/oauth.ts`

The `oauthPopup` function now handles **three message formats**:

#### A) Backend Format (Primary - for your backend)
```javascript
{
  type: 'google-signin-callback',
  source: 'unifyn-login-service',
  payload: { id_token, error, error_description }
}
```

#### B) Apple Backend Format (For Apple Sign-In)
```javascript
{
  type: 'apple-signin-callback',
  source: 'unifyn-login-service',
  payload: { id_token, error, error_description }
}
```

#### C) Legacy Frontend Format (Fallback)
```javascript
{
  source: 'google-id-token',  // or 'apple-id-token'
  id_token: '...',
  error: '...'
}
```

### 2. Key Features

✅ **Origin Validation** - Only accepts messages from same origin  
✅ **Multi-Format Support** - Works with backend and frontend callbacks  
✅ **Client Closes Popup** - Client is responsible for closing popup  
✅ **Comprehensive Logging** - Detailed console logs for debugging  
✅ **Error Handling** - Properly handles both success and error cases  
✅ **Backward Compatible** - Still works with frontend callbacks  

## 🧪 Testing

### Console Logs You'll See:

```javascript
[LoginModal] Starting Google sign-in...
[OAuth] Building Google Auth URL: {
  redirectUri: "https://home.unifyn.trade/api/callbacks/google/signin"
}
[OAuth Popup] Starting OAuth flow...
[OAuth Popup] Popup opened successfully
[OAuth Popup] Listening for postMessage from callback page

// After backend processes callback:
[OAuth Popup] Message received: {
  origin: "https://unifyn.trade",
  data: {
    type: "google-signin-callback",
    source: "unifyn-login-service",
    payload: { id_token: "eyJhbGc..." }
  }
}
[OAuth Popup] Backend message format detected
[OAuth Popup] ID token received successfully from backend
[OAuth Popup] Closing popup from client
[LoginModal] Google ID Token received: eyJhbGc...
```

### Test Command:
```bash
npm run dev

# Open DevTools Console
# Click "Continue with Google"
# Watch for [OAuth Popup] logs
```

## 🔒 Security Considerations

### Origin Validation
```javascript
if (event.origin !== window.location.origin) {
  console.warn('[OAuth Popup] Message from wrong origin, ignoring');
  return;
}
```
Only accepts messages from same origin (your domain).

### Message Format Validation
```javascript
if (data?.type === 'google-signin-callback' && 
    data?.source === 'unifyn-login-service') {
  // Process message
}
```
Validates specific type and source to prevent message injection.

### Popup Reference
The client maintains the popup reference and closes it after receiving the message, preventing the popup from staying open indefinitely.

## 🐛 Troubleshooting

### Issue: "Message format not recognized"
**Console:**
```
[OAuth Popup] Message format not recognized: {
  type: "...",
  source: "...",
  expectedSource: "google-id-token"
}
```

**Solution:** Check that your backend is sending the correct message format with:
- `type: 'google-signin-callback'`
- `source: 'unifyn-login-service'`
- `payload: { id_token, ... }`

### Issue: "Popup closed without receiving message"
**Possible causes:**
1. Backend callback didn't return HTML with postMessage script
2. Backend callback threw an error
3. Message was blocked by CORS or CSP
4. Message origin didn't match

**Solution:** 
- Check backend logs
- Verify backend returns HTML with postMessage JavaScript
- Check browser console for errors in popup window

### Issue: Origin mismatch
**Console:**
```
[OAuth Popup] Message from wrong origin, ignoring
```

**Solution:** Ensure your backend callback page is on the same domain as your frontend, or update the origin check if using different domains.

## 📊 Configuration

### Current Setup

```typescript
// app/config.ts
export const GOOGLE_REDIRECT_URI = 
  process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || 
  'https://home.unifyn.trade/api/callbacks/google/signin';

export const APPLE_REDIRECT_URI = 
  process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI || 
  'https://home.unifyn.trade/api/callbacks/apple/signin';
```

### Environment Variables (Optional)

```bash
# .env.local
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=https://home.unifyn.trade/api/callbacks/google/signin
NEXT_PUBLIC_APPLE_REDIRECT_URI=https://home.unifyn.trade/api/callbacks/apple/signin
```

## ✅ Checklist

- [x] Client handles backend message format
- [x] Client validates message origin
- [x] Client validates message type and source
- [x] Client closes popup after receiving message
- [x] Comprehensive logging added
- [x] Error handling implemented
- [x] Backward compatible with frontend callbacks
- [ ] Test with your backend
- [ ] Verify popup closes properly
- [ ] Verify no console errors

## 🚀 Ready to Test!

The client code is now fully compatible with your backend OAuth callback flow. Test it and watch the console logs to see the full message exchange!

---

**Backend Message Template for Reference:**

Your backend should return HTML similar to:

```html
<!DOCTYPE html>
<html>
<head><title>OAuth Callback</title></head>
<body>
  <p>Completing sign-in...</p>
  <script>
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const id_token = params.get('id_token');
    const error = params.get('error');
    
    if (window.opener) {
      window.opener.postMessage({
        type: 'google-signin-callback',
        source: 'unifyn-login-service',
        payload: {
          id_token: id_token,
          error: error,
          state: params.get('state')
        }
      }, window.location.origin);
    }
    
    // Don't close popup - let client handle it
  </script>
</body>
</html>
```






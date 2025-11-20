# Testing Guide - User Authentication

## Quick Testing Checklist

### 1. Test Unauthenticated State
- [ ] Open the app in a fresh browser (no cookies)
- [ ] Verify header shows "Login" and "Signup" buttons
- [ ] Verify "Trade" link is NOT visible in desktop navigation
- [ ] Open mobile menu and verify "Login" and "Signup" buttons appear
- [ ] Verify "Trade" link is NOT visible in mobile menu

### 2. Test Login Flow
- [ ] Click "Login" button
- [ ] Modal opens with authentication options
- [ ] Choose an authentication method (Google/Apple/Mobile/Email OTP)
- [ ] Complete authentication
- [ ] Verify success message appears
- [ ] Verify modal closes after authentication
- [ ] Verify header updates to show "Welcome, [Name/ID]"
- [ ] Verify red "Logout" button appears
- [ ] Verify "Trade" link becomes visible

### 3. Test Authenticated State
- [ ] Verify user name or ID is displayed (fallback to ID if name not available)
- [ ] Click "Trade" link
- [ ] Verify you navigate to `/trade` page
- [ ] Verify trade page shows personalized content with your name/ID
- [ ] Verify trade page displays correctly on desktop and mobile

### 4. Test Mobile Navigation (Authenticated)
- [ ] Open mobile menu (hamburger icon)
- [ ] Verify "Trade" link is visible in the menu
- [ ] Verify user info card shows at bottom with your name/ID
- [ ] Verify red "Logout" button is present
- [ ] Verify "Login" and "Signup" buttons are NOT visible

### 5. Test Logout Flow
- [ ] Click "Logout" button (desktop or mobile)
- [ ] Verify header returns to unauthenticated state
- [ ] Verify "Login" and "Signup" buttons reappear
- [ ] Verify "Trade" link disappears
- [ ] Try accessing `/trade` directly
- [ ] Verify you're redirected to home page

### 6. Test Session Persistence
- [ ] Login successfully
- [ ] Refresh the page
- [ ] Verify you remain logged in
- [ ] Verify header still shows authenticated state
- [ ] Open new tab with the same site
- [ ] Verify authentication persists across tabs

### 7. Test API Integration
**Using Browser DevTools:**
- [ ] Open Browser Console (F12)
- [ ] Go to Network tab
- [ ] Filter by "Fetch/XHR"
- [ ] On page load, verify request to `/user/details`
- [ ] Check request headers include cookies
- [ ] Verify `credentials: include` is set
- [ ] Check response shows user data with `s: "ok"`
- [ ] After logout, verify request to `/auth/logout`
- [ ] Verify subsequent `/user/details` returns 401 or empty user

## Manual Testing Commands

### Check User State in Browser Console
```javascript
// Open browser console and run:
fetch('https://home.unifyn.trade/api/user/details', {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log('User details:', data));
```

### Check Authentication Cookie
```javascript
// In browser console:
document.cookie
// Look for session/auth cookie
```

### Test Logout Endpoint
```javascript
// In browser console:
fetch('https://home.unifyn.trade/api/auth/logout', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(res => console.log('Logout status:', res.ok));
```

## Expected API Responses

### Authenticated User - `/user/details`
```json
{
  "s": "ok",
  "d": {
    "id": "AAA0005",
    "mobile": "9876543210",
    "email": "9876543210@anon.login.local",
    "name": "John Poe em",
    "email_verified": false,
    "mobile_verified": true,
    "two_factor_enabled": true,
    "status": "active",
    "created_at": "2025-11-16T19:45:59.390Z",
    "updated_at": "2025-11-16T19:45:59.390Z"
  }
}
```

### Unauthenticated User - `/user/details`
**Status: 401 Unauthorized**
```json
{
  "s": "error",
  "message": "Not authenticated"
}
```
*OR returns empty/null response*

## Visual Testing

### Desktop Layout (Not Authenticated)
```
[Logo]     [Home] [Features] [Security] [Contact]     [Login] [Signup] [Theme]
```

### Desktop Layout (Authenticated)
```
[Logo]     [Home] [Features] [Security] [Contact] [Trade]     [Welcome, John] [Logout] [Theme]
```

### Mobile Menu (Not Authenticated)
```
[Menu Icon]
└─ Sidebar:
   ├── Home
   ├── Features
   ├── Security
   ├── Contact
   ├── Privacy
   ├── Terms
   ├── Support
   ├── ─────────────
   ├── [Login] [Signup]
   └── Theme Selector
```

### Mobile Menu (Authenticated)
```
[Menu Icon]
└─ Sidebar:
   ├── Home
   ├── Features
   ├── Security
   ├── Contact
   ├── Trade          ← NEW
   ├── Privacy
   ├── Terms
   ├── Support
   ├── ─────────────
   ├── Logged in as
   │   John Poe em
   ├── [Logout]
   └── Theme Selector
```

## Common Issues & Solutions

### Issue 1: User stays logged out after authentication
**Check:**
- [ ] Modal is calling `refreshUser()` after successful auth
- [ ] `credentials: 'include'` is set in all API calls
- [ ] Backend is setting cookies correctly
- [ ] CORS headers allow credentials

**Solution:** Check browser console for errors

### Issue 2: Trade page always redirects to home
**Check:**
- [ ] UserProvider is wrapping the app in layout.tsx
- [ ] User state is being fetched correctly
- [ ] `/user/details` API is returning user data

**Solution:** Check Network tab for `/user/details` response

### Issue 3: Name not showing (shows ID instead)
**Expected Behavior:** This is correct! The system falls back to user ID if name is not available.

**Check API Response:**
```json
{
  "d": {
    "id": "AAA0005",
    "name": null  // or missing
  }
}
```
Should display: "Welcome, AAA0005"

### Issue 4: CORS errors
**Symptoms:** Console shows "blocked by CORS policy"

**Backend Requirements:**
```javascript
// Backend must set these headers:
Access-Control-Allow-Origin: https://unifyn.ai
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

### Issue 5: Cookies not being sent
**Check:**
- [ ] Using `credentials: 'include'` in fetch
- [ ] Cookie domain matches or is parent domain
- [ ] Cookie SameSite attribute is set correctly
- [ ] Using HTTPS (required for Secure cookies)

## Performance Testing

### Check Initial Load Time
- [ ] Open DevTools Performance tab
- [ ] Record page load
- [ ] Check time to fetch `/user/details`
- [ ] Should be < 500ms

### Check User State Update Speed
- [ ] Login and time how long until header updates
- [ ] Should update within 1 second after authentication

### Check Logout Speed
- [ ] Click logout and time until UI updates
- [ ] Should update immediately (< 200ms)

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab through all buttons and links
- [ ] Ensure "Login", "Signup", "Logout" are keyboard accessible
- [ ] Test with Enter key on focused elements
- [ ] Verify focus indicators are visible

### Screen Reader Testing
- [ ] Test with screen reader (VoiceOver, NVDA, JAWS)
- [ ] Verify login button announces correctly
- [ ] Verify welcome message is announced
- [ ] Verify logout button is announced

### Color Contrast
- [ ] Red logout button has sufficient contrast
- [ ] Welcome text is readable in both light and dark themes
- [ ] All buttons meet WCAG AA standards

## Browser Compatibility

Test in these browsers:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (macOS/iOS)
- [ ] Mobile Chrome (Android)
- [ ] Mobile Safari (iOS)

## Security Testing

### Cookie Security
- [ ] Open DevTools > Application > Cookies
- [ ] Verify auth cookie has `HttpOnly` flag
- [ ] Verify auth cookie has `Secure` flag (if HTTPS)
- [ ] Verify auth cookie has appropriate `SameSite` value

### XSS Protection
- [ ] Try injecting `<script>` in user name/ID
- [ ] Verify React escapes the content properly
- [ ] User name should render as text, not HTML

### CSRF Protection
- [ ] Logout should work (POST request with cookies)
- [ ] Verify backend validates requests properly

## Load Testing

### Multiple Rapid Logins/Logouts
- [ ] Login and logout 10 times rapidly
- [ ] Verify no memory leaks
- [ ] Verify UI updates correctly each time
- [ ] Check for console errors

### Concurrent Tab Testing
- [ ] Open app in 3 tabs
- [ ] Login in tab 1
- [ ] Verify tabs 2 and 3 update (may require refresh)
- [ ] Logout in tab 2
- [ ] Verify tab 1 shows logged out state (may require refresh)

## Success Criteria

✅ All tests pass  
✅ No console errors  
✅ User experience is smooth  
✅ Authentication persists across page loads  
✅ Mobile and desktop work correctly  
✅ Accessibility requirements met  
✅ Security best practices followed  

## Reporting Issues

When reporting issues, include:
1. Browser and version
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Console errors (if any)
6. Network tab screenshot showing API calls
7. Cookie information (if relevant)

## Next Steps After Testing

1. ✅ Verify all tests pass
2. 🚀 Deploy to staging environment
3. 🧪 Run end-to-end tests
4. 👥 Conduct user acceptance testing
5. 📊 Monitor analytics and error tracking
6. 🔄 Iterate based on feedback

---

**Need Help?** Check `USER_AUTHENTICATION_IMPLEMENTATION.md` for detailed architecture documentation.


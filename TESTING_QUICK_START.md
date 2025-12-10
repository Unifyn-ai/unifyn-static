# 🚀 Quick Start: Testing with Production API

## TL;DR - 3 Easy Steps

```bash
# 1. Start dev server
npm run dev

# 2. Launch Chrome with test flags (in another terminal)
npm run test:chrome

# 3. Test in Chrome at http://localhost:3000
```

That's it! Your app will call `https://unifyn.ai/api` even though it's running on localhost.

## What Happens?

✅ **Frontend**: Runs on `http://localhost:3000`  
✅ **API Calls**: Go to `https://unifyn.ai/api`  
✅ **Login**: Uses production credentials  
✅ **Broker APIs**: Real production data  

## Visual Verification

When Chrome launches, you'll see this warning:

```
⚠️ You are using an unsupported command-line flag: --disable-web-security.
   Stability and security will suffer.
```

This confirms the test flags are active! 🎉

## Testing the Broker Integration

1. **Login** with your production account
2. **Go to** `/trade` page
3. **Open DevTools** (F12 or Cmd+Option+I)
4. **Click** Network tab
5. **Observe** API calls to `https://unifyn.ai/api`

### What to Test

| Action | Expected API Call | Status |
|--------|------------------|--------|
| Land on /trade | `GET /brokers` | 200 |
| Land on /trade | `GET /brokers/accounts` | 200 or 404 |
| Click "Link Broker" | Modal opens | - |
| Submit credentials | `POST /brokers/accounts` | 201 |
| Click "Get Tokens" | `POST /brokers/accounts/:id/tokens` | 200 |
| Tokens displayed | Modal shows tokens | - |

## Network Tab Example

You should see:

```
🌐 Network Activity:
  ├─ GET  https://unifyn.ai/api/brokers                      → 200 ✅
  ├─ GET  https://unifyn.ai/api/brokers/accounts             → 200 ✅
  ├─ POST https://unifyn.ai/api/brokers/accounts             → 201 ✅
  └─ POST https://unifyn.ai/api/brokers/accounts/:id/tokens  → 200 ✅
```

## Console Commands

### Start Testing
```bash
# Terminal 1: Dev server
npm run dev

# Terminal 2: Test Chrome
npm run test:chrome
```

### Stop Testing
```bash
# Close Chrome test instance
# Press Cmd+Q (Mac) or Alt+F4 (Windows)

# Or force close:
killall "Google Chrome"           # Mac/Linux
taskkill /F /IM chrome.exe        # Windows
```

## Troubleshooting

### Chrome not launching?
```bash
# Make sure script is executable
chmod +x scripts/chrome-test.sh

# Try running directly
bash scripts/chrome-test.sh
```

### CORS errors?
- Close ALL Chrome windows first
- Re-run `npm run test:chrome`
- Check for warning banner in Chrome

### Cookies not working?
- Check DevTools → Application → Cookies
- Backend must allow `localhost` origin
- Backend cookies should use `SameSite: 'none'` or `'lax'`

### Can't see API calls?
- Open DevTools before navigating
- Filter Network tab by "Fetch/XHR"
- Make sure you're logged in

## Manual Chrome Launch (Alternative)

If scripts don't work, launch Chrome manually:

### macOS
```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --user-data-dir="/tmp/chrome-test-profile" \
  --disable-web-security \
  --disable-features=SameSiteByDefaultCookies \
  --allow-insecure-localhost \
  http://localhost:3000
```

### Windows
```cmd
"C:\Program Files\Google\Chrome\Application\chrome.exe" ^
  --user-data-dir="C:\temp\chrome-test-profile" ^
  --disable-web-security ^
  --disable-features=SameSiteByDefaultCookies ^
  --allow-insecure-localhost ^
  http://localhost:3000
```

### Linux
```bash
google-chrome \
  --user-data-dir="/tmp/chrome-test-profile" \
  --disable-web-security \
  --disable-features=SameSiteByDefaultCookies \
  --allow-insecure-localhost \
  http://localhost:3000
```

## ⚠️ Security Warning

**NEVER use this Chrome instance for:**
- Regular web browsing
- Banking or financial sites
- Entering sensitive information (except testing)
- Any production work

**ALWAYS close the test Chrome when done!**

## Full Documentation

See `LOCAL_TESTING_GUIDE.md` for comprehensive details.

## Success Checklist

- [ ] Chrome shows security warning banner
- [ ] Can access `http://localhost:3000`
- [ ] Login works with production credentials
- [ ] Network tab shows `https://unifyn.ai/api` calls
- [ ] Can navigate to `/trade` page
- [ ] Brokers list loads
- [ ] Can link a broker account
- [ ] Can fetch tokens
- [ ] Tokens modal displays data

## Need Help?

1. Check `LOCAL_TESTING_GUIDE.md` for detailed troubleshooting
2. Verify backend CORS settings allow `localhost:3000`
3. Check browser console for error messages
4. Verify `app/config.ts` has correct `API_BASE_URL`

---

**Happy Testing!** 🎉

Remember: Close the test Chrome when you're done! 🔒



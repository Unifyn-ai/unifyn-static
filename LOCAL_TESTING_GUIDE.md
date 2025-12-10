# Local Testing with Production API

## Quick Start Guide

Your app is already configured to call `https://unifyn.ai/api` from localhost. This guide shows you how to test it properly.

## Configuration

The app is already set up correctly in `app/config.ts`:

```typescript
export const API_BASE_URL = 'https://unifyn.ai/api';
```

This means all API calls will go to production, even when running on `localhost:3000`.

## Option 1: Chrome with Disabled Security (Recommended for Testing)

### macOS

Create a shell script or alias for easy testing:

```bash
# Close all Chrome instances first!
# Then run:

/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --user-data-dir="/tmp/chrome-test-profile" \
  --disable-web-security \
  --disable-features=SameSiteByDefaultCookies,CookiesWithoutSameSiteMustBeSecure \
  --allow-insecure-localhost \
  --ignore-certificate-errors \
  http://localhost:3000
```

### Windows

```cmd
REM Close all Chrome instances first!
REM Then run:

"C:\Program Files\Google\Chrome\Application\chrome.exe" ^
  --user-data-dir="C:\temp\chrome-test-profile" ^
  --disable-web-security ^
  --disable-features=SameSiteByDefaultCookies,CookiesWithoutSameSiteMustBeSecure ^
  --allow-insecure-localhost ^
  --ignore-certificate-errors ^
  http://localhost:3000
```

### Linux

```bash
# Close all Chrome instances first!
# Then run:

google-chrome \
  --user-data-dir="/tmp/chrome-test-profile" \
  --disable-web-security \
  --disable-features=SameSiteByDefaultCookies,CookiesWithoutSameSiteMustBeSecure \
  --allow-insecure-localhost \
  --ignore-certificate-errors \
  http://localhost:3000
```

### What These Flags Do

- `--user-data-dir`: Creates isolated Chrome profile (won't affect your normal browsing)
- `--disable-web-security`: Bypasses CORS restrictions
- `--disable-features=SameSiteByDefaultCookies`: Allows cookies across localhost ↔ production
- `--allow-insecure-localhost`: Allows mixed content (HTTP localhost → HTTPS API)
- `--ignore-certificate-errors`: Ignores SSL certificate issues

⚠️ **WARNING**: These flags disable security features. Only use for local testing, never for regular browsing!

## Option 2: Create a Quick Launch Script (Easy Method)

Create `scripts/chrome-test.sh` (macOS/Linux):

```bash
#!/bin/bash

# Kill any existing Chrome instances
killall "Google Chrome" 2>/dev/null || true

# Wait a moment
sleep 1

# Launch Chrome with test flags
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --user-data-dir="/tmp/chrome-test-profile" \
  --disable-web-security \
  --disable-features=SameSiteByDefaultCookies,CookiesWithoutSameSiteMustBeSecure \
  --allow-insecure-localhost \
  --ignore-certificate-errors \
  http://localhost:3000 &

echo "✅ Chrome launched with test flags!"
echo "🌐 Opening http://localhost:3000"
echo ""
echo "⚠️  Remember: This Chrome instance has disabled security!"
echo "   Close it when done testing."
```

Make it executable:

```bash
chmod +x scripts/chrome-test.sh
```

Create `scripts/chrome-test.bat` (Windows):

```batch
@echo off
echo Closing existing Chrome instances...
taskkill /F /IM chrome.exe 2>nul

timeout /t 2 /nobreak >nul

echo Launching Chrome with test flags...
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" ^
  --user-data-dir="C:\temp\chrome-test-profile" ^
  --disable-web-security ^
  --disable-features=SameSiteByDefaultCookies,CookiesWithoutSameSiteMustBeSecure ^
  --allow-insecure-localhost ^
  --ignore-certificate-errors ^
  http://localhost:3000

echo.
echo ✅ Chrome launched with test flags!
echo 🌐 Opening http://localhost:3000
echo.
echo ⚠️  Remember: This Chrome instance has disabled security!
echo    Close it when done testing.
```

Add to `package.json`:

```json
"scripts": {
  "dev": "next dev -p 3000",
  "test:chrome": "bash scripts/chrome-test.sh",
  "test:chrome:win": "scripts\\chrome-test.bat"
}
```

## Step-by-Step Testing Process

### 1. Start the Development Server

```bash
npm run dev
```

Server will start at `http://localhost:3000`

### 2. Launch Chrome with Test Flags

**Option A**: Use the script
```bash
npm run test:chrome      # macOS/Linux
npm run test:chrome:win  # Windows
```

**Option B**: Run the command directly (see Option 1 above)

### 3. Verify Setup

You should see a warning banner in Chrome:
> "You are using an unsupported command-line flag: --disable-web-security"

This confirms the security flags are active.

### 4. Test the Flow

#### A. Login to Production Account

1. Go to `http://localhost:3000`
2. Click "Login" or navigate to `/trade`
3. Login with your production credentials
4. The app will authenticate against `https://unifyn.ai/api`

#### B. Test Broker Integration

1. Navigate to `/trade` page
2. Check browser console (F12) → Network tab
3. You should see API calls to `https://unifyn.ai/api/brokers`
4. Click "Link a Broker Account"
5. Fill in test credentials
6. Submit and watch Network tab for `POST https://unifyn.ai/api/brokers/accounts`
7. Click "Get Tokens" on a linked account
8. Verify `POST https://unifyn.ai/api/brokers/accounts/:id/tokens`

### 5. Verify API Calls in DevTools

**Open Chrome DevTools** (F12 or Cmd+Option+I):

```
Network Tab → Filter by "Fetch/XHR"
```

You should see:
- ✅ `GET https://unifyn.ai/api/brokers`
- ✅ `GET https://unifyn.ai/api/brokers/accounts`
- ✅ `POST https://unifyn.ai/api/brokers/accounts`
- ✅ `POST https://unifyn.ai/api/brokers/accounts/:id/tokens`

All with status `200` or appropriate status codes.

### 6. Verify Cookies

**Check Cookies** in DevTools:

```
Application Tab → Cookies → http://localhost:3000
```

After login, you should see:
- `access_token` (from authentication)
- Possibly `refresh_token`, `feed_token` (after getting broker tokens)

⚠️ **Note**: Cookies from `https://unifyn.ai` might not be visible in localhost due to domain restrictions, but they should still be sent with requests via `credentials: 'include'`.

## Option 3: Environment Override (Optional)

If you want flexibility to switch between local and production APIs, you can use environment variables:

Create `.env.local`:

```bash
# Use production API (default)
NEXT_PUBLIC_API_BASE_URL=https://unifyn.ai/api

# Or use local API for backend development
# NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

Update `app/config.ts`:

```typescript
export const API_BASE_URL = 
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://unifyn.ai/api';
```

Then you can easily switch between local and production APIs.

## Troubleshooting

### Issue: CORS Errors

**Symptoms**: Console shows `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution**: 
- Make sure Chrome is launched with `--disable-web-security`
- Close ALL Chrome windows before launching test instance
- Verify the warning banner appears in Chrome

### Issue: Cookies Not Working

**Symptoms**: Authentication works but subsequent requests show 401

**Solution**:
- Use `--disable-features=SameSiteByDefaultCookies`
- Check that API calls include `credentials: 'include'` (already implemented)
- Backend must set cookies with appropriate SameSite settings

### Issue: Mixed Content Blocked

**Symptoms**: Browser blocks HTTP → HTTPS requests

**Solution**:
- Use `--allow-insecure-localhost` flag
- Already implemented in the launch commands above

### Issue: Certificate Errors

**Symptoms**: SSL certificate warnings

**Solution**:
- Use `--ignore-certificate-errors` flag
- Already implemented in the launch commands above

### Issue: Can't Close Chrome

**Solution**:
```bash
# macOS/Linux
killall "Google Chrome"

# Windows
taskkill /F /IM chrome.exe
```

## Production Backend Requirements

For this to work, your production backend (`https://unifyn.ai/api`) needs:

### 1. CORS Configuration

```javascript
// Backend should allow localhost for development
app.use(cors({
  origin: ['https://unifyn.ai', 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 2. Cookie Configuration

```javascript
// Set cookies with appropriate settings
res.cookie('access_token', token, {
  httpOnly: true,
  secure: true,  // or false for localhost testing
  sameSite: 'none', // or 'lax' for development
  maxAge: 3600000
});
```

## Testing Checklist

- [ ] Start dev server (`npm run dev`)
- [ ] Launch Chrome with test flags
- [ ] See security warning banner in Chrome
- [ ] Navigate to `http://localhost:3000`
- [ ] Login with production credentials
- [ ] Navigate to `/trade` page
- [ ] Verify brokers list loads (check Network tab)
- [ ] Verify accounts list loads (or shows empty state)
- [ ] Click to link a broker account
- [ ] Fill credentials and submit
- [ ] Verify account appears after creation
- [ ] Click "Get Tokens" on an account
- [ ] Verify tokens modal shows data
- [ ] Check cookies in DevTools
- [ ] Verify all API calls in Network tab show `https://unifyn.ai/api`

## Quick Reference Commands

```bash
# Start development server
npm run dev

# Launch test Chrome (after creating scripts)
npm run test:chrome          # macOS/Linux
npm run test:chrome:win      # Windows

# Kill Chrome instances
killall "Google Chrome"      # macOS/Linux
taskkill /F /IM chrome.exe   # Windows

# Check what's running on port 3000
lsof -i :3000                # macOS/Linux
netstat -ano | findstr :3000 # Windows
```

## Security Reminder

⚠️ **IMPORTANT**: 
- Only use these Chrome flags for local development testing
- Never browse regular websites with these flags enabled
- Close the test Chrome instance when done
- These flags disable important security features
- Don't share this Chrome profile or use it for sensitive operations

## Alternative: Use Production Directly

If local testing is too complex, you can:

1. Deploy to a staging environment
2. Test directly on `https://unifyn.ai` with DevTools
3. Use browser extensions like "Allow CORS" (less reliable)

## Summary

✅ Your app is already configured correctly  
✅ All API calls go to `https://unifyn.ai/api`  
✅ Launch Chrome with special flags for testing  
✅ Login works with production credentials  
✅ Broker integration APIs call production  
✅ Cookies handled correctly with `credentials: 'include'`  

Happy testing! 🚀



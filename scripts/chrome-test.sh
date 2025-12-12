#!/bin/bash

echo "🧪 Launching Chrome for Local Testing..."
echo ""

# Kill any existing Chrome instances
echo "Closing existing Chrome instances..."
killall "Google Chrome" 2>/dev/null || true

# Wait a moment
sleep 1

# Launch Chrome with test flags
echo "Starting Chrome with security flags disabled..."
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --user-data-dir="/tmp/chrome-test-profile" \
  --disable-web-security \
  --disable-features=SameSiteByDefaultCookies,CookiesWithoutSameSiteMustBeSecure \
  --allow-insecure-localhost \
  --ignore-certificate-errors \
  http://localhost:3000 &

echo ""
echo "✅ Chrome launched with test flags!"
echo "🌐 Opening http://localhost:3000"
echo "🔗 API calls will go to https://unifyn.ai/api"
echo ""
echo "⚠️  WARNING: This Chrome instance has disabled security features!"
echo "   Only use for testing. Close it when done."
echo ""
echo "📋 To test:"
echo "   1. Login with production credentials"
echo "   2. Go to /trade page"
echo "   3. Open DevTools (Cmd+Option+I) → Network tab"
echo "   4. Test broker integration"
echo ""




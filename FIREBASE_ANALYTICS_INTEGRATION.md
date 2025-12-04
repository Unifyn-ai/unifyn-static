# Firebase Analytics Integration

## Overview
Firebase Analytics has been successfully integrated into the Unifyn Static project. This document explains how to use the analytics features.

## Configuration
The Firebase configuration is stored in `/lib/firebase.ts` with the following credentials:

- **Project ID**: unifyn-app
- **Measurement ID**: G-KECX2K59XQ
- **App ID**: 1:1063551145481:web:ffa9b8c5c65bbe8c210ad8

## Architecture

### Files Created
1. **`lib/firebase.ts`** - Core Firebase initialization and configuration
2. **`lib/analytics.ts`** - Analytics utility functions for logging events
3. **`components/FirebaseProvider.tsx`** - React provider component that initializes Firebase on the client side

### Integration Points
The `FirebaseProvider` has been integrated into the app layout (`app/layout.tsx`) as the outermost provider, ensuring Firebase Analytics is initialized before any other components.

## Usage

### Automatic Page Views
Firebase Analytics automatically tracks page views when properly initialized. No additional code is needed for basic page view tracking.

### Custom Event Logging

Import the analytics functions in your components:

```typescript
import { logAnalyticsEvent, logLoginEvent, logSignUpEvent } from '@/lib/analytics';
```

#### Available Functions

1. **Generic Event Logging**
```typescript
await logAnalyticsEvent('custom_event_name', { 
  param1: 'value1',
  param2: 'value2'
});
```

2. **Page View Tracking**
```typescript
await logPageView('Page Title', '/page-path');
```

3. **User Authentication Events**
```typescript
// Log sign-up
await logSignUpEvent('google'); // or 'apple', 'email'

// Log login
await logLoginEvent('google'); // or 'apple', 'email'
```

4. **User Identification**
```typescript
// Set user ID
await setAnalyticsUserId('user_123');

// Set user properties
await setAnalyticsUserProperties({
  subscription_tier: 'premium',
  account_type: 'trader'
});
```

5. **Business Events**
```typescript
// Log broker connection
await logBrokerConnectionEvent('Zerodha');

// Log search
await logSearchEvent('AAPL stock');

// Log button clicks
await logButtonClick('cta_button', 'homepage');
```

6. **UI Interaction Events**
```typescript
// Log modal events
await logModalOpen('LoginModal');
await logModalClose('LoginModal');
```

7. **Error Tracking**
```typescript
await logErrorEvent('API call failed', 'user_authentication');
```

## Example Integration in Components

### Example: Login Modal

```typescript
"use client";
import { logModalOpen, logLoginEvent } from '@/lib/analytics';

export function LoginModal() {
  useEffect(() => {
    // Track modal open
    logModalOpen('LoginModal');
  }, []);

  const handleGoogleLogin = async () => {
    try {
      // Perform login...
      await logLoginEvent('google');
    } catch (error) {
      await logErrorEvent('Google login failed', 'LoginModal');
    }
  };

  return (
    // Modal JSX...
  );
}
```

### Example: Page Component

```typescript
"use client";
import { logPageView } from '@/lib/analytics';
import { useEffect } from 'react';

export default function TradePage() {
  useEffect(() => {
    logPageView('Trade Page', '/trade');
  }, []);

  return (
    // Page content...
  );
}
```

## Best Practices

1. **Client-Side Only**: All analytics functions are designed to work only on the client side. They will safely return if called on the server.

2. **Error Handling**: All analytics functions include built-in error handling and will log errors to the console without breaking your app.

3. **Privacy**: Be mindful of user privacy. Don't log personally identifiable information (PII) without proper consent.

4. **Event Naming**: Use descriptive, consistent event names. Firebase recommends using lowercase with underscores (e.g., `button_click`, not `ButtonClick` or `button-click`).

5. **Parameter Limits**: Firebase Analytics has limits on event parameters:
   - Maximum 25 user properties
   - Maximum 25 unique event parameters per event
   - Event names up to 40 characters
   - Parameter names up to 40 characters
   - Parameter values up to 100 characters

## Testing

To verify Firebase Analytics is working:

1. Open your browser's Developer Tools (F12)
2. Navigate to the Network tab
3. Filter by "google-analytics.com" or "analytics"
4. You should see requests being sent to Firebase Analytics

Alternatively, check the Firebase Console:
- Go to [Firebase Console](https://console.firebase.google.com/)
- Select your project (unifyn-app)
- Navigate to Analytics → Events
- View real-time events (may take a few minutes to appear)

## Debugging

If analytics isn't working:

1. Check the browser console for errors
2. Ensure Firebase Analytics is supported in the browser (some ad blockers may interfere)
3. Verify you're on a production domain (localhost may have limitations)
4. Check that cookies are enabled

## Environment-Specific Configuration

Currently, the same Firebase configuration is used for all environments. If you need separate environments:

1. Create separate Firebase projects for development/staging/production
2. Use environment variables to switch between configurations
3. Update `lib/firebase.ts` to read from environment variables

Example:
```typescript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  // ... other config
};
```

## Next Steps

Consider implementing:
1. User property tracking for better segmentation
2. E-commerce tracking for transaction events
3. Custom dimension tracking for specific metrics
4. Conversion tracking for key business goals
5. Integration with Google Analytics 4 for advanced reporting

## Support

For Firebase Analytics documentation, visit:
- [Firebase Analytics Docs](https://firebase.google.com/docs/analytics)
- [Measure events](https://firebase.google.com/docs/analytics/events)
- [User properties](https://firebase.google.com/docs/analytics/user-properties)



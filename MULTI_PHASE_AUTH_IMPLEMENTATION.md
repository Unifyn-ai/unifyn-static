# Multi-Phase Authentication Implementation

## Overview
This document describes the implementation of a comprehensive authentication flow that handles three different post-OTP verification scenarios:

1. **New User** - Requires profile completion with name and MPIN setup
2. **Existing User with 2FA** - Requires MPIN verification
3. **Fully Authenticated** - Direct login without additional steps

## Architecture

### API Response Scenarios

#### Scenario 1: New User (Profile Completion Required)
```json
{
  "s": "ok",
  "d": {
    "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "isNewUser": true,
    "message": "OTP verified. Please complete your profile."
  }
}
```

**Flow:**
1. User verifies OTP successfully
2. System detects `isNewUser: true`
3. LoginModal closes (backend has set temp auth cookie)
4. CompleteProfileModal opens automatically
5. User enters: Name, MPIN (6 digits), Repeat MPIN
6. System validates MPIN match and length
7. Calls `POST /auth/complete-profile` (uses HTTP-only cookie)
8. Refreshes user data and closes modal

#### Scenario 2: Existing User with 2FA
```json
{
  "s": "ok",
  "d": {
    "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "isNewUser": false,
    "message": "OTP verified. Please complete 2FA.",
    "requires_2fa": true
  }
}
```

**Flow:**
1. User verifies OTP successfully
2. System detects `requires_2fa: true`
3. LoginModal closes (backend has set temp auth cookie)
4. VerifyMpinModal opens automatically
5. User enters 6-digit MPIN
6. Calls `POST /auth/verify-2fa` (uses HTTP-only cookie)
7. Refreshes user data and closes modal

#### Scenario 3: Fully Authenticated
```json
{
  "s": "ok",
  "d": {
    "user": {
      "id": "AAA0005",
      "mobile": "9876543210",
      "name": "John Doe",
      "email": "john@example.com",
      ...
    },
    "tokens": {
      "access": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

**Flow:**
1. User verifies OTP successfully
2. System detects complete user object with tokens
3. Refreshes user data and closes modal immediately
4. No additional steps required

## Implementation Details

### Files Modified

#### 1. `/lib/auth.ts`
Added two new authentication functions:

```typescript
// Complete user profile for new users
export function completeProfile(name: string, mpin: string)

// Verify 2FA MPIN for existing users
export function verify2FA(mpin: string)
```

Both functions rely on HTTP-only cookies for authentication (no token parameters needed).

#### 2. `/components/modals/CompleteProfileModal.tsx` (NEW)
Dedicated modal for new user profile completion:
- Clean, focused component for a single purpose
- Handles name input and MPIN creation/confirmation
- Full validation and error handling
- Beautiful 6-digit MPIN input fields

#### 3. `/components/modals/VerifyMpinModal.tsx` (NEW)
Dedicated modal for 2FA MPIN verification:
- Clean, focused component for a single purpose
- Handles 6-digit MPIN input with paste support
- Auto-focus and keyboard navigation
- Clear security messaging

#### 4. `/components/modals/LoginModal.tsx`
Refactored to be cleaner and more modular:

**New State Variables:**
- `showVerifyMpinModal`: Controls visibility of MPIN verification modal
- `showCompleteProfileModal`: Controls visibility of profile completion modal

**Enhanced Callback Functions:**
1. `onVerifyOtp()` - Enhanced to detect response type and open appropriate modal
   - Closes LoginModal and opens CompleteProfileModal for new users
   - Closes LoginModal and opens VerifyMpinModal for 2FA users
   - Directly logs in for fully authenticated users

**Modular Architecture:**
- Each modal is self-contained with its own state management
- No complex conditional rendering in LoginModal
- Easy to maintain, test, and extend
- Clear separation of concerns

### UI/UX Features

#### Modular Modal Architecture
Each authentication phase has its own dedicated modal:
- **LoginModal**: "Welcome back" with login icon - handles initial authentication
- **CompleteProfileModal**: "Complete Your Profile" with user icon - handles new user onboarding
- **VerifyMpinModal**: "Security Verification" with lock icon - handles 2FA verification

Benefits:
- Clean, focused code for each phase
- No complex conditional rendering
- Easy to test and maintain
- Better performance (modals load on demand)

#### MPIN Input Fields
Beautifully designed 6-digit input fields with:
- Auto-focus on next field when digit is entered
- Backspace navigation to previous field
- Paste support for all 6 digits at once
- Password masking for security
- Numeric keyboard on mobile devices
- Visual feedback with cyan accent colors

#### Profile Completion Form
Clean, user-friendly form with:
- Full name text input
- 6-digit MPIN creation
- 6-digit MPIN confirmation
- Real-time validation:
  - Name cannot be empty
  - Both MPINs must be 6 digits
  - MPINs must match
- Clear error messages

#### Modal Transitions
- Smooth transitions between modals (300ms delay)
- LoginModal closes before opening next modal
- Each modal is independent and self-contained
- Appropriate CTAs for each modal:
  - LoginModal: "Send OTP" / "Verify OTP"
  - CompleteProfileModal: "Complete Profile"
  - VerifyMpinModal: "Verify MPIN"

### Security Features

1. **HTTP-Only Cookie Authentication**: Backend sets secure HTTP-only cookies automatically
2. **MPIN Validation**: Ensures both MPINs match before submission
3. **Password Input Type**: MPIN fields use password type for masking
4. **Credentials Include**: All API calls include `credentials: 'include'` to send cookies
5. **Input Sanitization**: Only numeric input allowed for MPIN fields

### Error Handling

Comprehensive error handling for all scenarios:
- OTP verification failures
- 2FA verification failures
- Profile completion failures
- Network errors
- Validation errors (MPIN mismatch, length, etc.)

All errors displayed in user-friendly format below the form.

### Accessibility

- Proper label associations with input fields
- Keyboard navigation support
- ARIA attributes for screen readers
- Focus management for better UX
- High contrast colors for readability

## API Integration

All API calls use HTTP-only cookies for authentication. The `postJson` helper includes `credentials: 'include'` to automatically send cookies with each request.

### Endpoints Used

1. **POST** `/auth/mobile/verify` or `/auth/email/verify`
   - Verifies OTP and determines next step
   - Returns one of three response types
   - Sets HTTP-only auth cookie on success

2. **POST** `/auth/complete-profile`
   - Body: `{ name: string, mpin: string }`
   - Uses HTTP-only cookie for authentication
   - Completes new user registration

3. **POST** `/auth/verify-2fa`
   - Body: `{ mpin: string }`
   - Uses HTTP-only cookie for authentication
   - Verifies existing user's MPIN

## Testing Checklist

### New User Flow
- [ ] Verify OTP with new mobile/email
- [ ] Check profile completion form appears
- [ ] Test name validation (empty/whitespace)
- [ ] Test MPIN length validation
- [ ] Test MPIN mismatch error
- [ ] Test successful profile completion
- [ ] Verify user is logged in after completion

### 2FA Flow
- [ ] Verify OTP with existing user (2FA enabled)
- [ ] Check MPIN input appears
- [ ] Test 6-digit MPIN entry
- [ ] Test paste functionality
- [ ] Test incorrect MPIN error
- [ ] Test successful 2FA verification
- [ ] Verify user is logged in after verification

### Direct Login Flow
- [ ] Verify OTP with existing user (no 2FA)
- [ ] Check immediate login
- [ ] Verify modal closes automatically
- [ ] Confirm user state updated

### Edge Cases
- [ ] Network failures during profile completion
- [ ] Network failures during 2FA verification
- [ ] Invalid token scenarios
- [ ] Session timeout handling
- [ ] Multiple rapid submissions

## Future Enhancements

1. **MPIN Strength Indicator**: Add visual feedback for MPIN strength
2. **Biometric 2FA**: Support fingerprint/face ID for 2FA
3. **Remember Device**: Option to skip 2FA on trusted devices
4. **MPIN Recovery**: Flow to reset forgotten MPIN
5. **Progressive Disclosure**: Show password strength tips
6. **Accessibility Improvements**: Enhanced screen reader support

## Maintenance Notes

### Modular Architecture Benefits
- Each modal manages its own state independently
- No shared state between modals (clean separation)
- Easy to add new authentication phases (just create a new modal)
- Easy to modify individual phases without affecting others
- Consistent error handling patterns across all modals
- All API calls use the centralized `postJson` helper

### Component Structure
```
LoginModal.tsx
├── Handles: Initial authentication (OAuth + OTP)
├── Opens: CompleteProfileModal or VerifyMpinModal
└── Returns: User to app on success

CompleteProfileModal.tsx
├── Handles: New user profile setup
├── Validates: Name, MPIN match, MPIN length
└── Returns: User to app on success

VerifyMpinModal.tsx
├── Handles: 2FA verification
├── Validates: 6-digit MPIN
└── Returns: User to app on success
```

### Adding New Authentication Steps
To add a new authentication step:
1. Create a new modal component (e.g., `VerifyEmailModal.tsx`)
2. Add state in `LoginModal` to control visibility
3. Detect the new scenario in `onVerifyOtp()` response
4. Open the new modal with transition timing
5. Handle success/error in the new modal independently

## Support

For issues or questions regarding this implementation, refer to:
- Backend API documentation for endpoint details
- `BACKEND_CALLBACK_INTEGRATION.md` for OAuth flows
- `USER_AUTHENTICATION_IMPLEMENTATION.md` for authentication context


# Authentication Implementation

This document describes the authentication implementation in the Flowtool application.

## Overview

The authentication system is built using the API endpoints provided by the backend, with a clean separation of concerns:

- **API Layer** (`lib/api/`) - Axios-based API client and service methods
- **Hooks** (`lib/hooks/`) - React hooks for auth state management
- **Components** - Form components with React Hook Form + Zod validation
- **Protected Routes** - Route protection wrapper component

## Architecture

### API Client (`lib/api/axios.ts`)

- Axios instance with base URL configuration
- Request interceptor to attach JWT tokens
- Response interceptor for 401 handling
- Automatic token removal and redirect on unauthorized

### Auth API (`lib/api/auth.ts`)

Service methods for:
- `register()` - User registration
- `verifyOtp()` - OTP verification
- `login()` - User login
- `getUserInfo()` - Fetch user details
- `resendOtp()` - Resend OTP email

### Company API (`lib/api/company.ts`)

Service method for:
- `setup()` - Company creation and configuration

### Auth Hook (`lib/hooks/useAuth.ts`)

React hook providing:
- User state management
- Authentication status
- Login/logout methods
- Loading states

## Authentication Flow

### 1. Registration Flow

```
User fills form → POST /auth/register → OTP sent to email
                ↓
Store temp registration data in localStorage
                ↓
Redirect to OTP verification page
```

**Implementation:**
- Form: `components/auth/register/register-form.tsx`
- Validation: `lib/validations/register.ts`
- API: `authApi.register()`

**Data Stored:**
- `temp_register_data` - Temporary registration data for OTP resend

### 2. OTP Verification Flow

```
User enters 6-digit OTP → POST /auth/verify-otp → Success
                         ↓
Store token and user info → Clear temp data
                         ↓
Redirect to company setup
```

**Implementation:**
- Form: `components/auth/otp-verify/otp-verify-form.tsx`
- Validation: `lib/validations/otp.ts`
- API: `authApi.verifyOtp()`

**Data Stored:**
- `auth_token` - JWT authentication token
- `user_info` - User object with userId, orgId

**Features:**
- Auto-focus next input
- Paste support for 6-digit codes
- 60-second resend timer
- Individual digit inputs

### 3. Login Flow

```
User enters credentials → POST /auth/login → Check response
                         ↓
Has activeCompany? → Yes → Dashboard
                   ↓
                   No → Company Setup
```

**Implementation:**
- Form: `components/auth/login/login-form.tsx`
- Validation: `lib/validations/login.ts`
- API: `authApi.login()`

**Response Handling:**
- **With Active Company**: Store full user object, redirect to dashboard
- **No Active Company**: Redirect to company setup

**Data Stored:**
- `auth_token` - JWT authentication token
- `user_info` - Full user object with activeCompany

### 4. Company Setup Flow

```
User fills company details → POST /api/company/setup → Success
                           ↓
Update user_info with activeCompany
                           ↓
Redirect to dashboard
```

**Implementation:**
- Form: `components/company-setup/company-setup-form.tsx`
- Steps: `components/company-setup/steps/`
- Validation: `lib/validations/company-setup.ts`
- API: `companyApi.setup()`

**Features:**
- 3-step conversational UI
- Progressive disclosure (collapsible sections)
- Enter key to advance
- Auto-generated short code
- Auto-selected currency based on country

## Protected Routes

### Usage

Wrap any page component with `ProtectedRoute`:

```tsx
import ProtectedRoute from "@/components/auth/protected-route";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      {/* Your protected content */}
    </ProtectedRoute>
  );
}
```

### Behavior

- Checks authentication status from localStorage
- Shows loading spinner while checking
- Redirects to `/auth/login` if not authenticated
- Renders children if authenticated

## Local Storage Data

### Keys Used

1. **`auth_token`** (string)
   - JWT token for API authentication
   - Added to Authorization header automatically
   - Cleared on logout or 401 response

2. **`user_info`** (JSON object)
   - User details after login
   - Updated after company setup
   - Structure:
     ```json
     {
       "userId": "200123456",
       "orgId": "100234567",
       "fullName": "John Doe",
       "email": "john@example.com",
       "appRole": "user",
       "orgRole": "owner",
       "activeCompany": "comp_001"
     }
     ```

3. **`temp_register_data`** (JSON object)
   - Temporary storage during registration
   - Used for OTP resend
   - Cleared after successful OTP verification
   - Structure:
     ```json
     {
       "firstName": "John",
       "lastName": "Doe",
       "email": "john@example.com",
       "password": "hashedPassword"
     }
     ```

## Error Handling

### API Errors

All API calls use try-catch with toast notifications:

```typescript
try {
  const response = await authApi.login(data);
  // Success handling
} catch (error: any) {
  const errorMessage = error.response?.data?.message || error.message;
  toast.error("Login failed", { description: errorMessage });
}
```

### 401 Unauthorized

Axios interceptor automatically:
1. Catches 401 responses
2. Clears localStorage
3. Redirects to login page

### Form Validation

- Client-side validation with Zod schemas
- Real-time error messages
- Field-specific error display

## Environment Variables

### Required

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:9000
```

### Usage

The API client automatically uses this base URL:

```typescript
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9000";
```

## API Endpoints Used

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/login` - User login
- `GET /api/auth/user-info` - Get user details (protected)

### Company

- `POST /api/company/setup` - Create/configure company

## Security Features

1. **Password Validation**: Minimum 6 characters
2. **Email Normalization**: Lowercase and trimmed
3. **Token Management**: Automatic attachment to requests
4. **Auto Logout**: On token expiration (401)
5. **Protected Routes**: Client-side route protection
6. **Secure Storage**: LocalStorage for token persistence

## Toast Notifications

All user feedback uses Sonner toast:

- **Success**: Green toast with success icon
- **Error**: Red toast with error details
- **Info**: Blue toast for informational messages

## Form Features

### Common to All Forms

- React Hook Form for state management
- Zod for validation
- Loading states during submission
- Disabled buttons while loading
- Error message display
- Accessible form controls

### Register Form

- Split first/last name fields
- Email validation
- Password strength indicator
- Sign in link for existing users

### OTP Form

- 6 individual digit inputs
- Auto-focus next input
- Paste support
- Backspace navigation
- Resend timer (60 seconds)
- Back button to registration

### Login Form

- Remember me checkbox (optional)
- Forgot password link
- Sign up link for new users
- Conditional redirect based on activeCompany

### Company Setup Form

- Multi-step wizard (3 steps)
- Conversational UI
- Keyboard shortcuts (Enter to continue)
- Progressive disclosure
- Auto-generated values
- Step validation

## Testing Checklist

- [ ] Register new user
- [ ] Verify email with OTP
- [ ] Resend OTP
- [ ] Login with credentials
- [ ] Login without active company → redirects to setup
- [ ] Complete company setup
- [ ] Login with active company → redirects to dashboard
- [ ] Access protected route without auth → redirects to login
- [ ] Token expiration handling
- [ ] Invalid credentials error
- [ ] Network error handling

## Future Enhancements

1. **Refresh Token**: Implement token refresh mechanism
2. **Remember Me**: Persistent sessions
3. **Social Auth**: Google, GitHub login
4. **2FA**: Two-factor authentication
5. **Password Reset**: Forgot password flow
6. **Session Management**: Multiple device handling
7. **Activity Logging**: Login history and audit trail

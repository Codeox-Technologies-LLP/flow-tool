# Cookie-Based Storage Implementation

This project uses cookies for client-side data persistence instead of localStorage for better security and SSR compatibility.

## Cookie Storage Utility

Located at: `/lib/utils/cookies.ts`

### Features

- **js-cookie** library for cookie management
- TypeScript support with proper typing
- Automatic JSON serialization/deserialization
- Configurable expiration times
- Security options (secure, sameSite)

### Available Methods

#### Auth Token
```typescript
cookieStorage.setAuthToken(token: string)
cookieStorage.getAuthToken(): string | undefined
cookieStorage.removeAuthToken()
```

#### User Info
```typescript
cookieStorage.setUserInfo(userInfo: object)
cookieStorage.getUserInfo<T>(): T | null
cookieStorage.removeUserInfo()
```

#### Temporary Registration Data
```typescript
cookieStorage.setTempRegisterData(data: object)
cookieStorage.getTempRegisterData<T>(): T | null
cookieStorage.removeTempRegisterData()
```

#### Clear All
```typescript
cookieStorage.clearAll()
```

## Security Configuration

### Production
- `secure: true` - HTTPS only
- `sameSite: 'lax'` - CSRF protection
- Appropriate expiration times

### Development
- `secure: false` - HTTP allowed
- `sameSite: 'lax'` - CSRF protection

### Cookie Expiration

| Cookie | Expiration | Purpose |
|--------|-----------|---------|
| `auth_token` | 7 days | Authentication token |
| `user_info` | 7 days | User metadata |
| `temp_register_data` | 1 hour | Temporary registration data for OTP resend |

## Usage in Authentication Flow

### 1. Registration
```typescript
// components/auth/register/register-form.tsx
const response = await authApi.register(data);
if (response.status) {
  cookieStorage.setTempRegisterData({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,
  });
  router.push(`/auth/otp-verify?email=${encodeURIComponent(data.email)}`);
}
```

### 2. OTP Verification
```typescript
// components/auth/otp-verify/otp-verify-form.tsx
const response = await authApi.verifyOtp({ email, otp });
if (response.status) {
  cookieStorage.setAuthToken(response.token);
  cookieStorage.setUserInfo({
    userId: response.userId,
    orgId: response.orgId,
  });
  cookieStorage.removeTempRegisterData();
  
  // Sign in with NextAuth
  await signIn("credentials", {
    redirect: false,
    email,
    token: response.token,
  });
}
```

### 3. OTP Resend
```typescript
// lib/api/auth.ts
resendOtp: async (email: string) => {
  const tempUser = cookieStorage.getTempRegisterData();
  if (!tempUser) {
    throw new Error("No registration data found");
  }
  const response = await apiClient.post("/auth/register", tempUser);
  return response.data;
}
```

### 4. API Requests
```typescript
// lib/api/axios.ts
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = cookieStorage.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});
```

### 5. Unauthorized Handling
```typescript
// lib/api/axios.ts
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      cookieStorage.clearAll();
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);
```

## Benefits Over localStorage

1. **SSR Compatible** - Cookies are available on the server
2. **Security** - Can be configured as httpOnly, secure, sameSite
3. **Auto Expiration** - Built-in expiration handling
4. **Cross-domain** - Can be configured for subdomain access
5. **Size Limit** - 4KB encourages minimal data storage

## Migration from localStorage

All previous `localStorage` calls have been replaced:

| Old | New |
|-----|-----|
| `localStorage.setItem("auth_token", token)` | `cookieStorage.setAuthToken(token)` |
| `localStorage.getItem("auth_token")` | `cookieStorage.getAuthToken()` |
| `localStorage.removeItem("auth_token")` | `cookieStorage.removeAuthToken()` |
| `localStorage.setItem("user_info", JSON.stringify(data))` | `cookieStorage.setUserInfo(data)` |
| `JSON.parse(localStorage.getItem("user_info"))` | `cookieStorage.getUserInfo()` |

## NextAuth Integration

While NextAuth manages session cookies automatically (HTTP-only), we still use `cookieStorage` for:

1. **Auth Token** - Used in axios interceptors for API calls
2. **User Info** - Quick access to user metadata
3. **Temporary Data** - Registration data for OTP resend

This dual approach ensures:
- Secure session management (NextAuth)
- Easy API authentication (cookies)
- Temporary data persistence (cookies)

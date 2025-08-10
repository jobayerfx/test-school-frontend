# Authentication System Documentation

## Overview

This application implements a comprehensive authentication system with server-side token validation using the `/auth/me` endpoint, automatic token refresh, and middleware-based authorization. The system ensures secure access to protected routes while maintaining a smooth user experience.

## Architecture

### Components

1. **TokenValidation** (`src/utils/tokenValidation.ts`)
   - Server-side token validation using `/auth/me` endpoint
   - Async token validation with proper error handling
   - User data retrieval from validated tokens

2. **TokenManager** (`src/utils/tokenManager.ts`)
   - Token storage in localStorage and cookies
   - Secure token management
   - Cross-platform token access

3. **AuthService** (`src/services/authService.ts`)
   - Centralized authentication operations
   - Login/logout handling
   - Token refresh management

4. **AuthGuard** (`src/components/AuthGuard.tsx`)
   - Client-side route protection
   - Async token validation on component mount
   - Automatic redirect handling

5. **Middleware** (`src/middleware.ts`)
   - Server-side route protection
   - Pre-render authorization checks
   - Cookie-based token validation using `/auth/me` endpoint

6. **ProtectedLayout** (`src/components/ProtectedLayout.tsx`)
   - Wrapper for protected pages
   - Automatic token refresh initialization
   - Dashboard layout integration

## Features

### Token Validation
- **Server-Side Validation**: All tokens are validated using the `/auth/me` endpoint
- **Async Validation**: Non-blocking token validation with proper loading states
- **Automatic Refresh**: Proactive token refresh before expiration
- **Fallback Handling**: Graceful degradation when tokens expire

### Security Features
- **Dual Storage**: Tokens stored in both localStorage (client-side) and cookies (server-side)
- **Secure Cookies**: HttpOnly cookies with SameSite protection
- **Token Rotation**: Automatic refresh token rotation
- **Session Management**: Proper session cleanup on logout
- **Server Validation**: No client-side JWT decoding for enhanced security

### User Experience
- **Seamless Authentication**: No interruption during token validation
- **Loading States**: Proper loading indicators during validation
- **Error Handling**: Graceful error handling with user feedback
- **Redirect Management**: Smart redirects based on authentication state

## Usage

### Protected Routes

All protected routes are automatically wrapped with authentication:

```typescript
// Dashboard pages
/dashboard/*

// Questions management
/questions/*

// Tests
/tests/*

// Reports
/reports/*

// Profile
/profile/*
```

### Adding New Protected Routes

1. **Update Middleware**: Add the route to `protectedRoutes` array in `src/middleware.ts`
2. **Create Layout**: Add a layout file with `ProtectedLayout` wrapper
3. **Update Types**: Add any necessary type definitions

### Authentication State Management

```typescript
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

// Check authentication status
const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

// Get current user
const user = useSelector((state: RootState) => state.auth.user);

// Get tokens
const { accessToken, refreshToken } = useSelector((state: RootState) => state.auth);
```

### Manual Token Operations

```typescript
import { AuthService } from '@/services/authService';

// Check if authenticated (async)
const isAuth = await AuthService.isAuthenticated();

// Get current user
const user = AuthService.getCurrentUser();

// Validate token (async)
const isValid = await AuthService.validateToken();

// Manual logout
AuthService.logout();
```

## API Integration

### Automatic Token Handling

The API slice automatically includes tokens in requests:

```typescript
// Tokens are automatically added to headers
const response = await api.get('/protected-endpoint');
```

### Token Validation

All token validation is handled server-side:

```typescript
// Validate token using /auth/me endpoint
const validationResult = await TokenValidation.validateToken(token);
if (validationResult.isValid) {
  // Token is valid, proceed
  const user = validationResult.user;
} else {
  // Token is invalid, handle accordingly
  console.error('Token validation failed:', validationResult.error);
}
```

### Token Refresh

Automatic token refresh is handled by:

1. **Background Refresh**: `useTokenRefresh` hook monitors token validation
2. **API Interceptors**: Failed requests trigger token refresh
3. **Proactive Refresh**: Tokens are refreshed based on server validation

## Error Handling

### Token Expiration

When tokens expire:

1. **Automatic Refresh**: System attempts to refresh using refresh token
2. **Fallback**: If refresh fails, user is logged out
3. **Redirect**: User is redirected to login with expired parameter
4. **Cleanup**: All stored tokens are cleared

### Network Errors

- **Retry Logic**: Failed requests are retried after token refresh
- **User Feedback**: Clear error messages for authentication failures
- **Graceful Degradation**: System continues to work with cached data when possible

## Security Considerations

### Token Storage
- **localStorage**: Used for client-side access
- **Cookies**: Used for server-side middleware validation
- **HttpOnly**: Cookies are set with HttpOnly flag when possible
- **SameSite**: Cookies use SameSite=Strict for CSRF protection

### Token Validation
- **Server-Side**: All token validation happens server-side via `/auth/me` endpoint
- **Client-Side**: Components validate tokens on mount using server calls
- **Real-Time**: Continuous validation during user session
- **No JWT Decoding**: Enhanced security by avoiding client-side JWT parsing

### Token Refresh
- **Proactive**: Tokens are refreshed before expiration
- **Silent**: Refresh happens in background without user interruption
- **Secure**: Refresh tokens are rotated on each use

## Configuration

### Environment Variables

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

### Token Settings

- **Access Token Expiry**: 1 hour (configurable)
- **Refresh Token Expiry**: 7 days (configurable)
- **Refresh Strategy**: Hourly refresh or based on server validation
- **Cookie Expiry**: 1 day for access, 7 days for refresh

## Troubleshooting

### Common Issues

1. **Token Expired**: User is automatically redirected to login
2. **Refresh Failed**: User session is cleared and redirected
3. **Network Errors**: System retries with fresh tokens
4. **Storage Issues**: Fallback to cookie-only storage

### Debug Information

```typescript
import { TokenManager } from '@/utils/tokenManager';

// Get token information (async)
const tokenInfo = await TokenManager.getTokenInfo();
console.log('Token validation result:', tokenInfo);
```

## Best Practices

1. **Always use ProtectedLayout** for new protected routes
2. **Handle loading states** during authentication checks
3. **Provide clear error messages** for authentication failures
4. **Test token validation** scenarios during development
5. **Monitor token refresh** success rates in production
6. **Use async/await** for all token validation operations

## Future Enhancements

- **Role-based Access Control**: Implement RBAC for different user roles
- **Multi-factor Authentication**: Add MFA support
- **Session Management**: Add session timeout warnings
- **Audit Logging**: Track authentication events
- **Device Management**: Allow users to manage active sessions
- **Offline Support**: Handle authentication during network outages 
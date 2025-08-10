import { store } from '@/store/store';
import { setCredentials, logout, updateTokens, updateUser } from '@/store/authSlice';
import { TokenManager } from '@/utils/tokenManager';
import { TokenValidation } from '@/utils/tokenValidation';

export class AuthService {
  // Login user
  static async login(email: string, password: string) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      // Store tokens and user data
      store.dispatch(setCredentials({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        isAuthenticated: true,
      }));

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Logout user
  static logout() {
    store.dispatch(logout());
  }

  // Refresh token
  static async refreshToken(refreshToken: string) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      
      // Update tokens in store
      store.dispatch(updateTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      }));

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Check if user is authenticated (async)
  static async isAuthenticated(): Promise<boolean> {
    const state = store.getState();
    if (!state.auth.isAuthenticated) return false;
    
    const token = state.auth.accessToken;
    if (!token) return false;
    
    return await TokenValidation.isTokenValid(token);
  }

  // Get current user
  static getCurrentUser() {
    const state = store.getState();
    return state.auth.user;
  }

  // Get access token
  static getAccessToken(): string | null {
    const state = store.getState();
    return state.auth.accessToken;
  }

  // Validate token (async)
  static async validateToken(): Promise<boolean> {
    const token = this.getAccessToken();
    return token ? await TokenValidation.isTokenValid(token) : false;
  }

  // Get user from token (async)
  static async getUserFromToken(): Promise<any> {
    const token = this.getAccessToken();
    return token ? await TokenValidation.getUserFromToken(token) : null;
  }

  // Initialize auth state from storage (async)
  static async initializeAuth(): Promise<boolean> {
    const user = TokenManager.getUser();
    const accessToken = TokenManager.getAccessToken();
    const refreshToken = TokenManager.getRefreshToken();
    
    if (user && accessToken) {
      const isValid = await TokenValidation.isTokenValid(accessToken);
      if (isValid) {
        store.dispatch(setCredentials({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        }));
        return true;
      }
    }
    
    return false;
  }

  // Clear all auth data
  static clearAuth() {
    TokenManager.clearTokens();
    store.dispatch(logout());
  }

  // Handle token expiration
  static handleTokenExpiration() {
    this.clearAuth();
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login?expired=true';
    }
  }

  // Validate and update user (async)
  static async validateAndUpdateUser(): Promise<boolean> {
    const token = this.getAccessToken();
    if (!token) return false;
    
    const validationResult = await TokenValidation.validateToken(token);
    if (validationResult.isValid && validationResult.user) {
      store.dispatch(updateUser(validationResult.user));
      return true;
    }
    
    return false;
  }
} 
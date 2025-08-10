import { TokenValidation } from './tokenValidation';

export class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = 'accessToken';
  private static readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private static readonly USER_KEY = 'user';

  // Set tokens in both cookies and localStorage
  static setTokens(accessToken: string, refreshToken: string, user: any) {
    // Set in localStorage for client-side access
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));

    // Set in cookies for server-side access (httpOnly for security)
    this.setCookie(this.ACCESS_TOKEN_KEY, accessToken, 1); // 1 day
    this.setCookie(this.REFRESH_TOKEN_KEY, refreshToken, 7); // 7 days
  }

  // Get tokens from localStorage
  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static getUser(): any | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  // Clear all tokens
  static clearTokens() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);

    // Clear cookies
    this.deleteCookie(this.ACCESS_TOKEN_KEY);
    this.deleteCookie(this.REFRESH_TOKEN_KEY);
  }

  // Check if user is authenticated (async)
  static async isAuthenticated(): Promise<boolean> {
    const token = this.getAccessToken();
    if (!token) return false;
    
    return await TokenValidation.isTokenValid(token);
  }

  // Get token info (async)
  static async getTokenInfo() {
    const token = this.getAccessToken();
    if (!token) return null;

    const result = await TokenValidation.validateToken(token);
    return {
      isValid: result.isValid,
      user: result.user,
      error: result.error,
    };
  }

  // Private methods for cookie management
  private static setCookie(name: string, value: string, days: number) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
  }

  private static deleteCookie(name: string) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  }

  // Get cookie value (for server-side access)
  static getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null; // Server-side
    
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }
} 
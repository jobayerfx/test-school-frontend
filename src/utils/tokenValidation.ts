interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface TokenValidationResult {
  isValid: boolean;
  user?: User;
  error?: string;
}

export class TokenValidation {
  static async validateToken(token: string): Promise<TokenValidationResult> {
    if (!token) {
      return { isValid: false, error: 'No token provided' };
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const user = await response.json();
        return { isValid: true, user };
      } else {
        return { isValid: false, error: 'Token validation failed' };
      }
    } catch (error) {
      return { isValid: false, error: 'Network error' };
    }
  }

  static async isTokenValid(token: string): Promise<boolean> {
    const result = await this.validateToken(token);
    return result.isValid;
  }

  static async getUserFromToken(token: string): Promise<User | null> {
    const result = await this.validateToken(token);
    return result.user || null;
  }
} 
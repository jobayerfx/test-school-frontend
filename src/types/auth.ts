export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: { id: string; name: string; email: string; role: string };
        tokens: {
            accessToken: string;
            refreshToken: string;
        }
    }
}
  
export interface LoginRequest {
    email: string;
    password: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

  
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}
  
export interface ForgotPasswordRequest {
  email: string;
}
  
export interface ResetPasswordRequest {
  token: string;
  password: string;
}
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TokenManager } from '@/utils/tokenManager';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

// Initialize state from localStorage if available
const getInitialState = async (): Promise<AuthState> => {
  if (typeof window !== 'undefined') {
    const user = TokenManager.getUser();
    const accessToken = TokenManager.getAccessToken();
    const refreshToken = TokenManager.getRefreshToken();
    
    if (user && accessToken) {
      // Validate token asynchronously
      const isValid = await TokenManager.isAuthenticated();
      return {
        user,
        accessToken,
        refreshToken,
        isAuthenticated: isValid,
      };
    }
  }
  
  return {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
  };
};

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthState>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      
      // Store tokens in TokenManager
      if (action.payload.accessToken && action.payload.refreshToken && action.payload.user) {
        TokenManager.setTokens(
          action.payload.accessToken,
          action.payload.refreshToken,
          action.payload.user
        );
      }
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      
      // Clear tokens from TokenManager
      TokenManager.clearTokens();
    },
    updateTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      
      // Update tokens in TokenManager
      if (state.user) {
        TokenManager.setTokens(
          action.payload.accessToken,
          action.payload.refreshToken,
          state.user
        );
      }
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      // Update user in TokenManager
      if (state.accessToken && state.refreshToken) {
        TokenManager.setTokens(
          state.accessToken,
          state.refreshToken,
          action.payload
        );
      }
    },
  },
});

export const { setCredentials, logout, updateTokens, updateUser } = authSlice.actions;
export default authSlice.reducer;

import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { updateTokens, updateUser } from '@/store/authSlice';
import { useRefreshTokenMutation } from '@/store/apiSlice';
import { TokenValidation } from '@/utils/tokenValidation';

export const useTokenRefresh = () => {
  const dispatch = useDispatch();
  const { accessToken, refreshToken, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [refreshTokenMutation] = useRefreshTokenMutation();
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !accessToken || !refreshToken) {
      return;
    }

    const scheduleRefresh = async () => {
      // Clear existing timeout
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }

      // Validate token using /auth/me endpoint
      const validationResult = await TokenValidation.validateToken(accessToken);
      
      if (!validationResult.isValid) {
        // Token is invalid, try to refresh immediately
        await performRefresh();
      } else {
        // Token is valid, check if it needs refresh (you can implement a refresh strategy here)
        // For now, we'll refresh every hour
        refreshTimeoutRef.current = setTimeout(async () => {
          await performRefresh();
        }, 60 * 60 * 1000); // 1 hour
      }
    };

    const performRefresh = async () => {
      try {
        const result = await refreshTokenMutation({ refreshToken }).unwrap();
        dispatch(updateTokens({
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        }));
        
        // Schedule next refresh
        scheduleRefresh();
      } catch (error) {
        console.error('Token refresh failed:', error);
        // If refresh fails, the user will be logged out on next API call
      }
    };

    // Initial schedule
    scheduleRefresh();

    // Cleanup on unmount
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [isAuthenticated, accessToken, refreshToken, dispatch, refreshTokenMutation]);

  return null;
}; 
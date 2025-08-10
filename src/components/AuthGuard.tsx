"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter, useSearchParams } from "next/navigation";
import { logout } from "@/store/authSlice";
import { TokenValidation } from "@/utils/tokenValidation";
import { useRefreshTokenMutation } from "@/store/apiSlice";

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const [isValidating, setIsValidating] = useState(true);
  
  const { isAuthenticated, accessToken, refreshToken } = useSelector((state: RootState) => state.auth);
  const [refreshTokenMutation] = useRefreshTokenMutation();

  useEffect(() => {
    const validateToken = async () => {
      if (!isAuthenticated || !accessToken) {
        router.push("/login");
        return;
      }

      // Validate token using /auth/me endpoint
      const validationResult = await TokenValidation.validateToken(accessToken);
      
      if (!validationResult.isValid) {
        // Token is invalid, try to refresh
        if (refreshToken) {
          try {
            const result = await refreshTokenMutation({ refreshToken }).unwrap();
            // Token refreshed successfully, continue
            setIsValidating(false);
            return;
          } catch (error) {
            // Refresh failed, logout user
            dispatch(logout());
            router.push("/login?expired=true");
            return;
          }
        } else {
          // No refresh token, logout user
          dispatch(logout());
          router.push("/login?expired=true");
          return;
        }
      }

      // Token is valid, update user if needed
      if (validationResult.user) {
        
      }

      setIsValidating(false);
    };

    validateToken();
  }, [isAuthenticated, accessToken, refreshToken, router, dispatch, refreshTokenMutation]);

  // Show loading while validating
  if (isValidating) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  // If not authenticated, don't render children
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

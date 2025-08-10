"use client";

import React from 'react';
import AuthGuard from './AuthGuard';
import Layout from './Dashboard/Layout';
import { useTokenRefresh } from '@/hooks/useTokenRefresh';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  // Initialize automatic token refresh
  useTokenRefresh();

  return (
    <AuthGuard>
      <Layout>
        {children}
      </Layout>
    </AuthGuard>
  );
} 
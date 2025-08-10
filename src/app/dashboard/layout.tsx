import { Metadata } from 'next';
import ProtectedLayout from '@/components/ProtectedLayout';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Comprehensive analytics and performance metrics for the test schools system.',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
} 
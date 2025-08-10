import { Metadata } from 'next';
import ProtectedLayout from '@/components/ProtectedLayout';

export const metadata: Metadata = {
  title: 'Tests',
  description: 'Take tests and view test history for the test schools system.',
};

export default function TestsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
} 
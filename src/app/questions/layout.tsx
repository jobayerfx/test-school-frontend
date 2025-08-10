import { Metadata } from 'next';
import ProtectedLayout from '@/components/ProtectedLayout';

export const metadata: Metadata = {
  title: 'Questions Management',
  description: 'Create, edit, and manage test questions for the tests schools system.',
};

export default function QuestionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
} 
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Register',
  description: 'Create a new account to access the school management system.',
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 
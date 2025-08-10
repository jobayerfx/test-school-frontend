import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Login',
  description: 'Login to access the admin dashboard and manage your application.',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 
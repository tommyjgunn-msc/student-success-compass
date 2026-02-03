import type { Metadata } from 'next';
import { TestProvider } from '@/context/TestContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Student Success Compass | ALCHE',
  description: 'Discover your learning profile and get personalized support recommendations.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-surface">
        <TestProvider>
          {children}
        </TestProvider>
      </body>
    </html>
  );
}

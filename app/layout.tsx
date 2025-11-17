import type { Metadata } from 'next';
import './globals.css';
import SessionProvider from '@/components/providers/SessionProvider';
import ConditionalLayout from '@/components/layout/ConditionalLayout';
import CartProviderWithToast from '@/components/cart/CartProviderWithToast';
import ToastContainer from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: 'Claim Records',
  description: 'Claim Your Stake!',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />
      </head>
      <body className="flex flex-col h-full min-h-screen">
        <SessionProvider>
          <CartProviderWithToast>
            <ConditionalLayout>{children}</ConditionalLayout>
            <ToastContainer />
          </CartProviderWithToast>
        </SessionProvider>
      </body>
    </html>
  );
}


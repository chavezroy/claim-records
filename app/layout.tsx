import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import './globals.css';
import Header from '@/components/layout/Header';
import { CartProvider } from '@/contexts/CartContext';
import SessionProvider from '@/components/providers/SessionProvider';

// Dynamically import Footer to avoid hydration issues
const Footer = dynamic(() => import('@/components/layout/Footer'), {
  ssr: false,
  loading: () => (
    <footer className="bg-dark-bg text-gray-400 py-5">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '2rem', minHeight: '100px' }}>
          <div style={{ flex: '1 1 300px', minWidth: '250px' }}></div>
          <div style={{ flex: '1 1 300px', minWidth: '250px' }}></div>
        </div>
      </div>
    </footer>
  ),
});

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
          <CartProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}


'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('./Footer'), {
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

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideHeaderFooter = pathname === '/coming-soon';

  return (
    <>
      {!hideHeaderFooter && <Header />}
      <main className={hideHeaderFooter ? 'h-screen' : 'flex-grow'}>{children}</main>
      {!hideHeaderFooter && <Footer />}
    </>
  );
}


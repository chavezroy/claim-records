'use client';

import Link from 'next/link';
import Navigation from './Navigation';
import BrandLogo from '@/components/logo/BrandLogo';

export default function Header() {
  return (
    <header className="w-full overflow-x-hidden">
      <div className="container mx-auto px-4 overflow-x-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 py-1 overflow-x-hidden">
          <Link
            href="/"
            className="flex items-center no-underline flex-shrink-0"
            aria-label="Claim Records Home"
          >
            <BrandLogo variant="header" showAnimation={true} animateOnHover={true} />
          </Link>
          <Navigation />
        </div>
      </div>
    </header>
  );
}


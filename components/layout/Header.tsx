'use client';

import Link from 'next/link';
import Navigation from './Navigation';
import BrandLogo from '@/components/logo/BrandLogo';

export default function Header() {
  return (
    <header className="w-full">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center md:justify-between gap-4 py-3">
          <Link
            href="/"
            className="flex items-center no-underline"
            aria-label="Claim Records Home"
          >
            <BrandLogo variant="header" animateOnHover={true} />
          </Link>
          <Navigation />
        </div>
      </div>
    </header>
  );
}


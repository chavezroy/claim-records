import Link from 'next/link';
import Image from 'next/image';
import Navigation from './Navigation';

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
            <Image
              src="/img/logo_ClaimRecords.svg"
              alt="Claim Records"
              width={200}
              height={44}
              className="h-11 w-auto"
              priority
            />
          </Link>
          <Navigation />
        </div>
      </div>
    </header>
  );
}


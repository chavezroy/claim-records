import Link from 'next/link';
import Image from 'next/image';
import Navigation from './Navigation';

export default function Header() {
  return (
    <div className="container">
      <header className="d-flex flex-wrap justify-content-center py-3">
        <Link
          href="/"
          className="d-flex align-items-center mb-3 mb-md-0 me-md-auto logo-header no-underline mr-auto"
        >
          <Image
            src="/img/logo_ClaimRecords.svg"
            alt="Claim Records"
            width={200}
            height={44}
            className="h-11 w-auto"
            priority
          />
          <span className="sr-only">Claim Records</span>
        </Link>
        <Navigation />
      </header>
    </div>
  );
}


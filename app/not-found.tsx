import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container py-20 text-center">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Page not found</p>
      <Link href="/" className="text-primary hover:underline">
        Return home
      </Link>
    </div>
  );
}


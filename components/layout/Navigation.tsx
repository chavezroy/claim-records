'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/artists', label: 'Artists' },
  { href: '/shop', label: 'Shop' },
  { href: '/faqs', label: 'FAQs' },
  { href: '/about', label: 'About' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <ul className="nav nav-pills flex flex-wrap justify-center items-center gap-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href || 
          (item.href === '/artists' && pathname?.startsWith('/artists')) ||
          (item.href === '/shop' && pathname?.startsWith('/shop'));
        return (
          <li key={item.href} className="nav-item list-none">
            <Link
              href={item.href}
              className={`nav-link px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
      <li className="nav-item list-none">
        <Link href="/shop" className="nav-link px-3 py-2 text-gray-700 hover:text-primary">
          <i className="bi bi-bag"></i>
        </Link>
      </li>
    </ul>
  );
}


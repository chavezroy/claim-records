'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';

const navItems = [
  { href: '/artists', label: 'Artists' },
  { href: '/shop', label: 'Shop' },
  { href: '/faqs', label: 'FAQs' },
  { href: '/about', label: 'About' },
];

export default function Navigation() {
  const pathname = usePathname();
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  return (
    <nav aria-label="Main navigation">
      <ul className="flex flex-wrap items-center justify-end gap-2 list-none m-0 p-0">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href === '/artists' && pathname?.startsWith('/artists')) ||
            (item.href === '/shop' && pathname?.startsWith('/shop'));
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`px-3 py-2 rounded-md transition-colors ${
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
        <li>
          <Link 
            href="/cart" 
            className="px-3 py-2 text-gray-700 hover:text-primary relative inline-block"
            aria-label={`Shopping cart${cartCount > 0 ? ` with ${cartCount} items` : ''}`}
          >
            <i className="bi bi-bag"></i>
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#ff6b35] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold leading-none">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
        </li>
      </ul>
    </nav>
  );
}


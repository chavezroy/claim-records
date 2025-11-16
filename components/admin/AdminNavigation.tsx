'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/posts', label: 'Posts' },
  { href: '/admin/artists', label: 'Artists' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/videos', label: 'Videos' },
  { href: '/admin/media', label: 'Media' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/comments', label: 'Comments' },
];

export default function AdminNavigation() {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  return (
    <nav className="bg-gray-100 border-b border-gray-300">
      <div className="container mx-auto px-4">
        <div className="flex items-end h-16 relative">
          {/* Left: Admin heading */}
          <div className="flex-shrink-0 flex items-end" style={{ paddingBottom: '0.5rem' }}>
            <Link 
              href="/admin/dashboard" 
              className="text-sm font-bold text-gray-900 hover:text-gray-700 transition-colors uppercase flex items-center"
            >
              <i className="bi bi-lock-fill mr-2"></i>
              Admin
            </Link>
          </div>
          
          {/* Center: Tabs */}
          <div className="flex-1 flex justify-center items-end">
            <div className="hidden sm:flex sm:items-end" style={{ gap: '2px' }}>
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-4 text-sm font-medium transition-all rounded-t-md ${
                      isActive
                        ? 'text-indigo-600 border-t border-l border-r border-gray-300 active-tab admin-tab-active'
                        : 'text-gray-600 hover:text-gray-900 inactive-tab admin-tab-inactive'
                    }`}
                    style={{ 
                      marginBottom: '-1px',
                      borderTopLeftRadius: '0.25rem',
                      borderTopRightRadius: '0.25rem',
                      borderBottomLeftRadius: '0',
                      borderBottomRightRadius: '0',
                      boxShadow: '0 -1px 2px 0 rgb(0 0 0 / 0.05)',
                      ...(isActive 
                        ? { backgroundImage: 'linear-gradient(to top, #f9fafb 0%, #ffffff 60%, #ffffff 100%)' }
                        : { 
                            backgroundImage: 'linear-gradient(to top, #e5e7eb 0%, #f3f4f6 100%)',
                            borderTop: '1px solid #d1d5db',
                            borderLeft: '1px solid #d1d5db',
                            borderRight: '1px solid #d1d5db',
                            borderBottom: 'none',
                          }
                      ),
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
          
          {/* Right: Icons */}
          <div className="flex-shrink-0 flex items-end space-x-4" style={{ paddingBottom: '0.5rem' }}>
            <Link
              href="/"
              className="text-indigo-600 hover:text-indigo-700 flex items-center justify-center transition-colors px-4 py-2"
              title="View Site"
            >
              <i className="bi bi-eye text-lg"></i>
            </Link>
            <button
              onClick={handleSignOut}
              className="text-indigo-600 hover:text-indigo-700 flex items-center justify-center transition-colors px-4 py-2"
              title="Sign Out"
            >
              <i className="bi bi-box-arrow-right text-lg"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}


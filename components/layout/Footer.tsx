'use client';

import Link from 'next/link';
import { useState } from 'react';

const footerLinks = [
  { href: '/artists', label: 'Artists' },
  { href: '/shop', label: 'Shop' },
  { href: '/faqs', label: 'FAQs' },
  { href: '/about', label: 'About' },
];

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter signup API call
    console.log('Newsletter signup:', email);
    setEmail('');
    // Show success message
    alert('Thanks for subscribing!');
  };

  return (
    <footer className="bg-dark-bg text-gray-400 py-5">
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
          {/* Newsletter Section - Left */}
          <div style={{ flex: '1 1 300px', minWidth: '250px', textAlign: 'left' }}>
            <h3 className="h5 text-white mb-2">Stay Connected</h3>
            <p className="text-sm text-gray-400 mb-4">
              Get the latest releases, news, and exclusive content from Claim Records.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="d-flex gap-2" style={{ maxWidth: '500px', marginRight: 'auto', justifyContent: 'flex-start' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="form-control"
                style={{
                  backgroundColor: '#ffffff',
                  color: '#212529',
                  border: '1px solid #ced4da',
                  borderRadius: '0.25rem',
                  padding: '0.5rem 0.75rem',
                  flexGrow: 1,
                  maxWidth: '300px',
                }}
              />
              <button
                type="submit"
                className="btn btn-primary bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
                style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Navigation Links - Right */}
          <div style={{ flex: '1 1 300px', minWidth: '250px', textAlign: 'right' }}>
            <ul className="nav d-flex flex-wrap gap-3 mb-3" style={{ justifyContent: 'flex-end' }}>
              {footerLinks.map((link) => (
                <li key={link.href} className="nav-item">
                  <Link
                    href={link.href}
                    className="nav-link text-gray-400 hover:text-white px-0"
                    style={{ padding: '0.25rem 0' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="nav-item">
                <Link
                  href="mailto:info@claimrecordslabel.com"
                  className="nav-link text-gray-400 hover:text-white px-0"
                  style={{ padding: '0.25rem 0' }}
                  aria-label="Email"
                >
                  <i className="bi-envelope"></i>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  href="/shop"
                  className="nav-link text-gray-400 hover:text-white px-0"
                  style={{ padding: '0.25rem 0' }}
                  aria-label="Shop"
                >
                  <i className="bi-bag"></i>
                </Link>
              </li>
            </ul>
            <p className="mb-0 text-sm" style={{ textAlign: 'right' }}>Copyright 2025. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}


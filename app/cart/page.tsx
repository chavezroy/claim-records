'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { getProductPlaceholder, isValidImageUrl } from '@/lib/utils/loremflickr';

function CartItemImage({ item }: { item: any }) {
  const [imageError, setImageError] = useState(false);
  const imageSrc = (() => {
    if (imageError || !isValidImageUrl(item.image)) {
      // Try to determine category from product name or use 'other'
      let category = 'other';
      if (item.name?.toLowerCase().includes('shirt') || item.name?.toLowerCase().includes('tshirt')) {
        category = 'shirt';
      } else if (item.name?.toLowerCase().includes('sticker')) {
        category = 'sticker';
      } else if (item.name?.toLowerCase().includes('digital') || item.name?.toLowerCase().includes('download') || item.name?.toLowerCase().includes('mixtape')) {
        category = 'digital';
      }
      return getProductPlaceholder(120, 120, category, item.productId);
    }
    return item.image;
  })();

  return (
    <Image
      src={imageSrc}
      alt={item.name}
      fill
      unoptimized
      className="object-cover"
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        left: 0,
        top: 0,
        transform: 'none',
      }}
      onError={() => setImageError(true)}
    />
  );
}

export default function CartPage() {
  const { cartItems, updateQuantity, removeItem } = useCart();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 0 ? 5.99 : 0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="container py-5">
        <h1 className="text-center mb-5">Shopping Cart</h1>
        <div className="text-center py-10">
          <i className="bi bi-emoji-frown" style={{ fontSize: '3rem', color: '#9ca3af', marginBottom: '1rem', display: 'block' }}></i>
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Link href="/shop" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
      <h1 className="text-center font-electric" style={{ fontSize: '2.5rem', letterSpacing: '2px', fontWeight: '700', marginBottom: '3rem', paddingTop: '1rem' }}>Shopping Cart</h1>

      <div className="d-flex flex-column flex-md-row gap-4">
        {/* Cart Items */}
        <div className="flex-grow-1" style={{ flex: '1 1 66.666667%', minWidth: 0 }}>
          <div className="card">
            <div className="card-body" style={{ paddingTop: 0 }}>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  style={{ 
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    backgroundColor: '#ffffff'
                  }}
                >
                  {/* Main Row Container: Image | Product Info | Price/Controls */}
                  <div style={{ 
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '1rem',
                    alignItems: 'flex-start'
                  }}>
                    {/* LEFT SECTION: Product Image */}
                    <div style={{ 
                      flexShrink: 0,
                      width: '120px',
                      height: '120px'
                    }}>
                      <Link
                        href={`/shop/${item.productId.replace('-tshirt', '')}`}
                        style={{ display: 'block', width: '100%', height: '100%' }}
                      >
                        <div
                          style={{ 
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            overflow: 'hidden',
                            backgroundColor: '#ffffff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px'
                          }}
                        >
                          <CartItemImage item={item} />
                        </div>
                      </Link>
                    </div>

                    {/* MIDDLE SECTION: Product Details */}
                    <div style={{ 
                      flex: '1 1 auto',
                      minWidth: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      paddingLeft: '0.25rem'
                    }}>
                      <Link
                        href={`/shop/${item.productId.replace('-tshirt', '')}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <div style={{ 
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginBottom: '0.5rem'
                        }}>
                          <i className="bi bi-music-note-beamed" style={{ fontSize: '1rem', color: '#dc2626' }}></i>
                          <span style={{ 
                            fontSize: '1.15rem', 
                            fontWeight: '700', 
                            color: '#dc2626',
                            letterSpacing: '0.01em',
                            lineHeight: '1.4'
                          }}>
                            {item.artistName || item.name}
                          </span>
                        </div>
                        {item.artistName && (
                          <div style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '0.5rem'
                          }}>
                            <i className="bi bi-box-seam" style={{ fontSize: '0.875rem', color: '#6b7280' }}></i>
                            <span style={{ 
                              fontSize: '0.95rem', 
                              color: '#6b7280',
                              fontWeight: '400',
                              lineHeight: '1.5'
                            }}>
                              {item.name}
                            </span>
                          </div>
                        )}
                      </Link>
                      {item.size && (
                        <div style={{ 
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          marginBottom: '0.5rem'
                        }}>
                          <i className="bi bi-rulers" style={{ fontSize: '0.875rem', color: '#6b7280' }}></i>
                          <span style={{ 
                            fontSize: '0.9rem', 
                            color: '#6b7280',
                            fontWeight: '400',
                            lineHeight: '1.5'
                          }}>
                            Size: {item.size}
                          </span>
                        </div>
                      )}
                      <div style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        marginTop: '0.25rem'
                      }}>
                        <i className="bi bi-tag" style={{ fontSize: '0.875rem', color: '#6b7280' }}></i>
                        <span style={{ 
                          fontSize: '1.05rem', 
                          fontWeight: '600', 
                          color: '#000000',
                          letterSpacing: '0.01em',
                          lineHeight: '1.4'
                        }}>
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* RIGHT SECTION: Price/Delete and Quantity Controls */}
                    <div style={{ 
                      flexShrink: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                      alignItems: 'flex-end',
                      alignSelf: 'flex-start',
                      paddingLeft: '1rem',
                      minWidth: '140px'
                    }}>
                      {/* Top Row: Price and Delete Icon */}
                      <div style={{ 
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%'
                      }}>
                        <span style={{ 
                          fontSize: '1.2rem', 
                          fontWeight: '700', 
                          lineHeight: '1.2',
                          color: '#000000',
                          letterSpacing: '0.01em'
                        }}>
                          $ {(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to remove "${item.name}" from your cart?`)) {
                              removeItem(item.id);
                            }
                          }}
                          aria-label="Remove item"
                          style={{ 
                            background: 'none',
                            border: 'none',
                            padding: '0.25rem',
                            margin: '0',
                            cursor: 'pointer',
                            color: '#9ca3af',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '28px',
                            height: '28px',
                            lineHeight: '1',
                            borderRadius: '4px',
                            transition: 'background-color 0.2s, color 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#fee2e2';
                            e.currentTarget.style.color = '#dc2626';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#9ca3af';
                          }}
                        >
                          <i className="bi bi-trash" style={{ fontSize: '1rem' }}></i>
                        </button>
                      </div>
                      
                      {/* Bottom Row: Quantity Controls */}
                      <div style={{ 
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: '0.75rem',
                        paddingLeft: '0.75rem',
                        paddingRight: '0.75rem',
                        paddingTop: '0.5rem',
                        paddingBottom: '0.5rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        height: '40px',
                        backgroundColor: '#ffffff'
                      }}>
                        <button
                          onClick={() => {
                            if (item.quantity === 1) {
                              if (window.confirm(`Are you sure you want to remove "${item.name}" from your cart?`)) {
                                updateQuantity(item.id, item.quantity - 1);
                              }
                            } else {
                              updateQuantity(item.id, item.quantity - 1);
                            }
                          }}
                          aria-label="Decrease quantity"
                          style={{ 
                            background: 'none',
                            border: 'none',
                            padding: '0',
                            margin: '0',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            lineHeight: '1',
                            borderRadius: '4px',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <i className="bi bi-dash-lg" style={{ fontSize: '1.3rem', color: '#212529', fontWeight: '600' }}></i>
                        </button>
                        <span style={{ 
                          minWidth: '60px', 
                          textAlign: 'center', 
                          fontSize: '1.05rem', 
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          lineHeight: '1',
                          color: '#000000',
                          letterSpacing: '0.01em'
                        }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                          style={{ 
                            background: 'none',
                            border: 'none',
                            padding: '0',
                            margin: '0',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            lineHeight: '1',
                            borderRadius: '4px',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <i className="bi bi-plus-lg" style={{ fontSize: '1.3rem', color: '#212529', fontWeight: '600' }}></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div style={{ flex: '0 0 33.333333%', minWidth: '300px', maxWidth: '400px' }}>
          <div className="card" style={{ 
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <div className="card-body p-4">
              <h3 className="h4 mb-4 pb-3 border-bottom font-electric" style={{ fontSize: '2.5rem', letterSpacing: '2px', fontWeight: '700' }}>
                Order Summary
              </h3>

              <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                  <span className="text-gray-600 flex-grow-1" style={{ fontSize: '0.9rem', fontWeight: '400' }}>Subtotal</span>
                  <span className="text-black text-end" style={{ fontSize: '1rem', fontWeight: '500', minWidth: '100px' }}>${subtotal.toFixed(2)}</span>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <span className="text-gray-600 flex-grow-1" style={{ fontSize: '0.9rem', fontWeight: '400' }}>Shipping</span>
                  <span className="text-black text-end" style={{ fontSize: '1rem', fontWeight: '500', minWidth: '100px' }}>${shipping.toFixed(2)}</span>
                </div>

                <div className="d-flex align-items-center mb-3">
                  <span className="text-gray-600 flex-grow-1" style={{ fontSize: '0.9rem', fontWeight: '400' }}>Tax</span>
                  <span className="text-black text-end" style={{ fontSize: '1rem', fontWeight: '500', minWidth: '100px' }}>${tax.toFixed(2)}</span>
                </div>
              </div>

              <hr className="my-4" style={{ borderColor: '#e5e7eb' }} />

              <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
                <span className="font-medium flex-grow-1" style={{ fontSize: '1.15rem', fontWeight: '600' }}>Total</span>
                <span className="font-medium text-black text-end" style={{ fontSize: '1.5rem', fontWeight: '700', minWidth: '120px' }}>${total.toFixed(2)}</span>
              </div>

              <Link
                href="/checkout"
                className="btn btn-primary w-100 mb-3 py-3 d-block text-center text-decoration-none"
                style={{ fontSize: '1rem', fontWeight: '600' }}
              >
                Proceed to Checkout
              </Link>

              <Link href="/shop" className="btn btn-outline-secondary w-100 py-2" style={{ fontSize: '0.95rem' }}>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


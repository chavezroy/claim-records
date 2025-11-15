'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

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
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Link href="/shop" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="text-center mb-5 font-electric" style={{ fontSize: '2.5rem', letterSpacing: '2px', fontWeight: '700' }}>Shopping Cart</h1>

      <div className="d-flex flex-column flex-md-row gap-4">
        {/* Cart Items */}
        <div className="flex-grow-1" style={{ flex: '1 1 66.666667%', minWidth: 0 }}>
          <div className="card">
            <div className="card-body" style={{ paddingTop: 0 }}>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="border rounded mb-3"
                  style={{ 
                    borderColor: '#e5e7eb',
                    borderRadius: '6px',
                    padding: '1.5rem'
                  }}
                >
                  {/* Main Container: 3 Sections - Image, Product Info, Price/Controls */}
                  <div className="d-flex flex-column flex-md-row gap-4 align-items-start align-items-md-center">
                    {/* Container 1: Product Image */}
                    <div className="flex-shrink-0" style={{ width: '120px', height: '120px' }}>
                      <Link
                        href={`/shop/${item.productId.replace('-tshirt', '')}`}
                        style={{ display: 'block', width: '100%', height: '100%' }}
                      >
                        <div
                          className="relative overflow-hidden bg-white border rounded"
                          style={{ width: '100%', height: '100%' }}
                        >
                          <Image
                            src={item.image}
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
                          />
                        </div>
                      </Link>
                    </div>

                    {/* Container 2: Product Info */}
                    <div className="flex-grow-1" style={{ minWidth: 0 }}>
                      <Link
                        href={`/shop/${item.productId.replace('-tshirt', '')}`}
                        className="text-decoration-none"
                      >
                        <h5 className="mb-1 text-primary hover:text-black transition-colors d-flex align-items-center gap-2" style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                          <i className="bi bi-music-note-beamed" style={{ fontSize: '0.9rem' }}></i>
                          <span>{item.artistName || item.name}</span>
                        </h5>
                        {item.artistName && (
                          <p className="text-gray-500 mb-1 d-flex align-items-center gap-2" style={{ fontSize: '0.9rem' }}>
                            <i className="bi bi-box-seam" style={{ fontSize: '0.8rem' }}></i>
                            <span>{item.name}</span>
                          </p>
                        )}
                      </Link>
                      {item.size && (
                        <p className="text-gray-500 mb-2 d-flex align-items-center gap-1" style={{ fontSize: '0.85rem' }}>
                          <i className="bi bi-rulers" style={{ fontSize: '0.75rem' }}></i>
                          <span>Size: {item.size}</span>
                        </p>
                      )}
                      <p className="text-black font-medium mb-0 d-flex align-items-center gap-1" style={{ fontSize: '1rem', fontWeight: '500' }}>
                        <i className="bi bi-tag" style={{ fontSize: '0.85rem' }}></i>
                        <span>${item.price.toFixed(2)}</span>
                      </p>
                    </div>

                    {/* Container 3: Price/Delete and Quantity Controls */}
                    <div className="flex-shrink-0 d-flex flex-column" style={{ gap: '0.75rem', alignItems: 'flex-end' }}>
                      {/* Top Row: Price and Delete Icon */}
                      <div className="d-flex align-items-center" style={{ gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: '600', lineHeight: '1' }}>
                          $ {(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          aria-label="Remove item"
                          style={{ 
                            background: 'none',
                            border: 'none',
                            padding: '0',
                            margin: '0',
                            cursor: 'pointer',
                            color: '#212529',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 'fit-content',
                            height: 'fit-content',
                            lineHeight: '1'
                          }}
                        >
                          <i className="bi bi-trash" style={{ fontSize: '1rem' }}></i>
                        </button>
                      </div>
                      
                      {/* Bottom Row: Quantity Controls */}
                      <div className="d-flex align-items-center" style={{ 
                        gap: '0.5rem',
                        paddingLeft: '0.5rem',
                        paddingRight: '0.5rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        height: 'fit-content'
                      }}>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
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
                            lineHeight: '1'
                          }}
                        >
                          <i className="bi bi-dash-lg" style={{ fontSize: '1.2rem' }}></i>
                        </button>
                        <span style={{ 
                          minWidth: '50px', 
                          textAlign: 'center', 
                          fontSize: '1rem', 
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          lineHeight: '1'
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
                            lineHeight: '1'
                          }}
                        >
                          <i className="bi bi-plus-lg" style={{ fontSize: '1.2rem' }}></i>
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

              <button className="btn btn-primary w-100 mb-3 py-3" style={{ fontSize: '1rem', fontWeight: '600' }} disabled>
                Proceed to Checkout
              </button>

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


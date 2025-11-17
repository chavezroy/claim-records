'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { getProductPlaceholder, isValidImageUrl } from '@/lib/utils/loremflickr';

function CartItemImage({ item }: { item: any }) {
  const [imageError, setImageError] = useState(false);
  const imageSrc = (() => {
    if (imageError || !isValidImageUrl(item.image)) {
      let category = 'other';
      if (item.name?.toLowerCase().includes('shirt') || item.name?.toLowerCase().includes('tshirt')) {
        category = 'shirt';
      } else if (item.name?.toLowerCase().includes('sticker')) {
        category = 'sticker';
      } else if (item.name?.toLowerCase().includes('digital') || item.name?.toLowerCase().includes('download') || item.name?.toLowerCase().includes('mixtape')) {
        category = 'digital';
      }
      return getProductPlaceholder(80, 80, category, item.productId);
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

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cartItems } = useCart();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    shipping_address_line1: '',
    shipping_address_line2: '',
    shipping_city: '',
    shipping_state: '',
    shipping_postal_code: '',
    shipping_country: 'US',
    billing_same_as_shipping: true,
    billing_address_line1: '',
    billing_address_line2: '',
    billing_city: '',
    billing_state: '',
    billing_postal_code: '',
    billing_country: 'US',
    payment_method: 'paypal',
  });

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 5.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.shipping_address_line1.trim()) {
      newErrors.shipping_address_line1 = 'Address is required';
    }

    if (!formData.shipping_city.trim()) {
      newErrors.shipping_city = 'City is required';
    }

    if (!formData.shipping_state.trim()) {
      newErrors.shipping_state = 'State is required';
    }

    if (!formData.shipping_postal_code.trim()) {
      newErrors.shipping_postal_code = 'Postal code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.shipping_postal_code)) {
      newErrors.shipping_postal_code = 'Please enter a valid postal code';
    }

    if (!formData.billing_same_as_shipping) {
      if (!formData.billing_address_line1.trim()) {
        newErrors.billing_address_line1 = 'Billing address is required';
      }
      if (!formData.billing_city.trim()) {
        newErrors.billing_city = 'Billing city is required';
      }
      if (!formData.billing_state.trim()) {
        newErrors.billing_state = 'Billing state is required';
      }
      if (!formData.billing_postal_code.trim()) {
        newErrors.billing_postal_code = 'Billing postal code is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const checkoutItems = cartItems.map((item) => ({
        product_id: item.productId,
        product_name: item.name,
        product_price: item.price,
        quantity: item.quantity,
        variant_info: item.size ? { size: item.size } : null,
      }));

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: localStorage.getItem('cart_session_id') || undefined,
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          shipping_address_line1: formData.shipping_address_line1,
          shipping_address_line2: formData.shipping_address_line2,
          shipping_city: formData.shipping_city,
          shipping_state: formData.shipping_state,
          shipping_postal_code: formData.shipping_postal_code,
          shipping_country: formData.shipping_country,
          billing_address_line1: formData.billing_same_as_shipping
            ? formData.shipping_address_line1
            : formData.billing_address_line1,
          billing_address_line2: formData.billing_same_as_shipping
            ? formData.shipping_address_line2
            : formData.billing_address_line2,
          billing_city: formData.billing_same_as_shipping
            ? formData.shipping_city
            : formData.billing_city,
          billing_state: formData.billing_same_as_shipping
            ? formData.shipping_state
            : formData.billing_state,
          billing_postal_code: formData.billing_same_as_shipping
            ? formData.shipping_postal_code
            : formData.billing_postal_code,
          billing_country: formData.billing_same_as_shipping
            ? formData.shipping_country
            : formData.billing_country,
          payment_method: formData.payment_method,
          items: checkoutItems,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Checkout failed');
      }

      const data = await response.json();

      if (formData.payment_method === 'stripe') {
        router.push(`/checkout/success?order=${data.order.order_number}`);
      } else if (formData.payment_method === 'paypal') {
        const baseUrl = window.location.origin;
        const paypalResponse = await fetch('/api/payments/paypal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order_id: data.order.id,
            return_url: `${baseUrl}/checkout/success?order=${data.order.order_number}`,
            cancel_url: `${baseUrl}/checkout/cancel?order=${data.order.order_number}`,
          }),
        });

        if (!paypalResponse.ok) {
          const errorData = await paypalResponse.json();
          const errorMessage = errorData.details 
            ? `${errorData.error}: ${errorData.details}` 
            : errorData.error || 'Failed to create PayPal order';
          console.error('PayPal API error:', errorData);
          throw new Error(errorMessage);
        }

        const paypalData = await paypalResponse.json();
        
        if (paypalData.approval_url) {
          window.location.href = paypalData.approval_url;
        } else {
          throw new Error('No PayPal approval URL received');
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert(error instanceof Error ? error.message : 'Checkout failed. Please try again.');
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        <h1 className="text-center font-electric" style={{ fontSize: '2.5rem', letterSpacing: '2px', fontWeight: '700', marginBottom: '3rem', paddingTop: '1rem' }}>Checkout</h1>
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
      <h1 className="text-center font-electric" style={{ fontSize: '2.5rem', letterSpacing: '2px', fontWeight: '700', marginBottom: '3rem', paddingTop: '1rem' }}>Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="d-flex flex-column flex-md-row gap-4">
          <div style={{ flex: '1 1 66.666667%', minWidth: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Shipping Information */}
            <div className="card" style={{ 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>
              <div className="card-body p-4">
                <h2 className="h4 mb-4 pb-3 border-bottom font-electric" style={{ fontSize: '1.75rem', letterSpacing: '1px', fontWeight: '700' }}>
                  Shipping Information
                </h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 48%', minWidth: '200px' }}>
                      <label className="form-label" style={{ fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem', display: 'block' }}>
                        Email <span style={{ color: '#dc2626' }}>*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        required
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: '' });
                        }}
                        style={{
                          border: errors.email ? '1px solid #dc2626' : '1px solid #d1d5db',
                          borderRadius: '6px',
                          padding: '0.75rem',
                          fontSize: '0.95rem'
                        }}
                      />
                      {errors.email && (
                        <span style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
                          {errors.email}
                        </span>
                      )}
                    </div>
                    <div style={{ flex: '1 1 48%', minWidth: '200px' }}>
                      <label className="form-label" style={{ fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem', display: 'block' }}>
                        Phone
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        style={{
                          border: '1px solid #d1d5db',
                          borderRadius: '6px',
                          padding: '0.75rem',
                          fontSize: '0.95rem'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 48%', minWidth: '200px' }}>
                      <label className="form-label" style={{ fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem', display: 'block' }}>
                        First Name <span style={{ color: '#dc2626' }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formData.first_name}
                        onChange={(e) => {
                          setFormData({ ...formData, first_name: e.target.value });
                          if (errors.first_name) setErrors({ ...errors, first_name: '' });
                        }}
                        style={{
                          border: errors.first_name ? '1px solid #dc2626' : '1px solid #d1d5db',
                          borderRadius: '6px',
                          padding: '0.75rem',
                          fontSize: '0.95rem'
                        }}
                      />
                      {errors.first_name && (
                        <span style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
                          {errors.first_name}
                        </span>
                      )}
                    </div>
                    <div style={{ flex: '1 1 48%', minWidth: '200px' }}>
                      <label className="form-label" style={{ fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem', display: 'block' }}>
                        Last Name <span style={{ color: '#dc2626' }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formData.last_name}
                        onChange={(e) => {
                          setFormData({ ...formData, last_name: e.target.value });
                          if (errors.last_name) setErrors({ ...errors, last_name: '' });
                        }}
                        style={{
                          border: errors.last_name ? '1px solid #dc2626' : '1px solid #d1d5db',
                          borderRadius: '6px',
                          padding: '0.75rem',
                          fontSize: '0.95rem'
                        }}
                      />
                      {errors.last_name && (
                        <span style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
                          {errors.last_name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem', display: 'block' }}>
                      Address Line 1 <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={formData.shipping_address_line1}
                      onChange={(e) => {
                        setFormData({ ...formData, shipping_address_line1: e.target.value });
                        if (errors.shipping_address_line1) setErrors({ ...errors, shipping_address_line1: '' });
                      }}
                      style={{
                        border: errors.shipping_address_line1 ? '1px solid #dc2626' : '1px solid #d1d5db',
                        borderRadius: '6px',
                        padding: '0.75rem',
                        fontSize: '0.95rem'
                      }}
                    />
                    {errors.shipping_address_line1 && (
                      <span style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
                        {errors.shipping_address_line1}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem', display: 'block' }}>
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.shipping_address_line2}
                      onChange={(e) => setFormData({ ...formData, shipping_address_line2: e.target.value })}
                      style={{
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        padding: '0.75rem',
                        fontSize: '0.95rem'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ flex: '1 1 48%', minWidth: '200px' }}>
                      <label className="form-label" style={{ fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem', display: 'block' }}>
                        City <span style={{ color: '#dc2626' }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formData.shipping_city}
                        onChange={(e) => {
                          setFormData({ ...formData, shipping_city: e.target.value });
                          if (errors.shipping_city) setErrors({ ...errors, shipping_city: '' });
                        }}
                        style={{
                          border: errors.shipping_city ? '1px solid #dc2626' : '1px solid #d1d5db',
                          borderRadius: '6px',
                          padding: '0.75rem',
                          fontSize: '0.95rem'
                        }}
                      />
                      {errors.shipping_city && (
                        <span style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
                          {errors.shipping_city}
                        </span>
                      )}
                    </div>
                    <div style={{ flex: '1 1 23%', minWidth: '120px' }}>
                      <label className="form-label" style={{ fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem', display: 'block' }}>
                        State <span style={{ color: '#dc2626' }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formData.shipping_state}
                        onChange={(e) => {
                          setFormData({ ...formData, shipping_state: e.target.value });
                          if (errors.shipping_state) setErrors({ ...errors, shipping_state: '' });
                        }}
                        style={{
                          border: errors.shipping_state ? '1px solid #dc2626' : '1px solid #d1d5db',
                          borderRadius: '6px',
                          padding: '0.75rem',
                          fontSize: '0.95rem'
                        }}
                      />
                      {errors.shipping_state && (
                        <span style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
                          {errors.shipping_state}
                        </span>
                      )}
                    </div>
                    <div style={{ flex: '1 1 23%', minWidth: '120px' }}>
                      <label className="form-label" style={{ fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem', display: 'block' }}>
                        Postal Code <span style={{ color: '#dc2626' }}>*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formData.shipping_postal_code}
                        onChange={(e) => {
                          setFormData({ ...formData, shipping_postal_code: e.target.value });
                          if (errors.shipping_postal_code) setErrors({ ...errors, shipping_postal_code: '' });
                        }}
                        style={{
                          border: errors.shipping_postal_code ? '1px solid #dc2626' : '1px solid #d1d5db',
                          borderRadius: '6px',
                          padding: '0.75rem',
                          fontSize: '0.95rem'
                        }}
                      />
                      {errors.shipping_postal_code && (
                        <span style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
                          {errors.shipping_postal_code}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: '0.9rem', fontWeight: '500', marginBottom: '0.5rem', display: 'block' }}>
                      Country <span style={{ color: '#dc2626' }}>*</span>
                    </label>
                    <select
                      className="form-control"
                      required
                      value={formData.shipping_country}
                      onChange={(e) => setFormData({ ...formData, shipping_country: e.target.value })}
                      style={{
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        padding: '0.75rem',
                        fontSize: '0.95rem'
                      }}
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="MX">Mexico</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card" style={{ 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>
              <div className="card-body p-4">
                <h2 className="h4 mb-4 pb-3 border-bottom font-electric" style={{ fontSize: '1.75rem', letterSpacing: '1px', fontWeight: '700' }}>
                  Payment Method
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem',
                    padding: '1rem',
                    border: formData.payment_method === 'stripe' ? '2px solid #dc2626' : '1px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: formData.payment_method === 'stripe' ? '#fef2f2' : '#ffffff',
                    transition: 'all 0.2s'
                  }}>
                    <input
                      type="radio"
                      name="payment_method"
                      value="stripe"
                      checked={formData.payment_method === 'stripe'}
                      onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '1rem', fontWeight: '500' }}>Credit/Debit Card (Stripe)</span>
                  </label>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem',
                    padding: '1rem',
                    border: formData.payment_method === 'paypal' ? '2px solid #dc2626' : '1px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: formData.payment_method === 'paypal' ? '#fef2f2' : '#ffffff',
                    transition: 'all 0.2s'
                  }}>
                    <input
                      type="radio"
                      name="payment_method"
                      value="paypal"
                      checked={formData.payment_method === 'paypal'}
                      onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                      style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '1rem', fontWeight: '500' }}>PayPal</span>
                  </label>
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* Order Summary */}
          <div style={{ flex: '0 0 33.333333%', minWidth: '300px', maxWidth: '400px' }}>
            <div className="card" style={{ 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              position: 'sticky',
              top: '2rem'
            }}>
              <div className="card-body p-4">
                <h3 className="h4 mb-4 pb-3 border-bottom font-electric" style={{ fontSize: '2.5rem', letterSpacing: '2px', fontWeight: '700' }}>
                  Order Summary
                </h3>

                {/* Order Items */}
                <div style={{ marginBottom: '1.5rem' }}>
                  {cartItems.map((item) => (
                    <div key={item.id} style={{ 
                      display: 'flex', 
                      gap: '0.75rem', 
                      marginBottom: '1rem',
                      paddingBottom: '1rem',
                      borderBottom: '1px solid #f3f4f6'
                    }}>
                      <div style={{ 
                        position: 'relative',
                        width: '80px',
                        height: '80px',
                        flexShrink: 0,
                        borderRadius: '6px',
                        overflow: 'hidden',
                        border: '1px solid #e5e7eb',
                        backgroundColor: '#ffffff'
                      }}>
                        <CartItemImage item={item} />
                      </div>
                      <div style={{ flex: '1', minWidth: 0 }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.25rem', color: '#000000' }}>
                          {item.artistName || item.name}
                        </div>
                        {item.artistName && (
                          <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                            {item.name}
                          </div>
                        )}
                        {item.size && (
                          <div style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                            Size: {item.size}
                          </div>
                        )}
                        <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                          Qty: {item.quantity}
                        </div>
                      </div>
                      <div style={{ fontSize: '1rem', fontWeight: '600', color: '#000000' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

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

                <button
                  type="submit"
                  className="btn btn-primary w-100 mb-3 py-3"
                  disabled={loading}
                  style={{ 
                    fontSize: '1rem', 
                    fontWeight: '600',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                    transition: 'opacity 0.2s'
                  }}
                >
                  {loading ? 'Processing...' : 'Complete Order'}
                </button>

                <Link href="/cart" className="btn btn-outline-secondary w-100 py-2 d-block text-center text-decoration-none" style={{ fontSize: '0.95rem', borderRadius: '8px' }}>
                  Return to Cart
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="container" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        <h1 className="text-center font-electric" style={{ fontSize: '2.5rem', letterSpacing: '2px', fontWeight: '700', marginBottom: '3rem', paddingTop: '1rem' }}>Checkout</h1>
        <div className="text-center py-10">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}

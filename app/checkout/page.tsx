'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cartItems } = useCart();
  const [loading, setLoading] = useState(false);
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
    payment_method: 'stripe',
  });

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 5.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare cart items for checkout
      const checkoutItems = cartItems.map((item) => ({
        product_id: item.productId,
        product_name: item.name,
        product_price: item.price,
        quantity: item.quantity,
        variant_info: item.size ? { size: item.size } : null,
      }));

      // Create order via checkout API
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
        throw new Error('Checkout failed');
      }

      const data = await response.json();

      // Redirect to payment (will be implemented in Phase 10)
      if (formData.payment_method === 'stripe') {
        // TODO: Redirect to Stripe checkout
        router.push(`/checkout/success?order=${data.order.order_number}`);
      } else if (formData.payment_method === 'paypal') {
        // TODO: Redirect to PayPal checkout
        router.push(`/checkout/success?order=${data.order.order_number}`);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed. Please try again.');
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container py-5">
        <h1 className="text-center mb-5">Checkout</h1>
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
      <h1 className="text-center mb-5">Checkout</h1>

      <form onSubmit={handleSubmit} className="row">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-body">
              <h2 className="h4 mb-4">Shipping Information</h2>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    className="form-control"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">First Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Last Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  />
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">Address Line 1 *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={formData.shipping_address_line1}
                    onChange={(e) => setFormData({ ...formData, shipping_address_line1: e.target.value })}
                  />
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">Address Line 2</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.shipping_address_line2}
                    onChange={(e) => setFormData({ ...formData, shipping_address_line2: e.target.value })}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">City *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={formData.shipping_city}
                    onChange={(e) => setFormData({ ...formData, shipping_city: e.target.value })}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">State *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={formData.shipping_state}
                    onChange={(e) => setFormData({ ...formData, shipping_state: e.target.value })}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <label className="form-label">Postal Code *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={formData.shipping_postal_code}
                    onChange={(e) => setFormData({ ...formData, shipping_postal_code: e.target.value })}
                  />
                </div>
                <div className="col-12 mb-3">
                  <label className="form-label">Country *</label>
                  <select
                    className="form-control"
                    required
                    value={formData.shipping_country}
                    onChange={(e) => setFormData({ ...formData, shipping_country: e.target.value })}
                  >
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="MX">Mexico</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <h2 className="h4 mb-4">Payment Method</h2>
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="radio"
                  name="payment_method"
                  id="stripe"
                  value="stripe"
                  checked={formData.payment_method === 'stripe'}
                  onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                />
                <label className="form-check-label" htmlFor="stripe">
                  Credit/Debit Card (Stripe)
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="payment_method"
                  id="paypal"
                  value="paypal"
                  checked={formData.payment_method === 'paypal'}
                  onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                />
                <label className="form-check-label" htmlFor="paypal">
                  PayPal
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h3 className="h5 mb-4">Order Summary</h3>
              <div className="mb-3">
                {cartItems.map((item) => (
                  <div key={item.id} className="d-flex justify-content-between mb-2">
                    <span className="text-sm">
                      {item.name} {item.size && `(${item.size})`} x{item.quantity}
                    </span>
                    <span className="text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <strong>Total</strong>
                <strong>${total.toFixed(2)}</strong>
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Complete Order'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}


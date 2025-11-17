'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderNumber = searchParams.get('order');
  const token = searchParams.get('token');
  const payerId = searchParams.get('PayerID');
  
  // PayPal returns with token parameter when user approves
  const isPayPalReturn = !!token;

  useEffect(() => {
    const handlePayPalReturn = async () => {
      if (!orderNumber) {
        setError('Order number not found');
        setLoading(false);
        return;
      }

      try {
        // If this is a PayPal return (has token), we need to capture the payment
        if (isPayPalReturn) {
          // First, get the order to find PayPal order ID
          const orderResponse = await fetch(`/api/orders/number/${orderNumber}`);
          if (!orderResponse.ok) {
            throw new Error('Order not found');
          }
          const orderData = await orderResponse.json();
          const orderObj = orderData.order || orderData;
          
          if (orderObj.paypal_order_id) {
            // Capture the PayPal payment
            const captureResponse = await fetch('/api/payments/paypal/capture', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                order_id: orderObj.id,
                paypal_order_id: orderObj.paypal_order_id,
              }),
            });

            if (!captureResponse.ok) {
              const errorData = await captureResponse.json();
              throw new Error(errorData.error || 'Failed to capture payment');
            }

            // Fetch updated order after capture
            const updatedOrderResponse = await fetch(`/api/orders/number/${orderNumber}`);
            if (updatedOrderResponse.ok) {
              const updatedData = await updatedOrderResponse.json();
              const updatedOrder = updatedData.order || updatedData;
              updatedOrder.order_items = updatedData.items || [];
              setOrder(updatedOrder);
            } else {
              setOrder(orderObj);
            }
          } else {
            orderObj.order_items = orderData.items || [];
            setOrder(orderObj);
          }
        } else {
          // Regular order confirmation (not PayPal return)
          const orderResponse = await fetch(`/api/orders/number/${orderNumber}`);
          if (!orderResponse.ok) {
            throw new Error('Order not found');
          }
          const orderData = await orderResponse.json();
          const orderObj = orderData.order || orderData;
          orderObj.order_items = orderData.items || [];
          setOrder(orderObj);
        }

        // Clear cart after successful order
        clearCart();
      } catch (err) {
        console.error('Error processing order:', err);
        setError(err instanceof Error ? err.message : 'Failed to process order');
      } finally {
        setLoading(false);
      }
    };

    handlePayPalReturn();
  }, [orderNumber, token, payerId, clearCart]);

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Processing Order...</h1>
          <p className="text-gray-600">Please wait while we confirm your payment.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-red-600">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/shop" className="btn btn-primary">
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="text-center">
        <div className="mb-4">
          <svg
            className="w-16 h-16 text-green-500 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
        <p className="text-gray-600 mb-4">
          Thank you for your purchase. Your order has been received.
        </p>
        {order && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6 max-w-md mx-auto">
            <p className="text-sm text-gray-600 mb-2">Order Number</p>
            <p className="text-xl font-bold mb-4">{order.order_number || orderNumber}</p>
            <p className="text-sm text-gray-600 mb-2">Total</p>
            <p className="text-2xl font-bold">${parseFloat(order.total || '0').toFixed(2)}</p>
          </div>
        )}
        {order && order.payment_status === 'paid' && (
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              A confirmation email has been sent to {order.email}
            </p>
            {order.order_items?.some((item: any) => item.product_type === 'digital') && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-blue-800 mb-2">
                  <strong>Digital Downloads Available</strong>
                </p>
                <p className="text-blue-700 text-sm">
                  You can access your digital downloads from your order confirmation email or{' '}
                  <Link href={`/orders/${order.order_number || orderNumber}`} className="underline">
                    view your order
                  </Link>
                  .
                </p>
              </div>
            )}
          </div>
        )}
        <div className="flex gap-4 justify-center">
          <Link href="/shop" className="btn btn-outline-primary">
            Continue Shopping
          </Link>
          {order && (
            <Link href={`/orders/${order.order_number || orderNumber}`} className="btn btn-primary">
              View Order
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="container py-5">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Loading...</h1>
          <p className="text-gray-600">Please wait while we process your order.</p>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}

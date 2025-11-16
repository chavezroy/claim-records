import Link from 'next/link';
import { query } from '@/lib/db';

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  let order = null;

  if (searchParams.order) {
    const result = await query(
      `SELECT o.*
       FROM orders o
       WHERE o.order_number = $1`,
      [searchParams.order]
    );

    if (result.rows.length > 0) {
      order = result.rows[0];

      // Fetch order items to check for digital products
      const itemsResult = await query(
        `SELECT oi.*, p.product_type
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = $1`,
        [order.id]
      );
      order.order_items = itemsResult.rows;
    }
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
            <p className="text-xl font-bold mb-4">{order.order_number}</p>
            <p className="text-sm text-gray-600 mb-2">Total</p>
            <p className="text-2xl font-bold">${parseFloat(order.total).toFixed(2)}</p>
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
                  <Link href={`/orders/${order.order_number}`} className="underline">
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
            <Link href={`/orders/${order.order_number}`} className="btn btn-primary">
              View Order
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}


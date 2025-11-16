import Link from 'next/link';

export default function CheckoutCancelPage() {
  return (
    <div className="container py-5">
      <div className="text-center">
        <div className="mb-4">
          <svg
            className="w-16 h-16 text-yellow-500 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-4">Order Cancelled</h1>
        <p className="text-gray-600 mb-6">
          Your order was cancelled. No charges were made.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/cart" className="btn btn-primary">
            Return to Cart
          </Link>
          <Link href="/shop" className="btn btn-outline-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}


import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import Link from 'next/link';

export default async function OrderPage({
  params,
}: {
  params: { orderNumber: string };
}) {
  const orderResult = await query(
    'SELECT * FROM orders WHERE order_number = $1',
    [params.orderNumber]
  );

  if (orderResult.rows.length === 0) {
    notFound();
  }

  const order = orderResult.rows[0];

  const itemsResult = await query(
    `SELECT oi.*, p.product_type, p.download_url
     FROM order_items oi
     JOIN products p ON oi.product_id = p.id
     WHERE oi.order_id = $1
     ORDER BY oi.created_at ASC`,
    [order.id]
  );

  const items = itemsResult.rows;

  // Fetch digital downloads if any
  const downloadsResult = await query(
    `SELECT dd.*, oi.product_name
     FROM digital_downloads dd
     JOIN order_items oi ON dd.order_item_id = oi.id
     WHERE oi.order_id = $1`,
    [order.id]
  );

  const downloads = downloadsResult.rows;

  return (
    <div className="container py-5">
      <h1 className="text-3xl font-bold mb-6">Order Details</h1>

      <div className="row">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-body">
              <h2 className="h4 mb-4">Order Information</h2>
              <div className="row mb-3">
                <div className="col-sm-4">
                  <strong>Order Number:</strong>
                </div>
                <div className="col-sm-8">{order.order_number}</div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-4">
                  <strong>Order Date:</strong>
                </div>
                <div className="col-sm-8">
                  {new Date(order.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-4">
                  <strong>Status:</strong>
                </div>
                <div className="col-sm-8">
                  <span
                    className={`px-2 py-1 rounded ${
                      order.payment_status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : order.payment_status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {order.payment_status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <h2 className="h4 mb-4">Order Items</h2>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th className="text-end">Price</th>
                      <th className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item: any) => (
                      <tr key={item.id}>
                        <td>
                          {item.product_name}
                          {item.variant_info && (
                            <div className="text-sm text-gray-500">
                              {JSON.stringify(item.variant_info)}
                            </div>
                          )}
                        </td>
                        <td>{item.quantity}</td>
                        <td className="text-end">${parseFloat(item.product_price).toFixed(2)}</td>
                        <td className="text-end">
                          ${(parseFloat(item.product_price) * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {downloads.length > 0 && (
            <div className="card mb-4">
              <div className="card-body">
                <h2 className="h4 mb-4">Digital Downloads</h2>
                <div className="space-y-3">
                  {downloads.map((download: any) => (
                    <div key={download.id} className="border rounded p-4">
                      <h3 className="font-semibold mb-2">{download.product_name}</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        Downloads remaining:{' '}
                        {download.max_downloads
                          ? `${download.max_downloads - download.download_count} of ${download.max_downloads}`
                          : 'Unlimited'}
                      </p>
                      {download.expires_at && (
                        <p className="text-sm text-gray-600 mb-3">
                          Expires: {new Date(download.expires_at).toLocaleDateString()}
                        </p>
                      )}
                      <a
                        href={`/api/downloads/${download.order_item_id}`}
                        className="btn btn-primary btn-sm"
                        download
                      >
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h3 className="h5 mb-4">Order Summary</h3>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>${parseFloat(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping</span>
                <span>${parseFloat(order.shipping_cost).toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax</span>
                <span>${parseFloat(order.tax).toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <strong>Total</strong>
                <strong>${parseFloat(order.total).toFixed(2)}</strong>
              </div>

              {order.shipping_address_line1 && (
                <div className="mt-4">
                  <h4 className="h6 mb-3">Shipping Address</h4>
                  <p className="text-sm">
                    {order.shipping_address_line1}
                    {order.shipping_address_line2 && <br />}
                    {order.shipping_address_line2}
                    <br />
                    {order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}
                    <br />
                    {order.shipping_country}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Link href="/shop" className="btn btn-outline-primary">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}


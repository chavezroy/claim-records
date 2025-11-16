import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET /api/orders/number/[orderNumber] - Get order by order number
export async function GET(
  request: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const orderResult = await query('SELECT * FROM orders WHERE order_number = $1', [
      params.orderNumber,
    ]);

    if (orderResult.rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const itemsResult = await query(
      'SELECT * FROM order_items WHERE order_id = $1 ORDER BY created_at ASC',
      [orderResult.rows[0].id]
    );

    return NextResponse.json({
      order: orderResult.rows[0],
      items: itemsResult.rows,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}


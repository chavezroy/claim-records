import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

const updateOrderSchema = z.object({
  payment_status: z.enum(['pending', 'processing', 'paid', 'failed', 'refunded']).optional(),
  order_status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
  stripe_payment_intent_id: z.string().optional().nullable(),
  paypal_order_id: z.string().optional().nullable(),
});

// GET /api/orders/[id] - Get single order
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderResult = await query('SELECT * FROM orders WHERE id = $1', [
      params.id,
    ]);

    if (orderResult.rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const itemsResult = await query(
      'SELECT * FROM order_items WHERE order_id = $1 ORDER BY created_at ASC',
      [params.id]
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

// PUT /api/orders/[id] - Update order
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = updateOrderSchema.parse(body);

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 0;

    Object.entries(validated).forEach(([key, value]) => {
      if (value !== undefined) {
        paramCount++;
        updates.push(`${key} = $${paramCount}`);
        values.push(value);
      }
    });

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    paramCount++;
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(params.id);

    const result = await query(
      `UPDATE orders SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order: result.rows[0] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}


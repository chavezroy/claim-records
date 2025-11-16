import { NextRequest, NextResponse } from 'next/server';
import { query, transaction } from '@/lib/db';
import { z } from 'zod';

const orderSchema = z.object({
  user_id: z.string().uuid().optional().nullable(),
  email: z.string().email(),
  first_name: z.string().optional().nullable(),
  last_name: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  shipping_address_line1: z.string().optional().nullable(),
  shipping_address_line2: z.string().optional().nullable(),
  shipping_city: z.string().optional().nullable(),
  shipping_state: z.string().optional().nullable(),
  shipping_postal_code: z.string().optional().nullable(),
  shipping_country: z.string().optional().nullable(),
  billing_address_line1: z.string().optional().nullable(),
  billing_address_line2: z.string().optional().nullable(),
  billing_city: z.string().optional().nullable(),
  billing_state: z.string().optional().nullable(),
  billing_postal_code: z.string().optional().nullable(),
  billing_country: z.string().optional().nullable(),
  subtotal: z.number().nonnegative(),
  shipping_cost: z.number().nonnegative().default(0),
  tax: z.number().nonnegative().default(0),
  total: z.number().nonnegative(),
  payment_method: z.string().optional().nullable(),
  items: z.array(z.object({
    product_id: z.string().uuid(),
    product_name: z.string(),
    product_price: z.number().nonnegative(),
    quantity: z.number().int().positive(),
    variant_info: z.record(z.any()).optional().nullable(),
  })),
});

// POST /api/orders - Create order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = orderSchema.parse(body);

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const order = await transaction(async (client) => {
      // Create order
      const orderResult = await client.query(
        `INSERT INTO orders (
          order_number, user_id, email, first_name, last_name, phone,
          shipping_address_line1, shipping_address_line2, shipping_city,
          shipping_state, shipping_postal_code, shipping_country,
          billing_address_line1, billing_address_line2, billing_city,
          billing_state, billing_postal_code, billing_country,
          subtotal, shipping_cost, tax, total, payment_method
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
        RETURNING *`,
        [
          orderNumber,
          validated.user_id || null,
          validated.email,
          validated.first_name || null,
          validated.last_name || null,
          validated.phone || null,
          validated.shipping_address_line1 || null,
          validated.shipping_address_line2 || null,
          validated.shipping_city || null,
          validated.shipping_state || null,
          validated.shipping_postal_code || null,
          validated.shipping_country || null,
          validated.billing_address_line1 || null,
          validated.billing_address_line2 || null,
          validated.billing_city || null,
          validated.billing_state || null,
          validated.billing_postal_code || null,
          validated.billing_country || null,
          validated.subtotal,
          validated.shipping_cost,
          validated.tax,
          validated.total,
          validated.payment_method || null,
        ]
      );

      const order = orderResult.rows[0];

      // Create order items
      const orderItems = [];
      for (const item of validated.items) {
        const itemResult = await client.query(
          `INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, variant_info)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING *`,
          [
            order.id,
            item.product_id,
            item.product_name,
            item.product_price,
            item.quantity,
            item.variant_info ? JSON.stringify(item.variant_info) : null,
          ]
        );
        orderItems.push(itemResult.rows[0]);

        // Update inventory if product is physical
        await client.query(
          `UPDATE products 
           SET inventory_count = inventory_count - $1
           WHERE id = $2 AND product_type = 'physical' AND inventory_count IS NOT NULL`,
          [item.quantity, item.product_id]
        );
      }

      return { order, items: orderItems };
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// GET /api/orders - List orders (admin only - add auth later)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const user_id = searchParams.get('user_id');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let queryText = 'SELECT * FROM orders WHERE 1=1';
    const params: any[] = [];
    let paramCount = 0;

    if (user_id) {
      paramCount++;
      queryText += ` AND user_id = $${paramCount}`;
      params.push(user_id);
    }

    queryText += ` ORDER BY created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`;
    params.push(limit, offset);

    const result = await query(queryText, params);

    return NextResponse.json({ orders: result.rows, count: result.rowCount });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}


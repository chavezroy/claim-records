import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

const checkoutSchema = z.object({
  session_id: z.string().optional(),
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
  payment_method: z.enum(['stripe', 'paypal']),
  items: z.array(z.object({
    product_id: z.string().uuid(),
    product_name: z.string(),
    product_price: z.number().nonnegative(),
    quantity: z.number().int().positive(),
    variant_info: z.record(z.any()).optional().nullable(),
  })).optional(),
});

// POST /api/checkout - Initiate checkout process
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = checkoutSchema.parse(body);

    // Get cart items - either from request body or from cart session
    let cartItems: any[] = [];

    if (validated.items && validated.items.length > 0) {
      // Use items from request body
      cartItems = validated.items;
    } else {
      // Fetch from cart session
      let cartQuery = 'SELECT * FROM cart_sessions WHERE ';
      const cartParams: any[] = [];
      
      if (validated.session_id && validated.user_id) {
        cartQuery += '(session_id = $1 OR user_id = $2)';
        cartParams.push(validated.session_id, validated.user_id);
      } else if (validated.session_id) {
        cartQuery += 'session_id = $1';
        cartParams.push(validated.session_id);
      } else if (validated.user_id) {
        cartQuery += 'user_id = $1';
        cartParams.push(validated.user_id);
      } else {
        return NextResponse.json(
          { error: 'items array or session_id/user_id required' },
          { status: 400 }
        );
      }

      cartQuery += ' AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)';

      const cartResult = await query(cartQuery, cartParams);

      if (cartResult.rows.length === 0 || !cartResult.rows[0].cart_data || cartResult.rows[0].cart_data.length === 0) {
        return NextResponse.json(
          { error: 'Cart is empty' },
          { status: 400 }
        );
      }

      cartItems = Array.isArray(cartResult.rows[0].cart_data)
        ? cartResult.rows[0].cart_data
        : [];
    }

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Fetch product details and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of cartItems) {
      // If items come from request body, they already have product details
      if (item.product_name && item.product_price) {
        const itemTotal = item.product_price * item.quantity;
        subtotal += itemTotal;
        orderItems.push({
          product_id: item.product_id,
          product_name: item.product_name,
          product_price: item.product_price,
          quantity: item.quantity,
          variant_info: item.variant_info || null,
        });
      } else {
        // Fetch from database (from cart session)
        const productResult = await query('SELECT * FROM products WHERE id = $1', [
          item.product_id,
        ]);

        if (productResult.rows.length === 0) {
          return NextResponse.json(
            { error: `Product ${item.product_id} not found` },
            { status: 400 }
          );
        }

        const product = productResult.rows[0];

        // Check inventory for physical products
        if (product.product_type === 'physical' && product.inventory_count !== null) {
          if (product.inventory_count < item.quantity) {
            return NextResponse.json(
              { error: `Insufficient inventory for ${product.name}` },
              { status: 400 }
            );
          }
        }

        const itemTotal = parseFloat(product.price) * item.quantity;
        subtotal += itemTotal;

        orderItems.push({
          product_id: product.id,
          product_name: product.name,
          product_price: parseFloat(product.price),
          quantity: item.quantity,
          variant_info: item.variant_info || null,
        });
      }
    }

    // Calculate shipping and tax (simplified - can be enhanced)
    const shippingCost = subtotal > 0 ? 5.99 : 0;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shippingCost + tax;

    // Create order (will be completed after payment)
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const orderResult = await query(
      `INSERT INTO orders (
        order_number, user_id, email, first_name, last_name, phone,
        shipping_address_line1, shipping_address_line2, shipping_city,
        shipping_state, shipping_postal_code, shipping_country,
        billing_address_line1, billing_address_line2, billing_city,
        billing_state, billing_postal_code, billing_country,
        subtotal, shipping_cost, tax, total, payment_method, payment_status, order_status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, 'pending', 'pending')
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
        subtotal,
        shippingCost,
        tax,
        total,
        validated.payment_method,
      ]
    );

    const order = orderResult.rows[0];

    // Create order items
    for (const item of orderItems) {
      await query(
        `INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, variant_info)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          order.id,
          item.product_id,
          item.product_name,
          item.product_price,
          item.quantity,
          item.variant_info ? JSON.stringify(item.variant_info) : null,
        ]
      );
    }

    // Return order and payment initiation info
    return NextResponse.json({
      order: order,
      items: orderItems,
      payment_method: validated.payment_method,
      // Payment URLs will be generated by payment API routes
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error initiating checkout:', error);
    return NextResponse.json(
      { error: 'Failed to initiate checkout' },
      { status: 500 }
    );
  }
}


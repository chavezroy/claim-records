import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { query } from '@/lib/db';
import { client, getMode } from '@/lib/paypal/client';
import paypal from '@paypal/checkout-server-sdk';

const paypalOrderSchema = z.object({
  order_id: z.string().uuid(),
  return_url: z.string().url(),
  cancel_url: z.string().url(),
});

// POST /api/payments/paypal - Create PayPal order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = paypalOrderSchema.parse(body);

    // Fetch order details from database
    const orderResult = await query(
      `SELECT * FROM orders WHERE id = $1`,
      [validated.order_id]
    );

    if (orderResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const order = orderResult.rows[0];

    // Fetch order items
    const itemsResult = await query(
      `SELECT product_name, product_price, quantity 
       FROM order_items 
       WHERE order_id = $1`,
      [validated.order_id]
    );

    const orderItems = itemsResult.rows;

    // Check if order is already paid
    if (order.payment_status === 'paid') {
      return NextResponse.json(
        { error: 'Order already paid' },
        { status: 400 }
      );
    }

    // Build PayPal order request
    const paypalRequest = new paypal.orders.OrdersCreateRequest();
    paypalRequest.prefer('return=representation');
    paypalRequest.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: order.order_number,
          description: `Order ${order.order_number} - Claim Records`,
          custom_id: order.id,
          amount: {
            currency_code: 'USD',
            value: parseFloat(order.total).toFixed(2),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: parseFloat(order.subtotal).toFixed(2),
              },
              shipping: {
                currency_code: 'USD',
                value: parseFloat(order.shipping_cost).toFixed(2),
              },
              tax_total: {
                currency_code: 'USD',
                value: parseFloat(order.tax).toFixed(2),
              },
            },
          },
          items: orderItems.map((item: any) => ({
            name: item.product_name,
            quantity: item.quantity.toString(),
            unit_amount: {
              currency_code: 'USD',
              value: parseFloat(item.product_price).toFixed(2),
            },
          })),
          shipping: order.shipping_address_line1 ? {
            name: {
              full_name: `${order.first_name || ''} ${order.last_name || ''}`.trim(),
            },
            address: {
              address_line_1: order.shipping_address_line1,
              address_line_2: order.shipping_address_line2 || undefined,
              admin_area_2: order.shipping_city,
              admin_area_1: order.shipping_state,
              postal_code: order.shipping_postal_code,
              country_code: order.shipping_country || 'US',
            },
          } : undefined,
        },
      ],
      application_context: {
        brand_name: 'Claim Records',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        return_url: validated.return_url,
        cancel_url: validated.cancel_url,
      },
    });

    // Create PayPal order
    const paypalClient = client();
    const response = await paypalClient.execute(paypalRequest);

    if (response.statusCode !== 201) {
      console.error('PayPal order creation failed:', response);
      return NextResponse.json(
        { error: 'Failed to create PayPal order' },
        { status: 500 }
      );
    }

    const paypalOrder = response.result;

    // Find approval URL
    const approvalLink = paypalOrder.links?.find(
      (link: any) => link.rel === 'approve'
    );

    if (!approvalLink) {
      return NextResponse.json(
        { error: 'No approval URL found in PayPal response' },
        { status: 500 }
      );
    }

    // Update order with PayPal order ID
    await query(
      `UPDATE orders 
       SET paypal_order_id = $1, 
           payment_status = 'processing'
       WHERE id = $2`,
      [paypalOrder.id, validated.order_id]
    );

    return NextResponse.json({
      order_id: validated.order_id,
      paypal_order_id: paypalOrder.id,
      approval_url: approvalLink.href,
      status: paypalOrder.status,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error creating PayPal order:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('PayPal error details:', { errorMessage, errorStack });
    
    // Check if it's a PayPal credentials error
    if (errorMessage.includes('PayPal credentials not configured')) {
      return NextResponse.json(
        { 
          error: 'PayPal credentials not configured',
          details: 'Please set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET environment variables'
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create PayPal order', 
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}


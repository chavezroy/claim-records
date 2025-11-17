import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { query } from '@/lib/db';
import { client } from '@/lib/paypal/client';
import paypal from '@paypal/checkout-server-sdk';

const captureSchema = z.object({
  order_id: z.string().uuid(),
  paypal_order_id: z.string(),
});

// POST /api/payments/paypal/capture - Capture PayPal payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = captureSchema.parse(body);

    // Fetch order from database
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

    // Verify PayPal order ID matches
    if (order.paypal_order_id !== validated.paypal_order_id) {
      return NextResponse.json(
        { error: 'PayPal order ID mismatch' },
        { status: 400 }
      );
    }

    // Check if already captured
    if (order.payment_status === 'paid') {
      return NextResponse.json({
        success: true,
        message: 'Payment already captured',
        order: order,
      });
    }

    // Capture PayPal order
    const captureRequest = new paypal.orders.OrdersCaptureRequest(validated.paypal_order_id);
    captureRequest.requestBody({});

    const paypalClient = client();
    const response = await paypalClient.execute(captureRequest);

    if (response.statusCode !== 201) {
      console.error('PayPal capture failed:', response);
      return NextResponse.json(
        { error: 'Failed to capture PayPal payment' },
        { status: 500 }
      );
    }

    const captureResult = response.result;

    // Check if payment was successful
    if (captureResult.status === 'COMPLETED') {
      // Update order status
      await query(
        `UPDATE orders 
         SET payment_status = 'paid',
             order_status = 'processing'
         WHERE id = $1`,
        [validated.order_id]
      );

      // TODO: Fulfill digital downloads here
      // TODO: Send confirmation email here

      return NextResponse.json({
        success: true,
        message: 'Payment captured successfully',
        order_id: validated.order_id,
        paypal_order_id: validated.paypal_order_id,
        capture_id: captureResult.purchase_units?.[0]?.payments?.captures?.[0]?.id,
      });
    } else {
      // Update order status to failed
      await query(
        `UPDATE orders 
         SET payment_status = 'failed'
         WHERE id = $1`,
        [validated.order_id]
      );

      return NextResponse.json(
        { error: 'Payment capture not completed', status: captureResult.status },
        { status: 400 }
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error capturing PayPal payment:', error);
    return NextResponse.json(
      { error: 'Failed to capture PayPal payment', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


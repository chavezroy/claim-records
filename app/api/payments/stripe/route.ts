import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { query } from '@/lib/db';
import { getStripeClient } from '@/lib/stripe/client';

const stripeCheckoutSchema = z.object({
  order_id: z.string().uuid(),
  success_url: z.string().url(),
  cancel_url: z.string().url(),
});

// POST /api/payments/stripe - Create Stripe checkout session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = stripeCheckoutSchema.parse(body);

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

    // Initialize Stripe client
    const stripe = getStripeClient();

    // Build line items for Stripe Checkout
    const lineItems = orderItems.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product_name,
        },
        unit_amount: Math.round(parseFloat(item.product_price) * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Add shipping as a line item if applicable
    if (parseFloat(order.shipping_cost) > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping',
          },
          unit_amount: Math.round(parseFloat(order.shipping_cost) * 100),
        },
        quantity: 1,
      });
    }

    // Add tax as a line item if applicable
    if (parseFloat(order.tax) > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Tax',
          },
          unit_amount: Math.round(parseFloat(order.tax) * 100),
        },
        quantity: 1,
      });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: validated.success_url,
      cancel_url: validated.cancel_url,
      client_reference_id: order.order_number,
      metadata: {
        order_id: order.id,
        order_number: order.order_number,
      },
      shipping_address_collection: order.shipping_address_line1 ? undefined : {
        allowed_countries: ['US'],
      },
      customer_email: order.email,
      shipping_options: order.shipping_address_line1 ? [{
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: Math.round(parseFloat(order.shipping_cost) * 100),
            currency: 'usd',
          },
          display_name: 'Standard Shipping',
        },
      }] : undefined,
    });

    // Update order with Stripe session ID
    await query(
      `UPDATE orders 
       SET stripe_payment_intent_id = $1, 
           payment_status = 'processing'
       WHERE id = $2`,
      [session.id, validated.order_id]
    );

    return NextResponse.json({
      order_id: validated.order_id,
      session_id: session.id,
      checkout_url: session.url,
      status: session.status,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('Error creating Stripe checkout:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('Stripe error details:', { errorMessage, errorStack });
    
    // Check if it's a Stripe credentials error
    if (errorMessage.includes('Stripe credentials not configured')) {
      return NextResponse.json(
        { 
          error: 'Stripe credentials not configured',
          details: 'Please set STRIPE_SECRET_KEY environment variable'
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create Stripe checkout', 
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}


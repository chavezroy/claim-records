import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getStripeClient } from '@/lib/stripe/client';
import { query } from '@/lib/db';
import Stripe from 'stripe';

// POST /api/webhooks/stripe - Stripe webhook handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    const stripe = getStripeClient();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('[STRIPE] Webhook secret not configured');
      // In development, allow webhook without signature verification
      if (process.env.NODE_ENV === 'development') {
        console.warn('[STRIPE] Development mode: skipping webhook signature verification');
      } else {
        return NextResponse.json(
          { error: 'Webhook secret not configured' },
          { status: 500 }
        );
      }
    }

    let event: Stripe.Event;

    try {
      // Verify webhook signature
      if (webhookSecret) {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } else {
        // Development fallback - parse without verification
        event = JSON.parse(body) as Stripe.Event;
      }
    } catch (err) {
      console.error('[STRIPE] Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        console.log('[STRIPE] Checkout session completed:', {
          sessionId: session.id,
          clientReferenceId: session.client_reference_id,
          paymentStatus: session.payment_status,
        });

        // Find order by session ID (stored in stripe_payment_intent_id field)
        const orderResult = await query(
          `SELECT * FROM orders WHERE stripe_payment_intent_id = $1`,
          [session.id]
        );

        if (orderResult.rows.length === 0) {
          console.error('[STRIPE] Order not found for session:', session.id);
          return NextResponse.json(
            { error: 'Order not found' },
            { status: 404 }
          );
        }

        const order = orderResult.rows[0];

        // Check if already processed
        if (order.payment_status === 'paid') {
          console.log('[STRIPE] Order already paid:', order.id);
          return NextResponse.json({ received: true });
        }

        // Update order status to paid
        await query(
          `UPDATE orders 
           SET payment_status = 'paid',
               order_status = 'processing'
           WHERE id = $1`,
          [order.id]
        );

        console.log('[STRIPE] Order payment confirmed:', order.order_number);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('[STRIPE] Payment intent succeeded:', paymentIntent.id);
        // Payment intent success is handled by checkout.session.completed
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error('[STRIPE] Payment intent failed:', paymentIntent.id);

        // Find order by payment intent ID
        const orderResult = await query(
          `SELECT * FROM orders WHERE stripe_payment_intent_id = $1`,
          [paymentIntent.id]
        );

        if (orderResult.rows.length > 0) {
          const order = orderResult.rows[0];
          await query(
            `UPDATE orders SET payment_status = 'failed' WHERE id = $1`,
            [order.id]
          );
          console.log('[STRIPE] Order payment marked as failed:', order.order_number);
        }
        break;
      }

      default:
        console.log(`[STRIPE] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[STRIPE] Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}


# Phase 10: Payment Processing - Implementation Plan

## Overview
Complete the payment integration for Claim Records website, supporting both Stripe and PayPal payment methods.

## Current Status

### ✅ Already Implemented
- Checkout page with form validation (`app/checkout/page.tsx`)
- Order creation API (`app/api/checkout/route.ts`)
- Database schema with payment fields:
  - `orders.payment_method` (stripe/paypal)
  - `orders.payment_status` (pending/processing/paid/failed/refunded)
  - `orders.stripe_payment_intent_id`
  - `orders.paypal_order_id`
- Placeholder payment API routes:
  - `/api/payments/stripe` (returns 501)
  - `/api/payments/paypal` (returns 501)
- Placeholder webhook handlers:
  - `/api/webhooks/stripe` (returns placeholder)
  - `/api/webhooks/paypal` (returns placeholder)

### ❌ Needs Implementation
- Stripe checkout session creation
- PayPal order creation
- Payment redirect handling
- Webhook signature verification
- Payment status updates
- Order fulfillment (digital downloads)
- Error handling and retry logic

---

## Implementation Tasks

### 1. Stripe Integration

#### 1.1 Install Dependencies
```bash
npm install stripe @stripe/stripe-js
```

#### 1.2 Environment Variables
Add to `.env.local` and AWS Amplify:
```
STRIPE_SECRET_KEY=sk_test_... (or sk_live_... for production)
STRIPE_PUBLISHABLE_KEY=pk_test_... (or pk_live_... for production)
STRIPE_WEBHOOK_SECRET=whsec_... (from Stripe dashboard)
```

#### 1.3 Implement Stripe Checkout Session (`app/api/payments/stripe/route.ts`)
**Tasks:**
- Initialize Stripe client with secret key
- Create checkout session with:
  - Order items (line items)
  - Customer email
  - Success URL: `/checkout/success?order={order_number}&session_id={CHECKOUT_SESSION_ID}`
  - Cancel URL: `/checkout/cancel?order={order_number}`
  - Metadata: order_id, order_number
  - Payment method types: card
- Store `payment_intent_id` in order record
- Return checkout URL to frontend

**Key Events to Handle:**
- `checkout.session.completed` - Payment successful
- `payment_intent.succeeded` - Payment confirmed
- `payment_intent.payment_failed` - Payment failed
- `charge.refunded` - Refund processed

#### 1.4 Update Checkout Page (`app/checkout/page.tsx`)
**Tasks:**
- After order creation, call `/api/payments/stripe`
- Redirect user to Stripe checkout URL
- Handle return from Stripe (success/cancel pages)

#### 1.5 Implement Stripe Webhook (`app/api/webhooks/stripe/route.ts`)
**Tasks:**
- Verify webhook signature using `STRIPE_WEBHOOK_SECRET`
- Handle events:
  - `checkout.session.completed`: Update order status to 'paid', fulfill digital downloads
  - `payment_intent.succeeded`: Confirm payment, update order
  - `payment_intent.payment_failed`: Update order status to 'failed'
  - `charge.refunded`: Update order status to 'refunded'
- Update order in database
- Trigger digital download fulfillment if applicable
- Return 200 status to Stripe

**Security:**
- Verify webhook signature on every request
- Use raw body for signature verification
- Log all webhook events for debugging

---

### 2. PayPal Integration

#### 2.1 Install Dependencies
```bash
npm install @paypal/checkout-server-sdk
```

#### 2.2 Environment Variables
Add to `.env.local` and AWS Amplify:
```
PAYPAL_CLIENT_ID=... (from PayPal developer dashboard)
PAYPAL_CLIENT_SECRET=... (from PayPal developer dashboard)
PAYPAL_MODE=sandbox (or 'live' for production)
PAYPAL_WEBHOOK_ID=... (from PayPal dashboard)
```

#### 2.3 Implement PayPal Order Creation (`app/api/payments/paypal/route.ts`)
**Tasks:**
- Initialize PayPal SDK with client ID/secret
- Create PayPal order with:
  - Purchase units (order items)
  - Application context (return/cancel URLs)
  - Order metadata
- Store `paypal_order_id` in order record
- Return approval URL to frontend

**PayPal Order Flow:**
1. Create order → Get approval URL
2. User approves on PayPal → Returns with token
3. Capture payment → Update order status

#### 2.4 Update Checkout Page (`app/checkout/page.tsx`)
**Tasks:**
- After order creation, call `/api/payments/paypal`
- Redirect user to PayPal approval URL
- Handle return from PayPal (success/cancel pages)
- On return, capture payment via API

#### 2.5 Implement PayPal Webhook (`app/api/webhooks/paypal/route.ts`)
**Tasks:**
- Verify webhook signature using PayPal SDK
- Handle events:
  - `PAYMENT.CAPTURE.COMPLETED`: Payment successful, fulfill order
  - `PAYMENT.CAPTURE.DENIED`: Payment failed
  - `PAYMENT.CAPTURE.REFUNDED`: Refund processed
- Update order in database
- Trigger digital download fulfillment if applicable
- Return 200 status to PayPal

**Security:**
- Verify webhook signature on every request
- Validate event source
- Log all webhook events

---

### 3. Payment Success/Cancel Pages

#### 3.1 Success Page (`app/checkout/success/page.tsx`)
**Tasks:**
- Display order confirmation
- Show order number and items
- For Stripe: Verify session was completed
- For PayPal: Capture payment if not already captured
- Provide download links for digital products
- Clear cart
- Send confirmation email (optional, Phase 11)

#### 3.2 Cancel Page (`app/checkout/cancel/page.tsx`)
**Tasks:**
- Inform user payment was cancelled
- Provide option to retry checkout
- Keep order in 'pending' status (can be retried)
- Option to delete pending order after X days

---

### 4. Digital Download Fulfillment

#### 4.1 Download Links (`app/api/downloads/[id]/route.ts`)
**Tasks:**
- Verify user has access (check order status = 'paid')
- Check if product is digital
- Generate secure download link (time-limited)
- Track download count
- Serve file or redirect to download URL

#### 4.2 Fulfillment Logic
**Tasks:**
- After payment confirmation:
  - Create download records for digital products
  - Generate secure download tokens
  - Send download email (optional)
  - Update product download counts

---

### 5. Order Status Management

#### 5.1 Order Status Updates
**Tasks:**
- Update `orders.payment_status` based on payment events
- Update `orders.order_status` (pending → processing → fulfilled)
- Handle failed payments (allow retry)
- Handle refunds (update inventory if physical products)

#### 5.2 Order Retry Logic
**Tasks:**
- Allow users to retry failed payments
- Create new payment session for same order
- Prevent duplicate charges

---

### 6. Error Handling & Edge Cases

#### 6.1 Payment Failures
- Network errors during payment creation
- Payment declined by bank/card
- Webhook delivery failures
- Timeout handling
- Partial payment scenarios

#### 6.2 Security Considerations
- Webhook signature verification (critical)
- CSRF protection on payment endpoints
- Rate limiting on payment creation
- Validate order amounts match payment amounts
- Prevent order manipulation

#### 6.3 Testing Scenarios
- Successful Stripe payment
- Successful PayPal payment
- Failed payment (card declined)
- Cancelled payment
- Webhook retry scenarios
- Concurrent payment attempts
- Refund processing

---

## Implementation Checklist

### Stripe Integration
- [ ] Install Stripe SDK
- [ ] Add Stripe environment variables
- [ ] Implement Stripe checkout session creation
- [ ] Update checkout page to redirect to Stripe
- [ ] Implement Stripe webhook handler
- [ ] Verify webhook signature
- [ ] Handle payment success events
- [ ] Handle payment failure events
- [ ] Test with Stripe test cards

### PayPal Integration
- [ ] Install PayPal SDK
- [ ] Add PayPal environment variables
- [ ] Implement PayPal order creation
- [ ] Update checkout page to redirect to PayPal
- [ ] Implement PayPal payment capture
- [ ] Implement PayPal webhook handler
- [ ] Verify webhook signature
- [ ] Handle payment success events
- [ ] Handle payment failure events
- [ ] Test with PayPal sandbox

### Payment Flow
- [ ] Update checkout page payment redirects
- [ ] Create success page with order confirmation
- [ ] Create cancel page
- [ ] Implement payment verification on return
- [ ] Handle payment retry logic

### Digital Downloads
- [ ] Implement download link generation
- [ ] Create secure download endpoint
- [ ] Fulfill digital products after payment
- [ ] Track download counts
- [ ] Handle download expiration

### Order Management
- [ ] Update order status based on payment events
- [ ] Handle failed payment orders
- [ ] Implement order retry functionality
- [ ] Update inventory for physical products
- [ ] Handle refunds

### Testing & Security
- [ ] Test Stripe test mode
- [ ] Test PayPal sandbox mode
- [ ] Verify webhook signatures
- [ ] Test error scenarios
- [ ] Test concurrent orders
- [ ] Security audit
- [ ] Load testing

---

## Environment Variables Summary

### Required for Stripe
```
STRIPE_SECRET_KEY=sk_test_... or sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_test_... or pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Required for PayPal
```
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_MODE=sandbox or live
PAYPAL_WEBHOOK_ID=...
```

### Already Configured
```
DATABASE_URL=...
NEXTAUTH_URL=...
NEXTAUTH_SECRET=...
```

---

## API Endpoints Summary

### Payment Creation
- `POST /api/payments/stripe` - Create Stripe checkout session
- `POST /api/payments/paypal` - Create PayPal order

### Webhooks
- `POST /api/webhooks/stripe` - Stripe webhook handler
- `POST /api/webhooks/paypal` - PayPal webhook handler

### Order Management
- `POST /api/checkout` - Create order (already implemented)
- `GET /api/orders/[id]` - Get order details
- `POST /api/orders/[id]/retry` - Retry failed payment

### Downloads
- `GET /api/downloads/[id]` - Download digital product

---

## Testing Guide

### Stripe Testing
1. Use Stripe test cards: https://stripe.com/docs/testing
2. Test successful payment: `4242 4242 4242 4242`
3. Test declined card: `4000 0000 0000 0002`
4. Use Stripe CLI for local webhook testing: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

### PayPal Testing
1. Use PayPal sandbox accounts
2. Test successful payment flow
3. Test cancellation flow
4. Use PayPal webhook simulator for testing

### Integration Testing
1. Complete checkout with Stripe
2. Complete checkout with PayPal
3. Verify order status updates
4. Verify digital downloads are fulfilled
5. Test webhook delivery and processing

---

## Deployment Checklist

### Pre-Production
- [ ] Switch to production API keys (Stripe/PayPal)
- [ ] Configure production webhook URLs
- [ ] Test all payment flows in production mode
- [ ] Set up monitoring/alerting for failed payments
- [ ] Configure backup webhook endpoints
- [ ] Document payment flow for support team

### Production
- [ ] Update environment variables in AWS Amplify
- [ ] Configure webhook endpoints in Stripe/PayPal dashboards
- [ ] Test production payment flow
- [ ] Monitor initial transactions
- [ ] Set up payment failure alerts

---

## Estimated Implementation Time

- Stripe Integration: 4-6 hours
- PayPal Integration: 4-6 hours
- Payment Flow Updates: 2-3 hours
- Digital Downloads: 2-3 hours
- Testing & Debugging: 3-4 hours
- **Total: 15-22 hours**

---

## Next Steps After Phase 10

- Phase 11: Email Notifications (order confirmations, shipping updates)
- Phase 12: Shipping Integration (tracking, labels)
- Phase 13: Analytics & Reporting
- Phase 14: Customer Accounts & Order History

---

## Notes

- Start with Stripe (simpler integration)
- Test thoroughly in sandbox/test mode before production
- Webhook signature verification is critical for security
- Consider implementing payment retry logic for better UX
- Digital downloads should be fulfilled immediately after payment
- Keep detailed logs of all payment events for debugging


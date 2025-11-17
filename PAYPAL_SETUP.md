# PayPal Integration Setup Guide

## Overview
PayPal payment integration has been implemented for Claim Records. This guide covers setup and testing.

## Implementation Status

### ✅ Completed
- PayPal SDK installed (`@paypal/checkout-server-sdk`)
- PayPal client utility (`lib/paypal/client.ts`)
- PayPal order creation endpoint (`/api/payments/paypal`)
- PayPal payment capture endpoint (`/api/payments/paypal/capture`)
- Checkout page updated to redirect to PayPal
- Success page updated to handle PayPal return and capture payment
- Cancel page exists for cancelled payments

### ⏳ Pending
- PayPal webhook handler (for payment status updates)
- Digital download fulfillment after payment
- Email notifications

## Setup Instructions

### 1. Get PayPal API Credentials

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Log in with your PayPal account
3. Navigate to **Dashboard** → **My Apps & Credentials**
4. Create a new app or use an existing one
5. Copy the following credentials:
   - **Client ID**
   - **Client Secret**

### 2. Configure Environment Variables

Add these to your `.env.local` file (for local development):

```env
PAYPAL_CLIENT_ID=your_client_id_here
PAYPAL_CLIENT_SECRET=your_client_secret_here
PAYPAL_MODE=sandbox
```

For production, add these to AWS Amplify environment variables:
- `PAYPAL_CLIENT_ID` = Your production client ID
- `PAYPAL_CLIENT_SECRET` = Your production client secret
- `PAYPAL_MODE` = `live`

### 3. Configure PayPal Webhook (Optional - for production)

1. In PayPal Developer Dashboard, go to your app
2. Navigate to **Webhooks** section
3. Add webhook URL: `https://your-domain.com/api/webhooks/paypal`
4. Subscribe to these events:
   - `PAYMENT.CAPTURE.COMPLETED`
   - `PAYMENT.CAPTURE.DENIED`
   - `PAYMENT.CAPTURE.REFUNDED`
5. Copy the **Webhook ID** and add to environment variables:
   ```env
   PAYPAL_WEBHOOK_ID=your_webhook_id_here
   ```

## Testing

### Sandbox Testing

1. Use PayPal sandbox test accounts:
   - Go to PayPal Developer Dashboard → **Sandbox** → **Accounts**
   - Use the default business account or create test accounts
   - Test buyer account credentials are available in the dashboard

2. Test Payment Flow:
   - Add items to cart
   - Go to checkout
   - Select PayPal as payment method
   - Complete checkout form
   - Click "Complete Order"
   - You'll be redirected to PayPal sandbox
   - Log in with test buyer account
   - Approve payment
   - You'll be redirected back to success page
   - Payment should be captured automatically

### Test Scenarios

1. **Successful Payment**
   - Complete checkout with PayPal
   - Approve payment on PayPal
   - Verify order status updates to "paid"
   - Verify order appears in admin dashboard

2. **Cancelled Payment**
   - Complete checkout with PayPal
   - Click "Cancel" on PayPal page
   - Verify redirect to cancel page
   - Verify order remains in "pending" status

3. **Failed Payment**
   - Use PayPal test account with insufficient funds
   - Attempt payment
   - Verify error handling

## Payment Flow

1. **Order Creation**
   - User fills checkout form
   - Order is created in database with `payment_status = 'pending'`
   - Order is created with `payment_method = 'paypal'`

2. **PayPal Order Creation**
   - Frontend calls `/api/payments/paypal` with order ID
   - Backend creates PayPal order via PayPal API
   - PayPal order ID is stored in `orders.paypal_order_id`
   - Approval URL is returned to frontend

3. **User Redirect**
   - User is redirected to PayPal approval URL
   - User approves payment on PayPal
   - PayPal redirects back to `/checkout/success?order=ORDER_NUMBER&token=TOKEN`

4. **Payment Capture**
   - Success page detects PayPal return (has `token` parameter)
   - Frontend calls `/api/payments/paypal/capture` with order ID and PayPal order ID
   - Backend captures payment via PayPal API
   - Order status is updated to `payment_status = 'paid'`
   - Order status is updated to `order_status = 'processing'`

## API Endpoints

### POST `/api/payments/paypal`
Creates a PayPal order for an existing order.

**Request:**
```json
{
  "order_id": "uuid",
  "return_url": "https://your-domain.com/checkout/success?order=ORDER_NUMBER",
  "cancel_url": "https://your-domain.com/checkout/cancel?order=ORDER_NUMBER"
}
```

**Response:**
```json
{
  "order_id": "uuid",
  "paypal_order_id": "PAYPAL_ORDER_ID",
  "approval_url": "https://www.sandbox.paypal.com/checkoutnow?token=...",
  "status": "CREATED"
}
```

### POST `/api/payments/paypal/capture`
Captures a PayPal payment after user approval.

**Request:**
```json
{
  "order_id": "uuid",
  "paypal_order_id": "PAYPAL_ORDER_ID"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment captured successfully",
  "order_id": "uuid",
  "paypal_order_id": "PAYPAL_ORDER_ID",
  "capture_id": "CAPTURE_ID"
}
```

## Troubleshooting

### Common Issues

1. **"PayPal credentials not configured"**
   - Check that `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET` are set
   - Verify environment variables are loaded correctly

2. **"Failed to create PayPal order"**
   - Check PayPal API credentials
   - Verify `PAYPAL_MODE` is set correctly (sandbox/live)
   - Check PayPal developer dashboard for API status

3. **"Payment capture not completed"**
   - Verify PayPal order was approved by user
   - Check PayPal order status in PayPal dashboard
   - Review server logs for detailed error messages

4. **Order not updating after payment**
   - Check database connection
   - Verify order ID matches between PayPal and database
   - Check payment capture endpoint logs

## Next Steps

1. **Webhook Implementation** (Recommended)
   - Implement `/api/webhooks/paypal` endpoint
   - Handle payment status updates from PayPal
   - Provides backup payment confirmation if user doesn't return to site

2. **Digital Downloads**
   - Fulfill digital products after payment capture
   - Generate download links
   - Send download emails

3. **Email Notifications**
   - Send order confirmation emails
   - Send payment receipt emails
   - Send download links for digital products

4. **Error Handling**
   - Add retry logic for failed payments
   - Handle network timeouts
   - Add payment status polling for pending payments

## Production Checklist

- [ ] Switch to production PayPal credentials
- [ ] Set `PAYPAL_MODE=live` in production environment
- [ ] Configure production webhook URL in PayPal dashboard
- [ ] Test complete payment flow in production mode
- [ ] Set up monitoring for failed payments
- [ ] Configure payment failure alerts
- [ ] Test refund process
- [ ] Document support procedures for payment issues

## Support Resources

- [PayPal Developer Documentation](https://developer.paypal.com/docs/)
- [PayPal Orders API Reference](https://developer.paypal.com/docs/api/orders/v2/)
- [PayPal Webhooks Guide](https://developer.paypal.com/docs/api-basics/notifications/webhooks/)


# Stripe Environment Variables

## Test Mode (Development)

```env
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

### Test Mode Credentials
- **Publishable Key:** `pk_test_...` (starts with `pk_test_`)
- **Secret Key:** `sk_test_...` (starts with `sk_test_`)
- **Webhook Secret:** `whsec_...` (from Stripe Dashboard → Developers → Webhooks)

---

## Live Mode (Production)

```env
STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

### Live Mode Credentials
- **Publishable Key:** `pk_live_...` (starts with `pk_live_`)
- **Secret Key:** `sk_live_...` (starts with `sk_live_`)
- **Webhook Secret:** `whsec_...` (from Stripe Dashboard → Developers → Webhooks)

---

## Where to Find These Values

1. **Stripe Dashboard:** https://dashboard.stripe.com/
2. Navigate to: **Developers** → **API keys**
3. Copy the **Publishable key** and **Secret key**
4. For Webhook Secret:
   - Go to **Developers** → **Webhooks**
   - Click on your webhook endpoint (or create one)
   - Copy the **Signing secret** (`whsec_...`)

---

## How to Add to Your Project

### Local Development (`.env.local`)
Create or update `.env.local` file in the project root:

```env
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### Production (AWS Amplify)
1. Go to AWS Amplify Console
2. Select your app
3. Navigate to **App settings** → **Environment variables**
4. Add each variable:
   - `STRIPE_PUBLISHABLE_KEY` = Your publishable key
   - `STRIPE_SECRET_KEY` = Your secret key
   - `STRIPE_WEBHOOK_SECRET` = Your webhook signing secret

---

## Webhook Setup

### Webhook URL
```
https://your-domain.com/api/webhooks/stripe
```

### Required Events
- `checkout.session.completed` - When a checkout session is completed
- `payment_intent.succeeded` - When a payment succeeds
- `payment_intent.payment_failed` - When a payment fails

### Testing Webhooks Locally
Use Stripe CLI to forward webhooks to your local server:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## Security Notes

⚠️ **IMPORTANT:**
- Never commit `.env.local` to git (it's already in `.gitignore`)
- Never share your Secret Key publicly
- Use Test mode credentials for development
- Switch to Live mode credentials only when ready to go live
- Keep webhook secrets secure
- Always verify webhook signatures in production

---

## App Details

### Test Mode App
- **Account:** _________________________________
- **Created:** _________________________________

### Live Mode App
- **Account:** _________________________________
- **Created:** _________________________________

---

## Last Updated
Date: _________________________________


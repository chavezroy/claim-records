import Stripe from 'stripe';

// Log Stripe configuration state
function logStripeConfig() {
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
  const secretKey = process.env.STRIPE_SECRET_KEY;
  
  console.log('[STRIPE] Configuration:', {
    hasPublishableKey: !!publishableKey,
    hasSecretKey: !!secretKey,
    publishableKeyLength: publishableKey ? publishableKey.length : 0,
    secretKeyLength: secretKey ? secretKey.length : 0,
    publishableKeyPrefix: publishableKey ? publishableKey.substring(0, 7) : 'none',
  });
}

// Initialize Stripe client
let stripeClient: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (!stripeClient) {
    logStripeConfig();
    
    const secretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!secretKey) {
      console.error('[STRIPE] Missing credentials:', {
        hasSecretKey: false,
      });
      throw new Error('Stripe credentials not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }
    
    stripeClient = new Stripe(secretKey, {
      apiVersion: '2025-11-17.clover',
      typescript: true,
    });
    
    console.log('[STRIPE] Client initialized successfully');
  }
  
  return stripeClient;
}

// Get Stripe publishable key (for frontend)
export function getPublishableKey(): string {
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
  
  if (!publishableKey) {
    throw new Error('Stripe publishable key not configured. Please set STRIPE_PUBLISHABLE_KEY environment variable.');
  }
  
  return publishableKey;
}


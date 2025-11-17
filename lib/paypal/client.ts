import paypal from '@paypal/checkout-server-sdk';

// Initialize PayPal environment
function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const mode = process.env.PAYPAL_MODE || 'sandbox';

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured. Please set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET environment variables.');
  }

  if (mode === 'live') {
    return new paypal.core.LiveEnvironment(clientId, clientSecret);
  } else {
    return new paypal.core.SandboxEnvironment(clientId, clientSecret);
  }
}

// Create PayPal client
export function client() {
  try {
    return new paypal.core.PayPalHttpClient(environment());
  } catch (error) {
    console.error('Error creating PayPal client:', error);
    throw error;
  }
}

// Get PayPal mode (sandbox or live)
export function getMode() {
  return process.env.PAYPAL_MODE || 'sandbox';
}


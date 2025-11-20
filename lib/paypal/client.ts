import paypal from '@paypal/checkout-server-sdk';

// Log PayPal configuration state
function logPayPalConfig() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const mode = process.env.PAYPAL_MODE || 'sandbox';
  
  console.log('[PAYPAL] Configuration:', {
    hasClientId: !!clientId,
    hasClientSecret: !!clientSecret,
    mode: mode || 'undefined',
    clientIdLength: clientId ? clientId.length : 0,
    clientSecretLength: clientSecret ? clientSecret.length : 0,
  });
}

// Initialize PayPal environment
function environment() {
  logPayPalConfig();
  
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const mode = process.env.PAYPAL_MODE || 'sandbox';

  if (!clientId || !clientSecret) {
    console.error('[PAYPAL] Missing credentials:', {
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
    });
    throw new Error('PayPal credentials not configured. Please set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET environment variables.');
  }

  const env = mode === 'live'
    ? new paypal.core.LiveEnvironment(clientId, clientSecret)
    : new paypal.core.SandboxEnvironment(clientId, clientSecret);
  
  console.log('[PAYPAL] Environment initialized:', { mode });
  return env;
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


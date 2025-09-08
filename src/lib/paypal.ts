import { checkoutNodeJssdk } from '@paypal/checkout-server-sdk';
import { PAYPAL_CONFIG } from './paypal-config';

// PayPal environment configuration
export function getPayPalEnvironment() {
  console.log('Creating PayPal environment with config:', {
    mode: PAYPAL_CONFIG.MODE,
    clientId: PAYPAL_CONFIG.CLIENT_ID ? 'SET' : 'NOT SET',
    clientSecret: PAYPAL_CONFIG.CLIENT_SECRET ? 'SET' : 'NOT SET'
  });

  if (PAYPAL_CONFIG.MODE === 'live') {
    return new checkoutNodeJssdk.core.LiveEnvironment(
      PAYPAL_CONFIG.CLIENT_ID,
      PAYPAL_CONFIG.CLIENT_SECRET
    );
  } else {
    return new checkoutNodeJssdk.core.SandboxEnvironment(
      PAYPAL_CONFIG.CLIENT_ID,
      PAYPAL_CONFIG.CLIENT_SECRET
    );
  }
}

// PayPal client instance
export function getPayPalClient() {
  console.log('Creating PayPal client...');
  try {
    const environment = getPayPalEnvironment();
    const client = new checkoutNodeJssdk.core.PayPalHttpClient(environment);
    console.log('PayPal client created successfully');
    return client;
  } catch (error) {
    console.error('Error creating PayPal client:', error);
    throw error;
  }
}

// Create order request
export function createOrderRequest(orderData: {
  amount: string;
  currency: string;
  description: string;
  customId: string;
  returnUrl: string;
  cancelUrl: string;
}) {
  const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
  request.prefer('return=representation');
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        reference_id: orderData.customId,
        amount: {
          currency_code: orderData.currency,
          value: orderData.amount,
        },
        description: orderData.description,
      },
    ],
    application_context: {
      brand_name: 'Enreached',
      landing_page: 'NO_PREFERENCE',
      user_action: 'PAY_NOW',
      return_url: orderData.returnUrl,
      cancel_url: orderData.cancelUrl,
    },
  });
  return request;
}

// Capture order request
export function createCaptureRequest(orderId: string) {
  const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
  request.prefer('return=representation');
  return request;
}

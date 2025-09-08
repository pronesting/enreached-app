import { checkoutNodeJssdk } from '@paypal/checkout-server-sdk';
import { PAYPAL_CONFIG } from './paypal-config';

// PayPal environment configuration
export function getPayPalEnvironment() {
  console.log('PayPal lib: Creating environment with config:', {
    mode: PAYPAL_CONFIG.MODE,
    clientId: PAYPAL_CONFIG.CLIENT_ID ? `${PAYPAL_CONFIG.CLIENT_ID.substring(0, 10)}...` : 'NOT SET',
    clientSecret: PAYPAL_CONFIG.CLIENT_SECRET ? `${PAYPAL_CONFIG.CLIENT_SECRET.substring(0, 10)}...` : 'NOT SET'
  });
  
  if (PAYPAL_CONFIG.MODE === 'live') {
    console.log('PayPal lib: Creating LiveEnvironment');
    return new checkoutNodeJssdk.core.LiveEnvironment(
      PAYPAL_CONFIG.CLIENT_ID,
      PAYPAL_CONFIG.CLIENT_SECRET
    );
  } else {
    console.log('PayPal lib: Creating SandboxEnvironment');
    return new checkoutNodeJssdk.core.SandboxEnvironment(
      PAYPAL_CONFIG.CLIENT_ID,
      PAYPAL_CONFIG.CLIENT_SECRET
    );
  }
}

// PayPal client instance
export function getPayPalClient() {
  console.log('PayPal lib: Getting PayPal client');
  const environment = getPayPalEnvironment();
  console.log('PayPal lib: Environment created, creating HTTP client');
  const client = new checkoutNodeJssdk.core.PayPalHttpClient(environment);
  console.log('PayPal lib: HTTP client created successfully');
  return client;
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

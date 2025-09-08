import { checkoutNodeJssdk } from '@paypal/checkout-server-sdk';
import { env } from './env';

// PayPal environment configuration
export function getPayPalEnvironment() {
  if (env.PAYPAL_MODE === 'live') {
    return new checkoutNodeJssdk.core.LiveEnvironment(
      env.PAYPAL_CLIENT_ID,
      env.PAYPAL_CLIENT_SECRET
    );
  } else {
    return new checkoutNodeJssdk.core.SandboxEnvironment(
      env.PAYPAL_CLIENT_ID,
      env.PAYPAL_CLIENT_SECRET
    );
  }
}

// PayPal client instance
export function getPayPalClient() {
  const environment = getPayPalEnvironment();
  return new checkoutNodeJssdk.core.PayPalHttpClient(environment);
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

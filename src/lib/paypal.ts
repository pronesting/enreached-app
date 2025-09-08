import { PAYPAL_CONFIG } from './paypal-config';

// PayPal API endpoints
const PAYPAL_API_BASE = PAYPAL_CONFIG.MODE === 'live' 
  ? 'https://api.paypal.com' 
  : 'https://api.sandbox.paypal.com';

// Get PayPal access token
export async function getPayPalAccessToken(): Promise<string> {
  console.log('Getting PayPal access token...');
  console.log('PayPal Config:', {
    mode: PAYPAL_CONFIG.MODE,
    clientId: PAYPAL_CONFIG.CLIENT_ID ? `${PAYPAL_CONFIG.CLIENT_ID.substring(0, 10)}...` : 'NOT SET',
    clientSecret: PAYPAL_CONFIG.CLIENT_SECRET ? `${PAYPAL_CONFIG.CLIENT_SECRET.substring(0, 10)}...` : 'NOT SET',
    apiBase: PAYPAL_API_BASE
  });
  
  const auth = Buffer.from(`${PAYPAL_CONFIG.CLIENT_ID}:${PAYPAL_CONFIG.CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('PayPal Access Token Error:', {
      status: response.status,
      statusText: response.statusText,
      error: error
    });
    throw new Error(`Failed to get PayPal access token: ${error}`);
  }

  const data = await response.json();
  console.log('PayPal access token obtained successfully');
  return data.access_token;
}

// Create PayPal order
export async function createPayPalOrder(orderData: {
  amount: string;
  currency: string;
  description: string;
  customId: string;
  returnUrl: string;
  cancelUrl: string;
}) {
  console.log('Creating PayPal order:', orderData);
  
  const accessToken = await getPayPalAccessToken();
  
  const orderPayload = {
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
      landing_page: 'BILLING',
      user_action: 'PAY_NOW',
      return_url: orderData.returnUrl,
      cancel_url: orderData.cancelUrl,
      payment_method: {
        payer_selected: 'PAYPAL',
        payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED'
      }
    },
    payment_source: {
      paypal: {
        experience_context: {
          payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
          brand_name: 'Enreached',
          locale: 'en-US',
          landing_page: 'BILLING',
          user_action: 'PAY_NOW',
          return_url: orderData.returnUrl,
          cancel_url: orderData.cancelUrl
        }
      }
    }
  };

  console.log('PayPal Order Payload:', JSON.stringify(orderPayload, null, 2));

  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': orderData.customId,
    },
    body: JSON.stringify(orderPayload),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('PayPal API Error Response:', {
      status: response.status,
      statusText: response.statusText,
      error: error
    });
    throw new Error(`Failed to create PayPal order: ${error}`);
  }

  const order = await response.json();
  console.log('PayPal order created successfully:', order.id);
  return order;
}

// Capture PayPal order
export async function capturePayPalOrder(orderId: string) {
  console.log('Capturing PayPal order:', orderId);
  
  const accessToken = await getPayPalAccessToken();
  
  const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to capture PayPal order: ${error}`);
  }

  const capture = await response.json();
  console.log('PayPal order captured successfully');
  return capture;
}

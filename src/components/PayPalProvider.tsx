'use client';

import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { PAYPAL_CONFIG } from '@/lib/paypal-config';

interface PayPalProviderProps {
  children: React.ReactNode;
}

export function PayPalProvider({ children }: PayPalProviderProps) {
  console.log('PayPal Config:', PAYPAL_CONFIG);
  console.log('PayPal Client ID length:', PAYPAL_CONFIG.CLIENT_ID?.length);
  console.log('PayPal Client ID empty check:', !PAYPAL_CONFIG.CLIENT_ID || PAYPAL_CONFIG.CLIENT_ID === '');

  // Only load PayPal if we have a valid client ID
  if (!PAYPAL_CONFIG.CLIENT_ID || PAYPAL_CONFIG.CLIENT_ID === '') {
    console.warn('PayPal Client ID not configured. Please update paypal-config.ts with your actual client ID.');
    return <>{children}</>;
  }

  console.log('PayPal SDK will be loaded with client ID:', PAYPAL_CONFIG.CLIENT_ID);

  const paypalOptions = {
    clientId: PAYPAL_CONFIG.CLIENT_ID,
    currency: 'USD',
    intent: 'capture',
    components: 'buttons',
  };

  const onError = (error: any) => {
    console.error('PayPal SDK Error:', error);
  };

  return (
    <PayPalScriptProvider options={paypalOptions} onError={onError}>
      {children}
    </PayPalScriptProvider>
  );
}

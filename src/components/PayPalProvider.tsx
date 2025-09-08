'use client';

import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { PAYPAL_CONFIG } from '@/lib/paypal-config';

interface PayPalProviderProps {
  children: React.ReactNode;
}

// Move options outside component to prevent re-creation
const paypalOptions = {
  clientId: PAYPAL_CONFIG.CLIENT_ID,
  currency: 'USD',
  intent: 'capture',
  components: 'buttons',
};

export function PayPalProvider({ children }: PayPalProviderProps) {
  console.log('PayPalProvider rendered with client ID:', PAYPAL_CONFIG.CLIENT_ID);

  // Only load PayPal if we have a valid client ID
  if (!PAYPAL_CONFIG.CLIENT_ID || PAYPAL_CONFIG.CLIENT_ID === '') {
    console.warn('PayPal Client ID not configured. Please update paypal-config.ts with your actual client ID.');
    return <>{children}</>;
  }

  const onError = (error: any) => {
    console.error('PayPal SDK Error:', error);
  };

  console.log('PayPalProvider: Rendering PayPalScriptProvider');
  return (
    <PayPalScriptProvider options={paypalOptions} onError={onError}>
      {children}
    </PayPalScriptProvider>
  );
}

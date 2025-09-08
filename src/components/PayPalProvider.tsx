'use client';

import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { env } from '@/lib/env';

interface PayPalProviderProps {
  children: React.ReactNode;
}

export function PayPalProvider({ children }: PayPalProviderProps) {
  // Only load PayPal if we have a valid client ID
  if (!env.PAYPAL_CLIENT_ID || env.PAYPAL_CLIENT_ID === '') {
    console.warn('PayPal Client ID not configured. PayPal features will be disabled.');
    return <>{children}</>;
  }

  const paypalOptions = {
    clientId: env.PAYPAL_CLIENT_ID,
    currency: 'USD',
    intent: 'capture',
    components: 'buttons',
  };

  return (
    <PayPalScriptProvider options={paypalOptions}>
      {children}
    </PayPalScriptProvider>
  );
}

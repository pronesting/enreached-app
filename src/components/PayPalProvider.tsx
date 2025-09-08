'use client';

import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { env } from '@/lib/env';

const paypalOptions = {
  clientId: env.PAYPAL_CLIENT_ID,
  currency: 'USD',
  intent: 'capture',
  components: 'buttons',
};

interface PayPalProviderProps {
  children: React.ReactNode;
}

export function PayPalProvider({ children }: PayPalProviderProps) {
  return (
    <PayPalScriptProvider options={paypalOptions}>
      {children}
    </PayPalScriptProvider>
  );
}

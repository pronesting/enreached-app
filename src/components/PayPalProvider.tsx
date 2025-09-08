'use client';

import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { PAYPAL_CONFIG } from '@/lib/paypal-config';
import { useMemo } from 'react';

interface PayPalProviderProps {
  children: React.ReactNode;
}

export function PayPalProvider({ children }: PayPalProviderProps) {
  // Only load PayPal if we have a valid client ID
  if (!PAYPAL_CONFIG.CLIENT_ID || PAYPAL_CONFIG.CLIENT_ID === '') {
    console.warn('PayPal Client ID not configured. Please update paypal-config.ts with your actual client ID.');
    return <>{children}</>;
  }

  const paypalOptions = useMemo(() => ({
    clientId: PAYPAL_CONFIG.CLIENT_ID,
    currency: 'USD',
    intent: 'capture',
    components: 'buttons',
  }), []);

  const onError = useMemo(() => (error: any) => {
    console.error('PayPal SDK Error:', error);
  }, []);

  return (
    <PayPalScriptProvider options={paypalOptions} onError={onError}>
      {children}
    </PayPalScriptProvider>
  );
}
